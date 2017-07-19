$(function(){	
	queryRecordList();
});

function queryRecordList(){	
	var build = {    
		init:function(){
			build.pageFun();
			$("#equipTable").jqGridFunction({
		        scrollrows:true,
		        showColModelButton:false,
		        url:'/peopleInfo/equipList',
		        height:'auto',
		        mtype:'POST',
		        rowNum:10,
		        postData:{"peopleId":$("#ulTab").attr("peopleId")},
		        colNames:['终端型号','终端序列号','手机号码','领取时间','领取表格','当前状态','备注','收回时间'],
		        colModel:[
		               {name:'deviceType',index:'deviceType',sortable:false,width:150},
		               {name:"equipmentNumber",index:'equipmentNumber',sortable:false,width:150},
		               {name:"phoneNumber",index:'phoneNumber',sortable:false,width:150},
		               {name:"createDate",index:'createDate',sortable:false,width:150,formatter:build.gridFun.dateFormatter},
		               {name:"state",index:'state',sortable:false,width:150,formatter:build.gridFun.stateFormatter},
		               {name:"careName",index:'careName',sortable:false,width:150},
		               {name:"careName",index:'careName',sortable:false,width:150},
		               {name:"careName",index:'careName',sortable:false,width:150}
		        ],
		        onSelectRow:function(rowId,selected,e){
		        	
		        },
		        ondblClickRow:function(rowId){
		        }
		    });   
		},
        gridFun:{
	        	dateFormatter:function(el, options, rowData){
	            	if(rowData.careTime && rowData.careTime ) 
	            		return new Date(rowData.careTime).format("yyyy.MM.dd");
	            	return "";
	            },
	            stateFormatter:function(el, options, rowData){
	            	if(rowData.state==0 ){
	            		return "未激活";
	            	}else if(rowData.state==1 || rowData.state==2){
	            		return "已激活";
	            	}else if(rowData.state==3 ){
	            		return "已注销";
	            	} 
	            	return "";
	            }
        },
        pageFun:function(){
        	
        	
            
        }
	}
	build.init();
}