
<script type="text/javascript">
	function valiTotalPagesNumber(maxPage){
		var newPage=$("#goPageNumber").val();
		if(eval(newPage)<1 || eval(newPage)>eval(maxPage)){
			$("#goPageSubmit").addClass("disabled").attr("disabled","true");
		}else{
			$("#goPageSubmit").removeClass("disabled").removeAttr("disabled");
		}
	}
</script>


<!-- sidebar -->
	<div class="ui-layout-west">
	    <div class="leftMenu">
			 <div class="innerBox" id="accordion">	
				<!--遍历一级菜单-->
				<c:forEach items="${menuList}" var="menu" varStatus="status">  
					<!--存在子层级-二级菜单-->
					<c:choose>
					   <c:when test='${menu.linkUrl==null || menu.linkUrl==""}'>  
					         <!--显示一级菜单-->
							<div class="item">
							<c:if test="${salary > 2000}">
							   <p>My salary is: <c:out value="${salary}"/><p>
							</c:if>
				            	<h3 class="<c:if test="${status.first}">uiMenuCur</c:if>"><a id="id${menu.id}" class="linkItem   hasChild isHead " href="#${menu.id}" url="${menu.linkUrl}">${menu.name}</a></h3>
								<div class="uiContBase">
									<ul>									
										<!--遍历二级菜单-->
										<c:forEach items="${menu.children}" var="c1" varStatus="status1">
											<c:if test='${c1.linkUrl!=null && c1.linkUrl!=""}'>
												<li><a id="id${c1.id}" class="linkItem link_menu <c:if test="${status.first&&status1.first}" >cur</c:if>" href="#${c1.id}" url="${c1.linkUrl}"><span>${c1.name}</span></a></li>
											</c:if>										
										</c:forEach> 
									</ul>
								</div>
				           </div>      
					   </c:when>
					   <c:otherwise> 
					     	<!--只存在一级菜单-->							
							<div class="item">
				            	<h3 class="<c:if test="status.first">uiMenuCur</c:if>">
				            		<a id="id${menu.id}" class="linkItem link_menu isHead" href="#${menu.id}" url="${menu.linkUrl}">
				            			${menu.name}
				            		</a>
				            	</h3>										
				            </div>
					   </c:otherwise>
					</c:choose>
			    </c:forEach> 
		     </div>
		     <!-- End leftMenuList -->
		</div>
	</div>	
