package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Score;
import com.example.demo.model.User;
import com.example.demo.repository.ScoreRepository;

@Service
public class ScoreService {

	private final ScoreRepository scoreRepository;

	public ScoreService(ScoreRepository scoreRepository) {
		this.scoreRepository = scoreRepository;
	}

	@Transactional
	public Score saveScore(User user, double time) {
		Score score = new Score();
		score.setUser(user);
		score.setTime(time);
		return scoreRepository.save(score);
	}

	public List<Score> getTop10Scores() {
		return scoreRepository.findTop10ByOrderByTimeAsc();
	}

	public Score getBestScore(User user) {
		return scoreRepository.findTopByUserOrderByTimeAsc(user);
	}

}
