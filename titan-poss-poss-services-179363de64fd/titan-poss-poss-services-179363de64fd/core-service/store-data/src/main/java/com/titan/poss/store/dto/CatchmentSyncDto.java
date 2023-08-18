/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.store.dao.CatchmentDao;
import com.titan.poss.store.dao.CatchmentId;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CatchmentSyncDto extends MasterSyncableEntity {

	private CatchmentId catchmentId;

	private String description;
	
	private Boolean isEditable;

	public CatchmentSyncDto() {
	}

	public CatchmentSyncDto(CatchmentDao catchmentDao) {
		MapperUtil.getObjectMapping(catchmentDao, this);
		CatchmentId ctchmentId = new CatchmentId();
		ctchmentId.setCatchmentCode(catchmentDao.getCatchmentId().getCatchmentCode());
		ctchmentId.setLocationCode(catchmentDao.getCatchmentId().getLocationCode());
		this.setCatchmentId(ctchmentId);
	}

	public CatchmentDao getCatchmentDao(CatchmentSyncDto catchmentSyncDto) {
		CatchmentDao ctchmentDao = new CatchmentDao();
		ctchmentDao = (CatchmentDao) MapperUtil.getObjectMapping(catchmentSyncDto, ctchmentDao);
		CatchmentId ctchmentId = new CatchmentId();
		ctchmentId.setCatchmentCode(catchmentSyncDto.getCatchmentId().getCatchmentCode());
		ctchmentId.setLocationCode(catchmentSyncDto.getCatchmentId().getLocationCode());
		ctchmentDao.setCatchmentId(ctchmentId);
		return ctchmentDao;
	}
}
