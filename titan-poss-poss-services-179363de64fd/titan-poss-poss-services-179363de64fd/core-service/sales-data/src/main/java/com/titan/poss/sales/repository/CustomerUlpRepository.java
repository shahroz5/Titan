/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerUlpDao;

/**
 * Handles repository operations for <b>Customer Ulp</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerUlpRepository")
public interface CustomerUlpRepository extends JpaRepository<CustomerUlpDao, String> {

}
