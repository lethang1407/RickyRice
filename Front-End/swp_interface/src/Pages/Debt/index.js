import { Space, Table, Tag, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import { getToken } from '../../Utils/UserInfoUtils';
import { getDataWithToken } from '../../Utils/FetchUtils';
import Filter from './filter';

function Debt(){
  const { Search } = Input;
  const token = getToken();
  const [data, setData] = useState(null);
  const [params, setParams] = useState(null);

  useEffect(()=>{
    const getData = async () =>{
      const response = await getDataWithToken('http://localhost:9999/debt?', token);
      setData(response.data.data)
    }
    getData();
  },[])

  const columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    }
  ]
  
  return (
    <>  
      <Filter params={params} setParams={setParams}/>
      <Table loading={data==null} columns={columns} dataSource={data} pagination/>
    </>
  )
}

export default Debt;