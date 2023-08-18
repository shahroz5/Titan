/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dao.MaterialDatasyncStageDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MaterialSyncStageDto extends MasterSyncableEntity {

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

	private String transferType;
	
	private String configDetails;

	public MaterialSyncStageDto() {

	}

	public MaterialSyncStageDto(MaterialDatasyncStageDao materialDao) {
		MapperUtil.getObjectMapping(materialDao, this);
	}

	public MaterialDatasyncStageDao getMaterialDao(MaterialSyncStageDto materialSyncDto) {
		MaterialDatasyncStageDao materialStageDao = new MaterialDatasyncStageDao();
		materialStageDao = (MaterialDatasyncStageDao) MapperUtil.getObjectMapping(materialSyncDto, materialStageDao);
		return materialStageDao;
	}

	public MaterialDatasyncStageDao getMaterialDatasyncStageDao(MaterialSyncStageDto materialSyncDto) {
		MaterialDatasyncStageDao materialDao = new MaterialDatasyncStageDao();
		materialDao = (MaterialDatasyncStageDao) MapperUtil.getObjectMapping(materialSyncDto, materialDao);

		return materialDao;
	}

	public List<MaterialDatasyncStageDao> getMaterialDatasyncStageDaoDaoList(List<MaterialSyncStageDto> syncDtoList) {
		List<MaterialDatasyncStageDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			MaterialSyncStageDto materialSyncDto = new MaterialSyncStageDto();
			daoList.add(materialSyncDto.getMaterialDatasyncStageDao(syncDto));
		});
		return daoList;
	}
}

