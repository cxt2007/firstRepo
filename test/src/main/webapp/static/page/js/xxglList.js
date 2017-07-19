var ctx = $("#ctx").val();
var appid = $("#appid").val();
var currentDate = $("#currentDate").val();
var type = $("#type").val();
var typeNum = $("#typeNum").val();
var auditstate = 0;
var selectCampusid;
var XX_SERVICE_FREE_END_RQ = "2030-01-01";
var XX_SERVICE_START_RQ = "2030-01-020";
var XX_SERVICE_END_RQ = "2030-01-02";
var businessmodel;

var bModel = -1;
var keynum = 0;
$(document).ready(function() {
	getDictList(ApiParamUtil.COMMON_QUERY_DICT,"#xxtypeList",DICTTYPE.DICT_TYPE_SCHOOL_TYPE,true);
	if(type == "main") {
		getCountyTownList('#countyTownList');
	} else {
		generate_xxgl_table();
	}
	
	$("#xxtypeList").change(function() {
		generate_xxgl_table();
	});
	
	$("#cityList").change(function() {
		getCountyTownList('#countyTownList');
	});
	$("#countyTownList").change(function() {
		generate_xxgl_table();
	});
	
	$("#dlsList").change(function() {
		generate_xxgl_table();
	});
	
	$("#shztList").change(function() {
		generate_xxgl_table();
	});
	
	$("#xx-search-btn").click(function() {
		generate_xxgl_table();
	});
	
	$("#prodictList").change(function(){
		var url=ctx+"/base/findTransformCityByProvince";
		var submitData = {
			dictcode: $("#prodictList").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				$("#cityList option").remove();//user为要绑定的select，先清除数据   
		        for(var i=0;i<datas.length;i++){
		        		$("#cityList").append("<option value=" + datas[i][0]+" >"
			        			+ datas[i][1] + "</option>");
		        };
		        $("#cityList").find("option[index='0']").attr("selected",'selected');
		        $("#cityList").trigger("chosen:updated");
		        getCountyTownList('#countyTownList');
	    });
	});
	
	$("#auditSubmit").click(function(){
		saveAuditInfo();
	});
	
	$(".keycode_key").change(function(){
		var selectkey = $(this).val();
		var timetip = "待设置key";
		if(selectkey!=""){
			timetip = keyTime(Number($($(this).get(0)[$(this).get(0).selectedIndex]).attr("createtime")));
			var nowselect = $(this).attr("id");
			$('.keycode_key').each(function(){
				if($(this).val() == selectkey && $(this).attr("id")!=nowselect){
					timetip = "该key已经使用";
				}
			})
		}
		$(this).next('.select_key_tip').html(timetip);
	});
	
	$('#saveKey_btn').click(function(){
		saveKey();
	});
	
//	$("input[name=payment_radio]").change(function(){
//		changeServiceDate();
//	});
	
	getBusinessModel();
});

function getBusinessModel(){
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.QUERY_DLS_INFO,
			param: JSON.stringify({
				userId:main_userid
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				businessmodel = result.data.businessmodel;
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}


function changeServiceDate(){
	var payment = $('input[name="payment_radio"]:checked').val();
	if(bModel == 3){
		
	}else{
		if(payment == 1){
			$("#freeendrq").val(XX_SERVICE_FREE_END_RQ);
			$("#servicestartrq").val(XX_SERVICE_START_RQ);
			$("#serviceendrq").val(XX_SERVICE_END_RQ);
		} else {
			$("#freeendrq").val(getDayBeforeCurrentDay());
			$("#servicestartrq").val(getCurrentDay());
			$("#serviceendrq").val(XX_SERVICE_END_RQ);
		}
	}
}

/**
 * 获取字典下拉框选项
 */
function getDictList(api,node,type,isAll){
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: api,
			param: JSON.stringify({
				type:type
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				if(isAll){
					createDictAllList(result.data.dictList,msg,node);
				}else{
					createDictList(result.data.dictList,msg,node);
				}
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

/**
 * 创建字典下拉框
 * @param dataData
 * @param msg
 * @param node
 */
function createDictList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].key+'">'+dataData[i].value+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		$(node).val(dataData[0].key);
	}
	$(node).trigger("chosen:updated");
}

function createDictAllList(dataData,msg,node){
	var allValue = new Array();
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].key+'">'+dataData[i].value+'</option>');
		allValue.push(dataData[i].key);
	}
	$(node).html('<option value="'+allValue.toString()+'">全部版本</option>' + dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		$(node).val(allValue.toString());
	}
	$(node).trigger("chosen:updated");
}

function keyTime(createtime){
	var starttime = new Date(new Date(createtime).Format("yyyy-MM-dd")).getTime();
	var endtime = starttime + 60*60*24*30*6*1000;
	var nowtime = new Date().getTime();
	var timetip;
	if(endtime<nowtime){
		timetip="永久绑定";
	}else{
		timetip=new Date(endtime).Format("yyyy年MM月dd日")+"前可解绑";
	}
	return timetip;
}

function saveAuditInfo(){
	if(checkloginName()){
		var freestartrq = $("#freestartrq").val();
		var freeendrq = $("#freeendrq").val();
		var servicestartrq = $("#servicestartrq").val();
		var serviceendrq = $("#serviceendrq").val();
		var auditstate = $("input[name='auditstate']:checked").val();
		
		if(auditstate == null || auditstate == ''){
			PromptBox.alert("请设置审核状态");
			return false;
		}
		
		if(freestartrq ==null || freestartrq == '' || freeendrq ==null || freeendrq == ''){
			PromptBox.alert("请设置免费时段");
			return false;
		}
		if($('#campus').val() ==null || $('#campus').val() == ''){
			PromptBox.alert("学校名称不为空");
			return false;
		}
		
		if(servicestartrq ==null || servicestartrq == '' || serviceendrq ==null || serviceendrq == ''){
			PromptBox.alert("请设置服务时段");
			return false;
		}
		
		if (confirm("是否确定保存审核信息?")) {
			GHBB.prompt("数据保存中~");
			var url = ctx + "/xtgl/campus/saveAuditInfo";
			var submitData = {
				id 			: 	$("#id").val(),
				auditstate	:	auditstate,
				payment		:	$("input[name='payment_radio']:checked").val(),
				remark		:	$("#remark").val(),
				freestartrq	:	getDayBeginTime(freestartrq),
				campus: $('#campus').val(),
				freeendrq	:	getDayEndTime(freeendrq),
				servicestartrq	:	getDayBeginTime(servicestartrq),
				serviceendrq	:	getDayEndTime(serviceendrq),
				coststate		:	$("#coststate").val(),
				superadmin		:	$("#superadmin").val(),
				appid			:	$("#appid").val(),
				auditstartrq	:	$("#auditstartrq").val(),
				auditendrq		:	$("#auditendrq").val()
			};
			$.post(url, submitData, function(data) {
				GHBB.hide();
				if(data == "success"){
					PromptBox.alert("审核成功!");
					$("#modal-audit-page").modal("hide");
				}else{
					PromptBox.alert(data);
					return false;
				}
				generate_xxgl_table();
				return false;
			});
			return false;
		} else
			return false;
	}
}

function getBusinessmodel(type){
	if(type==1){
		return "学期服务";
	}else if(type==2){
		return "永久key";
	}else if(type==3){
		return "学期key";
	}
}

function generate_xxgl_table() {
	GHBB.prompt("正在加载~");
	App.datatables();
	var sAjaxSource = ctx + "/xtgl/campus/ajax_findDlsCampusInfo";
//	var param = "search_nameLike=" + $("#xx_name").val();
//	param = param+"&search_auditState=" + $("#shztList").val();
//	param = param+"&search_type=" + type;
//	param = param+"&search_xxtype=" + $('#xxtypeList').val();
//	if(type=="main"){
//		param = param+"&search_city=" + $("#cityList").val();
//		param = param+"&search_countyTown=" + $("#countyTownList").val();
//		param = param+"&search_dls=" + $("#dlsList").val();
//		
//	}
//	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns ;
	var param;
	if (type=="dls") {
		 param = {
				nameLike : $("#xx_name").val(),
				auditState : $("#shztList").val(),
				type : type,
				xxtype : $("#xxtypeList").val()
			},
		aoColumns = [ {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "1"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "3"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "4"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "5"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "7"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "0"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "1"
		} ];
	} else {
		 param = {
				nameLike : $("#xx_name").val(),
				auditState : $("#shztList").val(),
				type : type,
				xxtype : $("#xxtypeList").val(),
				city : $("#cityList").val(),
				countyTown : $("#countyTownList").val(),
				dls : $("#dlsList").val()
				},
		aoColumns = [ {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "1"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "0"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "6"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "7"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "8"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "10"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "10"
		}, {
			"sWidth" : "150px",
			"sClass" : "text-center",
			"mDataProp" : "11"
		} 
		];
	}

	$('#xxgl-datatable').dataTable({
					"iDisplayLength" : 50,
					"aLengthMenu" : [ [ 10, 20, 30, -1 ],
							[ 10, 20, 30, "All" ] ],
					"bFilter" : false,
					"bLengthChange" : false,
					"bDestroy" : true,
					"bAutoWidth" : false,
					"bSort" : false,
					"sAjaxSource" : sAjaxSource,
					"bServerSide" : true,
					"sServerMethod" : "POST",
					"fnServerParams": function (aoData) {
							aoData.push( { "name": "param", "value": JSON.stringify(param) } );
					},
					"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
						if(type=="main"){
							var campus=aaData[1];
							var dlsname=aaData[7];
							if(aaData[15]!=aaData[16]){
								campus =campus+"("+getBusinessmodel(aaData[16])+")";
								dlsname=dlsname+"("+getBusinessmodel(aaData[15])+")";
							}
							
							var editHtml = '<div style="text-align:center;"><a href="javascript:openAuditPage('+aaData[0]+')">' + campus + '</a></div>';
							$('td:eq(0)', nRow).html(editHtml);
							$('td:eq(3)', nRow).html(dlsname);
							
							$('td:eq(1)', nRow).html(aaData[2] + aaData[3]);
							
							$('td:eq(6)', nRow).html("-");
							if(aaData[10] == 1) {
								$('td:eq(5)', nRow).html("待审核");
							} else if(aaData[10] == 2) {
								$('td:eq(5)', nRow).html("已通过");
								if(currentDate>=aaData[11] && currentDate<aaData[12]){
									if(aaData[15] == '3'){
										$('td:eq(6)', nRow).html("试用中(剩余"+getSeveralDaysCurrentDayToSpecific(aaData[12])+"天)");

									}else {
										$('td:eq(6)', nRow).html("免费中");
									}
								}else if(currentDate>=aaData[13] && currentDate<=aaData[14]){
									$('td:eq(6)', nRow).html("收费中");
								}else if(judgeIsEqual(aaData[12])){
									$('td:eq(6)', nRow).html("试用中(剩余不足一天)");
								}else{
									$('td:eq(6)', nRow).html("停用");
								}
							} else if(aaData[10] == -1) {
								$('td:eq(5)', nRow).html("未通过");
							}
							
							// 删除
							var delhtml = '<div class="btn-group btn-group-xs"><a href="javascript:delCampusConfirm('
								+aaData[0]+','+aaData[4]+');" >删除</div>';
							$('td:eq(7)', nRow).html(delhtml);
						}else if(type=="dls"){
							
							var editHtml = '<div style="text-align:center;"><a href="'
								+ ctx
								+ '/xtgl/campus/updateCampus/'
								+ aaData[0]
								+ '?appid='+appid+'">' + aaData[1] + '</a></div>';
							$('td:eq(0)', nRow).html(editHtml);
							
							$('td:eq(5)', nRow).html("-");
							var keyNumber = aaData[13] ? aaData[13]:0;
							var keyCodeNum;
							if(keyNumber<2){
								$('#keycode_num').html("支持学生0~50人（含50人）");
							}else if(keyNumber<3){
								$('#keycode_num').html("支持学生0~100人（含100人）");
							}else if(keyNumber<4){
								$('#keycode_num').html("支持学生0~150人（含150人）");
							}else{
								$('#keycode_num').html("学生人数不限");
							}
							var setButton = new Array();
							setButton.push('<div style="text-align:center;">');
							setButton.push('<a style="margin-right: 10px;" href="javascript:showKeyModel(\''+aaData[0]+'\',\''+aaData[1]+'\',\''+aaData[14]+'\')">设置(已绑定'+keyNumber+'个)</a>');
//							if(aaData[7] == 2){
//								if(aaData[15] != 1){
//									setButton.push('<a style="cursor:pointer;" onclick="outOfService(this,\''+aaData[0]+'\',\''+aaData[16]+'\')">停用</a>');
//								}else if(aaData[16] != -1){
//									setButton.push('<a class="disabled_text">已停用</a>');
//								}
//							}
							setButton.push('</div>');
							$('td:eq(6)', nRow).html(setButton.join(''));
							
							var remark = "";
							if(aaData[12] != 'null' && aaData[12] != null && aaData[12] != ''){
								remark =aaData[12];
							}else{
								remark = "未添加备注";
							}
							
							var remarkHtml = "";
							if (aaData[7] == 0) {
								$('td:eq(4)', nRow).html("待申请");
							} else if(aaData[7] == 1) {
								$('td:eq(4)', nRow).html("审核中");
							} else if(aaData[7] == 2) {
								remarkHtml = '<div><a data-toggle="tooltip" title="'+remark+'" style="color:#000;text-decoration:none;cursor: pointer;">审核通过</a></div>';
								
								$('td:eq(4)', nRow).html(remarkHtml);
								if(currentDate>=aaData[8] && currentDate<aaData[9]){
									if(aaData[17] == '3'){
										$('td:eq(5)', nRow).html("试用中(剩余"+getSeveralDaysCurrentDayToSpecific(aaData[9])+"天)");
									} else {
										$('td:eq(5)', nRow).html("免费中");
									}
								}else if(currentDate>=aaData[10] && currentDate<=aaData[11]){
									$('td:eq(5)', nRow).html("收费中");
								}else if(judgeIsEqual(aaData[9])){
									$('td:eq(5)', nRow).html("试用中(剩余不足一天)");
								}else{
									$('td:eq(5)', nRow).html("停用");
								}
							} else if(aaData[7] == -1) {
								remarkHtml = '<div><a data-toggle="tooltip" title="'+remark+'" style="color:#428bca;text-decoration:underline;cursor: pointer;" onclick="openAuditNoPassPage('+aaData[0]+');">审核未通过<i class="hi hi-question-sign fa-1x text-info"></i></a></div>';
								$('td:eq(4)', nRow).html(remarkHtml);
							}
						};
						
						return nRow;
					},
					"aoColumns" : aoColumns,
					"fnInitComplete": function(oSettings, json) {
						GHBB.hide();
				    }

				});
}


function delCampusConfirm(campusid,orgcode) {
//	if (ystype == 1) {
//		alert("当前校区为主园，不能删除！");
//		return false;
//	}
	if (confirm("校区信息属于关键信息，确认是否删除该条纪录?")) {
		var url=ctx+"/xtgl/campus/ajax_delete_campus";
		var submitData = {
			campusid: campusid,
			orgcode:orgcode
		}; 
		$.post(url,
			submitData,
	      	function(data){
				PromptBox.alert(data);
				generate_xxgl_table();
				return false;
	      });
	} 
};

function openAuditNoPassPage(id){
	var url = ctx + "/xtgl/campus/auditCampus";
	var submitData = {
		campusid:id
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");
		
		$("#nopass-remark").html(datas.remark);
		
		$("#modal-audit-nopass-page").modal("show");
		return false;
	});
	
}

function openAuditPage(id){
	var url = ctx + "/xtgl/campus/auditCampus";
	var submitData = {
		campusid:id
	};
	$.post(url, submitData, function(data) {
		var datas = eval("(" + data + ")");
		$("#id").val(datas.id);
		$("#auditstartrq").val(datas.auditstartrq);
		$("#auditendrq").val(datas.auditendrq);
		$("#campus").val(datas.campus);
		$("#orgname").val(datas.orgname);
		$("#superadmin").val(datas.superadmin);
		$("#province").val(datas.province_ch);
		$("#city").val(datas.city_ch);
		$("#countytown").val(datas.countyTown_ch);
		$("#address").val(datas.address);
		
		auditstate = datas.auditstate;
		if(auditstate == 2 || auditstate == 1){
			 $("input[name=auditstate][value='2']").attr("checked",true);
		}else{
			$("input[name=auditstate][value='-1']").attr("checked",true);
		}
		
		if(datas.payment != undefined && datas.payment == 1){
			$("input[name=payment_radio][value='1']").prop("checked",true);
			$("input[name=payment_radio][value='0']").prop("checked",false);
		}else{
			$("input[name=payment_radio][value='1']").prop("checked",false);
			$("input[name=payment_radio][value='0']").prop("checked",true);
		}
		
		if(auditstate == 1){
			 $("#superadmin").attr("disabled", false); 
		 }else{
			 $("#superadmin").attr("disabled", true); 
		 }
		
		$("#remark").val(datas.remark);
		$("#freestartrq").val(datas.freestartrq);
		$("#freeendrq").val(datas.freeendrq);
		$("#servicestartrq").val(datas.servicestartrq);
		$("#serviceendrq").val(datas.serviceendrq);
		
		$('#coststate').find("option[value='" + datas.coststate + "']").attr("selected", true);
		$('#coststate').trigger("chosen:updated");
		
		$("#modal-audit-page").modal("show");
		bModel = findCampusBusinessModel(id);
		if(bModel == 3){
			$("#freestartrq").attr("disabled", true);
			$("#freeendrq").attr("disabled", true);
			$("#servicestartrq").attr("disabled", true);
			$("#serviceendrq").attr("disabled", true);
		}else{
			$("#freestartrq").attr("disabled", false);
			$("#freeendrq").attr("disabled", false);
			$("#servicestartrq").attr("disabled", false);
			$("#serviceendrq").attr("disabled", false);
		}
		return false;
	});
	
}

function findCampusBusinessModel(campusid){
	var bModel = -1 ;
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.QUERY_DLS_BY_CAMPUS,
			param: JSON.stringify({
				campusid:campusid
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				bModel = result.data.businessmodel;
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
	return bModel;
}

function checkloginName() {
	if(auditstate == 1){
		if ($("#superadmin").val() == "") {
			PromptBox.alert("请添加学校管理员帐号");
			return false;
		}
		var a = true;
		jQuery.ajax({
			type : "get",
			url : ctx + "/xtgl/teacher/checkloginName",
			async : false,
			cache : false,
			data : {
				loginName : $("#superadmin").val(),
				id : $("#id").val(),
				method : "get"
			},
			dataType : "html",
			scriptCharset : "UTF-8",
			success : function(s) {
				if (s != "true") {
					a = false;
				}
			}
		});
		if (a != true) {
			pyjc = '该用户名已经被占用！';
			PromptBox.alert($("#superadmin").val() + pyjc);
			$("#superadmin").val('');
			return false;
		}
		return true;
	}
	return true;
}

var time = "";

function keepTime(obj){
	time = $(obj).val();
}

function changeTime(obj){
	var rq = $(obj).val();
	if(rq == undefined || rq ==null || rq ==''){
		rq = time;
		$(obj).val(rq);
	}
	time = "";
}

function changeOthers(timeName){
	var freestartrq = new Date(document.getElementsByName("freestartrq")[0].value).getTime();
	var freeendrq = new Date(document.getElementsByName("freeendrq")[0].value).getTime();
	var servicestartrq = new Date(document.getElementsByName("servicestartrq")[0].value).getTime();
	var serviceendrq = new Date(document.getElementsByName("serviceendrq")[0].value).getTime();
	if(timeName == "freestartrq" && freestartrq > freeendrq){
		freeendrq = freestartrq;
		freeendrq = new Date(freeendrq).Format("yyyy-MM-dd");
		document.getElementsByName("freeendrq")[0].value = freeendrq;
		changeOthers("freeendrq");
	}
	if(timeName == "freeendrq"){
		if(freeendrq < freestartrq){
			freestartrq = freeendrq;
			freestartrq = new Date(freestartrq).Format("yyyy-MM-dd");
			document.getElementsByName("freestartrq")[0].value = freestartrq;
			changeOthers("freestartrq");
		}
		if(freeendrq >= servicestartrq){
			servicestartrq = freeendrq + 24*60*60*1000;
			servicestartrq = new Date(servicestartrq).Format("yyyy-MM-dd");
			document.getElementsByName("servicestartrq")[0].value = servicestartrq;
			changeOthers("servicestartrq");
		}
	}
	if(timeName == "servicestartrq"){
		if(servicestartrq > serviceendrq){
			serviceendrq = servicestartrq;
			serviceendrq = new Date(serviceendrq).Format("yyyy-MM-dd");
			document.getElementsByName("serviceendrq")[0].value = serviceendrq;
			changeOthers("serviceendrq");
		}
		if(servicestartrq <= freeendrq){
			freeendrq = servicestartrq - 24*60*60*1000;
			freeendrq = new Date(freeendrq).Format("yyyy-MM-dd");
			document.getElementsByName("freeendrq")[0].value = freeendrq;
			changeOthers("freeendrq");
		}
	}
	if(timeName == "serviceendrq" && serviceendrq < servicestartrq){
		servicestartrq = serviceendrq;
		servicestartrq = new Date(servicestartrq).Format("yyyy-MM-dd");
		document.getElementsByName("servicestartrq")[0].value = servicestartrq;
		changeOthers("servicestartrq");
	}
}

/**
 * 显示key设置窗口
 */
function showKeyModel(campusid,campus,xxtype){
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.DLS_CAMPUS_KEY_VIEW,
			param: JSON.stringify({
				campusid:campusid
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				
				selectCampusid = campusid;
				$('#keycode_title').html(campus);
				
				var keylist =  result.data.keylist;
				keynum = result.data.keynum;
				if(businessmodel==3){
					createKeyDivList(keylist.length);
				}else{
					createKeyDivList(4);
					if(xxtype!=1){
						$(".keycode_key").parents(".form-group").hide();
						$("#keycode_key1").parents(".form-group").show();
					}else{
						$(".keycode_key").parents(".form-group").show();
					}
					$('.keycode_key').removeAttr("disabled");
				}
				
				getKeyList(campusid,".keycode_key");
				
				for(var i=0;i<keylist.length;i++){
					var timetip = keyTime(keylist[i].lasttime);
					if(keylist[i].cbusinessmodel!=3){
						//历史商务模式
						timetip="永久绑定";
					}
					$('#keycode_key'+(i+1)).val(keylist[i].key);
					$('#keycode_key'+(i+1)).trigger("chosen:updated");
					if(timetip==="永久绑定"){
						$('#keycode_key'+(i+1)).attr("disabled","disabled");
					}
					$('#keycode_key_tip'+(i+1)).html(timetip);
				}
				
				$('#modal-keycode').modal('show');
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createKeyDivList(length){
	var keyArray = new Array();
	for(var i=0;i<length;i++){
		keyArray.push('<div class="form-group">');
		keyArray.push('<label class="col-md-3 control-label">key'+(i+1)+'</label>');
		keyArray.push('<div class="col-md-9">');
		keyArray.push('<select id="keycode_key'+(i+1)+'" class="form-control keycode_key" required="required">');
		keyArray.push('</select>');
		keyArray.push('<p class="select_key_tip" id="keycode_key_tip'+(i+1)+'"></p>');
		keyArray.push('</div>');
		keyArray.push('</div>');
	}
	$("#keyLsit").html(keyArray.join(''));
	if(businessmodel==3){
		createNextKeyDiv(length);
	}
}

function createNextKeyDiv(length){
	length = parseInt(length);
	$('.keycode_key').attr("onfocus","");
	var keyArray = new Array();
	keyArray.push('<div class="form-group">');
	keyArray.push('<label class="col-md-3 control-label">key'+(length+1)+'</label>');
	keyArray.push('<div class="col-md-9">');
	var onfocusName = "";
	keyArray.push('<select id="keycode_key'+(length+1)+'" class="form-control keycode_key" required="required" onfocus=createNextKeyDiv('+(length+1)+')>');
	keyArray.push('</select>');
	keyArray.push('<p class="select_key_tip" id="keycode_key_tip'+(length+1)+'"></p>');
	keyArray.push('</div>');
	keyArray.push('</div>');
	$("#keyLsit").append(keyArray.join(''));
	getKeyList(selectCampusid, "#keycode_key"+(length+1));
}


/**
 * 查询代理商关联key
 */
function getKeyList(campusid,node){
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.DLS_CAMPUS_KEY_LIST_QUERY,
			param: JSON.stringify({
				campusid: campusid
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createKeyList(result.data.keylist,node);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function createKeyList(dataData,node){
	$('.select_key_tip').html('待设置key');
	var dataList = new Array();
	dataList.push('<option value="">不设置</option>');
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].key+'" createtime="'+dataData[i].createtime+'">'+dataData[i].key+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
//		PromptBox.alert(msg);
	}else{
		$(node+" option").eq(0).attr("selected",true);
		//$(node).val(dataData[0].id);
	}
	$(node).trigger("chosen:updated");
}

/**
 * 修改学校关联key
 */
function saveKey(){
	var keys = new Array();
	$('.keycode_key').each(function(){
		if($(this).val()){
			keys.push($(this).val());
		}
	})
	var s = keys.join(",")+",";
	for(var i=0;i<keys.length;i++) {
		if(s.replace(keys[i]+",","").indexOf(keys[i]+",")>-1 && keys[i] !='') { 
			PromptBox.alert("key有重复"); 
			return;
		}
	}
	if(businessmodel == 3){
		if(keynum == 999 || keynum == keys.length){
			saveK(keys);
		}else if(keynum > keys.length){
			PromptBox.alert("key不得少于"+keynum+"个"); 
			return;
		}else if(keynum < keys.length){
			if(confirm("学校只需要"+keynum+"个key,而您添加了"+keys.length+"个key,多余的key同样将进行计时操作,确认保存吗?")){
				saveK(keys);
			}
		}
	}else{
		saveK(keys);
	}
}

function saveK(keys){
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.DLS_CAMPUS_KEY_SAVE,
			param: JSON.stringify({
				campusid: selectCampusid,
				keys: keys.join(',')
			})
	};
	GHBB.prompt("数据保存中~");
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		//async:false,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				$('#modal-keycode').modal('hide');
				generate_xxgl_table();
			}else if(result.ret.code==="400"){
				for(var i=0;i<result.data.length;i++){
					if(result.data[i]==100){
						$('#keycode_key_tip'+(i+1)).html("该key已存在");
					}else if(result.data[i]==300){
						$('#keycode_key_tip'+(i+1)).html("该key已使用");
					}else if(result.data[i]==400){
						$('#keycode_key_tip'+(i+1)).html("该key不合法");
					}
				}
				PromptBox.alert("key存在错误");
			}else if(result.ret.code==="300"){
				PromptBox.alert("删除后，key数量小于学生人数要求的数量，请先删除学生！");
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

//停用服务
function outOfService(node,campusid,state){
	PromptBox.confirm("温馨提醒：停用功能只能使用一次，停用后，如需再次开启，请联系总部！",function(flag){
		if(flag){
			var url = commonUrl_ajax;
			var submitData = {
					api: ApiParamUtil.DLS_CAMPUS_OUTOFSERVICE,
					param: JSON.stringify({
						campusid: campusid,
						state: state
					})
			};
			$.ajax({
				cache:false,
				type: "POST",
				url: url,
				//async:false,
				data: submitData,
				success: function(datas){
					var result = typeof datas === "object" ? datas : JSON.parse(datas);
					if(result.ret.code==="200"){
						$(node).text("已停用");
						$(node).removeAttr("onclick");
						$(node).addClass("disabled_text");
					}else{
						console.log(result.ret.code+":"+result.ret.msg);
					}
				}
			});
		}
	})
}
//获取当前天数前一天的日期
function getDayBeforeCurrentDay(){
	var currentDate = new Date();
	var date=currentDate.getTime()-1000*60*60*24;
	var yesterday = new Date();       
    yesterday.setTime(date);       
    
	var strYear = yesterday.getFullYear();    
	var strDay = yesterday.getDate();    
	var strMonth = yesterday.getMonth()+1;  
	if(strMonth<10)    
	{    
	    strMonth="0"+strMonth;    
	}    
	if(strDay<10)    
    {    
        strDay="0"+strDay;    
    }
	datastr = strYear+"-"+strMonth+"-"+strDay;  
	return datastr;  
}

function judgeIsEqual(specificDate){
	var date1 = specificDate.substr(0,10);
	var date2 = currentDate.substr(0,10);
	if(DateDiff(date1,date2)==0){
		return true;
	}
	return false;
}

//获取特定日期大于当前日期时的天数2015-12-18格式   
function getSeveralDaysCurrentDayToSpecific(specificDate){	
	return DateDiff(specificDate.substr(0,10),  currentDate.substr(0,10));
}

//计算两个日期天数差的函数，通用  
function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2015-12-18格式    
    var  aDate,  oDate1,  oDate2,  iDays    
    aDate  =  sDate1.split("-")    
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2015格式    
    aDate  =  sDate2.split("-")    
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数   
    if(iDays == 0){
    	return "不足1";
    }
    return  iDays ;   
}

function getCurrentDay(){
	var date = new Date();
	var strYear = date.getFullYear();    
    var strDay = date.getDate();    
    var strMonth = date.getMonth()+1;  
    if(strMonth<10)    
    {    
       strMonth="0"+strMonth;    
    }  
    if(strDay<10)    
    {    
       strDay="0"+strDay;    
    }  
    datastr = strYear+"-"+strMonth+"-"+strDay;  
    return datastr;  
}

function getDayBeginTime(date){
	return date + " 00:00:00";
}

function getDayEndTime(date){
	return date + " 23:59:59";
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function getCountyTownList(node){
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.COMMON_QUERY_COUNTY_TOWN,
			param: JSON.stringify({
				provinceId: $("#prodictList").val(),
				cityId: $("#cityList").val()
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			$("#countyTownList option").remove();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createCityList(result.data.countyTownList,msg,node);
				generate_xxgl_table();
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}
function createCityList(dataData,msg,node){
	var dataList = new Array();
	for(var i=0;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].id+'">'+dataData[i].value+'</option>');
	}
	$(node).html(dataList.join(''));
	if(dataData=='' || dataData == null || dataData.length===0){
		PromptBox.alert(msg);
	}else{
		$(node).find("option[index='0']").attr("selected", 'selected');
	}
	$(node).trigger("chosen:updated");
}
