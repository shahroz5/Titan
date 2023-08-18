/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service;

import java.util.List;

import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.GoodsExhangeDaoDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.request.GepConfirmOrHoldDto;
import com.titan.poss.sales.dto.request.GepUpdateDto;
import com.titan.poss.sales.dto.request.GoodExchangeRequestConfirmDto;
import com.titan.poss.sales.dto.response.CmDetailsResponseDto;
import com.titan.poss.sales.dto.response.GoodExchangeDiscountDetailsDto;
import com.titan.poss.sales.dto.response.CmForCustomerResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface TepService {

	SalesTxnDaoExt createOpenTep(String txnType, String subTxnType, TransactionCreateDto transactionCreateDto);

	GoodsExchangeDaoExt getGoodsExchangeByIdAndTxnTypeAndSubTxnType(String id, String txnType, String subTxnType);

	List<GoodsExchangeDetailsDaoExt> getGoodsExchangeDetails(GoodsExchangeDaoExt goodsExchangeDaoExt);

	GoodsExchangeDaoExt updateGoodsExchange(String id, String txnType, String subTxnType, GepUpdateDto gepUpdateDto);

	ListResponse<CmDetailsResponseDto> getCashMemoDetails(String locationCode, Integer refDocNo, Short refFiscalYear,
			String txnType,String subTxnType);
	
	ListResponse<CmForCustomerResponseDto> getCmDetails(String locationCode, String itemCode,
			String customerMobile, String customerId);
	
	GoodsExhangeDaoDto confirmTep(String id, String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto gepConfirmOrHoldDto);

	void deleteTep(String id, String txnType, String subTxnType, String remarks, GoodsExchangeDaoExt goodsExchange);

	List<GoodsExchangeDetailsDaoExt> updateTepItemsPrice(GoodsExchangeDaoExt goodsExchangeDao);

	GoodsExchangeDaoExt updateGoodsExchangeHeader(GoodsExchangeDaoExt goodsExchangeDao);

	/**
	 * @param id
	 * @param status
	 * @param txnType
	 * @param subTxnType
	 * @param gepConfirmOrHoldDto
	 * @return
	 */
	GoodsExhangeDaoDto confirmGoodsExchangeRequest(String id, String txnType, String subTxnType,
			GoodExchangeRequestConfirmDto goodsExchangeRequestConfirmDto,String workFlowType);

	TepPriceResponseDto validateAndRecalculateFullValueTep(GoodsExchangeDaoExt goodsExchange,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, MetalRateListDto metalRateListDto,
			Boolean recalculationRequired);
	
	TepPriceResponseDto validateAndRecalculateTepException(GoodsExchangeDaoExt goodsExchange,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList, MetalRateListDto metalRateListDto,
			Boolean recalculationRequired);

	GoodExchangeDiscountDetailsDto checkApplicableDiscounts(GoodsExchangeDaoExt goodsExchangeDaoExt,
			List<GoodsExchangeDetailsDaoExt> goodsExchangeDetailsList);
	
	GoodsExchangeDaoExt updateTepFromLegacytoNap(TepLegacyUpdateDto tepLegacyUpdateDto);
	
	 void updateLegacyTepItems(GoodsExchangeDaoExt tepItems); 
}
