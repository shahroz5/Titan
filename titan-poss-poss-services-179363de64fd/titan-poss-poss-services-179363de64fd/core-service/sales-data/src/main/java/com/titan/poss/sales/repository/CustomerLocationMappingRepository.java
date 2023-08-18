/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;

/**
 * Handles repository operations for <b>Customer Location Mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface CustomerLocationMappingRepository
		extends JpaRepository<CustomerLocationMappingDao, CustomerLocationMappingIdDao> {

}
