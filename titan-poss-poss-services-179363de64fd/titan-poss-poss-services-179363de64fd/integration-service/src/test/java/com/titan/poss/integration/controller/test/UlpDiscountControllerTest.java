/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller.test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import com.titan.poss.core.domain.constant.enums.UlpDiscountType;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
import com.titan.poss.integration.controller.UlpDiscountController;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.UlpService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RunWith(MockitoJUnitRunner.class)
@DisplayName("UlpDiscountController Test cases")
public class UlpDiscountControllerTest {

	@InjectMocks
	private UlpDiscountController ulpDiscountController;

	@Mock
	private UlpService ulpService;

	@Test
	@DisplayName("(UlpDiscountController) avail discount succesfully")
	public void testAvailLoyaltyDiscounts() {
		when(ulpService.availLoyaltyDiscount(getTestVendor(), getTestUlpDiscountDto()))
				.thenReturn(getTestUlpDiscountResponseDto());
		UlpDiscountResponseDto ulpDiscountResponseDto = ulpDiscountController
				.availLoyaltyDiscounts(VendorCodeEnum.ULP_NETCARROTS.toString(), getTestUlpDiscountDto());
		assertEquals(UlpDiscountType.ANNIVERSARY.toString(), ulpDiscountResponseDto.getDiscountType());
	}

	@Test
	@DisplayName("(UlpDiscountController) reverse availed discount succesfully")
	public void testReverseAvailedDiscount() {
		ulpDiscountController.reverseAvailedDiscount(VendorCodeEnum.ULP_NETCARROTS.toString(),
				getTestBillCancellationDto());
		Mockito.verify(ulpService, times(1)).reverseAvailedDiscount(getTestVendor(), getTestBillCancellationDto());
	}

	/**
	 * @return
	 */
	private UlpBillCancellationDto getTestBillCancellationDto() {
		UlpBillCancellationDto ulpBillCancellationDto = new UlpBillCancellationDto();
		ulpBillCancellationDto.setDiscountType(UlpDiscountType.ANNIVERSARY.toString());
		return ulpBillCancellationDto;
	}

	/**
	 * @return
	 */
	private UlpDiscountResponseDto getTestUlpDiscountResponseDto() {
		UlpDiscountResponseDto ulpDiscountResponseDto = new UlpDiscountResponseDto();
		ulpDiscountResponseDto.setDiscountType(UlpDiscountType.ANNIVERSARY.toString());
		return ulpDiscountResponseDto;
	}

	/**
	 * @return
	 */
	private UlpDiscountDto getTestUlpDiscountDto() {
		UlpDiscountDto ulpDiscountDto = new UlpDiscountDto();
		ulpDiscountDto.setDiscountType(UlpDiscountType.ANNIVERSARY.toString());
		return ulpDiscountDto;
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(VendorCodeEnum.ULP_NETCARROTS.toString());
		return vendor;
	}

}
