/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ConfigLovDao;
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
public class ConfigLovSyncDto extends MasterSyncableEntity {

	private String id;

	private String lovType;

	private String code;

	private String value;

	public ConfigLovDao getConfigLovDao(ConfigLovSyncDto configLovSyncDto) {
		ConfigLovDao configLovDao = new ConfigLovDao();
		configLovDao = (ConfigLovDao) MapperUtil.getObjectMapping(configLovSyncDto, configLovDao);
		return configLovDao;
	}

	public List<ConfigLovDao> getDaoList(List<ConfigLovSyncDto> syncDtos) {
		List<ConfigLovDao> daos = new ArrayList<>();
		syncDtos.forEach(dto -> {
			ConfigLovSyncDto syncDto = new ConfigLovSyncDto();
			daos.add(syncDto.getConfigLovDao(dto));
		});
		return daos;
	}
}
