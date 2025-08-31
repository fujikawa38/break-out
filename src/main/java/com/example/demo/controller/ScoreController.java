package com.example.demo.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.model.Score;
import com.example.demo.model.User;
import com.example.demo.service.ScoreService;
import com.example.demo.service.UserService;

@Controller
public class ScoreController {

	private final ScoreService scoreService;
	private final UserService userService;

	@Autowired
	public ScoreController(ScoreService scoreService, UserService userService) {
		this.scoreService = scoreService;
		this.userService = userService;
	}

	@PostMapping("/save-score")
	public String saveScore(@RequestParam("time") double time, Principal principal) {
		String username = principal.getName();
		Optional<User> userOptional = userService.findByUsername(username);
		User user = userOptional.orElseThrow(() -> new IllegalArgumentException("ユーザーが登録されていません：" + username));
		scoreService.saveScore(user, time);
		return "redirect:/index";
	}

	@GetMapping("/ranking")
	public String getRanking(Model model, Principal principal) {
		List<Score> topScores = scoreService.getTop10Scores();
		model.addAttribute("topScores", topScores);

		if (principal != null) {
			String username = principal.getName();
			Optional<User> userOptional = userService.findByUsername(username);

			if (userOptional.isPresent()) {
				Score bestScore = scoreService.getBestScore(userOptional.get());
				model.addAttribute("bestScore", bestScore);
			}
		}

		return "index";
	}
}
