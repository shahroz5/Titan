package com.titan.poss.core.dto;

import com.titan.poss.core.response.JsonData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailIdValidationResponseDto {
	
	private String emailId;
	
	private Boolean validationStatus;
	
	private String invalidationReason;

}
