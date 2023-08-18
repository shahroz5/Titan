/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.math.BigDecimal;

import org.springframework.stereotype.Repository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface CustomCustomerPaymentRepository {

	/**
	 * Query to get total cash paid.
	 * 
	 * @param query
	 * @return BigDecimal
	 */
	BigDecimal getTotalCashPaid(String query);

}
