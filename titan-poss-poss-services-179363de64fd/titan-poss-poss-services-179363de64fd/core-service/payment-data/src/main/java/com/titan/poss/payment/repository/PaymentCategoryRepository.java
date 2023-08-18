/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CATEGORY_REPOSITORY;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PaymentCategoryDao;

/**
 * Handles repository operations for <b>GiftCardDao</b>.
 *
 * @author Mindtree Ltd.
 * @version 1.0s
 */
@Repository(PAYMENT_CATEGORY_REPOSITORY)
public interface PaymentCategoryRepository extends JpaRepository<PaymentCategoryDao, String> {

	/**
	 * @param paymentCategoryName
	 * @return PaymentCategoryDao
	 */
	PaymentCategoryDao findOneByPaymentCategoryName(String paymentCategoryName);

	@Query("SELECT pc FROM PaymentCategoryDao pc WHERE pc.payment.paymentCode =:paymentCode AND pc.instrumentNumber LIKE %:instrumentNumber% ")
	List<PaymentCategoryDao> checkForUniqueInstrumentNumber(@Param("paymentCode") String paymentCode,
			@Param("instrumentNumber") String instrumentNumber);

	@Query("SELECT pc FROM PaymentCategoryDao pc WHERE (:paymentCategoryName IS NULL OR pc.paymentCategoryName LIKE %:paymentCategoryName%) AND (:isActive IS NULL OR pc.isActive = :isActive)")
	Page<PaymentCategoryDao> findConfigName(@Param("paymentCategoryName") String paymentCategoryName,
			@Param("isActive") Boolean isActive, Pageable pageable);

}
