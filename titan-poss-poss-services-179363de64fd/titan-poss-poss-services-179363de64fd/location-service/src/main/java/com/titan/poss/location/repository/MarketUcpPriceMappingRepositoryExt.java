/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketUcpPriceMappingDaoExt;

/**
 * Handles repository operations for <b>market_ucp_price_mapping</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("locationMarketUcpPriceMappingRepositoryExt")
public interface MarketUcpPriceMappingRepositoryExt extends JpaRepository<MarketUcpPriceMappingDaoExt, String> {

	/**
	 * This method will give market UCP price factor based in marketCode and
	 * productGroupCode.
	 * 
	 * @param marketCode
	 * @param productGroupCode
	 * @return MarketUcpPriceMappingDaoExt
	 */
	MarketUcpPriceMappingDaoExt findByMarketDaoMarketCodeAndProductGroupCode(String marketCode,
			String productGroupCode);

}
