/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.SalesDocDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SalesDocSyncDto extends MasterSyncableEntity{
	
	private String id;
	
	private Integer docNo;

	private String docType;

	private Short fiscalYear;

	private String locationCode;
	
	public SalesDocDao getSalesDocDao(SalesDocSyncDto syncDto) {
		return (SalesDocDao)MapperUtil.getObjectMapping(syncDto, new SalesDocDao());
	}
	
	

}
