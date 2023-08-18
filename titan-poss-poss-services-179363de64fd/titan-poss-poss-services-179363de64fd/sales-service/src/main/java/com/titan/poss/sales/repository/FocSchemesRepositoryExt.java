/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.FocSchemesDaoExt;
import com.titan.poss.sales.dto.CMFocSchemeSearchReqDto;
import com.titan.poss.sales.dto.response.FocPendingCMResponseDto;

/**
 * Repository interface for foc_schemes table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesFocSchemesRepository")
public interface FocSchemesRepositoryExt extends JpaRepository<FocSchemesDaoExt, String> {

	List<FocSchemesDaoExt> findAllBySalesTxnId(@Param("salesTxnId") String salesTxnId);

	// @formatter:off
	@Query(" SELECT new com.titan.poss.sales.dto.response.FocPendingCMResponseDto(sTxn.id,sTxn.docNo,sTxn.fiscalYear,"
			+ " sTxn.customerId,sTxn.docDate,cashMemo.finalValue) "
			+ " FROM com.titan.poss.sales.dao.SalesTxnDaoExt sTxn INNER JOIN com.titan.poss.sales.dao.CashMemoDaoExt cashMemo "
			+ " ON sTxn.id = cashMemo.id "
			+ " WHERE sTxn.id IN (SELECT DISTINCT(salesTxn.id) FROM com.titan.poss.sales.dao.FocSchemesDaoExt focSchemes "
			+ " WHERE focSchemes.status = :#{#focSchemeFilterDto.focStatus}) "
			+ " AND sTxn.txnType = :txnType AND sTxn.subTxnType = :subTxnType "
			+ " AND (:docNo IS NULL OR sTxn.docNo = :docNo) AND (:fiscalYear IS NULL OR sTxn.fiscalYear = :fiscalYear) "
			+ " AND (:customerId IS NULL OR sTxn.customerId = :customerId) "
			+ " AND sTxn.status = :#{#focSchemeFilterDto.cmStatus} AND sTxn.locationCode = :#{#focSchemeFilterDto.locationCode} "
			+ " AND (:#{#focSchemeFilterDto.transactionId} IS NULL OR sTxn.id = :#{#focSchemeFilterDto.transactionId}) "
			+ " AND sTxn.id NOT IN (SELECT cancel.refSalesTxn.id FROM com.titan.poss.sales.dao.CancelDaoExt cancel WHERE cancel.status IN ('PENDING', 'APPROVED'))"
		)
	// @formatter:on
	Page<FocPendingCMResponseDto> listFocPendingCMs(@Param("txnType") String txnType,
			@Param("subTxnType") String subTxnType, @Param("docNo") Integer docNo,
			@Param("fiscalYear") Short fiscalYear, @Param("customerId") Integer customerId,
			@Param("focSchemeFilterDto") CMFocSchemeSearchReqDto focSchemeFilterDto, Pageable pageable);

	FocSchemesDaoExt findByIdAndSalesTxnIdAndStatus(String focSchemeId, String salesTxnId, String focSchemeStatus);

	void deleteAllBySalesTxnId(String salesTxnId);

	// @formatter:off
	@Modifying
	@Query("UPDATE com.titan.poss.sales.dao.FocSchemesDaoExt focScheme SET focScheme.status = :status"
			+ " WHERE focScheme.id IN (SELECT DISTINCT(focDetails.focScheme.id) FROM com.titan.poss.sales.dao.FocDetailsDaoExt focDetails WHERE focDetails.salesTxn.id = :salesTxnId)")
	// @formatter:on
	void updateFocSchemeStatusBySalesTxnId(@Param("status") String status, @Param("salesTxnId") String salesTxnId);

	List<FocSchemesDaoExt> findBySalesTxnId(String id);

	Long countBySalesTxnId(String id);

	/**
	 * @param focSchemeId
	 */
	@Modifying
	@Query("delete from FocSchemesDaoExt fs where fs.id in(:focSchemeId)")
	void deleteAllById(@Param("focSchemeId") List<String> focSchemeId);

}
