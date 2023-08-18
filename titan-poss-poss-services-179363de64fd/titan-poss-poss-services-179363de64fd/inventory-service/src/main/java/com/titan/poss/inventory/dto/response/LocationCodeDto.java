/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.dto.response;


import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LocationCodeDto {

	private String locationCode;

	private Boolean isActive;





	public LocationCodeDto(String locationCode, Boolean isActive) {

		this.locationCode = locationCode;
		this.isActive = isActive;

	}

}
