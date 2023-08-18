/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

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
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.ItemDetailsDto;
import com.titan.poss.sales.dto.ItemDetailsUpdateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.response.CashMemoAndItemDetialsResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.service.CashMemoItemService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Cash Memo Item Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesCashMemoItemController")
@RequestMapping(value = "sales/v2/cash-memos")
public class CashMemoItemController {

	@Autowired
	private CashMemoItemService cashMemoItemService;

	/**
	 * This method will add item to cash memo on hold or open status.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param itemDetailsCreateDto
	 * @return CashMemoAndItemDetialsResponseDto
	 */
	@PostMapping("/{id}/items")
	@ApiOperation(value = "API to add item to cash memo", notes = "This API will add item to cash memo based on id.<br> Only standard metal rates are accepted.<br>")
	public CashMemoAndItemDetialsResponseDto addItemToCashMemo(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'itemDetails' object that needs to be added", required = true) @RequestBody @Valid ItemDetailsDto itemDetailsCreateDto,
			@ApiParam(name = "isIGST", value = "is IGST", required = true) @RequestParam(required = true) Boolean isIGST) {
		return cashMemoItemService.addItemToCashMemo(id, txnType, subTxnType, itemDetailsCreateDto, isIGST);
	}

	/**
	 * This method will get item details based on id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @return ItemDetailsResponseDto
	 */
	@GetMapping("/{id}/items/{itemId}")
	@ApiOperation(value = "API to get item in cash memo", notes = "This API will get item in cash memo based on id and itemId.")
	public ItemDetailsResponseDto getItemInCashMemo(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to get item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {
		return cashMemoItemService.getItemInCashMemo(id, itemId, txnType, subTxnType);
	}

	/**
	 * This method will update cash memo item based on id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @param itemDetailsCreateDto
	 * @param removeFromOrder
	 * @return CashMemoAndItemDetialsResponseDto
	 */
	// @formatter:off
	@PutMapping("/{id}/items/{itemId}")
	@ApiOperation(value = "API to update item in cash memo", notes = "This API will update item to cash memo based on id and itemId."
			+ "<br> Only standard metal rates are accepted.<br>"
			+ "'itemcode' and 'rowId' cannot be updated.")
	// @formatter:on
	public CashMemoAndItemDetialsResponseDto updateCashMemoItem(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to edit item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'itemDetails' object that needs to be updated", required = true) @RequestBody @Valid ItemDetailsDto itemDetailsCreateDto,
			@ApiParam(name = "removeFromOrder", value = "Provide if you want to remove from order", required = false) @RequestParam(name = "removeFromOrder", required = false) Boolean removeFromOrder) {
		return cashMemoItemService.updateCashMemoItem(id, itemId, txnType, subTxnType, itemDetailsCreateDto,
				removeFromOrder);
	}

	/**
	 * This method will partially update cash memo item.
	 * 
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @param itemDetailsUpdateDto
	 * @return CashMemoAndItemDetialsResponseDto
	 */
	@PatchMapping("/{id}/items/{itemId}")
	@ApiOperation(value = "API to partially update item in cash memo", notes = "This API will partially update item to cash memo based on id and itemId.")
	public CashMemoAndItemDetialsResponseDto partialUpdateCashMemoItem(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to edit item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'itemDetails' object that needs to be updated", required = true) @RequestBody @Valid ItemDetailsUpdateDto itemDetailsUpdateDto) {
		return cashMemoItemService.partialUpdateCashMemoItem(id, itemId, txnType, subTxnType, itemDetailsUpdateDto);
	}

	/**
	 * This method will delete cashMemo item by id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @return CashMemoResponseDto
	 */
	@DeleteMapping("/{id}/items/{itemId}")
	@ApiOperation(value = "API to delete cash memo item", notes = "This API will delete cash memo item by id and itemId.<br>")
	public CashMemoResponseDto deleteCashMemoItem(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' to get item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "removeFromOrder", value = "Provide if you want to remove from order", required = false) @RequestParam(name = "removeFromOrder", required = false) Boolean removeFromOrder) {
		return cashMemoItemService.deleteCashMemoItem(id, itemId, txnType, subTxnType, removeFromOrder);
	}

	@GetMapping("/items/list")
	@ApiOperation(value = "API to list all cash memo items by criterias", notes = "This API will list all confirmed cash memo item by customer, location, business date.<br>"
			+ "This API will be used in cummulative discount")
	public ListResponse<ItemDetailsResponseDto> listCashMemoItems(
			@ApiParam(name = "customerId", required = true) @RequestParam Integer customerId) {
		return cashMemoItemService.listCashMemoItems(customerId);
	}

	/**
	 * This method will get the valid price details for the item.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param orderPriceRequest
	 * @return PriceResponseDto
	 */
	@PostMapping("/{id}/items/order-price")
	@ApiOperation(value = "API to calulcate price for reserved items.", notes = "This API will calculate price for the reseved item if the item is allowed in transaction.<br> "
			+ "<b>NOTE:</b> This API to be called if the bin group of the item is 'RESERVEBIN'.<br/>")
	public PriceResponseDto getOrderItemPriceDetails(
			@ApiParam(name = "id", value = "'id' to get cash memo", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "CM", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide to search by 'subTxnType'", allowableValues = "NEW_CM, MANUAL_CM", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "price request object that needs to be added", required = true) @RequestBody @Valid OrdersPriceRequest orderPriceRequest) {
		return cashMemoItemService.getOrderItemPriceDetails(id, txnType, subTxnType, orderPriceRequest);
	}
}
