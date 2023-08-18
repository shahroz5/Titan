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
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.DiscountItemLevelCreateDto;
import com.titan.poss.sales.dto.request.DiscountItemUpdateDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDiscountsResponseDto;
import com.titan.poss.sales.service.DiscountItemFacadeService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Sales Discount Item controller class
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@PreAuthorize(IS_STORE_USER)
@RestController("salesDiscountItemController")
@RequestMapping("sales/v2/discounts/item-level")
public class DiscountItemController {

	@Autowired
	private DiscountItemFacadeService discountItemFacadeService;

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
	 * This method will add the discount details at ITEM_LEVEL
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param itemId
	 * @param discountCreateDto
	 * @return
	 */

	// @formatter:off
	@ApiOperation(value = "API to Save discount at Item level", notes = "This API will Save discount at Item level.<br><br>"
			+ "<span style = \"font-weight:bold;font-size:14px;\"> Transaction Type:</span>"
			+ "<ul>"
			+	"<li>CM</li>"
			+	"<li>AB</li>"
			+"</ul>"
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
	@PostMapping
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public DiscountResponseDto addDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be added", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "itemId", value = "provide 'item Id' for which discount to be added", required = true) @RequestParam(name = "itemId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@ApiParam(name = "body", value = "discount object to be added", required = true) @RequestBody @Valid DiscountItemLevelCreateDto discountCreateDto) {

		return discountItemFacadeService.saveDiscounts(transactionId, txnType, subTxnType, itemId, discountCreateDto);
	}

	/**
	 * This method will list all the discounts added at ITEM_LEVEL
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param itemId
	 * @return
	 */
	// @formatter:off
	@ApiOperation(value = "API to list Discount Details of a item within the transaction", notes = "This API will list the applied discounts at ITEM_LEVEL")
	// @formatter:on
	@GetMapping
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	public DiscountResponseDto listDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discounts to be listed", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "itemId", value = "provide 'item Id' for which discounts to be listed", required = true) @RequestParam(name = "itemId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId) {
		return discountItemFacadeService.listDiscounts(transactionId, txnType, subTxnType, itemId);

	}

	/**
	 * This method will update the discount details
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param itemId
	 * @param discountUpdateDto
	 * @return
	 */
	//@formatter:off
	@ApiOperation(value = "API to update item level discount details", notes = "This API will update item level discount details."
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
	@PatchMapping("/{discountTxnId}")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public DiscountDetailResponseDto updateDiscount(
			@ApiParam(name = "discountTxnId", value = "provide 'discountTxnId' of discount to be updated", required = true) @PathVariable(name = "discountTxnId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountTxnId,
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be updated", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "itemId", value = "provide 'item Id' for which discount to be updated", required = true) @RequestParam(name = "itemId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId,
			@ApiParam(name = "body", value = "discount object to be updated", required = true) @RequestBody @Valid DiscountItemUpdateDto discountUpdateDto) {

		return discountItemFacadeService.updateDiscount(transactionId, txnType, subTxnType, itemId, discountTxnId,
				discountUpdateDto);
	}

	/**
	 * This method will delete the discount added
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param itemId
	 */
	//@formatter:off
		@ApiOperation(value = "API to delete discount details of a item", notes = "This API will delete the discount details by *discountTxnId* and *itemId*")
		// @formatter:on
	@DeleteMapping("/{discountTxnId}")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void deleteDiscount(
			@ApiParam(name = "discountTxnId", value = "provide 'discountTxnId' to be deleted", required = true) @PathVariable(name = "discountTxnId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountTxnId,
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be updated", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "itemId", value = "provide 'item Id' for which discount to be updated", required = true) @RequestParam(name = "itemId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId) {

		discountItemFacadeService.deleteDiscount(transactionId, txnType, subTxnType, itemId, discountTxnId);

	}

	/**
	 * This method will update all the discounts added at ITEM_LEVEL
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param itemId
	 * @return
	 */
	// @formatter:off
	@ApiOperation(value = "API to update Discount Details of a item within the transaction", notes = "This API will update the applied discounts at ITEM_LEVEL")
	// @formatter:on
	@PutMapping
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void updateItemDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be updated", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "itemId", value = "provide 'item Id' for which discount to be updated", required = true) @RequestParam(name = "itemId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId) {

		discountItemFacadeService.updateItemDiscounts(transactionId, txnType, subTxnType, itemId, false, null);

	}

	/**
	 * This method will delete all the discounts of a item
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param itemId
	 */
	//@formatter:off
		@ApiOperation(value = "API to delete all the discount details of a item", notes = "This API will delete all the discount details by *itemId*")
		// @formatter:on
	@DeleteMapping
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void deleteItemDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be updated", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "itemId", value = "provide 'item Id' for which discount to be updated", required = true) @RequestParam(name = "itemId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId) {

		discountItemFacadeService.deleteItemDiscounts(transactionId, txnType, subTxnType, itemId, false);

	}

	/**
	 * API to list the orders discount in cash memo
	 * 
	 * @param txnType
	 * @param subTxnType
	 * @param transactionId
	 * @param itemId
	 * @param discountTxnId
	 * @param clubbedDiscountId
	 * @param configsRequired
	 * @param itemProductGroupCode
	 * @return OrderItemDiscountsResponseDto
	 */
	//@formatter:off
		@ApiOperation(value = "API to list all the order discounts or for particular item", notes = "This API will list all the order discounts details or for particular item")
		// @formatter:on
	@GetMapping("/orders")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	public OrderItemDiscountsResponseDto listOrderDiscounts(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which order discounts to be listed", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "orderItemId", value = "provide 'order item Id' for which discounts to be listed", required = false) @RequestParam(name = "orderItemId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String orderItemId,
			@ApiParam(name = "discountTxnId", value = "provide 'discount Txn Id' for which discount config details need to be fetched", required = false) @RequestParam(name = "discountTxnId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountTxnId,
			@ApiParam(name = "clubbedDiscountId", value = "Provide 'clubbed Discount Id' of the applied discounts on a item", required = false) @RequestParam(name = "clubbedDiscountId", required = false) String clubbedDiscountId,
			@ApiParam(name = "configsRequired", value = "Provide 'configs Required' , if complete discount config details need to be fetched", required = true) @RequestParam(name = "configsRequired", required = true) Boolean configsRequired,
			@ApiParam(name = "itemProductGroupCode", value = "Provide 'item product group'", required = false) @RequestParam(name = "itemProductGroupCode", required = false) String itemProductGroupCode) {

		return discountItemFacadeService.listOrderItemDiscounts(transactionId, txnType, subTxnType, orderItemId,
				discountTxnId, clubbedDiscountId, configsRequired, itemProductGroupCode);

	}

	//@formatter:off
	@ApiOperation(value = "API to update cumulative discount at Item level", notes = "This API will update cumulative discount at Item level.<br><br>"
			+ "<span style = \"font-weight:bold;font-size:14px;\"> Transaction Type:</span>" 
			+ "<ul>" 
			+ "<li>CM</li>"
			+ "<li>AB</li>" 
			+ "</ul>")
	// @formatter:on
	@PostMapping("slab")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void checkAndUpdateCumulativeDiscount(
			@ApiParam(name = "txnType", value = "Provide 'txn type' of the sales transaction", allowableValues = "CM,AB", required = true) @RequestParam(name = "txnType", required = true) @ValueOfEnum(enumClass = TransactionTypeEnum.class, nullCheck = true) String txnType,
			@ApiParam(name = "subTxnType", value = "Provide 'sub txn type' of the sales transaction", allowableValues = "NEW_CM, MANUAL_CM, NEW_AB, MANUAL_AB", required = true) @RequestParam(name = "subTxnType", required = true) @ValueOfEnum(enumClass = SubTxnTypeEnum.class, nullCheck = true) String subTxnType,
			@ApiParam(name = "transactionId", value = "provide 'transaction Id' for which discount to be added", required = true) @RequestParam(name = "transactionId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String transactionId,
			@ApiParam(name = "itemId", value = "provide 'item Id' for which discount to be added", required = true) @RequestParam(name = "itemId", required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String itemId) {

		discountItemFacadeService.checkAndUpdateCumulativeDiscount(transactionId, txnType, subTxnType, itemId);
	}
}
