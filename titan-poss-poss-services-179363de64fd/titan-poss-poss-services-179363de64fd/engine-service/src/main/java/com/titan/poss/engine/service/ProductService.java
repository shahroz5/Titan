/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.springframework.data.domain.Pageable;

import com.titan.poss.core.dto.CustomLotMasterDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.ProductCategoryLiteDto;
import com.titan.poss.core.dto.ProductGroupLiteDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.dto.StoneDetailsLiteDto;
import com.titan.poss.engine.dto.request.StoneSearchRequestDto;
import com.titan.poss.engine.dto.response.ItemLotStoneListDto;
import com.titan.poss.engine.dto.response.ItemTypeDto;
import com.titan.poss.product.dto.ComplexityDto;
import com.titan.poss.product.dto.ItemStoneDetailsDto;
import com.titan.poss.product.dto.ItemStoneDto;
import com.titan.poss.product.dto.PurityDto;
import com.titan.poss.product.dto.StoneDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface ProductService {

	ListResponse<StoneDetailsLiteDto> listItemStoneLiteMapping(String itemCode, String lotNumber, String locationCode);

	/**
	 * This method will return the list of ProductCategory details based on
	 * isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ProductCategoryLiteDto>>
	 */
	PagedRestResponse<List<ProductCategoryLiteDto>> listProductCategoryLite(Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the list of ProductGroup details based on isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<ProductGroupLiteDto>>
	 */
	PagedRestResponse<List<ProductGroupLiteDto>> listProductGroupLite(Boolean isPageable, String plainStudded,
			String transactionType, Pageable pageable);

	/**
	 * @param string
	 * @return
	 */
	Map<String, String> listProductGroupLite(String plainStudded, String transactionType);

	/**
	 * @return
	 */
	Map<String, String> listProductCategoryLite();

	ListResponse<ItemTypeDto> listItemType(List<String> itemGroups);

	LovDto getProductLov(String lovType);

	/**
	 * This method will generate custom lot number.
	 * 
	 * @param docType
	 * @return CustomLotMasterDto
	 */
	CustomLotMasterDto generateLotNumber(String docType);

	ListResponse<ItemLiteDto> getItemList(List<String> itemCodes);

	PagedRestResponse<List<ItemDto>> getItems(ItemSearchRequestDto itemSearchRequestDto,String searchType, Pageable pageable) throws JSONException;

	PagedRestResponse<List<StoneDto>> getStones(StoneSearchRequestDto stoneSearchRequestDto, Pageable pageable);

	ListResponse<ItemStoneDto> getItemStones(String itemCode);

	/**
	 * @param itemCode
	 * @param lotNumber
	 * @return
	 */
	ItemLotStoneListDto getLotItemStonesWithDICheck(String itemCode, String lotNumber,Boolean isOnlyDI, boolean throwException);
	
	/**
	 * @param itemCode
	 * @param lotNumber
	 * @param throwException
	 * @return
	
	ItemLotStoneListDto getLotItemStones(String itemCode, String lotNumber, boolean throwException);
 */


	/**
	 * 
	 * @param itemCodes
	 * @return Map<String, ItemDetailsDto>
	 */
	Map<String, ItemDetailsDto> listItemDetails(List<String> itemCodes);

	PagedRestResponse<List<ComplexityDto>> listComplexity(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the list of Purity details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PurityDto>>
	 */
	PagedRestResponse<List<PurityDto>> listPurity(Boolean isActive, BigDecimal purity, String itemTypeCode,
			Pageable pageable);
	
	ItemsDto getItemDetails(String itemCode);

	ListResponse<ItemStoneDto> getItemStonesForCO(String itemCode);
	
	ItemStoneDetailsDto getItemAndStoneDetails(String itemCode,String lotNumber);
	
	ItemStoneDetailsDto saveItemAndLotDetails(String itemCode,String lotNumber);

}
