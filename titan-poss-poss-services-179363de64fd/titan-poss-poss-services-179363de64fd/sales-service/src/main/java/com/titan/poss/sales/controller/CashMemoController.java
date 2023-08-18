/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
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
import com.titan.poss.core.dto.CustomerTcsData;
import com.titan.poss.core.dto.CustomerTcsDetailsResponseDto;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dto.CashMemoUpdateDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.CashMemoPatchUpdateDto;
import com.titan.poss.sales.dto.request.OrderToCashMemoRequestDto;
import com.titan.poss.sales.dto.response.CashMemoAndDetialsIdResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.TransactionResponseDto;
import com.titan.poss.sales.service.CashMemoService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Cash Memo Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesCashMemoController")
@RequestMapping(value = "sales/v2/cash-memos")
public class CashMemoController {

	@Autowired
	private CashMemoService cashMemoService;

	// @formatter:off
	private static final String CASH_MEMO_ADD_EDIT_PERMISSION = 
			"hasPermission(#subTxnType,'NEW_CM')" + AND + START + SalesAccessControls.CASH_MEMO_ADD_EDIT + END 
			+ OR + "hasPermission(#subTxnType,'MANUAL_CM')" + AND + START + SalesAccessControls.MANUAL_CASH_MEMO_ADD_EDIT + END 
			+ OR + "hasPermission(#subTxnType,'GIFT_SALE')" + AND + START + SalesAccessControls.GIFT_CARD_SALE + END;
	// @formatter:on

	// @formatter:off
	private static final String CASH_MEMO_UPDATE_PERMISSION = 
			"hasPermission(#status,'HOLD')" + AND + START + SalesAccessControls.CASH_MEMO_HOLD + END 
			+ OR + "hasPermission(#status,'CONFIRMED')" + AND + START + SalesAccessControls.CASH_MEMO_CONFIRM + END 
			+ OR + "hasPermission(#status,'APPROVAL_PENDING')" + AND + START + SalesAccessControls.MANUAL_CASH_MEMO_ADD_EDIT + END;
	// @formatter:on

	private static final String CASH_MEMO_VIEW_PERMISSION = START + SalesAccessControls.CASH_MEMO_VIEW + END;
	private static final String CASH_MEMO_DELETE_PERMISSION = START + SalesAccessControls.CASH_MEMO_DELETE + END;
	private static final String CONVERT_AB_TO_CM_PERMISSION = START + SalesAccessControls.CONVERT_AB_TO_CM + END;

	/**
	 * This method will put the cash memo on open status.
	 * 
	 * @param transactionCreateDto
	 * @param txnType
	 * @param subTxnType
	 * @return ManualBillVerifyDto
	 */
	// @formatter:off
	@PostMapping
	@PreAuthorize(CASH_MEMO_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to initiate cash memo", notes = "This API will initiate cash memo transaction.<br>"
			+ "This API to be called in cash memo screen when customer is selected.<br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Sub Transaction Type(Related to CM):</span>" + "<ul>"
			+ "	<li>NEW_CM</li>" + "	<li>MANUAL_CM</li>" + "	<li>QUICK_CM</li>" + "	<li>GIFT_SALE</li>"
			+ "</ul><br>"
			+ "Manual Bill details with standard metal rates is required if 'subTxnType' is MANUAL_CM.<br>"
			+ "Validation types allowed for manual bill:<br>" + "<ul>" + "	<li>PASSWORD_VALIDATION</li>"
			+ "	<li>REQUEST_APPROVAL</li>" + "</ul><br>")
	// @formatter:on //@Valid is not added as it is required only for manual bill.
	public TransactionResponseDto openCashMemo(
			@ApiParam(name = "body", value = "Manual bill object that needs to be verified", required = false) @RequestBody TransactionCreateDto transactionCreateDto,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE, FOC_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return cashMemoService.openCashMemo(transactionCreateDto, txnType, subTxnType);

	}

	/**
	 * This method will update the cash memo on hold/Confirm w.r.t id and status.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param cashMemoUpdateDto
	 * @param status
	 * @return CashMemoResponseDto
	 */
	@PutMapping("{id}")
	// HOLD, CONFIRMED, APPROVAL_PENDING+SUB_TXN_TYPE
	@PreAuthorize(CASH_MEMO_UPDATE_PERMISSION)
	@ApiOperation(value = "API to HOLD or CONFIRM or send for APPROVAL cash memo", notes = "This API puts cash memo on HOLD/CONFIRMED/APPROVAL_PENDING based on id and status, and will not update any fields except status and remarks given to PUT ON HOLD or CONFIRM.<br> Only standard metal rates are accepted.<br>")
	public CashMemoResponseDto updateCashMemo(
			@ApiParam(name = "id", value = "'id' to edit cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE, FOC_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "status", value = "'status' to update", allowableValues = "HOLD, CONFIRMED, APPROVAL_PENDING", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "body", value = "Cash Memo object that needs to be updated", required = true) @RequestBody @Valid CashMemoUpdateDto cashMemoUpdateDto) {

		return cashMemoService.updateCashMemo(id, txnType, subTxnType, cashMemoUpdateDto, status);

	}

	/**
	 * This method will get cash memo by id.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	@GetMapping("{id}")
	@PreAuthorize(CASH_MEMO_VIEW_PERMISSION)
	@ApiOperation(value = "API to get cash memo", notes = "This API will get cash memo by id.<br>"
			+ "<b>Note :</b> This API will give cash memo and item details in the response.")
	public CashMemoAndDetialsIdResponseDto getCashMemo(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE, FOC_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return cashMemoService.getCashMemo(id, txnType, subTxnType);
	}

	/**
	 * This method will partially update cash memo by id.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param cashMemoPatchUpdateDto
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	@PatchMapping("{id}")
	@PreAuthorize(CASH_MEMO_ADD_EDIT_PERMISSION)
	// @formatter:off
	@ApiOperation(value = "API to partially update cash memo", notes = "This API will update cash memo by id.<br>"
			+ "<b>Note :</b> This API will update customer details, occasion and other charges." + "<ul>"
			+ "<b><span style=\"font-size:14px;\">Refer below HyperLinks for Json Details:</span></b>\r\n<br>" + "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/DiscountTxnDetails.json/\">"
			+ " Discount Transaction Details" + "</a>" + "</br></br>" + "</li>" + "</ul>")
	// @formatter:on
	public CashMemoAndDetialsIdResponseDto partialUpdateCashMemo(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE, FOC_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType ,
			@ApiParam(name = "body", value = "Cash Memo object that needs to be updated", required = true) @RequestBody @Valid CashMemoPatchUpdateDto cashMemoPatchUpdateDto) {
		return cashMemoService.partialUpdateCashMemo(id, txnType, subTxnType, cashMemoPatchUpdateDto);
	}

	/**
	 * This method will delete cash memo by id.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param remarks
	 */
	@DeleteMapping("{id}")
	@PreAuthorize(CASH_MEMO_DELETE_PERMISSION)
	@ApiOperation(value = "API to delete cash memo", notes = "This API will delete cash memo by id.<br>")
	public void deleteCashMemo(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE, FOC_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "remarks", value = "Provide to set 'remarks'", required = false) @RequestParam(name = "remarks", required = false) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_255) String remarks) {
		cashMemoService.deleteCashMemo(id, txnType, subTxnType, remarks);
	}

	/**
	 * This method will update price for all items in cash memo based on cash memo
	 * id.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	@PatchMapping("{id}/price")
	@PreAuthorize(CASH_MEMO_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to update price details cash memo", notes = "This API will update price details of all items to cash memo based on cash memo id.")
	public CashMemoAndDetialsIdResponseDto updateAllItemPrice(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return cashMemoService.updateAllItemPrice(id, txnType, subTxnType);
	}

	/**
	 * Method to invoke order details to cash memo
	 * 
	 * @param orderToCashMemoRequestDto
	 * @param txnType
	 * @param subTxnType
	 * @return
	 */
	@PatchMapping("order")
	@PreAuthorize(CONVERT_AB_TO_CM_PERMISSION)
	@ApiOperation(value = "API to invoke order details to cash memo", notes = "This API will invoke order details to Cash memo.")
	public CashMemoAndDetialsIdResponseDto convertOrderToCM(
			@ApiParam(name = "body", value = "Order details for convert to CM", required = true) @RequestBody OrderToCashMemoRequestDto orderToCashMemoRequestDto,
			@ApiParam(name = "txnType", value = "'transaction type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "'sub transaction Type'", allowableValues = "NEW_CM, MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return cashMemoService.convertOrderToCM(orderToCashMemoRequestDto, txnType, subTxnType);

	}

	@GetMapping("view-tcs")
	public CustomerTcsDetailsResponseDto retrieveTcsPaymentDetails(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) @RequestParam(name = "id", required = true) String id,
			@ApiParam(name = "txnType", value = "'transaction type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "'sub transaction Type'", allowableValues = "NEW_CM, MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return cashMemoService.retrieveTcsPaymentDetails(id, txnType, subTxnType);

	}

	/**
	 * This method will get the TCS data against a Customer MobileNumber, Botique
	 * PanCard for a FiscalYear from EPOSS
	 * 
	 * @param customerMobileNo
	 * @param fiscalYear
	 * @param btqPanCard
	 * @return
	 */
	@GetMapping("tcs")
	public CustomerTcsData retrieveTcsData(
			@RequestParam(name = "customerMobileNo", required = true) @PatternCheck(regexp = RegExConstants.NUMERIC_REGEX) String customerMobileNo,
			@RequestParam(name = "fiscalYear", required = true) Short fiscalYear,
			@RequestParam(name = "btqPanCard", required = true) String btqPanCard) {
		return cashMemoService.retrieveTcsData(customerMobileNo, fiscalYear, btqPanCard);

	}
	/**
	 * this method is used to validate metal rate while confirming the cash memo
	 * this api is called while confirming the cash memo
	 * @return
	 */
	@PostMapping("/validate-metal-Rate")
	public void validateMetalRate(
			@ApiParam(name = "id", value = "'id' to edit cash memo", required = true) @RequestParam(name = "id", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM, GIFT_SALE, FOC_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "status", value = "'status' to update", allowableValues = "HOLD, CONFIRMED, APPROVAL_PENDING", required = true) @RequestParam(name = "status", required = true) @ValueOfEnum(enumClass = TransactionStatusEnum.class) String status,
			@ApiParam(name = "body", value = "Standard Metal Rate", required = true) @RequestBody MetalRateListDto metalRateList) {
		 cashMemoService.validateMetalRate(id,txnType,subTxnType,status,metalRateList);
	}
	
}
