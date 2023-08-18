/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller.test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.integration.controller.UlpPaymentController;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.UlpService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RunWith(MockitoJUnitRunner.class)
@DisplayName("UlpPaymentController Test cases")
public class UlpPaymentControllerTest {

	@InjectMocks
	private UlpPaymentController ulpPaymentController;

	@Mock
	private UlpService ulpService;

	private static final String ULP_ID = "3123456789";

	@Test
	@DisplayName("(UlpPaymentController) get balance succesfully")
	public void testGetLoyaltyPointsBalance() {
		when(ulpService.getloyaltyPointsBalance(getTestVendor(), ULP_ID)).thenReturn(getTestUlpBalanceResponseDto());
		UlpBalanceResponseDto ulpBalanceResponseDto = ulpPaymentController
				.getLoyaltyPointsBalance(VendorCodeEnum.ULP_NETCARROTS.toString(), ULP_ID);
		assertEquals("0", ulpBalanceResponseDto.getResponseCode());
	}

	@Test
	@DisplayName("(UlpPaymentController) redeem points succesfully")
	public void testRedeemLoyaltyPoints() {
		when(ulpService.redeemLoyaltyPoints(getTestVendor(), getTestRedeemLoyaltyPointsDto()))
				.thenReturn(getTestRedeemPointsDto());
		RedeemPointsDto redeemLoyaltyPoints = ulpPaymentController
				.redeemLoyaltyPoints(VendorCodeEnum.ULP_NETCARROTS.toString(), getTestRedeemLoyaltyPointsDto());
		assertEquals("999", redeemLoyaltyPoints.getBalancePoints());
	}

	@Test
	@DisplayName("(UlpPaymentController) reverse redeem points succesfully")
	public void testReverseRedeemLoyaltyPoints() {
		when(ulpService.reverseRedeemedPoints(getTestVendor(), getTestReverseRedeemLoyaltyPointsDto()))
				.thenReturn(getTestUlpReverseRedeemResponseDto());
		UlpReverseRedeemResponseDto ulpReverseRedeemResponseDto = ulpPaymentController.reverseRedeemedLoyaltyPoints(
				VendorCodeEnum.ULP_NETCARROTS.toString(), getTestReverseRedeemLoyaltyPointsDto());
		assertEquals("123", ulpReverseRedeemResponseDto.getReferenceNumber());
	}

	/**
	 * @return
	 */
	private UlpReverseRedeemedLoyaltyPointsDto getTestReverseRedeemLoyaltyPointsDto() {
		UlpReverseRedeemedLoyaltyPointsDto ulpReverseRedeemedLoyaltyPointsDto = new UlpReverseRedeemedLoyaltyPointsDto();
		ulpReverseRedeemedLoyaltyPointsDto.setRedeemedPoints(100);
		return ulpReverseRedeemedLoyaltyPointsDto;
	}

	/**
	 * @return
	 */
	private UlpRedeemLoyaltyPointsDto getTestRedeemLoyaltyPointsDto() {
		UlpRedeemLoyaltyPointsDto ulpRedeemLoyaltyPointsDto = new UlpRedeemLoyaltyPointsDto();
		ulpRedeemLoyaltyPointsDto.setUlpId(ULP_ID);
		ulpRedeemLoyaltyPointsDto.setRedeemedPoints(100);
		return ulpRedeemLoyaltyPointsDto;
	}

	/**
	 * @return
	 */
	private RedeemPointsDto getTestRedeemPointsDto() {
		RedeemPointsDto redeemPointsDto = new RedeemPointsDto();
		redeemPointsDto.setBalancePoints("999");
		return redeemPointsDto;
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(VendorCodeEnum.ULP_NETCARROTS.toString());
		return vendor;
	}

	private UlpBalanceResponseDto getTestUlpBalanceResponseDto() {
		UlpBalanceResponseDto ulpBalanceResponseDto = new UlpBalanceResponseDto();
		ulpBalanceResponseDto.setBalancePoints(new BigDecimal("123"));
		ulpBalanceResponseDto.setResponseCode("0");
		return ulpBalanceResponseDto;
	}

	private UlpReverseRedeemResponseDto getTestUlpReverseRedeemResponseDto() {
		UlpReverseRedeemResponseDto ulpReverseRedeemResponseDto = new UlpReverseRedeemResponseDto();
		ulpReverseRedeemResponseDto.setResponseCode("0");
		ulpReverseRedeemResponseDto.setReferenceNumber("123");
		return ulpReverseRedeemResponseDto;
	}
}
