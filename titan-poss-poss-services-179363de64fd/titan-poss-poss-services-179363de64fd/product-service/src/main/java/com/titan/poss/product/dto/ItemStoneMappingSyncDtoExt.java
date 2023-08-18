/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemStoneMappingDaoExt;
import com.titan.poss.product.sync.dto.ItemStoneMappingSyncDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ItemStoneMappingSyncDtoExt extends ItemStoneMappingSyncDto{

	private static final long serialVersionUID = 1L;

public ItemStoneMappingSyncDtoExt() {
		
	}
	public ItemStoneMappingSyncDtoExt(ItemStoneMappingDaoExt itemStoneMappingSyncDto) {
		MapperUtil.getObjectMapping(itemStoneMappingSyncDto, this);
		this.setItem(itemStoneMappingSyncDto.getItem().getItemCode());
		this.setStone(itemStoneMappingSyncDto.getStone().getStoneCode());
	}
	
	public List<ItemStoneMappingSyncDtoExt> getSyncDtoExtList(List<ItemStoneMappingDaoExt> itemStoneMappingList) {
		List<ItemStoneMappingSyncDtoExt> dtoList = new ArrayList<>();
		itemStoneMappingList.forEach(itemStoneMapping -> {
			ItemStoneMappingSyncDtoExt syncDto = new ItemStoneMappingSyncDtoExt(itemStoneMapping);
			dtoList.add(syncDto);
		});
		
		return dtoList;
	}
}
