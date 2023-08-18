/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RivaahProductMappingDaoExt;
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
public class RivaahProductMappingSyncDtoExt extends RivaahProductMappingSyncDto {

	public RivaahProductMappingSyncDtoExt() {

	}

	public RivaahProductMappingSyncDtoExt(RivaahProductMappingDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if (daoExt.getRuleProductDao() != null)
			this.setRuleProductDao(daoExt.getRuleProductDao().getId());
	}

	public List<RivaahProductMappingSyncDtoExt> getSyncDtoExtList(
			List<RivaahProductMappingDaoExt> rivaahProductDaoList) {
		List<RivaahProductMappingSyncDtoExt> dtoList = new ArrayList<>();
		rivaahProductDaoList.forEach(rivaahProductDao -> {
			RivaahProductMappingSyncDtoExt syncDto = new RivaahProductMappingSyncDtoExt(rivaahProductDao);
			dtoList.add(syncDto);
		});
		return dtoList;
	}

}
