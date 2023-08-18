/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.Date;

import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class FocSchemeMasterSyncDto extends MasterSyncableEntity {

	private String id;
	
	private String name;

	private String description;

	private String grnConfig;

	private String tepConfig;

	private String orderConfig;

	private String clubbingConfig;

	private Boolean manualFoc;

	private Date publishTime;

	private Boolean isPublishPending;
	
	private Boolean isAccrualUlp;

	public FocSchemeMasterDao getFocSchemeMasterDao(FocSchemeMasterSyncDto focSchemeMasterSyncDto) {
		FocSchemeMasterDao focSchemeMasterDao = new FocSchemeMasterDao();
		focSchemeMasterDao = (FocSchemeMasterDao) MapperUtil.getObjectMapping(focSchemeMasterSyncDto,
				focSchemeMasterDao);
		return focSchemeMasterDao;
	}
}
