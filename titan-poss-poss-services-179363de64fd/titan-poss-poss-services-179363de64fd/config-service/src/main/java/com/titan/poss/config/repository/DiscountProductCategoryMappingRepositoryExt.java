/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDaoExt;
import com.titan.poss.config.dao.DiscountProductCategoryMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface DiscountProductCategoryMappingRepositoryExt
		extends JpaRepository<DiscountProductCategoryMappingDaoExt, String> {

	/**
	 * @param discountDaoExt
	 * @return
	 */
	List<DiscountProductCategoryMappingDaoExt> findAllByDiscount(DiscountDaoExt discountDaoExt);

}
