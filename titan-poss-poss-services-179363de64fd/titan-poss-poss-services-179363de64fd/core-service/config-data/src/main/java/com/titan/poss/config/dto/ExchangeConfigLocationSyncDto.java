/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigLocationMappingDao;
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
public class ExchangeConfigLocationSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String gepConfig;

	private String locationCode;

	private String configType;

	public ExchangeConfigLocationMappingDao getGepConfigLocationMappingDao(
			ExchangeConfigLocationSyncDto gepConfigLocationMappingSyncDto) {
		ExchangeConfigLocationMappingDao gepConfigLocationMappingDao = new ExchangeConfigLocationMappingDao();
		gepConfigLocationMappingDao = (ExchangeConfigLocationMappingDao) MapperUtil
				.getObjectMapping(gepConfigLocationMappingSyncDto, gepConfigLocationMappingDao);

		if (gepConfigLocationMappingSyncDto.getGepConfig() != null) {
			ExchangeConfigMasterDao gepConfigMasterDao = new ExchangeConfigMasterDao();
			gepConfigMasterDao.setConfigId(gepConfigLocationMappingSyncDto.getGepConfig());
			gepConfigLocationMappingDao.setExchangeConfig(gepConfigMasterDao);
		} else {
			gepConfigLocationMappingDao.setExchangeConfig(null);
		}

		return gepConfigLocationMappingDao;
	}

	public List<ExchangeConfigLocationMappingDao> getDaoList(List<ExchangeConfigLocationSyncDto> syncDtoList) {
		List<ExchangeConfigLocationMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(dto -> {
			ExchangeConfigLocationSyncDto syncDto = new ExchangeConfigLocationSyncDto();
			daoList.add(syncDto.getGepConfigLocationMappingDao(dto));
		});
		return daoList;
	}
}
