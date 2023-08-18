/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.RevenueSummaryDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class RevenueSummarySyncDtoExt extends RevenueSummarySyncDto {
	public RevenueSummarySyncDtoExt() {

	}

	public RevenueSummarySyncDtoExt(RevenueSummaryDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		this.setBusinessDayDao(daoExt.getBusinessDayDao().getId());
	}
}
