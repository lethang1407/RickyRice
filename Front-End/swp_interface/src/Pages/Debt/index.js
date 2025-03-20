import { Table, Input, Button, Modal, notification, message, Image } from 'antd';
import { useEffect, useState } from 'react';
import { getToken, getUsername } from '../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../Utils/FetchUtils';
import Filter from './filter';
import Create from './create';
import { openNotification } from '../../Utils/AntdNotification';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import dayjs from 'dayjs';
import noimg from '../../assets/img/notavailable.jpg'

function Debt(){
  const token = getToken();
  const [data, setData] = useState(null);
  const [params, setParams] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const [stompClient, setStompClient] = useState(null);
  const username = getUsername();
  const [sorter, setSorter] = useState(null);

  const displayNotification = (message) => {
    openNotification(api, message)
  }

  const showCreate = () => {
    setIsCreateOpen(true);
  };
  const handleOk = () => {
    setIsCreateOpen(false);
  };
  const handleCancel = () => {
    setIsCreateOpen(false);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 20, 
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20']
  });

  const getData = async () =>{
    const response = await getDataWithToken(`http://localhost:9999/debt?pageNo=${pagination.current ? pagination.current : 1}&pageSize=${pagination.pageSize ? pagination.pageSize : 10}&${params ? params : ''}&sortBy=${sorter ? sorter : ''}`, token);
    setData(response.data.data)
    setPagination((prev) => ({
      ...prev,
      current: response.data.pageNo,
      pageSize: response.data.pageSize,
      total: response.data.pageSize * response.data.totalPages
    }))
    console.log(`http://localhost:9999/debt?pageNo=${pagination.current ? pagination.current : 1}&pageSize=${pagination.pageSize ? pagination.pageSize : 10}&${params ? params : ''}&sortBy=${sorter ? sorter : ''}`)
  }

  const getStore = async () => {
    const response = await getDataWithToken('http://localhost:9999/debt/store', token);
    setStore( response.data.map((item) => ({
      value: item.storeID,
      label: item.storeName,
    })));
  }

  const getCustomer = async () => {
    const response = await getDataWithToken('http://localhost:9999/debt/customer', token);
    setCustomer( response.data.map((item) => ({
      value: item.customerID,
      label: item.name + ' - ' + item.phoneNumber,
    })));
  }

  const handleChangeTable = (pagination, filters, sorter) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
    setSorter(`${sorter.field}:${sorter.order}`);
  }

  useEffect(()=>{
    getStore();
    getData();
    getCustomer();
  },[params, pagination.current, pagination.pageSize, loading, sorter])

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:9999/ws', 
      connectHeaders: {},
      webSocketFactory: () => new SockJS('http://localhost:9999/ws'),
      onConnect: () => {
        console.log('Kết nối thành công!');
        client.subscribe(`/user/${username}/private`, (message) => {
          const notification = JSON.parse(message.body);
          displayNotification(notification.message);
          getData();
        });
      },
      debug: (str) => console.log(str),
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, []);

  const columns = [
    {
      title: 'Mã số nợ',
      dataIndex: 'number',
      key: 'number',
      sorter: true
    },
    {
      title: 'Loại nợ',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (src) => <Image width={50} src={src ? src : noimg} alt="Ảnh mô tả" />,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Cửa hàng',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: 'Được tạo bởi',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Được tạo khi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (text ? dayjs(text).format("HH:mm:ss DD/MM/YYYY") : "-"),
      sorter: true
    }
  ]
  
  return (
    <> 
      {contextHolder}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
        <h2>Danh sách phiếu nợ</h2>
        <Button style={{marginRight:'20px'}} type="primary" onClick={showCreate}>
          Tạo mới Nợ
        </Button>
      </div>
      <Modal title="Create New Debt" open={isCreateOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Create displayNotification={displayNotification} setIsCreateOpen={setIsCreateOpen} customer={customer} store={store}/>
      </Modal>
      <Filter params={params} setParams={setParams} store={store}/>
      <Table loading={data==null} columns={columns} dataSource={data} pagination={pagination} onChange={handleChangeTable}/>
    </>
  )
}

export default Debt;