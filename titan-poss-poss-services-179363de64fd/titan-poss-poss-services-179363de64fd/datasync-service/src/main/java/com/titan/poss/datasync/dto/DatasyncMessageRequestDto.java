/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class DatasyncMessageRequestDto extends DatasyncStatusRequestDto {
	@NotNull(message = "status code can not be null")
	private MessageRequestStatusEnum statusCode;

}
