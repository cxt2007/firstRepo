	setTimeout(function(){
	   threeSelect({
	    	province:'city',
	    	provinceValue:$('#provinceValue').val()
	   });
	},100);
	//刷新列表
	function refreshList(){
		var city = $("#city").find("option:selected").attr("id")||'';
		$.ajax({
			url:"/message/list?city="+city,	            		
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
					$("#city").val($("#provinceValue").val()?$("#provinceValue").val():null);
				}
			}
		});
	}
	//选择城市
	$("#city").change(function(){
		refreshList();
	});


	// 删除
	function del(id) {
		$.confirm({
	        title:"确认",
	        message:"是否确认删除该消息？",
	        okFunc: function(){
				$.ajax({
					type : 'post',
					url : '/message/del',
					data : {
						'id' : id
					},
					dataType: "json",
					success : function(data) {
						if (data) {
							refreshList();
						} else {
							alert("删除失败！");
						}
					}
				});
	        }
		})
	}
	
	function addCity(id){	
		$("#changeCityDialog").createDialog({
			width:520,
			height:500,
			title:'城市选择',
			url:'/message/addCity?id='+id,
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
	
	
	//发布
	function publish(id) {
		$.confirm({
	        title:"确认",
	        message:"确定发布该消息？",
	        okFunc: function(){
				$.ajax({
					type : 'post',
					url : '/message/publish',
					data : {
						'id' : id
					},
					dataType: "json",
					success : function(data) {
						if (data) {
							refreshList();
						} else {
							alert("删除失败！");
						}
					}
				});
	        }
		})
	}
	
	//撤回
	function withdraw(id) {
		$.confirm({
	        title:"确认",
	        message:"撤回改消息？",
	        okFunc: function(){
				$.ajax({
					type : 'post',
					url : '/message/withdraw',
					data : {
						'id' : id
					},
					dataType: "json",
					success : function(data) {
						if (data) {
							refreshList();
						} else {
							alert("删除失败！");
						}
					}
				});
	        }
		})
	}
	//新增
	function toAdd() {
		$('#messageDialog').createDialog({
			width:540,
			height:380,
			title:'新增消息',
			url:'/message/maintain',
			buttons:{
				'确定':function(){
					$("#settingForm").submit();
				},
				'取消':function(){
					$(this).dialog("close");
				}
			}
		});
	}
	
	//修改
	function edit(id) {
		$('#messageDialog').createDialog({
			width:490,
			height:380,
			title:'新增消息',
			url:'/message/maintain?id='+id,
			buttons:{
				'确定':function(){
					$("#settingForm").submit();
				},
				'取消':function(){
					$(this).dialog("close");
				}
			}
		});
	}
