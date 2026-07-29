import { NavLink } from 'react-router-dom';
import styles from './BioInsta.module.css';

const BioInsta = () => {
  const links = [
    { title: '🛒 Compre Agora', url: '/atacado', type: 'primary' },
    { title: 'Atacado', url: '/atacado', type: 'secondary' },
    { title: 'Nosso Grupo', url: 'https://chat.whatsapp.com/Gw2wEcjTAcGDlGxFqE44WC', type: 'secondary' },
    { title: 'Fale no WhatsApp', url: 'https://wa.me/5581995782112', type: 'secondary' },
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