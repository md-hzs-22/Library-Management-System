package com.example.library;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class BorrowHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String borrowerName;
    private String borrowerEmail;
    private String borrowerPhone;
    private String bookTitle;

    private LocalDateTime borrowDate;
    private LocalDateTime returnDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBorrowerName() { return borrowerName; }
    public void setBorrowerName(String borrowerName) { this.borrowerName = borrowerName; }

    public String getBorrowerEmail() { return borrowerEmail; }
    public void setBorrowerEmail(String borrowerEmail) { this.borrowerEmail = borrowerEmail; }

    public String getBorrowerPhone() { return borrowerPhone; }
    public void setBorrowerPhone(String borrowerPhone) { this.borrowerPhone = borrowerPhone; }

    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

    public LocalDateTime getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDateTime borrowDate) { this.borrowDate = borrowDate; }

    public LocalDateTime getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDateTime returnDate) { this.returnDate = returnDate; }
}
