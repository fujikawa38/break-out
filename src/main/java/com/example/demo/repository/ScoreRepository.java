package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Score;
import com.example.demo.model.User;

public interface ScoreRepository extends JpaRepository<Score, Long> {
	List<Score> findTop10ByOrderByTimeAsc();

	Score findTopByUserOrderByTimeAsc(User user);
}
