package org.cxt;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/testpage")
public class FirstController {
	
	@RequestMapping(value = "/page1", method = {RequestMethod.POST, RequestMethod.GET})
    public @ResponseBody String queryPage1(HttpServletResponse response, HttpServletRequest request)
        throws Exception {
		return "ok";
	}
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String loginForm(HttpServletResponse response, HttpServletRequest request)
			throws Exception {
		return "login";
	}
	
	
}
