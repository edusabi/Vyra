import React from "react";
import Footer from "../../components/Footer/Footer";
import styles from "./Produtos.module.css";

const Produtos = () => {
  const cores = [
    { pasta: "Branco", prefixo: "Branco", nome: "Branco" },
    { pasta: "Preto", prefixo: "Preto", nome: "Preto" },
    { pasta: "Cinza Claro", prefixo: "Cinza Claro", nome: "Cinza Claro" },
    { pasta: "Azul Marinho", prefixo: "Azul", nome: "Azul Marinho" },
    { pasta: "Cinza Escuro", prefixo: "Cinza", nome: "Cinza Escuro" }, 
    { pasta: "Verde Militar", prefixo: "Verde", nome: "Verde Militar" }, 
  ];

  const variacoes = [
    { sufixo: "V Peito", descricao: "Logo V Peito" },
    { sufixo: "V Centro", descricao: "Logo V Central" },
    { sufixo: "Texto Centro", descricao: "Logo Texto Central" },
    { sufixo: "Texto Peito", descricao: "Logo Texto Peito" },
  ];

  const todosProdutos = [];
  
  cores.forEach((cor) => {
    variacoes.forEach((variacao) => {
      todosProdutos.push({
        id: `${cor.prefixo}-${variacao.sufixo}`,
        nome: `Camisa Vyra Performance ${cor.nome} - ${variacao.descricao}`,
        img: `/Blusas/${cor.pasta}/${cor.prefixo} ${variacao.sufixo}.png`,
        tag: "Dry Fit",
      });
    });
  });

  return (
    <div className={styles.produtosContainer}>
      
      <main className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.pageTitle}>NOSSA COLEÇÃO COMPLETA</h1>
          <p className={styles.pageSubtitle}>Escolha a cor e a estampa que combinam com o seu treino.</p>
        </div>

        <div className={styles.productGrid}>
          {todosProdutos.map((produto) => (
            <div key={produto.id} className={styles.productCard}>
              
              <div className={styles.imagePlaceholder}>
                <img
                  src={produto.img}
                  alt={produto.nome}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className={styles.cardContent}>
                <span className={styles.tag}>{produto.tag}</span>
                <h3 className={styles.productName}>{produto.nome}</h3>
              </div>

            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Produtos;