/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for validate item.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidateItemDto {

	private String itemCode;
	private Boolean isItemCodeActive;
	private Object itemConfigDetails;
	private String productGroupCode;
	private Boolean isProductGroupActive;
	private Object productGroupConfigDetails;
	private String productCategoryCode;
	private Boolean isProductCategoryActive;

}
