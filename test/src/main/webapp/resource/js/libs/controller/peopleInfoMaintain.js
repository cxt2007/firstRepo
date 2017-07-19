TQ.peopleInfoMaintain = function(){
//	$("#indexCommonView").newplaceholder();
	function viewBirthDay(value) {
	 	var birthday = getBirthDayTextFromIdCard(value)
		$("#birthday").val(birthday);
		$("#gender").val(setGender(value));
		$("#genderHidden").val(setGender(value));
		$("#age").val(setAge(birthday));
	 };
	 $('#idcardNum').blur(function(){
		 var value=$(this).val();
		 viewBirthDay(value);
	 })
	 
	 if($("#peopleInfoId").val() != ""){
		 $("#name").attr("readonly","readonly");
		 $("#idcardNum").attr("readonly","readonly");
	 }
	
	
	$(".ui-layout-west").height($(".ui-layout-center").height());
	//定位到第一个验证错误的地方errorInput
	$("#formSubmit").click(function(){
		setTimeout(function(){
			if($(".errorInput").length>0){
				var offsetTop = $(".errorInput:first").offset().top,
					winHeight = $(window).height(),
					winSolTop = $(window).scrollTop();
				if(winSolTop>offsetTop){
					$(window).scrollTop(offsetTop);
				}
				//console.log(offsetTop+"   "+winHeight+"  "+winSolTop);
			}
		},1000)		
	})
	
	var viewType = $("#viewType").val();
	if(!viewType && $("#peopleInfoId").val()=="" ){
		$("#bannerReturn").addClass("hidden");
	}
	//返回
    $("#bannerReturn").click(function(event){	
    	$.ajax({
    		url:"/peopleInfo/list/view",
    		async:false,
    		type:"GET",
    		data:{},
    		success:function(data){
    			if(data){
    				//$("#idB1F58DD217D746D99718CCDECBCF0BC5").addClass("reload");//准备在新增页面的时候，老年人档案被点击
    				$("#indexCommonView").html("").html(data);
    				setTimeout(function(){
    					$(".ui-layout-west").height($(".ui-layout-center").height());
    				},600)
    			}
    		}
    	});
    });
	
	
	
	
	
	viewBirthDay($("#idcardNum").val());
	
	$("#formSubmit").click(function(){
		$("#indexCommonView").clearNewplaceholder();
	    $('#maintainForm').submit();
	});
	$("#maintainForm").formValidate({ 
		 submitHandler: function(form) {
			 var orgId=$("#resideCommunity").find("option:selected").attr("id");
			 $("#orgId").val(orgId);
			 $(form).ajaxSubmit({
	            success: function(data){
	            	if(data.error){
	            		$.messageBox({level:"warn",message:data.error});
	            	}else{
	            		if(data.result){
		            		var t=new Date().getTime();
		            		if($("#peopleInfoId").val()!="" || viewType=='2'){
		            			window.location.href="/index#3947792FD5944AD8B9D26EB61EFAF17A?t="+t;
		            		}else{
		            			window.location.href="/index#04FE3FAE18E14309A0A0D56B9EDDBB32?t="+t;
		            		}
		            		$.messageBox({level:"success",message:'保存成功'});
		            	}else{
		            		data = JSON.parse(data);
		            		if(data.msg){
		            			$.messageBox({level:"warn",message:data.msg});
		            		}else{
		            			$.messageBox({level:"warn",message:'提交错误'});
		            		}
		            	}
	            	}
	            	
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown){
	            	$.messageBox({level:"warn",message:'提交错误'});
	            }
	        });
	    },
	    errorHandler:function(){
	    }
	});
	//初始化户籍地
	threeSelect({
		province:'district',
		city:'town',
		district:'community',
		provinceValue:$('#districtValue').val(),
		cityValue:$('#townValue').val(),
		districtValue:$('#communityValue').val(),
		firstId:$('#firstId').val()
	});
	
	//初始化现居地址
	threeSelect({
		province:'resideDistrict',
		city:'resideTown',
		district:'resideCommunity',
		provinceValue:$('#resideDistrictValue').val(),
		cityValue:$('#resideTownValue').val(),
		districtValue:$('#resideCommunityValue').val(),
		firstId:$('#firstId').val()
	});
	
	//居住地址非本市，隐藏后三项下拉框
	var isThisCity= function(self){
		var val = self.find("option:selected").val();
		if(val=="2"){
			self.next(".resideBox").addClass("hidden").insertBefore("#maintainForm");
		}else{
			$("#conBox").find(".resideBox").insertAfter("#whichDistrict").removeClass("hidden");
		}
	}
	$("#whichDistrict").change(function(){
		var self= $(this);
		isThisCity(self);
	});
	isThisCity($("#whichDistrict"));
	//户口非本市，隐藏后三项下拉框
	var isLocalRegister= function(self){
		var val = self.find("option:selected").val();
		if(val=="2"){
			self.next(".localResideBox").addClass("hidden").insertBefore("#maintainForm");
		}else{
			$("#conBox").find(".localResideBox").insertAfter("#isLocalRegister_input").removeClass("hidden");
		}
	}
	$("#isLocalRegister_input").change(function(){
		var self= $(this);
		$("#isLocalRegister").val(self.val());
		isLocalRegister(self);
	});
	$("#isLocalRegister").change(function(){
		var self= $("#isLocalRegister_input");
		self.val($("#isLocalRegister").val());
		isLocalRegister(self);
	});
	isLocalRegister($("#isLocalRegister_input"));
	//验证身份证号是否可用
	jQuery.validator.addMethod("checkIdCard", function(value, element){
		if($("#idcardNumOld").val()==value && $("#nameOld").val()==$("#name").val()){
			return true;
		}
		var flag = true;
		$.ajax({
			async:false,
			url:PATH+"/peopleInfo/isIdCardExists",
			type:"POST",
			data:{"idCard":value,"name":$("#name").val()},
			success:function(data){
				flag = data.data;
			}
		})
		return !flag;
	 });
}