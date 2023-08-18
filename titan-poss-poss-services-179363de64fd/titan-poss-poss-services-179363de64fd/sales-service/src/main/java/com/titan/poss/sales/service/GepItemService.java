/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service;

import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dto.request.GepItemDetailRequestDto;
import com.titan.poss.sales.dto.request.GepItemUpdateRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface GepItemService {

//	GepAndItemIdDetailsResponseDto updateGepItemsPrice(String id, String txnType, String subTxnType);

	GoodsExchangeDetailsDaoExt addItem(String id, String txnType, String subTxnType,
			GepItemDetailRequestDto gepItemDetailRequestDto);

	GoodsExchangeDaoExt updateGoodsExchangeHeader(GoodsExchangeDetailsDaoExt goodsExchangeDetails);

	GoodsExchangeDetailsDaoExt getGepItem(String id, String txnType, String subTxnType, String itemId);

	GoodsExchangeDaoExt deleteGepItem(String id, String txnType, String subTxnType, String itemId);

	GoodsExchangeDetailsDaoExt updateItem(String id, String txnType, String subTxnType, String itemId,
			GepItemUpdateRequestDto gepItemUpdateRequestDto);
}
