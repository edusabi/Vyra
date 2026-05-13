import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // EFEITO PARA TRAVAR A ROLAGEM
  useEffect(() => {
    if (isMenuOpen) {
      // Quando o menu abre, trava o scroll da página
      document.body.style.overflow = 'hidden';
    } else {
      // Quando o menu fecha, devolve o scroll da página
      document.body.style.overflow = 'auto';
    }

    // Função de limpeza de segurança: se o componente for destruído, devolve o scroll
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]); // O useEffect é executado toda vez que isMenuOpen muda

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      {/* 1. LOGO */}
      <div className={styles.logoContainer}>
        <span className={styles.logoVyra}>VYRA</span>
        <span className={styles.logoSub}>PERFORMANCE</span>
      </div>

      {/* 2. MENU DE NAVEGAÇÃO */}
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/products" onClick={closeMenu}>Produtos</NavLink>
        <NavLink to="/about" onClick={closeMenu}>A Marca</NavLink>
      </nav>

      {/* 3. BOTÃO (Agora solto no header) */}
      <NavLink to="/products" className={styles.navBtnLink}>
        Comprar Agora
      </NavLink>

      {/* 4. TOGGLE HAMBÚRGUER (Agora solto no header) */}
      <div 
        className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
};

export default Header;