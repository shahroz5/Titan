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
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.DiscountTxnLevelUpdateDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.service.DiscountFacadeService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Sales Discount controller class
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesDiscountController")
@RequestMapping("sales/v2/discounts/transaction-level")
public class DiscountController {

	@Autowired
	private DiscountFacadeService discountFacadeService;

	// @formatter:off
	private static final String DISCOUNT_VIEW_PERMISSION = IS_STORE_USER + AND 
			+ "(" + "hasPermission(#txnType,'CM')" + AND + START+ SalesAccessControls.CASH_MEMO_VIEW + END + OR 
			+ "hasPermission(#txnType,'AB')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_VIEW + END + OR
			+ "hasPermission(#txnType,'CO')" + AND + START + SalesAccessControls.CUSTOMER_ORDER_VIEW + END + ")";
	// @formatter:off
		
	// @formatter:off
	private static final String DISCOUNT_ADD_EDIT_PERMISSION = IS_STORE_USER + AND 
			+ "(" + "hasPermission(#txnType,'CM')" + AND + START+ SalesAccessControls.CASH_MEMO_ADD_EDIT + END + OR 
			+ "hasPermission(#txnType,'AB')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_ADD_EDIT + END + OR
			+ "hasPermission(#txnType,'CO')" + AND + START + SalesAccessControls.CUSTOMER_ORDER_PAYMENT_ADD_EDIT + END + ")";
	// @formatter:off

	/**
	 * This method will add the discount details at Transaction level
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param discountCreateDto
	 * @return
	 */

	// @formatter:off
	@ApiOperation(value = "API to apply discount at Transaction level", notes = "This API will apply discount at Transaction level<br><br>"
			+ "<span style = \"font-weight:bold;font-size:14px;\"> Transaction Type:</span>"
			+ "<ul>"
			+	"<li>CM</li>"
			+	"<li>AB</li>"
			+"</ul><br>"
			+ "<ul>"
			+ "<b><span style=\"font-size:14px;\">Refer below HyperLinks for Json Details:</span></b>\r\n<br>" 
			+"<li>"
			+	"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/DiscountValueDetail.json/\">"
			+		"Discount Value Details"
			+	"</a>"
			+	"</br></br>" 
			+"</li>"
			+"<li>" 
			+	"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/DiscountTxnDetails.json/\">"
			+	" Discount Transaction Details"
			+	"</a>"
			+	"</br></br>" 
			+"</li>" 
			+"</ul>")
	// @formatter:on
	@PostMapping
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public DiscountResponseDto applyTransactionLevelDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB, CO", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB, NEW_CO", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be added", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "discountType", value = "Provide 'discount type' of the applicable discount", allowableValues = "BILL_LEVEL_DISCOUNT, EMPLOYEE_DISCOUNT, TATA_EMPLOYEE_DISCOUNT, TSSS_DISCOUNT, COIN_OFFER_DISCOUNT, KARAT_EXCHANGE_OFFER_DISCOUNT, SYSTEM_DISCOUNT_DV, EMPOWERMENT_DISCOUNT, SYSTEM_DISCOUNT_GEP_PURITY,DIGI_GOLD_DISCOUNT,GRN_MULTIPLE_DISCOUNT,RIVAAH_CARD_DISCOUNT,RIVAAH_ASHIRWAAD_DISCOUNT, CO_BILL_LEVEL_DISCOUNT", required = true) @RequestParam(name = "discountType", required = true) @ValueOfEnum(enumClass = DiscountTypeEnum.class, nullCheck = true) String discountType,
			@ApiParam(name = "body", value = "discount object to be added", required = true) @RequestBody @Valid DiscountBillLevelCreateDto discountCreateDto) {

		return discountFacadeService.saveTransactionLevelDiscounts(transactionId, txnType, subTxnType,
				discountCreateDto, discountType);
	}

	/**
	 * This method will list all the discounts added at transaction level
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @return
	 */
	// @formatter:off
	@ApiOperation(value = "API to list Discount Details of sales transaction", notes = "This API will list the added discounts at Transaction level based on *applicableLevel* - *BILL_LEVEL or ITEM_LEVEL*, *discountType* and *status* - *OPEN or CONFIRMED*")
	// @formatter:on
	@GetMapping
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	public DiscountResponseDto listTransactionLevelDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be added", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "applicableLevel", value = "Provide 'applicable level' of the discount", allowableValues = "BILL_LEVEL,ITEM_LEVEL", required = false) @RequestParam(name = "applicableLevel", required = false) @ValueOfEnum(enumClass = DiscountApplicableLevelEnum.class, nullCheck = false) String applicableLevel,
			@ApiParam(name = "discountType", value = "Provide 'discount type' of the applicable discount", allowableValues = "BILL_LEVEL_DISCOUNT,EMPLOYEE_DISCOUNT, TATA_EMPLOYEE_DISCOUNT, TSSS_DISCOUNT, COIN_OFFER_DISCOUNT, KARAT_EXCHANGE_OFFER_DISCOUNT, SYSTEM_DISCOUNT_DV, EMPOWERMENT_DISCOUNT, SYSTEM_DISCOUNT_GEP_PURITY,GRN_MULTIPLE_DISCOUNT,RIVAAH_ASHIRWAAD_DISCOUNT", required = false) @RequestParam(name = "discountType", required = false) @ValueOfEnum(enumClass = DiscountTypeEnum.class, nullCheck = false) String discountType,
			@ApiParam(name = "status", value = "Provide 'status' of the applicable discount", allowableValues = "OPEN,CONFIRMED", required = false) @RequestParam(name = "status", required = false) @ValueOfEnum(enumClass = DiscountSalesStatusEnum.class, nullCheck = false) String status) {
		return discountFacadeService.listTransactionLevelDiscounts(transactionId, txnType, subTxnType, applicableLevel,
				discountType, status);

	}

	/**
	 * This method will update the discount details
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param discountUpdateDto
	 * @return
	 */

	//@formatter:off
	@ApiOperation(value = "API to update Transaction level discount details", notes = "This API will update the transaction level discount details."
			+ "<ul>"
			+ "<b><span style=\"font-size:14px;\">Refer below HyperLinks for Json Details:</span></b>\r\n<br>" 
			+"<li>"
			+	"<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/DiscountValueDetail.json/\">"
			+		"Discount Value Details"
			+	"</a>"
			+	"</br></br>" 
			+"</li>"
			+"</ul>")
	// @formatter:on
	@PatchMapping
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void updateTransactionLevelDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be updated", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "discountType", value = "Provide 'discount type' of the applicable discount", allowableValues = "BILL_LEVEL_DISCOUNT, COIN_OFFER_DISCOUNT, KARAT_EXCHANGE_OFFER_DISCOUNT, SYSTEM_DISCOUNT_DV, EMPOWERMENT_DISCOUNT, SYSTEM_DISCOUNT_GEP_PURITY,GRN_MULTIPLE_DISCOUNT", required = false) @RequestParam(name = "discountType", required = false) @ValueOfEnum(enumClass = DiscountTypeEnum.class, nullCheck = false) String discountType,
			@ApiParam(name = "isPriceUpdate", value = "Provide 'is Price Update' flag value if applicable", required = false) @RequestParam(name = "isPriceUpdate", required = false) Boolean isPriceUpdate,
			@ApiParam(name = "discountTxnId", value = "Provide 'discount Txn Id' of the applicable discount", required = false) @RequestParam(name = "discountTxnId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountTxnId,
			@ApiParam(name = "body", value = "discount object to be updated", required = false) @RequestBody @Valid DiscountTxnLevelUpdateDto discountUpdateDto) {

		discountFacadeService.updateTransactionLevelDiscount(transactionId, txnType, subTxnType, discountType,
				isPriceUpdate, discountTxnId, discountUpdateDto);
	}

	/**
	 * This method will delete the discount added
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * 
	 */
	//@formatter:off
	@ApiOperation(value = "API to delete particular discount details", notes = "This API will delete the discount details by *discountTxnId*.")
	// @formatter:on
	@DeleteMapping("/{discountTxnId}")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void deleteTransactionLevelDiscount(
			@ApiParam(name = "discountTxnId", value = "provide 'discountTxnId' to be deleted", required = true) @PathVariable(name = "discountTxnId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountTxnId,
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "discountType", value = "Provide 'discount type' of the applicable discount", allowableValues = "BILL_LEVEL_DISCOUNT,EMPLOYEE_DISCOUNT, TATA_EMPLOYEE_DISCOUNT, TSSS_DISCOUNT, COIN_OFFER_DISCOUNT, KARAT_EXCHANGE_OFFER_DISCOUNT, SYSTEM_DISCOUNT_DV, EMPOWERMENT_DISCOUNT,SYSTEM_DISCOUNT_GEP_PURITY,GRN_MULTIPLE_DISCOUNT,DIGI_GOLD_DISCOUNT", required = true) @RequestParam(name = "discountType", required = true) @ValueOfEnum(enumClass = DiscountTypeEnum.class, nullCheck = true) String discountType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be updated", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId) {

		discountFacadeService.deleteTransactionLevelDiscount(transactionId, txnType, subTxnType, discountTxnId);

	}

	//@formatter:off
	@ApiOperation(value = "API to confirm discount at Transaction level", notes = "This API will confirm the discount applied at Transaction level"
			+ "like Employee Discount,TSSS Discount, TATA Employee Discount, Bill Level Discount, Encircle Discount, GHS Discount voucher")
	// @formatter:on
	@PutMapping
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void confirmTransactionLevelDiscount(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be updated", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "discountType", value = "Provide 'discount type' of the applicable discount", allowableValues = "EMPLOYEE_DISCOUNT, TATA_EMPLOYEE_DISCOUNT, TSSS_DISCOUNT,ULP_DISCOUNT_BIRTHDAY,ULP_DISCOUNT_SPOUSE_BIRTHDAY,ULP_DISCOUNT_ANNIVERSARY, COIN_OFFER_DISCOUNT, KARAT_EXCHANGE_OFFER_DISCOUNT, SYSTEM_DISCOUNT_DV, EMPOWERMENT_DISCOUNT,SYSTEM_DISCOUNT_GEP_PURITY,GRN_MULTIPLE_DISCOUNT,DIGI_GOLD_DISCOUNT,RIVAAH_CARD_DISCOUNT,RIVAAH_ASHIRWAAD_DISCOUNT", required = true) @RequestParam(name = "discountType", required = true) @ValueOfEnum(enumClass = DiscountTypeEnum.class, nullCheck = true) String discountType,
			@ApiParam(name = "discountTxnId", value = "Provide 'discount Txn Id' of the applicable discount", required = false) @RequestParam(name = "discountTxnId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountTxnId) {
		discountFacadeService.confirmTransactionLevelDiscount(transactionId, txnType, subTxnType, discountType,
				discountTxnId);
	}

	//@formatter:off
	@ApiOperation(value = "API to delete discounts at Transaction level ", notes = "This API will delete the discount details by *discountType*")
	// @formatter:on
	@DeleteMapping
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void deleteTransactionLevelDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "discountType", value = "Provide 'discount type' of the applicable discount", allowableValues = "BILL_LEVEL_DISCOUNT,EMPLOYEE_DISCOUNT, TATA_EMPLOYEE_DISCOUNT, TSSS_DISCOUNT,ULP_DISCOUNT_BIRTHDAY,ULP_DISCOUNT_SPOUSE_BIRTHDAY,ULP_DISCOUNT_ANNIVERSARY, COIN_OFFER_DISCOUNT, KARAT_EXCHANGE_OFFER_DISCOUNT, EMPOWERMENT_DISCOUNT,RIVAAH_CARD_DISCOUNT,GRN_MULTIPLE_DISCOUNT", required = true) @RequestParam(name = "discountType", required = true) @ValueOfEnum(enumClass = DiscountTypeEnum.class, nullCheck = true) String discountType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be updated", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId) {

		discountFacadeService.deleteTransactionLevelDiscounts(transactionId, txnType, subTxnType, discountType);

	}

}
