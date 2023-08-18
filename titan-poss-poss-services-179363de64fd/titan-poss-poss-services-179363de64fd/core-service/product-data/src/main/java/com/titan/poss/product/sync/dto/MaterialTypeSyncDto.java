/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.MaterialTypeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MaterialTypeSyncDto extends MasterSyncableEntity {

	private String materialTypeCode;

	private String description;

	private String orgCode;

	public MaterialTypeSyncDto() {

	}

	public MaterialTypeSyncDto(MaterialTypeDao materialDao) {
		MapperUtil.getObjectMapping(materialDao, this);
	}

	public MaterialTypeDao getMaterialTypeDao(MaterialTypeSyncDto materialSyncDto) {
		MaterialTypeDao materialDao = new MaterialTypeDao();
		materialDao = (MaterialTypeDao) MapperUtil.getObjectMapping(materialSyncDto, materialDao);

		return materialDao;
	}
}
