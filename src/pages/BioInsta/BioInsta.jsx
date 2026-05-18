import { NavLink } from 'react-router-dom';
import styles from './BioInsta.module.css';

const BioInsta = () => {
  const links = [
    { title: '🛒 Compre Agora', url: '/products', type: 'primary' },
    { title: 'Nosso Site', url: '/', type: 'secondary' },
    { title: 'Nossa Marca', url: '/about', type: 'secondary' },
    { title: 'Fale no WhatsApp', url: 'https://wa.me/5581995594773', type: 'secondary' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.profileHeader}>
        {/* Substitua pelo caminho da sua logo */}
        <img src="/logo V.png" alt="VYRA Logo" className={styles.logo} />
         <div className={styles.logoContainer}>
                <span className={styles.logoVyra}>
                  VYRA
                </span>
        
                <span className={styles.logoSub}>
                  PERFORMANCE
                </span>
              </div>
        <p className={styles.description}>
          Unimos tecnologia, conforto e design para entregar performance de verdade.
        </p>
      </header>

      <main className={styles.linksContainer}>
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.url}
            className={`${styles.linkButton} ${styles[link.type]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.title}
          </NavLink>
        ))}
      </main>
    </div>
  );
};

export default BioInsta;