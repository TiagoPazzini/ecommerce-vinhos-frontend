import { createContext, useContext, useState, useEffect } from 'react'
import { CarrinhoDAO } from '../dao/CarrinhoDAO'

const CarrinhoContext = createContext(null)

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([])
  const dao = new CarrinhoDAO()

  useEffect(() => {
    async function carregar() {
      setCarrinho(await dao.readAll())
    }
    carregar()
  }, [])

  async function atualizarCarrinho(novoCarrinho) {
    await dao.update(null, novoCarrinho)
    setCarrinho(novoCarrinho)
  }

  return (
    <CarrinhoContext.Provider value={{ carrinho, atualizarCarrinho }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinhoGlobal() {
  return useContext(CarrinhoContext)
}