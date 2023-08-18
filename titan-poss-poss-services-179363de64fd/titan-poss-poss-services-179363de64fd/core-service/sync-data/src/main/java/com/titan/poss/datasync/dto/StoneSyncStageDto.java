/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dao.StoneDataSyncStageDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class StoneSyncStageDto extends MasterSyncableEntity {

	private String stoneCode;

	private String color;

	private BigDecimal stdWeight;

	private String stoneType;

	private String quality;

	private String shape;

	private BigDecimal stdValue;

	private BigDecimal ratePerCarat;

	private String currencyCode;

	private String weightUnit;

	private String correlationId;

	private String configDetails;

	private String transferType;

	public StoneSyncStageDto() {

	}

	public StoneSyncStageDto(StoneDataSyncStageDao stoneDataSyncStageDao) {
		MapperUtil.getObjectMapping(stoneDataSyncStageDao, this);

	}

	public StoneDataSyncStageDao getStoneDataSyncStageDao(StoneSyncStageDto stoneSyncStageDto) {
		StoneDataSyncStageDao stoneDataSyncStageDao = new StoneDataSyncStageDao();
		stoneDataSyncStageDao = (StoneDataSyncStageDao) MapperUtil.getObjectMapping(stoneSyncStageDto,
				stoneDataSyncStageDao);

		return stoneDataSyncStageDao;
	}

	public List<StoneDataSyncStageDao> getStoneDataSyncStageDaoList(List<StoneSyncStageDto> syncDtoList) {
		List<StoneDataSyncStageDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			StoneSyncStageDto itemSyncDto = new StoneSyncStageDto();
			daoList.add(itemSyncDto.getStoneDataSyncStageDao(syncDto));
		});
		return daoList;
	}

	public List<StoneSyncStageDto> getItemSyncDtoList(List<StoneDataSyncStageDao> daoList) {
		List<StoneSyncStageDto> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			StoneSyncStageDto syncDto = new StoneSyncStageDto(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}

}
