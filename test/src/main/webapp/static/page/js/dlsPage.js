var ctx = "";

var TablesDatatables = function() {

	return {
		init : function(jsp_ctx) {
			ctx = jsp_ctx;
		}
	};
}();
$(document).ready(function() {
	$("#loginname").focus();
	$("#dls_province").change(function() {
		getSearchFormCity();
	});
	$("#dls_city").change(function() {
		getCountyTown('#countyTown');
	});
	$("#saveSubmit").click(function(){
		var city = $("#dls_city").val();
		if (city == undefined
				|| city == null
				|| city == "") {
			alert("地市不能为空，请选择地市!");
			return false;
		}
		var area = $("#countyTown").val();
		if (area == undefined
				|| area == null
				|| area == "") {
			alert("县区不能为空，请选择县区!");
			return false;
		}
	});
	
});
function getCountyTown(node) {
	var msg = "没有选项！";
	var url = commonUrl_ajax;
	var submitData = {
			api: ApiParamUtil.COMMON_QUERY_COUNTY_TOWN,
			param: JSON.stringify({
				cityId: $("#dls_city").val()
			})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: url,
		async:false,
		data: submitData,
		success: function(datas){
			$("#countyTown option").remove();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if(result.ret.code==="200"){
				createCityList(result.data.countyTownList,msg,node);
			}else{
				console.log(result.ret.code+":"+result.ret.msg);
			}
			$("#countyTown").trigger("chosen:updated");
			$("#countyTown").multiselect('refresh');
		}
	});
}
function createCityList(dataData,msg,node){
	var dataList = new Array();
	for(var i=1;i<dataData.length;i++){
		dataList.push('<option value="'+dataData[i].id+'">'+dataData[i].value+'</option>');
	}
	$(node).html(dataList.join(''));
}
function getSearchFormCity() {
	var url = ctx + "/xtgl/dls/findByDictcode";
	var submitData = {
		dictcode : $("#dls_province").val()
	};
	$.post(url, submitData, function(data) {
		var datas = eval(data);
		$("#dls_city option").remove();// user为要绑定的select，先清除数据
		$("#countyTown option").remove();
		for ( var i = 0; i < datas.length; i++) {
			$("#dls_city").append(
					"<option value=" + datas[i].dictcode + " >"
							+ datas[i].dictname + "</option>");
		}
		;
		$("#dls_city").trigger("chosen:updated");
		$("#countyTown").trigger("chosen:updated");
		$("#dls_city").find("option[index='0']").attr("selected", 'selected');
		$("#dls_city").multiselect('refresh');
		$("#countyTown").multiselect('refresh');
		
	});
}

function checkName() {
	if ($("#loginname").val() == "") {
		return;
	}
	var a = true;
	jQuery.ajax({
		type : "get",
		url : ctx + "/xtgl/dls/checkName",
		async : false,
		cache : false,
		data : {
			loginname : $("#loginname").val(),
			id : $("#id").val(),
			userid : $("#ID").val(),
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
		pyjc = '该登录名已经被占用！';
		alert($("#loginname").val() + pyjc);
		$("#loginname").val('');
	}
}

function checkStartTime() {
	var year = $("#starttime").val();
	var start = year.substring(0, 10).split('-');
	var endyear = $("#endtime").val();
	var end = endyear.substring(0, 10).split('-');
	var a = (Date.parse(end) - Date.parse(start)) / 3600 / 1000;
	if (a < 0) {
		$("#endtime").val(year);
	} else {
		return true;
	}
}

function checkEndTime() {
	var year = $("#starttime").val();
	var start = year.substring(0, 10).split('-');
	var endyear = $("#endtime").val();
	var end = endyear.substring(0, 10).split('-');
	var a = (Date.parse(end) - Date.parse(start)) / 3600 / 1000;
	if (a < 0) {
		alert("合同截止日期不能小于签约日期");
	} else {
		return true;
	}
}
function checkPaid() {
	var amount = $("#amount").val();
	var paid = $("#paid").val();
	if (paid - amount > 0) {
		alert("已付金额不能大于合同金额");
	} else {
		return true;
	}
}
$(function() {
	$("#dls_city").multiselect({
		selectedList : 20
	});
	$("#countyTown").multiselect({
		selectedList : 20
	});
});