/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.FocSchemeItemMappingDaoExt;
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
public class FocSchemeItemMappingSyncDtoExt extends FocSchemeItemMappingSyncDto {

	public FocSchemeItemMappingSyncDtoExt() {

	}

	public FocSchemeItemMappingSyncDtoExt(FocSchemeItemMappingDaoExt focItemDaoExt) {

		MapperUtil.getObjectMapping(focItemDaoExt, this);

		if (focItemDaoExt.getFocSchemeMasterDao() != null)
			this.setFocSchemeMasterDao(focItemDaoExt.getFocSchemeMasterDao().getId());
		else
			this.setFocSchemeMasterDao(null);
	}

	public List<FocSchemeItemMappingSyncDtoExt> getItemSyncDtoExts(List<FocSchemeItemMappingDaoExt> daoExts) {
		List<FocSchemeItemMappingSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			FocSchemeItemMappingSyncDtoExt dtoExt = new FocSchemeItemMappingSyncDtoExt(dao);
			syncDtoExts.add(dtoExt);
		});
		return syncDtoExts;
	}
}
