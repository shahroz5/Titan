/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dao.StoneTypeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StoneSyncDto extends MasterSyncableEntity {

	private String stoneCode;

	private String color;

	private BigDecimal stdWeight;

	private String stoneType;

	private String quality;

	private String shape;

	private BigDecimal stdValue;

	private BigDecimal ratePerCarat;

	private String currencyCode;

	private String weightUnit;

	private String correlationId;

	public StoneSyncDto() {

	}

	public StoneSyncDto(StoneDao stoneDao) {
		MapperUtil.getObjectMapping(stoneDao, this);
		this.stoneType = stoneDao.getStoneType().getStoneTypeCode();
	}

	public StoneDao getStoneDao(StoneSyncDto stoneSyncDto) {
		StoneDao stoneDao = new StoneDao();
		stoneDao = (StoneDao) MapperUtil.getObjectMapping(stoneSyncDto, stoneDao);

		StoneTypeDao stoneTypeDao = new StoneTypeDao();
		stoneTypeDao.setStoneTypeCode(stoneSyncDto.getStoneType());
		stoneDao.setStoneType(stoneTypeDao);

		return stoneDao;
	}
}
