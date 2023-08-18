/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.GIFT_VOUCHER_SERVICE;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.GiftDetailsResponseDto;
import com.titan.poss.core.dto.GiftStatusRequestDto;
import com.titan.poss.core.dto.GiftStatusResponseDto;
import com.titan.poss.core.dto.GiftValidityRequestDto;
import com.titan.poss.core.dto.GiftValidityResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(GIFT_VOUCHER_SERVICE)
public interface GiftVoucherService {
	/**
	 * This method will return the list of all gift voucher details or based on the
	 * serialNumber, seriesOfSerialNumber or listOfStatus
	 * 
	 * @param serialNo
	 * @param giftVoucherStatus
	 * @param pageable
	 * @return PagedRestResponse<List<GiftDetailsResponseDto>>
	 */
	PagedRestResponse<List<GiftDetailsResponseDto>> listGiftDetails(String serialNo, List<String> giftVoucherStatus,
			Pageable pageable);

	/**
	 * This method will extend the validity
	 * 
	 * @param giftValidity
	 * @return List<ExtendValidityResponseDto>
	 */
	ListResponse<GiftValidityResponseDto> updateGiftValidity(GiftValidityRequestDto giftValidity);

	/**
	 * This method will update the status of the gift voucher
	 * 
	 * @param giftStatus
	 * @param giftVoucherRedeemDetailsDto 
	 * @return UpdateStatusResponseDto
	 */
	ListResponse<GiftStatusResponseDto> updateGiftStatus(GiftStatusRequestDto giftStatus);

}
