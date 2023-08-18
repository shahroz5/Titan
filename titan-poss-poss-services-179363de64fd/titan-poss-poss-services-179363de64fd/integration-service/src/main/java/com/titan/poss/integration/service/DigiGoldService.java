/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import com.titan.poss.core.dto.DigiGoldBalanceResponseDto;
import com.titan.poss.core.dto.DigiGoldOtpResponseDto;
import com.titan.poss.core.dto.DigiGoldRedeemDto;
import com.titan.poss.core.dto.DigiGoldSellingPriceDto;
import com.titan.poss.core.response.BooleanResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface DigiGoldService {

	DigiGoldBalanceResponseDto fetchBalance(String vendorCode, String mobileNo, String transactionId);

	BooleanResponse sendOtp(String vendorCode, String mobileNo, BigDecimal tanishqGoldGms,
			BigDecimal nonTanishqGoldGrams, String transactionId, String referenceId);

	DigiGoldOtpResponseDto verifyOtp(String vendorCode, String mobileNo, BigDecimal goldGrams, String otp,
			String transactionId);

	DigiGoldRedeemDto redeemGold(String vendorCode, String transactionType, String mobileNo, BigDecimal goldGrams,
			String otp, String transactionId);

	DigiGoldRedeemDto cancelTransaction(String vendorCode, String transactionIdDigiGold, String transactionId);

	Object testApi(String testString);

	DigiGoldSellingPriceDto sellingPrice(String vendorCode, String mobileNo, String transactionId);

	Boolean checkFile(MultipartFile reqFile);

}
