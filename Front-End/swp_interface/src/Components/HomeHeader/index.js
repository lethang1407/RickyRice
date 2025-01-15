import '../../assets/css/main.css';
import '../../assets/css/style.css';

function HomeHeader(){
  return (
    <div class="header">
		<div class="container">
			<div class="row">
				<div class="col-xl-12">
					<div class="header__navbar">
						<img src="./assets/img/logo.png" alt="logo" class="header__navbar__img"/>
						<div class="header__navbar__menu">
							<div class="header__navbar__menu__item">Home</div>
							<div class="header__navbar__menu__item">About</div>
							<div class="header__navbar__menu__item">Work Process</div>
							<div class="header__navbar__menu__item">Pricing Tables</div>
							<div class="header__navbar__menu__item">Blog Entries</div>
							<div class="header__navbar__menu__item">Contact Us</div>
							<div class="header__navbar__menu__item">Login</div>
							<div class="header__navbar__menu__item">Register</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  )
}

export default HomeHeader;
