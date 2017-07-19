function showErrorMsg(element){
	var elementObj=$(element);
	var inputDoc=document.getElementsByName(elementObj.attr("name"))[0];
	var inputObject=$(inputDoc);
	if(inputObject.css("display")=="none" || inputObject.attr("type")=="hidden"){
		if(inputObject.next().css("display")!="none"){
			inputObject = inputObject.next();
		}else{
			inputObject = inputObject.parent();
		}
	}
	if(inputObject.attr("createMsg")==undefined||inputObject.attr("createMsg")=="false"){
		inputObject.poshytip('hide');
		var defaultOption={
			content:"<div class='inputName' inputName='"+inputObject.attr("name")+"'><span class='error'></span>身份证号不合法，请校对</div>"
		}
		inputObject.dialogtip(defaultOption);
		$(".tip-error").bgiframe();
		inputObject.attr("createMsgIdCard","true");
	}
}


function checkIdcard(IDStr,element) {
	if(IDStr==null||$.trim(IDStr)==""){
		return true;
	}
	var errorInfo;
	IDStr = IDStr.toUpperCase();
	var patrn=/^[xX0-9]+$/;
	if (!patrn.exec(IDStr)) return false
	// String errorInfo = "";// 记录错误信息
	var ValCodeArr = new Array( "1", "0", "X", "9", "8", "7", "6", "5", "4",
			"3", "2" );
	var Wi = new Array( "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7",
			"9", "10", "5", "8", "4", "2" );
	var Ai = "";
	// ================ 号码的长度 15位或18位 ================
	if (IDStr.length != 15 && IDStr.length != 18) {
		//errorInfo = "身份证号码长度应该为15位或18位。";console.log("errorInfo="+errorInfo);
		return false;
	}
	// =======================(end)========================

	// ================ 数字 除最后以为都为数字 ================
	if (IDStr.length == 18) {
		Ai = IDStr.substring(0, 17);
	} else if (IDStr.length == 15) {
		Ai = IDStr.substring(0, 6) + "19" + IDStr.substring(6, 15);
	}
	
	if (!isNumeric(Ai) ) {
		//errorInfo = "身份证15位号码都应为数字 ; 18位号码除最后一位外，都应为数字。";console.log("errorInfo="+errorInfo);
		return false;
	}
	// =======================(end)========================

	// ================ 出生年月是否有效 ================
	var strYear = Ai.substring(6, 10);// 年份
	var strMonth = Ai.substring(10, 12);// 月份
	var strDay = Ai.substring(12, 14);// 月份
	if (isDate(strYear + "-" + strMonth + "-" + strDay)) {
		//errorInfo = "身份证生日无效。";
		//console.log("errorInfo="+errorInfo);
		return false;
	}
	var nowDate = new Date();
	if (parseInt(strMonth,10) > 12 || parseInt(strMonth,10) === 0) {
		//errorInfo = "身份证月份无效";console.log("errorInfo="+errorInfo);
		return false;
	}
	if (parseInt(strDay,10) > 31 || parseInt(strDay,10) === 0) {
		//errorInfo = "身份证日期无效";console.log("errorInfo="+errorInfo);
		return false;
	}
	if ((nowDate.getFullYear() - parseInt(strYear,10)) > 150|| nowDate - new Date(
					strYear + "-" + strMonth + "-" + strDay) < 0) {
		//errorInfo = "身份证生日不在有效范围。";console.log("errorInfo="+errorInfo);
		return false;
	}
	
	// =====================(end)=====================

	// ================ 地区码时候有效 ================
	var area = {
			11 : "北京",
			12 : "天津",
			13 : "河北",
			14 : "山西",
			15 : "内蒙古",
			21 : "辽宁",
			22 : "吉林",
			23 : "黑龙江",
			31 : "上海",
			32 : "江苏",
			33 : "浙江",
			34 : "安徽",
			35 : "福建",
			36 : "江西",
			37 : "山东",
			41 : "河南",
			42 : "湖北",
			43 : "湖南",
			44 : "广东",
			45 : "广西",
			46 : "海南",
			50 : "重庆",
			51 : "四川",
			52 : "贵州",
			53 : "云南",
			54 : "西藏",
			61 : "陕西",
			62 : "甘肃",
			63 : "青海",
			64 : "宁夏",
			65 : "新疆",
			71 : "台湾",
			81 : "香港",
			82 : "澳门",
			91 : "国外"
		};				
					
	if (!area[parseInt(IDStr.substr(0, 2),10)]) {
		//errorInfo = "身份证地区编码错误。";console.log("errorInfo="+errorInfo);
		return false;
	}
	// ==============================================

	// ================ 判断最后一位的值 ================
	//var TotalmulAiWi = 0;
	//for (var i = 0; i < 17; i++) {
	//	TotalmulAiWi = TotalmulAiWi+ parseInt(Ai[i],10)* parseInt(Wi[i],10);
	//}
	//var modValue = TotalmulAiWi % 11;
	//var strVerifyCode = ValCodeArr[modValue];
	//Ai = Ai + strVerifyCode;

	//if (IDStr.length == 18) {
	//	if (Ai != IDStr) {
	//		//errorInfo = "身份证无效，不是合法的身份证号码";console.log("errorInfo="+errorInfo);
	//		return false;
	//	}
	//} else {
	//	return true;
	//}

	// =====================(end)=====================
	return true;
	
}

function isNumeric(str) {
	var ereg = /^[0-9]*$/; 
	if (ereg.test(str)) {
		return true;
	} else {
		return false;
	}
}

function isDate(strDate) {

	var ereg = /^((\\d{2}(([02468][048])|([13579][26]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\\s(((0?[0-9])|([1-2][0-3]))\\:([0-5]?[0-9])((\\s)|(\\:([0-5]?[0-9])))))?$/;
	
	if (ereg.test(strDate)) {
		return true;
	} else {
		return false;
	}
}