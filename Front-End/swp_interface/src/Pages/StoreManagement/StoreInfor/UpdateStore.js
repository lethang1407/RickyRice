import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Upload, TimePicker, Button, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { getToken } from "../../../Utils/UserInfoUtils";
import API from "../../../Utils/API/API.js";
import "./style.css";

const { TextArea } = Input;
const format = "HH:mm";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const UpdateStore = () => {
  const token = getToken();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [originalStoreData, setOriginalStoreData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatingStore";

  // Lấy dữ liệu cửa hàng ban đầu
  useEffect(() => {
    axios
      .get(API.STORE_OWNER.GET_STORE_INFO(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res)
        if (res.status === 200 && res.data.data) {
          const storeData = res.data.data; // API trả về object store trong key 'data'
          setOriginalStoreData(storeData);
          setImageUrl(storeData.image);

          // Chuyển operatingHour từ chuỗi "HH:mm - HH:mm" sang mảng [dayjs, dayjs]
          let range;
          if (storeData.operatingHour) {
            const [start, end] = storeData.operatingHour.split(" - ");
            range = [dayjs(start, format), dayjs(end, format)];
          } else {
            range = [dayjs("00:00", format), dayjs("00:00", format)];
          }

          // Set dữ liệu vào form
          form.setFieldsValue({
            storeName: storeData.storeName,
            address: storeData.address,
            hotline: storeData.hotline,
            description: storeData.description,
            operatingHour: range,
          });
        } else {
          messageApi.error("Không thể lấy thông tin cửa hàng!");
        }
      })
      .catch(() => {
        messageApi.error("Lỗi khi lấy thông tin cửa hàng!");
      });
  }, [id, form, messageApi]);

  // Hàm upload ảnh, khi upload xong thì cập nhật imageUrl và set uploadingImage về false
  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(API.PUBLIC.UPLOAD_IMG, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.code === 200) {
        setImageUrl(res.data.data);
        setIsModified(true);
        messageApi.success("Ảnh tải lên thành công!");
        onSuccess("ok");
      } else {
        messageApi.error("Tải ảnh thất bại!");
        onError(new Error("Upload failed"));
      }
    } catch (error) {
      messageApi.error("Lỗi khi tải ảnh!");
      onError(error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Theo dõi các thay đổi của form để bật/tắt nút cập nhật
  const onValuesChange = (changedValues, allValues) => {
    if (!originalStoreData) return;
    const newOperatingHour = allValues.operatingHour
      ? `${allValues.operatingHour[0].format(
          format
        )} - ${allValues.operatingHour[1].format(format)}`
      : "";
    // So sánh các trường với dữ liệu gốc (bao gồm ảnh)
    if (
      allValues.storeName !== originalStoreData.storeName ||
      allValues.address !== originalStoreData.address ||
      allValues.hotline !== originalStoreData.hotline ||
      allValues.description !== originalStoreData.description ||
      newOperatingHour !== originalStoreData.operatingHour ||
      (imageUrl && imageUrl !== originalStoreData.image)
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  };

  // Khi submit, chỉ gửi các trường có thay đổi (nếu không thay đổi thì giữ nguyên)
  const onFinish = async (values) => {
    setLoading(true);
    messageApi.open({
      key,
      type: "loading",
      content: "Đang cập nhật cửa hàng...",
    });

    // Chuyển đổi operatingHour từ mảng dayjs về chuỗi "HH:mm - HH:mm"
    const newOperatingHour = values.operatingHour
      ? `${values.operatingHour[0].format(
          format
        )} - ${values.operatingHour[1].format(format)}`
      : "";

    // Tạo payload chỉ chứa các trường có thay đổi
    const payload = {};
    payload.storeName = values.storeName;
    payload.address = values.address;
    payload.hotline = values.hotline;
    payload.description = values.description;
    payload.operatingHour = newOperatingHour;
    payload.image = imageUrl;

    // Gửi request cập nhật nếu có dữ liệu thay đổi
    if (Object.keys(payload).length === 0) {
      messageApi.warning("Không có thay đổi nào để cập nhật.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.patch(
        API.STORE_OWNER.UPDATE_STORE_INFOR(id),
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        messageApi.open({
          key,
          type: "success",
          content: "Cập nhật cửa hàng thành công!",
          duration: 3,
        });

        // Chuyển hướng sau khi cập nhật thành công
        setTimeout(() => {}, 3000);
      } else {
        messageApi.open({
          key,
          type: "error",
          content: "Cập nhật cửa hàng thất bại!",
        });
      }
    } catch (error) {
      messageApi.open({
        key,
        type: "error",
        content: "Lỗi khi cập nhật cửa hàng!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        {...layout}
        form={form}
        name="update-store"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Ảnh" required>
          <Upload
            customRequest={handleUpload}
            listType="picture-card"
            showUploadList={false}
            className="upload-wrapper"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="store" className="uploaded-image" />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name="storeName"
          label="Tên cửa hàng"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="hotline"
          label="Điện thoại liên hệ"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="operatingHour"
          label="Giờ hoạt động"
          rules={[{ required: true, message: "Vui lòng chọn giờ hoạt động!" }]}
        >
          <TimePicker.RangePicker format={format} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!isModified || uploadingImage}
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UpdateStore;
