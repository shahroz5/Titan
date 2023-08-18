/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PaymentLovDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("paymentLovRepository")
public interface PaymentLovRepository extends JpaRepository<PaymentLovDao, String> {

	/**
	 * @param lovType
	 * @param code
	 * @return
	 */
	PaymentLovDao findOneByLovTypeAndCode(String lovType, String code);

	/**
	 * @param lovType
	 * @return
	 */
	List<PaymentLovDao> findByLovTypeAndIsActiveTrue(String lovType);

}
