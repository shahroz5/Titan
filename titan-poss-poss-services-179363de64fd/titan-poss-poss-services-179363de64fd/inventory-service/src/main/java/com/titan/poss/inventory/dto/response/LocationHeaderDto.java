/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationHeaderDto {
	private String locationCode;

	private String brandCode;

	private Integer townCode;

	private Integer stateCode;

	private String regionCode;

	private String locationTypeCode;

	private Boolean isActive;

	private String address;

	private String phoneNo;

	private String contactNo;

	private String description;

	private String companyName;

	private String marketCode;

}
