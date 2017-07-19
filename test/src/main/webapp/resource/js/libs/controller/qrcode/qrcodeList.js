
// 搜索
	function qrcode_search(query){
		if(query==$("#query").attr("placeholder")){
			query="";
			return;
		}
		var city = $("#city").find("option:selected").attr("value")||'';
		var cityid = $("#city").find("option:selected").attr("id")||'';
		var cityValue=$("#cityValue").val();
		if(cityValue!=null&&cityValue!=''){
			city=cityValue;
		}
		$("#indexCommonView").html("");
		$("#loading").show();
		$.ajax({
			url : "/qrcode/list",
			cache: false,
			async: false,
			type:'post',
			data:{"queryText":query,"city":city,"cityid":cityid},
			success : function(result) {
				$("#loading").hide();
				$("#indexCommonView").html(result);
				$("#city").val($("#cityValue").val()?$("#cityValue").val():null);
				$("#query").val(query);
				$('#cityid').val(cityid);
			}
		})
	}
	//删除
	function del(id){	
		$.confirm({
	        title:"确认",
	        message:"确定删除该内容？",
	        width: 300,
	        height:280,
	        okFunc: function(){
	        	$.ajax({
	    			url:"/qrcode/del",
	    			data:{"id":id},
	    			async:false,
	    			type:"POST",
	    			dataType: "json",
	    			success:function(data){
	    				if (data) {
							$.ajax({
								url:"/qrcode/list",	            		
								async:false,
								type:"POST",
								success:function(data){
									if(data){
										$("#indexCommonView").html("").html(data);
	
									}
								}
							});
						}else {
							$.messageBox({message : '删除失败！',level : "warn"});
						}
	    			}
	    		});
	        }
	       })	
	}
	function edit(id){		
			$.ajax({
				url:"/qrcode/edit/view",
				data:{"id":id},
				async:false,
				type:"POST",
				success:function(data){
					if(data){
						$("#indexCommonView").html("").html(data);
					}
				}
			});
	}
	
	function synchronousQrcode(id){		
		$.ajax({
			url:"/qrcode/synchronousQrcode",
			data:{"id":id},
			async:false,
			type:"POST",
			success:function(data){
				if(data.code==200){
					$.messageBox({message : '同步成功！',level : "success"});
					$.ajax({
						url:"/qrcode/list",	            		
						async:false,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
	
							}
						}
					});
				}
				if(data.code==500){
					$.messageBox({message : data.msg,level : "warn"});
					$.ajax({
						url:"/qrcode/list",	            		
						async:false,
						type:"POST",
						success:function(data){
							if(data){
								$("#indexCommonView").html("").html(data);
							}
						}
					});
				}
			}
		});
	}
	function generateQRCode() {
	$("#inputDialog").createDialog({
		width : 475,
		height : 270,
		title : '一键通',
		url : "/qrcode/create",
		buttons : {
			"确定" : function(event) {
				
					var j = parseInt($("#num").val());
					/*var city=$("#city").val();
					if(!city)
						return;*/
					$.ajax({
						url : "/qrcode/generateQRCode",
						data : {
							'num' : j,
							'type' : 1
						},
						async : false,
						type : "POST",
						success : function(data) {
							$("#inputDialog").dialog("close");
							$.messageBox({
								message : "生成中，请稍后查看..."
							});
							$(this).dialog("close");
						}
					});
				
					
				
			},
			"取消" : function() {
				$(this).dialog("close");
			}
		}
	});
}
	
	
	function generateYRQRCode(){
		$("#inputDialog").createDialog({
			width:475,
			height:270,
			title:'黄手环',
			url:"/qrcode/create",
			buttons:{
				"确定":function(event){
					var j = parseInt($("#num").val());
					$.ajax({
						url:"/qrcode/generateYRQRCode",
						data:{
							'num':j,
							'type':2
						},
						async:false,
						type:"POST",		
						success:function(data){
							$("#inputDialog").dialog("close");
							$.messageBox({message:"生成中，请稍后查看..."});
						}
					});
				},
				"取消":function(){
					$(this).dialog("close");
				}
			}
		});
	}
	getQrcodeCity();
	
	function getQrcodeCity(){
		$.ajax({
			type:'post',
			url:'/org/getHZOrgListById',
			dataType:'json',
			async:false,
			success:function(data){
				var provinceData = data.organizationList;
				$("#city").empty();
				$("#city").append("<option id='' value=''>"+"请选择"+"</option>");
				for(i=0;i<provinceData.length;i++){
					$("#city").append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].orgName+"'>"+provinceData[i].orgName+"</option>");
				}											
			}
		});
	}
	
	
	$("#city").change(function(){
		var query = $("#query").val();
		var city = $("#city").val();
		var cityid = $("#city").find("option:selected").attr("id")||'';
		$.ajax({
			url:"/qrcode/list",	
			data:{'queryText':query,'city':city,'cityid':cityid},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#city").val($("#cityValue").val()?$("#cityValue").val():null);
					$("#query").val(query);
					$('#cityid').val(cityid);
				}
			}
		});
		
	});
	
function generateHYQRCode(){
		$("#inputDialog").createDialog({
			width:475,
			height:270,
			title:'会员二维码',
			url:"/qrcode/create",
			buttons:{
				"确定":function(event){
					var j = parseInt($("#num").val());
					$.ajax({
						url:"/qrcode/generateHYQRCode",
						data:{
							'num':j,
							'type':3
						},
						async:false,
						type:"POST",		
						success:function(data){
							$("#inputDialog").dialog("close");
							$.messageBox({message:"生成中，请稍后查看..."});
						}
					});
				},
				"取消":function(){
					$(this).dialog("close");
				}
			}
		});
	}
if($('#cityid').val()){
	console.log($('#cityid').val())
	$("#city option[id="+$('#cityid').val()+"]").attr('selected','selected')
}
