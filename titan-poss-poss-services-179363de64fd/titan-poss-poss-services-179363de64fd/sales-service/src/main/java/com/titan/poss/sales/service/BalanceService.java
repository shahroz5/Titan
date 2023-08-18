/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;

import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.response.BooleanResponse;
import com.titan.poss.sales.dto.CustomerCouponDto;
import com.titan.poss.sales.dto.response.AccountDetailsDto;
import com.titan.poss.sales.dto.response.DiscountVoucherResponseDto;

/**
 * Service interface for Balance.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface BalanceService {

	/**
	 * This method will get gift card balance.
	 * 
	 * @param vendorCode
	 * @param cardNumber
	 * @param trackData
	 * @param otpRequired
	 * @return GcResponseDto
	 */
	GcResponseDto giftCardBalance(String vendorCode, String cardNumber, String trackData, Boolean otpRequired);

	/**
	 * This method will get ULP balance.
	 * 
	 * @param vendorCode
	 * @param ulpNo
	 * @return BigDecimal
	 */
	BigDecimal loyaltyPointsBalance(String vendorCode, String ulpNo);

	/**
	 * This method will give gift card/voucher customer details along with balance.
	 * 
	 * @param vendorCode
	 * @param giftCardNumber
	 * @return GcCustomerResponseDto
	 */
	GcCustomerResponseDto getGiftCardCustomerInfo(String vendorCode, String giftCardNumber);

	/**
	 * This method will give account details based on account number.
	 * 
	 * @param vendorCode
	 * @param accountNumber
	 * @return AccountDetailsDto
	 */
	AccountDetailsDto getAccountDetails(String vendorCode, Integer accountNumber);

	/**
	 * This method will get discount voucher details.
	 * 
	 * @param vendorCode
	 * @param discountVoucher
	 * @param accountNumber
	 * @return DiscountVoucherResponseDto
	 */
	DiscountVoucherResponseDto getDiscountVoucherDetails(String vendorCode, Integer discountVoucher,
			Integer accountNumber);

	/**
	 * @param mobileNo
	 * @param transactionId
	 * @return DigiGoldBalanceResponseDto
	 */
	DigiGoldBalanceResponseDto getDigiGoldBalance(String mobileNo, String transactionId);

	/**
	 * @param mobileNo
	 * @param tanishqGoldGrams
	 * @param nonTanishqGoldGrams
	 * @param transactionId
	 * @param referenceId
	 * @return BooleanResponse
	 */
	BooleanResponse sendDigiGoldOtp(String mobileNo, BigDecimal tanishqGoldGrams, BigDecimal nonTanishqGoldGrams,
			String transactionId, String referenceId);

	/**
	 * @param mobileNo
	 * @param transactionId
	 * @return DigiGoldSellingPriceDto
	 */
	DigiGoldSellingPriceDto sellingPrice(String mobileNo, String transactionId);

	/**
	 * @param customerId
	 * @param sendCoupon
	 * @return CustomerCouponDto
	 */
	CustomerCouponDto sendRivaahCardCoupon(Integer customerId, Boolean sendCoupon);
}
