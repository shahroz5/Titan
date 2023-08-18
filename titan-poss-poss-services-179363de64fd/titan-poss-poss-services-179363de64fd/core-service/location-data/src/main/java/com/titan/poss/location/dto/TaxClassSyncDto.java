/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.TaxClassDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class TaxClassSyncDto extends MasterSyncableEntity {
	
	private String taxClassCode;

	private String description;
	
	public TaxClassSyncDto() {
		
	}
	
	public TaxClassSyncDto(TaxClassDao taxClassDao) {
		MapperUtil.getObjectMapping(taxClassDao, this);
	}
	
	public TaxClassDao getTaxClassDao(TaxClassSyncDto taxClassSyncDto) {
		return (TaxClassDao) MapperUtil.getObjectMapping(taxClassSyncDto, new TaxClassDao());
	}
}
