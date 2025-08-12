package com.example.library.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.library.model.Book;
import com.example.library.model.BorrowRecord;
import com.example.library.repository.*;


import org.slf4j.*;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/books")
@CrossOrigin
public class BookController {

  Logger logger = org.slf4j.LoggerFactory.getLogger(BookController.class);
  private final BookRepository repo;
  private final BorrowRecordRepository borrowRecordRepo;

  public BookController(BookRepository repo, BorrowRecordRepository borrowRecordRepo){
    this.repo = repo; 
    this.borrowRecordRepo = borrowRecordRepo; 
  }

  private String randint(int i, long l) {
    return String.valueOf((long) (Math.random() * (l - i + 1)) + i);
  }

  @GetMapping
  public List<Book> all(){
    return repo.findAll().stream()
      .sorted((a, b) -> {
        if(a.getTitle() == null && b.getTitle() == null) return 0;
        if(a.getTitle() == null) return 1;
        if(b.getTitle() == null) return -1;
        return a.getTitle().compareToIgnoreCase(b.getTitle());
      })
      .collect(Collectors.toList());
  }

  @GetMapping("/search")
  public List<Book> search(@RequestParam("q") String q){
    String ql = q.toLowerCase();
    return repo.findAll().stream()
      .filter(b -> (b.getTitle()!=null && b.getTitle().toLowerCase().contains(ql)) ||
                   (b.getAuthor()!=null && b.getAuthor().toLowerCase().contains(ql)) ||
                   (b.getIsbn()!=null && b.getIsbn().toLowerCase().contains(ql)))
      .collect(Collectors.toList());
  }

  @PostMapping
  public List<Book> create(@RequestBody Map<String, Object> payload) {
    String title = (String) payload.get("title");
    String author = (String) payload.get("author");
    String isbn;
    int quantity = 1;
    if (payload.get("quantity") != null) {
      try {
        quantity = Integer.parseInt(payload.get("quantity").toString());
      } catch (Exception ignored) {}
    }
    if (quantity < 1) quantity = 1;
    List<Book> books = new java.util.ArrayList<>();
    for (int i = 0; i < quantity; i++) {
      isbn = randint(1000000000, 9999999999L) + "";
      Book b = new Book(title, author, isbn);
      b.setAvailable(true);
      books.add(repo.save(b));
      
    }
    return books;
  }

  @DeleteMapping("delete/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id){
    
    List<BorrowRecord> borrowRecords = borrowRecordRepo.findAll();
    for (BorrowRecord br : borrowRecords) {
      if (br.getBook().getId().equals(id)) {
        borrowRecordRepo.delete(br);
      }
    }

    repo.deleteById(id);
    return ResponseEntity.ok().build();
  }
}
