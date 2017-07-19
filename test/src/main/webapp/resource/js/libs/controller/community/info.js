//oldThreeSelect({
//		province:'city',
//		city:'district',
//		district:'town',
//		provinceValue:$('#provinceValue').val(),
//		cityValue:$('#cityValue').val(),
//		districtValue:$('#districtValue').val()
//});
/*
threeSelect({
	province:'city',
	city:'district',
	district:'town',
	provinceValue:$('#provinceValue').val(),
	cityValue:$('#cityValue').val(),
	districtValue:$('#districtValue').val()
});
*/
fourSelect({
	city:'city',
	district:'district',
	town:'town',
	community:'community',
	cityValue:$('#cityValue').val(),
	districtValue:$('#districtValue').val(),
	townValue:$('#townValue').val(),
	communityValue:$("#communityValue").val()
});
function infoQuery(query){
		var queryText = $("#query").val().trim();
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}
		$.ajax({
			url:"/community/infoList",	            		
			async:false,
			type:"POST",
			data:{"queryName":queryText},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//查看
	function viewAppVersion(id) {
		$.ajax({
			url:"/appVersion/view?id=" + id,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//新增
	function infoAddView(){
		$.ajax({
			url:"/community/infoAddView",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	//修改
	function infoEdit(id){
		$.ajax({
			url:"/community/infoUpdateView?id=" + id,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	
	//删除
	function infoCancel(id,_self){
		$.confirm({
	        title:"删除确认",
	        message:"确定要删除吗？",
	        width: 300,
	        height:200,
	        okFunc: function(){
	        	$.ajax({
	        		type : 'post',
	        		url : '/community/infoCancel',
	        		data : {'id' : id},
	        		dataType: "json",
	        		success : function(data) {
	        			queryPage();
//	        			if(data=200){
//	        				$(_self).parents("tr").remove();
//	        				$.messageBox({message:'删除成功',level: "success"});
//	        			}else if(data.msg="删除失败"){
//	        				$.messageBox({message:'删除失败',level: "error"});
//	        			}else{
//	        				$.messageBox({message:'删除失败',level: "error"});
//	        			}
	        		}
	        	});
	        }
		});
	}
	
	function queryPage(){
		$.ajax({
			url:"/community/infoList",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);

				}
			}
		});
	}
	
	//返回
	function returnBtn(){
		$.ajax({
			url:"/community/infoList",	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	$(function() {
		//新增		
		$("#maintainForm").formValidate({
			 submitHandler: function(form) {
				 $(form).ajaxSubmit({
						dataType: "json",
						success: function(data){
			            	if(data.code==200){	   
			            		$.messageBox({message:'保存成功',level: "success"});
			            		$.ajax({
			            			url:"/community/infoList",	            		
			            			async:false,
			            			type:"POST",
			            			success:function(data){
			            				if(data){
			            					$("#indexCommonView").html("").html(data);
			            				}
			            			}
			            		});
			            	} else if(data.code="500") {
			            		$.messageBox({message:data.msg,level: "error"});
			            		
			            	}else{
			            		$.messageBox({message:'保存失败',level: "error"});
			            	}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown){
							$.messageBox({level:"error",message:"提交错误"});
						}
				 });
			 },
			 errorHandler:function(){
			 }
		});
		
		//返回
		$("#returnBtn").click(function(){
			$.ajax({
				url:"/community/infoList",	            		
				async:false,
				type:"POST",
				success:function(data){
					if(data){
						$("#indexCommonView").html("").html(data);
		
					}
				}
			});
		});
	});
