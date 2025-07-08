// Smart contract interaction utilities
export const GAME_CONTRACT_ADDRESS = "0x..." // Replace with actual contract address
export const NFT_CONTRACT_ADDRESS = "0x..." // Replace with actual NFT contract address

// Contract ABIs (simplified for example)
export const GAME_CONTRACT_ABI = [
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "mintNFT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "transferNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export const NFT_CONTRACT_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
]

// Utility functions for contract interactions
export async function mintNFT(account: string, tokenId: number) {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      const contract = new window.ethereum.Contract(GAME_CONTRACT_ADDRESS, GAME_CONTRACT_ABI)
      const transaction = await contract.methods.mintNFT(tokenId).send({
        from: account,
        value: window.ethereum.utils.toWei("0.1", "ether"), // Minting cost
      })
      return transaction
    }
  } catch (error) {
    console.error("Error minting NFT:", error)
    throw error
  }
}

export async function transferNFT(from: string, to: string, tokenId: number) {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      const contract = new window.ethereum.Contract(GAME_CONTRACT_ADDRESS, GAME_CONTRACT_ABI)
      const transaction = await contract.methods.transferNFT(from, to, tokenId).send({
        from: from,
      })
      return transaction
    }
  } catch (error) {
    console.error("Error transferring NFT:", error)
    throw error
  }
}

export async function getUserNFTs(account: string) {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      const contract = new window.ethereum.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI)
      const balance = await contract.methods.balanceOf(account).call()

      const nfts = []
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call()
        nfts.push(tokenId)
      }

      return nfts
    }
    return []
  } catch (error) {
    console.error("Error fetching user NFTs:", error)
    return []
  }
}
