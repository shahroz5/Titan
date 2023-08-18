/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.AddTepItemRequestDto;
import com.titan.poss.sales.dto.request.GepItemDetailRequestDto;
import com.titan.poss.sales.dto.request.GepItemUpdateRequestDto;
import com.titan.poss.sales.dto.request.TepUpdateItemRequestDto;
import com.titan.poss.sales.dto.response.GepAndItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.GepItemDetailsDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.service.GoodsExchangeItemFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Validated
@RestController("salesGoodsExchangeItemController")
@RequestMapping(value = "sales/v2/goods-exchange/{id}")
@PreAuthorize(IS_STORE_USER)
public class GoodsExchangeItemController {

	@Autowired
	private GoodsExchangeItemFacade goodsExchangeItemFacade;

	@PostMapping("/gep/items")
	@ApiOperation(value = "API to add a GEP item", notes = "This API will add a GEP item based on id.")
	public GepAndItemDetailsResponseDto addGEPItem(
			@ApiParam(name = "id", value = "'id' to get GEP", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "GEP item details that needs to be added", required = true) @RequestBody @Valid GepItemDetailRequestDto gepItemDetailRequestDto) {
		return goodsExchangeItemFacade.addGEPItem(id, txnType, subTxnType, gepItemDetailRequestDto);
	}

	@PutMapping("/gep/items/{itemId}")
	@ApiOperation(value = "API to update a GEP item", notes = "This API will update a GEP item based on id and itemId")
	public GepAndItemDetailsResponseDto updateGepItem(
			@ApiParam(name = "id", value = "'id' to get GEP", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "itemId", value = "'itemId' to get item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "body", value = "GEP item details that needs to be updated", required = true) @RequestBody @Valid GepItemUpdateRequestDto gepItemUpdateRequestDto) {
		return goodsExchangeItemFacade.updateGoodsExchangeItem(id, txnType, subTxnType, itemId,
				gepItemUpdateRequestDto);
	}

	@GetMapping("/items/{itemId}")
	@ApiOperation(value = "API to get item in goods exchange", notes = "This API will get item in goods exchange based on id and itemId")
	public GepItemDetailsDto getGoodsExchangeItem(
			@ApiParam(name = "id", value = "'id' to get goods exchange", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "itemId", value = "'itemId' to get item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId) {
		return goodsExchangeItemFacade.getGoodsExchangeItem(id, txnType, subTxnType, itemId);
	}

	@DeleteMapping("/items/{itemId}")
	@ApiOperation(value = "API to delete goods exchange item", notes = "This API will delete goods exchange item by id and itemId.<br>")
	public GepResponseDto deleteGoodsExchangeItem(
			@ApiParam(name = "id", value = "'id' to get GEP", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "GEP, TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_GEP, MANUAL_GEP, NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "itemId", value = "'itemId' to delete item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId) {
		return goodsExchangeItemFacade.deleteGoodsExchangeItem(id, txnType, subTxnType, itemId);
	}

	//@formatter:off
	@PostMapping("/tep/items")
	@ApiOperation(value = "API to add a TEP item", notes = "This API will add a TEP item based on id. <b>Coin offer discount</b>"
			+ " checkbox should be enabled when Gold Coin(product group code : 73) is added & cash memo details is manadatory. If"
			+ " <b>coin offer discount</b> checkbox is checked and cash memo details id is null then user will get an exception.<br>"
			+ " <b>Note 1: </b> For Gold Coin(product group code : 73) & Loose Stones/Diamond(product group code : 74) quantity should "
			+ " be editable for regular TEP scenario. In case of <b>TEP Exception</b> scenario quantity should be **1** only."
			+ " Apart from Gold Coin & Loose Stones/Diamond, for all other product group code's item quantity will be **1** only."
			+ " <br><b>Note 2 : </b> For Cut Piece TEP item details json is mandatory and quantity will always be 1."
			+ " <br><b>Note 3 : </b> For Cut Piece TEP inventoryId is mandatory."
			+ " <br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ " &nbsp;&nbsp;"
			+ " <li><a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/ItemDetails.json\">"
			+ " CUT_PIECE_ITEM_DETAILS</a> (sub txn type:CUT_PIECE_TEP,itemDetails JSON)"
			+ " </br></br>"
			+ " </li>"
			+ " <li><a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/sales-service/src/main/resources/sales/json/TEPDiscountDetails.json\">"
			+ " TEP_DISCOUNT_DETAILS</a> (discountDetails JSON)"
			+ " </br></br>"
			+ " </li>")
	//@formatter:on
	public GepAndItemDetailsResponseDto addTepItem(
			@ApiParam(name = "id", value = "'id' to get TEP", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "body", value = "TEP item details that needs to be added", required = true) @RequestBody @Valid AddTepItemRequestDto addTepItem) {
		return goodsExchangeItemFacade.addTepItem(id, txnType, subTxnType, addTepItem);
	}

	// @formatter:off
	@ApiOperation(value = "API to update a TEP item", notes = "This API will update a TEP item based on id. **isSaleable** field can be "
			+ " updated by using this API. This field should be populated based on configuration. If configuration is true "
			+ " then boutique user can disable this but if the configuration is false then boutique user cannot enable this field.<br>"
			+ " If the user wants to enable this field when configuration is false then boutique user will get an exception.")
	// @formatter:on
	@PutMapping("/tep/items/{itemId}")
	public GepAndItemDetailsResponseDto updateTepItem(
			@ApiParam(name = "id", value = "'id' to get TEP", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@RequestParam @ApiParam(value = "Sales Txn Type", required = true, allowableValues = "TEP") @ValueOfEnum(enumClass = TransactionTypeEnum.class) String txnType,
			@RequestParam @ApiParam(value = "Sales Sub Txn Type", required = true, allowableValues = "NEW_TEP, MANUAL_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_INTER_BRAND_TEP, MANUAL_FULL_VALUE_TEP") @ValueOfEnum(enumClass = SubTxnTypeEnum.class) String subTxnType,
			@ApiParam(name = "itemId", value = "'itemId' to get item", required = true) @PathVariable("itemId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String itemId,
			@ApiParam(name = "body", value = "TEP item details that needs to be updated", required = true) @RequestBody @Valid TepUpdateItemRequestDto tepItemUpdateRequestDto) {
		return goodsExchangeItemFacade.updateTepItem(id, txnType, subTxnType, itemId, tepItemUpdateRequestDto);
	}

}
