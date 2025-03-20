import { Table, Image, Button, Select, Form, Input, Row, Col, DatePicker } from "antd";
import dayjs from 'dayjs';
import noimg from '../../../assets/img/notavailable.jpg'
import { useEffect, useState } from "react";
import { getToken } from "../../../Utils/UserInfoUtils";
import { getDataWithToken } from "../../../Utils/FetchUtils";

function Detail(props){
  const token = getToken();
  const [params, setParams] = useState(null);
  const { id } = props;
  const [detail, setDetail] = useState();
  const [sorter, setSorter] = useState(null);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 20, 
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20']
  });


  const getDetail = async (id) => {
    const response = await getDataWithToken(`http://localhost:9999/debt/customer-debt/${id}?pageNo=${pagination.current ? pagination.current : 1}&pageSize=${pagination.pageSize ? pagination.pageSize : 5}&${params ? params : ''}&sortBy=${sorter ? sorter : ''}`, token);
    setDetail(response.data.data);
    setPagination((prev) => ({
      ...prev,
      current: response.data.pageNo,
      pageSize: response.data.pageSize,
      total: response.data.pageSize * response.data.totalPages
    }))
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
    setParams(null);
    form.resetFields();
  },[id])

  useEffect(() => {
    getDetail(id);
  }, [id, pagination.current, pagination.pageSize, sorter, params])

  const onFormChange = (changedValues, allValues) => {
        const filterParams = Object.fromEntries(
          Object.entries(allValues).filter(
            ([_, value]) => value !== undefined && value !== null && 
            (typeof value !== 'string' || value.trim() !== '')
          )
        );
      
        if (filterParams.startCreatedAt) {
          filterParams.startCreatedAt = dayjs(filterParams.startCreatedAt).format('YYYY-MM-DD');
        }
      
        if (filterParams.endCreatedAt) {
          filterParams.endCreatedAt = dayjs(filterParams.endCreatedAt).format('YYYY-MM-DD');
        }
      
        const queryString = new URLSearchParams(filterParams).toString();
        setParams(queryString);
      };

  const columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      sorter: true
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
      sorter: true
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
      render: (src) => <Image width={50} src={src ? src : noimg} alt="Ảnh mô tả" />,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (text ? dayjs(text).format("HH:mm:ss DD/MM/YYYY") : "-"),
      sorter: true
    }
  ]

  const options = [
    {
      value: 'POSITIVE',
      label: 'Positive',
    },
    {
      value: 'NEGATIVE',
      label: 'Negative',
    }
    ];


  return (
    <>
      <>
        <Form form={form} onValuesChange={onFormChange} name="basic" layout="vertical">
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item label="Debt Number" name="number">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Debt Type" name="type">
                <Select allowClear options={options}/>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Amount From" name="fromAmount">
                <Input type='number'/>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Amount To" name="toAmount">
                <Input type='number'/>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Created By" name="createdBy">
                <Input />
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item label="Created From" name="startCreatedAt">
                <DatePicker format="YYYY-MM-DD" 
                    onChange={(date, dateString) => console.log(dateString)}  
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label="Created To" name="endCreatedAt">
                <DatePicker format="YYYY-MM-DD" 
                    onChange={(date, dateString) => console.log(dateString)}  />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
      <Table loading={detail==null} columns={columns} dataSource={detail} pagination={pagination} onChange={handleChangeTable}/>
    </>
  )
}

export default Detail;