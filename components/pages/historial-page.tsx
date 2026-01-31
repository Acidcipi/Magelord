"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabaseClient"
import { Swords, Shield, Scroll } from "lucide-react"
import type { Language } from "@/lib/i18n"

interface HistorialPageProps {
  language: Language
}

export function HistorialPage({ language }: HistorialPageProps) {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [myProvinceId, setMyProvinceId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"attacks" | "defenses">("attacks")

  useEffect(() => {
    const fetchHistory = async () => {
      const supabase = createBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Obtener mi ID de provincia
      const { data: province } = await supabase.from('provinces').select('id').eq('user_id', user.id).single()
      
      if (!province) return
      setMyProvinceId(province.id)

      // 2. Obtener historial completo (Ataques Y Defensas)
      const { data, error } = await supabase
        .from('combat_reports')
        .select('*')
        .or(`attacker_id.eq.${province.id},defender_id.eq.${province.id}`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setReports(data)
      }
      setLoading(false)
    }

    fetchHistory()
  }, [])

  // 3. Filtrar según la pestaña activa
  const filteredReports = reports.filter(report => {
    if (activeTab === "attacks") {
      // Mostrar solo si YO soy el atacante
      return report.attacker_id === myProvinceId
    } else {
      // Mostrar solo si YO soy el defensor
      return report.defender_id === myProvinceId
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#d4af37] flex items-center gap-3">
            <Scroll className="h-8 w-8" />
            {language === "es" ? "Historial de Combate" : "Combat History"}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#d4af37]/20">
        <button
          onClick={() => setActiveTab("attacks")}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "attacks" ? "text-[#d4af37] border-b-2 border-[#d4af37]" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Swords className="h-5 w-5" />
          {language === "es" ? "Ataques Realizados" : "Attacks Performed"}
        </button>
        <button
          onClick={() => setActiveTab("defenses")}
          className={`pb-3 px-4 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "defenses"
              ? "text-[#d4af37] border-b-2 border-[#d4af37]"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Shield className="h-5 w-5" />
          {language === "es" ? "Defensas Recibidas" : "Defenses Received"}
        </button>
      </div>

      {/* Lista de Reportes */}
      {loading ? (
        <div className="text-gray-400">Cargando pergaminos...</div>
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-[#1a1a1a]/50 border border-[#d4af37]/10 rounded-lg">
          <Swords className="h-16 w-16 mx-auto text-[#d4af37]/30 mb-4" />
          <p className="text-xl text-gray-400">
            {activeTab === "attacks"
              ? (language === "es" ? "No has realizado ataques aún." : "No attacks performed yet.")
              : (language === "es" ? "No has recibido ataques aún." : "No attacks received yet.")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-4 rounded border border-[#d4af37]/30 bg-[#1a1a1a]">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-bold uppercase ${report.mission_type === 'attack' ? 'text-red-400' : 'text-purple-400'}`}>
                  {report.mission_type === 'attack' 
                    ? (language === "es" ? "Ataque Militar" : "Military Attack") 
                    : (language === "es" ? "Misión de Espionaje" : "Espionage Mission")}
                </span>
                <span className="text-xs text-gray-500">{new Date(report.created_at).toLocaleString()}</span>
              </div>
              
              <div className="text-gray-300">
                {report.result_json.message || (report.result_json.victory ? "Victoria" : "Derrota")}
              </div>
              
              {/* Mostrar botín solo si hubo victoria y robo */}
              {report.result_json.goldStolen > 0 && (
                <div className="mt-2 flex gap-4 text-sm font-bold">
                  <span className="text-yellow-400">💰 +{report.result_json.goldStolen} Oro</span>
                  <span className="text-green-400">🏔️ +{report.result_json.landConquered} Tierra</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}