"use client"

import { useState, useEffect } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import {
  Crown,
  MapPin,
  Trophy,
  TrendingUp,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Swords,
} from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface RankingsPageProps {
  language: Language
  gameState: any
}

export function RankingsPage({ language, gameState }: RankingsPageProps) {
  const t = useTranslation(language)
  const [allRankings, setAllRankings] = useState<any[]>([])
  const [guildRankings, setGuildRankings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("networth")
  const [currentPage, setCurrentPage] = useState(1)
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const [playerData, setPlayerData] = useState<any>(null)

  const itemsPerPage = 50

  useEffect(() => {
    fetchRankings()
  }, [activeTab])

  const fetchRankings = async () => {
    setLoading(true)

    try {
      let orderBy = "networth"
      let rankingsData: any[] = [] // 🔥 DECLARAR AQUÍ
      
      if (activeTab === "army") {
        // Para ejército, usar la vista
        const { data, error } = await supabase
          .from("view_army_rankings")
          .select("*")
          .order("total_units", { ascending: false })
        
        if (error) {
          console.error("[v0] ❌ Rankings fetch error:", error)
          setLoading(false)
          return
        }
        
        // Cargar los datos de usuario manualmente
        const enrichedData = await Promise.all(
          (data || []).map(async (province: any) => {
            const { data: userData } = await supabase
              .from("users")
              .select("username, faction")
              .eq("id", province.user_id)
              .single()
            
            return {
              ...province,
              users: userData
            }
          })
        )
        
        rankingsData = enrichedData || []
        setAllRankings(rankingsData)
      } else {
        // Para otros rankings, usar la tabla normal
        if (activeTab === "land") orderBy = "land"
        if (activeTab === "population") orderBy = "population"

        const { data, error } = await supabase
          .from("provinces")
          .select("id, name, land, networth, population, user_id, users!inner(username, faction)")
          .order(orderBy, { ascending: false })

        if (error) {
          console.error("[v0] ❌ Rankings fetch error:", error)
          setLoading(false)
          return
        }

        rankingsData = data || []
        setAllRankings(rankingsData)
      }

      // 🔥 AHORA rankingsData ESTÁ DEFINIDO AQUÍ
      if (gameState?.province_id && rankingsData.length > 0) {
        const rank = rankingsData.findIndex((p: any) => p.id === gameState.province_id)
        if (rank !== -1) {
          setPlayerRank(rank + 1)
          setPlayerData(rankingsData[rank])

          const playerPage = Math.ceil((rank + 1) / itemsPerPage)
          setCurrentPage(playerPage)
        }
      }

      // Fetch guild rankings if needed
      if (activeTab === "guilds") {
        const { data: guildData, error: guildError } = await supabase
          .from("view_guild_rankings")
          .select("*")
          .order("total_networth", { ascending: false })

        if (!guildError && guildData) {
          setGuildRankings(guildData)
        }
      }
    } catch (err) {
      console.error("[v0] 💥 Rankings exception:", err)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />
    if (rank === 2) return <Crown className="h-5 w-5 text-gray-300" />
    if (rank === 3) return <Crown className="h-5 w-5 text-amber-600" />
    return null
  }

  const totalPages = Math.ceil(allRankings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRankings = allRankings.slice(startIndex, endIndex)

  const goToPlayerPage = () => {
    if (playerRank) {
      const playerPage = Math.ceil(playerRank / itemsPerPage)
      setCurrentPage(playerPage)
    }
  }

  const renderPagination = () => {
    const pageNumbers = []
    const maxVisible = 10
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="bg-[#1a1a1a] border-[#d4af37]/20 hover:bg-[#d4af37]/20"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#1a1a1a] border-[#d4af37]/20 hover:bg-[#d4af37]/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(pageNum)}
            className={
              currentPage === pageNum
                ? "bg-[#d4af37] text-black hover:bg-[#d4af37]/80"
                : "bg-[#1a1a1a] border-[#d4af37]/20 hover:bg-[#d4af37]/20"
            }
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-[#1a1a1a] border-[#d4af37]/20 hover:bg-[#d4af37]/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="bg-[#1a1a1a] border-[#d4af37]/20 hover:bg-[#d4af37]/20"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const getActiveMetric = () => {
    if (activeTab === "land") return playerData?.land
    if (activeTab === "population") return playerData?.population
    if (activeTab === "army") return playerData?.total_units  // AÑADIR ESTO
    return playerData?.networth
  }

  const getMetricLabel = () => {
    if (activeTab === "land") return language === "es" ? "Tierras" : "Land"
    if (activeTab === "population") return language === "es" ? "Población" : "Population"
    if (activeTab === "army") return language === "es" ? "Tropas" : "Troops"  
    return language === "es" ? "Poder" : "Power"
  }

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-lg overflow-hidden">
        <img src="/epic-fantasy-ranking-leaderboard-golden-trophy.jpg" alt="Rankings" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-500" />
            <h2 className="text-3xl font-bold text-white">
              {language === "es" ? "Rankings Globales" : "Global Rankings"}
            </h2>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-[#1a1a1a] border border-[#d4af37]/20">
          <TabsTrigger value="networth" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
            <TrendingUp className="h-4 w-4 mr-2" />
            {language === "es" ? "Poder" : "Power"}
          </TabsTrigger>
          <TabsTrigger value="guilds" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
            <Building2 className="h-4 w-4 mr-2" />
            {language === "es" ? "Gremios" : "Guilds"}
          </TabsTrigger>
          <TabsTrigger value="army" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
            <Swords className="h-4 w-4 mr-2" />
            {language === "es" ? "Ejército" : "Army"}
          </TabsTrigger>
          <TabsTrigger value="land" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
            <MapPin className="h-4 w-4 mr-2" />
            {language === "es" ? "Territorio" : "Land"}
          </TabsTrigger>
          <TabsTrigger value="population" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black">
            <Users className="h-4 w-4 mr-2" />
            {language === "es" ? "Población" : "Population"}
          </TabsTrigger>
        </TabsList>

        {/* Networth Tab */}
        <TabsContent value="networth" className="space-y-4">
          {playerRank && playerData && (
            <Card className="bg-gradient-to-r from-amber-900/30 to-amber-950/30 border-amber-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 text-sm font-semibold mb-1">
                    {language === "es" ? "Tu Posición Global" : "Your Global Position"}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#d4af37]">#{playerRank}</span>
                    <div>
                      <p className="text-white font-semibold text-lg">{playerData.name}</p>
                      <p className="text-amber-300 text-sm">
                        {getMetricLabel()}: {Number(getActiveMetric() ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={goToPlayerPage} className="bg-[#d4af37] text-black hover:bg-[#d4af37]/80">
                  {language === "es" ? "Ver mi posición" : "View my position"}
                </Button>
              </div>
            </Card>
          )}

          {loading ? (
            <Card className="bg-slate-900/50 border-amber-700/50 p-8 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent mx-auto"></div>
            </Card>
          ) : (
            <>
              <Card className="bg-slate-900/50 border-amber-700/50 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-amber-950/30 border-b border-amber-700/50">
                    <tr>
                      <th className="p-3 text-left text-amber-400 font-bold">
                        {language === "es" ? "Puesto" : "Rank"}
                      </th>
                      <th className="p-3 text-left text-amber-400 font-bold">
                        {language === "es" ? "Provincia" : "Province"}
                      </th>
                      <th className="p-3 text-left text-amber-400 font-bold">
                        {language === "es" ? "Facción" : "Faction"}
                      </th>
                      <th className="p-3 text-right text-amber-400 font-bold">
                        {language === "es" ? "Poder" : "Power"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRankings.map((province, index) => {
                      const globalRank = startIndex + index + 1
                      const isCurrentPlayer = province.id === gameState?.province_id

                      return (
                        <tr
                          key={province.id}
                          className={`border-b border-slate-700 hover:bg-amber-950/20 transition-colors ${
                            isCurrentPlayer ? "bg-amber-900/30 border-amber-600" : ""
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getRankIcon(globalRank)}
                              <span
                                className={`font-bold text-lg ${globalRank <= 3 ? "text-amber-400" : "text-slate-300"}`}
                              >
                                #{globalRank}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="text-white font-semibold">{province.name}</div>
                              <div className="text-xs text-slate-400">{province.users.username}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-amber-300 text-sm">{province.users.faction}</span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <TrendingUp className="h-4 w-4 text-[#d4af37]" />
                              <span className="text-[#d4af37] font-bold text-lg">
                                {Number(province.networth ?? 0).toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Card>
              {renderPagination()}
            </>
          )}
        </TabsContent>

        {/* Land Tab */}
        <TabsContent value="land" className="space-y-4">
          {playerRank && playerData && (
            <Card className="bg-gradient-to-r from-amber-900/30 to-amber-950/30 border-amber-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 text-sm font-semibold mb-1">
                    {language === "es" ? "Tu Posición Global" : "Your Global Position"}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#d4af37]">#{playerRank}</span>
                    <div>
                      <p className="text-white font-semibold text-lg">{playerData.name}</p>
                      <p className="text-amber-300 text-sm">
                        {getMetricLabel()}: {Number(getActiveMetric() ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={goToPlayerPage} className="bg-[#d4af37] text-black hover:bg-[#d4af37]/80">
                  {language === "es" ? "Ver mi posición" : "View my position"}
                </Button>
              </div>
            </Card>
          )}

          <Card className="bg-slate-900/50 border-amber-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-amber-950/30 border-b border-amber-700/50">
                <tr>
                  <th className="p-3 text-left text-amber-400 font-bold">{language === "es" ? "Puesto" : "Rank"}</th>
                  <th className="p-3 text-left text-amber-400 font-bold">
                    {language === "es" ? "Provincia" : "Province"}
                  </th>
                  <th className="p-3 text-right text-amber-400 font-bold">{language === "es" ? "Tierras" : "Land"}</th>
                </tr>
              </thead>
              <tbody>
                {currentRankings.map((province, index) => {
                  const globalRank = startIndex + index + 1
                  return (
                    <tr key={province.id} className="border-b border-slate-700 hover:bg-amber-950/20">
                      <td className="p-3">
                        <span className="font-bold text-lg text-slate-300">#{globalRank}</span>
                      </td>
                      <td className="p-3">
                        <div className="text-white font-semibold">{province.name}</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <MapPin className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 font-bold text-lg">
                            {Number(province.land ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
          {renderPagination()}
        </TabsContent>

        {/* Population Tab */}
        <TabsContent value="population" className="space-y-4">
          {playerRank && playerData && (
            <Card className="bg-gradient-to-r from-amber-900/30 to-amber-950/30 border-amber-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 text-sm font-semibold mb-1">
                    {language === "es" ? "Tu Posición Global" : "Your Global Position"}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#d4af37]">#{playerRank}</span>
                    <div>
                      <p className="text-white font-semibold text-lg">{playerData.name}</p>
                      <p className="text-amber-300 text-sm">
                        {getMetricLabel()}: {Number(getActiveMetric() ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={goToPlayerPage} className="bg-[#d4af37] text-black hover:bg-[#d4af37]/80">
                  {language === "es" ? "Ver mi posición" : "View my position"}
                </Button>
              </div>
            </Card>
          )}

          <Card className="bg-slate-900/50 border-amber-700/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-amber-950/30 border-b border-amber-700/50">
                <tr>
                  <th className="p-3 text-left text-amber-400 font-bold">{language === "es" ? "Puesto" : "Rank"}</th>
                  <th className="p-3 text-left text-amber-400 font-bold">
                    {language === "es" ? "Provincia" : "Province"}
                  </th>
                  <th className="p-3 text-right text-amber-400 font-bold">
                    {language === "es" ? "Población" : "Population"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRankings.map((province, index) => {
                  const globalRank = startIndex + index + 1
                  return (
                    <tr key={province.id} className="border-b border-slate-700 hover:bg-amber-950/20">
                      <td className="p-3">
                        <span className="font-bold text-lg text-slate-300">#{globalRank}</span>
                      </td>
                      <td className="p-3">
                        <div className="text-white font-semibold">{province.name}</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="h-4 w-4 text-orange-400" />
                          <span className="text-orange-400 font-bold text-lg">
                            {Number(province.population ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
          {renderPagination()}
        </TabsContent>
        
        {/* Army Tab */}
        <TabsContent value="army" className="space-y-4">
          {playerRank && playerData && (
            <Card className="bg-gradient-to-r from-red-900/30 to-red-950/30 border-red-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 text-sm font-semibold mb-1">
                    {language === "es" ? "Tu Posición en Ejército" : "Your Army Position"}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#d4af37]">#{playerRank}</span>
                    <div>
                      <p className="text-white font-semibold text-lg">{playerData.name}</p>
                      <p className="text-red-300 text-sm">
                        {getMetricLabel()}: {Number(getActiveMetric() ?? 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={goToPlayerPage} className="bg-[#d4af37] text-black hover:bg-[#d4af37]/80">
                  {language === "es" ? "Ver mi posición" : "View my position"}
                </Button>
              </div>
            </Card>
          )}

          {loading ? (
            <Card className="bg-slate-900/50 border-red-700/50 p-8 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent mx-auto"></div>
            </Card>
          ) : (
            <>
              <Card className="bg-slate-900/50 border-red-700/50 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-red-950/30 border-b border-red-700/50">
                    <tr>
                      <th className="p-3 text-left text-red-400 font-bold">
                        {language === "es" ? "Puesto" : "Rank"}
                      </th>
                      <th className="p-3 text-left text-red-400 font-bold">
                        {language === "es" ? "Provincia" : "Province"}
                      </th>
                      <th className="p-3 text-left text-red-400 font-bold">
                        {language === "es" ? "Facción" : "Faction"}
                      </th>
                      <th className="p-3 text-right text-red-400 font-bold">
                        {language === "es" ? "Total Tropas" : "Total Troops"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRankings.map((province, index) => {
                      const globalRank = startIndex + index + 1
                      const isCurrentPlayer = province.id === gameState?.province_id

                      return (
                        <tr
                          key={province.id}
                          className={`border-b border-slate-700 hover:bg-red-950/20 transition-colors ${
                            isCurrentPlayer ? "bg-red-900/30 border-red-600" : ""
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getRankIcon(globalRank)}
                              <span
                                className={`font-bold text-lg ${globalRank <= 3 ? "text-red-400" : "text-slate-300"}`}
                              >
                                #{globalRank}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="text-white font-semibold">{province.name}</p>
                              <p className="text-slate-400 text-sm">
                                {province.users?.username || language === "es" ? "Desconocido" : "Unknown"}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-amber-300 capitalize">
                              {province.users?.faction || language === "es" ? "Neutral" : "Neutral"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-slate-200 font-bold text-lg">
                              {Number(province.total_units || 0).toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Card>
              {renderPagination()}
            </>
          )}
        </TabsContent>

        {/* Guilds Tab */}
        <TabsContent value="guilds">
          <Card className="bg-slate-900/50 border-amber-700/50 p-8 text-center">
            <p className="text-gray-400">
              {language === "es" ? "Rankings de gremios disponibles próximamente" : "Guild rankings coming soon"}
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}