/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.PayeeBankLocationMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PayeeBankLocationMappingRepositoryExt extends JpaRepository<PayeeBankLocationMappingDaoExt, String> {

	// @formatter:off
	@Query("SELECT plm.payeeBank.bankName " + " FROM com.titan.poss.payment.dao.PayeeBankLocationMappingDaoExt plm "
			+ " WHERE (plm.payment.paymentCode = :paymentCode OR nullif(CHOOSE(1,:paymentCode),'') IS NULL)"
			+ " AND plm.locationCode = :locationCode")
	// @formatter:on
	List<String> findByPaymentCode(@Param("paymentCode") String paymentCode,
			@Param("locationCode") String locationCode);

	/*
	 * List the mapping according to provided locations and BankName
	 */
	List<PayeeBankLocationMappingDaoExt> findByPayeeBankBankNameAndLocationCodeIn(String bankName,
			List<String> locationCodes);

	/*
	 * List the mapping according to provided locations and payment codes and
	 * IsDefault true.
	 */
	List<PayeeBankLocationMappingDaoExt> findByIsDefaultAndPaymentPaymentCodeInAndLocationCodeIn(Boolean isDefault,
			List<String> paymentCodes, List<String> locationCodes);

	/*
	 * List the mapping according to provided locations and payment codes and
	 * IsDefault true.
	 */
	List<PayeeBankLocationMappingDaoExt> findByPayeeBankBankNameAndPaymentPaymentCodeInAndLocationCodeIn(
			String bankName, List<String> paymentCodes, List<String> locationCodes);

	/**
	 *
	 * @param paymentCode
	 * @param locationCode
	 * @param isDefault
	 * @return PayeeBankLocationMappingDaoExt
	 */

	PayeeBankLocationMappingDaoExt findByPaymentPaymentCodeAndLocationCodeAndIsDefault(String paymentCode,
			String locationCode, Boolean isDefault);

	/**
	 * 
	 * @param bankName
	 * @param locationCode
	 * @param pageable
	 * @param paymentCode
	 * @return Page<PayeeBankLocationMappingDaoExt>
	 */
	@Query("SELECT plm FROM PayeeBankLocationMappingDaoExt plm WHERE plm.payeeBank.bankName = :bankName AND (plm.payment.paymentCode IN (:paymentCodes) OR nullif(CHOOSE(1,:paymentCodes),'') IS NULL) AND "
			+ "(plm.locationCode IN (:locationCode) OR nullif(CHOOSE(1, :locationCode), '') IS NULL)")
	Page<PayeeBankLocationMappingDaoExt> findByBankNameAndLocationCodeIn(@Param("bankName") String bankName,
			@Param("locationCode") List<String> locationCode, Pageable pageable,
			@Param("paymentCodes") List<String> paymentCodes);

	/**
	 * 
	 * @param bankName
	 * @param paymentCode
	 * @param addLocation
	 * @return List<PayeeBankLocationMappingDaoExt>
	 */
	List<PayeeBankLocationMappingDaoExt> findByPayeeBankBankNameAndPaymentPaymentCodeAndLocationCode(String bankName,
			String paymentCode, String addLocation);
}
