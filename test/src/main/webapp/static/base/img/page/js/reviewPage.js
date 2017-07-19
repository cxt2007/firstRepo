var ctx="";
var editor;
var wlzyeditor;

var reviewTable = function() {
    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();


$(document).ready(function() {
	generate_table_yqdt();
	
	
	$('#yqdt_campus_chosen').change(function() {
		generate_table_yqdt();
	});
	
	$('#yqdt_bjid_chosen').change(function() {
		getSerchFormBjsjList();
		generate_table_yqdt();
	});
	
	$('#yqdt_bjid_chosen').change(function() {
		yqdt_type_chosen();
	});
	
	$('#yqdt_type_chosen').change(function() {
		var yqdtType = $("#yqdt_type_chosen").val();
		if(yqdtType == 4){
			$("#yqdt_bjid_div").css("display","block");
		}else{
			$("#yqdt_bjid_div").css("display","none");
		}
		generate_table_yqdt();
	});
	
	$("#yqdt_state_chosen").change(function(){
		generate_table_yqdt();
	});
	
	
	$('#yqdtQueryBtn').click(function() {
		generate_table_yqdt();
	});
	
	$("#send_Yqdt_Submit").click(function() {
		btnClick(2);
	});
	
	
//	generate_tz_table();
//	
//	$("#tzQueryBtn").click(function() {
//		generate_tz_table();
//	});
//	
//	//通知正式发布
//	$("#ajaxSaveTzZs").click(function() {
//		saveTz(2);
//	});
//	
//	$('#tz-type-chosen').change(function() {
//		var tzType = $("#tz-type-chosen").val();
//		if(tzType == 2){
//			$("#tz_bjid_div").css("display","block");
//		}else{
//			$("#tz_bjid_div").css("display","none");
//		}
//	});
	
	
	// 快乐学习
	generate_table();
	
	$("#wlzy-camups-chosen").change(function() {
		getSerchWlzyBjsjList();
	});
	
	$("#wlzy-bjid-chosen").change(function() {
		generate_table();
	});
	
	$("#wlzy-type-chosen").change(function() {
		generate_table();
	});
	
	$("#wlzy-state-chosen").change(function() {
		generate_table();
	});
	
	$("#school-chosen-add").change(function() {
		getBjsjByCampusid();
	});
	
	$("#sendWlzySubmit").click(function() {
		validateForm(2);
	});
	
});

function generate_table_yqdt(){
	App.datatables();
	var yqdtType = $("#yqdt_type_chosen").val();
	var bjid = "";
	if(yqdtType == 4){
		bjid = $("#yqdt_bjid_div").val();
	}
	var sAjaxSource=ctx+"/audit/ajax_query_yqdt/"+yqdtType;
	var param = "campusid="+$("#yqdt_campus_chosen").val();
    param=param+"&bjid="+bjid;
    param=param+"&state="+$("#yqdt_state_chosen").val();
    param=param+"&title="+$("#yqdt_title").val();
    
    sAjaxSource=sAjaxSource+"?"+param;
    
    var columns;
    
    if(yqdtType == 4){
   	 columns = [
   				{"sTitle": "序号","mDataProp": "rowno","sClass": "text-center"},
   	            {"sTitle": "班级","mDataProp": "bjmc","sClass": "text-center"},
   	            {"sTitle": "标题","mDataProp": "title","sClass": "text-center"},
   	            {"sTitle": "发布人","mDataProp": "publisher","sClass": "text-center"},
   	            {"sTitle": "发布日期","mDataProp": "publishdate","sClass": "text-center"}
   	       ];
    }else{
   	 columns = [
//   				{"sTitle": "序号","mDataProp": "rowno","sClass": "text-center"},
   	            {"sTitle": "标题","mDataProp": "title","sClass": "text-center"},
   	            {"sTitle": "发布人","mDataProp": "publisher","sClass": "text-center"},
   	            {"sTitle": "发布日期","mDataProp": "publishdate","sClass": "text-center"},
   	            {"sTitle": "审核状态","mDataProp": "edit","sClass": "text-center"}
   	       ];
    }
    $('#yqdt_datatable').dataTable({
        "iDisplayLength": 50,
        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
        "bFilter": false,
        "bLengthChange": false,
        "bDestroy":true,
        "sAjaxSource": sAjaxSource,
        "aoColumns": columns,
        "bAutoWidth":false,
        "bServerSide" : true,// 服务器端必须设置为true
        "fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			if(aaData.state==2){
				$('td:eq(3)', nRow).html("已审核");
			}
		},
    });
}

function getSerchFormBjsjList(){
	
	var url=ctx+"/base/findBjsjByCampusid";
	var submitData = {
		campusid: $("#yqdt_campus_chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#yqdt_bjid_chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#yqdt_bjid_chosen").append("<option value=" + datas[i][0]+" >"
	        			+ datas[i][1] + "</option>");
	        };
	        $("#yqdt_bjid_chosen").find("option[index='0']").attr("selected",'selected');
	        $("#yqdt_bjid_chosen").trigger("chosen:updated");
    });
}	

KindEditor.ready(function(K) {
	var folder="yqdt";
	editor = K.create('textarea[name="jtnr"]', {
		cssPath : ctx+'/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx+'/filehandel/kindEditorUpload/'+folder+'/image',
		fileManagerJson : ctx+'/filehandel/kindEditorFileManager',
		allowFileManager : true,
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
		},
		afterBlur: function(){
			this.sync();
		}
	});
});

function toEdit(num){
	var yqdtType = $("#yqdt_type_chosen").val();
	if(yqdtType == "3"){
		$("#school-chosen-add1").parent().parent().css("display","block");
		$("#school-chosen-add").parent().parent().css("display","none");
	}
	
	$('#addOrEdit').html("审核"+$("#yqdt_type_chosen").find("option:selected").text());
	var url=ctx+"/yqdt/yqdt/ajax_edit_news";
	var submitData = {
			id	: num
	}; 
	
	$.post(url,
		submitData,
     	function(data){
		var datas = eval("(" + data + ")");
		$('#info-id').val(datas.id);
		$('#title-add').val(datas.title);
		$('#createtime').val(datas.publishdate);

		$('#school-chosen-add1').find("option[value='"+datas.campusid+"']").attr("selected",true);
		$('#school-chosen-add1').trigger("chosen:updated");

//		editor.html(datas.jtnr);
//		$('#jtnr').val(datas.jtnr);
		editor.html(datas.jtnr);
		$('#jtnr').val(datas.jtnr);
		
		$('#modal-addconfig').modal('show');
		
		if(datas.state=="2"){
			$('#send_Yqdt_Submit').hide();
		}else{
			$('#send_Yqdt_Submit').show();
		}
		if (yqdtType == "2" || yqdtType == "3" || yqdtType == "7") {
			$("#ifpushDiv").show();
		}else{
			$("#ifpushDiv").hide();
		}
		
		if (yqdtType == "3" && $("orgcode").val()=="10010") {
			$("#synchroDiv").show();
		}else{
			$("#synchroDiv").hide();
		}
		
   		return false;
    });
}

function btnClick(state) {
	var yqdtType = $("#yqdt_type_chosen").val();
	var info = $("#info-id").val();
	var title = $("#title-add").val().replace(/\t/g,"");
	var ifpush = 0;
	var synchro = $("#synchro").val();
	var campusid = "";
	if(info == "" && yqdtType == "3" && $("#school-chosen-add") != null){
		if($("#school-chosen-add").val() != null){
			campusid = $("#school-chosen-add").val().toString();
		}
	}else{
		campusid = $("#school-chosen-add1").val().toString();
	}
	if($("#title-add").val() == "" || $("#title-add").val() == null){
		return;
	}else if(campusid == "" || campusid == null){
		alert("校区必选！");
		return;
	}else if(yqdtType == 4 && ($("#bj-chosen-add").val() == "" || $("#bj-chosen-add").val() == null)){
		alert("班级必选！");
		return;
	}
	if(confirm("是否确定继续操作?")){
		var bjid = "";
		var bjmc = "";
		var guidetype = "";
		var receiver = "";
		var orgcodes = "";
		if(yqdtType == "4"){
			bjid = $("#bj-chosen-add").val();
			bjmc = $("#bj-chosen-add").find("option:selected").text();
		}
		
		if ((yqdtType == "2" || yqdtType == "3" || yqdtType == "7") && $("#ifpush").prop("checked")) {
			ifpush = $("#ifpush").val();
		}
		
		var url=ctx+"/yqdt/yqdt/ajax_add_news/"+yqdtType;
		var submitData = {
			id			: $("#info-id").val(),
			title		: title,
			campusid	: campusid,
			publishdate	: $("#createtime").val(),
			jtnr		: $("#jtnr").val(),
			state		: state,
			bjid		: bjid,
			bjmc		: bjmc,
			ifpush		: ifpush,
			appid		: $("#appid").val(),
			synchro		: synchro,
			guidetype	: guidetype,
			receiver	: receiver,
			orgcodes	: orgcodes
		}; 
		
		$('#send_Yqdt_Submit').attr('disabled','disabled');
		$.post(url,
			submitData,
	      	function(data){
			
				$('#send_Yqdt_Submit').removeAttr('disabled');
				$('#modal-addconfig').modal('hide');
				generate_table_yqdt();
	    		return false;
	      });
		return false;
	}else 
		return false;
}


//function generate_tz_table(){
//	var tztype = $('#tz-type-chosen').val();
//	var rownum=1;
//	App.datatables();
//    /* Initialize Datatables */
//	var sAjaxSource=ctx+"/jyhd/tz/ajax_query_xxtz";
//    var param = "tzType="+tztype;
//    param=param+"&tzState="+$("#tz-state-chosen").val();
//    param=param+"&campusid="+$("#tz-camups-chosen").val();
//    param=param+"&title="+$("#tz-title").val();
//    param=param+"&bjids="+$("#tz-bjid-chosen").val();
//    
//    sAjaxSource=sAjaxSource+"?"+param;//调用后台携带参数路径
//    
//    var aoColumns= [];
//    var aaSorting = [[4,'desc']];
//    if(tztype==2){
//    	aoColumns=[
//    				{"sTitle":"序号","sWidth": "70px", "sClass": "text-center","mDataProp": "id"},
//    	            {"sTitle":"标题","sWidth": "150px", "mDataProp": "title"},
//    	            {"sTitle":"班级","sWidth": "150px", "sClass": "text-center","mDataProp": "bjid_ch"},
//    	            {"sTitle":"发布人","sWidth": "150px", "sClass": "text-center","mDataProp": "publisher"},
//    	            {"sTitle":"发布时间","sWidth": "150px", "sClass": "text-center","mDataProp": "publishdate"}
//    	       ];
//    }else{
//    	aoColumns=[
//			{"sTitle":"序号","sWidth": "70px", "sClass": "text-center","mDataProp": "id"},
//			{"sTitle":"标题","sWidth": "150px", "mDataProp": "title"},
//			{"sTitle":"发布人","sWidth": "150px", "sClass": "text-center","mDataProp": "publisher"},
//			{"sTitle":"发布时间","sWidth": "150px", "sClass": "text-center","mDataProp": "publishdate"}   
//       ];
//    }
//    
//    $('#tz-datatable').dataTable({
//    	"aaSorting":aaSorting,
//        "iDisplayLength": 50,
//        "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
//        "bFilter": false,
//        "bLengthChange": false,
//        "bDestroy":true,
//        "bAutoWidth":false,
//        "bSort":false,
//        "sAjaxSource": sAjaxSource,
//        "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
//        	$('td:eq(0)', nRow).html(rownum);
// 			
// 			var tzEditHtml='<a href="javascript:openTzEditModel(\''+aaData.id+'\');">'+aaData.title+'</a>';
// 			$('td:eq(1)', nRow).html(tzEditHtml);
// 			
// 			if(aaData.state==1){
// 				if(aaData.tztype==2){
// 	 				$('td:eq(4)', nRow).html("<span style='color:red'>未发布</span>");
// 	 			}else{
// 	 				$('td:eq(3)', nRow).html("<span style='color:red'>未发布</span>");
// 	 			}
// 			}
//			rownum=rownum+1;
//			return nRow;
//		}, 
//        "aoColumns":aoColumns
//    });
//}


function openTzEditModel(tzid){
	var tztype = $('#tz-type-chosen').val();
	var url=ctx+"/jyhd/tz/ajax_getTzForm/"+tzid;
	$("#btnAuth_span").css("display","block");
	$.get(url,
		{},
      	function(data){
			var datas=eval("("+data+")");
			$("#tzForm_id").val(tzid);
			$("#tzForm_title").val(datas.title);
			$("#tzForm_content").val(datas.content);
			$("#tzForm_tztype").val(datas.tztype);
			
			$("#tzForm_camupsid option[value='"+datas.campusid+"']").attr("selected","selected");
			$("#tzForm_camupsid").trigger("chosen:updated");
			//$("#tzForm_camupsid").trigger('change');
			//设置班级列表select选中
			getFormBjsjList(datas.bjids); 
			if(tztype==1 || tztype==2){
				if(datas.tzfl==undefined || datas.tzfl==null || datas.tzfl==""){
					$("#tzForm_tzlx option").eq(0).attr("selected",true);
				}else{
					$("#tzForm_tzlx option[value='"+datas.tzfl+"']").attr("selected","selected");

				}
				$("#tzForm_tzlx").trigger("chosen:updated");
				
				$("#tzlx_div").css("display","block");
				$("#tz_edit_bj_div").css("display","block");
			}else{
				$("#tzlx_div").css("display","none");
				$("#tz_edit_bj_div").css("display","none");
			}
			
			if(tztype==2){
				//如果时班级通知加载学生数据
				getFormXsjbList(datas.stuids,datas.bjids);
				$("#tz_stu_div").css("display","block");
			}else {
				$("#tz_stu_div").css("display","none");
			}
			if(datas.state==2){
				$("#btnAuth_span").css("display","none");
			}
			
			//$("tzForm_bjids").val(datas.bjids);
			$("#tzModel").modal("show");
	        $("#tzForm_bjids").multiselect('refresh');
    });
}

function getFormBjsjList(bjids){
	var url=ctx+"/base/findBjJsonByCampusid";
	var submitData = {
		campusid: $("#tzForm_camupsid").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#tzForm_bjids option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	var selectState = '';
	        	if(bjids!=null && bjids!=''){
	        		var arr = eval('['+bjids+']'); ;
	        		var index = $.inArray(datas[i].id,arr);
					if(index!='-1'){
						selectState='selected';
					}
	        	}
	        	$("#tzForm_bjids").append("<option value=" + datas[i].id + " "+selectState+" >"
	        			+ datas[i].bj + "</option>");
	        	selectState = '';
	        };
	        $("#tzForm_bjids").multiselect('refresh');
    });
}


function getFormXsjbList(stuids,bjids){
	var url=ctx+"/base/findXsjbJsonByBjids";
	
	var submitData = {
		bjids: bjids.toString()
	}; 
	$.get(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#tzForm_stuids option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	var selectState = '';
	        	if(stuids!=null && stuids!=''){
	        		var arr = eval('['+stuids+']'); ;
	        		var index = $.inArray(datas[i].id,arr);
					if(index!='-1'){
						selectState='selected';
					}
	        	}
	        	$("#tzForm_stuids").append("<option value=" + datas[i].id + " "+selectState+" >"
	        			+ datas[i].bjid_ch+"-"+  datas[i].xm+ "</option>");
	        	selectState = '';
	        };
	        $("#tzForm_stuids").multiselect('refresh');
    });
}

function getFormTeacherList(teacherid){
	var url=ctx+"/jyhd/tz/findTeachersJsonByBjids";
	var submitData = {
		campusids: $("#tzForm_camupsid").val().toString()
	}; 
	$.get(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#tzForm_teacherids option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	var selectState = '';
	        	if(teacherid!=null && teacherid!=''){
	        		var arr = eval('['+teacherid+']'); ;
	        		var index = $.inArray(datas[i].id,arr);
					if(index!='-1'){
						selectState='selected';
					}
	        	}
	        	$("#tzForm_teacherids").append("<option value=" + datas[i].id + " "+selectState+" >"
	        			+ datas[i].name+ "</option>");
	        	selectState = '';
	        };
	        $("#tzForm_teacherids").multiselect('refresh');
    });
}

//function saveTz(state){
//	var tztype = $('#tz-type-chosen').val();
//	
//	var campusid = $("#tzForm_camupsid").val();
//	var bjids ="";
//	if(campusid == "" || campusid == null){
//		alert("校区必选！");
//		return;
//	}
//	if(tztype==1){
//		bjids=$("#tzForm_bjids").val();
//		if(bjids == "" || bjids == null){
//			alert("班级必选！");
//			return;
//		};
//	}else if(tztype==2){
//		bjids=$("#tzForm_bjids").val();
//		if(bjids == "" || bjids == null){
//			alert("班级必选！");
//			return;
//		};
//		if($("#tzForm_stuids").val() == "" || $("#tzForm_stuids").val() == null){
//			alert("学生必选！");
//			return;
//		};
//	}else if(tztype==4){
//		if($("#tzForm_teacherids").val() == "" || $("#tzForm_teacherids").val() == null){
//			alert("老师必选！");
//			return;
//		};
//	}
//	
//	if(confirm("是否确定审核通过?")){
//		var url=ctx+"/jyhd/tz/ajax_save";
//		var submitData={};
//		if(tztype==2){
//			submitData = {
//					id:$("#tzForm_id").val(),
//					title:$("#tzForm_title").val(),
//					content:$("#tzForm_title").val(),
//					campusid:campusid,
//					bjids:$("#tzForm_bjids").val().toString(),
//					stuids:$("#tzForm_stuids").val().toString(),
//					state:2,
//					tztype:tztype,
//					tzfl:$("#tzForm_tzlx").val()
//				}; 
//		}else if (tztype==4){
//			submitData = {
//				id:$("#tzForm_id").val(),
//				title:$("#tzForm_title").val(),
//				content:$("#tzForm_title").val(),
//				campusid: $("#tzForm_camupsid").val(),
//				teacherids:$("#tzForm_teacherids").val().toString(),
//				state:2,
//				tztype:tztype
//			}; 
//		}else{
//			submitData = {
//					id:$("#tzForm_id").val(),
//					title:$("#tzForm_title").val(),
//					content:$("#tzForm_title").val(),
//					campusid: $("#tzForm_camupsid").val(),
//					bjids:$("#tzForm_bjids").val().toString(),
//					state:2,
//					tztype:tztype,
//					tzfl:$("#tzForm_tzlx").val()
//				}; 
//		}
//		 
//		$.post(url,
//				submitData,
//		      	function(data){
//					generate_tz_table();
//			       $("#tzModel").modal("hide");
//		 });
//		
//		 return false;
//	}else{
//		return false;
//	} 
//}

/**
 * 快乐学习
 */

var state = 0;

function getSerchWlzyBjsjList(){
	var url=ctx+"/base/findBjsjByCampusid";
	var submitData = {
		campusid: $("#wlzy-camups-chosen").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#wlzy-bjid-chosen option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	
	        	$("#wlzy-bjid-chosen").append("<option value=" + datas[i][0]+" >"
	        			+ datas[i][1] + "</option>");
	        };
	        $("#wlzy-bjid-chosen").find("option[index='0']").attr("selected",'selected');
	        $("#wlzy-bjid-chosen").trigger("chosen:updated");
	        
	        generate_table();
    });
}

function getBjsjByCampusid(){
	var url=ctx+"/xtgl/bjsj/findBjsjByCampusId";
	var submitData = {
		search_LIKE_campusid: $("#school-chosen-add").val()
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#bj-chosen-wlzy-add option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	$("#bj-chosen-wlzy-add").append("<option value=" + datas[i].id+" >"
	        			+ datas[i].bj + "</option>");
	        };
	        $("#bj-chosen-wlzy-add").find("option[index='0']").attr("selected",'selected');
	        $("#bj-chosen-wlzy-add").trigger("chosen:updated");
    });
}	


KindEditor.ready(function(K) {
	var folder="wlzy";
	wlzyeditor = K.create('textarea[name="content"]', {
		cssPath : ctx+'/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx+'/filehandel/kindEditorUpload/'+folder+'/image',
		fileManagerJson : ctx+'/filehandel/kindEditorFileManager',
		allowFileManager : true,
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['addwlzy-form'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['addwlzy-form'].submit();
			});
		},
		afterBlur: function(){
			this.sync();
		}
	});
});

function toWlzyEdit(num){
	var url=ctx+"/resource/ajax_update";
	var submitData = {
			id	: num
	}; 
	$.post(url,
		submitData,
     	function(data){
		var datas = eval("(" + data + ")");
		$('#id').val(datas.id);
		$('#publisher').val(datas.publisher);
		$('#publishdate').val(datas.publishdate);
		$('#publisherid').val(datas.publisherid);
		$('#title').val(datas.title);
		$('#shnl').val(datas.shnl);
		
		$('#school-chosen-add').find("option[value='"+datas.campusid+"']").attr("selected",true);
		$('#school-chosen-add').trigger("chosen:updated");
		
		getBjsjInfoByCampusid(datas.campusid,datas.bjid);
		
//		$('#wlzy-type-add').find("option[value='"+datas.wlzytype+"']").attr("selected",true);
//		$('#wlzy-type-add').trigger("chosen:updated");
		wlzyeditor.html(datas.content);
		$('#content').val(datas.content);
		$("#examineX").html($("#wlzy-type-chosen").find("option:selected").text());
		$('#modal-addwlzy').modal('show');
   		return false;
    });
}

function getBjsjInfoByCampusid(_campusid,_bjid){
	var url=ctx+"/xtgl/bjsj/findBjsjByCampusId";
	var submitData = {
		search_LIKE_campusid: _campusid
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#bj-chosen-wlzy-add option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	$("#bj-chosen-wlzy-add").append("<option value=" + datas[i].id+" >"
	        			+ datas[i].bj + "</option>");
	        };
			$('#bj-chosen-wlzy-add').find("option[value='"+_bjid+"']").attr("selected",true);
			$("#bj-chosen-wlzy-add").trigger("chosen:updated");
    });
}	

function generate_table(){
	 App.datatables();
	 var sAjaxSource=ctx+"/audit/ajax_query_wlzy?search_campusid=" + $("#wlzy-camups-chosen").val()
																		 	+ "&search_bjid="+$("#wlzy-bjid-chosen").val()
																		 	+ "&search_wlzytype="+$("#wlzy-type-chosen").val()
																		 	+ "&search_state="+$("#wlzy-state-chosen").val()
	 																		+ "&search_title="+$("#wlzy-title").val();
	 
	 var columns = [
//				{"sTitle": "序号","mDataProp": "rowno","sClass": "text-center"},
	            {"sTitle": "标题","mDataProp": "wlzyTitle","sClass": "text-center"},
	            {"sTitle": "班级","mDataProp": "bjid_ch","sClass": "text-center"},
//	            {"sTitle": "适合年龄","mDataProp": "shnl","sClass": "text-center"},
	            {"sTitle": "发布人","mDataProp": "publisher","sClass": "text-center"},
	            {"sTitle": "发布日期","mDataProp": "publishdate","sClass": "text-center"},
	            {"sTitle": "审核状态","mDataProp": "edit","sClass": "text-center"}
	       ];
     $('#klxx-datatable').dataTable({
         "iDisplayLength": 30,
         "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
         "bFilter": false,
         "bLengthChange": false,
         "bDestroy":true,
         "bSort":false,
         "sAjaxSource": sAjaxSource,
         "aoColumns": columns,
         "bAutoWidth":false,
         "bServerSide" : true,// 服务器端必须设置为true
         "fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
 			if(aaData.state==2){
 				$('td:eq(4)', nRow).html("已审核");
 			}
 		},
     });
     
}

function validateForm(_state){
	state = _state;
	$('#addwlzy-form').validate({
        errorClass: 'help-block animation-slideDown', 
        errorElement: 'div',
        errorPlacement: function(error, e) {
            e.parents('.form-group > div').append(error);
        },
        highlight: function(e) {
            $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
            $(e).closest('.help-block').remove();
        },
        success: function(e) {
            e.closest('.form-group').removeClass('has-success has-error');
            e.closest('.help-block').remove();
        },
        rules: {
        	title: {
                required: true
            },
            content: {
                required: true
            },
            shnl: {
                required: true
            },
        },
        messages: {
        	title: {
                required: '请填写标题'
            },
            content: {
                required: '请填写内容'
            },
            shnl: {
                required: '请填写适合年龄描述'
            },
        },
        submitHandler:function(form){
        	if(confirm("是否确定继续操作?")){
    			var url=ctx+"/resource/ajax_save";
    			var submitData = {
    				id			: $("#id").val(),
    				publisher	: $("#publisher").val(),
    				publishdate	: $("#publishdate").val(),
    				publisherid	: $("#publisherid").val(),
    				title		: $("#title").val(),
    				campusid	: $("#school-chosen-add").val(),
    				content		: $("#content").val(),
    				wlzytype	: $("#wlzy-type-chosen").val(),
    				shnl		: $("#shnl").val(),
    				state		: state,
    				bjid		: $("#bj-chosen-wlzy-add").val(),
    				bjid_ch		: $("#bj-chosen-wlzy-add").find("option:selected").text(),
    				appid		: $("#appid").val()
    			}; 

    			$('#sendWlzySubmit').attr('disabled','disabled');
    			$.post(url,
    				submitData,
    		      	function(data){
    					$('#sendWlzySubmit').removeAttr('disabled');
    					$('#modal-addwlzy').modal('hide');
    					generate_table();
    		    		return false;
    		      });
    			return false;
    		}else 
    			return false;
        }  
    });
}

function previewInThePhone(id){
	var userid = $("#userid").val();
	var campusid = $("#yqdt_campus_chosen").val();
	var orgcode = $("#orgcode").val();
	var yqdtType = $("#yqdt_type_chosen").val();
	var appid = "";
	if(yqdtType == "2"){
		appid = "1071022";
	}else if(yqdtType == "3"){
		appid = "1071032";
	}else if(yqdtType == "7"){
		appid = "1071042";
	}else if(yqdtType == "9"){
		appid = "107116";
	}else if(yqdtType == "6"){
		appid = "207112";
	}else{
		alert("该模块不支持预览手机端页面功能！");
		return;
	}
	var url = ctx+"/mobile/loading_page?orgcode="+orgcode+"&campusid="+campusid+"&appid="+appid+"&dataid="+id+"&userid="+userid+"&preview=1";
	window.open (url,'newwindow','height=580,width=360,top=20,left=330,scrollbars=yes,location=no');
}

function wlzyPreviewInThePhone(id){
	var campusid = $("#wlzy-camups-chosen").val();
	var orgcode = $("#orgcode").val();
	var userid = $("#userid").val();
	var url = ctx+"/mobile/loading_page?orgcode="+orgcode+"&campusid="+campusid+"&appid=2071031&dataid="+id+"&preview=1&userid="+userid;
	window.open (url,'newwindow','height=580,width=360,top=20,left=330,scrollbars=yes,location=no');
}