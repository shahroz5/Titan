/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RuleProductResponseDto {

	private Integer configId;

	private String configType;

	private String productGroupCode;

	private String productCategoryCode;

}
