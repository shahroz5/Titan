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

import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.payment.dao.PayeeBankDao;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDao;

/**
 * Handles repo actions for <b>payer_bank_location_mapping</b>
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("payeeBankLocationMappingRepository")
public interface PayeeBankLocationMappingRepository extends JpaRepository<PayeeBankLocationMappingDao, String> {

	// @formatter:off
	@Query("SELECT DISTINCT plm.payeeBank.bankName " + " FROM com.titan.poss.payment.dao.PayeeBankLocationMappingDao plm "
			+ " WHERE (plm.payment.paymentCode = :paymentCode OR nullif(CHOOSE(1,:paymentCode),'') IS NULL)"
			+ " AND plm.locationCode = :locationCode")
	// @formatter:on
	List<String> findByPaymentCode(@Param("paymentCode") String paymentCode,
			@Param("locationCode") String locationCode);

	// @formatter:off
	@Query("SELECT plm FROM PayeeBankLocationMappingDao plm WHERE plm.payeeBank = :payeeBank AND "
			+ "(plm.locationCode IN (:locationCode) OR nullif(CHOOSE(1, :locationCode), '') IS NULL)")
	// @formatter:on
	List<PayeeBankLocationMappingDao> findByBankNameAndLocationCodeIn(@Param("payeeBank") PayeeBankDao payeeBank,
			@Param("locationCode") List<String> locationCode);

	/*
	 * List the mapping according to provided locations and BankName
	 */
	List<PayeeBankLocationMappingDao> findByPayeeBankBankNameAndLocationCodeIn(String bankName,
			List<String> locationCodes);

	/*
	 * List the mapping according to provided locations and payment codes and
	 * IsDefault true.
	 */
	List<PayeeBankLocationMappingDao> findByIsDefaultAndPaymentPaymentCodeInAndLocationCodeIn(Boolean isDefault,
			List<String> paymentCodes, List<String> locationCodes);

	/*
	 * List the mapping according to provided locations and payment codes and
	 * IsDefault true.
	 */
	List<PayeeBankLocationMappingDao> findByPayeeBankBankNameAndPaymentPaymentCodeInAndLocationCodeIn(String bankName,
			List<String> paymentCodes, List<String> locationCodes);
	
	Page<PayeeBankLocationMappingDao> findByLocationCodeAndIsDefault(String locationCode,Boolean isDefault,Pageable pageable);
	
	@Query("SELECT plm  FROM com.titan.poss.payment.dao.PayeeBankLocationMappingDao plm "
			+ " WHERE (plm.payment.paymentCode = :paymentCode OR nullif(CHOOSE(1,:paymentCode),'') IS NULL)"
			+ " AND plm.locationCode = :locationCode AND plm.isDefault = :isDefault")
	PayeeBankLocationMappingDao findByLocationCodeAndIsDefaultAndPaymentCode(@Param("paymentCode") String paymentCode,
			@Param("locationCode") String locationCode,@Param("isDefault") Boolean isDefault);
	
	@Query(nativeQuery = true ,value = "SELECT plm.bank_name, plm.created_by, plm.created_date, pm.is_active, plm.last_modified_by, plm.last_modified_date, plm.location_code "
			+ "FROM payee_bank_location_mapping plm"
			+ " LEFT JOIN payee_bank_master pm ON plm.bank_name = pm.bank_name "
			+ " WHERE (plm.payment_code = :paymentCode OR nullif(CHOOSE(1,:paymentCode),'') IS NULL) "
			+ " AND (plm.last_modified_date IS NULL OR (plm.last_modified_date >= :#{#edcBankRequestDto.fromDocDate})) "
			+ "AND (plm.last_modified_date <= :#{#edcBankRequestDto.toDocDate}) ")
	 List<Object[]> findByPaymentCodeAndDates(@Param("paymentCode") String paymentCode,@Param("edcBankRequestDto")EdcBankRequestDto edcBankRequestDto);
	 
	@Query(nativeQuery = true ,value = "SELECT plm.bank_name, plm.created_by, plm.created_date, pm.is_active, plm.last_modified_by, plm.last_modified_date, plm.location_code "
				+ "FROM payee_bank_location_mapping plm"
				+ " LEFT JOIN payee_bank_master pm ON plm.bank_name = pm.bank_name "
				+ " WHERE (plm.payment_code = :paymentCode OR nullif(CHOOSE(1,:paymentCode),'') IS NULL)")
	List<Object[]> findByPaymentCode(@Param("paymentCode") String paymentCode);
		 
		

}