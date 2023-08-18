/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.FocSchemeItemMappingDao;
import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class FocSchemeItemMappingSyncDto extends SyncableEntity {

	private String id;

	private String focSchemeMasterDao;

	private String itemCode;

	private BigDecimal karat;

	private BigDecimal stdWeight;

	public FocSchemeItemMappingDao getFocSchemeItemMappingDao(FocSchemeItemMappingSyncDto focItemSyncDto) {
		FocSchemeItemMappingDao focItemDao = new FocSchemeItemMappingDao();
		focItemDao = (FocSchemeItemMappingDao) MapperUtil.getObjectMapping(focItemSyncDto, focItemDao);

		FocSchemeMasterDao focSchemeMaster = new FocSchemeMasterDao();
		focSchemeMaster.setId(focItemSyncDto.getFocSchemeMasterDao());

		focItemDao.setFocSchemeMasterDao(focSchemeMaster);

		return focItemDao;
	}

	public List<FocSchemeItemMappingDao> getDaoList(List<FocSchemeItemMappingSyncDto> syncDtos) {
		List<FocSchemeItemMappingDao> daos = new ArrayList<>();
		syncDtos.forEach(dto -> {
			FocSchemeItemMappingSyncDto syncDto = new FocSchemeItemMappingSyncDto();
			daos.add(syncDto.getFocSchemeItemMappingDao(dto));
		});
		return daos;
	}
}
