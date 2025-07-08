"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// Contract addresses (replace with actual deployed contract addresses)
const GAME_CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
const NFT_CONTRACT_ADDRESS = "0x8ba1f109551bD432803012645Hac136c9c1e3a9"
// Add this constant at the top after the contract addresses
const ADMIN_WALLET_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" // Replace with actual admin wallet

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  balance: string
  chainId: number | null
  isLoading: boolean
  isAdmin: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
  mintNFT: (nftData: any) => Promise<any>
  buyNFT: (nft: any) => Promise<any>
  transferNFT: (from: string, to: string, tokenId: string) => Promise<any>
  getUserNFTs: () => Promise<any[]>
  getContractBalance: () => Promise<string>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask
  }

  // Add this helper function in the Web3Provider component
  const isAdmin = (address: string | null) => {
    return address?.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase()
  }

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      })
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    setIsLoading(true)
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)

        // Get balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        })

        // Convert from wei to ETH
        const ethBalance = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
        setBalance(ethBalance)

        // Get chain ID
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        })
        setChainId(Number.parseInt(chainId, 16))

        // Check if on correct network (Ethereum mainnet = 1, Polygon = 137)
        const currentChainId = Number.parseInt(chainId, 16)
        if (currentChainId !== 1 && currentChainId !== 137) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Ethereum or Polygon network",
            variant: "destructive",
          })
        }

        toast({
          title: "Wallet Connected!",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)

      if (error.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "Please approve the connection request in MetaMask",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setBalance("0")
    setChainId(null)
    setIsConnected(false)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  const switchNetwork = async (targetChainId: number) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        try {
          const networkConfig =
            targetChainId === 137
              ? {
                  chainId: "0x89",
                  chainName: "Polygon Mainnet",
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  rpcUrls: ["https://polygon-rpc.com/"],
                  blockExplorerUrls: ["https://polygonscan.com/"],
                }
              : {
                  chainId: "0x1",
                  chainName: "Ethereum Mainnet",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://mainnet.infura.io/v3/"],
                  blockExplorerUrls: ["https://etherscan.io/"],
                }

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [networkConfig],
          })
        } catch (addError) {
          console.error("Error adding network:", addError)
        }
      }
      console.error("Error switching network:", error)
    }
  }

  const mintNFT = async (nftData: any) => {
    if (!account || !window.ethereum) {
      throw new Error("Wallet not connected")
    }

    try {
      setIsLoading(true)

      // Simulate minting transaction
      const transactionHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: GAME_CONTRACT_ADDRESS,
            value: "0x16345785D8A0000", // 0.1 ETH in hex
            data: "0x", // Contract call data would go here
          },
        ],
      })

      return { transactionHash }
    } catch (error) {
      console.error("Error minting NFT:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const buyNFT = async (nft: any) => {
    if (!account || !window.ethereum) {
      throw new Error("Wallet not connected")
    }

    try {
      setIsLoading(true)

      const valueInWei = (nft.price * Math.pow(10, 18)).toString(16)

      const transactionHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: GAME_CONTRACT_ADDRESS,
            value: `0x${valueInWei}`,
            data: "0x", // Contract call data would go here
          },
        ],
      })

      return { transactionHash }
    } catch (error) {
      console.error("Error buying NFT:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const transferNFT = async (from: string, to: string, tokenId: string) => {
    if (!account || !window.ethereum) {
      throw new Error("Wallet not connected")
    }

    try {
      const transactionHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: GAME_CONTRACT_ADDRESS,
            data: "0x", // Contract call data would go here
          },
        ],
      })

      return { transactionHash }
    } catch (error) {
      console.error("Error transferring NFT:", error)
      throw error
    }
  }

  const getUserNFTs = async () => {
    if (!account || !window.ethereum) {
      return []
    }

    try {
      // Simulate fetching user NFTs
      return ["1", "2", "3"] // Mock token IDs
    } catch (error) {
      console.error("Error fetching user NFTs:", error)
      return []
    }
  }

  const getContractBalance = async () => {
    if (!window.ethereum) {
      return "0"
    }

    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [GAME_CONTRACT_ADDRESS, "latest"],
      })

      return (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
    } catch (error) {
      console.error("Error fetching contract balance:", error)
      return "0"
    }
  }

  useEffect(() => {
    // Check if wallet is already connected
    if (isMetaMaskInstalled()) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)

          // Get balance and chain ID
          window.ethereum
            .request({
              method: "eth_getBalance",
              params: [accounts[0], "latest"],
            })
            .then((balance: string) => {
              const ethBalance = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
              setBalance(ethBalance)
            })

          window.ethereum.request({ method: "eth_chainId" }).then((chainId: string) => {
            setChainId(Number.parseInt(chainId, 16))
          })
        }
      })

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        } else {
          disconnectWallet()
        }
      })

      // Listen for chain changes
      window.ethereum.on("chainChanged", (chainId: string) => {
        setChainId(Number.parseInt(chainId, 16))
        window.location.reload() // Reload to reset app state
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        balance,
        chainId,
        isLoading,
        isAdmin: isAdmin(account),
        connectWallet,
        disconnectWallet,
        switchNetwork,
        mintNFT,
        buyNFT,
        transferNFT,
        getUserNFTs,
        getContractBalance,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
