
# 🦙 KORI ALP — Gestión Integral Alpaquera

> **"Tecnología que nace en los Andes y llega al mundo."**

[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)](https://github.com/)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)](LICENSE)
[![Impacto Social](https://img.shields.io/badge/Impacto-Comunidades%20Altoandinas-green)](docs/impacto-social.md)
[![Stack](https://img.shields.io/badge/Stack-React%20Native%20%7C%20Node.js%20%7C%20PostgreSQL-informational)](docs/arquitectura.md)

---

## 📌 ¿Qué es KORI ALP?

> *"KORI"* significa **"ORO"** en quechua — porque eso es exactamente lo que falta: que el productor pueda ver el valor real de su trabajo.

**KORI ALP** es una plataforma web diseñada para **empoderar económicamente a las familias alpaqueras altoandinas del Perú** (Puno, Macusani, Carabaya, Mazocruz), brindándoles herramientas de gestión de costos, trazabilidad de productos y conexión directa con compradores formales, eliminando la dependencia de los intermediarios informales ("rescatistas").

El proyecto aborda el **aprovechamiento integral de la alpaca** en sus tres líneas de valor principales:

| Línea de Valor | Producto | Mercado Objetivo |
|---|---|---|
| 🧶 **Fibra** | Baby Alpaca, Fleece, Suri | Diseñadores de moda sostenible, textileras medianas/grandes |
| 🥩 **Carne** | Charqui, cortes frescos, embutidos | Restaurantes gourmet, ferias urbanas, distribuidores |
| 🧴 **Cuero & Piel** | Pieles curtidas, cueros | Curtiembres, talleres de marroquinería artesanal |

---

## ❗ El Problema que Resolvemos

Las familias alpaqueras del altiplano peruano enfrentan **tres brechas críticas** que las mantienen en situación de pobreza a pesar de poseer un recurso de alto valor global:

### 1. 🔍 Ceguera de Costos de Crianza Completa
El productor desconoce su **costo real total** (pastos, vacunas, mano de obra, esquila, faenado). Al no conocer sus números, no puede fijar precios justos y vende frecuentemente **a pérdida**.

### 2. 🗑️ Desperdicio y Subvaloración de Productos
Los intermediarios informales solo compran lo que les conviene (fibra o carne), ignorando el cuero, el estiércol (abono) y subproductos. El productor **regala o bota valor** por no tener canales directos de venta.

### 3. 📋 Exclusión del Sistema Financiero y Contable
Sin boletas, facturas ni registros contables, el alpaquero **no puede acceder a créditos, exportar ni formalizarse**. El miedo a SUNAT y Aduanas los paraliza.

---

## 💡 Nuestra Solución — Las 3 Funcionalidades Core

```
┌─────────────────────────────────────────────────────────┐
│  ALPAKA APP — Módulos Principales                        │
├─────────────────┬───────────────────┬───────────────────┤
│  💰 COSTOS      │  🛒 MERCADO       │  📄 FORMAL        │
│  INTEGRAL       │  DIRECTO          │  SIMPLIFICADO     │
├─────────────────┼───────────────────┼───────────────────┤
│ Calculadora de  │ Conexión directa  │ Generación de     │
│ costos por      │ con compradores   │ boletas, facturas │
│ animal y por    │ textiles, gastro  │ y reportes para   │
│ lote completo   │ e industriales    │ SUNAT/SENASA      │
│                 │                   │                   │
│ Precio justo    │ Perfil de         │ Guía paso a paso  │
│ sugerido por    │ productor con     │ para exportación  │
│ cada línea      │ trazabilidad y    │ y formalización   │
│ de valor        │ certificación     │ de asociaciones   │
└─────────────────┴───────────────────┴───────────────────┘
```

---

## 👥 Usuarios del Sistema

### Usuario Principal — El Productor Alpaquero
- **Perfil:** Familias crianceras y pequeñas asociaciones altoandinas
- **Zona:** Puno (Macusani, Carabaya, Mazocruz) y otras regiones altoandinas
- **Dolor principal:** Impotencia frente al rescatista, miedo a la formalización
- **Necesidad:** Control contable simple, precios justos, acceso a mercados

### Usuarios Secundarios — Los Compradores
- **Sector Textil:** Diseñadores de moda sostenible, empresas textiles Lima/exterior
- **Sector Alimentos:** Restaurantes gourmet, ferias urbanas, distribuidores de charqui
- **Sector Industrial:** Curtiembres y talleres de marroquinería artesanal

---

## 🗺️ Mapa de Empatía — Don Teófilo (Buyer Persona)

> *Criador de 80 alpacas en Macusani, Puno. 52 años. Habla quechua y castellano básico.*

| ¿Qué PIENSA y SIENTE? | ¿Qué VE? |
|---|---|
| "Trabajo duro con todo el animal pero nunca me alcanza" | Intermediarios que llegan con precios ya fijados |
| Miedo a que SENASA rechace su lote de carne | Sus vecinos vendiendo a los mismos rescatistas |

| ¿Qué ESCUCHA? | ¿Qué DICE y HACE? |
|---|---|
| "Así siempre se ha hecho" de otros criadores | Acepta el precio que le dan por necesidad de efectivo |
| Promesas incumplidas de compradores informales | No registra nada — todo en la memoria |

**Dolores principales:** Precio de usura impuesto, rechazo sanitario por desconocimiento, pavor a la burocracia

**Ganancias que busca:** Precio justo por su trabajo, certeza de que sus productos cumplen normas, dignidad económica

---

## 🏗️ Arquitectura del Proyecto

```
alpaka-app/
│
├── 📱 src/                          # Frontend — React Native
│   ├── components/                  # Componentes reutilizables UI
│   │   ├── CostCalculator/          # Calculadora de costos por animal/lote
│   │   ├── ProductCard/             # Tarjeta de producto (fibra/carne/cuero)
│   │   ├── MarketConnect/           # Módulo conexión con compradores
│   │   └── DocumentGenerator/       # Generador de boletas y reportes
│   │
│   ├── screens/                     # Pantallas principales de la app
│   │   ├── OnboardingScreen/        # Bienvenida y configuración inicial
│   │   ├── DashboardScreen/         # Panel principal del productor
│   │   ├── CostsScreen/             # Gestión de costos de crianza
│   │   ├── InventoryScreen/         # Inventario (fibra, carne, cueros)
│   │   ├── MarketplaceScreen/       # Conexión con compradores
│   │   ├── DocumentsScreen/         # Documentos y facturación
│   │   └── ProfileScreen/           # Perfil del productor/asociación
│   │
│   ├── services/                    # Lógica de negocio y API calls
│   │   ├── costService.js           # Cálculo de costos integrales
│   │   ├── pricingService.js        # Sugerencia de precios por línea
│   │   ├── marketService.js         # Conexión con compradores
│   │   └── documentService.js       # Generación de documentos
│   │
│   ├── utils/                       # Utilidades y helpers
│   │   ├── alpacaCalculator.js      # Fórmulas de costo por alpaca
│   │   ├── fiberClassifier.js       # Clasificación Baby Alpaca vs Fleece
│   │   └── sanitaryChecker.js       # Verificación normas SENASA
│   │
│   └── assets/                      # Imágenes, iconos, fuentes
│
├── ⚙️  backend/                      # Backend — Node.js + Express
│   ├── routes/
│   │   ├── producers.js             # CRUD productores y asociaciones
│   │   ├── products.js              # CRUD productos (fibra/carne/cuero)
│   │   ├── costs.js                 # Registro y consulta de costos
│   │   ├── marketplace.js           # Conexión oferta/demanda
│   │   └── documents.js             # Generación de documentos legales
│   │
│   ├── models/
│   │   ├── Producer.js              # Modelo: Productor/Asociación
│   │   ├── Alpaca.js                # Modelo: Animal individual o lote
│   │   ├── Product.js               # Modelo: Producto (fibra/carne/cuero)
│   │   ├── CostRecord.js            # Modelo: Registro de costos
│   │   └── Transaction.js           # Modelo: Venta/transacción
│   │
│   ├── controllers/
│   │   ├── producerController.js
│   │   ├── costController.js        # Lógica del calculador integral
│   │   ├── pricingController.js     # Lógica de precios sugeridos
│   │   └── marketplaceController.js
│   │
│   └── middleware/
│       ├── auth.js                  # Autenticación JWT
│       ├── validation.js            # Validación de datos de entrada
│       └── senasaIntegration.js     # Integración con normas SENASA
│
├── 🗄️  database/
│   ├── schema.sql                   # Esquema principal de la base de datos
│   ├── seeds/
│   │   ├── producers_seed.sql       # Datos de prueba — productores
│   │   └── products_seed.sql        # Datos de prueba — productos
│   └── migrations/                  # Migraciones de base de datos
│
├── 📚 docs/
│   ├── arquitectura.md              # Documento de arquitectura técnica
│   ├── impacto-social.md            # Métricas y objetivos de impacto social
│   ├── buyer-persona.md             # Perfiles de usuario detallados
│   ├── value-proposition.md         # Canvas de propuesta de valor
│   ├── api-reference.md             # Documentación de endpoints
│   └── setup-guide.md               # Guía de instalación y configuración
│
├── .env.example                     # Variables de entorno (plantilla)
├── .gitignore
├── package.json
└── README.md                        ← Estás aquí
```

---

## 🚀 Instalación y Configuración Local

### Pre-requisitos
- Node.js v18+
- PostgreSQL 14+
- React Native CLI / Expo CLI

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/JHUAM/alpaka-app.git
cd alpaka-app

# 2. Instalar dependencias del backend
cd backend
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de BD

# 4. Crear la base de datos
psql -U postgres -f database/schema.sql
psql -U postgres -f database/seeds/producers_seed.sql

# 5. Iniciar el servidor backend
npm run dev

# 6. En otra terminal — instalar y correr la app móvil
cd ../src
npm install
npx expo start
```

---

## 📊 Propuesta de Valor — Canvas

### 🟦 El "Cuadrado" de Alivio de Dolores

| DOLOR DEL PRODUCTOR | SOLUCIÓN ALPAKA |
|---|---|
| No sabe cuánto le cuesta criar una alpaca | **Filtro de Costos Integral** — calcula automáticamente costo por animal, por lote y por línea de producto |
| Le pagan precio de miseria por la fibra | **Precio Justo Sugerido** — muestra el precio de mercado real basado en categoría (Baby Alpaca, Fleece, Suri) |
| El cuero y el estiércol se botan | **Módulo Multi-producto** — registra y conecta TODAS las líneas de valor con compradores específicos |
| Miedo a SENASA y cadena de frío | **Checklist SENASA** — guía paso a paso para cumplir normas sanitarias antes del faenado |
| No puede emitir facturas | **Contador de Bolsillo** — genera documentos válidos para SUNAT en pocos pasos desde el celular |

---

## 🌱 Impacto Social Esperado

- **500+ familias alpaqueras** beneficiadas en la primera fase (Puno)
- **30% de incremento** en ingresos netos proyectado al eliminar intermediarios
- **Reducción del 80%** del desperdicio de subproductos (cuero, estiércol)
- **Formalización progresiva** de asociaciones alpaqueras sin multas ni trabas

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| App Móvil | React Native + Expo | Una codebase; funcionalidad offline |
| Backend API | Node.js + Express | Ligero, rápido, ideal para APIs REST |
| Base de Datos | PostgreSQL | Relacional, robusto para datos financieros y trazabilidad |
| Autenticación | JWT + bcrypt | Simple y seguro para usuarios con baja alfabetización digital |
| Notificaciones | Firebase FCM | Push notifications para alertas de precios y compradores |
| Documentos | PDFKit | Generación de boletas y reportes sin servidor externo |

---

## 🤝 Contribuir al Proyecto

Este es un proyecto de **impacto social abierto**. Si quieres contribuir:

1. Haz un `fork` del repositorio
2. Crea una rama: `git checkout -b feature/nombre-de-tu-mejora`
3. Haz tus cambios y `commit`: `git commit -m 'Agrega: descripción del cambio'`
4. Sube tu rama: `git push origin feature/nombre-de-tu-mejora`
5. Abre un **Pull Request** explicando tu contribución

---

## 📋 Roadmap

- [x] Definición del problema y usuarios (Lean Canvas)
- [x] Estructura del repositorio y documentación base
- [ ] Diseño UI/UX — wireframes y prototipo en Figma
- [ ] Módulo 1: Calculadora de Costos Integral (MVP)
- [ ] Módulo 2: Registro de Inventario Multi-producto
- [ ] Módulo 3: Marketplace de Conexión Directa
- [ ] Módulo 4: Generador de Documentos SUNAT/SENASA
- [ ] Beta testing con comunidades de Macusani, Puno
- [ ] Lanzamiento v1.0

---

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver [`LICENSE`](LICENSE) para más información.

---

## 👩‍💻 Equipo

Desarrollado con 💚 para las comunidades alpaqueras del altiplano peruano.

*"La alpaca no es solo lana. Es carne, cuero, abono y dignidad económica para miles de familias que merecen tecnología a su favor."*

---

<p align="center">
  🦙 <strong>QHAWAY</strong> — Tecnología que nace en los Andes y llega al mundo
</p>
