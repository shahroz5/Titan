/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GepAndItemDetailsResponseDto extends GepResponseDto {

	private GepItemDetailsDto itemDetails;
	private Boolean isHallmarking;
}
