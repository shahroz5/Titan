/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.FocSchemeDetailsDao;
import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.config.dao.FocSchemeProductMappingDao;
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
public class FocSchemeProductMappingSyncDto extends SyncableEntity {

	private String id;

	private String focSchemeMasterDao;

	private String focSchemeDetailsDao;

	private String productGroupCode;

	private String category;

	private String itemType;

	public FocSchemeProductMappingDao getFocProductDao(FocSchemeProductMappingSyncDto focSchemeProductSyncDto) {
		FocSchemeProductMappingDao focSchemeproductDao = new FocSchemeProductMappingDao();
		focSchemeproductDao = (FocSchemeProductMappingDao) MapperUtil.getObjectMapping(focSchemeProductSyncDto,
				focSchemeproductDao);

		FocSchemeMasterDao focSchemeMaster = new FocSchemeMasterDao();
		focSchemeMaster.setId(focSchemeProductSyncDto.getFocSchemeMasterDao());

		focSchemeproductDao.setFocSchemeMasterDao(focSchemeMaster);

		if (focSchemeProductSyncDto.getFocSchemeDetailsDao() != null) {
			FocSchemeDetailsDao focSchemeDetails = new FocSchemeDetailsDao();
			focSchemeDetails.setId(focSchemeProductSyncDto.getFocSchemeDetailsDao());

			focSchemeproductDao.setFocSchemeDetailsDao(focSchemeDetails);
		} else {
			focSchemeproductDao.setFocSchemeDetailsDao(null);
		}

		return focSchemeproductDao;
	}

	public List<FocSchemeProductMappingDao> getDaoList(List<FocSchemeProductMappingSyncDto> syncDtos) {
		List<FocSchemeProductMappingDao> daos = new ArrayList<>();
		syncDtos.forEach(dto -> {
			FocSchemeProductMappingSyncDto syncDto = new FocSchemeProductMappingSyncDto();
			daos.add(syncDto.getFocProductDao(dto));
		});
		return daos;
	}
}
