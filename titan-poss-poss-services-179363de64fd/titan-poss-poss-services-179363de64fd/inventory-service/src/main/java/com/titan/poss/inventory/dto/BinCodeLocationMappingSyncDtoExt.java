/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.dao.BinCodeLocationMappingDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BinCodeLocationMappingSyncDtoExt extends BinCodeLocationMappingSyncDto{
	
	private static final long serialVersionUID = 1L;

	public BinCodeLocationMappingSyncDtoExt() {
		
	}
	
	public BinCodeLocationMappingSyncDtoExt(BinCodeLocationMappingDaoExt binCodeLocaitonMapping) {
		MapperUtil.getObjectMapping(binCodeLocaitonMapping, this);
		this.setBin(binCodeLocaitonMapping.getBin().getId());
	}
	
	public List<BinCodeLocationMappingSyncDtoExt> getSyncDtoExtList (List<BinCodeLocationMappingDaoExt> daoExtList){
		List<BinCodeLocationMappingSyncDtoExt> dtoExtList = new ArrayList<>();
		for(BinCodeLocationMappingDaoExt daoExt : daoExtList) {
			BinCodeLocationMappingSyncDtoExt dtoExt = new BinCodeLocationMappingSyncDtoExt(daoExt);
			dtoExtList.add(dtoExt);
		}
		return dtoExtList;
	}
}
