/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.FocSchemeProductMappingDaoExt;
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
public class FocSchemeProductMappingSyncDtoExt extends FocSchemeProductMappingSyncDto {

	public FocSchemeProductMappingSyncDtoExt() {

	}

	public FocSchemeProductMappingSyncDtoExt(FocSchemeProductMappingDaoExt focProductDaoExt) {

		MapperUtil.getObjectMapping(focProductDaoExt, this);

		if (focProductDaoExt.getFocSchemeMasterDao() != null)
			this.setFocSchemeMasterDao(focProductDaoExt.getFocSchemeMasterDao().getId());
		else
			this.setFocSchemeMasterDao(null);
		
		if (focProductDaoExt.getFocSchemeDetailsDao() != null)
			this.setFocSchemeDetailsDao(focProductDaoExt.getFocSchemeDetailsDao().getId());
		else {
			this.setFocSchemeDetailsDao(null);
		}
	}

	public List<FocSchemeProductMappingSyncDtoExt> getProductSyncDtoExts(
			List<FocSchemeProductMappingDaoExt> daoExts) {
		List<FocSchemeProductMappingSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			FocSchemeProductMappingSyncDtoExt dtoExt = new FocSchemeProductMappingSyncDtoExt(dao);
			syncDtoExts.add(dtoExt);
		});
		return syncDtoExts;
	}
}
