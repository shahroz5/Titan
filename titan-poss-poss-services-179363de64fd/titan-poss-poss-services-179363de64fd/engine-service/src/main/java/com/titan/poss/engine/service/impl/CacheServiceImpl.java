/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import com.titan.poss.engine.service.CacheService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class CacheServiceImpl implements CacheService {

	@Autowired
	private CacheManager cacheManager;

	@Override
	public void clearCache(String cacheKey, String cacheValue) {

		if (StringUtils.isEmpty(cacheKey)) {
			cacheManager.getCache(cacheValue).clear();
		} else {
			cacheManager.getCache(cacheValue).evict(cacheKey);
		}
	}
}
