/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service;

import static com.titan.poss.engine.constant.EngineConstants.CASH_BACK_ENGINE_SERVICE;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CashbackOfferRequestDto;
import com.titan.poss.core.dto.CashbackValueResponseDto;
import com.titan.poss.core.dto.GlCodeDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.dto.response.CashbackOfferDetailsResponseDto;
import com.titan.poss.payment.dto.CashbackDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(CASH_BACK_ENGINE_SERVICE)
public interface CashbackService {

	/**
	 * This method will return list of product groups names based on cardNumber.
	 * 
	 * @param cardNumber
	 * @return ListResponse<String>
	 */
	public ListResponse<String> getProductGroups(String offerId);

	/**
	 * @return
	 */
	public ListResponse<CashbackDto> getActiveCashbackOffers();

	/**
	 * @param offerId
	 * @return
	 */
	public CashbackOfferDetailsResponseDto getCashbackDetails(String offerId);

	/**
	 * @param offerId
	 * @param cbOfferDto
	 * @return
	 */
	public CashbackValueResponseDto getCashbackValue(String offerId, CashbackOfferRequestDto cbOfferDto);

	/**
	 * @param locationCode
	 * @return
	 */
	public GlCodeDto getGLCode(String locationCode);

	/**
	 * @param locationCode
	 * @return
	 */
	public void updateGlCode(String locationCode);

}
