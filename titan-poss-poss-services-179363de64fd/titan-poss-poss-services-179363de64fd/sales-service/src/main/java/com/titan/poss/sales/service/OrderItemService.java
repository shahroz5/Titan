/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.sales.dto.ItemDetailsDto;
import com.titan.poss.sales.dto.ItemDetailsUpdateDto;
import com.titan.poss.sales.dto.response.OrderAndItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;

/**
 * Service interface for Cash Memo Items.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface OrderItemService {

	/**
	 * This method will the item to order
	 * 
	 * @param id
	 * @param transactionType
	 * @param subTxnType
	 * @param itemDetailsDto
	 * @return OrderAndItemDetailsResponseDto
	 */
	OrderAndItemDetailsResponseDto addItemToOrder(String id, String transactionType, String subTxnType,
			ItemDetailsDto itemDetailsDto);

	/**
	 * This method will get item details based on id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @return OrderItemDetailsResponseDto
	 */
	OrderItemDetailsResponseDto getItemOfOrder(String id, String itemId, String transactionType, String subTxnType);

	/**
	 * This method will update order item based on id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @param itemDetailsDto
	 * @return OrderAndItemDetailsResponseDto
	 */
	OrderAndItemDetailsResponseDto updateOrderItem(String id, String itemId, String transactionType, String subTxnType,
			ItemDetailsDto itemDetailsDto);

	/**
	 * This method will partially update order item.
	 * 
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @param itemDetailsUpdateDto
	 * @return OrderAndItemDetailsResponseDto
	 */
	OrderAndItemDetailsResponseDto partialUpdateOrderItem(String id, String itemId, String transactionType,
			String subTxnType, ItemDetailsUpdateDto itemDetailsUpdateDto);

	/**
	 * This method will delete order item by id and itemId.
	 * 
	 * @param id
	 * @param itemId
	 * @param transactionType
	 * @param subTxnType
	 * @return OrderResponseDto
	 */
	OrderResponseDto deleteOrderItem(String id, String itemId, String transactionType, String subTxnType,
			String cashMemoId);

}
