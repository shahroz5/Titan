/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto.request.gc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.core.dto.GiftCardBaseActivateRequestDto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class GiftCardActivateRequestDto extends GiftCardBaseActivateRequestDto {

	@ApiModelProperty(position = 3, value = "Notes", name = "notes", example = "{ValType~GCACT}")
	private String notes;

	@JsonIgnore
	@ApiModelProperty(position = 6, value = "Idempotency Key", name = "idempotencyKey", example = "1234566")
	private String idempotencyKey;

}
