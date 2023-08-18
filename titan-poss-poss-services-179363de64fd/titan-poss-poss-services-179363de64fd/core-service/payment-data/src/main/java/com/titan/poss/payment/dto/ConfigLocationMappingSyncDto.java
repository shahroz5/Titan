/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.ConfigLocationMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ConfigLocationMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String locationCode;
	
	private String id;
	
	private String configId;
	
	private String configType;
	
	public List<ConfigLocationMappingDao> getConfigLocationMappingDaoList(List<ConfigLocationMappingSyncDto> configLocationMappingSyncDto) {
		List<ConfigLocationMappingDao> daoList=new ArrayList<>();
		configLocationMappingSyncDto.forEach(configLocationSyncDto->{
			ConfigLocationMappingDao configLocationMappingDao= (ConfigLocationMappingDao)MapperUtil.getObjectMapping(configLocationSyncDto,new ConfigLocationMappingDao()); 
			ConfigDao configDao=new ConfigDao();
			configDao.setConfigId(configLocationSyncDto.getConfigId());
			configLocationMappingDao.setConfigId(configDao);
			daoList.add(configLocationMappingDao);
		});
		return daoList; 
	}

	
	public ConfigLocationMappingDao getConfigLocationMappingDao(ConfigLocationMappingSyncDto configLocationMappingSyncDto) {
		ConfigLocationMappingDao configLocationMappingDao= (ConfigLocationMappingDao)MapperUtil.getObjectMapping(configLocationMappingSyncDto,new ConfigLocationMappingDao()); 
		ConfigDao configDao=new ConfigDao();
		configDao.setConfigId(configLocationMappingSyncDto.getConfigId());
		configLocationMappingDao.setConfigId(configDao);
		return configLocationMappingDao; 
	}
}
