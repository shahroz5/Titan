package com.titan.poss.integration.dto.request;


import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class PanDocRequestDto {

	private String vendorCode;

	private String panNumber;
	
	private String verificationType;

}
