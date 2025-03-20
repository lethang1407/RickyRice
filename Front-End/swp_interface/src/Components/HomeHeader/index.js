import "../../assets/css/main.css";
import "../../assets/css/style.css";
import logo from "../../assets/img/logo-no-background.png";
import Upper from "../../Utils/Animation/Upper";
import { useNavigate } from "react-router-dom";
import { getToken, logout, getRole } from "../../Utils/UserInfoUtils";
import Loading from "../../Pages/Loading/Loading";
import { useState } from "react";
import { successWSmile } from "../../Utils/AntdNotification";
import { scroller } from "react-scroll";
import { message } from "antd";

function HomeHeader() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const role = getRole();
  const navigate = useNavigate();
  const naviLogin = () => {
    navigate("/login");
  };
  const naviRegister = () => {
    navigate("/register");
  };
  const handleLogout = () => {
    setLoading(true);
    successWSmile("See you later!", messageApi);
    logout();
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
  };
  const naviDashboard = () => {
    console.log(role);
    if (role == "ADMIN") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/admin");
      }, 1000);
    } else if (role == "EMPLOYEE") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/employee/products");
      }, 1000);
    } else if (role == "STORE_OWNER") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/store-owner/store");
      }, 1000);
    }
  };

    const scrollToSection = (str) => {
      scroller.scrollTo(str, {
        duration: 300,
        delay: 0,
        smooth: "easeInOutQuart",
      });
    }

  return (
    <>
      {contextHolder}
      {loading && <Loading />}
      <Upper>
        <div class="header" >
          <div class="container">
            <div class="row">
              <div class="col-xl-12">
                <div class="header__navbar" style={{padding:'20px 0px'}}>
                  <img
                    style={{marginRight: "100px", height:'60px' }}
                    src={logo}
                    alt="logo"
                    class="header__navbar__img"
                  />
                  <div style={{padding:'10px 0px'}} class="header__navbar__menu">
                    <div onClick={() => scrollToSection("head")} class="header__navbar__menu__item">Trang chủ</div>
                    <div onClick={() => scrollToSection("introduction")} class="header__navbar__menu__item">Giới thiệu</div>
                    <div
                      className="header__navbar__menu__item"
                      onClick={() =>
                        (window.location.href = "/subscriptionPlan")
                      }
                    >
                      Gói đăng ký
                    </div>
                    <div onClick={() => scrollToSection("feedback")} class="header__navbar__menu__item">Feedback</div>
                    <div onClick={() => scrollToSection("lienhe")} class="header__navbar__menu__item">Liên hệ</div>
                    {token ? (
                      <>
                        <div
                          onClick={naviDashboard}
                          class="header__navbar__menu__item"
                        >
                          Dashboard
                        </div>
                        <div
                          onClick={handleLogout}
                          class="header__navbar__menu__item"
                        >
                          Đăng xuất
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          onClick={naviLogin}
                          class="header__navbar__menu__item"
                        >
                          Đăng nhập
                        </div>
                        <div
                          onClick={naviRegister}
                          class="header__navbar__menu__item"
                        >
                          Đăng ký
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Upper>
    </>
  );
}

export default HomeHeader;
