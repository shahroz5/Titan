package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.AdvanceDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AdvanceSyncDtoExt extends AdvanceSyncDto {
	public AdvanceSyncDtoExt() {

	}

	public AdvanceSyncDtoExt(AdvanceDaoExt advanceDaoExt) {
		MapperUtil.getObjectMapping(advanceDaoExt, this);
		this.setSalesTxn(advanceDaoExt.getSalesTxn().getId());
	}
}
