/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.location.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.repository.MarketRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("engineMarketRepository")
public interface MarketRepositoryExt extends MarketRepository {

	/**
	 * @param marketCode
	 * @param b
	 */
	MarketDao findByMarketCodeAndIsActive(String marketCode, boolean b);

}
