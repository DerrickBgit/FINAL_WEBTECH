-- Sample Data for Inventory Management System
-- Run this AFTER creating the tables with supabase-schema.sql
-- This will insert test data into all tables

-- Insert sample users
INSERT INTO "users" ("email", "password_hash", "first_name", "last_name", "role", "created_at", "updated_at")
VALUES
    ('admin@inventory.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Admin', 'User', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('user@inventory.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'John', 'Doe', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('manager@inventory.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Jane', 'Smith', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- Note: The password_hash above is a placeholder. In production, use bcrypt to hash passwords.
-- For testing, you can use: bcrypt.hashSync('password123', 10)
-- Example real hash for 'admin123': '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

-- Insert sample categories (for user with id=1)
INSERT INTO "categories" ("name", "description", "user_id", "created_at", "updated_at")
VALUES
    ('Electronics', 'Electronic devices and components', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Clothing', 'Apparel and fashion items', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Food & Beverages', 'Food items and drinks', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Office Supplies', 'Stationery and office equipment', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Furniture', 'Furniture and home decor', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("user_id", "name") DO NOTHING;

-- Insert sample items
INSERT INTO "items" ("name", "description", "sku", "user_id", "category_id", "current_stock", "min_stock", "unit_price", "created_at", "updated_at")
VALUES
    ('Laptop Computer', 'High-performance laptop for office use', 'LAP-001', 1, 1, 15, 5, 999.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Wireless Mouse', 'Ergonomic wireless mouse', 'MOU-001', 1, 1, 50, 10, 29.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('T-Shirt', 'Cotton t-shirt, various sizes', 'TSH-001', 1, 2, 100, 20, 19.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Jeans', 'Blue denim jeans', 'JEA-001', 1, 2, 75, 15, 49.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Coffee Beans', 'Premium arabica coffee beans', 'COF-001', 1, 3, 200, 50, 24.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Notebook', 'A4 ruled notebook, 100 pages', 'NOT-001', 1, 4, 150, 30, 4.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Desk Chair', 'Ergonomic office chair', 'CHA-001', 1, 5, 25, 5, 199.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Office Desk', 'Wooden office desk', 'DES-001', 1, 5, 10, 3, 299.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Keyboard', 'Mechanical keyboard', 'KEY-001', 1, 1, 30, 8, 79.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Monitor', '27-inch 4K monitor', 'MON-001', 1, 1, 20, 5, 349.99, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("user_id", "sku") DO NOTHING;

-- Insert sample stock movements
INSERT INTO "stock_movements" ("item_id", "type", "quantity", "reason", "notes", "created_at", "created_by")
VALUES
    (1, 'in', 20, 'purchase', 'Initial stock purchase', CURRENT_TIMESTAMP - INTERVAL '30 days', 1),
    (1, 'out', 5, 'sale', 'Sold to customer', CURRENT_TIMESTAMP - INTERVAL '15 days', 1),
    (2, 'in', 60, 'purchase', 'Bulk order received', CURRENT_TIMESTAMP - INTERVAL '20 days', 1),
    (2, 'out', 10, 'sale', 'Regular sales', CURRENT_TIMESTAMP - INTERVAL '10 days', 1),
    (3, 'in', 120, 'purchase', 'New shipment arrived', CURRENT_TIMESTAMP - INTERVAL '25 days', 1),
    (3, 'out', 20, 'sale', 'Seasonal sale', CURRENT_TIMESTAMP - INTERVAL '5 days', 1),
    (4, 'in', 80, 'purchase', 'Inventory restock', CURRENT_TIMESTAMP - INTERVAL '18 days', 1),
    (4, 'out', 5, 'adjustment', 'Damaged items removed', CURRENT_TIMESTAMP - INTERVAL '8 days', 1),
    (5, 'in', 250, 'purchase', 'Large order', CURRENT_TIMESTAMP - INTERVAL '22 days', 1),
    (5, 'out', 50, 'sale', 'High demand item', CURRENT_TIMESTAMP - INTERVAL '3 days', 1),
    (6, 'in', 180, 'purchase', 'Back to school stock', CURRENT_TIMESTAMP - INTERVAL '28 days', 1),
    (6, 'out', 30, 'sale', 'Regular sales', CURRENT_TIMESTAMP - INTERVAL '12 days', 1),
    (7, 'in', 30, 'purchase', 'New furniture line', CURRENT_TIMESTAMP - INTERVAL '14 days', 1),
    (7, 'out', 5, 'sale', 'Office setup', CURRENT_TIMESTAMP - INTERVAL '6 days', 1),
    (8, 'in', 12, 'purchase', 'Premium furniture', CURRENT_TIMESTAMP - INTERVAL '16 days', 1),
    (8, 'out', 2, 'sale', 'Corporate order', CURRENT_TIMESTAMP - INTERVAL '4 days', 1);

-- Insert sample sales
INSERT INTO "sales" ("item_id", "user_id", "quantity", "unit_price", "total_price", "sale_date", "notes", "created_at")
VALUES
    (1, 1, 2, 999.99, 1999.98, CURRENT_TIMESTAMP - INTERVAL '15 days', 'Bulk order discount applied', CURRENT_TIMESTAMP - INTERVAL '15 days'),
    (2, 1, 5, 29.99, 149.95, CURRENT_TIMESTAMP - INTERVAL '10 days', 'Regular customer', CURRENT_TIMESTAMP - INTERVAL '10 days'),
    (3, 1, 10, 19.99, 199.90, CURRENT_TIMESTAMP - INTERVAL '5 days', 'Seasonal promotion', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    (4, 1, 3, 49.99, 149.97, CURRENT_TIMESTAMP - INTERVAL '8 days', 'Customer purchase', CURRENT_TIMESTAMP - INTERVAL '8 days'),
    (5, 1, 25, 24.99, 624.75, CURRENT_TIMESTAMP - INTERVAL '3 days', 'Cafe order', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    (6, 1, 15, 4.99, 74.85, CURRENT_TIMESTAMP - INTERVAL '12 days', 'School supply order', CURRENT_TIMESTAMP - INTERVAL '12 days'),
    (7, 1, 2, 199.99, 399.98, CURRENT_TIMESTAMP - INTERVAL '6 days', 'Office furniture', CURRENT_TIMESTAMP - INTERVAL '6 days'),
    (8, 1, 1, 299.99, 299.99, CURRENT_TIMESTAMP - INTERVAL '4 days', 'Single desk sale', CURRENT_TIMESTAMP - INTERVAL '4 days'),
    (9, 1, 4, 79.99, 319.96, CURRENT_TIMESTAMP - INTERVAL '7 days', 'Gaming setup', CURRENT_TIMESTAMP - INTERVAL '7 days'),
    (10, 1, 3, 349.99, 1049.97, CURRENT_TIMESTAMP - INTERVAL '9 days', 'Professional setup', CURRENT_TIMESTAMP - INTERVAL '9 days'),
    (1, 1, 1, 999.99, 999.99, CURRENT_TIMESTAMP - INTERVAL '2 days', 'Individual purchase', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (2, 1, 8, 29.99, 239.92, CURRENT_TIMESTAMP - INTERVAL '1 day', 'Bulk mouse order', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Verify data was inserted
SELECT 'Users inserted: ' || COUNT(*) FROM "users";
SELECT 'Categories inserted: ' || COUNT(*) FROM "categories";
SELECT 'Items inserted: ' || COUNT(*) FROM "items";
SELECT 'Stock movements inserted: ' || COUNT(*) FROM "stock_movements";
SELECT 'Sales inserted: ' || COUNT(*) FROM "sales";
