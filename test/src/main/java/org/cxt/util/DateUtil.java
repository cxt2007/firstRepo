package org.cxt.util;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class DateUtil {

	private static Logger logger = LoggerFactory.getLogger(DateUtil.class);

	/**
	 * 将日期转化成字符串
	 * 
	 * @param date
	 * @return
	 */
	public static final String COMPACT_DATE_FORMAT = "yyyyMMdd";
	public static final String YM = "yyyyMM";
	public static final String NORMAL_DATE_FORMAT = "yyyy-MM-dd";
	public static final String NORMAL_DATE_FORMAT_NEW = "yyyy-mm-dd hh24:mi:ss";
	public static final String DATE_FORMAT = "yyyy-MM-dd";
	public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	public static final String DATETIME_FORMAT_MINUTE = "HH:mm";
	public static final String DATETIME_FORMAT_SECOND = "HH:mm:ss";
	public static final String DATE_ALL = "yyyyMMddHHmmssS";
	public static final String DATE_YYYY = "yyyy";
	public static final String DATE_YYYYMM = "yyyy-MM";
	public static final String DATE_MMDD = "MM-dd";
	public static final String DATE_MM = "MM";

	public static final String DAY_START_TIME_000000 = " 00:00:00";
	public static final String DAY_END_TIME_235959 = " 23:59:59";

	public static final String DATE_YYYYMMHH = "yyyy年MM月dd日hh时";
	public static final String DATE_YMD_CHINA = "yyyy年MM月dd日";
	public static final String DATE_MD_CHINA = "MM月dd日";

	public static String formatDate2NN(Date date) {
		StringBuffer dateBuffer = new StringBuffer("");
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			dateBuffer.append(calendar.get(Calendar.YEAR)).append("-");
			dateBuffer.append(calendar.get(Calendar.MONTH) + 1).append("-");
			dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH));
		}
		return dateBuffer.toString();
	}

	/**
	 * 获取当前yyyy-MM-dd格式日期
	 * 
	 * @return
	 */
	public static String getCurrentYYYYMMTime() {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_YYYYMM);
		Date currentTime = calendar.getTime();
		return sdf.format(currentTime);
	}

	/**
	 * 获取当前yyyy-MM-dd格式日期
	 * 
	 * @return
	 */
	public static String getCurrentYYYYTime() {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(NORMAL_DATE_FORMAT);
		Date currentTime = calendar.getTime();
		return sdf.format(currentTime);
	}

	public static String getCurrentYear() {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_YYYY);
		Date currentTime = calendar.getTime();
		return sdf.format(currentTime);
	}

	/**
	 * 2015-08-12 00:00:00
	 * 
	 * @return
	 */
	public static String getDayBeginTime(String day) {
		if (StringUtil.isNotEmpty(day)) {
			return day + " 00:00:00";
		} else {
			return day;
		}
	}

	/**
	 * 2015-08-12 23:59:59
	 * 
	 * @return
	 */
	public static String getDayEndTime(String day) {
		if (StringUtil.isNotEmpty(day)) {
			return day + " 23:59:59";
		} else {
			return day;
		}
	}

	/**
	 * 2015-08-12 00:00:00
	 * 
	 * @return
	 */
	public static String getCurrentDayBeginTime() {
		return getCurrentYYYYTime() + " 00:00:00";
	}

	/**
	 * 2015-08-12 23:59:59
	 * 
	 * @return
	 */
	public static String getCurrentDayEndTime() {
		return getCurrentYYYYTime() + " 23:59:59";
	}

	public static long getTimeMilliSecond(String dateStr) {
		Date date = null;
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			date = formatter.parse(dateStr);
			return date.getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return 0;
		}
	}

	/**
	 * 获取当前yyyy-MM-dd HH:mm:ss格式日期
	 * 
	 * @return
	 */
	public static String getCurrentAllTime() {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT);
		Date currentTime = calendar.getTime();
		return sdf.format(currentTime);
	}

	/**
	 * 获取当前HH:mm:ss格式时间
	 * 
	 * @return
	 */
	public static String getCurrentHourMinSecond() {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT_SECOND);
		Date currentTime = calendar.getTime();
		return sdf.format(currentTime);
	}

	/**
	 * yyyy-MM-dd 转换成 yyyy年MM月dd日
	 * 
	 * @return
	 */
	public static String convertDateToChinaYMD(Object date) {
		String str = "";
		String[] dateArr = StringUtil.getNullStr(date).split("-");
		if (dateArr.length == 3) {
			str = dateArr[0] + "年" + dateArr[1] + "月" + dateArr[2] + "日";
		}
		return str;
	}

	/**
	 * 将时间 yyyy-mm-dd hh:mm:ss 格式为：HH:mm
	 * 
	 * @return
	 */
	public static String convertFullTimeToHm(String time) {
		if (StringUtil.isNotEmpty(time) && time.length() > 16) {
			time = time.substring(11, 16);
		}
		return time;
	}

	/**
	 * 将时间 HH:mm:ss 去秒格式为：HH:mm
	 * 
	 * @return
	 */
	public static String convertTimeToHm(String time) {
		if (StringUtil.isNotEmpty(time) && time.length() > 5) {
			time = time.substring(0, 5);
		}
		return time;
	}

	/**
	 * 与当前日期比较，返回 今天 或 昨天 或 前天， 否则返回日期
	 * 
	 * @param datetime
	 * @return
	 */
	public static String convertDateToSpecial(String datetime) {
		try {
			Date date = parseDateTime(datetime);
			int days = getDaysBetween(date, getCurrentTimeDate());
			switch (days) {
			case 0:
				return "今天";
			case 1:
				return "昨天";
			case 2:
				return "前天";
			default:
				return datetime.split(" ")[0];
			}
		} catch (Exception e) {
			e.printStackTrace();
			return datetime.split(" ")[0];
		}
	}

	public static Date getCurrentTimeDate() {
		Calendar calendar = Calendar.getInstance();

		return calendar.getTime();
	}

	public static String getTimeAndWeek() {
		return DateUtil.fomartCurrentTime(DateUtil.DATE_FORMAT) + " "
				+ DateUtil.getChineseWeekday(Calendar.getInstance());
	}

	/**
	 * 将秒转为天/小时/分钟
	 * 
	 * @param second
	 * @return
	 */
	public static String getTimeStr(long second) {
		if (second < 60) {
			return getPureSecond(second);
		} else if (second < 3600) {
			return getMinSec(second);
		} else if (second < 24 * 3600) {
			return getHourMinSec(second);
		} else {
			return getDayHourMinSec(second);
		}

	}

	private static String getDayHourMinSec(long second) {
		long day = second / (24 * 3600);
		long restsecond = second - day * 24 * 3600;

		if (restsecond < 60) {
			return getPureDay(day) + getPureSecond(restsecond);
		} else if (restsecond < 3600) {
			return getPureDay(day) + getMinSec(restsecond);
		} else {
			return getPureDay(day) + getHourMinSec(restsecond);
		}

	}

	private static String getMinSec(long second) {
		long minute = second / 60;
		long restsecond = second - minute * 60;
		return getPureMinute(minute) + getPureSecond(restsecond);
	}

	private static String getHourMinSec(long second) {
		long hour = second / 3600;

		long restsecond = second - hour * 3600;

		if (restsecond < 60) {
			return getPureHour(hour) + getPureSecond(restsecond);
		} else {
			return getPureHour(hour) + getMinSec(restsecond);
		}

	}

	private static String getPureDay(long day) {
		return day + "天";
	}

	private static String getPureHour(long hour) {
		return hour + "小时";
	}

	private static String getPureMinute(long minute) {
		return minute + "分";
	}

	private static String getPureSecond(long second) {
		return second + "秒";
	}

	/**
	 * 获得差异时间，返回分钟
	 * 
	 * @param biTime
	 * @param smallTime
	 * @return
	 */
	public static long getTimeDifference(String biTime, String smallTime) {
		SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT);
		Date bigDate = null;
		Date smallDate = null;
		long minute = 0;
		try {
			bigDate = sdf.parse(biTime);
			smallDate = sdf.parse(smallTime);
			minute = bigDate.getTime() - smallDate.getTime();
			// minute = minute / (1000 * 60 );
		} catch (Exception pe) {
			minute = 1000 * 1000 * 1000 * 100;
		}
		return minute;
	}

	/**
	 * 格式化当前时间格式
	 * 
	 * @param datePattern
	 * @return
	 */
	public static String fomartCurrentTime(String datePattern) {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(datePattern);
		Date currentTime = calendar.getTime();
		return sdf.format(currentTime);
	}

	public static String getCurrentTime() {
		return String.valueOf(new Date().getTime());
	}

	/**
	 * 格式化日期为字符串yyMMddHHmm(2位的年月日时分) eg:100103111111
	 * 
	 * @param date
	 *            当前日期
	 * @return
	 * @author:hbz
	 */
	public static String getFormatDate(Date date) {
		SimpleDateFormat sdft = new SimpleDateFormat("yyMMddHHmm");
		return sdft.format(date);
	}

	/**
	 * 从日期中取得时间 格式: HH:mm:ss
	 * 
	 * @param date
	 * @return
	 */
	public static String formatDateToTime(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
		return sdf.format(date);
	}

	/**
	 * 将字符串转成java.sql.Timestamp 字符串格式要求：yyyy-MM-dd HH:mm:ss
	 * 
	 * @param dateTime
	 * @return
	 */
	public static Timestamp getTimestamp(String dateTime) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			Date d = sdf.parse(dateTime);
			return new Timestamp(d.getTime());
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("时间格式错误", e);
		}
	}

	public static Timestamp getCurrentTimestamp() {
		return new Timestamp(new Date().getTime());
	}

	/**
	 * 将java.sql.Timestamp转化为yyyy-MM-dd HH:mm:ss字符串.
	 * 
	 * @param ts
	 * @return
	 */
	public static String getStrTimestamp(Timestamp ts) {
		DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String tsStr = sdf.format(ts);
		return tsStr;
	}

	/**
	 * 获取一周中，周一和周日的日期
	 * 
	 * @return
	 */

	public static Map<String, String> getWeekMonAndSun() {
		Map<String, String> map = new HashMap<String, String>();
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		cal.add(Calendar.DATE, -1);
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY); // 获取本周一的日期

		map.put("monday", df.format(cal.getTime()));
		// 这种输出的是上个星期周日的日期，因为老外那边把周日当成第一天
		cal.add(Calendar.DATE, -1);
		cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
		// 增加一个星期，才是我们中国人理解的本周日的日期
		cal.add(Calendar.WEEK_OF_YEAR, 1);

		map.put("sunday", df.format(cal.getTime()));
		return map;
	}

	public static Date parseDate(String strFormat, String dateValue) {
		if (dateValue == null) {
			return null;
		}
		if (strFormat == null) {
			strFormat = "yyyy-MM-dd";
		}
		SimpleDateFormat dateFormat = new SimpleDateFormat(strFormat);
		Date newDate = null;
		try {
			newDate = dateFormat.parse(dateValue);
		} catch (ParseException pe) {
			newDate = null;
		}
		return newDate;
	}

	public static Long strDateToNum(String paramString) throws Exception {
		if (paramString == null) {
			return null;
		}
		String[] arrayOfString = null;
		String str = "";
		if (paramString.indexOf("-") >= 0) {
			arrayOfString = paramString.split("-");
			for (int i = 0; i < arrayOfString.length; ++i) {
				str = str + arrayOfString[i];
			}
			return Long.valueOf(Long.parseLong(str));
		}
		return Long.valueOf(Long.parseLong(paramString));
	}

	public static Long strDateToNum1(String paramString) throws Exception {
		if (paramString == null) {
			return null;
		}
		String[] arrayOfString = null;
		String str = "";
		if (paramString.indexOf("-") >= 0) {
			arrayOfString = paramString.split("-");
			for (int i = 0; i < arrayOfString.length; ++i) {
				if (arrayOfString[i].length() == 1) {
					str = str + "0" + arrayOfString[i];
				} else {
					str = str + arrayOfString[i];
				}
			}
			return Long.valueOf(Long.parseLong(str));
		}
		return Long.valueOf(Long.parseLong(paramString));
	}

	public static String numDateToStr(Long paramLong) {
		if (paramLong == null) {
			return null;
		}
		String str = null;
		str = paramLong.toString().substring(0, 4) + "-"
				+ paramLong.toString().substring(4, 6) + "-"
				+ paramLong.toString().substring(6, 8);
		return str;
	}

	public static java.util.Date stringToDate(String paramString1,
			String paramString2) {
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				paramString2);
		localSimpleDateFormat.setLenient(false);
		try {
			return localSimpleDateFormat.parse(paramString1);
		} catch (ParseException localParseException) {
			return null;
		}
	}

	public static String dateToString(java.util.Date paramDate,
			String paramString) {
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				paramString);
		localSimpleDateFormat.setLenient(false);
		return localSimpleDateFormat.format(paramDate);
	}

	public static java.util.Date compactStringToDate(String paramString)
			throws Exception {
		return stringToDate(paramString, "yyyyMMdd");
	}

	public static String dateToCompactString(java.util.Date paramDate) {
		return dateToString(paramDate, "yyyyMMdd");
	}

	public static String dateToNormalString(java.util.Date paramDate) {
		return dateToString(paramDate, "yyyy-MM-dd");
	}

	public static String dateToAllString(java.util.Date paramDate) {
		return dateToString(paramDate, DATETIME_FORMAT);
	}

	public static String compactStringDateToNormal(String paramString)
			throws Exception {
		return dateToNormalString(compactStringToDate(paramString));
	}

	public static int getDaysBetween(java.util.Date paramDate1,
			java.util.Date paramDate2) throws Exception {
		Calendar localCalendar1 = Calendar.getInstance();
		Calendar localCalendar2 = Calendar.getInstance();
		localCalendar1.setTime(paramDate1);
		localCalendar2.setTime(paramDate2);
		if (localCalendar1.after(localCalendar2)) {
			throw new Exception("");
		}
		int i = localCalendar2.get(6) - localCalendar1.get(6);
		int j = localCalendar2.get(1);
		if (localCalendar1.get(1) != j) {
			localCalendar1 = (Calendar) localCalendar1.clone();
			do {
				i += localCalendar1.getActualMaximum(6);
				localCalendar1.add(1, 1);
			} while (localCalendar1.get(1) != j);
		}
		return i;
	}

	public static java.util.Date addDays(java.util.Date paramDate, int paramInt)
			throws Exception {
		Calendar localCalendar = Calendar.getInstance();
		localCalendar.setTime(paramDate);
		int i = localCalendar.get(6);
		localCalendar.set(6, i + paramInt);
		return localCalendar.getTime();
	}

	public static java.util.Date addDays(String paramString1,
			String paramString2, int paramInt) throws Exception {
		Calendar localCalendar = Calendar.getInstance();
		java.util.Date localDate = stringToDate(paramString1, paramString2);
		localCalendar.setTime(localDate);
		int i = localCalendar.get(6);
		localCalendar.set(6, i + paramInt);
		return localCalendar.getTime();
	}

	public static java.sql.Date getSqlDate(java.util.Date paramDate)
			throws Exception {
		java.sql.Date localDate = new java.sql.Date(paramDate.getTime());
		return localDate;
	}

	public static java.sql.Date getSqlDate(String date) {
		try {
			return new java.sql.Date(DateUtil.parseDate(date).getTime());
		} catch (Exception e) {
			throw new RuntimeException("日期错误");
		}
	}

	public static String formatDate(java.util.Date paramDate) {
		if (paramDate == null) {
			return null;
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd");
		localSimpleDateFormat.setLenient(false);
		return localSimpleDateFormat.format(paramDate);
	}

	public static String formatDate(Object paramDate) {
		if (paramDate == null) {
			return "";
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd");
		localSimpleDateFormat.setLenient(false);
		return localSimpleDateFormat.format(paramDate);
	}

	public static String formatDateMMdd(Object paramDate) {
		if (paramDate == null) {
			return "";
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(DATE_MMDD);
		localSimpleDateFormat.setLenient(false);
		return localSimpleDateFormat.format(paramDate);
	}

	public static String formatDateMMddChina(Object paramDate) {
		if (paramDate == null) {
			return "";
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				DATE_MD_CHINA);
		localSimpleDateFormat.setLenient(false);
		return localSimpleDateFormat.format(paramDate);
	}

	public static String formatDateTime(java.util.Date paramDate) {
		if (paramDate == null) {
			return null;
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		localSimpleDateFormat.setLenient(false);
		return localSimpleDateFormat.format(paramDate);
	}

	/**
	 * 将date日期 转换成 yyyy/MM/dd 格式字符串
	 * 
	 * @param paramDate
	 * @return
	 */
	public static String formatDateTimeToDateString(java.util.Date paramDate) {
		if (paramDate == null) {
			return null;
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				"yyyy/MM/dd");
		localSimpleDateFormat.setLenient(false);
		return localSimpleDateFormat.format(paramDate);
	}

	public static java.util.Date parseDate(String paramString) {
		if ((paramString == null) || (paramString.trim().equals(""))) {
			return null;
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd");
		localSimpleDateFormat.setLenient(false);
		try {
			return localSimpleDateFormat.parse(paramString);
		} catch (ParseException localParseException) {
			logger.error("parseDate error", localParseException);
		}
		return null;
	}

	public static java.util.Date parseDateTime(String paramString) {
		if ((paramString == null) || (paramString.trim().equals(""))) {
			return null;
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		localSimpleDateFormat.setLenient(false);
		try {
			return localSimpleDateFormat.parse(paramString);
		} catch (ParseException localParseException) {
			logger.error("parseDateTime error", localParseException);
		}
		return null;
	}

	public static Integer getYM(String paramString) throws Exception {
		if (paramString == null) {
			return null;
		}
		SimpleDateFormat localSimpleDateFormat = new SimpleDateFormat(
				"yyyy-MM-dd");
		localSimpleDateFormat.setLenient(false);
		java.util.Date localDate;
		try {
			localDate = localSimpleDateFormat.parse(paramString);
		} catch (ParseException localParseException) {
			throw new Exception("", localParseException);
		}
		return getYM(localDate);
	}

	public static Integer getYM(java.util.Date paramDate) {
		if (paramDate == null) {
			return null;
		}
		Calendar localCalendar = Calendar.getInstance();
		localCalendar.setTime(paramDate);
		int i = localCalendar.get(1);
		int j = localCalendar.get(2) + 1;
		return new Integer(i * 100 + j);
	}

	public static Integer getYYYY(java.util.Date paramDate) {
		if (paramDate == null) {
			return null;
		}
		Calendar localCalendar = Calendar.getInstance();
		localCalendar.setTime(paramDate);
		int i = localCalendar.get(1);
		return new Integer(i);
	}

	public static int addMonths(int paramInt1, int paramInt2) {
		Calendar localCalendar = Calendar.getInstance();
		localCalendar.set(1, paramInt1 / 100);
		localCalendar.set(2, paramInt1 % 100 - 1);
		localCalendar.set(5, 1);
		localCalendar.add(2, paramInt2);
		return getYM(localCalendar.getTime()).intValue();
	}

	public static java.util.Date addMonths(java.util.Date paramDate,
			int paramInt) {
		Calendar localCalendar = Calendar.getInstance();
		localCalendar.setTime(paramDate);
		localCalendar.add(2, paramInt);
		return localCalendar.getTime();
	}

	public static int monthsBetween(int paramInt1, int paramInt2) {
		int i = paramInt2 / 100 * 12 + paramInt2 % 100
				- (paramInt1 / 100 * 12 + paramInt1 % 100);
		return i;
	}

	public static int monthsBetween(java.util.Date paramDate1,
			java.util.Date paramDate2) {
		return monthsBetween(getYM(paramDate1).intValue(), getYM(paramDate2)
				.intValue());
	}

	public static String getChineseDate(Calendar paramCalendar) {
		int i = paramCalendar.get(1);
		int j = paramCalendar.get(2);
		int k = paramCalendar.get(5);
		StringBuffer localStringBuffer = new StringBuffer();
		localStringBuffer.append(i);
		localStringBuffer.append("��");
		localStringBuffer.append(j + 1);
		localStringBuffer.append("��");
		localStringBuffer.append(k);
		localStringBuffer.append("��");
		return localStringBuffer.toString();
	}

	public static String getChineseWeekday(Calendar paramCalendar) {
		switch (paramCalendar.get(7)) {
		case 2:
			return "星期一";
		case 3:
			return "星期二";
		case 4:
			return "星期三";
		case 5:
			return "星期四";
		case 6:
			return "星期五";
		case 7:
			return "星期六";
		case 1:
			return "星期日";
		}
		return "";
	}

	public static String getChineseWeekdayByDate(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		return getChineseWeekday(c);
	}

	public static Calendar strToCalendar(String strdata) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date;
		Calendar calendar = null;
		try {
			date = sdf.parse(strdata);
			calendar = Calendar.getInstance();
			calendar.setTime(date);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return calendar;
	}

	public static String getDayBeforeN(Integer N) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, N);
		Date date = calendar.getTime();
		return sdf.format(date);
	}

	public static void main(String[] paramArrayOfString) throws Exception {
		// try {
		//
		// Calendar calendar = Calendar.getInstance();
		// SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT);
		// Date cprq = calendar.getTime();
		//
		// } catch (Exception localException) {
		// logger.error(localException.getMessage());
		// }
		String dateStr = "2016-01-04 23:59:59";
		Date date = parseDateTime(dateStr);
		int day = getDaysBetween(date, getCurrentTimeDate());
		System.out.println(day);

		long da = getDaySub(getCurrentAllTime(), "2016-01-07 02:59:59");
		System.out.println("day== " + getCurrentYYYYMMTime());
		System.out.println("=====" + getLastDayStr());
		System.out.println("==2222===" + addSecond("2016-01-07 02:59:59", -10));

		String closingDateStr = "2016-06-29";
		Date currentDatetime = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String currentDateStr = sdf.format(currentDatetime);
		Date currentDate = null;
		Date closingDate = null;
		try {
			currentDate = sdf.parse(currentDateStr);
			closingDate = sdf.parse(closingDateStr);
		} catch (ParseException e) {
		}

		System.out.println(closingDate.before(currentDate));
	}

	/**
	 * 根据日期计算属于第几周 03
	 * 
	 * @param date
	 *            格式 yyyy-MM-dd 04
	 * @throws ParseException
	 *             05
	 */

	public static int getWeekOfYear(java.util.Date date) {

		try {

			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");

			Calendar cal = Calendar.getInstance();

			cal.setFirstDayOfWeek(Calendar.MONDAY); // 设置每周的第一天为星期一

			// cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);// 每周从周一开始

			cal.setMinimalDaysInFirstWeek(1); // 设置每周最少为1天

			cal.setTime(date);

			return cal.get(Calendar.WEEK_OF_YEAR);

		} catch (Exception e) {
			e.printStackTrace();

		}

		return 0;

	}

	public static String getFirstDayOfWeek(int year, int week) {
		Calendar c = new GregorianCalendar();
		c.set(Calendar.YEAR, year);
		c.set(Calendar.MONTH, Calendar.JANUARY);
		c.set(Calendar.DATE, 1);

		Calendar cal = (GregorianCalendar) c.clone();
		cal.add(Calendar.DATE, (week - 1) * 7);

		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		return df.format(getFirstDayOfWeek(cal.getTime()));
	}

	/**
	 * 取得指定日期所在周的第一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getFirstDayOfWeek(Date date) {
		Calendar c = new GregorianCalendar();

		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek()); // Monday
		return c.getTime();
	}

	public static void getDayOfWeek(int weekinx) {
		String conMonth = "1"; // 当前的月份

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar c = Calendar.getInstance();
		int year = c.get(Calendar.YEAR);
		long l = c.getTime().getTime();

		int currentWeekOfYear = c.get(Calendar.WEEK_OF_YEAR);
		if (currentWeekOfYear == 1 && c.get(Calendar.MONTH) == 11) {
			currentWeekOfYear = 53;
		}

		int j = 12;
		for (int i = 0; i < currentWeekOfYear; i++) {
			int dayOfWeek = c.get(Calendar.DAY_OF_WEEK) - 2;
			c.add(Calendar.DATE, -dayOfWeek); // 得到本周的第一天
			String month = (c.get(Calendar.MONTH) + 1) + ""; // 得到月份

			String date = sdf.format(c.getTime());
			c.add(Calendar.DATE, 6); // 得到本周的最后一天

			long ll = c.getTime().getTime();
			String date2 = sdf.format(c.getTime());
			c.add(Calendar.DATE, -j); // 减去增加的日期
			if (month.equals(conMonth)) {
				if (l > ll) {
					String s = year + "年的第" + (currentWeekOfYear - i) + "周"
							+ "(" + date + "至" + date2 + ")";
				}
			}
		}
	}

	/**
	 *    * 得到几天后的时间    * @param d    * @param day    * @return    
	 */
	public static List<String> getDateAfter(int day) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		List<String> dateAfter = new ArrayList<String>();
		for (int i = 0; i < day; i++) {
			Calendar c = Calendar.getInstance();
			c.add(Calendar.DAY_OF_MONTH, +i);// 取当前日期的后一天.
			dateAfter.add(sdf.format(c.getTime()));
		}

		return dateAfter;
	}

	/**
	 *    * 得到几天后的时间    * @param d    * @param day    * @return    
	 */
	public static String getCurrentDateAfter(int day) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		Calendar c = Calendar.getInstance();
		c.add(Calendar.DAY_OF_MONTH, day);// 取当前日期的后一天.

		return sdf.format(c.getTime());
	}

	/**
	 * 判断当前时间是否在某个区间内容 上学7：00 至 9:00 放学4：00 至 6:00
	 * 
	 * @param after_hhmmss
	 *            073000
	 * @param before_hhmmss
	 * @return
	 * @throws Exception
	 */
	public static boolean comparecurrentTime(String after_hhmmss,
			String before_hhmmss, String logTime) throws Exception {
		String _after_hhmmss_Str = new StringBuffer(
				DateUtil.fomartCurrentTime(DateUtil.COMPACT_DATE_FORMAT))
				.append(after_hhmmss).toString();
		Date _after_hhmmss_Date = DateUtil.stringToDate(_after_hhmmss_Str,
				"yyyyMMddHHmmss");
		Calendar after_hhmmssCalendar = Calendar.getInstance();
		after_hhmmssCalendar.setTime(_after_hhmmss_Date);

		String _before_hhmmss_Str = new StringBuffer(
				DateUtil.fomartCurrentTime(DateUtil.COMPACT_DATE_FORMAT))
				.append(before_hhmmss).toString();
		Date _before_hhmmss_Date = DateUtil.stringToDate(_before_hhmmss_Str,
				"yyyyMMddHHmmss");
		Calendar before_hhmmssCalendar = Calendar.getInstance();
		before_hhmmssCalendar.setTime(_before_hhmmss_Date);

		// 当前时间
		String currentTime = DateUtil.fomartCurrentTime("yyyyMMddHHmmss");
		logTime = logTime.replace("-", "").replace(":", "").replace(" ", "");
		Date currentDate = DateUtil.stringToDate(logTime, "yyyyMMddHHmmss");
		Calendar currentCalendar = Calendar.getInstance();

		currentCalendar.setTime(currentDate);
		// 进行早上9点操作判断
		if (currentCalendar.before(before_hhmmssCalendar)
				&& currentCalendar.after(after_hhmmssCalendar)) {
			return true;
		} else {
			return false;
		}
	}

	public static List<Object[]> getBetweenRq(String startTime, String endTime) {
		// 请注意月份是从0-11

		Calendar calendarStartTime = DateUtil.strToCalendar(startTime);

		Calendar calendarEndTime = DateUtil.strToCalendar(endTime);

		Calendar start = Calendar.getInstance();
		start.set(calendarStartTime.get(Calendar.YEAR),
				calendarStartTime.get(Calendar.MONTH),
				calendarStartTime.get(Calendar.DAY_OF_MONTH));
		Calendar end = Calendar.getInstance();
		end.set(calendarEndTime.get(Calendar.YEAR),
				calendarEndTime.get(Calendar.MONTH),
				calendarEndTime.get(Calendar.DAY_OF_MONTH));
		List<Object[]> listItems = new ArrayList<Object[]>();

		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		while (start.compareTo(end) <= 0) {

			// 打印每天
			Object[] obj = new Object[3];
			obj[0] = format.format(start.getTime());
			obj[1] = DateUtil.getChineseWeekday(start);
			obj[2] = start.get(7) - 1;
			listItems.add(obj);
			// 循环，每次天数加1
			start.set(Calendar.DATE, start.get(Calendar.DATE) + 1);
		}

		return listItems;
	}

	public static Date convert2DateTime(String dateTime) {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		java.util.Date timeDate = null;
		try {
			timeDate = sdf.parse(dateTime);
		} catch (Exception e) {
			// TODO 自动生成 catch 块
			e.printStackTrace();
			throw new RuntimeException("时间转换错误：" + e.getMessage());
		}// util类型
			// return new java.sql.Date(timeDate.getTime());// sql类型
		return timeDate;
	}

	public static Date convert2Date(String dateTime) {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date timeDate = null;
		try {
			timeDate = sdf.parse(dateTime);
		} catch (Exception e) {
			// TODO 自动生成 catch 块
			e.printStackTrace();
			logger.error("时间转换错误：" + e.getMessage() + "入参数:=" + dateTime);
			// throw new RuntimeException("时间转换错误：" + e.getMessage());
		}// util类型
			// return new java.sql.Date(timeDate.getTime());// sql类型
		return timeDate;
	}

	public static Date convert2Date(String dateTime, String paramString) {

		SimpleDateFormat sdf = new SimpleDateFormat(paramString);
		java.util.Date timeDate = null;
		try {
			timeDate = sdf.parse(dateTime);
		} catch (Exception e) {
			// TODO 自动生成 catch 块
			e.printStackTrace();
			throw new RuntimeException("时间转换错误：" + e.getMessage());
		}// util类型
			// return new java.sql.Date(timeDate.getTime());// sql类型
		return timeDate;
	}

	public static String getesterday() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, -1); // 得到前一天
		Date date = calendar.getTime();
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		// System.out.println(df.format(date));
		return df.format(date);
	}

	/**
	 * 计算两个日期之间相差的天数
	 * 
	 * @param smdate
	 *            较小的时间
	 * @param bdate
	 *            较大的时间
	 * @return 相差天数
	 * @throws ParseException
	 */
	public static int daysBetween(Date smdate, Date bdate)
			throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		smdate = sdf.parse(sdf.format(smdate));
		bdate = sdf.parse(sdf.format(bdate));
		Calendar cal = Calendar.getInstance();
		cal.setTime(smdate);
		long time1 = cal.getTimeInMillis();
		cal.setTime(bdate);
		long time2 = cal.getTimeInMillis();
		long between_days = (time2 - time1) / (1000 * 3600 * 24);

		return Integer.parseInt(String.valueOf(between_days));
	}

	public static int getWeekInx(Date smdate, Date bdate) {
		String end = getWeekOfDate(bdate);
		if ("1".equals(end)) { // 周一
			bdate = getAfterCurrentDate(bdate, 6);
		}
		if ("2".equals(end)) { // 周二
			bdate = getAfterCurrentDate(bdate, 5);
		}
		if ("3".equals(end)) {
			bdate = getAfterCurrentDate(bdate, 4);
		}
		if ("4".equals(end)) {
			bdate = getAfterCurrentDate(bdate, 3);
		}
		if ("5".equals(end)) {
			bdate = getAfterCurrentDate(bdate, 2);
		}
		if ("6".equals(end)) {
			bdate = getAfterCurrentDate(bdate, 1);
		}
		// if ("7".equals(end)) {
		// bdate = getAfterCurrentDate(bdate, 1);
		// }
		double num = (double) (bdate.getTime() - smdate.getTime())
				/ (24 * 3600 * 1000 * 7);
		return (int) Math.ceil(num);
	}

	public static Date getAfterCurrentDate(Date date, int num) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date); // 把当前时间赋给日历
		calendar.add(Calendar.DATE, num); // 得到后num天的时间
		return calendar.getTime();
	}

	public static String getWeekOfDate(Date date) {
		String[] weekDaysCode = { "0", "1", "2", "3", "4", "5", "6" };
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int intWeek = calendar.get(Calendar.DAY_OF_WEEK) - 1;
		if (intWeek == 0) {
			return "7";
		}
		return weekDaysCode[intWeek];
	}

	/**
	 * 字符串的日期格式的计算
	 */
	public static int daysBetween(String smdate, String bdate)
			throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		cal.setTime(sdf.parse(smdate));
		long time1 = cal.getTimeInMillis();
		cal.setTime(sdf.parse(bdate));
		long time2 = cal.getTimeInMillis();
		long between_days = (time2 - time1) / (1000 * 3600 * 24);

		return Integer.parseInt(String.valueOf(between_days));
	}

	/**
	 * 返回 如：昨天 18：30
	 * 
	 * @param datetime
	 * @return
	 */
	public static String daysBetweenForSpecial(String datetime) {
		if (StringUtil.isNullOrEmpty(datetime)) {
			return "";
		}
		String HM = convertFullTimeToHm(datetime);
		int interval = 0;
		String dayStr = "";
		try {
			interval = daysBetween(datetime.split(" ")[0],
					DateUtil.getCurrentYYYYTime());
		} catch (Exception e) {
			throw new RuntimeException("日期格式化错误");
		}
		if (interval >= 0) {
			switch (interval) {
			case 0:
				dayStr = "今天";
				break;
			case 1:
				dayStr = "昨天";
				break;
			case 2:
				dayStr = "前天";
				break;
			default:
				dayStr = interval + "天前";
			}
		} else {
			switch (interval) {
			case 0:
				dayStr = "今天";
				break;
			case -1:
				dayStr = "明天";
				break;
			case -2:
				dayStr = "后天";
				break;
			default:
				dayStr = interval * -1 + "天后";
			}
		}
		return dayStr + " " + HM;
	}

	public static String getWeekday(int weekday) {
		switch (weekday) {
		case 0:
			return "星期一";
		case 1:
			return "星期二";
		case 2:
			return "星期三";
		case 3:
			return "星期四";
		case 4:
			return "星期五";
		case 5:
			return "星期六";
		case 6:
			return "星期日";
		}
		return "";
	}

	/**
	 * 计算当前日期的前面＋lastMonth＋
	 * 
	 * @param lastMonth
	 * @return
	 */
	public static List<Object[]> getPreviousMonth(int lastMonth,
			String datePattern) {
		List<Object[]> returnList = new ArrayList<Object[]>();
		Date date = new Date();
		for (int i = lastMonth - 1; i >= 0; i--) {
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			cal.add(Calendar.MONTH, -i);
			Object[] obj = { 12 - i,
					DateUtil.dateToString(cal.getTime(), datePattern) };
			returnList.add(obj);
		}
		return returnList;
	}

	/**
	 * 计算当前日期的前面＋lastMonth＋的月份
	 * 
	 * @param lastMonth
	 * @return
	 */
	public static String getLastMonth(int lastMonth) {
		Date date = new Date();

		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.MONTH, -lastMonth + 1);

		return DateUtil.dateToString(cal.getTime(), DATE_YYYYMM);
	}

	/**
	 * 计算当前日期的前面＋lastYear＋的年份
	 * 
	 * @param lastMonth
	 * @return
	 */
	public static String getLastYear(int lastYear) {
		Date date = new Date();

		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.YEAR, -lastYear);

		return DateUtil.dateToString(cal.getTime(), DATETIME_FORMAT);
	}

	public static String getSevenDayBefore() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, -7); // 得到七天前
		Date date = calendar.getTime();
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return df.format(date);
	}

	public static String getDateByDistance(String currentDate, int distance) {
		Calendar calendar = Calendar.getInstance();

		Date date;
		try {
			date = parseDateTime(currentDate);
			calendar.setTime(date);
			calendar.add(Calendar.DATE, distance);
			date = calendar.getTime();
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			return df.format(date);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";

	}

	/**
	 * 获取当前时间时间戳 生成从 1970 年 1 月 1 日 00:00:00 至今的秒数
	 * 
	 * @return
	 */
	public static long getCurrentStamp() {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());

		long year = calendar.get(Calendar.YEAR);
		long mon = calendar.get(Calendar.MONTH) + 1;
		long day = calendar.get(Calendar.DAY_OF_MONTH);
		long hour = calendar.get(Calendar.HOUR_OF_DAY);
		long min = calendar.get(Calendar.MINUTE);
		long sec = calendar.get(Calendar.SECOND);

		return ((year - 1970) * 12 * 31 + mon * 31 + (day - 1))
				* (24 * 60 * 60) + (hour * 60 + min) * 60 + sec;
	}

	/**
	 * 计算时间间隔（分钟）,大于零代表当前时间超过设置的时间
	 * 
	 * @param dateStr
	 * @return
	 */
	public static long getTimeInterval(String dateStr) {
		try {
			Date f = DateUtil.getCurrentTimeDate();
			Date q = DateUtil.parseDateTime(dateStr);

			return (f.getTime() - q.getTime()) / 1000 / 60;
		} catch (Exception e) {
			logger.error("getTimeInterval c错误 入参:" + dateStr);
			return 0;
		}

	}

	/**
	 * 计算时间间隔（秒）,大于零代表当前时间超过设置的时间
	 * 
	 * @param dateStr
	 * @return
	 */
	public static long getTimeIntervalSecond(String dateStr) {
		try {
			Date f = DateUtil.getCurrentTimeDate();
			Date q = DateUtil.parseDateTime(dateStr);

			return (f.getTime() - q.getTime()) / 1000;
		} catch (Exception e) {
			logger.error("getTimeInterval c错误 入参:" + dateStr);
			return 0;
		}

	}

	/**
	 * 将long型的时间格式转换为 年月日24小时制
	 * 
	 * @param longdate
	 * @return
	 */
	public static String getLongDateToString(long longdate) {
		SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT);
		// 前面的lSysTime是秒数，先乘1000得到毫秒数，再转为java.util.Date类型
		java.util.Date dt = new Date(longdate * 1000);
		return sdf.format(dt);// 得到精确到秒的表示：08/31/2006 21:08:00
	}

	/**
	 * 获取上周一的日期
	 * 
	 * @param date
	 * @return
	 */
	public static String getLastWeekMonday(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DAY_OF_MONTH, -1);
		cal.add(Calendar.WEEK_OF_YEAR, -1);
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT);
		return changeHms(sdf.format(cal.getTime()));
	}

	/**
	 * 获得本周一的日期
	 * 
	 * @param date
	 * @return
	 */
	public static String getThisWeekMonday(Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DAY_OF_MONTH, -1);
		cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT);
		return changeHms(sdf.format(cal.getTime()));
	}

	public static String changeHms(String dateTime) {
		String date = dateTime.split(" ")[0];
		return date + " 00:00:00";
	}

	public static String getScoreStartDate() {
		// String datetime = "";
		// try {
		// datetime = DateUtil.getYYYY(new Date()) + "-"
		// + WxXxScoreRule.SCORE_START_DATE;
		// } catch (Exception e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }
		// String currentDate = DateUtil
		// .fomartCurrentTime(DateUtil.DATETIME_FORMAT);
		//
		// if (DateUtil.getTimeMilliSecond(datetime) > DateUtil
		// .getTimeMilliSecond(currentDate)) {
		// return DateUtil.getLastYear(1);
		// }
		return "2014-06-01 00:00:00";
	}

	public static boolean isValidDate(String s) {
		try {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			Date d = dateFormat.parse(s);
			Date today = dateFormat.parse(getCurrentYYYYTime());
			if (d.getTime() > today.getTime()) {
				return false;
			}
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 计算当前日期的＋Month＋的月份
	 * 
	 * @param month
	 * @return
	 */
	public static String getAfterMonth(int month) {
		Date date = new Date();

		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.MONTH, month);

		return DateUtil.dateToString(cal.getTime(), DATE_FORMAT);
	}

	public static List<String> getDayList(String startDate, String endDate) {
		List<String> dateList = new ArrayList<String>();

		Date statTime = convert2DateTime(startDate);
		Date endTime = convert2DateTime(endDate);

		try {
			int day;
			dateList.add(DateUtil.dateToString(statTime, DATE_FORMAT));
			day = daysBetween(statTime, endTime);
			Calendar cal = Calendar.getInstance();
			for (int i = 1; i <= day; i++) {
				cal.setTime(statTime);
				cal.add(Calendar.DAY_OF_MONTH, 1);
				dateList.add(DateUtil.dateToString(cal.getTime(), DATE_FORMAT));
				statTime = cal.getTime();
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return dateList;
	}

	public static String formatDate2MMDD(String date) {
		StringBuffer dateBuffer = new StringBuffer("");
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(convert2Date(date));
			dateBuffer.append(calendar.get(Calendar.MONTH) + 1).append("月");
			dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH)).append("日");
		}
		return dateBuffer.toString();
	}

	public static String formatDate2MMDD(Date date) {
		StringBuffer dateBuffer = new StringBuffer("");
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			dateBuffer.append(calendar.get(Calendar.MONTH) + 1).append("月");
			dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH)).append("日");
		}
		return dateBuffer.toString();
	}

	public static String formatDate2YYYYMMDD(String date) {
		StringBuffer dateBuffer = new StringBuffer("");
		if (date != null) {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(convert2Date(date));
			dateBuffer.append(calendar.get(Calendar.YEAR)).append("年");
			dateBuffer.append(calendar.get(Calendar.MONTH) + 1).append("月");
			dateBuffer.append(calendar.get(Calendar.DAY_OF_MONTH)).append("日");
		}
		return dateBuffer.toString();
	}

	/**
	 * 比较2个时间大小
	 * 
	 * @param time1
	 * @param time2
	 * @return 若相等 则返回0，若 time1<time2 则返回1，若 time1>time2 则返回2
	 */
	public static int compareTime(String time1, String time2) {
		try {
			int[] hms1 = convertStringArrToIntArr(time1.split(":"));
			int[] hms2 = convertStringArrToIntArr(time2.split(":"));
			int hms1Seconds = hms1[0] * 3600 + hms1[1] * 60 + hms1[2];
			int hms2Seconds = hms2[0] * 3600 + hms2[1] * 60 + hms2[2];
			if (hms1Seconds == hms2Seconds) {
				return 0;
			} else if (hms1Seconds < hms2Seconds) {
				return 1;
			} else {
				return 2;
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("时间格式错误", e);
		}
	}

	/**
	 * 比较： 入参日期 < 当前日期
	 * 
	 * @param date
	 * @return
	 */
	public static boolean compareDateBefore(Date date) {
		if (date == null) {
			return false;
		}
		Date currentDatetime = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String currentDateStr = sdf.format(currentDatetime);
		Date currentDate = null;
		try {
			currentDate = sdf.parse(currentDateStr);
		} catch (ParseException e) {
		}
		return date.before(currentDate);
	}

	/**
	 * 比较： 入参日期 (datetime)< 当前日期(datetime)
	 * 
	 * @param datetime
	 * @return
	 */
	public static boolean compareDatetime(Date datetime) {
		if (datetime == null) {
			return false;
		}
		Date currentDatetime = new Date();
		return datetime.before(currentDatetime);
	}

	/**
	 * 
	 * @param date
	 * @return
	 */
	public static boolean afterNow(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			return sdf.parse(sdf.format(date)).after(new Date());
		} catch (ParseException e) {
			e.printStackTrace();
			throw new RuntimeException("日期格式化错误");
		}
	}

	/**
	 * 判断1个时间是否在 另2个时间范围内 check time is between begin and end
	 */
	public static boolean compareTimeIsInInterval(String time, String begin,
			String end) {
		if (compareTime(time, begin) != 1 && compareTime(time, end) != 2) {
			return true;
		} else {
			return false;
		}
	}

	private static int[] convertStringArrToIntArr(String[] source)
			throws NumberFormatException {
		int[] result = new int[source.length];
		for (int i = 0; i < result.length; i++) {
			result[i] = Integer.valueOf(source[i]);
		}
		return result;
	}

	public static Map<String, String> getCurrentStartDatetimeAndEndDatetime(
			String currentDate) {
		Map<String, String> map = new HashMap<String, String>();
		map.put("startDatetime", currentDate + " 00:00:00");
		map.put("endDatetime", currentDate + " 23:59:59");
		return map;
	}

	public static java.sql.Date getCurrentSqlDate() {
		try {
			return getSqlDate(parseDate(DateUtil.getCurrentYYYYTime()));
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("日期转换错误", e);
		}
	}

	public static Date convertStr2Date(String dateStr, String dataFormat) {
		try {
			return new SimpleDateFormat(dataFormat).parse(dateStr);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	public static int dateBetween(String fromDate, String toDate) {
		int days = 0;
		SimpleDateFormat df = new SimpleDateFormat(DATETIME_FORMAT);
		try {
			Date from = df.parse(fromDate);
			Date to = df.parse(toDate);
			days = (int) ((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000)) + 1;
			return days;
		} catch (ParseException e) {
			throw new RuntimeException("日期格式错误");
		}
	}

	public static String convertDatetimeStrToDateStr(String datetimeStr) {
		return datetimeStr.split(" ")[0];
	}

	/**
	 * 判断当前日期（datetime)是否在两个日期(datetime)之间（包含两个日期）
	 * 
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public static boolean checkIsBetweenDates(String startDate, String endDate,
			String currentDate) {
		Calendar currentCal = Calendar.getInstance();
		Calendar startCal = Calendar.getInstance();
		Calendar endCal = Calendar.getInstance();
		try {
			currentCal.setTime(parseDateTime(currentDate));
			startCal.setTime(parseDateTime(startDate));
			endCal.setTime(parseDateTime(endDate));
		} catch (Exception e) {
			throw new RuntimeException("日期格式化错误");
		}
		if (currentCal.before(startCal) || currentCal.after(endCal)) {
			return false;
		}
		return true;
	}

	public static final long getDaySub(String startTime, String endTime) {
		long day = 0;
		SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");
		try {
			Date beginDate = format.parse(startTime);
			Date endDate = format.parse(endTime);
			day = (endDate.getTime() - beginDate.getTime())
					/ (24 * 60 * 60 * 1000);
		} catch (ParseException e) {
			e.printStackTrace();
			return 0;
		}
		return day + 1;
	}

	/**
	 * 获取当前月月初时间，
	 */
	public static String getMonthStartDatetime(String currentDate) {
		String[] nowArr = currentDate.split("-");
		return getDayBeginTime(nowArr[0] + "-" + nowArr[1] + "-" + "01");

	}

	/**
	 * 获取距离现在一小时的时间，返回格式 "yyyy-MM-dd HH:mm:ss"
	 */
	public static String getOneHourBeforeDatetime() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY,
				calendar.get(Calendar.HOUR_OF_DAY) - 1);
		return formatDateTime(calendar.getTime());
	}

	/**
	 * 计算时间间隔
	 * 
	 * 传入的时间格式必须类似于2012-8-21 17:53:20这样的格式
	 * 
	 * @param createtime
	 * @return
	 */
	public static String getInterval(String createtime) {
		String interval = "";
		try {
			SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			ParsePosition pos = new ParsePosition(0);
			Date d1 = (Date) sd.parse(createtime, pos);

			// 用现在距离1970年的时间间隔new
			// Date().getTime()减去以前的时间距离1970年的时间间隔d1.getTime()得出的就是以前的时间与现在时间的时间间隔
			long time = new Date().getTime() - d1.getTime();// 得出的时间间隔是毫秒

			if (time / 1000 < 10 && time / 1000 >= 0) {
				// 如果时间间隔小于10秒则显示“刚刚”time/10得出的时间间隔的单位是秒
				interval = "刚刚";
			} else if (time / 1000 < 60 && time / 1000 > 0) {
				// 如果时间间隔小于60秒则显示多少秒前
				int se = (int) ((time % 60000) / 1000);
				interval = se + "秒前";
			} else if (time / 60000 < 60 && time / 60000 > 0) {
				// 如果时间间隔小于60分钟则显示多少分钟前
				int m = (int) ((time % 3600000) / 60000);// 得出的时间间隔的单位是分钟
				interval = m + "分钟前";
			} else if (time / 3600000 < 96 && time / 3600000 >= 0) {
				// 如果时间间隔小于24小时则显示多少小时前
				int h = (int) (time / 3600000);// 得出的时间间隔的单位是小时
				interval = h + "小时前";

			} else {
				// 大于24小时，则显示正常的时间，但是不显示秒
				SimpleDateFormat sdf = new SimpleDateFormat(
						"yyyy-MM-dd HH:mm:ss");

				ParsePosition pos2 = new ParsePosition(0);
				Date d2 = (Date) sdf.parse(createtime, pos2);

				interval = sdf.format(d2);
			}
		} catch (Exception e) {
			logger.error("时间转化错误getInterval=入参=" + createtime);
			return createtime;
		}

		return interval;
	}

	/**
	 * 比对两个时间格式为 HH:mm
	 * 
	 * @return
	 */
	public static Boolean comparisonTime(String time1, String time2) {
		String[] times1 = time1.split(":");
		String[] times2 = time2.split(":");
		Long seconds1 = Long.valueOf(times1[0]) * 3600
				+ Long.valueOf(times1[1]) * 60;
		Long seconds2 = Long.valueOf(times2[0]) * 3600
				+ Long.valueOf(times2[1]) * 60;
		if (seconds1 >= seconds2) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 比对两个时间格式为 HH:mm
	 * 
	 * @return
	 */
	public static Boolean comparisonTimeNoEqual(String time1, String time2) {
		String[] times1 = time1.split(":");
		String[] times2 = time2.split(":");
		Long seconds1 = Long.valueOf(times1[0]) * 3600
				+ Long.valueOf(times1[1]) * 60;
		Long seconds2 = Long.valueOf(times2[0]) * 3600
				+ Long.valueOf(times2[1]) * 60;
		if (seconds1 > seconds2) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 根据开始日期和结束日期，得到日期列表：string 格式： 2015-05-08
	 * 
	 * @param beginDateStr
	 * @param endDateStr
	 * @return
	 */
	public static final List<String> fetchDateList(String beginDatetimeStr,
			String endDatetimeStr) {
		int days = DateUtil.dateBetween(beginDatetimeStr, endDatetimeStr);
		Date beginDatetime = DateUtil.parseDateTime(beginDatetimeStr);
		List<String> dateStrList = new ArrayList<String>();
		if (days > 0) {
			for (int i = days - 1; i >= 0; i--) {
				Calendar cal = Calendar.getInstance();
				cal.setTime(beginDatetime);
				cal.add(Calendar.DAY_OF_MONTH, i);
				dateStrList.add(DateUtil.convertDatetimeStrToDateStr(DateUtil
						.formatDate(cal.getTime())));
			}
		}
		return dateStrList;
	}

	public static final String getChineseYYYYMM(String date) {
		try {
			String year = date.substring(0, 4);
			String month = date.substring(5, 6);
			return year + "年-" + month + "月";
		} catch (Exception e) {
			return "";
		}
	}

	public static final String getChineseYYYYMMDD(String date) {
		try {
			String year = date.substring(0, 4);
			String month = date.substring(5, 7);
			String day = date.substring(8, 10);
			return year + "年" + month + "月" + day + "日";
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * 获取中文时间格式：如：5月10日.
	 * 
	 * @param date
	 * @return
	 */
	public static final String getChineseMMDD(String date) {
		try {
			String month = date.substring(5, 7);
			String day = date.substring(8, 10);
			return month + "月" + day + "日";

		} catch (Exception e) {
			return "";
		}
	}

	public static String addTimeAfterDate(String publishdate) {
		SimpleDateFormat sdf = new SimpleDateFormat(NORMAL_DATE_FORMAT);
		try {
			sdf.parse(publishdate);
			if (publishdate.split(" ").length == 1) {
				publishdate = publishdate + " "
						+ getCurrentAllTime().split(" ")[1];
			}
		} catch (ParseException e) {

		}
		return publishdate;
	}

	/**
	 * 判断当前时间是否在 两个时间之间
	 * 
	 * @param starttime
	 *            开始时间
	 * @param days
	 *            开始时间之后的天数
	 * @return
	 */
	public static boolean checkNowIsIn(String starttime, int days) {
		Date startDatetime = DateUtil.parseDateTime(starttime);
		Date now = new Date();
		if (startDatetime.getTime() <= now.getTime()
				&& now.getTime() <= startDatetime.getTime() + days * 24 * 60
						* 60 * 1000) {
			return true;
		}
		return false;
	}

	public static String getCurrentTimeStr() {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(DATETIME_FORMAT_MINUTE);
		return sdf.format(date);
	}

	/**
	 * 获取上个月的日期.
	 * 
	 * @return
	 */
	public static String getLastMonthStr() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, -1); // 得到前一天
		calendar.add(Calendar.MONTH, -1); // 得到前一个月
		return DateUtil.dateToString(calendar.getTime(), NORMAL_DATE_FORMAT)
				+ " 00:00:00";
	}

	/**
	 * 获取昨天的日期.
	 * 
	 * @return
	 */
	public static String getLastDayStr() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, -1); // 得到前一天
		return DateUtil.dateToString(calendar.getTime(), NORMAL_DATE_FORMAT)
				+ " 23:59:59";
	}

	/**
	 * 时间往前或后推多少分钟.
	 * 
	 * @param date
	 * @param second
	 *            分钟
	 * @return
	 */
	public static String addSecond(String date, int second) {
		Date dateD = parseDate(DATETIME_FORMAT, date);
		int num = second * 60 * 1000;
		Date now_10 = new Date(dateD.getTime() - num); // 10分钟前的时间
		SimpleDateFormat dateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");// 可以方便地修改日期格式
		String nowTime_10 = dateFormat.format(now_10);
		return nowTime_10;
	}

	/**
	 * 判断当前时间是否在 两个时间之间
	 * 
	 * @param starttime
	 *            开始时间
	 * @param endtime
	 *            结束时间
	 * @return
	 */
	public static boolean checkNowIsIn(String starttime, String endtime) {
		try {
			Date startDatetime = DateUtil.parseDateTime(starttime);
			Date endDatetime = DateUtil.parseDateTime(endtime);
			Date now = new Date();
			if (startDatetime.getTime() <= now.getTime()
					&& now.getTime() <= endDatetime.getTime()) {
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

}
