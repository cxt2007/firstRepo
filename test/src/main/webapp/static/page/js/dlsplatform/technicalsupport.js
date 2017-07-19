var ctx = $("#ctx").val();
$(document).ready(function() {	
	App.datatables();
	generateTable();
	$("#savebtn").click(function(){
		saveData();
	})
});

function generateTable(){
	GHBB.prompt("正在加载~");
	var rownum = 1;
	var aoColumns= [
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "title","sTitle":"标题"},
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "publisher","sTitle":"发布人"},
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "publishdate","sTitle":"发布日期"},
					{ "sWidth": "150px", "sClass": "text-center","mDataProp": "title","sTitle":"管理"}
	           ];
	$('#datatable').dataTable({
		"iDisplayLength" : 20,
		"bFilter" : false,
		"bLengthChange" : false,
		"bDestroy" : true,
		"bAutoWidth" : false,
		"sAjaxSource" : commonUrl_ajax,
		"fnServerParams": function (aoData) {
			var param = {
			};
			aoData.push( { "name": "api", "value": ApiParamUtil.DLS_SET_DATA_LIST } );
			aoData.push( { "name": "param", "value": JSON.stringify(param) } );
			aoData.push( { "name": "iDisplayStart", "value": 0 } );
			aoData.push( { "name": "iDisplayLength", "value": 20 } );
			aoData.push( { "name": "sEcho", "value": 0 } );
		},
		"fnServerData": function (sSource, aoData, fnCallback) {
            $.ajax( {
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": aoData,
                "success": function(json) {
                	if (json.ret.code == 200) {
                		fnCallback(json.data);
                	} else {
                		PromptBox.alert(json.ret.msg);
                	}
				}             
            } );
        },
		"bSort" : false,
		"bServerSide" : true,// false为前端分页
		"aaSorting" : [[ 1, "asc" ]],
		"fnRowCallback": function( nRow, aaData, iDisplayIndex ) {
			var html='<a href="javascript:toEdit('+aaData.id+')">编辑</a>';
			$('td:eq(3)', nRow).html(html);
		}, 
		"aoColumns" : aoColumns,
		"fnInitComplete": function(oSettings, json) {
			GHBB.hide();
	    }
	});		
}
function toEdit(id){
	GHBB.prompt("正在加载~");
	var param = {
			id:id
		};
	var submitData = {
		api : ApiParamUtil.DLS_SET_DATA_ONE_QUERY,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
		var json = typeof data === "object" ? data : JSON.parse(data);			
		if (json.ret.code==200) {
			$("#dataid").val(json.data.id);
			$("#title_edit").val(json.data.title);
			$("#publishdate_edit").val(json.data.publishdate);
			$("#content_edit").val(json.data.content);
			editor.html(json.data.content);
			$("#modal_editconfig").modal("show");			
		} else {
			console.log(json.ret.code+":"+json.ret.msg);
		}
	});
}
function saveData(){
	GHBB.prompt("正在加载~");
	var param = {
			id:$("#dataid").val(),
			publishdate:$("#publishdate_edit").val(),
			content:$("#content_edit").val()
		};
	var submitData = {
		api : ApiParamUtil.DLS_SET_DATA_ONE_SAVE,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		GHBB.hide();
		var json = typeof data === "object" ? data : JSON.parse(data);			
		if (json.ret.code==200) {
			$("#title_edit").val("");
			$("#publishdate_edit").val("");
			$("#content_edit").val("");
			$("#modal_editconfig").modal("hide");
			generateTable();
		} else {
			console.log(json.ret.code+":"+json.ret.msg);
		}
	});
}

KindEditor.ready(function(K) {
	var folder = "dlssetdata";
	editor = K.create('textarea[name="content_edit"]', {
		cssPath : ctx + '/static/kindeditor/plugins/code/prettify.css',
		uploadJson : ctx + '/filehandel/kindEditorUpload/' + folder + '/image',
		fileManagerJson : ctx + '/filehandel/kindEditorFileManager',
		allowFileManager : true,
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['inputForm'].submit();
			});
		},
		afterBlur : function() {
			this.sync();
		}
	});
});

