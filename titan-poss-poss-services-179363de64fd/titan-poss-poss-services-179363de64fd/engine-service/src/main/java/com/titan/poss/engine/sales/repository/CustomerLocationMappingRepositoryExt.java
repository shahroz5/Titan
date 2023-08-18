/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.sales.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.repository.CustomerLocationMappingRepository;

/**
 * Handles repository operations for <b>Customer Location Mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineCustomerLocationMappingRepository")
public interface CustomerLocationMappingRepositoryExt extends CustomerLocationMappingRepository {

	Optional<CustomerLocationMappingDao> findById(CustomerLocationMappingIdDao customerLocationMappingIdDao);
	CustomerLocationMappingDao findByCustomerLocationMappingIdCustomerId(Integer customerId);
}
