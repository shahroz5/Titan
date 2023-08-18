/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.sales.dao.PIFSeriesDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface PIFSeriesRepository extends JpaRepository<PIFSeriesDao, String> {
	/**
	 *
	 * @param locationCode
	 * @param status
	 * @param payeeBankName
	 * @param paymentCode
	 * @return PIFSeriesDao
	 */
	PIFSeriesDao findByLocationCodeAndIsActiveAndBankNameAndPaymentCode(String locationCode, Boolean status,
			String payeeBankName, String paymentCode);

	/**
	 * 
	 * @param locationCode
	 * @param status
	 * @param payeeBankName
	 * @param paymentCode
	 * @param homeBank
	 * @return PIFSeriesDao
	 */
	PIFSeriesDao findByLocationCodeAndIsActiveAndBankNameAndPaymentCodeAndIsHomeBank(String locationCode,
			Boolean status, String payeeBankName, String paymentCode, Boolean homeBank);

	/**
	 * 
	 * @param locationCode
	 * @param paymentCode
	 * @return PIFSeriesDao
	 */
	PIFSeriesDao findByLocationCodeAndPaymentCodeAndIsActive(String locationCode, String paymentCode, Boolean status);

	/**
	 *
	 * @param locationCode
	 * @param paymentCode
	 * @param status
	 * @param isHomeBank
	 * @return PIFSeriesDao
	 */
	PIFSeriesDao findByLocationCodeAndPaymentCodeAndIsActiveAndIsHomeBank(String locationCode, String paymentCode,
			Boolean status, Boolean isHomeBank);

	/**
	 * 
	 * @param locationCode
	 * @param status
	 * @param payeeBankName
	 * @param paymentCode
	 * @return List<PIFSeriesDao>
	 */
	@Query(value = "SELECT pfs FROM PIFSeriesDao pfs WHERE pfs.locationCode = :locationCode AND pfs.isActive = :status AND pfs.bankName = :bankName AND pfs.paymentCode = :paymentCode")
	List<PIFSeriesDao> getPifSeriesData(@Param("locationCode") String locationCode, @Param("status") Boolean status,
			@Param("bankName") String payeeBankName, @Param("paymentCode") String paymentCode);

	/**
	 * 
	 * @param locationCode
	 * @param true1
	 * @param paymentCode
	 * @return PIFSeriesDao
	 */
}
