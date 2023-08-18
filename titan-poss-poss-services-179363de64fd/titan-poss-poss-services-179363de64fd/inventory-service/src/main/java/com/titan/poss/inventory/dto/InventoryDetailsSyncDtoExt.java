/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class InventoryDetailsSyncDtoExt extends InventoryDetailsSyncDto {

	public InventoryDetailsSyncDtoExt() {
		
	}

	public InventoryDetailsSyncDtoExt(InventoryDetailsDaoExt inventoryDetailsDaoExt, Integer stockTransferId) {
		MapperUtil.getObjectMapping(inventoryDetailsDaoExt, this);
		this.setStockId(stockTransferId);
	}

	public List<InventoryDetailsSyncDtoExt> getSyncDtoExtList(List<InventoryDetailsDaoExt> daoExtList,
			Integer stockTransferId) {
		List<InventoryDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
		for (InventoryDetailsDaoExt daoExt : daoExtList) {
			InventoryDetailsSyncDtoExt dtoExt = new InventoryDetailsSyncDtoExt(daoExt, stockTransferId);
			dtoExtList.add(dtoExt);
		}
		return dtoExtList;
	}
}
