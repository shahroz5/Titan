/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface MarketRepository extends JpaRepository<MarketDao, String> {
	
	/**
	 * This method will return the Market details based on the marketCode.
	 * 
	 * @param marketCode
	 * @return Market
	 */

	public MarketDao findOneByMarketCode(String marketCode);

}
