/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.PriceGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PriceGroupSyncDto extends MasterSyncableEntity {

	private String priceGroup;

	private String description;
	
	 public PriceGroupSyncDto() {

	    }

	 

	    public PriceGroupSyncDto(PriceGroupDao priceGroupDao) {
	        MapperUtil.getObjectMapping(priceGroupDao, this);
	    }

	 

	    public PriceGroupDao getPriceGroupDao(PriceGroupSyncDto priceGroupSyncDto) {
	    	PriceGroupDao priceGroupDao = new PriceGroupDao();
	        priceGroupDao = (PriceGroupDao) MapperUtil.getObjectMapping(priceGroupSyncDto, priceGroupDao);

	        return priceGroupDao;
	    }
}
