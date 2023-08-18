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
import com.titan.poss.config.dao.RuleProductDao;
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
public class RuleProductMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String ruleType;

	private Integer ruleId;

	private String productGroupCode;

	private String productCategoryCode;

	private String fieldDetails;
	
	private String rangeId;

	public RuleProductDao getRuleProductDao(RuleProductMappingSyncDto syncDto) {
		RuleProductDao ruleproductDao = new RuleProductDao();
		ruleproductDao = (RuleProductDao) MapperUtil.getObjectMapping(syncDto, ruleproductDao);

		RuleMasterDao ruleMaster = new RuleMasterDao();

		RuleIdDao ruleIdDao = new RuleIdDao();
		ruleIdDao.setRuleId(syncDto.getRuleId());
		ruleIdDao.setRuleType(syncDto.getRuleType());

		ruleMaster.setRuleIdDao(ruleIdDao);

		ruleproductDao.setRuleMasterDao(ruleMaster);

		if (syncDto.getRangeId() != null) {
		RangeMasterDao rangeMasterDao = new RangeMasterDao();
		rangeMasterDao.setId(syncDto.getRangeId());

		ruleproductDao.setRangeId(rangeMasterDao);
		} else {
			ruleproductDao.setRangeId(null);
		}

		return ruleproductDao;
	}

	public List<RuleProductDao> getDaoList(List<RuleProductMappingSyncDto> syncDtoList) {
		List<RuleProductDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			RuleProductMappingSyncDto dto = new RuleProductMappingSyncDto();
			daoList.add(dto.getRuleProductDao(syncDto));
		});

		return daoList;
	}
}
