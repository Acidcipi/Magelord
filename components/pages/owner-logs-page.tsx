"use client"

import { useTranslation, type Language } from "@/lib/i18n"
import { Activity, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface OwnerLogsPageProps {
  language: Language
}

export function OwnerLogsPage({ language }: OwnerLogsPageProps) {
  const t = useTranslation(language)

  const mockLogs = [
    { id: 1, type: "info", message: "Usuario DarkMage inició sesión", timestamp: "2025-01-15 10:30:15" },
    {
      id: 2,
      type: "warning",
      message: "Intento de acceso fallido desde IP 192.168.1.1",
      timestamp: "2025-01-15 10:25:00",
    },
    { id: 3, type: "success", message: "Backup de base de datos completado", timestamp: "2025-01-15 10:00:00" },
    { id: 4, type: "error", message: "Error en proceso de pago", timestamp: "2025-01-15 09:45:30" },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#ff1744]">{t.systemLogs}</h1>

      <div className="bg-[#1a1a1a] border border-[#ff1744]/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#ff1744] mb-4">Logs del Sistema</h3>
        <div className="space-y-2">
          {mockLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 bg-[#0f0f0f] border border-[#d4af37]/10 rounded font-mono text-sm"
            >
              {getIcon(log.type)}
              <div className="flex-1">
                <p className="text-[#d4af37]">{log.message}</p>
                <p className="text-gray-400 text-xs mt-1">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
