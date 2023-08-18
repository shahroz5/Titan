/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO for requested item available location details at stock request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ItemLocationDto {

	private String locationCode;

	private String phoneNo;

	private String contactNo;

	private String address;

	private String description;





	public ItemLocationDto(String locationCode, String phoneNo, String contactNo, String address, String description) {
		super();
		this.locationCode = locationCode;
		this.phoneNo = phoneNo;
		this.contactNo = contactNo;
		this.address = address;
		this.description = description;
	}





	public ItemLocationDto() {
		super();
	}


}
