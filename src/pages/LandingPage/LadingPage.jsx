import React, { useState, useEffect, useRef } from 'react';
import styles from './LandingPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { NavLink } from 'react-router-dom';


const Landing = () => {
  

  /* =========================
     CARROSSEL
  ========================= */

  const [currentSlide, setCurrentSlide] = useState(0);

  // controla pausa após interação manual
  const [isPaused, setIsPaused] = useState(false);

  // timeout da pausa
  const pauseTimeoutRef = useRef(null);

  const slides = [
    {
      id: 1,
      colorName: 'PRETO',
      hex: '#000000',
      label: '01',
    },
    {
      id: 2,
      colorName: 'CHUMBO',
      hex: '#353B3E',
      label: '02',
    },
    {
      id: 3,
      colorName: 'MARINHO',
      hex: '#003057',
      label: '03',
    },
    {
      id: 4,
      colorName: 'BRANCO',
      hex: '#FFFFFF',
      label: '04',
    },
    {
      id: 5,
      colorName: 'VERDE MILITAR',
      hex: '#4A5A35',
      label: '05',
    },
  ];

  /* =========================
     AUTO PLAY
  ========================= */

  useEffect(() => {

    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);

  }, [isPaused, slides.length]);

  /* =========================
     PAUSAR AUTO PLAY
  ========================= */

  const pauseAutoPlay = () => {

    setIsPaused(true);

    clearTimeout(pauseTimeoutRef.current);

    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000); // volta após 8 segundos

  };

  /* =========================
     AÇÕES
  ========================= */

  const nextSlide = () => {

    pauseAutoPlay();

    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );

  };

  const prevSlide = () => {

    pauseAutoPlay();

    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

  };

  const goToSlide = (index) => {

    pauseAutoPlay();

    setCurrentSlide(index);

  };

  return (
    <div className={styles.container}>

      {/* =========================
          MAIN
      ========================= */}
      <Header/>
      <main>

        {/* =========================
            CARROSSEL HERO
        ========================= */}

        <section className={styles.carouselSection}>

          <div className={styles.carouselContainer}>

            {/* SETA ESQUERDA */}
            <button
              className={styles.arrowLeft}
              onClick={prevSlide}
            >
              &#10094;
            </button>

            {/* SLIDES */}
            <div className={styles.carouselContent}>

              {slides.map((slide, index) => (

                <div
                  key={slide.id}
                  className={`${styles.slide} ${
                    index === currentSlide
                      ? styles.activeSlide
                      : ''
                  }`}
                >

                  {/* TEXTO */}
                  <div className={styles.slideInfo}>

                    <span className={styles.slideNumber}>
                      {slide.label}
                    </span>

                    <h1 className={styles.slideTitle}>
                      VYRA <br />
                      <span className={styles.neonText}>
                        {slide.colorName}
                      </span>
                    </h1>

                    {/* TEXTO APARECE NO MOBILE */}
                    <p className={styles.heroDesc}>
                      Camisa Dry Fit Premium •
                      Poliamida 90% com Elastano 10% •
                      UV50+
                      <br /><br />
                      Unimos tecnologia, conforto
                      e design para entregar
                      performance de verdade.
                    </p>

                    {/* BOTÃO SOME NO MOBILE VIA CSS */}
                    <NavLink
                      to="/products"
                      className={styles.ctaButton}
                    >
                      GARANTIR O MEU
                    </NavLink>

                  </div>

                  {/* IMAGEM */}
                  <div className={styles.imageContainer}>

                    <div
                      className={styles.mockupImage}
                      style={{
                        backgroundColor: slide.hex
                      }}
                    >

                      <span className={styles.placeholderLabel}>
                        MOCKUP {slide.colorName}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* SETA DIREITA */}
            <button
              className={styles.arrowRight}
              onClick={nextSlide}
            >
              &#10095;
            </button>

            {/* DOTS */}
            <div className={styles.dots}>

              {slides.map((_, index) => (

                <span
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`${styles.dot} ${
                    index === currentSlide
                      ? styles.activeDot
                      : ''
                  }`}
                />

              ))}

            </div>

          </div>

        </section>

        {/* =========================
            FEATURES
        ========================= */}

        <section
          id="tecnologia"
          className={styles.features}
        >

          <div className={styles.featureItem}>
            <span className={styles.icon}>❄️</span>
            <h3>TOQUE FRIO</h3>
            <p>Conforto térmico extremo</p>
          </div>

          <div className={styles.featureItem}>
            <span className={styles.icon}>💧</span>
            <h3>SECAGEM RÁPIDA</h3>
            <p>Mais conforto no treino</p>
          </div>

          <div className={styles.featureItem}>
            <span className={styles.icon}>☀️</span>
            <h3>PROTEÇÃO UV 50+</h3>
            <p>Proteção para o dia todo</p>
          </div>

          <div className={styles.featureItem}>
            <span className={styles.icon}>🌬️</span>
            <h3>ALTA RESPIRABILIDADE</h3>
            <p>Mantém o corpo seco</p>
          </div>

        </section>

        {/* =========================
            PRODUTOS
        ========================= */}

        <section
          id="produtos"
          className={styles.products}
        >

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              NOSSA LINHA
            </h2>
          </div>

          <div className={styles.productGrid}>

            {/* PRODUTO 1 */}
            <div className={styles.productCard}>

              <div className={styles.imagePlaceholder}>
                <span className={styles.mockupText}>
                  CAMISA PRETA
                </span>
              </div>

              <div className={styles.cardContent}>

                <span className={styles.tag}>
                  Dry Premium
                </span>

                <h3 className={styles.productName}>
                  Camisa Vyra Performance Preto
                </h3>

              </div>

            </div>

            {/* PRODUTO 2 */}
            <div className={styles.productCard}>

              <div className={styles.imagePlaceholder}>
                <span className={styles.mockupText}>
                  CAMISA CHUMBO
                </span>
              </div>

              <div className={styles.cardContent}>

                <span className={styles.tag}>
                  Dry Premium
                </span>

                <h3 className={styles.productName}>
                  Camisa Vyra Performance Chumbo
                </h3>

              </div>

            </div>

            {/* PRODUTO 3 */}
            <div className={styles.productCard}>

              <div className={styles.imagePlaceholder}>
                <span className={styles.mockupText}>
                  REGATA PRETA
                </span>
              </div>

              <div className={styles.cardContent}>

                <span className={styles.tag}>
                  Lançamento
                </span>

                <h3 className={styles.productName}>
                  Regata Vyra Performance Preto
                </h3>


              </div>

            </div>
              <NavLink
                to="/products"
                className={styles.ctaButton}
                >
                COMPRAR AGORA
              </NavLink>

          </div>

        </section>

      </main>
        
        <Footer/>

    </div>
  );
};

export default Landing;