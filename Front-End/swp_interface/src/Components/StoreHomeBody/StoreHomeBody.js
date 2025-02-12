import React, { useState, useEffect } from "react";
import { Button, Input, Table, Modal, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './style.css';

const { Column, ColumnGroup } = Table;

const StoreHomeBody = ({ products: initialProducts }) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openResponsive, setOpenResponsive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Tìm kiếm sản phẩm khi query thay đổi (sử dụng debounce)
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchProducts(0);
    }, 500); // Chờ 500ms sau khi nhập xong mới gọi API

    return () => clearTimeout(delaySearch); // Hủy bỏ nếu user tiếp tục nhập
  }, [query]);

  // Hàm fetch dữ liệu sản phẩm
  const fetchProducts = async (page = 0) => {
    try {
      let url = `http://localhost:9999/store/products?page=${page}&size=5`;

      if (query) {
        url = `http://localhost:9999/store/products?query=${encodeURIComponent(query)}&page=${page}&size=5`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number + 1);
        navigate(`?query=${encodeURIComponent(query)}&page=${page}`);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm!", error);
    }
  };

  return (
    <div className="container-all">
      {/* Ô tìm kiếm */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Tìm kiếm sản phẩm</h2>
        <div className="search flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Nhập từ khóa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <Button>
            <SearchOutlined />
          </Button>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      {products.map((product) => (
        <div key={product.productID} className="container mt-5 mb-5">
          <div className="d-flex justify-content-center row">
            <div className="col-md-10">
              <div className="row p-2 bg-white border rounded mt-2">
                <div className="col-md-3 mt-1">
                  <img className="img-fluid img-responsive rounded product-image" 
                       src="https://th.bing.com/th/id/OIP.jbXWti_ufkFCWaPna_p79gHaHa?rs=1&pid=ImgDetMain" 
                       alt={product.name} />
                </div>
                <div className="col-md-6 mt-1">
                  <h5>{product.name}</h5>
                </div>
                <div className="col-md-3 border-left mt-1">
                  <h4>{product.price} VNĐ/kg</h4>
                  <Button type="primary" onClick={() => {
                    setSelectedProduct(product);
                    setOpenResponsive(true);
                  }}>
                    Thông tin
                  </Button>

                  {/* Modal hiển thị thông tin chi tiết */}
                  <Modal
                    title="Thông tin chi tiết"
                    centered
                    open={openResponsive}
                    onOk={() => setOpenResponsive(false)}
                    onCancel={() => setOpenResponsive(false)}
                    width={600}
                  >
                    <Table
                      columns={[
                        { title: 'Tên', dataIndex: 'name', width: 150 },
                        { title: 'Thông tin thêm', dataIndex: 'information', width: 150 },
                        { title: 'Mô tả', dataIndex: 'productAttributes' }
                      ]}
                      dataSource={selectedProduct ? [{
                        key: selectedProduct.productID,
                        name: selectedProduct.name,
                        information: selectedProduct.information,
                        productAttributes: selectedProduct.productAttributes
                          ? selectedProduct.productAttributes.map(attr => attr.value).join(", ")
                          : "Không có",
                      }] : []}
                      pagination={false}
                    />
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Phân trang */}
      <Pagination
        current={currentPage}
        total={totalPages * 5}
        pageSize={5}
        onChange={(page) => fetchProducts(page - 1)}
        showSizeChanger={false}
      />
    </div>
  );
};

export default StoreHomeBody;
