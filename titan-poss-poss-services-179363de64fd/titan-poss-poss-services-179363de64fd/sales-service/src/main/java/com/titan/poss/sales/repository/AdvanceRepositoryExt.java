/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.AdvanceDaoExt;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.AdvanceHistoryDto;
import com.titan.poss.sales.dto.response.GRFLiteDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesAdvanceRepositoryExt")
public interface AdvanceRepositoryExt extends JpaRepository<AdvanceDaoExt, String> {

	Optional<AdvanceDaoExt> findByIdAndSalesTxnLocationCode(String id, String locationCode);

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.response.GRFLiteDto(st.docNo, st.fiscalYear, cn.docNo, cn.fiscalYear) \r\n"
			+ "FROM com.titan.poss.sales.dao.SalesTxnDaoExt st \r\n"
			+ "INNER JOIN com.titan.poss.sales.dao.CreditNoteDaoExt cn \r\n"
			+ "		ON cn.salesTxn = st \r\n"
			+ "WHERE st.locationCode = :locationCode AND st.txnType = :txnType AND st.subTxnType = :subTxnType \r\n"
			+ "AND st.customerId = :customerId AND st.status = :status AND cn.status = :cnStatus\r\n"
			+ "AND cn.frozenRateDetails IS NOT NULL \r\n"
			+ "ORDER BY cn.createdDate DESC")
	// @formatter:on
	List<GRFLiteDto> getByCustomerByIdAndTxnType(@Param("customerId") Integer customerId,
			@Param("locationCode") String locationCode, @Param("txnType") String txnType,
			@Param("subTxnType") String subTxnType, @Param("status") String status, @Param("cnStatus") String cnStatus);

	/**
	 * @param searchType
	 * @param searchField
	 * @param fiscalYear
	 * @param docNo
	 * @param endingDate
	 * @param startingDate
	 * @param toNetAmount
	 * @param fromNetAmount
	 * @param string
	 * @param string2
	 * @param string
	 * @param locationCode
	 * @param subTxnType
	 **/
	@Query("SELECT new com.titan.poss.sales.dto.response.AdvanceHistoryDto(adv.salesTxn.id,adv.salesTxn.docNo,adv.salesTxn.fiscalYear, ctxn.customerName, adv.salesTxn.docDate, adv.finalValue,cn.docNo ,adv.advanceDetails ,adv.frozenRateDetails,adv.createdBy,adv.createdDate) "
			+ "FROM com.titan.poss.sales.dao.AdvanceDaoExt adv "
			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ctxn " + "ON adv.id=ctxn.id "
			+ "LEFT JOIN com.titan.poss.sales.dao.CreditNoteDaoExt cn " + "ON adv.id=cn.salesTxn.id " + "WHERE "
			+ "(:searchType IS NULL or (1=CASE "
			+ "WHEN :searchType='MOBILE_NO' AND ctxn.mobileNumber=:searchField THEN 1 "
			+ "WHEN :searchType='EMAIL_ID' AND ctxn.emailId=:searchField THEN 1 "
			+ "WHEN :searchType='PAN_NO' AND ctxn.custTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='GST_NO' AND ctxn.instiTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='ULP_ID' AND ctxn.ulpId=:searchField THEN 1 END)) "
			+ "AND (:#{#historyFilter.fromNetAmount} IS NULL or adv.finalValue>=:#{#historyFilter.fromNetAmount}) "
			+ "AND (:#{#historyFilter.toNetAmount} IS NULL or adv.finalValue<=:#{#historyFilter.toNetAmount}) "
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or adv.salesTxn.docDate>=:#{#historyFilter.fromDocDate}) "
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or adv.salesTxn.docDate<=:#{#historyFilter.toDocDate}) "
			+ "AND (:#{#historyFilter.docNo} IS NULL or adv.salesTxn.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or adv.salesTxn.fiscalYear=:#{#historyFilter.fiscalYear}) "
			+ "AND (:#{#historyFilter.refDocNo} IS NULL or cn.docNo=:#{#historyFilter.refDocNo})"
			+ "AND (adv.salesTxn.locationCode=:locationCode) " + "AND (cn.locationCode=:locationCode) " 
			+ "AND (:status IS NULL or adv.salesTxn.status=:status) "
			+ "AND (adv.salesTxn.txnType=:txnType)" + "AND (adv.salesTxn.subTxnType=:subTxnType)"
			+ "AND ((cn.id=cn.originalCn) or (cn.originalCn IS NULL))")
	Page<AdvanceHistoryDto> listAdvanceHistory(@Param("historyFilter") SalesHistoryReqDtoExt advanceHistoryDto,
			@Param("status") String status, @Param("searchType") String searchType,
			@Param("searchField") String searchField, @Param("txnType") String txnType,
			@Param("locationCode") String locationCode, @Param("subTxnType") String subTxnType, Pageable pageable);

}
