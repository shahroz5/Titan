package com.titan.poss.file.service;


import com.titan.poss.file.dto.EmployeeLoanConfigWriterDto;


public interface EmployeeLoanValidationService {

	boolean dataValidation(EmployeeLoanConfigWriterDto item);
	
}
