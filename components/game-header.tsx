interface GameHeaderProps {
  isHomePage: boolean
}

export function GameHeader({ isHomePage }: GameHeaderProps) {
  return (
    <header
      className={`relative border-b border-[#d4af37]/20 bg-gradient-to-b from-black to-[#0a0a0a] ${isHomePage ? "h-64" : "h-48"} transition-all duration-300`}
    >
      <div className="absolute inset-0">
        <img
          src="/fantasy-medieval-mages-wizards-casting-spells-epic.jpg"
          alt="Magos en batalla épica"
          className="h-full w-full object-cover opacity-40"
        />
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 className="text-5xl font-bold tracking-wider text-[#d4af37] drop-shadow-lg">MageLord</h1>
        <p className="mt-2 text-sm text-[#d4af37]/80">Imperio de Magia y Poder</p>
      </div>
    </header>
  )
}
