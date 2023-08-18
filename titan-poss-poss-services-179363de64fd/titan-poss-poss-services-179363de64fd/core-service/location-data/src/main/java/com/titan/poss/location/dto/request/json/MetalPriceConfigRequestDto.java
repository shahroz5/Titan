/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto.request.json;

import java.util.Date;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class MetalPriceConfigRequestDto {

	@NotNull(message = "applicableDate can not be null")
	private Date applicableDate;

}
