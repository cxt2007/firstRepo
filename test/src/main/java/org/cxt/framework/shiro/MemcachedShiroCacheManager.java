package org.cxt.framework.shiro;

import org.apache.shiro.cache.Cache;

/**
 * 这里的name是指自定义relm中的授权/认证的类名加上授权/认证英文名字
 *
 * @author michael
 */
public class MemcachedShiroCacheManager implements ShiroCacheManager {

	@Override
	public <K, V> Cache<K, V> getCache(String name) {
		return new MemcachedShiroCache<K, V>(name);
	}

	@Override
	public void destroy() {
		//
	}

}
