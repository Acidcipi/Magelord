# 🎮 MageLord - Medieval Strategy MMO Game

## 📖 Descripción del Proyecto

MageLord es un juego de estrategia medieval multijugador masivo (MMO) tipo browser game, desarrollado con Next.js y Supabase. Los jugadores construyen imperios, gestionan recursos, entrenan ejércitos, lanzan hechizos y compiten por la dominación mundial.

---

## 📁 Estructura del Proyecto

```
Magelord/
├── app/                          # Next.js 16 App Router
│   ├── api/                     # 8 rutas API
│   │   ├── auth/               # login, logout, me, register
│   │   ├── construction/       # construcción
│   │   ├── demolition/         # demolición
│   │   ├── exploration/        # exploración
│   │   └── user/settings/      # configuración usuario
│   ├── page.tsx                # Página principal (804 líneas)
│   ├── layout.tsx              # Layout servidor
│   ├── ClientLayout.tsx        # Layout cliente
│   └── globals.css             # Estilos globales
│
├── components/                   # Componentes React
│   ├── pages/                  # 50 páginas del juego
│   │   ├── (38 páginas de juego normal)
│   │   ├── admin/             # 4 páginas admin
│   │   ├── webadmin/          # 4 páginas webadmin
│   │   └── owner-*.tsx        # 4 páginas owner
│   ├── ui/                     # 57 componentes shadcn/ui
│   ├── game-header.tsx
│   ├── game-navbar.tsx
│   ├── game-navbar-authenticated.tsx
│   ├── game-navbar-dynamic.tsx
│   ├── game-footer.tsx
│   ├── sidebar-left.tsx
│   ├── sidebar-right.tsx
│   └── language-selector.tsx
│
├── lib/                          # Utilidades y lógica del juego
│   ├── auth/                   # Sistema de autenticación
│   │   ├── login.ts
│   │   └── logout.ts
│   ├── game-context.tsx        # Context React del juego
│   ├── game-state.ts           # Gestión de estado del juego
│   ├── game-formulas.ts        # Fórmulas de combate/balance
│   ├── factions.ts             # 8 facciones del juego
│   ├── roles.ts                # Sistema de roles
│   ├── i18n.ts                 # Internacionalización ES/EN
│   ├── menu-config.ts          # Configuración de menús por roles
│   ├── security.tsx            # Utilidades de seguridad
│   ├── supabase.ts             # Cliente Supabase principal
│   ├── supabaseClient.ts       # Cliente Supabase alternativo
│   ├── use-idle-logout.ts      # Hook auto-logout por inactividad
│   └── utils.ts                # Utilidades generales
│
├── hooks/                        # Custom React Hooks
│   ├── use-mobile.ts           # Detección de dispositivos móviles
│   └── use-toast.ts            # Sistema de notificaciones
│
├── scripts/                      # Scripts SQL para Supabase
│   ├── database.sql            # Schema principal de la BD
│   ├── database-v2-archmage.sql
│   ├── create_magic_system_tables.sql
│   ├── create_lazy_update_function.sql
│   ├── create_entrenar_unidades_function.sql
│   ├── create_research_rpc_function.sql
│   └── turn-generation-cron.sql
│
├── public/                       # Assets estáticos
│   ├── images/                 # Imágenes del juego
│   ├── rituals/                # Iconos de rituales
│   ├── spells/                 # Iconos de hechizos
│   └── units/                  # Iconos de unidades
│
├── styles/
│   └── globals.css
│
├── middleware.ts                 # Auth middleware Supabase
├── ESTRUCTURA.md                 # Este archivo
├── tsconfig.json
├── next.config.mjs
├── package.json
└── .env.local                    # Variables de entorno (no en Git)
```

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Framework** | Next.js | 16.0.10 |
| **UI Library** | React | 19.2.0 |
| **Lenguaje** | TypeScript | 5.x (strict mode) |
| **Base de datos** | Supabase | PostgreSQL |
| **Estilos** | Tailwind CSS | 4.1.9 |
| **Componentes UI** | shadcn/ui + Radix | 57 componentes |
| **Formularios** | React Hook Form + Zod | 7.60.0 |
| **Pagos** | Stripe | Integrado |
| **Gráficos** | Recharts | 2.15.4 |
| **Iconos** | Lucide React | - |
| **Notificaciones** | Sonner | 1.7.4 |
| **Analytics** | Vercel Analytics | 1.3.1 |

**Total dependencias**: 65 producción + 6 desarrollo

---

## 🎮 Sistemas del Juego

### 1. Sistema de Facciones (8 facciones únicas)

Cada facción tiene habilidades y bonificaciones exclusivas:

| Facción | Bonificación Principal |
|---------|------------------------|
| **Legiones Infernales** | +15% oro en ataques exitosos |
| **Cónclave Celestial** | -10% coste de maná en hechizos |
| **Corte de la Sangre** | 5% regeneración de bajas después de batallas |
| **Hordas de la Destrucción** | +20% producción de comida, -15% coste de reclutamiento |
| **Reinos de Ultratumba** | Cero consumo de comida, inmunidad a penalizaciones de exploración |
| **Guardianes de la Escama** | +10% producción de oro, -10% daño físico recibido |
| **Altos Magos de Asuryan** | +25% generación de maná, espionaje mejorado |
| **Ingenios de Hierro** | -15% coste de oro en edificios, +20% efectividad de murallas |

### 2. Sistema de Clases (5 especializaciones)

| Clase | Bonificación |
|-------|--------------|
| **Guerrero** | +15% Ataque |
| **Mago** | +25% Maná |
| **Cazador** | +20% Exploración |
| **Pícaro** | +30% Espionaje |
| **Paladín** | +20% Defensa |

### 3. Sistema de Alineamiento (3 caminos morales)

| Alineamiento | Efecto |
|--------------|--------|
| **Luz** | +10% Crecimiento de población |
| **Oscuridad** | +10% Poder de ataque |
| **Neutral** | -10% Costes por turno |

### 4. Sistema de Roles (Jerarquía de acceso)

```
Nivel 1: player           → Acceso estándar al juego
Nivel 2: forum_admin      → Moderación del foro
Nivel 2: web_admin        → Gestión de contenido web (SIN acceso a foro)
Nivel 3: admin            → Moderación completa del juego (foro + web + admin)
Nivel 4: owner            → Control total del sistema
```

**Permisos por rol:**

- **player**: Acceso completo al juego (construir, reclutar, combatir, comerciar, magia, etc.)
- **forum_admin**: `player` + Moderación del foro (banear, eliminar posts, gestionar reportes)
- **web_admin**: `player` + Gestión de noticias, anuncios, soporte, tickets
- **admin**: `player` + `forum_admin` + `web_admin` + Gestión de usuarios, roles, logs, estadísticas
- **owner**: TODO lo anterior + Cataclismo, configuración del servidor, base de datos, backups

**IMPORTANTE**: 
- `web_admin` NO tiene acceso a moderación de foro
- Solo `admin` y `owner` tienen acceso completo a foro + web + administración

### 5. Sistema de Impuestos

Permite a los jugadores equilibrar crecimiento económico con felicidad de la población.

**Configuración de impuestos:**
- Rango: 0% a 50%
- Ajustable desde la página Estado
- Persistente entre sesiones

**Efectos por tasa de impuestos:**

| Tasa | Estado | Efectos |
|------|--------|---------|
| 0-10% | Paraíso | +10% Moral, +5% Crecimiento poblacional |
| 11-20% | Estándar | Economía equilibrada, sin penalizaciones |
| 21-35% | Opresivo | -10% Moral, -5% Crecimiento poblacional |
| 36-50% | Tiránico | -25% Moral, -15% Crecimiento poblacional, Riesgo de revueltas |

**Fórmula de ingresos fiscales:**
```
Ingresos fiscales por turno = (Población × Tasa de impuestos) / 100
```

**Consideraciones estratégicas:**
- Impuestos bajos aumentan moral y crecimiento pero reducen ingresos inmediatos
- Impuestos altos proporcionan más oro pero arriesgan declive poblacional y revueltas
- La tasa óptima depende de la fase actual del juego y la estrategia

### 6. Sistema de Combate Anti-Turtling

MageLord implementa un sistema anti-turtling para fomentar juego activo y prevenir estrategias defensivas exageradas.

**Límite de defensa por tamaño de provincia:**

La efectividad defensiva está limitada según la tierra total poseída:

| Tierra (Acres) | Defensa Máxima |
|----------------|----------------|
| < 10,000 | 60% |
| 10,000 - 1,000,000 | 80% |
| > 1,000,000 | 95% |

**Fórmula de penetración defensiva:**

La defensa no es absoluta. Atacantes con mayor networth pueden penetrar defensas:

```
Defensa Final = Defensa Base × clamp(Networth Defensor / Networth Atacante, 0.2, 1.0)
```

Donde `clamp(x, min, max)` restringe x entre los valores mínimo y máximo.

**Ejemplo:**
- Defensor tiene 80% defensa y 1,000,000 networth
- Atacante tiene 2,000,000 networth
- Defensa Final = 80% × (1,000,000 / 2,000,000) = 80% × 0.5 = 40%

Esto previene que provincias pequeñas sean invulnerables a imperios grandes.

**Degradación de edificios por combate:**

Cada ataque exitoso contra una provincia destruye infraestructura defensiva:

- **Tasa de destrucción**: 1-3% de edificios defensivos por ataque
- **Edificios afectados**: Murallas, Torres, Fortalezas
- **Consecuencia**: La defensa debe reconstruirse constantemente para mantenerse efectiva

**Costes de mantenimiento defensivo:**

Los edificios defensivos consumen recursos cada turno:

| Edificio | Coste Oro/Turno | Coste Maná/Turno |
|----------|-----------------|------------------|
| Muralla | 10 | 0 |
| Torre | 15 | 5 |
| Fortaleza | 25 | 10 |

**Fallo de mantenimiento:**

Si un jugador no puede pagar los costes de mantenimiento:
- Los edificios se degradan 1% por turno
- La efectividad defensiva cae proporcionalmente
- El colapso económico lleva a la vulnerabilidad

**Implicaciones estratégicas:**
- Las estrategias puramente defensivas son insostenibles sin una economía fuerte
- Atacantes con mayor networth tienen ventaja inherente
- Imperios grandes no pueden esconderse detrás de murallas indefinidamente
- La expansión activa y el crecimiento económico son necesarios para sobrevivir

---

## 🎯 Funcionalidades (50 Páginas)

### Páginas de Juego (38):

| Página | Descripción |
|--------|-------------|
| `estado-page` | Estado del reino |
| `provincia-page` | Gestión de provincia |
| `exploracion-page` | Exploración de tierras |
| `construir-page` | Construcción de edificios |
| `demoler-page` | Demolición |
| `investigacion-page` | Árbol de investigación |
| `reclutar-page` | Reclutamiento de unidades |
| `army-page` | Gestión del ejército |
| `defensa-page` | Configuración defensiva |
| `sala-guerra-page` | Sala de guerra |
| `historial-page` | Historial de batallas |
| `hechizos-page` | Sistema de hechizos |
| `rituales-page` | Rituales mágicos |
| `magia-page` | Sistema de magia |
| `mages-page` | Gestión de magos |
| `cooldowns-page` | Tiempos de espera |
| `rankings-page` | Rankings |
| `alianzas-page` | Sistema de alianzas |
| `diplomacy-page` | Diplomacia |
| `gremios-page` | Gremios |
| `comercio-page` | Comercio |
| `mercado-global-page` | Mercado global |
| `mercado-negro-page` | Mercado negro |
| `foro-page` | Foro del juego |
| `mensajes-page` | Mensajería |
| `noticias-page` | Noticias |
| `perfil-page` | Perfil de jugador |
| `ajustes-page` | Configuración |
| `guia-page` | Guía del juego |

### Páginas de Administración (12):

**Admin (4):**
- `usuarios-admin` - Gestión de usuarios
- `roles-admin` - Gestión de roles y permisos
- `logs-admin` - Logs del sistema
- `fixes-admin` - Correcciones/Fixes

**WebAdmin (4):**
- `anuncios-admin` - Gestión de anuncios
- `broadcast-admin` - Mensajes masivos
- `noticias-admin` - Gestión de noticias
- `footer-content-page` - Gestión del footer

**Owner (4):**
- `owner-jugadores` - Gestión avanzada de jugadores
- `owner-anuncios` - Anuncios globales del owner
- `owner-logs` - Logs completos del sistema
- `owner-noticias` - Gestión de noticias del owner

---

## 🔒 Seguridad

### Middleware de Autenticación
- Autenticación con Supabase SSR
- Verificación de sesión en rutas protegidas
- Auto-logout por inactividad (hook `use-idle-logout.ts`)

### Headers de Seguridad
Configurados en `next.config.mjs`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` configurado

### Row Level Security (RLS)
- Políticas RLS en todas las tablas principales
- Verificación de permisos por rol
- Funciones SQL para gestión de permisos

---

## 💾 Base de Datos (Supabase)

### Tablas Principales:

- `users` - Usuarios del juego
- `provinces` - Provincias de cada jugador
- `news` - Noticias del juego
- `buildings` - Edificios construidos
- `units` - Unidades militares
- `spells` - Hechizos disponibles
- `researches` - Investigaciones
- `battles` - Historial de batallas
- `messages` - Sistema de mensajería
- `alliances` - Alianzas entre jugadores
- `guilds` - Gremios

### Funciones SQL Creadas:

**Verificación de roles:**
- `is_admin()` - Verifica si usuario es admin
- `is_owner()` - Verifica si usuario es owner
- `is_web_admin()` - Verifica si usuario es web_admin
- `is_forum_admin()` - Verifica si usuario es forum_admin

**Gestión de usuarios (admin):**
- `admin_ban_user(user_id UUID)` - Banear/desbanear usuarios
- `admin_change_user_role(user_id UUID, new_role TEXT)` - Cambiar roles

**Mecánicas del juego:**
- `entrenar_unidades(...)` - Entrenar unidades militares
- `realizar_investigacion(...)` - Realizar investigaciones
- `generar_turno()` - Generar recursos por turno

---

## 📜 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (puerto 3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

---

## 📊 Estado Actual del Proyecto

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| **Dependencias** | ✅ Instaladas | node_modules/ presente |
| **Build** | ✅ Compilado | .next/ existe |
| **TypeScript** | ✅ Configurado | Strict mode activo |
| **Environment** | ✅ Configurado | .env.local con Supabase |
| **Middleware** | ✅ Activo | Protección de rutas |
| **Base de datos** | ✅ Scripts listos | 7 archivos SQL |
| **Tests** | ❌ No hay | Sin archivos de test |

---

## 🔄 Pendientes/En Desarrollo

- [ ] Integrar sistema de menús dinámicos por roles (menu-config.ts ya existe)
- [ ] Arreglar imágenes 404 de facciones
- [ ] Completar páginas vacías (muchas son mockups)
- [ ] Limpiar warnings de TypeScript (no críticos)
- [ ] Implementar sistema de tests
- [ ] Documentar API endpoints

---

## 📚 Recursos Adicionales

- **Documentación de Next.js**: https://nextjs.org/docs
- **Documentación de Supabase**: https://supabase.com/docs
- **Documentación de shadcn/ui**: https://ui.shadcn.com
- **Documentación de Tailwind CSS**: https://tailwindcss.com/docs

---

## 👤 Información del Desarrollador

- **Ubicación del proyecto**: `G:\Programacion\Magelord`
- **Sistema operativo**: Windows
- **Shell preferido**: PowerShell
- **Nivel de experiencia**: Principiante/Intermedio
- **Rol en el juego**: owner

---

**Última actualización**: 31 de enero de 2026