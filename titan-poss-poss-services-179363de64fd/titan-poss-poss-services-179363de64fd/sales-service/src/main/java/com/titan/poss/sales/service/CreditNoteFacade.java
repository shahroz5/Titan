/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.CreditNoteStatusUpdateDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CreditNoteEntitiesDto;
import com.titan.poss.sales.dto.request.ConfirmEGHSRequestDto;
import com.titan.poss.sales.dto.request.ConfirmRequestDto;
import com.titan.poss.sales.dto.request.RemarksBaseDto;
import com.titan.poss.sales.dto.request.RequestWorkflowCNDto;
import com.titan.poss.sales.dto.response.CNRefundResponeDto;
import com.titan.poss.sales.dto.response.CNResponeDtoExt;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.WorkflowBaseResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesCNService")
public interface CreditNoteFacade {

	PagedRestResponse<List<CNResponseDto>> listCN(Integer docNo, Short fiscalYear, String mobileNo, String locationCode,Boolean isUnipay,
			String cnType, String linkedTxnId, Integer customerId, Boolean inPageable, List<String> statusList,
			Set<String> idList, Boolean isFrozenRateCnRequired, String transactionId, Long fromDateInLong, Long toDateInLong, Pageable pageable);

	/**
	 * @param id
	 * @return
	 */
	CNResponeDtoExt getCN(String id, String locationCode);

	/**
	 * @param id
	 * @param id
	 * @return
	 */
	WorkflowBaseResponse requestCN(String id, RequestWorkflowCNDto cnRequestDto, String cNWrokflowType);

	/**
	 * @param id
	 * @param raiseRequestDto
	 * @return
	 */
	CNResponeDtoExt confirmCN(String id, ConfirmRequestDto raiseRequestDto, String cNWrokflowType);

	/**
	 * @param id
	 * @param ghsDocNo
	 * @return
	 */
	CNResponeDtoExt downloadCNfromEGHS(String id, int ghsDocNo);

	/**
	 * @param id
	 * @param remarksDto
	 * @param creditNoteWorkFlowType
	 * @return
	 */
	CNResponeDtoExt cancelRequest(String id, RemarksBaseDto remarksDto, String creditNoteWorkFlowType);

	/**
	 * @param id
	 * @param raiseRequestDto
	 * @param creditNoteWorkFlowType
	 * @return
	 */
	void updateSrcCN(String id, RemarksBaseDto remarksDto, String creditNoteWorkFlowType, String status);

	/**
	 * @param id
	 * @param remarksDto
	 * @param creditNoteWorkFlowType
	 * @param status
	 * @return
	 */
	CNResponeDtoExt updateDestCN(String id, RemarksBaseDto remarksDto, String creditNoteWorkFlowType);

	/**
	 * @param id
	 * @param raiseRequestDto
	 * @return
	 */
	CNResponeDtoExt transferToEghs(String id, ConfirmEGHSRequestDto raiseRequestDto);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param mobileNo
	 * @param linkedTxnId
	 * @param customerId
	 * @return
	 */
	PagedRestResponse<List<CNResponseDto>> listCNUsingLocation(Integer docNo, Short fiscalYear, String mobileNo,
			String locationCode, Boolean isUnipay,String cnType, String linkedTxnId, Integer customerId, Boolean isPageable,
			List<String> statusList, Set<String> idList, Boolean isFrozenRateCnRequired, String transactionId,
			Date fromDate, Date toDate, Pageable pageable);
	

	/**
	 * @param ids
	 * @param salesTxn
	 * @param customerId
	 * @param remarks
	 * @param docCount
	 * @return
	 */
	CNResponeDtoExt mergeCNForGRF(List<String> ids, SalesTxnDaoExt salesTxn, Integer customerId, String remarks,
			int docCount);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param mobileNo
	 * @param locationCode
	 * @param linkedTxnId
	 * @param customerId
	 * @param isPageable
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<CNResponseDto>> listCNforPayments(Integer docNo, Short fiscalYear, String mobileNo,
			String linkedTxnId, Integer customerId, Boolean isPageable, Pageable pageable);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param mobileNo
	 * @return
	 */
	CNResponseDto getGrfCN(Integer docNo, Short fiscalYear);

	/**
	 * @param creditNoteStatusUpdateDto
	 * @return
	 */
	CNResponeDtoExt downloadCNfromEGHS(List<CreditNoteStatusUpdateDto> creditNoteStatusUpdateDtoList);

	PublishResponse updateDestCNTransactional(String id, RemarksBaseDto remarksDto, String creditNoteWorkFlowType);

	PublishResponse downloadCNfromEGHSTransactional(String id, int ghsDocNo);

	PublishResponse downloadCNfromEGHSTransactional(List<CreditNoteStatusUpdateDto> creditNoteStatusUpdateDtoList);

	PublishResponse transferToEghsTransactional(String id, ConfirmEGHSRequestDto raiseRequestDto);

	/**
	 * @param id
	 * @param raiseRequestDto
	 * @return
	 */
	CNResponeDtoExt cancelCreditNote(String id, ConfirmRequestDto raiseRequestDto);

	CNResponeDtoExt inwardLegacyCN(String id, String srcLocationCode);

	BooleanResponse updateCreditNoteLegacy(String id, String srcBtqCode,String destLocationCode);

	CreditNoteEntitiesDto getCreditNoteEntities(String id);

	/**
	 * @param id
	 * @return
	 */
	CNRefundResponeDto calculateCNRefundAmount(String id);

	/**
	 * This method will update creditNote status to VOIDED for which CN cancellation is done and payment is
	 * voided at UI with third party integration and add record to 'payment_refunds'
	 * table to subtract the amount from revenue.
	 * @param creditNoteId
	 */
	void voidedCNAndPaymentUpdate(String creditNoteId);

}
