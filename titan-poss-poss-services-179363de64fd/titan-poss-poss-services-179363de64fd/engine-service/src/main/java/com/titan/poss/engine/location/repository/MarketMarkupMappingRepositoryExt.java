/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.location.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDao;
import com.titan.poss.location.repository.MarketMarkupMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineMarketMarkupRepo")
public interface MarketMarkupMappingRepositoryExt extends MarketMarkupMappingRepository {

	/**
	 * @param market
	 * @param b
	 * @param metalTypeCode
	 */
	MarketMarkupMappingDao findByMarketAndMetalTypeCode(MarketDao market, String metalTypeCode);

}
