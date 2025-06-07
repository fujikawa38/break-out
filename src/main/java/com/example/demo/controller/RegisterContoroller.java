package com.example.demo.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.demo.dto.RegisterRequestDto;
import com.example.demo.service.UserService;

@Controller
public class RegisterContoroller {

	@Autowired
	private UserService userService;

	@GetMapping("/register")
	public String showRegisterForm(Model model) {
		model.addAttribute("form", new RegisterRequestDto());
		return "register";
	}

	@PostMapping("/register")
	public String register(@Valid @ModelAttribute("form") RegisterRequestDto form, BindingResult bindingResult,
			Model model) {

		if (bindingResult.hasErrors()) {
			return "register";
		}

		if (!form.getPassword().equals(form.getConfirmPassword())) {
			model.addAttribute("error", "パスワードが一致しません");
			return "register";
		}

		if (userService.isUsernameTaken(form.getUsername())) {
			model.addAttribute("error", "ユーザー名がすでに使用されています");
			return "register";
		}

		userService.registerUser(form.getUsername(), form.getPassword());
		return "redirect:/login";
	}

}
