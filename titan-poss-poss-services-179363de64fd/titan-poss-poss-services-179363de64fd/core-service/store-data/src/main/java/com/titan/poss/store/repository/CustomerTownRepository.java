/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.store.dao.CustomerTownDao;
import com.titan.poss.store.dao.CustomerTownId;

/**
 * Handles repository operations for <b>Customer Town</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface CustomerTownRepository extends JpaRepository<CustomerTownDao, CustomerTownId> {

	Optional<CustomerTownDao> findByCustomerTownIdTownCodeAndCustomerTownIdLocationCode(Integer townCode,
			String locationCode);

}
