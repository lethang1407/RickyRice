import { Table, Button, Image, Modal } from "antd";
import dayjs from 'dayjs';
import noimg from '../../../assets/img/notavailable.jpg';
import { useEffect, useState } from 'react';
import { getDataWithToken } from '../../../Utils/FetchUtils';
import { getToken, getUsername } from '../../../Utils/UserInfoUtils';
import Filter from "./filter";
import { EditOutlined, InfoOutlined, PlusOutlined } from "@ant-design/icons";
import Detail from "./detail";
import Create from "./Create";
import Update from "./update";
import CreateCustomer from "./CreateCustomer";

function CustomerDebt(){
  const token = getToken();
  const [data, setData] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [createCustomer, setCreateCustomer] = useState(false);
  const [store, setStore] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [params, setParams] = useState(null);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [id, setId] = useState(null);
  const [createId, setCreateId] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 20, 
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20']
  });

  const getData = async () => {
    const response = await getDataWithToken(`http://localhost:9999/debt/customer-debt?pageNo=${pagination.current ? pagination.current : 1}&pageSize=${pagination.pageSize ? pagination.pageSize : 10}&${params ? params : ''}&sortBy=${sorter ? sorter : ''}`, token);
    setData(response.data.data)
    setPagination((prev) => ({
      ...prev,
      current: response.data.pageNo,
      pageSize: response.data.pageSize,
      total: response.data.pageSize * response.data.totalPages
    }))
  }

  const getCustomer = async () => {
    const response = await getDataWithToken('http://localhost:9999/debt/customer', token);
    setCustomer( response.data.map((item) => ({
      value: item.customerID,
      label: item.name + ' - ' + item.phoneNumber,
    })));
  }

  const getStore = async () => {
    const response = await getDataWithToken('http://localhost:9999/debt/store', token);
    setStore( response.data.map((item) => ({
      value: item.storeID,
      label: item.storeName,
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

  const cancelUpdate = () =>{
    setUpdateId(null);
    setUpdate(false);
  }

  useEffect(()=>{
    getData();
    getStore();
    getCustomer();
  },[params,pagination.current, pagination.pageSize, sorter, create, setCreate, updateId, setUpdate, setUpdateId, createCustomer, setCreateCustomer])

  const columns = [
    {
      title: 'Tên Khách hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tổng tiền nợ',
      dataIndex: 'balance',
      key: 'balance',
      sorter: true
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
    },
    {
      title: 'Cập nhật bởi',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: 'Cập nhật khi',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => (text ? dayjs(text).format("HH:mm:ss DD/MM/YYYY") : "-"),
      sorter: true
    },
    {
      title: 'Action',
      dataIndex: 'customerId',
      key: 'customerId',
      width:'10%',
      render: (id) => (
        <div>
          <Button icon={<InfoOutlined />} onClick={() => {setId(id); setOpen(true);}} type="primary"></Button>
          <Button icon={<PlusOutlined />} onClick={() => {setCreateId(id);setCreate(true);}} style={{marginLeft:'10px'}}></Button>
          <Button color="danger" variant="filled" icon={<EditOutlined />} onClick={() => {setUpdateId(id); setUpdate(true)}} style={{marginLeft:'10px'}}></Button>
        </div>
      )
    }
  ]

  return (
    <>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
        <h2>Danh sách người nợ</h2>
        <Button onClick={() => setCreateCustomer(true)} style={{marginRight:'20px'}} type="primary">
          Tạo mới người nợ
        </Button>
      </div>

      <Modal width={1050} open={open} title={`Thông tin người nợ:`} onCancel={() => {setOpen(false); setId(null)}}>
        <Detail setId={setId} id={id} />
      </Modal>

      {
        updateId && (
          <Modal open={update} title='Cập nhật thông tin' onCancel={() => {setUpdateId(null); setUpdate(false);}} footer={null}>
            <Update cancelUpdate={cancelUpdate} id={updateId}/>
          </Modal>
        )
      }

      <Modal open={createCustomer} title='Tạo mới khách hàng' footer={null} onCancel={() => setCreateCustomer(false)}>
        <CreateCustomer setCreateCustomer={setCreateCustomer} store={store}/>
      </Modal>

      <Modal footer={null} open={create} title={`Thêm phiếu nợ:`} onCancel={() => {setCreate(false); setCreateId(null)}}>
        <Create setCreate={setCreate} setCreateId={setCreateId} customer={customer} id={createId} />
      </Modal>

      <Filter params={params} setParams={setParams} store={store}/>

      <Table style={{marginTop:'20px'}} loading={data==null} columns={columns} dataSource={data} pagination={pagination} onChange={handleChangeTable}/>
    </>
  )
}

export default CustomerDebt;