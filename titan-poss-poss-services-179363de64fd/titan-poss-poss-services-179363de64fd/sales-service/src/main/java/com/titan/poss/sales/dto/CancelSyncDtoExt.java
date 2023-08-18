/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CancelDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CancelSyncDtoExt extends CancelSyncDto{
 public CancelSyncDtoExt() {}
 public CancelSyncDtoExt(CancelDaoExt extDao) {
	 MapperUtil.getObjectMapping(extDao,this);
	 this.setRefSalesTxn(extDao.getRefSalesTxn().getId());
 }
 
}
