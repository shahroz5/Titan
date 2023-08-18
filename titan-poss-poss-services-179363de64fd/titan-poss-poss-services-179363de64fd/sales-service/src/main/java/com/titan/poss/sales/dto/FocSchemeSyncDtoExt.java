/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.FocSchemesDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class FocSchemeSyncDtoExt extends FocSchemeSyncDto {
	public FocSchemeSyncDtoExt() {

	}

	public FocSchemeSyncDtoExt(FocSchemesDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt,this);
		this.setSalesTxn(daoExt.getSalesTxn().getId());
	}
}
