var ctx="";

var TablesDatatables = function() {

    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();

$(document).ready(function() {
	
	$("#saveSubmit").click(function() {	// 点击保存按钮
		
		$('#xsjb-form').validate({
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
	        	bh: {
	                required: true
	            },
	            xm: {
	                required: true
	            },
	            salt: {
	                required: true
	            },
	        },
	        messages: {
	        	bh: {
	                required: '请填写学生编号'
	            },
	            xm: {
	                required: '请填写学生姓名'
	            },
	            salt: {
	                required: '请填写学生密钥'
	            },
	        },
	    });
	});
});
function getBjsjList(){
	var url=ctx+"/xtgl/bjsj/findBjsjByCampusId";
	var submitData = {
		search_LIKE_campusid: $("#campusid").val()+""
	}; 
	$.post(url,
		submitData,
      	function(data){
			var datas = eval(data);
			$("#bjid option").remove();//user为要绑定的select，先清除数据   
	        for(var i=0;i<datas.length;i++){
	        	$("#bjid").append("<option value=" + datas[i].id + ">"
	        			+ datas[i].bj + "</option>");
	        };
    });
}


