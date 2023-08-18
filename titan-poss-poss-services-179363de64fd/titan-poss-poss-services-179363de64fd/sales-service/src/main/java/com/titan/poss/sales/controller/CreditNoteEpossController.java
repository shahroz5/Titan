/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CreditNoteRequestDto;
import com.titan.poss.core.dto.CreditNoteTransferDto;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.HistorySearchTypeEnum;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.sales.dto.CreditNoteEpossDto;
import com.titan.poss.sales.dto.constants.CNOperationsEnum;
import com.titan.poss.sales.dto.constants.CNTransferStatus;
import com.titan.poss.sales.dto.constants.CNWorkFlowType;
import com.titan.poss.sales.dto.request.SalesHistoryReqDtoExt;
import com.titan.poss.sales.dto.response.CNResponeDtoExt;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.CNResponseLegacyDto;
import com.titan.poss.sales.service.CNEpossService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@RestController("salesCreditNoteEPOSSController")
@RequestMapping("sales/v2/credit-note/eposs")
public class CreditNoteEpossController {

	@Autowired
	CNEpossService cnService;

	private static final String CREDIT_NOTE_VIEW_PERMISSION = START + SalesAccessControls.CREDIT_NOTE_VIEW + END;

	private static final String CREDIT_NOTE_IBT_APPROVE_PERMISSION = START + SalesAccessControls.CREDIT_NOTE_IBT_APPROVE
			+ END;
	private static final String CREDIT_NOTE_IBT_REQUEST_PERMISSION = START + SalesAccessControls.CREDIT_NOTE_IBT_REQUEST
			+ END;
	private static final String CREDIT_NOTE_IBT_TRANSFER_PERMISSION = START
			+ SalesAccessControls.CREDIT_NOTE_IBT_TRANSFER + END;

	@ApiPageable
	@GetMapping(value = "")
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	// will be used by ui for search cn from dest. bqt
	@ApiOperation(value = "EPOSS LEVEL- API to search a CN, UI-Use ", notes = "<p style=\"color:red;font-size: 100%;\">This API needs to be run at EPOSS & will only be consumed by POSS API internally.</p>, <br/>this api can be used to search a cn in another-Boutique, at EPOSS LEVEL")
	public PagedRestResponse<List<CNResponseDto>> listCN(
			@ApiParam(name = "docNo") @RequestParam(name = "docNo", required = false) Integer docNo,
			@ApiParam(name = "fiscalYear") @RequestParam(name = "fiscalYear", required = false) Short fiscalYear,
			@ApiParam(name = "mobileNo") @RequestParam(name = "mobileNo", required = false) String mobileNo,
			@ApiParam(name = "customerId") @RequestParam(name = "customerId", required = false) Integer customerId,
			@ApiParam(name = "srcBtqCode", required = true) @RequestParam(name = "srcBtqCode", required = true) String srcBtqCode,
			@ApiIgnore Pageable pageable) {

		return cnService.listCN(docNo, fiscalYear, mobileNo, srcBtqCode, customerId, pageable);
	}

	@GetMapping(value = "/{id}")
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	@ApiOperation(value = "API get a CN,  UI-Use ", notes = "<p style=\"color:red;font-size: 100%;\">This API needs to be run at EPOSS & will only be consumed by POSS API internally.</p>, <br/>this api can be used to get the CN from another Boutique")
	// will be used by ui for get cn from dest. bqt
	public CNResponeDtoExt getCN(@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "srcBtqCode", required = true) @RequestParam(name = "srcBtqCode", required = false) String srcBtqCode) {
		return cnService.getCN(id, srcBtqCode);
	}

	@GetMapping(value = "/{id}/ibt")
	@PreAuthorize(CREDIT_NOTE_IBT_REQUEST_PERMISSION + PreAuthorizeDetails.OR + CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	@ApiOperation(value = "API get a CN", notes = "this api can be used to get the CN DAO from another Boutique")
	// called by requestCN() to send cn details to workflow
	public CreditNoteEpossDto getCreditNote(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "srcBtqCode") @RequestParam(name = "srcBtqCode", required = false) String srcBtqCode) {
		return cnService.getCreditNote(id, srcBtqCode);
	}

	@PatchMapping(value = "/{id}/ibt")
	@PreAuthorize(CREDIT_NOTE_IBT_REQUEST_PERMISSION)
	@ApiOperation(value = "API to update the CN status, processId at src btq (pending) from destination boutique", notes = "This API is used to update the CN-CNWorkflow status of SRC btq")
	// used to update the CN-CNWorkflow status of SRC btq
	public CNResponeDtoExt updateCN(@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_TRANSFER") @RequestParam(required = true) @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType,
			@ApiParam(name = "srcBtqCode", required = true) @RequestParam(name = "srcBtqCode", required = true) String srcBtqCode,
			@ApiParam(name = "processId", required = true) @RequestParam(name = "processId", required = true) String processId) {
		return cnService.updateCN(id, creditNoteWorkFlowType, srcBtqCode, processId);
	}

	@PostMapping(value = "/{id}/ibt")
	@PreAuthorize(CREDIT_NOTE_IBT_REQUEST_PERMISSION)
	// called by requestCN() from poss
	// src-- where the cn is (credit-note locationCode)
	// dest-- where the cn need to be transfered (logged in locationCode)
	@ApiOperation(value = "API to transfer a CN-IBT at Src.", notes = "this api is used to transfer a CN from src_btq to EPOSS CN transfer with PENDING status, called by requestCN from poss")
	public CreditNoteTransferDto transferCN(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_TRANSFER") @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType,
			@ApiParam(name = "srcBtqCode") @RequestParam(name = "srcBtqCode", required = true) String srcBtqCode) {
		return cnService.transferCN(id, creditNoteWorkFlowType, srcBtqCode);
	}

	@PatchMapping(value = "/{id}/ibt/transfer")
	@PreAuthorize(CREDIT_NOTE_IBT_APPROVE_PERMISSION)
	// used by SRC Btq
	@ApiOperation(value = "API to update the CN status to CN transferTable", notes = "This API is used to update the CN-CNWorkflow status of SRC btq")
	public CreditNoteTransferDto updateCNTransfer(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_TRANSFER") @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType,
			@ApiParam(name = "srcBtqCode") @RequestParam(name = "srcBtqCode", required = true) String srcBtqCode,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note-Transfer statuses ", allowableValues = "ISSUED, REJECTED") @ValueOfEnum(enumClass = CNTransferStatus.class) String cnStatus) {
		return cnService.updateCNTransfer(id, creditNoteWorkFlowType, srcBtqCode, cnStatus);
	}

	@ApiOperation(value = "API to confirm a CN-IBT in Dest.", notes = "this api is used to recieve a CN at dest. btq.,  Called by updateDestCN from poss to download cn from eposs")
	@PutMapping("/{id}/ibt/transfer")
	@PreAuthorize(CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	// called by updateDestCN from poss to download cn from eposs
	public CreditNoteTransferDto receiveCN(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_TRANSFER") @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType,
			@ApiParam(name = "destBtqCode") @RequestParam(name = "destBtqCode", required = true) String destBtqCode,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note-Transfer statuses ", allowableValues = "RECEIVED") @ValueOfEnum(enumClass = CNTransferStatus.class) String cnStatus,
			@RequestParam(name = "destCnId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String destCnId) {
		return cnService.receiveCN(id, creditNoteWorkFlowType, destBtqCode, cnStatus, destCnId);
	}

	@ApiOperation(value = "API to confirm a CN-IBT in Dest.", notes = "this api is used to recieve a CN at dest. btq.,  Called by updateDestCN from poss to download cn from eposs")
	@GetMapping("/{id}/ibt/transfer")
	@PreAuthorize(CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	// called by updateDestCN from poss to download cn from eposs
	public CreditNoteTransferDto receiveCN(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "destBtqCode") @RequestParam(name = "destBtqCode", required = true) String destBtqCode,
			@ApiParam(name = "cnTransferId", required = false) @RequestParam(name = "cnTransferId", required = false) String cnTransferId) {
		return cnService.getCNTransferResponse(id, destBtqCode, cnTransferId);
	}

	@PatchMapping(value = "/{id}/ibt/cancel")
	@PreAuthorize(CREDIT_NOTE_IBT_APPROVE_PERMISSION)
	// used by requesting Btq
	@ApiOperation(value = "API to cancel the CN transfer", notes = "This API is used to cancel the CN-CNWorkflow transfer from requesting store")
	public CNResponeDtoExt cancelCNTransfer(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {
		return cnService.cancelCNTransfer(id);
	}

	@PostMapping(value = "/ibt")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')")
	@ApiOperation(value = "API to transfer a CN from Legacy to EPOSS", notes = "this api is used to transfer a CN from Legacy to EPOSS w.r.t src Location")
	public CreditNoteTransferDto transferCNToEPOSS(@RequestBody CreditNoteRequestDto cnRequestDto) {
		return cnService.transferCNToEPOSS(cnRequestDto);
	}

	@ApiPageable
	@ApiOperation(value = "API to get a CN-IBT in destination.", notes = "this api is used by btq. CN Transfer history")
	@PostMapping("/ibt-transfer/history")
	public PagedRestResponse<List<CreditNoteTransferDto>> getCNTransferHistory(
			@ApiParam(value = "Value") @RequestParam(required = false) String searchField,
			@ApiParam(value = "Type of search", allowableValues = "MOBILE_NO, ULP_ID, GST_NO,PAN_NO, EMAIL_ID") @RequestParam(required = false) @ValueOfEnum(enumClass = HistorySearchTypeEnum.class) String searchType,
			@ApiParam(value = "CreditNote status", allowableValues = "ISSUED, RECEIVED, PENDING, REJECTED") @RequestParam(required = false) @ValueOfEnum(enumClass = CNTransferStatus.class) String status,
			@ApiParam(value = "CreditNote Type", allowableValues = "ADV, BILL_CANCELLATION, CN_IBT, GEP, GHS, GRN, TEP, EVOUCHER") @RequestParam(required = false) @ValueOfEnum(enumClass = CNType.class) String cnType,
			@ApiParam(value = "Destination Location") @RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = false) String destLocation,
			@ApiParam(value = "Source Location") @RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = false) String srcLocation,
			@RequestBody(required = false) @Validated SalesHistoryReqDtoExt creditNoteHistoryDto,
			@ApiIgnore Pageable pageable) {
		return cnService.getCNTransferHistory(searchField, searchType, status, cnType, destLocation, srcLocation,
				creditNoteHistoryDto, pageable);
	}

	@GetMapping(value = "/{id}/legacy/ibt")
	@ApiOperation(value = "API get a CN", notes = "this api can be used to get the CN DAO from another Boutique for legacy Inwarding")
	@PreAuthorize(CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	public CNResponseLegacyDto getCreditNoteLegacy(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "srcBtqCode", required = true) @RequestParam(name = "srcBtqCode", required = true) String srcBtqCode) {
		return cnService.getCreditNoteLegacy(id, srcBtqCode);
	}

	@PutMapping(value = "/{id}/legacy/ibt")
	@ApiOperation(value = "API to update the CN in legacy after inwarding", notes = "this api can be used to update the CN of legacy in EPOSS after inwarding it in the boutique")
	@PreAuthorize(CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	public BooleanResponse updateCreditNoteLegacy(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "srcBtqCode", required = true) @RequestParam(name = "srcBtqCode", required = true) String srcBtqCode,
			@ApiParam(name = "destCnId", required = true) @RequestParam(name = "destCnId", required = true) String destCnId,
			@RequestParam(name = "destLocationCode", required = false) String destLocationCode) {
		return cnService.updateCreditNoteLegacy(id, srcBtqCode, destCnId,destLocationCode);
	}

	@ApiPageable
	@GetMapping(value = "/direct-op")
	@ApiOperation(value = "EPOSS LEVEL- API to search CNs for EPOSS  user", notes = "<p style=\"color:red;font-size: 100%;\">This API needs to be run at EPOSS for searching CNs for direct operations</p>")
	public PagedRestResponse<List<CNResponseDto>> listEPOSSCN(
			@ApiParam(name = "docNo", required = false) @RequestParam(name = "docNo", required = false) Integer docNo,
			@ApiParam(name = "fiscalYear", required = true) @RequestParam(name = "fiscalYear", required = true) Short fiscalYear,
			@ApiParam(name = "locationCode", required = false) @RequestParam(name = "locationCode", required = false) String locationCode,
			@ApiIgnore Pageable pageable) {

		return cnService.listEPOSSCN(docNo, fiscalYear, locationCode, pageable);
	}

	@ApiPageable
	@ApiOperation(notes = "API to search CN through file upload", value = "This API will search CN details in EPOSS through file upload")
	@PostMapping(value = "/direct-op/file")
	public PagedRestResponse<List<CNResponseDto>> listEPOSSFileCN(
			@ApiParam(name = "reqFile", required = false) @RequestParam(required = false) MultipartFile reqFile,
			@ApiIgnore Pageable pageable) {
		return cnService.searchCNEPOSSFile(reqFile, pageable);
	}

	@ApiOperation(notes = "API for CN EPOSS operations", value = "This API will do all the EPOSS operations for the CNs")
	@PostMapping(value = "/direct-op/action")
	public List<CNResponseDto> cnEPOSSOperation(
			@ApiParam(name = "cnIds", value = "CN ids for operation", required = true) @RequestParam(required = true) List<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> cnIds,
			@ApiParam(name = "operation", value = "CN operation type", allowableValues = "ACTIVATE, SUSPEND, TRANSFER, REMOVE_GOLD_RATE, ACTIVATE_TRANSFERRED_CNS", required = true) @RequestParam(name = "operation", required = true) @ValueOfEnum(enumClass = CNOperationsEnum.class) String operation,
			@ApiParam(name = "destLocationCode", required = false) @RequestParam(required = false) String destLocationCode) {
		return cnService.cnEPOSSOperation(operation, cnIds, destLocationCode);
	}

}
