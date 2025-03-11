import React, { useState, useEffect } from 'react';
import InvoiceCustomerCreate from './invoiceCustomerCreate';
import { Radio, Tabs, Select, Button, Spin, Table, InputNumber, Input, Layout, Form, Modal, message, notification } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { Content } from 'antd/es/layout/layout';
import TextArea from 'antd/es/input/TextArea';

const InvoiceDetail = () => {
    // của tạo mới Invoice
    const [size, setSize] = useState('small');
    const [activeKey, setActiveKey] = useState('1');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [customerPayment, setCustomerPayment] = useState(0);
    const [totalwithoutdiscount, setTotalWithoutDiscount] = useState(0);
    const [moneyShipping, setMoneyShipping] = useState(0);
    const [packageOptions, setPackageOptions] = useState([]);



    // của thông tin khách hàng 
    const [options2, setOptions2] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [open, setOpen] = useState(false);
    const [externalPhoneNumber, setExternalPhoneNumber] = useState('');
    const [externaName, setExternalName] = useState('');

    //của chỉnh sửa khách hàng 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const token = getToken();

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const openNotificationWithIcon = (type, title, description) => {
        api[type]({
            message: title,
            description: description,
            placement: 'bottomRight',
        });
    };
    const showModal = () => {
        setIsModalVisible(true);
        // form.setFieldsValue({ phoneNumber: currentTab.customerPhone, phoneNumberNew: currentTab.customerPhone });
    };
    const handleOk = () => {
        form.validateFields().then((values) => {
            axios.put(
                API.EMPLOYEE.INVOICE_UPDATE_USER(values.phoneNumber),
                {
                    phoneNumber: values.phoneNumber,
                    phoneNumberNew: values.phoneNumberNew,
                    name: values.name,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then((response) => {
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.key === activeKey
                            ? {
                                ...item,
                                customerPhone: values.phoneNumberNew,
                                customerName: values.name,
                            }
                            : item
                    )
                );
                fetchData2();
                setIsModalVisible(false);
                form.resetFields();
                openNotificationWithIcon('success', 'Thành công', 'Cập Nhật khách hàng thành công!');
            }).catch(() => {
                openNotificationWithIcon('error', 'Thất Bại', 'Số điện thoại đang bị trùng , không gửi dữ liệu được đến backend nha ');
            });
        }).catch(() => {
            openNotificationWithIcon('error', 'Thất Bại', 'Validation Form diii onichan');
        });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };
    const handleCustomerCreated = (phoneNumber, name) => {
        setExternalPhoneNumber(phoneNumber);
        setExternalName(name);
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === activeKey
                    ? { ...item, customerPhone: phoneNumber, customerName: name }
                    : item
            )
        );
        console.log('Số điện thoại từ component con là là là:', phoneNumber);
    };
    const calculateTotalWithoutDiscount = (dataSource) => {
        return dataSource.reduce((sum, item) => {
            return sum + (item.quantity * item.price);
        }, 0);
    };
    const calculateTotalDiscount = (dataSource) => {
        return dataSource.reduce((sum, item) => sum + (item.discount * item.quantity || 0), 0);
    };

    const calculateTotalAmount = (dataSource) => {
        return dataSource.reduce((sum, item) => {
            const itemTotal =
                item.quantity * item.price - (item.discount * item.quantity || 0) + (item.moneyShip * item.quantity || 0);
            return sum + itemTotal;
        }, 0);
    };
    const calculateFinalAmount = () => {
        return totalAmount - discount;
    };

    const calculateChange = () => {
        const finalAmount = calculateFinalAmount();
        return customerPayment - finalAmount >= 0 ? customerPayment - finalAmount : 0;
    };
    const columns = [
        {
            title: 'Lựa chọn',
            key: 'option',
            render: (text, record) => (
                <Button type="link" danger onClick={() => handleDeleteRow(record.key)}>
                    <i class="bi bi-trash"></i>
                </Button>
            ),
        },
        {
            title: 'Mã Sản Phẩm',
            dataIndex: 'productID',
            key: 'productID',

        },
        {
            title: 'Đóng Gói',
            dataIndex: 'packageId',
            key: 'packageId',
            render: (text, record) => (
                <Select
                    style={{ width: 120 }}
                    value={record.packageId}
                    onChange={(value) => handlePackageChange(value, record.key)}
                    options={packageOptions}
                    placeholder="Chọn đơn vị"
                    loading={loading}
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Discount/Kg ',
            key: 'discount',
            render: (text, record) => (
                <InputNumber
                    defaultValue={0}
                    min={0}
                    value={record.discount}
                    onChange={(value) => handleInputChange2(value, record.key, 'discount')}
                />
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber
                    defaultValue={1}
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleInputChange(value, record.key, 'quantity')}
                />
            ),
        },
        {
            title: 'Đơn giá/Kg',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Ship/Kg',
            dataIndex: 'moneyShip',
            key: 'moneyShip',
            render: (text, record) => (
                <InputNumber
                    defaultValue={0}
                    min={0}
                    value={record.moneyShip}
                    onChange={(value) => handleInputChange2(value, record.key, 'moneyShip')} // Sử dụng handleInputChange2
                />
            ),
        },

        {
            title: 'Thành tiền(VND)',
            dataIndex: 'total',
            key: 'total',
            render: (text) => (text || 0).toLocaleString(),
        },
    ];
    const handleInputChange = (value, key, field) => {
        const finalValue = value === null || value < 1 ? 1 : value;
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === activeKey) {
                    const updatedDataSource = item.children.props.dataSource.map(row =>
                        row.key === key
                            ? {
                                ...row,
                                [field]: finalValue,
                                total:
                                    finalValue * row.price -
                                    (row.discount * finalValue || 0) +
                                    (row.moneyShip * finalValue || 0),
                            }
                            : row
                    );
                    setTotalAmount(calculateTotalAmount(updatedDataSource));
                    setTotalWithoutDiscount(calculateTotalWithoutDiscount(updatedDataSource));

                    return {
                        ...item,
                        children: (
                            <Table
                                columns={columns}
                                pagination={false}
                                dataSource={updatedDataSource}
                                size={size}
                            />
                        ),
                    };
                }
                return item;
            })
        );
    };

    const handleInputChange2 = (value, key, field) => {
        const finalValue = value === null || value < 0 ? 0 : value;
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === activeKey) {
                    const updatedDataSource = item.children.props.dataSource.map(row =>
                        row.key === key
                            ? {
                                ...row,
                                [field]: finalValue,
                                total:
                                    row.quantity * row.price -
                                    (field === 'discount' ? finalValue * row.quantity : row.discount * row.quantity || 0) +
                                    (field === 'moneyShip' ? finalValue * row.quantity : row.moneyShip * row.quantity || 0),
                            }
                            : row
                    );
                    setTotalAmount(calculateTotalAmount(updatedDataSource));
                    setTotalWithoutDiscount(calculateTotalWithoutDiscount(updatedDataSource));

                    return {
                        ...item,
                        children: (
                            <Table
                                columns={columns}
                                dataSource={updatedDataSource}
                                pagination={false}
                                size={size}
                            />
                        ),
                    };
                }
                return item;
            })
        );
    };
    const handlePackageChange = (value, key) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === activeKey) {
                    const updatedDataSource = item.children.props.dataSource.map(row =>
                        row.key === key
                            ? { ...row, packageId: value }
                            : row
                    );
                    return {
                        ...item,
                        children: (
                            <Table
                                columns={columns}
                                pagination={false}
                                dataSource={updatedDataSource}
                                size={size}
                            />
                        ),
                    };
                }
                return item;
            })
        );
    };

    const addProductToTab = () => {
        if (!selectedProduct || selectedProduct.length === 0) {
            setErrorMessage("Chưa chọn sản phẩm nào");
            return;
        }
        if (!activeKey || items.length === 0) {
            setErrorMessage("Chưa có tab nào để thêm sản phẩm nha bro");
            return;
        }
        if (!selectedProduct.productID || !selectedProduct.label || !selectedProduct.price) {
            setErrorMessage("Thông tin sản phẩm không đầy đủ");
            return;
        }
        setErrorMessage("");

        const newItems = items.map(item => {
            if (item.key === activeKey) {
                const existingProducts = item.children.props.dataSource || [];
                const productIndex = existingProducts.findIndex(p => p.name === selectedProduct.label);

                let updatedDataSource;
                if (productIndex !== -1) {
                    updatedDataSource = existingProducts.map((product, index) =>
                        index === productIndex
                            ? {
                                ...product,
                                quantity: product.quantity + 1,
                                total:
                                    (product.quantity + 1) * product.price -
                                    (product.discount * (product.quantity + 1) || 0) +
                                    (product.moneyShip * (product.quantity + 1) || 0),
                            }
                            : product
                    );
                } else {
                    updatedDataSource = [
                        ...existingProducts,
                        {
                            key: Date.now().toString(),
                            name: selectedProduct.label,
                            quantity: 1,
                            price: selectedProduct.price,
                            image: selectedProduct.image,
                            productID: selectedProduct.productID,
                            discount: 0,
                            moneyShip: 0,
                            total: 1 * selectedProduct.price,
                            packageId: packageOptions.length > 0 ? packageOptions[0].value : undefined
                        },
                    ];
                }
                setTotalAmount(calculateTotalAmount(updatedDataSource));
                setTotalWithoutDiscount(calculateTotalWithoutDiscount(updatedDataSource));

                return {
                    ...item,
                    children: (
                        <Table
                            columns={columns}
                            dataSource={updatedDataSource}
                            pagination={false}
                            size={size}
                            rowClassName={() => (size === 'large' ? 'large-row' : 'small-row')}
                        />
                    ),
                };
            }
            return item;
        });

        setItems(newItems);
    };
    const handleDeleteRow = (key) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === activeKey) {
                    const updatedDataSource = item.children.props.dataSource.filter(row => row.key !== key);
                    setTotalAmount(calculateTotalAmount(updatedDataSource));
                    setTotalWithoutDiscount(calculateTotalWithoutDiscount(updatedDataSource));

                    return {
                        ...item,
                        children: (
                            <Table
                                columns={columns}
                                dataSource={updatedDataSource}
                                pagination={false}
                                size={size}
                            />
                        ),
                    };
                }
                return item;
            })
        );
    };




    const add = () => {
        const newKey = Date.now().toString();
        setItems([
            ...(items || []),
            {
                label: `New Tab`,
                key: newKey,
                customerPhone: '',
                customerName: '',
                description: '',
                customerPayment: 0,
                children: (
                    <Table
                        columns={columns}
                        dataSource={[]}
                        pagination={false}
                        size={size}
                        rowClassName={() => size === 'large' ? 'large-row' : 'small-row'}
                    />
                ),
            },
        ]);
        setActiveKey(newKey);
        setTotalAmount(0);
        setTotalWithoutDiscount(0);
        setDiscount(0);
        setCustomerPayment(0);
        setExternalPhoneNumber('');
        setExternalName('');
    };
    const remove = (targetKey) => {
        if (!items) return;
        const targetIndex = items.findIndex((item) => item.key === targetKey);
        const newItems = items.filter((item) => item.key !== targetKey);
        if (newItems.length && targetKey === activeKey) {
            const newActiveKey =
                newItems[targetIndex === newItems.length ? targetIndex - 1 : targetIndex].key;
            setActiveKey(newActiveKey);
            const activeTabDataSource = newItems.find(item => item.key === newActiveKey)?.children.props.dataSource || [];
            setTotalAmount(calculateTotalAmount(activeTabDataSource));
            setTotalWithoutDiscount(calculateTotalWithoutDiscount(activeTabDataSource));

        } else if (newItems.length === 0) {
            setTotalAmount(0);
            setTotalWithoutDiscount(0);
            setDiscount(0);
            setCustomerPayment(0);
        }
        setItems(newItems);
    };
    const onTabChange = (key) => {
        setActiveKey(key);
        const activeTab = items.find(item => item.key === key);
        if (activeTab) {
            setTotalAmount(calculateTotalAmount(activeTab.children.props.dataSource));
            setTotalWithoutDiscount(calculateTotalWithoutDiscount(activeTab.children.props.dataSource));
            setCustomerPayment(activeTab.customerPayment || 0);
        }
    };
    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === activeKey
                    ? { ...item, description: newDescription }
                    : item
            )
        );
    };

    const handleCustomerChange = (phone, option) => {
        const customerName = option ? option.name : '';
        setExternalPhoneNumber('');
        setExternalName('');
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === activeKey
                    ? { ...item, customerPhone: phone, customerName }
                    : item
            )
        );
    };

    const handleCustomerNameChange = (e) => {
        const newName = e.target.value;
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === activeKey
                    ? { ...item, customerName: newName }
                    : item
            )
        );
    };
    // dme cai chuyen tab nay kho vai l ay anh duc a
    const currentTab = items.find(item => item.key === activeKey) || { customerPhone: '', customerName: '' };
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    const onChange = (e) => {
        setSize(e.target.value);
    };

    const fetchData = (searchValue = "") => {
        setLoading(true);
        axios.get(API.EMPLOYEE.GET_PRODUCTS_BY_NAMElist, {
            params: {
                name: searchValue,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const formattedOptions = response.data.map(item => ({
                    value: item.name,
                    label: item.name,
                    price: item.price,
                    productID: item.productID,
                    image: item.productImage,
                }));
                setOptions(formattedOptions);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const fetchData2 = (searchValue = "") => {
        setLoading(true);
        axios.get(API.EMPLOYEE.GET_ALL_CUSTOMERlist, {
            params: {
                phonesearch: searchValue,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const formattedOptions = response.data.map(item => ({
                    value: item.phoneNumber,
                    label: `${item.phoneNumber} - ${item.name}`,
                    name: item.name
                }));
                setOptions2(formattedOptions);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const fetchPackageData = () => {
        setLoading(true);
        axios.get(API.EMPLOYEE.INVOICE_PACKAGElist, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const formattedOptions = response.data.map(item => ({
                    value: item.id,
                    label: item.description
                }));
                setPackageOptions(formattedOptions);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu package:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //render Effect 
    useEffect(() => {
        fetchData();
        fetchData2();
        fetchPackageData();
        if (items.length > 0) {
            const activeTab = items.find(item => item.key === activeKey);
            if (activeTab) {
                setTotalAmount(calculateTotalAmount(activeTab.children.props.dataSource));
                setTotalWithoutDiscount(calculateTotalWithoutDiscount(activeTab.children.props.dataSource));
            }
        }
    }, []);
    useEffect(() => {
        if (currentTab.customerPhone) {
            form.setFieldsValue({
                name: currentTab.customerName || '',
                phoneNumber: currentTab.customerPhone || '',
                phoneNumberNew: currentTab.customerPhone || '',
            });
        }
    }, [currentTab, form]);
    useEffect(() => {
        const activeTab = items.find(item => item.key === activeKey);
        if (activeTab) {
            const totalShipping = activeTab.children.props.dataSource.reduce(
                (sum, item) => sum + (item.moneyShip * item.quantity || 0),
                0
            );
            setMoneyShipping(totalShipping);
        }
    }, [items, activeKey]);


    const onSearch2 = (value) => {
        fetchData(value);
    };
    const onSearchCustomer = (value) => {
        fetchData2(value);
    };

    const labelStyle = {
        width: 200,
        textAlign: 'left',
        paddingRight: 12,
    };

    const inputStyle = {
        flex: 1,
        border: 'none',
        borderBottom: '1px solid #ddd',
        padding: '4px 0'
    };
    const handlePayment = () => {
        const invoiceData = {
            invoice: {
                customerPhone: currentTab.customerPhone,
                customerName: currentTab.customerName,
                totalAmount: calculateFinalAmount(),
                totalShipping: moneyShipping,
                description: currentTab.description || '',
            },
            invoiceDetails: items
                .find(item => item.key === activeKey)
                ?.children.props.dataSource.map(product => ({
                    productID: product.productID,
                    packageId: product.packageId,
                    quantity: product.quantity,
                    price: product.price,
                    discount: product.discount,
                })) || [],
        };

        if (!invoiceData.invoice.customerPhone || invoiceData.invoiceDetails.length === 0) {
            openNotificationWithIcon('error', 'Lỗi', 'Vui lòng điền đầy đủ thông tin khách hàng và sản phẩm!');
            return;
        }
        if (!/^[0-9]{10}$/.test(currentTab.customerPhone)) {
            openNotificationWithIcon('error', 'Lỗi', 'Số điện thoại phải là 10 chữ số!');
            return;
        }

        axios.post(
            API.EMPLOYEE.INVOICE_CREATE,
            invoiceData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(response => {
                openNotificationWithIcon('success', 'Thành công', 'Hóa đơn đã được tạo thành công!');
                remove(activeKey);
                if (items.length > 1) {
                    const remainingItems = items.filter(item => item.key !== activeKey);
                    const newActiveKey = remainingItems[0].key;
                    setActiveKey(newActiveKey);
                    const activeTabDataSource = remainingItems.find(item => item.key === newActiveKey)?.children.props.dataSource || [];
                    setTotalAmount(calculateTotalAmount(activeTabDataSource));
                    setTotalWithoutDiscount(calculateTotalWithoutDiscount(activeTabDataSource));
                    setCustomerPayment(remainingItems.find(item => item.key === newActiveKey)?.customerPayment || 0);
                } else {
                    setActiveKey(null);
                    setTotalAmount(0);
                    setMoneyShipping(0);
                    setCustomerPayment(0);
                    setDiscount(0);
                    setCustomerPayment(0);
                }
            })
            .catch(error => {
                openNotificationWithIcon('error', 'Thất bại', 'Có lỗi xảy ra khi tạo hóa đơn!');
            });
        console.log('Dữ liệu sẽ gửi về backend:', JSON.stringify(invoiceData, null, 2));
    };
    const handleCustomerPaymentChange = (value) => {
        const finalValue = value || 0;
        setItems(prevItems =>
            prevItems.map(item =>
                item.key === activeKey
                    ? { ...item, customerPayment: finalValue }
                    : item
            )
        );
        setCustomerPayment(finalValue);
    };

    return (
        <>
            {contextHolder}
            <div className="main-container">
                <Content className="invoice-content">
                    <h1 className="invoice-title">Hoá Đơn Khách Hàng</h1>
                    <div className="control-section">
                        <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
                            <Radio.Button value="small">Small</Radio.Button>
                            <Radio.Button value="large">Large</Radio.Button>
                        </Radio.Group>
                        <div className="product-selection">
                            <div className="select-wrapper">
                                <Select
                                    showSearch
                                    placeholder="Chọn sản phẩm"
                                    optionFilterProp="label"
                                    style={{ width: '300px' }}
                                    options={options}
                                    onSearch={onSearch2}
                                    onChange={(value, option) => setSelectedProduct(option)}
                                    notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy"}
                                />
                                <Button type="primary" onClick={addProductToTab}>
                                    Thêm
                                </Button>
                            </div>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                        </div>
                    </div>

                    <Tabs
                        type="editable-card"
                        size={size}
                        activeKey={activeKey}
                        onChange={onTabChange}
                        onEdit={onEdit}
                        items={items}
                        className="invoice-tabs"
                    />
                    <style jsx>{`
                    .large-row td {
                        font-size: 18px !important;
                    }
                    .small-row td {
                        font-size: 14px !important;
                    }
                    .ant-table-thead th {
                        font-size: ${size === 'large' ? '16px' : '13px'} !important;
                    }
                 `}</style>
                </Content>

                <Content className="customer-content">
                    <h1 className="customer-title">Thông Tin Khách Hàng</h1>
                    <div className="customer-info">
                        <div className="customer-form">
                            <div className="form-row">
                                <label className="form-label">Phone Number: </label>
                                {currentTab.customerPhone && (
                                    <Button type="link" onClick={showModal} >
                                        <SettingOutlined />
                                    </Button>
                                )}
                                <Select
                                    showSearch
                                    placeholder="Chọn số điện thoại"
                                    optionFilterProp="label"
                                    style={inputStyle}
                                    options={options2}
                                    value={currentTab.customerPhone || undefined}
                                    onSearch={onSearchCustomer}
                                    onChange={handleCustomerChange}
                                    optionLabelProp="value"
                                    notFoundContent={loading ? <Spin size="small" /> : "Không tìm thấy"}
                                />
                            </div>
                            <div className="form-row">
                                <label className="form-label">Tên khách hàng: </label>
                                <Input
                                    style={inputStyle}
                                    value={currentTab.customerName}
                                    onChange={handleCustomerNameChange}
                                    readOnly
                                />
                            </div>
                        </div>

                        <Modal
                            title="Chỉnh sửa thông tin khách hàng"
                            visible={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            okText="Lưu"
                            cancelText="Hủy"
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={{
                                    name: currentTab.customerName || '',
                                    phoneNumber: currentTab.customerPhone || '',
                                    email: '',
                                    address: '',
                                }}
                            >
                                <Form.Item
                                    name="name"
                                    label="Tên khách hàng"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                >
                                    <Input placeholder="Nhập tên khách hàng" />
                                </Form.Item>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Số điện thoại cũ"
                                    rules={[

                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        { pattern: /^0\d{9}$/, message: 'Số điện thoại phải là 10 chữ số và bắt đầu từ 0!' },
                                    ]}
                                >
                                    <Input type='number' placeholder="Nhập số điện thoại" readOnly />
                                </Form.Item>
                                <Form.Item
                                    name="phoneNumberNew"
                                    label="Số điện thoại mới"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        { pattern: /^0\d{9}$/, message: 'Số điện thoại phải là 10 chữ số và bắt đầu từ 0!' },
                                    ]}
                                >
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>

                            </Form>
                        </Modal>

                        <div className="payment-details">
                            <div className="payment-row">
                                <label className="payment-label total-product-label"><h5>Tổng tiền sản phẩm:</h5></label>
                                <div className="payment-value total-product-value">{totalAmount.toLocaleString()}</div>
                            </div>
                            <div className="payment-row">
                                <label className="payment-label final-amount-label"><h5>Tiền khách phải trả:</h5></label>
                                <div className="payment-value final-amount-value">{calculateFinalAmount().toLocaleString()}</div>
                            </div>
                            <div className="payment-row">
                                <label className="payment-label customer-payment-label"><h6>Tiền khách đưa:</h6></label>
                                <InputNumber
                                    placeholder="Nhập số tiền"
                                    min={0}
                                    value={customerPayment}
                                    onChange={handleCustomerPaymentChange}
                                    // onChange={(value) => setCustomerPayment(value || 0)}
                                    className="customer-payment-input"
                                />
                            </div>
                            <div className="payment-row">
                                <label className="payment-label change-label"><h6>Tiền thừa trả khách:</h6></label>
                                <div className="payment-value change-value">{calculateChange().toLocaleString()}</div>
                            </div>
                            <div className="customer-row"><InvoiceCustomerCreate onCustomerCreated={handleCustomerCreated} /></div>
                            <div className="description_content">
                                <label><h6><i>Ghi chú :</i></h6></label>
                                <TextArea
                                    rows={10}
                                    value={currentTab.description || ''}
                                    onChange={handleDescriptionChange}
                                />
                            </div>
                        </div>
                    </div>
                </Content>
            </div>

            <div className="invoice-footer">
                <div className="total-section">
                    <div className="detail-line">
                        <span className="detail-label">Tiền hàng sản phẩm :</span>
                        <span>{totalwithoutdiscount.toLocaleString()} VND</span>
                    </div>
                    <div className="detail-line">
                        <span className="detail-label">Tiền ship sản phẩm :</span>
                        <span>{moneyShipping.toLocaleString()} VND</span>
                    </div>
                    <div className="detail-line">
                        <span className="detail-label">Voucher  của shop  : </span>
                        <span> -{calculateTotalDiscount(items.find(item => item.key === activeKey)?.children.props.dataSource || []).toLocaleString()} VND</span>
                    </div>
                    <div className="total-line">
                        <h2 className="total-label">Tổng tiền:</h2>
                        <span className="total-amount">{calculateFinalAmount().toLocaleString()} VND</span>
                    </div>
                </div>
                <div>
                    <Button
                        type="primary"
                        size="large"
                        className="debt-button"

                    >
                        Ghi Nợ
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        className="payment-button"
                        onClick={handlePayment}
                    >
                        Thanh Toán
                    </Button>
                </div>

            </div>

        </>
    );
};

export default InvoiceDetail;