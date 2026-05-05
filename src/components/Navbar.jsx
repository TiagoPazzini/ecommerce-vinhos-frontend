import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCatalogoController } from '../controllers/useCatalogoController'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario, logout } = useAuth()
  const { quantidadeTotal } = useCatalogoController()

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
            <button
              onClick={() => navigate('/carrinho')}
              style={quantidadeTotal > 0 ? {
                position: 'relative',
                background: 'var(--gold)',
                color: 'var(--wine-dark)',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              } : {
                background: 'transparent',
                border: '1px solid rgba(248,244,239,0.25)',
                borderRadius: 6,
                padding: '7px 16px',
                color: 'rgba(248,244,239,0.6)',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}>
              🛒 Carrinho
              {quantidadeTotal > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#DC2626',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {quantidadeTotal}
                </span>
              )}
            </button>
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
            <button
              onClick={() => navigate('/carrinho')}
              style={quantidadeTotal > 0 ? {
                position: 'relative',
                background: 'var(--gold)',
                color: 'var(--wine-dark)',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              } : {
                background: 'transparent',
                border: '1px solid rgba(248,244,239,0.25)',
                borderRadius: 6,
                padding: '7px 16px',
                color: 'rgba(248,244,239,0.6)',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}>
              🛒 Carrinho
              {quantidadeTotal > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#DC2626',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {quantidadeTotal}
                </span>
              )}
            </button>

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