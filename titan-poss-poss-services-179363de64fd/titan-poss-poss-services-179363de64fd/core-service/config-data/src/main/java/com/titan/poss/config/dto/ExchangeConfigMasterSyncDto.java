/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.core.dao.MasterSyncableEntity;
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
public class ExchangeConfigMasterSyncDto extends MasterSyncableEntity {

	private String configId;

	private String description;

	private Boolean isOfferEnabled;

	private String offerDetails;

	private String configDetails;

	private String configType;
	
	private String itemCode;
	
	private Date startDate;

	private Date endDate;

	private BigDecimal karat;

	public ExchangeConfigMasterDao getGepConfigMasterDao(ExchangeConfigMasterSyncDto gepConfigMasterSyncDto) {
		ExchangeConfigMasterDao gepConfigMasterDao = new ExchangeConfigMasterDao();
		gepConfigMasterDao = (ExchangeConfigMasterDao) MapperUtil.getObjectMapping(gepConfigMasterSyncDto,
				gepConfigMasterDao);
		return gepConfigMasterDao;
	}

	public List<ExchangeConfigMasterDao> getGepConfigMasterDaoList(List<ExchangeConfigMasterSyncDto> syncDtoList) {
		List<ExchangeConfigMasterDao> gepConfigMasterDaos = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ExchangeConfigMasterSyncDto gepConfigMasterSyncDto = new ExchangeConfigMasterSyncDto();
			gepConfigMasterDaos.add(gepConfigMasterSyncDto.getGepConfigMasterDao(syncDto));
		});
		return gepConfigMasterDaos;
	}
}


