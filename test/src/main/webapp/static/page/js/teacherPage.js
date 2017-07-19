var ctx="";
var teacherDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	
	$("#saveTeacher").click(function() {
		if($("#serialnumber_tch").val() == undefined || $("#serialnumber_tch").val() == "" && $("#serialnumber_tch").val() == null){
			alert("导入数据存在错误，请检查后重新导入！");
			return;
		}
		var url= ctx+"/xtgl/initdata/userInfoAddBatch";
		var submitData = {
			serialnumber: $("#serialnumber_tch").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				alert(data);
				$("#teacherImportInfo").html("");
				document.getElementById("saveTeacher").style.display = "none";
				
	      });
		return false;
	});
});

function checkTeacherFileType(){
	
    var filepath=$("input[name='teacherFile']").val();
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
    uploadUserFile();
}

function uploadUserFile() {
	progress();
	$.ajaxFileUpload({
		url: ctx+'/xtgl/initdata/userInfoImport',	//需要链接到服务器地址
		secureuri:false,
		fileElementId: 'teacherFile',					//文件选择框的id属性
		dataType:'json', 							//服务器返回的格式，可以是json
		success: function (data,status){
			$("#serialnumber_tch").val(data.serialnumber.replace("[","").replace("]",""));
			if($("#serialnumber_tch").val() != undefined && $("#serialnumber_tch").val() != "" && $("#serialnumber_tch").val() != null){
				document.getElementById("saveTeacher").style.display = "block";
			}else{
				document.getElementById("saveTeacher").style.display = "none";
			}
			var gridhtml = data.griddata.replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace("[","").replace("]","");
			$("#teacherImportInfo").html(gridhtml);
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