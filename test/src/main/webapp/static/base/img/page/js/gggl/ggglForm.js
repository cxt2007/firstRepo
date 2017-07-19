var ctx = $('#ctx').val();
$(document).ready(function() {
	getAdInfo();
});

function getAdInfo(){
	if($("#adId").val() != null && $("#adId").val() != ""){
		var submitData = {
			api:ApiParamUtil.DLS_AD_ONE_QUERY,
			param:JSON.stringify({
				id:$("#adId").val()
			})
		};
		$.ajax({
			cache:false,
			type: "POST",
			url: commonUrl_ajax,
			data: submitData,
			success: function(datas){
				var result = typeof datas === "object" ? datas : JSON.parse(datas);
				if(result.ret.code==="200"){
					setAdInfo(result.data);
				}else{
					console.log(result.ret.code+":"+result.ret.msg);
				}
			}
		});
	}
}

function setAdInfo(adInfo){
	if(adInfo != null){
		$("#title").html(adInfo.title);
		$("#adImgPath").attr("src",adInfo.picpath);
		$("#content").html(adInfo.content);
		$("#adurl").html(adInfo.adurl);
		if(adInfo.adurl != null || adInfo.adurl != ""){
			$("#a_adurl").attr("href",adInfo.adurl);
			$("#a_adurl").removeClass("hide");
		}
		
	}
}