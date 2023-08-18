/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RuleRangeDaoExt;
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
public class RuleRangeSyncDtoExt extends RuleRangeSyncDto {

	private static final long serialVersionUID = 1L;

	public RuleRangeSyncDtoExt() {

	}

	public RuleRangeSyncDtoExt(RuleRangeDaoExt ruleRangeDaoExt) {
		MapperUtil.getObjectMapping(ruleRangeDaoExt, this);
		this.setRuleId(ruleRangeDaoExt.getRuleMasterDao().getRuleIdDao().getRuleId());
		this.setRuleType(ruleRangeDaoExt.getRuleMasterDao().getRuleIdDao().getRuleType());
		if (ruleRangeDaoExt.getRangeId() != null) {
			this.setRangeId(ruleRangeDaoExt.getRangeId().getId());
		} else {
			this.setRangeId(null);
		}
	}

	public List<RuleRangeSyncDtoExt> getSyncDtoExtList(List<RuleRangeDaoExt> ruleRangeDaoList) {
		List<RuleRangeSyncDtoExt> dtoList = new ArrayList<>();
		ruleRangeDaoList.forEach(ruleRangeDao -> {
			RuleRangeSyncDtoExt syncDto = new RuleRangeSyncDtoExt(ruleRangeDao);
			dtoList.add(syncDto);
		});

		return dtoList;
	}

}
