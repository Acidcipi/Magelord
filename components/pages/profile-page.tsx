"use client"

/**
 * Profile Page - Manage account settings
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserCircle, Lock, FileText } from "lucide-react"
import type { Language } from "@/lib/i18n"
import { useTranslation } from "@/lib/i18n"
import { useState } from "react"

interface ProfilePageProps {
  user: {
    id: number
    email: string
    username: string
    faction: string
    bio?: string
  }
  language: Language
}

export function ProfilePage({ user, language }: ProfilePageProps) {
  const t = useTranslation(language)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [bio, setBio] = useState(user.bio || "")

  return (
    <div className="space-y-4">
      <Card className="border-[#d4af37]/30 bg-black/80">
        <CardHeader>
          <CardTitle className="text-2xl text-[#d4af37] flex items-center gap-2">
            <UserCircle className="h-6 w-6" />
            {t.profileTitle}
          </CardTitle>
          <CardDescription className="text-[#d4af37]/70">{t.profileDescription}</CardDescription>
        </CardHeader>
      </Card>

      {/* Account Info */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-xl text-[#d4af37]">{t.accountInfo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-[#d4af37]">
            <div>
              <p className="text-sm text-[#d4af37]/60">{t.username}</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-[#d4af37]/60">{t.email}</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-[#d4af37]/60">{t.faction}</p>
              <p className="font-medium">{t[user.faction as keyof typeof t]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-xl text-[#d4af37] flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t.changePassword}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="newPassword" className="text-[#d4af37]">
              {t.newPassword}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-black/40 border-[#d4af37]/30 text-[#d4af37]"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-[#d4af37]">
              {t.confirmNewPassword}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-black/40 border-[#d4af37]/30 text-[#d4af37]"
            />
          </div>
          <Button className="w-full bg-[#d4af37] text-black hover:bg-[#d4af37]/90">{t.changePasswordButton}</Button>
        </CardContent>
      </Card>

      {/* Update Bio */}
      <Card className="border-[#d4af37]/20 bg-black/60">
        <CardHeader>
          <CardTitle className="text-xl text-[#d4af37] flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t.updateBio}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t.bioPlaceholder}
            className="bg-black/40 border-[#d4af37]/30 text-[#d4af37] min-h-[120px]"
          />
          <Button className="w-full bg-[#d4af37] text-black hover:bg-[#d4af37]/90">{t.updateBioButton}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
