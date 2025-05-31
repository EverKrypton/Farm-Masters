"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    ethereum?: any
    web3?: any
  }
}

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>("0")
  const [loading, setLoading] = useState(false)
  const [web3, setWeb3] = useState<any>(null)

  useEffect(() => {
    checkConnection()
    setupEventListeners()
  }, [])

  const setupEventListeners = () => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAddress(accounts[0])
      getBalance(accounts[0])
    }
  }

  const handleChainChanged = () => {
    window.location.reload()
  }

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const Web3 = (await import("web3")).default
        const web3Instance = new Web3(window.ethereum)
        setWeb3(web3Instance)

        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          await getBalance(accounts[0])
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!")
      return
    }

    setLoading(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      await switchToBSC()

      const Web3 = (await import("web3")).default
      const web3Instance = new Web3(window.ethereum)
      setWeb3(web3Instance)

      setAddress(accounts[0])
      setIsConnected(true)
      await getBalance(accounts[0])
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0")
    setWeb3(null)
  }

  const switchToBSC = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "Binance Smart Chain",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com/"],
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding BSC network:", addError)
        }
      }
    }
  }

  const getBalance = async (address: string) => {
    if (!web3) return

    try {
      const balance = await web3.eth.getBalance(address)
      const balanceInEth = web3.utils.fromWei(balance, "ether")
      setBalance(Number.parseFloat(balanceInEth).toFixed(4))
    } catch (error) {
      console.error("Error getting balance:", error)
    }
  }

  return {
    isConnected,
    address,
    balance,
    loading,
    web3,
    connect,
    disconnect,
  }
}
