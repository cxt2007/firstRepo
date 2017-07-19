<!-- sidebar -->
	<div class="ui-layout-west">
	    <div class="leftMenu">
			 <div class="innerBox" id="accordion">
				<#--遍历一级菜单-->
				<#list menuList as menu>
					<#--存在子层级-二级菜单-->
					<#if menu.linkUrl==null || menu.linkUrl=="">									
						<#--显示一级菜单-->
				
						<div class="item">
			            	<h3 class="<#if menu_index==0>uiMenuCur</#if>"><a id="id${menu.id}" class="linkItem hasChild isHead " href="#${menu.id}" url="${menu.linkUrl}"><img src="${menu.icon}"/>${menu.name}</a></h3>
							<div class="uiContBase">
								<ul>									
									<#--遍历二级菜单-->
									<#list menu.children as c1>							
										<#if c1.linkUrl==null || c1.linkUrl=="">
										<#else>
											<li><a id="id${c1.id}" class="linkItem hasChild <#if c1_index==0 && menu_index==0>cur</#if>" href="#${c1.id}" url="${c1.linkUrl}"><span>${c1.name}</span></a></li>
										</#if>										
									</#list>
								</ul>
							</div>
			           </div>
					<#else>								
						<#--只存在一级菜单-->							
						<div class="item">
			            	<h3 class="<#if menu_index==0>uiMenuCur</#if>"><a id="id${menu.id}" class="linkItem isHead" href="#${menu.id}" url="${menu.linkUrl}"><img src="${menu.icon}"/>${menu.name}</a></h3>										
			            </div>
					</#if>								
				</#list>							
							
		     </div>
		     <!-- End leftMenuList -->
		</div>
	</div>	