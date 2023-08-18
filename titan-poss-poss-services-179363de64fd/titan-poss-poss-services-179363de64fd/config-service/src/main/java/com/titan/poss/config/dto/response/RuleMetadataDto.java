/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RuleMetadataDto {
	private Integer configId;
	@NotNull
	@NotBlank
	private String configType;
	private String description;
	private String configGroup;
	private Boolean productGroupMapping;
	private Boolean productCategoryMapping;
	private Boolean valueMapping;
	private Boolean rangeMapping;
	private Boolean locationMapping;
	private String orgCode;

}
