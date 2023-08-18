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

import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseActivateRequestDto;
import com.titan.poss.core.dto.GiftCardBaseCancelActivateDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dao.VendorDao;
import com.titan.poss.integration.repository.VendorConfigRepository;
import com.titan.poss.integration.repository.VendorRepository;
import com.titan.poss.integration.service.GiftCardService;
import com.titan.poss.integration.service.factory.GiftCardFactory;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Primary
@Service("IntegrationGiftCardService")
public class GiftCardServiceImpl implements GiftCardService {

	@Autowired
	private GiftCardFactory giftCardFactory;

	@Autowired
	private VendorRepository vendorRepo;

	@Autowired
	private VendorConfigRepository vendorConfigRepo;

	@Override
	public GcResponseDto getBalance(VendorDao vendor, String cardNumber, String trackData, boolean otpRequired,
			GiftCardTypeEnum giftCardTypeEnum) {
		vendor = validateVendor(vendor.getVendorCode());
		GiftCardService giftCardService = giftCardFactory.getGiftCardService(vendor);
		return giftCardService.getBalance(vendor, cardNumber, trackData, otpRequired, giftCardTypeEnum);
	}

	@Override
	public GcCustomerResponseDto getCustomerInfo(VendorDao vendor, String giftCardNumber) {
		vendor = validateVendor(vendor.getVendorCode());
		GiftCardService giftCardService = giftCardFactory.getGiftCardService(vendor);
		return giftCardService.getCustomerInfo(vendor, giftCardNumber);
	}

	@Override
	public GcResponseDto redeemGiftCardBalanace(VendorDao vendor, GiftCardBaseRedeemRequestDto giftCardRedeemRequestDto,
			GiftCardTypeEnum giftCardTypeEnum) {
		vendor = validateVendor(vendor.getVendorCode());
		GiftCardService giftCardService = giftCardFactory.getGiftCardService(vendor);
		return giftCardService.redeemGiftCardBalanace(vendor, giftCardRedeemRequestDto, giftCardTypeEnum);
	}

	@Override
	public GcResponseDto reverseRedeem(VendorDao vendor,
			GiftCardBaseReverseRedeemRequestDto giftCardReverseRedeemRequestDto, GiftCardTypeEnum giftCardTypeEnum) {
		vendor = validateVendor(vendor.getVendorCode());
		GiftCardService giftCardService = giftCardFactory.getGiftCardService(vendor);
		return giftCardService.reverseRedeem(vendor, giftCardReverseRedeemRequestDto, giftCardTypeEnum);
	}

	@Override
	public GcActivateResponseDto activateGiftCard(VendorDao vendor,
			GiftCardBaseActivateRequestDto giftCardRedeemRequestDto) {
		vendor = validateVendor(vendor.getVendorCode());
		GiftCardService giftCardService = giftCardFactory.getGiftCardService(vendor);
		return giftCardService.activateGiftCard(vendor, giftCardRedeemRequestDto);
	}

	@Override
	public GcResponseDto cancelActivate(VendorDao vendor, GiftCardBaseCancelActivateDto giftCardCancelActivateDto) {
		vendor = validateVendor(vendor.getVendorCode());
		GiftCardService giftCardService = giftCardFactory.getGiftCardService(vendor);
		return giftCardService.cancelActivate(vendor, giftCardCancelActivateDto);
	}

	@Override
	public void initialize(VendorDao vendor) {
		vendor = vendorRepo.findByVendorCode(vendor.getVendorCode());
		GiftCardService giftCardService = giftCardFactory.getGiftCardService(vendor);
		giftCardService.initialize(vendor);
	}

	private VendorDao validateVendor(String vendorCode) {
		VendorDao vendor = vendorRepo.findByVendorCode(vendorCode);
		boolean isActive = vendor.getIsActive();
		if (!isActive) {
			throw new ServiceException("Vendor is not active", "ERR-INT-017");
		}
		VendorConfigDao vendorConfig = vendorConfigRepo.findByVendorVendorCodeAndLocationCodeAndIsActive(vendorCode,
				CommonUtil.getLocationCode(), true);

		if (vendorConfig != null && vendorConfig.getConnectionDetails() == null) {
			initialize(vendor);
		}
		// check required fields are not null, not blank
		checkIfRequiredFieldsAreThere(vendor);
		return vendor;
	}

	/**
	 * Check if required fields are there.
	 *
	 * @param integration the integration
	 */
	private void checkIfRequiredFieldsAreThere(VendorDao vendor) {
		Set<String> missingFields = new HashSet<>();
		addIfMissing(vendor.getBaseurl(), "base url", missingFields);
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
