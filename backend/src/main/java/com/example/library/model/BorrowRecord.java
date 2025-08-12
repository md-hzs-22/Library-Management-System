package com.example.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_record")
public class BorrowRecord {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "book_id")
  private Book book;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  private LocalDateTime borrowDate;
  private LocalDateTime returnDate;

  public BorrowRecord(){}

  public Long getId(){ return id; }
  public void setId(Long id){ this.id = id; }

  public Book getBook(){ return book; }
  public void setBook(Book book){ this.book = book; }

  public User getUser(){ return user; }
  public void setUser(User user){ this.user = user; }

  public LocalDateTime getBorrowDate(){ return borrowDate; }
  public void setBorrowDate(LocalDateTime d){ this.borrowDate = d; }

  public LocalDateTime getReturnDate(){ return returnDate; }
  public void setReturnDate(LocalDateTime d){ this.returnDate = d; }
}
