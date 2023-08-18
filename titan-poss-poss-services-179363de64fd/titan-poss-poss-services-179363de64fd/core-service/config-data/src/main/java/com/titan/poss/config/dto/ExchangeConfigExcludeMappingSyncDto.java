/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDao;
import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.core.dao.SyncTimeDao;
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
public class ExchangeConfigExcludeMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String gepConfig;

	private String itemCode;

	private String themeCode;

	private Boolean isExcluded;

	private String correlationId;

	public ExchangeConfigExcludeMappingDao getGepConfigExcludeMappingDao(
			ExchangeConfigExcludeMappingSyncDto gepConfigExcludeMappingSyncDto) {
		ExchangeConfigExcludeMappingDao gepConfigExcludeMappingDao = new ExchangeConfigExcludeMappingDao();
		gepConfigExcludeMappingDao = (ExchangeConfigExcludeMappingDao) MapperUtil
				.getObjectMapping(gepConfigExcludeMappingSyncDto, gepConfigExcludeMappingDao);
		if (gepConfigExcludeMappingSyncDto.getGepConfig() != null) {
			ExchangeConfigMasterDao exchangeConfigMasterDao = new ExchangeConfigMasterDao();
			exchangeConfigMasterDao.setConfigId(gepConfigExcludeMappingSyncDto.getGepConfig());
			gepConfigExcludeMappingDao.setExchangeConfig(exchangeConfigMasterDao);
		} else {
			gepConfigExcludeMappingDao.setExchangeConfig(null);
		}
		if(gepConfigExcludeMappingSyncDto.getSyncTime() == null)
			gepConfigExcludeMappingDao.setSyncTime((long) 0);

		return gepConfigExcludeMappingDao;
	}

	public List<ExchangeConfigExcludeMappingDao> getDaoList(List<ExchangeConfigExcludeMappingSyncDto> syncDtoList) {
		List<ExchangeConfigExcludeMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(dto -> {
			ExchangeConfigExcludeMappingSyncDto syncDto = new ExchangeConfigExcludeMappingSyncDto();
			daoList.add(syncDto.getGepConfigExcludeMappingDao(dto));
		});
		return daoList;
	}

}
