-- salons テーブルに Google Places 関連カラム追加
ALTER TABLE salons ADD COLUMN IF NOT EXISTS google_place_id TEXT UNIQUE;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1);
ALTER TABLE salons ADD COLUMN IF NOT EXISTS google_review_count INT DEFAULT 0;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS google_photos JSONB DEFAULT '[]';
ALTER TABLE salons ADD COLUMN IF NOT EXISTS last_scraped_at TIMESTAMPTZ;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_salons_google_place_id ON salons(google_place_id);

-- 外部レビューテーブル（Google口コミ等を格納）
CREATE TABLE IF NOT EXISTS external_reviews (
  id SERIAL PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL DEFAULT 'google',
  source_review_id TEXT,
  author_name TEXT NOT NULL,
  author_photo_url TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  published_at TIMESTAMPTZ,
  language TEXT DEFAULT 'ja',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source, source_review_id)
);

ALTER TABLE external_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "外部レビューは全員閲覧可" ON external_reviews FOR SELECT USING (true);
CREATE INDEX idx_external_reviews_salon ON external_reviews(salon_id);
CREATE INDEX idx_external_reviews_source ON external_reviews(source);
