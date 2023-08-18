/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import java.math.BigDecimal;

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

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.enums.WorkflowTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.TepCashRefundLimitResponseDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.GepConfirmOrHoldDto;
import com.titan.poss.sales.dto.request.GepUpdateDto;
import com.titan.poss.sales.dto.request.GoodExchangeRequestConfirmDto;
import com.titan.poss.sales.dto.response.CmDetailsResponseDto;
import com.titan.poss.sales.dto.response.CmForCustomerResponseDto;
import com.titan.poss.sales.dto.response.GepAndItemIdDetailsResponseDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.GoodsExchangeDiscountResponseDto;
import com.titan.poss.sales.dto.response.TransactionResponseDto;
import com.titan.poss.sales.service.GoodsExchangeFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Validated
@RestController("salesGoodsExchangeController")
@RequestMapping(value = "sales/v2/goods-exchange")
public class GoodsExchangeController {

	@Autowired
	private GoodsExchangeFacade goodsExchangeFacade;

	// @formatter:off
	@PostMapping
	@ApiOperation(value = "API to initiate goods exchange", notes = "This API will initiate goods exchange transaction.<br>"
			+ "This API to be called in goods exchange screen when customer is selected.<br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type(Related to GEP):</span>" 
			+ "<ul>" 
			+ "	<li><b>NEW_GEP</b></li>"
			+ "	<li><b>MANUAL_GEP</b></li>"
			+ "</ul>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type(Related to TEP):</span>" 
			+ "<ul>" 
			+ "	<li><b>NEW_TEP</b></li>"
			+ "	<li><b>MANUAL_TEP</b></li>"
			+ "	<li><b>INTER_BRAND_TEP</b></li>"
			+ "	<li><b>FULL_VALUE_TEP</b></li>"
			+ "	<li><b>CUT_PIECE_TEP</b></li>"
			+ "	<li><b>MANUAL_INTER_BRAND_TEP</b></li>"
			+ "	<li><b>MANUAL_FULL_VALUE_TEP</b></li>"
			+ "</ul>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">In response for **standardMetalrates** the structure will be: </span><br>"
			+ "<ul>" 
			+ "	<li>additionalProp1: <b>J</b></li>"
			+ "	<li>additionalProp2: <b>P</b></li>"
			+ "	<li>additionalProp3: <b>L</b></li>"
			+ "</ul><br>"
			+ "Validation types allowed for manual bill:<br>"
			+ "<ul>" 
			+ "	<li>PASSWORD_VALIDATION</li>"
			+ "</ul><br>")
	// @formatter:on  // @Valid is not added as it is required only for manual bill.
	@PreAuthorize(IS_STORE_USER)
	public TransactionResponseDto openGoodsExchange(
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP, MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "Goods Exchange object that needs to be created", required = true) @RequestBody TransactionCreateDto transactionCreateDto) {
		return goodsExchangeFacade.openGoodsExchange(txnType, subTxnType, transactionCreateDto);
	}

	@GetMapping("{id}")
	@ApiOperation(value = "API to get goods exchange", notes = "This API will get goods exchange by id.<br>"
			+ "<b>Note :</b> This API will give goods exchange and item details in the response."
			+ "In response for **standardMetalrates** the structure will be <br> &nbsp;&nbsp;additionalProp1: J"
			+ "<br> &nbsp;&nbsp;additionalProp2: P <br> &nbsp;&nbsp;additionalProp3: L")
	@PreAuthorize(IS_STORE_USER)
	public GepAndItemIdDetailsResponseDto getGep(
			@ApiParam(name = "id", value = "'id' to get Goods Exchange", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@RequestParam(required = false) @ApiParam(name = "recalculationRequired", value = "Allow recalculation", required = false) Boolean recalculationRequired,
			@RequestParam(required = false) @ApiParam(name = "isTepException", value = "Allow recalculation for TEP Exception", required = false) Boolean isTepException) {
		return goodsExchangeFacade.getGoodsExchange(id, txnType, subTxnType, recalculationRequired,isTepException);
	}

	//@formatter:off
	@PatchMapping("{id}")
	@ApiOperation(value = "API to update goods exchange", notes = "This API is to update goods exchange. Using this API **customer id**, "
			+ " **employee code** & **declaration form** check box can be updated(<b>for GEP only</b>)"
			+ " <br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ " &nbsp;&nbsp;<li>"
			+ " <a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/ExchangeDetails.json\">"
			+ " EXCHANGE_DETAILS_CONFIG</a> (exchangeDetails JSON)"
			+ " </br></br>"
			+ " </li>")
	//@formatter:on
	@PreAuthorize(IS_STORE_USER)
	public GepResponseDto updateGoodsExchange(
			@ApiParam(name = "id", value = "'id' to get goods exchange", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "GEP object that needs to be updated", required = true) @RequestBody @Valid GepUpdateDto gepUpdateDto) {
		return goodsExchangeFacade.updateGoodsExchange(id, txnType, subTxnType, gepUpdateDto);
	}

	//@formatter:off
	@PutMapping("{id}")
	@ApiOperation(value = "API to HOLD or CONFIRM for goods exchange", notes = "This API puts goods exchange on HOLD/CONFIRMED based on "
			+ " id and status, and will not update any fields except status and remarks. Status could be **HOLD** or **CONFIRMED**."
			+ " <br> Only standard metal rates are accepted.<br>"
			+ " <br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ " &nbsp;&nbsp;<li>"
			+ " <a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/ExchangeDetails.json\">"
			+ " EXCHANGE_DETAILS_CONFIG</a> (exchangeDetails JSON)"
			+ " </br></br>"
			+ " </li>"
			+ " <br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Refund Json format for the details:</span></b>\r\n"
			+ " &nbsp;&nbsp;<li>"
			+ " <a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/TepChequeRefund.json\">"
			+ " TEP_CHEQUE_REFUND</a> (refundDetails JSON)"
			+ " </br></br>"
			+ " </li>"
			+ " &nbsp;&nbsp;<li>"
			+ " <a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/TepRTGSRefund.json\">"
			+ " TEP_RTGS_REFUND</a> (refundDetails JSON)"
			+ " </br></br>"
			+ " </li>"
			+ " &nbsp;&nbsp;<li>"
			+ " <a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/FTEPApprovalDetails.json\">"
			+ " FTEP_APPROVAL_DETAILS</a> (refundDetails JSON)"
			+ " </br></br>"
			+ " </li>"
			+ " &nbsp;&nbsp;<li>"
			+ " <a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/TepCashRefund.json\">"
			+ " TEP_CASH_REFUND</a> (refundDetails JSON)"
			+ " </br></br>"
			+ " </li>"
			+ " <b>Note</b>: In payload, **paymentType** should be either **CN** or **REFUND**")
	//@formatter:on
	@PreAuthorize(IS_STORE_USER)
	public GepResponseDto confirmGoodsExchange(
			@ApiParam(name = "id", value = "'id' to edit goods exchange", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "status", value = "'status' to update", allowableValues = "HOLD, CONFIRMED", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "body", value = "Goods exchange object that needs to be updated", required = true) @RequestBody @Valid GepConfirmOrHoldDto gepConfirmOrHoldDto) {
		return goodsExchangeFacade.confirmGoodsExchange(id, status, txnType, subTxnType, gepConfirmOrHoldDto);
	}

	@DeleteMapping("{id}")
	@ApiOperation(value = "API to delete goods exchange", notes = "This API will delete goods exchange w.r.t id.<br>"
			+ "Goods exchange can be deleted if the status is **HOLD/OPEN**")
	@PreAuthorize(IS_STORE_USER)
	public void deleteGep(
			@ApiParam(name = "id", value = "'id' to delete GEP", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "remarks", value = "Provide to set 'remarks'", required = false) @RequestParam(name = "remarks", required = false) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255) String remarks) {
		goodsExchangeFacade.deleteGoodsExchange(id, txnType, subTxnType, remarks);
	}

	// @formatter:off
	@PatchMapping("{id}/price")
	@ApiOperation(value = "API to update price details", notes = "This API will update price details of all items to goods exchange based on goods exchange id.<br>"
			+ " This API should be called when **price mismatch** error comes. For **MANUAL_GEP** & **MANUAL_TEP** this API should not "
			+ " be called.")
	// @formatter:on
	@PreAuthorize(IS_STORE_USER)
	public GepAndItemIdDetailsResponseDto updateGoodsExchangeItemsPrice(
			@ApiParam(name = "id", value = "'id' to get goods exchange", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return goodsExchangeFacade.updateGoodsExchangeItemsPrice(id, txnType, subTxnType);
	}

	// @formatter:off
	@ApiOperation(value = "API to get cash memo data", notes = "This API will get cash memo data with items.<br>"
			+ " This API internally gets all cash memo related data from EPOSS if location provided is different than current location. Persist those in local DB for future APIs' reference.<br>"
			+ " If the location code is same as logged in location code then data will be returned from local poss db.<br>"
			+ " <b>Note :  This API should be used only for TEP.</b>") 
	// @formatter:on
	@GetMapping("/cash-memo")
	@PreAuthorize(IS_STORE_USER)
	public ListResponse<CmDetailsResponseDto> getCashMemoDetails(
			@RequestParam(name = "locationCode", required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "refDocNo", required = true) Integer refDocNo,
			@RequestParam(name = "refFiscalYear", required = true) Short refFiscalYear,
			@ApiParam(name = "txnType", allowableValues = "TEP", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", allowableValues = "NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return goodsExchangeFacade.getCashMemoDetails(locationCode, refDocNo, refFiscalYear, txnType, subTxnType);
	}

	//@formatter:off
	@PutMapping("/request/{id}")
	@ApiOperation(value = "API to CONFIRM approved goods exchange", notes = "This API puts goods exchange on CONFIRMED based on "
			+ " id and status, and will not update any fields except status and remarks. Status could be **CONFIRMED** for those which are approved."
			+ "Only <b>NEW_TEP</b> & <b>FULL_VALUE_TEP</b> & <b>MANUAL_FULL_VALUE_TEP</b> subTxnType should be allowed.")
	//@formatter:on
	@PreAuthorize(IS_STORE_USER)
	public GepResponseDto confirmGoodsExchangeRequest(
			@ApiParam(name = "id", value = "'id' to edit goods exchange", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_TEP, FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "workflowType", value = "'workflowType' Requested", required = true) @RequestParam(name = "workflowType") @ValueOfEnum(enumClass = WorkflowTypeEnum.class) String workflowType,
			@ApiParam(name = "body", value = "Goods exchange object that needs to be updated", required = true) @RequestBody @Valid GoodExchangeRequestConfirmDto goodExchangeRequestConfirmDto) {
		return goodsExchangeFacade.confirmGoodsExchangeRequest(id, txnType, subTxnType, goodExchangeRequestConfirmDto,workflowType);
	}

	@GetMapping("{id}/discounts")
	@ApiOperation(value = "API to get offers applicable on goods exchange", notes = "This API will get offers applicable on goods exchange by id.<br>")
	@PreAuthorize(IS_STORE_USER)
	public ListResponse<GoodsExchangeDiscountResponseDto> checkApplicableDiscounts(
			@ApiParam(name = "id", value = "'id' to get goods exchange", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return goodsExchangeFacade.checkApplicableDiscounts(id, txnType, subTxnType);
	}

	
	/*
	 * @PutMapping("/update-tep-from-legacy")
	 * 
	 * @ApiOperation(value = "API to update Tep from Legacy to Nap", notes =
	 * "This API will update Tep items from legacy to Nap.<br>") public void
	 * updateTepFromLegacytoNap(
	 * 
	 * @ApiParam(name = "body", value =
	 * "Goods exchange object that needs to be updated", required =
	 * true) @RequestBody @Valid TepLegacyUpdateDto tepLegacyUpdateDto) {
	 * goodsExchangeFacade.updateTepFromLegacytoNap(tepLegacyUpdateDto); }
	 */
	
	@GetMapping("/check-cm")
	@PreAuthorize(IS_STORE_USER)
	@ApiOperation(value = "API to give available cash memo", notes = "This API will give available cash memo with respect to item codes.")
	public ListResponse<CmForCustomerResponseDto> checkCmAvailable(
			@RequestParam(name = "locationCode", required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(name = "itemCode", required = true) String itemCode,
			@RequestParam(name = "customerMobileNo", required = false) String customerMobileNo,
			@RequestParam(name = "customerId", required = true) String customerId,
			@RequestParam(name = "isMigratedIgnored", required = false) Boolean isMigratedIgnored)
			 {
		return goodsExchangeFacade.checkCmAvailable(locationCode, itemCode, customerMobileNo, customerId,isMigratedIgnored);
	}
	
	
	@PutMapping("/update-tep-from-legacy")
	@ApiOperation(value = "API to update Tep from Legacy to Nap", notes = "This API will update Tep items from legacy to Nap.<br>")
	public void updateTepFromLegacytoNap(
			@ApiParam(name = "body", value = "Goods exchange object that needs to be updated", required = true) @RequestBody @Valid  TepLegacyUpdateDto tepLegacyUpdateDto) {
		goodsExchangeFacade.updateTepFromLegacytoNap(tepLegacyUpdateDto);
	}
	
	
	@GetMapping("/checkRefundCashLimit")
	@ApiOperation(value = "API to check refund cash limit based on txn type",notes = "This API will check refund cash limit based on txn type.")
	public TepCashRefundLimitResponseDto checkTEPCashLimit(
			@RequestParam(name = "customerId", required = true) Integer customerId,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "TEP,CM,GRF,GIFT_CARD,AB,ADV") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam(name = "refundAmt", required = true) BigDecimal refundAmt) {
		return goodsExchangeFacade.checkTEPCashLimit(customerId,txnType,refundAmt);
	}
	
	

}
