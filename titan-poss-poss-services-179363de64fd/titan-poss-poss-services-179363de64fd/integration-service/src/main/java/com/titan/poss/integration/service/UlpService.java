/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service;

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
import com.titan.poss.integration.dao.VendorDao;

/**
 * The Interface UlpService.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface UlpService {

	/**
	 * Creates the loyalty customer.
	 *
	 * @param vendor         the vendor
	 * @param customerAddDto the customer add dto
	 * @return the customer dto
	 */
	public CustomerDto createLoyaltyCustomer(VendorDao vendor, String locationCode, CustomerAddDto customerAddDto);

	/**
	 * Search loyalty customer.
	 *
	 * @param vendor     the vendor
	 * @param searchType the search type
	 * @param value      the value
	 * @return the customer dto
	 */
	public CustomerDto searchLoyaltyCustomer(VendorDao vendor, String searchType, String locationCode, String value);

	/**
	 * Update loyalty customer.
	 *
	 * @param vendor            the vendor
	 * @param customerUpdateDto the customer update dto
	 * @return the customer dto
	 */
	public UlpBaseResponseDto updateLoyaltyCustomer(VendorDao vendor, CustomerUpdateDto customerUpdateDto);

	/**
	 * Gets the loyalty points balance.
	 *
	 * @param vendor the vendor
	 * @param ulpNo  the ulp no
	 * @return the loyalty points balance
	 */
	public UlpBalanceResponseDto getloyaltyPointsBalance(VendorDao vendor, String ulpNo);

	/**
	 * Redeem loyalty points.
	 *
	 * @param vendor                 the vendor
	 * @param redeemLoyaltyPointsDto the redeem loyalty points dto
	 * @return the redeem points dto
	 */
	public RedeemPointsDto redeemLoyaltyPoints(VendorDao vendor, UlpRedeemLoyaltyPointsDto redeemLoyaltyPointsDto);

	/**
	 * Reverse redeemed points.
	 *
	 * @param vendor                        the vendor
	 * @param reverseRedeemLoyaltyPointsDto the reverse redeem loyalty points dto
	 * @return the string
	 */
	public UlpReverseRedeemResponseDto reverseRedeemedPoints(VendorDao vendor,
			UlpReverseRedeemedLoyaltyPointsDto reverseRedeemLoyaltyPointsDto);

	/**
	 * Avail loyalty discount.
	 *
	 * @param vendor         the vendor
	 * @param ulpDiscountDto the ulp discount dto
	 */
	public UlpDiscountResponseDto availLoyaltyDiscount(VendorDao vendor, UlpDiscountDto ulpDiscountDto);

	/**
	 * Reverse availed discount.
	 *
	 * @param vendor              the vendor
	 * @param billCancellationDto the bill cancellation dto
	 */
	public UlpBaseResponseDto reverseAvailedDiscount(VendorDao vendor, UlpBillCancellationDto billCancellationDto);

	/**
	 * Void transaction.
	 *
	 * @param vendor   the vendor
	 * @param uniqueId the unique id
	 */
	public void voidTransaction(VendorDao vendor, String uniqueId);
}
