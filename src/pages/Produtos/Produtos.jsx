import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import styles from "./Produtos.module.css";

const Produtos = () => {
  // ==========================================
  // ESTADOS
  // ==========================================
  const [cart, setCart] = useState(() => {
    const carrinhoSalvo = localStorage.getItem("vyra_cart");
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState({});

  useEffect(() => {
    localStorage.setItem("vyra_cart", JSON.stringify(cart));
  }, [cart]); 

  // ==========================================
  // LISTA DE PRODUTOS
  // ==========================================
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
        tag: "DRY FIT",
        preco: 89.90,
      });
    });
  });

  const opcoesTamanhos = ["P", "M", "G", "GG"];

  // ==========================================
  // LÓGICA DO CARRINHO
  // ==========================================
  const selecionarTamanho = (produtoId, tamanho) => {
    setTamanhosSelecionados((prev) => {
      // Se o tamanho clicado for igual ao que já está selecionado, ele "desmarca" (remove do estado)
      if (prev[produtoId] === tamanho) {
        const novoEstado = { ...prev };
        delete novoEstado[produtoId];
        return novoEstado;
      }
      
      // Caso contrário, ele marca o tamanho selecionado
      return {
        ...prev,
        [produtoId]: tamanho
      };
    });
  };

  const adicionarAoCarrinho = (produto) => {
    const tamanhoEscolhido = tamanhosSelecionados[produto.id];
    
    if (!tamanhoEscolhido) {
      alert("Por favor, selecione um tamanho antes de adicionar ao carrinho!");
      return; 
    }
    
    const cartItemId = `${produto.id}-${tamanhoEscolhido}`;

    setCart((prevCart) => {
      const itemExiste = prevCart.find((item) => item.cartItemId === cartItemId);
      if (itemExiste) {
        return prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, qtd: item.qtd + 1 } : item
        );
      }
      return [...prevCart, { ...produto, cartItemId, tamanho: tamanhoEscolhido, qtd: 1 }];
    });
  };

  const alterarQuantidade = (cartItemId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const novaQtd = item.qtd + delta;
          return { ...item, qtd: novaQtd > 0 ? novaQtd : 1 };
        }
        return item;
      })
    );
  };

  const removerItem = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const totalCarrinho = cart.reduce((acc, item) => acc + item.preco * item.qtd, 0);
  const totalItens = cart.reduce((acc, item) => acc + item.qtd, 0);

  // ==========================================
  // FUNÇÃO DE REDIRECIONAMENTO PARA WHATSAPP
  // ==========================================
  const finalizarCompraWhatsapp = () => {
    const numeroWpp = "5581995594773"; 
    const baseUrl = window.location.origin;
    
    let mensagem = "Olá, Vyra! Gostaria de finalizar o meu pedido:\n\n";
    mensagem += "*MEU CARRINHO:*\n";

    cart.forEach((item, index) => {
      const linkImagem = `${baseUrl}${item.img}`;
      
      mensagem += `\n${index + 1}. *${item.nome}*`;
      mensagem += `\n▫️ Tamanho: *${item.tamanho}*`; 
      mensagem += `\n▫️ Quantidade: ${item.qtd}`;
      mensagem += `\n▫️ Valor Unid: R$ ${item.preco.toFixed(2).replace(".", ",")}`;
      mensagem += `\n▫️ Subtotal: R$ ${(item.preco * item.qtd).toFixed(2).replace(".", ",")}`;
      mensagem += `\n🔗 Foto: ${linkImagem}\n`; 
    });

    mensagem += `\n=======================`;
    mensagem += `\n*VALOR TOTAL: R$ ${totalCarrinho.toFixed(2).replace(".", ",")}*`;
    mensagem += `\n=======================\n`;
    mensagem += `\nAguardo as instruções para pagamento e envio!`;

    const urlFormatada = encodeURIComponent(mensagem);

    window.open(`https://wa.me/${numeroWpp}?text=${urlFormatada}`, "_blank");
  };

  return (
    <div className={styles.container}>
      
      {/* BOTÃO FLUTUANTE */}
      <button 
        className={styles.floatingCartBtn} 
        onClick={() => setIsCartOpen(true)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        {totalItens > 0 && <span className={styles.cartBadge}>{totalItens}</span>}
      </button>

      {/* SIDEBAR DO CARRINHO */}
      {isCartOpen && (
        <div className={styles.cartOverlay} onClick={() => setIsCartOpen(false)}>
          <div className={styles.cartSidebar} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartHeader}>
              <h2>CARRINHO</h2>
              <button className={styles.closeCartBtn} onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            <div className={styles.cartItemsContainer}>
              {cart.length === 0 ? (
                <p className={styles.emptyCartMsg}>Seu carrinho está vazio.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className={styles.cartItem}>
                    <div className={styles.cartItemImgBox}>
                      <img src={item.img} alt={item.nome} className={styles.cartItemImg} />
                    </div>
                    <div className={styles.cartItemInfo}>
                      <h4 title={item.nome}>{item.nome}</h4>
                      <span className={styles.cartItemSize}>Tamanho: {item.tamanho}</span>
                      <p className={styles.cartItemPrice}>R$ {item.preco.toFixed(2).replace(".", ",")}</p>
                      
                      <div className={styles.qtyControls}>
                        <button onClick={() => alterarQuantidade(item.cartItemId, -1)}>-</button>
                        <span>{item.qtd}</span>
                        <button onClick={() => alterarQuantidade(item.cartItemId, 1)}>+</button>
                        <button className={styles.removeBtn} onClick={() => removerItem(item.cartItemId)}>REMOVER</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={styles.cartFooter}>
                <div className={styles.totalContainer}>
                  <span>TOTAL:</span>
                  <span>R$ {totalCarrinho.toFixed(2).replace(".", ",")}</span>
                </div>
                <button className={styles.checkoutBtn} onClick={finalizarCompraWhatsapp}>
                  FINALIZAR COMPRA
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================
          PRODUTOS
      ========================= */}
      <main className={styles.products}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>NOSSA COLEÇÃO COMPLETA</h2>
          <div className={styles.neonLine}></div>
        </div>

        <div className={styles.productGrid}>
          {todosProdutos.map((produto) => {
            
            const tamanhoAtual = tamanhosSelecionados[produto.id];

            return (
              <div key={produto.id} className={styles.productCard}>
                
                <div className={styles.imagePlaceholder}>
                  <img
                    src={produto.img}
                    alt={produto.nome}
                    className={styles.productImg}
                  />
                </div>

                <div className={styles.cardContent}>
                  
                  <div className={styles.infoWrapper}>
                    <div className={styles.titleGroup}>
                      <h3 className={styles.productName}>{produto.nome}</h3>
                      <span className={styles.tag}>{produto.tag}</span>
                    </div>
                    <span className={styles.price}>
                      R$ {produto.preco.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  
                  {/* SELETOR DE TAMANHOS */}
                  <div className={styles.sizeSelector}>
                    {opcoesTamanhos.map((tamanho) => (
                      <button
                        key={tamanho}
                        onClick={() => selecionarTamanho(produto.id, tamanho)}
                        className={`${styles.sizeBtn} ${tamanhoAtual === tamanho ? styles.activeSize : ""}`}
                      >
                        {tamanho}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className={styles.addBtn}
                    onClick={() => adicionarAoCarrinho(produto)}
                  >
                    + ADICIONAR
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Produtos;