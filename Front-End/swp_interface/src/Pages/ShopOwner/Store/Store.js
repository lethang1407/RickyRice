import React, { useEffect, useState } from "react";
import {
  message,
  Input,
  Spin,
  Pagination,
  Button,
  Row,
  Col,
  Dropdown,
  Menu,
} from "antd";
import StoreCard from "../../../Components/StoreOwner/StoreCard";
import qs from "qs";
import "./style.scss";
import { getToken } from "../../../Utils/UserInfoUtils";
import API from "../../../Utils/API/API";
import { getDataWithToken } from "../../../Utils/FetchUtils";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const Store = () => {
  const token = getToken();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [storeRequests, setStoreRequests] = useState([]);
  const navigate = useNavigate();

  // Quản lý trạng thái phân trang
  const [pagination, setPagination] = useState({
    current: 1, // Trang hiện tại (thường bắt đầu từ 1)
    pageSize: 5, // Số lượng item mỗi trang
    total: 0, // Tổng số item (lấy từ response API)
  });

  const getStoreParams = () => {
    return qs.stringify({
      storeName: searchValue,
      page: pagination.current - 1, // Backend thường nhận page bắt đầu từ 0
      size: pagination.pageSize, // Số item mỗi trang
    });
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const queryParams = `?${getStoreParams()}`;
      const response = await getDataWithToken(
        API.STORE_OWNER.GET_STORE + queryParams,
        token
      );
      // Update data và thông tin pagination
      setData(response.content);
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements, // Tổng số lượng item từ API
      }));
    } catch (error) {
      message.error("Không thể tải dữ liệu danh sách stores");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreRequests = async () => {
    try {
      const response = await getDataWithToken(
        API.STORE_OWNER.GET_REQUEST_STORE,
        token
      );
      if (response.code === 200) {
        setStoreRequests(response.data);
      } else {
        message.error("Không thể tải danh sách cửa hàng mới");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách cửa hàng mới");
    }
  };

  useEffect(() => {
    fetchStores();
    fetchStoreRequests();
  }, [searchValue, pagination.current, pagination.pageSize]);

  const handleSearch = (e) => {
    const value = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setSearchValue(value);

      // Reset về trang đầu tiên khi tìm kiếm
      setPagination((prev) => ({
        ...prev,
        current: 1,
      }));
    }, 1000);

    setTimeoutId(newTimeoutId);
  };

  const handlePaginationChange = (page, pageSize) => {
    // Cập nhật thông tin phân trang (trang hiện tại & số item/trang)
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const storeMenu = (
    <Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
      {storeRequests.length > 0 ? (
        storeRequests.map((store, index) => (
          <Menu.Item
            key={store.transactionNo}
            onClick={() =>
              navigate(`/store-owner/create-store/${store.transactionNo}`)
            }
          >
            Cửa hàng {index + 1} - {store.subcriptionTimeOfExpiration} tháng
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>Không có cửa hàng mới</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div>
      <Row gutter={16} align="middle" justify="space-between">
        <Col>
          <Dropdown overlay={storeMenu} trigger={["click"]}>
            <Button type="primary" style={{ marginBottom: 16, width: "100%" }}>
              Tạo cửa hàng mới ({storeRequests.length})
            </Button>
          </Dropdown>
        </Col>
        <Col flex="auto">
          <Search
            placeholder="Enter Store Name"
            onChange={handleSearch}
            enterButton
            style={{ marginBottom: 16, width: "100%" }}
            loading={loading}
          />
        </Col>
      </Row>
      <Spin spinning={loading}>
        <div className="product-card-container">
          {data &&
            data.map((store) => (
              <StoreCard
                key={store.storeID}
                urlStore={`/store/${store.storeID}/zone`}
                storeName={store.storeName}
                storeStatus={store.status === "ACTIVE" ? "Active" : "Inactive"}
                urlImg={store.imageUrl || "https://via.placeholder.com/150"}
                onUpdateExpiration={() => navigate(`/service/${store.storeID}`)}
              />
            ))}
        </div>
      </Spin>

      {/* Ant Design Pagination */}
      <div className="pagination-container">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePaginationChange}
          showSizeChanger
          pageSizeOptions={["1", "2", "3", "4", "5"]}
        />
      </div>
    </div>
  );
};

export default Store;
