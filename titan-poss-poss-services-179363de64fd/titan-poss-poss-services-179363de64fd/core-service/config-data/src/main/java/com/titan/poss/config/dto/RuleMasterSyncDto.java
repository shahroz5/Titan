/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleMasterDao;
import com.titan.poss.core.dao.MasterSyncableEntity;
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
public class RuleMasterSyncDto extends MasterSyncableEntity {

	private String ruleType;

	private Integer ruleId;

	private String description;

	private String ruleDetails;

	public RuleMasterSyncDto() {

	}

	public RuleMasterSyncDto(RuleMasterDao ruleMasterDao) {
		MapperUtil.getObjectMapping(ruleMasterDao, this);
		this.setRuleId(ruleMasterDao.getRuleIdDao().getRuleId());
		this.setRuleType(ruleMasterDao.getRuleIdDao().getRuleType());
	}

	public RuleMasterDao getRuleMasterDao(RuleMasterSyncDto ruleMasterSyncDto) {
		RuleMasterDao ruleMasterDao = new RuleMasterDao();
		ruleMasterDao = (RuleMasterDao) MapperUtil.getObjectMapping(ruleMasterSyncDto, ruleMasterDao);

		RuleIdDao ruleIdDao = new RuleIdDao();
		ruleIdDao.setRuleId(ruleMasterSyncDto.getRuleId());
		ruleIdDao.setRuleType(ruleMasterSyncDto.getRuleType());

		ruleMasterDao.setRuleIdDao(ruleIdDao);

		return ruleMasterDao;
	}
}
