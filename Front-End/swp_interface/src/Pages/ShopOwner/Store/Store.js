import React, { useEffect, useState } from 'react';
import { message, Input, Spin } from 'antd';
import ProductCard from '../../../Components/StoreOwner/ProductCard'; // Import ProductCard
import qs from 'qs';
import './style.scss'; // Thêm file CSS để căn chỉnh layout
import Loading from '../../Loading/Loading';
import { getToken } from '../../../Utils/UserInfoUtils';
import API from '../../../Utils/API/API';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { SoundTwoTone } from '@ant-design/icons';
const { Search } = Input;

const Store = () => {
    const token = getToken();
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
            const queryParams = `?${getStoreParams()}`;
            const response = await getDataWithToken(API.STORE_OWNER.GET_STORE + queryParams, token);
            setData(response.content);

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
                       data && (
                        <>{
                            data.map((store) => (
                                // Render từng ProductCard 
                                <ProductCard
                                    key={store.storeID} // Sử dụng storeID làm key
                                    urlStore={`/store/${store.storeID}`} // Đường dẫn
                                    storeName={store.storeName} // Tên cửa hàng
                                    storeStatus={store.status === 'ACTIVE' ? 'Active' : 'Inactive'} // Trạng thái
                                    urlImg={store.imageUrl || 'https://via.placeholder.com/150'} // Ảnh mặc định nếu không có ảnh
                                />
                            ))}
                         </>
                        )
                    }
                </div>
            </Spin>
        </div>
    );
};

export default Store;