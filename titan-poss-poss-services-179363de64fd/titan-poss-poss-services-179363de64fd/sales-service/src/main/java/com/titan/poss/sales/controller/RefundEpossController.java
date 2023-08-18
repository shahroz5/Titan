/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RefundRequestStatusEnum;
import com.titan.poss.core.domain.constant.RefundTxnTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.sales.dto.request.RefundListRequestDto;
import com.titan.poss.sales.dto.request.RefundRequestCreateDto;
import com.titan.poss.sales.dto.request.RefundUpdateRequestDto;
import com.titan.poss.sales.dto.response.RefundCreateResponseDto;
import com.titan.poss.sales.dto.response.RefundResponseDto;
import com.titan.poss.sales.dto.response.RefundUpdateResponseDto;
import com.titan.poss.sales.service.RefundService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "sales/v2/refund/eposs")
public class RefundEpossController {

	@Autowired
	private RefundService refundService;

	// @formatter:off
	@ApiOperation(value = "API to create refund request",notes = "This API is to create refund request to RO commercial user."
			+ " Here txn type should be **TEP**. This API should be called from POSS service only and this "
			+ " API is not available for UI.")
	// @formatter:on
	@PostMapping
	public RefundCreateResponseDto createRefundRequest(
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType,
			@ApiParam(name = "body", value = "Refund request object that needs to be created", required = true) @RequestBody @Valid RefundRequestCreateDto refundRequest) {
		return refundService.createRefundRequest(txnType, refundRequest);
	}

	// @formatter:off
	@ApiOperation(value = "API to list all refund request",notes = "This API is to list all refund request."
			+ " Here txn type should be **TEP**. This API should be called from POSS service only and this "
			+ " API is not available for UI.")
	// @formatter:on
	@ApiPageable
	@PostMapping(value = "/list")
	public PagedRestResponse<List<RefundResponseDto>> listRefundRequest(
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType,
			@ApiParam(name = "body", value = "Refund request object to filter the data", required = true) @RequestBody @Valid RefundListRequestDto refundListDto,
			@ApiIgnore Pageable pageable) {
		return refundService.listRefundRequest(txnType, refundListDto, pageable);
	}

	//@formatter:off
	@ApiOperation(value = "API to get a refund request by id",notes = "This API is to get a refund request by id."
			+ " This API should be called from POSS service only and this API is not available for UI.")
	//@formatter:on
	@GetMapping(value = "/{id}")
	public RefundResponseDto getRefundRequest(
			@ApiParam(name = "id", value = "'id' to get Refund", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType) {
		return refundService.getRefundRequest(id, txnType);
	}

	//@formatter:off
	@ApiOperation(value = "API to update a refund request by id",notes = "This API is to update a refund request by id."
			+ " This API should be called from POSS service only and this API is not available for UI.")
	//@formatter:on
	@PutMapping(value = "{id}")
	public RefundUpdateResponseDto updateRefundRequest(
			@ApiParam(name = "id", value = "'id' to get Refund", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Refund Status", required = true, allowableValues = "PENDING_FROM_RO, REFUNDED, REJECTED, ALLOWED_TO_CANCEL") @ValueOfEnum(enumClass = RefundRequestStatusEnum.class) String status,
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType,
			@ApiParam(name = "body", value = "Refund request object that needs to be updated", required = true) @RequestBody @Valid RefundUpdateRequestDto refundUpdateRequest) {
		return refundService.updateRefundRequest(id, status, txnType, refundUpdateRequest);
	}

	//@formatter:off
	@ApiOperation(value = "API to update a refund request status based on txn id",notes = "This API is to update a refund request status based on txn id."
			+ " This API should be called from POSS service only and this API is not available for UI.")
	//@formatter:on
	@PutMapping(value = "/cancel/{txnId}")
	public RefundUpdateResponseDto cancelRefundRequest(
			@ApiParam(name = "txnId", value = "'txnId' to get txn data", required = true) @PathVariable("txnId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String txnId,
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType) {
		return refundService.cancelRefundRequest(txnId, txnType);
	}
}
