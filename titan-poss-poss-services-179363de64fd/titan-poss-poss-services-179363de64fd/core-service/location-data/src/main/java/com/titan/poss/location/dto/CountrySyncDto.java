/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.CurrencyDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class CountrySyncDto extends MasterSyncableEntity {

	private String countryCode;

	private String description;

	private String currency;

	private String dateFormat;

	private String timeFormat;

	private String locale;

	private Integer phoneLength;

	private String isdCode;

	private String fiscalYearStart;

	private String fiscalYearEnd;

	private Integer fiscalYear;

	private String weightUnit;

	private String stoneWeightUnit;

	public CountrySyncDto() {

	}

	public CountrySyncDto(CountryDao country) {
		MapperUtil.getObjectMapping(country, this);
		this.setCurrency(country.getCurrency().getCurrencyCode());
	}

	public CountryDao getCountryDao(CountrySyncDto countrySyncDto) {

		CountryDao country = new CountryDao();
		country = (CountryDao) MapperUtil.getObjectMapping(countrySyncDto, country);

		CurrencyDao currencyDao = new CurrencyDao();
		currencyDao.setCurrencyCode(countrySyncDto.getCurrency());

		country.setCurrency(currencyDao);

		return country;
	}

}
