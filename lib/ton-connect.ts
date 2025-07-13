import { TonConnect } from "@tonconnect/sdk"

export const tonConnect = new TonConnect({
  manifestUrl: "/tonconnect-manifest.json",
})

export const connectWallet = async () => {
  try {
    const walletConnectionSource = {
      universalLink: "https://app.tonkeeper.com/ton-connect",
      bridgeUrl: "https://bridge.tonapi.io/bridge",
    }

    await tonConnect.connect(walletConnectionSource)
    return tonConnect.wallet
  } catch (error) {
    console.error("Wallet connection failed:", error)
    throw error
  }
}

export const disconnectWallet = async () => {
  await tonConnect.disconnect()
}

export const sendTransaction = async (transaction: any) => {
  try {
    const result = await tonConnect.sendTransaction(transaction)
    return result
  } catch (error) {
    console.error("Transaction failed:", error)
    throw error
  }
}
