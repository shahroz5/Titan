/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
public class OtherRequestItemsCreateDto {

	@Size(max = 50)
	@NotNull
	private List<@Valid OtherRequestItemCreateDto> stockItems;
}
