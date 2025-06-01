package com.example.demo.service;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public void registerUser(String username, String rawPassword) {
		String encodedPassword = passwordEncoder.encode(rawPassword);
		User user = new User();
		user.setUsername(username);
		user.setPassword(encodedPassword);
		user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
		userRepository.save(user);
	}

	public boolean isUsernameTaken(String username) {
		return userRepository.findByUsername(username).isPresent();
	}

}
