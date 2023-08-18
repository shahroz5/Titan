/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dao.ItemStoneDatasyncStageDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ItemStoneStageDto extends MasterSyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String correlationId;

	private String item;

	private String stone;

	private Short noOfStones;

	private String transferType;

	public ItemStoneStageDto() {

	}

	public ItemStoneStageDto(ItemStoneDatasyncStageDao itemStoneDao) {
		MapperUtil.getObjectMapping(itemStoneDao, this);
	}

	public List<ItemStoneStageDto> getItemMaterialStageDtoList(List<ItemStoneDatasyncStageDao> daoList) {
		List<ItemStoneStageDto> dtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ItemStoneStageDto dto = new ItemStoneStageDto(dao);
			dtoList.add(dto);
		});
		return dtoList;
	}

	public ItemStoneDatasyncStageDao getMaterialDatasyncStageDao(ItemStoneStageDto itemStoneSyncDto) {
		ItemStoneDatasyncStageDao itemStoneDao = new ItemStoneDatasyncStageDao();
		itemStoneDao = (ItemStoneDatasyncStageDao) MapperUtil.getObjectMapping(itemStoneSyncDto, itemStoneDao);
		return itemStoneDao;
	}

	public List<ItemStoneDatasyncStageDao> getMaterialDatasyncStageDaoDaoList(
			List<ItemStoneStageDto> syncDtoList) {
		List<ItemStoneDatasyncStageDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ItemStoneStageDto itemStoneSyncDto = new ItemStoneStageDto();
			daoList.add(itemStoneSyncDto.getMaterialDatasyncStageDao(syncDto));
		});
		return daoList;
	}
}
