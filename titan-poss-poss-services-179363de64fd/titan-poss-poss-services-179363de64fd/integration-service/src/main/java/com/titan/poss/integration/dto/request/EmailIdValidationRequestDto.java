package com.titan.poss.integration.dto.request;


import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EmailIdValidationRequestDto {
	
	private String vendorCode;

	private String emailId;
	
	private String verificationType;

}
