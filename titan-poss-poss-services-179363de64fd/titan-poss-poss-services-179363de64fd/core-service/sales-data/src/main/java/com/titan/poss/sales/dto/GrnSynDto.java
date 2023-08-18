/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;


import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.GrnDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GrnSynDto extends SyncableEntity{
	
	private String metalRateDetails;

	private String srcLocationCode;
	
	private String id;

	private String cancel;
	
	private BigDecimal focRecoverValue;

	private Boolean isMigrated;
	
	private BigDecimal roundingVariance;


	
	public GrnDao getGrnDao(GrnSynDto syncDto) {
		GrnDao grnDao=(GrnDao)MapperUtil.getObjectMapping(syncDto, new GrnDao());
		if(syncDto.getCancel()!=null) {
			CancelDao canclDao=new CancelDao();
			canclDao.setId(syncDto.getCancel());
			grnDao.setCancel(canclDao);
		}
		return grnDao;
	}
}
