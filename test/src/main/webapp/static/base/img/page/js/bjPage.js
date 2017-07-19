/**
 * lxb
 */
var ctx="";
var bjDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	
	$("#saveBj").click(function() {
		if($("#serialnumber").val() == undefined || $("#serialnumber").val() == "" && $("#serialnumber").val() == null){
			alert("导入数据存在错误，请检查后重新导入！");
			return;
		}
		var url= ctx+"/xtgl/initdata/bjsjInfoAddBatch";
		var submitData = {
			serialnumber: $("#serialnumber").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				alert(data);
				$("#bjsjImportInfo").html("");
				document.getElementById("saveBj").style.display = "none";
				
	      });
		return false;
	});
});

function checkFileType(){
	
    var filepath=$("input[name='bjsjFile']").val();
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
    uploadFile();
}

function uploadFile() {
	progress();
	$.ajaxFileUpload({
		url: ctx+'/xtgl/initdata/bjsjInfoImport',	//需要链接到服务器地址
		secureuri:false,
		fileElementId: 'bjsjFile',					//文件选择框的id属性
		dataType:'json', 							//服务器返回的格式，可以是json
		success: function (data,status){
			$("#serialnumber").val(data.serialnumber.replace("[","").replace("]",""));
			if($("#serialnumber").val() != undefined && $("#serialnumber").val() != "" && $("#serialnumber").val() != null){
				document.getElementById("saveBj").style.display = "block";
			}else{
				document.getElementById("saveBj").style.display = "none";
			}
			var gridhtml = data.griddata.replace(/\&lt;/g,"<").replace(/\&gt;/g,">").replace("[","").replace("]","");
			$("#bjsjImportInfo").html(gridhtml);
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