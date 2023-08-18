/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.PriceGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductPriceGroupRepositoryExt")
public interface PriceGroupRepositoryExt extends PriceGroupRepository {

	/**
	 * This method will return the list of PriceGroup details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<PriceGroup>
	 */
	public Page<PriceGroupDao> findByIsActive(Boolean isActive, Pageable pageable);

	
}
