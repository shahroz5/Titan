/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service;

import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dto.request.AddTepItemRequestDto;
import com.titan.poss.sales.dto.request.TepUpdateItemRequestDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface TepItemService {

	GoodsExchangeDetailsDaoExt getTepItem(String id, String txnType, String subTxnType, String itemId);

	GoodsExchangeDaoExt deleteTepItem(String id, String txnType, String subTxnType, String itemId);

	GoodsExchangeDetailsDaoExt addItem(String id, String txnType, String subTxnType, AddTepItemRequestDto tepAddItem);

	GoodsExchangeDaoExt updateGoodsExchangeHeader(GoodsExchangeDetailsDaoExt goodsExchangeDetails);

	GoodsExchangeDetailsDaoExt updateItem(String id, String txnType, String subTxnType, String itemId,
			TepUpdateItemRequestDto tepItemUpdateRequestDto);
}
