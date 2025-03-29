import { useEffect, useState } from "react";
import { getToken } from "../../Utils/UserInfoUtils";
import { getDataWithToken } from "../../Utils/FetchUtils";
import { Button, Modal, Table } from "antd";
import Filter from "./filter";
import Create from "./create";

function Package(){
  const token = getToken();
  const [data, setData] = useState(null);
  const [sorter, setSorter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(null);
  const [open, setOpen] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 20, 
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20']
  });

  const handleChangeTable = (pagination, filters, sorter) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
    setSorter(`${sorter.field}:${sorter.order}`);
  }

  const getData = async () =>{
    const response = await getDataWithToken(`http://localhost:9999/package?pageNo=${pagination.current ? pagination.current : 1}&pageSize=${pagination.pageSize ? pagination.pageSize : 10}&sortBy=${sorter ? sorter : ''}&${params ? params : ''}`, token);
    setData(response.data.data);
    setPagination((prev) => ({
      ...prev,
      current: response.data.pageNo,
      pageSize: response.data.pageSize,
      total: response.data.pageSize * response.data.totalPages
    }))
  }

  useEffect(()=>{
    getData();
  },[pagination.current, pagination.pageSize, loading, sorter, params, open])

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số Kg',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: true
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  const handleOpenModal = () => {
    setOpen(true);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  return (
    <>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
        <h2>Danh sách Quy cách đóng gói</h2>
        <Button style={{marginRight:'20px'}} type="primary" onClick={handleOpenModal}>
          Tạo mới Quy cách đóng gói
        </Button>
      </div>
      <Modal title="Tạo mới Quy cách đóng gói" onOk={handleOpenModal} open={open} onCancel={handleCloseModal} onClose={handleCloseModal} footer={null}>
        <Create handleCloseModal={handleCloseModal} handleOpenModal={handleOpenModal}/>
      </Modal>
      <Filter params={params} setParams={setParams}/>
      <Table loading={data==null} columns={columns} dataSource={data} pagination={pagination} onChange={handleChangeTable}/>
    </>
  )
}

export default Package;