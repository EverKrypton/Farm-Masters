export const translations = {
  en: {
    // Header
    services: "Services",
    pricing: "Pricing",
    api: "API",
    support: "Support",
    login: "Sign In",
    register: "Sign Up",

    // Hero
    heroTitle: "Boost Your Social Presence Instantly",
    heroSubtitle:
      "High-quality SMM services for Instagram, Facebook, TikTok and more. Crypto payments, instant delivery and unbeatable prices.",
    getStarted: "Get Started",
    viewServices: "View Services",
    securePayments: "Secure Crypto Payments",
    instantDelivery: "Delivery in Minutes",
    support24: "24/7 Support",

    // Services
    servicesTitle: "Available Services",
    servicesSubtitle: "Competitive prices and guaranteed delivery",
    viewAll: "View All",

    // Features
    featuresTitle: "Why Choose CubaBoost?",
    featuresSubtitle: "Features that make us unique in the market",
    cryptoPayments: "Crypto Payments",
    cryptoDesc: "TRX, Bitcoin, USDT and more. No banking restrictions.",
    instantDeliveryTitle: "Instant Delivery",
    instantDesc: "Most services delivered in less than 30 minutes.",
    secure: "100% Secure",
    secureDesc: "High quality services that don't violate terms of service.",

    // Dashboard
    dashboard: "Dashboard",
    newOrder: "New Order",
    myOrders: "My Orders",
    balance: "Balance",
    deposit: "Deposit",

    // Orders
    createOrder: "Create Order",
    platform: "Platform",
    service: "Service",
    link: "Link",
    quantity: "Quantity",
    totalCost: "Total Cost",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    confirm: "Confirm",
  },
  es: {
    // Header
    services: "Servicios",
    pricing: "Precios",
    api: "API",
    support: "Soporte",
    login: "Iniciar Sesión",
    register: "Registrarse",

    // Hero
    heroTitle: "Impulsa tu Presencia Social al Instante",
    heroSubtitle:
      "Servicios SMM de alta calidad para Instagram, Facebook, TikTok y más. Pagos en criptomonedas, entrega instantánea y precios imbatibles.",
    getStarted: "Comenzar Ahora",
    viewServices: "Ver Servicios",
    securePayments: "Pagos Seguros con Crypto",
    instantDelivery: "Entrega en Minutos",
    support24: "Soporte 24/7",

    // Services
    servicesTitle: "Servicios Disponibles",
    servicesSubtitle: "Precios competitivos y entrega garantizada",
    viewAll: "Ver Todos",

    // Features
    featuresTitle: "¿Por Qué Elegir CubaBoost?",
    featuresSubtitle: "Características que nos hacen únicos en el mercado",
    cryptoPayments: "Pagos en Crypto",
    cryptoDesc: "TRX, Bitcoin, USDT y más. Sin restricciones bancarias.",
    instantDeliveryTitle: "Entrega Instantánea",
    instantDesc: "La mayoría de servicios se entregan en menos de 30 minutos.",
    secure: "100% Seguro",
    secureDesc: "Servicios de alta calidad que no violan términos de servicio.",

    // Dashboard
    dashboard: "Panel de Control",
    newOrder: "Nueva Orden",
    myOrders: "Mis Órdenes",
    balance: "Balance",
    deposit: "Depositar",

    // Orders
    createOrder: "Crear Orden",
    platform: "Plataforma",
    service: "Servicio",
    link: "Enlace",
    quantity: "Cantidad",
    totalCost: "Costo Total",

    // Common
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    cancel: "Cancelar",
    confirm: "Confirmar",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export function useTranslation(lang: Language = "es") {
  return {
    t: (key: TranslationKey) => translations[lang][key] || translations.en[key],
    lang,
  }
}
