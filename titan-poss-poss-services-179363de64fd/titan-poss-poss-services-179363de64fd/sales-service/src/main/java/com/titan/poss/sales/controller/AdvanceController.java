/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.AdvanceConfirmDto;
import com.titan.poss.sales.dto.request.AdvanceMergeDto;
import com.titan.poss.sales.dto.request.AdvanceUpdateDto;
import com.titan.poss.sales.dto.response.AdvMergeResDto;
import com.titan.poss.sales.dto.response.AdvanceDto;
import com.titan.poss.sales.dto.response.CancelAdvanceResponseDto;
import com.titan.poss.sales.dto.response.GRFLiteDto;
import com.titan.poss.sales.dto.response.TransactionResponseDto;
import com.titan.poss.sales.service.AdvanceService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesAdvanceController")
@RequestMapping(value = "sales/v2/advances")
public class AdvanceController {

	@Autowired
	AdvanceService advanceService;

	// @formatter:off
	private static final String FROZEN_DETAIL_TYPE = "hasPermission(#subTxnType,'FROZEN_RATES')";
	private static final String NON_FROZEN_DETAIL_TYPE = "hasPermission(#subTxnType,'NON_FROZEN_RATES')";
	private static final String MANUAL_FROZEN_RATES_TYPE = "hasPermission(#subTxnType,'MANUAL_FROZEN_RATES')";

	private static final String ACCEPT_ADVANCE_VIEW_PERMISSION = FROZEN_DETAIL_TYPE + AND + START
			+ SalesAccessControls.GRF_VIEW + END + OR + NON_FROZEN_DETAIL_TYPE + AND + START
			+ SalesAccessControls.ACCEPT_ADVANCE_VIEW + END + OR + MANUAL_FROZEN_RATES_TYPE + AND + START
			+ SalesAccessControls.GRF_VIEW + END;
	private static final String ACCEPT_ADVANCE_ADD_EDIT_PERMISSION = FROZEN_DETAIL_TYPE + AND + START
			+ SalesAccessControls.GRF_ADD_EDIT + END + OR + NON_FROZEN_DETAIL_TYPE + AND + START
			+ SalesAccessControls.ACCEPT_ADVANCE_ADD_EDIT + END + OR + MANUAL_FROZEN_RATES_TYPE + AND + START
			+ SalesAccessControls.GRF_VIEW + END;
	private static final String ACCEPT_ADVANCE_CONFIRM_PERMISSION = FROZEN_DETAIL_TYPE + AND + START
			+ SalesAccessControls.GRF_CONFIRM + END + OR + NON_FROZEN_DETAIL_TYPE + AND + START
			+ SalesAccessControls.ACCEPT_ADVANCE_CONFIRM + END + OR + MANUAL_FROZEN_RATES_TYPE + AND + START
			+ SalesAccessControls.GRF_VIEW + END;
	private static final String ACCEPT_ADVANCE_DELETE_PERMISSION = FROZEN_DETAIL_TYPE + AND + START
			+ SalesAccessControls.GRF_DELETE + END + OR + NON_FROZEN_DETAIL_TYPE + AND + START
			+ SalesAccessControls.ACCEPT_ADVANCE_DELETE + END + OR + MANUAL_FROZEN_RATES_TYPE + AND + START
			+ SalesAccessControls.GRF_VIEW + END;
	public static final String ACCEPT_ADVANCE_GRF_MERGE_PERMISSION = START + SalesAccessControls.GRF_MERGE + END;
	// @formatter:on

	@PostMapping
	@PreAuthorize(ACCEPT_ADVANCE_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to initiate advance w or w/o gold rate freeze", notes = "This API will initiate advance flow.<br>")
	// @formatter:on
	public TransactionResponseDto openAdvance(
			@ApiParam(name = "body", value = "Manual bill object that needs to be verified", required = false) @RequestBody TransactionCreateDto transactionCreateDto,
			@ApiParam(name = "txnType", allowableValues = "ADV", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "NON_FROZEN_RATES, FROZEN_RATES, MANUAL_FROZEN_RATES", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return advanceService.openAdvance(txnType, subTxnType, transactionCreateDto);
	}

	@PatchMapping("{id}")
	// @formatter:off
	@ApiOperation(value = "API to update advance w or w/o gold rate freeze", notes = "This API will update some fields of  advance flow.<br>"
			+ "All fields of request body are optional.<br><br>")
	// @formatter:on
	@PreAuthorize(ACCEPT_ADVANCE_ADD_EDIT_PERMISSION)
	public void updateAdvance(
			@ApiParam(name = "id", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "body", value = "Advance object that needs to be updated", required = true) @RequestBody @Valid AdvanceUpdateDto advUpdateDto,
			@ApiParam(name = "txnType", allowableValues = "ADV", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "NON_FROZEN_RATES, FROZEN_RATES, MANUAL_FROZEN_RATES", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		advanceService.updateAdvance(id, advUpdateDto, txnType, subTxnType);
	}

	@PutMapping("{id}")
	// @formatter:off
	@ApiOperation(value = "API to confirm the bill", notes = "This API will confirm the bill with some verification fields.<br>"
			+ "'customerId' & 'paidValue' field values are only for reverify, it will not update.<br>"
			+ " 'weightAgreed'field is only required for GRF, not for accept advance.<br><br>")
	// @formatter:on
	@PreAuthorize(ACCEPT_ADVANCE_CONFIRM_PERMISSION)
	public CancelAdvanceResponseDto confirmAdvance(
			@ApiParam(name = "id", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "body", value = "Advance object that needs to be confirmed", required = true) @RequestBody @Valid AdvanceConfirmDto advConfirmDto,
			@ApiParam(name = "txnType", allowableValues = "ADV", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "NON_FROZEN_RATES, FROZEN_RATES, MANUAL_FROZEN_RATES", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "status", value = "'status' to update", allowableValues = "APPROVAL_PENDING,CONFIRMED", required = false) @RequestParam(name = "status", required = false) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status) {

		return advanceService.confirmAdvance(id, advConfirmDto, txnType, subTxnType, status);
	}

	@DeleteMapping("{id}")
	// @formatter:off
	@ApiOperation(value = "API to cancel Advance", notes = "This API will cancel the advance under the rule no active payment there.<br>"
			+ "All fields of request body are optional.<br><br>")
	// @formatter:on
	@PreAuthorize(ACCEPT_ADVANCE_DELETE_PERMISSION)
	public void deleteAdvance(
			@ApiParam(name = "id", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "remarks", required = false) @RequestParam(name = "remarks", required = false) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255, nullCheck = true) String remarks,
			@ApiParam(name = "txnType", allowableValues = "ADV", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "NON_FROZEN_RATES, FROZEN_RATES, MANUAL_FROZEN_RATES", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		advanceService.deleteAdvance(id, remarks, txnType, subTxnType);
	}

	@GetMapping("{id}")
	@PreAuthorize(ACCEPT_ADVANCE_VIEW_PERMISSION)
	@ApiOperation(value = "API to view details of an advance transaction", notes = "this can be used to view details when a particular record selected from open order list.")
	public AdvanceDto getAdvance(
			@ApiParam(name = "id", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", allowableValues = "ADV", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "NON_FROZEN_RATES, FROZEN_RATES, MANUAL_FROZEN_RATES", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return advanceService.getAdvance(id, txnType, subTxnType);
	}

	@ApiOperation(value = "API to list frozen rate advances", notes = "this api list rate freeze txn for the selected customer & location<br/>"
			+ "This will not list txn if CN is fully utlized")
	@GetMapping(value = "list")
	@PreAuthorize(ACCEPT_ADVANCE_GRF_MERGE_PERMISSION)
	public ListResponse<GRFLiteDto> getRateFreezeList(
			@ApiParam(name = "customerId", required = true) @RequestParam(name = "customerId", required = true) Integer customerId,
			@ApiParam(name = "txnType", allowableValues = "ADV", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "FROZEN_RATES, MANUAL_FROZEN_RATES", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return advanceService.getRateFreezeList(customerId, txnType, subTxnType);
	}

	@ApiOperation(value = "API to merge frozen rate advances", notes = "this api takes multiple CN & merge<br/>"
			+ "tempFileIds' key contains file type & value contains list of file id of that file type.")
	@PatchMapping(value = "merge")
	@PreAuthorize(ACCEPT_ADVANCE_GRF_MERGE_PERMISSION)
	public AdvMergeResDto mergeCNForRateFreeze(
			@ApiParam(name = "body", value = "Advance object that needs to be confirmed", required = true) @RequestBody @Valid AdvanceMergeDto advMergeDto,
			@ApiParam(name = "txnType", allowableValues = "ADV", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "FROZEN_RATES, MANUAL_FROZEN_RATES", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return advanceService.mergeRateFreeze(advMergeDto, txnType, subTxnType);
	}

}
