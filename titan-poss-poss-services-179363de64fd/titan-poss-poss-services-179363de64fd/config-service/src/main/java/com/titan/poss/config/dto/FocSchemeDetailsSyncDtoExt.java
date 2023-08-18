/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.FocSchemeDetailsDaoExt;
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
public class FocSchemeDetailsSyncDtoExt extends FocSchemeDetailsSyncDto {

	public FocSchemeDetailsSyncDtoExt() {

	}

	public FocSchemeDetailsSyncDtoExt(FocSchemeDetailsDaoExt focSchemeDetailsDaoExt) {

		MapperUtil.getObjectMapping(focSchemeDetailsDaoExt, this);

		if (focSchemeDetailsDaoExt.getFocSchemeMasterDao() != null)
			this.setFocSchemeMasterDao(focSchemeDetailsDaoExt.getFocSchemeMasterDao().getId());
		else
			this.setFocSchemeMasterDao(null);
	}

	public List<FocSchemeDetailsSyncDtoExt> getDetailsSyncDtoExts(List<FocSchemeDetailsDaoExt> daoExts) {
		List<FocSchemeDetailsSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			FocSchemeDetailsSyncDtoExt dtoExt = new FocSchemeDetailsSyncDtoExt(dao);
			syncDtoExts.add(dtoExt);
		});
		return syncDtoExts;
	}
}
