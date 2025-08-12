
-- Books
INSERT INTO book (id, title, author, isbn, available) VALUES 
(1, 'The Pragmatic Programmer', 'Andy Hunt', '978-0201616224', true),
(2, 'Clean Code', 'Robert C. Martin', '978-0132350884', true),
(3, 'Design Patterns', 'Erich Gamma', '978-0201633610', true);

-- Users
INSERT INTO library_user (id, name, email, phone) VALUES
(1, 'Alice', 'alice@example.com', '1234567890'),
(2, 'Bob', 'bob@example.com', '2345678901');

-- Borrow Records
INSERT INTO borrow_record (id, book_id, user_id, borrow_date, return_date) VALUES
(1, 1, 1, '2025-08-01 10:00:00', NULL),
(2, 2, 2, '2025-07-20 14:00:00', '2025-07-30 16:00:00');

-- Borrow Table (if exists)
-- INSERT INTO borrow (id, book_id, user_id, borrow_date) VALUES
-- (1, 1, 1, '2025-08-01 10:00:00');

-- Borrow History Table (if exists)
-- INSERT INTO borrow_history (id, book_id, user_id, borrow_date, return_date) VALUES
-- (1, 2, 2, '2025-07-20 14:00:00', '2025-07-30 16:00:00');
