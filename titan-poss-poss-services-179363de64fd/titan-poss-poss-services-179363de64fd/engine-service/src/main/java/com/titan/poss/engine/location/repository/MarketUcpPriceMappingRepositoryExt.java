/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.location.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketUcpPriceMappingDao;
import com.titan.poss.location.repository.MarketUcpPriceMappingRepository;

/**
 * Repository for <b>market_ucp_price_mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineMarketUcpPriceMappingRepositoryExt")
public interface MarketUcpPriceMappingRepositoryExt extends MarketUcpPriceMappingRepository {

	/**
	 * This method will give market UCP price factor based in marketCode and
	 * productGroupCode.
	 * 
	 * @param marketCode
	 * @param productGroupCode
	 * @return MarketUcpPriceMappingDao
	 */
	MarketUcpPriceMappingDao findByMarketDaoMarketCodeAndProductGroupCode(String marketCode, String productGroupCode);

}
