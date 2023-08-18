/*  
 * Copyright 2019. Titan Company Limited
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

import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dto.PaymentCodeAndCount;
import com.titan.poss.sales.dto.PaymentDetailsDto;

/**
 * Handles repository operations for <b>payment_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesPaymentDetailsRepositoryExt")
public interface PaymentDetailsRepositoryExt extends JpaRepository<PaymentDetailsDaoExt, String> {

	// @formatter:off
	@Query("SELECT pd \r\n" 
			+ " FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ " WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ " AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND (:paymentCode IS NULL OR pd.paymentCode = :paymentCode) \r\n"
			+ " AND (:paymentGroup IS NULL OR pd.paymentGroup = :paymentGroup) \r\n"
			+ " AND (:instrumentType IS NULL OR pd.instrumentType = :instrumentType) \r\n"
			+ " AND (nullif(CHOOSE(1,:status),'') IS NULL OR pd.status IN (:status))")
	// @formatter:on
	List<PaymentDetailsDaoExt> getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
			@Param("transactionId") String transactionId, @Param("paymentCode") String paymentCode,
			@Param("paymentGroup") String paymentGroup, @Param("instrumentType") String instrumentType,
			@Param("locationCode") String locationCode, @Param("status") List<String> status);

	// @formatter:off
	@Query("SELECT pd \r\n" 
			+ " FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ " WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ " AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND (nullif(CHOOSE(1,:status),'') IS NULL OR pd.status IN (:status)) \r\n"
			+ " AND (:isTcsPayment IS NULL OR pd.isTcsPayment = :isTcsPayment)")
	// @formatter:on
	List<PaymentDetailsDaoExt> findBySalesTxnDaoIdAndSalesTxnDaoLocationCodeAndStatusIn(
			@Param("transactionId") String transactionId, @Param("locationCode") String locationCode,
			@Param("status") List<String> status, @Param("isTcsPayment") Boolean isTcsPayment);

	// @formatter:off
	@Query("SELECT pd \r\n" 
			+ "FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ "WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ "AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ "AND (:paymentCode IS NULL OR pd.paymentCode = :paymentCode) \r\n"
			+ "AND (:paymentGroup IS NULL OR pd.paymentGroup = :paymentGroup) \r\n"
			+ "AND (:instrumentType IS NULL OR pd.instrumentType = :instrumentType) \r\n"
			+ "AND (nullif(CHOOSE(1,:status),'') IS NULL OR pd.status IN (:status))")
	// @formatter:on
	Page<PaymentDetailsDaoExt> getPaymentDetailsByTransactionIdAndPaymentCodeAndInstrumentType(
			@Param("transactionId") String transactionId, @Param("paymentCode") String paymentCode,
			@Param("paymentGroup") String paymentGroup, @Param("instrumentType") String instrumentType,
			@Param("locationCode") String locationCode, @Param("status") List<String> status, Pageable pageable);

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.PaymentCodeAndCount(pd.paymentCode, count(pd))"
			+ "FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ "WHERE pd.salesTxnDao.id = :transactionId \r\n" + "AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ "AND (nullif(CHOOSE(1,:status),'') IS NULL OR pd.status IN (:status))" + "GROUP BY pd.paymentCode")
	// @formatter:on
	List<PaymentCodeAndCount> getUnFailedPaymentModeCount(@Param("transactionId") String transactionId,
			@Param("locationCode") String locationCode, @Param("status") List<String> status);

	// @formatter:off
	@Query("SELECT COALESCE(SUM(pd.amount),0) \r\n" 
			+ "FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ "WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ "AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ "AND (nullif(CHOOSE(1,:paymentCodeList),'') IS NULL OR pd.paymentCode IN (:paymentCodeList)) \r\n"
			+ "AND ((:status IS NULL AND pd.status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'FAILED')) OR pd.status = :status)")
	// @formatter:on
	BigDecimal getPaidAmountByTransactionIdAndPaymentCode(@Param("transactionId") String transactionId,
			@Param("paymentCodeList") List<String> paymentCodeList, @Param("locationCode") String locationCode,
			@Param("status") String status);

	// @formatter:off
	@Query("SELECT pd \r\n" 
			+ "FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ "WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ "AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ "AND (nullif(CHOOSE(1,:paymentCodeList),'') IS NULL OR pd.paymentCode IN (:paymentCodeList)) \r\n"
			+ "AND ((:status IS NULL AND pd.status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'FAILED')) OR pd.status = :status)")
	// @formatter:on
	List<PaymentDetailsDaoExt> findPaidAmountByTransactionIdAndPaymentCode(@Param("transactionId") String transactionId,
			@Param("paymentCodeList") List<String> paymentCodeList, @Param("locationCode") String locationCode,
			@Param("status") String status);

	Integer countBySalesTxnDaoId(String transactionId);

	PaymentDetailsDaoExt findByIdAndSalesTxnDaoLocationCode(String id, String locationCode);

	// @formatter:off
	@Query("SELECT COALESCE(SUM(pd.amount),0) \r\n" 
			+ "FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ "WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ "AND pd.paymentCode = :paymentCode \r\n"
			+ "AND pd.instrumentNo = :instrumentNo \r\n"
			+ "AND pd.status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'FAILED')")
	// @formatter:on
	BigDecimal getPaidAmountByPaymentCodeAndInstrumentNoAndSalesTxnDaoId(@Param("paymentCode") String paymentCode,
			@Param("instrumentNo") String instrumentNo, @Param("transactionId") String transactionId);

	// @formatter:off
	@Query("SELECT pd \r\n" 
			+ "FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ "WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ "AND pd.paymentCode = :paymentCode \r\n"
			+ "AND pd.instrumentNo = :instrumentNo \r\n"
			+ "AND pd.status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'FAILED')")
	// @formatter:on
	PaymentDetailsDaoExt findByPaymentCodeAndInstrumentNoAndSalesTxnDaoId(@Param("paymentCode") String paymentCode,
			@Param("instrumentNo") String instrumentNo, @Param("transactionId") String transactionId);

	List<PaymentDetailsDaoExt> findBySalesTxnDaoId(String id);

	List<PaymentDetailsDaoExt> findBySalesTxnDaoIdAndStatus(String id, String status);

	/**
	 *
	 * @param salesTxnIdList
	 * @param validTxnType
	 * @param validPaymentCodes
	 * @return List<PaymentDetailsDao>
	 */
	List<PaymentDetailsDaoExt> findBySalesTxnDaoIdInAndSalesTxnTypeInAndPaymentCodeIn(List<String> salesTxnIdList,
			List<String> validTxnType, List<String> validPaymentCodes);

	// ((pd.paymentCode IN (:paymentCodeList) AND pd.payment_group =
	// PaymentGroupEnum.Regular) OR (pd.payment_group = PaymentGroupEnum.Wallet))
//PaymentGroupEnum pass in method
	/**
	 * 
	 * @param paymentCodeList
	 * @param transactionTypeList
	 * @param businessDate
	 * @param locationCode
	 * @param validStatus
	 * @param paymentGroups
	 * @return List<PaymentDetailsDaoExt>
	 */
	@Query("SELECT pd FROM PaymentDetailsDaoExt pd INNER JOIN com.titan.poss.sales.dao.SalesTxnDaoExt st "
			+ "	ON st.id = pd.salesTxnDao.id "
			+ "WHERE pd.paymentDate = :businessDate AND pd.status IN (:validStatus) AND pd.salesTxnType IN (:transactionTypeList) "
			+ "AND (pd.paymentCode IN (:paymentCodeList) OR pd.paymentGroup IN (:paymentGroups)) "
			+ "AND st.locationCode = :locationCode " + " AND st.status IN (:validTxnStatus) ")
	List<PaymentDetailsDaoExt> getPaymentDetailsForRevenueCalculation(@Param("locationCode") String locationCode,
			@Param("businessDate") Date businessDate, @Param("transactionTypeList") List<String> transactionTypeList,
			@Param("paymentCodeList") List<String> paymentCodeList, @Param("validStatus") List<String> validStatus,
			@Param("paymentGroups") List<String> paymentGroups, @Param("validTxnStatus") List<String> validTxnStatus);

	/**
	 * 
	 * @param paymentCodeList
	 * @param transactionTypeList
	 * @param businessDate
	 * @param locationCode
	 * @param validStatus
	 * @param paymentGroups
	 * @return List<PaymentDetailsDaoExt>
	 */
	@Query("SELECT pd FROM PaymentDetailsDaoExt pd INNER JOIN com.titan.poss.sales.dao.SalesTxnDaoExt st ON st.id = pd.salesTxnDao.id WHERE pd.reversalDate = :businessDate "
			+ "AND pd.status IN (:validStatus) AND pd.salesTxnType IN (:transactionTypeList) AND (pd.paymentCode IN (:paymentCodeList) OR pd.paymentGroup IN (:paymentGroups)) "
			+ "AND st.locationCode = :locationCode " + " AND st.status IN (:validTxnStatus)")
	List<PaymentDetailsDaoExt> getPaymentDetailsReversalForRevenueCalculation(
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate,
			@Param("transactionTypeList") List<String> transactionTypeList,
			@Param("paymentCodeList") List<String> paymentCodeList, @Param("validStatus") List<String> validStatus,
			@Param("paymentGroups") List<String> paymentGroups, @Param("validTxnStatus") List<String> validTxnStatus);

	/**
	 * 
	 * @param paymentCode
	 * @param locationCode
	 * @param businessDate
	 * @param validTxnTypes
	 * @param validStatus
	 * @param reversedStatus
	 * @return List<Object[]>
	 */
	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT ( "
			+ "                                   SELECT COALESCE( Sum(pd.amount), 0) AS amount "
			+ "									  FROM sales.dbo.payment_details pd "
			+ "                                   INNER JOIN sales.dbo.sales_transaction st "
			+ "                                   ON st.id = pd.sales_txn_id "
			+ "                                   WHERE  pd.payment_code = :paymentCode AND payment_date = :businessDate "
			+ "                                   AND pd.status IN (:validStatus) AND pd.sales_txn_type IN (:transactionTypeList) "
			+ "                                   AND st.location_code = :locationCode AND st.status IN (:validTxnStatus)"
			+ "                                ) - "
			+ "                                ( "
			+ "                                   SELECT COALESCE(Sum(pd.amount), 0) AS amount "
			+ "                                   FROM sales.dbo.payment_details pd "
			+ "                                   INNER JOIN sales.dbo.sales_transaction st "
			+ "                                   ON st.id = pd.sales_txn_id "
			+ "                                   WHERE  pd.payment_code = :paymentCode AND reversal_date = :businessDate  "
			+ "                                   AND pd.status IN (:reversedStatus) AND pd.sales_txn_type IN ( :transactionTypeList ) "
			+ "                                   AND st.location_code = :locationCode AND st.status IN (:validTxnStatus)"
			+ "                                ) - "
			+ "                                ( "
			+ "                                   SELECT COALESCE(Sum(pr.amount), 0) AS amount "
			+ "                                   FROM sales.dbo.payment_refunds pr "
			+ "                                   INNER JOIN sales.dbo.refund_transaction ct "
			+ "                                   ON ct.id = pr.cancel_txn_id "
			+ "                                   WHERE  pr.reversal_date = :businessDate AND pr.payment_code = :paymentCode "
			+ "                                   AND ct.location_code = :locationCode"
			+ "                                ) -"
			+"                                  ("
			+"									SELECT COALESCE(Sum(pr.amount), 0) AS amount "
			+ "			                                 FROM sales.dbo.payment_refunds pr "
			+ "			                                  INNER JOIN sales.dbo.credit_note ct1 "
			+ "			                                   ON ct1.id = pr.credit_note_id "
			+ "			                                  WHERE  pr.reversal_date = :businessDate AND pr.payment_code = :paymentCode "
			+ "			                                  AND ct1.location_code = :locationCode"
			+"									)-"
			+"									("
			+"									SELECT COALESCE(Sum(pr.amount), 0) AS amount "
			+ "			                                 FROM sales.dbo.payment_refunds pr "
			+ "			                                  INNER JOIN sales.dbo.sales_transaction ct2 "
			+ "			                                   ON ct2.id = pr.sales_txn_id "
			+ "			                                  WHERE  pr.reversal_date = :businessDate AND pr.payment_code = :paymentCode "
			+ "			                                  AND ct2.location_code = :locationCode"
			+"									)AS difference ")
	// @formatter:on
	List<Object[]> getAmountForCashDeposit(@Param("paymentCode") String paymentCode,
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate,
			@Param("transactionTypeList") List<String> validTxnTypes, @Param("validStatus") List<String> validStatus,
			@Param("reversedStatus") List<String> reversedStatus, @Param("validTxnStatus") List<String> validTxnStatus);

	/**
	 * 
	 * @param paymentCode
	 * @param locationCode
	 * @param businessDate
	 * @param validTxnTypes
	 * @param validStatus
	 * @param reversedStatus
	 * @return List<Object[]>
	 */
	// @formatter:off
	@Query(nativeQuery = true, value = "( SELECT ( pd1.difference - COALESCE(pd2.amount, 0) ) AS difference, pd1.bank_name AS bank_name "
			+ " FROM ( SELECT ( COALESCE (pd.amount, 0) - COALESCE(pr.amount, 0) ) AS difference, pd.bank_name AS bank_name "
			+ "		   FROM ( SELECT Sum(pdb.amount) AS amount, pdb.bank_name AS bank_name "
			+ "               FROM   sales.dbo.payment_details pdb "
			+ "               INNER JOIN sales.dbo.sales_transaction st ON st.id = pdb.sales_txn_id "
			+ "               WHERE  pdb.payment_code = :paymentCode AND pdb.payment_date = :businessDate "
			+ "               AND pdb.status IN (:validStatus) AND pdb.sales_txn_type IN (:transactionTypeList) "
			+ "               AND st.location_code = :locationCode AND st.status IN (:validTxnStatus) "
			+ "               GROUP  BY pdb.bank_name"
			+ "             ) pd "
			+ "        LEFT JOIN ( SELECT Sum(prb.amount) AS amount, prb.bank_name AS bank_name "
			+ "                    FROM   sales.dbo.payment_refunds prb "
			+ "                    INNER JOIN sales.dbo.refund_transaction ct ON ct.id = prb.cancel_txn_id "
			+ "                    WHERE  prb.payment_code = :paymentCode AND prb.reversal_date = :businessDate "
			+ "                    AND ct.location_code = :locationCode "
			+ "                    GROUP  BY prb.bank_name"
			+ "                  ) pr "
			+ "        ON pd.bank_name = pr.bank_name "
			+ "      ) pd1 "
			+ " LEFT JOIN ( SELECT Sum(pd.amount) AS amount, pd.bank_name "
			+ "             FROM sales.dbo.payment_details pd "
			+ "             INNER JOIN sales.dbo.sales_transaction st "
			+ "             ON st.id = pd.sales_txn_id "
			+ "             WHERE payment_code = :paymentCode AND pd.reversal_date = :businessDate "
			+ "             AND pd.status IN (:reversedStatus) AND pd.sales_txn_type IN (:transactionTypeList) "
			+ "             AND st.location_code = :locationCode AND st.status IN (:validTxnStatus) "
			+ "             GROUP  BY pd.bank_name"
			+ "           ) pd2 "
			+ " ON pd1.bank_name = pd2.bank_name "
			+ "    ) ")
	
	// @formatter:on
	List<Object[]> getAmountForCardDeposit(@Param("paymentCode") String paymentCode,
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate,
			@Param("transactionTypeList") List<String> validTxnTypes, @Param("validStatus") List<String> validStatus,
			@Param("reversedStatus") List<String> reversedStatus, @Param("validTxnStatus") List<String> validTxnStatus);

	/**
	 * 
	 * @param paymentCode
	 * @param locationCode
	 * @param businessDate
	 * @param validTxnTypes
	 * @param validStatus
	 * @param reversedStatus
	 * @return List<Object[]>
	 */
	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT (pd3.difference - COALESCE(pd4.amount,0)) AS difference,pd3.instrument_no AS instrument_no, "
			+ " pd3.bank_name AS bank_name, pd3.payment_code AS payment_code "
			+ " FROM ( "
			+ " SELECT ( pd1.difference - COALESCE(pd2.amount, 0) ) AS difference, pd1.instrument_no AS instrument_no, "
			+ " pd1.bank_name AS bank_name, pd1.payment_code AS payment_code "
			+ " FROM ( SELECT (COALESCE (pd.amount, 0) - COALESCE(pr.amount, 0)) AS difference, pd.instrument_no AS instrument_no, pd.bank_name AS bank_name, "
			+ "		   pd.payment_code AS payment_code "
			+ "		   FROM  ( SELECT Sum(pdb.amount) AS amount, pdb.instrument_no AS instrument_no, pdb.bank_name AS bank_name, pdb.payment_code AS payment_code "
			+ "                 FROM sales.dbo.payment_details pdb "
			+ "                 INNER JOIN sales.dbo.sales_transaction st "
			+ "                 ON st.id = pdb.sales_txn_id "
			+ "                 WHERE pdb.payment_code IN (:paymentCodeList) AND pdb.payment_date = :businessDate "
			+ "                 AND pdb.status IN (:validStatus) AND pdb.sales_txn_type IN (:transactionTypeList) "
			+ "					AND st.location_code = :locationCode AND st.status IN (:validTxnStatus) "
			+ "                 GROUP  BY pdb.instrument_no, pdb.bank_name, pdb.payment_code "
			+ "              ) pd "
			+ "        LEFT JOIN ( SELECT Sum(prb.amount) AS amount, prb.instrument_no   AS instrument_no, prb.bank_name AS bank_name, "
			+ "                    prb.payment_code AS payment_code "
			+ "                    FROM   sales.dbo.payment_refunds prb "
			+ "                    INNER JOIN sales.dbo.refund_transaction ct "
			+ "                    ON ct.id = prb.cancel_txn_id "
			+ "                    WHERE  prb.payment_code IN (:paymentCodeList) AND prb.reversal_date = :businessDate "
			+ "                    AND ct.location_code = :locationCode "
			+ "                    GROUP  BY prb.instrument_no, prb.bank_name, prb.payment_code"
			+ "                   ) pr "
			+ "        ON pd.instrument_no = pr.instrument_no AND pd.bank_name = pr.bank_name "
			+ "        AND pd.payment_code = pr.payment_code "
			+ "      ) pd1 "
			+ " LEFT JOIN ( SELECT Sum(pd.amount) AS amount, pd.instrument_no, pd.bank_name, pd.payment_code "
			+ "             FROM sales.dbo.payment_details pd "
			+ "             INNER JOIN sales.dbo.sales_transaction st "
			+ "             ON st.id = pd.sales_txn_id "
			+ "             WHERE  pd.payment_code IN (:paymentCodeList) AND pd.reversal_date = :businessDate "
			+ "             AND pd.status IN (:reversedStatus) AND pd.sales_txn_type IN (:transactionTypeList) "
			+ "             AND st.location_code = :locationCode AND st.status IN (:validTxnStatus) "
			+ "             GROUP  BY pd.instrument_no,  pd.bank_name, pd.payment_code"
			+ "           ) pd2 "
			+ " ON pd1.instrument_no = pd2.instrument_no AND pd1.bank_name = pd2.bank_name "
			+ " AND pd1.payment_code = pd2.payment_code " 
			+" ) pd3 "
			+"  LEFT JOIN ( SELECT Sum(prb1.amount) AS amount, prb1.instrument_no   AS instrument_no, prb1.bank_name AS bank_name, "
			+ "                    prb1.payment_code AS payment_code "
			+ "                    FROM   sales.dbo.payment_refunds prb1 "
			+ "                    INNER JOIN sales.dbo.credit_note ct1 "
			+ "                    ON ct1.id = prb1.credit_note_id "
			+ "                    WHERE  prb1.payment_code IN (:paymentCodeList) AND prb1.reversal_date = :businessDate "
			+ "                    AND ct1.location_code = :locationCode "
			+ "                    GROUP  BY prb1.instrument_no, prb1.bank_name, prb1.payment_code"
			+ "                   ) pd4 "
			+ " ON pd3.instrument_no = pd4.instrument_no AND pd3.bank_name = pd4.bank_name "
			+ " AND pd3.payment_code = pd4.payment_code ")
	// @formatter:on
	List<Object[]> getAmountForChequeDDDeposit(@Param("paymentCodeList") List<String> paymentCode,
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate,
			@Param("transactionTypeList") List<String> validTxnTypes, @Param("validStatus") List<String> validStatus,
			@Param("reversedStatus") List<String> reversedStatus, @Param("validTxnStatus") List<String> validTxnStatus);

	/**
	 * This query will give total number of third party Cns added to the current
	 * transaction.
	 * 
	 * @param paymentCode
	 * @param transactionId
	 * @param customerId
	 * @param statusList
	 * @return Integer
	 */
	// @formatter:off
	@Query("SELECT COUNT(pd.id) \r\n" + " FROM PaymentDetailsDaoExt pd \r\n" + " LEFT JOIN CreditNoteDaoExt cn \r\n"
			+ " ON pd.creditNoteDao.id = cn.id \r\n" + " WHERE pd.paymentCode = :paymentCode \r\n"
			+ " AND pd.salesTxnDao.id = :transactionId \r\n" + " AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND pd.status IN (:statusList) ")
	// @formatter:on
	Integer getTotalNumberOfCNAddedForCurrentTxnWhereCustomerIdIsDifferent(@Param("paymentCode") String paymentCode,
			@Param("transactionId") String transactionId, 
			@Param("statusList") List<String> statusList, @Param("locationCode") String locationCode);

	/**
	 * This method will get all CN payments added in current transaction.
	 * L̥
	 * @param paymentCode
	 * @param transactionId
	 * @param statusList
	 * @return List<PaymentDetailsDaoExt>
	 */
	// @formatter:off
	@Query("SELECT pd FROM PaymentDetailsDaoExt pd \r\n" + " WHERE pd.paymentCode = :paymentCode \r\n"
			+ " AND pd.salesTxnDao.id = :transactionId \r\n" + " AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND pd.status IN (:statusList)")
	// @formatter:on
	List<PaymentDetailsDaoExt> getAllPaymentCodePayments(@Param("paymentCode") String paymentCode,
			@Param("transactionId") String transactionId, @Param("statusList") List<String> statusList,
			@Param("locationCode") String locationCode);

	/**
	 * This method will get the list of payments based on txn ids and status -
	 * ['OPEN', 'IN_PROGRESS', 'COMPLETED' and 'FAILED']
	 * 
	 * @param salesTxnIdList
	 * @param status
	 * @return List<PaymentDetailsDaoExt>
	 */
	List<PaymentDetailsDaoExt> findBySalesTxnDaoIdInAndStatusIn(Set<String> salesTxnIdList, List<String> status);

	/**
	 * This Method will Update all payments Editable flag to false on Confirm or
	 * Freeze of order
	 * 
	 * @param isEditable
	 * @param salesTxnId
	 * @return
	 */
	@Modifying
	@Query("UPDATE PaymentDetailsDaoExt SET isEditable = :isEditable WHERE salesTxnDao.id = :salesTxnId")
	Integer updatePaymentsEditableFlag(@Param("isEditable") Boolean isEditable, @Param("salesTxnId") String salesTxnId);

	/**
	 * This method will get the valid payments that exist.
	 * 
	 * @param idList
	 * @param locationCode
	 * @param status
	 * @return List<PaymentDetailsDaoExt>
	 */
	List<PaymentDetailsDaoExt> findByIdInAndSalesTxnDaoLocationCodeAndStatus(Set<String> idList, String locationCode,
			String status);

	/**
	 * This method will get the cash collected for the transaction.
	 * 
	 * @param transactionId
	 * @param paymentCodeList
	 * @param locationCode
	 * @param status
	 * @return BigDecimal
	 */
	// @formatter:off
	@Query("SELECT COALESCE(SUM(pd.cashCollected),0) \r\n" 
			+ " FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ " WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ " AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND pd.cashCollected IS NOT NULL \r\n"
			+ " AND (nullif(CHOOSE(1,:paymentCodeList),'') IS NULL OR pd.paymentCode IN (:paymentCodeList)) \r\n"
			+ " AND ((:status IS NULL AND pd.status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'FAILED')) OR pd.status = :status)")
	// @formatter:on
	BigDecimal getCashCollectedByTransactionIdAndPaymentCode(@Param("transactionId") String transactionId,
			@Param("paymentCodeList") List<String> paymentCodeList, @Param("locationCode") String locationCode,
			@Param("status") String status);
	
	@Query("SELECT pd \r\n" 
			+ " FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ " WHERE pd.salesTxnDao.id = :transactionId \r\n" 
			+ " AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND pd.cashCollected IS NOT NULL \r\n"
			+ " AND (nullif(CHOOSE(1,:paymentCodeList),'') IS NULL OR pd.paymentCode IN (:paymentCodeList)) \r\n"
			+ " AND ((:status IS NULL AND pd.status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'FAILED')) OR pd.status = :status)")
	// @formatter:on
	List<PaymentDetailsDaoExt> getCashCollectedByTransactionIdAndPaymentCodes(@Param("transactionId") String transactionId,
			@Param("paymentCodeList") List<String> paymentCodeList, @Param("locationCode") String locationCode,
			@Param("status") String status);


	/**
	 * JPA method to Query particular type of payment present in a transaction
	 * 
	 * @param id
	 * @param name
	 * @param of
	 * @return
	 */
	Long countBySalesTxnDaoIdAndPaymentCodeAndStatusIn(String transactionId, String paymentCode,
			Set<String> statusList);

	/**
	 * @param id
	 * @param paymentCode
	 * @return List<PaymentDetailsDaoExt>
	 */
	List<PaymentDetailsDaoExt> findBySalesTxnDaoIdAndPaymentCode(String id, String paymentCode);
	
	
	List<PaymentDetailsDaoExt> findBySalesTxnDaoIdAndPaymentCodeAndStatus(String id, String paymentCode,String status);
	/**
	 * This method is used to check if any payments are related to given payment
	 * id(in reference 3).
	 * 
	 * @param id
	 * @param reference3
	 * @return List<PaymentDetailsDaoExt>
	 */
	List<PaymentDetailsDaoExt> findBySalesTxnDaoIdAndReference3(String id, String reference3);

	/**
	 * This method is used to check if any order payments are pending for CN
	 * conversion
	 * 
	 * @param id
	 * @param creditNoteId
	 * @return List<PaymentDetailsDaoExt>
	 */
	List<PaymentDetailsDaoExt> findBySalesTxnDaoIdAndCreditNoteDaoIdAndStatus(String id, String creditNoteId,
			String status);

	/**
	 * This method is used to check if any order payments are pending for CN
	 * conversion
	 * 
	 * @param id
	 * @param creditNoteId
	 * @return List<PaymentDetailsDaoExt>
	 */
	List<PaymentDetailsDaoExt> findBySalesTxnDaoCustomerId(String customerId);

	/**
	 * @param id
	 * @return
	 */
	List<PaymentDetailsDaoExt> findAllBySalesTxnDaoId(String id);

	/**
	 * This method will get all pending payments.
	 * 
	 * @param locationCode
	 * @param businessDate
	 * @param txntypes
	 * @param status
	 * @return List<PaymentDetailsDaoExt>
	 */
	// @formatter:off
	@Query("SELECT pd \r\n" 
			+ " FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd \r\n"
			+ " WHERE pd.salesTxnDao.txnType IN (:txntypes) \r\n" 
			+ " AND pd.salesTxnDao.locationCode = :locationCode \r\n"
			+ " AND pd.salesTxnDao.docDate <= :businessDate \r\n"
			+ " AND pd.salesTxnDao.status = :status \r\n"
			+ " AND pd.isEditable = :isEditable")
	// @formatter:on
	List<PaymentDetailsDaoExt> findAllPendingPayment(@Param("locationCode") String locationCode,
			@Param("businessDate") Date businessDate, @Param("txntypes") List<String> txntypes,
			@Param("status") String status, @Param("isEditable") Boolean isEditable);

	/**
	 * This method will check if a payment(CN) is added in any transaction.
	 * 
	 * @param paymentCode
	 * @param locationCode
	 * @param status
	 * @param reference3
	 * @return List<PaymentDetailsDaoExt>
	 */
	List<PaymentDetailsDaoExt> findByPaymentCodeAndSalesTxnDaoLocationCodeAndStatusAndReference3(String paymentCode,
			String locationCode, String status, String reference3);

	/**
	 * This method will get the count of payment utilized based on input parameters.
	 * 
	 * @param paymentCode
	 * @param instrumentHash -- hashed card no
	 * @param offerId        -- cashback id (reference1)
	 * @return Integer
	 */
	// @formatter:off
	@Query(nativeQuery = true, value ="SELECT "
											+ " ( " 
											+ " SELECT COALESCE(COUNT(p.id),0) " 
											+ " FROM payment_details p INNER JOIN sales_transaction s "
											+ " ON p.sales_txn_id = s.id " 
											+ " WHERE p.payment_code = :paymentCode "
											+ " AND p.reference_1 = :offerId "
											+ " AND p.instrument_hash = :instrumentHash " 
											+ " AND p.status  = 'COMPLETED' " 
											+ " AND s.status NOT IN ('OPEN', 'DELETED', 'HOLD', 'REJECTED', 'EXPIRED', 'APPROVAL_PENDING') "
											+ " ) \r\n" 
											+ " - " 
											+ " ( "
											+ " SELECT COALESCE(COUNT(pr.id),0) " 
											+ " FROM payment_refunds pr INNER JOIN refund_transaction rt " 
											+ " ON pr.cancel_txn_id = rt.id " 
											+ " WHERE pr.payment_code = :paymentCode "
											+ " AND pr.reference_1 = :offerId "
											+ " AND pr.instrument_hash = :instrumentHash " 
											+ " AND rt.status IN ('CONFIRMED', 'PENDING') " 
											+ " ) ")
	// @formatter:on
	Integer countOfOfferUtilized(@Param("paymentCode") String paymentCode,
			@Param("instrumentHash") String instrumentHash, @Param("offerId") String offerId);
	
	
	
	/**
	 * 
	 * @param paymentCode
	 * @param locationCode
	 * @param businessDate
	 * @param validTxnTypes
	 * @param validStatus
	 * @param reversedStatus
	 * @return List<Object[]>
	 */
	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT "
			+ " (COALESCE(pd7.difference,0)-pd6.difference) as difference, "
			+ "	 pd6.bank_name as bank_name"
			+ "	 FROM ("  
			+ "  SELECT Sum(prb1.amount) AS difference, prb1.bank_name AS bank_name"
			+ "	 FROM   sales.dbo.payment_refunds prb1 "
			+ "	 INNER JOIN sales.dbo.credit_note ct1 ON ct1.id = prb1.credit_note_id"
			+ "	 WHERE   prb1.payment_code = :paymentCode AND prb1.reversal_date = :businessDate "
			+ "  AND prb1.reversal_date = ct1.doc_date"
			+ "	 AND ct1.location_code = :locationCode "
			+ "	 GROUP  BY prb1.bank_name) pd6"
			+ "  LEFT JOIN "
			+ " ( SELECT ( pd1.difference - COALESCE(pd2.amount, 0) ) AS difference, pd1.bank_name AS bank_name "
			+ " FROM ( SELECT ( COALESCE (pd.amount, 0) - COALESCE(pr.amount, 0) ) AS difference, pd.bank_name AS bank_name"
			+ "		   FROM ( SELECT Sum(pdb.amount) AS amount, pdb.bank_name AS bank_name"
			+ "               FROM   sales.dbo.payment_details pdb "
			+ "               INNER JOIN sales.dbo.sales_transaction st ON st.id = pdb.sales_txn_id "
			+ "               WHERE  pdb.payment_code = :paymentCode AND pdb.payment_date = :businessDate "
			+ "               AND pdb.status IN (:validStatus) AND pdb.sales_txn_type IN (:transactionTypeList) "
			+ "               AND st.location_code = :locationCode AND st.status IN (:validTxnStatus) "
			+ "               GROUP  BY pdb.bank_name"
			+ "             ) pd "
			+ "        LEFT JOIN ( SELECT Sum(prb.amount) AS amount, prb.bank_name AS bank_name "
			+ "                    FROM   sales.dbo.payment_refunds prb "
			+ "                    INNER JOIN sales.dbo.refund_transaction ct ON ct.id = prb.cancel_txn_id "
			+ "                    WHERE  prb.payment_code = :paymentCode AND prb.reversal_date = :businessDate "
			+ "                    AND ct.location_code = :locationCode "
			+ "                    GROUP  BY prb.bank_name"
			+ "                  ) pr "
			+ "        ON pd.bank_name = pr.bank_name"
			+ "      ) pd1 "
			+ " LEFT JOIN ( SELECT Sum(pd.amount) AS amount, pd.bank_name"
			+ "             FROM sales.dbo.payment_details pd "
			+ "             INNER JOIN sales.dbo.sales_transaction st "
			+ "             ON st.id = pd.sales_txn_id "
			+ "             WHERE payment_code = :paymentCode AND pd.reversal_date = :businessDate "
			+ "             AND pd.status IN (:reversedStatus) AND pd.sales_txn_type IN (:transactionTypeList) "
			+ "             AND st.location_code = :locationCode AND st.status IN (:validTxnStatus) "
			+ "             GROUP  BY pd.bank_name"
			+ "           ) pd2 "
			+ " ON pd1.bank_name = pd2.bank_name "
			+ "    )pd7"
			+ " ON pd6.bank_name= pd7.bank_name "
			+ "  ")
	
	// @formatter:on
	List<Object[]> getAmountForCardDepositExcept(@Param("paymentCode") String paymentCode,
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate,
			@Param("transactionTypeList") List<String> validTxnTypes, @Param("validStatus") List<String> validStatus,
			@Param("reversedStatus") List<String> reversedStatus, @Param("validTxnStatus") List<String> validTxnStatus);
	
	
	// @formatter:off
		@Query("SELECT new com.titan.poss.sales.dto.PaymentDetailsDto(sum(pd.amount),pd.paymentCode,pd.instrumentNo) " 
				+ "FROM com.titan.poss.sales.dao.PaymentDetailsDaoExt pd "
				+ "WHERE pd.salesTxnDao.id = :transactionId" 
				+ " group by pd.paymentCode,pd.instrumentNo")
		// @formatter:on
		List<PaymentDetailsDto> getGroupPaymentDetailsByTransactionId(
				@Param("transactionId") String transactionId);

	List<PaymentDetailsDaoExt> findAllBySalesTxnDaoIdAndIdInAndStatus(String transactionId, Set<String> paymentIds,
			String validStatus);

	PaymentDetailsDaoExt findByCreditNoteDaoId(String creditNoteId);
}
