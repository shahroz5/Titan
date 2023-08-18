/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.ExchangeRateDao;
import com.titan.poss.location.dto.response.ExchangeRateDto;
import com.titan.poss.location.repository.ExchangeRateRepository;
import com.titan.poss.location.service.ExchangeRateService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ExchangeRateServiceImpl implements ExchangeRateService {

	private static final String ERR_LOC_020 = "ERR-LOC-020";

	private static final String EXCHANGE_RATE_NOT_AVAILABLE = "Exchange rate not available";

	@Autowired
	ExchangeRateRepository exchangeRateRepository;

	/**
	 * This method will return the list of exchange rate based on the isActive.
	 * 
	 * @param isActive
	 * @param fromCurrency
	 * @param toCurrency
	 * @param pageable
	 * @return PagedRestResponse<List<ExchangeRateDto>>
	 */
	@Override
	public PagedRestResponse<List<ExchangeRateDto>> listExchangeRate(Boolean isActive, String fromCurrency,
			String toCurrency, Pageable pageable) {
		ExchangeRateDao exchangeRate = new ExchangeRateDao();
		List<ExchangeRateDto> exchangeRatesList = new ArrayList<>();
		exchangeRate.setIsActive(isActive);
		exchangeRate.setFromCurrency(fromCurrency);
		exchangeRate.setToCurrency(toCurrency);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ExchangeRateDao> criteria = Example.of(exchangeRate, matcher);

		Page<ExchangeRateDao> exchangeRateList = exchangeRateRepository.findAll(criteria, pageable);
		if (exchangeRateList == null || exchangeRateList.isEmpty()) {
			throw new ServiceException(EXCHANGE_RATE_NOT_AVAILABLE, ERR_LOC_020);
		}
		for (ExchangeRateDao exRate : exchangeRateList) {
			ExchangeRateDto exDto = (ExchangeRateDto) MapperUtil.getObjectMapping(exRate, new ExchangeRateDto());
			exchangeRatesList.add(exDto);
		}
		return (new PagedRestResponse<>(exchangeRatesList, exchangeRateList));
	}

}
