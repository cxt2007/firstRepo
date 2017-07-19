var ctx = $("#ctx").val();
var prizeItemHtml = '';
var dataId = $("#dataId").val();
//参与奖的id值
var participation = 999;
var canguestvote=1;

$(document).ready(function() {
	initCss();
	//getVoteRuleList();
	getPrizeItemList();
	getDlsList();
	multiselect("#city_list");
	$("#city_list").multiselect("refresh");
	multiselect("#campus_list");
	$("#campus_list").multiselect("refresh");
	if (dataId != null && dataId != '') {
		getGhhdInfo();
	}
	initUploader();
});

function initUploader(){
	var filePickers = $("div[name='filePicker']");
	for ( var i = 0; i < filePickers.length; i++) {
		var filePicker = filePickers.eq(i);
		initWebUploader(filePicker.attr("id"));
	}
}

function changeRadioValue(){
	$(".pinput").each(function(){
		$(this).val("");
	})
}

function makeEleIfParticipateAward(obj){
	var addOrDel=1;
	if($(obj).parent().parent().prev().html()==null||$(obj).parent().parent().prev().html()=="null"){
		addOrDel=0;
	}
	var prizeValue=$(obj).val();
	var ppobj=$(obj).parent().parent();
	ppobj.html("");	
	var prizeHtml = '';		
	var id="r_"+Math.ceil(Math.random()*1000);
	if (prizeValue == participation) {
		prizeHtml += '<div class="col-md-4 thmeform-prize-p-1">'
			+ '<select id="'+id+'" class="form-control themeForm_prize" onchange="makeEleIfParticipateAward(this)">'
			+ prizeItemHtml
			+ '</select></div>'
			+ '<div class="col-md-4 thmeform-prize-p-2">'
			+ '<div class="thmeform-prize-p-3">'
		    + '<div class="thmeform-prize-p-4">';
		prizeHtml += '<input type="radio" class="prize-radio" name="prize_radio" onchange="changeRadioValue()" value="1"></div>'
		    + '<div class="thmeform-prize-p-5">大于</div>'
		    + '<div class="col-md-5 thmeform-prize-p-6">'
		    + '<input type="number" style="display:inline" class="form-control pinput" ptype="1" required="required" min="1" value=""></div>'
		    + '<div class="thmeform-prize-p-5">票</div></div>'
		    + '<div class="cl"></div>'
		    + '<div>'
		    + '<div class="thmeform-prize-p-4"><input type="radio" class="prize-radio" name="prize_radio" checked onchange="changeRadioValue()" value="0"></div>'
		    + '<div class="thmeform-prize-p-5">设置</div>'
		    + '<div class="col-md-5 thmeform-prize-p-6">'
		    + '<input type="number" style="display:inline" class="form-control pinput" ptype="0" required="required" min="1" value=""></div>'
		    + '<div class="thmeform-prize-p-5">人</div>'
		    + '</div>'
		    + '</div>'
		    + '<div class="col-md-4" style="padding-left:0px;width:250px;">'
			+ '<input type="text" style="display:inline" class="form-control" required="required" placeholder="奖品内容">'
			+ '</div>';
			if ( addOrDel == 0) {
				prizeHtml += '<a class="col-md-2 thmeform-prize-p-7" style="width:60px;" onclick="addPrizeItem();">新增</a>';
			} else {
				prizeHtml += '<a class="col-md-2 thmeform-prize-p-7" style="width:60px;" onclick="delPrizeItem(this);">删除</a>';
			}
			prizeHtml += '<div class="cl"></div>';
	} else {
		prizeHtml +=  '<div class="col-md-4" style="padding-left:0px;width:100px;">'
			+ '<select id="'+id+'" class="form-control themeForm_prize" onchange="makeEleIfParticipateAward(this)">'
			+ prizeItemHtml
			+ '</select>'
			+ '</div>'
			+ '<div class="col-md-4" style="padding-left:0px;width:180px;">'
			+ '<input type="number" style="display:inline" class="form-control" required="required" min="1" placeholder="数量">'
			+ '</div>'
			+ '<div class="col-md-4" style="padding-left:0px;width:250px;">'
			+ '<input type="text" style="display:inline" class="form-control" required="required" placeholder="奖品内容">'
			+ '</div>';
		if ( addOrDel == 0) {
			prizeHtml += '<a class="col-md-2" style="padding-left:0px;padding-top:10px;cursor:pointer;width:60px;" onclick="addPrizeItem();">新增</a>';
		} else {
			prizeHtml += '<a class="col-md-2" style="padding-left:0px;padding-top:10px;cursor:pointer;width:60px;" onclick="delPrizeItem(this);">删除</a>';
		}			
	}	
	ppobj.html(prizeHtml);	
	$("#"+id).val(prizeValue);
	$("#"+id).trigger("chosen:updated");
}

/**
 * 查询单个活动信息
 * 
 */
function getGhhdInfo() {
	var submitData = {
		api:ApiParamUtil.APPID_GHHD_QUERY_ONE_LIST,
		param:JSON.stringify({
			id:dataId
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code==="200") {
				$("#title").val(result.data.title);
				editor1.html(result.data.content);
				$("#content").text(result.data.content);
				editor2.html(result.data.detail);
				$("#detail").text(result.data.detail);
				editor4.html(result.data.awardway);
				$("#awardway").text(result.data.awardway);
				$("#adImgPath").attr("src", result.data.picpath);
				if (result.data.adpicpath1 != null && result.data.adpicpath1 != '') {
					$("#adImgPath1").attr("src", result.data.adpicpath1);
				}
				$("#adurl1").val(result.data.adurl1);
				$("#themeForm_voterule").val(result.data.voterule);
				$("#themeForm_voterule").trigger("chosen:updated");
				$("#themeForm_keyword").val(result.data.keyword);
				var dlsids = result.data.dlsid.split(",");
				$("#dls_list").val(dlsids);
				$("#dls_list").multiselect("refresh");
				loadCityList();	
				var citycodes = result.data.citycode.split(",");
				$("#city_list").val(citycodes);
				$("#city_list").multiselect("refresh");
				loadCampusList();
				var campusids = result.data.campusids.split(",");
				$("#campus_list").val(campusids);
				$("#campus_list").multiselect("refresh");
				
				$("#themeForm_prize").html('');
				for (var i = 0; i < result.data.awardlist.length; i++) {
					var prizeHtml = '';
					// 如果是参与奖
					if (result.data.awardlist[i].awardid == participation) {
						prizeHtml += '<div class="themeForm_prizeItem">'
						    + '<div class="col-md-4 thmeform-prize-p-1">'
						    + '<select id="themeForm_prize_' + i + '" class="form-control themeForm_prize" onchange="makeEleIfParticipateAward(this)">'
							+ prizeItemHtml
							+ '</select></div>'
							+ '<div class="col-md-4 thmeform-prize-p-2">'
							+ '<div class="thmeform-prize-p-3">'
						    + '<div class="thmeform-prize-p-4">';
						if (result.data.awardlist[i].ptype == 1) {
							prizeHtml += '<input type="radio" class="prize-radio" name="prize_radio" checked onchange="changeRadioValue()" value="1"></div>'
							    + '<div class="thmeform-prize-p-5">大于</div>'
							    + '<div class="col-md-5 thmeform-prize-p-6">'
							    + '<input type="number" style="display:inline" class="form-control pinput" ptype="1" required="required" min="1" value="' + result.data.awardlist[i].awardnum + '"></div>'
							    + '<div class="thmeform-prize-p-5">票</div></div>'
							    + '<div class="cl"></div>'
							    + '<div>'
							    + '<div class="thmeform-prize-p-4"><input type="radio" class="prize-radio" name="prize_radio" onchange="changeRadioValue()" value="0"></div>'
							    + '<div class="thmeform-prize-p-5">设置</div>'
							    + '<div class="col-md-5 thmeform-prize-p-6">'
							    + '<input type="number" style="display:inline" class="form-control pinput" ptype="0" required="required" min="1" value=""></div>'
							    + '<div class="thmeform-prize-p-5">人</div>'
							    + '</div>'
							    + '</div>'
							    + '<div class="col-md-4" style="padding-left:0px;width:250px;">'
								+ '<input type="text" style="display:inline" class="form-control" required="required" placeholder="奖品内容" value="' + result.data.awardlist[i].awardcontent + '">'
								+ '</div>';
						} else {
							prizeHtml += '<input type="radio" class="prize-radio" name="prize_radio" onchange="changeRadioValue()" value="1"></div>'
							    + '<div class="thmeform-prize-p-5">大于</div>'
							    + '<div class="col-md-5 thmeform-prize-p-6">'
							    + '<input type="number" style="display:inline" class="form-control pinput" ptype="1" required="required" min="1" value=""></div>'
							    + '<div class="thmeform-prize-p-5">票</div></div>'
							    + '<div class="cl"></div>'
							    + '<div>'
							    + '<div class="thmeform-prize-p-4"><input type="radio" class="prize-radio" name="prize_radio" checked onchange="changeRadioValue()" value="0"></div>'
							    + '<div class="thmeform-prize-p-5">设置</div>'
							    + '<div class="col-md-5 thmeform-prize-p-6">'
							    + '<input type="number" style="display:inline" class="form-control pinput" ptype="0" required="required" min="1" value="' + result.data.awardlist[i].awardnum + '"></div>'
							    + '<div class="thmeform-prize-p-5">人</div>'
							    + '</div>'
							    + '</div>'
							    + '<div class="col-md-4" style="padding-left:0px;width:250px;">'
								+ '<input type="text" style="display:inline" class="form-control" required="required" placeholder="奖品内容" value="' + result.data.awardlist[i].awardcontent + '">'
								+ '</div>';
						}
						if (i == 0) {
							prizeHtml += '<a class="col-md-2 thmeform-prize-p-7" style="width:60px;" onclick="addPrizeItem();">新增</a>';
						} else {
							prizeHtml += '<a class="col-md-2 thmeform-prize-p-7" style="width:60px;" onclick="delPrizeItem(this);">删除</a>'
						}
						prizeHtml += '<div class="cl"></div>';
					} else {
						prizeHtml += '<div class="themeForm_prizeItem">'
							+ '<div class="col-md-4" style="padding-left:0px;width:100px;">'
							+ '<select id="themeForm_prize_' + i + '" class="form-control themeForm_prize" onchange="makeEleIfParticipateAward(this)">'
							+ prizeItemHtml
							+ '</select>'
							+ '</div>'
							+ '<div class="col-md-4" style="padding-left:0px;width:180px;">'
							+ '<input type="number" style="display:inline" class="form-control" required="required" min="1" placeholder="数量" value="' + result.data.awardlist[i].awardnum + '">'
							+ '</div>'
							+ '<div class="col-md-4" style="padding-left:0px;width:250px;">'
							+ '<input type="text" style="display:inline" class="form-control" required="required" placeholder="奖品内容" value="' + result.data.awardlist[i].awardcontent + '">'
							+ '</div>';
						if (i == 0) {
							prizeHtml += '<a class="col-md-2" style="padding-left:0px;padding-top:10px;cursor:pointer;width:60px;" onclick="addPrizeItem();">新增</a>';
						} else {
							prizeHtml += '<a class="col-md-2" style="padding-left:0px;padding-top:10px;cursor:pointer;width:60px;" onclick="delPrizeItem(this);">删除</a>';
						}							
					}
					prizeHtml += '</div>';
					prizeHtml += '<div class="cl"></div>';
					$("#themeForm_prize").append(prizeHtml);
					$("#themeForm_prize_" + i).val(result.data.awardlist[i].awardid);
					$("#themeForm_prize_" + i).trigger("chosen:updated");
				}				
				$("#themeForm_starttime").val(result.data.starttime);
				$("#themeForm_endtime").val(result.data.endtime);
				$("#themeForm_votestarttime").val(result.data.votestarttime);
				$("#themeForm_voteendtime").val(result.data.voteendtime);
				$("#themeForm_announcetime").val(result.data.announcetime);
				return false;
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function initCss() {
	var height = $("#adImgUpload").width()*5/9;
	$("#adImgUpload").css("height", height + "px");
	$("#adImgUpload .remind").css("height", height + "px");
	$("#adImgUpload .remind").css("line-height", height + "px");
	height = $("#imgUpload").width()*5/9;
	$("#imgUpload").css("height", height + "px");
	$("#imgUpload .remind").css("height", height + "px");
	$("#imgUpload .remind").css("line-height", height + "px");
}

KindEditor.ready(function(K) {
	var folder = "ghhd";
	editor1 = K.create('textarea[name="content"]', {
		cssPath : ctx + '/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx + '/filehandel/kindEditorUpload/' + folder + '/image',
		fileManagerJson : ctx + '/filehandel/kindEditorFileManager',
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
		afterBlur : function() {
			this.sync();
		},
		items : ['undo', 'redo', '|', 'preview', 'print',
		 		'justifyleft', 'justifycenter', 'justifyright',
		 		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		 		'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen',
		 		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		 		'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat'
		] //配置kindeditor编辑器的工具栏菜单项
	});
	editor2 = K.create('textarea[name="detail"]', {
		cssPath : ctx + '/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx + '/filehandel/kindEditorUpload/' + folder + '/image',
		fileManagerJson : ctx + '/filehandel/kindEditorFileManager',
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
		afterBlur : function() {
			this.sync();
		},
		items : ['undo', 'redo', '|', 'preview', 'print',
		 		'justifyleft', 'justifycenter', 'justifyright',
		 		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		 		'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen',
		 		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		 		'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat'
		] //配置kindeditor编辑器的工具栏菜单项
	});
	editor4 = K.create('textarea[name="awardway"]', {
		cssPath : ctx + '/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx + '/filehandel/kindEditorUpload/' + folder + '/image',
		fileManagerJson : ctx + '/filehandel/kindEditorFileManager',
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
		afterBlur : function() {
			this.sync();
		},
		items : ['undo', 'redo', '|', 'preview', 'print',
		 		'justifyleft', 'justifycenter', 'justifyright',
		 		'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
		 		'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen',
		 		'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
		 		'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat'
		] //配置kindeditor编辑器的工具栏菜单项
	});
});

function saveAndPreview() {
	var title = $("#title").val();
	if(title == null || title == ""){
		PromptBox.alert("请输入活动标题！");
		return false;
	}
	var content = $("#content").val();
	if(content == null || content == ""){
		PromptBox.alert("请添加活动简介！");
		return false;
	}
	
	var prizeItemList = $(".themeForm_prizeItem");
	var awardlist = new Array();
	for (var i = 0; i < prizeItemList.length; i++) {
		var award = {};
		var num = 0;
		var ptype = 0;
		//对于参与奖，因为有2个选择框，另行处理
		if ($(prizeItemList[i]).find("select").val() == participation) {
			num = $(prizeItemList[i]).find("input[type='radio']:checked").parent().parent().find(".pinput").val();
			ptype = $(prizeItemList[i]).find("input[type='radio']:checked").val();	
		} else {
			num = $(prizeItemList[i]).find("input[type='number']").val();
		}
		if (num == null || num == "" || num < 1) {
			PromptBox.alert("请在奖项设置中输入正确的数量！");
			return false;
		} else {
			award['awardnum'] = num;
			award['awardid'] = $(prizeItemList[i]).find("select").val();
			award['ptype'] = ptype;
		}
		var content = $(prizeItemList[i]).find("input[type='text']").val();
		if (content == null || content == "") {
			PromptBox.alert("请在奖项设置中输入奖品内容！");
			return false;
		} else {
			award['awardcontent'] = content;
		}
		awardlist.push(award);
	}
	
	var starttime = $("#themeForm_starttime").val();
	if(starttime == null || starttime == ""){
		PromptBox.alert("请选择报名开始时间！");
		return false;
	}
	var endtime = $("#themeForm_endtime").val();
	if(endtime == null || endtime == ""){
		PromptBox.alert("请选择报名结束时间！");
		return false;
	}
	var votestarttime = $("#themeForm_votestarttime").val();
	if(votestarttime == null || votestarttime == ""){
		PromptBox.alert("请选择投票开始时间！");
		return false;
	}
	var voteendtime = $("#themeForm_voteendtime").val();
	if(voteendtime == null || voteendtime == ""){
		PromptBox.alert("请选择投票结束时间！");
		return false;
	}
	var announcetime = $("#themeForm_announcetime").val();
	if(announcetime == null || voteendtime == ""){
		PromptBox.alert("请选择公布时间！");
		return false;
	}
	
	var detail = $("#detail").val();
	if(detail == null || detail == ""){
		PromptBox.alert("请添加活动细则！");
		return false;
	}
	var awardway = $("#awardway").val();
	if(awardway == null || awardway == ""){
		PromptBox.alert("请添加领奖方式！");
		return false;
	}
	
	var picpath = $("#adImgPath").attr("src");
	if(picpath == null || picpath == ""){
		PromptBox.alert("请上传活动图片！");
		return false;
	}
	var keyword = $("#themeForm_keyword").val();
	if(keyword == null || keyword == ""){
		PromptBox.alert("请输入活动关键字！");
		return false;
	}
	var campusids = $("#campus_list").val();
	campusids = campusids.join(",");
	if(campusids == null || campusids == ""){
		PromptBox.alert("请选择参与范围！");
		return false;
	}
	
	var voterule = $("#themeForm_voterule").val();
	GHBB.prompt("数据保存中~");
	var submitData = {
		api:ApiParamUtil.APPID_GHHD_THEME_SAVE,
		param:JSON.stringify({
			id:dataId,
			campusids:campusids,
			title:title,
			content:$("#content").val(),
			detail:detail,
			keyword:keyword,
			picpath:picpath,
			adpicpath1:$("#adImgPath1").attr("src"),
			adurl1:$("#adurl1").val(),
			starttime:starttime,
			endtime:endtime,
			votestarttime:votestarttime,
			voteendtime:voteendtime,
			voterule:voterule,
			announcetime:announcetime,
			awardway:awardway,
			awardlist:awardlist,
			canguestvote:canguestvote
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		data: submitData,
		success: function(datas){
			GHBB.hide();
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code==="200") {
				PromptBox.alert("保存成功！");
				dataId = result.data.id;
				ghhdPreviewInThePhone(dataId);
				return false;
			} else {
				PromptBox.alert(result.ret.msg);
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function getVoteRuleList(){
	var submitData = {
		api: ApiParamUtil.COMMON_QUERY_DICT,
		param: JSON.stringify({
			type:DICTTYPE.DICT_TYPE_GHHD_VOTE_RULE
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code==="200") {
				var dataList = new Array();
				for(var i=0;i<result.data.dictList.length;i++) {
					dataList.push('<option value="'+result.data.dictList[i].key+'">'+result.data.dictList[i].value+'</option>');
				}
				$("#themeForm_voterule").append(dataList.join(''));
				$("#themeForm_voterule").trigger("chosen:updated");
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function getPrizeItemList(){
	var submitData = {
		api: ApiParamUtil.COMMON_QUERY_DICT,
		param: JSON.stringify({
			type:DICTTYPE.DICT_TYPE_GHHD_AWARD_TYPE
		})
	};
	$.ajax({
		cache:false,
		type: "POST",
		url: commonUrl_ajax,
		async:false,
		data: submitData,
		success: function(datas){
			var result = typeof datas === "object" ? datas : JSON.parse(datas);
			if (result.ret.code==="200") {
				var dataList = new Array();
				for(var i=0;i<result.data.dictList.length;i++) {
					dataList.push('<option value="'+result.data.dictList[i].key+'">'+result.data.dictList[i].value+'</option>');
				}
				prizeItemHtml = dataList.join('');
				var prizeListSelects = $(".themeForm_prize");
				for(var i=0;i<prizeListSelects.length;i++) {
					$(prizeListSelects[i]).append(prizeItemHtml);
					$(prizeListSelects[i]).trigger("chosen:updated");
				}
			} else {
				console.log(result.ret.code+":"+result.ret.msg);
			}
		}
	});
}

function addPrizeItem() {
	var html = '';
	html += '<div class="themeForm_prizeItem">'
		+ '<div class="col-md-4" style="padding-left:0px;width:100px;">'
		+ '<select class="form-control themeForm_prize" onchange="makeEleIfParticipateAward(this)">'
		+ prizeItemHtml
		+ '</select>'
		+ '</div>'
		+ '<div class="col-md-4" style="padding-left:0px;width:180px;">'
		+ '<input type="number" style="display:inline" class="form-control" required="required" min="1" placeholder="数量">'
		+ '</div>'
		+ '<div class="col-md-4" style="padding-left:0px;width:250px;">'
		+ '<input type="text" style="display:inline" class="form-control" required="required" placeholder="奖品内容">'
		+ '</div>'
		+ '<a class="col-md-2" style="padding-left:0px;padding-top:10px;cursor:pointer;width:60px;" onclick="delPrizeItem(this);">删除</a>'
		+ '</div>';
	html += '<div class="cl"></div>';
	$("#themeForm_prize").append(html);
}

function delPrizeItem(obj) {
	$(obj).parent(".themeForm_prizeItem").next().remove();
	$(obj).parent(".themeForm_prizeItem").remove();
}

/**
 * 获取代理商列表
 */
function getDlsList(){
	var msg = "没有选项！";
	var param = {}
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
	var citys="";
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
		campusids = campusids + campusid +",";
	});
	if(campusids && campusids.length>0){
		campusids = campusids.substring(0,campusids.length);
	}
	$("#themeCapusids").val(campusids);
}

function ghhdPreviewInThePhone(id){
	var campusid = $("#main_campusid").val();
	var orgcode = $("#main_orgcode").val();
	var userid = $("#main_userid").val();
	var url = ctx+"/mobile/loading_page?orgcode="+orgcode+"&campusid="+campusid+"&appid=60700&appdataid="+id+"&preview=1&userid="+userid;
	window.open (url,'newwindow','height=580,width=360,top=20,left=330,scrollbars=yes,location=no');
}

function goBack() {
	window.location.href = ctx + "/base/func/" + ApiParamUtil.APPID_GHHD_LIST_JUMP + "?appid=" + $("#appid").val();
}

function initWebUploader(id){
	// 初始化Web Uploader
	var uploader = WebUploader.create({
	    // 选完文件后，是否自动上传。
	    auto: true,
	    // swf文件路径
	    swf: ctx + '/static/js/webuploader/Uploader.swf',
	    // 文件接收服务端。
	    server: ctx+"/klxx/wlzy/swfupload",
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: {
	    	id :'#'+id,
	    	multiple : false
	    },
	    // 只允许选择图片文件。
	    accept: {
	        title: 'Images',
	        extensions: 'gif,jpg,jpeg,bmp,png',
	        mimeTypes: 'image/*'
	    }
	});
	
	// 当有文件添加进来的时候
	uploader.on( 'fileQueued', function( file ) {
        $('#'+id).parent().find("img").attr( 'src', ctx +'/static/js/images/loading1.gif' );
	});
	
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file,response ) {
		uploader.removeFile(file);
		$('#'+id).parent().find("img").attr( 'src', response.picUrl );
		$('#'+id).parent().find(".remind").addClass('hide');
	});
	
	// 文件上传失败，显示上传出错。
	uploader.on( 'uploadError', function( file ) {
	    var $li = $( '#'+file.id ),
	        $error = $li.find('div.error');

	    // 避免重复创建
	    if ( !$error.length ) {
	        $error = $('<div class="error"></div>').appendTo( $li );
	    }

	    $error.text('上传失败');
	});
	
	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on( 'uploadComplete', function( file ) {
	    $( '#'+file.id ).find('.progress').remove();
	});
}