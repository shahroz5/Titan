package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * DTO class for request structure of stock Request
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class ServiceMetalRequestDto {
	
	private String location_code; 
	
	private String metal_type; 
	
	private BigDecimal metal_rate;
	
	private String price_type;
	
	private Long updated_date;
	
	private String updated_by;
	

}
