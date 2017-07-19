	//积分兑换
	function exchange(id){
		$("#exchangeDialog").createDialog({
			width:520,
			height:500,
			title:'积分兑换',
			position:'center',
			url:'/cardManage/exchange?id='+id,
			buttons:{
				"确定":function(event){
					$("#maintainForm").submit();
				},
				"取消":function(){
					$(this).dialog("close");
				}
			}
		});
	}
	//区域change事件
	$("#city").change(function(){
		$.ajax({
			url:"/cardManage/list",	            		
			async:false,
			type:"POST",
			data:{"city":$("#city").val(),"queryText":$("#query").val(),"searchTime":$("#searchTime").val()},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	});

	function toAdd(){
		$.ajax({
			url:"/cardManage/add",	            		
			async:false,
			type:"GET",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	function edit(id){
		$.ajax({
			url:"/cardManage/update?id="+id,	            		
			async:false,
			type:"GET",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	function toChangCardView(id){
		$.ajax({
			url:"/cardManage/toChangCardView?id="+id,	            		
			async:false,
			type:"GET",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	}
	//查看卡片详情
	function view(id){
		$.ajax({
			url:"/cardManage/view?id="+id,	            		
			async:false,
			type:"GET",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	//查看积分详情(用户积分)
	function viewPointDetail(id){
		$.ajax({
			url:"/cardManage/viewPointDetail?id="+id,	            		
			async:false,
			type:"GET",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	}
	//查看积分详情(卡片积分)
	function viewCardPointDetail(id){
		$.ajax({
			url:"/cardManage/viewCardPointDetail?id="+id,	            		
			async:false,
			type:"GET",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	}
	
	function del(id){
	
		$.confirm({
			title:"确认",
		    message:"确定删除该内容？",
		    width: 300,
		    height:280,
		    okFunc: function(){
		    	$.ajax({
		    		url:"/cardManage/delete?id="+id,	            		
		    		async:false,
		    		type:"GET",
		    		success:function(data){
		    			data = JSON.parse(data);
		    			if(data.code!=200 ){
		                    $.messageBox({message:data.msg,level:"error"});
		                    return;
		                }else{
		                	$.messageBox({message:data.data});
		                	$.ajax({
		    					url:"/cardManage/list",	            		
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
		})
	}
	
	function synchronous(id){
		$.ajax({
			url:"/cardManage/synch",	            		
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
						url:"/cardManage/list",	            		
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
	
	function tabFun(on,cont){
		var on = $(on), cont = $(cont)
	    on.click(function () {
	        var index = $(this).index()
	        on.removeClass('on');
	        $(this).addClass('on');
	        cont.eq(index).show().siblings().hide()
	    })
	}
	
	
	function search(query){
		var queryText = $("#query").val().trim();
		var searchTime = $("#searchTime").val();
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}
		$.ajax({
			url:"/cardManage/list",	            		
			async:false,
			type:"POST",
			data:{"city":$("#city").val(),"queryText":queryText,"searchTime":searchTime},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	//卡片积分列表查询
	function searchPointList(query){
		var queryText = $("#query").val().trim();
		if($("#query").val()==$("#query").attr("placeholder")){
			queryText="";
			return;
		}
		$.ajax({
			url:"/cardManage/cardPointList",	            		
			async:false,
			type:"POST",
			data:{"query":queryText},
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
	
				}
			}
		});
	}
	
	$(function(){
		//new tabFun("#tabTable .tableTit li","#tabTable .tabCont .tableMod")
		
		$('#searchTime').datePicker({		 
			  dateFormat: "yy-mm-dd",
			  showClearButton:false, 
			  onSelect:function(selectedDate){         	
		  }
		}); 
	})
