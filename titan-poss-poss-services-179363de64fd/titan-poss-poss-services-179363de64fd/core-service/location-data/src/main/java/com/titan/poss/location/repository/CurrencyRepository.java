/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.CurrencyDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface CurrencyRepository extends JpaRepository<CurrencyDao, String> {
	
	/**
	 * This method will return the Currency details based on the currencyCode.
	 * 
	 * @param currencyCode
	 * @return Currency
	 */
	public CurrencyDao findOneByCurrencyCode(String currencyCode);

}
