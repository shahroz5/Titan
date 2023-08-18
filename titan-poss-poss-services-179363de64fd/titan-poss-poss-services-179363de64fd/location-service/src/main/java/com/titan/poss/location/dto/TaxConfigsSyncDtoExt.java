/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.TaxConfigsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class TaxConfigsSyncDtoExt extends TaxConfigsSyncDto {

	public TaxConfigsSyncDtoExt() {
		
	}

	public TaxConfigsSyncDtoExt(TaxConfigsDaoExt taxConfigsDao) {
		MapperUtil.getObjectMapping(taxConfigsDao, this);
	}

}
