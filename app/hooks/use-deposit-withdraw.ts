"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"

export function useDepositWithdraw() {
  const { address, web3 } = useWallet()
  const [loading, setLoading] = useState(false)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [gameBalance, setGameBalance] = useState(0)
  const [farmTokens, setFarmTokens] = useState(0)
  const [contractStats, setContractStats] = useState({
    currentFarmPrice: 0,
  })

  useEffect(() => {
    if (address && web3) {
      loadBalances()
    }
  }, [address, web3])

  const loadBalances = async () => {
    if (!address || !web3) return

    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      if (!isDeployed) {
        setUsdtBalance(0)
        setGameBalance(0)
        setFarmTokens(0)
        setContractStats({ currentFarmPrice: 0 })
        return
      }

      const [walletBalance, contractBalance, farmBalance] = await Promise.all([
        contract.getUSDTBalance(address),
        contract.getUserBalance(address),
        contract.getFarmTokenBalance(address),
      ])

      const currentPrice = await contract.getCurrentFarmPrice()

      setUsdtBalance(Number.parseFloat(walletBalance))
      setGameBalance(Number.parseFloat(contractBalance))
      setFarmTokens(Number.parseFloat(farmBalance))
      setContractStats({ currentFarmPrice: Number.parseFloat(currentPrice) })
    } catch (error) {
      console.error("Error loading balances:", error)
      setUsdtBalance(0)
      setGameBalance(0)
      setFarmTokens(0)
      setContractStats({ currentFarmPrice: 0 })
    }
  }

  const deposit = async (amount: number) => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.depositUSDT(amount, address)
      await loadBalances()
    } catch (error) {
      console.error("Error depositing:", error)
    } finally {
      setLoading(false)
    }
  }

  const withdraw = async (amount: number) => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.withdrawUSDT(amount, address)
      await loadBalances()
    } catch (error) {
      console.error("Error withdrawing:", error)
    } finally {
      setLoading(false)
    }
  }

  const convertFarmToUsdt = async () => {
    if (!address || !web3 || farmTokens <= 0) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.swapFarmToUSDT(farmTokens, address)
      await loadBalances()
    } catch (error) {
      console.error("Error converting FARM to USDT:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    deposit,
    withdraw,
    convertFarmToUsdt,
    loading,
    usdtBalance,
    gameBalance,
    farmTokens,
    contractStats,
    refreshBalances: loadBalances,
  }
}
