/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class GVDetailsUpdateReqDto extends GVDetailsReqDto {
	private String status;
	private String redeemedLocationCode;
	private Integer cmNo;
}
