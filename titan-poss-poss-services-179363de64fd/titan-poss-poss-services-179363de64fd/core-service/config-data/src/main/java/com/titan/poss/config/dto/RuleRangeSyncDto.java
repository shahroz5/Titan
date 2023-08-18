/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RangeMasterDao;
import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleMasterDao;
import com.titan.poss.config.dao.RuleRangeDao;
import com.titan.poss.core.dao.SyncTimeDao;
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
public class RuleRangeSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String rangeId;

	private String ruleType;

	private Integer ruleId;

	private String rangeDetails;

	private String metalType;

	public RuleRangeDao getRuleRangeDao(RuleRangeSyncDto syncDto) {
		RuleRangeDao ruleRangeDao = new RuleRangeDao();
		ruleRangeDao = (RuleRangeDao) MapperUtil.getObjectMapping(syncDto, ruleRangeDao);

		RuleMasterDao ruleMaster = new RuleMasterDao();

		RuleIdDao ruleIdDao = new RuleIdDao();
		ruleIdDao.setRuleId(syncDto.getRuleId());
		ruleIdDao.setRuleType(syncDto.getRuleType());

		ruleMaster.setRuleIdDao(ruleIdDao);

		ruleRangeDao.setRuleMasterDao(ruleMaster);

		if (syncDto.getRangeId() != null) {
			RangeMasterDao rangeMasterDao = new RangeMasterDao();
			rangeMasterDao.setId(syncDto.getRangeId());

			ruleRangeDao.setRangeId(rangeMasterDao);
		} else {
			ruleRangeDao.setRangeId(null);
		}

		return ruleRangeDao;
	}

	public List<RuleRangeDao> getDaoList(List<RuleRangeSyncDto> syncDtoList) {
		List<RuleRangeDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			RuleRangeSyncDto dto = new RuleRangeSyncDto();
			daoList.add(dto.getRuleRangeDao(syncDto));
		});

		return daoList;
	}

}
