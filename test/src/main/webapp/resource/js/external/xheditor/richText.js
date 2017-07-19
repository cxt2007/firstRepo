(function($) {
	$.fn.extend( {
		richText : function(option) {
			var defaultOption = {
					tools : 'Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,'+
					'SelectAll,Removeformat,|,Align,List,Outdent,Indent,|,Img,Fullscreen',
					skin : 'vista',forcePtag:false
			}; 
			$.extend(defaultOption,option);
			$(this).xheditor(defaultOption).focus();
		}
	});
	$.fn.extend( {
		richImg : function(option) {
			var defaultOption = {
					tools : 'Blocktag,Fontface,FontSize,Bold,Italic,Underline,Strikethrough,FontColor,BackColor,'+
					'SelectAll,Removeformat,|,Align,List,Outdent,Indent,|,Img,Fullscreen',
					skin : 'default',
					upMultiple:true,
					upImgUrl: "/imageUpload/ajaxUploadImg.action",
					upImgExt: "jpg,jpeg,gif,bmp,png",
					html5Upload:false,
					cleanPaste:0,forcePtag:false
			}; 
			$.extend(defaultOption,option);
			return $(this).xheditor(defaultOption);
		}
	});
	
	$.fn.extend({
		noBarRichText : function(option){
			var defaultOption = {
				tools : '',
				skin : 'vista',forcePtag:false
			}; 
			$.extend(defaultOption,option);
			$(this).xheditor(defaultOption).focus();
			$('.xhe_vista table tbody tr:first').remove();
		}
	});
})(jQuery)