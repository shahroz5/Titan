/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class FocSchemeProductMappingDto {

	private String id;
	private String schemeId;
	private String schemeDetailsId;

	private String productGroupCode;

	private String category;

	private String itemType;

}
