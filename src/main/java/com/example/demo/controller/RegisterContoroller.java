package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.service.UserService;

@Controller
public class RegisterContoroller {

	@Autowired
	private UserService userService;

	@GetMapping("/register")
	public String showRegisterForm() {
		return "register";
	}

	@PostMapping("/register")
	public String register(@RequestParam String username, @RequestParam String password,
			@RequestParam String confirmPassword, Model model) {

		if (username.length() > 10) {
			model.addAttribute("error", "ユーザー名は10文字以内で入力してください");
			return "register";
		}

		if (!password.equals(confirmPassword)) {
			model.addAttribute("error", "パスワードが一致しません");
			return "register";
		}

		if (!password.matches("^[a-zA-Z0-9]{8,20}$")) {
			model.addAttribute("error", "パスワードは英数字8～20文字で入力してください");
			return "register";
		}

		if (userService.isUsernameTaken(username)) {
			model.addAttribute("error", "ユーザー名がすでに使用されています");
			return "register";
		}

		userService.registerUser(username, password);
		return "redirect:/login";
	}

}
