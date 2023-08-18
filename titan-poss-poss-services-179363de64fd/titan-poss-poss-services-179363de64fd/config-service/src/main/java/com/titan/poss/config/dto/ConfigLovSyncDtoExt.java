/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ConfigLovDaoExt;
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
public class ConfigLovSyncDtoExt extends ConfigLovSyncDto {

	public ConfigLovSyncDtoExt() {

	}

	public ConfigLovSyncDtoExt(ConfigLovDaoExt configLovDaoExt) {

		MapperUtil.getObjectMapping(configLovDaoExt, this);
	}

	public List<ConfigLovSyncDtoExt> getSyncDtoExtList(List<ConfigLovDaoExt> daoExts) {
		List<ConfigLovSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			ConfigLovSyncDtoExt syncDtoExt = new ConfigLovSyncDtoExt(dao);
			syncDtoExts.add(syncDtoExt);
		});
		return syncDtoExts;

	}
}
