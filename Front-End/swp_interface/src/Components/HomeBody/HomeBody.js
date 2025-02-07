import '../../assets/css/main.css';
import '../../assets/css/style.css';
import image1 from '../../assets/img/featured-item-01.png';
import leftimage from '../../assets/img/pngegg.png';
import rightimage from '../../assets/img/pngegg.png';
import LeftLeft from '../../Utils/Animation/LeftLeft';
import RightRight from '../../Utils/Animation/RightRight';
import Down from '../../Utils/Animation/Down';

function HomeBody(){

  return (
    <>
      <div class="section-one">
        <div class="container">
          <div class="row">
            <div class="col-xl-12">
              <div class="section-one__text">
                <h2 class="section-one__text__h2">We provide the best <b>strategy</b> to grow up your <b>business</b></h2>
                <h4 class="section-one__text__h4">Ricky Rice is the ultimate platform for renting professional websites to sell rice and agricultural products online!</h4>
                <div class="section-one__text__button">
                  DISCOVER MORE
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="section-one__block">
              <div class="row">
                  <div class="section-one__block__item col-xl-4">
                    <LeftLeft>
                      <div class="section-one__block__item__inner">
                        <img src={image1} alt="" class="section-one__block__item__inner__img"/>
                        <div class="section-one__block__item__inner__h3">
                          Modern Strategy
                        </div>
                        <div class="section-one__block__item__inner__text">
                          Customize anything in this template to fit your website needs
                        </div>
                      </div>
                    </LeftLeft>
                  </div>
                <div class="section-one__block__item col-xl-4">
                  <Down>
                    <div class="section-one__block__item__inner">
                      <img src={image1} alt="" class="section-one__block__item__inner__img"/>
                      <div class="section-one__block__item__inner__h3">
                        Modern Strategy
                      </div>
                      <div class="section-one__block__item__inner__text">
                        Customize anything in this template to fit your website needs
                      </div>
                    </div>
                  </Down>
                </div>
                <div class="section-one__block__item col-xl-4">
                  <RightRight>
                    <div class="section-one__block__item__inner">
                      <img src={image1} alt="" class="section-one__block__item__inner__img"/>
                      <div class="section-one__block__item__inner__h3">
                        Modern Strategy
                      </div>
                      <div class="section-one__block__item__inner__text">
                        Customize anything in this template to fit your website needs
                      </div>
                    </div>
                  </RightRight>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-two">
        <div class="container">
          <div class="row">
            <div class="col-xl-12">
              <div class="section-two__upper">
                <div class="row">
                  <div class="section-two__upper__img col-xl-4">
                    <LeftLeft><img src={rightimage} alt="" class="section-two__upper__img__inner"/></LeftLeft>
                  </div>
                  <div class="col-xl-1"></div>
                  <div class="section-two__upper__text col-xl-6">
                    <RightRight>
                      <h3 class="section-two__upper__text__h3">Let's discuss about your project</h3>
                      <h5 class="section-two__upper__text__h5">
                        Nullam sit amet purus libero. Etiam ullamcorper nisl ut augue blandit, at finibus leo efficitur. Nam
                        gravida purus non sapien auctor, ut aliquam magna ullamcorper.
                      </h5>
                    </RightRight>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="section-two__straight"></div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-xl-12">
              <div class="section-two__upper">
                <div class="row">
                  <div class="section-two__upper__text col-xl-6">
                    <LeftLeft>
                      <h3 class="section-two__upper__text__h3">Let's discuss about your project</h3>
                      <h5 class="section-two__upper__text__h5">
                        Nullam sit amet purus libero. Etiam ullamcorper nisl ut augue blandit, at finibus leo efficitur. Nam
                        gravida purus non sapien auctor, ut aliquam magna ullamcorper.
                      </h5>
                    </LeftLeft>
                  </div>
                  <div class="col-xl-1"></div>
                  <div class="section-two__upper__img col-xl-4">
                    <RightRight><img src={leftimage} alt="" class="section-two__upper__img__inner"/></RightRight>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section-three">
        <div class="container">
          <div class="row">
            <div class="col-xl-12">
              <div class="section-three__inner">
                <h2 class="section-three__inner__title">Work Process</h2>
                <p class="section-three__inner__text">Aenean nec tempor metus. Maecenas ligula dolor, commodo in imperdiet
                  interdum, vehicula ut ex. Donec ante diam.</p>
                <div class="section-three__process">
                  <div class="row">
                    <div class="col-xl-2">
                      <div class="section-three__process__item">
                        <img class="section-three__process__item__img" src="./assets/img/work-process-item-01.png"
                          alt="Process"/>
                        <h3 class="section-three__process__item__title">Get Ideas</h3>
                        <h5 class="section-three__process__item__text">Godard pabst prism fam cliche</h5>
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="section-three__process__item">
                        <img class="section-three__process__item__img" src="./assets/img/work-process-item-01.png"
                          alt="Process"/>
                        <h3 class="section-three__process__item__title">Get Ideas</h3>
                        <h5 class="section-three__process__item__text">Godard pabst prism fam cliche</h5>
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="section-three__process__item">
                        <img class="section-three__process__item__img" src="./assets/img/work-process-item-01.png"
                          alt="Process"/>
                        <h3 class="section-three__process__item__title">Get Ideas</h3>
                        <h5 class="section-three__process__item__text">Godard pabst prism fam cliche</h5>
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="section-three__process__item">
                        <img class="section-three__process__item__img" src="./assets/img/work-process-item-01.png"
                          alt="Process"/>
                        <h3 class="section-three__process__item__title">Get Ideas</h3>
                        <h5 class="section-three__process__item__text">Godard pabst prism fam cliche</h5>
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="section-three__process__item">
                        <img class="section-three__process__item__img" src="./assets/img/work-process-item-01.png"
                          alt="Process"/>
                        <h3 class="section-three__process__item__title">Get Ideas</h3>
                        <h5 class="section-three__process__item__text">Godard pabst prism fam cliche</h5>
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="section-three__process__item">
                        <img class="section-three__process__item__img" src="./assets/img/work-process-item-01.png"
                          alt="Process"/>
                        <h3 class="section-three__process__item__title">Get Ideas</h3>
                        <h5 class="section-three__process__item__text">Godard pabst prism fam cliche</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section-four">
        <div class="container">
          <div class="row">
            <div class="col-xl-12">
              <div class="section-four__inner">
                <h2 class="section-four__inner__title">
                  What do they say?
                </h2>
                <h4 class="section-four__inner__text">Donec tempus, sem non rutrum imperdiet, lectus orci fringilla nulla,
                  at accumsan elit eros a turpis. Ut sagittis lectus libero.</h4>
                <div class="section-four__inner__box">
                  <div class="row">
                    <div class="col-xl-4">
                      <div class="section-four__inner__box__item">
                        <img class="section-four__inner__box__item__img" src="./assets/img/testimonial-icon.png" alt="Test"/>
                        <div class="section-four__inner__box__item__text">Proin a neque nisi. Nam ipsum nisi, venenatis ut
                          nulla quis, egestas scelerisque orci. Maecenas a finibus odio.</div>
                        <div class="section-four__inner__box__item__author">
                          <img class="section-four__inner__box__item__author__img" src="./assets/img/60x60.png" alt="IMG"/>
                          <div class="section-four__inner__box__item__author__des">
                            <div class="section-four__inner__box__item__author__des__name">Catherine Soft</div>
                            <div class="section-four__inner__box__item__author__des__pos">Managing Director</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <div class="section-four__inner__box__item">
                        <img class="section-four__inner__box__item__img" src="./assets/img/testimonial-icon.png" alt="Test"/>
                        <div class="section-four__inner__box__item__text">Proin a neque nisi. Nam ipsum nisi, venenatis ut
                          nulla quis, egestas scelerisque orci. Maecenas a finibus odio.</div>
                        <div class="section-four__inner__box__item__author">
                          <img class="section-four__inner__box__item__author__img" src="./assets/img/60x60.png" alt="IMG"/>
                          <div class="section-four__inner__box__item__author__des">
                            <div class="section-four__inner__box__item__author__des__name">Catherine Soft</div>
                            <div class="section-four__inner__box__item__author__des__pos">Managing Director</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <div class="section-four__inner__box__item">
                        <img class="section-four__inner__box__item__img" src="./assets/img/testimonial-icon.png" alt="Test"/>
                        <div class="section-four__inner__box__item__text">Proin a neque nisi. Nam ipsum nisi, venenatis ut
                          nulla quis, egestas scelerisque orci. Maecenas a finibus odio.</div>
                        <div class="section-four__inner__box__item__author">
                          <img class="section-four__inner__box__item__author__img" src="./assets/img/60x60.png" alt="IMG"/>
                          <div class="section-four__inner__box__item__author__des">
                            <div class="section-four__inner__box__item__author__des__name">Catherine Soft</div>
                            <div class="section-four__inner__box__item__author__des__pos">Managing Director</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-five">
        <div class="container">
          <div class="row">
            <div class="col-xl-12">
              <div class="section-five__inner">
                <h2 class="section-five__inner__title">Pricing Plans</h2>
                <p class="section-five__inner__text">Donec vulputate urna sed rutrum venenatis. Cras consequat magna quis
                  arcu elementum, quis congue risus volutpat.</p>
                <div class="section-five__inner__box">
                  <div class="row">
                    <div class="col-xl-4">
                      <div class="section-five__inner__box__item">
                        <div class="section-five__inner__box__item__title">Starter</div>
                        <div class="section-five__inner__box__item__price">
                          <div class="section-five__inner__box__item__price__value">$14.50</div>
                          <div class="section-five__inner__box__item__price__period">monthly</div>
                        </div>
                        <div class="section-five__inner__box__item__des">
                          <div class="section-five__inner__box__item__des__info">60GB space</div>
                          <div class="section-five__inner__box__item__des__info">600 GB transfer</div>
                          <div class="section-five__inner__box__item__des__info">Pro Design Panel</div>
                          <div class="section-five__inner__box__item__des__info" style={{textDecoration: 'line-through'}}>
                            15-minute support</div>
                          <div class="section-five__inner__box__item__des__info" style={{textDecoration: 'line-through'}}>
                            Unlimited Emails</div>
                          <div class="section-five__inner__box__item__des__info" style={{textDecoration: 'line-through'}}>24/7
                            Security</div>
                        </div>
                        <div class="section-five__inner__box__item__button button--violet">PURCHASE NOW</div>
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <div class="section-five__inner__box__item">
                        <div class="section-five__inner__box__item__title">Premium</div>
                        <div class="section-five__inner__box__item__price" style={{backgroundColor:'#ff589e'}}>
                          <div class="section-five__inner__box__item__price__value">$21.50</div>
                          <div class="section-five__inner__box__item__price__period">monthly</div>
                        </div>
                        <div class="section-five__inner__box__item__des">
                          <div class="section-five__inner__box__item__des__info">60GB space</div>
                          <div class="section-five__inner__box__item__des__info">600 GB transfer</div>
                          <div class="section-five__inner__box__item__des__info">Pro Design Panel</div>
                          <div class="section-five__inner__box__item__des__info">15-minute support</div>
                          <div class="section-five__inner__box__item__des__info" style={{textDecoration: 'line-through'}}>
                            Unlimited Emails</div>
                          <div class="section-five__inner__box__item__des__info" style={{textDecoration: 'line-through'}}>24/7
                            Security</div>
                        </div>
                        <div class="section-five__inner__box__item__button button--violet">PURCHASE NOW</div>
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <div class="section-five__inner__box__item">
                        <div class="section-five__inner__box__item__title">Advanced</div>
                        <div class="section-five__inner__box__item__price">
                          <div class="section-five__inner__box__item__price__value">$42.00</div>
                          <div class="section-five__inner__box__item__price__period">monthly</div>
                        </div>
                        <div class="section-five__inner__box__item__des">
                          <div class="section-five__inner__box__item__des__info">60GB space</div>
                          <div class="section-five__inner__box__item__des__info">600 GB transfer</div>
                          <div class="section-five__inner__box__item__des__info">Pro Design Panel</div>
                          <div class="section-five__inner__box__item__des__info">15-minute support</div>
                          <div class="section-five__inner__box__item__des__info">Unlimited Emails</div>
                          <div class="section-five__inner__box__item__des__info">24/7 Security</div>
                        </div>
                        <div class="section-five__inner__box__item__button button--violet">PURCHASE NOW</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-six">
        <div class="container">
          <div class="row">
            <div class="section-six__item col-xl-3">
              <div class="section-six__item__num">126</div>
              <div class="section-six__item__name">Projects</div>
            </div>
            <div class="section-six__item col-xl-3">
              <div class="section-six__item__num">63</div>
              <div class="section-six__item__name">Happy Clients</div>
            </div>
            <div class="section-six__item col-xl-3">
              <div class="section-six__item__num">18</div>
              <div class="section-six__item__name">Award Wins</div>
            </div>
            <div class="section-six__item col-xl-3">
              <div class="section-six__item__num">27</div>
              <div class="section-six__item__name">Countries</div>
            </div>
          </div>
        </div>
      </div>

     
    </>
  )
}

export default HomeBody;