//切换城市
$("#city").change(function(e){
		var city = $("#city").val();
		$.ajax({
			url:"/appmenu/list",	
			data:{'city':city},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	})



// 修改
function edit(id) {
		$.ajax({
			url:"/appmenu/edit",
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

// 删除
function del(id) {
	
	$.confirm({
        title:"确认",
        message:"确定删除该首页？",
        width: 300,
        okFunc: function(){
			$.ajax({
				type : 'post',
				url : '/appmenu/del',
				data : {
					'id' : id
				},
				dataType: "json",
				success : function(data) {
					if (data) {
						$.ajax({
							url:"/appmenu/list",	            		
							async:false,
							type:"POST",
							success:function(data){
								if(data){
									$("#indexCommonView").html("").html(data);

								}
							}
						});
					} else {
						alert("删除失败！");
					}
				}
			});
        }
	})
	
}	
	
	
//添加菜单
function toAdd(){
	$.ajax({
		url:"/appmenu/add",	            		
		async:false,
		type:"POST",
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);

			}
		}
	});
}


//撤销
function revoke(id){
	//var releaseStatus = $("#"+id).html();
		$.ajax({
			url:"/appmenu/revoke",
			data:{"id":id},
			async:false,
			type:"POST",
			success:function(data){
				//data = JSON.parse(data);
				if(data.ret.code != 200){
					$.messageBox({message:"撤销失败",level:"error"});
	                return;
				}else{
					$.messageBox({message:"撤销成功"});
	            	$.ajax({
						url:"/appmenu/list",	            		
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

//发布
function release(id) {
	//var releaseStatus = $("#"+id).html();
	
	$.ajax({
		url:"/appmenu/release",
		data:{"id":id},
		async:false,
		type:"POST",
		success:function(data){
			//data = JSON.parse(data);
			if(data.ret.code != 200){
				$.messageBox({message:"发布失败",level:"error"});
                return;
			}else{
				$.messageBox({message:"发布成功"});
            	$.ajax({
					url:"/appmenu/list",	            		
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

//点击上移

function up(id){	
	$.ajax({					
			url:"/appmenu/moveChange",
			type:"POST",
			data:{"id":id,"type":1},
			success:function(data){
				//data=JSON.parse(data);
				if(data.code==200){
					$.messageBox({message:"上移成功"});	
				}else{
					$.messageBox({message:data.msg,level: "warn"});
				}
				refresh();//页面刷新
			},
			error:function(){
				$.messageBox({message:"请求数据错误",level: "error"});
			}
		})  
	
	
};
//点击下移
     		
function down(id){
	$.ajax({					
			url:"/appmenu/moveChange",
			type:"POST",
			data:{"id":id,"type":2},
			success:function(data){
				//data=JSON.parse(data);
				if(data.code==200){
					$.messageBox({message:"下移成功"});
				}else{
					$.messageBox({message:data.msg,level: "warn"});
				}
				refresh();//页面刷新
			},
			error:function(){
				$.messageBox({message:"请求数据错误",level: "error"});
			}
		}) 
}

function refresh(){
	var city = $("#provinceValue").val();
	$.ajax({
			url:"/appmenu/list",
			async:false,
			data:{"city":city},
				type:"POST",
				success:function(data){
					if(data){
						$("#indexCommonView").html("").html(data);
					}
				}
		});
}


selectCity();


function selectCity(){
	$.ajax({
			type:'post',
			url:'/org/getOrgListById',
			dataType:'json',
			async:false,
			success:function(data){
				var provinceData = data.organizationList;
				for(i=0;i<provinceData.length;i++){
					$("#city").append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].id+"'>"+provinceData[i].orgName+"</option>");
				}											
				if($("#city"+" option").size()>1){
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				}
			}
		});
}

$("#city").change(function(){
	refresh();
});
