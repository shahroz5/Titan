/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigDetailsDao;
import com.titan.poss.config.dao.ExchangeConfigMasterDao;
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
public class ExchangeConfigDetailsSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String gepConfig;

	private String range;

	private BigDecimal deductionPercent;

	private BigDecimal schemePercent;

	private Date startDate;

	private Date endDate;

	private String metalType;

	private String itemType;

	public ExchangeConfigDetailsDao getGepConfigDetailsDao(ExchangeConfigDetailsSyncDto gepConfigDetailsSyncDto) {
		ExchangeConfigDetailsDao exchangeConfigDetailsDao = new ExchangeConfigDetailsDao();
		exchangeConfigDetailsDao = (ExchangeConfigDetailsDao) MapperUtil.getObjectMapping(gepConfigDetailsSyncDto,
				exchangeConfigDetailsDao);
		ExchangeConfigMasterDao gepConfigMasterDao = new ExchangeConfigMasterDao();
		gepConfigMasterDao.setConfigId(gepConfigDetailsSyncDto.getGepConfig());

		exchangeConfigDetailsDao.setExchangeConfig(gepConfigMasterDao);

		RangeMasterDao rangeMasterDao = new RangeMasterDao();
		rangeMasterDao.setId(gepConfigDetailsSyncDto.getRange());

		exchangeConfigDetailsDao.setRange(rangeMasterDao);

		return exchangeConfigDetailsDao;
	}

	public List<ExchangeConfigDetailsDao> getGepConfigDetailsDaoList(List<ExchangeConfigDetailsSyncDto> syncDtoList) {
		List<ExchangeConfigDetailsDao> exchangeConfigDetailsDaos = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ExchangeConfigDetailsSyncDto gepConfigDetailsSyncDto = new ExchangeConfigDetailsSyncDto();
			exchangeConfigDetailsDaos.add(gepConfigDetailsSyncDto.getGepConfigDetailsDao(syncDto));
		});
		return exchangeConfigDetailsDaos;
	}
}
