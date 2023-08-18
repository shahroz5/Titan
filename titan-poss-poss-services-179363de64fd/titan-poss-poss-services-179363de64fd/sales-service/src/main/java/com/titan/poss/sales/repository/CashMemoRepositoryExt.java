/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dto.CancellationListDto;
import com.titan.poss.sales.dto.request.CashMemoHistoryReqDto;
import com.titan.poss.sales.dto.response.CashMemoHistoryResponse;

/**
 * Handles repository operations for <b>cash_memo</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCashMemoRepositoryExt")
public interface CashMemoRepositoryExt extends JpaRepository<CashMemoDaoExt, String> {

	// @formatter:off
	@Query("SELECT cm " + " FROM com.titan.poss.sales.dao.CashMemoDaoExt cm " + " WHERE cm.id = :id "
			+ " AND cm.salesTxnDao.locationCode = :locationCode")
	// @formatter:on
	CashMemoDaoExt findOneByIdAndSalesTxnDaoLocationCode(@Param("id") String id,
			@Param("locationCode") String locationCode);

	// @formatter:off
	@Query("SELECT cm " + " FROM com.titan.poss.sales.dao.CashMemoDaoExt cm " + " WHERE cm.id = :id "
			+ " AND cm.salesTxnDao.locationCode = :locationCode " + " AND cm.salesTxnDao.txnType = :transactionType "
			+ " AND cm.salesTxnDao.subTxnType = :subTxnType")
	// @formatter:on
	CashMemoDaoExt findOneByIdAndLocationCodeAndTxnTypeAndSubTxnType(@Param("id") String id,
			@Param("locationCode") String locationCode, @Param("transactionType") String transactionType,
			@Param("subTxnType") String subTxnType);

	// @formatter:off
	@Query("SELECT st.id FROM com.titan.poss.sales.dao.SalesTxnDaoExt st \r\n"
			+ " WHERE st.locationCode = :locationCode  AND st.txnType = 'CM' AND st.subTxnType != 'GIFT_SALE' \r\n"
			+ " AND st.docDate = :docDate AND st.status = 'CONFIRMED' AND st.customerId = :customerId \r\n")
	// @formatter:on
	List<String> getAllConfirmedCmIdOfToday(@Param("locationCode") String locationCode,
			@Param("customerId") Integer customerId, @Param("docDate") Date docDate);

	// @formatter:off
	@Query("SELECT cm " 
			+ " FROM com.titan.poss.sales.dao.CashMemoDaoExt cm " 
			+ " WHERE cm.id = :id AND cm.salesTxnDao.locationCode = :locationCode AND cm.salesTxnDao.txnType = :transactionType ")
	// @formatter:on
	CashMemoDaoExt findOneByIdAndLocationCodeAndTxnType(@Param("id") String id,
			@Param("locationCode") String locationCode, @Param("transactionType") String transactionType);

	// @formatter:off
	@Query("SELECT cm " 
			+ " FROM com.titan.poss.sales.dao.CashMemoDaoExt cm " 
			+ " WHERE cm.id = :id AND cm.salesTxnDao.txnType = :transactionType ")
	// @formatter:on
	CashMemoDaoExt findOneByIdAndTxnType(@Param("id") String id, @Param("transactionType") String transactionType);

	// @formatter:off
	@Query("SELECT cm " + " FROM com.titan.poss.sales.dao.CashMemoDaoExt cm " + " WHERE cm.id = :id "
			+ " AND cm.salesTxnDao.locationCode = :locationCode " + " AND cm.salesTxnDao.txnType = :txnType "
			+ " AND cm.salesTxnDao.subTxnType IN (:subTxnTypes)")
	// @formatter:on
	CashMemoDaoExt findOneByIdAndLocationCodeAndTxnTypeAndSubTxnTypeIn(@Param("id") String id,
			@Param("locationCode") String locationCode, @Param("txnType") String txnType,
			@Param("subTxnTypes") List<String> subTxnTypes);

	// @formatter:off
	@Query("SELECT cm " + " FROM com.titan.poss.sales.dao.CashMemoDaoExt cm " + " WHERE cm.id = :id "
			+ " AND cm.salesTxnDao.locationCode = :locationCode " + " AND cm.salesTxnDao.txnType = :transactionType ")
	// @formatter:on
	CashMemoDaoExt findOneByIdAndLocationCodeAndTxnTypeAndSubTxnType(@Param("id") String id,
			@Param("locationCode") String locationCode, @Param("transactionType") String transactionType);

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.CancellationListDto(st.docNo, ct.customerName, st.confirmedTime, st.id, st.txnType, st.subTxnType, st.docDate,cm.totalValue,st.currencyCode) "
			  + " FROM SalesTxn st \r\n"
			  + " LEFT JOIN com.titan.poss.sales.dao.CashMemoDaoExt cm \r\n"
			  + "		ON st = cm \r\n"
			  + " LEFT JOIN CustomerTxn ct \r\n"
			  + "		ON st = ct \r\n"
			  + " WHERE st.locationCode = :locationCode AND st.txnType = :txnType AND st.subTxnType IN (:allowedSubTxnList) \r\n"
			  + " AND st.docDate = :docDate AND st.status = :status \r\n"
			  + " AND (:docNo IS NULL OR st.docNo = :docNo) \r\n" 
			  + " AND (:customerMobileNo IS NULL OR ct.mobileNumber = :customerMobileNo) \r\n"
			  + " AND (:customerName IS NULL OR ct.customerName = :customerName) \r\n")
	// @formatter:on
	Page<CancellationListDto> listBillCancellation(@Param("docNo") Integer docNo,
			@Param("customerName") String customerName, @Param("customerMobileNo") String customerMobileNo,
			@Param("locationCode") String locationCode, @Param("txnType") String txnType,
			@Param("allowedSubTxnList") List<String> allowedSubTxnList, @Param("status") String status,
			@Param("docDate") Date docDate, Pageable pageable);

	// @formatter:off
	@Query(nativeQuery = true, value = "\r\n SELECT st.doc_no, ct.customer_name, st.confirmed_time, st.id, st.txn_type, "
			+ " st.sub_txn_type, st.doc_date, cm.total_value, st.currency_code, cncl.status \r\n"
			+ "FROM sales_transaction st \r\n" + "INNER JOIN cash_memo cm \r\n" + "	ON (st.id=cm.id) \r\n"
			+ "INNER JOIN customer_transaction ct \r\n" + "	ON (st.id = ct.id) \r\n"
			+ "LEFT OUTER JOIN (SELECT * FROM refund_transaction WHERE status = 'CONFIRMED') cncl \r\n"
			+ "	ON (st.id = cncl.ref_sales_id) \r\n"
			+ "WHERE st.location_code = :locationCode AND st.txn_type=:txnType AND st.sub_txn_type IN (:allowedSubTxnList) "
			+ "AND st.status=:status AND cncl.status IS NULL \r\n" + "AND st.doc_date = :docDate \r\n"
			+ "AND (:docNo IS NULL OR st.doc_no = :docNo) \r\n"
			+ "AND (:customerMobileNo IS NULL OR ct.mobile_number = :customerMobileNo) \r\n"
			+ "AND (:customerName IS NULL OR ct.customer_name = :customerName) \r\n", countQuery = "\r\n "
					+ "SELECT COUNT(*) \r\n" + "FROM sales_transaction st \r\n" + "INNER JOIN cash_memo cm \r\n"
					+ "	ON (st.id=cm.id) \r\n" + "INNER JOIN customer_transaction ct \r\n" + "	ON (st.id = ct.id) \r\n"
					+ "LEFT OUTER JOIN (SELECT * FROM refund_transaction WHERE status = 'CONFIRMED') cncl \r\n"
					+ "	ON (st.id = cncl.ref_sales_id) \r\n"
					+ "WHERE st.location_code = :locationCode AND st.txn_type=:txnType AND st.sub_txn_type IN (:allowedSubTxnList) "
					+ "AND st.status=:status AND cncl.status IS NULL \r\n" + "AND st.doc_date = :docDate \r\n"
					+ "AND (:docNo IS NULL OR st.doc_no = :docNo) \r\n"
					+ "AND (:customerMobileNo IS NULL OR ct.mobile_number = :customerMobileNo) \r\n"
					+ "AND (:customerName IS NULL OR ct.customer_name = :customerName) \r\n")
	// @formatter:on
	Page<Object[]> listBillCancellationNative(@Param("docNo") Integer docNo, @Param("customerName") String customerName,
			@Param("customerMobileNo") String customerMobileNo, @Param("locationCode") String locationCode,
			@Param("txnType") String txnType, @Param("status") String status, @Param("docDate") Date docDate,
			@Param("allowedSubTxnList") List<String> allowedSubTxnList,
//			@Param("notAllowedStatus") List<String> notAllowedStatus, 
			Pageable pageable);

	// @formatter:off
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE cash_memo \r\n" + " SET paid_value = :paidValue, \r\n"
			+ " last_modified_by = :lastModifiedBy, \r\n" + " last_modified_date = :lastModifiedDate \r\n"
			+ " WHERE id IN (:idList)")
	// @formatter:on
	Integer updatePaidValidByIdIn(@Param(value = "idList") Set<String> idList,
			@Param(value = "paidValue") BigDecimal paidValue, @Param(value = "lastModifiedBy") String lastModifiedBy,
			@Param(value = "lastModifiedDate") Date lastModifiedDate);

	/**
	 *
	 * @param txnId
	 * @param locationCode
	 * @return CashMemoDaoExt
	 */
	CashMemoDaoExt findByIdAndSalesTxnDaoLocationCodeAndSalesTxnDaoStatus(String txnId, String locationCode,
			String status);

	/**
	 * @param searchType
	 * @param searchField
	 * @param fiscalYear
	 * @param docNo
	 * @param endingDate
	 * @param startingDate
	 * @param toNetAmount
	 * @param fromNetAmount
	 * @param string2
	 * @param string
	 * @param locationCode
	 **/
	@Query("SELECT new com.titan.poss.sales.dto.response.CashMemoHistoryResponse(cm.id,cm.salesTxnDao.docNo,cm.salesTxnDao.docDate,cm.salesTxnDao.fiscalYear,ctxn.customerName,cm.finalValue,cm.salesTxnDao.createdBy,cm.createdDate,cm.salesTxnDao.status,cm.totalQuantity) "
			+ "FROM com.titan.poss.sales.dao.CashMemoDaoExt cm "
			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ctxn " + "ON cm.id=ctxn.id " + "WHERE "
			+ "(:searchType IS NULL or (1=CASE "
			+ "WHEN :searchType='MOBILE_NO' AND ctxn.mobileNumber=:searchField THEN 1 "
			+ "WHEN :searchType='EMAIL_ID' AND ctxn.emailId=:searchField THEN 1 "
			+ "WHEN :searchType='PAN_NO' AND ctxn.custTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='GST_NO' AND ctxn.instiTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='ULP_ID' AND ctxn.ulpId=:searchField THEN 1  "
			+ "WHEN :searchType='CUSTOMER_NAME' AND ctxn.customerName=:searchField THEN 1 END)) "
			+ "AND (:#{#historyFilter.fromNetAmount} IS NULL or cm.finalValue>=:#{#historyFilter.fromNetAmount}) "
			+ "AND (:#{#historyFilter.toNetAmount} IS NULL or cm.finalValue<=:#{#historyFilter.toNetAmount}) "
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or cm.salesTxnDao.docDate>=:#{#historyFilter.fromDocDate}) "
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or cm.salesTxnDao.docDate<=:#{#historyFilter.toDocDate}) "
			+ "AND (:#{#historyFilter.docNo} IS NULL or cm.salesTxnDao.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or cm.salesTxnDao.fiscalYear=:#{#historyFilter.fiscalYear}) "
			+ "AND (cm.salesTxnDao.locationCode=:locationCode) "
			+ "AND (cm.salesTxnDao.status IN (:status) OR nullif(CHOOSE(1,:status),'') IS NULL) "
			+ "AND (cm.salesTxnDao.txnType=:txnType)" + "AND (cm.salesTxnDao.subTxnType=:subTxnType)")
	Page<CashMemoHistoryResponse> listCmHistory(@Param("historyFilter") CashMemoHistoryReqDto cashMemoHistoryDto,
			@Param("searchField") String searchField, @Param("searchType") String searchType,
			@Param("locationCode") String locationCode, @Param("status") List<String> status,
			@Param("subTxnType") String subTxnType, @Param("txnType") String txnType, Pageable pageable);
}
