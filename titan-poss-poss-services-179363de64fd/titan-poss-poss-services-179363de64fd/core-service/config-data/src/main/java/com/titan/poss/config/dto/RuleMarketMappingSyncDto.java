/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleMarketMappingDao;
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
public class RuleMarketMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String ruleType;

	private Integer ruleId;

	private String marketCode;

	public RuleMarketMappingDao getRuleMarketMappingDao(RuleMarketMappingSyncDto syncDto) {
		RuleMarketMappingDao mrketMappingDao = new RuleMarketMappingDao();
		mrketMappingDao = (RuleMarketMappingDao) MapperUtil.getObjectMapping(syncDto, mrketMappingDao);

		RuleMasterDao ruleMaster = new RuleMasterDao();

		RuleIdDao ruleIdDao = new RuleIdDao();
		ruleIdDao.setRuleId(syncDto.getRuleId());
		ruleIdDao.setRuleType(syncDto.getRuleType());

		ruleMaster.setRuleIdDao(ruleIdDao);

		mrketMappingDao.setRuleMasterDao(ruleMaster);

		return mrketMappingDao;
	}

	public List<RuleMarketMappingDao> getMarketMappingList(List<RuleMarketMappingSyncDto> syncDtoList) {
		List<RuleMarketMappingDao> daos = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			RuleMarketMappingSyncDto dto = new RuleMarketMappingSyncDto();
			daos.add(dto.getRuleMarketMappingDao(syncDto));
		});
		return daos;
	}

}
