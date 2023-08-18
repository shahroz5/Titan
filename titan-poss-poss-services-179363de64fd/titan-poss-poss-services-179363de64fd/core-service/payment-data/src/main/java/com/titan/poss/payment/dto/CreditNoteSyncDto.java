/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.CreditNoteMasterDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CreditNoteSyncDto extends MasterSyncableEntity {

	private String creditNoteType;

	private String description;

	private String configDetails;

	private Boolean isActive;

	public CreditNoteSyncDto() {

	}

	public CreditNoteSyncDto(CreditNoteMasterDao creditNoteMasterDao) {
		MapperUtil.getObjectMapping(creditNoteMasterDao, this);
	}

	public CreditNoteMasterDao getCreditNoteMasterDao(CreditNoteSyncDto creditNoteSyncDto) {
		return (CreditNoteMasterDao) MapperUtil.getObjectMapping(creditNoteSyncDto, new CreditNoteMasterDao());
	}

}
