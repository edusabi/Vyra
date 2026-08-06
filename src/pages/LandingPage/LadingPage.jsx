import React, { useState, useEffect, useRef } from "react";
import styles from "./LandingPage.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { NavLink } from "react-router-dom";

const Landing = () => {
  // ==========================================
  // TELA DE CARREGAMENTO GLOBAL
  // ==========================================
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    // Tela de loading por 2 segundos
    const timer = setTimeout(() => {
      setIsLoadingPage(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Trava a rolagem da página enquanto carrega
    if (isLoadingPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoadingPage]);

  // ==========================================
  // CARROSSEL
  // ==========================================
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef(null);

  const slides = [
    {
      id: 1,
      colorName: "PRETO",
      hex: "#000000",
      label: "01",
      img: "/Blusas/Preto/Preto V Peito.png",
    },
    {
      id: 2,
      colorName: "CINZA CLARO",
      hex: "#353B3E",
      label: "02",
      img: "/Blusas/Cinza Claro/Cinza Claro V Centro.png",
    },
    {
      id: 3,
      colorName: "AZUL MARINHO",
      hex: "#003057",
      label: "03",
      img: "/Blusas/Azul Marinho/Azul Texto Centro.png",
    },
    {
      id: 4,
      colorName: "BRANCO",
      hex: "#FFFFFF",
      label: "04",
      img: "/Blusas/Branco/Branco V Peito.png",
    },
    {
      id: 5,
      colorName: "CINZA ESCURO",
      hex: "#4A5A35",
      label: "05",
      img: "/Blusas/Cinza Escuro/Cinza Texto Peito.png",
    },
    {
      id: 6,
      colorName: "VERDE MILITAR",
      hex: "#4A5A35",
      label: "06", 
      img: "/Blusas/Verde Militar/Verde V Peito.png",
    },
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const pauseAutoPlay = () => {
    setIsPaused(true);
    clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000); 
  };

  /* =========================
     AÇÕES DO CARROSSEL
  ========================= */

  const nextSlide = () => {
    pauseAutoPlay();
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    pauseAutoPlay();
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    pauseAutoPlay();
    setCurrentSlide(index);
  };

  return (
    <>
      {isLoadingPage && (
        <div className={styles.globalLoaderOverlay}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>CARREGANDO...</p>
        </div>
      )}

      <div className={styles.container}>
        
        <main>
          <section className={styles.carouselSection}>
            <div className={styles.carouselContainer}>
              <button className={styles.arrowLeft} onClick={prevSlide}>
                &#10094;
              </button>

              <div className={styles.carouselContent}>
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`${styles.slide} ${
                      index === currentSlide ? styles.activeSlide : ""
                    }`}
                  >
                    <div className={styles.slideInfo}>
                      <span className={styles.slideNumber}>{slide.label}</span>

                      <h1 className={styles.slideTitle}>
                        VYRA <br />
                        <span className={styles.neonText}>{slide.colorName}</span>
                      </h1>

                      <p className={styles.heroDesc}>
                        Camisa Dry Fit • 100% Poliéster • Alta Respirabilidade
                        <br />
                        <br />
                        Unimos tecnologia, conforto e design para entregar
                        performance de verdade.
                      </p>

                      <NavLink to="/products" className={styles.ctaButton}>
                        GARANTIR O MEU
                      </NavLink>
                    </div>

                    <div className={styles.imageContainer}>
                      {slide.img ? (
                        <img
                          src={slide.img}
                          alt={`Camisa ${slide.colorName}`}
                          className={styles.mockupImage}
                          style={{
                            objectFit: "contain", 
                            width: "80%",
                          }} 
                        />
                      ) : (
                        <div
                          className={styles.mockupImage}
                          style={{ backgroundColor: slide.hex }}
                        >
                          <span className={styles.placeholderLabel}>
                            MOCKUP {slide.colorName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* SETA DIREITA */}
              <button className={styles.arrowRight} onClick={nextSlide}>
                &#10095;
              </button>

              {/* DOTS */}
              <div className={styles.dots}>
                {slides.map((_, index) => (
                  <span
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`${styles.dot} ${
                      index === currentSlide ? styles.activeDot : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ==========================================
              SEÇÃO DE TECNOLOGIA E ESPECIFICAÇÕES
          ========================================== */}
          <section id="tecnologia" className={styles.features}>
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
              <span className={styles.icon}>🌬️</span>
              <h3>ALTA RESPIRABILIDADE</h3>
              <p>Mantém o corpo seco</p>
            </div>
            
            {/* Novas Especificações Adicionadas */}
            <div className={styles.featureItem}>
              <span className={styles.icon}>⚖️</span>
              <h3>GRAMATURA 130</h3>
              <p>O equilíbrio perfeito de leveza</p>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.icon}>🎨</span>
              <h3>ESTAMPA DTF</h3>
              <p>Personalização em alta durabilidade</p>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.icon}>🪡</span>
              <h3>ACABAMENTO PREMIUM</h3>
              <p>Mangas com costura rebatida</p>
            </div>
          </section>

          {/* ==========================================
              SEÇÃO DE PRODUTOS
          ========================================== */}
          <section id="produtos" className={styles.products}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>NOSSA LINHA</h2>
            </div>

            <div className={styles.productGrid}>
              
              <div className={styles.productCard}>
                <div className={styles.imagePlaceholder}>
                  <img
                    src="/Blusas/Preto/Preto V Peito.png"
                    alt="Camisa Vyra Performance Preta"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", 
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div className={styles.cardContent}>
                  <span className={styles.tag}>Dry Fit</span>
                  <h3 className={styles.productName}>
                    Camisa Vyra Performance Preto
                  </h3>
                </div>
              </div>

              {/* PRODUTO 2 */}
              <div className={styles.productCard}>
                <div className={styles.imagePlaceholder}>
                  <img
                    src="/Blusas/Branco/Branco V Peito.png" 
                    alt="Camisa Vyra Performance Branco"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", 
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div className={styles.cardContent}>
                  <span className={styles.tag}>Dry Fit</span>
                  <h3 className={styles.productName}>
                    Camisa Vyra Performance Chumbo
                  </h3>
                </div>
              </div>

              {/* PRODUTO 3 */}
              <div className={styles.productCard}>
                <div className={styles.imagePlaceholder}>
                  <img
                    src="/Blusas/Cinza Escuro/Cinza V Peito.png" 
                    alt="Regata Vyra Performance Preta"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain", 
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div className={styles.cardContent}>
                  <span className={styles.tag}>Dry Fit</span>
                  <h3 className={styles.productName}>
                    Camisa Vyra Performance Preto
                  </h3>
                </div>
              </div>
            </div>
            
            <div className={styles.ctaContainer}>
                <NavLink to="/products" className={styles.ctaButton}>
                  VER MAIS...
                </NavLink>
            </div>
            
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Landing;