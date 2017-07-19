TQ.peopleInfoList = function(){	
	if(!eval($("#peopleInfoImport").val())){
  		$("#import").addClass("none");
  	}
	if(!eval($("#addWJDatas").val())){
  		$("#peopleInfoAddWJDatas").addClass("none");
  	}
	if(!eval($("#peopleRemove").val())){
  		$("#move").addClass("none");
  	}
	var build = {    
		init:function(){
			build.pageFun();
			$("#oldMenTable").jqGridFunction({
		        scrollrows:true,
		        showColModelButton:false,
		        url:'/peopleInfo/list',
		        height:'auto',
		        mtype:'POST',
		        postData:{dd:['aa','bb']},
		        colNames:['id','操作','行政区划','姓名','性别','年龄','身份证','出生日期','居住地址','联系方式','更新时间','手机号码'],
		        colModel:[
		               {name:"id",index:"id",sortable:false,hidden:true},
		               {name:'operation',formatter:build.gridFun.operateFormatter,label:'操作',frozen:true,width:110},
		               {name:"huji",index:'huji',sortable:false,formatter:build.gridFun.hujiFormatter,width:170},
		               {name:"name",index:'name',sortable:false,width:70,formatter:build.gridFun.viewPeople},
		               {name:"gender",index:'gender',sortable:false,width:40},
		               {name:"age",index:'age',sortable:false,width:40,formatter:build.gridFun.viewAge},
		               {name:"idcardNum",index:'idcardNum',sortable:false,width:140},
		               {name:"birthday",index:'birthday',sortable:false,formatter:build.gridFun.birthdayFormatter,width:80},
		               {name:"address",index:'address',sortable:false,width:194,formatter:build.gridFun.viewAddress},
		               {name:"telephone",index:'telephone',sortable:false,width:100,formatter:build.gridFun.telephoneFormatter},		               
		               {name:"updateDate",index:'updateDate',sortable:false,width:80,formatter:build.gridFun.updateDateFormatter},			               
		               {name:"mobileNumber",index:'mobileNumber',sortable:false,hidden:true,width:170}
		               
		        ],
		        onSelectRow:function(rowId,selected,e){
		        	
		        },
		        ondblClickRow:function(rowId){
		        }
		    });   
			
			//兼容过ie的placeholder		
//			$("#indexCommonView").newplaceholder();	
		},
        gridFun:{
            	edit:eval($("#peopleInfoUpdate").val()),
	            del:eval($("#peopleInfoDelete").val()),
	            cancelDel:eval($("#peopleInfoCancel").val()),
	            remove:eval($("#peopleRemove").val()),
	            operateFormatter : function (el, options, rowData){
	            	
	                var divStart = "<div class='cf' style='margin:0 auto;display: block;'>",
	                	editData = "<a href='javascript:;' title='修改' class='operationBtn newRevise updateDict' data-rowid='"+rowData.id+"'><span>修改</span></a>",
	                    delData = "<a href='javascript:;' title='删除' class='operationBtn deleteDict newDel' data-rowid='"+rowData.id+"'><span>删除</span></a>",
	                    cancelDelData = "<a href='javascript:;' title='注销' class='operationBtn cancelDel' data-rowid='"+rowData.id+"'><span>注销</span></a>",
	                    moveData = "<a href='javascript:;' title='迁移' class='operationBtn move' data-rowid='"+rowData.id+"'><span>迁移</span></a>",
	                    divEnd = "</div>"
	                if(!build.gridFun.edit){
	                	editData="";
	                }
	                if(!build.gridFun.del){
	                	delData="";
	                }
	                if(!build.gridFun.cancelDel){
	                	cancelDelData="";
	                }
	                if(!build.gridFun.remove){
	                	moveData="";
	                }
	                return divStart +editData+ delData + cancelDelData + divEnd + moveData;
	            },
	            evaluationStatusFormatter : function (el, options, rowData){
	            	if(rowData.assessmentStatus==0){
	            		setTimeout(function(){
	            			$("#"+rowData.id).addClass("waitEvaluationTr");
	            		},1);	            		
	            		return "<span class='waitEvaluation'>未评估</span>";
	            	}else if(rowData.assessmentStatus==1){	            		
	            		setTimeout(function(){
	            			$("#"+rowData.id).addClass("evaluatingTr");
	            		},1);
	            		return "<span class='evaluating'>评估中</span>";
	            	}else if(rowData.assessmentStatus==2){
	            		setTimeout(function(){
	            			$("#"+rowData.id).addClass("hasEvaluationTr");
	            		},1);	            		
	            		return "<span class='hasEvaluation'>已评估</span>";
	            	}	            	
	            },
	            viewPeople:function(el, options, rowData){
	            	return "<a class='listTit viewPeopleInfo' href='"+PATH+"/peopleInfo/detailsTab?id="+rowData.id+"' target=_blank  title='"+rowData.name+"'  data-rowid='"+rowData.id+"'><span>"+rowData.name+"</span></a>";
	            },
	            sexFormatter:function(el, options, rowData){
	            	var sex = sexFormatter(rowData.gender);
	            	return sex;
	            },
	            birthdayFormatter:function(el, options, rowData){
	            	if(rowData.birthday != null){
	            		//return new Date(rowData.birthday).format("yyyy.MM.dd");
	            		return getBirthDayTextFromIdCard(rowData.idcardNum);
	            	}else{
	            		return "";
	            	}
	            },
	            viewAddress:function(el, options, rowData){
	            	if(!rowData.resideDistrict) rowData.resideDistrict="";
	            	if(!rowData.resideTown) rowData.resideTown="";
	            	if(!rowData.resideCommunity) rowData.resideCommunity="";
	            	if(rowData.resideAddress){
	            		return "<div class='resideAddress'>"+rowData.resideDistrict+rowData.resideTown+rowData.resideCommunity+rowData.resideAddress+"</div>";
	            	}else{
	            		return "<div class='resideAddress'>"+rowData.resideDistrict+rowData.resideTown+rowData.resideCommunity+"</div>";
	            	}
	            },
	            hujiFormatter:function(el, options, rowData){
	            	if(!rowData.district) rowData.district="";
	            	if(!rowData.town) rowData.town="";
	            	if(!rowData.community) rowData.community="";
	            	return rowData.district+rowData.town+rowData.community;
	            },
	            telephoneFormatter:function(el, options, rowData){
	            	if(rowData.mobileNumber) 
	            		return rowData.mobileNumber;
	            	if(rowData.telephone) 
	            		return rowData.telephone;
	            	return "";
	            },
	            updateDateFormatter:function(el, options, rowData){
	            	if(rowData.updateDate && rowData.updateUser && rowData.updateUser!='admin') 
	            		return new Date(rowData.updateDate).format("yyyy.MM.dd");
	            	
	            	return "";
	            },
	            viewAge:function(el, options, rowData){
	            	return setAge(rowData.idcardNum);
	            },
	            viewPensionType:function(el,options,rowData){
            		if(rowData.pensionType==2){
            			return "居家养老";
            		}
            		if(rowData.pensionType==1){
            			return "机构养老";
            		}
            		if(rowData.people.pensionType ==3){
            			return "不符合国家补贴标准";
            		}
	            	return "";
	            }
        },
        pageFun:function(){
        	
        	//查看
        	/*$("#oldMenTableBox").on("click",".viewPeopleInfo",function(event){
        		var rowId = $(this).data("rowid");
            	$.ajax({
                    url:"/peopleInfo/details",
                    async:false,
        			type:"POST",
        			data:{"id":rowId,"viewType":"2"},
                    success:function(data){
                        if(data){
                        	$("#indexCommonView").html("").html(data);
                        	setTimeout(function(){
            					$(".ui-layout-west").height($(".ui-layout-center").height());
            				},600)
                        }
                    }
                });
        	});
            */
            //新增
            $("#addPeopleInfo").click(function(event){	
            	$.ajax({
            		url:"/peopleInfo/add/view",
            		async:false,
            		type:"POST",
            		data:{"viewType":"add"},
            		success:function(data){
            		
            			if(data){
            				$("#idB1F58DD217D746D99718CCDECBCF0BC5").addClass("reload");//准备在新增页面的时候，老年人档案被点击
            				$("#indexCommonView").html("").html(data);
            				setTimeout(function(){
            					$(".ui-layout-west").height($(".ui-layout-center").height());
            				},600)
            			}
            		}
            	});
            });
            
            //修改
            $("#oldMenTableBox").delegate(".updateDict","click",function(event){
            	var rowId = $(this).data("rowid");
            	/*var flag = false;
            	$.ajax({
            		url:"/peopleInfo/isPeopleInporcess",
            		async:false,
            		type:"POST",
            		data:{"peopleId":rowId},
            		success:function(data){
            			if(data){
            				flag=data.data;
            			}
            		}
            	});
            	
            	if(flag){
            		$.notice({
						level: 'warn',
					    title:'提示',
					    message: "该老年人正在评估流程中，禁止修改！",
					    width: 362,
	                    height:220,
					    okbtnName: "确定",
					    okFunc: false
					});
            		return;
            	}*/
            	$.ajax({
            		url:"/peopleInfo/edit/view",
            		async:false,
            		type:"POST",
            		data:{"id":rowId},
            		success:function(data){
            			if(data){
            				$("#idB1F58DD217D746D99718CCDECBCF0BC5").addClass("reload");//准备在查看页面的时候，老年人档案被点击
            				$("#indexCommonView").html("").html(data);
            			}
            		}
            	});
            });
            
        	//删除
            $("#oldMenTableBox").delegate(".newDel","click",function(event){
            	var self=$(this);
            	self.addClass("clicked");
            	var rowId = $(this).data("rowid");
                $.confirm({
                	level: 'warn',
                    title:"提示",
                    width : 365,
        			height :225,
                    message:"删除后不能还原，是否确认删除？",
                    okFunc: function(){
                    	$.ajax({
    	                    url:"/peopleInfo/del?id="+rowId,
    	                    async:false,
    	                    success:function(data){
    	                        if(data.data!=true && data.data!="true" ){
    	                            $.messageBox({message:data,level:"error"});
    	                            return;
    	                        }
    	                        $("#oldMenTable").trigger("reloadGrid");
    	                        $.messageBox({message:"删除成功！"});
    	                    },
    	                    error: function(XMLHttpRequest, textStatus, errorThrown){
    	                        $.messageBox({message:"删除错误",level: "error"});
    	                    }
    	                });
                    }
                });
        	});  
            
            //注销
            $("#oldMenTableBox").delegate(".cancelDel","click",function(event){
            	var self=$(this);
            	self.addClass("clicked");
            	var rowId = $(this).data("rowid");
            	cancelDelFunction(rowId);
            	
        	});  
            
            function cancelDelFunction(rowId){
            	$("#cancelDialog").createDialog({
    				width:400,
    				height:230,
    				title:'注销',
    				url:'/peopleInfo/cancel?id='+rowId,
    				buttons: {
    				  "确认注销" : function(event){
    					  $("#cancelForm").submit();
    				   },
            			"取消":function(event){
            				$("#cancelDialog").dialog("close");
    				   }
    				}
    			});
            }
            
            //新增卫计数据
            $("#peopleInfoAddWJDatas").click(function(event){
        		
            	$.confirm({
            		level: 'warn',
        			title:'确认',
        			message:'是否获取卫计数据？',
        			okFunc: function(){
        				$.ajax({
        					url:"/assessmentDetail/addWJDatas",
        					data:{},
        					success:function(data){
        						data = JSON.parse(data);
        						if(data.code!=200 ){
    	                            $.messageBox({message:data.msg,level:"error"});
    	                            return;
    	                        }else{
    	                        	
    	                        	$.messageBox({message:data.data});
    	                        }
        					}
        				})
        			}
        		});
        	});
        	
            
            
            //搜索
            $("#fastSearchButton").click(function(event){
//            	$("#indexCommonView").clearNewplaceholder();
            	$("#ageLevel").val("");
            	var startAge = $("#startAge").val();
            	var endAge = $("#endAge").val();
            	var queryText = $("#queryText").val().trim();
            	if($("#queryText").val()==$("#queryText").attr("placeholder")){
            		queryText="";
            		return;
            	}
            	var	initParam = {
      	                 "startAge":startAge,
      	                 "endAge":endAge,
      	                 "queryText":queryText,
       	                 "page":1
      	            }
            	$("#oldMenTable").setGridParam(initParam);//设置搜索条件的参数
            	$("#oldMenTable").setPostData(initParam);
   	            $("#oldMenTable").trigger("reloadGrid");
   	            //placeholder
   	            $("#indexCommonView").refreshPlaceholder();   	         
        	});
            $("#queryText").keydown(function(e){  
                if (e.keyCode == 13) {  
                	$("#fastSearchButton").click();
                }
            });
            //根据年龄段快速检索
            $("#ageLevel").change(function(event){
            	$("#startAge").val("");
            	$("#endAge").val("");
            	$("#queryText").val("");
            	var text = $("#ageLevel").val();
   	            var	initParam = {   	           		 
   	                 "queryAge":text,
   	                 "page":1
   	            }
   	            $("#oldMenTable").setGridParam(initParam);//设置搜索条件的参数
   	            $("#oldMenTable").setPostData(initParam);
   	            $("#oldMenTable").trigger("reloadGrid");
            });
            $("#refresh").click(function(event){
            	$("#startAge").val("");
            	$("#endAge").val("");
            	$("#queryText").val("");
            	$("#ageLevel").val("");
            	var	initParam = {   
      	                 "page":1
      	            }
            	//$("#oldMenTable").setGridParam(initParam);//设置搜索条件的参数
  	            $("#oldMenTable").setPostData(initParam);
   	            $("#oldMenTable").trigger("reloadGrid");
   	            //placeholder
   	            $("#indexCommonView").refreshPlaceholder();
        	});
            //总人数查询
            $("#all").click(function(event){
            	var	initParam = {   	           		 
            			"pensionType":"",
      	                 "page":1
            	}
            	$("#oldMenTable").setPostData(initParam);
            	$("#oldMenTable").trigger("reloadGrid");
            	$(this).addClass('on').siblings().removeClass('on');
            });
            
            //导入
            $("#import").click(function(){
	            	$("#exportDatas").createDialog({
	            		width: 450,
	    				height: 250,
	    				title:'导入',
	    				url:'/peopleInfo/import',
	    				buttons: {
	    				  "确认" : function(event){
	    					  $("#exportDatas").dialog("close");
	    					  $("#oldMenTable").trigger("reloadGrid");
	    				   },
	            			"取消":function(event){
	            				$("#exportDatas").dialog("close");
	            				$("#oldMenTable").trigger("reloadGrid");
	    				   }
	    				}
	    			});
	            	$("#exportDatas").css({'minHeight':'41px',height:'auto','paddingBottom':'0'});
            });
            
            //数据迁移
            $("#oldMenTableBox").delegate(".move","click",function(event){
            	var rowId = $(this).data("rowid");
            	var flag = false;
            	$.ajax({
            		url:"/peopleInfo/isPeopleInporcess",
            		async:false,
            		type:"POST",
            		data:{"peopleId":rowId},
            		success:function(data){
            			if(data){
            				flag=data.data;
            			}
            		}
            	});
            	
            	if(flag){
            		$.notice({
						level: 'warn',
					    title:'提示',
					    message: "该老年人正在评估流程中，禁止迁移！",
					    width: 362,
	                    height:220,
					    okbtnName: "确定",
					    okFunc: false
					});
            		return;
            	}
            	$("#exportDatas").createDialog({
            		width: 450,
    				height: 250,
    				title:'数据迁移',
    				url:'/peopleInfo/remove?ids='+rowId,
    				buttons: {
    				  "确认" : function(event){
    					  remove();
    				   },
            			"取消":function(event){
            				$("#exportDatas").dialog("close");
            				$("#oldMenTable").trigger("reloadGrid");
    				   }
    				}
    			});
            	$("#exportDatas").css({'minHeight':'41px',height:'auto','paddingBottom':'0'});
            	
            	
        	});  
            
          
            //居家养老查询
            $("#home").click(function(event){
            	var	initParam = {   	           		 
            			"pensionType":2,
      	                 "page":1
            	}
            	$("#oldMenTable").setPostData(initParam);
            	$("#oldMenTable").trigger("reloadGrid");
            	$(this).addClass('on').siblings().removeClass('on');
            });
            //机构养老查询
            $("#agency").click(function(event){
            	var	initParam = {   	           		 
            			"pensionType":1,
      	                 "page":1
            	}
            	$("#oldMenTable").setPostData(initParam);
            	$("#oldMenTable").trigger("reloadGrid");
            	$(this).addClass('on').siblings().removeClass('on');
            });
            
        }
	}
	build.init();
}