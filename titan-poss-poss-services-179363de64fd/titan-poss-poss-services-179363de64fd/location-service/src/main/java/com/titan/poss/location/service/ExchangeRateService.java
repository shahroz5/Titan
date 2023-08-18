/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.response.ExchangeRateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface ExchangeRateService {

	/**
	 * This method will return the list of exchange rate based on the isActive.
	 * 
	 * @param isActive
	 * @param fromCurrency
	 * @param toCurrency
	 * @param pageable
	 * @return PagedRestResponse<List<ExchangeRateDto>>
	 */
	PagedRestResponse<List<ExchangeRateDto>> listExchangeRate(Boolean isActive, String fromCurrency, String toCurrency,
			Pageable pageable);

}
