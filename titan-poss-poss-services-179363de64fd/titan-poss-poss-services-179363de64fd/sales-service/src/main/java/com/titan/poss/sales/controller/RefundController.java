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
@RequestMapping(value = "sales/v2/refund")
public class RefundController {

	@Autowired
	private RefundService refundService;

	// @formatter:off
	@ApiOperation(value = "API to create refund request",notes = "This API is to create refund request to RO commercial user."
			+ " Here txn type should be **TEP**. This API will be called internally by **POSS** application. This API"
			+ " is not available for **POSS/EPOSS** user."
			+ " <br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ " &nbsp;&nbsp;<li>"
			+ " <a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/TepRefundHeaderData.json\">"
			+ " TEP_REFUND_HEADER</a> (headerData JSON)"
			+ " </br></br>"
			+ " </li>"
			+ " &nbsp;&nbsp;<li>"
			+ " <a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/TepRefundRequestData.json\">"
			+ " TEP_REFUND_DETAILS</a> (requestData JSON)"
			+ " </br></br>"
			+ " </li>"
			+ " <b>Note : </b> Data won't be stored in POSS db and it will be available only in EPOSS db.")
	// @formatter:on
	@PostMapping
	public RefundCreateResponseDto createRefundRequest(
			@RequestParam @ApiParam(value = "Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType,
			@ApiParam(name = "body", value = "Refund request object that needs to be created", required = true) @RequestBody @Valid RefundRequestCreateDto refundRequest) {
		return refundService.createRefundRequest(txnType, refundRequest);
	}

	// @formatter:off
	@ApiOperation(value = "API to list all refund request",notes = "This API is to list all refund request."
			+ " This API should be used by **RO Commercial/POSS** user only. Here txn type should be **TEP** and based on status"
			+ " also **RO Commercial/POSS** user can filter the data. By default all data will be available and response"
			+ " will be paged response."
			+ "	<br>User can filter by below status : "
			+ " <ul>"
			+ " <li>APPROVAL_PENDING</li>"
			+ " <li>PENDING_FROM_RO</li>"
			+ " <li>REFUNDED</li>"
			+ " <li>REJECTED</li>"
			+ " <li>ALLOWED_TO_CANCEL</li>"
			+ " <li>CANCELLED</li>"
			+ " </ul>"
			+ " <br>User can filter by below details : "
			+ " <ul>"
			+ " <li>date</li>"
			+ " <li>doc no</li>"
			+ " <li>location</li>"
			+ " <li>fiscal year</li>"
			+ " <li>sub txn type (Ex: NEW_TEP,FULL_VALUE_TEP,INTER_BRAND_TEP)</li>"
			+ " <li>date range type (Ex: TODAY, LAST_WEEK, LAST_MONTH, LAST_YEAR, CUSTOM)</li>"
			+ " </ul>")
	// @formatter:on
	@ApiPageable
	@PostMapping(value = "/list")
	public PagedRestResponse<List<RefundResponseDto>> listRefundRequest(
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType,
			@ApiParam(name = "body", value = "Refund request object to filter the data", required = true) @RequestBody @Valid RefundListRequestDto refundListDto,
			@ApiIgnore Pageable pageable) {
		return refundService.listRefundRequest(txnType, refundListDto, pageable);
	}

	// @formatter:off
	@ApiOperation(value = "API to get a refund request by id",notes = "This API is to get a refund request by id."
			+ " This API can be used by **RO Commercial/POSS** user only. Here txn type should be **TEP** and id will be "
			+ " refund request table id.")
	// @formatter:on
	@GetMapping(value = "/{id}")
	public RefundResponseDto getRefundRequest(
			@ApiParam(name = "id", value = "'id' to get Refund", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType) {
		return refundService.getRefundRequest(id, txnType);
	}

	// @formatter:off
	@ApiOperation(value = "API to update a refund request",notes = "This API is to update refund request."
			+ " This API can be used by **RO Commercial/POSS** user only. Here txn type should be **TEP** and id will be "
			+ " refund request table id. In this API **status** should be **REFUNDED, REJECTED, ALLOWED_TO_CANCEL**"
			+ " only. <br> Below status change is valid only : "
			+ " <ul>"
			+ " <li> If the status is **APPROVAL_PENDING**, then **RO Commercial** cannot change the status because"
			+ "	this is not available for approval</li>"
			+ " <li> If the status is **PENDING_FROM_RO**, then **RO Commercial** make the status as"
			+ "	**REFUNDED** or **REJECTED**</li>"
			+ " <li> If the status is **REFUNDED**, then **RO Commercial** can make the status as"
			+ "	**ALLOWED_TO_CANCEL**</li>"
			+ " <li> If the status is **REJECTED**, then **RO Commercial** cannot change the status."
			+ "	</li>"
			+ " <li> If the status is **ALLOWED_TO_CANCEL**, then **RO Commercial** cannot change the status."
			+ "	Once customer cancels the TEP then status will be automatically updated."
			+ "	</li>"
			+ " </ul>"
			+ " <b>Note : </b> When **POSS** user send details to RO commercial for refund then **approvedData**"
			+ " json should be empty and status should be **PENDING_FROM_RO**.")
	// @formatter:on
	@PutMapping(value = "{id}")
	public RefundUpdateResponseDto updateRefundRequest(
			@ApiParam(name = "id", value = "'id' to get Refund", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Refund Status", required = true, allowableValues = "PENDING_FROM_RO, REFUNDED, REJECTED, ALLOWED_TO_CANCEL") @ValueOfEnum(enumClass = RefundRequestStatusEnum.class) String status,
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType,
			@ApiParam(name = "body", value = "Refund request object that needs to be updated", required = true) @RequestBody @Valid RefundUpdateRequestDto refundUpdateRequest) {
		return refundService.updateRefundRequest(id, status, txnType, refundUpdateRequest);
	}

	// @formatter:off
	@ApiOperation(value = "API to update a refund request status based on txn id",notes = "This API is to update refund request status "
			+ " based on txn id. This API can be used by **POSS** user only. Here txn type should be **TEP** and "
			+ " txn id will be goods exchange id in case of **TEP**. When TEP cancel will happen then internally from"
			+ " POSS, this API should be called.")
	// @formatter:on
	@PutMapping(value = "/cancel/{txnId}")
	public RefundUpdateResponseDto cancelRefundRequest(
			@ApiParam(name = "txnId", value = "'txnId' to get txn data", required = true) @PathVariable("txnId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String txnId,
			@RequestParam @ApiParam(value = "Refund Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = RefundTxnTypeEnum.class) String txnType) {
		return refundService.cancelRefundRequest(txnId, txnType);
	}
}
