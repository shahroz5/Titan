/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.BinDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BinSyncDtoExt extends BinSyncDto {

	public BinSyncDtoExt() {

	}

	public BinSyncDtoExt(BinDaoExt bin) {
		MapperUtil.getObjectMapping(bin, this);
		this.setBinGroup(bin.getBinGroup().getBinGroupCode());
	}

	public List<BinSyncDtoExt> getBinSyncDtoList(List<BinDaoExt> binList) {
		List<BinSyncDtoExt> binSyncDtoList = new ArrayList<>();
		for (BinDaoExt bin : binList) {
			BinSyncDtoExt binSyncDto = new BinSyncDtoExt(bin);
			binSyncDtoList.add(binSyncDto);
		}

		return binSyncDtoList;
	}
}
