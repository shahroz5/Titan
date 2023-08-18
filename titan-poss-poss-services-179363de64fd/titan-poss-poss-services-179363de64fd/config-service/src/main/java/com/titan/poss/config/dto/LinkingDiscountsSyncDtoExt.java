/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.config.dao.LinkingDiscountsDaoExt;
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
public class LinkingDiscountsSyncDtoExt extends LinkingDiscountsSyncDto {

	public LinkingDiscountsSyncDtoExt() {

	}

	public LinkingDiscountsSyncDtoExt(LinkingDiscountsDaoExt linkingDiscountsDaoExt) {

		MapperUtil.getObjectMapping(linkingDiscountsDaoExt, this);
		if (linkingDiscountsDaoExt.getSrcDiscountId() != null)
			this.setSrcDiscountId(linkingDiscountsDaoExt.getSrcDiscountId().getId());
		else
			this.setSrcDiscountId(null);
		if (linkingDiscountsDaoExt.getDestDiscountId() != null)
			this.setDestDiscountId(linkingDiscountsDaoExt.getDestDiscountId().getId());
		else
			this.setDestDiscountId(null);
	}

	public List<LinkingDiscountsSyncDtoExt> getSyncDtoExts(List<LinkingDiscountsDaoExt> daoExts) {
		List<LinkingDiscountsSyncDtoExt> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			LinkingDiscountsSyncDtoExt dtoExt = new LinkingDiscountsSyncDtoExt(dao);
			syncDtoExts.add(dtoExt);
		});
		return syncDtoExts;

	}
}
