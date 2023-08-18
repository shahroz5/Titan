/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.PaymentReversalDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentReversalSyncDtoExt extends PaymentReversalSyncDto {
	public PaymentReversalSyncDtoExt() {

	}

	public PaymentReversalSyncDtoExt(PaymentReversalDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if (daoExt.getCancel() != null)
			this.setCancel(daoExt.getCancel().getId());
		if(daoExt.getSalesTxn()!=null)
			this.setSalesTxn(daoExt.getSalesTxn().getId());
		if(daoExt.getCreditNote() != null)
			this.setCreditNote(daoExt.getCreditNote().getId());
	}
}
