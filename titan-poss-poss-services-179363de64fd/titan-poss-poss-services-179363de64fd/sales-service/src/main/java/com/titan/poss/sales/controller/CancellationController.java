
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.dto.CancellationListDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeCancelEnum;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.request.CancelRequestDto;
import com.titan.poss.sales.dto.request.ConfirmCancelAfterApprovalDto;
import com.titan.poss.sales.dto.request.ConfirmCancelDto;
import com.titan.poss.sales.dto.response.CancelAdvancePendingDto;
import com.titan.poss.sales.dto.response.CancelAdvanceResponseDto;
import com.titan.poss.sales.service.CancellationService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Cancellation Controller class.
 * 
 * This APIs' is for canceling cash memo or gift card or GEP
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesCancellationController")
@RequestMapping(value = "sales/v2/cancels")
public class CancellationController {

	@Autowired
	CancellationService cancelService;

	// @formatter:off
	private static final String BILL_CANCELLATION_CONFIRM_PERMISSION = 
			"hasPermission(#subTxnType,'CASH_MEMO')" + AND + START + SalesAccessControls.BILL_CANCELLATION_CONFIRM + END + OR + 
			"hasPermission(#subTxnType,'GIFT_SALE')" + AND + START + SalesAccessControls.GIFT_CARD_CANCEL + END + OR + 
			"hasPermission(#subTxnType,'GEP')" + AND + START + SalesAccessControls.GEP_CANCEL + END+ OR + 
			"hasPermission(#subTxnType,'TEP')" + AND + START + SalesAccessControls.TEP_CANCEL + END;
	
	private static final String BILL_CANCELLATION_VIEW_PERMISSION = 
			"hasPermission(#subTxnType,'CASH_MEMO')" + AND + START + SalesAccessControls.CASH_MEMO_VIEW + END + OR + 
			"hasPermission(#subTxnType,'GIFT_SALE')" + AND + START + SalesAccessControls.GIFT_CARD_HISTORY + END + OR + 
			"hasPermission(#subTxnType,'GEP')"	+ AND + START + SalesAccessControls.GEP_VIEW + END + OR + 
			"hasPermission(#subTxnType,'TEP')"	+ AND + START + SalesAccessControls.TEP_VIEW + END;
	
	
	private static final String BILL_CANCELLATION_REQUEST_PERMISSION = 
			"hasPermission(#subTxnType,'CASH_MEMO')" + AND + START + SalesAccessControls.BILL_CANCELLATION_REQUEST_VIEW + END ;
	// @formatter:om

	// @formatter:off
	@ApiPageable
	@GetMapping
	@ApiOperation(value = "API to list cash memo/GEP/TEP which can be cancelled", notes = "This API will return eligible cash memo/GEP which can be cancelled.<br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">txn type : BCN :-</span><br>"
			+ "<ul>"
			+ "It will list CM for which action has not been taken or got rejected.<br>"
			+ "It will not list CM for which status is Pending with Approver, or Approved.<br>"
			+ "If for any record billCancellationId is null, that means bill cancellation is not initiated once also<br><br>"
			+ "Use refTxnId, create a new bill cancellation."
			+ "</ul>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">txn type : GEPCAN/TEPCAN :-</span><br>"
			+ "<ul>"
			+ "It will list all **CONFIRMED,OPEN,HOLD,CANCELLED** GEP/TEP transactions.<br>"
			+ "Here **txnType** should be **GEPCAN** for the subTxnType **GEP** and **txnType** should be **TEPCAN** "
			+ "for the subTxnType **TEP**<br>"
			+ "Based on **docNo**,**customer mobile no**,**fiscal year**, **doc date** search is available.<br>"
			+ "**doc date** format should be in **EPOCH - in milliseconds(Ex: 706320000000)**")
	// @formatter:on
	@PreAuthorize(BILL_CANCELLATION_VIEW_PERMISSION)
	public PagedRestResponse<List<CancellationListDto>> listBillCancel(
			@ApiParam(name = "txnType", allowableValues = "CMCAN, GEPCAN, TEPCAN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO, GIFT_SALE, GEP, TEP", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType,
			@RequestParam(name = "refDocNo", required = false) Integer refDocNo,
			@RequestParam(name = "customerName", required = false) String customerName,
			@RequestParam(name = "customerMobileNo", required = false) @PatternCheck(regexp = RegExConstants.MOBILE_REGEX) String customerMobileNo,
			@RequestParam(name = "fiscalYear", required = false) Short fiscalYear,
			@RequestParam(name = "docDate", required = false) @Positive Long docDate, @ApiIgnore Pageable pageable) {
		return cancelService.listBillCancel(refDocNo, customerName, txnType, subTxnType, customerMobileNo, fiscalYear,
				docDate, pageable);

	}

	@GetMapping(value = "/bills/{refTxnId}/cancel-types")
	@PreAuthorize(BILL_CANCELLATION_VIEW_PERMISSION)
	@ApiOperation(value = "API to list elligible cancellation types", notes = "This API will return eligible cancellation types based on refTxnId.<br>"
			+ "It will check based on payment mode used in for CM it will return elligible cancel type.<br>")
	public ListResponse<CancellationTypeEnum> listAllowedCancelTypes(
			@ApiParam(name = "txnType", allowableValues = "CMCAN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO, GIFT_SALE", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType,
			@ApiParam(name = "refTxnId", required = true) @PathVariable("refTxnId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String refTxnId) {
		return cancelService.listAllowedCancelTypes(refTxnId, txnType, subTxnType);

	}

	@PostMapping
	// @formatter:off
	@ApiOperation(value = "API to cancel bill/GEP/TEP", notes = "This API will cancel existing CM for the same day without approval flow.<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Bill Cancellation Cancel Type:</span><br>" 
			+ "<ul>"
			+ "	<li>CANCEL_WITH_RETURN</li>"
			+ "	<li>CANCEL_WITH_CN</li>"
			+ "</ul>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">GEP/TEP Cancel Type:</span><br>"
			+ "This API will cancel existing GEP/TEP based on id."
			+ "<ul>"
			+ " <li>cancelType will be null for GEP/TEP cancel</li>"
			+ "</ul>"
			+ "<b>Note 1 : </b>Here **txnType** should be **GEPCAN** and subTxnType should be **GEP**.<br>"
			+ "<b>Note 2 : </b>Here **txnType** should be **TEPCAN** and subTxnType should be **TEP**.<br>")
	// @formatter:on
	@PreAuthorize(BILL_CANCELLATION_CONFIRM_PERMISSION)
	public CancelAdvanceResponseDto confirmCancel(
			@ApiParam(name = "body", value = "Provide bill/GEP cancellation related fields", required = true) @RequestBody @Valid ConfirmCancelDto confirmCancelDto,
			@ApiParam(name = "txnType", allowableValues = "CMCAN, GEPCAN, TEPCAN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO, GIFT_SALE, GEP, TEP", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType) {
		
		return cancelService.confirmCancel(confirmCancelDto, txnType, subTxnType);
	}

	/**
	 * This method will raise request for CM bill cancellation.
	 * 
	 * @param cancelRequestDto
	 * @param txnType
	 * @param subTxnType
	 * @return CancelAdvancePendingDto
	 */
	@PostMapping("request")
	// @formatter:off
	@ApiOperation(value = "API to request for cancel bill", notes = "This API will request to cancel existing CM with approval flow.<br>" 
			+ "<span style=\"font-weight: bold;font-size:14px;\">Request flow to be used only when txn time exceeds configured time, within which txn can be closed directly.</span><br>")
	// @formatter:on
	@PreAuthorize(BILL_CANCELLATION_REQUEST_PERMISSION)
	public CancelAdvancePendingDto requestForBillCancelApproval(
			@ApiParam(name = "body", value = "Provide bill cancellation request related fields", required = true) @RequestBody @Valid CancelRequestDto cancelRequestDto,
			@ApiParam(name = "txnType", allowableValues = "CMCAN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType) {
		return cancelService.requestForBillCancelApproval(cancelRequestDto, txnType, subTxnType);
	}

	/**
	 * This method will cancel the request raised.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 */
	@DeleteMapping("request/{id}")
	// @formatter:off
	@ApiOperation(value = "API to cancel request", notes = "This API will cancel the request sent for bill cancellation.<br><br>" )
	// @formatter:on
	@PreAuthorize(BILL_CANCELLATION_REQUEST_PERMISSION)
	public void cancelPendingRequest(
			@ApiParam(name = "id", value = "Cancel id", required = true) @PathVariable(name = "id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", allowableValues = "CMCAN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType) {
		cancelService.cancelPendingRequest(id, txnType, subTxnType);
	}

	/**
	 * this method will confirm cancel once request is approved.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param confirmCancelAfterApprovalDto
	 * @return CancelAdvanceResponseDto
	 */
	@PutMapping("{id}")
	// @formatter:off
	@ApiOperation(value = "API to cancel bill after request is approved.", notes = "This API will cancel the bill after approval.<br><br>" 
			+ "<span style=\"font-weight: bold;font-size:14px;\">Bill Cancellation Cancel Type:</span><br>"
			+ "This API will cancel existing CM after approval.<br><br>" 
			+ "<ul>"
			+ "	<li>CANCEL_WITH_RETURN</li>"
			+ "	<li>CANCEL_WITH_CN</li>"
			+ "</ul>")
	// @formatter:on
	@PreAuthorize(BILL_CANCELLATION_CONFIRM_PERMISSION)
	public CancelAdvanceResponseDto confirmAfterApproval(
			@ApiParam(name = "id", value = "Cancel id", required = true) @PathVariable(name = "id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", allowableValues = "CMCAN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "Provide bill cancellation request related fields", required = true) @RequestBody @Valid ConfirmCancelAfterApprovalDto confirmCancelAfterApprovalDto) {
		return cancelService.confirmAfterApproval(id, txnType, subTxnType, confirmCancelAfterApprovalDto);
	}

}
