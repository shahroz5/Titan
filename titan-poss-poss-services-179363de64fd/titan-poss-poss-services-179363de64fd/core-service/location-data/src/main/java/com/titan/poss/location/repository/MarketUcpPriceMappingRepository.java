/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketUcpPriceMappingDao;

/**
 * Repository for <b>market_ucp_price_mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface MarketUcpPriceMappingRepository extends JpaRepository<MarketUcpPriceMappingDao, String> {

	/**
	 * @param id
	 * @return
	 */
	MarketUcpPriceMappingDao findOneById(String id);

}
