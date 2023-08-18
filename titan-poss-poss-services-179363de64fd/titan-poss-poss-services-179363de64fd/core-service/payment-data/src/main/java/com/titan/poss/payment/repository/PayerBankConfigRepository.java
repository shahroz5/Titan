/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import com.titan.poss.payment.dao.PayerConfigDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_CONFIG_REPOSITORY;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(PAYER_BANK_CONFIG_REPOSITORY)
public interface PayerBankConfigRepository extends JpaRepository<PayerConfigDao, String> {

	/**
	 *
	 * @param id
	 * @return PayerConfigDao
	 */
	PayerConfigDao findOneByIdAndIsActive(String id, Boolean status);

	/**
	 *
	 * @param id
	 * @return PayerConfigDao
	 */
	PayerConfigDao findOneById(String id);

}
