/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigCustomerMappingDaoExt;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ExchangeConfigCustomerSyncDtoExt extends ExchangeConfigCustomerSyncDto {

	public ExchangeConfigCustomerSyncDtoExt() {

	}

	public ExchangeConfigCustomerSyncDtoExt(ExchangeConfigCustomerMappingDaoExt exchangeConfigCustomer) {
		MapperUtil.getObjectMapping(exchangeConfigCustomer, this);
		if (exchangeConfigCustomer.getExchangeConfig() != null) {
			this.setExchangeConfig(exchangeConfigCustomer.getExchangeConfig().getConfigId());
		} else {
			this.setExchangeConfig(null);
		}
	}

	public List<ExchangeConfigCustomerSyncDtoExt> getSyncDtoList(List<ExchangeConfigCustomerMappingDaoExt> daoList) {
		List<ExchangeConfigCustomerSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ExchangeConfigCustomerSyncDtoExt syncDto = new ExchangeConfigCustomerSyncDtoExt(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}
}
