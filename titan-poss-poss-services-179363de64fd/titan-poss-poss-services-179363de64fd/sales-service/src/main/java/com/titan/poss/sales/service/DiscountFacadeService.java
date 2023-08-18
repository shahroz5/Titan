/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import org.springframework.stereotype.Service;

import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.request.DiscountTxnLevelUpdateDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;

/**
 * Service Interface for Discount service
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesDiscountFacadeService")
public interface DiscountFacadeService {

	DiscountResponseDto saveTransactionLevelDiscounts(String transactionId, String txnType, String subTxnType,
			DiscountBillLevelCreateDto discountCreateDto, String discountType);

	DiscountResponseDto listTransactionLevelDiscounts(String transactionId, String txnType, String subTxnType,
			String applicableLevel, String discountType, String status);

	void deleteTransactionLevelDiscount(String transactionId, String txnType, String subTxnType, String discountTxnId);

	void updateTransactionLevelDiscount(String transactionId, String txnType, String subTxnType, String discountType,
			Boolean isPriceUpdate, String discountTxnId, DiscountTxnLevelUpdateDto discountUpdateDto);

	void confirmTransactionLevelDiscount(String transactionId, String txnType, String subTxnType, String discountType,
			String discountTxnId);

	void deleteTransactionLevelDiscounts(String transactionId, String txnType, String subTxnType, String discountType);

	void deleteLinkedTransactionLevelDiscountForAnItem(String transactionId, String txnType, String subTxnType,
			String itemId);
}
