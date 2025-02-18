import React, { useEffect, useState } from 'react';
import { message, Input, Spin } from 'antd';
import ProductCard from '../../../Components/StoreOwner/ProductCard'; // Import ProductCard
import qs from 'qs';
import './style.scss'; // Thêm file CSS để căn chỉnh layout
import Loading from '../../Loading/Loading';
const { Search } = Input;

const Store = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [timeoutId, setTimeoutId] = useState(null);

    const getStoreParams = () => {
        // Xử lý params (chỉ cần `searchValue` cho API chuyển sang đại diện key)
        return qs.stringify({
            storeName: searchValue,
        });
    };

    const fetchStores = async () => {
        setLoading(true);
        try {
            const queryParams = `stores?${getStoreParams()}`;
            const response = await fetch(`http://localhost:9999/store-owner/${queryParams}`);
            const result = await response.json();

            // Map dữ liệu nhận được
            setData(result.content || []); // Kết quả trả về từ API
        } catch (error) {
            message.error('Không thể tải dữ liệu danh sách stores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [searchValue]);

    const handleSearch = (e) => {
        const value = e.target.value;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Đợi sau một giây thì thực hiện search
        const newTimeoutId = setTimeout(() => {
            setSearchValue(value);
        }, 1000);

        setTimeoutId(newTimeoutId);
    };

    return (
        <div>
            <Search
                placeholder="Enter Store Name"
                onChange={handleSearch}
                enterButton
                style={{ marginBottom: 16 }}
                loading={loading}
            />
            <Spin spinning={loading}>

                <div className="product-card-container">
                    {
                        data.map((store) => (
                            // Render từng ProductCard 
                            <ProductCard
                                key={store.storeID} // Sử dụng storeID làm key
                                urlStore={`/store/${store.storeID}`} // Đường dẫn
                                storeName={store.storeName} // Tên cửa hàng
                                storeStatus={store.status === 'ACTIVE' ? 'Active' : 'Inactive'} // Trạng thái
                                urlImg={store.imageUrl || 'https://via.placeholder.com/150'} // Ảnh mặc định nếu không có ảnh
                            />
                        ))
                    }
                </div>
            </Spin>
        </div>
    );
};

export default Store;