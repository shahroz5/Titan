package com.titan.poss.sales.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class EmailValidationResponseDto {
	private String emailId;
	private Boolean validationStatus;
	private String invalidationReason;
}
