import { SmileOutlined} from '@ant-design/icons'
export const error = (str, messageApi) => {
  messageApi.open({
    type: 'error',
    content: str,
    duration: 3,
  });
};

export const success = (str, messageApi) => {
  messageApi.open({
    type: 'success',
    content: str,
    duration: 3,
  });
};

  export const successWSmile = (str, messageApi) => {
    messageApi.open({
      icon: <SmileOutlined />,
      content: 'Hello Friend',
      duration: 3,
      className: 'success-message'
    });
  };