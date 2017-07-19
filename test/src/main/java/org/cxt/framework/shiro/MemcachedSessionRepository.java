package org.cxt.framework.shiro;

import java.io.Serializable;
import java.util.Collection;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.SimpleSession;
import org.cxt.util.MemCacheUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MemcachedSessionRepository implements ShiroSessionRepository {

	private static Logger logger = LoggerFactory
			.getLogger(MemcachedSessionRepository.class);
	/**
	 * memcached session key前缀
	 */
	private final String MEMCACHED_SHIRO_SESSION = "shiro-session:";

	@Override
	public void saveSession(Session session) {
		if (session == null || session.getId() == null) {
			logger.error("session或者session id为空");
			return;
		}

		// 设定SESSION 超时时间为1个小时
		MemCacheUtil.set(MEMCACHED_SHIRO_SESSION + session.getId(),
				10 * 60 * 60, session);

	}

	@Override
	public void deleteSession(Serializable sessionId) {
		if (sessionId == null) {
			logger.error("id为空");
			return;
		}
		MemCacheUtil.delete(MEMCACHED_SHIRO_SESSION + sessionId);
	}

	@Override
	public Session getSession(Serializable sessionId) {
		if (sessionId == null) {
			logger.error("id为空");
			return null;
		}

		Object session = MemCacheUtil.get(MEMCACHED_SHIRO_SESSION + sessionId);

		if (session == null) {
			logger.error("sessionId:" + sessionId + "已经失效");
			return null;
		} else {
			return (SimpleSession) session;
		}
	}

	@Override
	public Collection<Session> getAllSessions() {
		// TODO Auto-generated method stub
		return null;
	}

}
