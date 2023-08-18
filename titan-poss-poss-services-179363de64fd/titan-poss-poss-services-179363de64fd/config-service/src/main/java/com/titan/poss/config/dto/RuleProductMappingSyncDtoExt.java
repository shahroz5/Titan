/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RuleProductDaoExt;
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
public class RuleProductMappingSyncDtoExt extends RuleProductMappingSyncDto {

	private static final long serialVersionUID = 1L;

	public RuleProductMappingSyncDtoExt() {

	}

	public RuleProductMappingSyncDtoExt(RuleProductDaoExt ruleProductDaoExt) {
		MapperUtil.getObjectMapping(ruleProductDaoExt, this);
		this.setRuleId(ruleProductDaoExt.getRuleMasterDao().getRuleIdDao().getRuleId());
		this.setRuleType(ruleProductDaoExt.getRuleMasterDao().getRuleIdDao().getRuleType());
		if (ruleProductDaoExt.getRangeId() != null) {
			this.setRangeId(ruleProductDaoExt.getRangeId().getId());
		} else {
			this.setRangeId(null);
		}
	}

	public List<RuleProductMappingSyncDtoExt> getSyncDtoExtList(List<RuleProductDaoExt> ruleProductDaoList) {
		List<RuleProductMappingSyncDtoExt> dtoList = new ArrayList<>();
		ruleProductDaoList.forEach(ruleProductDao -> {
			RuleProductMappingSyncDtoExt syncDto = new RuleProductMappingSyncDtoExt(ruleProductDao);
			dtoList.add(syncDto);
		});

		return dtoList;
	}

}
