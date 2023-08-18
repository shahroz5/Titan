/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigCustomerMappingDao;
import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.core.dao.SyncableEntity;
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
public class ExchangeConfigCustomerSyncDto extends SyncableEntity {

	private String id;

	private String exchangeConfig;

	private String customerMobileNo;

	public ExchangeConfigCustomerMappingDao getExchangeConfigCustomer(
			ExchangeConfigCustomerSyncDto exchangeConfigExcludeMappingSyncDto) {
		ExchangeConfigCustomerMappingDao exchangeConfigCustomerMappingDao = new ExchangeConfigCustomerMappingDao();
		exchangeConfigCustomerMappingDao = (ExchangeConfigCustomerMappingDao) MapperUtil
				.getObjectMapping(exchangeConfigExcludeMappingSyncDto, exchangeConfigCustomerMappingDao);
		if (exchangeConfigExcludeMappingSyncDto.getExchangeConfig() != null) {
			ExchangeConfigMasterDao exchangeConfigMasterDao = new ExchangeConfigMasterDao();
			exchangeConfigMasterDao.setConfigId(exchangeConfigExcludeMappingSyncDto.getExchangeConfig());
			exchangeConfigCustomerMappingDao.setExchangeConfig(exchangeConfigMasterDao);
		} else {
			exchangeConfigCustomerMappingDao.setExchangeConfig(null);
		}

		return exchangeConfigCustomerMappingDao;
	}

	public List<ExchangeConfigCustomerMappingDao> getDaoList(List<ExchangeConfigCustomerSyncDto> syncDtoList) {
		List<ExchangeConfigCustomerMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(dto -> {
			ExchangeConfigCustomerSyncDto syncDto = new ExchangeConfigCustomerSyncDto();
			daoList.add(syncDto.getExchangeConfigCustomer(dto));
		});
		return daoList;
	}

}
