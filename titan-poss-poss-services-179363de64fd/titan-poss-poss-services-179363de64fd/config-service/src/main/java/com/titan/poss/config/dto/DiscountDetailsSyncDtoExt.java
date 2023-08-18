/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.DiscountDetailsDaoExt;
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
public class DiscountDetailsSyncDtoExt extends DiscountDetailsSyncDto {

	public DiscountDetailsSyncDtoExt() {

	}

	public DiscountDetailsSyncDtoExt(DiscountDetailsDaoExt discountDetailsDaoExt) {

		MapperUtil.getObjectMapping(discountDetailsDaoExt, this);

		if (discountDetailsDaoExt.getDiscount() != null) {
			this.setDiscount(discountDetailsDaoExt.getDiscount().getId());
		} else {
			this.setDiscount(null);
		}
	}

	public List<DiscountDetailsSyncDtoExt> getSyncDtoExtList(List<DiscountDetailsDaoExt> daoExts) {
		List<DiscountDetailsSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			DiscountDetailsSyncDtoExt syncDtoExt = new DiscountDetailsSyncDtoExt(dao);
			syncDtoExts.add(syncDtoExt);
		});
		return syncDtoExts;

	}
}
