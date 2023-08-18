/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;



import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.ConfigDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ConfigSyncDto extends MasterSyncableEntity{
	
	private String description;

	private String configId;

	private String configType;

	
	public ConfigDao getConfigDao(ConfigSyncDto configSyncDto) {
		return (ConfigDao)MapperUtil.getObjectMapping(configSyncDto,new ConfigDao());
	}
}
