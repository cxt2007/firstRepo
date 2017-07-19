function dateToStr(datetime){ 
 var year = datetime.getFullYear();
 var month = datetime.getMonth()+1;//js从0开始取 
 var date = datetime.getDate(); 
 var  hour  =datetime.getHours();
 var  minutes  =datetime.getMinutes();
 if(month<10){
  month = "0" + month;
 }
 if(date<10){
  date = "0" + date;
 }
 
 var time = year+"-"+month+"-"+date+"-"+hour+":"+minutes; //2009-06-12-17:18
 return time;
}

function dateDifer(strDateStart,strDateEnd){
	 var strSeparator = "-"; //日期分隔符
	   var oDate1;
	   var oDate2;
	   var iDays;
	   oDate1= strDateStart.split(strSeparator);
	   oDate2= strDateEnd.split(strSeparator);
	   var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
	   var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
	   iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数 
	   return iDays ;
	
}
//根据年龄获取出生年月份日期是（1月1日）
function getDateByAge(age){
	var date  = new Date();
	var year = date.getFullYear()-age;
	return year+"-01-01";
}

//根据年龄获取下一年出生年月份日期是（1月1日）
function getNextYearByAge(age){
	var date  = new Date();
	var year = date.getFullYear()+1-age;
	return year+"-01-01";
}

//当月最后一天
function getFirstDayOfcurMonth(){
	var cur=new Date();
	cur.setDate(1);
	return cur;
}

//当月第一天
function getLastDayOfCurrentMonth(){
	var cur=new Date();
	var month=cur.getMonth()+1;
	if(month==12){
		month=0;
		cur.setFullYear(cur.getFullYear()+1);
	}
	cur.setMonth(month);
	cur.setDate(0);
	return cur;
}