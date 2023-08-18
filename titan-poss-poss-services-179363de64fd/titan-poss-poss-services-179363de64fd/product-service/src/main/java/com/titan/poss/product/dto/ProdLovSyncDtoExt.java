/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ProdLovDaoExt;
import com.titan.poss.product.sync.dto.ProdLovSyncDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ProdLovSyncDtoExt extends ProdLovSyncDto {

	public ProdLovSyncDtoExt() {

	}

	public ProdLovSyncDtoExt(ProdLovDaoExt prodLovDaoExt) {
		MapperUtil.getObjectMapping(prodLovDaoExt, this);
	}

	public List<ProdLovSyncDtoExt> getDtoExts(List<ProdLovDaoExt> daoExts) {

		List<ProdLovSyncDtoExt> prodLovSyncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			ProdLovSyncDtoExt prodLovSyncdto = new ProdLovSyncDtoExt(dao);
			prodLovSyncDtoExts.add(prodLovSyncdto);
		});
		return prodLovSyncDtoExts;
	}
}
