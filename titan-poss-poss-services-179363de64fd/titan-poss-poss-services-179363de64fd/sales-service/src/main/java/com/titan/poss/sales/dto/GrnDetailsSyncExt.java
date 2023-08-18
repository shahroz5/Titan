/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GrnDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GrnDetailsSyncExt extends GrnDetailsSyncDto{
	
	public GrnDetailsSyncExt() {
		
	}
	
	public GrnDetailsSyncExt(GrnDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if(daoExt.getGrn()!=null)
			this.setGrn(daoExt.getGrn().getId());
	}

}
