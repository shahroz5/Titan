package com.titan.poss.payment.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.BaseEmployeePaymentConfigDto;
import com.titan.poss.core.dto.EmployeeLoanConfirmRequestDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dao.EmployeePaymentConfigDao;

@Service("EmployeeLoanService")
public interface EmployeeLoanConfigService {

	PagedRestResponse<List<BaseEmployeePaymentConfigDto>> getEmployeeConfigDetails(Pageable pageable);
	
	
	EmployeePaymentDtoExt updateEmployeeLoanDetails(EmployeeLoanConfirmRequestDto employeeLoanConfirmRequestDto);
	
	void deleteEmployeeLoanDetails(String employeeId);
	
	EmployeePaymentDtoExt getEmployeeLoanConfigDetails(String employeeCode,String buissnessDate,String locationCode);
}
