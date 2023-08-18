package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.ConfigLocationMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ConfigLocationMappingSyncDtoExt extends ConfigLocationMappingSyncDto{

	private static final long serialVersionUID = 1L;

	public ConfigLocationMappingSyncDtoExt() {
		
	}
	
	public ConfigLocationMappingSyncDtoExt(ConfigLocationMappingDaoExt configLocationMappingDaoExt) {
		MapperUtil.getObjectMapping(configLocationMappingDaoExt, this);
		this.setConfigId(configLocationMappingDaoExt.getConfigId().getConfigId());
	}
	
	public List<ConfigLocationMappingSyncDtoExt> getConfigLocationMappingSyncDtoExt(List<ConfigLocationMappingDaoExt> configLocationMappingDaoExt) {
		List<ConfigLocationMappingSyncDtoExt> syncDtoExt=new ArrayList<>();
		configLocationMappingDaoExt.forEach(config->{
			ConfigLocationMappingSyncDtoExt configSyncDtoExt=new ConfigLocationMappingSyncDtoExt(config);
			syncDtoExt.add(configSyncDtoExt);
		});
		return syncDtoExt;
	}
	
	public ConfigLocationMappingSyncDtoExt getConfigLocMappingSyncDto(ConfigLocationMappingDaoExt configLocationMappingDaoExt) {
		return new ConfigLocationMappingSyncDtoExt(configLocationMappingDaoExt);
		
	}
}
