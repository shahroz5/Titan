/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.TaxConfigsDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("taxConfigRepository")
public interface TaxConfigsRepository extends JpaRepository<TaxConfigsDao, String> {

}
