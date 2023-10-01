import Navbar from "./Components/Navbar";
import WhyCCS from "./Components/WhyCCS";
import Carousel from "./Components/Carousel";
import Footer from "./Components/Footer/index";
import Hero from "./Components/Hero";
import styles from "./Style/main.module.css"

function Home() {
  return (
    <div className={styles.bodybg} >
      <Navbar />
      <Hero />
      <WhyCCS />
      <Carousel />
      <Footer />
    </div>
  );
}

export default Home;
