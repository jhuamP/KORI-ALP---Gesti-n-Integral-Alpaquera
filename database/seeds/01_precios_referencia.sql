-- ============================================================
-- SEED 01: Precios de Referencia del Mercado
-- Fuente: CITE Sipan, ADEX, SENASA Peru 2024
-- ============================================================

INSERT INTO precios_referencia (tipo, sub_categoria, calidad_grado, precio_min, precio_max, precio_promedio, unidad, region, fuente, vigente_desde) VALUES
-- FIBRA
('FIBRA', 'Baby Alpaca',   'PREMIUM', 45.00, 75.00, 58.00, 'kg', NULL,     'CITE Sipan 2024', '2024-01-01'),
('FIBRA', 'Baby Alpaca',   'A',       38.00, 55.00, 46.00, 'kg', NULL,     'CITE Sipan 2024', '2024-01-01'),
('FIBRA', 'Fleece',        'A',       22.00, 35.00, 28.00, 'kg', NULL,     'CITE Sipan 2024', '2024-01-01'),
('FIBRA', 'Fleece',        'B',       18.00, 25.00, 21.00, 'kg', NULL,     'CITE Sipan 2024', '2024-01-01'),
('FIBRA', 'Medium Fleece', 'B',       14.00, 20.00, 17.00, 'kg', NULL,     'CITE Sipan 2024', '2024-01-01'),
('FIBRA', 'Huarizo',       'C',        9.00, 14.00, 11.00, 'kg', NULL,     'CITE Sipan 2024', '2024-01-01'),
('FIBRA', 'Gruesa',        'DESCARTE', 5.00,  9.00,  7.00, 'kg', NULL,     'CITE Sipan 2024', '2024-01-01'),
-- CARNE
('CARNE', 'Fresco',        'A',       12.00, 18.00, 15.00, 'kg', 'Puno',   'SENASA 2024',     '2024-01-01'),
('CARNE', 'Charqui',       'A',       28.00, 45.00, 36.00, 'kg', NULL,     'SENASA 2024',     '2024-01-01'),
('CARNE', 'Embutido',      'A',       22.00, 35.00, 28.00, 'kg', NULL,     'SENASA 2024',     '2024-01-01'),
-- CUERO
('CUERO', 'Piel entera',   'A',       25.00, 50.00, 37.00, 'unidad', NULL, 'Artesanos Peru 2024', '2024-01-01'),
('CUERO', 'Curtido',       'A',       45.00, 90.00, 65.00, 'unidad', NULL, 'Artesanos Peru 2024', '2024-01-01'),
-- ABONO
('ABONO', 'Estiercol fresco',   NULL,  0.50,  1.50,  0.90, 'kg', 'Puno',  'Mercado local 2024', '2024-01-01'),
('ABONO', 'Compostado',         NULL,  1.50,  3.00,  2.20, 'kg', NULL,    'Mercado local 2024', '2024-01-01');
