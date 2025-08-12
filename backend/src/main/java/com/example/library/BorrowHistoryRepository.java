package com.example.library;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowHistoryRepository extends JpaRepository<BorrowHistory, Long> {
}
