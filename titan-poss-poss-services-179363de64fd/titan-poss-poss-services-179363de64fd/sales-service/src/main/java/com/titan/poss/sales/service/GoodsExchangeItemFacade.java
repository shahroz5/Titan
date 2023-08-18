/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service;

import com.titan.poss.sales.dto.request.AddTepItemRequestDto;
import com.titan.poss.sales.dto.request.GepItemDetailRequestDto;
import com.titan.poss.sales.dto.request.GepItemUpdateRequestDto;
import com.titan.poss.sales.dto.request.TepUpdateItemRequestDto;
import com.titan.poss.sales.dto.response.GepAndItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.GepItemDetailsDto;
import com.titan.poss.sales.dto.response.GepResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface GoodsExchangeItemFacade {

	GepAndItemDetailsResponseDto addGEPItem(String id, String txnType, String subTxnType,
			GepItemDetailRequestDto gepItemDetailRequestDto);

	GepItemDetailsDto getGoodsExchangeItem(String id, String txnType, String subTxnType, String itemId);

	GepResponseDto deleteGoodsExchangeItem(String id, String txnType, String subTxnType, String itemId);

	GepAndItemDetailsResponseDto updateGoodsExchangeItem(String id, String txnType, String subTxnType, String itemId,
			GepItemUpdateRequestDto gepItemUpdateRequestDto);

	GepAndItemDetailsResponseDto addTepItem(String id, String txnType, String subTxnType,
			AddTepItemRequestDto tepAddItem);

	GepAndItemDetailsResponseDto updateTepItem(String id, String txnType, String subTxnType, String itemId,
			TepUpdateItemRequestDto tepItemUpdateRequestDto);
}
