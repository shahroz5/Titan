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
import com.titan.poss.sales.dto.ItemDetailsDto;
import com.titan.poss.sales.dto.ItemDetailsUpdateDto;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.response.OrderAndItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;
import com.titan.poss.sales.service.OrderItemService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller class for Order Items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesOrderItemController")
@RequestMapping(value = "sales/v2/orders/{id}/items")
public class OrderItemController {

	@Autowired
	private OrderItemService orderItemService;

	// @formatter:off
 
	private static final String ORDER_ADD_EDIT_PERMISSION = "hasPermission(#subTxnType,'NEW_AB')" + AND + START + SalesAccessControls.ADVANCE_BOOKING_ADD_EDIT + END + OR +
															"hasPermission(#subTxnType,'MANUAL_AB')" + AND + START + SalesAccessControls.MANUAL_AB_ADD_EDIT + END;
	private static final String ORDER_VIEW_PERMISSION = START + SalesAccessControls.ADVANCE_BOOKING_VIEW + END;
	private static final String ORDER_DELETE_PERMISSION = START + SalesAccessControls.ADVANCE_BOOKING_DELETE + END;

	// @formatter:on
	/**
	 * This method will add Item to order based on order id
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @param itemDetailsDto
	 * @return OrderAndItemDetailsResponseDto
	 */
	@PostMapping
	@PreAuthorize(ORDER_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to add Item to Order", notes = "This API will add item to order based on id.<br> Only standard metal rates are accepted.<br>")
	public OrderAndItemDetailsResponseDto addItemToOrder(
			@ApiParam(name = "id", value = "'id' of the order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'itemDetails' object that needs to be added", required = true) @RequestBody @Valid ItemDetailsDto itemDetailsDto) {

		return orderItemService.addItemToOrder(id, txnType, subTxnType, itemDetailsDto);

	}

	/**
	 * This method will fetch order item details by order id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @return OrderItemDetailsResponseDto
	 */
	@GetMapping({ "{itemId}" })
	@PreAuthorize(ORDER_VIEW_PERMISSION)
	@ApiOperation(value = "API to get Item Details of Order", notes = "This API will get item from order based on order id and itemId.")
	public OrderItemDetailsResponseDto getItemOfOrder(
			@ApiParam(name = "id", value = "'id' of the order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' of an Item in Order", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Provide if you want to search by 'txn type'", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide if you want to search by 'sub txn type'", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType) {

		return orderItemService.getItemOfOrder(id, itemId, txnType, subTxnType);
	}

	/**
	 * This method will Update order item details
	 * 
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @param itemDetailsDto
	 * @return OrderAndItemDetailsResponseDto
	 */
	// @formatter:off
	@PutMapping("{itemId}")
	@PreAuthorize(ORDER_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to update item details of Order", notes = "This API will update item details of order based on order id and itemId."
				+ "<br> Only standard metal rates are accepted.<br>"
				+ "'itemcode' and 'rowId' cannot be updated.")
	// @formatter:on
	public OrderAndItemDetailsResponseDto updateOrderItem(
			@ApiParam(name = "id", value = "'id' of the order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' of an Item in Order", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'itemDetails' object that needs to be updated", required = true) @RequestBody @Valid ItemDetailsDto itemDetailsDto) {

		return orderItemService.updateOrderItem(id, itemId, txnType, subTxnType, itemDetailsDto);
	}

	/**
	 * This method will partially update the order item.
	 * 
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 * @param itemDetailsUpdateDto
	 * @return OrderAndItemDetailsResponseDto
	 */
	@PatchMapping("{itemId}")
	@PreAuthorize(ORDER_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to partially update item deatails of Order", notes = "This API will partially update item of Order based on order id and itemId.")
	public OrderAndItemDetailsResponseDto partialUpdateOrderItem(
			@ApiParam(name = "id", value = "'id' of the order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' of an Item in Order", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "'itemDetails' object that needs to be updated", required = true) @RequestBody @Valid ItemDetailsUpdateDto itemDetailsUpdateDto) {

		return orderItemService.partialUpdateOrderItem(id, itemId, txnType, subTxnType, itemDetailsUpdateDto);
	}

	/**
	 * This method will delete the item from order by itemId
	 * 
	 * @param id
	 * @param itemId
	 * @param txnType
	 * @param subTxnType
	 */
	@DeleteMapping("{itemId}")
	@PreAuthorize(ORDER_DELETE_PERMISSION)
	@ApiOperation(value = "API to delete an Item from order", notes = "This API will delete order item by order id and itemId.<br>")
	public OrderResponseDto deleteOrderItem(
			@ApiParam(name = "id", value = "'id' of the order", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "itemId", value = "'itemId' of an Item in Order", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "txnType", value = "Sales Transaction type", allowableValues = "AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@ApiParam(name = "subTxnType", value = "Sub Transaction type", allowableValues = "NEW_AB,MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "cashMemoId", value = "'cashMemoId' of the order invoked cash memo", required = false) @RequestParam(name = "cashMemoId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String cashMemoId) {
		return orderItemService.deleteOrderItem(id, itemId, txnType, subTxnType, cashMemoId);
	}

}
