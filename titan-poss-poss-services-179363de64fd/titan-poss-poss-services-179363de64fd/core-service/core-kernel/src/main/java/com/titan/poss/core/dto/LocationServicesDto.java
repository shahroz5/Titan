package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode
public class LocationServicesDto {
	
	private String locationCode;
	
	private String description;

	private String locationTypeCode;
	
	private String marketCode;
	
	private String marketDescription;
	
    private String countryCode;
	
	private String countryDescription;

	private String regionCode;
	
	private String subRegionCode;
	
	private String townId;
	
	private String townDescription;
	
	private String stateId;
	
	private String stateDescription;
	
	private String stateCode;
	
	private String stateconfigDetails;
	
	private String ownerTypeCode;

	private String factoryCodeValue;
	
	private String cfaCodeValue;

	private String brandCode;
	
	private String subBrandCode;

	private Boolean isActive;
		  
    private String createdBy;
    
    private Long createdDate;
    
    private String lastModifiedBy;
    
    private Long lastModifiedDate;
  
	private String taxDetails;
	
	private String bankingDetails;

	private String storeDetails;
	
	

}
