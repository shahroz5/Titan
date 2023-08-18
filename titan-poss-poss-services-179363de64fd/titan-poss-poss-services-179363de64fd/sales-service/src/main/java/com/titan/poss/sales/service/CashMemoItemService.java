/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dto.ItemDetailsDto;
import com.titan.poss.sales.dto.ItemDetailsUpdateDto;
import com.titan.poss.sales.dto.response.CashMemoAndItemDetialsResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;

/**
 * Service interface for Cash Memo Items.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface CashMemoItemService {

	/**
	 * This method will add item to cash memo on hold or open status.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param itemDetailsCreateDto
	 * @return CashMemoAndItemDetialsResponseDto
	 */
	CashMemoAndItemDetialsResponseDto addItemToCashMemo(String id, String transactionType, String subTxnType,
			ItemDetailsDto itemDetailsCreateDto, Boolean isIGST);

	/**
	 * This method will get item details based on id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @return ItemDetailsResponseDto
	 */
	ItemDetailsResponseDto getItemInCashMemo(String id, String itemId, String transactionType, String subTxnType);

	/**
	 * This method will update cash memo item based on id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @param itemDetailsCreateDto
	 * @param removeFromOrder
	 * @return CashMemoAndItemDetialsResponseDto
	 */
	CashMemoAndItemDetialsResponseDto updateCashMemoItem(String id, String itemId, String transactionType,
			String subTxnType, ItemDetailsDto itemDetailsCreateDto, Boolean removeFromOrder);

	/**
	 * This method will partially update cash memo item.
	 * 
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @param itemDetailsUpdateDto
	 * @return CashMemoAndItemDetialsResponseDto
	 */
	CashMemoAndItemDetialsResponseDto partialUpdateCashMemoItem(String id, String itemId, String transactionType,
			String subTxnType, ItemDetailsUpdateDto itemDetailsUpdateDto);

	/**
	 * This method will delete cashMemo item by id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @return CashMemoResponseDto
	 */
	CashMemoResponseDto deleteCashMemoItem(String id, String itemId, String transactionType, String subTxnType,
			Boolean removeFromOrder);

	/**
	 * @param customerId
	 * @return
	 */
	ListResponse<ItemDetailsResponseDto> listCashMemoItems(Integer customerId);

	ItemDetailsResponseDto mapCashMemoDetailsToItemDto(CashMemoDetailsDaoExt cashMemoDetailsDao);

	/**
	 * This method will get the valid price details for the item.
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param orderPriceRequest
	 * @return PriceResponseDto
	 */
	PriceResponseDto getOrderItemPriceDetails(String id, String transactionType, String subTxnType,
			OrdersPriceRequest orderPriceRequest);

}
