/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

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

import com.titan.poss.core.dto.CustomerDocumentsRequestDto;
import com.titan.poss.core.dto.InvoiceDocumentsDetailsDto;
import com.titan.poss.sales.dao.SalesTxnDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesTxnRepository")
public interface SalesTxnRepository extends JpaRepository<SalesTxnDao, String> {

	SalesTxnDao findByIdAndLocationCodeAndTxnType(String transactionId, String locationCode, String transactionType);

	SalesTxnDao findByIdAndLocationCodeAndStatus(String transactionId, String locationCode, String status);

	SalesTxnDao findByIdAndLocationCode(String transactionId, String locationCode);

	/**
	 * This method will return the all payment done id.
	 * 
	 * @param locationCode
	 * @param todayDate
	 * @return List<SalesTxnDaoExt>
	 */
	List<SalesTxnDao> findByLocationCodeAndDocDate(String locationCode, Date todayDate);

	void deleteByIdIn(List<String> salesTransactionIdList);

	@Modifying
	@Query(nativeQuery = true, value = "SELECT * FROM sales_transaction st, cash_memo cm WHERE st.id = cm.id AND st.location_code = :locationCode AND st.txn_type = :txnType AND st.status = :txnStatus AND st.id NOT IN (SELECT pm.sales_txn_id from payment_details pm WHERE pm.status in(:paymentRequestList))")
	List<SalesTxnDao> getSalesTransactionDetailsCm(@Param("txnType") String txnType,
			@Param("txnStatus") String txnStatus, @Param("paymentRequestList") List<String> paymentRequestList,
			@Param("locationCode") String locationCode);

	@Modifying
	@Query(nativeQuery = true, value = "SELECT * FROM sales_transaction st, sales_order so WHERE st.id = so.id AND st.location_code = :locationCode AND st.txn_type = :txnType AND st.status = :txnStatus AND st.id NOT IN (SELECT pm.sales_txn_id from payment_details pm WHERE pm.status in(:paymentRequestList))")
	List<SalesTxnDao> getSalesTransactionDetailsAb(@Param("txnType") String txnType,
			@Param("txnStatus") String txnStatus, @Param("paymentRequestList") List<String> paymentRequestList,
			@Param("locationCode") String locationCode);

	// @formatter:off
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE sales_transaction \r\n" + " SET status = :status, \r\n"
			+ " manual_bill_id = :manualBillId, \r\n" + " last_modified_by = :lastModifiedBy, \r\n"
			+ " last_modified_date = :lastModifiedDate \r\n" + " WHERE id IN (:idList)")
	// @formatter:on
	Integer updateTxnStatus(@Param(value = "idList") Set<String> idList, @Param(value = "status") String status,
			@Param(value = "manualBillId") String manualBillId, @Param(value = "lastModifiedBy") String lastModifiedBy,
			@Param(value = "lastModifiedDate") Date lastModifiedDate);

	/**
	 * @param asList
	 * @param name
	 * @param locationCode
	 * @return
	 */

	List<SalesTxnDao> findByTxnTypeInAndStatusAndLocationCode(List<String> asList, String name, String locationCode);

	/**
	 * @param txnId
	 * @param locationCode
	 * @param name
	 * @param string
	 * @return
	 */
	SalesTxnDao findByIdAndLocationCodeAndStatusAndSubTxnType(String txnId, String locationCode, String name,
			String string);

	@Modifying
	@Query(nativeQuery = true, value = "SELECT * FROM sales_transaction st WHERE st.txn_type = :transactionType AND st.request_type = :requestType AND st.status = :status AND st.requested_date <= :businessDate AND st.requested_date >= :previousDate AND st.location_code IN (:locationCodes)")
	List<SalesTxnDao> getApprovalDetails(@Param("transactionType") String transactionType,
			@Param("requestType") String requestType, @Param("status") String status,
			@Param("businessDate") Date businessDate, @Param("previousDate") Date previousDate,
			@Param("locationCodes") List<String> locationCodes);

	/**
	 * @param employeeID
	 * @param companyName
	 * @param fiscalYear 
	 * @return
	 */
	@Query("SELECT COUNT(*) FROM SalesTxnDao st WHERE json_value(discount_txn_details,'$.data.tataEmployeeDetails.companyName')=:companyName AND \r\n"
			+ "json_value(discount_txn_details,'$.data.tataEmployeeDetails.employeeId')=:employeeID AND fiscalYear = :fiscalYear \r\n"
			+ "AND status NOT IN ('CANCELLED','DELETED')")
	int getMaxCout(@Param("employeeID") String employeeID, @Param("companyName") String companyName, @Param("fiscalYear") Short fiscalYear);

	@Query("SELECT new com.titan.poss.core.dto.InvoiceDocumentsDetailsDto(" + " salestransaction.id,"
			+ "	salestransaction.customerId," + "	salestransaction.status,"
			+ "	documents.documentPath, salestransaction.txnType,"
			+ "	salestransaction.docNo, salestransaction.locationCode,"
			+ "	salestransaction.docDate, salestransaction.subTxnType," + "	salestransaction.fiscalYear,documents.id)"
			+ " FROM com.titan.poss.sales.dao.SalesTxnDao salestransaction"
			+ " right outer join com.titan.poss.sales.dao.CustomerDocumentsDao documents"
			+ " ON salestransaction.id = documents.txnId"
			+ " WHERE (:#{#custDocuments.docNo} IS NULL or salestransaction.docNo=:#{#custDocuments.docNo})"
			+ "	AND (:#{#custDocuments.fiscalYear} IS NULL or salestransaction.fiscalYear=:#{#custDocuments.fiscalYear})"
			+ "	AND (:#{#custDocuments.fromDocDate} IS NULL or salestransaction.docDate>=:#{#custDocuments.fromDocDate})"
			+ "	AND (:#{#custDocuments.toDocDate} IS NULL or salestransaction.docDate<=:#{#custDocuments.toDocDate})"
			+ " AND (:#{#custDocuments.locationCode} IS NULL or salestransaction.locationCode=:#{#custDocuments.locationCode})"
			+ " AND (:txnType IS NULL or salestransaction.txnType=:txnType)" + " AND (documents.isActive =:isActive)"
			+ " AND (documents.fileType = 'INVOICE_PRINT')"
			+ " AND (:subTxnType IS NULL or salestransaction.subTxnType=:subTxnType)")
	Page<InvoiceDocumentsDetailsDto> getInvoiceDocumentsDetails(@Param("txnType") String txnType,
			@Param("custDocuments") CustomerDocumentsRequestDto custDocuments, @Param("pageable") Pageable pageable,
			@Param("isActive") Boolean isActive, @Param("subTxnType") String subTxnType);

	@Query(nativeQuery = true, value = "SELECT * FROM sales_transaction st WHERE"
			+ " (:fiscalYear IS NULL or st.fiscal_year = :fiscalYear)"
			+ " AND (:CMNumber IS NULL or st.doc_no = :CMNumber)"
			+ " AND (:locationCode IS NULL or st.location_code = :locationCode)" + " AND (st.status = :status)"
			+ " AND (st.txn_type = :txnType)") // OR st.status = 'OPEN'
	SalesTxnDao getByDocNoFiscalCodeAndLocationCode(@Param("fiscalYear") String fiscalYear,
			@Param("CMNumber") String CMNumber, @Param("locationCode") String locationCode,
			@Param("txnType") String txnType, @Param("status") String status);

	@Query(nativeQuery = true, value = "SELECT * FROM sales_transaction st WHERE"
			+ " (st.status = 'CONFIRMED' OR st.status = 'OPEN')"
			+ " AND (st.manual_foc_date IS NULL or (:manualFocStartDate IS NULL or st.manual_foc_date >= :manualFocStartDate) AND (:manualFocEndDate IS NULL or st.manual_foc_date <= :manualFocEndDate))"
			+ " AND st.is_manual_foc = :isManualFoc" + " AND st.customer_id = :customerID")
	SalesTxnDao validateCustomerForManualFoc(@Param("customerID") Integer customerID,
			@Param("manualFocStartDate") Date manualFocStartDate, @Param("manualFocEndDate") Date manualFocEndDate,
			@Param("isManualFoc") Integer isManualFoc);

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE sales_transaction \r\n" + " SET created_by = :createdBy \r\n"
			 + " WHERE id = :id")
	void updateSalesTxnCreatedBy(@Param("id") String id, @Param("createdBy") String createdBy);

}
