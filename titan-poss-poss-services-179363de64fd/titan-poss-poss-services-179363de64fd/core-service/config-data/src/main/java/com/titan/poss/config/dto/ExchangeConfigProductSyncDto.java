/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.config.dao.ExchangeConfigProductMappingDao;
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
public class ExchangeConfigProductSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String gepConfig;

	private String range;

	private String productGroupCode;

	private BigDecimal percentValue;

	private String configDetails;

	private String productCategoryCode;

	public ExchangeConfigProductMappingDao getGepConfigProductMappingDao(
			ExchangeConfigProductSyncDto gepConfigProductSyncDto) {
		ExchangeConfigProductMappingDao gepConfigProductMappingDao = new ExchangeConfigProductMappingDao();
		gepConfigProductMappingDao = (ExchangeConfigProductMappingDao) MapperUtil
				.getObjectMapping(gepConfigProductSyncDto, gepConfigProductMappingDao);

		if (gepConfigProductSyncDto.getGepConfig() != null) {
			ExchangeConfigMasterDao gepConfigMasterDao = new ExchangeConfigMasterDao();
			gepConfigMasterDao.setConfigId(gepConfigProductSyncDto.getGepConfig());
			gepConfigProductMappingDao.setExchangeConfig(gepConfigMasterDao);
		} else {
			gepConfigProductMappingDao.setExchangeConfig(null);
		}

		if (gepConfigProductSyncDto.getRange() != null) {
			RangeMasterDao rangeMasterDao = new RangeMasterDao();
			rangeMasterDao.setId(gepConfigProductSyncDto.getRange());
			gepConfigProductMappingDao.setRange(rangeMasterDao);
		} else {
			gepConfigProductMappingDao.setRange(null);
		}
		return gepConfigProductMappingDao;
	}

	public List<ExchangeConfigProductMappingDao> getDaoList(List<ExchangeConfigProductSyncDto> syncDtoList) {
		List<ExchangeConfigProductMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(dto -> {
			ExchangeConfigProductSyncDto syncDto = new ExchangeConfigProductSyncDto();
			daoList.add(syncDto.getGepConfigProductMappingDao(dto));
		});
		return daoList;
	}
}
