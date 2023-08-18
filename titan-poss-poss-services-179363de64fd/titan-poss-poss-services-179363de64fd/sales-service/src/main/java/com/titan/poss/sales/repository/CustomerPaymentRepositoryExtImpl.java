/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.math.BigDecimal;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class CustomerPaymentRepositoryExtImpl implements CustomCustomerPaymentRepository {

	@PersistenceContext()
	private EntityManager entityManager;

	@Override
	public BigDecimal getTotalCashPaid(String query) {

		Object obj = entityManager.createNativeQuery(query).getSingleResult();

		return (BigDecimal) obj;

	}

}
