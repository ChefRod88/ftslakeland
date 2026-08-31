-- Form submissions for the public site. No student records here — the portal
-- (a real SIS) is a separate, later system.

CREATE TABLE inquiries (
  id            TEXT PRIMARY KEY,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  home_church   TEXT,
  campus        TEXT,
  program       TEXT,
  message       TEXT,
  source        TEXT NOT NULL DEFAULT 'admissions',
  ip            TEXT,
  user_agent    TEXT
);

CREATE TABLE sponsorship_requests (
  id            TEXT PRIMARY KEY,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  church_name   TEXT NOT NULL,
  contact_name  TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  students      TEXT,
  message       TEXT,
  ip            TEXT,
  user_agent    TEXT
);

CREATE TABLE applications (
  id             TEXT PRIMARY KEY,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  submitted_at   TEXT,
  status         TEXT NOT NULL DEFAULT 'draft',   -- draft | submitted
  resume_token   TEXT UNIQUE NOT NULL,
  reference_code TEXT UNIQUE,

  full_name      TEXT,
  email          TEXT,
  phone          TEXT,
  date_of_birth  TEXT,
  address        TEXT,

  home_church    TEXT,
  pastor_name    TEXT,
  pastor_email   TEXT,
  pastor_phone   TEXT,

  program        TEXT,
  campus         TEXT,
  start_term     TEXT,
  ministry_role  TEXT,
  education      TEXT,
  testimony      TEXT,

  ip             TEXT,
  user_agent     TEXT
);

CREATE INDEX idx_applications_status ON applications (status, created_at);

CREATE TABLE application_files (
  id            TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications (id),
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  kind          TEXT NOT NULL,          -- e.g. 'pastor_letter'
  r2_key        TEXT NOT NULL,
  filename      TEXT NOT NULL,
  content_type  TEXT,
  size_bytes    INTEGER
);

CREATE INDEX idx_files_application ON application_files (application_id);

-- Lightweight audit of what the forms did, for debugging and abuse review.
CREATE TABLE form_events (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  kind        TEXT NOT NULL,   -- inquiry.submit | application.save | application.submit | *.rejected
  ref_id      TEXT,
  ip          TEXT,
  detail      TEXT
);
