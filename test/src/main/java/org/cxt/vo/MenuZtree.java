package org.cxt.vo;

import java.io.Serializable;
import java.util.List;

public class MenuZtree implements Serializable {
	private static final long	serialVersionUID	= 1L;

	private String 				id;							//ID
	private String				icon;						// 图片
	private String				name;						// 菜单名称
	private String				linkUrl;					// 菜单URL
	private Integer				indexNo;					// 排序
	private String				parentId;					// 父ID
	private String				topId;						// 顶级ID
	private List<MenuZtree>		children;

	public MenuZtree() {
	}

	public MenuZtree(String id,String icon, String name, String linkUrl, Integer indexNo, String parentId, String topId) {
		super();
		this.id = id;
		this.icon = icon;
		this.name = name;
		this.linkUrl = linkUrl;
		this.indexNo = indexNo;
		this.parentId = parentId;
		this.topId = topId;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLinkUrl() {
		return linkUrl;
	}

	public void setLinkUrl(String linkUrl) {
		this.linkUrl = linkUrl;
	}

	public Integer getIndexNo() {
		return indexNo;
	}

	public void setIndexNo(Integer indexNo) {
		this.indexNo = indexNo;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getTopId() {
		return topId;
	}

	public void setTopId(String topId) {
		this.topId = topId;
	}

	public List<MenuZtree> getChildren() {
		return children;
	}

	public void setChildren(List<MenuZtree> children) {
		this.children = children;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}
