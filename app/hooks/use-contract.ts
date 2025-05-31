"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FARMING_CONTRACT_ADDRESS } from "../contracts/farming-contract"

export function useContract() {
  const { web3, address } = useWallet()
  const [isContractDeployed, setIsContractDeployed] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (web3) {
      checkContractDeployment()
    }
  }, [web3])

  const checkContractDeployment = async () => {
    if (!web3) return

    setLoading(true)
    try {
      // Check if the contract address is valid and has code
      const code = await web3.eth.getCode(FARMING_CONTRACT_ADDRESS)
      setIsContractDeployed(code !== "0x" && code !== "0x0")
    } catch (error) {
      console.error("Error checking contract deployment:", error)
      setIsContractDeployed(false)
    } finally {
      setLoading(false)
    }
  }

  return {
    isContractDeployed,
    loading,
    contractAddress: FARMING_CONTRACT_ADDRESS,
  }
}
