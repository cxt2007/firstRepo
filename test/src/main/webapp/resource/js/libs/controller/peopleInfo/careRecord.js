$(function(){	
	$(window).resize(function(){
		$("#careRecordTable").setGridWidth($(".container").width());
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
	$("#sevenDay").click(function(){
		search(7);
	});
	$("#thirtyDay").click(function(){
		search(30);
	});
	queryRecordList();
});

function search(days){
	var data=null;
	if(days==undefined || days==null){
		data={
				"peopleId":$("#ulTab").attr("peopleId"),
				"startDate":$("#startDate").val(),
				"endDate":$("#endDate").val()
		};
	}else {
		var today=new Date();
		var sevenDays=new Date();
		$("#endDate").datepicker("setDate", new Date());
		$("#startDate").datepicker("setDate", "-"+(days-1)+"d");
		sevenDays.setDate(sevenDays.getDate()-days);
		data={
				"peopleId":$("#ulTab").attr("peopleId"),
				"startDate":sevenDays.getFullYear()+"-"+fill0((sevenDays.getMonth()+1))+"-"+fill0(sevenDays.getDate()),
				"endDate":today.getFullYear()+"-"+fill0((today.getMonth()+1))+"-"+fill0(today.getDate())
		};
	}
	$("#total").html(0);
	$("#careRecordTable").setGridParam(data);//设置搜索条件的参数
	$("#careRecordTable").setPostData(data);
    $("#careRecordTable").trigger("reloadGrid");
}

function fill0(number){
	if(number<10){
		return "0"+number;
	}else{
		return number;
	}
}

function queryRecordList(){	
	var build = {    
		init:function(){
			build.pageFun();
			$("#careRecordTable").jqGridFunction({
		        scrollrows:false,
		        showColModelButton:false,
		        url:'/peopleInfo/careRecordlist',
		        height:'auto',
		        mtype:'POST',
		        rowNum:10,
		        shrinkToFit:true,
		        postData:{
					"peopleId":$("#ulTab").attr("peopleId"),
					"startDate":$("#startDate").val(),
					"endDate":$("#endDate").val()
			},
		        colNames:['关怀时间','关怀结果','关怀内容','关怀人','附件'],
		        colModel:[
		               {name:'careTime',index:'careTime',sortable:false,width:150,formatter:build.gridFun.dateFormatter},
		               {name:"careResult",index:'careResult',sortable:false,width:150},
		               {name:"careContent",index:'careContent',sortable:false,width:200},
		               {name:"careName",index:'careName',sortable:false,width:150},
		               {name:"careName",index:'careName',sortable:false,width:150,formatter:build.gridFun.fileFormatter}
		        ],
		        onSelectRow:function(rowId,selected,e){
		        	
		        },
		        ondblClickRow:function(rowId){
		        },
		        gridComplete:function(){
		        	var a=$("#careRecordTablePager .ui-paging-info").html();
		        	if(a!=null && a!='' && a.indexOf("没有")==-1){
		        		var sosCount=a.substring(1,a.indexOf("条"));
		        		$("#total").html(sosCount);
		        		$("#total").html(sosCount);
		        	}
		        	$(".ui-pg-selbox").css("display","none");
		        	$("#careRecordTable").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
		        }
		    });   
		},
        gridFun:{
	        	dateFormatter:function(el, options, rowData){
	            	if(rowData.careTime && rowData.careTime ) 
	            		return new Date(rowData.careTime).format("yyyy.MM.dd");
	            	return "";
	            },
	        	fileFormatter:function(el, options, rowData){
	            	return '<img style="width:25px;height:25px" src="/resource/images/month/enclosure.png"/>';
	            }
        },
        pageFun:function(){
        	
        }
	}
	build.init();
}