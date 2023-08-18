/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.sales.dao.CreditNoteTransferDao;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface CreditNoteTransferRepositoryExt extends JpaRepository<CreditNoteTransferDao, String> {

	/**
	 * @param id
	 * @return
	 */
	CreditNoteTransferDao findBySrcCnId(String id);

	/**
	 * @param id
	 * @param string
	 * @return
	 */
	CreditNoteTransferDao findBySrcCnIdAndStatus(String id, String string);

	/**
	 * @param id
	 * @param locationCode
	 * @param status
	 * @return
	 */
	CreditNoteTransferDao findBySrcCnIdAndSrcLocationCodeAndStatus(String id, String locationCode, String status);

	/**
	 * @param id
	 * @param destBtqCode
	 * @param status
	 * @return
	 */
	CreditNoteTransferDao findBySrcCnIdAndDestLocationCodeAndStatus(String id, String destBtqCode, String status);


	@Query("SELECT new com.titan.poss.core.dto.CreditNoteTransferDto(cnTf.id,cnTf.srcLocationCode,cnTf.destLocationCode,cnTf.cnDetails,cnTf.srcCnId,cnTf.destCnId,cnTf.amount,cnTf.status,cnTf.docNo,cnTf.fiscalYear) "
			+ "FROM com.titan.poss.sales.dao.CreditNoteTransferDao cnTf "
			+ "INNER JOIN com.titan.poss.sales.dao.CreditNoteDaoExt cn ON  cnTf.srcCnId=cn.id "
			+ "INNER JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt cus ON cus.id=cn.salesTxn.id "
			+ "LEFT JOIN com.titan.poss.sales.dao.CreditNoteDaoExt cnparent ON cnparent.id=cn.parentCn.id " + "WHERE "
			+ "(:searchType IS NULL or (1=CASE "
			+ "WHEN :searchType='MOBILE_NO' AND cus.mobileNumber=:searchField THEN 1 "
			+ "WHEN :searchType='EMAIL_ID' AND cus.emailId=:searchField THEN 1 "
			+ "WHEN :searchType='PAN_NO' AND cus.custTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='ULP_ID' AND cus.instiTaxNo=:searchField THEN 1 "
			+ "WHEN :searchType='GST_NO' AND cus.ulpId=:searchField THEN 1 END)) "
			+ "AND (:#{#historyFilter.fromDocDate} IS NULL or cn.docDate>=:#{#historyFilter.fromDocDate}) "
			+ "AND (:#{#historyFilter.toDocDate} IS NULL or cn.docDate<=:#{#historyFilter.toDocDate}) "
			+ "AND (:#{#historyFilter.docNo} IS NULL or cn.docNo=:#{#historyFilter.docNo}) "
			+ "AND (:#{#historyFilter.fiscalYear} IS NULL or cn.fiscalYear=:#{#historyFilter.fiscalYear}) "
			+ "AND (:#{#historyFilter.refDocNo} IS NULL or cnparent.docNo=:#{#historyFilter.refDocNo}) "
			+ "AND (:cnType IS NULL or cn.creditNoteType=:cnType) " 
			+ "AND (:status IS NULL or cnTf.status=:status) "
			+ "AND (:destLocation IS NULL or cnTf.destLocationCode=:destLocation) "
			+ "AND (:srcLocation IS NULL or cnTf.srcLocationCode=:srcLocation) "
			+ "AND (:srcLocation IS NULL or cn.locationCode=:srcLocation)")
	Page<CreditNoteTransferDto> listCNTransferHistory(@Param("searchField")String searchField,@Param("searchType") String searchType,@Param("status")String status,@Param("cnType") String cnType,@Param("destLocation") String destLocation,
			@Param("srcLocation")String srcLocation,@Param("historyFilter")SalesHistoryReqDtoExt creditNoteHistoryDto,Pageable pageable);

}
