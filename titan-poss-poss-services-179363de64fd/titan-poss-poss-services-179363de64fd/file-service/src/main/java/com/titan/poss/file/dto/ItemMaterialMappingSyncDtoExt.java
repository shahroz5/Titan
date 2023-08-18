/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.file.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemMaterialMappingDao;
import com.titan.poss.product.sync.dto.ItemMaterialMappingSyncDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ItemMaterialMappingSyncDtoExt extends ItemMaterialMappingSyncDto{

	private static final long serialVersionUID = 1L;

public ItemMaterialMappingSyncDtoExt() {
		
	}
	public ItemMaterialMappingSyncDtoExt(ItemMaterialMappingDao itemStoneMappingSyncDto) {
		MapperUtil.getObjectMapping(itemStoneMappingSyncDto, this);
		this.setItem(itemStoneMappingSyncDto.getItem().getItemCode());
		this.setMaterial(itemStoneMappingSyncDto.getMaterial());
	}
	
	public List<ItemMaterialMappingSyncDtoExt> getSyncDtoExtList(List<ItemMaterialMappingDao> itemStoneMappingList) {
		List<ItemMaterialMappingSyncDtoExt> dtoList = new ArrayList<>();
		itemStoneMappingList.forEach(itemStoneMapping -> {
			ItemMaterialMappingSyncDtoExt syncDto = new ItemMaterialMappingSyncDtoExt(itemStoneMapping);
			dtoList.add(syncDto);
		});
		
		return dtoList;
	}
}
