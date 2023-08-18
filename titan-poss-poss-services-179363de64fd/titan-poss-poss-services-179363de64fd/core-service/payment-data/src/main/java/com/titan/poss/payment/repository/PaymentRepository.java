/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_REPOSITORY;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PaymentDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(PAYMENT_REPOSITORY)
public interface PaymentRepository extends JpaRepository<PaymentDao, String> {

	/**
	 * This method will return the Payment Master based on the paymentCode.
	 * 
	 * @param paymentCode
	 * @return Payment
	 */
	PaymentDao findOneByPaymentCode(String paymentCode);

	/**
	 * This method will return the Payment Master List based on paymentCodes
	 * 
	 * @param paymentCodeList
	 * @return List<PaymentDao>
	 */
	List<PaymentDao> findByPaymentCodeIn(List<String> paymentCodeList);

}
