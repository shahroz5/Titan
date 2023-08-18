/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request.json;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Valid
public class AddressData {

	@NotNull(message = "address1 cannot be null")
	@NotBlank(message = "address1 cannot be empty")
	String address1;

	@NotNull(message = "address2 cannot be null")
	@NotBlank(message = "address2 cannot be empty")
	String address2;

	@NotNull(message = "city cannot be null")
	@NotBlank(message = "city cannot be empty")
	String city;

	@NotNull(message = "town cannot be null")
	@NotBlank(message = "town cannot be empty")
	String town;

	@NotNull(message = "pincode cannot be null")
	@NotBlank(message = "pincode cannot be empty")
	String pincode;

}
