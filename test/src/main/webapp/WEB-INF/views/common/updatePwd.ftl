<div class="updatePwd setting">
	<div class="container_24">
		<form id="settingForm" method="post" action="/account/change_password">
			<div class="grid_3 lable-left"></div>
			<div class="grid_1 lable-left">
				<em class="form-req">*</em>
			</div>	
			<div class="grid_20 lable-left">
				<label class="form-lbl">&nbsp;旧密码</label>
			</div>
			<div class='clearLine'></div>
			<div class="grid_3 lable-left"></div>
			<div class="grid_19">
		    	<input type="password" id="old_password" maxLength="16" name="old_password" class="{required:true,messages:{required:'密码不能为空'}}"/>
			</div>
			<div class="grid_2 lable-left"></div>
			<div class='clearLine'></div>
			<div class="grid_3 lable-left"></div>
			<div class="grid_1 lable-left">
				<em class="form-req">*</em>
			</div>	
			<div class="grid_20 lable-left">
				<label class="form-lbl">&nbsp;新密码</label>
			</div>
			<div class='clearLine'></div>
			<div class="grid_3 lable-left"></div>
			<div class="grid_19">
		    	<input type="password" id="new_password" maxLength="16" name="new_password" class="{required:true,maxlength:16,messages:{required:'密码不能为空'}}" />
			</div>
			<div class="grid_2 lable-left"></div>
			<div class='clearLine'></div>
			
			<div class="grid_3 lable-left"></div>
			<div class="grid_1 lable-left">
				<em class="form-req">*</em>
			</div>	
			<div class="grid_20 lable-left">
				<label class="form-lbl">&nbsp;确认密码</label>
			</div>
			<div class='clearLine'></div>
			<div class="grid_3 lable-left"></div>
			<div class="grid_19">
		    	<input type="password" id="rep_password" maxLength="16" name="rep_password" class="{required:true,maxlength:16,messages:{required:'密码不能为空'}}" }" />
			</div>
			<div class="grid_2 lable-left"></div>
			<div class='clearLine'></div>
			<div class="grid_4 lable-left"></div>
			<div class="grid_20 lable-left">
				<label class="form-lbl"></label>
			</div>
			<div class='clearLine'></div>
		</form>
	</div>
</div>

<script type="text/javascript">
$(function(){
	$("#settingForm").formValidate({
		 submitHandler: function(form) {
			 if($("#new_password").val()!=$("#rep_password").val()){
			 	$.messageBox({message:"2次密码输入不一致",level: "warn"});
			 	$("#new_password").val("");
			 	$("#rep_password").val("");
			 	return;
			 }
			 if($("#old_password").val()==$("#rep_password").val()){
			 	$.messageBox({message:"新密码不能和旧密码一样！",level: "warn"});
			 	$("#new_password").val("");
			 	$("#rep_password").val("");
			 	return;
			 }
			 $("#settingForm").ajaxSubmit({
				dataType: "json",
	            success: function(data){
	            	if(data.code==200){
	            		$.messageBox({message:"密码修改成功"});
						$("#setDialog").dialog("close");
	            	}else{
	            		$.messageBox({message:data.msg,level:"error"});
	            	}
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown){
	                alert("提交错误");
	            }
	        });
	    },
	    errorHandler:function(){
	    }
	});

})

</script>