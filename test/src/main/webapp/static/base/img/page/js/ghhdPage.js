
var ctx = "";
var public_themeid=0;
var ghhdDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();

$(document).ready(function() {
	generate_table_theme();//活动主题
	generate_table();
	
	generate_table_themeDetail('');
	$("#school-chosen").change(function() {
		var url=ctx+"/xtgl/ghhd/ajax_change_bj";
		var submitData = {
			campusid	: $("#school-chosen").val()
		};
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				$("#bj-chosen option").remove();//user为要绑定的select，先清除数据
		        for(var i=0;i<datas.length;i++){
		        	$("#bj-chosen").append("<option value=" + datas[i][0] + ">" + datas[i][1] + "</option>");
		        };
		        $("#bj-chosen option").eq(0).attr("selected",true);
				$("#bj-chosen").trigger("chosen:updated");
				generate_table();
	    		return false;
	      });
	});
	
	$("#bj-chosen").change(function() {
		generate_table();
	});
	
	$("#search-btn").click(function() {
		generate_table();
	});
	$("#insertData").click(function() {
		$("#insertData").attr("disabled",true);
		insertData();
	});
	
	/**
	 * 查询活动主题
	 */
	$("#search-theme-btn").click(function() {
		generate_table_theme();
	});
	
	/**
	 * 打开活动主题新增界面
	 */
	$("#add-theme-btn").click(function() {
		openThemeAddModel();
	});
	
	
	/**
	 * 新增活动设置
	 */
	$("#add-themeDetail-btn").click(function() {
		$("#themeDetailForm_id").val('');
		$("#themeDetailForm_title").val('');
		$("#themeDetailForm_content").val('');
		$("#themeDetailForm_themeid").val(public_themeid);
		$("#themeDetailModel").modal("show");
	});
	$("#uploadFile").change(function() {
		uploadImg();
	});
	$("#themeForm_voterule_chosen").css("width","133px");
});
function uploadImg() {
	$('#ajaxSaveTheme').attr('disabled', 'disabled');
	var oData = new FormData(document.forms.namedItem("fileinfo"));
	oData.append("CustomField", "This is some extra data");
	var oReq = new XMLHttpRequest();
	oReq.open("POST", ctx + "/xtgl/ghhd/picupload?isAjax=true&resType=json",
			true);
	oReq.onload = function(oEvent) {
		$('#ajaxSaveTheme').removeAttr('disabled');
		if (oReq.status == 200 && oReq.responseText != '') {
			$("#uploadImg").attr("src", oReq.responseText);
			$("#themeForm_picpath").val(oReq.responseText);
			// ajaxQueryMrcp(weeknum, campusid);
		} else {
			alert("照片上传失败！");
		}
	};
	oReq.send(oData);
};
function generate_table(){
	 var rownum = 1;

     /* Initialize Datatables */
     var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd?"
     				+"content="
    		 		+"&campusid="+$("#school-chosen").val()
    		 		+"&bjid="+$("#bj-chosen").val()+"&ghhdthemeid="+$("#ghhdtheme-chosen").val();
     var aoColumns= [
					{ "sWidth": "70px", "sClass": "text-center","mDataProp": "id"},
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "num"},
 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "filepath"},
 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "stuid_ch"},
 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "bjid_ch"},
 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "publisher"},
 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "publishdate"},
 					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "id"}
 	           ];
     
	 $('#example-datatable').dataTable({     
	 	"aaSorting" : [ [ 3, 'desc' ] ],
		"iDisplayLength" : 20,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ],
			[ 10, 20, 30, "All" ] ],
			"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		"sAjaxSource" : sAjaxSource, 
	    "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
	     	$('td:eq(0)', nRow).html(rownum);
	     	// 照片
	     	var picpath = "";
	     	if(aaData.filepath!=null && aaData.filepath!=''){
	     		picpath = aaData.filepath;
	     	}
	     	
	     	var picHtml='<img src="'+picpath+'" style="height:64px;width: 64px" alt="avatar" class="img-circle">';   	
	     	$('td:eq(2)', nRow).html(picHtml);
	     	
	     	// 删除
			var delHtml = '<div class="btn-group btn-group-xs"><a href="javascript:delConfirm('
					+ aaData.id + ');">删除</a></div>';
			$('td:eq(7)', nRow).html(delHtml);
	     
			rownum=rownum+1;
			return nRow;
		}, 
	     "aoColumns":aoColumns
	 });
}


function insertData(){
	if (confirm("确认抽取班级圈中的活动报名信息?")) {
		var url = ctx + "/xtgl/ghhd/insert_data_ghhd";
		var submitData = {
			ghhdthemeid:$("#ghhdtheme-chosen").val()
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("抽取成功!");
				generate_table();
			} else {
				alert(data);
			}

			return false;
		});
	}
}

function delConfirm(id) {
	if (confirm("确认删除?")) {
		var url = ctx + "/xtgl/ghhd/ajax_delGhhd";
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("删除成功!");
				generate_table();
			} else {
				alert(data);
			}

			return false;
		});
	}
}



/**
 * 活动主题内容
 */
function generate_table_theme(){
	 var rownum = 1;

    /* Initialize Datatables */
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd_themeList?title=";
    var aoColumns= [
					{ "sTitle":"序号","sWidth": "50px", "sClass": "text-center","mDataProp": "id"},
					{ "sTitle":"标题","sWidth": "150px", "sClass": "text-center","mDataProp": "title"},
					{ "sTitle":"封面","sWidth": "100px", "sClass": "text-center","mDataProp": "picpath"},
//					{ "sTitle":"活动代码","sWidth": "100px", "sClass": "text-center","mDataProp": "appid"},
//					{ "sTitle":"发布者","sWidth": "100px", "sClass": "text-center","mDataProp": "publisher"},
//					{ "sTitle":"发布时间","sWidth": "100px", "sClass": "text-center","mDataProp": "publishdate"},
//					{ "sTitle":"关键字","sWidth": "80px", "sClass": "text-center","mDataProp": "keyword"},
					{ "sTitle":"操作","sWidth": "180px", "sClass": "text-center","mDataProp": "id"}
	           ];
    
	 $('#datatable-theme').dataTable({     
	 	"aaSorting" : [ [ 3, 'desc' ] ],
		"iDisplayLength" : 20,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ],
			[ 10, 20, 30, "All" ] ],
			"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		"sAjaxSource" : sAjaxSource, 
	    "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
	     	$('td:eq(0)', nRow).html(rownum);
	     	// 照片
	     	var picpath = "";
	     	if(aaData.picpath!=null && aaData.picpath!=''){
	     		picpath = aaData.picpath;
	     	}
	     	
	     	var openThemeChildrenModelHref='<a href="javascript:openThemeChildrenModel('+ aaData.id + ');">'+aaData.title+'</a>';
	     	$('td:eq(1)', nRow).html(openThemeChildrenModelHref);
	     	
	     	var picHtml='<img src="'+picpath+'" style="height:64px;width: 64px" alt="avatar" class="img-circle">';   	
	     	$('td:eq(2)', nRow).html(picHtml);
	     	
	     	// 删除
			var sendMsgHtml = '<div class="btn-group btn-group-xs"><a href="javascript:openThemeEditModel('
				+ aaData.id + ');">编辑</a>&nbsp;&nbsp<a href="javascript:openThemeChildrenModel('+ aaData.id +');">编辑子项</a>'
				+'&nbsp;&nbsp<a href="javascript:openPublishTheme('+ aaData.id +');">活动范围</a>'
				+'&nbsp;&nbsp<a href="javascript:ajax_sendThemeMsg('
					+ aaData.id + ','+ aaData.id + ','+aaData.appid+',1);">推送老师</a>&nbsp;&nbsp<a href="javascript:ajax_sendThemeMsg('
					+ aaData.id + ','+aaData.id + ','+aaData.appid+',2);">推送家长</a></div>';
			$('td:eq(3)', nRow).html(sendMsgHtml);

			$('td:eq(0)', nRow).attr("onclick","selectTheme(this,"+aaData.id+")");
			$('td:eq(1)', nRow).attr("onclick","selectTheme(this,"+aaData.id+")");
			$('td:eq(2)', nRow).attr("onclick","selectTheme(this,"+aaData.id+")");
			$('td:eq(3)', nRow).attr("onclick","selectTheme(this,"+aaData.id+")");
			
			rownum=rownum+1;
			return nRow;
		}, 
	     "aoColumns":aoColumns
	 });
}

function ajaxSavePublishCampus(){
	var themeid = $("#publish_themeid").val();
	var themeCapusids = $("#themeCapusids").val();
	if(!themeCapusids){
		PromptBox.alert("请选择学校后再进行保存操作！");
		return ;
	}
	var param = {
			campusid: $("#main_campusid").val(),
			themeid:themeid,
			campusids:themeCapusids,
			userid: $("#main_userid").val()
		}
		var submitData = {
			api: "6070020",
			param: JSON.stringify(param)
		};
		$.ajax({
			cache: false,
			type: "POST",
			async:false,
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas) {
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code === "200") {
					PromptBox.alert("保存成功！");
					$("#publishThemeModel").modal("hide");
				} else {
					console.log(result.ret.code + ":" + result.ret.msg);
				}
			}
		});
}
function openPublishTheme(themeid){
	var param = {
		campusid: $("#main_campusid").val(),
		themeid:themeid,
		userid: $("#main_userid").val()
	}
	var submitData = {
		api: "6070019",
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				$("#select_dls_group").hide();
				var dataData = result.data.campuslist;
				var dataList = "";
				var campusids = "";
				for(var i=0;i<dataData.length;i++){
					dataList = dataList + '<li>'+dataData[i].campusname+'</li>';
					campusids = campusids + dataData[i].campusid +",";
				}
				if(campusids && campusids.length>0){
					campusids = campusids.substring(0,campusids.length);
				}
				$("#ajaxSavePublishCampus").hide();
				$("#themeCapusids").val(campusids);
				$("#showCampusList").find('ul').html(dataList);
				$("#showCampusList").find('li').css({"float":"left","margin-left":"20px",
					"list-style":"none","background-color":"#7abce7",
					"margin-top":"5px","border-radius":"5px","color":"white","padding":"5px 10px"});
			} else {
				$("#select_dls_group").show();
				$("#ajaxSavePublishCampus").show();
				$("#showCampusList").find('ul').html('');
				$("#themeCapusids").val('');
				getDlsList();
				multiselect("#city_list");
				$("#city_list").multiselect("refresh");
				multiselect("#campus_list");
				$("#campus_list").multiselect("refresh");
			}
		}
	});
	$("#publish_themeid").val(themeid);
	$("#publishThemeModel").modal("show");
}

function selectTheme(node,themeid) {
	$('#datatable-theme').find('tr').removeClass('boxselected');
	$(node).parents('tr').addClass('boxselected');
	//callback(stuid, type);
	public_themeid=themeid;
	generate_table_themeDetail(themeid);
}

/**
 * 活动主题内容详细设置
 */
function generate_table_themeDetail(themeid){
	 var rownum = 1;

    /* Initialize Datatables */
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd_themeDetailList?parentid=0&themeid="+themeid;
    var aoColumns= [
					{ "sTitle":"序号","sWidth": "50px", "sClass": "text-center","mDataProp": "id"},
					{ "sTitle":"标题","sWidth": "150px", "sClass": "text-center","mDataProp": "title"},
					{ "sTitle":"操作","sWidth": "180px", "sClass": "text-center","mDataProp": "id"}
	           ];
    
	 $('#datatable-themeDetail').dataTable({     
	 	"aaSorting" : [ [ 3, 'desc' ] ],
		"iDisplayLength" : 20,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ],
			[ 10, 20, 30, "All" ] ],
			"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		"sAjaxSource" : sAjaxSource, 
	    "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
	     	$('td:eq(0)', nRow).html(rownum);
	     	
	     	var openThemeChildrenModelHref='<a href="javascript:openThemeDetailEditModel('+ aaData.id + ','+themeid + ');">编辑</a>';
	     	var openThemeDetailAwardEditModelHref='';
	     	//if(aaData.isaward==true){
		     	openThemeDetailAwardEditModelHref='<a href="javascript:openThemeDetailAwardEditModel('+ aaData.id + ','+themeid + ');">设置明细</a>';
	     	//}
	     	var  deleteThemeDetail='<a href="javascript:deleteThemeDetail('+ aaData.id + ','+aaData.parentid + ','+themeid + ');">删除</a>'
	     	// 操作
			var optionHtml = '<div class="btn-group btn-group-xs">'+openThemeDetailAwardEditModelHref+'&nbsp;&nbsp;'+openThemeChildrenModelHref+'&nbsp;&nbsp;'+deleteThemeDetail+'</div>';
			$('td:eq(2)', nRow).html(optionHtml);
	     
			rownum=rownum+1;
			return nRow;
		}, 
	     "aoColumns":aoColumns
	 });
}

function openThemeDetailEditModel(themeDetailid,themeid) {
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd_themeDetail/"+themeDetailid;

	$.get(sAjaxSource, {}, function(data) {
		var datas = eval("(" + data + ")");
		$("#themeDetailForm_id").val(themeDetailid);
		$("#themeDetailForm_themeid").val(themeid);
		$("#themeDetailForm_title").val(datas.title);
		$("#themeDetailForm_content").val(datas.content);
		$("#themeDetailForm_hyperlink").val(datas.hyperlink);
		$("#themeDetailForm_sort").val(datas.sort);

		$("#themeDetailForm_parentid").val(datas.parentid);
		$('#themeDetailForm_isdispaytitle').find(
				"option[value='" + datas.isdispaytitle + "']").attr("selected",
				true);
		$('#themeDetailForm_isdispaytitle').trigger("chosen:updated");
		$('#themeDetailForm_isaward').find(
				"option[value='" + datas.isaward + "']").attr("selected",
				true);
		$('#themeDetailForm_isaward').trigger("chosen:updated");
				
		$("#themeDetailForm_hyperlinktitle").val(datas.hyperlinktitle);
		
		$('#themeDetailForm_hyperlinkposition').find(
				"option[value='" + datas.hyperlinkposition + "']").attr("selected",
				true);
		$('#themeDetailForm_hyperlinkposition').trigger("chosen:updated");
		
		$("#themeDetailModel").modal("show");
	});

}

function saveThemeDetail() {
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_save_ghhd_themeDetail";
    var title =$("#themeDetailForm_title").val();
    if(title==null || title==""){
    	alert("标题不能为空");
    }

    var submitData = {
			id : $("#themeDetailForm_id").val(),
			title : $("#themeDetailForm_title").val(),
			content : $("#themeDetailForm_content").val(),
			hyperlink : $("#themeDetailForm_hyperlink").val(),
			isdispaytitle:$("#themeDetailForm_isdispaytitle").val(),
			parentid:$("#themeDetailForm_parentid").val()==""?0:$("#themeDetailForm_parentid").val(),
			isaward:$("#themeDetailForm_isaward").val(),
			themeid:$("#themeDetailForm_themeid").val(),
			sort:$("#themeDetailForm_sort").val()==""?99:$("#themeDetailForm_sort").val(),
			hyperlinkposition:$("#themeDetailForm_hyperlinkposition").val(),		
			hyperlinktitle:$("#themeDetailForm_hyperlinktitle").val()
    };
	$.post(sAjaxSource, submitData, function(data) {
		var datas = eval("(" + data + ")");
		if(datas==true){
			generate_table_themeDetail(public_themeid);
			$("#themeDetailModel").modal("hide");
		}
		
	});

}

/**
 * 奖品设置
 * @param themeDetailAwardId
 * @param themeid
 */
function openThemeDetailAwardEditModel(themeDetailAwardId,themeid) {
	$("#themeDetailAwardForm_themeid").val(themeid);
	$("#themeDetailAwardForm_parentid").val(themeDetailAwardId);
	generate_table_themeDetailAward(themeDetailAwardId,themeid)
	resetThemeDetailAwardForm();
	$("#themeDetailAwardModel").modal("show");

}

function resetThemeDetailAwardForm(){
	$("#themeDetailAwardForm_id").val("");
	$("#themeDetailAwardForm_title").val("");
	$("#themeDetailAwardForm_content").val("");
	$("#themeDetailAwardForm_sort").val("");
	$("#themeDetailAwardForm_awardnum").val("");
}

function setThemeDetailAwardEditForm(themeDetailAwardId,themeid) {
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd_themeDetail/"+themeDetailAwardId;

	$.get(sAjaxSource, {}, function(data) {
		var datas = eval("(" + data + ")");
		$("#themeDetailAwardForm_id").val(themeDetailAwardId);
		$("#themeDetailAwardForm_title").val(datas.title);
		$("#themeDetailAwardForm_content").val(datas.content);
		$("#themeDetailAwardForm_sort").val(datas.sort);
		$("#themeDetailAwardForm_awardnum").val(datas.awardnum);
		
		
	});

}

function saveThemeDetailAward() {
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_save_ghhd_themeDetail";
    var title=$("#themeDetailAwardForm_title").val();
    var content=$("#themeDetailAwardForm_content").val();
    if(title==null || title==""){
    	alert("标题不能为空");
    }
    if(content==null || content==""){
    	alert("内容不能为空");
    }
    var submitData = {
			id : $("#themeDetailAwardForm_id").val(),
			title : $("#themeDetailAwardForm_title").val(),
			content : $("#themeDetailAwardForm_content").val(),
			parentid:$("#themeDetailAwardForm_parentid").val(),
			themeid:$("#themeDetailAwardForm_themeid").val(),
			sort:$("#themeDetailAwardForm_sort").val()==""?99:$("#themeDetailAwardForm_sort").val(),
			awardnum:$("#themeDetailAwardForm_awardnum").val()==""?0:$("#themeDetailAwardForm_awardnum").val()
    };
	$.post(sAjaxSource, submitData, function(data) {
		var datas = eval("(" + data + ")");
		if(datas==true){
			generate_table_themeDetailAward($("#themeDetailAwardForm_parentid").val(),$("#themeDetailAwardForm_themeid").val());
			resetThemeDetailAwardForm();
			//$("#themeDetailAwardModel").modal("hide");
		}else{
			alert("保存失败");
		}
		
	});

}

function deleteThemeDetail(themeDetailId,themeDetailParentid,themeid) {
	if (confirm("确认删除?")) {
		  var sAjaxSource=ctx+"/xtgl/ghhd/ajax_delete_ghhd_themeDetail/"+themeDetailId;
		  
			$.post(sAjaxSource, {}, function(data) {
				var datas = eval("(" + data + ")");
				if(datas==true){
					if(themeDetailParentid==0){
						generate_table_themeDetail(themeid);

					}else{
						generate_table_themeDetailAward(themeDetailParentid,themeid);

					}
					//$("#themeDetailAwardModel").modal("hide");
				}else{
					alert("删除失败");
				}
				
			});
	}
  

}


/**
 * 活动主题内容详细奖品设置
 */
function generate_table_themeDetailAward(themeDetailAwardId,themeid){
	 var rownum = 1;

    /* Initialize Datatables */
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd_themeDetailList?parentid="+themeDetailAwardId+"&themeid="+themeid;
    var aoColumns= [
					{ "sTitle":"序号","sWidth": "50px", "sClass": "text-center","mDataProp": "id"},
					{ "sTitle":"标题","sWidth": "150px", "sClass": "text-center","mDataProp": "title"},
					{ "sTitle":"内容","sWidth": "150px", "sClass": "text-left","mDataProp": "content"},
					{ "sTitle":"奖品数量","sWidth": "70px", "sClass": "text-center","mDataProp": "awardnum"},
					{ "sTitle":"排序","sWidth": "50px", "sClass": "text-center","mDataProp": "sort"},
					{ "sTitle":"操作","sWidth": "180px", "sClass": "text-center","mDataProp": "id"}
	           ];
    
	 $('#datatable-themeDetailAward').dataTable({     
	 	"aaSorting" : [ [ 3, 'desc' ] ],
		"iDisplayLength" : 20,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ],
			[ 10, 20, 30, "All" ] ],
			"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		"sAjaxSource" : sAjaxSource, 
	    "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
	     	$('td:eq(0)', nRow).html(rownum);
	     	
	     	var setThemeDetailAwardHref='<a href="javascript:setThemeDetailAwardEditForm('+ aaData.id + ','+themeid + ');">编辑</a>';
	     	var deleteThemeDetailAwardHref='<a href="javascript:deleteThemeDetail('+ aaData.id + ','+aaData.parentid + ','+themeid + ');">删除</a>';

	     	
	     	// 操作
			var optionHtml = '<div class="btn-group btn-group-xs">'+setThemeDetailAwardHref+'&nbsp;&nbsp;'+deleteThemeDetailAwardHref+'</div>';
			$('td:eq(5)', nRow).html(optionHtml);
	     
			rownum=rownum+1;
			return nRow;
		}, 
	     "aoColumns":aoColumns
	 });
}



/**
 * 活动主题内容　运营动作
 */
function generate_table_theme_children(themeParentid){
	 var rownum = 1;

    /* Initialize Datatables */
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd_themeChildren?themeParentid="+themeParentid;
    var aoColumns= [
					{ "sTitle":"序号","sWidth": "50px", "sClass": "text-center","mDataProp": "id"},
					{ "sTitle":"标题","sWidth": "150px", "sClass": "text-center","mDataProp": "title"},
					{ "sTitle":"关键字代码","sWidth": "90px", "sClass": "text-center","mDataProp": "id"},
					{ "sTitle":"发布者","sWidth": "100px", "sClass": "text-center","mDataProp": "publisher"},
					{ "sTitle":"发布时间","sWidth": "100px", "sClass": "text-center","mDataProp": "publishdate"},
					{ "sTitle":"操作","sWidth": "150px", "sClass": "text-center","mDataProp": "id"}
	           ];
    
	 $('#datatable-theme_children').dataTable({     
	 	"aaSorting" : [ [ 3, 'desc' ] ],
		"iDisplayLength" : 20,
		"aLengthMenu" : [ [ 10, 20, 30, -1 ],
			[ 10, 20, 30, "All" ] ],
			"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"bSort" : false,
		"sAjaxSource" : sAjaxSource, 
	    "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
	     	$('td:eq(0)', nRow).html(rownum);
	     
	     	// 运营动作
			var sendMsgHtml = '<div class="btn-group btn-group-xs"><a href="javascript:ajax_updateChildTheme(' +aaData.id + ');">编辑</a>&nbsp;&nbsp<a href="javascript:ajax_sendThemeMsg('
					+ aaData.parentid + ','+aaData.id + ','+aaData.appid+',1);">推送老师</a>&nbsp;&nbsp<a href="javascript:ajax_sendThemeMsg('
					+ aaData.parentid + ','+aaData.id + ','+aaData.appid+',2);">推送家长</a></div>';
			$('td:eq(5)', nRow).html(sendMsgHtml);
	     	
			rownum=rownum+1;
			return nRow;
		}, 
	     "aoColumns":aoColumns
	 });
}

/**
 * 查询查询下属运营相关活动的相关内容.
 */
function ajax_updateChildTheme(themeid){
	var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd_theme/"+themeid;
	$.get(sAjaxSource, {}, function(data) {
		var datas = eval("(" + data + ")");
		$("#themeChildForm_parentid").val(datas.parentid);
		$("#themeChildForm_themeid").val(themeid);
		$("#themeChildForm_title").val(datas.title);
		$("#themeChildForm_appid").val(datas.appid);
		$("#themeChildForm_content").val(datas.content);
		$("#themeChildForm_starttime").val(datas.starttime);
		$("#themeChildForm_endtime").val(datas.endtime);
	});
	$("#child_theme_update").show();
}

function closeChildThemeUpdate(){
	$("#child_theme_update").hide();
	$("#themeChildForm_parentid").val('');
	$("#themeChildForm_themeid").val('');
	$("#themeChildForm_title").val('');
	$("#themeChildForm_appid").val('');
	$("#themeChildForm_content").val('');
	$("#themeChildForm_starttime").val('');
	$("#themeChildForm_endtime").val('');
}
/**
 * 保存活动子项信息.
 */
function ajaxSaveChildTheme(){
	var parentid = $("#themeChildForm_parentid").val();
	var themeid= $("#themeChildForm_themeid").val();
	var title = $("#themeChildForm_title").val();
	var appid = $("#themeChildForm_appid").val();
	var content = $("#themeChildForm_content").val();
	var starttime = $("#themeChildForm_starttime").val();
	var endtime = $("#themeChildForm_endtime").val();
	var userid= $("main_userid").val();
	var param = {
			parentid: parentid,
			themeid:themeid,
			title: title,
			appid:appid,
			content:content,
			starttime:starttime,
			endtime:endtime,
			userid:userid
		}
		var submitData = {
			api: "6070021",
			param: JSON.stringify(param)
		};
		$.ajax({
			cache: false,
			type: "POST",
			async:false,
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas) {
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code === "200") {
					PromptBox.alert("保存成功!");
					generate_table_theme_children(parentid);
					closeChildThemeUpdate();
				} else {
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
}

function ajaxAddChildTheme(){
	$("#child_theme_update").show();
	$("#themeChildForm_themeid").val('');
	$("#themeChildForm_title").val('');
	$("#themeChildForm_appid").val('');
	$("#themeChildForm_content").val('');
	$("#themeChildForm_starttime").val('');
	$("#themeChildForm_endtime").val('');
}

function closeThemeChildrenModel(){
	closeChildThemeUpdate();
	$("#themeChildrenModel").modal("hide");
}

/**
 * 通过活动主题，查询下属运营相关活动
 * @param themeid
 */
function openThemeChildrenModel(themeid) {
	$("#themeChildrenModel").modal("show");
	$("#themeChildForm_parentid").val(themeid);
	generate_table_theme_children(themeid);
}

/**
 * 打开编辑活动主题模态窗口
 * @param themeid
 */
function openThemeEditModel(themeid) {
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_query_ghhd_theme/"+themeid;

	$.get(sAjaxSource, {}, function(data) {
		var datas = eval("(" + data + ")");
		$("#themeForm_id").val(themeid);
		$("#themeForm_title").val(datas.title);
		$("#themeForm_content").val(datas.content);
		$("#uploadImg").attr("src", datas.picpath);
		$("#themeForm_picpath").val(datas.picpath);
		$("#themeForm_hdurl").val(datas.hdurl);
		$("#themeForm_keyword").val(datas.keyword);
		$("#themeForm_parentid").val(datas.parentid);
		$('#themeForm_voterule').find(
				"option[value='" + datas.voterule + "']").attr("selected",
				true);
		$('#themeForm_voterule').trigger("chosen:updated");
		$("#themeForm_votelimit").val(datas.votelimit);
		$("#themeForm_applybtnname").val(datas.applybtnname);
		
		$("#themeForm_starttime").val(datas.starttime);
		$("#themeForm_endtime").val(datas.endtime);
		$("#themeForm_serialnumber").val(datas.serialnumber);
		
		$('#themeForm_pepolerange').find(
				"option[value='" + datas.pepolerange + "']").attr("selected",
				true);
		$('#themeForm_pepolerange').trigger("chosen:updated");
		
		$('#themeForm_activitytype').find(
				"option[value='" + datas.activitytype + "']").attr("selected",
				true);		
		$('#themeForm_activitytype').trigger("chosen:updated");
		
		$('#themeForm_Comment_open').find(
				"option[value='" + datas.commentopen + "']").attr("selected",
				true);
		$('#themeForm_Comment_open').trigger("chosen:updated");
		$("#themeForm_drainagelink").val(datas.drainagelink);
		$("#themeForm_sponsorlink").val(datas.sponsorlink);
		$("#themeForm_applysuccessbtnname").val(datas.applysuccessbtnname);
		$("#themeModel").modal("show");
	});

}
/**
 * 打开新增活动主题模态窗口
 */
function openThemeAddModel() {
	$("#themeForm_id").val('');
	$("#themeForm_title").val('');
	$("#themeForm_content").val('');
	$("#uploadImg").attr("src", '');
	$("#themeForm_picpath").val('');
	$("#themeForm_hdurl").val('');
	$("#themeForm_keyword").val('');
	$("#themeForm_parentid").val('');
	$('#themeForm_voterule').get(0).selectedIndex=0;
	$("#themeForm_votelimit").val('');
	$("#themeForm_applybtnname").val('');
	
	$("#themeForm_starttime").val('');
	$("#themeForm_endtime").val('');
	$("#themeForm_serialnumber").val('');
	$('#themeForm_pepolerange').get(0).selectedIndex=0;
	$('#themeForm_activitytype').get(0).selectedIndex=0;
	$("#themeForm_drainagelink").val('');
	$("#themeForm_sponsorlink").val('');
	$("#themeForm_applysuccessbtnname").val('');
	$("#themeModel").modal("show");
}
/**
 * 获取代理商列表
 */
function getDlsList(){
	var msg = "没有选项！";
	var param = {
		campusid: $("#main_campusid").val(),
		userid: $("#main_userid").val()
	}
	var submitData = {
		api: "6070016",
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				createDlsList(result.data.dlslist,msg,"#dls_list");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
function loadCityList(){
	var citys = "";
	$("#dls_list").find("option:selected").each(function(){
		var city = $(this).attr("citys");
		citys = citys + city + ",";
	});
	if(citys && citys.length>0){
		citys = citys.substring(0,citys.length-1);
	}
	getCityList(citys);
}

function loadCampusList(){
	var citys = "";
	var dlsids = "";
	$("#dls_list").find("option:selected").each(function(){
		var dlsid = $(this).val();
		dlsids = dlsids + dlsid + ",";
	});
	if(dlsids && dlsids.length>0){
		dlsids = dlsids.substring(0,dlsids.length-1);
	}
	$("#city_list").find("option:selected").each(function(){
		var city = $(this).val();
		citys = citys + city + ",";
	});
	if(citys && citys.length>0){
		citys = citys.substring(0,citys.length-1);
	}
	getCampusList(dlsids,citys);
}

/**
 * 获取城市列表
 */
function getCampusList(dlsids,citys){
	var msg = "没有学校！";
	var param = {
		campusid: $("#main_campusid").val(),
		dlsids:dlsids,
		citys:citys,
		userid: $("#main_userid").val()
	}
	var submitData = {
		api: "6070018",
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				createCampusList(result.data.campusList,msg,"#campus_list");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
function createCampusList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].campusid+'">'+dataData[i].campusname+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		multiselect(node);
	}
	$(node).multiselect("refresh");
}
/**
 * 获取城市列表
 */
function getCityList(citys){
	var msg = "没有城市！";
	var param = {
		campusid: $("#main_campusid").val(),
		citys:citys,
		userid: $("#main_userid").val()
	}
	var submitData = {
		api: "6070017",
		param: JSON.stringify(param)
	};
	$.ajax({
		cache: false,
		type: "POST",
		async:false,
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas) {
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code === "200") {
				createCityList(result.data.citylist,msg,"#city_list");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

/**
 * 创建代理商选项
 * @param dataData
 * @param msg
 * @param node
 */
function createCityList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].citycode+'">'+dataData[i].cityname+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		multiselect(node);
	}
	$(node).multiselect("refresh");
}
/**
 * 创建代理商选项
 * @param dataData
 * @param msg
 * @param node
 */
function createDlsList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].dlsid+'" citys="'+dataData[i].dlscity+'">'+dataData[i].dlsname+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		multiselect(node);
	}
	$(node).multiselect("refresh");
}

/**
 * 多选渲染
 */
function multiselect(node){
	var multiselectnode = $(node);
	for (var i = 0; i < multiselectnode.length; i++) {
		multiselectnode.eq(i).multiselect({
			selectedList : 2
		});
	}
}

function showCampusList(){
	var schoolHtml = '';
	var campusids = "";//themeCapusids
	$("#campus_list").find("option:selected").each(function(){
		var school = $(this).text();
		var campusid = $(this).val();
		schoolHtml = schoolHtml + '<li>'+school+'</li>';
		campusids = campusids + campusid +",";
	});
	if(campusids && campusids.length>0){
		campusids = campusids.substring(0,campusids.length);
	}
	$("#themeCapusids").val(campusids);
	$("#showCampusList").find('ul').html(schoolHtml);
	$("#showCampusList").find('li').css({"float":"left","margin-left":"20px",
		"list-style":"none","background-color":"#7abce7",
		"margin-top":"5px","border-radius":"5px","color":"white","padding":"5px 10px"});
}

/**
 * 保存活动主题内容
 */
function saveTheme() {
    var sAjaxSource=ctx+"/xtgl/ghhd/ajax_save_ghhd_theme";
    var title=$("#themeForm_title").val();
    var votelimit=$("#themeForm_votelimit").val();
    var content=$("#themeForm_content").val();
    var picpath=$("#themeForm_picpath").val();
    var activitytype=$("#themeForm_activitytype").val();
    var drainagelink=$("#themeForm_drainagelink").val();
    var sponsorlink=$("#themeForm_sponsorlink").val();
    var applysuccessbtnname=$("#themeForm_applysuccessbtnname").val();
    var commentopen=$("#themeForm_Comment_open").val();
    if(!title){
    	PromptBox.alert("请填写标题");
    	return ;
    }
    if(!content){
    	PromptBox.alert("请填写内容");
    	return ;
    }
    if(!picpath){
    	PromptBox.alert("请上传活动封面图片");
    	return ;
    }
    if($("#themeForm_voterule").val()!=99 &&(!votelimit || isNaN(votelimit))){
    	PromptBox.alert("请填写投票数量");
    	return ;
    }
    if(!applysuccessbtnname){
    	PromptBox.alert("请填写活动按钮成功名称");
    	return ;
    }
    var parentid=$("#themeForm_parentid").val();
    if(parentid==null || parentid==""){
    	parentid=0;
    }
    var submitData = {
			id : $("#themeForm_id").val(),
			title :title,
			content : content,
			picpath : picpath,
			hdurl : $("#themeForm_hdurl").val(),
			keyword:$("#themeForm_keyword").val(),
			parentid:parentid,
			voterule:$("#themeForm_voterule").val(),
			votelimit:votelimit,
			applybtnname:$("#themeForm_applybtnname").val(),
			pepolerange:$("#themeForm_pepolerange").val(),
    		starttime:$("#themeForm_starttime").val(),
    		endtime:$("#themeForm_endtime").val(),
    		serialnumber:$("#themeForm_serialnumber").val(),
    		activitytype:activitytype,
    		drainagelink:drainagelink,
    		sponsorlink:sponsorlink,
    		applysuccessbtnname:applysuccessbtnname,
    		commentopen:commentopen
    };
	$.post(sAjaxSource, submitData, function(data) {
		var datas = eval("(" + data + ")");
		if(datas==true){
			generate_table_theme();
			$("#themeModel").modal("hide");
		}
		
	});

}

/**
 * 推送主题活动给家长
 * @param appid
 */
function ajax_sendThemeMsg(parentThemeid,themeid,appid,usertype){
	if (confirm("确认发送?")) {
		var url = ctx + "/xtgl/ghhd/ajax_sendThemeMsg";
		var submitData = {
				parentThemeid:parentThemeid,
				themeid:themeid,
				appid:appid,
				usertype:usertype
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("发送成功!");
			} else {
				alert(data);
			}

			return false;
		});
	}
}