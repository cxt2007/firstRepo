$("#addBtn").click(function(){
  var userName = $.trim($("#uName").val());
  var passWord = $.trim($("#pWord").val());
  var conPassWord = $.trim($("#conPassWord").val());
  
  if(monitorUserName()&&monitorPassWord()){
	  //添加加密的账号和密码base64
//	  userName = $.base64.encode(userName);
//	  passWord = $.base64.encode(passWord);
	  $("#maintainForm").append("<input type=\"hidden\" name=\"userName\" value="+userName+">");
	  $("#maintainForm").append("<input type=\"hidden\" name=\"passWord\" value="+passWord+">");
	  $("#maintainForm").submit();
  }
});

//提交验证
var tag=false;
$("#maintainForm").formValidate({
	 submitHandler: function(form) {
		 if(tag){
			 return false;
		 }
		 tag = true;
		 $(form).ajaxSubmit({
            success: function(data){
	            if(data.code==200){
	            	$.ajax({
						url:"/headquarters/list",
						async:false,
						type:"POST",
						success:function(data){
							$("#indexCommonView").html("").html(data);
						}
					});
	            	$.messageBox({message:'新增成功',level:'success'});
	            }else{
	            	tag=false;
	            	$.messageBox({message:data.msg,level:'warn'});
	            }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
            	tag=false;
            	$.messageBox({level:"error",message:"新增账户失败"});
            }
        });
    },
    errorHandler:function(){
    }
});
//修改
$("#editBtn").click(function(){
	$("#editForm").submit();
});

//修改提交验证
var tag1=false;
$("#editForm").formValidate({
	 submitHandler: function(form) {
		 if(tag1){
			 return false;
		 }
		 tag1 = true;
		 $(form).ajaxSubmit({
            success: function(data){
            	if(data.code==200){
	            	$.ajax({
						url:"/headquarters/list",
						async:false,
						type:"POST",
						success:function(data){
							$("#indexCommonView").html("").html(data);
						}
					});
	            	$.messageBox({message:'修改成功',level:'success'});
	            }else{
	            	tag1=false;
	            	$.messageBox({message:data.msg,level:'warn'});
	            }	
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
            	tag1=false;
            	$.messageBox({level:"warn",message:"修改账户失败"});
            }
        });
    },
    errorHandler:function(){
    }
});

//确认密码焦点离开判断是否相等
//$("#conPassWord").blur(function(){
//	monitor();
//})
//用户名焦点离开判断是否存在
$("#uName").blur(function(){
	monitorUserName();
})
//检查密码
function monitorPassWord(){
	var passWord = $.trim($("#pWord").val());
	var conPassWord = $.trim($("#conPassWord").val());
	if(passWord==''){
		$.messageBox({message:"密码为空!",level:"error"});
		return false;
	
	}
	//判断密码与确认密码是否相等
	if(passWord!=conPassWord){
		$.messageBox({message:"两次输入密码不同!",level:"error"});
		return false;
	}
	return true;
}
//检查用户名
function monitorUserName(){
	var uName = $.trim($("#uName").val());
	if(uName!=null&&uName.length>0){
		 $.ajax({
				url:"/headquarters/monitorUserName",
				async:false,
				type:"POST",
				'data':{userName:uName},
				success:function(data){
					if(data.flag=='账号已存在'){
						$.messageBox({message:data.flag,level:"warn"});
						return false;
					}
				}
			});
	}
	return true;
}
