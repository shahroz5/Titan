/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.service;

import java.math.BigDecimal;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.TepCashRefundLimitResponseDto;
import com.titan.poss.sales.dto.TransactionCreateDto;
import com.titan.poss.sales.dto.request.GepConfirmOrHoldDto;
import com.titan.poss.sales.dto.request.GepUpdateDto;
import com.titan.poss.sales.dto.request.GoodExchangeRequestConfirmDto;
import com.titan.poss.sales.dto.response.CmDetailsResponseDto;
import com.titan.poss.sales.dto.response.CmForCustomerResponseDto;
import com.titan.poss.sales.dto.response.GepAndItemIdDetailsResponseDto;
import com.titan.poss.sales.dto.response.GepResponseDto;
import com.titan.poss.sales.dto.response.GoodsExchangeDiscountResponseDto;
import com.titan.poss.sales.dto.response.PublishResponse;
import com.titan.poss.sales.dto.response.TransactionResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
public interface GoodsExchangeFacade {

	TransactionResponseDto openGoodsExchange(String txnType, String subTxnType,
			TransactionCreateDto transactionCreateDto);

	GepAndItemIdDetailsResponseDto getGoodsExchange(String id, String txnType, String subTxnType,
			Boolean recalculationRequired,Boolean isTepException);

	GepResponseDto updateGoodsExchange(String id, String txnType, String subTxnType, GepUpdateDto gepUpdateDto);

	GepResponseDto confirmGoodsExchange(String id, String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto goodsExchangeDto);

	ListResponse<CmDetailsResponseDto> getCashMemoDetails(String locationCode, Integer refDocNo, Short refFiscalYear,
			String txnType, String subTxnType);

	GepAndItemIdDetailsResponseDto updateGoodsExchangeItemsPrice(String id, String txnType, String subTxnType);

	void deleteGoodsExchange(String id, String txnType, String subTxnType, String remarks);

	/**
	 * @param id
	 * @param status
	 * @param txnType
	 * @param subTxnType
	 * @param gepConfirmOrHoldDto
	 * @return
	 */
	GepResponseDto confirmGoodsExchangeRequest(String id, String txnType, String subTxnType,
			GoodExchangeRequestConfirmDto goodsExchangeRequestConfirmDto,String workflowType);

	PublishResponse confirmGoodsExchangeTransactional(String id, String status, String txnType, String subTxnType,
			GepConfirmOrHoldDto goodsExchangeDto);

	ListResponse<GoodsExchangeDiscountResponseDto> checkApplicableDiscounts(String id, String txnType,
			String subTxnType);

	//void updateTepFromLegacytoNap(TepLegacyUpdateDto tepLegacyUpdateDto);

	ListResponse<CmForCustomerResponseDto> checkCmAvailable(String locationCode,String itemCode, String customerMobileNo, String customerId, Boolean isMigratedIgnored);

	
	void updateTepFromLegacytoNap(TepLegacyUpdateDto tepLegacyUpdateDto);

	TepCashRefundLimitResponseDto checkTEPCashLimit(Integer customerId, String txnType,BigDecimal refundAmt);
}
