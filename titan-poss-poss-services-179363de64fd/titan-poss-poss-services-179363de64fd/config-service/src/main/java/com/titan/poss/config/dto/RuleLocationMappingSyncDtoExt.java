/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RuleLocationMappingDaoExt;
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
public class RuleLocationMappingSyncDtoExt extends RuleLocationMappingSyncDto {

	private static final long serialVersionUID = 1L;

	public RuleLocationMappingSyncDtoExt() {

	}

	public RuleLocationMappingSyncDtoExt(RuleLocationMappingDaoExt ruleLocationMappingDaoExt) {
		MapperUtil.getObjectMapping(ruleLocationMappingDaoExt, this);
		this.setRuleId(ruleLocationMappingDaoExt.getRuleMasterDao().getRuleIdDao().getRuleId());
		this.setRuleType(ruleLocationMappingDaoExt.getRuleMasterDao().getRuleIdDao().getRuleType());
	}

	public List<RuleLocationMappingSyncDtoExt> getSyncDtoExtList(
			List<RuleLocationMappingDaoExt> ruleLocationMappingList) {
		List<RuleLocationMappingSyncDtoExt> dtoList = new ArrayList<>();
		ruleLocationMappingList.forEach(ruleLocationMapping -> {
			RuleLocationMappingSyncDtoExt syncDto = new RuleLocationMappingSyncDtoExt(ruleLocationMapping);
			dtoList.add(syncDto);
		});

		return dtoList;
	}
}
