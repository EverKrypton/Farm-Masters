"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"

interface AirdropInfo {
  weeklyDepositTotal: number
  eligibleUsersCount: number
  timeUntilNextAirdrop: number
  isUserEligible: boolean
  userWeeklyDeposits?: number
}

export function useWeeklyAirdrop() {
  const { address, web3 } = useWallet()
  const [airdropInfo, setAirdropInfo] = useState<AirdropInfo>({
    weeklyDepositTotal: 0,
    eligibleUsersCount: 0,
    timeUntilNextAirdrop: 0,
    isUserEligible: false,
    userWeeklyDeposits: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (address && web3) {
      loadAirdropInfo()
    }
  }, [address, web3])

  const loadAirdropInfo = async () => {
    if (!address || !web3) return

    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      if (!isDeployed) {
        setAirdropInfo({
          weeklyDepositTotal: 0,
          eligibleUsersCount: 0,
          timeUntilNextAirdrop: 0,
          isUserEligible: false,
          userWeeklyDeposits: 0,
        })
        return
      }

      const info = await contract.getWeeklyAirdropInfo()
      const userStats = await contract.getUserStats(address)

      setAirdropInfo({
        weeklyDepositTotal: Number.parseFloat(web3.utils.fromWei(info.weeklyDepositTotal, "ether")),
        eligibleUsersCount: Number(info.eligibleUsersCount),
        timeUntilNextAirdrop: Number(info.timeUntilNextAirdrop),
        isUserEligible: info.isUserEligible,
        userWeeklyDeposits: Number.parseFloat(web3.utils.fromWei(userStats.weeklyDeposits, "ether")),
      })
    } catch (error) {
      console.error("Error loading airdrop info:", error)
      setAirdropInfo({
        weeklyDepositTotal: 0,
        eligibleUsersCount: 0,
        timeUntilNextAirdrop: 0,
        isUserEligible: false,
        userWeeklyDeposits: 0,
      })
    }
  }

  const processAirdrop = async () => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.processWeeklyAirdrop(address)
      await loadAirdropInfo()
    } catch (error) {
      console.error("Error processing airdrop:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    airdropInfo,
    processAirdrop,
    loading,
    refreshData: loadAirdropInfo,
  }
}
