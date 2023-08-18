/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.EventCancellationDto;
import com.titan.poss.core.dto.EventCashMemoDto;
import com.titan.poss.core.dto.EventGRNDto;
import com.titan.poss.core.dto.EventResponseDto;
import com.titan.poss.integration.service.EventService;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.constants.SubTxnTypeEum;
import com.titan.poss.sales.constants.TransactionStatusEnum;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * s
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("IntegrationEventController")
@RequestMapping("integration/v2/event")
public class EventController {

	@Autowired
	private EventService eventService;

	@ApiOperation(value = "cash memo event details to dial-cctv Retail Input Service", notes = "This API will send the cash memo event details to dial-cctv Retail Input Service")
	@PostMapping(value = "cash-memo")
	public EventResponseDto cashMemoDetails(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "DIAL_MILESTONE", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "txnId", value = "Cash memo id generated", required = true) @RequestParam(name = "txnId", required = true) String txnId,
			@ApiParam(name = "subTxnType", value = "Sub transaction type of cash memo", allowableValues = "NEW_CM, MANUAL_CM, QUICK_CM, GIFT_SALE", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEum.class) String subTxnType,
			@ApiParam(name = "status", value = "Cash memo status", allowableValues = "CONFIRMED,HOLD", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "isScheduled", value = "Running as a scheduler or not", required = true) @RequestParam(name = "isScheduled", required = true) Boolean isScheduled,
			@ApiParam(name = "body", value = "cash memo details to dial-cctv api", required = true) @RequestBody @Valid EventCashMemoDto eventCashMemoDto) {
		return eventService.cashMemoDetails(vendorCode, txnId, subTxnType, status, isScheduled, eventCashMemoDto);
	}

	@ApiOperation(value = "cancellation event details to dial-cctv Retail Input Service", notes = "This API will send the cancellation event details to dial-cctv Retail Input Service")
	@PostMapping(value = "cancel")
	public EventResponseDto cancellationDetails(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "DIAL_MILESTONE", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "txnId", value = "Cash memo id generated", required = true) @RequestParam(name = "txnId", required = true) String txnId,
			@ApiParam(name = "cancelType", value = "cancel type of the cash memo", allowableValues = "CANCEL_WITH_RETURN, CANCEL_WITH_CN", required = true) @RequestParam(name = "cancelType", required = true) @ValueOfEnum(enumClass = CancellationTypeEnum.class) String cancelType,
			@ApiParam(name = "status", value = "Cash memo status", allowableValues = "OPEN,CANCELLED", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "isScheduled", value = "Running as a scheduler or not", required = true) @RequestParam(name = "isScheduled", required = true) Boolean isScheduled,
			@ApiParam(name = "body", value = "cash memo details to dial-cctv api", required = true) @RequestBody @Valid EventCancellationDto eventCancellationDto) {
		return eventService.cancellationDetails(vendorCode, txnId, cancelType, status, isScheduled,
				eventCancellationDto);
	}

	@ApiOperation(value = "goods return event details to dial-cctv Retail Input Service", notes = "This API will send the goods return event details to dial-cctv Retail Input Service")
	@PostMapping(value = "goods-return")
	public EventResponseDto goodsReturnDetails(
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "DIAL_MILESTONE", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = VendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "txnId", value = "grn id generated", required = true) @RequestParam(name = "txnId", required = true) String txnId,
			@ApiParam(name = "isScheduled", value = "Running as a scheduler or not", required = true) @RequestParam(name = "isScheduled", required = true) Boolean isScheduled,
			@ApiParam(name = "body", value = "cash memo details to dial-cctv api", required = true) @RequestBody @Valid EventGRNDto eventGRNDto) {
		return eventService.goodsReturnDetails(vendorCode, txnId, isScheduled, eventGRNDto);

	}
}
