package com.titan.poss.core.dto;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class EmployeePaymentDtoExt extends BaseEmployeePaymentConfigDto {

	private List<String> productGroupCodes;
	
	private List<String> locationCode;
	
	private String customerId;
	
}
