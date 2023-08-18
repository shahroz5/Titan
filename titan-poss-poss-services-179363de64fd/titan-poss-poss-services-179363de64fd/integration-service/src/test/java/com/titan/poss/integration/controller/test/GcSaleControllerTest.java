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
import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.integration.controller.GcSaleController;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.dto.request.gc.GiftCardActivateRequestDto;
import com.titan.poss.integration.dto.request.gc.GiftCardCancelActivateDto;
import com.titan.poss.integration.service.GiftCardService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RunWith(MockitoJUnitRunner.class)
@DisplayName("GcSaleController Test cases")
public class GcSaleControllerTest {

	@InjectMocks
	private GcSaleController gcSaleController;

	@Mock
	private GiftCardService giftCardService;

	private static final String CARD_NUMBER = "123456789";

	@Test
	@DisplayName("(GcSaleController) activate gift card succesfully")
	public void testActivateGiftCard() {
		when(giftCardService.activateGiftCard(getTestVendor(), getTestGiftCardActivateRequestDto()))
				.thenReturn(getTestGcActivateResponseDto());

		GcActivateResponseDto activateGiftCard = gcSaleController.activateGiftCard(VendorCodeEnum.QC_GC.toString(),
				getTestGiftCardActivateRequestDto());
		assertEquals(CARD_NUMBER, activateGiftCard.getCardNumber());
	}

	@Test
	@DisplayName("(GcSaleController) cancel activate gift card succesfully")
	public void testCancelActivateGiftCard() {
		when(giftCardService.cancelActivate(getTestVendor(), getTestGiftCardCancelActivateDto()))
				.thenReturn(getTestGcResponseDto());

		GcResponseDto cancelActivateGiftCard = gcSaleController.cancelActivateGiftCard(VendorCodeEnum.QC_GC.toString(),
				getTestGiftCardCancelActivateDto());
		assertEquals(CARD_NUMBER, cancelActivateGiftCard.getCardNumber());
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

	/**
	 * @return
	 */
	private GiftCardCancelActivateDto getTestGiftCardCancelActivateDto() {
		GiftCardCancelActivateDto giftCardCancelActivateDto = new GiftCardCancelActivateDto();
		giftCardCancelActivateDto.setCardNumber(CARD_NUMBER);
		return giftCardCancelActivateDto;
	}

	/**
	 * @return
	 */
	private GcActivateResponseDto getTestGcActivateResponseDto() {
		GcActivateResponseDto gcActivateResponseDto = new GcActivateResponseDto();
		gcActivateResponseDto.setAmount("1000");
		gcActivateResponseDto.setCardNumber(CARD_NUMBER);
		return gcActivateResponseDto;
	}

	/**
	 * @return
	 */
	private GiftCardActivateRequestDto getTestGiftCardActivateRequestDto() {
		GiftCardActivateRequestDto giftCardActivateRequestDto = new GiftCardActivateRequestDto();
		giftCardActivateRequestDto.setAmount("1000");
		giftCardActivateRequestDto.setCardNumber(CARD_NUMBER);
		return giftCardActivateRequestDto;
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(VendorCodeEnum.QC_GC.toString());
		return vendor;
	}

}
