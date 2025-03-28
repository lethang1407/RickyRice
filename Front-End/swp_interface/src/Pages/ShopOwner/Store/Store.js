import React, { useEffect, useState, useCallback } from "react";
import { message, Input, Spin, Pagination, Button, Row, Col, Dropdown, Menu } from "antd";
import StoreCard from "../../../Components/StoreOwner/StoreCard";
import { getToken } from "../../../Utils/UserInfoUtils";
import API from "../../../Utils/API/API";
import { getDataWithToken } from "../../../Utils/FetchUtils";
import { useNavigate } from "react-router-dom";
import './style.scss';

const { Search } = Input;

const Store = () => {
  const token = getToken();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [storeRequests, setStoreRequests] = useState([]);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const storeParams = {
        storeName: searchValue,
        page: pagination.current - 1,
        size: pagination.pageSize,
      };
      const storeResponse = await getDataWithToken(`${API.STORE_OWNER.GET_STORE}?${new URLSearchParams(storeParams)}`, token);
      setStores(storeResponse.content);
      setPagination(prev => ({ ...prev, total: storeResponse.totalElements }));

      const requestResponse = await getDataWithToken(API.STORE_OWNER.GET_REQUEST_STORE, token);
      setStoreRequests(requestResponse.data || []);

    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [searchValue, pagination.current, pagination.pageSize, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback((e) => {
     const value = e.target.value;
    setSearchValue(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const storeMenu = (
    <Menu className="store-menu">
      {storeRequests.length > 0 ? (
        storeRequests.map((store) => (
          <Menu.Item
            key={store.transactionNo}
            onClick={() => navigate(`/store-owner/create-store/${store.transactionNo}`)}
            className="store-menu-item"
          >
             Cửa hàng {store.subcriptionTimeOfExpiration} tháng
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled className="store-menu-item">Không có cửa hàng mới</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="store-page">
      <Row gutter={16} align="middle" justify="space-between" className="store-header">
        <Col>
          <Dropdown overlay={storeMenu} trigger={["click"]}>
            <Button type="primary" className="create-store-button">
              Tạo cửa hàng mới ({storeRequests.length})
            </Button>
          </Dropdown>
        </Col>
        <Col flex="auto">
          <Search
            placeholder="Nhập Tên Cửa Hàng"
            onChange={handleSearch}
            enterButton
            className="store-search"
            loading={loading}
          />
        </Col>
      </Row>
      <Spin spinning={loading}>
        <div className="store-card-container">
          {stores.map((store) => (
            <StoreCard
              key={store.storeID}
              urlStore={`/store/${store.storeID}/zone`}
              storeName={store.storeName}
              expireAt={store.expireAt}
              urlImg={store.imageUrl || "http://res.cloudinary.com/do9tp2bph/image/upload/v1742791281/cfljln3xgjvt82cmu39t.png"}
              onUpdateExpiration={() => navigate(`/service/${store.storeID}`)}
            />
          ))}
        </div>
      </Spin>

      <div className="store-pagination">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePaginationChange}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
        />
      </div>
    </div>
  );
};

export default Store;