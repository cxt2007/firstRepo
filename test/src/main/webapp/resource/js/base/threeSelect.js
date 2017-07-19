
		function threeSelect(config){
			var $s1=$("#"+config.province);
			var $s2=$("#"+config.city);
			var $s3=$("#"+config.district);
			var firstId=config.firstId?config.firstId:"";
			var v1=config.provinceValue?config.provinceValue:null;
			var v2=config.cityValue?config.cityValue:null;
			var v3=config.districtValue?config.districtValue:null;
			getProvince(config,firstId);
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
					//data:{"id":$s1.val()},
					data:{"id":s1_curr_id},
					success:function(data){
						//var cityData = data.split('\,');
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
				$("#townId").val("");
				var s1_curr_val = $s1[0].options[$s1[0].selectedIndex].value;
				if(this.selectedIndex==-1 || this.options[this.selectedIndex].value=="") return;
				var s2_curr_val = this.options[this.selectedIndex].value;
				var s2_curr_id = this.options[this.selectedIndex].id;
				$("#townId").val(s2_curr_id);
				$.ajax({
					type:'post',
					url:'/org/getOrgListById',
					dataType:'json',
					async:false,
					data:{"id":s2_curr_id},
					success:function(data){
						//var districtData = data.split('\,');
						var districtData = data.organizationList;	
						for(i=0;i<districtData.length;i++){
							$s3.append("<option id='"+ districtData[i].id +"' value='"+districtData[i].orgName+"'>"+districtData[i].orgName+"</option>");
						}
					}
				});
			});			
		}
		//
		function oldThreeSelect(config){
			var $s1=$("#"+config.province);
			var $s2=$("#"+config.city);
			var $s3=$("#"+config.district);
			var firstId=config.firstId?config.firstId:"";
			var v1=config.provinceValue?config.provinceValue:null;
			var v2=config.cityValue?config.cityValue:null;
			var v3=config.districtValue?config.districtValue:null;
			getOldProvince(config,firstId);
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
					//data:{"id":$s1.val()},
					data:{"id":s1_curr_id},
					success:function(data){
						//var cityData = data.split('\,');
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
				$("#townId").val("");
				var s1_curr_val = $s1[0].options[$s1[0].selectedIndex].value;
				if(this.selectedIndex==-1 || this.options[this.selectedIndex].value=="") return;
				var s2_curr_val = this.options[this.selectedIndex].value;
				var s2_curr_id = this.options[this.selectedIndex].id;
				$("#townId").val(s2_curr_id);
				$.ajax({
					type:'post',
					url:'/org/getOrgListById',
					dataType:'json',
					async:false,
					data:{"id":s2_curr_id},
					success:function(data){
						//var districtData = data.split('\,');
						var districtData = data.organizationList;	
						for(i=0;i<districtData.length;i++){
							$s3.append("<option id='"+ districtData[i].id +"' value='"+districtData[i].orgName+"'>"+districtData[i].orgName+"</option>");
						}
					}
				});
			});			
		}
		
		function getOldProvince(config,firstId){
			$.ajax({
				type:'post',
				url:'/org/getHZOrgListById',
				dataType:'json',
				data:{"id":firstId},
				async:false,
				success:function(data){
					clearOptions($("#"+config.province));
					clearOptions($("#"+config.city));
					clearOptions($("#"+config.district));
					//var provinceData = data.split('\,');
					var provinceData = data.organizationList;
					for(i=0;i<provinceData.length;i++){
						$("#"+config.province).append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].orgName+"'>"+provinceData[i].orgName+"</option>");
					}											
					if($("#"+config.province+" option").size()>1){
						$("#"+config.province).val(config.provinceValue?config.provinceValue:null);		
						var province_curr_id = $("#"+config.province+" option:selected").attr("id");
						getCity(config,province_curr_id);
					}
					//var $optOther=$("<option>").text('其他').val(" ");
					//$("#"+config.province).append($optOther);
				}
			});
		}
		
		function appendOptionTo($o,k,v,d){
			var placeholder=$o.attr("placeholder");
			if(placeholder==null || placeholder==''){
				placeholder="请选择";
			}
			var $opt=$("<option>").text(placeholder).val(k);
			if(k==d){$opt.attr("selected", "selected")}
			$opt.appendTo($o);
		}
		
		function clearOptions($o){
			$o.html("");
			appendOptionTo($o,"","","","");
		}
		//省市县三级联动测试
		function getProvince(config,firstId){
			$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				data:{"id":firstId},
				async:false,
				success:function(data){
					clearOptions($("#"+config.province));
					clearOptions($("#"+config.city));
					clearOptions($("#"+config.district));
					//var provinceData = data.split('\,');
					var provinceData = data.organizationList;
					for(i=0;i<provinceData.length;i++){
						$("#"+config.province).append("<option id='"+ provinceData[i].id +"' value='"+provinceData[i].orgName+"'>"+provinceData[i].orgName+"</option>");
					}											
					if($("#"+config.province+" option").size()>1){
						$("#"+config.province).val(config.provinceValue?config.provinceValue:null);		
						var province_curr_id = $("#"+config.province+" option:selected").attr("id");
						getCity(config,province_curr_id);
					}
					//var $optOther=$("<option>").text('其他').val(" ");
					//$("#"+config.province).append($optOther);
				}
			});
		}
		function getCity(config,province_curr_id){
			if(typeof province_curr_id=="undefined"){
				return false;
			}			
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
					//var $optOther=$("<option>").text('其他').val(" ");
					//$("#"+config.city).append($optOther);
				}
			});
		}

		function getDistrict(config,city_curr_id){
			if(typeof city_curr_id=="undefined"){
				return false;
			}
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
					$("#"+config.district).val(config.districtValue?config.districtValue:null);
					//var $optOther=$("<option>").text('其他').val(" ");
					//$("#"+config.district).append($optOther);
				}
			});
		}

		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		function fourSelect(config){
			var $s1=$("#"+config.city);
			var $s2=$("#"+config.district);
			var $s3=$("#"+config.town);
			var $s4=$("#"+config.community);
			
			var firstId=config.firstId?config.firstId:"";
			var v1=config.cityValue?config.provinceValue:null;
			var v2=config.districtValue?config.cityValue:null;
			var v3=config.townValue?config.districtValue:null;
			var v4=config.communityValue?config.communityValue:null;
			getNewProvince(config,firstId);
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
					//data:{"id":$s1.val()},
					data:{"id":s1_curr_id},
					success:function(data){
						//var cityData = data.split('\,');
						var districtData = data.organizationList;						
						for(i=0;i<districtData.length;i++){
							$s2.append("<option id='"+ districtData[i].id +"' value='"+districtData[i].orgName+"'>"+districtData[i].orgName+"</option>");
						}
					}
				});
				$s2.change();
			});
			$s2.change(function(){
				clearOptions($s3);
				$("#townId").val("");
//				var s1_curr_val = $s1[0].options[$s1[0].selectedIndex].value;
				if(this.selectedIndex==-1 || this.options[this.selectedIndex].value=="") {
					$s3.change();
					return;
				}
				var s2_curr_val = this.options[this.selectedIndex].value;
				var s2_curr_id = this.options[this.selectedIndex].id;
				$("#townId").val(s2_curr_id);
				$.ajax({
					type:'post',
					url:'/org/getOrgListById',
					dataType:'json',
					async:false,
					data:{"id":s2_curr_id},
					success:function(data){
						//var districtData = data.split('\,');
						var townData = data.organizationList;	
						for(i=0;i<townData.length;i++){
							$s3.append("<option id='"+ townData[i].id +"' value='"+townData[i].orgName+"'>"+townData[i].orgName+"</option>");
						}
					}
				});
				$s3.change();
			});		
			$s3.change(function(){
				clearOptions($s4);
//?				$("#townId").val("");
//				var s1_curr_val = $s1[0].options[$s1[0].selectedIndex].value;
				if(this.selectedIndex==-1 || this.options[this.selectedIndex].value==""){
					$s4.change();
					return;
				}
//				var s2_curr_val =$s2[0].options[$s2[0].selectedIndex].value;
				var s3_curr_id = this.options[this.selectedIndex].id;
//				$("#townId").val(s2_curr_id);
				$.ajax({
					type:'post',
					url:'/org/getOrgListById',
					dataType:'json',
					async:false,
					data:{"id":s3_curr_id},
					success:function(data){
						//var districtData = data.split('\,');
						var communityData = data.organizationList;	
						for(i=0;i<communityData.length;i++){
							$s4.append("<option id='"+ communityData[i].id +"' value='"+communityData[i].orgName+"'>"+communityData[i].orgName+"</option>");
						}
					}
				});
				
			});
		}
		//四级
		function getNewProvince(config,firstId){
			$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				data:{"id":firstId},
				async:false,
				success:function(data){
					clearOptions($("#"+config.city));
					clearOptions($("#"+config.district));
					clearOptions($("#"+config.town));
					clearOptions($("#"+config.community));
					//var provinceData = data.split('\,');
					var cityData = data.organizationList;
					for(i=0;i<cityData.length;i++){
						$("#"+config.city).append("<option id='"+ cityData[i].id +"' value='"+cityData[i].orgName+"'>"+cityData[i].orgName+"</option>");
					}											
					if($("#"+config.city+" option").size()>1){
						$("#"+config.city).val(config.cityValue?config.cityValue:null);		
						var city_curr_id = $("#"+config.city+" option:selected").attr("id");
						getNewDistrict(config,city_curr_id);
					}
					//var $optOther=$("<option>").text('其他').val(" ");
					//$("#"+config.province).append($optOther);
				}
			});
		}
		
		function getNewDistrict(config,city_curr_id){
			if(typeof city_curr_id=="undefined"){
				return false;
			}			
			$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				data:{"id":city_curr_id},
				async:false,
				success:function(data){					
					clearOptions($("#"+config.district));
					//var cityValues = data.split('\,');
					var districtValues =data.organizationList;
					for(i=0;i<districtValues.length;i++){
						$("#"+config.district).append("<option id='"+ districtValues[i].id +"' value='"+districtValues[i].orgName+"'>"+districtValues[i].orgName+"</option>");
					}					
					if($("#"+config.district+" option").size()>1){
						$("#"+config.district).val(config.districtValue?config.districtValue:null);
						var district_curr_id = $("#"+config.district+" option:selected").attr("id");
						getNewTown(config,district_curr_id);
					} 
					//var $optOther=$("<option>").text('其他').val(" ");
					//$("#"+config.city).append($optOther);
				}
			});
		}

		function getNewTown(config,district_curr_id){
			if(typeof district_curr_id=="undefined"){
				return false;
			}
			$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				async:false,
				data:{"id":district_curr_id},
				success:function(data){
					clearOptions($("#"+config.town));
					//var districtValues = data.split('\,');
					var townValues = data.organizationList;
					for(i=0;i<townValues.length;i++){
						$("#"+config.town).append("<option id='"+ townValues[i].id +"' value='"+townValues[i].orgName+"'>"+townValues[i].orgName+"</option>");
					}					
					$("#"+config.town).val(config.townValue?config.townValue:null);
					//var $optOther=$("<option>").text('其他').val(" ");
					//$("#"+config.district).append($optOther);
					var town_curr_id=$("#"+config.town+" option:selected").attr("id");
					getNewCommunity(config,town_curr_id);
				}
			});
		}
		
		function getNewCommunity(config,town_curr_id){
			if(typeof town_curr_id=="undefined"){
				return false;
			}
			$.ajax({
				type:'post',
				url:'/org/getOrgListById',
				dataType:'json',
				async:false,
				data:{"id":town_curr_id},
				success:function(data){
					clearOptions($("#"+config.community));
					//var districtValues = data.split('\,');
					var communityValues = data.organizationList;
					for(i=0;i<communityValues.length;i++){
						$("#"+config.community).append("<option id='"+ communityValues[i].id +"' value='"+communityValues[i].orgName+"'>"+communityValues[i].orgName+"</option>");
					}					
					$("#"+config.community).val(config.communityValue?config.communityValue:null);
					//var $optOther=$("<option>").text('其他').val(" ");
					//$("#"+config.district).append($optOther);
				}
			});
		}