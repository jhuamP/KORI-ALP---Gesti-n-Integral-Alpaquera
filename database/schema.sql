-- ============================================================
-- KORI ALP — Esquema de Base de Datos v2.0 (Supabase/PostgreSQL 14+)
-- "Tecnología que nace en los Andes y llega al mundo"
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS Y LIMPIEZA PREVIA (Idempotencia)
-- ============================================================
DROP VIEW IF EXISTS v_resumen_productor CASCADE;
DROP VIEW IF EXISTS v_marketplace_activo CASCADE;
DROP VIEW IF EXISTS v_costos_por_periodo CASCADE;

DROP TABLE IF EXISTS precios_referencia CASCADE;
DROP TABLE IF EXISTS items_documento CASCADE;
DROP TABLE IF EXISTS documentos CASCADE;
DROP TABLE IF EXISTS transacciones CASCADE;
DROP TABLE IF EXISTS ofertas CASCADE;
DROP TABLE IF EXISTS solicitudes_comprador CASCADE;
DROP TABLE IF EXISTS publicaciones CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS registros_costo CASCADE;
DROP TABLE IF EXISTS esquilas CASCADE;
DROP TABLE IF EXISTS alpacas CASCADE;
DROP TABLE IF EXISTS compradores CASCADE;
DROP TABLE IF EXISTS productores CASCADE;
DROP TABLE IF EXISTS asociaciones CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP TYPE IF EXISTS raza_enum CASCADE;
DROP TYPE IF EXISTS sexo_enum CASCADE;
DROP TYPE IF EXISTS calidad_fibra_enum CASCADE;
DROP TYPE IF EXISTS estado_alpaca_enum CASCADE;
DROP TYPE IF EXISTS categoria_producto_enum CASCADE;
DROP TYPE IF EXISTS tipo_documento_enum CASCADE;
DROP TYPE IF EXISTS estado_documento_enum CASCADE;
DROP TYPE IF EXISTS tipo_comprador_enum CASCADE;
DROP TYPE IF EXISTS estado_publicacion_enum CASCADE;
DROP TYPE IF EXISTS estado_oferta_enum CASCADE;
DROP TYPE IF EXISTS metodo_pago_enum CASCADE;
DROP TYPE IF EXISTS tipo_costo_enum CASCADE;
DROP TYPE IF EXISTS rol_enum CASCADE;

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE raza_enum          AS ENUM ('HUACAYA', 'SURI');
CREATE TYPE sexo_enum          AS ENUM ('MACHO', 'HEMBRA');
CREATE TYPE calidad_fibra_enum AS ENUM ('BABY_ALPACA', 'FLEECE', 'MEDIUM_FLEECE', 'HUARIZO', 'GRUESA');
CREATE TYPE estado_alpaca_enum AS ENUM ('ACTIVO', 'SACA', 'FAENADO', 'FALLECIDO', 'BAJA');
CREATE TYPE categoria_producto_enum AS ENUM ('FIBRA', 'CARNE', 'CUERO', 'ABONO', 'OTRO');
CREATE TYPE tipo_documento_enum AS ENUM ('BOLETA', 'FACTURA', 'GUIA_REMISION', 'CERTIFICADO_SENASA', 'NOTA_VENTA');
CREATE TYPE estado_documento_enum AS ENUM ('BORRADOR', 'VALIDADO', 'EMITIDO', 'ANULADO');
CREATE TYPE tipo_comprador_enum AS ENUM ('TEXTIL', 'GASTRONOMICO', 'INDUSTRIAL', 'INFORMAL', 'DIRECTO');
CREATE TYPE estado_publicacion_enum AS ENUM ('ACTIVA', 'PAUSADA', 'VENDIDA', 'VENCIDA', 'CANCELADA');
CREATE TYPE estado_oferta_enum AS ENUM ('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'EXPIRADA');
CREATE TYPE metodo_pago_enum AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'OTRO');
CREATE TYPE tipo_costo_enum AS ENUM ('PASTOS','VACUNAS','MANO_OBRA','ESQUILA','FAENADO','TRANSPORTE','CERTIFICACION','OTROS');
CREATE TYPE rol_enum AS ENUM ('PRODUCTOR', 'COMPRADOR', 'ADMIN');

-- ============================================================
-- FUNCIÓN GLOBAL: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLA 1: usuarios
-- Autenticación unificada para productores y compradores.
-- Supabase Auth puede vincularse aquí vía auth_id.
-- ============================================================
CREATE TABLE usuarios (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id     UUID UNIQUE,           -- Supabase Auth UID
    email       VARCHAR(150) NOT NULL UNIQUE,
    nombre      VARCHAR(150) NOT NULL,
    rol         rol_enum     NOT NULL DEFAULT 'PRODUCTOR',
    idioma      VARCHAR(5)   NOT NULL DEFAULT 'es',  -- 'es' | 'qu'
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE usuarios IS 'Autenticación unificada. auth_id se vincula con Supabase Auth.';

CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- TABLA 2: asociaciones
-- Grupos formales de productores (comunidades, cooperativas).
-- Un productor puede pertenecer a una o ninguna asociación.
-- ============================================================
CREATE TABLE asociaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(200) NOT NULL,
    ruc             VARCHAR(11)  UNIQUE,
    region          VARCHAR(100) NOT NULL,
    distrito        VARCHAR(100),
    comunidad       VARCHAR(150),
    altitud_msnm    INTEGER,
    telefono        VARCHAR(20),
    email           VARCHAR(150),
    is_formalizada  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE asociaciones IS 'Cooperativas o comunidades de productores alpaqueros.';

CREATE TRIGGER trg_asociaciones_updated_at
    BEFORE UPDATE ON asociaciones FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- TABLA 3: productores
-- Perfil del criador. Extiende a usuarios con datos del negocio.
-- ============================================================
CREATE TABLE productores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    asociacion_id   UUID REFERENCES asociaciones(id) ON DELETE SET NULL,
    dni             VARCHAR(8)   UNIQUE,
    ruc             VARCHAR(11)  UNIQUE,
    telefono        VARCHAR(20),
    region          VARCHAR(100) NOT NULL,
    distrito        VARCHAR(100),
    comunidad       VARCHAR(150) NOT NULL,
    altitud_msnm    INTEGER,
    total_alpacas   INTEGER NOT NULL DEFAULT 0,
    is_formalizado  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE productores IS 'Perfil del criador alpaquero. Vinculado a usuarios 1-a-1.';
COMMENT ON COLUMN productores.total_alpacas IS 'Cache del total del hato. Se actualiza vía trigger.';

CREATE TRIGGER trg_productores_updated_at
    BEFORE UPDATE ON productores FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_productores_region ON productores(region);

-- ============================================================
-- TABLA 4: compradores
-- Perfil del comprador (textil, gastronómico, industrial).
-- ============================================================
CREATE TABLE compradores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    nombre          VARCHAR(150) NOT NULL,
    empresa         VARCHAR(200),
    tipo            tipo_comprador_enum NOT NULL,
    region          VARCHAR(100),
    ciudad          VARCHAR(100),
    telefono        VARCHAR(20),
    website         VARCHAR(200),
    is_verificado   BOOLEAN NOT NULL DEFAULT FALSE,
    rating          DECIMAL(3,2) CHECK (rating BETWEEN 0 AND 5),
    total_compras   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE compradores IS 'Compradores del marketplace: textil, gastronómico e industrial.';

CREATE TRIGGER trg_compradores_updated_at
    BEFORE UPDATE ON compradores FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- TABLA 5: alpacas
-- Animal individual. Cada alpaca tiene historial completo.
-- ============================================================
CREATE TABLE alpacas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    productor_id    UUID NOT NULL REFERENCES productores(id) ON DELETE CASCADE,
    arete           VARCHAR(50),                        -- Código de arete o nombre
    raza            raza_enum NOT NULL DEFAULT 'HUACAYA',
    sexo            sexo_enum NOT NULL,
    edad_meses      INTEGER CHECK (edad_meses >= 0),
    peso_vivo_kg    DECIMAL(6,2) CHECK (peso_vivo_kg > 0),
    calidad_fibra   calidad_fibra_enum,
    micrones        DECIMAL(5,2),                       -- Medición real de laboratorio
    estado          estado_alpaca_enum NOT NULL DEFAULT 'ACTIVO',
    fecha_nacimiento DATE,
    notas           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN alpacas.micrones IS 'Si NULL, se infiere la calidad por calidad_fibra. Baby Alpaca < 22.5 micrones.';

CREATE TRIGGER trg_alpacas_updated_at
    BEFORE UPDATE ON alpacas FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_alpacas_productor ON alpacas(productor_id);
CREATE INDEX idx_alpacas_estado    ON alpacas(productor_id, estado);

-- ============================================================
-- TABLA 6: esquilas
-- Historial de esquila por alpaca. Genera inventario de fibra.
-- ============================================================
CREATE TABLE esquilas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alpaca_id       UUID NOT NULL REFERENCES alpacas(id) ON DELETE CASCADE,
    fecha_esquila   DATE NOT NULL DEFAULT CURRENT_DATE,
    peso_fibra_kg   DECIMAL(6,3) NOT NULL CHECK (peso_fibra_kg > 0),
    calidad_fibra   calidad_fibra_enum,
    micrones        DECIMAL(5,2),
    observaciones   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE esquilas IS 'Cada evento de esquila por animal. Origen del inventario de fibra.';

CREATE INDEX idx_esquilas_alpaca ON esquilas(alpaca_id);

-- ============================================================
-- TABLA 7: registros_costo
-- Módulo "Filtro de Costos Integral" — cada gasto del productor.
-- ============================================================
CREATE TABLE registros_costo (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    productor_id    UUID NOT NULL REFERENCES productores(id) ON DELETE CASCADE,
    alpaca_id       UUID REFERENCES alpacas(id) ON DELETE SET NULL,  -- NULL = hato completo
    periodo         VARCHAR(30) NOT NULL,                             -- Ej: "2024-Q1"
    tipo_costo      tipo_costo_enum NOT NULL,
    monto           DECIMAL(10,2) NOT NULL CHECK (monto > 0),
    moneda          VARCHAR(5) NOT NULL DEFAULT 'PEN',
    num_animales    INTEGER,                                          -- Cuántas alpacas cubre
    periodo_meses   INTEGER NOT NULL DEFAULT 1,                       -- Duración del gasto
    descripcion     TEXT,
    fecha_registro  DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN registros_costo.alpaca_id IS 'NULL = gasto del hato completo. Referenciado = gasto de un animal específico.';

CREATE INDEX idx_costo_productor      ON registros_costo(productor_id);
CREATE INDEX idx_costo_productor_tipo ON registros_costo(productor_id, tipo_costo);
CREATE INDEX idx_costo_periodo        ON registros_costo(productor_id, periodo);

-- ============================================================
-- TABLA 8: productos
-- Las 3 líneas de valor: fibra, carne, cuero, abono.
-- Inventario disponible para vender en el marketplace.
-- ============================================================
CREATE TABLE productos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    productor_id    UUID NOT NULL REFERENCES productores(id) ON DELETE CASCADE,
    alpaca_id       UUID REFERENCES alpacas(id) ON DELETE SET NULL,
    esquila_id      UUID REFERENCES esquilas(id) ON DELETE SET NULL,
    tipo            categoria_producto_enum NOT NULL,
    sub_categoria   VARCHAR(80),
    -- FIBRA:  'Baby Alpaca', 'Fleece', 'Medium Fleece', 'Huarizo', 'Gruesa'
    -- CARNE:  'Fresco', 'Charqui', 'Embutido', 'Vísceras'
    -- CUERO:  'Curtido', 'Crudo', 'Piel entera'
    -- ABONO:  'Estiercol fresco', 'Compostado'
    cantidad        DECIMAL(10,3) NOT NULL CHECK (cantidad > 0),
    unidad          VARCHAR(20) NOT NULL,                  -- kg, unidad, m2, fardo
    calidad_grado   VARCHAR(15) CHECK (calidad_grado IN ('PREMIUM','A','B','C','DESCARTE')),
    senasa_aprobado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_cosecha   DATE,                                  -- Fecha de esquila o faenado
    costo_por_unidad DECIMAL(10,2),                       -- Del módulo de costos
    precio_sugerido  DECIMAL(10,2),                       -- Calculado por el sistema
    estado          VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE'
                    CHECK (estado IN ('DISPONIBLE','RESERVADO','VENDIDO','VENCIDO')),
    notas           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN productos.precio_sugerido IS 'Calculado por pricingService: costo_total / cantidad + margen mínimo.';
COMMENT ON COLUMN productos.senasa_aprobado IS 'TRUE requerido para venta de carne a mercados formales.';

CREATE TRIGGER trg_productos_updated_at
    BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_productos_productor  ON productos(productor_id);
CREATE INDEX idx_productos_disponible ON productos(tipo, estado) WHERE estado = 'DISPONIBLE';

-- ============================================================
-- TABLA 9: publicaciones
-- Anuncio del productor en el Mercado Directo.
-- Un productor publica un producto para que compradores lo vean.
-- ============================================================
CREATE TABLE publicaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    productor_id    UUID NOT NULL REFERENCES productores(id) ON DELETE CASCADE,
    producto_id     UUID REFERENCES productos(id) ON DELETE SET NULL,
    titulo          VARCHAR(200) NOT NULL,
    descripcion     TEXT NOT NULL,
    categoria       categoria_producto_enum NOT NULL,
    cantidad        DECIMAL(10,3) NOT NULL CHECK (cantidad > 0),
    unidad          VARCHAR(20) NOT NULL,
    precio_solicitado DECIMAL(10,2) NOT NULL CHECK (precio_solicitado > 0),
    precio_minimo   DECIMAL(10,2),                        -- No se muestra al comprador
    ubicacion       VARCHAR(200),
    imagenes        TEXT[],                               -- Array de URLs (Supabase Storage)
    acepta_oferta   BOOLEAN NOT NULL DEFAULT TRUE,        -- ¿Permite negociación?
    estado          estado_publicacion_enum NOT NULL DEFAULT 'ACTIVA',
    vistas          INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days')
);
COMMENT ON COLUMN publicaciones.precio_minimo IS 'Umbral privado. El sistema rechaza automáticamente ofertas menores.';

CREATE TRIGGER trg_publicaciones_updated_at
    BEFORE UPDATE ON publicaciones FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_publicaciones_productor ON publicaciones(productor_id);
CREATE INDEX idx_publicaciones_activas   ON publicaciones(categoria, estado) WHERE estado = 'ACTIVA';

-- ============================================================
-- TABLA 10: solicitudes_comprador
-- El comprador publica lo que necesita (demanda activa).
-- Motor de matching oferta-demanda.
-- ============================================================
CREATE TABLE solicitudes_comprador (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comprador_id    UUID NOT NULL REFERENCES compradores(id) ON DELETE CASCADE,
    tipo            categoria_producto_enum NOT NULL,
    sub_categoria   VARCHAR(80),
    cantidad_needed DECIMAL(10,3) CHECK (cantidad_needed > 0),
    unidad          VARCHAR(20),
    precio_maximo   DECIMAL(10,2) CHECK (precio_maximo > 0),
    region_preferida VARCHAR(100),
    calidad_requerida VARCHAR(15) CHECK (calidad_requerida IN ('PREMIUM','A','B','C','CUALQUIERA')),
    senasa_requerido BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_necesaria DATE,
    estado          VARCHAR(20) NOT NULL DEFAULT 'ABIERTA'
                    CHECK (estado IN ('ABIERTA','EN_NEGOCIACION','CERRADA','CANCELADA')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days')
);
COMMENT ON TABLE solicitudes_comprador IS 'Demanda publicada por compradores — base del matching con publicaciones.';

CREATE INDEX idx_solicitudes_abiertas ON solicitudes_comprador(tipo, estado) WHERE estado = 'ABIERTA';
CREATE INDEX idx_solicitudes_comprador ON solicitudes_comprador(comprador_id);

-- ============================================================
-- TABLA 11: ofertas
-- El comprador hace una oferta sobre una publicación.
-- Soporte para negociación precio y cierre de venta.
-- ============================================================
CREATE TABLE ofertas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publicacion_id  UUID NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
    comprador_id    UUID NOT NULL REFERENCES compradores(id) ON DELETE CASCADE,
    precio_ofertado DECIMAL(10,2) NOT NULL CHECK (precio_ofertado > 0),
    cantidad        DECIMAL(10,3) NOT NULL CHECK (cantidad > 0),
    mensaje         TEXT,
    estado          estado_oferta_enum NOT NULL DEFAULT 'PENDIENTE',
    respuesta       TEXT,                                 -- Respuesta del productor
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);
COMMENT ON TABLE ofertas IS 'Negociación precio entre comprador y productor sobre una publicación activa.';

CREATE TRIGGER trg_ofertas_updated_at
    BEFORE UPDATE ON ofertas FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_ofertas_publicacion ON ofertas(publicacion_id);
CREATE INDEX idx_ofertas_comprador   ON ofertas(comprador_id);

-- ============================================================
-- TABLA 12: transacciones
-- Venta cerrada. Genera historial de ingresos del productor.
-- ============================================================
CREATE TABLE transacciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    productor_id    UUID NOT NULL REFERENCES productores(id) ON DELETE CASCADE,
    producto_id     UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    publicacion_id  UUID REFERENCES publicaciones(id) ON DELETE SET NULL,
    oferta_id       UUID REFERENCES ofertas(id) ON DELETE SET NULL,
    comprador_id    UUID REFERENCES compradores(id) ON DELETE SET NULL,
    comprador_nombre VARCHAR(150),                        -- Nombre libre si no está registrado
    tipo_comprador  tipo_comprador_enum,
    cantidad_vendida DECIMAL(10,3) NOT NULL CHECK (cantidad_vendida > 0),
    precio_unitario  DECIMAL(10,2) NOT NULL CHECK (precio_unitario > 0),
    monto_total      DECIMAL(12,2) GENERATED ALWAYS AS (cantidad_vendida * precio_unitario) STORED,
    es_formal        BOOLEAN NOT NULL DEFAULT FALSE,
    metodo_pago      metodo_pago_enum,
    fecha_venta      DATE NOT NULL DEFAULT CURRENT_DATE,
    notas            TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN transacciones.monto_total IS 'Calculado automáticamente: cantidad_vendida × precio_unitario.';

CREATE INDEX idx_transacciones_productor ON transacciones(productor_id);
CREATE INDEX idx_transacciones_fecha     ON transacciones(productor_id, fecha_venta DESC);

-- ============================================================
-- TABLA 13: documentos
-- Boletas, facturas, guías SENASA generadas por el sistema.
-- Vinculadas a una transacción o al productor directamente.
-- ============================================================
CREATE TABLE documentos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    productor_id    UUID NOT NULL REFERENCES productores(id) ON DELETE CASCADE,
    transaccion_id  UUID REFERENCES transacciones(id) ON DELETE SET NULL,
    tipo            tipo_documento_enum NOT NULL,
    numero          VARCHAR(50),                          -- Número de comprobante
    contenido       JSONB NOT NULL,                       -- Datos completos del documento
    url_pdf         VARCHAR(500),                         -- URL en Supabase Storage
    estado          estado_documento_enum NOT NULL DEFAULT 'BORRADOR',
    fecha_emision   DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON COLUMN documentos.contenido IS 'JSONB con todos los datos: emisor, receptor, items, totales, etc.';

CREATE TRIGGER trg_documentos_updated_at
    BEFORE UPDATE ON documentos FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE INDEX idx_documentos_productor    ON documentos(productor_id);
CREATE INDEX idx_documentos_transaccion  ON documentos(transaccion_id);

-- ============================================================
-- TABLA 14: items_documento
-- Líneas de detalle de cada boleta/factura.
-- ============================================================
CREATE TABLE items_documento (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_id    UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
    descripcion     VARCHAR(300) NOT NULL,
    cantidad        DECIMAL(10,3) NOT NULL,
    unidad          VARCHAR(20) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(12,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE items_documento IS 'Líneas de detalle de cada boleta o factura generada.';

CREATE INDEX idx_items_documento ON items_documento(documento_id);

-- ============================================================
-- TABLA 15: precios_referencia
-- Tabla de precios de mercado por categoría de producto.
-- La actualiza el equipo KORI ALP periódicamente.
-- Sirve para calcular el precio_sugerido del productor.
-- ============================================================
CREATE TABLE precios_referencia (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo            categoria_producto_enum NOT NULL,
    sub_categoria   VARCHAR(80) NOT NULL,
    calidad_grado   VARCHAR(15),
    precio_min      DECIMAL(10,2) NOT NULL,
    precio_max      DECIMAL(10,2) NOT NULL,
    precio_promedio DECIMAL(10,2) NOT NULL,
    unidad          VARCHAR(20) NOT NULL,
    region          VARCHAR(100),                         -- NULL = precio nacional
    fuente          VARCHAR(200),                         -- Ej: 'CITE Sipan 2024', 'ADEX'
    vigente_desde   DATE NOT NULL DEFAULT CURRENT_DATE,
    vigente_hasta   DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_precio_rango CHECK (precio_max >= precio_min)
);
COMMENT ON TABLE precios_referencia IS 'Precios de mercado actualizados por el equipo. Base para calcular precio justo sugerido.';

CREATE INDEX idx_precios_tipo ON precios_referencia(tipo, sub_categoria);

-- ============================================================
-- TRIGGER: Actualizar total_alpacas en productores
-- Se dispara al insertar, actualizar o borrar en alpacas.
-- ============================================================
CREATE OR REPLACE FUNCTION fn_sync_total_alpacas()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE productores
    SET total_alpacas = (
        SELECT COUNT(*) FROM alpacas
        WHERE productor_id = COALESCE(NEW.productor_id, OLD.productor_id)
          AND estado = 'ACTIVO'
    )
    WHERE id = COALESCE(NEW.productor_id, OLD.productor_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_total_alpacas
    AFTER INSERT OR UPDATE OR DELETE ON alpacas
    FOR EACH ROW EXECUTE FUNCTION fn_sync_total_alpacas();

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista: Resumen financiero por productor
CREATE VIEW v_resumen_productor AS
SELECT
    p.id                        AS productor_id,
    u.nombre                    AS productor_nombre,
    p.region,
    p.comunidad,
    p.total_alpacas,
    COALESCE(SUM(t.monto_total), 0)       AS ingresos_totales,
    COALESCE(SUM(rc.monto), 0)            AS costos_totales,
    COALESCE(SUM(t.monto_total), 0) -
    COALESCE(SUM(rc.monto), 0)            AS ganancia_estimada,
    COUNT(DISTINCT t.id)                  AS num_ventas,
    COUNT(DISTINCT pub.id)                AS publicaciones_activas
FROM productores p
JOIN usuarios u ON u.id = p.usuario_id
LEFT JOIN transacciones t  ON t.productor_id = p.id
LEFT JOIN registros_costo rc ON rc.productor_id = p.id
LEFT JOIN publicaciones pub ON pub.productor_id = p.id AND pub.estado = 'ACTIVA'
GROUP BY p.id, u.nombre, p.region, p.comunidad, p.total_alpacas;

-- Vista: Marketplace activo (oferta visible)
CREATE VIEW v_marketplace_activo AS
SELECT
    pub.id,
    pub.titulo,
    pub.categoria,
    prod.sub_categoria AS tipo_especifico,
    pub.cantidad,
    pub.unidad,
    pub.precio_solicitado,
    pub.ubicacion,
    pub.imagenes,
    pub.acepta_oferta,
    pub.vistas,
    pub.created_at,
    pub.expires_at,
    u.nombre           AS productor_nombre,
    p.region,
    p.comunidad,
    p.is_formalizado
FROM publicaciones pub
JOIN productores p ON p.id = pub.productor_id
JOIN usuarios u ON u.id = p.usuario_id
LEFT JOIN productos prod ON prod.id = pub.producto_id
WHERE pub.estado = 'ACTIVA'
  AND pub.expires_at > NOW();

-- Vista: Costo total por productor y periodo
CREATE VIEW v_costos_por_periodo AS
SELECT
    productor_id,
    periodo,
    SUM(monto)                                               AS costo_total,
    SUM(monto) FILTER (WHERE tipo_costo = 'PASTOS')          AS costo_pastos,
    SUM(monto) FILTER (WHERE tipo_costo = 'VACUNAS')         AS costo_vacunas,
    SUM(monto) FILTER (WHERE tipo_costo = 'MANO_OBRA')       AS costo_mano_obra,
    SUM(monto) FILTER (WHERE tipo_costo = 'ESQUILA')         AS costo_esquila,
    SUM(monto) FILTER (WHERE tipo_costo = 'FAENADO')         AS costo_faenado,
    SUM(monto) FILTER (WHERE tipo_costo = 'TRANSPORTE')      AS costo_transporte,
    SUM(monto) FILTER (WHERE tipo_costo = 'CERTIFICACION')   AS costo_certificacion,
    SUM(monto) FILTER (WHERE tipo_costo = 'OTROS')           AS costo_otros,
    COUNT(DISTINCT alpaca_id) FILTER (WHERE alpaca_id IS NOT NULL) AS animales_con_costo
FROM registros_costo
GROUP BY productor_id, periodo;

-- ============================================================
-- ROW LEVEL SECURITY (Supabase RLS)
-- El productor solo ve SUS datos. El comprador solo sus datos.
-- ============================================================
ALTER TABLE productores        ENABLE ROW LEVEL SECURITY;
ALTER TABLE alpacas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_costo    ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicaciones      ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones      ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE compradores        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas            ENABLE ROW LEVEL SECURITY;

-- Productores: solo ven su propio perfil
CREATE POLICY pol_productores_own ON productores
    USING (usuario_id = (SELECT id FROM usuarios WHERE auth_id = auth.uid()));

-- Alpacas: solo el productor dueño las ve/edita
CREATE POLICY pol_alpacas_own ON alpacas
    USING (productor_id IN (
        SELECT id FROM productores WHERE usuario_id =
            (SELECT id FROM usuarios WHERE auth_id = auth.uid())
    ));

-- Publicaciones: todos pueden ver activas, solo el dueño edita
CREATE POLICY pol_publicaciones_read ON publicaciones FOR SELECT
    USING (estado = 'ACTIVA' OR productor_id IN (
        SELECT id FROM productores WHERE usuario_id =
            (SELECT id FROM usuarios WHERE auth_id = auth.uid())
    ));

-- ============================================================
-- FIN DEL ESQUEMA v2.0
-- Seeds: database/seeds/01_precios_referencia.sql
--        database/seeds/02_datos_prueba.sql
-- ============================================================
