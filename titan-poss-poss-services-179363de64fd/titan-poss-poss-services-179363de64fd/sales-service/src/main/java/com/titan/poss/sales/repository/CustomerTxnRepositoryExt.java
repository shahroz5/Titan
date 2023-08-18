/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.CustomerTxnDaoExt;

/**
 * Handles repository operations for <b>customer_transaction</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerTxnRepository")
public interface CustomerTxnRepositoryExt extends JpaRepository<CustomerTxnDaoExt, String> {

	// @formatter:off
	@Query("SELECT ct "
			+ " FROM com.titan.poss.sales.dao.CustomerTxnDaoExt ct "
			+ " WHERE ct.salesTxnDao.id = :salesTxnId")
	// @formatter:on
	CustomerTxnDaoExt findOneBySalesTxnDaoId(@Param("salesTxnId") String salesTxnId);

	/**
	 * 
	 * @param txnId
	 * @param locationCode
	 * @return CustomerTxnDaoExt
	 */
    CustomerTxnDaoExt findByIdAndSalesTxnDaoLocationCode(String txnId, String locationCode);

}
