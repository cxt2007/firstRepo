TQ.bloodPressureRecordsMaintain = function(){
	$("#maintainForm").formValidate({
		submitHandler: function(form) {
			tag = true;
			$(form).ajaxSubmit({
				success: function(data) {
					if (data.code == 200) {
						$.ajax({
							url: "/healthHouse/bloodPressureRecords/list",
							async: false,
							type: "POST",
							success: function(data) {
								if (data) {
									$("#indexCommonView").html("").html(data);
									$.messageBox({message: "添加成功",level: "success"});
								}
							}
						});
					} else {
						tag = false;
						$.messageBox({message: data.msg,level: "warn"});
					}
				},
			});
		},
		errorHandler: function() {}
	});
	
	//查看血压记录
	$("#showExchange").click(function(){
		if ($("#serialNumber").val() == "") {
			$.messageBox({message: "健康卡号不能为空！",level: "warn"});
			return;
		}else{
			$.ajax({
				url: "/healthHouse/isNotSerialNumber",
				data:{'serialNumber':$("#serialNumber").val()},
				async: false,
				type: "POST",
				success: function(data) {
					if(data.msg){
						$.messageBox({message: data.msg,level: "warn"});
					}else{
						$("#exchangeDialog").createDialog({
							width: 520,
							height: 500,
							title: '血压记录',
							position: 'center',
							url: '/healthHouse/queryPressure?serialNumber=' + $("#serialNumber").val(),
							buttons: {
								"关闭": function() {
									$(this).dialog("close");
								}
							}
						});
					}
				}
			});
		}
	});
	
	
	
};