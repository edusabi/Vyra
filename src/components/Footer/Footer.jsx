import styles from './Footer.module.css';

const Footer = () => {
  return (
          <footer className={styles.footer}>
    
            <div className={styles.footerBrand}>
    
              <h2 className={styles.footerLogo}>
                VYRA
              </h2>
    
              <p className={styles.sloganFooter}>
                MOVE.
                <span className={styles.neonText} style={{color: "var(--vyra-neon)"}}>
                  {' '}EVOLVE.
                </span>
                {' '}REPEAT.
              </p>
    
            </div>
    
            <div className={styles.footerLinks}>
              <p>Feito no Brasil 🇧🇷</p>
            </div>
    
            <div className={styles.copyright}>
              &copy; {new Date().getFullYear()} VYRA.
              Todos os direitos reservados.
            </div>
    
          </footer>
  )
}

export default Footer