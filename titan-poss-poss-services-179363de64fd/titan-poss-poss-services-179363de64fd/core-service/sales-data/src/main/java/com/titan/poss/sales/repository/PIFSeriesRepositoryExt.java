/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.dao.PIFSeriesDaoExt;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PIFSeriesRepositoryExt extends JpaRepository<PIFSeriesDaoExt, String>{
	/**
	 *
	 * @param locationCode
	 * @param status
	 * @param payeeBankName
	 * @param paymentCode
	 * @return PIFSeriesDaoExt
	 */
	PIFSeriesDaoExt findByLocationCodeAndIsActiveAndBankNameAndPaymentCode(String locationCode, Boolean status,
			String payeeBankName, String paymentCode);

	/**
	 * 
	 * @param locationCode
	 * @param status
	 * @param payeeBankName
	 * @param paymentCode
	 * @param homeBank
	 * @return PIFSeriesDaoExt
	 */
	PIFSeriesDaoExt findByLocationCodeAndIsActiveAndBankNameAndPaymentCodeAndIsHomeBank(String locationCode,
			Boolean status, String payeeBankName, String paymentCode, Boolean homeBank);

	/**
	 * 
	 * @param locationCode
	 * @param paymentCode
	 * @return PIFSeriesDaoExt
	 */
	PIFSeriesDaoExt findByLocationCodeAndPaymentCodeAndIsActive(String locationCode, String paymentCode, Boolean status);

	/**
	 *
	 * @param locationCode
	 * @param paymentCode
	 * @param status
	 * @param isHomeBank
	 * @return PIFSeriesDaoExt
	 */
	PIFSeriesDaoExt findByLocationCodeAndPaymentCodeAndIsActiveAndIsHomeBank(String locationCode, String paymentCode,
			Boolean status, Boolean isHomeBank);

	/**
	 * 
	 * @param locationCode
	 * @param status
	 * @param payeeBankName
	 * @param paymentCode
	 * @return List<PIFSeriesDaoExt>
	 */
	@Query(value = "SELECT pfs FROM PIFSeriesDaoExt pfs WHERE pfs.locationCode = :locationCode AND pfs.isActive = :status AND pfs.bankName = :bankName AND pfs.paymentCode = :paymentCode")
	List<PIFSeriesDaoExt> getPifSeriesData(@Param("locationCode") String locationCode, @Param("status") Boolean status,
			@Param("bankName") String payeeBankName, @Param("paymentCode") String paymentCode);

	/**
	 * 
	 * @param locationCode
	 * @param true1
	 * @param paymentCode
	 * @return PIFSeriesDaoExt
	 */
	List<PIFSeriesDaoExt> findByLocationCodeAndIsActiveAndPaymentCode(String locationCode, Boolean true1,
			String paymentCode);
	
	PIFSeriesDaoExt findByLocationCodeAndPaymentCode(String locationCode, String paymentCode);
	PIFSeriesDaoExt findByLocationCodeAndPaymentCodeAndIsHomeBank(String locationCode, String paymentCode, Boolean status);
	PIFSeriesDaoExt findByLocationCodeAndBankNameAndPaymentCode(String locationCode,String bankName,String paymentCode);
			
}
