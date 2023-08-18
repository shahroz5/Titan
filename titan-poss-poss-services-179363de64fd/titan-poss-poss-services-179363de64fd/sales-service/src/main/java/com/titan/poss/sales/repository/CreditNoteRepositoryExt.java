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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.CNResponseDto;

/**
 * Repository for CreditNoteDaoExt.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesCreditNoteRepositoryExt")
public interface CreditNoteRepositoryExt extends JpaRepository<CreditNoteDaoExt, String> {

	List<CreditNoteDaoExt> findByIdIn(List<String> id);

	@Query("Select c from CreditNoteDaoExt c where c.salesTxn.id=:salesTxnId")
	List<CreditNoteDaoExt> findByLinkedTxn(@Param("salesTxnId") String salesTxnId);

	/**
	 * @param id
	 * @param locationCode
	 * @return
	 */
	CreditNoteDaoExt findByIdAndLocationCode(String id, String locationCode);

	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT cn.doc_no as cnno, cn.fiscal_year as fiscalYear, cm.customer_name as customerName, "
			+ " cn.location_code as locationCode, cn.credit_note_type as creditNoteType, cn.doc_date as docDate, cn.amount as cnAmount, cn.status as cnStatus, "
			+ " linkedTxn.txn_type as linkedTxnType, cm.mobile_number as mobileNo, cn.id as id, cn.linked_txn_id linkedTxnId, cn.customer_id as customerId, "
			+ " cn.workflow_status as workflowStatus, cn.cash_collected, cn.discount_details, cn.frozen_rate_details, cn.eghs_details, cn.gep_config_details_id,"
			+ " cn.utilised_amount, cn.parent_cn_id,cn.is_unipay "
			+ "FROM credit_note AS cn " + "LEFT OUTER JOIN " + "sales_transaction AS stxn "
			+ "ON cn.sales_txn_id = stxn.id " + "INNER JOIN " + "customer_location_mapping AS clm "
			+ "ON cn.customer_id = clm.customer_id AND cn.location_code=clm.location_code " + "INNER JOIN "
			+ "customer_master cm " + "ON clm.customer_master_id=cm.id " + "LEFT OUTER JOIN "
			+ "sales_transaction as linkedTxn " + "on cn.linked_txn_id = linkedTxn.id "
			+ "where (((cn.doc_no= :docNumber OR :docNumber IS NULL) AND "
			+ "(cn.fiscal_year= :fiscalYear OR :fiscalYear IS NULL)) AND "
			+ "(cn.location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(cn.linked_txn_id= :linkedTxnId OR :linkedTxnId IS NULL) AND "
			+ "(cn.customer_id= :customerId OR :customerId IS NULL) AND "
			+ "(cm.mobile_number= :mobileNumber OR :mobileNumber IS NULL) AND "
			+ "(:isUnipay IS NULL OR cn.is_unipay= :isUnipay) AND "
			+ "(:cnType IS NULL OR cn.credit_note_type = :cnType) AND "
			+ "(nullif(CHOOSE(1,:idList),'') IS NULL OR cn.id IN (:idList)) AND "
			+ "(cn.doc_date IS NULL OR (:fromDate IS NULL OR cn.doc_date>= CAST(:fromDate as date)) AND (:toDate IS NULL OR cn.doc_date<= CAST(:toDate as date))) AND "
			+ "(:transactionId IS NULL OR cn.sales_txn_id = :transactionId) AND" + "(  :isFrozenRateCnRequired IS NULL "
			+ " OR (:isFrozenRateCnRequired = 1 AND (cn.frozen_rate_details IS NOT NULL AND frozen_rate_details != '' AND frozen_rate_details != '{}')) "
			+ " OR (:isFrozenRateCnRequired = 0 AND (cn.frozen_rate_details IS NULL OR frozen_rate_details = '' OR frozen_rate_details = '{}')) "
			+ ") AND "
			+ "(cn.status in (:statusList) OR nullif(CHOOSE(1,:statusList),'') IS NULL)) ORDER BY cn.doc_date DESC, cn.doc_no DESC OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")
	// @formatter:on
	List<Object[]> listAllCreditNotes(@Param("docNumber") Integer docNumber, @Param("fiscalYear") Short fiscalYear,
			@Param("mobileNumber") String mobileNumber, @Param("locationCode") String locationCode,
			@Param("isUnipay") Boolean isUnipay, 
			@Param("cnType") String cnType, @Param("linkedTxnId") String linkedTxnId,
			@Param("customerId") Integer customerId, @Param("statusList") List<String> statusList,
			@Param("idList") Set<String> idList, @Param("transactionId") String transactionId,
			@Param("isFrozenRateCnRequired") Boolean isFrozenRateCnRequired, 
			@Param("fromDate") Date fromDate , @Param("toDate") Date toDate, @Param("offset") int offset,
			@Param("size") int size);

	List<CreditNoteDaoExt> findBySalesTxnId(String id);

	List<CreditNoteDaoExt> findAllByMergedCN(CreditNoteDaoExt creditNote);

	/**
	 * @param id
	 * @return List<CreditNoteDaoExt>
	 */
	List<CreditNoteDaoExt> findByCancelTxnId(String id);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param mobileNo
	 * @param locationCode
	 * @param linkedTxnId
	 * @param customerId
	 * @param toDate 
	 * @param string
	 * @return
	 */
	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT count(*) FROM (SELECT cn.doc_no as cnno, cn.fiscal_year as fiscalYear, cm.customer_name as customerName, cn.location_code as locationCode, cn.credit_note_type as creditNoteType, cn.doc_date as docDate, cn.amount as cnAmount, cn.status as cnStatus, linkedTxn.txn_type as linkedTxnType, cm.mobile_number as mobileNo, cn.id as id, cn.linked_txn_id linkedTxnId "
			+ "FROM credit_note AS cn " + "LEFT OUTER JOIN " + "sales_transaction AS stxn " + "ON cn.sales_txn_id = stxn.id "
			+ "INNER JOIN " + "customer_location_mapping AS clm "
			+ "ON cn.customer_id = clm.customer_id AND cn.location_code=clm.location_code " + "INNER JOIN "
			+ "customer_master cm " + "ON clm.customer_master_id=cm.id " + "LEFT OUTER JOIN "
			+ "sales_transaction as linkedTxn " + "on cn.linked_txn_id = linkedTxn.id "
			+ "where (((cn.doc_no= :docNumber OR :docNumber IS NULL) AND "
			+ "(cn.fiscal_year= :fiscalYear OR :fiscalYear IS NULL)) AND "
			+ "(cn.location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(cn.linked_txn_id= :linkedTxnId OR :linkedTxnId IS NULL) AND "
			+ "(cn.customer_id= :customerId OR :customerId IS NULL) AND "
			+ "(cm.mobile_number= :mobileNumber OR :mobileNumber IS NULL) AND "
			+ "(:isUnipay IS NULL OR cn.is_unipay= :isUnipay) AND "
			+ "(:cnType IS NULL OR cn.credit_note_type = :cnType) AND "
			+ "(cn.doc_date IS NULL OR (:fromDate IS NULL OR cn.doc_date>= CAST(:fromDate as date)) AND (:toDate IS NULL OR cn.doc_date<= CAST(:toDate as date))) AND "
			+ "(:transactionId IS NULL OR cn.sales_txn_id = :transactionId) AND" + "(  :isFrozenRateCnRequired IS NULL "
			+ " OR (:isFrozenRateCnRequired = 1 AND (cn.frozen_rate_details IS NOT NULL AND frozen_rate_details != '' AND frozen_rate_details != '{}')) "
			+ " OR (:isFrozenRateCnRequired = 0 AND (cn.frozen_rate_details IS NULL OR frozen_rate_details = '' OR frozen_rate_details = '{}')) "
			+ ") AND " + "(cn.status in (:statusList) OR nullif(CHOOSE(1,:statusList),'') IS NULL)))as result")
	// @formatter:on
	Integer countCNList(@Param("docNumber") Integer docNumber, @Param("fiscalYear") Short fiscalYear,
			@Param("mobileNumber") String mobileNumber, @Param("locationCode") String locationCode,
			@Param("isUnipay") Boolean isUnipay,
			@Param("cnType") String cnType, @Param("linkedTxnId") String linkedTxnId,
			@Param("customerId") Integer customerId, @Param("statusList") List<String> statusList,
			@Param("transactionId") String transactionId,
			@Param("isFrozenRateCnRequired") Boolean isFrozenRateCnRequired, 
			@Param("fromDate") Date fromDate , @Param("toDate") Date toDate);

	List<CreditNoteDaoExt> findByStatusAndLocationCode(String status, String locationCode);

	@Query("Select c from CreditNoteDaoExt c where c.status = :status AND c.workflowStatus = :workFlowProcessStatus AND c.cnTransferId IS NOT NULL AND c.locationCode = :locationCode")
	List<CreditNoteDaoExt> getTransferedCreditNoteDetails(@Param("status") String status,
			@Param("workFlowProcessStatus") String workFlowProcessStatus, @Param("locationCode") String locationCode);

	/**
	 * @param ids
	 * @param locationCode
	 * @return
	 */
	@Query("Select c from CreditNoteDaoExt c where c.id in (:ids) AND c.locationCode = :locationCode")
	List<CreditNoteDaoExt> findByIdInAndLocationCode(@Param("ids") List<String> ids,
			@Param("locationCode") String locationCode);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param locationCode
	 * @return
	 */

	// @formatter:off
	@Query(nativeQuery = true, value = "\r\n"
			+ "SELECT cn.id as id, cn.doc_no as docNo, cn.fiscal_year as fiscalYear, cm.customer_name as customerName ,cn.customer_id as customerId, stxn.location_code as locationCode, cn.credit_note_type as creditNoteType, cn.doc_date as docDate, cn.amount as amount, cn.status as status, stxn.txn_type as linkedTxnType, cm.mobile_number as mobileNo, "
			+ " cn.linked_txn_id as linkedTxnId, cn.workflow_status as workflowStatus, cn.frozen_rate_details as frozenRates, cn.utilised_amount as utilisedAmount, cn.cash_collected, cn.merged_cn_id as mergedCnId"
			+ " FROM credit_note AS cn " + " INNER JOIN sales_transaction AS stxn \r\n"
			+ "		ON cn.sales_txn_id = stxn.id " + " INNER JOIN customer_location_mapping AS clm \r\n"
			+ "		ON cn.customer_id = clm.customer_id AND cn.location_code=clm.location_code "
			+ " INNER JOIN customer_master cm \r\n" + "		ON clm.customer_master_id=cm.id "
			+ " INNER JOIN advance_payment AS ap \r\n" + "		ON stxn.id=ap.id "
			+ " where stxn.location_code= :locationCode \r\n" + " AND cn.doc_no= :docNo AND \r\n"
			+ " cn.fiscal_year= :fiscalYear AND \r\n" + " cn.frozen_rate_details IS NOT NULL")
	// @formatter:on
	List<Object[]> getGrfCN(@Param("docNo") Integer docNo, @Param("fiscalYear") Short fiscalYear,
			@Param("locationCode") String locationCode);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param locationCode
	 * @return
	 */
	CreditNoteDaoExt findByDocNoAndFiscalYearAndLocationCode(Integer docNo, Short fiscalYear, String locationCode);

	@Query("SELECT new com.titan.poss.sales.dto.response.CNResponseDto(cn.id,cn.docNo,cn.fiscalYear,cus.customerName,cn.customerId,cn.locationCode,cn.creditNoteType,cn.docDate,cn.amount,cn.status,cus.mobileNumber,cn.linkedTxn.id,cn.workflowStatus,cn.frozenRateDetails,cn.utilisedAmount,cn.mergedCN.id, cn.cancelDate) "
			+ "FROM com.titan.poss.sales.dao.CreditNoteDaoExt cn "
			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt cus ON cus.id=cn.salesTxn.id "
			+ "LEFT JOIN com.titan.poss.sales.dao.CreditNoteDaoExt cnparent ON cnparent.id=cn.parentCn.id " + "WHERE "
			+ "(:searchType IS NULL or (1=CASE "
			+ "WHEN :searchType='MOBILE_NO' AND cus.mobileNumber=:searchField THEN 1 "
			+ "WHEN :searchType='EMAIL_ID' AND cus.emailId=:searchField THEN 1 "
			+ "WHEN :searchType='PAN_NO' AND cus.custTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='GST_NO' AND cus.instiTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='ULP_ID' AND cus.ulpId=:searchField THEN 1 END)) "
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or cn.docDate>=:#{#historyFilter.fromDocDate}) "
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or cn.docDate<=:#{#historyFilter.toDocDate}) "
			+ "AND (:#{#historyFilter.docNo} IS NULL or cn.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or cn.fiscalYear=:#{#historyFilter.fiscalYear}) "
			+ "AND (:#{#historyFilter.refDocNo} IS NULL or cnparent.docNo=:#{#historyFilter.refDocNo}) "
			+ "AND (:cnType IS NULL or cn.creditNoteType=:cnType) " + "AND (:status IS NULL or cn.status=:status) "
			+ "AND (cn.locationCode=:locationCode)")
	Page<CNResponseDto> creditNoteHistory(@Param("searchField") String searchField,
			@Param("searchType") String searchType, @Param("status") String status,
			@Param("locationCode") String locationCode, @Param("cnType") String cnType,
			@Param("historyFilter") SalesHistoryReqDtoExt creditNoteHistoryDto, Pageable pageable);

	/**
	 * @param id
	 * @param name
	 * @return
	 */
	List<CreditNoteDaoExt> findByLinkedTxnIdAndStatus(String linkedTxnId, String status);

	CreditNoteDaoExt findOneBySalesTxnId(String id);

	List<CreditNoteDaoExt> findAllByMergedCNId(String cnId);

	List<CreditNoteDaoExt> findAllByMergedCNIdAndLocationCode(String cnId, String locationCode);

	CreditNoteDaoExt findOneBySalesTxnIdAndAccountDetailsDaoIdAndStatus(String salesTxnId, String accountId,
			String status);

	/**
	 * @param docNos
	 * @param fiscalYears
	 * @param locationCodes
	 * @param pageable
	 * @return
	 */
	@Query("SELECT cn FROM CreditNoteDaoExt cn WHERE (cn.docNo IN (:docNos) OR nullif(CHOOSE(1,:docNos),'') IS NULL) AND cn.fiscalYear IN (:fiscalYears) AND (cn.locationCode IN (:locationCodes) OR nullif(CHOOSE(1,:locationCodes),'') IS NULL)")
	Page<CreditNoteDaoExt> getAllCNsForDirectOperations(@Param("docNos") List<Integer> docNos,
			@Param("fiscalYears") List<Short> fiscalYears, @Param("locationCodes") List<String> locationCodes,
			Pageable pageable);

	CreditNoteDaoExt findOneById(String reference3);
	
	@Query("SELECT cn FROM com.titan.poss.sales.dao.CreditNoteDaoExt cn WHERE (cn.frozenRateDetails IS NOT NULL AND cn.frozenRateDetails != '' AND cn.frozenRateDetails != '{}') AND (cn.status = :status) AND (cn.locationCode=:locationCode)")
	List<CreditNoteDaoExt> findAllByStatusAndLocationCode( @Param("status") String status,@Param("locationCode") String locationCode);
	
	List<CreditNoteDaoExt> findAllBySalesTxnIdAndLocationCode(String cnId, String locationCode);

}
