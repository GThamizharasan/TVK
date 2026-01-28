
-- TVK (Tamizhaga Vettri Kazhagam) PostgreSQL Schema v1.0

-- 1. Identity & Role Management
CREATE TYPE user_role AS ENUM ('GUEST', 'MEMBER', 'ADMIN');
CREATE TYPE sso_provider AS ENUM ('GOOGLE', 'FACEBOOK', 'TVK_CORE');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash TEXT, -- Stored securely
    role user_role DEFAULT 'MEMBER',
    membership_id VARCHAR(50) UNIQUE,
    mobile VARCHAR(15),
    constituency VARCHAR(100),
    avatar_url TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sso_provider sso_provider DEFAULT 'TVK_CORE'
);

-- 2. News & Communication
CREATE TABLE news_ticker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Hero Carousel
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    cta_text VARCHAR(50) DEFAULT 'Learn More',
    accent_color VARCHAR(10) DEFAULT '#D41D24',
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE
);

-- 4. Political Calendar
CREATE TYPE event_type AS ENUM ('Rally', 'Meeting', 'Conference');

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    type event_type DEFAULT 'Meeting',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Vision & Policy
CREATE TABLE manifesto_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    order_index INT DEFAULT 0
);

CREATE TABLE ideology (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    order_index INT DEFAULT 0
);

-- 6. Engagement & Polls
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    percentage INT DEFAULT 0
);

-- 7. Leadership & History
CREATE TABLE leadership (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url TEXT,
    order_index INT DEFAULT 0
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_label VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    order_index INT DEFAULT 0
);

-- 8. Digital Asset Management
CREATE TYPE media_type AS ENUM ('POSTER', 'WALLPAPER', 'VIDEO');

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type media_type DEFAULT 'POSTER',
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Audit & Analytics
CREATE TYPE tx_type AS ENUM ('MEMBERSHIP', 'VOTE', 'SUGGESTION', 'DONATION', 'POLL');

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type tx_type NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_banners_order ON banners(order_index);
