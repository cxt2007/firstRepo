$(function(){
	$(".jqdatepicker").datePicker({
		yearRange: '1900:2060',
        dateFormat: 'yy-mm-dd'
	});
	$("#searchsubmit").click(function(){
		search();
	});
	
	$("#syncDate").change(function(){
		search();
	});
	$("#isDown").change(function(){
		search();
	});
	$("#resideDistrict").change(function(){
		search();
	});
	$("#resideTown").change(function(){
		search();
	});
	$("#resideCommunity").change(function(){
		search();
	});
	$("#selectAll").change(function(){
		if($(this).attr("checked")){
			$("input[name='selectids']").each(function(){
				$(this).attr("checked",true);
			});
		}else{
			$("input[name='selectids']").each(function(){
				$(this).attr("checked",false);
			});
		}
	});
	
	//初始化现居地址
	threeSelect({
		province:'resideDistrict',
		city:'resideTown',
		district:'resideCommunity',
		provinceValue:$('#resideDistrictValue').val(),
		cityValue:$('#resideTownValue').val(),
		districtValue:$('#resideCommunityValue').val(),
		firstId:$('#firstId').val()
	});
});


function replactPlacehodler(str){
	if(str=='请选择' || str=='选择区划' || str=='选择街道' || str=='选择社区' ){
		return "";
	}else{
		return str;
	}
}


function search(){
	var query=$("#query").val();
	if(query==$("#query").attr("placeholder")){
		query="";
	}
	var isDown=$("#isDown").val();
	if(isDown==$("#isDown").attr("placeholder")){
		isDown="";
	}
	var submitData={
			"query":query,
			"resideDistrict":replactPlacehodler($("#resideDistrict").val()),
			"resideTown":replactPlacehodler($("#resideTown").val()),
			"resideCommunity":replactPlacehodler($("#resideCommunity").val()),
			"isDown":isDown,
			"syncDate":$("#syncDate").val()
			};
	$.ajax({
		url:"/equipmentInfo/list",
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

function exportList(){
	$.confirm({
        title:"确认",
        message:"确认导出",
        width: 300,
        height:250,
        okFunc: function(){
        	var isDown=$("#isDown").val();
			if(isDown==$("#isDown").attr("placeholder")){
				isDown="";
			} 
			var query=$("#query").val();
			if(query==$("#query").attr("placeholder")){
				query="";
			}
//			var submitData={
//				"community":replactPlacehodler($("#resideCommunity").val()),
//				"town":replactPlacehodler($("#resideTown").val()),
//				"district":replactPlacehodler($("#resideDistrict").val()),
//				"queryText":query,
//				"isDown":isDown,
//				"syncDate":$("#syncDate").val(),
//				"isExport":1
//			}
//        	$.ajax({
//        		url: "/equipmentInfo/getCountBeforeInformationRegistrationFile",
//        		type: "POST",
//        		data: submitData,
//        		success: function(data){
//        			if(data.data){
        				$("#community").val(replactPlacehodler($("#resideCommunity").val()));
        				$("#town").val(replactPlacehodler($("#resideTown").val()));
        				$("#district").val(replactPlacehodler($("#resideDistrict").val()));
        				var query=$("#query").val();
        				if(query==$("#query").attr("placeholder")){
        					query="";
        				}
        				$("#queryText").val(query);
        				var isDown=$("#isDown").val();
        				if(isDown==$("#isDown").attr("placeholder")){
        					isDown="";
        				}
        				$("#isDown_form").val(isDown);
        				$("#syncDate_form").val($("#syncDate").val());
        				$("#exportForm").attr("action","/equipmentInfo/exportList");
        				$("#exportForm").submit();
//        			}else{
//        				$.notice({level:"info",message:"没有选择老人"});
//        			}
//        		}
//        	});
        }});
}

function downloadRegistrationFile(){
	//判断是否有 选中的对象
	var checkBoxItem=$('input[name="selectids"]:checked');
	var peopleIds=[];
	var community="";
	var hasMultiComm=false;
	checkBoxItem.each(function(){
		if(community==""){
			community=$(this).attr("community");
		}else if(community!=$(this).attr("community")){
			hasMultiComm=true;
			return;
		}
		peopleIds.push($(this).val());
	});
	if(hasMultiComm){
		$.messageBox({message:"请选中同一个社区的下载",level: "warn"});
		return;
	}
	if(peopleIds.length==0){
		//按社区名字下载，整个社区的表格数据
		community=replactPlacehodler($("#resideCommunity").val());
		if(community==''){
			$.messageBox({message:"下载发放表格时，请选择社区",level: "warn"});
			
			return;
		}
		if($(".paging-box .total").html().indexOf('共 0 页')!=-1){
			$.messageBox({message:"当前没有可下载的待发终端老人",level: "warn"});
			return;
		}
	}
	
	$.confirm({
        title:"确认登记表下载",
        message:"社区名称："+community,
        width: 300,
        height:250,
        okFunc: function(){
        	var isDown=$("#isDown").val();
			if(isDown==$("#isDown").attr("placeholder")){
				isDown="";
			} 
        	$.ajax({
        		url: "/equipmentInfo/getInformationRegistrationFile",
        		type: "POST",
        		async:true,
        		data: {"community":community,"peopleIds":peopleIds.join(","),"isDown":isDown,"syncDate":$("#syncDate").val()},
        		success: function(data){
        			search();
        			var ret=data.ret;
        			if(ret.code==200){
        				var d=ret.data;
        				if(data.path!=''){
        					$("#filePath").val(d.path);
        					$("#fileName").val(d.fileName);
        					$("#exportForm").attr("action","/equipmentInfo/downloadFile");
        					$("#exportForm").submit();
        					return;
        				}
        			}
        			$.messageBox({message:"该社区没有待发放老人",level: "warn"});
        		}
        	});
        }});
}

$("#status").change(function(){
		var query = $("#query").val();
		var status = $("#status").val();
		$.ajax({
			url:"/equipmentInfo/list",	
			data:{'query':query,'status':status},
			async:false,
			type:"POST",
			success:function(data){
				if(data){
					$("#indexCommonView").html("").html(data);
				}
			}
		});
	})
	
	
	function checkData(){
		$.ajax({
			url:"/equipmentInfo/checkData",
			async:false,
			type:"POST",
			success:function(data){
				$.messageBox({message:"校验完成"});
				$.ajax({
					url:"/equipmentInfo/list",	            		
					async:false,
					type:"POST",
					success:function(data){
						if(data){
							$("#indexCommonView").html("").html(data);
			
						}
					}
				});
			}
		});
	}
	//导入
	 $("#import").click(function(){
	     	$("#exportDatas").createDialog({
	     		width: 450,
				height: 370,
				title:'导入',
				url:'/equipmentInfo/import',
				buttons: {
					"关闭" : function(event){
						$("#exportDatas").dialog("close");
					}
					}
				});
	     	//$("#exportDatas").css({'minHeight':'41px',height:'auto','paddingBottom':'0'});
	 });
//新增
function addInfo(){
	$.ajax({
		url:"/equipmentInfo/add",	            		
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
function editInfo(id){
	$.ajax({
		url:"/equipmentInfo/edit",
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

//删除
function deleteInfo(id){
	$.confirm({
        title:"确认",
        message:"确定删除？",
        width: 300,
        height:280,
        okFunc: function(){
        	$.ajax({
    			url:"/equipmentInfo/delete",
    			data:{"id":id},
    			async:false,
    			type:"POST",
    			dataType: "json",
    			success:function(data){
    				if (data) {
						$.ajax({
							url:"/equipmentInfo/list",	            		
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