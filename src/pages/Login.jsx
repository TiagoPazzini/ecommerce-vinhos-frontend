import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const usuariosMock = [
  { email: 'admin@vinho.com', senha: 'Admin@123', nome: 'Administrador', perfil: 'admin' },
  { email: 'cliente@vinho.com', senha: 'Cliente@123', nome: 'Rodrigo Rocha ', perfil: 'cliente' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [aba, setAba] = useState('login')
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    const encontrado = usuariosMock.find(
      u => u.email === form.email && u.senha === form.senha
    )

    if (!encontrado) {
      setErro('E-mail ou senha inválidos.')
      return
    }

    login({ nome: encontrado.nome, email: encontrado.email, perfil: encontrado.perfil })

    if (encontrado.perfil === 'admin') {
      navigate('/admin/clientes')
    } else {
      navigate('/')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
        width: '100%', maxWidth: 420, overflow: 'hidden'
      }}>
        <div style={{ background: 'var(--wine-dark)', padding: '32px 40px', textAlign: 'center' }}>
          <span style={{ fontSize: 36 }}>🍷</span>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', color: 'var(--cream)',
            fontSize: 24, fontWeight: 600, margin: '12px 0 4px'
          }}>Vinho & Co.</h1>
          <p style={{ color: 'rgba(248,244,239,0.55)', fontSize: 13, margin: 0 }}>
            Acesse sua conta ou cadastre-se
          </p>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {['login', 'cadastro'].map(a => (
            <button key={a} onClick={() => { setAba(a); setErro('') }} style={{
              flex: 1, padding: '14px', background: 'transparent', border: 'none',
              borderBottom: aba === a ? '2px solid var(--wine)' : '2px solid transparent',
              color: aba === a ? 'var(--wine)' : 'var(--muted)',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              {a === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        <div style={{ padding: '32px 40px' }}>
          {erro && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
              padding: '12px 16px', color: '#991B1B', fontSize: 13, marginBottom: 20
            }}>
              {erro}
            </div>
          )}

          {aba === 'login' ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
                  E-mail
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="seu@email.com" style={{
                    width: '100%', border: '1px solid var(--border)', borderRadius: 8,
                    padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
                    outline: 'none', boxSizing: 'border-box'
                  }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
                  Senha
                </label>
                <input type="password" name="senha" value={form.senha} onChange={handleChange} required
                  style={{
                    width: '100%', border: '1px solid var(--border)', borderRadius: 8,
                    padding: '10px 14px', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
                    outline: 'none', boxSizing: 'border-box'
                  }} />
              </div>
              <button type="submit" style={{
                background: 'var(--wine)', color: '#fff', border: 'none', borderRadius: 8,
                padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', marginTop: 4
              }}>
                Entrar
              </button>
              <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', margin: 0 }}>
                Admin: admin@vinho.com / Admin@123
              </p>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
                Preencha seus dados para criar uma conta de cliente.
              </p>
              <Link to="/cadastro" style={{
                display: 'block', background: 'var(--wine)', color: '#fff',
                borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500,
                textDecoration: 'none', fontFamily: 'DM Sans, sans-serif'
              }}>
                Ir para o cadastro
              </Link>
            </div>
          )}
        </div>

        <div style={{ padding: '0 40px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--border)', margin: 0 }}>
            Beba com moderação. Venda proibida para menores de 18 anos.
          </p>
        </div>
      </div>
    </div>
  )
}