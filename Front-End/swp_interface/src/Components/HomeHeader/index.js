import '../../assets/css/main.css';
import '../../assets/css/style.css';
import logo from '../../assets/img/logoviet.png'
import Down from '../../Utils/Animation/Down';
import Upper from '../../Utils/Animation/Upper';
import { useNavigate } from 'react-router-dom';

function HomeHeader(){
	const navigate = useNavigate();
  const naviLogin = () =>{
    navigate('/login');
  }
  const naviRegister = () =>{
    navigate('/register');
  }
  return (
    <Upper>
			<div class="header">
				<div class="container">
					<div class="row">
						<div class="col-xl-12">
							<div class="header__navbar">
								<img style={{width:'90px', marginRight:'100px'}} src={logo} alt="logo" class="header__navbar__img"/>
								<div class="header__navbar__menu">
									<div class="header__navbar__menu__item">Home</div>
									<div class="header__navbar__menu__item">About</div>
									<div class="header__navbar__menu__item">Work Process</div>
									<div class="header__navbar__menu__item">Pricing Tables</div>
									<div class="header__navbar__menu__item">Blog Entries</div>
									<div class="header__navbar__menu__item">Contact Us</div>
									<div onClick={naviLogin} class="header__navbar__menu__item">Login</div>
									<div onClick={naviRegister} class="header__navbar__menu__item">Register</div>
								</div>
							</div>
						</div>
					</div>
				</div>
		</div>
		</Upper>
  )
}

export default HomeHeader;
