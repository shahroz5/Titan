package com.titan.poss.payment.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.ConfigDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ConfigSyncDtoExt extends ConfigSyncDto{

	public ConfigSyncDtoExt() {
		
	}
	
	public ConfigSyncDtoExt(ConfigDaoExt config) {
		MapperUtil.getObjectMapping(config, this);
	}
}
