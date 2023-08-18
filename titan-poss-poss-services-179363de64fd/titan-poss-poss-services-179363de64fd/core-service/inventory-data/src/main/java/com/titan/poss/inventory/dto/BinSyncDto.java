/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.BinDao;
import com.titan.poss.inventory.dao.BinGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class BinSyncDto extends MasterSyncableEntity {

	private String id;

	private String binCode;

	private String binGroup;

	private String description;

	public BinDao getBinDao(BinSyncDto binSyncDto) {
		
		BinDao bin = (BinDao) MapperUtil.getObjectMapping(binSyncDto, new BinDao());
		
		BinGroupDao binGroupDao = new BinGroupDao();
		binGroupDao.setBinGroupCode(binSyncDto.getBinGroup());
		
		bin.setBinGroup(binGroupDao);
		
		return bin;
	}
	
	public List<BinDao> getDaoList(List<BinSyncDto> syncDtoList){
		List<BinDao> daoList = new ArrayList<>();
		for(BinSyncDto binSyncDto : syncDtoList) {
			BinSyncDto syncDto = new BinSyncDto();
			daoList.add(syncDto.getBinDao(binSyncDto));
		}
		return daoList;
	}
}
