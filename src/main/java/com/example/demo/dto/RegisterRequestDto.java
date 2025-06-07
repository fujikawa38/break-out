package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequestDto {

	@NotBlank(message = "ユーザー名を入力してください")
	@Size(max = 10, message = "ユーザー名は10文字以内で入力してください")
	private String username;

	@NotBlank(message = "パスワードを入力してください")
	@Pattern(regexp = "^[a-zA-Z0-9]{8,20}$", message = "パスワードは英数字8～20文字で入力してください")
	private String password;

	@NotBlank(message = "確認用パスワードを入力してください")
	private String confirmPassword;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

}
