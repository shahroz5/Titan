/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import java.util.List;

import javax.validation.Valid;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.SqlInjectionCheck;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.engine.dto.request.FocItemRequestDto;
import com.titan.poss.engine.dto.response.InventoryFocItemDto;
import com.titan.poss.engine.dto.response.ItemQuantityDto;
import com.titan.poss.engine.service.InventoryService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Inventory Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("inventoryEngineController")
@RequestMapping(value = "engine/v2/inventory")
@Validated
public class InventoryController {

	@Autowired
	private InventoryService inventoryService;

	/**
	 * This method will give total quantity of items present in inventory for a give
	 * itemCode.
	 * 
	 * @param itemCode
	 * @param pageable
	 * @return PagedRestResponse<List<ItemQuantityDto>>
	 * @throws JSONException 
	 */
	@ApiPageable
	@ApiOperation(value = "API to get total quantity of items", notes = "This API will list total quantity of items"
			+ " present in inventory for a given item code search.")
	@GetMapping("/items")
	public PagedRestResponse<List<ItemQuantityDto>> getInventoryItemDetails(
			@ApiParam(value = "Provide to search by 'item code'", required = true) @RequestParam(name = "itemCode", required = true) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@ApiIgnore Pageable pageable) throws JSONException {

		return inventoryService.getInventoryItemDetails(itemCode, pageable);
	}

	/**
	 * This method will return the list of item-lotNumber combinations based on item
	 * code and lot number.
	 * 
	 * @param itemCode
	 * @param lotNumber
	 * @param pageable
	 * @return PagedRestResponse<List<InventoryItemDto>>
	 */
	@ApiPageable
	@ApiOperation(value = "API to get inventory details", notes = "This API will list inventory details for the given itemCode and lot number.<br>"
			+ "<b>NOTE: </b>Sort will not work. API gives response by applying sort on <b>'totalQuantity'</b> in ascending order.<br>"
			+ "Also, valid <b>'binGroupCode'</b> items are populated at the beginning of the list in response (for ease of lot selection in UI).<br>")
	@GetMapping("/items/{itemCode}/lots")
	public PagedRestResponse<List<InventoryItemDto>> getInventoryItemLotDetails(
			@ApiParam(value = "'item code' to get inventory details", required = true) @PathVariable("itemCode") @SqlInjectionCheck @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX, nullCheck = true) String itemCode,
			@ApiParam(value = "'lot number' to get inventory details", required = false) @RequestParam(value = "lotNumber", required = false) @SqlInjectionCheck @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber,
			@ApiIgnore Pageable pageable) {

		return inventoryService.getInventoryItemLotDetails(itemCode, lotNumber, pageable);
	}

	/**
	 * This method will validate whether the item is sale able or not based on
	 * inventoryId.
	 * 
	 * @param inventoryId
	 * @return InventoryItemDto
	 */
	@ApiOperation(value = "API to validate item from inventory", notes = "This API will validate item from inventory based on inventory id OR item code (either one should be provided, but not both).")
	@GetMapping("saleable")
	public InventoryItemDto validateInventoryItem(
			@ApiParam(value = "'inventory id' to validate item for sale", required = false) @RequestParam(value = "inventoryId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String inventoryId,
			@ApiParam(value = "'item code' to validate item for sale", required = false) @RequestParam(value = "itemCode", required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode) {

		return inventoryService.validateInventoryItem(inventoryId, itemCode);

	}

	/**
	 * This method will return the list of coin details.
	 * 
	 * @param itemCodeList
	 * @param pageable
	 * @return List<CoinDetailsDto>
	 */
	@ApiOperation(value = "API to get coin details", notes = "This API will list coin details. If saleable check is not provided, then only valid coins will be listed. i.e, coins that are eligible for sale.")
	@GetMapping("/coins")
	public ListResponse<CoinDetailsDto> getCoinDetails(
			@ApiParam(name = "itemCode", value = "'item code' to get coin details by itemCode", required = false) @RequestParam(value = "itemCode", required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@ApiParam(name = "withSaleableCheck", value = "'withSaleableCheck' to get coin details by saleable check", required = false) @RequestParam(value = "withSaleableCheck", required = false) Boolean withSaleableCheck) {

		return inventoryService.getCoinDetails(itemCode, withSaleableCheck);
	}

	/**
	 * This method will list the Inventory Details for applicable FOC item codes
	 * 
	 * @param focItemRequestDto
	 * @param pageable
	 * @return PagedRestResponse<List<InventoryItemDto>>
	 */
	@ApiPageable
	@ApiOperation(value = "API to list the Inventory Details for applicable FOC item codes", notes = "This API will return the available FOC items in the Inventory")
	@PostMapping("/foc-items")
	public PagedRestResponse<List<InventoryFocItemDto>> listFocItems(
			@ApiParam(name = "isPageable", value = "By default true, means response is paginated", required = false) @RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiParam(name = "body", value = "'itemCodes' of applicable FOC schemes", required = true) @RequestBody @Valid FocItemRequestDto focItemRequestDto,
			@ApiIgnore Pageable pageable) {
		return inventoryService.listFocItems(focItemRequestDto, pageable, isPageable);

	}
	/**
	 * This method will validate whether the item is present in inventory or not based on
	 * inventoryId.
	 * 
	 * @param inventoryId
	 * @return InventoryItemDto
	 */
	@ApiOperation(value = "API to validate item from inventory", notes = "This API will validate item from inventory based on inventory id OR item code (either one should be provided, but not both).")
	@GetMapping("item")
	public InventoryItemDto validateInventoryItems(
			@ApiParam(value = "'inventory id' to validate item for sale", required = false) @RequestParam(value = "inventoryId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String inventoryId,
			@ApiParam(value = "'item code' to validate item for sale", required = false) @RequestParam(value = "itemCode", required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode) {

		return inventoryService.validateInventoryItems(inventoryId, itemCode);

	}

}
