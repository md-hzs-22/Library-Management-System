package com.example.library;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Borrow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long bookId;
    private String borrowerName;
    private String borrowerEmail;
    private String borrowerPhone;
    private LocalDateTime borrowDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getBorrowerName() { return borrowerName; }
    public void setBorrowerName(String borrowerName) { this.borrowerName = borrowerName; }

    public String getBorrowerEmail() { return borrowerEmail; }
    public void setBorrowerEmail(String borrowerEmail) { this.borrowerEmail = borrowerEmail; }

    public String getBorrowerPhone() { return borrowerPhone; }
    public void setBorrowerPhone(String borrowerPhone) { this.borrowerPhone = borrowerPhone; }

    public LocalDateTime getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDateTime borrowDate) { this.borrowDate = borrowDate; }
}
