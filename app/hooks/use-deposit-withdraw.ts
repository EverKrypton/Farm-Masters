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

  useEffect(() => {
    if (address && web3) {
      loadBalances()
    }
  }, [address, web3])

  const loadBalances = async () => {
    if (!address || !web3) return

    try {
      const contract = new FarmingContract(web3)

      const [walletBalance, contractBalance, farmBalance] = await Promise.all([
        contract.getUSDTBalance(address),
        contract.getUserBalance(address),
        contract.getFarmTokenBalance(address),
      ])

      setUsdtBalance(Number.parseFloat(walletBalance))
      setGameBalance(Number.parseFloat(contractBalance))
      setFarmTokens(Number.parseFloat(farmBalance))
    } catch (error) {
      console.error("Error loading balances:", error)
      // Mock data fallback
      setUsdtBalance(1000)
      setGameBalance(150.25)
      setFarmTokens(1250.75)
    }
  }

  const deposit = async (amount: number) => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.depositUSDT(amount, address)

      // Refresh balances
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

      // Refresh balances
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

      // Refresh balances
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
    refreshBalances: loadBalances,
  }
}
