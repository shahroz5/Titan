/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.BinCodeLocationMappingDao;
import com.titan.poss.inventory.dao.BinDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BinCodeLocationMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String bin;

	private String locationCode;
	
	private Boolean isActive;

	public BinCodeLocationMappingDao getDao(BinCodeLocationMappingSyncDto syncDto) {
		BinCodeLocationMappingDao dao = (BinCodeLocationMappingDao) MapperUtil.getObjectMapping(syncDto, new BinCodeLocationMappingDao());
		
		BinDao binDao = new BinDao();
		binDao.setId(syncDto.getBin());
		
		dao.setBin(binDao);
		
		return dao;
	}
	
	public List<BinCodeLocationMappingDao> getDaoList(List<BinCodeLocationMappingSyncDto> syncDtoList){
		List<BinCodeLocationMappingDao> daoList = new ArrayList<>();
		for(BinCodeLocationMappingSyncDto syncDto : syncDtoList) {
			BinCodeLocationMappingSyncDto dto = new BinCodeLocationMappingSyncDto();
			daoList.add(dto.getDao(syncDto));
		}
		return daoList;
	}
}
