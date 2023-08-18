/*  
x * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.sales.controller.AdvanceController.ACCEPT_ADVANCE_GRF_MERGE_PERMISSION;

import java.util.List;
import java.util.Set;

import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.CreditNoteStatusUpdateDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.CreditNoteEntitiesDto;
import com.titan.poss.sales.dto.constants.BoutiqueApproverStatus;
import com.titan.poss.sales.dto.constants.CNWorkFlowType;
import com.titan.poss.sales.dto.request.ConfirmEGHSRequestDto;
import com.titan.poss.sales.dto.request.ConfirmRequestDto;
import com.titan.poss.sales.dto.request.RemarksBaseDto;
import com.titan.poss.sales.dto.request.RequestWorkflowCNDto;
import com.titan.poss.sales.dto.response.CNRefundResponeDto;
import com.titan.poss.sales.dto.response.CNResponeDtoExt;
import com.titan.poss.sales.dto.response.CNResponseDto;
import com.titan.poss.sales.dto.response.WorkflowBaseResponse;
import com.titan.poss.sales.service.CreditNoteFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("salesCreditNoteController")
@RequestMapping("sales/v2/credit-note")
@PreAuthorize(IS_STORE_USER)
public class CreditNoteController {

	@Autowired
	CreditNoteFacade cnFacade;

	//check this ACL
	private static final String CREDIT_NOTE_ADD_EDIT_PERMISSION = START + SalesAccessControls.CREDIT_NOTE_ADD_EDIT + END;
	private static final String CREDIT_NOTE_VIEW_PERMISSION = START + SalesAccessControls.CREDIT_NOTE_VIEW + END;
	private static final String CREDIT_NOTE_ACTIVATION_REQUEST_PERMISSION = START
			+ SalesAccessControls.CREDIT_NOTE_CANCEL_REQUEST + END + OR + START
			+ SalesAccessControls.CREDIT_NOTE_IBT_REQUEST + END + OR + START
			+ SalesAccessControls.CREDIT_NOTE_ACTIVATION_REQUEST + END + OR + START
			+ SalesAccessControls.CREDIT_NOTE_GOLD_RATE_REMOVAL_REQUEST + END;

	private static final String CREDIT_NOTE_ACTIVATION_CONFIRM_PERMISSION = START
			+ SalesAccessControls.CREDIT_NOTE_ACTIVATION_CONFIRM + END + OR + START
			+ SalesAccessControls.CREDIT_NOTE_GOLD_RATE_REMOVAL_CONFIRM + END + OR + START
			+ SalesAccessControls.CREDIT_NOTE_CANCEL_CONFIRM + END + OR + START
			+ SalesAccessControls.CREDIT_NOTE_GHS_TRANSFER + END;

	private static final String CREDIT_NOTE_CANCEL_REQUEST_PERMISSION = "hasPermission(#creditNoteWorkFlowType,'CREDIT_NOTE_CANCELLATION')"
			+ AND + START + SalesAccessControls.CREDIT_NOTE_CANCEL_REQUEST + END + OR
			+ "hasPermission(#creditNoteWorkFlowType,'CREDIT_NOTE_GOLD_RATE_REMOVE')" + AND + START
			+ SalesAccessControls.CREDIT_NOTE_GOLD_RATE_REMOVAL_REQUEST + END + OR
			+ "hasPermission(#creditNoteWorkFlowType,'CREDIT_NOTE_TRANSFER')" + AND + START
			+ SalesAccessControls.CREDIT_NOTE_IBT_REQUEST + END + OR
			+ "hasPermission(#creditNoteWorkFlowType,'CREDIT_NOTE_ACTIVATE')" + AND + START
			+ SalesAccessControls.CREDIT_NOTE_ACTIVATION_REQUEST + END;

	private static final String CREDIT_NOTE_IBT_APPROVE_PERMISSION = START + SalesAccessControls.CREDIT_NOTE_IBT_APPROVE
			+ END;
	private static final String CREDIT_NOTE_IBT_TRANSFER_PERMISSION = START
			+ SalesAccessControls.CREDIT_NOTE_IBT_TRANSFER + END;

	private static final String CREDIT_NOTE_GHS_TRANSFER_PERMISSION = START
			+ SalesAccessControls.CREDIT_NOTE_GHS_TRANSFER + END;
	
	private static final String CREDIT_NOTE_CANCEL_CONFIRM_PERMISSION = START
			+ SalesAccessControls.CREDIT_NOTE_CANCEL_CONFIRM + END;

	private static final String CREDIT_NOTE_DOWNLOAD_PERMISSION = START + SalesAccessControls.CREDIT_NOTE_DOWNLOAD
			+ END;

	@ApiPageable
	@GetMapping
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	@ApiOperation(value = "API to search a CN", notes = "this api can be used to search a cn"
			+ "<br/> *****if you dont pass location code search happen against logged in location or for current boutique ********"
			+ "<br/>  ** api will list cn's other than redeemed if no status is passed, if status is passed then respective cn's will be listed.**"
			+ "<br/>  ** <b>NOTE:</b> "
			+ "<br/>        	1. Pass 'isFrozenRateCnRequired' as false, to get Credit notes valid for direct redemption (ie, API lists all credit notes excepte GRF & GRN credit notes)."
			+ "<br/>        	2. Pass 'isFrozenRateCnRequired' as true, to get rate freezed Credit notes (ie, API lists only GRF & GRN credit notes)."
			+ "<br/>        	3. Pass 'isFrozenRateCnRequired' is not passed or it's passed as null, then all credit notes will be listed."
			+ "<br/><br/><span style=\"font-size:14px;\">To know Fields required based on payment code: Refer "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/CreditNoteDiscountDetails.json\">"
			+ "		CREDIT NOTE - DISCOUNT DETAILS JSON" + "	</a><br/>" + "</span><br>")
	public PagedRestResponse<List<CNResponseDto>> listCN(
			@ApiParam(name = "docNo") @RequestParam(name = "docNo", required = false) Integer docNo,
			@ApiParam(name = "fiscalYear") @RequestParam(name = "fiscalYear", required = false) Short fiscalYear,
			@ApiParam(name = "mobileNo") @RequestParam(name = "mobileNo", required = false) String mobileNo,
			@ApiParam(name = "linkedTxnId") @RequestParam(name = "linkedTxnId", required = false) String linkedTxnId,
			@RequestParam(name = "isUnipay", required = false) Boolean isUnipay,
			@ApiParam(name = "customerId") @RequestParam(name = "customerId", required = false) Integer customerId,
			@ApiParam(name = "locationCode", required = false) @RequestParam(name = "locationCode", required = false) String locationCode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiParam(name = "status", required = false) @RequestParam(name = "status", required = false) List<String> statusList,
			@ApiParam(name = "cnType", required = false) @RequestParam(name = "cnType", required = false) String cnType,
			@ApiParam(name = "ids", required = false) @RequestParam(name = "ids", required = false) Set<@PatternCheck(regexp = RegExConstants.UUID_REGEX) String> ids,
			@RequestParam(name = "isFrozenRateCnRequired", required = false) Boolean isFrozenRateCnRequired,
			@ApiParam(name = "transactionId", value = "Provide 'transaction Id' for which the payment is done", required = false) @RequestParam(name = "transactionId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String transactionId,
			@RequestParam(name = "fromDate", required = false) @Positive Long fromDate,
			@RequestParam(name = "toDate", required = false) @Positive Long toDate,
			@ApiIgnore Pageable pageable) {
		return cnFacade.listCN(docNo, fiscalYear, mobileNo, locationCode, isUnipay, cnType, linkedTxnId, customerId, isPageable,
				statusList == null || statusList.isEmpty() ? null : statusList, ids, isFrozenRateCnRequired,
				transactionId, fromDate, toDate, pageable);

	}

	@ApiPageable
	@GetMapping(value = "/payments")
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	@ApiOperation(value = "API to search a CN", notes = "this api can be used to search a cn for payments"
			+ "<br/> *****if you dont pass location code search happen against logged in location or for current boutique ********"
			+ "<br/>  ** api will list all open CNS for a customer, which are not linked to any transactions **"
			+ "<br/><span style=\"font-size:14px;\">To know Fields required based on payment code: Refer "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/CreditNoteDiscountDetails.json\">"
			+ "		CREDIT NOTE - DISCOUNT DETAILS JSON" + "	</a><br/>" + "</span><br>")

	public PagedRestResponse<List<CNResponseDto>> listCNforPayments(
			@ApiParam(name = "docNo") @RequestParam(name = "docNo", required = false) Integer docNo,
			@ApiParam(name = "fiscalYear") @RequestParam(name = "fiscalYear", required = false) Short fiscalYear,
			@ApiParam(name = "mobileNo") @RequestParam(name = "mobileNo", required = false) String mobileNo,
			@ApiParam(name = "linkedTxnId") @RequestParam(name = "linkedTxnId", required = false) String linkedTxnId,
			@ApiParam(name = "customerId") @RequestParam(name = "customerId", required = false) Integer customerId,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return cnFacade.listCNforPayments(docNo, fiscalYear, mobileNo, linkedTxnId, customerId, isPageable, pageable);

	}

	@GetMapping(value = "/{id}")
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	@ApiOperation(value = "API get a CN", notes = "this api can be used to find a CN details based on the id."
			+ "<br/><span style=\"font-size:14px;\">To know Fields required based on payment code: Refer "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/CreditNoteDiscountDetails.json\">"
			+ "		CREDIT NOTE - DISCOUNT DETAILS JSON" + "	</a><br/>" + "</span><br>")
	public CNResponeDtoExt getCN(@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "locationCode", required = false) @RequestParam(name = "locationCode", required = false) String locationCode) {
		return cnFacade.getCN(id, locationCode);
	}

	// eposs to poss sync should happen else in btq it will list as sync didnt
	// happen
	@PostMapping(value = "/{id}/request")
	@PreAuthorize(CREDIT_NOTE_ACTIVATION_REQUEST_PERMISSION)
	@ApiOperation(value = "API to request a CN for a workflow", notes = "this api is used to request for approval, which interacts with workflow service")
	public WorkflowBaseResponse requestCN(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody RequestWorkflowCNDto remarksDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_CANCELLATION, CREDIT_NOTE_GOLD_RATE_REMOVE, CREDIT_NOTE_TRANSFER, CREDIT_NOTE_ACTIVATE") @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType) {
		// call to workflow api and make status to pending
		return cnFacade.requestCN(id, remarksDto, creditNoteWorkFlowType);
	}

	@ApiOperation(value = "API to confirm a CN", notes = "this api can be used to update a cn  only if a status is APPROVED/ (CNTYPE-BILLCANCELLATION- GENERATED)"
			+ "<br/><span style=\"font-size:14px;\">To know Fields required for payment details "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/CnRefundsPaymentDetails.json\">"
			+ "		PAYMENT DETAILS JSON" + "	</a><br/>" + "</span><br>")
	@PutMapping("/{id}/request")
	@PreAuthorize(CREDIT_NOTE_ACTIVATION_CONFIRM_PERMISSION)
	public CNResponeDtoExt confirmCN(@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody ConfirmRequestDto raiseRequestDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_CANCELLATION, CREDIT_NOTE_GOLD_RATE_REMOVE, CREDIT_NOTE_ACTIVATE") @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType) {
		return cnFacade.confirmCN(id, raiseRequestDto, creditNoteWorkFlowType);
	}

	@ApiOperation(value = "API to cancel Request raised for a CN", notes = "this api can be used to cancel the request raised for the workflow before APPROVAL")
	@PutMapping("/{id}/cancel")
	@PreAuthorize(CREDIT_NOTE_CANCEL_REQUEST_PERMISSION)
	public CNResponeDtoExt cancelRequest(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody RemarksBaseDto remarksDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_CANCELLATION, CREDIT_NOTE_GOLD_RATE_REMOVE, CREDIT_NOTE_TRANSFER, CREDIT_NOTE_ACTIVATE") @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType) {
		return cnFacade.cancelRequest(id, remarksDto, creditNoteWorkFlowType);
	}

	@ApiOperation(value = "API to approve a IBT-CN for SRC location", notes = "this api is used by (cn location) btq to approve/reject a CN.")
	@PostMapping("/{id}/request/ibt")
	@PreAuthorize(CREDIT_NOTE_IBT_APPROVE_PERMISSION)
	public void updateSrcCN(@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody RemarksBaseDto remarksDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_TRANSFER") @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType,
			@RequestParam(required = true) @ApiParam(required = true, value = "APPROVER status", allowableValues = "APPROVED, REJECTED") @ValueOfEnum(enumClass = BoutiqueApproverStatus.class) String status) {
		cnFacade.updateSrcCN(id, remarksDto, creditNoteWorkFlowType, status);
	}

	@ApiOperation(value = "API to confirm a IBT-CN for DEST location", notes = "this api used by (requesting btq) to update a cn  only if a status is APPROVED/ (CNTYPE-BILLCANCELLATION- GENERATED)")
	@PutMapping("/{id}/request/ibt")
	@PreAuthorize(CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	public CNResponeDtoExt updateDestCN(@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody RemarksBaseDto remarksDto,
			@RequestParam(required = true) @ApiParam(required = true, value = "Credit-Note Work-Flow Type ", allowableValues = "CREDIT_NOTE_TRANSFER") @ValueOfEnum(enumClass = CNWorkFlowType.class) String creditNoteWorkFlowType) {

		return cnFacade.updateDestCN(id, remarksDto, creditNoteWorkFlowType);
	}

	@ApiOperation(value = "API to call EGHS", notes = "this api can be used to transfer CN to GHS")
	@PutMapping(value = "/{id}/ghs")
	@PreAuthorize(CREDIT_NOTE_GHS_TRANSFER_PERMISSION)
	public CNResponeDtoExt transferToEghs(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody ConfirmEGHSRequestDto raiseRequestDto) {
		return cnFacade.transferToEghs(id, raiseRequestDto);
	}

	@ApiOperation(value = "API to call EGHS", notes = "this api is used to download/pull back the cn, from eghs")
	@PatchMapping(value = "/{id}/ghs")
	@PreAuthorize(CREDIT_NOTE_DOWNLOAD_PERMISSION)
	public CNResponeDtoExt downloadCNfromEGHS(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "ghsDocNo", value = "ghs doc number available in download list", required = true) @RequestParam(name = "ghsDocNo", required = true) int ghsDocNo) {
		return cnFacade.downloadCNfromEGHS(id, ghsDocNo);
	}

	@GetMapping(value = "/grf")
	@PreAuthorize(ACCEPT_ADVANCE_GRF_MERGE_PERMISSION)
	@ApiOperation(value = "API to search a GRF CN for merging", notes = "this api can be used to search a GRF cn.<br/>"
			+ "Input docNo & fiscal year are of credit note, not sales transaction." + "<br/> *")
	public CNResponseDto getGrfCN(
			@ApiParam(name = "docNo", value = "GRF CN docNo", required = true) @RequestParam(name = "docNo", required = true) Integer docNo,
			@ApiParam(name = "fiscalYear", value = "GRF CN fiscalYear", required = true) @RequestParam(name = "fiscalYear", required = true) Short fiscalYear) {
		return cnFacade.getGrfCN(docNo, fiscalYear);

	}

	@PostMapping(value = "/ghs")
	@ApiOperation(value = "API to call EGHS", notes = "this api is used to download/pull back the cn, from eghs")
	@PreAuthorize(CREDIT_NOTE_DOWNLOAD_PERMISSION)
	public CNResponeDtoExt downloadCNfromEGHS(@RequestBody List<CreditNoteStatusUpdateDto> creditNoteStatusUpdateList) {
		return cnFacade.downloadCNfromEGHS(creditNoteStatusUpdateList);

	}

	@ApiOperation(value = "API to cancel CN without approval", notes = "this api can be used to cancel CN without approval"
			+ "<br/><span style=\"font-size:14px;\">To know Fields required for payment details "
			+ "	<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/CnRefundsPaymentDetails.json\">"
			+ "		PAYMENT DETAILS JSON" + "	</a><br/>" + "</span><br>")
	@PutMapping(value = "/{id}/cancellation")
	@PreAuthorize(CREDIT_NOTE_CANCEL_CONFIRM_PERMISSION)
	public CNResponeDtoExt transferToEghs(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestBody ConfirmRequestDto raiseRequestDto) {
		return cnFacade.cancelCreditNote(id, raiseRequestDto);
	}

	@ApiOperation(value = "API to Inward a CN From Legacy in NAP boutique", notes = "this api can be used to Inward Legacy CN in NAP Boutique")
	@PostMapping(value = "/{id}/legacy/ibt")
	@PreAuthorize(CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	public CNResponeDtoExt inwardLegacyCN(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@ApiParam(name = "srcLocationCode", value = "Location from which the CN needs to be inwarded", required = true) @RequestParam(name = "srcLocationCode", required = true) String srcLocationCode) {
		return cnFacade.inwardLegacyCN(id, srcLocationCode);
	}

	@PutMapping(value = "/legacy/ibt")
	@ApiOperation(value = "API update CN after transfering to legacy", notes = "this api can be used to update the CN after transferring it to Legacy")
	@PreAuthorize(CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	public BooleanResponse updateCreditNoteLegacy(
			@ApiParam(name = "id", required = true) @RequestParam(name = "id", required = true) String id,
			@ApiParam(name = "srcBtqCode", required = true) @RequestParam(name = "srcBtqCode", required = true) String srcBtqCode, 
			@RequestParam(name = "destLocationCode", required = true) String destLocationCode) {
		return cnFacade.updateCreditNoteLegacy(id, srcBtqCode,destLocationCode);
	}

	@GetMapping(value = "/legacy/ibt")
	@ApiOperation(value = "API to transfer a CN from EPOSS to Legacy", notes = "this api is used to transfer a CN from EPOSS to Legacy w.r.t src Location")
	@PreAuthorize(CREDIT_NOTE_IBT_TRANSFER_PERMISSION)
	public CreditNoteEntitiesDto getCreditNoteDetailsForLegacy(
			@ApiParam(name = "id", value = "id of the credit note", required = true) @RequestParam(name = "id", required = true) String id) {
		return cnFacade.getCreditNoteEntities(id);
	}

	@ApiOperation(value = "API to caluculate CN refund amount", notes = "API to caluculate CN refund amount")
	@GetMapping(value = "/{id}/price")
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	public CNRefundResponeDto calculateCNRefundAmount(
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id) {
		return cnFacade.calculateCNRefundAmount(id);
	}
	
	@ApiOperation(value = "API to update CN status for voided payments", notes = "This API will update the credit note status and in the payment refund table for voided payments")
	@GetMapping(value = "/{creditNoteId}/cn-void")
	@PreAuthorize(CREDIT_NOTE_VIEW_PERMISSION)
	public void voidedCNAndPaymentUpdate(
			@PathVariable("creditNoteId") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String creditNoteId) {
		cnFacade.voidedCNAndPaymentUpdate(creditNoteId);
	}

	
}
