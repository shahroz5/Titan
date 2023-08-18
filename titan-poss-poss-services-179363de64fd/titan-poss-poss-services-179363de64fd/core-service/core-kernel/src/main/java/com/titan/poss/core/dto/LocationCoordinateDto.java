/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
public class LocationCoordinateDto 
{
	
	 String locationCode;
	
	 BigDecimal latitude;
	
	 BigDecimal longitude;
	 
	 @Column(name = "store_details", columnDefinition = "NVARCHAR")
	 private String storeDetails;
	 
	 @Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;
	 
	 private String townName;
	
	 private String stateName;
	 
	 private StoreDetails storeDetailsDao;

	public LocationCoordinateDto(String locationCode, BigDecimal latitude, BigDecimal longitude, String storeDetails,
			String description, String townName, String stateName) {
		super();
		this.locationCode = locationCode;
		this.latitude = latitude;
		this.longitude = longitude;
		this.storeDetails = storeDetails;
		this.description = description;
		this.townName = townName;
		this.stateName = stateName;
	}




}
