package org.cxt.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 用户登录页面
 * @author cxt
 *
 */
@Controller
public class LoginController1 {

	@RequestMapping(value = "/login1", method = RequestMethod.GET)
	public String loginForm(HttpServletResponse response, HttpServletRequest request)
			throws Exception {
		return "login";
	}
	
	@RequestMapping(value = "/login1", method = RequestMethod.POST)
	public String login(HttpServletResponse response, HttpServletRequest request)
			throws Exception {
		return "redirect:/index";
	}
}
