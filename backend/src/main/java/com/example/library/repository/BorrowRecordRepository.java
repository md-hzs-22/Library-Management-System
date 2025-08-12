package com.example.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.library.model.BorrowRecord;

import java.util.Optional;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
	Optional<BorrowRecord> findByBookIdAndUserIdAndReturnDateIsNull(Long bookId, Long userId);
}
