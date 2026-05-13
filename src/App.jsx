import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'

import './App.css'

import PainelAdmin from './pages/PainelAdmin/PainelAdmin'
import LandingPage from './pages/LandingPage/LadingPage'
import Produtos from './pages/Produtos/Produtos'
import About from './pages/About/About'
import Notfound from './components/Notfound/Notfound'
import Header from './components/Header/Header'

function App() {

  return (
    <BrowserRouter>

      <Header />

      <Routes>

        <Route
          path='/'
          element={<LandingPage />}
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

    </BrowserRouter>
  )
}

export default App