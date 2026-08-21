-- Tabla site_settings para configuracion del sitio
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: SELECT publico, solo autenticados pueden escribir
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated write site_settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Datos iniciales
INSERT INTO site_settings (key, value) VALUES
  ('hero_video_url', '{"url": "/hero.mp4"}'),
  ('hero_image', '{"url": "/categorias/basket.jpg"}'),
  ('hero_title', '{"text": ""}'),
  ('hero_subtitle', '{"text": ""}'),
  ('announcement_text', '{"text": "Envios a nivel nacional | Pago seguro con Wompi | Cambios sin complicaciones"}')
ON CONFLICT (key) DO NOTHING;
