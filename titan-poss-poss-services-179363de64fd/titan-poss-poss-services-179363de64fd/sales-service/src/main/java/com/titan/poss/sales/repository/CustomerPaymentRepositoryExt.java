/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.CashPaidDetailsDto;
import com.titan.poss.core.dto.TotalCashPaidDetailsDto;
import com.titan.poss.sales.dao.CustomerPaymentDaoExt;
import com.titan.poss.sales.dto.response.InstrumentCashAmountDto;

/**
 * Handles repository operations for <b>customer_payment</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCustomerPaymentRepository")
public interface CustomerPaymentRepositoryExt
		extends JpaRepository<CustomerPaymentDaoExt, String>, CustomCustomerPaymentRepository {

	//@formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.response.InstrumentCashAmountDto(COALESCE(SUM(cp.cashAmount),0), cp.paymentDate, COALESCE(SUM(cp.paidAmount), 0), COALESCE(SUM(cp.cashAmount),0), cp.customerIdentifier1,cp.customerType) \r\n"
			+ " FROM com.titan.poss.sales.dao.CustomerPaymentDaoExt cp \r\n"
			+ " WHERE cp.instrumentNo = :instrumentNo \r\n"
			+ " AND cp.txnType = :txnType \r\n"
			+ " GROUP BY cp.paymentDate, cp.customerIdentifier1, cp.customerType \r\n"
			+ " ORDER BY cp.paymentDate DESC")
	//@formatter:on
	List<InstrumentCashAmountDto> getByInstrumentNoAndTxnType(@Param("instrumentNo") String instrumentNo,
			@Param("txnType") String txnType);

	List<CustomerPaymentDaoExt> findAllByPaymentDetailsDaoIdIn(List<String> paymentIds);

	//@formatter:off
	@Query("SELECT new com.titan.poss.core.dto.CashPaidDetailsDto(COALESCE(SUM(cp.cashAmount),0)) \r\n"
			+ " FROM com.titan.poss.sales.dao.CustomerPaymentDaoExt cp \r\n"
			+ " WHERE cp.customerLocationMap.customerLocationMappingId.locationCode = :locationCode \r\n" 
			+ " AND cp.paymentDate = :paymentDate \r\n"
			+ " AND ((:searchType = 'MOBILE_NO' AND cp.customerIdentifier1 = :searchValue) OR (:searchType = 'ULP_ID' AND cp.customerIdentifier2 = :searchValue)) \r\n")
	//@formatter:on
	CashPaidDetailsDto getPaidAmountBySearchTypeAndsearchValueAndPaymentDateAndLocationCode(
			@Param("searchType") String searchType, @Param("searchValue") String searchValue,
			@Param("paymentDate") Date paymentDate, @Param("locationCode") String locationCode);
	
	
	
	//@formatter:off
	@Query("SELECT new com.titan.poss.core.dto.CashPaidDetailsDto(COALESCE(SUM(cp.cashAmount),0)) \r\n"
			+ " FROM com.titan.poss.sales.dao.CustomerPaymentDaoExt cp \r\n"
			+ " WHERE cp.customerLocationMap.customerLocationMappingId.locationCode = :locationCode \r\n" 
			+ " AND Month(cp.paymentDate) = Month(:paymentDate) \r\n"
			+ " AND ((:searchType = 'MOBILE_NO' AND cp.customerIdentifier1 = :searchValue) OR (:searchType = 'ULP_ID' AND cp.customerIdentifier2 = :searchValue)) \r\n")
	//@formatter:on
	CashPaidDetailsDto getPmlaPaidAmountBySearchTypeAndsearchValueAndPaymentDateAndLocationCode(
			@Param("searchType") String searchType, @Param("searchValue") String searchValue,
			@Param("paymentDate") Date paymentDate, @Param("locationCode") String locationCode);

	List<CustomerPaymentDaoExt> findAllByPaymentDetailsDaoSalesTxnDaoId(String txnId);
	
	//@formatter:off
	@Query("SELECT new com.titan.poss.core.dto.CashPaidDetailsDto(COALESCE(SUM(ABS(cp.cashAmount)),0)) \r\n"
			+ " FROM com.titan.poss.sales.dao.CustomerPaymentDaoExt cp \r\n"
			+ " WHERE cp.customerLocationMap.customerLocationMappingId.locationCode = :locationCode \r\n" 
			+ " AND cp.paymentDate = :paymentDate \r\n"
			+ " AND cp.customerLocationMap.customerLocationMappingId.customerId = :customerId \r\n"
			+ " AND cp.txnType = :txnType \r\n")
	//@formatter:on
	CashPaidDetailsDto getPaidAmountByCustIDAndPaymentDateAndLocationCode(@Param("customerId") Integer customerId, @Param("txnType") String txnType,
			@Param("paymentDate") Date paymentDate, @Param("locationCode") String locationCode);

	@Query("SELECT new com.titan.poss.core.dto.TotalCashPaidDetailsDto(COALESCE(SUM(cp.cashAmount),0), cp.customerIdentifier1) \r\n"
			+ "FROM com.titan.poss.sales.dao.CustomerPaymentDaoExt cp \r\n"
			+ "WHERE cp.customerIdentifier2 = :ulpId \r\n"
			+ "AND Month(cp.paymentDate) = Month(:convertStringToDate) \r\n"
			+ "AND YEAR(cp.paymentDate) = YEAR(:convertStringToDate) \r\n"
			+ "GROUP BY cp.customerIdentifier1 ")
	TotalCashPaidDetailsDto getPmlaOfCustomer(@Param("ulpId") String ulpId, @Param("convertStringToDate") Date convertStringToDate);
	
}
