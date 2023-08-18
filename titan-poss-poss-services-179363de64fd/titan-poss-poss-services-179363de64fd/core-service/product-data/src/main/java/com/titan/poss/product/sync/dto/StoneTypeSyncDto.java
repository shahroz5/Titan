/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;


import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.StoneTypeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StoneTypeSyncDto extends MasterSyncableEntity{

	private String stoneTypeCode;

	private String description;

	private String configDetails;
	
	public StoneTypeSyncDto() {

    }

    public StoneTypeSyncDto(StoneTypeDao stoneTypeDao) {
        MapperUtil.getObjectMapping(stoneTypeDao, this);
    }

    public StoneTypeDao getStoneTypeDao(StoneTypeSyncDto stoneTypeSyncDto) {
    	StoneTypeDao stoneTypeDao = new StoneTypeDao();
        stoneTypeDao = (StoneTypeDao) MapperUtil.getObjectMapping(stoneTypeSyncDto, stoneTypeDao);
        return stoneTypeDao;
    }
}
