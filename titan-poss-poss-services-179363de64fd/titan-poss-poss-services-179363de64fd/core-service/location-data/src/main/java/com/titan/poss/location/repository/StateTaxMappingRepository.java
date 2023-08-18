/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.StateTaxMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface StateTaxMappingRepository extends JpaRepository<StateTaxMappingDao, String> {

	/**
	 * This method will return the StateTax details based on the id.
	 * 
	 * @param id
	 * @return StateTax
	 */
	StateTaxMappingDao findOneById(String id);

}
