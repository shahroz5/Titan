/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller.test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.integration.controller.GcPaymentController;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.gc.GiftCardRedeemRequestDto;
import com.titan.poss.integration.service.GiftCardService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RunWith(MockitoJUnitRunner.class)
@DisplayName("GcPaymentController Test cases")
public class GcPaymentControllerTest {

	@InjectMocks
	private GcPaymentController gcPaymentController;

	@Mock
	private GiftCardService giftCardService;

	private static final String CARD_NUMBER = "123456789";

	@Test
	@DisplayName("(GcPaymentController) get gift card balance succesfully")
	public void testGetGiftCardBalance() {
		when(giftCardService.getBalance(getTestVendor(), CARD_NUMBER, "", false, GiftCardTypeEnum.GIFTCARD_CODE))
				.thenReturn(getTestGcResponseDto());

		GcResponseDto giftCardBalance = gcPaymentController.getGiftCardBalance(VendorCodeEnum.QC_GC.toString(),
				CARD_NUMBER, "", false, GiftCardTypeEnum.GIFTCARD_CODE);
		assertEquals(CARD_NUMBER, giftCardBalance.getCardNumber());
	}

	@Test
	@DisplayName("(GcPaymentController) redeem gift card succesfully")
	public void testRedeemGiftCardBalance() {
		when(giftCardService.redeemGiftCardBalanace(getTestVendor(), getTestGiftCardRedeemRequestDto(), GiftCardTypeEnum.GIFTCARD_CODE))
				.thenReturn(getTestGcResponseDto());

		GcResponseDto gcResponseDto = gcPaymentController.redeemGiftCardBalance(VendorCodeEnum.QC_GC.toString(),
				getTestGiftCardRedeemRequestDto(), GiftCardTypeEnum.GIFTCARD_CODE);
		assertEquals(CARD_NUMBER, gcResponseDto.getCardNumber());
	}

	@Test
	@DisplayName("(GcPaymentController) redeem gift card succesfully")
	public void testGetGiftCardCustomerInfo() {
		when(giftCardService.getCustomerInfo(getTestVendor(), CARD_NUMBER)).thenReturn(getTestGcCustomerResponseDto());

		GcCustomerResponseDto gcCustomerResponseDto = gcPaymentController
				.getGiftCardCustomerInfo(VendorCodeEnum.QC_GC.toString(), CARD_NUMBER);
		assertEquals(CARD_NUMBER, gcCustomerResponseDto.getCardNumber());
	}

	/**
	 * @return
	 */
	private GcCustomerResponseDto getTestGcCustomerResponseDto() {
		GcCustomerResponseDto gcCustomerResponseDto = new GcCustomerResponseDto();
		gcCustomerResponseDto.setCardNumber(CARD_NUMBER);
		return gcCustomerResponseDto;
	}

	/**
	 * @return
	 */
	private GiftCardRedeemRequestDto getTestGiftCardRedeemRequestDto() {
		GiftCardRedeemRequestDto giftCardRedeemRequestDto = new GiftCardRedeemRequestDto();
		giftCardRedeemRequestDto.setCardNumber(CARD_NUMBER);
		giftCardRedeemRequestDto.setAmount(1000.00);
		return giftCardRedeemRequestDto;
	}

	/**
	 * @return
	 */
	private GcResponseDto getTestGcResponseDto() {
		GcResponseDto gcResponseDto = new GcResponseDto();
		gcResponseDto.setAmount("1000");
		gcResponseDto.setCardNumber(CARD_NUMBER);
		return gcResponseDto;
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(VendorCodeEnum.QC_GC.toString());
		return vendor;
	}

}
