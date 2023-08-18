/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.response;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.utils.MapperUtil;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JsonData {

	@NotNull
	private String type;

	@NotNull
	private Object data;

	@Override
	public String toString() {
		return MapperUtil.getStringFromJson(this);
	}

}
