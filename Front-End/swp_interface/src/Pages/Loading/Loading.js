import { Spin } from 'antd';
import './style.scss'
function Loading(){
  return (
    <>
      <div className='overlay'></div>
      <div className='spin'> <Spin size="large" /></div>
    </>
  )
}

export default Loading;