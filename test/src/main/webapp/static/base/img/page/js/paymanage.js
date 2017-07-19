/*
 *  Document   : paymanage.js
 *  Author     : hbz
 *  Description: 代理费用管理你页面JS
 */
var ctx=""
var paymanage = function() {
    return {
        init: function(jsp_ctx) {
        	ctx=jsp_ctx;
        }
    };
}();


$(document).ready(function() {
	
	

	/**
	 * 
	 */
	$("#payconfig-org-chosen").change(function() {
		
		generate_payconfig_table();
	});
	

	$("#payConfigQueryBtn").click(function() {
		
		generate_payconfig_table();
	});
	
	
	$("#fwfsz-campus-chosen").change(function() {
		
		generate_payconfig_table();
	});
	
	$("#fwfsz-xqbm-chosen").change(function() {
		
		generate_payconfig_table();
	});
	
	$("#payanalyzeQueryBtn").click(function() {
		
		generate_payanalyze_table();
	});
	
	$("#paymanage-org-chosen").change(function() {
		
		getCampusList();
		
		
	});
	
	$("#paymanage-campus-chosen").change(function() {
		
		getBjsjList();
	});
	
	$("#payConfigBtn").click(function() {
	
		$('#modal-payconfig').modal('show');
	});
	
	$("#payQueryBtn").click(function() {
		
		generate_paymanage_table();
	});
	
	
//	$("#payManageBtn").click(function() {
//		
//		
//		
//		$('#quickPayDiv').html("<legend style='padding:2px 2px 2px 2px;color:red'>批量缴费将覆盖系统已有的缴费记录,并且只针对当前学期,请慎重</legend>");
//		$("#paymanageform-bjids-div").css("display","block");
//		if($("#paymanage-campus-chosen").val()==""){
//			alert("请选择校区");
//			return false;
//		}
//		$('#paymentModelLabel').html($("#paymanage-campus-chosen").find("option:selected").text()+"批量缴费");
//		
//		$("#batchtype").val(2);
//		$('#paymentModel').modal('show');
//		//disableSaveBtn();;
//	});
	
	
	$("#ajaxSavePayment").click(function() {
		//验证收费填写界面
		 $('#paymentForm').validate({
	        errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
	        errorElement: 'div',
	        errorPlacement: function(error, e) {
	            e.parents('.form-group > div').append(error);
	        },
	        highlight: function(e) {
	            $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
	            $(e).closest('.help-block').remove();
	        },
	        success: function(e) {
	            // You can use the following if you would like to highlight with green color the input after successful validation!
	            e.closest('.form-group').removeClass('has-success has-error'); // e.closest('.form-group').removeClass('has-success has-error').addClass('has-success');
	            e.closest('.help-block').remove();
	        },
	        rules: {
	        	paymanageform_bjids: {
	                required: true
	            },
	            totalfee1: {
		            required: true,
		            number: true
		        }
	        },
	        messages: {
	        	paymanageform_bjids: {
	                required: '请选择园所'
	            },
	            totalfee1: '请输入一个数字!'
	        },
	        submitHandler:function(form){
	        	savePayment();
	        }  
	    });
		
	});
	
	//缴费开通操作
	function savePayment(){
		if(confirm("是否确定继续操作?")){
			var batchtype=$("#batchtype").val();
			if(batchtype==1){
				updatePaymentSingle();
			}else if(batchtype==2){
				updatePaymentBatch();
			}
			$('#paymentModel').modal('hide');
			 return false;
		}else{
			return false;
		} 
	}
	
	$("#saveSubmit").click(function() {
		//return $('#payconfig-form').submit();
		//验证设置每学期服务费标准页面
		 $('#payconfig-form').validate({
	        errorClass: 'help-block animation-slideDown', // You can change the animation class for a different entrance animation - check animations page
	        errorElement: 'div',
	        errorPlacement: function(error, e) {
	            e.parents('.form-group > div').append(error);
	        },
	        highlight: function(e) {
	            $(e).closest('.form-group').removeClass('has-success has-error').addClass('has-error');
	            $(e).closest('.help-block').remove();
	        },
	        success: function(e) {
	            // You can use the following if you would like to highlight with green color the input after successful validation!
	            e.closest('.form-group').removeClass('has-success has-error'); // e.closest('.form-group').removeClass('has-success has-error').addClass('has-success');
	            e.closest('.help-block').remove();
	        },
	        rules: {
	            payConfigCharge: {
		            required: true,
		            number: true
		        }
	        },
	        messages: {
	        	payConfigCharge: '请输入一个数字!'
	        },
	        submitHandler:function(form){
	            payConfigSava();
	        }  
	    });
		
	});
	
	
		
});




// 学生id，姓名，班级，费用，缴费记录id
function openPaymentDialog(stuid,stuname,bjmc,totalfee,payid,remark){
	$('#quickPayDiv').html("");
	$("#paymanageform-bjids-div").css("display","none");
	$('#paymentModelLabel').html(
			"缴费:" + bjmc + stuname);
	
	$("#payid").val(payid);
	$("#stuid").val(stuid);
	/* $("#remark").val(remark); */
	$("#totalfee1").val(totalfee);
	$("#batchtype").val(1);
	$('#paymentModel').modal('show');
	
	//disableSaveBtn();
}

function openBjPaymentBatch(xqmc,xqbm){
	if(xqbm==""){
		alert("请进入[校区初始化]设置当前学期");
	}
	
	var campus=$("#paymanage-campus-chosen").find("option:selected").text();
	
	var bjmc=$("#paymanage-bjsj-chosen").find("option:selected").text();
	if(campus=="" || bjmc==""){
		alert("请选择校区和班级");
		return;
	}
	if (confirm("是否确认批量开通:\n校区:["+campus+"]\n班级:["+bjmc +"]\n当前学期:["+xqmc +"]\n,未缴费的学生?")) {
		
	}else{
		return false;
	}
	
	var url=ctx+"/payref/ajax_update_bjquick";
	var submitData = {
			xqbm: xqbm,
			bjids: $("#paymanage-bjsj-chosen").val(),
			campusid: $("#paymanage-campus-chosen").val()
		}; 
	  $.post(url,
		  submitData,
	      function(data){
	    	 alert(data); 
	     });
}

function updatePaymentBatch(){
	
	var totalfee = $("#totalfee1").val();
	var xqbm = $("#xqbm").val();
	var url=ctx+"/payref/ajax_update_quick";
	var submitData = {
			totalfee: totalfee,
			xqbm: xqbm,
			bjids: $("#paymanageform_bjids").val().toString(),
			campusid: $("#paymanage-campus-chosen").val()
		}; 
	  $.post(url,
		  submitData,
	      function(data){
	    	 alert(data); 
	     });
}

function updatePaymentSingle(){
	
	var payid = $("#payid").val();
	var stuid = $("#stuid").val();
	var totalfee = $("#totalfee1").val();
	var xqbm = $("#xqbm").val();
	var url=ctx+"/payref/ajax_update_single";
	
	var submitData = {
			id: payid,
			totalfee: totalfee,
			xqbm: xqbm,
			stuid:stuid
		}; 
	
	  $.post(url,
		  submitData,
	      function(data){
	    	 alert(data); 
	    	 $('#paymentModel').modal('hide');
	    	 generate_paymanage_table();
	     });
}




 function generate_payconfig_table(){
	
     /* Initialize Datatables payconfig-org-chosen*/
	 var campusids=$("#fwfsz-campus-chosen").val();
	 var xqbm=$("#fwfsz-xqbm-chosen").val();
	 var xqmc = $("#fwfsz-xqbm-chosen").find("option:selected").text();
     var sAjaxSource=ctx+"/payref/ajax_query_payconfig?campusids="+campusids+"&xqbm="+xqbm;
     $('#payconfig-datatable').dataTable({
         //"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 1, 5] } ],
         "iDisplayLength": 50,
         "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
         "bFilter": false,
         "bLengthChange": false,
         "bDestroy":true,
         "bSort" : false,
         "bAutoWidth":false,
         "sAjaxSource": sAjaxSource,
         "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
 			var charge = aaData[4]/100;
 			if(aaData[6]==null){
 	        	$('td:eq(2)', nRow).html("未设置");
 			}else{
 	        	$('td:eq(2)', nRow).html(charge);
 			}
        	$('td:eq(1)', nRow).html(xqmc);
        	// 设置服务
			var editHtml = '<div class="btn-group btn-group-xs"><a href="javascript:openSetPayConfigModal(\''+ aaData[0] + '\',\''+aaData[1]+'\',\''+charge+'\',\''+xqbm+'\',\''+xqmc+'\',\''+aaData[6]+'\');">设置学期服务费</a></div>';
			$('td:eq(4)', nRow).html(editHtml);
 			return nRow;
 		 },
 		
         "aoColumns": [
   		            {"sTitle":"园所","sClass": "text-center","sWidth": "200px", "mDataProp": "0"},
   		            {"sTitle":"学期","sClass": "text-center","mDataProp": "5"},
   		            {"sTitle":"每个学期金额(单位:元)","sWidth": "200px", "sClass": "text-center","mDataProp": "4"},
   		         	{"sTitle":"登记人","sClass": "text-center","mDataProp": "2"},
   		         	{"sTitle":"登记时间","sClass": "text-center","mDataProp": "3"}
   		        ] 
     });
 }
 
 function generate_paymanage_table(){
	
     /* Initialize Datatables */
     var param="orgcode="+$("#paymanage-org-chosen").val();
     param=param+"&campusid="+$("#paymanage-campus-chosen").val();
     param=param+"&bjid="+$("#paymanage-bjsj-chosen").val();
     param=param+"&xqbm="+$("#paymanage-xq-chosen").val();
     var sAjaxSource=ctx+"/payref/ajax_query_paylog?"+param;
     $('#paymanage-datatable').dataTable({
         "iDisplayLength": 70,
         "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
         "bFilter": false,
         "bLengthChange": false,
         "bDestroy":true,
         "bAutoWidth":false,
         "sAjaxSource": sAjaxSource,
         "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
 			 //Append the grade to the default row class name
 			//alert(aaData.bjid);
 			var payButtonHtml='<div class="btn-group btn-group-xs"><a href="#"  onclick="openPaymentDialog(\''+aaData.stuid+'\',\''+aaData.stuName+'\',\''+aaData.bjmc+'\',\''+aaData.totalfee+'\',\''+aaData.payid+'\',\''+aaData.remark+'\');" data-toggle="tooltip" title="续费" class="btn btn-default"><i class="fa fa-pencil"></i></a><a href="#"  onclick="updatePaymentSingleDefault(\''+aaData.stuid+'\',\''+aaData.stuName+'\',\''+aaData.bjmc+'\',\''+aaData.totalfee+'\',\''+aaData.payid+'\',\''+aaData.remark+'\');" data-toggle="tooltip" title="开通" class="btn btn-default">开通</a><a href="#"  onclick="updatePaymentSingleDefault(\''+aaData.stuid+'\',\''+aaData.stuName+'\',\''+aaData.bjmc+'\',\'999\',\''+aaData.payid+'\',\''+aaData.remark+'\');" data-toggle="tooltip" title="关闭" class="btn btn-default">关闭</a></div>';
 			 
/*          			$('td:eq(1)', nRow).html('<input type="checkbox" id="chk_list'+aaData.stuid+ '" name="chk_list" value='+aaData.stuid+'>');
*/         			
		    if(aaData.totalfee=="0"){
	 			payButtonHtml='<div class="btn-group btn-group-xs"><a href="#"  onclick="openPaymentDialog(\''+aaData.stuid+'\',\''+aaData.stuName+'\',\''+aaData.bjmc+'\',\''+aaData.totalfee+'\',\''+aaData.payid+'\',\''+aaData.remark+'\');" data-toggle="tooltip" title="续费" class="btn btn-default"><i class="fa fa-pencil"></i></a><a href="#"  onclick="updatePaymentSingleDefault(\''+aaData.stuid+'\',\''+aaData.stuName+'\',\''+aaData.bjmc+'\',\''+aaData.totalfee+'\',\''+aaData.payid+'\',\''+aaData.remark+'\');" data-toggle="tooltip" title="开通" class="btn btn-default">开通</a></div>';

		    	$('td:eq(3)', nRow).html("未开通");
		    }else{
	 			payButtonHtml='<div class="btn-group btn-group-xs"><a href="#"  onclick="updatePaymentSingleDefault(\''+aaData.stuid+'\',\''+aaData.stuName+'\',\''+aaData.bjmc+'\',\'999\',\''+aaData.payid+'\',\''+aaData.remark+'\');" data-toggle="tooltip" title="关闭" class="btn btn-default">关闭</a></div>';

		    }
			$('td:eq(7)', nRow).html(payButtonHtml);
    
 			
 			return nRow;
 		},
 		
         "aoColumns": [
      					{"sTitle":"序号","sWidth": "55px","sClass": "text-center","mDataProp": "rownum"},
      					/* { "sWidth": "120px","sClass": "text-center","mDataProp": "bjmc"}, */
      		            {"sTitle":"班级","sWidth": "100px","sClass": "text-center","mDataProp": "bjmc"},
      		            {"sTitle":"姓名","sWidth": "80px","sClass": "text-center","mDataProp": "stuName"},
      		            {"sTitle":"本学期缴纳(单位:元)","sWidth": "100px", "sClass": "text-center","mDataProp": "totalfee"},
      		          	{"sTitle":"支付方式","sWidth": "100px","sClass": "text-center","mDataProp": "paytype"},
      		         	{"sTitle":"支付时间","sClass": "text-center","mDataProp": "createtime"},
      		         	{"sTitle":"操作人","sClass": "text-center","mDataProp": "creator"},
      		         	{"sTitle":"操作","sClass": "text-center","mDataProp": "creatorid"}
      		        ] 
     
     });
 } 
   
 
 function generate_payanalyze_table(){
	
     /* Initialize Datatables */
	 var rownum=1;
     var param="orgcode="+$("#payanalyze-org-chosen").val();
     param=param+"&xqbm="+$("#payanalyze-xq-chosen").val();
     var sAjaxSource=ctx+"/payref/ajax_query_payanalyze?"+param;
     var aaSorting = [[3,'desc']];
     $('#payanalyze-datatable').dataTable({
    	 "aaSorting":aaSorting,
         "iDisplayLength": 70,
         "aLengthMenu": [[10, 20, 30, -1], [10, 20, 30, "All"]],
         "bFilter": false,
         "bLengthChange": false,
         "bDestroy":true,
         "bAutoWidth":false,
         "sAjaxSource": sAjaxSource,
         "fnRowCallback": function( nRow, aaData, iDisplayIndex ) {

			if(aaData[12]=='0'){
					//alert(aaData.obj12);
					//jQuery(this).css('background-color','#5bc0de');
			}
			$('td:eq(0)', nRow).html(rownum);
			rownum=rownum+1;	
 			return nRow;
 		},

         "aoColumns": [
      					{"sTitle":"序号","sWidth": "60px","sClass": "text-center","mDataProp": "0"},
      					{"sTitle":"分组名称","sWidth": "140px","mDataProp": "0"},
      		            {"sTitle":"在校生数量","sClass": "text-center","mDataProp": "4"},
      		            {"sTitle":"已绑定数量","sClass": "text-center","mDataProp": "5"},
      		            {"sTitle":"已缴费数量","sWidth": "100px", "sClass": "text-center","mDataProp": "7"},
      		          	{"sTitle":"缴费标准","sClass": "text-center","mDataProp": "8"},
      		         	{"sTitle":"应收款(单位:元)","sClass": "text-center","mDataProp": "11"},//应收款
      		         	{"sTitle":"已收款","sClass": "text-center","mDataProp": "9"},//已收款
      		         	{"sTitle":"未收款","sClass": "text-center","mDataProp": "10"}//未收款
//      		         	{"sTitle":"层级","sWidth": "43px","sClass": "text-center","mDataProp": "3"}
      		        ] 
     
     });
 } 
 
 
 function getBjsjList(){
		var url=ctx+"/xtgl/bjsj/ajax_query_bjsjByCampusid";
		var submitData = {
			search_LIKE_campusid: $("#paymanage-campus-chosen").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				$("#paymanage-bjsj-chosen option").remove();//user为要绑定的select，先清除数据 
				//$("#paymanage-bjsj-chosen").append("<option value=''></option>");
				$("#paymanageform_bjids option").remove();//user为要绑定的select，先清除数据 
				$("#paymanageform_bjids").append("<option value=''></option>");
				//$("#paymanageform-bjids").html(""); 
				//("#paymanageform-bjids").chosen("destroy");
		        for(var i=0;i<datas.length;i++){
		        	$("#paymanage-bjsj-chosen").append("<option value=" + datas[i].id + ">" + datas[i].bj + "</option>");
		        	$("#paymanageform_bjids").append("<option value=" + datas[i].id + ">" + datas[i].bj + "</option>");
		        };
		        $("#paymanageform_bjids").attr("multiple",true); 
		        
		        $("#paymanage-bjsj-chosen").find("option[index='0']").attr("selected",'selected');
		        $("#paymanage-bjsj-chosen").trigger("chosen:updated");
	    });
	}
 
 function getCampusList(){
		var url=ctx+"/xtgl/campus/ajax_query_campusByOrgcode";
		var submitData = {
			search_EQ_orgcode: $("#paymanage-org-chosen").val()
		}; 
		$.post(url,
			submitData,
	      	function(data){
				var datas = eval(data);
				$("#paymanage-campus-chosen").empty();
				$("#paymanage-campus-chosen option").remove();//user为要绑定的select，先清除数据
	        	//$("#paymanage-campus-chosen").append("<option value=''></option>");

		        for(var i=0;i<datas.length;i++){
		        	$("#paymanage-campus-chosen").append("<option value=" + datas[i].id + ">" + datas[i].campus + "</option>");
		        };
		        $("#paymanage-campus-chosen").find("option[index='0']").attr("selected",'selected');
		        $("#paymanage-campus-chosen").trigger("chosen:updated");
		        
		        $("#paymanage-campus-chosen").change();
	    });
	}
 

function updatePaymentSingleDefault(stuid,stuname,bjmc,totalfee,payid,remark){
	
	var url=ctx+"/payref/ajax_update_single";
	var submitData = {
			id: payid,
			totalfee: totalfee,
			stuid:stuid
		}; 
	
	  $.post(url,
		  submitData,
	      function(data){
	    	 alert(data); 
	    	 generate_paymanage_table();
	     });
}

function openSetPayConfigModal(campus,campusid,charge,xqbm,xqmc,payConfigId){
	$('#payConfigXqmc').html(xqmc);
	$('#payConfigCampus').val(campus);
	$('#payConfigCampusid').val(campusid);
	$('#payConfigCharge').val(charge);
	$('#payConfigXqbm').val(xqbm);
	$('#payConfigId').val(payConfigId);
	$('#modal-payconfig').modal('show');
}

/**
 * 提交每个学期服务费设置
 * @returns {Boolean}
 */
function payConfigSava(){
	
	if(confirm("是否确定继续操作?")){
		var url=ctx+"/payref/ajax_save_payconfig";
		var payConfigId = $("#payConfigId").val();
		if(payConfigId=="null"){
			payConfigId="";
		}
		var submitData = {
			campusid: $("#payConfigCampusid").val(),
			xqbm: $("#payConfigXqbm").val(),
			charge: $("#payConfigCharge").val(),
			id: payConfigId,
		}; 
		$('#saveSubmit').attr('disabled','disabled');
		$.post(url,
			submitData,
	      	function(data){
				
				$('#saveSubmit').removeAttr('disabled');
				$('#modal-payconfig').modal('hide');
				generate_payconfig_table();
	    		return false;
	      });
		return false;
	}else 
		return false;
}
