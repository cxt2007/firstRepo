package org.cxt.util;

import java.io.IOException;

import net.rubyeye.xmemcached.utils.AddrUtil;
import net.spy.memcached.ConnectionFactoryBuilder;
import net.spy.memcached.ConnectionFactoryBuilder.Protocol;
import net.spy.memcached.MemcachedClient;
import net.spy.memcached.auth.AuthDescriptor;
import net.spy.memcached.auth.PlainCallbackHandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;

public class MemCacheUtil {

	private static Logger logger = LoggerFactory.getLogger(MemCacheUtil.class);
	private static ApplicationContext ctx = null;

	public static final String TYPE_WX_CODE_GHHD_VOTE = "WX_CODE_GHHD_VOTE";
	public static final String TYPE_LOGIN_CHECK_CODE = "TYPE_LOGIN_CHECK_CODE";// 登录验证码
	public static final String TYPE_LOGIN_CHECK_CODE_VALIDATION = "TYPE_LOGIN_CHECK_CODE_VALIDATION";// 登录验证码验证成功标志位
	public static final String TYPE_LOGIN_PASSWORD_ERROR_TIMES = "TYPE_LOGIN_PASSWORD_ERROR_TIMES";// 登录密码输入错误次数

	public static final String TYPE_WX_GHHD_THEME = "WX_GHHD_THEME";// 光海活动主题
	public static final String TYPE_WX_GHHD_THEME_DETAIL = "WX_GHHD_THEME_DETAIL";// 光海活动主题细节（活动的奖项和图片等）

	public static final String TYPE_IDENTIFYCODE = "TYPE_IDENTIFYCODE";// 短信验证码

	public static final String TYPE_WX_PAY_ACCOUNT = "WX_PAY_ACCOUNT";


	public static void setCtx(ApplicationContext ctx) {
		MemCacheUtil.ctx = ctx;
	}

	private static MemcachedClient client = null;

	public static void start(String ip, String port) {
		try {

			client = new MemcachedClient(new ConnectionFactoryBuilder()
					.setProtocol(Protocol.BINARY).build(),
					AddrUtil.getAddresses(ip + ":" + port));

		} catch (IOException e) {
			logger.error("获取缓存发生错误", e);
		}
	}

	public static void start() {
		String ip = ConfigUtil.getValue("memcacheutil.ip");
		String port = ConfigUtil.getValue("memcacheutil.port");
		String username = ConfigUtil.getValue("memcacheutil.username");
		String password = ConfigUtil.getValue("memcacheutil.password");
		AuthDescriptor ad = new AuthDescriptor(new String[] { "PLAIN" },
				new PlainCallbackHandler(username, password));

		try {
			client = new MemcachedClient(
					new ConnectionFactoryBuilder().setProtocol(Protocol.BINARY)
							.setAuthDescriptor(ad).build(),
					AddrUtil.getAddresses(ip + ":" + port));
		} catch (IOException e) {
			logger.error("获取缓存发生错误", e);
		}
	}

	public static void set(String key, Object obj) {
		try {
			client.set(key, 0, obj);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("获取缓存发生错误", e);
			throw new RuntimeException("设置数据发现异常:" + e.getMessage());
		}
	}

	public static void delete(String key) {
		try {
			client.delete(key);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("获取缓存发生错误", e);
			throw new RuntimeException("删除数据发现异常:" + e.getMessage());
		}
	}

	public static void set(String key, int expire, Object obj) {
		try {
			client.set(key, expire, obj);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("获取缓存发生错误", e);
			throw new RuntimeException("设置数据发现异常:" + e.getMessage());
		}
	}

	public static Object get(String key) {

		try {
			return client.get(key);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("获取缓存发生错误", e);
			throw new RuntimeException("获取数据发现异常:" + e.getMessage());
		}
	}

}
