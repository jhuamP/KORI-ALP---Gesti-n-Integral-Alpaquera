# 🏗️ Arquitectura Técnica — KORI ALP

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| **Web Frontend** | React + Vite | SPA rápida, ecosistema maduro |
| **Mobile** | React Native + Expo | Código compartido iOS/Android |
| **Backend API** | Node.js + Express | Liviano, escalable, JS everywhere |
| **ORM** | Prisma | Type-safe, migrations automáticas |
| **Base de Datos** | PostgreSQL | Relacional, robusto para datos productivos |
| **Estado Global** | Zustand | Minimalista, sin boilerplate |
| **Build System** | Turborepo | Monorepo con builds paralelos |

## Estructura del Monorepo

```
kori-alp/
├── apps/
│   ├── web/        → React + Vite (productores y compradores en browser)
│   ├── mobile/     → Expo (app móvil para productores en campo)
│   └── backend/    → Node.js API REST
├── packages/
│   └── shared/     → Constantes y tipos del dominio
└── docs/           → Documentación técnica y de impacto
```

## Módulos del Sistema

### 1. 💰 Costos Integral
- Calculadora de costo real por animal y por lote
- Categorías: pastos, sanidad, mano de obra, esquila, faenado, transporte
- Precio justo sugerido por línea de valor (fibra, carne, cuero)
- Histórico de costos por periodo

### 2. 🛒 Mercado Directo
- Publicaciones por categoría (FIBRA / CARNE / CUERO / ABONO)
- Búsqueda y filtros por región y categoría
- Sistema de contacto productor-comprador
- Perfil del productor con trazabilidad

### 3. 📄 Formal Simplificado
- Generación de boletas y facturas
- Guías de remisión SUNAT
- Certificados SENASA
- Guía paso a paso para exportación

## Flujo de Datos

```
Mobile App ─┐
            ├──→ REST API (Express) ──→ PostgreSQL
Web App ────┘         │
                      └──→ Servicios externos:
                               - SUNAT API
                               - SENASA
                               - Notificaciones (Email/WhatsApp)
```

## Roadmap Técnico

- **v0.1** — Esqueleto y estructura base ✅
- **v0.2** — Autenticación + CRUD alpacas
- **v0.3** — Calculadora de costos funcional
- **v0.4** — Módulo de mercado con publicaciones
- **v0.5** — Generación de documentos PDF
- **v1.0** — MVP completo con todos los módulos
