/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
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

import com.titan.poss.sales.dao.StockTransactionDaoExt;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.BaseTransactionDetailsDto;
import com.titan.poss.sales.dto.response.GoodsExchangeDto;
import com.titan.poss.sales.dto.response.StockTransactionStatusCountDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesStockTransactionRepository")
public interface StockTransactionRepositoryExt extends JpaRepository<StockTransactionDaoExt, String> {

	StockTransactionDaoExt findByIdAndTransactionTypeAndLocationCode(String id, String transactionType,
			String locationCode);

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.response.BaseTransactionDetailsDto(sTxn.id, sTxn.transactionType, sTxn.docNo,"
			+ " sTxn.fiscalYear, sTxn.status, sTxn.locationCode, sTxn.docDate)"
			+ " FROM com.titan.poss.sales.dao.StockTransactionDaoExt sTxn"
			+ " WHERE (:transactionType IS NULL OR sTxn.transactionType = :transactionType) "
			+ " AND (:docNo IS NULL OR sTxn.docNo = :docNo) "
			+ " AND (:fiscalYear IS NULL OR sTxn.fiscalYear = :fiscalYear) "
			+ " AND (:status IS NULL OR sTxn.status = :status) "
			+ " AND sTxn.locationCode = :locationCode ")
	// @formatter:on
	Page<BaseTransactionDetailsDto> listTxnDetails(@Param("transactionType") String transactionType,
			@Param("docNo") Integer docNo, @Param("fiscalYear") Short fiscalYear, @Param("status") String status,
			@Param("locationCode") String locationCode, Pageable pageable);

	// @formatter:off
	@Query("SELECT new com.titan.poss.sales.dto.response.StockTransactionStatusCountDto(sTxn.transactionType, count(sTxn.transactionType)) "
			+ " FROM com.titan.poss.sales.dao.StockTransactionDaoExt sTxn "
			+ " WHERE sTxn.transactionType = :transactionType "
			+ " AND sTxn.status = :status "
			+ " AND sTxn.locationCode = :locationCode "
			+ " GROUP BY sTxn.status, sTxn.transactionType")
	// @formatter:on
	List<StockTransactionStatusCountDto> listTransactioncount(@Param("transactionType") String transactionType,
			@Param("status") String status, @Param("locationCode") String locationCode);

	/**
	 * This method will return transactions which are in 'OPEN' or 'HOLD' status.
	 * 
	 * @param locationCode
	 * @param docDate
	 * @param status
	 * @return List<StockTransactionDaoExt>
	 */
	List<StockTransactionDaoExt> findByLocationCodeAndDocDateLessThanEqualAndStatusIn(String locationCode, Date docDate,
			List<String> status);

	Integer countByLocationCodeAndDocDateLessThanEqualAndStatusIn(String locationCode, Date docDate,
			List<String> status);

	@Query("SELECT new com.titan.poss.sales.dto.response.GoodsExchangeDto(sTxn.id,sTxn.docNo,sTxn.docDate,sTxn.fiscalYear,sTxn.createdBy,sTxn.createdDate,sTxn.status,sTxn.remarks,sTxn.locationCode,sTxn.transactionType,sTxn.employeeCode,sTxn.totalValue) "
			+ "FROM com.titan.poss.sales.dao.StockTransactionDaoExt sTxn " 
			+ "WHERE " 
			+ "(:#{#historyFilter.fromNetAmount} IS NULL or sTxn.totalValue>=:#{#historyFilter.fromNetAmount}) " 
			+ "AND (:#{#historyFilter.toNetAmount} IS NULL or sTxn.totalValue<=:#{#historyFilter.toNetAmount}) " 
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or sTxn.docDate>=:#{#historyFilter.fromDocDate}) " 
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or sTxn.docDate<=:#{#historyFilter.toDocDate}) " 
			+ "AND (:#{#historyFilter.docNo} IS NULL or sTxn.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or sTxn.fiscalYear=:#{#historyFilter.fiscalYear}) " 
			+ "AND (sTxn.status IN (:status)) "
			+ "AND (sTxn.locationCode=:locationCode) " 
			+ "AND (sTxn.transactionType=:subTxnType) ")
	Page<GoodsExchangeDto> listTransactionHistory(@Param("subTxnType")String subTxnType,@Param("locationCode") String locationCode,@Param("status") List<String> status,@Param("historyFilter") SalesHistoryReqDtoExt historyFilter,
			Pageable pageable);

}
