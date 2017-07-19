var ctx=$("#ctx").val();
var isNewStudent;//0 新生  1 老生
var stuid;
$(document).ready(function(){
	$("#cardid").focus();
	cardidIsNotNUll();
	$("#cardid").keypress(function(event) {
		if(event.keyCode==13){  
			checkCardid(); 
		} 
	});
	$("#cardid").blur(function(){
		checkCardid();
	})
	$("#stuSaveOrUpdate").click(function(){
		stuSaveAndBindCardOrUpdateStuInfo();
	});
	$("#select-bj").change(function(){
		getStuListByBjid();
	});
	$("#select-stu").change(function(){
		getStuInfoByStuid();
	});
	$("select [name=sfxm]").change(function(){
		updateSfxmRow(this);
	});
	$("#saveXzfjf").click(function(){
		saveXzfjf();		
	});
});

function cardidIsNotNUll(){
	if($("#cardid").val()!="")
		checkCardid();
}

/*——————————————————表格 相关 显示 计算 操作 start————————————————————————————*/
function updateSfxmRow(obj){
	var id=$(obj).val();
	var price;
	var unitname;
	var price=$(obj).find("option[value="+id+"]").attr("price");
	var unitname=$(obj).find("option[value="+id+"]").attr("unitname");
	$(obj).parent().next().html(unitname);
	$(obj).parent().next().next().html(price);
	$(obj).parent().next().next().next().html("<input oninput='computOne(this)' onpropertychange='computOne(this)' name='count' value='0' size='8' />");
	$(obj).parent().next().next().next().next().html("0");
}
function computOne(obj){
	var count=parseFloat($(obj).val());
	if(isNaN(count) || count==0 || count>1000){
		$(obj).parent().next().text("0");
		alert("数量输入错误，请重新输入");		
		return;
	}
	var price=parseFloat($(obj).parent().prev().text());
	var total=price*count;
	$(obj).parent().next().text(total);
	var totalMoney=0;	
	var length=$("#sfxm-table tr").length;
	for(var i=1;i<length-1;i++){
		var temp=$("#sfxm-table tr").eq(i).find("td").eq(5).text();
		totalMoney+=parseInt(temp);
	}
	$("#totalMoney").text(totalMoney);
}
function flushTotalMoney(){
	var objs=$("#sfxm-table tr");
	var total=0;
	for(var i=1;i<objs.length-1;i++){
		var price=objs.eq(i).find("td").eq(3).text();
		var count=objs.eq(i).find("td").eq(4).find("input").val();
		var sTotal=parseInt(price)*parseInt(count);
		if(sTotal==0){
			if(objs.length>3){
				objs.eq(i).remove();
			}			
		}			
		else{
			objs.eq(i).find("td").eq(5).text(sTotal);
			total+=sTotal;
		}		
	}
	$("#totalMoney").text(total);
}
function deleteSfxmInput(obj){
	var sub=$(obj).parent().prev().text();
	var total=$("#totalMoney").text();
	$("#totalMoney").text(parseInt(total)-parseInt(sub));
	$(obj).parent().parent().remove();
}
function createSfxmInput(obj){		
	var xuhao=parseInt($(obj).parent().parent().children().eq(0).text())+1;
	var sfxm=$(obj).parent().parent().children().eq(1).html();
	var unitname=$(obj).parent().parent().children().eq(2).html();
	var price=$(obj).parent().parent().children().eq(3).html();
	var count=$(obj).parent().parent().children().eq(4).html();
	var total=$(obj).parent().parent().children().eq(5).html();
	var opretion='<button onclick="createSfxmInput(this)" style="color:blue">添加</button>&nbsp;&nbsp;&nbsp;<button onclick="deleteSfxmInput(this)" style="color:red">删除</button>';
	var content="<tr><td>"+xuhao+"</td><td>"+sfxm+"</td><td>"+unitname+"</td><td>"+price+"</td><td>"+count+"</td><td>"+total+"</td><td>"+opretion+"</td></tr>";
	$(obj).parent().parent().after(content);
	$next=$(obj).parent().parent().next().children().eq(5).html("0");
}
/*——————————————————表格 相关 显示 计算 操作 结束 end————————————————————————————*/

function checkToSave(jsonDataString){
	datas=eval(jsonDataString);
	var sfxms="";
	for(var i=0;i<datas.length;i++){
		var json=JSON.parse(datas[i]);
		sfxms+=json.sfxmname+" "+json.count+",   ";
	}
	var content="缴费信息：\n";
	content+="班级："+$("#bj-info").text()+"\n";
	content+="姓名："+$("#xm-info").text()+"\n";
	content+="收费项目："+sfxms+"\n";
	content+="合计："+$("#totalMoney").text()+"元";
	if(confirm(content)){
		return true;
	}
	return false;
}

/*保存 缴费信息, 将缴费数据list， 以json 传后台*/
function saveXzfjf(){
	flushTotalMoney();
	//判断金额是否为0 为0 则返回
	if($("#totalMoney").text()==0){
		alert("请选择收费项目，并选择数量");
		return;
	}
	var jsonStringArray=new Array();
	var json;
	
	var stuid=$("#stuid-info").val();
	if(stuid=="" || stuid==null){
		alert("请选择要缴费的学生");
		return;
	}		
	var bjid=$("#bjid-info").val();
	var campusid=$("#campusid").val();
	var $sfxms=$("#sfxm-table tr");
	var length=$sfxms.length;
	var count=0;
	for(var i=1;i<length-1;i++){
		$tds=$sfxms.eq(i).children();
		if($tds.eq(5).text()!="0"){
			var sfxmid=$tds.eq(1).find("select").val();
			sfxmname=$tds.eq(1).find("select").find("option[value="+sfxmid+"]").text().split("-")[0];
			json={
					"stuid":stuid,
					"bjid":bjid,
					"campusid":campusid,
					"sfxmid":sfxmid,
					"sfxmname":sfxmname,
					"price":$tds.eq(1).find("select").find("option[value="+sfxmid+"]").attr("price"),
					"unitname":$tds.eq(1).find("select").find("option[value="+sfxmid+"]").attr("unitname"),
					"count":$tds.eq(4).find("input[name=count]").val(),
			}
			jsonStringArray.push(JSON.stringify(json));
		}
	}	
	if(checkToSave(jsonStringArray)){
		var url=ctx+"/xtgl/xzfjfgl/ajax_saveXzfjfList";	
		$.post(url,{"xzfjfDataString[]":jsonStringArray},function(data){
			alert("保存成功");
			history.back();
		});
	};	
}
/*根据用户选择的学生，获取学生信息，并显示。*/
function getStuInfoByStuid(){
	var stuid=$("#select-stu").val();
	if(stuid=="" || stuid==null) return;
	var url=ctx+"/xtgl/xzfjfgl/ajax_getStuInfoByStuid?stuid="+stuid;
	$.get(url,function(data){
		data=eval("("+data+")");
		$("#cardid").val("");
		$("#cardid_check").html("");
		//展示当前选择的学生信息，供管理员核对
		displayStuInfo(data);
	});
}
//将学生对象数据，展示出来
function displayStuInfo(data){
	$("#stuid-info").val(data.id);
	$("#bjid-info").val(data.bjid);
	$("#bj-info").html(data.bjid_ch);
	$("#xm-info").html(data.xm);
	$("#salt-info").html(data.salt);
	$("#phonenum-info").html(data.phonenum);
	var xb;
	if(data.xb==1) xb='男';
	else xb='女';
	$("#xb-info").html(xb);
	$("#age-info").html(data.age);
	$("#birthday-info").html(data.birthday);
	$("#idcard-info").html(data.idcard);
	$("#hj-info").html(data.hj);
	$("#address-info").html(data.address);	
}
//根据班级id 查找班上所有学生
function getStuListByBjid(){
	var bjid=$("#select-bj").val();
	if(bjid=="" || bjid==null) return;
	var url=ctx+"/xtgl/xzfjfgl/ajax_getStuListByBjid?bjid="+bjid;
	$.get(url,function(data){
		var datas=eval(data);
		for(var i=0;i<datas.length;i++)
			$("#select-stu").append("<option value='"+datas[i].id+"'>"+datas[i].xm+"</option>");
	});
}



//校验cardid 必须10位数字才有效
function checkCardid(){
	var cardid=$("#cardid").val();
	if(cardid==""){
		$("#cardid_check").html("");
		return;
	}else if(cardid.match(/^\d{10}$/)==null){
		$("#cardid_check").html("您输入的卡号有误！");
		return;
	}else{
		$("#cardid_check").html("");
		searchStuInfoByCardid(cardid);
	}
}
//刷卡或输入卡号，根据卡号从服务器查找，与该卡，关联的学生信息。 
//1.如果是空卡，则提示新增学生   	0
//2.如果该卡有学生使用，则返回该学生信息。 并显示，并将该卡号保存起来	学生信息
//3.如果是其他已使用的卡，则提示重新输入卡号	1 2
function searchStuInfoByCardid(cardid){
	var url=ctx+"/xtgl/xzfjfgl/ajax_searchStuInfoByCardid";
	$.post(url,{"cardid":cardid},function(data){
		if(data==0){
			location.href=ctx+"/xtgl/xzfjfgl/toSaveNewStuAndBindCardForm?campusid="+$("#campusid").val()+"&cardNumber="+cardid;
			isNewStudent=1;
		}else if(data==1){
			alert("这张卡是老师在使用的卡");
		}else if(data==2){
			alert("无效的卡");
		}else{
			isNewStudent=0;
			data=eval("("+data+")");
			$("#kh").val(cardid);
			displayStuInfo(data);
		}
	})
}
function closeForm(){
	location.href=ctx+"/xtgl/xzfjfgl";
}