/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.BillCancellationHistoryDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCancellationRepositoryExt")
public interface CancellationRepositoryExt extends JpaRepository<CancelDaoExt, String> {
	/**
	 * This method will return the cancel Id.
	 * 
	 * @param locationCode
	 * @param todayDate
	 * @return cancelId
	 */
	
	@Query("SELECT c.id FROM Cancel c WHERE c.locationCode = :locationCode AND c.docDate = :todayDate")
	List<String> findByLocationCodeAndDocDate(@Param("locationCode") String locationCode,
			@Param("todayDate") Date todayDate);

	// @formatter:off
	@Query(" SELECT c FROM com.titan.poss.sales.dao.CancelDaoExt c \r\n"
			+ " WHERE c.id = :id \r\n"
			+ " AND c.txnType = :txnType \r\n"
			+ " AND c.subTxnType= :subTxnType \r\n"
			+ " AND c.locationCode = :locationCode")
	// @formatter:on
	CancelDaoExt findOneByIdAndTxnTypeAndSubTxnTypeAndLocationCode(@Param("id") String id,
			@Param("txnType") String txnType, @Param("subTxnType") String subTxnType,
			@Param("locationCode") String locationCode);

	// @formatter:off
	@Query(" SELECT c FROM com.titan.poss.sales.dao.CancelDaoExt c \r\n"
			+ " WHERE c.refSalesTxn.id = :refSalesTxn \r\n"
			+ " AND c.locationCode = :locationCode \r\n"
			+ " AND c.status = :status")
	// @formatter:on
	List<CancelDaoExt> findByRefSalesTxnAndLocationCodeAndStatus(@Param("refSalesTxn") String refSalesTxn,
			@Param("locationCode") String locationCode, @Param("status") String status);

	// @formatter:off
	@Query(" SELECT c FROM com.titan.poss.sales.dao.CancelDaoExt c \r\n"
			+ " WHERE c.txnType IN (:txnTypeList) \r\n"
			+ " AND c.status= :status \r\n"
			+ " AND c.docDate <= :docDate \r\n"
			+ " AND c.locationCode = :locationCode")
	// @formatter:on
	List<CancelDaoExt> findByTxnTypeAndStatusAndDocDateLessThanEqualAndLocationCode(
			@Param("txnTypeList") Set<String> txnTypeList, @Param("status") String status,
			@Param("docDate") Date docDate, @Param("locationCode") String locationCode);

	@Query("SELECT new com.titan.poss.sales.dto.response.BillCancellationHistoryDto(cm.salesTxnDao.docNo,cm.salesTxnDao.id,cm.salesTxnDao.docDate,cm.salesTxnDao.fiscalYear, ctxn.customerName,cm.finalValue,cm.createdBy,can.docDate,can.reasonForCancellation,can.cancellationType,cm.salesTxnDao.txnType,cm.salesTxnDao.subTxnType) "
			+ "FROM com.titan.poss.sales.dao.CancelDaoExt can "
			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ctxn ON can.refSalesTxn.id=ctxn.id "
			+ "INNER JOIN com.titan.poss.sales.dao.CashMemoDaoExt cm ON can.refSalesTxn.id=cm.id " + "WHERE "
			+ "(:searchType IS NULL or (1=CASE "
			+ "WHEN :searchType='MOBILE_NO' AND ctxn.mobileNumber=:searchField THEN 1 "
			+ "WHEN :searchType='EMAIL_ID' AND ctxn.emailId=:searchField THEN 1 "
			+ "WHEN :searchType='PAN_NO' AND ctxn.custTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='GST_NO' AND ctxn.instiTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='ULP_ID' AND ctxn.ulpId=:searchField THEN 1 END)) "
			+ "AND (:#{#historyFilter.fromNetAmount} IS NULL or can.totalValue>=:#{#historyFilter.fromNetAmount}) "
			+ "AND (:#{#historyFilter.toNetAmount} IS NULL or can.totalValue<=:#{#historyFilter.toNetAmount}) "
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or can.docDate>=:#{#historyFilter.fromDocDate}) "
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or can.docDate<=:#{#historyFilter.toDocDate}) "
			+ "AND (:#{#historyFilter.docNo} IS NULL or can.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or can.fiscalYear=:#{#historyFilter.fiscalYear}) "
			+ "AND (:#{#historyFilter.refDocNo} IS NULL or can.refSalesTxn.docNo=:#{#historyFilter.refDocNo})"
			+ "AND (can.locationCode=:locationCode) " + "AND (can.status=:status) " + "AND (can.txnType=:txnType)"
			+ "AND (can.subTxnType=:subTxnType) ORDER BY cm.salesTxnDao.docNo DESC")
	Page<BillCancellationHistoryDto> billCancellationHistory(@Param("searchField") String searchField,
			@Param("searchType") String searchType, @Param("subTxnType") String subTxnType,
			@Param("txnType") String txnType, @Param("locationCode") String locationCode,
			@Param("historyFilter") SalesHistoryReqDtoExt cancelHistoryDto, @Param("status") String status,
			Pageable pageable);

	List<CancelDaoExt> findByRefSalesTxnId(String id);

	List<CancelDaoExt> findByRefSalesTxnIdAndStatusAndTxnType(String id, String status, String txnType);

	CancelDaoExt findTopByRefSalesTxnIdAndStatus(String id, String status);

	/**
	 * @param searchField
	 * @param searchType
	 * @param subTxnType
	 * @param txnType
	 * @param locationCode
	 * @param cancelHistoryDto
	 * @param refTepNo
	 * @param pageable
	 * @return
	 */
//	@Query("SELECT new com.titan.poss.sales.dto.response.BillCancellationHistoryDto(cm.salesTxnDao.docNo,cm.salesTxnDao.docDate,cm.salesTxnDao.fiscalYear, ctxn.customerName,cm.finalValue,cm.createdBy,cm.createdDate,can.reasonForCancellation,can.cancellationType) "
//			+ "FROM com.titan.poss.sales.dao.CancelDaoExt can "
//			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ctxn ON can.refSalesTxn.id=ctxn.id "
//			+ "INNER JOIN com.titan.poss.sales.dao.GoodsExchangeDaoExt cm ON can.refSalesTxn.id=cm.id " + "WHERE "
//			+ "(:searchType IS NULL or (1=CASE "
//			+ "WHEN :searchType='MOBILE_NO' AND ctxn.mobileNumber=:searchField THEN 1 "
//			+ "WHEN :searchType='EMAIL_ID' AND ctxn.emailId=:searchField THEN 1 "
//			+ "WHEN :searchType='PAN_NO' AND ctxn.custTaxNo=:searchField THEN 1 "
//			+ "WHEN :searchType='ULP_ID' AND ctxn.instiTaxNo=:searchField THEN 1 "
//			+ "WHEN :searchType='GST_NO' AND ctxn.ulpId=:searchField THEN 1 END)) "
//			+ "AND (:#{#historyFilter.fromNetAmount} IS NULL or can.totalValue>=:#{#historyFilter.fromNetAmount}) "
//			+ "AND (:#{#historyFilter.toNetAmount} IS NULL or can.totalValue<=:#{#historyFilter.toNetAmount}) "
//			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or can.docDate>=:#{#historyFilter.fromDocDate}) "
//			+ "AND (:#{#historyFilter.toDocDate} IS NULL or can.docDate<=:#{#historyFilter.toDocDate}) "
//			+ "AND (:#{#historyFilter.docNo} IS NULL or can.docNo=:#{#historyFilter.docNo}) "
//			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or can.fiscalYear=:#{#historyFilter.fiscalYear}) "
//			+ "AND (:#{#historyFilter.refDocNo} IS NULL or can.refSalesTxn.docNo=:#{#historyFilter.refDocNo})"
//			+ "AND (can.locationCode=:locationCode) " + "AND (:refTepNo IS NULL or cm.docNo=:refTepNo) "
//			+ "AND (can.txnType=:txnType)" + "AND (can.subTxnType=:subTxnType)")
//	Page<BillCancellationHistoryDto> goodsExchangeCancellationHistory(@Param("searchField") String searchField,
//			@Param("searchType") String searchType, @Param("subTxnType") String subTxnType,
//			@Param("txnType") String txnType, @Param("locationCode") String locationCode,
//			@Param("historyFilter") SalesHistoryReqDtoExt cancelHistoryDto, @Param("refTepNo") Integer refTepNo,
//			Pageable pageable);
   CancelDaoExt findOneByIdAndLocationCode(String id,String locationCode);
   
   Optional<CancelDaoExt> findByRefSalesTxnIdAndTxnTypeAndLocationCodeAndStatus(String txnId, String txnType,String locationCode,String status);
}

