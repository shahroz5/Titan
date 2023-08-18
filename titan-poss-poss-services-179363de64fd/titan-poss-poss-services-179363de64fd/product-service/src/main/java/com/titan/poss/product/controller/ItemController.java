/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_API_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ProductMasterACLConstants;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dto.request.ItemCreateDto;
import com.titan.poss.product.dto.request.ItemMaterialDto;
import com.titan.poss.product.dto.request.ItemStoneDto;
import com.titan.poss.product.dto.request.ItemUpdateDto;
import com.titan.poss.product.dto.response.MaterialCodeDto;
import com.titan.poss.product.dto.response.StoneCodeDto;
import com.titan.poss.product.service.ItemService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@Validated
@RequestMapping("product/v2/items")
public class ItemController {

	@Autowired
	private ItemService itemService;

	private static final String ITEM_VIEW_PERMISSION = START + ProductMasterACLConstants.PRODUCT_MASTERS_ITEM_VIEW
			+ END;

	private static final String ITEM_ADD_EDIT_PERMISSION = START
			+ ProductMasterACLConstants.PRODUCT_MASTERS_ITEM_ADD_EDIT + END;

	private static final String ITEM_STONE_MAP_ADD_EDIT_PERMISSION = START
			+ ProductMasterACLConstants.PRODUCT_ITEM_STONE_MAPPING_ADD_EDIT + END;

	private static final String ITEM_STONE_MAP_VIEW_PERMISSION = START
			+ ProductMasterACLConstants.PRODUCT_ITEM_STONE_MAPPING_VIEW + END;

	private static final String ITEM_MATERIAL_MAP_ADD_EDIT_PERMISSION = START
			+ ProductMasterACLConstants.PRODUCT_ITEM_STONE_MAPPING_ADD_EDIT + END;

	private static final String ITEM_MATERIAL_MAP_VIEW_PERMISSION = START
			+ ProductMasterACLConstants.PRODUCT_ITEM_STONE_MAPPING_VIEW + END;

	/**
	 * This method will return the list of Item details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ItemDto>>
	 */
	@ApiOperation(value = "View the list of Item details", notes = "This API returns the list of Item details based on **isActive**")
	@GetMapping
	@ApiPageable
	@PreAuthorize(ITEM_VIEW_PERMISSION)
	public PagedRestResponse<List<ItemDto>> listItem(@RequestParam(required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return itemService.listItem(isActive, pageable);
	}

	/**
	 * This method will return the Item details based on the itemCode.
	 * 
	 * @param itemCode
	 * @return ItemDto
	 */
	@ApiOperation(value = "View the Item details based on the itemCode", notes = "This API returns the Item details based on the **itemCode**")
	@GetMapping(value = "/{itemCode}")
	@PreAuthorize(ITEM_VIEW_PERMISSION)
	public ItemDto getItem(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode) {
		return itemService.getItem(itemCode);
	}

	/**
	 * This method will save the Item details.
	 * 
	 * @param itemCreateDto
	 * @param bindingResult
	 * @return ItemDto
	 */
	@ApiOperation(value = "Save the Item details", notes = "This API saves the Item details")
	@PostMapping
	@PreAuthorize(ITEM_ADD_EDIT_PERMISSION)
	public ItemDto addItem(@RequestBody @Valid ItemCreateDto itemCreateDto) {
		return itemService.addItem(itemCreateDto);
	}

	/**
	 * This method will update the Item details.
	 * 
	 * @param itemCode
	 * @param itemUpdateDto
	 * @param bindingResult
	 * @return ItemDto
	 */
	@ApiOperation(value = "Update the Item details", notes = "This API updates the Item details <br/> if **isActive** is false, then it will be soft deleted based on the **itemCode**")
	@PatchMapping(value = "/{itemCode}")
	@PreAuthorize(ITEM_ADD_EDIT_PERMISSION)
	public ItemDto updateItem(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestBody @Valid ItemUpdateDto itemUpdateDto) {

		return itemService.updateItem(itemCode, itemUpdateDto);
	}

	/**
	 * This method will return the list of Item stone mapping details based on
	 * isActive.
	 * 
	 * @param itemCode
	 * @param isActive
	 * @return List<ItemStoneMappingDto>
	 */
	@ApiOperation(value = "View the list of Item stone mapping details", notes = "This API returns the list of Item stone mapping details based on **isActive**")
	@GetMapping("/{itemCode}/stones")
	@PreAuthorize(ITEM_STONE_MAP_VIEW_PERMISSION)
	public ListResponse<StoneCodeDto> listItemStoneMapping(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) Boolean isActive) {
		return itemService.listItemStoneMapping(itemCode, isActive);
	}

	/**
	 * This method will create/remove mapping between item and stone.
	 * 
	 * @param itemCode
	 * @param itemStoneDto
	 * @param bindingResult
	 * @return ItemStoneDto
	 */
	@PatchMapping(value = "/{itemCode}/stones")
	@ApiOperation(value = "Create/Remove Mapping between items and stones", notes = "This API creates/removes Mapping between items and stones")
	@PreAuthorize(ITEM_STONE_MAP_ADD_EDIT_PERMISSION)
	public ItemStoneDto itemStoneMapping(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestBody @Valid ItemStoneDto itemStoneDto) {

		return itemService.itemStoneMapping(itemCode, itemStoneDto);

	}

	/**
	 * This method will return the list of Item material mapping details based on
	 * isActive
	 * 
	 * @param itemCode
	 * @param isActive
	 * @return List<MaterialCodeDto>
	 */
	@PreAuthorize(ITEM_MATERIAL_MAP_VIEW_PERMISSION)
	@ApiOperation(value = "View the list of Item materials mapping details", notes = "This API returns the list of Item material mapping details based on **isActive**")
	@GetMapping("/{itemCode}/materials")
	public ListResponse<MaterialCodeDto> listItemMaterialMapping(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) Boolean isActive) {
		return itemService.listItemMaterialMapping(itemCode, isActive);
	}

	/**
	 * This method will create/remove mapping between item and material.
	 * 
	 * @param itemCode
	 * @param itemMaterialDto
	 * @return ItemMaterialDto
	 */
	@PreAuthorize(ITEM_MATERIAL_MAP_ADD_EDIT_PERMISSION)
	@PatchMapping(value = "/{itemCode}/materials")
	@ApiOperation(value = "Create/Remove Mapping between items and materials", notes = "This API creates/removes Mapping between items and materials")
	public ItemMaterialDto itemMaterialMapping(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestBody @Valid ItemMaterialDto itemMaterialDto) {

		return itemService.itemMaterialMapping(itemCode, itemMaterialDto);

	}

	/**
	 * This method will return the Item details based on the itemCode.
	 * 
	 * @param itemCode
	 * @return ItemDto
	 */
	@ApiOperation(value = "View the Item details based on the itemCode", notes = "This API returns the Item details based on the **itemCode**")
	@GetMapping(value = "/datasync/{itemCode}")
	@PreAuthorize(IS_API_USER)
	public ItemDao getItemDao(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode) {
		return itemService.getItemDao(itemCode);
	}

}
