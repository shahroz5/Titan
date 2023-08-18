/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.store.dao.BankPriorityDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("bankPriorityRepository")
public interface BankPriorityRepository extends JpaRepository<BankPriorityDao, String> {

	/**
	 * 
	 * @param locationCode
	 * @return List<BankPriorityDao>
	 */
	List<BankPriorityDao> findAllByLocationCodeOrderByPriority(String locationCode);

	/**
	 * 
	 * @param locationCode
	 * @param bankName
	 * @return List<BankPriorityDao>
	 */
	List<BankPriorityDao> findByLocationCodeAndBankNameIn(String locationCode, List<String> bankName);

	/**
	 * @param bankName
	 * @param priority
	 * @param locationCode
	 * @return BankPriorityDao
	 */
	BankPriorityDao findOneByBankNameAndPriorityAndLocationCode(String bankName, Integer priority, String locationCode);

	List<BankPriorityDao> findByLocationCode(String locationCode);

}
