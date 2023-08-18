/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LovTypeDto implements Comparable<LovTypeDto> {

	private String lovTypeCode;
	private String lovTypeName;
	private String baseServicePath;

	@Override
	public int compareTo(LovTypeDto lov) {
		return this.getLovTypeName().compareTo(lov.getLovTypeName());
	}

}
