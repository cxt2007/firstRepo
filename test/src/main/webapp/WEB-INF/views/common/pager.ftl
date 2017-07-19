<#macro page_ui paginator url slider ajax=false divid='' params='' >
<#assign _link="${url}?limit=${paginator.limit}">
<#if params != ''>
	<#assign _link="${_link}&${params}">
</#if>

<div class="paging-box paging-full" id="J_trade_pagenation">
    <ul class="items">
	  <#if paginator.hasPrePage><li class="item prev "> <a class="num  J_MakePoint " onclick="toPageList('${_link}','${paginator.limit}','${paginator.prePage}');"  hidefocus="true"> <span class="icon"></span>上一页 </a> </li></#if>
		<#list slider as opt>
      	<#if opt==paginator.page>
      <li class="item active"> ${opt} </li>
      	<#else>
      <li class="item"> <a class="num " onclick="toPageList('${_link}','${paginator.limit}','${opt}');"  > ${opt} </a> </li>
      	</#if>
      	</#list>
      <#if paginator.hasNextPage><li class="item next "> <a class="num  J_MakePoint " onclick="toPageList('${_link}','${paginator.limit}','${paginator.nextPage}');" > <span class="icon"></span>下一页 </a> </li></#if>             
    </ul>
    <div class="total"> 共 ${paginator.totalPages} 页，${paginator.totalCount} 条数据</div>
    <#if paginator.totalPages gt 0>
    <div class="form">
    	<span class="text">到第</span>
     	<input class="input" id="goPageNumber" type="text" value="${paginator.page}" onBlur="valiTotalPagesNumber('${paginator.totalPages}')" min="1" max="${paginator.totalPages}">
     	<span class="text">页</span> 
        <input class="button J_MakePoint" id="goPageSubmit" type="submit" onclick="toPageList('${_link}','${paginator.limit}',$(this).siblings('input').val());" value="确定"/>
    </div>				    	
	</#if>
  </div>
  <script type="text/javascript" >
//分页
function toPageList(urlAndParams,limit,page){
	var url;
	var params=[];
	var index=urlAndParams.indexOf("?");
	if(index!=-1){
		url=urlAndParams.substring(0,index);
		var paramsStr=urlAndParams.substring(index+1);
		var par=paramsStr.split('&');
		for(var i=0;i<par.length;i++){
			var p=par[i].split('=');
			if(p[0]!='limit' && p[0]!='page'){
				params.push('"'+p[0]+'":"'+$.trim(p[1])+'"');
			}
		}
	}else{
		url=urlAndParams;
	}
	params.push('"limit":'+limit);
	params.push('"page":'+page);
	$.ajax({
		url:url,	            		
		async:false,
		type:"POST",
		data:JSON.parse('{'+params.join(',')+'}'),
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);
			}
		}
	});
}
</script>
</#macro>
