/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import com.titan.poss.config.dao.DiscountDaoExt;
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
public class DiscountSyncDtoExt extends DiscountSyncDto {

	public DiscountSyncDtoExt() {

	}

	public DiscountSyncDtoExt(DiscountDaoExt discount) {

		MapperUtil.getObjectMapping(discount, this);

//		if (discount.getDiscountDao() != null) {
//			this.setDiscount(discount.getDiscountDao().getId());
//		} else {
//			this.setDiscount(null);
//		}
	}
}
