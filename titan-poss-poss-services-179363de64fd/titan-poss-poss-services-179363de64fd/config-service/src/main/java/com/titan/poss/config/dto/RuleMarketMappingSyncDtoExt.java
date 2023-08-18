/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RuleMarketMappingDaoExt;
import com.titan.poss.core.utils.MapperUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class RuleMarketMappingSyncDtoExt extends RuleMarketMappingSyncDto {

	private static final long serialVersionUID = 1L;

	public RuleMarketMappingSyncDtoExt() {

	}

	public RuleMarketMappingSyncDtoExt(RuleMarketMappingDaoExt ruleMarketDaoExt) {
		MapperUtil.getObjectMapping(ruleMarketDaoExt, this);
		this.setRuleId(ruleMarketDaoExt.getRuleMasterDao().getRuleIdDao().getRuleId());
		this.setRuleType(ruleMarketDaoExt.getRuleMasterDao().getRuleIdDao().getRuleType());
	}

	public List<RuleMarketMappingSyncDtoExt> getSyncDtoExtList(List<RuleMarketMappingDaoExt> ruleMarketDaoList) {
		List<RuleMarketMappingSyncDtoExt> dtoList = new ArrayList<>();
		ruleMarketDaoList.forEach(ruleMarketDao -> {
			RuleMarketMappingSyncDtoExt syncDto = new RuleMarketMappingSyncDtoExt(ruleMarketDao);
			dtoList.add(syncDto);
		});

		return dtoList;
	}

}
