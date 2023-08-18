/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.CASHBACK_REPOSITORY;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.CashbackDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(CASHBACK_REPOSITORY)
public interface CashbackRepository extends JpaRepository<CashbackDao, String> {

	@Query("Select c from CashbackDao c where c.isActive = 1 AND :currentDate between c.startDate AND c.endDate")
	List<CashbackDao> getActiveCashbackOffers(@Param("currentDate") Date businessDate);

	/**
	 * @param offerId
	 */
	@Query("Select c from CashbackDao c where c.isActive = 1 AND c.id = :id")
	CashbackDao getCashbackHeaderDetails(@Param("id") String offerId);

	/**
	 * @param offerId
	 * @param bankName
	 * @param date
	 */
	@Query("Select c from CashbackDao c where c.isActive = 1 AND c.id = :offerId AND c.payerBankName.bankName = :bankName AND :currentDate between c.startDate AND c.endDate ")
	CashbackDao validateOfferId(@Param("offerId") String offerId, @Param("bankName") String bankName,
			@Param("currentDate") Date businessDate);

}
