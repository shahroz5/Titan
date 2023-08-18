/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.PincodeDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PincodeSyncDtoExt extends PincodeSyncDto {

	public PincodeSyncDtoExt() {

	}

	public PincodeSyncDtoExt(PincodeDaoExt pincode) {
		MapperUtil.getObjectMapping(pincode, this);
		this.setCountry(pincode.getCountry().getCountryCode());
	}
}
