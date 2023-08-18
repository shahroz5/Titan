package com.titan.poss.integration.dto;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ServicePossVendorDetailsDto {
	
    private String username;
	
	private String password;
	
    private String getCashByCustomer;
    
    private String getEODRevenueByDate;
	
	private String getRevenueByDate;
	
	private String getUpdateBtqMetalRate;
	
	
}
