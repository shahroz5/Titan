/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.ReturnableItemsDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeCancelEnum;
import com.titan.poss.sales.dto.constants.TxnTypeCancelEnum;
import com.titan.poss.sales.dto.request.BaseGrnItemDto;
import com.titan.poss.sales.dto.request.ConfirmGRNDto;
import com.titan.poss.sales.dto.request.GRNConfirmAfterApprovalDto;
import com.titan.poss.sales.dto.request.GRNRequestDto;
import com.titan.poss.sales.dto.response.CancelAdvancePendingDto;
import com.titan.poss.sales.dto.response.CancelGRNResponseDto;
import com.titan.poss.sales.dto.response.GRNInitateResponseDto;
import com.titan.poss.sales.dto.response.GRNResponseDto;
import com.titan.poss.sales.dto.response.GrnPriceDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.service.GoodsReturnService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController("salesGRNController")
@RequestMapping(value = "sales/v2/goods-return")
public class GoodsReturnController {

	@Autowired
	private GoodsReturnService grnService;

	private static final String GRN_VIEW_PERMISSION = START + SalesAccessControls.GRN_VIEW + END;
	private static final String GRN_CONFIRM_PERMISSION = START + SalesAccessControls.GRN_CONFIRM + END;
	private static final String GRN_REQUEST_PERMISSION = START + SalesAccessControls.GRN_REQUEST + END;

	@GetMapping
	@ApiOperation(value = "API to get cash memo data", notes = "This API will get cash memo data with eligible items.<br>"
			+ "'grnCustomerId' should be used to populate customer (same with cCustomerId if same store, else it will be different)<br>"
			+ "'items' gives only eligible items which are allowed for GRN<br>"
			+ " This API internally get all cash memo related data from EPOSS if location provided is different than current location. Persist those in POSS DB for GRN txn<br>"
			+ " Even for same store, it gets grn eligible item from EPOSS as that will have items which are already done with GRN from other stores also.<br>"
			+ "")
	@PreAuthorize(GRN_VIEW_PERMISSION + AND + IS_STORE_USER)
	public GRNInitateResponseDto initateGRNWithValidation(
			@RequestParam(name = "locationCode", required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear,
			@ApiParam(name = "txnType", allowableValues = "GRN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType) {

		return grnService.initiateGRNWithValidation(locationCode, refDocNo, refFiscalYear, txnType, subTxnType);

	}

	@PostMapping
	@PreAuthorize(GRN_CONFIRM_PERMISSION + AND + IS_STORE_USER)
	// @formatter:off
	@ApiOperation(value = "API to confirm GRN W/O Approval", notes = "This API will confirm GRN without approval flow.<br><br>" 
			+ "<span style=\"font-weight: bold;font-size:14px;\">GRN Type:</span><br>"
			+ "<ul>"
			+ "	<li>REGULAR_GRN</li>"
			+ "</ul>")
	// @formatter:on
	public CancelGRNResponseDto confirmWithOutApproval(
			@ApiParam(name = "body", value = "body", required = true) @RequestBody @Valid ConfirmGRNDto confirmGRNDto,
			@ApiParam(name = "txnType", allowableValues = "GRN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType) {

		return grnService.confirmWithOutApproval(confirmGRNDto, txnType, subTxnType);
	}

	@PostMapping("price")
	@PreAuthorize(GRN_VIEW_PERMISSION + AND + IS_STORE_USER)
	// @formatter:off
	@ApiOperation(value = "API to get final price details", notes = "This API will provide price of items & foc deduction amount</br></br>"
			+ "This API will not check if item is returned or any status, assuming all those checks are done before, it will calculate & provide value.")
	// @formatter:on
	public GrnPriceDto calculateFinalPrice(
			@ApiParam(name = "body", value = "body", required = true) @RequestBody @Valid BaseGrnItemDto grnItemDto,
			@ApiParam(name = "txnType", allowableValues = "GRN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType) {

		return grnService.calculateFinalPrice(grnItemDto, txnType, subTxnType);
	}

	@PostMapping("request")
	@PreAuthorize(GRN_REQUEST_PERMISSION + AND + IS_STORE_USER)
	// @formatter:off
	@ApiOperation(value = "API for GRN approval request", notes = "This API will send approval request.<br/>"
			+ "tempFileIds' key contains file type & value contains list of file id of that file type.<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">GRN Type:</span><br>"
			+ "<ul>"
			+ "	<li>REGULAR_GRN</li>"
			+ "	<li>MFG_DEFECT</li>"
			+ "</ul>")
	// @formatter:on
	public CancelAdvancePendingDto requestForGRNApproval(
			@ApiParam(name = "body", value = "body", required = true) @RequestBody @Valid GRNRequestDto grnRequestDto,
			@ApiParam(name = "txnType", allowableValues = "GRN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType) {

		return grnService.requestForApproval(grnRequestDto, txnType, subTxnType);
	}

	@PutMapping("{id}")
	@PreAuthorize(GRN_CONFIRM_PERMISSION + AND + IS_STORE_USER)
	@ApiOperation(value = "API to confirm GRN With Approval", notes = "This API will confirm GRN with approval flow.<br><br>")
	public CancelGRNResponseDto confirmAfterApproval(
			@ApiParam(name = "id", value = "grn id", required = true) @PathVariable(name = "id", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", allowableValues = "GRN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "body", required = true) @RequestBody @Valid GRNConfirmAfterApprovalDto grnConfirmAfterApprovalDto) {

		return grnService.confirmAfterApproval(id, grnConfirmAfterApprovalDto, txnType, subTxnType);
	}

	@GetMapping("{id}")
	@PreAuthorize(GRN_VIEW_PERMISSION + AND + IS_STORE_USER)
	@ApiOperation(value = "API to get GRN Details.", notes = "This API will give GRN details by GRN Id.<br>")
	public GRNResponseDto getById(
			@ApiParam(name = "id", value = "GRN id", required = true) @PathVariable(name = "id", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", allowableValues = "GRN", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TxnTypeCancelEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "CASH_MEMO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeCancelEnum.class) String subTxnType, 
		   @ApiParam(name = "creditNoteType", value = "creditNoteType", required = false) @RequestParam(name = "creditNoteType", required = false) String creditNoteType) {
		return grnService.getById(id, txnType, subTxnType,creditNoteType);
	}

	@GetMapping("/cn/{cnId}")
	@PreAuthorize(GRN_VIEW_PERMISSION + AND + IS_STORE_USER)
	@ApiOperation(value = "API to get items not returned by CN's CM.", notes = "This API will give all items which are not yet returned for the CM.<br>")
	public ListResponse<ItemDetailsResponseDto> listReturnableItemDetailsByCreditNote(
			@ApiParam(name = "cnId", value = "CN id", required = true) @PathVariable(name = "cnId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String cnId) {
		return grnService.listItemsAllowedForReturnByGrnCn(cnId);
	}
	
	@PostMapping("/item-details/{refTxnId}")
	@PreAuthorize(GRN_VIEW_PERMISSION + AND + IS_STORE_USER)
	@ApiOperation(value = "API to get itemDetails for the CM.", notes = "This API will give all itemDetails for the CM.<br>")
	public ItemDetailsResponseDto getItemDetails(
			@ApiParam(name = "refTxnId", value = "refTxnId", required = true) @PathVariable(name = "refTxnId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String refTxnId,
			@ApiParam(name = "body", value = "body", required = true) @RequestBody @Valid ReturnableItemsDto returnableItemsDto)
	{
		return grnService.getItemDetails(refTxnId,returnableItemsDto);
	}
	
	@PutMapping("/update-grn-from-legacy")
	@ApiOperation(value = "API to update GRN from legacy to Nap", notes = "This API will update the GRN which is done in legacy to NAP.<br>")
	public void updateLegacyGrnDetails(
			@ApiParam(name = "body", value = "body", required = true) @RequestBody GrnLegacyUpdateDto grnLegacyUpdateDto) {
	 grnService.updateGrnFromLegacytoNap(grnLegacyUpdateDto);
	}

}
