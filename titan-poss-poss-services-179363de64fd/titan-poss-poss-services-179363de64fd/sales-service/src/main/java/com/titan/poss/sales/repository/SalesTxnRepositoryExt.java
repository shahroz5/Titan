/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.response.TransactionDetailsDto;
import com.titan.poss.sales.dto.response.TransactionStatusCountDto;

/**
 * Handles repository operations for <b>Sales Txn</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface SalesTxnRepositoryExt extends JpaRepository<SalesTxnDaoExt, String> {

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.response.TransactionStatusCountDto(sTxn.txnType, sTxn.subTxnType, count(sTxn.subTxnType)) "
			+ " FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn "
			+ " WHERE sTxn.txnType IN (:txnTypes) "
			+ " AND sTxn.status = :status "
			+ " AND sTxn.locationCode = :locationCode "
			+ " AND (:subTxnType IS NULL OR sTxn.subTxnType = :subTxnType) "
			+ " GROUP BY sTxn.status, sTxn.txnType, sTxn.subTxnType")
	// @formatter:on
	List<TransactionStatusCountDto> listTransactions(@Param("txnTypes") Set<String> txnTypes,
			@Param("status") String status, @Param("locationCode") String locationCode,
			@Param("subTxnType") String subTxnType);

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.response.TransactionDetailsDto(sTxn.id, sTxn.txnType, sTxn.docNo,"
			+ " sTxn.fiscalYear, sTxn.status, sTxn.locationCode, sTxn.docDate, sTxn.customerId, cDtls.customerName,   "
			+ " sTxn.firstHoldTime, sTxn.lastHoldTime,  "
			+ " sTxn.subTxnType, cDtls.mobileNumber)"
			+ " FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn"
			+ " LEFT JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt cDtls"
			+ " ON sTxn.id = cDtls.salesTxnDao.id "
			+ " WHERE (:txnType IS NULL OR sTxn.txnType = :txnType) "
			+ " AND (:docNo IS NULL OR sTxn.docNo = :docNo) "
			+ " AND (:fiscalYear IS NULL OR sTxn.fiscalYear = :fiscalYear) "
			+ " AND (:customerName IS NULL OR cDtls.customerName = :customerName) "
			+ " AND (:mobileNumber IS NULL OR cDtls.mobileNumber = :mobileNumber) "
			+ " AND (:status IS NULL OR sTxn.status = :status) "
			+ " AND sTxn.locationCode = :locationCode "
			+ " AND (:subTxnType IS NULL OR sTxn.subTxnType = :subTxnType)")
	// @formatter:on
	Page<TransactionDetailsDto> listTxnDetails(@Param("txnType") String txnType, @Param("docNo") Integer docNo,
			@Param("fiscalYear") Short fiscalYear, @Param("customerName") String customerName,
			@Param("mobileNumber") String mobileNumber, @Param("status") String status,
			@Param("locationCode") String locationCode, @Param("subTxnType") String subTxnType, Pageable pageable);

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.response.TransactionDetailsDto(sTxn.id, sTxn.txnType, sTxn.docNo,"
			+ " sTxn.fiscalYear, sTxn.status, sTxn.locationCode, sTxn.docDate, sTxn.customerId, cDtls.customerName,   "
			+ " sTxn.firstHoldTime, sTxn.lastHoldTime,  "
			+ " sTxn.subTxnType, cDtls.mobileNumber, ge.paymentType)"
			+ " FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn"
			+ " INNER JOIN com.titan.poss.sales.dao.GoodsExchangeDaoExt ge"
			+ " ON sTxn.id = ge.id"
			+ " LEFT JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt cDtls"
			+ " ON sTxn.id = cDtls.salesTxnDao.id "
			+ " WHERE (:txnType IS NULL OR sTxn.txnType = :txnType) "
			+ " AND (:txnType IS NULL OR sTxn.txnType = :transactionType) "
			+ " AND (:docNo IS NULL OR sTxn.docNo = :docNo) "
			+ " AND (:fiscalYear IS NULL OR sTxn.fiscalYear = :fiscalYear) "
			+ " AND (:customerName IS NULL OR cDtls.customerName = :customerName) "
			+ " AND (:mobileNumber IS NULL OR cDtls.mobileNumber = :mobileNumber) "
			+ " AND (:status IS NULL OR sTxn.status = :status) "
			+ " AND sTxn.locationCode = :locationCode "
			+ " AND (:subTxnType IS NULL OR sTxn.subTxnType = :subTxnType)")
		// @formatter:on
	Page<TransactionDetailsDto> listTxnDetails(@Param("txnType") String txnType, @Param("docNo") Integer docNo,
			@Param("fiscalYear") Short fiscalYear, @Param("customerName") String customerName,
			@Param("mobileNumber") String mobileNumber, @Param("status") String status,
			@Param("locationCode") String locationCode, @Param("subTxnType") String subTxnType, Pageable pageable,
			@Param("transactionType") String transactionType);

	// @formatter:off
	@Query("SELECT sTxn "
			+ " FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn "
			+ " WHERE sTxn.id = :id "
			+ " AND (:transactionType IS NULL OR sTxn.txnType = :transactionType) "
			+ " AND sTxn.locationCode = :locationCode")
	// @formatter:on
	SalesTxnDaoExt findByIdAndLocationCodeAndTxnType(@Param("id") String id, @Param("locationCode") String locationCode,
			@Param("transactionType") String transactionType);

	/**
	 * This method will return sales txn based on manual bill id.
	 * 
	 * @param manualBillId
	 * @return boolean
	 */
	SalesTxnDaoExt findOneByManualBillId(String manualBillId);

	/**
	 * This method will return the all payment done id.
	 * 
	 * @param locationCode
	 * @param todayDate
	 * @return List<SalesTxnDaoExt>
	 */
	List<SalesTxnDaoExt> findByLocationCodeAndDocDate(String locationCode, Date todayDate);

	/**
	 * @param locationCode
	 * @param todayDate
	 * @param validTxnType
	 * @return List<SalesTxnDaoExt>
	 */
	List<SalesTxnDaoExt> findByLocationCodeAndDocDateAndTxnTypeIn(String locationCode, Date todayDate,
			List<String> validTxnType);

	/**
	 * This method will be used to get customer count.
	 * 
	 * @param confirmed
	 * @param locationCode
	 * @param businessDate
	 * @param validtxntype
	 * @return List<SalesTxnDaoExt>
	 */
	List<SalesTxnDaoExt> findByStatusAndLocationCodeAndDocDateAndTxnTypeIn(String status, String locationCode,
			Date businessDate, List<String> validtxntype);

	/**
	 * This method will check if the combination of input already exists in salesTxn
	 * table.
	 * 
	 * @param docNo
	 * @param fiscalYear
	 * @param status
	 * @param txnType
	 * @param locationCode
	 * @return boolean
	 */
	boolean existsByDocNoAndFiscalYearAndStatusAndTxnTypeAndLocationCode(Integer docNo, Short fiscalYear, String status,
			String txnType, String locationCode);

	/**
	 * 
	 * @param txnId
	 * @param locationCode
	 * @return SalesTxnDaoExt
	 */
	SalesTxnDaoExt findByIdAndLocationCode(String txnId, String locationCode);

	SalesTxnDaoExt findByIdAndLocationCodeAndStatus(String txnId, String locationCode, String status);

	/**
	 * This method will return transactions which are in 'OPEN' or 'HOLD' status.
	 * 
	 * @param locationCode
	 * @param docDate
	 * @param status
	 * @return List<SalesTxnDao>
	 */
	List<SalesTxnDaoExt> findByLocationCodeAndDocDateLessThanEqualAndStatusIn(String locationCode, Date docDate,
			List<String> status);

	/**
	 * @param status
	 * @param locationCode
	 * @param docDate
	 * @return
	 */
	@Query(nativeQuery = true, value = "SELECT COUNT (*) FROM (SELECT customer_id, location_code from sales_transaction WHERE txn_type='CM' AND status = :status and doc_date= :docDate AND location_code= :locationCode GROUP BY customer_id, location_code) txn")
	Integer getPurchasersCount(@Param("status") String status, @Param("locationCode") String locationCode,
			@Param("docDate") Date docDate);

	/**
	 * @param name
	 * @param locationCode
	 * @param addDate
	 * @return
	 */
	@Query("SELECT COUNT (*) FROM SalesTxn st WHERE st.txnType='CM' AND st.status = :status and st.docDate= :docDate AND st.locationCode= :locationCode")
	Integer getInvoiceCount(@Param("status") String status, @Param("locationCode") String locationCode,
			@Param("docDate") Date docDate);

	// @formatter:off
	@Modifying
	@Query("UPDATE com.titan.poss.sales.dao.SalesTxnDaoExt st \r\n"
			+ " SET st.discountTxnDetails = :discountTxnDetails \r\n"
			+ " WHERE st.id = :id")
	// @formatter:on
	void updateDiscountTxnDetailsById(@Param("id") String id, @Param("discountTxnDetails") String discountTxnDetails);

	/**
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return
	 */
	SalesTxnDaoExt findByIdAndTxnTypeAndSubTxnType(String id, String txnType, String subTxnType);

	@Query("SELECT sTxn" + " FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn " + " WHERE sTxn.refTxnId.id = :id "
			+ " AND sTxn.refTxnType = :txnType ")
	List<SalesTxnDaoExt> findCmHoldAB(@Param("id") String id, @Param("txnType") String txnType);

	@Query("SELECT sTxn" + " FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn " + " WHERE sTxn.refTxnId.id = :id "
			+ " AND sTxn.status in (:status)")
	List<SalesTxnDaoExt> findCmHaveOrder(@Param("id") String id, @Param("status") List<String> status);

	/**
	 * This method will get all the transactions where 'refTxnId' is used.
	 * 
	 * @param refTxnId
	 * @param locationCode
	 * @param status
	 * @return List<SalesTxnDaoExt>
	 */
	List<SalesTxnDaoExt> findAllByRefTxnIdIdAndLocationCodeAndStatusIn(String refTxnId, String locationCode,
			List<String> status);

	@Query("SELECT gExD FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn "
			+ "INNER JOIN com.titan.poss.sales.dao.GoodsExchangeDaoExt gEx ON sTxn.id=gEx.id "
			+ "INNER JOIN com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt gExD ON gEx.id=gExD.goodsExchange.id "
			+ "WHERE sTxn.status IN (:statusList) " + "AND sTxn.txnType=:txnType "
			+ "AND gExD.itemCode IN (:itemCodeList)" + "AND gExD.cashMemoDetails.id IN (:cashMemoIdList) ")
	List<GoodsExchangeDetailsDaoExt> existsByVariantCodeAndLocationCodeAndStatusAndCustomer(
			@Param("txnType") String txnType, @Param("statusList") List<String> statusList,
			@Param("itemCodeList") List<String> itemCodeList, @Param("cashMemoIdList") List<String> cashMemoIdList);

	// @formatter:off
		@Query("SELECT sTxn "
				+ " FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn "
				+ " WHERE sTxn.id = :id "
				+ " AND (:txnSource IS NULL OR sTxn.txnSource = :txnSource) "
				+ " AND sTxn.locationCode = :locationCode")
		// @formatter:on
	SalesTxnDaoExt findByIdAndLocationCodeAndSourceType(@Param("id") String id,
			@Param("locationCode") String locationCode, @Param("txnSource") String txnSource);

	@Query(nativeQuery = true, value = "SELECT * FROM sales_transaction st WHERE"
			+ " (:fiscalYear IS NULL or st.fiscal_year = :fiscalYear)"
			+ " AND (:CMNumber IS NULL or st.doc_no = :CMNumber)"
			+ " AND (:locationCode IS NULL or st.location_code = :locationCode)" + " AND (st.status = :status)"
			+ " AND (st.txn_type = :txnType)") // OR st.status = 'OPEN'
	SalesTxnDaoExt getByDocNoFiscalCodeAndLocationCode(@Param("fiscalYear") String fiscalYear,
			@Param("CMNumber") String CMNumber, @Param("locationCode") String locationCode,
			@Param("txnType") String txnType, @Param("status") String status);

}
