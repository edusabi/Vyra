import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import styles from "./CatalogoVarejo.module.css";

const CatalogoAtacado = () => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingPage(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  const [cart, setCart] = useState(() => {
    const carrinhoSalvo = localStorage.getItem("vyra_cart");
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  
  const [loadedImages, setLoadedImages] = useState({});

  // ==========================================
  // ESTADO DO CEP
  // ==========================================
  const [cep, setCep] = useState("");

  const handleImageLoad = (produtoId) => {
    setLoadedImages((prev) => ({
      ...prev,
      [produtoId]: true,
    }));
  };

  const mostrarToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000); 
  };

  useEffect(() => {
    if (isCartOpen || isLoadingPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen, isLoadingPage]);

  useEffect(() => {
    localStorage.setItem("vyra_cart", JSON.stringify(cart));
  }, [cart]); 

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
        nomeSite: `Camisa Vyra Performance ${cor.nome}`, 
        nomeWpp: `Camisa Vyra Performance ${cor.nome} - ${variacao.descricao}`, 
        img: `/Blusas/${cor.pasta}/${cor.prefixo} ${variacao.sufixo}.png`,
        tag: "DRY FIT"
      });
    });
  });

  const opcoesTamanhos = ["P", "M", "G", "GG"];

  const selecionarTamanho = (produtoId, tamanho) => {
    setTamanhosSelecionados((prev) => {
      if (prev[produtoId] === tamanho) {
        const novoEstado = { ...prev };
        delete novoEstado[produtoId];
        return novoEstado;
      }
      return {
        ...prev,
        [produtoId]: tamanho
      };
    });
  };

  const adicionarAoCarrinho = (produto) => {
    const tamanhoEscolhido = tamanhosSelecionados[produto.id];
    
    if (!tamanhoEscolhido) {
      mostrarToast("Por favor, selecione um tamanho antes de adicionar!", "error");
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

    mostrarToast("Produto adicionado ao carrinho!", "success");
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

  // ==========================================
  // LÓGICA DE CÁLCULO DE DESCONTOS E TOTAIS
  // ==========================================
  const totalItens = cart.reduce((acc, item) => acc + item.qtd, 0);

  // Define o valor de cada peça com base na quantidade total do carrinho
  let precoUnitarioAtual = 20.00;
  if (totalItens >= 3) {
    precoUnitarioAtual = 18.00;
  } else if (totalItens === 2) {
    precoUnitarioAtual = 19.00;
  }

  // O subtotal usa o preço unitário dinâmico já com o desconto aplicado em todas as peças
  const subtotalCarrinho = totalItens * precoUnitarioAtual;
  
  // Validação simples para ver se o CEP foi preenchido corretamente
  const cepLimpo = cep.replace(/\D/g, "");
  const isCepValido = cepLimpo.length === 8;

  const finalizarCompraWhatsapp = () => {
    if (!isCepValido) {
      mostrarToast("Por favor, informe um CEP válido com 8 números antes de finalizar!", "error");
      return;
    }

    const numeroWpp = "5581995782112"; 
    
    let mensagem = "Olá, Vyra! Gostaria de finalizar o meu pedido e verificar as opções de frete:\n\n";
    mensagem += "*MEU CARRINHO:*\n";

    cart.forEach((item, index) => {
      mensagem += `\n${index + 1}. *${item.nomeWpp}*`;
      mensagem += `\n▫️ Tamanho: *${item.tamanho}*`; 
      mensagem += `\n▫️ Quantidade: ${item.qtd}`;
      mensagem += `\n▫️ Valor Unid: R$ ${precoUnitarioAtual.toFixed(2).replace(".", ",")}`;
      mensagem += `\n▫️ Subtotal: R$ ${(precoUnitarioAtual * item.qtd).toFixed(2).replace(".", ",")}\n`; 
    });

    mensagem += `\n=======================`;
    mensagem += `\n*📍 CEP PARA ENTREGA: ${cep}*`;
    mensagem += `\n=======================`;

    mensagem += `\n*TOTAL DE PEÇAS: ${totalItens}*`;
    mensagem += `\n*SUBTOTAL PRODUTOS: R$ ${subtotalCarrinho.toFixed(2).replace(".", ",")}*`;
    mensagem += `\n_(Frete a ser calculado)_`;
    mensagem += `\n=======================\n`;
    mensagem += `\nAguardo o cálculo do frete e as instruções para pagamento!`;

    const urlFormatada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${numeroWpp}?text=${urlFormatada}`, "_blank");
  };

  return (
    <>
      {isLoadingPage && (
        <div className={styles.globalLoaderOverlay}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>CARREGANDO COLEÇÃO...</p>
        </div>
      )}

      <div className={styles.container}>
        
        {toast.show && (
          <div className={`${styles.toast} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`}>
            {toast.message}
          </div>
        )}

        <button className={styles.floatingCartBtn} onClick={() => setIsCartOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {totalItens > 0 && <span className={styles.cartBadge}>{totalItens}</span>}
        </button>

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
                        <img src={item.img} alt={item.nomeSite} className={styles.cartItemImg} />
                      </div>
                      <div className={styles.cartItemInfo}>
                        <h4 title={item.nomeSite}>{item.nomeSite}</h4>
                        <span className={styles.cartItemSize}>Tamanho: {item.tamanho}</span>
                        <p className={styles.cartItemPrice}>R$ {precoUnitarioAtual.toFixed(2).replace(".", ",")}</p>
                        
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
                  
                  <div className={styles.freteContainer}>
                    <h4 className={styles.freteTitle}>Endereço de Entrega</h4>
                    <div className={styles.freteInputGroup}>
                      <input 
                        type="text" 
                        placeholder="Digite seu CEP (Ex: 00000-000)" 
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        maxLength="9"
                        className={styles.freteInput}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                      />
                    </div>
                    <p className={styles.freteAviso} style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                      O valor do frete será calculado manualmente com você pelo WhatsApp.
                    </p>
                  </div>

                  {totalItens >= 2 && (
                    <div className={styles.descontoAviso} style={{ fontSize: "12px", color: "green", marginBottom: "8px", textAlign: "right" }}>
                      ✓ Desconto de atacado aplicado ({totalItens >= 3 ? 'R$ 18/peça' : 'R$ 19/peça'})
                    </div>
                  )}

                  <div className={styles.totalContainer}>
                    <span>SUBTOTAL:</span>
                    <span>R$ {subtotalCarrinho.toFixed(2).replace(".", ",")}</span>
                  </div>
                  
                  <button 
                    className={`${styles.checkoutBtn} ${!isCepValido ? styles.checkoutBtnDisabled : ""}`} 
                    onClick={finalizarCompraWhatsapp}
                  >
                    FINALIZAR COMPRA
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <main className={styles.products}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>NOSSA COLEÇÃO</h2>
            <div className={styles.neonLine}></div>
          </div>

          <div className={styles.productGrid}>
            {todosProdutos.map((produto, index) => {
              const tamanhoAtual = tamanhosSelecionados[produto.id];
              const isLoaded = loadedImages[produto.id];

              return (
                <div key={produto.id} className={styles.productCard}>
                  
                  <div className={styles.imagePlaceholder}>
                    
                    {!isLoaded && <div className={styles.skeletonLoader}></div>}
                    
                    <img
                      src={produto.img}
                      alt={produto.nomeSite}
                      className={styles.productImg}
                      loading={index < 4 ? "eager" : "lazy"}
                      onLoad={() => handleImageLoad(produto.id)} 
                      onError={(e) => {
                        handleImageLoad(produto.id); 
                        e.target.style.opacity = 1; 
                      }}
                      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }} 
                    />
                    
                  </div>

                  <div className={styles.cardContent}>
                    
                    <div className={styles.infoWrapper}>
                      <div className={styles.titleGroup}>
                        <h3 className={styles.productName}>{produto.nomeSite}</h3>
                        <span className={styles.tag}>{produto.tag}</span>
                      </div>
                      
                      <span className={styles.price}>
                        R$ {precoUnitarioAtual.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    
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
    </>
  );
};

export default CatalogoAtacado;