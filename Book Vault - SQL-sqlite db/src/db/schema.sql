CREATE TABLE IF NOT EXISTS
    users (
        id TEXT PRIMARY KEY, 
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL, 
        created_at DATE DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS
    books (
        id TEXT PRIMARY KEY, 
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price REAL CHECK (price >= 0),
        rating INTEGER CHECK (rating >=1 AND rating <=5),
        pages INTEGER NOT NULL,
        publish_date DATE,
        created_at DATE DEFAULT CURRENT_TIMESTAMP
    )