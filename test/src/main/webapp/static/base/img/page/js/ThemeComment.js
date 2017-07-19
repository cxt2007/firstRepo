var ctx = $("#ctx").val();

$(document).ready(function() {
	generate_comment_table();
	
	$("#queryPageBtn").click(function(){
		generate_comment_table();
	});
	
	$("#uploadPhotoBtn").click(function(){
		var chk_value =[];
	    $('input[name="stuids"]:checked').each(function(){
	    	chk_value.push($(this).val());
	    });
	    if(chk_value.length == 0){
	    	alert("请选择学生！");
	    	return;
	    }
	    openLoadPhotoPage(chk_value);
	});
	
	$("#stuids").click(function(){
		$("input[name='stuids']").prop("checked", $("#stuids").prop("checked"));
	});
});

function generate_comment_table() {
	App.datatables();
	var rownum = 1;
	var sAjaxSource = ctx + "/xtgl/theme/ajax_query_comment";
	var param = "bjid=" + $("#bjid").val();
	param = param + "&xm=" + $("#xsjb_xm").val();
	param = param + "&id=" + $("#theme_id").val();
	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns = [
	{
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sWidth" : "90px",
		"sClass" : "text-center",
		"mDataProp" : "4"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "5"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "6"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}];
	var exoTable = $('#comment-datatable')
			.dataTable(
					{
						"aaSorting" : [ [ 2, 'desc' ] ],
						"iDisplayLength" : 50,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"bSort" : false,
						"sAjaxSource" : sAjaxSource,
						"bServerSide" : true,// 服务器端必须设置为true
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							var checkBox = '<input name="stuids" text="'+aaData[4]+'" type="checkbox" value="'+aaData[3]+'" />';
				        	$('td:eq(0)', nRow).html(checkBox);
				        	
							$('td:eq(1)', nRow).html(rownum);
							
							
							if(aaData[6] == null || aaData[6] == undefined){
								aaData[6] = "未留言";
							}
							
							$('td:eq(4)', nRow).html(aaData[6]);
							
							var count = aaData[7];
							var photoHtml="";
							if(count>0){
								photoHtml='<div style="text-align:center;"><a id="query_xsjz_photo'+aaData[3]
					 			+'" href="javascript:queryXsjzPhoto(\''+aaData[4]+'\',\''+aaData[3]+'\')">查看(<label>'+aaData[7]+'</label>)</a></div>';
							}else{
								photoHtml='<div style="text-align:center;"><a>未上传照片</a></div>';
							}
							$('td:eq(5)', nRow).html(photoHtml);
							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});

	exoTable.makeEditable({
		sUpdateURL : ctx + "/xtgl/theme/updateComment?prescCode=" + rownum+"&id="+$("#theme_id").val(),
		"aoColumns" : [ {
			class : 'read_only'
		},{
			class : 'read_only'
		}, {
			class : 'read_only'
		}, {
			indicator : 'Saving...',
			loadtext : 'loading...',
			type : 'text',
			onblur : 'submit'
		}, {
			class : 'read_only'
		}, {
			class : 'read_only'
		}],
		sAddURL : "XXXX.action",
		sAddHttpMethod : "GET",
		sDeleteHttpMethod : "GET"

	});
}
function findParentImg(id) {
	$("#pimgModel").modal("show");
	generate_parentImg_table(id);
}
function generate_parentImg_table(id) {
	var rownum = 1;
	App.datatables();
	/* Initialize Datatables */
	var sAjaxSource = ctx + "/xtgl/theme/findParentImg?" + id;
	var aoColumns = [];
	aoColumns = [ {
		"sTitle" : "照片",
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "qiniufile"
	} ];
	$('#pimg-datatable').dataTable({
		"aaSorting" : [ [ 1, 'desc' ] ],
		"aLengthMenu" : [ [ 10, 20, 30, -1 ], [ 10, 20, 30, "All" ] ],
		"iDisplayLength" : 10,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bSort" : false,
		"bAutoWidth" : false,
		"sAjaxSource" : sAjaxSource,
		"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
			var pimg = '<div style="text-align:center;">' + '<img src='
			+aaData.qiniufile + '/>';
			'</div>';
			$('td:eq(0)', nRow).html(pimg);
			rownum = rownum + 1;
			return nRow;
		},
		"aoColumns" : aoColumns
	});
}

function queryXsjzPhoto(xm,stuid){
	var url=ctx+"/xtgl/theme/ajax_query_photo";
	var submitData = {
			stuid	: stuid,
			themeid : $("#theme_id").val()
	}; 
	$.post(url,
		submitData,
     	function(data){
		var datas = eval("(" + data + ")");
		$('#photo_title').html("学生 "+xm+" 的照片");
		fillPhotoHtml(datas);
		
		$('#modal-queryphoto').modal('show');
   		return false;
    });
}



function fillPhotoHtml(datas){
	var html = "";
	var publisher = "";
	if(datas != undefined && datas != null){
		for(var i=0;i<datas.length;i++){
			if(publisher == datas[i].publisherid){
				html = html +'<img alt="" style="width:80px;height:80px;margin-left:10px;" src="'+datas[i].qiniufile+'"/></a>';
			}else{
				if(i != 0){
					html = html +'</div></div>';
				}
				html = html +'<div class="photodiv"><div class="t">'+datas[i].publisher+'上传的照片'+'</div><div class="img"><a onclick="wxImageShow(this)"><img alt="" style="width:80px;height:80px;" src="'+datas[i].qiniufile+'"/></a>';
				publisher = datas[i].publisherid;
			}
			if(i==datas.length-1){
				html = html +'</div></div>';
			}
		}
	}
	$("#photodiv").html(html);
}

function openLoadPhotoPage(stuids){
	$("#review_stuids").val(stuids);
	$('#modal-addphoto').modal('show');
	getXsjbXm(stuids);
}

function getXsjbXm(stuids){
	var url = ctx + "/xtgl/theme/ajax_query_xsjb_xm?stuids="+stuids;
	$.get(url, {}, function(data) {
		var datas = eval("(" + data + ")");
		$('#review_stuid_ch').html(datas);
		generate_table_loadinfo();
	});
	
}

function generate_table_loadinfo(){
	var rownum = 1;
	App.datatables();
	var sAjaxSource = ctx + "/xtgl/theme/ajax_query_loadImg";
	var param = "themeid=" + $("#theme_id").val();
	sAjaxSource = sAjaxSource + "?" + param;
	var aoColumns = [ {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	}, {
		"sWidth" : "70px",
		"sClass" : "text-center",
		"mDataProp" : "1"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "5"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "2"
	}, {
		"sWidth" : "150px",
		"sClass" : "text-center",
		"mDataProp" : "0"
	} ];

	$('#photo-datatable')
			.dataTable(
					{
						"aaSorting" : [ [ 3, 'desc' ] ],
						"iDisplayLength" : 20,
						"aLengthMenu" : [ [ 10, 20, 30, -1 ],
								[ 10, 20, 30, "All" ] ],
						"bFilter" : false,
						"bLengthChange" : false,
						"bDestroy" : true,
						"bAutoWidth" : false,
						"bSort" : false,
						"sAjaxSource" : sAjaxSource,
						"fnRowCallback" : function(nRow, aaData, iDisplayIndex) {
							// 序号
							$('td:eq(0)', nRow).html(rownum);
							
				        	var picHtml='<div class="gallery gallery-widget" style="margin-left: 15px;" data-toggle="lightbox-gallery"><div class="row">'
				        		+ '<a href="'+aaData[1]+'" id="picpath_a" class="gallery-link" title="'+aaData[5]+'">'
				        		+ '<img src="'+aaData[1]+'" style="height:64px;width: 64px" alt="avatar" class="img-circle"></a></div></div>';
				        	
				        	$('td:eq(1)', nRow).html(picHtml);
							
							// 删除
							var delHtml = '<div class="btn-group btn-group-xs"><a href="javascript:delFileConfirm('
									+ aaData[0] + ');">删除</a></div>';
							$('td:eq(4)', nRow).html(delHtml);

							rownum = rownum + 1;
							return nRow;
						},
						"aoColumns" : aoColumns
					});
}

function saveFile(){
	if (confirm("确认提交?")) {
		var url = ctx + "/xtgl/theme/ajax_savePhoto";
		var submitData = {
			themeid : $("#theme_id").val(),
			stuids:$("#review_stuids").val()
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("删除成功!");
				generate_table_loadinfo();
			} else {
				alert(data);
			}
			return false;
		});
	}
}

function delFileConfirm(id){
	if (confirm("确认删除?")) {
		var url = ctx + "/xtgl/theme/ajax_delFile";
		var submitData = {
			id : id
		};
		$.post(url, submitData, function(data) {
			if (data == "success") {
				alert("删除成功!");
				generate_table_loadinfo();
			} else {
				alert(data);
			}
			return false;
		});
	}
}

function setAction(){
	$("#newthread").attr("action", ctx+"/xtgl/theme/ajax_savePhoto/"+ $("#theme_id").val() + "/"+$("#review_stuids").val()+ "/"+$("#appid").val());
//	$("#newthread").submit();
}

