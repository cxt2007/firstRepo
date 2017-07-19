package org.cxt.web.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.cxt.vo.MenuZtree;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class IndexController {
	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String loginForm(ModelMap modelMap,HttpServletResponse response, HttpServletRequest request)
			throws Exception {
		List<MenuZtree> list=new ArrayList<MenuZtree>();
		MenuZtree tree1=new MenuZtree();
		tree1.setIndexNo(1);
		tree1.setName("mymenu1");
		tree1.setParentId("");
		tree1.setTopId("");
		tree1.setLinkUrl("");
		list.add(tree1);
		List<MenuZtree> tree1Children=new ArrayList<MenuZtree>();
		MenuZtree tree11=new MenuZtree();
		tree11.setName("wodelianjie");
		tree11.setLinkUrl("/people/list");
		tree1Children.add(tree11);
		tree1.setChildren(tree1Children);
		
		MenuZtree tree2=new MenuZtree();
		tree2.setIndexNo(2);
		tree2.setName("mymenu2");
		tree2.setLinkUrl("/syslog/list");
		list.add(tree2);
		modelMap.put("menuList", list);
		return "index";
	}
}
