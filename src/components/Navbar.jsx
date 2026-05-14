import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCarrinhoGlobal } from '../contexts/CarrinhoContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario, logout } = useAuth()
  const { carrinho } = useCarrinhoGlobal()
  const quantidadeTotal = carrinho.reduce((total, item) => total + item.quantidade, 0)

  if (location.pathname === '/login') return null

  function handleLogout() {
    logout()
    navigate('/')
  }

  const linkStyle = (path) => ({
    color: location.pathname.startsWith(path) ? 'var(--gold)' : 'rgba(248,244,239,0.6)',
    borderBottom: location.pathname.startsWith(path) ? '2px solid var(--gold)' : '2px solid transparent',
    padding: '20px 16px', fontSize: 14, fontWeight: 500, textDecoration: 'none'
  })

  return (
    <nav style={{ background: 'var(--wine-dark)', borderBottom: '1px solid var(--wine)' }}
      className="px-8 py-0 flex items-center justify-between">

      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 0', textDecoration: 'none'
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
        }}>🍷</div>
        <span style={{
          fontFamily: 'Playfair Display, serif', color: 'var(--cream)',
          fontSize: 20, fontWeight: 600
        }}>
          Vinho & Co.
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

        {usuario?.perfil === 'admin' && (
          <Link to="/admin/clientes" style={linkStyle('/admin/clientes')}>
            Clientes
          </Link>
        )}

        {usuario?.perfil === 'cliente' && (
          <>
            <Link to="/carrinho" style={{ ...linkStyle('/carrinho'), display: 'flex', alignItems: 'center', gap: 6 }}>
              🛒 Carrinho
              {quantidadeTotal > 0 && (
                <span style={{
                  background: '#DC2626', color: '#fff', borderRadius: '50%',
                  width: 20, height: 20, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, fontWeight: 700
                }}>
                  {quantidadeTotal}
                </span>
              )}
            </Link>
            <Link to="/pedidos" style={linkStyle('/pedidos')}>Meus pedidos</Link>
          </>
        )}

        {!usuario && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
            <Link to="/cadastro" style={{
              padding: '8px 16px', color: 'var(--cream)', fontSize: 13,
              fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s'
            }}>
              Criar conta
            </Link>
            <Link to="/login" style={{
              padding: '8px 20px', border: '1px solid var(--gold)', borderRadius: 6,
              color: 'var(--gold)', fontSize: 13, fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.2s'
            }}
              onMouseOver={e => { e.target.style.background = 'var(--gold)'; e.target.style.color = 'var(--wine-dark)' }}
              onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--gold)' }}>
              Login
            </Link>
            <Link to="/carrinho" style={{ ...linkStyle('/carrinho'), display: 'flex', alignItems: 'center', gap: 6 }}>
              🛒 Carrinho
              {quantidadeTotal > 0 && (
                <span style={{
                  background: '#DC2626', color: '#fff', borderRadius: '50%',
                  width: 20, height: 20, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, fontWeight: 700
                }}>
                  {quantidadeTotal}
                </span>
              )}
            </Link>

          </div>
        )}

        {usuario && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 16 }}>
            <span style={{ color: 'rgba(248,244,239,0.55)', fontSize: 13 }}>
              Olá, {usuario.nome.split(' ')[0]}
            </span>
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1px solid rgba(248,244,239,0.25)',
              borderRadius: 6, padding: '7px 16px', color: 'rgba(248,244,239,0.6)',
              fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
            }}>
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}