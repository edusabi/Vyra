import styles from './About.module.css';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const About = () => {
  return (
    <div>
      <Header />

      <section
        id="sobre"
        className={styles.about}
      >
        <div className={styles.aboutContent}>

          <h2>SOBRE A MARCA</h2>

          <p>
            A Vyra Performance nasceu
            para movimentar pessoas que
            buscam mais do que resultado:
            buscam evolução constante.
          </p>

          <p>
            Nossa composição de
            <strong>
              {' '}Poliamida 90% e
              Elastano 10%
            </strong>
            {' '}garante um design
            minimalista, leve e durável.
          </p>

          <div className={styles.aboutTags}>
            <span>FORTE</span> •
            <span> MODERNA</span> •
            <span> AUTÊNTICA</span>
          </div>

          {/* REDES SOCIAIS */}
         <div className={styles.socials}>

  <a
    href="https://www.instagram.com/vyra_performance_"
    target="_blank"
    rel="noopener noreferrer"
    className={`${styles.socialButton} ${styles.instagram}`}
  >
    <FaInstagram />
    <span>Instagram</span>
  </a>

  <a
    href="https://wa.me/5581999999999"
    target="_blank"
    rel="noopener noreferrer"
    className={`${styles.socialButton} ${styles.whatsapp}`}
  >
    <FaWhatsapp />
    <span>WhatsApp</span>
  </a>

</div>

        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default About;