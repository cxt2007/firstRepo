package org.cxt.util;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

import org.apache.commons.codec.binary.Base64;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

public class StringUtil {

	public static final String MSG_NEWLINE = "\n";
	public static final String MSG_SPACE = " ";

	public static final String RETURN_MSG_SAVE_SUCCESS = "保存成功";
	public static final String RETURN_MSG_UPDATE_SUCCESS = "更新成功";
	public static final String RETURN_MSG_FIND_NO_DATA = "没有数据";
	public static final String RETURN_MSG_DELETE_FAIL = "删除失败";
	public static final String RETURN_MSG_DELETE_SUCCESS = "删除成功";
	public static final String RETURN_MSG_EXPORT_FAIL = "导出失败";
	public static final String RETURN_MSG_SUCCESS = "success";

	public static final String VIEW_IF_NO_CLASS = "班级不存在";
	public static final String VIEW_IF_NO_STUDENT = "学生不存在";
	public static final String VIEW_IF_NO_NAME = "用户不存在";

	public static final int NUMBER_SCALE = 2;

	static Random r = new Random();

	private StringUtil() {
	};

	public static String encodeBASE64(String s) {
		if (s == null)
			return null;
		try {
			return new String(Base64.encodeBase64(s.getBytes()), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		// return Base64.encodeBase64String(s.getBytes());
		// return (new BASE64Encoder()).encode(s.getBytes());
	}

	public static long getRandom18Long() {
		return System.currentTimeMillis() * 100000 + r.nextInt(90000) + 10000;

	}

	/**
	 * 将BASE64字符串进行解密
	 * 
	 * @param bytes
	 * @return
	 */
	public static String decodeBASE64(String s) {
		if (s == null)
			return null;

		try {
			byte[] b = Base64.decodeBase64(s.getBytes("UTF-8"));
			;
			return new String(b);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static <E> List<E> toList(Iterable<E> iterable) {
		if (iterable instanceof List) {
			return (List<E>) iterable;
		}
		ArrayList<E> list = new ArrayList<E>();
		if (iterable != null) {
			for (E e : iterable) {
				list.add(e);
			}
		}
		return list;
	}

	/**
	 * 判断字符串是否为空
	 */
	public static boolean isNullOrEmpty(String str) {
		if (str == null || str.length() <= 0 || str.trim() == null
				|| str.trim().length() <= 0) {
			return true;
		}
		return false;
	}

	/**
	 * 判断字符串是否不为空
	 */
	public static boolean isNotEmpty(String str) {
		return !isNullOrEmpty(str);
	}

	/**
	 * 字符串首字母转大写
	 * 
	 * @param string
	 * @return
	 */
	public static String firstLetterToStringUpperCase(String string) {
		return string.substring(0, 1).toUpperCase() + string.substring(1);
	}

	/**
	 * @param args
	 */
	public static int getIntOfStr(String str) {
		try {
			return new Integer(str).intValue();
		} catch (Exception e) {
			return 0;
		}
	}

	/**
	 * 处理 1,2格式的字符串，处理为 '1','2'
	 * 
	 * @return
	 */
	public static String processSplitStr(String splitStr) {
		StringBuffer sb = new StringBuffer();
		String[] splitStrs = splitStr.split(",");
		sb.append("'").append(splitStrs[0]).append("'");
		for (int i = 1; i < splitStrs.length; i++) {
			sb.append(",'").append(splitStrs[i]).append("'");
		}
		return sb.toString();

	}

	/**
	 * @param args
	 */
	public static int getIntOfObj(Object obj) {
		try {
			return new Integer(obj.toString()).intValue();
		} catch (Exception e) {
			return 0;
		}
	}

	public static boolean getBooleanOfObj(Object object) {
		try {
			return (boolean) object;
		} catch (Exception e) {
			int i = StringUtil.getIntOfObj(object);
			return i == 0 ? false : true;
		}
	}

	public static boolean getBooleanOfInt(int i) {
		return i == 0 ? false : true;
	}

	/**
	 * @param args
	 */
	public static long getLongOfObj(Object obj) {
		try {
			return new Long(obj.toString()).longValue();
		} catch (Exception e) {
			return 0;
		}
	}

	/**
	 * @param args
	 */
	public static double getDoubleOfObj(Object obj) {
		try {
			return new Double(obj.toString()).doubleValue();
		} catch (Exception e) {
			return 0;
		}
	}

	/**
	 * @param args
	 * @return 如果转换失败，返回-2
	 */
	public static float getFloatOfObj(Object obj) {
		try {
			return new Float(obj.toString()).floatValue();
		} catch (Exception e) {
			return -2;
		}
	}

	/**
	 * 将浮点型保留两位小数
	 */
	public static String formartDecimal(Object d) {
		try {

			String str = new java.text.DecimalFormat("#.00").format(d);
			if (str.charAt(0) == '.') // 0.01 格式化为 .01
			{
				str = "0" + str;
			}
			if (str.indexOf("-.") == 0) // -.01 开头
			{
				str = "-0." + str.substring(2);
			}

			if (str.equals("0") || str.equals("0.00")) {
				str = "0";
			}

			return str.replace("-0.00", "").replace(".00", "");

		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * @param args
	 */
	public static int[] getIntOfObjArry(Object[] objs) {

		int[] result = new int[objs.length];
		for (int i = 0; i < objs.length; i++) {
			result[i] = getIntOfObj(objs[i]);
		}
		return result;

	}

	/**
	 * 返回对象字符串，对于出错情况返回空字符串
	 * 
	 * @param obj
	 * @return
	 */
	public static String toString(Object obj) {
		try {
			return obj == null ? "" : obj.toString();
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * @param args
	 */
	public static String getNullStr(Object obj) {
		try {
			return obj.toString();
		} catch (Exception e) {
			return "";
		}
	}

	public static void main(String[] args) {
		System.out.println(StringUtil.transTimeToInt("23:05"));
		System.out.println(StringUtil.transIntToTime(1385));
		System.out.println(StringUtil.getBooleanOfObj(2));
		List<String> list = StringUtil.extractIdForBeen(new ArrayList());
		System.out.println(list.size());
	}

	/**
	 * @param args
	 */
	public static String getTrimStr(String obj) {
		try {
			return obj.trim();
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * @param args
	 *            将以逗号隔开的字符串转换为集合
	 */
	public static List<Integer> getNullStrToList(String str) {
		String num[] = str.split(",");
		List<Integer> stateList = new ArrayList<Integer>();
		if (StringUtil.isNotEmpty(str) && num.length > 0 && !str.equals("null")) {
			for (int i = 0; i < num.length; i++) {
				String value = StringUtil.getNullStr(num[i]).trim();
				stateList.add(Integer.parseInt(value));
			}
		} else {
			stateList.add(0);
		}
		return stateList;
	}

	/**
	 * 除去字符串里的] [ "
	 * 
	 * @param str
	 *            ,
	 * @return
	 */
	public static String getNullStrToNoAsteriskAndBrackets(String str) {

		if (StringUtil.isNotEmpty(str) && !str.equals("null")) {
			str = str.replace("[", "");
			str = str.replace("\"", "");
			str = str.replace("]", "");
		} else {
			str = "";
		}
		return str;
	}

	/**
	 * @param args
	 *            将以逗号隔开的字符串转换为集合
	 */
	public static List<String> getNullStrToStringList(String str) {
		String num[] = str.split(",");
		List<String> stateList = new ArrayList<String>();
		if (StringUtil.isNotEmpty(str) && num.length > 0 && !str.equals("null")) {
			for (int i = 0; i < num.length; i++) {
				stateList.add(num[i]);
			}
		} else {
			stateList.add("");
		}
		return stateList;
	}

	/**
	 * @param args
	 *            将以逗号隔开的字符串转换为集合
	 */
	public static List<Long> getNullStrToLongList(String str) {
		List<Long> stateList = new ArrayList<Long>();
		if (StringUtil.isNotEmpty(str)) {
			String num[] = str.split(",");
			if (num.length > 0) {
				for (int i = 0; i < num.length; i++) {
					stateList.add(StringUtil.getNullLong(num[i]));
				}
			}
		} else {
			stateList.add(0L);
		}

		return stateList;
	}

	/**
	 * @param args
	 *            ，SQL查询时 like setParameter 加上%%
	 */
	public static String getNullStrLike(Object obj) {
		try {
			return "%" + obj.toString() + "%";
		} catch (Exception e) {
			return "%" + "" + "%";
		}
	}

	/**
	 * @param args
	 *            ，SQL查询时 like setParameter 加上%
	 */
	public static String getNullStrLikeSineRight(Object obj) {
		try {
			return obj.toString() + "%";
		} catch (Exception e) {
			return "" + "%";
		}
	}

	/**
	 * @param args
	 */
	public static Long getNullLong(Object obj) {
		try {

			return Long.valueOf(obj.toString());
		} catch (Exception e) {
			return 0L;
		}
	}

	/**
	 * @description 将xml字符串转换成map
	 * @param xml
	 * @return Map
	 */
	public static Map readStringXmlOut(String xml) {
		Map map = new HashMap();
		Document doc = null;
		try {
			doc = DocumentHelper.parseText(xml); // 将字符串转为XML

			Element rootElt = doc.getRootElement(); // 获取根节点

			Iterator iter = rootElt.elementIterator("head"); // 获取根节点下的子节点head

			// 遍历head节点

			while (iter.hasNext()) {

				Element recordEle = (Element) iter.next();
				String title = recordEle.elementTextTrim("title"); // 拿到head节点下的子节点title值
				map.put("title", title);

				Iterator iters = recordEle.elementIterator("script"); // 获取子节点head下的子节点script
				// 遍历Header节点下的Response节点
				while (iters.hasNext()) {

					Element itemEle = (Element) iters.next();
					String username = itemEle.elementTextTrim("username"); // 拿到head下的子节点script下的字节点username的值
					String password = itemEle.elementTextTrim("password");
					map.put("username", username);
					map.put("password", password);

				}
			}
			Iterator iterss = rootElt.elementIterator("body"); // /获取根节点下的子节点body

			// 遍历body节点
			while (iterss.hasNext()) {
				Element recordEless = (Element) iterss.next();
				String result = recordEless.elementTextTrim("result"); // 拿到body节点下的子节点result值
				Iterator itersElIterator = recordEless.elementIterator("form"); // 获取子节点body下的子节点form

				// 遍历Header节点下的Response节点
				while (itersElIterator.hasNext()) {

					Element itemEle = (Element) itersElIterator.next();

					String banlce = itemEle.elementTextTrim("banlce"); // 拿到body下的子节点form下的字节点banlce的值

					String subID = itemEle.elementTextTrim("subID");

					map.put("result", result);
					map.put("banlce", banlce);
					map.put("subID", subID);
				}
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}

	/**
	 * 自动将字符串补足10位 ，如1111——》0000001111
	 * 
	 * @param kh
	 * @return
	 */
	public static String fixToTen(String kh) {
		if (StringUtil.isNotEmpty(kh) && kh.length() < 10) {
			for (int i = 10 - kh.length(); i > 0; i--) {
				kh = "0" + kh;
			}
		}
		return kh;
	}

	public static String getIdGenerator() throws RuntimeException {
		String idEntity = "";
		try {
			idEntity = DateUtil.getFormatDate(new Date());
			int random = (int) (Math.random() * 90000000) + 10000000;// 生成8位随机数
			String randoms = String.valueOf(random);
			idEntity = idEntity + randoms;
			// log.info("id=" + idEntity);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("主键生成失败");
		}
		return idEntity;
	}

	public static Long getBigIntId() {
		return getNullLong(getIdGenerator());
	}

	/**
	 * System.currentTimeMillis+10位随机字符
	 * 
	 * @return
	 */
	public static String randomstr() {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < 10; i++) {
			int intVal = (int) (Math.random() * 26 + 97);
			sb.append((char) intVal);
		}
		return "YEY_" + System.currentTimeMillis() + sb.toString();
	}

	public static String getWeekStr(int day) {
		String weekStr = null;
		switch (day) {
		case 1:
			weekStr = "星期一";
			break;
		case 2:
			weekStr = "星期二";
			break;
		case 3:
			weekStr = "星期三";
			break;
		case 4:
			weekStr = "星期四";
			break;
		case 5:
			weekStr = "星期五";
			break;
		case 6:
			weekStr = "星期六";
			break;
		case 7:
			weekStr = "星期日";
			break;
		}
		return weekStr;
	}

	/**
	 * 产生6位随机数，不足补零
	 * 
	 * @return
	 */
	public static String get6RandomStr() {
		int result = 0;
		Random rand = new Random();
		result = rand.nextInt(999999);
		return "000000".substring((result + "").length()) + result;
	}

	public static String removeTagFromText(String content) {
		if (StringUtil.isNullOrEmpty(content)) {
			return "";
		}
		Pattern p = null;
		Matcher m = null;
		String value = null;
		// 去掉<>标签
		p = Pattern.compile("(<[^>]*>)");
		m = p.matcher(content);
		String temp = content;
		while (m.find()) {
			value = m.group(0);
			temp = temp.replace(value, "");
		}

		// 去掉换行或回车符号
		p = Pattern.compile("(/r+|/n+)");
		m = p.matcher(temp);
		while (m.find()) {
			value = m.group(0);
			temp = temp.replace(value, " ");
		}
		if (StringUtil.isNotEmpty(temp)) {
			temp = temp.replaceAll("&nbsp;", "");
		}
		if (StringUtil.isNotEmpty(temp)) {
			temp = temp.replaceAll("\n", "");
			temp = temp.replaceAll("\t", "");
		}
		if (StringUtil.isNotEmpty(temp)) {
			temp = temp.replaceAll(" ", "");
		}
		return temp;
	}

	/**
	 * 去掉<>标签
	 * 
	 * @param content
	 * @return
	 */
	public static String removeHtmlTagFromText(String content) {
		try {
			Pattern p = null;
			Matcher m = null;
			String value = null;
			// 去掉<>标签
			p = Pattern.compile("(<[^>]*>)");
			m = p.matcher(content);
			String temp = content;
			while (m.find()) {
				value = m.group(0);
				temp = temp.replace(value, "");
			}
			return temp;

		} catch (Exception e) {
			e.printStackTrace();
			return content;
		}

	}

	public static String getImg(String content) {
		if (StringUtil.isNullOrEmpty(content)) {
			return "";
		}
		Pattern p = Pattern
				.compile("<img[^>]+src\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>");// <img[^<>]*src=[\'\"]([0-9A-Za-z.\\/]*)[\'\"].(.*?)>");
		Matcher m = p.matcher(content);
		if (m.find()) {
			String img = StringUtil.getNullStr(m.group(1));
			if (img.indexOf("static/kindeditor/plugins/emoticons/images") > -1) {// 表情包路径，不显示图片
				return "";
			}
			// System.out.println("m.group():"+m.group());
			// System.out.println("m.group(1):"+m.group(1));
			return img;
		} else
			return "";
	}

	public static String URLDecoder(String s) {
		try {
			return new String(s.getBytes("ISO-8859-1"), "utf-8");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException("URL编码失败");
		}
	}

	/**
	 * 格式化字符，只剩下文字、数字
	 * 
	 * @param s
	 * @return
	 */
	public static String FormatString(String s) {
		String result = "";
		try {
			if (StringUtil.isNotEmpty(s)) {
				result = s.replaceAll("[^0-9\\W\\w+]", "");
			}
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			return s;

		}
	}

	/**
	 * 给字符串中的img标签前后添加A标签 A.href = img.src 如果alt为空，则方法不生效 该方法只能适用于img格式为如下形式
	 * <img src="jpg" alt="" />
	 * 
	 * @param str
	 * @param alt
	 * @return
	 */
	public static String addAofImg(String str, String alt) {
		String result = str;
		try {
			if (str.isEmpty() || alt.isEmpty()) {
				return str;
			}
			int index = 0;
			/* 方法通过改变alt的值获取下一个img标签 */
			while (str.indexOf("alt=\"\"") != -1) {
				// 获取字符串中图片路径
				String src = str.substring(
						str.indexOf("src=\"", str.indexOf("<img", index)) + 5,
						str.indexOf(
								"\"",
								str.indexOf("src=\"",
										str.indexOf("<img", index)) + 5));
				if (str.indexOf("alt=\"\" />") != -1) {
					// 给字符串中img标签前面添加<a>标签
					str = str.substring(0, str.indexOf("<img", index))
							+ "<a href=\"" + src + "\"><img"
							+ str.substring(str.indexOf("<img", index) + 4);
					index = str.indexOf("alt=\"\" />");
					// 添加alt的值，通知在img后面添加</a>标签
					str = str.substring(0, str.indexOf("alt=\"\" />"))
							+ "alt=\"" + alt + "\" />" + "</a>"
							+ str.substring(str.indexOf("alt=\"\" />") + 9);// 截取后再加
				} else {
					// 给字符串中img标签前面添加<a>标签
					str = str.substring(0, str.indexOf("<img", index))
							+ "<a href=\""
							+ src
							+ "\"><img alt=\""
							+ alt
							+ "\""
							+ str.substring(str.indexOf("<img alt=\"\"", index) + 11);
					index = str
							.indexOf(
									"\"",
									str.indexOf("src=\"",
											str.indexOf("<img", index)) + 5);
					// 添加alt的值，通知在img后面添加</a>标签
					str = str.substring(0, index + 4) + "</a>"
							+ str.substring(index + 4);// 截取后再加
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			return result;
		}

		return str;
	}

	/**
	 * 截取字符串前面的正整数，如"22天"得"22","18个人"得到"18".
	 * 
	 * @return
	 */
	public static String getQuantity(String regular) {
		int index = 0;
		for (int i = 0; i < regular.length(); i++) {
			char c = regular.charAt(i);
			if (Character.isDigit(c)) {
				if (i == regular.length() - 1) {
					index = i + 1;
				} else {
					index = i;
				}
				continue;
			} else {
				index = i;
				break;
			}
		}
		return regular.substring(0, index);
	}

	public static String getPinYin(String src) {
		char[] t1 = null;
		t1 = src.toCharArray();
		String[] t2 = new String[t1.length];
		// 设置汉字拼音输出的格式
		HanyuPinyinOutputFormat t3 = new HanyuPinyinOutputFormat();
		t3.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		t3.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
		t3.setVCharType(HanyuPinyinVCharType.WITH_V);
		String t4 = "";
		int t0 = t1.length;
		try {
			for (int i = 0; i < t0; i++) {
				// 判断能否为汉字字符
				// System.out.println(t1[i]);
				if (Character.toString(t1[i]).matches("[\\u4E00-\\u9FA5]+")) {
					t2 = PinyinHelper.toHanyuPinyinStringArray(t1[i], t3);
					if (t2 != null) {
						t4 += t2[0];
					}
				} else {
					// 如果不是汉字字符，间接取出字符并连接到字符串t4后
					t4 += Character.toString(t1[i]);
				}
			}
		} catch (BadHanyuPinyinOutputFormatCombination e) {
			e.printStackTrace();
		}
		return t4;
	}

	public static String getSubstringStr(String src, int beginIndex,
			int endIndex) {
		try {
			return src.substring(beginIndex, endIndex);
		} catch (Exception e) {
			return "";
		}
	}

	public static String getRateData(String numerator, String denominator) {
		String rate = "0%";
		if (StringUtil.isNotEmpty(denominator)
				&& !StringUtil.getNullStr(denominator).equals("0")
				&& !StringUtil.getNullStr(numerator).equals("0")) {
			return StringUtil.formartDecimal(StringUtil
					.getDoubleOfObj(numerator)
					/ StringUtil.getDoubleOfObj(denominator) * 100) + "%";
		}
		return rate;
	}

	/**
	 * 判断字符串数组中是否包含某字符串元素
	 * 
	 * @param substring
	 *            某字符串
	 * @param source
	 *            源字符串数组
	 * @return 包含则返回true，否则返回false
	 */
	public static boolean isIn(String substring, String[] source) {
		if (source == null || source.length == 0) {
			return false;
		}
		for (int i = 0; i < source.length; i++) {
			String aSource = source[i];
			if (aSource.equals(substring)) {
				return true;
			}
		}
		return false;
	}


	/**
	 * 判断Long类型是否空或者零
	 */
	public static boolean isNullOrEmpty(Long strLong) {
		if (strLong == null || strLong == 0L || strLong.equals(0)) {
			return true;
		}
		return false;
	}

	public static String guid() {
		Random rd = new Random();
		char[] strRandomList = { '0', '1', '2', '3', '4', '5', '6', '7', '8',
				'9', 'a', 'b', 'c', 'd', 'e', 'f' };

		String result = "";
		for (int i = 0; i < 32; i++) {
			result += strRandomList[rd.nextInt(strRandomList.length)];// 随机取strRandomList的项值
		}
		return result;
	}

	/**
	 * 判断Long类型是否空或者零
	 */
	public static boolean isNotEmpty(Long strLong) {

		return !isNullOrEmpty(strLong);
	}

	public static Integer getRandom4Int() {
		return r.nextInt(9000) + 1000;
	}

	public static Integer getRandom6Int() {
		return r.nextInt(900000) + 100000;
	}

	public static String getRandomSerialnumber() {
		String serialnumber = UUID.randomUUID().toString();
		serialnumber = serialnumber.replaceAll("-", "");
		return serialnumber;
	}

	/**
	 * 空字符或null时，返回0
	 */
	public static String getZeroByNullOrEmpty(Object obj) {
		String str = StringUtil.getNullStr(obj);
		if (isNullOrEmpty(str)) {
			return "0";
		}
		return str;
	}

	public static String getRandomCharAndNumr(Integer length) {
		String str = "";
		Random random = new Random();
		for (int i = 0; i < length; i++) {
			boolean b = random.nextBoolean();
			if (b) { // 字符串
				int choice = random.nextBoolean() ? 65 : 97; // 取得65大写字母还是97小写字母
				str += (char) (choice + random.nextInt(26));// 取得大写字母
			} else { // 数字
				str += String.valueOf(random.nextInt(10));
			}
		}
		// 如果是纯字母或纯数字 则重新生成
		if (isRandomUsable(str)) {
			str = getRandomCharAndNumr(length);
		}
		return str;
	}

	/**
	 * 验证随机字母数字组合是否纯数字与纯字母
	 */
	public static boolean isRandomUsable(String str) {
		// String regExp =
		// "^[A-Za-z]+(([0-9]+[A-Za-z0-9]+)|([A-Za-z0-9]+[0-9]+))|[0-9]+(([A-Za-z]+[A-Za-z0-9]+)|([A-Za-z0-9]+[A-Za-z]+))$";
		String regExp = "^([0-9]+)|([A-Za-z]+)$";
		Pattern pat = Pattern.compile(regExp);
		Matcher mat = pat.matcher(str);
		return mat.matches();
	}

	/**
	 * 去除字符串中的空格、回车、换行符、制表符
	 * 
	 * @param str
	 * @return
	 */
	public static String replaceBlank(String str) {
		String dest = "";
		if (str != null) {
			Pattern p = Pattern.compile("\\s*|\t|\r|\n");
			Matcher m = p.matcher(str);
			dest = m.replaceAll("");
		}
		return dest;
	}

	/**
	 * 判断字符串是否包含一些字符
	 */
	public static boolean containsString(String src, String dest) {
		src = "," + getNullStr(src) + ",";
		dest = "," + getNullStr(dest) + ",";
		boolean flag = false;
		if (src.contains(dest)) {
			flag = true;
		}
		return flag;
	}

	public static List<Long> getNullIdList(List<Object[]> objList, int num) {
		List<Long> idList = new ArrayList<Long>();
		idList.add(0L);
		if (objList != null && objList.size() > 0) {
			for (Object[] obj : objList) {
				idList.add(getNullLong(obj[num]));
			}
		}
		return idList;
	}

	public static List<String> getNullStrIdList(List<Object[]> objList, int num) {
		List<String> idList = new ArrayList<String>();
		idList.add("0");
		if (objList != null && objList.size() > 0) {
			for (Object[] obj : objList) {
				idList.add(getNullStr(obj[num]));
			}
		}
		return idList;
	}

	/**
	 * JSON字符串特殊字符处理，比如：“\A1;1300”
	 * 
	 * @param s
	 * @return String
	 */
	public static String string2Json(String s) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			switch (c) {
			case '\"':
				sb.append("");
				break;
			// case '\\':
			// sb.append("");
			// break;
			// case '/':
			// sb.append("");
			// break;
			case '\b':
				sb.append("");
				break;
			case '\f':
				sb.append("");
				break;
			case '\n':
				sb.append("");
				break;
			case '\r':
				sb.append("");
				break;
			case '\t':
				sb.append("");
				break;
			default:
				sb.append(c);
			}
		}
		return sb.toString();
	}

	public static String makeLongListToStr(List<Long> list) {
		if (list != null && !list.isEmpty()) {
			String str = list.toString();
			return str.substring(1, str.length() - 1).replace(" ", "");
		} else {
			return "";
		}
	}

	public static String makeStringListToStr(List<String> list) {
		if (list != null && !list.isEmpty()) {
			String str = list.toString();
			return str.substring(1, str.length() - 1).replace(" ", "");
		} else {
			return "";
		}
	}

	/**
	 * 去除字符串结尾的逗号
	 */
	public static String removeEndswithComma(String str) {
		if (isNotEmpty(str)) {
			if (str.endsWith(",")) {
				str = str.substring(0, str.length() - 1);
			}
		}
		return str;
	}

	public static String joinArrToStrWithComma(String[] strArr) {
		StringBuilder sb = new StringBuilder();
		if (strArr != null) {
			for (String s : strArr) {
				sb.append(s + ",");
			}
		}
		return removeEndswithComma(sb.toString());
	}

	/**
	 * 比较 2个字符串（以','连接的多个字符串元素）是否每个元素都相互包含。。。。
	 * 
	 * @param str1
	 * @param str2
	 * @return
	 */
	public static boolean compareWhichJoinWithComma(String str1, String str2) {
		List<String> list1 = StringUtil.getNullStrToStringList(StringUtil
				.getNullStr(str1));
		List<String> list2 = StringUtil.getNullStrToStringList(StringUtil
				.getNullStr(str2));
		if (list1.size() != list2.size())
			return false;
		if (!list1.containsAll(list2))
			return false;
		if (!list2.containsAll(list1))
			return false;
		return true;
	}

	/**
	 * 字符串（以','连接的多个字符串元素）去除重复的子元素
	 * 
	 * @param str1
	 * @return
	 */
	public static String removeRepeatElements(String str) {
		List<String> list = StringUtil.getNullStrToStringList(StringUtil
				.getNullStr(str));
		List<String> result = new ArrayList<String>();
		for (String s : list) {
			if (!result.contains(s)) {
				result.add(s);
			}
		}
		return makeStringListToStr(result);
	}

	// 替换所有的回车换行
	public static String transferString(String content) {
		String string_temp = content;
		try {
			if (StringUtil.isNotEmpty(content)) {
				string_temp = string_temp.replaceAll("<BR>", "\n");
			}
		} catch (Exception e) {
			// alert(e.message);
			return string_temp;
		}
		return string_temp;
	}

	/**
	 * 转码 /** 生成随机length 位数字和字母.
	 * 
	 * @param length
	 * @return
	 */
	public static String getStringRandom(int length) {
		String val = "";
		Random random = new Random();
		// 参数length，表示生成几位随机数
		for (int i = 0; i < length; i++) {
			String charOrNum = random.nextInt(2) % 2 == 0 ? "char" : "num";
			// 输出字母还是数字
			if ("char".equalsIgnoreCase(charOrNum)) {
				// 输出是大写字母还是小写字母
				int temp = random.nextInt(2) % 2 == 0 ? 65 : 97;
				val += (char) (random.nextInt(26) + temp);
			} else if ("num".equalsIgnoreCase(charOrNum)) {
				val += String.valueOf(random.nextInt(10));
			}
		}
		if (isNumeric(val)) {
			val = getStringRandom(length);
		}
		return val;
	}

	public static String unicodeToString(String str) {

		Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{4}))");
		Matcher matcher = pattern.matcher(str);
		char ch;
		while (matcher.find()) {
			ch = (char) Integer.parseInt(matcher.group(2), 16);
			str = str.replace(matcher.group(1), ch + "");
		}
		return str;
	}

	/**
	 * 将浮点型保留一位小数
	 */
	public static float formartOneDecimal(Object d) {

		if (d == null) {
			return StringUtil.getFloatOfObj(0);
		}

		String str = new java.text.DecimalFormat("#.0").format(d);
		if (str.charAt(0) == '.') // 0.1 格式化为 .01
		{
			str = "0" + str;
		}
		if (str.indexOf("-.") == 0) // -.01 开头
		{
			str = "-0." + str.substring(1);
		}

		if (str.equals("0") || str.equals("0.0")) {
			str = "0";
		}

		return StringUtil.getFloatOfObj(str.replace("-0.0", "").replace(".0",
				""));

	}

	/**
	 * 判断字符传是全为数字.
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNumeric(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher(str);
		if (!isNum.matches()) {
			return false;
		}
		return true;
	}

	/**
	 * @param args
	 */
	public static Integer getIntegerOfObj(Object obj) {
		try {
			return Integer.valueOf(obj.toString());
		} catch (Exception e) {
			return Integer.valueOf(0);
		}
	}

	/**
	 * 将Object转为int，如果Object为null返回0
	 * 
	 * @param args
	 */
	public static int getNullInt(Object obj) {
		try {
			return Integer.parseInt(obj.toString());

		} catch (Exception e) {
			return 0;
		}
	}

	public static int transToIDisplayStart(int pageIndex, int pageSize) {
		return (pageIndex - 1) * pageSize;
	}

	/**
	 * 入参格式：05：05
	 * 
	 * @param time
	 * @return
	 */
	public static int transTimeToInt(String time) {
		try {
			String[] str = time.split(":");
			return Integer.valueOf(str[0]) * 60 + Integer.valueOf(str[1]);
		} catch (Exception e) {
			throw new RuntimeException("时间格式错误");
		}
	}

	public static String transIntToTime(Integer time) {
		if (time == null) {
			return "";
		}
		try {
			String minute = (int) time / 60 + "";
			String second = time % 60 + "";
			if (minute.length() == 1) {
				minute = "0" + minute;
			}
			if (second.length() == 1) {
				second = "0" + second;
			}

			return minute + ":" + second;
		} catch (Exception e) {
			throw new RuntimeException("时间格式错误");
		}
	}

	/**
	 * 替换html符号，存数据库前
	 * 
	 * @param str
	 * @return
	 */
	public static String encodeHtml(String str) {
		if (str != null) {
			str = str.replace("'", "''");
			str = str.replace("\"", "&quot;");
			str = str.replace("<", "&lt;");
			str = str.replace(">", "&gt;");
			str = str.replace("\n", "<br>");
			str = str.replace("“", "&ldquo;");
			str = str.replace("”", "&rdquo;");
			str = str.replace("\\", "&bdiag;");
		}
		return str;
	}

	/**
	 * 还原html符号，从数据库取出后
	 * 
	 * @param str
	 * @return
	 */
	public static String decodeHtml(String str) {
		if (str != null) {
			str = str.replace("&rdquo;", "”");
			str = str.replace("&ldquo;", "“");
			str = str.replace("&gt;", ">");
			str = str.replace("&lt;", "<");
			str = str.replace("&quot;", "\"");
			str = str.replace("''", "'");
			str = str.replace("&bdiag;", "\\");
			str = str.replace("&#39;", "'");
			str = str.replace("<br>", "\n");
		}
		return str;
	}

	public static Map<String, List<Object[]>> toMapById(
			List<Object[]> questionCountList) {
		Map<String, List<Object[]>> map = new HashMap<String, List<Object[]>>();
		for (Object[] o : questionCountList) {
			String id = StringUtil.getNullStr(o[0]);
			List<Object[]> list = map.get(id);
			if (list == null) {
				list = new ArrayList<Object[]>();
				map.put(id, list);
			}
			list.add(o);
		}
		return map;
	}

	public static List<String> extractIdForBeen(Object list) {
		List<String> idList = new ArrayList<String>();
		if (list == null) {
			idList.add("");
			return idList;
		}
		List l = (List) list;
		for (Object o : l) {
			try {
				Method method = o.getClass().getMethod("getId");
				String id = StringUtil.getNullStr(method.invoke(o));
				idList.add(id);
			} catch (NoSuchMethodException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SecurityException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if (idList.isEmpty()) {
			idList.add("");
		}
		return idList;
	}

	public static List<Long> extractIds(List<Object[]> dataList) {
		List<Long> ids = new ArrayList<Long>();
		for (Object[] obj : dataList) {
			Long id = StringUtil.getNullLong(obj[0]);
			ids.add(id);
		}
		return ids;
	}

	public static List<String> extractIdsToStrList(List<Object[]> dataList) {
		List<String> ids = new ArrayList<String>();
		for (Object[] obj : dataList) {
			String id = StringUtil.getNullStr(obj[0]);
			ids.add(id);
		}
		return ids;
	}

	/**
	 * 提供精确的加法运算。
	 * 
	 * @param v1
	 *            被加数
	 * @param v2
	 *            加数
	 * @return 两个参数的和
	 */
	public static double add(double v1, double v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.add(b2).doubleValue();
	}

	/**
	 * 提供精确的减法运算。
	 * 
	 * @param v1
	 *            被减数
	 * @param v2
	 *            减数
	 * @return 两个参数的差
	 */
	public static double sub(double v1, double v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.subtract(b2).doubleValue();
	}

	/**
	 * 提供精确的乘法运算。
	 * 
	 * @param v1
	 *            被乘数
	 * @param v2
	 *            乘数
	 * @return 两个参数的积
	 */
	public static double mul(double v1, double v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.multiply(b2).doubleValue();
	}

	/**
	 * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到 小数点以后10位，以后的数字四舍五入。
	 * 
	 * @param v1
	 *            被除数
	 * @param v2
	 *            除数
	 * @return 两个参数的商
	 */
	public static double div(double v1, double v2) {
		return div(v1, v2, 10);
	}

	public static double divPercent(double v1, double v2, int scale) {
		return mul(div(v1, v2, scale + 2), 100);
	}

	/**
	 * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指 定精度，以后的数字四舍五入。
	 * 
	 * @param v1
	 *            被除数
	 * @param v2
	 *            除数
	 * @param scale
	 *            表示表示需要精确到小数点以后几位。
	 * @return 两个参数的商
	 */

	public static double div(double v1, double v2, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException(
					"The scale must be a positive integer or zero");
		}
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	/**
	 * 提供精确的小数位四舍五入处理。
	 * 
	 * @param v
	 *            需要四舍五入的数字
	 * @param scale
	 *            小数点后保留几位
	 * @return 四舍五入后的结果
	 */
	public static double round(double v, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException(
					"The scale must be a positive integer or zero");
		}
		BigDecimal b = new BigDecimal(Double.toString(v));
		BigDecimal one = new BigDecimal("1");
		return b.divide(one, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	/**
	 * 图片上传路径
	 * 
	 * @param orgcde
	 * @return
	 */
	public static String getFileUploadPath(Long orgcode) {
		String fileUploadPath = ConfigUtil.getValue("share") + "/" + orgcode
				+ "/";
		File file = new File(fileUploadPath);
		file.mkdirs();
		return fileUploadPath;
	}
}