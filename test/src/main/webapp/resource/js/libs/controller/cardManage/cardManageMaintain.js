$(function(){
	fourSelect({
		province:'city',
		provinceValue:$('#provinceValue').val(),
		city:'district',
		cityValue:$('#cityValue').val(),
		district:'town',
		districtValue:$('#districtValue').val(),
		street:'community',
		streetValue:$('#streetValue').val()
	});
	
	function fourSelect(config){
		var $s1=$("#"+config.province);
		var $s2=$("#"+config.city);
		var $s3=$("#"+config.district);
		var $s4=$("#"+config.street);
		getProvince(config);
		$s1.change(function(){
			clearOptions($s2);
			if(this.selectedIndex==-1 || this.options[this.selectedIndex].value==""){
				$s2.change();
				return;
			} 
			var s1_curr_val = this.options[this.selectedIndex].value;
			var s1_curr_id = this.options[this.selectedIndex].id;
			$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				async:false,
				data:{"id":s1_curr_id},
				success:function(data){
					var cityData = data.organizationList;						
					for(i=0;i<cityData.length;i++){
						$s2.append("<option id='"+ cityData[i].id +"' value='"+cityData[i].orgName+"'>"+cityData[i].orgName+"</option>");
					}
				}
			});
			$s2.change();
		});
		$s2.change(function(){
			clearOptions($s3);
			var s1_curr_val = $s1[0].options[$s1[0].selectedIndex].value;
			if(this.selectedIndex==-1 || this.options[this.selectedIndex].value==""){
				$s3.change();
				return;
			}
			var s2_curr_val = this.options[this.selectedIndex].value;
			var s2_curr_id = this.options[this.selectedIndex].id;
			$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				async:false,
				data:{"id":s2_curr_id},
				success:function(data){
					var districtData = data.organizationList;
					for(i=0;i<districtData.length;i++){
						$s3.append("<option id='"+ districtData[i].id +"' value='"+districtData[i].orgName+"'>"+districtData[i].orgName+"</option>");
					}
				}
			});
			$s3.change();
		});
		$s3.change(function(){
			clearOptions($s4);
			var s1_curr_val = $s1[0].options[$s1[0].selectedIndex].value;
			var s2_curr_val = $s2[0].options[$s2[0].selectedIndex].value;
			if(this.selectedIndex==-1 || this.options[this.selectedIndex].value=="") return;
			var s3_curr_val = this.options[this.selectedIndex].value;
			var s3_curr_id = this.options[this.selectedIndex].id;
			$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				async:false,
				data:{"id":s3_curr_id},
				success:function(data){
					var streetData = data.organizationList;	
					for(i=0;i<streetData.length;i++){
						$s4.append("<option id='"+ streetData[i].id +"' value='"+streetData[i].orgName+"'>"+streetData[i].orgName+"</option>");
					}
				}
			});
		});
	}

	
	function appendOptionTo($o,k,v,d){
		var $opt=$("<option>").text('请选择').val(k);
		if(k==d){$opt.attr("selected", "selected")}
		$opt.appendTo($o);
	}
	
	function clearOptions($o){
		
		$o.html("");
		appendOptionTo($o,"","","","");
	}
	//四级联动测试
	function getProvince(config){
		$.ajax({
			type:'post',
			url:'/org/getOrgListById',
			dataType:'json',
			data:{"id":""},
			async:false,
			success:function(data){
				clearOptions($("#"+config.province));
				clearOptions($("#"+config.city));
				clearOptions($("#"+config.district));
				clearOptions($("#"+config.street));
				var provinceData = data.organizationList;
				for(i=0;i<provinceData.length;i++){
					$("#"+config.province).append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].orgName+"'>"+provinceData[i].orgName+"</option>");
				}
				if($("#"+config.province+" option").size()>1){
					$("#"+config.province).val(config.provinceValue?config.provinceValue:null);		
					var province_curr_id = $("#"+config.province+" option:selected").attr("id");
					getCity(config,province_curr_id);
				}
			}
		});
	}
	function getCity(config,province_curr_id){
		$.ajax({
			type:'post',
			url:'/org/getOrgListById',
			dataType:'json',
			data:{"id":province_curr_id},
			async:false,
			success:function(data){					
				clearOptions($("#"+config.city));
				//var cityValues = data.split('\,');
				var cityValues =data.organizationList;
				for(i=0;i<cityValues.length;i++){
					$("#"+config.city).append("<option id='"+ cityValues[i].id +"' value='"+cityValues[i].orgName+"'>"+cityValues[i].orgName+"</option>");
				}
				if($("#"+config.city+" option").size()>1){
					$("#"+config.city).val(config.cityValue?config.cityValue:null);
					var city_curr_id = $("#"+config.city+" option:selected").attr("id");
					getDistrict(config,city_curr_id);
				}
			}
		});
	}

	function getDistrict(config,city_curr_id){
		$.ajax({
			type:'post',
			url:'/org/getOrgListById',
			dataType:'json',
			async:false,
			data:{"id":city_curr_id},
			success:function(data){
				clearOptions($("#"+config.district));
				//var districtValues = data.split('\,');
				var districtValues = data.organizationList;
				for(i=0;i<districtValues.length;i++){
					$("#"+config.district).append("<option id='"+ districtValues[i].id +"' value='"+districtValues[i].orgName+"'>"+districtValues[i].orgName+"</option>");
				}
				if($("#"+config.district+" option").size()>1){
					$("#"+config.district).val(config.districtValue?config.districtValue:null);
					var district_curr_id = $("#"+config.district+" option:selected").attr("id");
					getStreet(config,district_curr_id);
				}
			}
		});
	}
	function getStreet(config,district_curr_id){
		$.ajax({
			type:'post',
			url:'/org/getOrgListById',
			dataType:'json',
			async:false,
			data:{"id":district_curr_id},
			success:function(data){
				clearOptions($("#"+config.street));
				//var districtValues = data.split('\,');
				var streetValues = data.organizationList;
				for(i=0;i<streetValues.length;i++){
					$("#"+config.street).append("<option id='"+ streetValues[i].id +"' value='"+streetValues[i].orgName+"'>"+streetValues[i].orgName+"</option>");
				}
				$("#"+config.street).val(config.streetValue?config.streetValue:null);
			}
		});
	}
})
	