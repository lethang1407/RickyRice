import React, { useState, useEffect } from "react";
import { Button, Input, Table, Modal, Pagination, Flex, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './style.css';

const StoreHomeBody = ({ products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [query, setQuery] = useState("");
  const [openResponsive, setOpenResponsive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [sortBy, setSortBy] = useState("price");
  const [orderBy, setOrderBy] = useState("false");

  const { Option } = Select;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const queryParam = searchParams.get("query") || "";
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const sortByParam = searchParams.get("sortBy") || "price";
    const orderParam = searchParams.get("orderBy") || "false";
    const minPriceParam = parseInt(searchParams.get("minPrice")) || 0;
    const maxPriceParam = parseInt(searchParams.get("maxPrice")) || 1000000;

    setQuery(queryParam);
    setCurrentPage(pageParam);
    setSortBy(sortByParam);
    setOrderBy(orderParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);

    fetchProducts(queryParam, pageParam, sortByParam, orderParam, minPriceParam, maxPriceParam);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts(query, currentPage, sortBy, orderBy, minPrice, maxPrice);
  }, [query, currentPage, sortBy, orderBy, minPrice, maxPrice]);

  const fetchProducts = async (query = "", page = 1, sortBy = "price", orderBy = "false", minPrice = 0, maxPrice = 1000000) => {
    try {
      let url = `http://localhost:9999/store/products?page=${page - 1}&size=${pageSize}&sortBy=${sortBy}&orderBy=${orderBy}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      console.log("Fetching URL:", url);
      if (query) {
        url += `&query=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number + 1);

        navigate(`?query=${encodeURIComponent(query)}&page=${page}&sortBy=${sortBy}&orderBy=${orderBy}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
        scrollToTop();
      } else {
        console.error("Error fetching products!", response.status);
      }
    } catch (error) {
      console.error("Error fetching products!", error);
    }};

    return (
      <div className="container-all">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Tìm kiếm sản phẩm</h2>
          <div className="search flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Nhập từ khóa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProducts(query, 1, sortBy, orderBy, minPrice, maxPrice)}
              className="border p-2 rounded w-full"
            />
            <Button onClick={() => fetchProducts(query, 1, sortBy, orderBy, minPrice, maxPrice)}>
              <SearchOutlined />
            </Button>
          </div>
  
          <div className="filters flex gap-4 mb-4">
            <table>
              <tbody>
                <tr>
                  <td>Xếp theo: </td>
                  <td>
                    <Select
                      value={sortBy}
                      onChange={(value) => {
                        setSortBy(value);
                        setTimeout(() => {
                          fetchProducts(query, 1, value, orderBy, minPrice, maxPrice);
                        }, 100);
                      }}
                      className="w-1/3">
                      <Option value="price">Giá</Option>
                      <Option value="name">Tên Sản Phẩm</Option>
                    </Select>
                  </td>
                </tr>
                <tr>
                  <td>
                    Sắp xếp:
                  </td>
                  <td>
                    <Select
                      value={orderBy}
                      onChange={(value) => {
                        setOrderBy(value);
                        setTimeout(() => {
                          fetchProducts(query, 1, value, orderBy, minPrice, maxPrice);
                        }, 1000);
                      }}
                      className="w-1/3">
                      <Option value="false">Tăng Dần</Option>
                      <Option value="true">Giảm Dần</Option>
                    </Select>
                    
                  </td>
                </tr>
              </tbody>
            </table>
  
            <div className="price-range flex gap-2">
              <div>
                Từ
                <Input
                  type="number"
                  placeholder="Giá tối thiểu"
                  value={minPrice}
                  onChange={(e) => setMinPrice(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))}
                />
              </div>
              <div>
                Đến
                <Input
                  type="number"
                  placeholder="Giá tối đa"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(isNaN(parseInt(e.target.value)) ? 1000000 : parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
  
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
                  <Flex vertical gap="middle" align="flex-start">
                    <Button type="primary" className="btn-open" onClick={() => {
                      setSelectedProduct(product);
                      setOpenResponsive(true);
                    }}>
                      Thông tin
                    </Button>
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Pagination current={currentPage} total={totalPages * pageSize} pageSize={pageSize} onChange={(page) => fetchProducts(query, page, sortBy, orderBy, minPrice, maxPrice)} showSizeChanger={false} />
    </div>
  );
};

export default StoreHomeBody;