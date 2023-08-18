package com.titan.poss.sales.dto;

import javax.validation.constraints.NotNull;

import com.titan.poss.sales.dto.validators.BasePaymentFieldsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper = false)
public class EmployeeLoanOtherDetailsDto extends BasePaymentFieldsDto {

	@NotNull(message = "Please provide employee code")
	String employeeCode;
	
	@NotNull(message = "Please provide OTP")
	String Otp; 
	
	
}
