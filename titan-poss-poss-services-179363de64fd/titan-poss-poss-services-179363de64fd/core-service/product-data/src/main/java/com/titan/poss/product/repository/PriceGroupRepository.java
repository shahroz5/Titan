/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.PriceGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PriceGroupRepository extends JpaRepository<PriceGroupDao, String> {
	
	/**
	 * This method will return the PriceGroup details based on the priceGroup.
	 * 
	 * @param priceGroup
	 * @return PriceGroup
	 */
	public PriceGroupDao findOneByPriceGroup(String priceGroup);
}
