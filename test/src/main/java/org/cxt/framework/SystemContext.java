package org.cxt.framework;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.servlet.ServletContextEvent;

import org.cxt.util.ConfigUtil;
import org.cxt.util.MemCacheUtil;
import org.cxt.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * 
 * @author wm web工程上下文
 */
public final class SystemContext extends
		org.springframework.web.context.ContextLoaderListener {

	private static Logger logger = LoggerFactory.getLogger(SystemContext.class);
	private static ApplicationContext ctx = null;
	private static String realPath = null;

	public static ApplicationContext getCtx() {
		return ctx;
	}

	public static String getRealPath() {
		return realPath;
	}

	public void contextInitialized(ServletContextEvent event) {

		long s0 = System.currentTimeMillis();
		super.contextInitialized(event);
		ctx = WebApplicationContextUtils.getRequiredWebApplicationContext(event
				.getServletContext());

		initSpringBean(ctx);

		initThread();

		realPath = event.getServletContext().getRealPath("/");

		long s1 = System.currentTimeMillis();
		logger.info(" spring init success ,time=" + (s1 - s0));
	}

	private void initSpringBean(ApplicationContext ctx) {
		MemCacheUtil.setCtx(ctx);

		if (StringUtil.isNotEmpty(ConfigUtil
				.getValue("memcacheforonecardutil.username"))) {
			MemCacheUtil.start();
		} else {
			MemCacheUtil.start(ConfigUtil.getValue("memcacheutil_ip"),
					ConfigUtil.getValue("memcacheutil_port"));
		}
		
		MemCacheUtil.set("testkey", "112111111111111");
	}

	/**
	 * 运行固定的线程池
	 * 
	 * @param threadName
	 * @param threadPoolNum
	 */
	private static void runThreadPool(Runnable threadName, int threadPoolNum) {
		ExecutorService pool = Executors.newFixedThreadPool(threadPoolNum);
		for (int i = 0; i < threadPoolNum; i++) {
			pool.execute(threadName);
		}
	}

	private void initThread() {
		logger.error("CPU核心数量=" + Runtime.getRuntime().availableProcessors());
	}
}
