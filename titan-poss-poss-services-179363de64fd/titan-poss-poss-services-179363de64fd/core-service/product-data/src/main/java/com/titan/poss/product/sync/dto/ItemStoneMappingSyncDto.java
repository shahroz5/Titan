/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.dao.StoneDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ItemStoneMappingSyncDto extends MasterSyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String item;

	private String stone;

	private Short noOfStones;
	
	private String correlationId;

	public ItemStoneMappingDao getItemStoneMappingDao(ItemStoneMappingSyncDto syncDto) {
		ItemStoneMappingDao itemStoneMappingDao = (ItemStoneMappingDao) MapperUtil.getObjectMapping(syncDto, new ItemStoneMappingDao());
		
		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(syncDto.getItem());
		
		StoneDao stoneDao = new StoneDao();
		stoneDao.setStoneCode(syncDto.getStone());
		
		itemStoneMappingDao.setStone(stoneDao);
		
		itemStoneMappingDao.setItem(itemDao);
		
		return itemStoneMappingDao;
	}
	
	public List<ItemStoneMappingDao> getDao(List<ItemStoneMappingSyncDto> syncDtoList){
		List<ItemStoneMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ItemStoneMappingSyncDto dto = new ItemStoneMappingSyncDto();			
			daoList.add(dto.getItemStoneMappingDao(syncDto));
		});
		
		return daoList;
	}
	
}
