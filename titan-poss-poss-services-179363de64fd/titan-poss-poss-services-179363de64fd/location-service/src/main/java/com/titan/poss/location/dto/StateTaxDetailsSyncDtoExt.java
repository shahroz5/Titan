/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.StateTaxDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StateTaxDetailsSyncDtoExt extends StateTaxDetailsSyncDto {

	public StateTaxDetailsSyncDtoExt() {

	}

	public StateTaxDetailsSyncDtoExt(StateTaxDetailsDaoExt stateTaxDetailsDaoExt) {
		MapperUtil.getObjectMapping(stateTaxDetailsDaoExt, this);
		this.setStateTaxMappingId(stateTaxDetailsDaoExt.getStateTaxMappingId().getId());
		this.setTaxClassCode(stateTaxDetailsDaoExt.getTaxClassCode().getTaxClassCode());
	}

	public List<StateTaxDetailsSyncDtoExt> getSyncDtoList(List<StateTaxDetailsDaoExt> daoList) {
		List<StateTaxDetailsSyncDtoExt> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			StateTaxDetailsSyncDtoExt stateTaxMappingSyncDtoExt = new StateTaxDetailsSyncDtoExt(dao);
			syncDtoList.add(stateTaxMappingSyncDtoExt);
		});

		return syncDtoList;
	}

}
