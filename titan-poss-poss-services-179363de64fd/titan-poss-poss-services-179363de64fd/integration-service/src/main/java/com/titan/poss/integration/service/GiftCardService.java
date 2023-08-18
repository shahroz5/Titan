/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.service;

import com.titan.poss.core.dto.GcActivateResponseDto;
import com.titan.poss.core.dto.GcCustomerResponseDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseActivateRequestDto;
import com.titan.poss.core.dto.GiftCardBaseCancelActivateDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.integration.dao.VendorDao;

/**
 * The Interface GiftCardService.
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface GiftCardService {

	/**
	 * Initialize Poss with QuickSilver and store the apiweb properties.
	 *
	 * @param vendor the vendor
	 */
	public void initialize(VendorDao vendor);

	/**
	 * Gets the customer info based on gift card number.
	 *
	 * @param vendor         the vendor
	 * @param giftCardNumber the gift card number
	 * @return the customer info
	 */
	public GcCustomerResponseDto getCustomerInfo(VendorDao vendor, String giftCardNumber);

	/**
	 * Gets the gift card balance.
	 *
	 * @param vendor             the vendor
	 * @param giftCardBalanceDto the gift card balance dto
	 * @return the balance
	 */
	public GcResponseDto getBalance(VendorDao vendor, String cardNumber, String trackData, boolean otpRequired,
			GiftCardTypeEnum giftCardTypeEnum);

	/**
	 * Redeem gift card balanace.
	 *
	 * @param vendor                   the vendor
	 * @param giftCardRedeemRequestDto the gift card redeem request dto
	 * @return the qc response dto
	 */
	public GcResponseDto redeemGiftCardBalanace(VendorDao vendor, GiftCardBaseRedeemRequestDto giftCardRedeemRequestDto,
			GiftCardTypeEnum giftCardTypeEnum);

	/**
	 * Reverse redeem gift card balance.
	 *
	 * @param vendor                          the vendor
	 * @param giftCardReverseRedeemRequestDto the gift card reverse redeem request
	 *                                        dto
	 * @return the qc response dto
	 */
	public GcResponseDto reverseRedeem(VendorDao vendor,
			GiftCardBaseReverseRedeemRequestDto giftCardReverseRedeemRequestDto, GiftCardTypeEnum giftCardTypeEnum);

	/**
	 * Activate gift card.
	 *
	 * @param vendor                     the vendor
	 * @param giftCardActivateRequestDto the gift card activate request dto
	 * @return the qc response dto
	 */
	public GcActivateResponseDto activateGiftCard(VendorDao vendor,
			GiftCardBaseActivateRequestDto giftCardActivateRequestDto);

	/**
	 * Cancel activate.
	 *
	 * @param vendor                    the vendor
	 * @param giftCardCancelActivateDto the gift card cancel activate dto
	 * @return the qc response dto
	 */
	public GcResponseDto cancelActivate(VendorDao vendor, GiftCardBaseCancelActivateDto giftCardCancelActivateDto);

}
