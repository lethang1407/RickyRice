import React, { useEffect, useState } from 'react';
import { Table, message, Input, Form, Select, Row, Col, Button, InputNumber } from 'antd';
import qs from 'qs';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import ProductDetailModal from '../../../Components/StoreOwner/ProductDetailModal/ProductDetailModal';
import './style.scss';
import { useLocation } from 'react-router-dom';

const { Option } = Select;

const Product = () => {
    const [form] = Form.useForm();
    const token = getToken();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        },
        sortField: null,
        sortOrder: null,
    });
    const [filters, setFilters] = useState({
        productID: '',
        name: '',
        priceMin: null,
        priceMax: null,
        categoryName: '',
        store: [],
        quantityMin: null,
        quantityMax: null
    });
    const [stores, setStores] = useState([]);
    const [fetchingStores, setFetchingStores] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductID, setSelectedProductID] = useState(null);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const location = useLocation();

    const columns = [
        {
            title: 'STT',
            key: 'id',
            render: (_, __, index) => {
                const id =
                    (tableParams.pagination.current - 1) * tableParams.pagination.pageSize +
                    index + 1;
                return id;
            },
            width: '6%',
            align: 'center'
        },
        {
            title: 'Mã Sản Phẩm',
            dataIndex: 'productID',
            key: 'productID',
            width: '10%',
            align: 'center'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            render: (price) => `${price.toLocaleString()}`,
            width: '10%',
            align: 'center'
        },
        {
            title: 'Thông Tin',
            dataIndex: 'information',
            key: 'information',
            ellipsis: true,
            width: '30%',
        },
        {
            title: 'Danh Mục',
            dataIndex: ['category', 'name'],
            key: 'categoryName',
            width: '15%',
            align: 'center'
        },
        {
            title: 'Cửa Hàng',
            dataIndex: ['store', 'name'],
            key: 'storeName',
            width: '15%',
            align: 'center'
        },
        {
            title: 'Số Lượng (KG)',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
            render: (quantity) => `${quantity.toLocaleString()}`,
            width: '12%',
            align: 'center'
        },
    ];

    useEffect(() => {
        if (location.state?.fromUpdate) {
          setTableParams((prev) => ({
              ...prev,
              pagination: { ...prev.pagination, current: 1 },
          }));
          window.scrollTo(0, 0);
          window.history.replaceState({}, document.title) 
      }
    }, [location]);

    useEffect(() => {
        const fetchStores = async () => {
            setFetchingStores(true);
            try {
                const response = await getDataWithToken(API.STORE_OWNER.GET_ALL_STORES, token);
                if (Array.isArray(response)) {
                    const cleanedStores = response
                        .filter(store => store.id != null)
                        .map((store) => ({
                            ...store,
                            storeID: store.id,
                        }));
                    setStores(cleanedStores);
                } else {
                    message.error('Lỗi định dạng dữ liệu cửa hàng');
                    setStores([]);
                }
            } catch (error) {
                message.error('Không thể tải dữ liệu cửa hàng.');
                setStores([]);
            } finally {
                setFetchingStores(false);
            }
        };
        fetchStores();
    }, [token]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const queryParams = qs.stringify(
                {
                    productID: filters.productID,
                    name: filters.name,
                    priceMin: filters.priceMin,
                    priceMax: filters.priceMax,
                    categoryName: filters.categoryName,
                    store: filters.store,
                    quantityMin: filters.quantityMin,
                    quantityMax: filters.quantityMax,
                    page: tableParams.pagination.current - 1,
                    size: tableParams.pagination.pageSize,
                    sortBy: tableParams.sortField || 'createdAt',
                    descending: tableParams.sortOrder === 'descend',
                },
                { arrayFormat: 'repeat', encode: true }
            );
            const response = await getDataWithToken(`${API.STORE_OWNER.GET_STORE_PRODUCTS}?${queryParams}`, token);
            if (Array.isArray(response.content)) {
              setData(response.content);
            } else {
              message.error('Lỗi định dạng dữ liệu sản phẩm');
              setData([]);
            }

            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: response.totalElements,
                },
            }));
        } catch (error) {
            message.error('Không thể tải dữ liệu danh sách sản phẩm');
            setData([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      fetchProduct();
    }, [
        tableParams.pagination.current,
        tableParams.pagination.pageSize,
        tableParams.sortField,
        tableParams.sortOrder,
        filters.productID,
        filters.name,
        filters.categoryName,
        filters.priceMin,
        filters.priceMax,
        filters.quantityMin,
        filters.quantityMax,
        JSON.stringify(filters.store) 
    ]);

    const handleTableChange = (pagination, _, sorter) => {
        setTableParams({
            pagination,
            sortField: sorter?.field || null,
            sortOrder: sorter?.order || null,
        });
    };

    const handleInputChange = (changedValues, allValues) => {
        if (changedValues.hasOwnProperty('productID') || changedValues.hasOwnProperty('name') || changedValues.hasOwnProperty('categoryName') || changedValues.hasOwnProperty('priceMin')  || changedValues.hasOwnProperty('priceMax') || changedValues.hasOwnProperty('quantityMin') || changedValues.hasOwnProperty('quantityMax')) {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            setSearchTimeout(
                setTimeout(() => {
                    handleSearch();
                }, 1000)
            );
        }  else {
          handleSearch(); 
        }
        form.setFieldsValue(allValues);
    };

    const handleSearch = () => {
        const values = form.getFieldsValue();
        setFilters({
            productID: values.productID || '',
            name: values.name || '',
            priceMin: values.priceMin || null,
            priceMax: values.priceMax || null,
            categoryName: values.categoryName || '',
            store: values.store || [],
            quantityMin: values.quantityMin || null,
            quantityMax: values.quantityMax || null
        });
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const handleReset = () => {
        form.resetFields();
        setFilters({
            productID: '',
            name: '',
            priceMin: null,
            priceMax: null,
            categoryName: '',
            store: [],
            quantityMin: null,
            quantityMax: null
        });
        setTableParams((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };


    const onRowClick = (record) => {
        setSelectedProductID(record.productID);
        setSelectedProductDetails(record); 
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProductID(null);
        setSelectedProductDetails(null); 
    };

    const handleProductDeleted = () => {
        fetchProduct();
    };


    const handleStoreChange = (value) => {
        setFilters(prevFilters => ({
          ...prevFilters,
          store: value
        }));
        form.setFieldsValue({ store: value }); 
    };


    return (
        <div className="product-list-container">
            <Form
                form={form}
                layout="vertical"
                className="filter-form"
                onValuesChange={handleInputChange}
            >
                <Row gutter={16} className="filter-form-row">
                    <Col span={3} className="filter-form-col">
                        <Form.Item label="Mã Sản Phẩm" name="productID">
                            <Input placeholder="Nhập mã sản phẩm" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={3} className="filter-form-col">
                        <Form.Item label="Tên" name="name">
                            <Input placeholder="Nhập tên" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={3} className="filter-form-col">
                        <Form.Item label="Giá Tối Thiểu" name="priceMin">
                            <InputNumber
                                placeholder="Tối thiểu"
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                step={1000}
                                className="filter-form-input-number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3} className="filter-form-col">
                        <Form.Item label="Giá Tối Đa" name="priceMax">
                            <InputNumber
                                placeholder="Tối đa"
                                style={{ width: '100%' }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                step={1000}
                                className="filter-form-input-number"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3} className="filter-form-col">
                        <Form.Item label="Danh Mục" name="categoryName">
                            <Input placeholder="Nhập danh mục" className="filter-form-input" />
                        </Form.Item>
                    </Col>
                    <Col span={3} className="filter-form-col">
                        <Form.Item label="Cửa Hàng" name="store">
                            <Select
                                mode="multiple"
                                placeholder="Chọn cửa hàng"
                                allowClear
                                loading={fetchingStores}
                                onChange={handleStoreChange}
                                className="filter-form-select"
                            >
                                {stores.map((store) => (
                                    <Option key={store.storeID} value={store.storeID}>
                                        {store.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={3} className="filter-form-col">
                        <Form.Item label="Số Lượng" name="quantityMin">
                            <InputNumber
                                placeholder="Tối thiểu"
                                style={{ width: '100%' }}
                                min={0}
                                className="filter-form-input-number"
                                step={10}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3} className="filter-form-col">
                        <Form.Item label="Số Lượng" name="quantityMax">
                            <InputNumber
                                placeholder="Tối đa"
                                style={{ width: '100%' }}
                                min={0}
                                className="filter-form-input-number"
                                step={10}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="filter-form-row">
                    <Col span={24} className="filter-form-col" style={{ textAlign: 'right', marginTop: '8px' }}>
                        <Button onClick={handleReset} className="filter-form-reset-button">
                            Làm Mới
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table
                className="product-table"
                columns={columns}
                rowKey="productID"
                dataSource={data}
                pagination={{
                    ...tableParams.pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                loading={loading}
                onChange={handleTableChange}
                onRow={(record) => ({
                    onClick: () => onRowClick(record),
                    style: { cursor: 'pointer' },
                })}
            />
            {isModalOpen && (
                <ProductDetailModal
                    visible={isModalOpen}
                    productID={selectedProductID}
                    productDetails={selectedProductDetails}
                    onClose={closeModal}
                    onProductDeleted={handleProductDeleted}
                />
            )}
        </div>
    );
};

export default Product;