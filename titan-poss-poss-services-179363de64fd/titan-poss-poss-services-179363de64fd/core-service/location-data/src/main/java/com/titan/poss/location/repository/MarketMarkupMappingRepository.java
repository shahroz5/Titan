/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketMarkupMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("marketMarkupRepository")
public interface MarketMarkupMappingRepository extends JpaRepository<MarketMarkupMappingDao, String> {

	/**
	 * @param marketCode
	 * @param metalTypeCode
	 * @return
	 */
	MarketMarkupMappingDao findOneByMarketMarketCodeAndMetalTypeCode(String marketCode, String metalTypeCode);
}
