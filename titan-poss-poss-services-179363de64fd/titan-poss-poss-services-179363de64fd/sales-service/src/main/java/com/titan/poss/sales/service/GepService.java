/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.List;

import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.GoodsExhangeDaoDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.request.GepConfirmOrHoldDto;
import com.titan.poss.sales.dto.request.GepUpdateDto;
import com.titan.poss.sales.dto.response.GoodExchangeDiscountDetailsDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface GepService {

	SalesTxnDaoExt createOpenGep(String txnType, String subTxnType, TransactionCreateDto transactionCreateDto);

	GoodsExchangeDaoExt getGoodsExchangeByIdAndTxnTypeAndSubTxnType(String id, String txnType, String subTxnType);

	List<GoodsExchangeDetailsDaoExt> getGoodsExchangeDetails(GoodsExchangeDaoExt goodsExchangeDaoExt);

	GoodsExchangeDaoExt updateGoodsExchange(String id, String txnType, String subTxnType, GepUpdateDto gepUpdateDto);

	GoodsExhangeDaoDto confirmGep(String id, String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto gepConfirmOrHoldDto);

	List<GoodsExchangeDetailsDaoExt> updateGepItemsPrice(GoodsExchangeDaoExt goodsExchangeDao);

	GoodsExchangeDaoExt updateGoodsExchangeHeader(GoodsExchangeDaoExt goodsExchangeDao);

	void deleteGep(String id, String txnType, String subTxnType, String remarks, GoodsExchangeDaoExt goodsExchange);



	GoodExchangeDiscountDetailsDto checkApplicableDiscounts(GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList);
}
