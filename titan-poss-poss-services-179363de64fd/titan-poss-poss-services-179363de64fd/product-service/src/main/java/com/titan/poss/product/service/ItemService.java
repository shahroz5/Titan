/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dto.request.ItemCreateDto;
import com.titan.poss.product.dto.request.ItemLiteRequestDto;
import com.titan.poss.product.dto.request.ItemMaterialDto;
import com.titan.poss.product.dto.request.ItemStoneDto;
import com.titan.poss.product.dto.request.ItemUpdateDto;
import com.titan.poss.product.dto.response.MaterialCodeDto;
import com.titan.poss.product.dto.response.StoneCodeDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
//@CacheDefaults(cacheName = "itemCode")
public interface ItemService {

	/**
	 * This method will return the list of Item details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<ItemDto>>
	 */
	PagedRestResponse<List<ItemDto>> listItem(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Item details based on the itemCode.
	 * 
	 * @param itemCode
	 * @return ItemDto
	 */
	ItemDto getItem(String itemCode);

	/**
	 * This method will save the Item details.
	 * 
	 * @param itemCreateDto
	 * @return ItemDto
	 */
	ItemDto addItem(ItemCreateDto itemCreateDto);

	/**
	 * This method will update the Item details.
	 * 
	 * @param itemCode
	 * @param itemUpdateDto
	 * @return ItemDto
	 */
	ItemDto updateItem(String itemCode, ItemUpdateDto itemUpdateDto);

	ConversionItemDto listItems(String itemCode, String lotNumber);

	ItemStoneDto itemStoneMapping(String itemCode, ItemStoneDto itemStoneDto);

	ListResponse<StoneCodeDto> listItemStoneMapping(String itemCode, Boolean isActive);

	/**
	 * This method will return the list of Item material mapping details based on
	 * isActive
	 * 
	 * @param itemCode
	 * @param isActive
	 * @return List<MaterialCodeDto>
	 */
	ListResponse<MaterialCodeDto> listItemMaterialMapping(String itemCode, Boolean isActive);

	/**
	 * This method will create/remove mapping between item and material.
	 * 
	 * @param itemCode
	 * @param itemMaterialDto
	 * @return ItemMaterialDto
	 */
	ItemMaterialDto itemMaterialMapping(String itemCode, ItemMaterialDto itemMaterialDto);

	/**
	 * @param itemLiteDto
	 * @return
	 */
	ListResponse<ItemLiteDto> getItemLiteDetails(@Valid ItemLiteRequestDto itemLiteDto);

	/**
	 * @param itemCode
	 * @return
	 */
	ItemDao getItemDao(@PatternCheck(regexp = "^[A-Z0-9]{1,20}$") String itemCode);

	/**
	 * @param itemCode
	 * @return
	 */
	ConversionItemDto getItemMasterForConversion(String itemCode);

}
