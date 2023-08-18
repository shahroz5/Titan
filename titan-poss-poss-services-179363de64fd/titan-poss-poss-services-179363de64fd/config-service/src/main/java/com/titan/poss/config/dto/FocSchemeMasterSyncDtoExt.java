/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import com.titan.poss.config.dao.FocSchemeMasterDaoExt;
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
public class FocSchemeMasterSyncDtoExt extends FocSchemeMasterSyncDto {

	public FocSchemeMasterSyncDtoExt() {

	}

	public FocSchemeMasterSyncDtoExt(FocSchemeMasterDaoExt focSchemeMasterDaoExt) {

		MapperUtil.getObjectMapping(focSchemeMasterDaoExt, this);

	}
}
