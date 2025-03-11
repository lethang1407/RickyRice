import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  Pagination,
  Select,
  FloatButton
} from 'antd';
import { HomeFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import API from '../../Utils/API/API.js'
import './style.css';
import banner from '../../assets/img/rice_banner.jpg'
import TiltedCard from '../TitleCard/titlecard.js';

const StoreHomeBody = ({ products: initialProducts, categories: initialCategories }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    fetchProducts(query, currentPage, sortBy, orderBy, minPrice, maxPrice);
  }, []);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const fetchProducts = async (query = "", page = 1, sortBy = "price", orderBy = "false", minPrice = 0, maxPrice = 1000000, categoryID = "") => {
    try {
      let url = `${API.CUSTOMER.GET_ALL_PRODUCT}?page=${page - 1}&size=${pageSize}&sortBy=${sortBy}&descending=${orderBy}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      if (query) {
        url += `&query=${encodeURIComponent(query)}`;
      } if (categoryID) {
        url += `&categoryID=${categoryID}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.content);
        const calculatedTotalPages = Math.ceil((data.content.length + 1) / pageSize);
        setTotalPages(calculatedTotalPages);
        setCurrentPage(data.number + 1);
        navigate(`?query=${encodeURIComponent(query)}&page=${page}&sortBy=${sortBy}&descending=${orderBy}&minPrice=${minPrice}&maxPrice=${maxPrice}&categoryID=${categoryID}`);
        scrollToTop();
      } else {
        console.error("Error fetching products!", response.status);
      }

    } catch (error) {
      console.error("Error fetching products!", error);
    }
  };

  const animationDuration = 5;

  const sortOptions = [
    { label: "Theo tên sản phẩm, A-Z", value: "name_false" },
    { label: "Theo tên sản phẩm, Z-A", value: "name_true" },
    { label: "Theo giá: thấp đến cao", value: "price_false" },
    { label: "Theo giá: cao đến thấp", value: "price_true" },
  ];

  const handleSortChange = (value) => {
    const [sort, order] = value.split("_");
    setSortBy(sort);
    setOrderBy(order);
    fetchProducts(query, 1, sort, order, minPrice, maxPrice);
  };

  const handleFilterCategoryChange = (value) => {
    fetchProducts(query, 1, sortBy, orderBy, minPrice, maxPrice, value);
  };

  return (
    <>
      <div className="banner">
        <img src={banner} alt="Rice Banner" />
      </div>
      <div className="home">
        <HomeFilled/> <a href="http://localhost:3000/">Home</a> <span> &gt; </span> Shop
      </div>
      <div className="container-all">
        <div className="div1">
          <div className="search" style={{ borderBottom: '2px solid #e1e1e1' }}>
            <Input.Search
              size="large"
              placeholder="Nhập từ khóa"
              enterButton value={query}
              onChange={(e) => {
                if (e.target.value === "") {
                  fetchProducts("", 1, sortBy, orderBy, minPrice, maxPrice);
                }
                setQuery(e.target.value);
                fetchProducts(e.target.value, 1, sortBy, orderBy, minPrice, maxPrice);
              }}
              className="search-icon"
              style={{ marginBottom: '50px' }}
            />
          </div>
          <div className="filters">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', marginTop: '50px', borderBottom: '2px solid #e1e1e1' }}>
              <div><big><b>Loại Gạo</b></big></div>
              <div className="categoryFilter">
                <p onClick={() => handleFilterCategoryChange("")}>Tất cả ()</p>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <p key={category.categoryID} onClick={() => handleFilterCategoryChange(category.categoryID)}>
                      {category.name}
                    </p>
                  ))
                ) : (
                  <p>Không có dữ liệu</p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', borderBottom: '2px solid #e1e1e1' }}>
              <div style={{ marginTop: '50px' }}><big><b>Sắp Xếp Theo</b></big></div>
              <div className="sortBy">
                {sortOptions.map((option) => (
                  <p onClick={() => handleSortChange(option.value)}>{option.label}</p>
                ))}
              </div>
            </div>
            <div className="price-range" style={{ marginTop: '50px', borderBottom: '2px solid #e1e1e1' }}>
              <div style={{ marginBottom: '50px' }}><big><b>Giá</b></big></div>
              <div style={{ marginBottom: '10px' }}>
                <Input
                  type="number"
                  placeholder="Giá tối thiểu"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value));
                    fetchProducts(query, 1, sortBy, orderBy, e.target.value, maxPrice);
                  }}
                />
              </div>
              <div style={{ marginBottom: '50px' }}>
                <Input
                  type="number"
                  placeholder="Giá tối đa"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(isNaN(parseInt(e.target.value)) ? 1000000 : parseInt(e.target.value));
                    fetchProducts(query, 1, sortBy, orderBy, minPrice, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="div2 product-all">
          {products.map((product) => (
            <div key={product.productID} className="container-product">
              <TiltedCard
                imageSrc="https://th.bing.com/th/id/OIP.jbXWti_ufkFCWaPna_p79gHaHa?rs=1&pid=ImgDetMain"
                altText={product.name}
                captionText={product.name}
                containerHeight="300px"
                containerWidth="300px"
                imageHeight="300px"
                imageWidth="300px"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <p className="tilted-card-demo-text">

                  </p>
                }
              />
              <div className="sub-product">
                <h5>{product.name}</h5>
                <p><em>Giá: {product.price} VNĐ/kg</em></p>
                <Button
                  type="primary"
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpenResponsive(true);
                  }}>
                  <div
                    className="shiny-text"
                    style={{ animationDuration }}
                  >
                    Xem chi tiết
                  </div>
                </Button>
              </div>
            </div>
          ))}
          <div className="container-pagination">
            <Pagination
              current={currentPage}
              total={totalPages * pageSize}
              pageSize={pageSize}
              onChange={(page) => {
                fetchProducts(query, page, sortBy, orderBy, minPrice, maxPrice)
                scrollToTop();
              }}
              showSizeChanger={false} />
          </div>
        </div>

        {openResponsive && (
          <Modal
            title="Thông tin sản phẩm"
            visible={openResponsive}
            onCancel={() => setOpenResponsive(false)}
            footer={null}
          >
            <img className="img-fluid img-responsive rounded product-image" src="https://th.bing.com/th/id/OIP.jbXWti_ufkFCWaPna_p79gHaHa?rs=1&pid=ImgDetMain"></img>
            <h2>{selectedProduct.name}</h2>
            <p>Mô tả: {selectedProduct.information}</p>
            <i>Số lượng: {selectedProduct.quantity}</i><br/>
            <i>Giá: {selectedProduct.price} VNĐ/kg</i>
          </Modal>
        )}
        <FloatButton.BackTop />
      </div>
    </>

  );
};

export default StoreHomeBody; 