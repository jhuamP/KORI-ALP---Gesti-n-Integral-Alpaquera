-- ============================================================
-- SEED 02: Datos de Prueba — Don Teófilo y su comunidad
-- Usuarios, productores, alpacas, costos, productos, marketplace
-- ============================================================

-- ─── USUARIOS ───────────────────────────────────────────────
INSERT INTO usuarios (id, email, nombre, rol, idioma) VALUES
('11111111-0000-0000-0000-000000000001', 'teofilo@korialp.pe', 'Teófilo Quispe Mamani', 'PRODUCTOR', 'qu'),
('11111111-0000-0000-0000-000000000002', 'rosa@korialp.pe',    'Rosa Ccama Huanca',     'PRODUCTOR', 'es'),
('11111111-0000-0000-0000-000000000003', 'juan@korialp.pe',    'Juan Apaza Condori',    'PRODUCTOR', 'es'),
('22222222-0000-0000-0000-000000000001', 'textil@modaperu.com','Moda Andes SAC',        'COMPRADOR', 'es'),
('22222222-0000-0000-0000-000000000002', 'chef@restaurante.pe','Restaurante Qosqo',     'COMPRADOR', 'es');

-- ─── ASOCIACIÓN ─────────────────────────────────────────────
INSERT INTO asociaciones (id, nombre, region, distrito, comunidad, altitud_msnm) VALUES
('33333333-0000-0000-0000-000000000001', 'Asociación Alpaquera Macusani', 'Puno', 'Macusani', 'Quelcaya', 4500);

-- ─── PRODUCTORES ────────────────────────────────────────────
INSERT INTO productores (id, usuario_id, asociacion_id, dni, region, distrito, comunidad, altitud_msnm) VALUES
('44444444-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001', '00000001', 'Puno', 'Macusani', 'Quelcaya', 4500),
('44444444-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000001', '00000002', 'Puno', 'Macusani', 'Tantamaco', 4450),
('44444444-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003', NULL, '00000003', 'Puno', 'Carabaya', 'Usicayos', 4200);

-- ─── COMPRADORES ────────────────────────────────────────────
INSERT INTO compradores (id, usuario_id, nombre, empresa, tipo, ciudad, is_verificado, rating) VALUES
('55555555-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Ana María Torres', 'Moda Andes SAC', 'TEXTIL', 'Lima', TRUE, 4.8),
('55555555-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Chef Marco Ríos',  'Restaurante Qosqo', 'GASTRONOMICO', 'Cusco', TRUE, 4.5);

-- ─── ALPACAS de Don Teófilo ─────────────────────────────────
INSERT INTO alpacas (id, productor_id, arete, raza, sexo, edad_meses, peso_vivo_kg, calidad_fibra, micrones, estado) VALUES
('66666666-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 'A-001', 'HUACAYA', 'HEMBRA', 36, 65.5, 'BABY_ALPACA',   21.3, 'ACTIVO'),
('66666666-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', 'A-002', 'HUACAYA', 'HEMBRA', 48, 70.0, 'FLEECE',        23.5, 'ACTIVO'),
('66666666-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000001', 'A-003', 'SURI',    'MACHO',  60, 80.0, 'BABY_ALPACA',   20.8, 'ACTIVO'),
('66666666-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000001', 'A-004', 'HUACAYA', 'HEMBRA', 24, 55.0, 'FLEECE',        24.1, 'ACTIVO'),
('66666666-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000001', 'A-005', 'HUACAYA', 'MACHO',  72, 85.0, 'MEDIUM_FLEECE', 26.5, 'SACA');

-- ─── ESQUILAS ────────────────────────────────────────────────
INSERT INTO esquilas (id, alpaca_id, fecha_esquila, peso_fibra_kg, calidad_fibra, micrones) VALUES
('77777777-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '2024-04-15', 3.20, 'BABY_ALPACA', 21.3),
('77777777-0000-0000-0000-000000000002', '66666666-0000-0000-0000-000000000002', '2024-04-15', 2.80, 'FLEECE',      23.5),
('77777777-0000-0000-0000-000000000003', '66666666-0000-0000-0000-000000000003', '2024-04-16', 4.10, 'BABY_ALPACA', 20.8),
('77777777-0000-0000-0000-000000000004', '66666666-0000-0000-0000-000000000004', '2024-04-16', 2.50, 'FLEECE',      24.1);

-- ─── REGISTROS DE COSTO (campaña 2024-Esquila) ───────────────
INSERT INTO registros_costo (productor_id, periodo, tipo_costo, monto, num_animales, periodo_meses, descripcion) VALUES
('44444444-0000-0000-0000-000000000001', '2024-Esquila', 'PASTOS',    2400.00, 80, 12, 'Arrendamiento pasturas comunales todo el año'),
('44444444-0000-0000-0000-000000000001', '2024-Esquila', 'VACUNAS',    480.00, 80,  3, 'Vacunación trimestral: clostridiosis, sarampión'),
('44444444-0000-0000-0000-000000000001', '2024-Esquila', 'MANO_OBRA', 3600.00, 80, 12, 'Pastoreo y cuidado diario (2 personas)'),
('44444444-0000-0000-0000-000000000001', '2024-Esquila', 'ESQUILA',    560.00, 80,  1, 'Servicio de esquila + clasificación de fibra'),
('44444444-0000-0000-0000-000000000001', '2024-Esquila', 'TRANSPORTE', 120.00, 80,  1, 'Transporte fibra a Macusani'),
('44444444-0000-0000-0000-000000000001', '2024-Esquila', 'OTROS',       80.00, 80,  1, 'Sacos, cordeles, etiquetas');

-- ─── PRODUCTOS (resultado de las esquilas) ───────────────────
INSERT INTO productos (id, productor_id, alpaca_id, esquila_id, tipo, sub_categoria, cantidad, unidad, calidad_grado, senasa_aprobado, fecha_cosecha, costo_por_unidad, precio_sugerido, estado) VALUES
('88888888-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000001', 'FIBRA', 'Baby Alpaca', 3.20, 'kg', 'A', FALSE, '2024-04-15', 31.50, 46.00, 'DISPONIBLE'),
('88888888-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000002', '77777777-0000-0000-0000-000000000002', 'FIBRA', 'Fleece',      2.80, 'kg', 'A', FALSE, '2024-04-15', 31.50, 28.00, 'DISPONIBLE'),
('88888888-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000003', '77777777-0000-0000-0000-000000000003', 'FIBRA', 'Baby Alpaca', 4.10, 'kg', 'PREMIUM', FALSE, '2024-04-16', 31.50, 58.00, 'DISPONIBLE');

-- ─── PUBLICACIÓN EN MARKETPLACE ──────────────────────────────
INSERT INTO publicaciones (productor_id, producto_id, titulo, descripcion, categoria, cantidad, unidad, precio_solicitado, precio_minimo, ubicacion, acepta_oferta, estado) VALUES
('44444444-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000001',
 'Fibra Baby Alpaca Quelcaya — 3.2 kg, 21.3 micrones',
 'Fibra de alpaca Huacaya, esquilada en abril 2024. Sin mezcla, clasificada a mano. Disponible en Macusani para coordinación de recojo.',
 'FIBRA', 3.20, 'kg', 46.00, 38.00, 'Macusani, Puno', TRUE, 'ACTIVA'),

('44444444-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000003',
 'Fibra Suri Premium — 4.1 kg, 20.8 micrones',
 'Fibra Suri de alta pureza, micrones verificados en laboratorio. Ideal para diseñadores de moda sostenible.',
 'FIBRA', 4.10, 'kg', 58.00, 50.00, 'Macusani, Puno', TRUE, 'ACTIVA');

-- ─── SOLICITUD DE COMPRADOR ──────────────────────────────────
INSERT INTO solicitudes_comprador (comprador_id, tipo, sub_categoria, cantidad_needed, unidad, precio_maximo, region_preferida, calidad_requerida, estado) VALUES
('55555555-0000-0000-0000-000000000001', 'FIBRA', 'Baby Alpaca', 50.00, 'kg', 52.00, 'Puno', 'A', 'ABIERTA'),
('55555555-0000-0000-0000-000000000001', 'FIBRA', 'Baby Alpaca', 20.00, 'kg', 65.00, NULL,   'PREMIUM', 'ABIERTA');
