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
      const isDeployed = await contract.isContractDeployed()

      if (!isDeployed) {
        setReferralData({
          myReferralCode: address.slice(-6).toUpperCase(),
          totalReferrals: 0,
          totalEarnings: 0,
          availableEarnings: 0,
          hasReferrer: false,
          recentActivity: [],
        })
        return
      }

      const data = await contract.getReferralData(address)

      setReferralData({
        myReferralCode: data.referralCode || address.slice(-6).toUpperCase(),
        totalReferrals: data.totalReferrals || 0,
        totalEarnings: data.totalEarnings || 0,
        availableEarnings: data.availableEarnings || 0,
        hasReferrer: data.hasReferrer || false,
        recentActivity: data.recentActivity || [],
      })
    } catch (error) {
      console.error("Error loading referral data:", error)
      setReferralData({
        myReferralCode: address.slice(-6).toUpperCase(),
        totalReferrals: 0,
        totalEarnings: 0,
        availableEarnings: 0,
        hasReferrer: false,
        recentActivity: [],
      })
    }
  }

  const withdrawReferralEarnings = async () => {
    if (!address || !web3 || referralData.availableEarnings <= 0) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.withdrawReferralEarnings(address)
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
