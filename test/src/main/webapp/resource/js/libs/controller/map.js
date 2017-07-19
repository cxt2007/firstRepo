//临时存储对象，用来保存，各个业务信息id和类型
var centerLng=120.131922789001;
var centerLat=30.3134836075425;
var defaultOption = {
		id:'',
		type:'',
		lng:'',
		lat:'',
		name:''
}
var _arr = new Array();//定义一个数组，用来存放，老年人的id和marker对象;
//创建Map实例
var _MAP = new BMap.Map("indexMap"); //定义地图对象   
//_MAP.centerAndZoom(new BMap.Point(101.785048, 36.629977), 11);// 初始化地图,设置中心点坐标和地图级别 级别愈大范围越小	
_MAP.centerAndZoom(new BMap.Point(centerLng, centerLat), 17);// 初始化地图,设置中心点坐标和地图级别 级别愈大范围越小	
_MAP.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]}));//地图类型，三维，二维 ，卫星	
_MAP.addControl(new BMap.OverviewMapControl());//右下角缩略图
_MAP.addControl(new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));//右下角缩略图
_MAP.addControl(new BMap.NavigationControl());//左上角缩略图
_MAP.setCurrentCity("杭州");          // 设置地图显示的城市 此项是必须设置的	
_MAP.enableScrollWheelZoom(true);//开启鼠标滚轮缩放
/**-----  实例化鼠标绘制工具 获取多边形，圆形，折线，标记 绘制数据 begin-----------------------------------------**/
//绘制图形样式
var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.4,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
var drawingManager = new BMapLib.DrawingManager(_MAP,{
	isOpen:false,
	enableDrawingTool:false,
	enableCalculate:true,
	drawingToolOption:{
		anchor:BMAP_ANCHOR_TOP_RIGHT,
		offset:new BMap.Size(5,5),
		},
	circleOptions:styleOptions,
	polylineOptions:styleOptions,
	polygonOptions:styleOptions,
	rectangleOptions:styleOptions
});

// 添加监听事件
drawingManager.addEventListener('overlaycomplete',function(e){
	drawingManager.close();
	//判断覆盖物类型
	switch (e.drawingMode) {
	    case "polyline":break;
	    case "polygon":	break;
	    case "circle":  break;
	    case "marker":
	    	$.extend(defaultOption,e.overlay.getPosition());
	    	updateLocation(defaultOption,e.overlay);
	        break;
	}
});		
//清除地图覆盖物
function clearOverload(){
	_MAP.clearOverlays();
}
//_arr 清空临时数组
function clearMarkerAndArr(){
	for(mk in _arr){
		_arr[mk].enableMassClear();
	}
	_arr = new Array();
	_MAP.clearOverlays();
}
function create_ico(x,y){
	if(!x){
		x=0;
	}
	if(!y){
		y=0;
	}
	if(isNaN(Number)){
		var myIcon = new BMap.Icon(PATH+"/resource/images/markers_new2.png", new BMap.Size(21,32));
		myIcon.setImageOffset(new BMap.Size(-(21*x), -(y*32)));
		return myIcon;
	}
	return null;
}
/**创建marker
 * 
 * @param lng
 * @param lat
 * @param type
 * @param name
 * @param id
 * @param disMassClear : 标记生存的mark是否允许被map.clearOverlays清除 
 * x:图标x位
 * y：图标y位
 */
function create_marker(lng,lat,type,name,id,disMassClear,x,y){
	//判断id是否已经存在，存在则说明已经落点，直接返回
	if(_arr[id]){return;}
	var point = new BMap.Point(lng,lat);//定义一个坐标点
	var marker = new BMap.Marker(point,{icon:create_ico(x,y)});//定义一个marker	
	if(disMassClear){
		marker.disableMassClear();//禁止覆盖物在map.clearOverlays方法中被清除。
	}
	marker.setTitle(name);//设置title	
	marker.addEventListener("click",function(e, target){
		//创建弹出框
		createinfoWindow(type,this,id);
	});
	_MAP.addOverlay(marker);	//将marker显示到地图上
	//当坐标存在时，将marker保存起来
	if(lng && lat){
		_arr[id] = marker;
	}
}
//落点操作
function addMarker(id,type,name){
	if(_arr[id]){
		$.messageBox({message:"坐标已存在",level: "error"});    
		return;
	}
	defaultOption.id = id;
	defaultOption.type = type;
	defaultOption.name = name;
	drawingManager.open();
	drawingManager.setDrawingMode(BMAP_DRAWING_MARKER);
}
//落点操作
function setMarker(){
	drawingManager.open();
	drawingManager.setDrawingMode(BMAP_DRAWING_MARKER);
}
//测距
function measureRange(){
	drawingManager.open();
	drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
}
//测面
function measureArea(){
	drawingManager.open();
	drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
}
//获取本级行政区域边界
function showCurrentArea(){
	_MAP.clearOverlays();
	getDraw(CURRENTID);
}
//获取下辖行政区域级别
function showJurisdictionArea(){
	_MAP.clearOverlays();
	$.ajax({
        url: 'org/getChildren',
        type: 'POST',
        data:{"id":REGIONID},
        success:function(data){
			$.each(data, function(i, item){
				getDraw(item.id);
			}); 
        }
    });
};
// 绘制图形
function getDraw(orgId){
	$.ajax({
        url: 'orgMap/getListByOrgId',
        type: 'POST',
        data:{"orgId":orgId},
        success:function(data){
        	if(data && data.length>0){
        		$.each(data, function(i, item){
    				createDraw(item);
    			}); 
        	}else{
        		centerAndZoom(orgId);//没有划分辖区的情况下，通过组织机构来判断大概位置
        	}		
        }
    });
};
//删除绑定的marker
function delMarkerById(id){
	if(_arr[id]){
		var marker = _arr[id];
		marker.hide();
		_arr[id] = null;//删除当前结点
		return true;
	}
	return false;
};
function centerAndZoom(orgId){
	$.ajax({
        url: 'org/getOrg',
        type: 'POST',
        data:{"id":orgId},
        success:function(data){
        	if(data && data.organization){
        		switch(data.organization.orgLevel){
        		case "D07B0C79933243E89676FE5E90FD8495":
        			//中央
        			setCenterAndZoom(data.organization.orgName,5,"青海省");
        			break;
        		case "9806003A23BD40BCAF51B5C7676CDFD4":
        			//省
        			setCenterAndZoom(data.organization.orgName,7,"青海省");
        			break;
        		case "96CC24C7BD344318A3EB30AD56B9CB2C":
        			//市
        			setCenterAndZoom(data.organization.orgName,12,"青海省");
        			break;
        		case "65386C9D6FC545679BC4F1E6DB0C39CF":
        			//区县
        			setCenterAndZoom(data.organization.orgName,13,"青海省");
        			break;
        		case "9A228A166D8549908299F7CBA4B5E31F":
        			//街道
        			setCenterAndZoom(data.organization.orgName,14,"青海省");
        			break;
        		default:
        			$.messageBox({message:"当前辖区无法定位！",level: "error"}); 
        		}
        	}
        }
    });
}
/**通过中文地址进行定位
 * address: 中文地址
 * level：地图层级，必须是数字
 * province:地址所属的省
 * **/
function setCenterAndZoom(address,leve,province){
	if(!address){
		address="青海省";
	}
	if(!leve){
		leve = 8;
	}
	var myGeo = new BMap.Geocoder();
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(address, function(point){
		if (point) {
			_MAP.centerAndZoom(point, leve);
		}else{
			alert("您选择地址没有解析到结果!");
		}
	},province);
}
/**--------------------------- 添加绘制图案绘制图案 begin------------------------------------------------------------------------*/
function marker(point){
	return new BMap.Marker(point);
};
function circle(point,radius){
	return new BMap.Circle(point,radius,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
};
function polyline(points){
	return new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
};
function polygon(points){
	return new BMap.Polygon(points, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});  //创建多边形
};
function rectangle(points){
	return new BMap.Polygon(points, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
};
//创建地图焦点
function point(lng,lat){
	return new BMap.Point(lng,lat);
};
//此处接受的是后台的 orgMap 对象并绘制相应的图形;  绘制的类型依type而定  点，线，多边形，矩形，圆形
function createDraw(orgMap){
	var type = orgMap.type;//类型
	var cornerPoints = orgMap.cornerPoints;//多边形坐标组 eg:[{"lng":116.533356,"lat":40.148357},{"lng":116.513809,"lat":40.023823}]
	var radius = orgMap.radius;//半径
	var center = orgMap.center;//焦点坐标eg: {"lng":115.948092,"lat":40.080378}
	var position = orgMap.position;
	var lngLatCenter = null;//中心点
	var e = {
		overlay:null,
		drawingMode:type,
	};
	if(type=='marker'){//点		
		e.overlay = marker(getLngLat(position));
		lngLatCenter = e.overlay.getPosition();
	}else if(type=='polyline'){//线			
		e.overlay = polyline(getLngLat(cornerPoints));
		lngLatCenter = e.overlay.getBounds().getCenter();
	}else if(type=='circle'){//圆
		e.overlay = circle(getLngLat(center),radius);
		lngLatCenter = e.overlay.getCenter();
	}else if(type=='polygon'){//多边形			
		e.overlay = polygon(getLngLat(cornerPoints));
		lngLatCenter = e.overlay.getBounds().getCenter();
	}else if(type=='rectangle'){//矩形			
		e.overlay = rectangle(getLngLat(cornerPoints));
		lngLatCenter = e.overlay.getBounds().getCenter();
	};
	var label = new BMap.Label(orgMap.orgName); 
	label.setPosition(lngLatCenter);
	label.hide();
	_MAP.panTo(lngLatCenter);
	//绘制图形
	e.overlay.addEventListener("dblclick",function(e){
		//弹出统计图
		showChart(orgMap.orgCode);
	});
	e.overlay.addEventListener("mouseover",function(e){
		label.show();
	});
	e.overlay.addEventListener("mouseout",function(e){
		label.hide();
	});
	
	_MAP.addOverlay(label);
	_MAP.addOverlay(e.overlay);
};

//解析焦点坐标;分为中心坐标和边角坐标组，如果只有一个中心坐标，返回:point，如果是一组坐标，返回:数组[point]
function getLngLat(points){
	var arr = new Array();
	var obj = JSON.parse(points);
	if(obj.length){//多边行	
		$.each(obj, function(i, item){     
			arr.push(new BMap.Point(item.lng,item.lat));
		}); 
	}else{//点或者圆			
		return point(obj.lng,obj.lat);
	}
	return arr;
};
/**---------------------------- 添加绘制图案绘制图案 end------------------------------------------------------------------**/

//更新地址坐标
function updateLocation(option,marker){
	if(option && option.id){
		$.ajax({
			url: 'location/updateElderly',
	        type: 'POST',
	        data:option,
			success : function(data) {
				if(data==true){
					_arr[option.id]=marker;//添加落点后
					marker.disableMassClear();//禁止覆盖物在map.clearOverlays方法中被清除
					marker.setTitle(option.name);	
					marker.addEventListener("click",function(e, target){
						//创建弹出框
						createinfoWindow(option.type,this,option.id);
					});
					$.messageBox({message:"绑定成功",level: "success"});  
				}else{
					$.messageBox({message:"绑定失败",level: "error"});
				}
			}
		});
	}	
	//清除参数
	defaultOption = {
			id:'',
			type:'',
			lng:'',
			lat:'',
			name:''
	};
};
//给marker添加信息窗口
function createinfoWindow(type,marker,id){	
	var point = marker.getPosition();
	var sContent = infoWindowContext(type,id);	
	var infoWindow = new BMap.InfoWindow(sContent);
	marker.openInfoWindow(infoWindow);
};
//点击名称列表，显示地图上的标记内容
function elderInfo(type,id){
	if(_arr[id]){
		_MAP.centerAndZoom(_arr[id].getPosition(), 12);
		createinfoWindow(type,_arr[id],id);
	}else{
		$.messageBox({message:"未绑定坐标",level: "error"});  
	}
}
//搜索方法
function search(){
	var type = new Array();
    $("#perimeterSearch input[name='type']:checked").each(function(){ 
        if($(this).attr("checked")){
        	type.push($(this).val());
        }
    })
	var radius = $('#perimeterSearch input[name="radius"]:checked').val();	
	var query = $('#perimeterSearch #query').val();
	var lng = $('#lng').val();
	var lat = $('#lat').val();
	if(!radius){
		$.messageBox({message:"请输入查找范围",level: "error"}); 
		return;
	}
	if(type.length < 1){
		$.messageBox({message:"请选择你要查询的类型",level: "error"}); 
		return;
	}
	_MAP.clearOverlays();
	var circle = new BMap.Circle(new BMap.Point(lng,lat),radius,{strokeColor:"red", strokeWeight:1, strokeOpacity:0.8});
	_MAP.addOverlay(circle);
	//获取当前圆形的bounds对象，并获取左下和又上坐标
	var bounds = circle.getBounds();
	var swPoint = bounds.getSouthWest();
	var nePoint = bounds.getNorthEast();	
	var maxlat = nePoint.lat;
	var minlat = swPoint.lat;
	var maxlng = nePoint.lng;
	var minlng = swPoint.lng;
	$.ajax({
        url: 'location/search',
        type: 'POST',
        data:{'maxlat':maxlat,'minlat':minlat,'maxlng':maxlng,'minlng':minlng,'query':query,'type':JSON.stringify(type),'orgCode' : CURRENTCODE},
        success:function(data){
        	var i = 0;
        	$(data).each(function(){ 
        		//将查询出来的值，过滤一次（圆形过滤），放到地图上
        		var point = new BMap.Point(this.lng,this.lat);        		
        		if(BMapLib.GeoUtils.isPointInCircle(point,circle)){
        			create_marker(this.lng,this.lat,this.type,this.name,this.id,false,i,2);
        			i++;
        		}
            })
        }
    });
};

//创建infowindow弹出框内容页
function infoWindowContext(type,id){
	var url;
	var content;
	if(type=='ELDERLY'){
		//老年人
		url = "location/elderlyInfoWindow"
	}else if(type=='SOCIALBUSINESS'){
		url = "location/businessInfoWindow"
	}else if(type=='SERVICEAGENCIES'){
		url = "location/serviceInfoWindow"
	}else if(type=='ISSUE'){
		url = "location/issueWindow"
	}else if(type=='ISSUEBYUNDER'){
		url = "location/issueWindow"
	}else if(type=='RECORD'){
		url = "location/recodeWindow"
	}
	if(url){
		$.ajax({
	        url: url,
	        type: 'POST',
	        data:{'id':id},
	        async:false, 
	        success:function(data){
	        	content = data;
	        }
	    });
	}else{
		$.messageBox({message:"类型错误，请联系管理员！",level: "error"}); 
	}	
	return content;
}