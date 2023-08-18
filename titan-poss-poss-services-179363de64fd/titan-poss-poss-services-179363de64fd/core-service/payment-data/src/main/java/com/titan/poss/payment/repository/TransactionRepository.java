/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.TransactionDao;

/**
 * Repository to handle <b>transaction_master</b> operations.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("paymentTransactionRepository")
public interface TransactionRepository extends JpaRepository<TransactionDao, String> {

}
