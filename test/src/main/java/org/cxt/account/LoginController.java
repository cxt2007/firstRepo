package org.cxt.account;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.cxt.framework.shiro.ShiroDbRealm.ShiroUser;
import org.cxt.util.MemCacheUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * LoginController负责打开登录页面(GET请求)和登录出错页面(POST请求)，
 * 
 * 真正登录的POST请求由Filter完成,
 * 
 * @author calvin
 */
@Controller
@RequestMapping(value = "/login")
public class LoginController  {

	/**
	 * 登录验证，
	 * 
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET)
	public String login() {
			return "account/login1";
	}
	
	/**
	 * 登录验证成功
	 * 
	 * @param model
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "success", method = RequestMethod.GET)
	public String success(Model model, HttpServletRequest request) {
		ShiroUser user = (ShiroUser) SecurityUtils.getSubject().getPrincipal();
		System.out.println("success");
		return "layouts/index";

	}

	/**
	 * 登录成功后跳转到不同的页面
	 * 
	 * @param model
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "jump", method = RequestMethod.GET)
	public String jump(Model model, HttpServletRequest request) {
		System.out.println("jump");
		return "";
	}
	
	/**
	 * 登录验证失败处理
	 * 
	 * @param userName
	 * @param model
	 * @return
	 */
	@RequestMapping(method = RequestMethod.POST)
	public String fail(
			@RequestParam(FormAuthenticationFilter.DEFAULT_USERNAME_PARAM) String userName,
			Model model) {
		System.out.println("fail");
			return "account/login";
		

	}

}
