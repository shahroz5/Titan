/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MetalPriceConfigDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceConfigSyncDtoExt extends MetalPriceConfigSyncDto {

	public MetalPriceConfigSyncDtoExt() {

	}

	public MetalPriceConfigSyncDtoExt(MetalPriceConfigDaoExt metalPriceConfigDao) {
		MapperUtil.getObjectMapping(metalPriceConfigDao, this);

	}
}
