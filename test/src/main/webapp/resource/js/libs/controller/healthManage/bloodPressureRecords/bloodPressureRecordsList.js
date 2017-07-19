TQ.bloodPressureRecords = function(){
	
	$('#searchTime').datePicker({
		dateFormat: "yy-mm-dd",
		showClearButton: false,
		onSelect: function(selectedDate) {}
	});
	
    //新增
    $("#addBloodPressureRecords").click(function(event){	
		$.ajax({
			url:"/healthHouse/toAddView",	            		
			async:false,
			type:"GET",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
    });
    
    //修改
    $("[name='edit']").click(function(event){	
		$.ajax({
			url:"/healthHouse/toAddView",
			data: {
				"id": $(this).attr("flag")
			},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
    });
    
	//删除
	$("[name='del']").click(function(event){
		del($(this).attr("flag"));
	});
    
    //查看
	$("[name='view']").click(function(event){
		$.ajax({
			url: "/healthHouse/toDetails",
			data: {
				"id": $(this).attr("flag")
			},
			async: false,
			type: "POST",
			success: function(data) {
				if (data) {
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	});
	
	//搜索
	$("#searchsubmit").click(function(){
		var queryText = $("#query").val().trim()
		var searchTime = $("#searchTime").val();
		if ($("#query").val() == $("#query").attr("placeholder")) {
			queryText = "";
			return;
		}
		$.ajax({
			url: "/healthHouse/bloodPressureRecords/list",
			async: false,
			type: "POST",
			data: {
				"queryText": queryText,
				"searchTime": searchTime
			},
			success: function(data) {
				if (data) {
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	});

	function del(id) {
		$.confirm({
			title: "确认",
			message: "确定删除该内容？",
			width: 300,
			height: 280,
			okFunc: function() {
				$.ajax({
					url: "/healthHouse/bloodPressureRecords/delete?id=" + id,
					async: false,
					type: "GET",
					success: function(data) {
						data = JSON.parse(data);
						if (data.code != 200) {
							$.messageBox({
								message: data.msg,
								level: "error"
							});
							return;
						} else {
							$.messageBox({
								message: data.data
							});
							$.ajax({
								url: "/healthHouse/bloodPressureRecords/list",
								async: false,
								type: "POST",
								success: function(dataHtml) {
									if (data) {
										$("#indexCommonView").html("").html(dataHtml);
									}
								}
							});
						}
					}
				});
			}
		});
	};
};