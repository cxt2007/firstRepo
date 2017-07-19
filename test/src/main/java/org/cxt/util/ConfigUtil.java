package org.cxt.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

/**
 * @author lc Date: 13-06-04
 */
public class ConfigUtil {

	private static Properties props;

	private static void loadProperties() {
		props = new Properties();
		try {
			props.load(Thread.currentThread().getContextClassLoader()
					.getResource("application.properties").openStream());
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 得到key的值
	 * 
	 * @param key
	 *            取得其值的键
	 * @return key的值
	 */
	public static String getValue(String key) {
		loadProperties();
		if (props.containsKey(key)) {
			return props.getProperty(key);// 得到某一属性的值
		} else {
			return "";
		}
	}

	/**
	 * 改变或添加一个key的值，当key存在于properties文件中时该key的值被value所代替， 当key不存在时，该key的值是value
	 * 
	 * @param key
	 *            要存入的键
	 * @param value
	 *            要存入的值
	 */
	public void setValue(String key, String value) {
		props.setProperty(key, value);
	}

}
