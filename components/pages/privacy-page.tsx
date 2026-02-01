"use client"
import { ShieldCheck, EyeOff, Lock, UserCheck } from "lucide-react"
import type { Language } from "@/lib/i18n"

export function PrivacyPage({ language }: { language: Language }) {
  const content = {
    es: {
      title: "Privacidad y Protección Arcana",
      intro: "En MageLord, tus datos están protegidos por hechizos de encriptación de grado militar.",
      sections: [
        { icon: Lock, t: "Seguridad de Cuenta", d: "Tus contraseñas se almacenan mediante hashing bcrypt. Nadie, ni siquiera los administradores, tiene acceso a ellas." },
        { icon: EyeOff, t: "Uso de Datos", d: "No vendemos tu información a gremios externos ni a terceros. Solo guardamos lo necesario para tu progresión." },
        { icon: UserCheck, t: "Tus Derechos", d: "Puedes solicitar la eliminación total de tu provincia y datos personales en cualquier momento desde Soporte." }
      ]
    },
    en: {
      title: "Privacy and Arcane Protection",
      intro: "In MageLord, your data is protected by military-grade encryption spells.",
      sections: [
        { icon: Lock, t: "Account Security", d: "Your passwords are stored using bcrypt hashing. No one, not even administrators, has access to them." },
        { icon: EyeOff, t: "Data Usage", d: "We do not sell your information to external guilds or third parties. We only store what is necessary for your progress." },
        { icon: UserCheck, t: "Your Rights", d: "You can request the total deletion of your province and personal data at any time through Support." }
      ]
    }
  }

  const t = content[language as keyof typeof content] || content.es

  return (
    <div className="max-w-4xl mx-auto p-8 bg-black/60 border border-blue-500/30 rounded-xl text-gray-300 shadow-2xl">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 flex items-center gap-3">
        <ShieldCheck className="h-10 w-10" /> {t.title}
      </h1>
      <p className="mb-8 text-lg text-blue-100/70">{t.intro}</p>
      
      <div className="grid gap-6">
        {t.sections.map((s, i) => (
          <div key={i} className="flex gap-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
            <s.icon className="h-8 w-8 text-blue-400 shrink-0" />
            <div>
              <h3 className="font-bold text-white mb-1">{s.t}</h3>
              <p className="text-sm text-blue-100/60 leading-relaxed">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}