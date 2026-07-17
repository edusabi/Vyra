import {
  BrowserRouter,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'

import './App.css'

import PainelAdmin from './pages/PainelAdmin/PainelAdmin'
import LandingPage from './pages/LandingPage/LadingPage'
import Produtos from './pages/Produtos/Produtos'
import About from './pages/About/About'
import Notfound from './components/Notfound/Notfound'
import Header from './components/Header/Header'
import BioInsta from './pages/BioInsta/BioInsta'

function Layout() {
  const location = useLocation()

  const hideHeaderRoutes = ['/linkBio']
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname)

  // Verifica se a rota atual é exatamente a página de produtos
  const isProductsPage = location.pathname === '/products'

  return (
    <>
      {/* Passa a prop hideBuyButton como verdadeira apenas se estiver em /products */}
      {!shouldHideHeader && <Header hideBuyButton={isProductsPage} />}

      <Routes>

        <Route
          path='/'
          element={<LandingPage />}
        />

        <Route
          path='/linkBio'
          element={<BioInsta />}
        />

        <Route
          path='/about'
          element={<About />}
        />

        <Route
          path='/products'
          element={<Produtos />}
        />

        <Route
          path='/login/admin'
          element={<PainelAdmin />}
        />

        <Route
          path='*'
          element={<Notfound />}
        />

      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App