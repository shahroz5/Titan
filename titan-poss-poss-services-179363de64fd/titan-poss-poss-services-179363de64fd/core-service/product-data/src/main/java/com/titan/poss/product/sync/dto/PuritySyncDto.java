/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.PurityDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PuritySyncDto extends MasterSyncableEntity {

	private String id;

	private String itemType;

	private BigDecimal purity;

	private BigDecimal karat;

	private BigDecimal offset;

	private String description;

	private Boolean isDisplayed;

	public PuritySyncDto() {

	}

	public PuritySyncDto(PurityDao purity) {
		MapperUtil.getObjectMapping(purity, this);
		this.itemType = purity.getItemType().getItemTypeCode();
	}

	public PurityDao getPurityDao(PuritySyncDto puritySyncDto) {
		PurityDao purityDao = new PurityDao();
		purityDao = (PurityDao) MapperUtil.getObjectMapping(puritySyncDto, purityDao);

		ItemTypeDao itemTypeDao = new ItemTypeDao();
		itemTypeDao.setItemTypeCode(puritySyncDto.getItemType());

		purityDao.setItemType(itemTypeDao);
		return purityDao;
	}
}
