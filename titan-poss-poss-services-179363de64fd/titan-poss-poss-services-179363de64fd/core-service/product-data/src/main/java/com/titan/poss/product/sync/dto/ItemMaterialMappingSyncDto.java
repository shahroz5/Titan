/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemMaterialMappingDao;
import com.titan.poss.product.dao.MaterialDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ItemMaterialMappingSyncDto extends MasterSyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String item;
	
	private String material;

	private BigDecimal noOfMaterials;
	
	private String correlationId;
	
	public ItemMaterialMappingDao getItemMaterialMappingDao(ItemMaterialMappingSyncDto syncDto) {
		ItemMaterialMappingDao itemStoneMappingDao = (ItemMaterialMappingDao) MapperUtil.getObjectMapping(syncDto, new ItemMaterialMappingDao());
		
		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(syncDto.getItem());
		
//		MaterialDao stoneDao = new MaterialDao();
//		stoneDao.setMaterialCode(syncDto.getMaterial());
		
		itemStoneMappingDao.setMaterial(syncDto.getMaterial());
		
		itemStoneMappingDao.setItem(itemDao);
		
		return itemStoneMappingDao;
	}
	
	public List<ItemMaterialMappingDao> getDao(List<ItemMaterialMappingSyncDto> syncDtoList){
		List<ItemMaterialMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ItemMaterialMappingSyncDto dto = new ItemMaterialMappingSyncDto();			
			daoList.add(dto.getItemMaterialMappingDao(syncDto));
		});
		
		return daoList;
	}
	
}
