/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.BinGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BinGroupSyncDto extends MasterSyncableEntity {

	private String binGroupCode;

	private String description;

	public BinGroupSyncDto() {

	}

	public BinGroupSyncDto(BinGroupDao binGroup) {
		MapperUtil.getObjectMapping(binGroup, this);
	}

	public BinGroupDao getBingGroupDao(BinGroupSyncDto binGroupSyncDto) {
		BinGroupDao binGroupDao = new BinGroupDao();
		MapperUtil.getObjectMapping(binGroupSyncDto, binGroupDao);
		return binGroupDao;
	}
}
