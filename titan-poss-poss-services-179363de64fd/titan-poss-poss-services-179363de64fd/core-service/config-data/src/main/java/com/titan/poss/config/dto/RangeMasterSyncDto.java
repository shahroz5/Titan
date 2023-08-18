/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RangeMasterDao;
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
public class RangeMasterSyncDto extends MasterSyncableEntity {

	private String id;

	private BigDecimal fromRange;

	private BigDecimal toRange;

	private String rangeType;

	private Integer rowId;

	public RangeMasterDao getRangeMasterDao(RangeMasterSyncDto rangeMasterSyncDto) {
		RangeMasterDao rangeMasterDao = new RangeMasterDao();
		rangeMasterDao = (RangeMasterDao) MapperUtil.getObjectMapping(rangeMasterSyncDto, rangeMasterDao);
		return rangeMasterDao;
	}

	public List<RangeMasterDao> getRangeMasterDaoList(List<RangeMasterSyncDto> syncDtoList) {
		List<RangeMasterDao> rangeMasterDaos = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			RangeMasterSyncDto rangeMasterSyncDto = new RangeMasterSyncDto();
			rangeMasterDaos.add(rangeMasterSyncDto.getRangeMasterDao(syncDto));
		});
		return rangeMasterDaos;
	}

}
