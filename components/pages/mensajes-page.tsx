"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/lib/i18n"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send, Trash2, Shield, X, Inbox, SendHorizontal, Archive } from "lucide-react"

interface MensajesPageProps {
  language: Language
}

interface Message {
  id: number
  from: string
  subject: string
  body: string
  timestamp: string
  read: boolean
  type: "player" | "system" | "retaliation"
  fromFaction?: string
}

export function MensajesPage({ language }: MensajesPageProps) {
  const t = useTranslation(language)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [folder, setFolder] = useState<"inbox" | "sent" | "system" | "trash">("inbox")

  const getSealIcon = (message: Message) => {
    if (!message.read) {
      return (
        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">✉️</div>
      )
    }
    if (message.type === "retaliation") {
      return (
        <div className="w-6 h-6 rounded-full bg-red-900 flex items-center justify-center text-white text-xs">⚔️</div>
      )
    }
    return (
      <div className="w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center text-black text-xs">📜</div>
    )
  }

  // Placeholder for messages fetched from the database
  const [messages, setMessages] = useState<Message[]>([])

  const filteredMessages = messages.filter((m) => {
    if (folder === "system") return m.type === "system"
    if (folder === "inbox") return m.type !== "system"
    return true
  })

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Column 1: Folders (Mini Sidebar) */}
      <div className="w-48 flex-shrink-0">
        <Card className="bg-gradient-to-b from-black to-gray-900 border-yellow-900/30 p-2 h-full">
          <h2 className="text-[#d4af37] font-bold text-sm px-3 py-2 mb-2 font-serif">
            {language === "es" ? "Carpetas" : "Folders"}
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => setFolder("inbox")}
              className={`w-full text-left px-3 py-2 rounded transition-all ${
                folder === "inbox"
                  ? "bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]"
                  : "text-gray-400 hover:bg-[#d4af37]/10 hover:border hover:border-[#d4af37]/50"
              }`}
            >
              <Inbox className="inline h-4 w-4 mr-2" />
              {language === "es" ? "Recibidos" : "Inbox"}
            </button>
            <button
              onClick={() => setFolder("sent")}
              className={`w-full text-left px-3 py-2 rounded transition-all ${
                folder === "sent"
                  ? "bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]"
                  : "text-gray-400 hover:bg-[#d4af37]/10 hover:border hover:border-[#d4af37]/50"
              }`}
            >
              <SendHorizontal className="inline h-4 w-4 mr-2" />
              {language === "es" ? "Enviados" : "Sent"}
            </button>
            <button
              onClick={() => setFolder("system")}
              className={`w-full text-left px-3 py-2 rounded transition-all ${
                folder === "system"
                  ? "bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]"
                  : "text-gray-400 hover:bg-[#d4af37]/10 hover:border hover:border-[#d4af37]/50"
              }`}
            >
              <Shield className="inline h-4 w-4 mr-2" />
              {language === "es" ? "Sistema" : "System"}
            </button>
            <button
              onClick={() => setFolder("trash")}
              className={`w-full text-left px-3 py-2 rounded transition-all ${
                folder === "trash"
                  ? "bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37]"
                  : "text-gray-400 hover:bg-[#d4af37]/10 hover:border hover:border-[#d4af37]/50"
              }`}
            >
              <Archive className="inline h-4 w-4 mr-2" />
              {language === "es" ? "Papelera" : "Trash"}
            </button>
          </div>

          <Button
            onClick={() => setShowCompose(true)}
            className="w-full mt-4 bg-[#d4af37] text-black hover:bg-[#f4cf5f] font-semibold"
          >
            <Send className="mr-2 h-4 w-4" />
            {language === "es" ? "Nuevo" : "New"}
          </Button>
        </Card>
      </div>

      {/* Column 2: Message List */}
      <div className="w-80 flex-shrink-0">
        <Card className="bg-gradient-to-b from-black via-gray-900 to-black border-yellow-900/30 p-4 h-full overflow-y-auto">
          <h2 className="text-[#d4af37] font-bold text-lg mb-4 font-serif">
            {language === "es" ? "Correo Arcano" : "Arcane Mail"}
          </h2>
          <div className="text-center py-12 text-gray-500">
            <Mail className="h-16 w-16 mx-auto mb-4 text-gray-700" />
            <p>{language === "es" ? "No hay mensajes" : "No messages"}</p>
            <p className="text-xs mt-2">
              {language === "es"
                ? "Los mensajes se cargarán desde la base de datos"
                : "Messages will be loaded from database"}
            </p>
          </div>
        </Card>
      </div>

      {/* Column 3: Message Viewer */}
      <div className="flex-1">
        <Card className="bg-gradient-to-b from-black via-gray-900 to-black border-yellow-900/30 p-6 h-full overflow-y-auto">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#d4af37]/20 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#d4af37] font-serif">{selectedMessage.subject}</h2>
                  <p className="text-sm text-gray-400 mt-2 font-sans">
                    {language === "es" ? "De:" : "From:"} <span className="text-[#d4af37]">{selectedMessage.from}</span>
                    {selectedMessage.fromFaction && (
                      <span className="text-gray-500 italic ml-2">({selectedMessage.fromFaction})</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{selectedMessage.timestamp}</p>
                </div>
                {getSealIcon(selectedMessage)}
              </div>

              <div className="bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-yellow-900/30 rounded-lg p-6">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed font-serif">{selectedMessage.body}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#d4af37]/20">
                <Button className="flex-1 bg-[#d4af37] text-black hover:bg-[#f4cf5f] font-semibold">
                  <Send className="mr-2 h-4 w-4" />
                  {language === "es" ? "Responder" : "Reply"}
                </Button>
                <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-900/20 bg-transparent">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {language === "es" ? "Eliminar" : "Delete"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Mail className="h-20 w-20 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-serif text-lg">
                  {language === "es" ? "Selecciona un mensaje para leer" : "Select a message to read"}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCompose(false)}
        >
          <Card
            className="bg-gradient-to-b from-black via-gray-900 to-black border-[#d4af37] border-2 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-3">
                <h2 className="text-2xl font-bold text-[#d4af37] font-serif">
                  {language === "es" ? "Nuevo Mensaje" : "New Message"}
                </h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-400 hover:text-[#d4af37] transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[#d4af37] mb-1 font-sans">
                    {language === "es" ? "Para:" : "To:"}
                  </label>
                  <Input
                    placeholder={language === "es" ? "Nombre del jugador" : "Player name"}
                    className="bg-black/60 border-yellow-900/30 text-white focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d4af37] mb-1 font-sans">
                    {language === "es" ? "Asunto:" : "Subject:"}
                  </label>
                  <Input
                    placeholder={language === "es" ? "Asunto del mensaje" : "Message subject"}
                    className="bg-black/60 border-yellow-900/30 text-white focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#d4af37] mb-1 font-sans">
                    {language === "es" ? "Mensaje:" : "Message:"}
                  </label>
                  <Textarea
                    placeholder={language === "es" ? "Escribe tu mensaje aquí..." : "Write your message here..."}
                    className="bg-black/60 border-yellow-900/30 text-white min-h-[200px] font-serif focus:border-[#d4af37]"
                  />
                </div>

                <Button className="w-full bg-[#d4af37] text-black hover:bg-[#f4cf5f] font-semibold">
                  <Send className="mr-2 h-4 w-4" />
                  {language === "es" ? "Enviar Mensaje" : "Send Message"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
