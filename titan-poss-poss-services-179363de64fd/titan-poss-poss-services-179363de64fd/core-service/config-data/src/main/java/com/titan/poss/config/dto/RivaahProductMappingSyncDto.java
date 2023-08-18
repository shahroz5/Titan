/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.titan.poss.config.dao.RivaahProductMappingDao;
import com.titan.poss.config.dao.RuleProductDao;
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
public class RivaahProductMappingSyncDto extends SyncableEntity {

	private String productGroupCode;

	private String id;

	public String ruleProductDao;

	public RivaahProductMappingSyncDto() {

	}

	public RivaahProductMappingDao getRivaahProduct(RivaahProductMappingSyncDto syncDto) {
		RivaahProductMappingDao rivaahProductMappingDao = (RivaahProductMappingDao) MapperUtil.getObjectMapping(syncDto,
				new RivaahProductMappingDao());
		RuleProductDao ruleProduct = new RuleProductDao();
		ruleProduct.setId(syncDto.getRuleProductDao());
		rivaahProductMappingDao.setRuleProductDao(ruleProduct);
		return rivaahProductMappingDao;
	}

	public List<RivaahProductMappingDao> getRivaahProductDaoList(List<RivaahProductMappingSyncDto> rivaahSyncDtoList) {
		List<RivaahProductMappingDao> daoList = new ArrayList<>();
		if (!rivaahSyncDtoList.isEmpty())
			daoList = rivaahSyncDtoList.stream().map(syncDto -> syncDto.getRivaahProduct(syncDto))
					.collect(Collectors.toList());
		return daoList;
	}

}
