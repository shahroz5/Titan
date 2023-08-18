/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.StateTaxDetailsDao;
import com.titan.poss.location.dao.StateTaxMappingDao;
import com.titan.poss.location.dao.TaxClassDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class StateTaxDetailsSyncDto extends SyncableEntity {

	private String id;

	private String stateTaxMappingId;

	private String taxClassCode;

	private String taxDetails;

	public StateTaxDetailsDao getStateTaxDetailsDao(StateTaxDetailsSyncDto stateTaxDetailsSyncDto) {
		StateTaxDetailsDao stateTaxDetailsDao = (StateTaxDetailsDao) MapperUtil.getObjectMapping(stateTaxDetailsSyncDto,
				new StateTaxDetailsDao());

		StateTaxMappingDao stateTaxMappingDao = new StateTaxMappingDao();
		stateTaxMappingDao.setId(stateTaxDetailsSyncDto.getStateTaxMappingId());

		stateTaxDetailsDao.setStateTaxMappingId(stateTaxMappingDao);
		if (stateTaxDetailsSyncDto.getTaxDetails() != null)
			stateTaxDetailsDao.setTaxDetails(stateTaxDetailsSyncDto.getTaxDetails());
		else
			stateTaxDetailsDao.setTaxDetails("{}");
		TaxClassDao taxClassDao = new TaxClassDao();
		taxClassDao.setTaxClassCode(stateTaxDetailsSyncDto.getTaxClassCode());

		stateTaxDetailsDao.setTaxClassCode(taxClassDao);

		return stateTaxDetailsDao;
	}

	public List<StateTaxDetailsDao> getDaoList(List<StateTaxDetailsSyncDto> syncDtoList) {
		List<StateTaxDetailsDao> daoList = new ArrayList<>();
		for (StateTaxDetailsSyncDto syc : syncDtoList) {
			StateTaxDetailsSyncDto stateTaxDetailsSyncDto = new StateTaxDetailsSyncDto();
			daoList.add(stateTaxDetailsSyncDto.getStateTaxDetailsDao(syc));
		}
		return daoList;
	}

}
