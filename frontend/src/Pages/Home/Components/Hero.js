import styles from "../Style/hero.module.css"
import heroImg from "../Assets/heroImg.svg"
import logo from "../Assets/white-logo.png"



function Hero() {
  return (
    
    <div className={styles.heroContainer}>
      <img src={logo} alt="ccs-logo" className={styles.logo}/>
      <img src={heroImg} alt="hero-bg-img" className={styles.heroImg}/>
    
      <div className={styles.buttons}> 
        <a href="/login"><input type="button" value="Login" className={`${styles.button} ${styles.loginButton}`} /></a>
        <a href="/signup"><input type="button" value="Register for test" className={`${styles.button} ${styles.registerButton}`} /></a>
      </div>
    
    </div>
  )
}

export default Hero