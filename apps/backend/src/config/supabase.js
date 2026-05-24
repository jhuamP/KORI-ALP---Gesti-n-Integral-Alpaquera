// ============================================================
// config/supabase.js — Cliente Supabase para el backend
// Úsalo en cualquier módulo: const { supabase } = require('./config/supabase')
// ============================================================
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL        = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('❌ Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en el .env')
}

// Cliente con service_role — SOLO para el backend (admin)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

module.exports = { supabase }
