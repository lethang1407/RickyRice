import './style.scss';
import { FacebookOutlined, InstagramOutlined, GoogleOutlined,TwitterOutlined,YoutubeOutlined} from '@ant-design/icons';
function CustomFooter(){
  return(
    <>
      <div className="footer">
        <div className='footer__icon'>
          <div className='footer__icon__i'>
            <FacebookOutlined />
          </div>
          <div className='footer__icon__i'>
            <InstagramOutlined />
          </div>
          <div className='footer__icon__i'>
            <GoogleOutlined />
          </div>
          <div className='footer__icon__i'>
            <TwitterOutlined />
          </div>
          <div className='footer__icon__i'>
            <YoutubeOutlined />
          </div>
        </div>
        <div className='footer__item'>
            <div className='footer__item__title'>
                Home
            </div>
            <div className='footer__item__title'>
               News
            </div>
            <div className='footer__item__title'>
              About
            </div>
            <div className='footer__item__title'>
              Our Company
            </div>
            <div className='footer__item__title'>
              Contact Us
            </div>
        </div> 
        <div className='footer__end'>
          <div className='footer__end__title'>@Copyright by Regera All-rights reserved.</div>
        </div>
      </div>
    </>
  )
}

export default CustomFooter;