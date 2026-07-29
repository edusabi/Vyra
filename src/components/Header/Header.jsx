import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const Header = ({ hideBuyButton }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminLogado, setAdminLogado] = useState(false);

  const verificarAdmin = async () => {
    try {
      await axios.get('http://localhost:3000/admin/verificar', {
        withCredentials: true
      });
      setAdminLogado(true);
    } catch {
      setAdminLogado(false);
    }
  };

  useEffect(() => {
    verificarAdmin();

    window.addEventListener('adminAuthChanged', verificarAdmin);

    return () => {
      window.removeEventListener('adminAuthChanged', verificarAdmin);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/admin/logout', {}, {
        withCredentials: true
      });
      window.dispatchEvent(new Event('adminAuthChanged'));
      window.location.href = '/';
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className={styles.header}>
      {/* LOGO */}
      <div className={styles.logoContainer}>
        <span className={styles.logoVyra}>VYRA</span>
        <span className={styles.logoSub}>PERFORMANCE</span>
      </div>

      <nav
        className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
      >
        {/* Adicionando a verificação de isActive nos NavLinks */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? styles.activeLink : '')}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/atacado"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? styles.activeLink : '')}
        >
          Atacado
        </NavLink>

        {/* <NavLink
          to="/varejo"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? styles.activeLink : '')}
        >
          Varejo
        </NavLink> */}

        <NavLink
          to="/about"
          onClick={closeMenu}
          className={({ isActive }) => (isActive ? styles.activeLink : '')}
        >
          A Marca
        </NavLink>

        {/* ADMIN */}
        {adminLogado && (
          <NavLink
            to="/login/admin"
            onClick={closeMenu}
            className={({ isActive }) => 
              `${styles.adminLink} ${isActive ? styles.activeLink : ''}`
            }
          >
            Admin
          </NavLink>
        )}
      </nav>

      {/* RIGHT ACTIONS */}
      <div className={styles.rightActions}>
        {/* SAIR */}
        {adminLogado && (
          <button
            onClick={logout}
            className={styles.adminBtn}
            style={{ cursor: "pointer" }}
          >
            Sair
          </button>
        )}

        {/* COMPRAR */}
        {!hideBuyButton && (
          <NavLink to="/atacado" className={styles.navBtnLink}>
            Comprar Agora
          </NavLink>
        )}
      </div>

      {/* HAMBURGER */}
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