/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleLocationMappingDao;
import com.titan.poss.config.dao.RuleMasterDao;
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
public class RuleLocationMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String ruleType;

	private Integer ruleId;

	private String locationCode;

	private Date offerStartDate;

	private Date offerEndDate;

	public RuleLocationMappingDao getRuleLocationMapping(RuleLocationMappingSyncDto syncDto) {
		RuleLocationMappingDao ruleLocationMappingDao = new RuleLocationMappingDao();
		ruleLocationMappingDao = (RuleLocationMappingDao) MapperUtil.getObjectMapping(syncDto, ruleLocationMappingDao);

		RuleMasterDao ruleMaster = new RuleMasterDao();

		RuleIdDao ruleIdDao = new RuleIdDao();
		ruleIdDao.setRuleId(syncDto.getRuleId());
		ruleIdDao.setRuleType(syncDto.getRuleType());

		ruleMaster.setRuleIdDao(ruleIdDao);

		ruleLocationMappingDao.setRuleMasterDao(ruleMaster);

		return ruleLocationMappingDao;
	}

	public List<RuleLocationMappingDao> getDaoList(List<RuleLocationMappingSyncDto> syncDtoList) {
		List<RuleLocationMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			RuleLocationMappingSyncDto dto = new RuleLocationMappingSyncDto();
			daoList.add(dto.getRuleLocationMapping(syncDto));
		});

		return daoList;
	}

}
