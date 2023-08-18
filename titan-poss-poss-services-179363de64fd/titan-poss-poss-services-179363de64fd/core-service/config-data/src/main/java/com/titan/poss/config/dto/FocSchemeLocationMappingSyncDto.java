/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.config.dao.FocSchemeLocationMappingDao;
import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.core.dao.MasterSyncableEntity;
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
public class FocSchemeLocationMappingSyncDto extends MasterSyncableEntity {

	private String id;

	private String focSchemeMasterDao;

	private String locationCode;

	private String mobileNo;

	private Date startDate;

	private Date endDate;

	private String configDetails;

	public FocSchemeLocationMappingDao getFocLocationDao(FocSchemeLocationMappingSyncDto focSchemeLocationSyncDto) {
		FocSchemeLocationMappingDao focSchemeLocationDao = new FocSchemeLocationMappingDao();
		focSchemeLocationDao = (FocSchemeLocationMappingDao) MapperUtil.getObjectMapping(focSchemeLocationSyncDto,
				focSchemeLocationDao);

		FocSchemeMasterDao focSchemeMaster = new FocSchemeMasterDao();
		focSchemeMaster.setId(focSchemeLocationSyncDto.getFocSchemeMasterDao());

		focSchemeLocationDao.setFocSchemeMasterDao(focSchemeMaster);

		return focSchemeLocationDao;
	}

	public List<FocSchemeLocationMappingDao> getDaoList(List<FocSchemeLocationMappingSyncDto> syncDtos) {
		List<FocSchemeLocationMappingDao> daos = new ArrayList<>();
		syncDtos.forEach(dto -> {
			FocSchemeLocationMappingSyncDto syncDto = new FocSchemeLocationMappingSyncDto();
			daos.add(syncDto.getFocLocationDao(dto));
		});
		return daos;
	}
}
