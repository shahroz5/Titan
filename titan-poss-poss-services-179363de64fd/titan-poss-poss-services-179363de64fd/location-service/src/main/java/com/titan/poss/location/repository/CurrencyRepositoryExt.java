/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.CurrencyDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface CurrencyRepositoryExt extends CurrencyRepository {

	/**
	 * This method will return the list of Currency details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<Currency>
	 */
	public Page<CurrencyDao> findByIsActive(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Currency details based on the description.
	 * 
	 * @param description
	 * @return Currency
	 */
	public CurrencyDao findOneByDescription(String description);
}
