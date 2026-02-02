"use client"

import { useState } from "react"
import { type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquare, Trash2, Eye, Flag } from "lucide-react"

interface ForoPostsAdminPageProps {
  language: Language
}

export function ForoPostsAdminPage({ language }: ForoPostsAdminPageProps) {
  const mockPosts = [
    { id: 1, title: "Estrategia para principiantes", author: "DarkMage", date: "2025-01-15", reports: 0 },
    { id: 2, title: "Mejores hechizos", author: "LightKnight", date: "2025-01-14", reports: 2 },
    { id: 3, title: "Bug en mercado", author: "ShadowLord", date: "2025-01-13", reports: 5 },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-purple-400">
          {language === "es" ? "Gestión de Posts" : "Post Management"}
        </h1>
      </div>

      <div className="grid gap-4">
        {mockPosts.map((post) => (
          <Card key={post.id} className="bg-purple-500/10 border-purple-500/30">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-purple-400">{post.title}</CardTitle>
                  <CardDescription className="text-[#d4af37]/70">
                    Por {post.author} • {post.date}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {post.reports > 0 && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm flex items-center gap-1">
                      <Flag className="h-3 w-3" />
                      {post.reports}
                    </span>
                  )}
                  <Button size="sm" variant="outline" className="border-purple-400 text-purple-400">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
