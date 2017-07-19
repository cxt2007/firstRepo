var ctx = $("#main_ctx").val();
var commonUrl_ajax = ctx + ApiParamUtil.COMMON_URL_AJAX;

$(function(){
	loading_teacher_info();
	loading_login_total();
	loading_login_score();
	loading_content_total();
	loading_content_score();
	loading_comment_total();
	loading_comment_score();
	
	loading_msg_total();
	loading_bjq_total();
	loading_ktdt_total();
	loading_news_total();
	loading_bbzp_total();
	if($("#main_orgcode").val() == '10010'){
		loading_zthd_total_for_zky();
	}else{
		loading_zthd_total();
	}
	
	loading_yezs_total();
	loading_mzcp_total();
	loading_homework_total();
	loading_exam_total();
	
	$(".index_btn .btn").each(function(k,img){
		new JumpObj(img,5);
		$(img).hover(function(){this.parentNode.parentNode.className="hover"});
	});
});

function loading_teacher_info() {
	var param = {
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.USER_CENTER_TEACHER_INFO,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#jf_total").html(datas.jf_total);
			$("#name").html(datas.name);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_login_total() {
	var param = {
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.USER_CENTER_CURRENT_MONTH_LOGIN_DAY_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#login_total").html(datas.login_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_login_score() {
	var param = {
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.USER_CENTER_CURRENT_MONTH_LOGIN_SCORE_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#login_score").html(datas.login_score);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_content_total() {
	var param = {
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.USER_CENTER_CURRENT_MONTH_CONTENT_PUBLISH_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#content_total").html(datas.content_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_content_score() {
	var param = {
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.USER_CENTER_CURRENT_MONTH_CONTENT_SCORE_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#content_score").html(datas.content_score);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_comment_total() {
	var param = {
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.USER_CENTER_CURRENT_MONTH_COMMENT_PUBLISH_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#comment_total").html(datas.comment_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_comment_score() {
	var param = {
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.USER_CENTER_CURRENT_MONTH_COMMENT_SCORE_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#comment_score").html(datas.comment_score);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}


function loading_homework_total(){
	var param = {
		campusid : $("#main_campusid").val()
	}
	var submitData = {
		api : ApiParamUtil.MY_CLASS_HOMEWORK_CAMPUS_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#homework_total").html(datas.homework_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}
function loading_exam_total(){
	var param = {
		campusid : $("#main_campusid").val()
	}
	var submitData = {
		api : ApiParamUtil.MY_CLASS_EXAM_CAMPUS_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#exam_total").html(datas.exam_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_msg_total() {
	var param = {
		orgcode : $("#main_orgcode").val(),
		campusid : $("#main_campusid").val(),
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.MSG_CENTER_CAMPUS_MESSAGE_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#msg_total").html(datas.msg_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_bjq_total() {
	var param = {
		orgcode : $("#main_orgcode").val(),
		campusid : $("#main_campusid").val(),
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.MY_CLASS_CLASS_CIRCLE_CAMPUS_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#bjq_total").html(datas.bjq_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_ktdt_total() {
	var param = {
		orgcode : $("#main_orgcode").val(),
		campusid : $("#main_campusid").val(),
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.MY_CLASS_CLASSROOM_CAMPUS_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#ktdt_total").html(datas.ktdt_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_news_total() {
	var param = {
		orgcode : $("#main_orgcode").val(),
		campusid : $("#main_campusid").val(),
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.MYSHCOOL_NEWS_CAMPUS_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#news_total").html(datas.news_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_zthd_total_for_zky(){
	var param = {
			orgcode : $("#main_orgcode").val(),
			campusid : $("#main_campusid").val(),
			userid : $("#main_userid").val()
		}
		var submitData = {
			api : ApiParamUtil.MY_CLASS_THEME_CAMPUS_TOTAL_FOR_ZKY,
			param : JSON.stringify(param)
		};
		$.post(commonUrl_ajax, submitData, function(data) {
			var json = typeof data === "object" ? data : JSON.parse(data);
			if (json.ret.code == "200") {
				var datas = json.data;
				$("#zthd_total").html(datas.theme_total);
			} else {
				PromptBox.alert(json.ret.msg);
			}
		});
}

function loading_bbzp_total() {
	var param = {
		orgcode : $("#main_orgcode").val(),
		campusid : $("#main_campusid").val(),
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.MY_CLASS_BABY_ARTICLE_CAMPUS_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#bbzp_total").html(datas.bbzp_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_zthd_total() {
	var param = {
		orgcode : $("#main_orgcode").val(),
		campusid : $("#main_campusid").val(),
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.MY_CLASS_THEME_CAMPUS_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#zthd_total").html(datas.zthd_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_yezs_total() {
	var param = {
		orgcode : $("#main_orgcode").val(),
		campusid : $("#main_campusid").val(),
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.DAILY_MANAGE_KNOWLEDGE_CAMPUS_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#yezs_total").html(datas.yezs_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function loading_mzcp_total() {
	var param = {
		orgcode : $("#main_orgcode").val(),
		campusid : $("#main_campusid").val(),
		userid : $("#main_userid").val()
	}
	var submitData = {
		api : ApiParamUtil.DAILY_MANAGE_MZCP_CAMPUS_DAY_TOTAL,
		param : JSON.stringify(param)
	};
	$.post(commonUrl_ajax, submitData, function(data) {
		var json = typeof data === "object" ? data : JSON.parse(data);
		if (json.ret.code == "200") {
			var datas = json.data;
			$("#mzcp_total").html(datas.mzcp_total);
		} else {
			PromptBox.alert(json.ret.msg);
		}
	});
}

function previewInThePhone(id){
	var ctx = $("#ctx").val();
	var appid = "107118";
	var url = ctx+"/mobile/loading_page?appid="+appid+"&dataid="+id+"&preview=1&orgcode="+$("#main_orgcode").val()+"&campusid="+$("#main_campusid").val();
	window.open (url,'newwindow','height=680,width=760,top=20,left=330,scrollbars=yes,location=no');
}

//图片鼠标移上去的动画效果
function JumpObj(elem, range, startFunc, endFunc) {
    var curMax = range = range || 6;
    startFunc = startFunc || function(){};
    endFunc = endFunc || function(){};
    var drct = 0;
    var step = 1;

    init();

    function init() { elem.style.position = 'relative';active() }
    function active() { elem.onmouseover = function(e) {if(!drct)jump()} }
    function deactive() { elem.onmouseover = null }

    function jump() {
         var t = parseInt(elem.style.top);
        if (!drct) motionStart();
        else {
            var nextTop = t - step * drct;
            if (nextTop >= -curMax && nextTop <= 0) elem.style.top = nextTop + 'px';
            else if(nextTop < -curMax) drct = -1;
           else {
                var nextMax = curMax / 2;
                if (nextMax < 1) {motionOver();return;}
                curMax = nextMax;
                drct = 1;
            }
        }
        setTimeout(function(){jump()}, 200 / (curMax+3) + drct * 3);
     }
	function motionStart() {
        startFunc.apply(this);
        elem.style.top='0';
        drct = 1;
    }
	  function motionOver() {
        endFunc.apply(this);
        curMax = range;
        drct = 0;
        elem.style.top = '0';
    }

    this.jump = jump;
    this.active = active;
    this.deactive = deactive;
}