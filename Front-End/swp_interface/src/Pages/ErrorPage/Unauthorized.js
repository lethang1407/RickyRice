import "./style.css"

function Unauthorized(){
  return (
    <div className="unauthorized">
      <h1>401 Unauthorized</h1>
        <p class="zoom-area"><b>!!!</b> you are not authorized to go to this page. </p>
        <section class="error-container">
          <span>4</span>
          <span><span class="screen-reader-text">0</span></span>
          <span>1</span>
        </section>
        <div class="link-container">
          <a href="/" class="more-link">Back to Home</a>
      </div>
    </div>
  )
}

export default Unauthorized;