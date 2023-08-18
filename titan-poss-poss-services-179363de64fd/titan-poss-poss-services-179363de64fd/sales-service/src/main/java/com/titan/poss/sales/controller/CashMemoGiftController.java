/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.AND;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.sales.dto.GiftDetailsDto;
import com.titan.poss.sales.dto.constants.GiftTypeEnum;
import com.titan.poss.sales.dto.constants.GiftVendorCodeEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.GiftDetailsCreateDto;
import com.titan.poss.sales.dto.request.GiftDetailsUpdateDto;
import com.titan.poss.sales.dto.response.CashMemoAndGiftDetailsResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.service.CashMemoGiftService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Cash Memo Gift Controller.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesCashMemoGiftController")
@RequestMapping(value = "sales/v2/cash-memos/{id}/gift-items")
public class CashMemoGiftController {

	@Autowired
	private CashMemoGiftService cashMemoGiftService;

	private static final String HAS_GIFT_CARD_SUB_TXN_TYPE = "hasPermission(#subTxnType,'GIFT_SALE')";

	private static final String GIFT_CARD_SALE_PERMISSION = HAS_GIFT_CARD_SUB_TXN_TYPE + AND + START
			+ SalesAccessControls.GIFT_CARD_SALE + END;

	private static final String GIFT_CARD_HISTORY_PERMISSION = HAS_GIFT_CARD_SUB_TXN_TYPE + AND + START
			+ SalesAccessControls.GIFT_CARD_HISTORY + END;

	private static final String GIFT_CARD_DELETE_PERMISSION = HAS_GIFT_CARD_SUB_TXN_TYPE + AND + START
			+ SalesAccessControls.GIFT_CARD_DELETE + END;

	/**
	 * This method will add gift item to cash memo on hold or open status.
	 *
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param vendorCode
	 * @param giftType
	 * @param giftDetailsCreateDto
	 * @return CashMemoAndGiftDetailsResponseDto
	 */
	@PostMapping
	@PreAuthorize(GIFT_CARD_SALE_PERMISSION)
	@ApiOperation(value = "API to add gift item to cash memo", notes = "This API will add gift to cash memo based on id.")
	public CashMemoAndGiftDetailsResponseDto addGiftToCashMemo(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "vendorCode", value = "Vendor code that needs to be used", allowableValues = "QC_GC", required = true) @RequestParam(name = "vendorCode", required = true) @ValueOfEnum(enumClass = GiftVendorCodeEnum.class) String vendorCode,
			@ApiParam(name = "giftType", value = "Gift Type that needs to be used", allowableValues = "CARD", required = true) @RequestParam(name = "giftType", required = true) @ValueOfEnum(enumClass = GiftTypeEnum.class) String giftType,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "GIFT_SALE", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'giftDetails' object that needs to be added", required = true) @RequestBody @Valid GiftDetailsCreateDto giftDetailsCreateDto) {
		return cashMemoGiftService.addGiftToCashMemo(id, vendorCode, giftType, txnType, subTxnType,
				giftDetailsCreateDto);
	}

	/**
	 * This method will get item details based on id and itemId.
	 *
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @return GiftDetailsDto
	 */
	@GetMapping("{itemId}")
	@PreAuthorize(GIFT_CARD_SALE_PERMISSION + " OR " + GIFT_CARD_HISTORY_PERMISSION)
	@ApiOperation(value = "API to get gift item in cash memo", notes = "This API will get gift item in cash memo based on id and itemId.")
	public GiftDetailsDto getGiftInCashMemo(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to get item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "GIFT_SALE", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return cashMemoGiftService.getGiftInCashMemo(id, itemId, txnType, subTxnType);
	}

	/**
	 * This method will delete cashMemo gift item by id and itemId.
	 *
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @return CashMemoResponseDto
	 */
	@DeleteMapping("{itemId}")
	@PreAuthorize(GIFT_CARD_DELETE_PERMISSION)
	@ApiOperation(value = "API to delete cash memo gift item", notes = "This API will delete cash memo gift item by id and itemId.<br>")
	public CashMemoResponseDto deleteCashMemoGift(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to get item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "GIFT_SALE", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return cashMemoGiftService.deleteCashMemoGift(id, itemId, txnType, subTxnType);
	}

	/**
	 * This method will partially update cash memo gift item.
	 *
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @param giftDetailsUpdateDto
	 * @return CashMemoAndGiftDetailsResponseDto
	 */
	@PatchMapping("{itemId}")
	@PreAuthorize(GIFT_CARD_SALE_PERMISSION)
	@ApiOperation(value = "API to partially update gift item in cash memo", notes = "This API will partially update gift item to cash memo based on id and itemId")
	public CashMemoAndGiftDetailsResponseDto partialUpdateCashMemoGift(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to edit item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "GIFT_SALE", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'giftDetails' object that needs to be updated", required = true) @RequestBody @Valid GiftDetailsUpdateDto giftDetailsUpdateDto) {
		return cashMemoGiftService.partialUpdateCashMemoGift(id, itemId, txnType, subTxnType, giftDetailsUpdateDto);
	}

}
