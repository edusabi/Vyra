import React, {
  useState,
  useEffect
} from 'react';

import styles from './Header.module.css';

import {
  NavLink
} from 'react-router-dom';

import axios from 'axios';

const Header = () => {

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [adminLogado, setAdminLogado] =
    useState(false);

  /*
  ========================================
  VERIFICAR ADMIN
  ========================================
  */

  const verificarAdmin = async () => {

    try {

      await axios.get(
        'http://localhost:3000/admin/verificar',
        {
          withCredentials: true
        }
      );

      setAdminLogado(true);

    } catch {

      setAdminLogado(false);

    }

  };

  /*
  ========================================
  INIT
  ========================================
  */

  useEffect(() => {

    verificarAdmin();

    /*
    ESCUTAR LOGIN/LOGOUT
    */

    window.addEventListener(
      'adminAuthChanged',
      verificarAdmin
    );

    return () => {

      window.removeEventListener(
        'adminAuthChanged',
        verificarAdmin
      );

    };

  }, []);

  /*
  ========================================
  TRAVAR SCROLL MENU
  ========================================
  */

  useEffect(() => {

    if (isMenuOpen) {
      document.body.style.overflow =
        'hidden';
    } else {
      document.body.style.overflow =
        'auto';
    }

    return () => {
      document.body.style.overflow =
        'auto';
    };

  }, [isMenuOpen]);

  /*
  ========================================
  MENU
  ========================================
  */

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  /*
  ========================================
  LOGOUT
  ========================================
  */

  const logout = async () => {

    try {

      await axios.post(
        'http://localhost:3000/admin/logout',
        {},
        {
          withCredentials: true
        }
      );

      /*
      ATUALIZAR HEADER
      */

      window.dispatchEvent(
        new Event('adminAuthChanged')
      );

      /*
      REDIRECT
      */

      window.location.href = '/';

    } catch (err) {

      console.log(err);

    }

  };

  /*
  ========================================
  RENDER
  ========================================
  */

  return (
    <header className={styles.header}>

      {/* LOGO */}

      <div className={styles.logoContainer}>
        <span className={styles.logoVyra}>
          VYRA
        </span>

        <span className={styles.logoSub}>
          PERFORMANCE
        </span>
      </div>

      {/* NAV */}

      <nav
        className={`
          ${styles.nav}
          ${isMenuOpen
            ? styles.navOpen
            : ''
          }
        `}
      >

        <NavLink
          to="/"
          onClick={closeMenu}
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          onClick={closeMenu}
        >
          Produtos
        </NavLink>

        <NavLink
          to="/about"
          onClick={closeMenu}
        >
          A Marca
        </NavLink>

        {/* ADMIN */}

        {adminLogado && (
          <NavLink
            to="/login/admin"
            onClick={closeMenu}
            className={styles.adminLink}
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
          style={{cursor:"pointer"}}>
            Sair
          </button>
        )}

        {/* COMPRAR */}

        <NavLink
          to="/products"
          className={styles.navBtnLink}
        >
          Comprar Agora
        </NavLink>

      </div>

      {/* HAMBURGER */}

      <div
        className={`
          ${styles.hamburger}
          ${isMenuOpen
            ? styles.hamburgerOpen
            : ''
          }
        `}
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