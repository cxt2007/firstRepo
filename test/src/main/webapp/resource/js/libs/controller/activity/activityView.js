$(function(){
	$(".activeDescription").on('click','.expand',function(){
		$('.descriptionMod').css({overflow:'auto',height:'auto'});
		$(this).text("收起 ↑").removeClass("expand").addClass('collapse');
	});
	
	$(".activeDescription").on('click','.collapse',function(){
		$('.descriptionMod').css({overflow:'hidden',height:'150px'});
		$(this).text("展开 ↓").removeClass("collapse").addClass('expand');
	});
});