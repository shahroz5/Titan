/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dao.CurrencyDao;
import com.titan.poss.location.dto.CurrencyDto;
import com.titan.poss.location.dto.request.CurrencyCreateDto;
import com.titan.poss.location.dto.request.CurrencyUpdateDto;
import com.titan.poss.location.dto.response.CurrencyLiteDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface CurrencyService {

	/**
	 * This method will return the list of Currency details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CurrencyDto>>
	 */
	PagedRestResponse<List<CurrencyDto>> listCurrency(Boolean isActive, Pageable pageable);





	/**
	 * This method will return the Currency details based on the currencyCode.
	 * 
	 * @param currencyCode
	 * @return CurrencyDto
	 */
	CurrencyDto getCurrency(String currencyCode);





	/**
	 * This method will save the Currency details.
	 * 
	 * @param currencyDto
	 * @return CurrencyDto
	 */
	CurrencyDto addCurrency(CurrencyCreateDto currencyDto);





	/**
	 * This method will update the currency details.
	 * 
	 * @param currencyCode
	 * @param currencyUpdateDto
	 * @return
	 */
	CurrencyDto updateCurrency(String currencyCode, CurrencyUpdateDto currencyUpdateDto);

	/**
	 * @param currencyCode
	 * @return CurrencyDao
	 */
	CurrencyDao getCurrencyDao(String currencyCode);

	/**
	 * @param isPageable
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<CurrencyLiteDto>> getCurrencyLite(Boolean isPageable, Pageable pageable);
}
