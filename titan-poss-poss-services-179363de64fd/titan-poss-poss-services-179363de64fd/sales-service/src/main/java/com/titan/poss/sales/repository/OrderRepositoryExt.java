/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.OrderSearchFilterDto;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.AdvanceBookingHistoryDto;
import com.titan.poss.sales.dto.response.OrderTransactionDetailsDto;

/**
 * 
 * Handles repository operations for <b>orders</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface OrderRepositoryExt extends JpaRepository<OrderDaoExt, String> {

	// is this fine?
	Optional<OrderDaoExt> findOneBySalesTxn(SalesTxnDaoExt salesTxnDao);

	// @formatter:off
	    @Query("SELECT order "
				+ " FROM com.titan.poss.sales.dao.OrderDaoExt order "
				+ " WHERE order.id = :id "
				+ " AND order.salesTxn.locationCode = :locationCode "
				+ " AND order.salesTxn.txnType = :transactionType "
				+ " AND order.salesTxn.subTxnType = :subTxnType")
	// @formatter:on
	OrderDaoExt findOneByIdAndSalesTxnLocationCodeAndTxnTypeAndSubTxnType(@Param("id") String id,
			@Param("locationCode") String locationCode, @Param("transactionType") String transactionType,
			@Param("subTxnType") String subTxnType);

	OrderDaoExt findOneByIdAndSalesTxnLocationCode(String id, String locationCode);

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.response.OrderTransactionDetailsDto(salesTxn.id, "
			+ " salesTxn.txnType, salesTxn.docNo, salesTxn.fiscalYear, "
			+ " salesTxn.customerId, cDtls.customerName, salesTxn.status, "
			+ " salesTxn.locationCode, salesTxn.docDate, salesTxn.subTxnType, " 
			+ " cDtls.mobileNumber, orders.isFrozenRate, orders.isBestRate,orders.finalValue) "
			+ " FROM com.titan.poss.sales.dao.SalesTxnDaoExt salesTxn "
			+ " INNER JOIN com.titan.poss.sales.dao.OrderDaoExt orders ON salesTxn.id = orders.id "
			+ " LEFT JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt cDtls "
			+ " ON orders.id = cDtls.salesTxnDao.id "
			+ " WHERE (:txnType IS NULL OR salesTxn.txnType = :txnType) "
			+ "	AND (:docNo IS NULL OR salesTxn.docNo = :docNo) "
			+ " AND (:fiscalYear IS NULL OR salesTxn.fiscalYear = :fiscalYear) "
			+ " AND (nullif(CHOOSE(1,:#{#orderFilterDto.statusList}),'') IS NULL OR salesTxn.status IN (:#{#orderFilterDto.statusList})) "
			+ " AND (nullif(CHOOSE(1,:#{#orderFilterDto.excludeStatusList}),'') IS NULL OR salesTxn.status NOT IN (:#{#orderFilterDto.excludeStatusList})) "
			+ " AND (:#{#orderFilterDto.isFrozenRate} IS NULL OR orders.isFrozenRate = :#{#orderFilterDto.isFrozenRate}) "
			+ " AND (:#{#orderFilterDto.isBestRate} IS NULL OR orders.isBestRate = :#{#orderFilterDto.isBestRate}) "
			+ " AND (:mobileNumber IS NULL OR cDtls.mobileNumber = :mobileNumber) "
			+ " AND salesTxn.locationCode = :#{#orderFilterDto.locationCode}")
	// @formatter:on
	Page<OrderTransactionDetailsDto> listOrders(@Param("txnType") String txnType, @Param("docNo") Integer docNo,
			@Param("fiscalYear") Short fiscalYear, @Param("mobileNumber") String mobileNumber,
			@Param("orderFilterDto") OrderSearchFilterDto orderFilterDto, Pageable pageable);

	/**
	 *
	 * @param txnId
	 * @param locationCode
	 * @return CashMemoDaoExt
	 */
	OrderDaoExt findByIdAndSalesTxnLocationCodeAndSalesTxnStatus(String txnId, String locationCode, String status);

	@Query("SELECT new com.titan.poss.sales.dto.response.AdvanceBookingHistoryDto(ab.salesTxn.docNo,ab.salesTxn.docDate,ab.salesTxn.fiscalYear,ctxn.customerName,ab.salesTxn.status) " 
			+ "FROM com.titan.poss.sales.dao.OrderDaoExt ab "
			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ctxn ON ab.id=ctxn.id "
			+ "LEFT JOIN com.titan.poss.sales.dao.CreditNoteDaoExt cn " + "ON ab.id=cn.linkedTxn.id " + "WHERE "
			+ "(:searchType IS NULL or (1=CASE "
			+ "WHEN :searchType='MOBILE_NO' AND ctxn.mobileNumber=:searchField THEN 1 "
			+ "WHEN :searchType='EMAIL_ID' AND ctxn.emailId=:searchField THEN 1 "
			+ "WHEN :searchType='PAN_NO' AND ctxn.custTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='GST_NO' AND ctxn.instiTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='ULP_ID' AND ctxn.ulpId=:searchField THEN 1 END)) "
			+ "AND (:#{#historyFilter.fromNetAmount} IS NULL or ab.finalValue>=:#{#historyFilter.fromNetAmount}) "
			+ "AND (:#{#historyFilter.toNetAmount} IS NULL or ab.finalValue<=:#{#historyFilter.toNetAmount}) "
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or ab.salesTxn.docDate>=:#{#historyFilter.fromDocDate}) "
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or ab.salesTxn.docDate<=:#{#historyFilter.toDocDate}) "
			+ "AND (:#{#historyFilter.docNo} IS NULL or ab.salesTxn.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or ab.salesTxn.fiscalYear=:#{#historyFilter.fiscalYear}) "
			+ "AND (:#{#historyFilter.refDocNo} IS NULL or cn.docNo=:#{#historyFilter.refDocNo})"
			+ "AND (:status IS NULL or ab.salesTxn.status=:status) "
			+ "AND (:isFrozenRate IS NULL or ab.isFrozenRate=:isFrozenRate) "
			+ "AND (:employeeCode IS NULL or ab.salesTxn.employeeCode=:employeeCode) "
			+ "AND (ab.salesTxn.locationCode=:locationCode) " + "AND (ab.salesTxn.txnType=:txnType) "
			+ "AND (ab.salesTxn.subTxnType=:subTxnType)")
	Page<AdvanceBookingHistoryDto> orderHistory(@Param("searchField") String searchField, @Param("searchType") String searchType,
			@Param("status") String status, @Param("txnType") String txnType, @Param("subTxnType") String subTxnType,
			@Param("employeeCode") String employeeCode, @Param("locationCode") String locationCode,
			@Param("isFrozenRate") Boolean isFrozenRate, @Param("historyFilter") SalesHistoryReqDtoExt orderHistoryDto,
			Pageable pageable);

}
