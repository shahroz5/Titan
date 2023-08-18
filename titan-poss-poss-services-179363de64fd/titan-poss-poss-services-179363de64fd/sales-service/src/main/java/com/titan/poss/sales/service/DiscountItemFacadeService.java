/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dto.request.DiscountItemLevelCreateDto;
import com.titan.poss.sales.dto.request.DiscountItemUpdateDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDiscountsResponseDto;

/**
 * Service Interface for Discount service
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesDiscountItemFacadeService")
public interface DiscountItemFacadeService {

	DiscountResponseDto saveDiscounts(String transactionId, String txnType, String subTxnType, String itemId,
			DiscountItemLevelCreateDto discountCreateDto);

	DiscountResponseDto listDiscounts(String transactionId, String txnType, String subTxnType, String itemId);

	void deleteDiscount(String transactionId, String txnType, String subTxnType, String itemId, String discountTxnId);

	DiscountDetailResponseDto updateDiscount(String transactionId, String txnType, String subTxnType, String itemId,
			String discountTxnId, DiscountItemUpdateDto discountUpdateDto);

	void updateItemDiscounts(String transactionId, String txnType, String subTxnType, String itemId,
			Boolean isPriceUpdate, Map<String, List<DiscountItemDetailsDaoExt>> applicableCumulativeItemsMap);

	void deleteItemDiscounts(String transactionId, String txnType, String subTxnType, String itemId,
			Boolean asPartOfItemDelete);

	OrderItemDiscountsResponseDto listOrderItemDiscounts(String transactionId, String txnType, String subTxnType,
			String orderItemId, String discountTxnId, String clubbedDiscountId, Boolean configsRequired,
			String itemProductGroupCode);

	void checkAndUpdateCumulativeDiscount(String transactionId, String txnType, String subTxnType, String itemId);

}
