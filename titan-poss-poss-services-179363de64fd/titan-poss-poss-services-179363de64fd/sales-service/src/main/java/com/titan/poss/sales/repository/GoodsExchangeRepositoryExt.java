/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dto.CancellationListDto;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.GoodsExchangeDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("salesGoodsExchangeRepository")
public interface GoodsExchangeRepositoryExt extends JpaRepository<GoodsExchangeDaoExt, String> {

	@Query(value = "SELECT ge from GoodsExchangeDaoExt ge inner join ge.salesTxn st where ge.id=:id AND"
			+ " st.txnType=:txnType AND st.subTxnType=:subTxnType")
	GoodsExchangeDaoExt getGoodsExchangeByIdAndTxnTypeAndSubTxnType(@Param("id") String id,
			@Param("txnType") String txnType, @Param("subTxnType") String subTxnType);

	//@formatter:off
	@Query(value="SELECT DISTINCT new com.titan.poss.sales.dto.CancellationListDto(st.docNo, ct.customerName, st.confirmedTime, st.id, st.txnType, st.subTxnType, "
			+ " st.docDate,gd.finalValue, st.currencyCode) FROM GoodsExchangeDaoExt gd \r\n"
			+ " INNER JOIN gd.salesTxn st \r\n"
			+ " INNER JOIN CustomerTxn ct \r\n"
			+ " 	ON st.id=ct.id \r\n"
			+ " LEFT JOIN Cancel cn \r\n"
			+ "		ON st = cn.refSalesTxn \r\n"
			+ " WHERE st.locationCode = :locationCode \r\n"
			+ " AND (:docDate IS NULL OR st.docDate = :docDate) \r\n"
			+ " AND (st.status = :status) \r\n"
			+ " AND (:docNo IS NULL OR st.docNo = :docNo) \r\n"
			+ " AND (:customerMobileNo IS NULL OR ct.mobileNumber = :customerMobileNo) \r\n"
			+ " AND (:fiscalYear IS NULL OR st.fiscalYear = :fiscalYear)"
			+ " AND st.txnType = :txnType")
	//@formatter:on
	Page<CancellationListDto> listGoodsExchangeCancel(@Param("docNo") Integer docNo,
			@Param("customerMobileNo") String customerMobileNo, @Param("docDate") Date docDate,
			@Param("status") String status, @Param("locationCode") String locationCode,
			@Param("fiscalYear") Short fiscalYear, @Param("txnType") String txnType, Pageable pageable);

	@Query(value = "SELECT ge from GoodsExchangeDaoExt ge inner join ge.salesTxn st where ge.id=:id AND"
			+ " st.txnType=:txnType")
	GoodsExchangeDaoExt getGoodsExchangeByIdAndTxnType(@Param("id") String id, @Param("txnType") String txnType);

	@Query(value = "SELECT ge from GoodsExchangeDaoExt ge inner join ge.salesTxn st where ge.id=:id AND"
			+ " st.txnType=:txnType AND st.status='CONFIRMED' AND ge.paymentType='REFUND'")
	GoodsExchangeDaoExt getGoodsExchange(@Param("id") String id, @Param("txnType") String txnType);

	/**
	 * @param searchField
	 * @param searchType
	 * @param subTxnType
	 * @param txnType
	 * @param object
	 * @param locationCode
	 * @param goodReturnHistoryDto
	 * @param status
	 * @param pageable
	 * @return
	 */
	@Query("SELECT new com.titan.poss.sales.dto.response.GoodsExchangeDto(cm.id,cm.salesTxn.txnType,cm.salesTxn.docNo,cm.salesTxn.docDate,cm.salesTxn.fiscalYear,ctxn.customerName,cm.finalValue,cm.createdBy,cm.createdDate,cm.salesTxn.status,cn.docNo,cm.salesTxn.remarks,cm.salesTxn.locationCode,cm.salesTxn.subTxnType,cm.salesTxn.employeeCode) "
			+ "FROM com.titan.poss.sales.dao.GoodsExchangeDaoExt cm "
			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ctxn ON cm.id=ctxn.id "
			+ "LEFT JOIN com.titan.poss.sales.dao.PaymentReversalDaoExt pr ON pr.salesTxn.id=cm.id "
			+ "LEFT JOIN com.titan.poss.sales.dao.CreditNoteDaoExt cn ON cn.salesTxn.id=cm.id "
			
			+ "WHERE "
			+ "(:searchType IS NULL or (1=CASE "
			+ "WHEN :searchType='MOBILE_NO' AND ctxn.mobileNumber=:searchField THEN 1 "
			+ "WHEN :searchType='EMAIL_ID' AND ctxn.emailId=:searchField THEN 1 "
			+ "WHEN :searchType='PAN_NO' AND ctxn.custTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='GST_NO' AND ctxn.instiTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='ULP_ID' AND ctxn.ulpId=:searchField THEN 1 END)) "
			+ "AND (:#{#historyFilter.fromNetAmount} IS NULL or cm.finalValue>=:#{#historyFilter.fromNetAmount}) "
			+ "AND (:#{#historyFilter.toNetAmount} IS NULL or cm.finalValue<=:#{#historyFilter.toNetAmount}) "
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or cm.salesTxn.docDate>=:#{#historyFilter.fromDocDate}) "
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or cm.salesTxn.docDate<=:#{#historyFilter.toDocDate}) "
			+ "AND (:#{#historyFilter.refDocNo} IS NULL or cn.docNo=:#{#historyFilter.refDocNo}) "
			+ "AND (:#{#historyFilter.docNo} IS NULL or cm.salesTxn.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or cm.salesTxn.fiscalYear=:#{#historyFilter.fiscalYear}) "
			+ "AND cm.salesTxn.status IN (:status) " + "AND (cm.salesTxn.locationCode=:locationCode) "
			+ "AND (cm.salesTxn.txnType=:txnType) " 
			+ "AND (cn.id IS NULL or cn.id=cn.originalCn)"
			+ "AND (cn.locationCode IS NULL or cn.locationCode=:locationCode) "
			+ "AND (cm.salesTxn.subTxnType=:subTxnType)"
			+ "AND (cm.salesTxn.status NOT IN ('DELETED'))")
	Page<GoodsExchangeDto> goodsExchangeHistory(@Param("searchField") String searchField,
			@Param("searchType") String searchType, @Param("subTxnType") String subTxnType,
			@Param("txnType") String txnType, @Param("locationCode") String locationCode,
			@Param("status") List<String> statusList, @Param("historyFilter") SalesHistoryReqDtoExt goodReturnHistoryDto,
			Pageable pageable);
}
