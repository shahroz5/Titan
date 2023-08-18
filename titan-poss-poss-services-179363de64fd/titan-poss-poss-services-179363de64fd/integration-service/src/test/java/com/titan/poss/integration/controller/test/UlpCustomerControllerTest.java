/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.controller.test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import javax.validation.Valid;

import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.CustomerAddDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerUpdateDto;
import com.titan.poss.core.enums.CustomerSearchTypeEnum;
import com.titan.poss.integration.controller.UlpCustomerController;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.service.UlpService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RunWith(MockitoJUnitRunner.class)
@DisplayName("UlpCustomerController Test cases")
public class UlpCustomerControllerTest {

	@InjectMocks
	private UlpCustomerController ulpCustomerController;

	@Mock
	private UlpService ulpService;

	private static final String TEST_NAME = "Test Name";

	@Test
	@DisplayName("(UlpCustomerController) create customer succesfully")
	public void testCreateLoyaltyCustomer() {
		when(ulpService.createLoyaltyCustomer(getTestVendor(), null, getTestCustomerAddDto()))
				.thenReturn(getTestCustomerDto());
		CustomerDto createLoyaltyCustomer = ulpCustomerController
				.createLoyaltyCustomer(VendorCodeEnum.ULP_NETCARROTS.toString(), null, getTestCustomerAddDto());
		assertEquals(TEST_NAME, createLoyaltyCustomer.getCustomerName());
	}

	@Test
	@DisplayName("(UlpCustomerController) update customer succesfully")
	public void testUpdateLoyaltyCustomer() {
		ulpCustomerController.updateLoyaltyCustomer(VendorCodeEnum.ULP_NETCARROTS.toString(),
				getTestCustomerUpdateDto());
		Mockito.verify(ulpService, times(1)).updateLoyaltyCustomer(getTestVendor(), getTestCustomerUpdateDto());
	}

	@Test
	@DisplayName("(UlpCustomerController) search customer succesfully")
	public void testSearchLoyaltyCustomer() {
		when(ulpService.searchLoyaltyCustomer(getTestVendor(), CustomerSearchTypeEnum.ULP_ID.toString(), null,
				"700001964929")).thenReturn(getTestCustomerDto());
		CustomerDto loyaltyCustomer = ulpCustomerController.searchLoyaltyCustomer(
				VendorCodeEnum.ULP_NETCARROTS.toString(), CustomerSearchTypeEnum.ULP_ID.toString(), null,
				"700001964929");
		assertEquals(TEST_NAME, loyaltyCustomer.getCustomerName());
	}

	/**
	 * @return
	 */
	private CustomerUpdateDto getTestCustomerUpdateDto() {
		CustomerUpdateDto customerUpdateDto = new CustomerUpdateDto();
		customerUpdateDto.setPincode("600001");
		return customerUpdateDto;
	}

	/**
	 * @return
	 */
	private CustomerDto getTestCustomerDto() {
		CustomerDto customerDto = new CustomerDto();
		customerDto.setCustomerName(TEST_NAME);
		return customerDto;
	}

	/**
	 * @return
	 */
	private @Valid CustomerAddDto getTestCustomerAddDto() {
		CustomerAddDto customerAddDto = new CustomerAddDto();
		customerAddDto.setCustomerName(TEST_NAME);
		return customerAddDto;
	}

	private VendorDao getTestVendor() {
		VendorDao vendor = new VendorDao();
		vendor.setVendorCode(VendorCodeEnum.ULP_NETCARROTS.toString());
		return vendor;
	}

}
