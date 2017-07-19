var ctx="";
var pyjc='';

var TablesDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
		
	KindEditor.ready(function(K) {
		var editor1 = K.create('textarea[name="description"]', {
			cssPath : ctx+'/static/kindeditor/plugins/code/prettify.css',
			uploadJson : ctx+'/filehandel/kindEditorUpload/org/image',
			fileManagerJson : ctx+'/filehandel/kindEditorFileManager',
			allowFileManager : true,
			afterCreate : function() {
				var self = this;
				K.ctrl(document, 13, function() {
					self.sync();
					document.forms['org_form'].submit();
				});
				K.ctrl(self.edit.doc, 13, function() {
					self.sync();
					document.forms['org_form'].submit();
				});
			},
		});
	});
	
	
	$("#saveSubmit").click(function() {	// 点击保存按钮
		$('#org_form').validate({
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
	        	orgname: {
	                required: true
	            },
	            orgcode: {
		            required: true,
		        },
		        pyjc: {
		        	required: true,
		        },
	        },
	        messages: {
	        	orgname: {
	                required: '请填写学校名称'
	            },
	            orgcode: {
		            required: '请填写学校代码'
		        },
		        pyjc: {
		            required: '请填写学校简称',
		        },
	        },
	    });
		
//		var agentuserids = $("#agentuserids").val();
//		if(agentuserids==null || agentuserids==''){
//			alert("管理授权未选择");
//			return false;
//		}else{
//			return true;
//		}
		
		if(confirm("是否确定保存?")){
			return true;
		}
		return false;
	});
	
	$("#province").change(function(){
		var url=ctx+"/base/findCityByProvince";
		var submitData = {
			dictcode: $("#province").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				$("#city option").remove();//user为要绑定的select，先清除数据   
		        for(var i=0;i<datas.length;i++){
		        		$("#city").append("<option value=" + datas[i].dictcode+" >"
			        			+ datas[i].dictname + "</option>");
		        	
		        };
		        $("#city").find("option[index='0']").attr("selected",'selected');
		        $("#city").trigger("chosen:updated");
		        
	    });
	});
	
});

function checkPyjc(){
	if($("#pyjc").val()==""){
		pyjc = '请填写学校简称';
	}
	var a=true;
    jQuery.ajax({
    	type:"get",
    	url:ctx+"/xtgl/orgsj/checkOrgPyjc",
    	async:false,cache:false,
	    data:{ 
	    	pyjc:$("#pyjc").val(),
	    	id:$("#orgcode").val(),
	    	method:"get"
	    },dataType:"html",scriptCharset:"UTF-8",
	    success:function(s){
		    if(s!="true"){
		        a=false;
		    }
	    }
    });
    if(a!=true){
    	pyjc = '学校简写已经被占用！';
    	alert($("#pyjc").val()+pyjc);
    	$("#pyjc").val('');
    }
}
