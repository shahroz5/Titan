/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import com.titan.poss.config.dao.RuleMetadataDao;
import com.titan.poss.core.dao.SyncableEntity;
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
public class RuleMetadataSyncDto extends SyncableEntity {

	private String ruleType;

	private Integer ruleId;

	private String ruleGroup;

	private Boolean productGroupMapping;

	private Boolean productCategoryMapping;

	private Boolean locationMapping;

	private Boolean rangeMapping;

	private Boolean productLevelValue;
	
	private Boolean rangeLevelValue;

	private Boolean headerLevelValue;

	private Boolean marketMapping;

	private String orgCode;

	public RuleMetadataSyncDto() {

	}

	public RuleMetadataSyncDto(RuleMetadataDao ruleMetadataDao) {
		MapperUtil.getObjectMapping(ruleMetadataDao, this);
	}

	public RuleMetadataDao getRuleMetadataDao(RuleMetadataSyncDto ruleMetadataSyncDto) {
		return (RuleMetadataDao) MapperUtil.getObjectMapping(ruleMetadataSyncDto, new RuleMetadataDao());
	}
}
