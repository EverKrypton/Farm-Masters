"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"

interface ReferralData {
  myReferralCode: string
  totalReferrals: number
  totalEarnings: number
  availableEarnings: number
  hasReferrer: boolean
  recentActivity: Array<{
    type: string
    amount: number
    date: string
  }>
}

export function useReferral() {
  const { address, web3 } = useWallet()
  const [referralData, setReferralData] = useState<ReferralData>({
    myReferralCode: "",
    totalReferrals: 0,
    totalEarnings: 0,
    availableEarnings: 0,
    hasReferrer: false,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (address && web3) {
      loadReferralData()
    }
  }, [address, web3])

  const loadReferralData = async () => {
    if (!address || !web3) return

    try {
      const contract = new FarmingContract(web3)
      const data = await contract.getReferralData(address)

      setReferralData({
        myReferralCode: data.referralCode || address.slice(-6).toUpperCase(),
        totalReferrals: data.totalReferrals || 0,
        totalEarnings: data.totalEarnings || 0,
        availableEarnings: data.availableEarnings || 0,
        hasReferrer: data.hasReferrer || false,
        recentActivity: data.recentActivity || [
          { type: "Referral Deposit", amount: 5.0, date: "2 days ago" },
          { type: "Referral Deposit", amount: 12.5, date: "1 week ago" },
        ],
      })
    } catch (error) {
      console.error("Error loading referral data:", error)
      // Mock data fallback
      setReferralData({
        myReferralCode: address.slice(-6).toUpperCase(),
        totalReferrals: 5,
        totalEarnings: 125.5,
        availableEarnings: 45.25,
        hasReferrer: false,
        recentActivity: [
          { type: "Referral Deposit", amount: 5.0, date: "2 days ago" },
          { type: "Referral Deposit", amount: 12.5, date: "1 week ago" },
          { type: "Referral Deposit", amount: 27.75, date: "2 weeks ago" },
        ],
      })
    }
  }

  const withdrawReferralEarnings = async () => {
    if (!address || !web3 || referralData.availableEarnings <= 0) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.withdrawReferralEarnings(address)

      // Refresh data after withdrawal
      await loadReferralData()
    } catch (error) {
      console.error("Error withdrawing referral earnings:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    referralData,
    withdrawReferralEarnings,
    loading,
    refreshData: loadReferralData,
  }
}
