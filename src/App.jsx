import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import LandingPage from './pages/LandingPage/LadingPage'
import Produtos from './pages/Produtos/Produtos'
import About from './pages/About/About'
import Notfound from './components/Notfound/Notfound'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/products' element={<Produtos />} />
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
