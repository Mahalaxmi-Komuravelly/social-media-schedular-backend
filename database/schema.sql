-- =========================
-- ENUM TYPES
-- =========================

create type user_role as enum ('ADMIN', 'USER', 'MANAGER');

create type post_status as enum ('draft', 'scheduled', 'published');

-- =========================
-- USERS TABLE
-- =========================

create table users(
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null,
  email varchar(150) unique not null,
  password varchar(255) not null,
  role user_role default 'USER',
  created_at timestamptz not null default now()
);

-- =========================
-- CAMPAIGNS TABLE
-- =========================

create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  name varchar(150) not null,
  description text,
  start_date date not null,
  end_date date not null,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

-- =========================
-- POSTS TABLE
-- =========================

create table posts (
  id uuid primary key default uuid_generate_v4(),
  caption text not null,
  media_url text,
  platform varchar(50) not null,
  scheduled_time timestamptz,
  status post_status default 'draft',
  user_id uuid not null references users(id) on delete cascade,
  campaign_id uuid references campaigns(id) on delete set null,
  created_at timestamptz not null default now()
);


-- =========================
-- ANALYTICS TABLE
-- =========================

create table analytics (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references posts(id) on delete cascade,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  engagement_rate float default 0,
  created_at timestamptz not null default now()
);
