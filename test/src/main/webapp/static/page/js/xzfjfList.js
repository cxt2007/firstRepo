var ctx=$("#ctx").val();

$(document).ready(function() {
	generate_xzfjf_table();
	getSerchFormBjsjList();
	$("#xzfjfgl-tab-click").click(function(){
		generate_xzfjf_table();
		getSerchFormBjsjList();
		$("#xzfjfgl-tab").addClass("active");
		$("#xzfxm-tab").removeClass("active");
	})
	$("#xzfxm-tab-click").click(function(){
		generate_xzfxm_table();
		$("#xzfxm-tab").addClass("active");
		$("#xzfjfgl-tab").removeClass("active");
	})
	$("#campus-chosen1").change(function() {	// 点击查询按钮
		generate_xzfjf_table();
		getSerchFormBjsjList()
	});
	$("#user_bjid_chosen").change(function(){
		generate_xzfjf_table();
	});
	$("#paystate_chosen").change(function(){
		generate_xzfjf_table();
	})
	$("#campus-chosen2").change(function() {	// 点击查询按钮
		generate_xzfxm_table();
	});
});

/*获取列表数据，datatable实现， 此列表是 根据学生 统计他的所有缴费记录， 后续要先根据学期进行区分*/
function generate_xzfjf_table(){	
	getTotal();
	App.datatables();
	var rownum=1;
	/* Initialize Datatables */
	var sAjaxSource=ctx+"/xtgl/xzfjfgl/ajax_findGatherByCampusidAndBjidAndXmAndPaystate";	
	var paystate=$("#paystate_chosen").val();
    var campusid=$("#campus-chosen1").val();
    var bjids=$("#user_bjid_chosen").val();
    var xmLike=$("#user_xm").val();
	var param = "search_EQ_campusid="+campusid;
    param=param+"&search_EQ_bjid="+bjids;
    param=param+"&search_LIKE_xm="+xmLike;    
    param=param+"&search_paystate="+paystate;
    
    sAjaxSource=sAjaxSource+"?"+param;
	var aoColumns= [
						{ "sWidth": "30px", "sClass": "text-center","mDataProp": "id"},
						{ "sWidth": "50px", "sClass": "text-center","mDataProp": "studentname"},
						{ "sWidth": "50px", "sClass": "text-center","mDataProp": "classname"},
						{ "sWidth": "150px", "sClass": "text-center","mDataProp": "sfxmname"},
    					{ "sWidth": "50px", "sClass": "text-center","mDataProp": "total"},
    					{ "sWidth": "50px", "sClass": "text-center","mDataProp": "payed"},
    					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "paydate"},
    					{ "sWidth": "80px", "sClass": "text-center","mDataProp": "xqmc"},
    					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "id"}
    	           ];
	
	
    $('#xzfjf-datatable').dataTable({
    	"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
        "bServerSide":true,//服务器端必须设置为true
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	$('td:eq(0)',nRow).html(rownum);
        	var payedDisplay;
        	var payed=aaData.payed;
        	if(payed<aaData.total){
        		if(aaData.payed==null)
        			payed=0;
        		payedDisplay="<span style='color:red'>"+payed+"</span>";
        	}
        	else payedDisplay="<span style='color:#0099CC'>"+payed+"</span>";
        	$('td:eq(5)',nRow).html(payedDisplay);
        	var operation="<a style='color:#0099CC' href='javascript:getExcelFileForPrint("+aaData.id+",\""+aaData.studentname+"\","+aaData.total+","+aaData.payed+");'>打印缴费单</a>&nbsp;&nbsp;&nbsp;&nbsp;<a style='color:#0099CC' href='javascript:toSfmx("+aaData.id+",\""+aaData.studentname+"\",\""+aaData.classname+"\")'>查看明细</a>&nbsp;&nbsp;&nbsp;&nbsp;<a style='color:red' href='javascript:delJfByStuid("+aaData.id+","+aaData.ispay+");'>删除</a>";
        	
        	$('td:eq(8)',nRow).html(operation);
        	rownum++;
			return nRow;
		}, 
        "aoColumns":aoColumns
    });    
}

function getJiaofeiExcelFile(){
	var url=ctx+"/xtgl/xzfjfgl/ajax_getJiaofeiExcelFile";	
	var param = "search_EQ_campusid="+$("#campus-chosen1").val();
    param=param+"&search_EQ_bjid="+$("#user_bjid_chosen").val();
    param=param+"&search_LIKE_xm="+$("#user_xm").val();
    param=param+"&search_paystate="+$("#paystate_chosen").val();
    url=url+"?"+param;
    $.post(url,function(data){
    	if(data==null || data=="")
    		return;
    	location.href=ctx+data;
    });
}

function getTotal(){
	var url=ctx+"/xtgl/xzfjfgl/ajax_getTotal";	
	var param = "search_EQ_campusid="+$("#campus-chosen1").val();
    param=param+"&search_EQ_bjid="+$("#user_bjid_chosen").val();
    param=param+"&search_LIKE_xm="+$("#user_xm").val();
    url=url+"?"+param;
	$.get(url,function(data){
		var datas=eval(data);
		var a=datas[0][0];
		var b=datas[0][1];
		if(a==null || a=="")
			$("#xzf_total").html("0");
		else
			$("#xzf_total").html(a);
		$("#xzf_noPayed").html(a-b);
	});
}

/*根据学生ID 弹出该学生的缴费明细表*/
function toSfmx(stuid,studentname,classname){
	var url=ctx+"/xtgl/xzfjfgl/ajax_getSfmx?stuid="+stuid+"&campusid="+$("#campus-chosen1").val();
	
	$.get(url,function(data){
		$("#xzfjfheader").html(studentname);
		
		var datas=eval(data);
		$("#xzfjf-body").html("");
		var total=0;
		for(var i=0;i<datas.length;i++){
			total+=datas[i].price*datas[i].count;
			$("#xzfjf-body").append("<tr>");
			$("#xzfjf-body").append("<td>"+(i+1)+"</td>");
			$("#xzfjf-body").append("<td>"+datas[i].sfxmname+"</td>");
			$("#xzfjf-body").append("<td>"+datas[i].price+"</td>");
			$("#xzfjf-body").append("<td>"+datas[i].unitname+"</td>");
			$("#xzfjf-body").append("<td>"+datas[i].count+"</td>");
			$("#xzfjf-body").append("<td>"+(datas[i].price*datas[i].count)+"</td>");
			var state;
			if(datas[i].ispay==1){
				state="<span style='color:#0099cc'>已缴</span>";
			}else state="<span style='color:red'>未缴</span>";
			$("#xzfjf-body").append("<td>"+state+"</td>");
			var a=datas[i].ispay;
			$("#xzfjf-body").append("<td><a  href='javascript:delJiaofeiBySfxmid("+datas[i].sfxmid+","+stuid+",\""+studentname+"\",\""+datas[i].sfxmname+"\","+datas[i].ispay+",\""+classname+"\");'>删除</a></td>");
			$("#xzfjf-body").append("</tr>");
		}
		
		$("#total").html(total);		
		$("#modal-jiaofeimingxi").modal("show");	
	});
	
}



function delJiaofeiBySfxmid(sfxmid,stuid,studentname,sfxmname,ispay,classname){
	if(ispay=="1"){
		alert("已经缴费的项目，不能删除");
		return;
	}
	if(confirm("确定要删除"+studentname+"同学的缴费项目："+sfxmname+"吗？")){
		var url=ctx+"/xtgl/xzfjfgl/ajax_delJiaofeiBySfxmid";
		$.post(url,{"sfxmid":sfxmid,"stuid":stuid},function(data){
			if(data=="success"){
				alert("删除成功");
				toSfmx(stuid,studentname,classname);
			}			
		});
	}
}

/*删除学生缴费记录， 但是如果学生已经缴费，将不能被删除*/
function delJfByStuid(stuid,ispay){
	if(ispay==1){
		alert("该学生已经缴费，不能删除");
		return;
	}
	if(confirm("确定要删除该学生的缴费信息吗？")){
		var url=ctx+"/xtgl/xzfjfgl/ajax_delJfByStuid";
		$.post(url,{"stuid":stuid},function(data){
			if(data=="success")
				alert("删除成功");
			else{
				alert("删除出现错误");
			}
			generate_xzfjf_table();
		});
	}	
}

/*打印缴费单（获取excel文件打印），同时设置缴费状态为已缴。 完事刷新列表*/
function getExcelFileForPrint(stuid,studentname,total,payed){
	if(confirm("学生姓名："+studentname+"\n缴费金额："+(total-payed)+"\n现在确定交费吗?")){
		var url=ctx+"/xtgl/xzfjfgl/ajax_printByExcelFile";
		var submitData = {
				"stuid":stuid,
				"total":total,
				"payed":payed
			};
		$.post(url, submitData, function(data) {
				location.href = ctx + data;
				generate_xzfjf_table();
		});
	}
}

/*异步获取班级列表， 根据 选择的校区*/
function getSerchFormBjsjList(){	
	var url=ctx+"/base/findBjsjByCampusid";
	var submitData = {
		campusid: $("#campus-chosen1").val()
	}; 
	var search_EQ_bjid =  $("#search_EQ_bjid").val();
	var selected;
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#user_bjid_chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	if(search_EQ_bjid!=null && search_EQ_bjid!='' && search_EQ_bjid==datas[i][0]){
	        		$("#user_bjid_chosen").append("<option value=" + datas[i][0]+" selected >"
		        			+ datas[i][1] + "</option>");
	        	}else{
	        		$("#user_bjid_chosen").append("<option value=" + datas[i][0]+" >"
		        			+ datas[i][1] + "</option>");
	        	}
	        	
	        };
	        $("#user_bjid_chosen").find("option[index='0']").attr("selected",'selected');
	        $("#user_bjid_chosen").trigger("chosen:updated");
	        
	        generate_xzfjf_table();
    });
}

/*转到新增缴费页面*/
function toCreate(){
	var campusid=$("#campus-chosen1").val();
	var campusname=$("#campus-chosen1 option[value="+campusid+"]").text();
	location.href=ctx+"/xtgl/xzfjfgl/tocreate?campusid="+campusid+"&campusname="+campusname;
}



/**收费项目js start*/
function generate_xzfxm_table(){
	App.datatables();
	/* Initialize Datatables */
	var rownum=1;
	var sAjaxSource=ctx+"/xtgl/xzfxm/ajax_findInfoByCampusid";
	var param ="campusid="+ $("#campus-chosen2").val();
    sAjaxSource=sAjaxSource+"?"+param;
	var aoColumns= [
						{ "sWidth": "30px", "sClass": "text-center","mDataProp": "id"},
						{ "sWidth": "150px", "sClass": "text-center","mDataProp": "feename"},
    					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "unitname"},
    					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "price"},
    					{ "sWidth": "50px", "sClass": "text-center","mDataProp": "publisher"},
    					{ "sWidth": "50px", "sClass": "text-center","mDataProp": "publishdate"},
    					{ "sWidth": "50px", "sClass": "text-center","mDataProp": "state"},
    					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "id"}
    	           ];
	
	
    $('#xzfxm-datatable').dataTable({    	
    	"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "bAutoWidth":false,
        "sAjaxSource": sAjaxSource,
        "bServerSide":true,//服务器端必须设置为true
        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
        	$('td:eq(0)',nRow).html(rownum);
        	$('td:eq(1)',nRow).html(aaData.feename);
        	$('td:eq(2)',nRow).html(aaData.unitname);
        	$('td:eq(3)',nRow).html(aaData.price);
        	$('td:eq(4)',nRow).html(aaData.publisher);
        	$('td:eq(5)',nRow).html(aaData.publishdate);
        	var state;
        	var stateOpt;
        	if(aaData.state==0){
        		state='停用';
        		stateOpt="<a href='javascript:;' onclick='toUpdateState("+aaData.id+",1,this);'>启用</a>";
        	}
        	else{
        		state='启用';
        		stateOpt="<a href='javascript:;' onclick='toUpdateState("+aaData.id+",0,this);'>停用</a>";
        	}
        	$('td:eq(6)',nRow).html(state);
        	var operation=stateOpt+"&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript:toUpdate("+aaData.id+",\""+aaData.feename+"\",\""+aaData.unitname+"\","+aaData.price+");'>修改</a>";
        	$('td:eq(7)',nRow).html(operation);
        	rownum++;
			return nRow;
		}, 
        "aoColumns":aoColumns
    });    
}
/*启用或停用 收费项目*/
function toUpdateState(id,state,obj){
	var url=ctx+"/xtgl/xzfxm/ajax_updateXzfxmState";
	var stateText;
	var optStateText;
	var optState;
	if(state==0){
		stateText="停用";
		optStateText="启用";
		optState=1;
	}
	else{
		stateText="启用";
		optStateText="停用";
		optState=0;
	}
	$.post(url,{"id":id,
		"state":state},function(data){
			if(data=="success"){
				$(obj).parent().prev().html(stateText);
				$(obj).html(optStateText);
				$(obj).attr("onclick","toUpdateState("+id+","+optState+",this);");
			}			
	});
	
}
/*修改收费项目*/
function toUpdate(id,feename,unitname,price){
	$("#addOrEdit").html("更新");
	$("#currentCampus").html($("#campus-chosen2").find("option:selected").text());
	$('#jfdw option').each(function(){
		var a=$(this).text();
    	if($(this).text()==unitname) $(this).attr("selected","selected");
    });
	$("#jfdw option").trigger("chosen:updated");
	$("#feename").val(feename);	
	$("#price").val(price);
	$("#saveSubmit").click(function(){		
		$("#saveSubmit").unbind("click");
		var url=ctx+"/xtgl/xzfxm/ajax_updateXzfxm";
		$.post(url,{"id":id,
			"feename":$("#feename").val(),
			"unitname":$("#jfdw option:selected").text(),
			"price":$("#price").val()},function(data){
				$("#modal-addconfig").modal("hide");
				generate_xzfxm_table();
		});
	});
	$("#modal-addconfig").modal("show");
}


/*新增收费项目*/
function toAdd(){
	$("#addOrEdit").html("新增");
	$("#currentCampus").html($("#campus-chosen2").find("option:selected").text());
	$("#feename").val("");
	$("#price").val("");
	$("#saveSubmit").click(function(){	
		$("#saveSubmit").unbind("click");		
		if($("#price").val().match(/^[1-9]+\d+(\.\d{1,2})?$/)==null){
			alert("单价格式错误");
			return;
		}				
		var url=ctx+"/xtgl/xzfxm/ajax_addXzfxm";
		$.post(url,{"campusid":$("#campus-chosen2").val(),
			"feename":$("#feename").val(),
			"unitname":$("#jfdw option:selected").text(),
			"price":$("#price").val()},function(data){
				$("#modal-addconfig").modal("hide");
				generate_xzfxm_table();				
		});
	});
	$("#modal-addconfig").modal("show");
}
/**收费项目js end*/