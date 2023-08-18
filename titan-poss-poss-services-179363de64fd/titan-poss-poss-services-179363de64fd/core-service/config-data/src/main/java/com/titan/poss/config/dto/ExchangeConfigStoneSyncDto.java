/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.config.dao.ExchangeConfigStoneMappingDao;
import com.titan.poss.config.dao.RangeMasterDao;
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
public class ExchangeConfigStoneSyncDto extends SyncTimeDao {
	
	private static final long serialVersionUID = 1L;

	private String id;

	private String exchangeConfig;

	private String range;

	private String stoneTypeCode;

	private String stoneQuality;

	private BigDecimal dedutionPercent;

	public ExchangeConfigStoneMappingDao getExchangeConfigStone(
			ExchangeConfigStoneSyncDto exchangeConfigStoneSyncDto) {
		ExchangeConfigStoneMappingDao exchangeConfigStone = new ExchangeConfigStoneMappingDao();
		exchangeConfigStone = (ExchangeConfigStoneMappingDao) MapperUtil.getObjectMapping(exchangeConfigStoneSyncDto,
				exchangeConfigStone);
		if (exchangeConfigStoneSyncDto.getExchangeConfig() != null) {
			ExchangeConfigMasterDao exchangeConfigMasterDao = new ExchangeConfigMasterDao();
			exchangeConfigMasterDao.setConfigId(exchangeConfigStoneSyncDto.getExchangeConfig());
			exchangeConfigStone.setExchangeConfig(exchangeConfigMasterDao);
		} else {
			exchangeConfigStone.setExchangeConfig(null);
		}
		if (exchangeConfigStoneSyncDto.getRange() != null) {
			RangeMasterDao rangeMasterDao = new RangeMasterDao();
			rangeMasterDao.setId(exchangeConfigStoneSyncDto.getRange());
			exchangeConfigStone.setRange(rangeMasterDao);
		} else {
			exchangeConfigStone.setRange(null);
		}
		return exchangeConfigStone;
	}

	public List<ExchangeConfigStoneMappingDao> getDaoList(List<ExchangeConfigStoneSyncDto> syncDtoList) {
		List<ExchangeConfigStoneMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(dto -> {
			ExchangeConfigStoneSyncDto syncDto = new ExchangeConfigStoneSyncDto();
			daoList.add(syncDto.getExchangeConfigStone(dto));
		});
		return daoList;
	}
}
