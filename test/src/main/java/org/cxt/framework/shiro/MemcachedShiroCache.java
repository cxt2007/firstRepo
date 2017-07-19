package org.cxt.framework.shiro;

import java.util.Collection;
import java.util.Set;

import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheException;
import org.cxt.util.MemCacheUtil;

/**
 * redis shiro cache class
 *
 * @author michael
 */
public class MemcachedShiroCache<K, V> implements Cache<K, V> {

	private static final String MEMCACHED_SHIRO_CACHE = "SHIRO-CACHE:";

	private String name;

	public MemcachedShiroCache(String name) {
		this.name = name;
	}

	/**
	 * 自定义relm中的授权/认证的类名加上授权/认证英文名字
	 */
	public String getName() {
		if (name == null)
			return "";
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@SuppressWarnings("unchecked")
	@Override
	public V get(K key) throws CacheException {

		return (V) MemCacheUtil.get(buildCacheKey(key));
	}

	@Override
	public V put(K key, V value) throws CacheException {
		MemCacheUtil.set(buildCacheKey(key), value);

		return value;
	}

	@Override
	public V remove(K key) throws CacheException {
		V previos = get(key);
		MemCacheUtil.delete(buildCacheKey(key));
		return previos;
	}

	@Override
	public void clear() throws CacheException {
		// TODO
	}

	@Override
	public int size() {
		if (keys() == null)
			return 0;
		return keys().size();
	}

	@Override
	public Set<K> keys() {
		// TODO
		return null;
	}

	@Override
	public Collection<V> values() {
		// TODO
		return null;
	}

	private String buildCacheKey(Object key) {
		return MEMCACHED_SHIRO_CACHE + getName() + ":" + key;
	}

}
