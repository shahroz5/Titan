/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.ClubbingDiscountsDaoExt;
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
public class ClubbingDiscountsSyncDtoExt extends ClubbingDiscountsSyncDto {

	private static final long serialVersionUID = 1L;

	public ClubbingDiscountsSyncDtoExt() {

	}

	public ClubbingDiscountsSyncDtoExt(ClubbingDiscountsDaoExt clubbingDiscountsDaoExt) {

		MapperUtil.getObjectMapping(clubbingDiscountsDaoExt, this);
		if (clubbingDiscountsDaoExt.getDiscount1() != null)
			this.setDiscount1(clubbingDiscountsDaoExt.getDiscount1().getId());
		else
			this.setDiscount1(null);
		if (clubbingDiscountsDaoExt.getDiscount2() != null)
			this.setDiscount2(clubbingDiscountsDaoExt.getDiscount2().getId());
		else
			this.setDiscount2(null);
		if (clubbingDiscountsDaoExt.getDiscount3() != null)
			this.setDiscount3(clubbingDiscountsDaoExt.getDiscount3().getId());
		else
			this.setDiscount3(null);
	}

	public List<ClubbingDiscountsSyncDtoExt> getSyncDtoExts(List<ClubbingDiscountsDaoExt> daoExts) {
		List<ClubbingDiscountsSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			ClubbingDiscountsSyncDtoExt dtoExt = new ClubbingDiscountsSyncDtoExt(dao);
			syncDtoExts.add(dtoExt);
		});
		return syncDtoExts;

	}

}
