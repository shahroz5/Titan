/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
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
public class CurrencySyncDto extends MasterSyncableEntity {

	private String currencyCode;

	private String currencySymbol;

	private String description;

	private String unicode;

	private String image;

	public CurrencySyncDto() {

	}

	public CurrencySyncDto(CurrencyDao currency) {
		MapperUtil.getObjectMapping(currency, this);
	}
	
	public CurrencyDao getCurrencyDao(CurrencySyncDto currencySyncDto) {
		return (CurrencyDao) MapperUtil.getObjectMapping(currencySyncDto, new CurrencyDao());
	}
}
