/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class RequestSearchDto {

	@NotEmpty(message = "reqItems can not be empty")
	List<@Valid RequestItemSearchDto> reqItems;
}
