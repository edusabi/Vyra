import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import styles from "./CatalogoAtacado.module.css";

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
  // ESTADOS DO FRETE E CEP
  // ==========================================
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(null);
  const [loadingCep, setLoadingCep] = useState(false);

  const TAXA_SURUBIM = 5.00;
  const TAXA_CORREIOS = 25.00;

  const buscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      mostrarToast("Digite um CEP válido com 8 números.", "error");
      return;
    }

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        mostrarToast("CEP não encontrado.", "error");
        setEndereco(null);
      } else {
        setEndereco(data);
        mostrarToast("CEP localizado com sucesso!", "success");
      }
    } catch (error) {
      mostrarToast("Erro ao buscar CEP. Tente novamente.", "error");
    } finally {
      setLoadingCep(false);
    }
  };

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
        // O preço base não precisa mais ser fixado aqui, pois será calculado dinamicamente
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
  
  let valorFrete = 0;
  let isSurubim = false;
  let freteGratisSurubim = false;

  if (endereco) {
    isSurubim = endereco.localidade.toLowerCase() === "surubim";

    if (isSurubim) {
      if (totalItens >= 2) {
        valorFrete = 0;
        freteGratisSurubim = true;
      } else {
        valorFrete = TAXA_SURUBIM; 
      }
    } else {
      valorFrete = TAXA_CORREIOS; 
    }
  }

  const valorTotalFinal = subtotalCarrinho + valorFrete;

  const finalizarCompraWhatsapp = () => {
    if (!endereco) {
      mostrarToast("Por favor, calcule o frete informando seu CEP antes de finalizar a compra!", "error");
      return;
    }

    const numeroWpp = "5581995782112"; 
    
    let mensagem = "Olá, Vyra! Gostaria de finalizar o meu pedido:\n\n";
    mensagem += "*MEU CARRINHO:*\n";

    cart.forEach((item, index) => {
      mensagem += `\n${index + 1}. *${item.nomeWpp}*`;
      mensagem += `\n▫️ Tamanho: *${item.tamanho}*`; 
      mensagem += `\n▫️ Quantidade: ${item.qtd}`;
      // Usando o preço unitário com desconto
      mensagem += `\n▫️ Valor Unid: R$ ${precoUnitarioAtual.toFixed(2).replace(".", ",")}`;
      mensagem += `\n▫️ Subtotal: R$ ${(precoUnitarioAtual * item.qtd).toFixed(2).replace(".", ",")}\n`; 
    });

    mensagem += `\n=======================`;
    
    if (endereco) {
      mensagem += `\n*📍 ENDEREÇO DE ENTREGA:*`;
      mensagem += `\nCEP: ${endereco.cep}`;
      mensagem += `\nCidade: ${endereco.localidade} - ${endereco.uf}`;
      mensagem += `\nFrete: ${valorFrete === 0 ? "*GRÁTIS*" : `R$ ${valorFrete.toFixed(2).replace(".", ",")}`}\n`;
      mensagem += `=======================`;
    }

    mensagem += `\n*TOTAL DE PEÇAS: ${totalItens}*`;
    mensagem += `\n*SUBTOTAL PRODUTOS: R$ ${subtotalCarrinho.toFixed(2).replace(".", ",")}*`;
    
    if (endereco && valorFrete > 0) {
      mensagem += `\n*VALOR FINAL (c/ Frete): R$ ${valorTotalFinal.toFixed(2).replace(".", ",")}*`;
    } else {
      mensagem += `\n*VALOR FINAL: R$ ${valorTotalFinal.toFixed(2).replace(".", ",")}*`;
    }
    
    mensagem += `\n=======================\n`;
    mensagem += `\nAguardo as instruções para pagamento!`;

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
                        {/* Exibe o preço atualizado com desconto da unidade */}
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
                    <h4 className={styles.freteTitle}>Calcular Frete</h4>
                    <div className={styles.freteInputGroup}>
                      <input 
                        type="text" 
                        placeholder="00000-000" 
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        maxLength="9"
                        className={styles.freteInput}
                      />
                      <button onClick={buscarCep} className={styles.freteBtn}>
                        {loadingCep ? "..." : "OK"}
                      </button>
                    </div>

                    {endereco && (
                      <div className={styles.freteResult}>
                        <p className={styles.cidadeText}>{endereco.localidade} - {endereco.uf}</p>
                        <div className={styles.valorFreteBox}>
                          <span>Valor da Entrega:</span>
                          {valorFrete === 0 ? (
                            <span className={styles.freteGratis}>GRÁTIS</span>
                          ) : (
                            <span>R$ {valorFrete.toFixed(2).replace(".", ",")}</span>
                          )}
                        </div>
                        
                        {isSurubim && !freteGratisSurubim && (
                          <p className={styles.freteAviso}>
                            Adicione mais {2 - totalItens} peça(s) para ter <strong>Frete Grátis</strong> em Surubim!
                          </p>
                        )}
                        {!isSurubim && (
                          <p className={styles.freteAviso}>
                            Valor fixo estimado. O valor final pode variar.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mostra um pequeno aviso se o cliente tiver desconto aplicado */}
                  {totalItens >= 2 && (
                    <div className={styles.descontoAviso} style={{ fontSize: "12px", color: "green", marginBottom: "8px", textAlign: "right" }}>
                      ✓ Desconto de atacado aplicado ({totalItens >= 3 ? 'R$ 18/peça' : 'R$ 19/peça'})
                    </div>
                  )}

                  <div className={styles.totalContainer}>
                    <span>SUBTOTAL:</span>
                    <span>R$ {subtotalCarrinho.toFixed(2).replace(".", ",")}</span>
                  </div>
                  
                  {endereco && (
                    <div className={styles.totalFinalContainer}>
                      <span>TOTAL FINAL:</span>
                      <span>R$ {valorTotalFinal.toFixed(2).replace(".", ",")}</span>
                    </div>
                  )}
                  
                  <button 
                    className={`${styles.checkoutBtn} ${!endereco ? styles.checkoutBtnDisabled : ""}`} 
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
                      
                      {/* O Preço na vitrine agora mostra de forma dinâmica se o usuário estiver ganhando desconto */}
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