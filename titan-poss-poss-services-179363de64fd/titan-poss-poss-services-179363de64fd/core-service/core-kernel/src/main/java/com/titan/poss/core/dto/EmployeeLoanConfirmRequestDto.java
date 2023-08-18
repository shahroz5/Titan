package com.titan.poss.core.dto;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class EmployeeLoanConfirmRequestDto {

	@NotNull(message = "Please provide id")
	private String id;
	
	@NotNull(message = "Please provide status")
	private String status;
	
	@NotNull(message = "Please enter redeemed amount greater than zero")
	private BigDecimal redeemedAmount;
	
}
