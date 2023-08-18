/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_DETAILS_REPOSITORY;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PayerConfigDao;
import com.titan.poss.payment.dao.PayerDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository(PAYER_BANK_DETAILS_REPOSITORY)
public interface PayerDetailsRepository extends JpaRepository<PayerDetailsDao, String> {

	/**
	 * @param payerConfigDao
	 * @return List<PayerDetailsDao>
	 */
	List<PayerDetailsDao> findByPayerBankConfig(PayerConfigDao payerConfigDao);

	/**
	 * @param removeBankName
	 * @return
	 */
	List<PayerDetailsDao> findByIdIn(List<String> removeBankName);

	Optional<PayerDetailsDao> findOneByPayerBankConfigIdAndPayerBankBankName(String id, String bankName);

}
