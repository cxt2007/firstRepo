$(function(){	
	$(window).resize(function(){
		$("#sosTable").setGridWidth($(".container").width());
		$("#liveTable").setGridWidth($(".container").width());
		$("#helpTable").setGridWidth($(".container").width());
	});
	$(".jqdatepicker").datePicker({
		yearRange: '1900:2060',
        dateFormat: 'yy-mm-dd',
        onSelect:function(date,obj){
            var associatedid = $('#'+$(this).attr('associatedid'));                   
        	if( associatedid[0]){
        		associatedid.datepicker( "option", associatedid.attr('datastatus'), date);
        	}
        }
	});
	$("#endDate").datepicker("setDate", getLastDayOfCurrentMonth());
	$("#startDate").datepicker("setDate", getFirstDayOfcurMonth());
	serviceRecordList();
});

function serviceRecordList(){	
	var build = {    
		init:function(){
			build.pageFun();
			$("#sosTable").jqGridFunction({
		        scrollrows:false,
		        showColModelButton:false,
		        url:'/peopleInfo/sosList',
		        height:'auto',
		        mtype:'POST',
		        shrinkToFit:true,
		        rowNum:5,
		        postData:{"peopleId":$("#ulTab").attr("peopleId")},
		        colNames:['呼叫时间','处理情况','回访情况','坐席员'],
		        colModel:[
		               {name:'callTime',index:'callTime',width:100,sortable:false,formatter:build.gridFun.dateFormatter},
		               {name:"result",index:'result',width:150,sortable:false},
		               {name:"visitResult",index:'visitResult',width:150,sortable:false},
		               {name:"seatMember",index:'seatMember',width:100,sortable:false}
		        ],
		        onSelectRow:function(rowId,selected,e){
		        	
		        },
		        ondblClickRow:function(rowId){
		        },
		        gridComplete:function(){
		        	var a=$("#sosTablePager .ui-paging-info").html();
		        	if(a!=null && a!='' && a.indexOf("没有")==-1){
		        		var sosCount=a.substring(1,a.indexOf("条"));
		        		$("#sosCount1").html(sosCount);
		        		$("#sosCount2").html(sosCount);
		        	}
		        	$(".ui-pg-selbox").css("display","none");
		        	$("#sosTable").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
		        }
		    });   
			$("#liveTable").jqGridFunction({
				scrollrows:true,
				showColModelButton:false,
				url:'/peopleInfo/liveList',
				height:'auto',
				shrinkToFit:true,
				mtype:'POST',
				rowNum:5,
				postData:{"peopleId":$("#ulTab").attr("peopleId")},
				colNames:['服务时间','服务内容','服务金额（元）','服务人员','服务商家','回访情况'],
				colModel:[
				          {name:'serviceTime',index:'serviceTime',width:115,sortable:false,formatter:build.gridFun.serviceTimeFormatter},
				          {name:"serviceName",index:'serviceName',width:105,sortable:false,},
				          {name:"price",index:'price',sortable:false,width:90,formatter:build.gridFun.priceFormatter},
				          {name:"servicePersonal",index:'servicePersonal',width:80,sortable:false},
				          {name:"facilitingAgency",index:'facilitingAgency',width:170,sortable:false},
				          {name:"visitResult",index:'visitResult',sortable:false,width:100}
				          ],
		          onSelectRow:function(rowId,selected,e){
		        	  
		          },
		          ondblClickRow:function(rowId){
		          },
		        gridComplete:function(){
		        	var a=$("#liveTablePager .ui-paging-info").html();
		        	if(a!=null && a!='' && a.indexOf("没有")==-1){
		        		var sosCount=a.substring(1,a.indexOf("条"));
		        		$("#liveCount1").html(sosCount);
		        		$("#liveCount2").html(sosCount);
		        	}
		        	$(".ui-pg-selbox").css("display","none");
		        	$("#liveTable").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
		        }
			});   
			$("#helpTable").jqGridFunction({
				scrollrows:true,
				showColModelButton:false,
				url:'/peopleInfo/helpList',
				height:'auto',
				mtype:'POST',
				shrinkToFit:true,
				rowNum:5,
				postData:{"peopleId":$("#ulTab").attr("peopleId")},
				colNames:['呼叫时间','类型','处理人','处理情况','回访情况'],
				colModel:[
				          {name:'callTime',index:'callTime',width:100,sortable:false,formatter:build.gridFun.callTimeFormatter},
				          {name:"detailedType",index:'detailedType',width:80,sortable:false,formatter:build.gridFun.detailTypeFormatter},
				          {name:"subjectName",index:'subjectName',sortable:false,width:80},
				          {name:"serviceobject",index:'serviceobject',sortable:false,width:150},
				          {name:"visitResult",index:'visitResult',sortable:false,width:150}
				          ],
				          onSelectRow:function(rowId,selected,e){
				        	  
				          },
				          ondblClickRow:function(rowId){
				          },
				          gridComplete:function(){
				        	  var a=$("#helpTablePager .ui-paging-info").html();
				        	  if(a!=null && a!='' && a.indexOf("没有")==-1){
				        		  var sosCount=a.substring(1,a.indexOf("条"));
				        		  $("#helpCount1").html(sosCount);
				        		  $("#helpCount2").html(sosCount);
				        	  }
				        	  $(".ui-pg-selbox").css("display","none");
				        	  $("#helpTable").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
				          }
			});   
		},
        gridFun:{
	        	dateFormatter:function(el, options, rowData){
	            	if(rowData.callTime && rowData.callTime ) 
	            		return new Date(rowData.callTime).format("yyyy.MM.dd hh:mm:ss");
	            	return "";
	            },
	            serviceTimeFormatter:function(el, options, rowData){
	            	if(rowData.serviceTime && rowData.serviceTime ) 
	            		return new Date(rowData.serviceTime).format("yyyy.MM.dd hh:mm:ss");
	            	return "";
	            },
	            callTimeFormatter:function(el, options, rowData){
	            	if(rowData.callTime!=null && rowData.callTime!='') 
	            		return new Date(rowData.callTime).format("yyyy.MM.dd hh:mm:ss");
	            	return "";
	            },
	            priceFormatter:function(el, options, rowData){
	            	if(rowData.price!=null && rowData.price!='') {
	            		if(rowData.remark!=null && rowData.remark!=''){
		            		return rowData.price+"/"+rowData.remark;
	            		}else{
	            			return rowData.price;
	            		}
	            	}
	            	return "";
	            },
	            detailTypeFormatter:function(el, options, rowData){
	            	if( rowData.detailedType!=null && rowData.detailedType!='' ) {
	            		if(rowData.detailedType==1){
	            			return "水管爆裂";
	            		}else{
	            			return "电路故障";
	            		}
	            	}
	            	return "";
	            }
        },
        pageFun:function(){
        	
            
        }
	};
	build.init();
}
