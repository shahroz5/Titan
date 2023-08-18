/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.FocSchemeLocationMappingDaoExt;
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
public class FocSchemeLocationMappingSyncDtoExt extends FocSchemeLocationMappingSyncDto {

	public FocSchemeLocationMappingSyncDtoExt() {

	}

	public FocSchemeLocationMappingSyncDtoExt(FocSchemeLocationMappingDaoExt focItemDaoExt) {

		MapperUtil.getObjectMapping(focItemDaoExt, this);

		if (focItemDaoExt.getFocSchemeMasterDao() != null)
			this.setFocSchemeMasterDao(focItemDaoExt.getFocSchemeMasterDao().getId());
		else
			this.setFocSchemeMasterDao(null);
	}

	public List<FocSchemeLocationMappingSyncDtoExt> getLocationSyncDtoExts(
			List<FocSchemeLocationMappingDaoExt> daoExts) {
		List<FocSchemeLocationMappingSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			FocSchemeLocationMappingSyncDtoExt dtoExt = new FocSchemeLocationMappingSyncDtoExt(dao);
			syncDtoExts.add(dtoExt);
		});
		return syncDtoExts;
	}
}
