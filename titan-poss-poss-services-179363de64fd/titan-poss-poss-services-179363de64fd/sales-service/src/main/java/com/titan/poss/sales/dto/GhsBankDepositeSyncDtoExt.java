/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GhsBankDepositDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GhsBankDepositeSyncDtoExt extends GhsBankDepositeSyncDto {
	public GhsBankDepositeSyncDtoExt() {
	}

	public GhsBankDepositeSyncDtoExt(GhsBankDepositDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
	}
}
