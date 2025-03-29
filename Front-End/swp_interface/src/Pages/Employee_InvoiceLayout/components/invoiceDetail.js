import React, { useState, useEffect } from 'react';
import InvoiceCustomerCreate from './invoiceCustomerCreate';
import { Radio, Tabs, Select, Button, Spin, Table, InputNumber, Input, Layout, Form, Modal, message, notification } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import API from '../../../Utils/API/API';
import { getToken } from '../../../Utils/UserInfoUtils';
import { Content } from 'antd/es/layout/layout';
import { success, error } from '../../../Utils/AntdNotification';
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
    const [packageOptions, setPackageOptions] = useState([]);
    const [isExceedingQuantity, setIsExceedingQuantity] = useState(false);
    const [isDebtModalVisible, setIsDebtModalVisible] = useState(false);
    const [debtAmount, setDebtAmount] = useState(null);

    // của thông tin khách hàng 
    const [options2, setOptions2] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [open, setOpen] = useState(false);
    const [externalPhoneNumber, setExternalPhoneNumber] = useState('');
    const [externaName, setExternalName] = useState('');

    //của chỉnh sửa khách hàng 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const token = getToken();

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const openNotificationWithIcon = (type, title, description) => {
        messageApi[type]({
            message: title,
            description: description,
            placement: 'bottomRight',
        });
    };
    const showModal = () => {
        setIsModalVisible(true);
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
                success("Cập nhật khách hàng thành công", messageApi);
            }).catch((err) => {
                error(err.response.data.message || "Tạo mới tài khoản thất bại.", messageApi);
            });
        })
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
        return dataSource.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const calculateTotalSellPrice = (dataSource) => {
        if (!dataSource || !Array.isArray(dataSource)) return 0;
        return dataSource.reduce((sum, item) => sum + (item.quantity * (item.pricePay || item.price)), 0);
    };

    const calculateTotalDiscount = (dataSource) => {
        return dataSource.reduce((sum, item) => {
            const discountPerKg = (item.price || 0) - (item.pricePay || item.price);
            const packageOption = packageOptions.find(opt => opt.value === item.packageId);
            const packageValue = packageOption ? packageOption.packageValue : 1;
            const totalDiscount = discountPerKg * item.quantity * packageValue;
            return sum + (totalDiscount > 0 ? totalDiscount : 0);
        }, 0);
    };
    //ở đây 
    const calculateProductTotal = (dataSource) => {
        if (!dataSource || !Array.isArray(dataSource)) return 0;
        return dataSource.reduce((sum, item) => sum + (item.total || 0), 0);
    };

    const calculateTotalAmount = (dataSource, moneyShip) => {
        const productTotal = calculateProductTotal(dataSource);
        return productTotal + (dataSource && dataSource.length > 0 ? (moneyShip || 0) : 0);
    };
    const calculateFinalAmount = () => {
        const activeTab = items.find(item => item.key === activeKey);
        if (!activeTab) return 0;
        return calculateTotalAmount(activeTab.children.props.dataSource, activeTab.moneyShip || 0);
    };

    const calculateChange = () => {
        const finalAmount = calculateFinalAmount();
        return customerPayment - finalAmount >= 0 ? customerPayment - finalAmount : 0;
    };
    const columns = [
        {
            title: 'Lựa Chọn',
            key: 'option',
            render: (text, record) => (
                <Button type="link" danger onClick={() => handleDeleteRow(record.key)}>
                    <i class="bi bi-trash"></i>
                </Button>
            ),
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
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số Lượng(Bao)',
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
            title: 'Giá Bán Thực/Kg',
            dataIndex: 'price',
            key: 'price',
            render: (text) => (text || 0).toLocaleString(),
        },
        {
            title: 'Giá Bán/kg',
            dataIndex: 'pricePay',
            key: 'pricePay',
            render: (text, record) => (
                <InputNumber
                    defaultValue={record.price}
                    min={0}
                    value={record.pricePay}
                    onChange={(value) => handleInputChange(value, record.key, 'pricePay')}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
            ),
        },
        {
            title: 'Giảm Giá/Kg ',
            key: 'discount',
            render: (text, record) => {
                const discountPerKg = (record.price || 0) - (record.pricePay || record.price);
                const packageOption = packageOptions.find(opt => opt.value === record.packageId);
                const packageValue = packageOption ? packageOption.packageValue : 1;
                const totalDiscount = discountPerKg * record.quantity * packageValue;
                return (totalDiscount > 0 ? totalDiscount : 0).toLocaleString();
            },
        },
        {
            title: 'Thành Tiền(VND)',
            dataIndex: 'total',
            key: 'total',
            render: (text) => (text || 0).toLocaleString(),
        },
    ];
    const handleInputChange = (value, key, field) => {
        let finalValue;
        if (field === 'quantity') {
            finalValue = value === null || value < 1 ? 1 : value;
        } else {
            finalValue = value === null || value < 0 ? 0 : value;
        }
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === activeKey) {
                    const updatedDataSource = item.children.props.dataSource.map(row => {
                        if (row.key === key) {
                            const productOption = options.find(opt => opt.productID === row.productID);
                            const packageOption = packageOptions.find(opt => opt.value === row.packageId);
                            const packageValue = packageOption ? packageOption.packageValue : 1;
                            let cappedValue = finalValue;

                            if (field === 'quantity') {
                                const maxQuantityPerPackage = productOption ? Math.floor(productOption.quantity / packageValue) : Infinity;
                                cappedValue = Math.max(1, Math.min(finalValue, maxQuantityPerPackage));
                                if (finalValue >= maxQuantityPerPackage) {
                                    messageApi.warning(`Số lượng tối đa cho sản phẩm này là ${maxQuantityPerPackage} bao!`);
                                }
                            }

                            const newPricePay = field === 'pricePay' ? cappedValue : (row.pricePay || row.price);
                            const newQuantity = field === 'quantity' ? cappedValue : row.quantity;
                            const total = packageValue * newQuantity * newPricePay;

                            return {
                                ...row,
                                [field]: cappedValue,
                                total: total,
                            };
                        }
                        return row;
                    });

                    const exceeds = updatedDataSource.some(row => {
                        const productOption = options.find(opt => opt.productID === row.productID);
                        const packageOption = packageOptions.find(opt => opt.value === row.packageId);
                        const packageValue = packageOption ? packageOption.packageValue : 1;
                        return productOption && row.quantity * packageValue > productOption.quantity;
                    });
                    setIsExceedingQuantity(exceeds);
                    setTotalAmount(calculateProductTotal(updatedDataSource));
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


    const handlePackageChange = (value, key) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.key === activeKey) {
                    const updatedDataSource = item.children.props.dataSource.map(row => {
                        if (row.key === key) {
                            const productOption = options.find(opt => opt.productID === row.productID);
                            const packageOption = packageOptions.find(opt => opt.value === value);
                            const packageValue = packageOption ? packageOption.packageValue : 1;
                            const maxQuantityPerPackage = productOption ? Math.floor(productOption.quantity / packageValue) : Infinity;

                            const newQuantity = Math.min(row.quantity, maxQuantityPerPackage);
                            if (row.quantity > maxQuantityPerPackage) {
                                messageApi.info(`Số lượng đã được điều chỉnh xuống ${maxQuantityPerPackage} bao do thay đổi loại đóng gói!`);
                            }
                            const newTotal = packageValue * newQuantity * (row.pricePay || row.price);

                            return {
                                ...row,
                                packageId: value,
                                quantity: newQuantity,
                                total: newTotal,
                            };
                        }
                        return row;
                    });

                    setTotalAmount(calculateProductTotal(updatedDataSource));
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

    const addProductToTab = () => {
        if (!selectedProduct || selectedProduct.length === 0) {
            setErrorMessage("Chưa chọn sản phẩm nào");
            return;
        }
        if (!activeKey || items.length === 0) {
            setErrorMessage("Chưa có tab nào để thêm sản phẩm");
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
                                total: packageOptions.find(opt => opt.value === product.packageId)?.packageValue * (product.quantity + 1) * (product.pricePay || product.price),
                            }
                            : product
                    );
                } else {
                    const defaultPackageId = packageOptions.length > 0 ? packageOptions[0].value : undefined;
                    const packageValue = packageOptions.find(opt => opt.value === defaultPackageId)?.packageValue || 1;

                    updatedDataSource = [
                        ...existingProducts,
                        {
                            key: Date.now().toString(),
                            name: selectedProduct.label,
                            quantity: 1,
                            price: selectedProduct.price,
                            pricePay: selectedProduct.price,
                            image: selectedProduct.image,
                            productID: selectedProduct.productID,
                            total: packageValue * 1 * selectedProduct.price,
                            packageId: defaultPackageId,
                        },
                    ];
                }
                setTotalAmount(calculateProductTotal(updatedDataSource));
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
                    setTotalAmount(calculateProductTotal(updatedDataSource));
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
                label: `Trang Mới`,
                key: newKey,
                customerPhone: '',
                customerName: '',
                description: '',
                customerPayment: 0,
                moneyShip: 0,
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
            setTotalAmount(calculateProductTotal(activeTabDataSource));
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
            setTotalAmount(calculateProductTotal(activeTab.children.props.dataSource));
            setTotalWithoutDiscount(calculateTotalWithoutDiscount(activeTab.children.props.dataSource));
            setCustomerPayment(activeTab.customerPayment || 0);
        } else {
            setTotalAmount(0);
            setTotalWithoutDiscount(0);
            setCustomerPayment(0);
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
                    quantity: item.quantity,
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
                const formattedOptions = response.data.map(item => {
                    const description = item.description.toLowerCase();
                    let packageValue = 1;
                    if (description.includes("25kg/bao")) {
                        packageValue = 25;
                    } else if (description.includes("50kg/bao")) {
                        packageValue = 50;
                    } else if (description.includes("75kg/bao")) {
                        packageValue = 75;
                    } else {
                        packageValue = 100;
                    }

                    return {
                        value: item.id,
                        label: item.description,
                        packageValue: packageValue,
                    };
                });
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
            setTotalAmount(calculateProductTotal(activeTab.children.props.dataSource));
            setTotalWithoutDiscount(calculateTotalWithoutDiscount(activeTab.children.props.dataSource));
        }
    }, [items, activeKey]);

    const onSearch2 = (value) => {
        fetchData(value);
    };
    const onSearchCustomer = (value) => {
        fetchData2(value);
    };

    const inputStyle = {
        flex: 1,
        border: 'none',
        borderBottom: '1px solid #ddd',
        padding: '4px 0'
    };
    const handlePayment = () => {
        const activeTab = items.find(item => item.key === activeKey);
        if (!activeTab) {
            messageApi.open({
                type: 'warning',
                content: 'Không tìm thấy tab hiện tại, vui lòng thử lại!',
            });
            return;
        }
        const invoiceData = {
            invoice: {
                customerPhone: activeTab.customerPhone,
                customerName: activeTab.customerName,
                totalAmount: calculateFinalAmount(),
                totalShipping: activeTab.moneyShip,
                description: activeTab.description || '',
                type: false,
            },
            invoiceDetails: activeTab.children.props.dataSource.map(product => ({
                productID: product.productID,
                packageId: product.packageId,
                quantity: product.quantity,
                price: product.pricePay || product.price,
                discount: (product.price || 0) - (product.pricePay || 0),
            })),
        };

        if (!invoiceData.invoice.customerPhone || invoiceData.invoiceDetails.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Vui lòng điền đầy đủ và đúng thông tin cần thiết trước khi gửi!',
            });
            return;
        }
        if (!/^[0-9]{10}$/.test(activeTab.customerPhone)) {
            messageApi.open({
                type: 'warning',
                content: 'Vui lòng xem lại số điện thoại trước khi gửi!',
            });
            return;
        }

        axios.post(API.EMPLOYEE.INVOICE_CREATE, invoiceData, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                remove(activeKey);
                if (items.length > 1) {
                    const remainingItems = items.filter(item => item.key !== activeKey);
                    const newActiveKey = remainingItems[0].key;
                    setActiveKey(newActiveKey);
                    const activeTabDataSource = remainingItems.find(item => item.key === newActiveKey)?.children.props.dataSource || [];
                    setTotalAmount(calculateProductTotal(activeTabDataSource));
                    setTotalWithoutDiscount(calculateTotalWithoutDiscount(activeTabDataSource));
                    setCustomerPayment(remainingItems.find(item => item.key === newActiveKey)?.customerPayment || 0);
                } else {
                    setActiveKey(null);
                    setTotalAmount(0);
                    setCustomerPayment(0);
                }
            })
            .catch(err => {
                error(err.response.data.message || "Lỗi khi tạo hóa đơn", messageApi);
                messageApi.open({
                    type: 'error',
                    content: errorMessage,
                });
            });
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
    const showDebtModal = () => {
        setDebtAmount(null);
        setIsDebtModalVisible(true);
    };

    const handleDebtOk = () => {
        const activeTab = items.find(item => item.key === activeKey)
        if (!activeTab) {
            messageApi.open({
                type: 'error',
                content: 'Không tìm thấy tab hiện tại!',
            });
            return;
        }
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
        const autoDescription = `${activeTab.customerName || 'Khách hàng'} - ${formattedDate}`;
        const finalDebtAmount = debtAmount !== null && debtAmount >= 0 ? debtAmount : calculateFinalAmount();
        const invoiceData = {
            phoneNumber: activeTab.customerPhone,
            customerName: activeTab.customerName,
            amount: finalDebtAmount,
            description: autoDescription || "Không có sản phẩm mua",
            type: "NEGATIVE_KH_VAY",
        };
        console.log("Invoice Data:", invoiceData);
        axios.post(API.EMPLOYEE.CREATE_DEBT,
            invoiceData, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                remove(activeKey);
                setIsDebtModalVisible(false);
            })
            .catch(err => {
                error(err.response.data.message || "Lỗi khi tạo hóa đơn nợ", messageApi);
                messageApi.open({
                    type: 'error',
                    content: errorMessage,
                });
            });
    };

    const handleDebtCancel = () => {
        setIsDebtModalVisible(false);
    };
    const handleDebtAndPayment = () => {
        const activeTab = items.find(item => item.key === activeKey);

        if (!activeTab) {
            messageApi.open({
                type: 'warning',
                content: 'Không tìm thấy tab hiện tại, vui lòng thử lại!',
            });
            return;
        }

        if (activeTab.children.props.dataSource.length === 0) {
            messageApi.open({
                type: 'warning',
                content: 'Vui lòng chọn ít nhất một sản phẩm trước khi ghi nợ!',
            });
            return;
        }

        if (!activeTab.customerPhone) {
            messageApi.open({
                type: 'warning',
                content: 'Vui lòng chọn một khách hàng trước khi ghi nợ!',
            });
            return;
        }

        if (!/^[0-9]{10}$/.test(activeTab.customerPhone)) {
            messageApi.open({
                type: 'warning',
                content: 'Số điện thoại không hợp lệ, vui lòng kiểm tra lại!',
            });
            return;
        }
        handleDebtOk();
        handlePayment();
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
                                    optionRender={(option) => (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{option.data.value}</span>
                                            <span style={{ opacity: 0.5, color: '#888' }}>
                                                (Số lượng còn: {option.data.quantity})
                                            </span>
                                        </div>
                                    )}
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
                                {currentTab.customerPhone && (
                                    <Button type="link" onClick={showModal} >
                                        <SettingOutlined />
                                    </Button>
                                )}
                            </div>
                            <div className="form-row">
                                <label className="form-label2">Tên khách hàng:</label>
                                <Input
                                    style={inputStyle}
                                    value={currentTab.customerName}
                                    onChange={handleCustomerNameChange}
                                    readOnly
                                />
                                <span className="new-customer"><InvoiceCustomerCreate onCustomerCreated={handleCustomerCreated} /></span>
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
                                <label className="payment-label customer-payment-label"><h6>Phí vận chuyển:</h6></label>
                                <InputNumber
                                    className="customer-payment-input"
                                    min={0}
                                    value={items.find(item => item.key === activeKey)?.moneyShip || 0}
                                    onChange={(value) => {
                                        const finalValue = value || 0;
                                        setItems(prevItems =>
                                            prevItems.map(item =>
                                                item.key === activeKey
                                                    ? {
                                                        ...item,
                                                        moneyShip: finalValue,
                                                    }
                                                    : item
                                            )
                                        );
                                    }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </div>
                            <div className="payment-row">
                                <label className="payment-label final-amount-label"><h6>Tiền khách phải trả:</h6></label>
                                <div className="payment-value final-amount-value">{calculateFinalAmount().toLocaleString()}</div>
                            </div>
                            <div className="payment-row">
                                <label className="payment-label customer-payment-label"><h6>Tiền khách đưa:</h6></label>
                                <InputNumber
                                    placeholder="Nhập số tiền"
                                    min={0}
                                    value={customerPayment}
                                    onChange={handleCustomerPaymentChange}
                                    className="customer-payment-input"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </div>
                            <div className="payment-row">
                                <label className="payment-label change-label"><h6>Tiền thừa trả khách:</h6></label>
                                <div className="payment-value change-value">{calculateChange().toLocaleString()}</div>
                            </div>
                            <div className="description_content">
                                <label><h6><i>Ghi chú :</i></h6></label>
                                <TextArea
                                    rows={5}
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
                        <span>{(calculateTotalDiscount(items.find(item => item.key === activeKey)?.children.props.dataSource || []) + totalAmount).toLocaleString()} VND</span>
                    </div>
                    <div className="detail-line">
                        <span className="detail-label">Tổng tiền giảm giá : </span>
                        <span> - {calculateTotalDiscount(items.find(item => item.key === activeKey)?.children.props.dataSource || []).toLocaleString()} VND</span>
                    </div>
                    <div className="detail-line">
                        <span className="detail-label">Tiền hàng sản phẩm còn lại :</span>
                        <span>{totalAmount.toLocaleString()} VND</span>
                    </div>
                    <div className="detail-line">
                        <span className="detail-label">Tiền ship sản phẩm :</span>
                        <span>{(items.find(item => item.key === activeKey)?.moneyShip || 0).toLocaleString()} VND</span>
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
                        onClick={showDebtModal}

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
                    <Modal
                        title="Tạo Hóa Đơn Nợ"
                        visible={isDebtModalVisible}
                        onOk={handleDebtAndPayment}
                        onCancel={handleDebtCancel}
                        okText="Xác Nhận"
                        cancelText="Hủy"
                    >
                        <div className="debt-modal-content">
                            <p><strong>Tên khách hàng:</strong> {currentTab.customerName || 'Chưa xác định'}</p>
                            <p><strong>Tổng tiền phải trả:</strong> {calculateFinalAmount().toLocaleString()} VND</p>
                            <div style={{ marginBottom: '16px' }}>
                                <label><strong>Số tiền nợ:</strong></label>
                                <InputNumber
                                    style={{ width: '100%', marginTop: '8px' }}
                                    min={0}
                                    value={debtAmount}
                                    onChange={(value) => setDebtAmount(value)}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="Nhập số tiền nợ (để trống sẽ lấy tổng tiền)"
                                />
                            </div>
                            {debtAmount === null && (
                                <p style={{ color: 'red' }}>
                                    Ghi hóa đơn nợ nhận giá trị: {calculateFinalAmount().toLocaleString()} VND
                                </p>
                            )}
                            <p>
                                <strong>Ghi chú :</strong>
                                {`${currentTab.customerName || 'Khách hàng'} - ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}`}
                            </p>
                        </div>
                    </Modal>
                </div>

            </div>

        </>
    );
};

export default InvoiceDetail;