/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountLocationMappingDao;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface DiscountLocationMappingRepository extends JpaRepository<DiscountLocationMappingDao, String> {


	/**
	 * @param discount
	 * @param locationCode
	 * @return DiscountLocationMappingDao
	 */
	DiscountLocationMappingDao findOneByDiscountAndLocationCode(DiscountDao discount, String locationCode);

	/**
	 * @param id
	 * @return
	 */
	DiscountLocationMappingDao findOneById(String id);

}
