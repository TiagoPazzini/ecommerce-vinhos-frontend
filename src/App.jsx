import { useLocation, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Catalogo from './pages/Catalogo'
import Carrinho from './pages/Carrinho'
import ClienteLista from './pages/clientes/ClienteLista'
import ClienteCadastro from './pages/clientes/ClienteCadastro'
import ClienteEdicao from './pages/clientes/ClienteEdicao'
import Checkout from './pages/Checkout'
import Pedidos from './pages/Pedidos'


function RotaProtegida({ children, perfil }) {
  const { usuario } = useAuth()
  const location = useLocation()

  if (!usuario) return <Navigate to="/login" state={{from: location}} replace />
  if (perfil && usuario.perfil !== perfil) return <Navigate to="/" />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/checkout" element={
          <RotaProtegida><Checkout /></RotaProtegida>
        } />
        <Route path="/pedidos" element={
          <RotaProtegida><Pedidos /></RotaProtegida>
        } />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/cadastro" element={<ClienteCadastro />} />
        <Route path="/admin/clientes" element={
          <RotaProtegida perfil="admin"><ClienteLista /></RotaProtegida>
        } />
        <Route path="/admin/clientes/novo" element={
          <RotaProtegida perfil="admin"><ClienteCadastro /></RotaProtegida>
        } />
        <Route path="/admin/clientes/:id" element={
          <RotaProtegida perfil="admin"><ClienteEdicao /></RotaProtegida>
        } />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}