var ctx="";
var xsjbDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	
	$("#saveXsjb").click(function() {
		if($("#serialnumber_xsjb").val() == undefined || $("#serialnumber_xsjb").val() == "" && $("#serialnumber_xsjb").val() == null){
			alert("导入数据存在错误，请检查后重新导入！");
			return;
		}
		displaySaveBtn(0);
		var url= ctx+"/xtgl/initdata/xsjbInfoAddBatch";
		var submitData = {
			serialnumber: $("#serialnumber_xsjb").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				alert(data);
				$("#xsjbImportInfo").html("");
				
	      });
		return false;
	});
});

function displaySaveBtn(state){
	if(state == 0){
		$("saveXsjb").css("display","none");
	}else{
		$("saveXsjb").css("display","block");
	}
	
}

function checkXsjbFileType(){
	
    var filepath=$("input[name='xsjbFile']").val();
    if(filepath==undefined||$.trim(filepath)==""){  
    	alert("请选择上传文件！");
       return;  
    }else{  
       var fileArr=filepath.split("//"); 
       var fileTArr=fileArr[fileArr.length-1].toLowerCase().split(".");  
       var filetype=fileTArr[fileTArr.length-1];  
       if(filetype!="xls"){  
    	    alert("上传文件必须为office 2003格式Excel文件！");
        	return;  
       } 
    }
    uploadXsjbFile();
}

function uploadXsjbFile() {
	progress();
	$.ajaxFileUpload({
		url: ctx+'/xtgl/initdata/xsjbInfoImport',	//需要链接到服务器地址
		secureuri:false,
		fileElementId: 'xsjbFile',					//文件选择框的id属性
		dataType:'json', 							//服务器返回的格式，可以是json
		success: function (data,status){
			$("#serialnumber_xsjb").val(data.serialnumber.replace("[","").replace("]",""));
			if($("#serialnumber_xsjb").val() != undefined && $("#serialnumber_xsjb").val() != "" && $("#serialnumber_xsjb").val() != null){
				document.getElementById("saveXsjb").style.display = "block";
			}else{
				document.getElementById("saveXsjb").style.display = "none";
			}
			var gridhtml = data.griddata.replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace("[","").replace("]","");
			$("#xsjbImportInfo").html(gridhtml);
			displaySaveBtn(1);
		},
		error: function(data,status){
			alert("error");
		}
	});
}

function progress(){
	 $("#loading")
		.ajaxStart(function(){
			setTimeout(function(){
	             $.messager.progress('close');
	         },15000);
		})
		.ajaxComplete(function(){
			
		});
}