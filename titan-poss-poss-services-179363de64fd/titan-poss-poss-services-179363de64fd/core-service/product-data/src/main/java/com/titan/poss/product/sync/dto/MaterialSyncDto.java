/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.product.sync.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.MaterialTypeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class MaterialSyncDto extends MasterSyncableEntity {

	private String materialCode;

	private String materialType;

	private BigDecimal stdValue;

	private BigDecimal stdWeight;

	private BigDecimal ratePerGram;

	private String color;

	private String quality;

	private String shape;

	private String weightUnit;

	private String currencyCode;

	private String correlationId;

	public MaterialSyncDto() {

	}

	public MaterialSyncDto(MaterialDao materialDao) {
		MapperUtil.getObjectMapping(materialDao, this);
		if (materialDao.getMaterialType() != null)
			this.setMaterialType(materialDao.getMaterialType().getMaterialTypeCode());
		else
			this.setMaterialType(null);
	}

	public MaterialDao getMaterialDao(MaterialSyncDto materialSyncDto) {
		MaterialDao materialDao = new MaterialDao();
		materialDao = (MaterialDao) MapperUtil.getObjectMapping(materialSyncDto, materialDao);

		if (materialSyncDto.getMaterialType() != null) {
			MaterialTypeDao organizationDao = new MaterialTypeDao();
			organizationDao.setMaterialTypeCode(materialSyncDto.getMaterialType());
			materialDao.setMaterialType(organizationDao);
		} else {
			materialDao.setMaterialType(null);
		}
		return materialDao;
	}

}

