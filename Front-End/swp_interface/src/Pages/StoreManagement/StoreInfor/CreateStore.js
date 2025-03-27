import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Upload, TimePicker, Button, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { getToken } from "../../../Utils/UserInfoUtils";
import API from "../../../Utils/API/API.js";

const { TextArea } = Input;
const format = "HH:mm";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const CreateStore = () => {
  const token = getToken();
  const { transactionNo } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "creatingStore";

  const startTime = dayjs("00:00", format);
  const endTime = dayjs("00:00", format);

  // Upload ảnh lên API
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(API.PUBLIC.UPLOAD_IMG, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.code === 200) {
        setImageUrl(res.data.data);
        messageApi.success("Ảnh tải lên thành công!");
        onSuccess("ok");
      } else {
        messageApi.error("Tải ảnh thất bại!");
        onError(new Error("Upload failed"));
      }
    } catch (error) {
      messageApi.error("Lỗi khi tải ảnh!");
      onError(error);
    }
  };

  const onFinish = async (values) => {
    if (!imageUrl) {
      messageApi.error("Vui lòng tải lên ảnh!");
      return;
    }

    setLoading(true);

    messageApi.open({
      key,
      type: "loading",
      content: "Đang tạo cửa hàng...",
    });

    try {
      const operatingHour = `${values.operatingHour[0].format(
        format
      )} - ${values.operatingHour[1].format(format)}`;

      const payload = {
        storeName: values.storeName,
        address: values.address,
        hotline: values.hotline,
        description: values.description,
        operatingHour,
        image: imageUrl,
      };

      const res = await axios.post(
        API.STORE_OWNER.CREATE_NEW_STORE(transactionNo),
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
          content: "Tạo cửa hàng thành công!",
          duration: 3,
        });

        const res = await axios.post(
          API.AUTH.REFRESH,
          { token: token },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.data.success) {
          if (localStorage.getItem("token") != null) {
            localStorage.setItem("token", res.data.data.token);
          } else if (sessionStorage.getItem("token") != null) {
            sessionStorage.setItem("token", res.data.data.token);
          }
        }

        setTimeout(() => {
          navigate("/store-owner/store");
        }, 3000);
      } else {
        messageApi.open({
          key,
          type: "error",
          content: "Tạo cửa hàng thất bại!",
        });
      }
    } catch (error) {
      messageApi.open({
        key,
        type: "error",
        content: "Lỗi khi tạo cửa hàng!",
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
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
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
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^0\d{9}$/,
              message: "Số điện thoại không đúng. Vui lòng nhập lại!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="operatingHour"
          label="Giờ hoạt động"
          rules={[{ required: true, message: "Vui lòng chọn giờ hoạt động!" }]}
        >
          <TimePicker.RangePicker
            defaultValue={[startTime, endTime]}
            format={format}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Ảnh" required>
          <Upload
            customRequest={handleUpload}
            listType="picture-card"
            showUploadList={false}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="store" style={{ width: "100%" }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo cửa hàng
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateStore;
