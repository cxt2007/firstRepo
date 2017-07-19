$(document).ready (function(){
//loops to add classes and identifiers
	 $(".group li a").each(function(index, element){$(element).attr("rel", 'image'+index);});
	
	//variables
	var mainImg = "";
	var showImg = "";
	var contWidth = $('#photo_wrap').width();
	var loadClose = "<div id='preloading'><div class='imgLoading'><img src='/resource/images/ajax-loader.gif' /></div><div id='close_msg' class='hide'><p>点击图片关闭</p></div></div>";
	
	//slider if needed
	 $('#thumbs').css('width',contWidth);
	 $('body').append(loadClose);
	 
	//click thumbs function MAGIC!
	$('.thumb_img a').click (function(){
		showImg = $(this).attr("href");
		$('.imgLoading').fadeIn('slow', loadImage());
		return false;
		
		function loadImage(){
			var img = new Image;
			var large_images = "<div id='large_images'> </div>";
			
			//Img load
			$(img).load(function () {
				$('.imgLoading').fadeOut('fast', function(){
					$('#close_msg').fadeTo('slow', 0.5).delay(500).fadeOut('slow');
				});
				//判断是否存在large_images节点
				if(!($('#large_images')[0])){
					$('body').append(large_images);
				}
				
				//show
				$('#large_images').empty().append(this,showImgs());
			}).error(function () {
					$.messageBox({level:'error',messages:'图片加载错误'});
			}).attr('src', showImg).addClass('current');
			
			setTimeout(function(){
				$('.imgLoading').hide();
			},500);
			
		}
			//large_images show
			function showImgs(){
				$('#large_images').fadeIn('slow');
			}
	});
	
	//close image function
	$('body').on('click','#large_images',function(){
		$(this).fadeOut('slow', function(){
		$('.current').remove();								 
		});
	});
	
});