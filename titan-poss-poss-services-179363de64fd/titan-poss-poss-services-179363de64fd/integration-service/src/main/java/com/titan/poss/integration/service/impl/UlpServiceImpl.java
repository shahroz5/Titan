/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.dto.CustomerAddDto;
import com.titan.poss.core.dto.CustomerDto;
import com.titan.poss.core.dto.CustomerUpdateDto;
import com.titan.poss.core.dto.RedeemPointsDto;
import com.titan.poss.core.dto.UlpBalanceResponseDto;
import com.titan.poss.core.dto.UlpBaseResponseDto;
import com.titan.poss.core.dto.UlpBillCancellationDto;
import com.titan.poss.core.dto.UlpDiscountDto;
import com.titan.poss.core.dto.UlpDiscountResponseDto;
import com.titan.poss.core.dto.UlpRedeemLoyaltyPointsDto;
import com.titan.poss.core.dto.UlpReverseRedeemResponseDto;
import com.titan.poss.core.dto.UlpReverseRedeemedLoyaltyPointsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.UlpService;
import com.titan.poss.integration.service.factory.ULPFactory;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationUlpService")
public class UlpServiceImpl implements UlpService {

	@Autowired
	private ULPFactory ulpFactory;

	@Autowired
	private VendorRepository vendorRepository;

	/**
	 * Creates the loyalty customer.
	 *
	 * @param customerAddDto the customer add dto
	 * @return the customer dto
	 */
	@Override
	public CustomerDto createLoyaltyCustomer(VendorDao vendor, String locationCode, CustomerAddDto customerAddDto) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		return ulpService.createLoyaltyCustomer(vendor, locationCode, customerAddDto);
	}

	/**
	 * Search loyalty customer.
	 *
	 * @param searchType the search type
	 * @param value      the value
	 * @return the customer dto
	 */
	@Override
	public CustomerDto searchLoyaltyCustomer(VendorDao vendor, String searchType, String locationCode, String value) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		return ulpService.searchLoyaltyCustomer(vendor, searchType, locationCode, value);
	}

	/**
	 * Update loyalty customer.
	 *
	 * @param customerUpdateDto the customer update dto
	 */
	@Override
	public UlpBaseResponseDto updateLoyaltyCustomer(VendorDao vendor, CustomerUpdateDto customerUpdateDto) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		return ulpService.updateLoyaltyCustomer(vendor, customerUpdateDto);
	}

	@Override
	public UlpBalanceResponseDto getloyaltyPointsBalance(VendorDao vendor, String ulpNo) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		return ulpService.getloyaltyPointsBalance(vendor, ulpNo);
	}

	@Override
	public RedeemPointsDto redeemLoyaltyPoints(VendorDao vendor, UlpRedeemLoyaltyPointsDto redeemLoyaltyPointsDto) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		return ulpService.redeemLoyaltyPoints(vendor, redeemLoyaltyPointsDto);
	}

	@Override
	public UlpReverseRedeemResponseDto reverseRedeemedPoints(VendorDao vendor,
			UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		return ulpService.reverseRedeemedPoints(vendor, reverseRedeemLoyaltyPointsDto);
	}

	@Override
	public UlpDiscountResponseDto availLoyaltyDiscount(VendorDao vendor, UlpDiscountDto ulpDiscountDto) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		return ulpService.availLoyaltyDiscount(vendor, ulpDiscountDto);
	}

	@Override
	public UlpBaseResponseDto reverseAvailedDiscount(VendorDao vendor, UlpBillCancellationDto billCancellationDto) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		return ulpService.reverseAvailedDiscount(vendor, billCancellationDto);
	}

	@Override
	public void voidTransaction(VendorDao vendor, String uniqueId) {
		vendor = validateVendor(vendor.getVendorCode());
		UlpService ulpService = ulpFactory.getUlpService(vendor);
		ulpService.voidTransaction(vendor, uniqueId);
	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepository.findByVendorCode(vendorCode);
		boolean isActive = vendor.getIsActive();
		if (!isActive) {
			throw new ServiceException("Vendor is not active", "ERR-INT-017");
		}
		JsonObject jsonObject = new JsonParser().parse(vendor.getVendorDetails()).getAsJsonObject();
		String channelCode = jsonObject.getAsJsonObject("data").get("senderID").getAsString();
		// check required fields are not null, not blank
		checkIfRequiredFieldsAreThere(vendor, channelCode);
		return vendor;
	}

	/**
	 * Check if required fields are there.
	 *
	 * @param integration the integration
	 */
	private void checkIfRequiredFieldsAreThere(VendorDao vendor, String channelCode) {
		Set<String> missingFields = new HashSet<>();
		addIfMissing(vendor.getBaseurl(), "base url", missingFields);
		addIfMissing(channelCode, "Channel code details", missingFields);
		if (!CollectionUtils.isEmpty(missingFields))
			throw new ServiceException("Some Required fields for loyalty service is missing", "", missingFields);
	}

	/**
	 * Adds the if missing.
	 *
	 * @param val           the val
	 * @param toAdd         the to add
	 * @param missingFields the missing fields
	 */
	private void addIfMissing(String val, String toAdd, Set<String> missingFields) {
		if (StringUtils.isBlank(val))
			missingFields.add(toAdd);
	}
}
