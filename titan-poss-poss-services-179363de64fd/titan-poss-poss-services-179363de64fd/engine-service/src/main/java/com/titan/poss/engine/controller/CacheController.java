/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.engine.service.CacheService;

import io.swagger.annotations.ApiOperation;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController("engineCacheController")
@RequestMapping("engine/v2/cache")
public class CacheController {

	@Autowired
	private CacheService cacheService;

	@GetMapping(value = "/clear-cache")
	@ApiOperation(value = "This API is used to clear cache data in engine service.")
	public void clearCache(@RequestParam(required = true) String cacheValue,
			@RequestParam(required = false) String cacheKey) {
		cacheService.clearCache(cacheKey, cacheValue);
	}
}
