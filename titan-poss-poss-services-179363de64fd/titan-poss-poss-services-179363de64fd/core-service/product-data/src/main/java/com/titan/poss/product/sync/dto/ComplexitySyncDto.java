/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ComplexityDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ComplexitySyncDto extends MasterSyncableEntity  {

	private String complexityCode;

	private String description;
	
	 public ComplexitySyncDto() {

	    }

	 

	    public ComplexitySyncDto(ComplexityDao complexity) {
	        MapperUtil.getObjectMapping(complexity, this);
	    }

	 

	    public ComplexityDao getComplexityDao(ComplexitySyncDto complexitySyncDto) {
	    	ComplexityDao complexityDao = new ComplexityDao();
	        complexityDao = (ComplexityDao) MapperUtil.getObjectMapping(complexitySyncDto, complexityDao);
	        return complexityDao;
	    }
}
