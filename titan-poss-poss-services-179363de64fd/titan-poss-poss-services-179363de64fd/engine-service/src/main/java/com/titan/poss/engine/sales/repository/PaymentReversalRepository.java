/*  
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.PaymentReversalDao;

/**
 * Handles repository operations for <b>payment_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesPaymentReversalRepository")
public interface PaymentReversalRepository extends JpaRepository<PaymentReversalDao, String> {



}
