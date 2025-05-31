"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"
import { useToast } from "@/hooks/use-toast"

interface ReferralData {
  myReferralCode: string
  totalReferrals: number
  totalEarnings: number
  availableEarnings: number
  hasReferrer: boolean
  pendingReferralCode: string | null
  recentActivity: Array<{
    type: string
    amount: number
    date: string
  }>
}

export function useReferral() {
  const { address, web3, isConnected } = useWallet()
  const { toast } = useToast()
  const [referralData, setReferralData] = useState<ReferralData>({
    myReferralCode: "",
    totalReferrals: 0,
    totalEarnings: 0,
    availableEarnings: 0,
    hasReferrer: false,
    pendingReferralCode: null,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for referral code in URL when component mounts
    checkUrlForReferralCode()
  }, [])

  useEffect(() => {
    if (address && web3) {
      loadReferralData()
      // Auto-set referrer if there's a pending referral code
      autoSetReferrerFromUrl()
    }
  }, [address, web3])

  const generateReferralCode = (address: string) => {
    // Generate a 6-character referral code from the address
    return address.slice(-6).toUpperCase()
  }

  const checkUrlForReferralCode = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get("ref")

    if (refCode && refCode.length === 6) {
      // Store the referral code for when user connects wallet
      setReferralData((prev) => ({ ...prev, pendingReferralCode: refCode.toUpperCase() }))

      // Show notification that referral code was detected
      toast({
        title: "Referral Code Detected!",
        description: `Referral code ${refCode.toUpperCase()} will be applied when you connect your wallet and make your first deposit.`,
        duration: 5000,
      })

      // Clean URL (optional - removes the ref parameter)
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }

  const autoSetReferrerFromUrl = async () => {
    if (!address || !web3 || !referralData.pendingReferralCode) return

    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      if (!isDeployed) return

      // Check if user already has a referrer
      const data = await contract.getReferralData(address)
      const hasReferrer = data.referrer !== "0x0000000000000000000000000000000000000000"

      if (!hasReferrer && referralData.pendingReferralCode) {
        // Auto-set the referrer
        await setReferrer(referralData.pendingReferralCode, true)
      }
    } catch (error) {
      console.error("Error auto-setting referrer:", error)
    }
  }

  const loadReferralData = async () => {
    if (!address || !web3) return

    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      const myCode = generateReferralCode(address)

      if (!isDeployed) {
        setReferralData((prev) => ({
          ...prev,
          myReferralCode: myCode,
          totalReferrals: 0,
          totalEarnings: 0,
          availableEarnings: 0,
          hasReferrer: false,
          recentActivity: [],
        }))
        return
      }

      const data = await contract.getReferralData(address)

      setReferralData((prev) => ({
        ...prev,
        myReferralCode: myCode,
        totalReferrals: data.totalReferrals || 0,
        totalEarnings: Number.parseFloat(web3.utils.fromWei(data.totalEarnings || "0", "ether")),
        availableEarnings: Number.parseFloat(web3.utils.fromWei(data.availableEarnings || "0", "ether")),
        hasReferrer: data.referrer !== "0x0000000000000000000000000000000000000000",
        recentActivity: data.recentActivity || [],
      }))
    } catch (error) {
      console.error("Error loading referral data:", error)
      setReferralData((prev) => ({
        ...prev,
        myReferralCode: generateReferralCode(address),
        totalReferrals: 0,
        totalEarnings: 0,
        availableEarnings: 0,
        hasReferrer: false,
        recentActivity: [],
      }))
    }
  }

  const findAddressByReferralCode = (referralCode: string): string | null => {
    // In a real implementation, you would have a mapping of referral codes to addresses
    // For this demo, we'll simulate finding an address
    // The referral code is the last 6 characters of an address

    // This is a simplified approach - in production you'd need a proper mapping system
    // For now, we'll create a mock address based on the referral code
    const mockAddress = `0x${"0".repeat(34)}${referralCode.toLowerCase()}`
    return mockAddress
  }

  const setReferrer = async (referralCode: string, isAutomatic = false) => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const referrerAddress = findAddressByReferralCode(referralCode)

      if (!referrerAddress) {
        toast({
          title: "Invalid Referral Code",
          description: "The referral code you entered is not valid.",
          variant: "destructive",
        })
        return
      }

      if (referrerAddress.toLowerCase() === address.toLowerCase()) {
        toast({
          title: "Invalid Referral",
          description: "You cannot refer yourself.",
          variant: "destructive",
        })
        return
      }

      const contract = new FarmingContract(web3)
      await contract.setReferrer(referrerAddress, address)

      // Clear pending referral code
      setReferralData((prev) => ({ ...prev, pendingReferralCode: null }))

      await loadReferralData()

      toast({
        title: isAutomatic ? "Referrer Set Automatically!" : "Referrer Set Successfully!",
        description: `You are now referred by ${referralCode}. They will earn commission on your deposits.`,
      })
    } catch (error) {
      console.error("Error setting referrer:", error)
      toast({
        title: "Error Setting Referrer",
        description: "There was an error setting your referrer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const withdrawReferralEarnings = async () => {
    if (!address || !web3 || referralData.availableEarnings <= 0) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.withdrawReferralEarnings(address)
      await loadReferralData()

      toast({
        title: "Withdrawal Successful!",
        description: `${referralData.availableEarnings.toFixed(2)} USDT has been sent to your wallet.`,
      })
    } catch (error) {
      console.error("Error withdrawing referral earnings:", error)
      toast({
        title: "Withdrawal Failed",
        description: "There was an error withdrawing your referral earnings.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    referralData,
    setReferrer,
    withdrawReferralEarnings,
    loading,
    refreshData: loadReferralData,
  }
}
