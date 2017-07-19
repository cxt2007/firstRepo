$(function(){
	if($(window).width()<1300){
			$("#searchBox").hide();
		}else{
			$("#searchBox").show();
		}
	$(window).resize(function(){
		if($(window).width()<1300){
			$("#searchBox").hide();
		}else{
			$("#searchBox").show();
		}
	});
	$("#historyBtn").click(function(){
		historyView();
	});
});

function historyView(){
	$("#historyDialog").createDialog({
		width:800,
		height:1000,
		title:'历史退出人员',
		url:'/peopleInfo/historyQuit/view',
		buttons: {
			"关闭":function(event){
				$("#historyDialog").dialog("close");
		   }
		}
	});
	$("#historyDialog").closest('.ui-dialog').css('top','100px');
}

function search(){
	var queryText = $("#queryText").val().trim();
	var submitData={
			"queryText":queryText,
			"queryAge":$("#queryAge").val(),
			"startAge":$("#startAge").val(),
			"endAge":$("#endAge").val(),
	};
	queryPage(submitData);
}

function check(id){
	$("#messageDialog").createDialog({
		width:350,
		height:400,
		title:'核实',
		url:'/peopleInfo/check?id='+id,
		buttons: {
		  "确认" : function(event){
			  $("#checkForm").submit();
		   },
			"取消":function(event){
				$("#messageDialog").dialog("close");
		   }
		}
	});
}


function refresh(){
	queryPage();
}

function queryPage(submitData){
	$.ajax({
		url:"/peopleInfo/quit/view",	            		
		async:false,
		type:"POST",
		data:submitData,
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);

			}
		}
	});
}


function view(name,idcard){
	$.ajax({
		url:"/peopleInfo/details",	            		
		async:false,
		type:"POST",
		data:{'name':name,'idcard':idcard},
		success:function(data){
			if(data){
				$("#indexCommonView").html("").html(data);

			}
		}
	});
}
