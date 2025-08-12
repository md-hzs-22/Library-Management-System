package com.example.library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.library.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByNameAndPhone(String name, String phone);
}
