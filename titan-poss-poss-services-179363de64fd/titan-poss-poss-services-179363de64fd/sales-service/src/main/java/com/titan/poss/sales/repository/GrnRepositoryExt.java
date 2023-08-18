/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.GrnDaoExt;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.GrnHistoryResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesGrnRepositoryExt")
public interface GrnRepositoryExt extends JpaRepository<GrnDaoExt, String> {

	Optional<GrnDaoExt> findByIdAndCancelLocationCode(String id, String locationCode);

	@Query("SELECT new com.titan.poss.sales.dto.response.GrnHistoryResponse(can.docNo,cn.docNo,cn.creditNoteType,grn.srcLocationCode,can.fiscalYear,ctxn.customerName,cn.amount,can.status,grn.createdBy,grn.createdDate,can.id,can.docDate) "
			+ "FROM com.titan.poss.sales.dao.GrnDaoExt grn "
			+ "INNER JOIN com.titan.poss.sales.dao.CancelDaoExt can ON can.id=grn.cancel.id "
			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ctxn ON can.refSalesTxn.id=ctxn.id "
			+ "INNER JOIN com.titan.poss.sales.dao.CashMemoDaoExt cm ON can.refSalesTxn.id=cm.id "
			+ "LEFT JOIN com.titan.poss.sales.dao.CreditNoteDaoExt cn ON can.id=cn.cancelTxn.id " + "WHERE"
			+ "((cn.id = cn.originalCn.id ) OR (cn.originalCn.id IS NULL)) AND"
			+ "(:searchType IS NULL or (1=CASE "
			+ "WHEN :searchType='MOBILE_NO' AND ctxn.mobileNumber=:searchField THEN 1 "
			+ "WHEN :searchType='EMAIL_ID' AND ctxn.emailId=:searchField THEN 1 "
			+ "WHEN :searchType='PAN_NO' AND ctxn.custTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='GST_NO' AND ctxn.instiTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='ULP_ID' AND ctxn.ulpId=:searchField THEN 1 END)) "
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or can.docDate>=:#{#historyFilter.fromDocDate}) "
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or can.docDate<=:#{#historyFilter.toDocDate}) "
			+ "AND (:#{#historyFilter.docNo} IS NULL or can.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or can.fiscalYear=:#{#historyFilter.fiscalYear}) "
			+ "AND (:#{#historyFilter.refDocNo} IS NULL or cm.salesTxnDao.docNo=:#{#historyFilter.refDocNo})"
			+ "AND  (:cmLocation IS NULL or grn.srcLocationCode=:cmLocation)" + "AND (can.locationCode=:locationCode) "
			+ "AND (can.txnType=:txnType)" + "AND (can.subTxnType=:subTxnType)")
	Page<GrnHistoryResponse> grnHistory(@Param("searchField") String searchField,
			@Param("searchType") String searchType, @Param("subTxnType") String subTxnType,
			@Param("txnType") String txnType, @Param("cmLocation") String cmLocation,
			@Param("locationCode") String locationCode,
			@Param("historyFilter") SalesHistoryReqDtoExt goodReturnHistoryDto, Pageable pageable);
	
	
	@Query("SELECT cn FROM com.titan.poss.sales.dao.CreditNoteDaoExt cn WHERE cn.cancelTxn.id =:id")
	List<CreditNoteDaoExt> grnCnDocNo(@Param("id") String id);
}
