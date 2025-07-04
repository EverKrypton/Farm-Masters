"use client"

import { useContract } from "../hooks/use-contract"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function ContractStatus() {
  const { isContractDeployed, loading, contractAddress } = useContract()

  if (loading) {
    return (
      <Alert className="mb-3 sm:mb-4 bg-gray-50">
        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        <AlertTitle className="text-sm sm:text-base">Checking contract status...</AlertTitle>
        <AlertDescription className="text-xs sm:text-sm">Verifying if the smart contract is deployed.</AlertDescription>
      </Alert>
    )
  }

  if (isContractDeployed === false) {
    return (
      <Alert variant="destructive" className="mb-3 sm:mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-sm sm:text-base">Smart Contract Not Deployed</AlertTitle>
        <AlertDescription className="text-xs sm:text-sm">
          The farming game smart contract has not been deployed yet. You can still explore the interface, but
          functionality will be limited to mock data. Data shown as "N/A" will be populated once the contract is
          deployed.
        </AlertDescription>
      </Alert>
    )
  }

  if (isContractDeployed === true) {
    return (
      <Alert className="mb-3 sm:mb-4 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-sm sm:text-base">Smart Contract Active</AlertTitle>
        <AlertDescription className="text-xs sm:text-sm">
          The farming game smart contract is active and ready to use at{" "}
          <span className="font-mono text-xs break-all">{contractAddress}</span>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
