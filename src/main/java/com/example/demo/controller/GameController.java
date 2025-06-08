package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GameController {

	@GetMapping("/index")
	public String game() {
		return "index";
	}
}
