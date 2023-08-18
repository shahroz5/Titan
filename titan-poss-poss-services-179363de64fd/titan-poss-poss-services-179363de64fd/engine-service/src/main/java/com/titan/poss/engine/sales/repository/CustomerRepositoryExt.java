/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerDao;

/**
 * Handles repository operations for <b>Customer</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineCustomerRepository")
public interface CustomerRepositoryExt extends JpaRepository<CustomerDao, String> {

	int countByMobileNumber(String mobileNo);

	int countByEmailId(String emailId);

	CustomerDao findOneByMobileNumber(String mobileNumber);

	CustomerDao findOneByUlpId(String ulpId);

}
