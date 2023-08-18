/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dao.ItemMaterialDatasyncStageDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ItemMaterialStageDto extends MasterSyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String correlationId;

	private String item;

	private String material;

	private BigDecimal noOfMaterials;

	private String transferType;

	public ItemMaterialStageDto() {

	}

	public ItemMaterialStageDto(ItemMaterialDatasyncStageDao itemMaterialDao) {
		MapperUtil.getObjectMapping(itemMaterialDao, this);
	}

	public List<ItemMaterialStageDto> getItemMaterialStageDtoList(List<ItemMaterialDatasyncStageDao> daoList) {
		List<ItemMaterialStageDto> dtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ItemMaterialStageDto dto = new ItemMaterialStageDto(dao);
			dtoList.add(dto);
		});
		return dtoList;
	}

	public ItemMaterialDatasyncStageDao getMaterialDatasyncStageDao(ItemMaterialStageDto itemMaterialSyncDto) {
		ItemMaterialDatasyncStageDao materialDao = new ItemMaterialDatasyncStageDao();
		materialDao = (ItemMaterialDatasyncStageDao) MapperUtil.getObjectMapping(itemMaterialSyncDto, materialDao);
		return materialDao;
	}

	public List<ItemMaterialDatasyncStageDao> getMaterialDatasyncStageDaoDaoList(
			List<ItemMaterialStageDto> syncDtoList) {
		List<ItemMaterialDatasyncStageDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ItemMaterialStageDto materialSyncDto = new ItemMaterialStageDto();
			daoList.add(materialSyncDto.getMaterialDatasyncStageDao(syncDto));
		});
		return daoList;
	}

}
