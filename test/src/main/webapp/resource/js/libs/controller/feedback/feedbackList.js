	function sign(id){
		var isSign = $("#"+id).html();
		if(isSign == "已处理"){
			$.messageBox({message:"该意见反馈已经处理！",level:"warn"});
	        return;
		}else{
			$.ajax({
				url:"/feedback/sign",	            		
				async:false,
				type:"POST",
				data:{"id":id},
				success:function(data){
					data = JSON.parse(data);
					if(data.code!=200 ){
		                $.messageBox({message:data.msg,level:"error"});
		                return;
		            }else{
		            	$.messageBox({message:data.data});
		            	$.ajax({
							url:"/feedback/list",	            		
							async:false,
							type:"POST",
							success:function(dataHtml){
								if(data){
									$("#indexCommonView").html("").html(dataHtml);
	
								}
							}
						});
		            }
				}
			});
		}
	}
	
	
	function view(id){
		$.ajax({
			url:"/feedback/view?id="+id,	            		
			async:false,
			type:"GET",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
//	
//	$(function(){
//		new tabFun("#tabTable .tableTit li","#tabTable .tabCont .tableMod")
//	})
