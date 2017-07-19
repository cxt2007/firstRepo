(function(window, jQuery, undefined) {
	
	var ctxPath = (function() {
        /^http:\/\/.*?(\/.*?)\/.*$/.exec(location.href);
        return "http://"+window.location.host+RegExp.$1;
    })();
	var resourcePath = ctxPath + "/static";

    var HTMLS = {
        ovl: '<div class="J_WinpopGhMask ghbb-mask" id="J_WinpopGhMask"></div>' + '<div class="J_WinpopGhBox ghbb-box" id="J_WinpopGhBox">' + '<div class="J_WinpopMain ghbb-main"> '+ '<div class="J_WinpopGhImg ghbb-left"></div>' + '<div class="J_WinpopGhText ghbb-right"></div>' +'</div>' +'</div>',
        
		prompt: '<img class="J_PromptImg pop-img" src="'+resourcePath+'/jquery/winpop/images/gh_xh_wating.gif" >',
		
    }

    function WinpopGh() {
        var config = {};
        this.get = function(n) {
            return config[n];
        }

        this.set = function(n, v) {
            config[n] = v;
        }
        this.init();
    }

    WinpopGh.prototype = {
        init: function() {
            this.createDom();
            this.bindEvent();
        },
        createDom: function() {
            var body = jQuery("body"),
                ovl = jQuery("#J_WinpopGhBox");

            if (ovl.length === 0) {
                body.append(HTMLS.ovl);
            }

            this.set("ovl", jQuery("#J_WinpopGhBox"));
            this.set("mask", jQuery("#J_WinpopGhMask"));
        },
        bindEvent: function() {
            var _this = this,
                ovl = _this.get("ovl"),
                mask = _this.get("mask");
//            jQuery(document).on("keyup", function(e) {
//                var kc = e.keyCode,
//                    cb = _this.get("confirmBack");;
//                if (kc === 27) {
//                    _this.hide();
//                } else if (kc === 13) {
//                    _this.hide();
//                    if (_this.get("type") === "confirm") {
//                        cb && cb(true);
//                    }
//                }
//            });
        },
        prompt: function(str, imgstr) {
            var str = typeof str === 'string' ? str : str.toString(),
                ovl = this.get("ovl");
            this.set("type", "prompt");
            ovl.find(".J_WinpopGhText").html(str);
            if (typeof imgstr == "undefined") {
                ovl.find(".J_WinpopGhImg").html(HTMLS.prompt);
            } else {
                ovl.find(".J_WinpopGhImg").html(imgstr);
            }
            this.show();
        },
        show: function() {
            this.get("ovl").show();
            this.get("mask").show();
        },
        hide: function() {
            var ovl = this.get("ovl");
            ovl.find(".J_WinpopGhMain").html("");
            ovl.find(".J_WinpopGhBtns").html("");
            ovl.hide();
            this.get("mask").hide();
        },
        destory: function() {
            this.get("ovl").remove();
            this.get("mask").remove();
            delete window.prompt;
        }
    };
	
	window.WinpopGh = window.WinpopGh || WinpopGh;

//    var obj = new WinpopGh();
//    window.alert = function(str) {
//        obj.alert.call(obj, str);
//    };
//    window.confirm = function(str, cb) {
//        obj.confirm.call(obj, str, cb);
//    };
	
})(window, jQuery);