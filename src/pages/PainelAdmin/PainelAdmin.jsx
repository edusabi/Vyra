import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./PainelAdmin.module.css";

const PainelAdmin = () => {
  const [carregando, setCarregando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);


  const [senha, setSenha] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [erro, setErro] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  const logout = async () => {

  await axios.post(
    "http://localhost:3000/admin/logout",
    {},
    {
      withCredentials: true
    }
  );

  setAutorizado(false);

  };


  const handleChange = (value, index) => {

    if (!/^[a-zA-Z0-9]?$/.test(value)) {
      return;
    }

    const novaSenha = [...senha];

    novaSenha[index] = value;

    setSenha(novaSenha);


    if (value && index < 6) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      );

      nextInput?.focus();
    }
  };


  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !senha[index] &&
      index > 0
    ) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      );

      prevInput?.focus();
    }

    if (e.key === "Enter") {
      verificarSenha();
    }
  };


  const verificarSenha = async () => {
    try {
      setErro("");
      setLoadingLogin(true);

      const senhaCompleta = senha.join("");


      if (senhaCompleta.length !== 7) {
        setErro(
          "A senha precisa ter 7 caracteres"
        );

        return;
      }

      const response = await axios.post(
        "http://localhost:3000/admin/login",
        {
          senha: senhaCompleta,
        },
        {
          withCredentials: true
        }
      );

      if (response.data.success) {

  setAutorizado(true);

  /*
  ATUALIZAR HEADER
  */

  window.dispatchEvent(
    new Event('adminAuthChanged')
  );

}

    } catch (err) {
      setErro(
        err.response?.data?.error ||
        "Erro ao conectar com servidor"
      );
    } finally {
      setLoadingLogin(false);
    }
  };

  useEffect(() => {

  const verificarAuth = async () => {

    try {

      await axios.get(
        "http://localhost:3000/admin/verificar",
        {
          withCredentials: true
        }
      );

      setAutorizado(true);

    } catch {

      setAutorizado(false);

    } finally {

      setCarregando(false);

    }

  };

  verificarAuth();

}, []);


  if (carregando) {
    return (
      <div className={styles.loading}>
        Carregando...
      </div>
    );
  }


  if (!autorizado) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h1 className={styles.title}>
            Painel Admin
          </h1>

          <p className={styles.subtitle}>
            Digite a senha para acessar
          </p>

          <div className={styles.codeContainer}>
            {senha.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="password"
                inputMode="text"
                autoComplete="off"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className={styles.codeInput}
              />
            ))}
          </div>

          {erro && (
            <p className={styles.error}>
              {erro}
            </p>
          )}

          <button
            onClick={verificarSenha}
            disabled={loadingLogin}
            className={styles.button}
          >
            {loadingLogin
              ? "Entrando..."
              : "Entrar"}
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.dashboardTitle}>
            Dashboard
          </h1>

          <p className={styles.dashboardSubtitle}>
            Bem-vindo ao painel administrativo
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Produtos</h2>

          <p>
            Gerencie suas camisas
          </p>
        </div>

        <div className={styles.card}>
          <h2>Pedidos</h2>

          <p>
            Controle pedidos do WhatsApp
          </p>
        </div>

        <div className={styles.card}>
          <h2>Analytics</h2>

          <p>
            Visualize métricas da loja
          </p>
        </div>
      </div>
    </div>
  );
};

export default PainelAdmin;