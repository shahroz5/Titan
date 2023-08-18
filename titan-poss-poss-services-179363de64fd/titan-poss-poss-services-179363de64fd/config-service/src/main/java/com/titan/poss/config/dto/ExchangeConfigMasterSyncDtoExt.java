/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;
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
public class ExchangeConfigMasterSyncDtoExt extends ExchangeConfigMasterSyncDto {

	public ExchangeConfigMasterSyncDtoExt() {

	}

	public ExchangeConfigMasterSyncDtoExt(ExchangeConfigMasterDaoExt gepConfigMasterDaoExt) {
		MapperUtil.getObjectMapping(gepConfigMasterDaoExt, this);
	}

}
