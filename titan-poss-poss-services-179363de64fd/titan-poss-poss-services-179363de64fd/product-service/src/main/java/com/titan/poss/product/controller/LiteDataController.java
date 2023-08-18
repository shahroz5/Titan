/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dto.constants.ItemGroupEnum;
import com.titan.poss.product.dto.request.ItemLiteRequestDto;
import com.titan.poss.product.dto.response.ComplexityLiteDto;
import com.titan.poss.product.dto.response.ItemTypeDto;
import com.titan.poss.product.dto.response.MaterialLiteDto;
import com.titan.poss.product.dto.response.PriceGroupLiteDto;
import com.titan.poss.product.dto.response.StoneTypeLiteDto;
import com.titan.poss.product.service.ComplexityService;
import com.titan.poss.product.service.ItemService;
import com.titan.poss.product.service.ItemTypeService;
import com.titan.poss.product.service.MaterialTypeService;
import com.titan.poss.product.service.PriceGroupService;
import com.titan.poss.product.service.StoneTypeService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("ProductLiteDataController")
@RequestMapping("product/v2/lite-data")
public class LiteDataController {

	@Autowired
	private ItemService itemService;

	@Autowired
	private ItemTypeService itemTypeServiice;

	@Autowired
	private MaterialTypeService materialService;

	@Autowired
	private ComplexityService complexityService;

	@Autowired
	private StoneTypeService stoneTypeService;

	@Autowired
	private PriceGroupService priceGroupService;

	/**
	 * This method will return the list of StoneType details based on the
	 * isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<StoneTypeLiteDto>>
	 */
	//@formatter:off
	@ApiOperation(value = "View the list of StoneType details", notes = "This API returns the list of StoneType details based on **isPageable**<br>"
			+ "**stoneTypeCode** filter is available in this API.")
	//@formatter:on
	@GetMapping("/stone-types")
	@ApiPageable
	public PagedRestResponse<List<StoneTypeLiteDto>> listStoneTypeLite(
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX) String stoneTypeCode,
			@ApiIgnore Pageable pageable) {
		return stoneTypeService.listStoneTypeLite(isPageable, stoneTypeCode, pageable);
	}
	//api for getting studded split
	@GetMapping("/conversion/{itemCode}")
	public ConversionItemDto listItems(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(name = "lotNumber", required = false) @PatternCheck(regexp = RegExConstants.LOT_NUMBER_REGEX) String lotNumber) {
		return itemService.listItems(itemCode, lotNumber);
	}

	//conversion api for plain split
	@GetMapping("/conversionItem/{itemCode}")
	public ConversionItemDto getItemMasterForConversion(
			@PathVariable("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode) {
		return itemService.getItemMasterForConversion(itemCode);
	}

	/**
	 * This method will return the list of Other Material details based on
	 * materialType and isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<MaterialLiteDto>>
	 */
	@ApiOperation(value = "View the list of Other Material type details", notes = "This API returns the list of Other Material type details based on ** other materialType** and **isPageable**")
	@GetMapping("/material-types")
	@ApiPageable
	public PagedRestResponse<List<MaterialLiteDto>> listMaterial(
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return materialService.listMaterialLite(isPageable, pageable);
	}

	/**
	 * This method will return the list of Complexity details based on isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ComplexityLiteDto>>
	 */
	@ApiOperation(value = "View the list of Complexity details", notes = "This API returns the list of Complexity details based on **isPageable**")
	@GetMapping("/complexities")
	@ApiPageable
	public PagedRestResponse<List<ComplexityLiteDto>> listComplexity(
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return complexityService.listComplexityLite(isPageable, pageable);
	}

	/**
	 * This method will return the Item details based on the filters Applied.
	 * 
	 * @param includeProductGroups
	 * @param excludeProductGroups
	 * @param includeProductCategories
	 * @param excludeProductCategories
	 * @param isFocItem
	 * @return ListResponse<ItemLiteDto>
	 */
	@ApiOperation(value = "View the Item details based on the filters Applied ", notes = "This API returns the List of Item details based on filters Applied <br></br>"
			+ "Filters include<br></br>" + "1.List of ProductGroupCodes to be included<br>"
			+ "1. List of ProductGroupCodes to be excluded<br>" + "2. List of ProductCategoryCodes to be included<br>"
			+ "3. List of ProductCategoryCodes to be excluded<br>" + "4. isFocItem - it can be true/false<br>" + "")
	@PostMapping("/items")
	public ListResponse<ItemLiteDto> getItemLiteBasedOnFilters(@Valid @RequestBody() ItemLiteRequestDto itemLiteDto) {

		return itemService.getItemLiteDetails(itemLiteDto);
	}

	/**
	 * This method will return the list of Item type details based on the itemType
	 * and isActive
	 * 
	 * @param itemType
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ItemTypeDto>>
	 */
	@ApiOperation(value = "View the list of Item type details", notes = "This API returns the list of Item type details based on **itemType** and **isActive**")
	@GetMapping("/item-types")
	@ApiPageable
	public PagedRestResponse<List<ItemTypeDto>> listItemTypes(
			@RequestParam(required = false) @ApiParam(value = "Item Group", required = false, allowableValues = "METAL, MULTI_METAL, STONE,OTHER") @ValueOfEnum(enumClass = ItemGroupEnum.class) String itemGroup,
			@RequestParam(required = false) Boolean isActive, @ApiIgnore Pageable pageable) {
		return itemTypeServiice.listItemTypes(itemGroup, isActive, pageable);
	}

	@ApiOperation(value = "View the list of stone quality details", notes = "This API returns the list of stone quality details.")
	@GetMapping("/stone-qualities")
	@ApiPageable
	public PagedRestResponse<List<String>> listStoneQualityLite(@ApiIgnore Pageable pageable) {
		return stoneTypeService.listStoneQualityLite(pageable);
	}

	/**
	 * This method will return the list of Town details based on the town name
	 * 
	 * @param townName
	 * @return List<CurrencyLiteDto>
	 */
	@ApiOperation(value = "API to get PriceGroup details", notes = "This API will get the PriceGroup details")
	@GetMapping("/priceGroups")
	public PagedRestResponse<List<PriceGroupLiteDto>> listPriceGroupLite(
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return priceGroupService.listPriceGroupLite(isPageable, pageable);

	}
}
