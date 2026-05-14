// src/contexts/CarrinhoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { CarrinhoModel } from '../models/CarrinhoModel'

const CarrinhoContext = createContext(null)

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([])

  // Carrega os dados do Model assim que o app abre
  useEffect(() => {
    setCarrinho(CarrinhoModel.carregar())
  }, [])

  // Atualiza o Model e o estado global ao mesmo tempo
  function atualizarCarrinho(novoCarrinho) {
    CarrinhoModel.salvar(novoCarrinho)
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