/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.Date;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.BusinessDayDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BusinessDaySyncDto extends SyncableEntity{

	private String id;
	
	private String locationCode;

	private String status;
	
	private Date businessDate;
	
	private Integer fiscalYear;
	
	private Boolean skipBanking;

	private String remarks;
	
	private Boolean isGHSBODDone;
	
	private Boolean isGHSEODDone;
	
	private Short rateFetchAttempts;
	
	private Boolean isGHSFileUploaded;
	
	private Boolean isServiceFileUploaded;
	
	public BusinessDayDao getBusinessDayDao(BusinessDaySyncDto syncDto) {
		return (BusinessDayDao)MapperUtil.getObjectMapping(syncDto, new BusinessDayDao());
	}
}
