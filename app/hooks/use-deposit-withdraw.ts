"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"

export function useDepositWithdraw() {
  const { address, web3 } = useWallet()
  const [loading, setLoading] = useState(false)
  const [usdtWalletBalance, setUsdtWalletBalance] = useState(0)
  const [gameBalance, setGameBalance] = useState(0)

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
        setUsdtWalletBalance(0)
        setGameBalance(0)
        return
      }

      const [walletBalance, contractBalance] = await Promise.all([
        contract.getUSDTBalance(address),
        contract.getUserBalance(address),
      ])

      setUsdtWalletBalance(Number.parseFloat(walletBalance))
      setGameBalance(Number.parseFloat(contractBalance))
    } catch (error) {
      console.error("Error loading balances:", error)
      setUsdtWalletBalance(0)
      setGameBalance(0)
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

  return {
    deposit,
    withdraw,
    loading,
    usdtWalletBalance,
    gameBalance,
    refreshBalances: loadBalances,
  }
}
