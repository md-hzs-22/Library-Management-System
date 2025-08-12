package com.example.library.controller;

import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.example.library.repository.BookRepository;
import com.example.library.repository.UserRepository;
import com.example.library.repository.BorrowRecordRepository;
import com.example.library.model.Book;
import com.example.library.model.User;
import com.example.library.model.BorrowRecord;
import com.example.library.BorrowRepository;
import com.example.library.BorrowHistoryRepository;
import com.example.library.Borrow;
import com.example.library.BorrowHistory;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "*")
public class BorrowController {
  Logger logger = org.slf4j.LoggerFactory.getLogger(BorrowController.class);
  private final BookRepository bookRepo;
  private final UserRepository userRepo;
  private final BorrowRecordRepository brRepo;
  private final BorrowRepository borrowRepo;
  private final BorrowHistoryRepository borrowHistoryRepo;

  public BorrowController(BookRepository bookRepo, UserRepository userRepo, BorrowRecordRepository brRepo,
      BorrowRepository borrowRepo, BorrowHistoryRepository borrowHistoryRepo) {
    this.bookRepo = bookRepo;
    this.userRepo = userRepo;
    this.brRepo = brRepo;
    this.borrowRepo = borrowRepo;
    this.borrowHistoryRepo = borrowHistoryRepo;
  }

  public static class BorrowRequest {
    public Long bookId;
    public Long userId;
  }

  public static class ReturnRequest {
    public Long bookId;
    public Long userId;
    public String date;
  }

  @PostMapping("/return")
  public ResponseEntity<?> returnBookByBookAndUser(@RequestBody ReturnRequest req) {

    logger.info("Returning book with request: bookId : {} and userId : {}", req.bookId, req.userId);
    if (req.bookId == null || req.userId == null || req.date == null) {
      return ResponseEntity.badRequest().body("Missing bookId, userId, or date");
    }
    var recOpt = brRepo.findByBookIdAndUserIdAndReturnDateIsNull(req.bookId, req.userId);
    if (recOpt.isEmpty())
      return ResponseEntity.badRequest().body("No active borrow record found for this book and user");
    BorrowRecord br = recOpt.get();
    br.setReturnDate(LocalDateTime.parse(req.date));
    Book book = br.getBook();
    book.setAvailable(true);
    bookRepo.save(book);
    brRepo.save(br);

    // Remove Borrow entry and add to BorrowHistory
    List<Borrow> borrows = borrowRepo.findAll();
    for (Borrow b : borrows) {
      if (b.getBookId().equals(book.getId())) {
        BorrowHistory hist = new BorrowHistory();
        hist.setBorrowerName(b.getBorrowerName());
        hist.setBorrowerEmail(b.getBorrowerEmail());
        hist.setBorrowerPhone(b.getBorrowerPhone());
        hist.setBookTitle(book.getTitle());
        hist.setBorrowDate(b.getBorrowDate());
        hist.setReturnDate(LocalDateTime.parse(req.date));
        borrowHistoryRepo.save(hist);
        borrowRepo.delete(b);
        break;
      }
    }
    return ResponseEntity.ok(br);
  }

  @PostMapping("/borrow")
  public ResponseEntity<?> borrow(@RequestBody BorrowRequest req) {
    var ob = bookRepo.findById(req.bookId);
    var ou = userRepo.findById(req.userId);
    if (ob.isEmpty())
      return ResponseEntity.badRequest().body("Book not found");
    if (ou.isEmpty())
      return ResponseEntity.badRequest().body("User not found");

    Book book = ob.get();
    if (!Boolean.TRUE.equals(book.getAvailable()))
      return ResponseEntity.badRequest().body("Book not available");

    User user = ou.get();
    BorrowRecord rec = new BorrowRecord();
    rec.setBook(book);
    rec.setUser(user);
    rec.setBorrowDate(LocalDateTime.now());
    book.setAvailable(false);
    bookRepo.save(book);
    brRepo.save(rec);

    // Also create Borrow entry
    Borrow borrow = new Borrow();
    borrow.setBookId(book.getId());
    borrow.setBorrowerName(user.getName());
    borrow.setBorrowerEmail(user.getEmail());
    borrow.setBorrowerPhone(user.getPhone());
    borrow.setBorrowDate(rec.getBorrowDate());
    borrowRepo.save(borrow);

    return ResponseEntity.ok(rec);
  }

  @PostMapping("/{id}/return")
  public ResponseEntity<?> returnBook(@PathVariable Long id) {

    logger.info("Returning book with borrow ID: {}", id);
    // Try to find BorrowRecord by id

    var brOpt = brRepo.findById(id);
    BorrowRecord br = brOpt.get();
    Book book = br.getBook();
    User user = br.getUser();
    
    ReturnRequest rr = new ReturnRequest();
    rr.bookId = book.getId();
    rr.userId = user.getId();
    rr.date = LocalDateTime.now().toString(); // Use current date for return

    return returnBookByBookAndUser(rr);
  }

  @GetMapping("/records")
  public List<BorrowRecord> allRecords() {
    return brRepo.findAll().stream()
        .sorted((a, b) -> {
          String ta = a.getBook() != null && a.getBook().getTitle() != null ? a.getBook().getTitle() : "";
          String tb = b.getBook() != null && b.getBook().getTitle() != null ? b.getBook().getTitle() : "";
          return ta.compareToIgnoreCase(tb);
        })
        .collect(Collectors.toList());
  }

  @GetMapping("/overdue")
  public List<BorrowRecord> overdue() {
    LocalDateTime cutoff = LocalDateTime.now().minusDays(14);
    return brRepo.findAll().stream()
        .filter(r -> r.getReturnDate() == null && r.getBorrowDate().isBefore(cutoff))
        .sorted((a, b) -> {
          String ta = a.getBook() != null && a.getBook().getTitle() != null ? a.getBook().getTitle() : "";
          String tb = b.getBook() != null && b.getBook().getTitle() != null ? b.getBook().getTitle() : "";
          return ta.compareToIgnoreCase(tb);
        })
        .collect(Collectors.toList());
  }
}
