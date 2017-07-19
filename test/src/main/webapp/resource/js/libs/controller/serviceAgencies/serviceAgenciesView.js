TQ.serviceAgenciesView = function(dfop){
	var type=3;
	var build = {
			init:function(){
				$("#serviceAgenciesViewTable").jqGridFunction({
			        scrollrows:true,
			        showColModelButton:false,
			        url:'/serviceAgencies/lists',
			        height:'auto',
			        mtype:'POST',
			        postData:{"type":type},
			        colNames:['id',"活动主题",'活动类型','活动时间','地点','参与人数'],
			        colModel:[
			               {name:"id",index:"id",sortable:false,hidden:true},
			               {name:"userName",index:'userName',formatter:build.gridFun.userNameFormatter,width:200},
			               {name:"name",index:'name',formatter:build.gridFun.viewFormatter,sortable:true,width:150},
			               {name:"header",index:'header',sortable:true,width:145},
			               {name:"contact",index:'contact',sortable:true,width:300},
			               {name:"workingNum",formatter:build.gridFun.workingNumFormatter,sortable:true}
			             		              
			        ],
			        onSelectRow:function(rowId,selected){
			        	var bool=true,		            
			                rowData=$(this).getRowData(rowId);
			            if(selected){
			                if(bool){	
			                    
			                }
			            }	            
			        },
			        ondblClickRow:function(rowId){
			        	
			        }
			    });
				
			},
	        gridFun:{	            
	            edit:true,
	            del:true,
	            typeFormatter:function(el, options, rowData){
	            	if(rowData.agenciesType==1){
	            		return "服务机构";
	            	}
	            	if(rowData.agenciesType==2){
	            		return "独立照料中心";
	            	}
	            	if(rowData.agenciesType==3){
	            		return "依托托老所";
	            	}
	            	if(rowData.agenciesType==4){
	            		return "依托敬老院 ";
	            	}
	            	if(rowData.agenciesType==5){
	            		return "公益组织";
	            	}
	            	return "";
	            },
	            viewFormatter:function(el, options, rowData){
	            	
	            	return "<a href='javascript:;' class='listTit view' data-rowid='"+rowData.id+"' ><span>"+rowData.name+"</span></a>";
	            },
	            workingNumFormatter:function(el, options, rowData){
	            	return "0";
	            },
	            activitiesNumFormatterr:function(el, options, rowData){
	            	return "0";
	            },
	            userNameFormatter:function(el, options, rowData){
	            	if(rowData.isEnable==0){
	            		return rowData.userName + "<span style='color:red'> (已禁用)</span>";
	            	}
	            	if(rowData.isEnable==1){
	            		return rowData.userName+"<span style='color:green'> (已启用)</span>";
	            	}
	            	return rowData.userName;
	            } 
	        }
		}
		build.init();
		
		$('#serviceAgenciesViewTable').on('change','#switchInput',function(){
			$(this).parents('.switch-box').toggleClass('checked');
		});
}