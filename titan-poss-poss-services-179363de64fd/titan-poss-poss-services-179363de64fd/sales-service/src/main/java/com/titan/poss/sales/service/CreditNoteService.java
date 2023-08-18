/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.CreditNoteStatusUpdateDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.request.CreditNoteCreateDto;
import com.titan.poss.sales.dto.request.CreditNoteLinkDto;
import com.titan.poss.sales.dto.request.CreditNoteRedeemDto;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CreditNoteResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface CreditNoteService {

	List<CreditNoteResponse> createNewCreditNote(CreditNoteCreateDto cnCreateDto);

	void cancelCreditNotes(List<CreditNoteDaoExt> cns);

	public List<CreditNoteDaoExt> getCreditNotesByTxnId(String txnId);

	public List<CreditNoteDaoExt> getCreditNotesBySalesTxn(SalesTxnDaoExt salesTxn);

	void cancelCnByTxnId(String txnId);

	public CreditNoteResponse redeemCreditNote(CreditNoteRedeemDto cnRedeemDto);

	public Map<String, Integer> linkCreditNote(CreditNoteLinkDto cnLinkDto);

	List<Object[]> listAllCreditNotes(Integer docNo, Short fiscalYear, String mobileNo, String locationCode,
			Boolean isUnipay, 
			String cnType, String linkedTxnId, Integer customerId, List<String> statusList, Set<String> idList,
			Boolean isFrozenRateCnRequired, String transactionId, Date fromDate, Date toDate, Pageable pageable);

	/**
	 * @param id
	 * @param locationCode
	 * @return
	 */
	CreditNoteDaoExt findByIdAndLocationCode(String id, String locationCode);

	List<CreditNoteDaoExt> findAllByMergedCNIdAndLocationCode(String mergedCN, String locationCode);

	CreditNoteDaoExt getByIdAndLocationCode(String id, String locationCode);

	/**
	 * @param creditNoteDao
	 */
	CreditNoteDaoExt saveCN(CreditNoteDaoExt creditNoteDao);

	/**
	 * @param creditNoteDao'
	 * @return a cn with new doc number and fiscal year
	 */
	CreditNoteDaoExt generateCNDetails(CreditNoteDaoExt cn, SalesDocTypeEnum cnDocType, Date docDate);

	/**
	 * @param creditNoteDao'
	 * @return a cn with new doc number and fiscal year
	 */
	CreditNoteDao generateCNDetailForDao(CreditNoteDao creditNoteDao, SalesDocTypeEnum cnDocType);

	/**
	 * @param creditNote
	 * @param transferAmount
	 */
	Map<String, CreditNoteDaoExt> transferGHSCN(CreditNoteDaoExt creditNote, BigDecimal transferAmount);

	/**
	 * @param id
	 * @param srcBtqCode
	 * @return
	 */
	CreditNoteDaoExt findByIdAndSrcLocationCode(String id, String srcBtqCode);

	/**
	 * @param ids
	 * @param cancel
	 * @param docDate             //for EOD
	 * @param utilizatedWeightMap -- if rate freezed CN is partially utilized, then
	 *                            new CN for the redeemed amount should not have
	 *                            greater weight.
	 * @return List<CreditNoteResponse>
	 */
	List<CreditNoteResponse> createNewCNFromOld(List<String> ids, CancelDaoExt cancel, Date docDate,
			Map<String, BigDecimal> utilizatedWeightMap);

	Integer getTotalCount(Integer docNo, Short fiscalYear, String mobileNo, String locationCode, Boolean isUnipay, String cnType,
			String linkedTxnId, Integer customerId, List<String> statusList, String transactionId,
			Boolean isFrozenRateCnRequired, Date fromDate, Date toDate);

	/**
	 * @param creditNote
	 * @return
	 */
	CreditNoteDaoExt saveCNWithoutLocationChange(CreditNoteDaoExt creditNote);

	/**
	 * @param ids
	 * @param locationCode
	 * @return
	 */
	List<CreditNoteDaoExt> findByIdInAndLocationCode(List<String> ids, String locationCode);

	/**
	 * @param creditNote
	 * @return
	 */
	CreditNoteDao saveCNDao(CreditNoteDao creditNote);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param encrypt
	 * @param customerId
	 * @param pageable
	 * @return
	 */
	List<Object[]> listOpenCreditNotes(Integer docNo, Short fiscalYear, String mobileNo, Integer customerId,
			Pageable pageable, Boolean isUnipay);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param encrypt
	 * @param customerId
	 * @return
	 */
	int getOpenCNCount(Integer docNo, Short fiscalYear, String mobileNo, Integer customerId,Boolean isUnipay);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param locationCode
	 * @return
	 */
	CNResponseDto getGrfCN(Integer docNo, Short fiscalYear, String locationCode);

	/**
	 * @param creditNoteDaos
	 */
	void saveAllCNs(List<CreditNoteDaoExt> creditNoteDaos);

	/**
	 * @param creditNote
	 * @return
	 */
	CreditNoteDaoExt findByDocNoAndFiscalYearAndLocationCode(CreditNoteStatusUpdateDto creditNote);

	/**
	 * This method will save the credit note without location change.
	 * 
	 * @param creditNote
	 * @return CreditNoteDao
	 */
	CreditNoteDao saveCNDaoWithOutLocationChange(CreditNoteDao creditNote);

	/**
	 * @param docNos
	 * @param fiscalYears
	 * @param locationCodes
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<CNResponseDto>> getAllCNsForDirectOperations(List<Integer> docNos, List<Short> fiscalYears,
			List<String> locationCodes, Pageable pageable);

}
