/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountTypeMetaDataDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface DiscountTypeMetaDataRepository extends JpaRepository<DiscountTypeMetaDataDao, String> {

	/**
	 * @param discountType
	 * @return
	 */
	DiscountTypeMetaDataDao findByDiscountType(String discountType);

}
