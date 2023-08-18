/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.dto.CreditNoteRequestDto;
import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.CreditNoteEpossDto;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.CNResponeDtoExt;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CNResponseLegacyDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesCNEpossService")
public interface CNEpossService {

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param mobileNo
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<CNResponseDto>> listCN(Integer docNo, Short fiscalYear, String mobileNo, String srcBtqCode,
			Integer customerId, Pageable pageable);

	/**
	 * @param id
	 * @param creditNoteWorkFlowType
	 * @return
	 */
	CreditNoteTransferDto transferCN(String id, String creditNoteWorkFlowType, String srcBtqCode);

	/**
	 * @param id
	 * @param creditNoteWorkFlowType
	 * @param destCnId
	 * @return
	 */
	CreditNoteTransferDto receiveCN(String id, String creditNoteWorkFlowType, String destBtqCode, String cnStatus,
			String destCnId);

	/**
	 * @param id
	 * @param srcBtqCode
	 * @return
	 */
	CNResponeDtoExt getCN(String id, String srcBtqCode);

	/**
	 * @param id
	 * @param creditNoteWorkFlowType
	 * @param transferID
	 * @return
	 */
	CNResponeDtoExt updateCN(String id, String creditNoteWorkFlowType, String srcBtqCode, String processID);

	/**
	 * @param id
	 * @param srcBtqCode
	 * @return
	 */
	CreditNoteEpossDto getCreditNote(String id, String srcBtqCode);

	/**
	 * @param id
	 * @param creditNoteWorkFlowType
	 * @param srcBtqCode
	 * @param processId
	 * @return
	 */
	CreditNoteTransferDto updateCNTransfer(String id, String creditNoteWorkFlowType, String srcBtqCode,
			String cnStatus);

	/**
	 * @param id
	 * @param creditNoteWorkFlowType
	 * @param destBtqCode
	 * @param cnTransferId
	 * @return
	 */
	CreditNoteTransferDto getCNTransferResponse(String id, String destBtqCode, String cnTransferId);

	/**
	 * @param cnRequestDto
	 * @return
	 */
	CreditNoteTransferDto transferCNToEPOSS(CreditNoteRequestDto cnRequestDto);

	PagedRestResponse<List<CreditNoteTransferDto>> getCNTransferHistory(String searchField, String searchType,
			String status, String cnType, String destLocation, String srcLocation,
			SalesHistoryReqDtoExt creditNoteHistoryDto, Pageable pageable);

	CNResponseLegacyDto getCreditNoteLegacy(String id, String srcBtqCode);

	BooleanResponse updateCreditNoteLegacy(String id, String srcBtqCode, String destCnId,String destLocationCode);

	/**
	 * This method will cancel the request for CN transfer from destination
	 * location.
	 * 
	 * @param id
	 * @return CNResponeDtoExt
	 */
	CNResponeDtoExt cancelCNTransfer(String id);

	/**
	 * @param docNo
	 * @param fiscalYear
	 * @param locationCode
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<CNResponseDto>> listEPOSSCN(Integer docNo, Short fiscalYear, String locationCode,
			Pageable pageable);

	/**
	 * @param reqFile
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<CNResponseDto>> searchCNEPOSSFile(MultipartFile reqFile, Pageable pageable);

	/**
	 * @param operation
	 * @param cnIds
	 * @param destLocationCode
	 * @return
	 */
	List<CNResponseDto> cnEPOSSOperation(String operation, List<String> cnIds, String destLocationCode);

}
