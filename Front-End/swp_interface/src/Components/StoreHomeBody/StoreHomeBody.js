import '../../assets/css/main.css';
import '../../assets/css/style.css';
import { Table, Divider, Tag } from 'antd';
import { Button } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;

function StoreHomeBody({ products }) {
  return (
    <>
      <div className="section-one">
        <div className="container">
          <div className="row" style={{marginTop: "200px"}}>
            {/* Table Ant Design */}
            <Table dataSource={products} rowKey="productId">
              <ColumnGroup title="Product Information">
                <Column title="Product Name" dataIndex="name" key="name" />
                <Column title="Price" dataIndex="price" key="price" />
                <Column
                title="Categories"
                dataIndex="categoryDTO"
                key="categoryDTO"
                render={category => (
                  category && category.name ? (
                    <Tag color="blue" key={category.id}>
                      {category.name}  {/* Hiển thị tên danh mục */}
                    </Tag>
                  ) : (
                    <span>Không có danh mục</span> // Nếu không có category hoặc name, hiển thị thông báo
                  )
                )}
              />
              <Column
                title="Action"
                key="action"
                render={(text, record) => (
                  <span>
                    <Button type="dashed" icon={<InfoCircleTwoTone/>}></Button>
                  </span>
                )}
              />
              </ColumnGroup>
              
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default StoreHomeBody;
