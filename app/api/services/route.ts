import { NextResponse } from "next/server"
import { SMMFlareAPI } from "@/lib/smmflare-api"

export async function GET() {
  try {
    const smmFlare = new SMMFlareAPI()
    const services = await smmFlare.getServices()

    // Format services with our markup
    const formattedServices = services.map((service) => SMMFlareAPI.formatService(service, 80))

    // Group by platform
    const groupedServices = formattedServices.reduce(
      (acc, service) => {
        if (!acc[service.platform]) {
          acc[service.platform] = []
        }
        acc[service.platform].push(service)
        return acc
      },
      {} as Record<string, any[]>,
    )

    return NextResponse.json({
      success: true,
      services: groupedServices,
      total: formattedServices.length,
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
