package com.titan.poss.payment.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.dto.BaseEmployeePaymentConfigDto;
import com.titan.poss.core.dto.EmployeeLoanConfirmRequestDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.service.EmployeeLoanConfigService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

@Validated
@RestController("paymentEmployeeLoanController")
@RequestMapping("payment/v2/employee-loan")
public class EmployeeLoanController {

	private static final String EMPLOYEE_LOAN_VIEW_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.EMPLOYEE_LOAN_VIEW + "' )";

	private static final String EMPLOYEE_LOAN_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ ConfigAccessControls.EMPLOYEE_LOAN_ADD_EDIT + "' )";
	
	@Autowired
	private EmployeeLoanConfigService employeeLoanService;

	@ApiOperation(value = "View the list of Employee Payment Config details", notes = "This API returns the list of Employee Loan Payment Configuration Details.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(EMPLOYEE_LOAN_VIEW_PERMISSION)
	public PagedRestResponse<List<BaseEmployeePaymentConfigDto>> listEmployeeDetails(@ApiIgnore Pageable pageable) {
		return employeeLoanService.getEmployeeConfigDetails(pageable);
	}

	@ApiOperation(value = "This API will update employee loan details based on the approved amount")
	@PostMapping("/update-loan-details")
	@PreAuthorize(EMPLOYEE_LOAN_ADD_EDIT_PERMISSION)
	public EmployeePaymentDtoExt updateEmployeeLoanRedemptionDetails(
			@RequestBody @Valid EmployeeLoanConfirmRequestDto employeeLoanConfirmRequestDto) {
		return employeeLoanService.updateEmployeeLoanDetails(employeeLoanConfirmRequestDto);
	}

	@ApiOperation(value = "This API will delete employee loan details based on the employeeID")
	@PostMapping("/delete-loan-details")
	@PreAuthorize(EMPLOYEE_LOAN_ADD_EDIT_PERMISSION)
	public void deleteEmployeeLoanDetails(@RequestParam(required = true) String employeeId) {
		employeeLoanService.deleteEmployeeLoanDetails(employeeId);
	}
	
	@PostMapping(value = "/fetch-config-details")
	@ApiOperation(value = "This Method will validate and return employee config details based on the employee code ", notes = "This Method will validate and return employee config details based on the employee code.")
	public EmployeePaymentDtoExt getEmployeeLoanConfigDetails(
			@RequestParam(required = true, value = "employeeCode") String employeeCode,
			@RequestParam(required = true, value = "buissnessDate") String buissnessDate,
			@RequestParam(required = true, value = "locationCode") String locationCode) {
		return employeeLoanService.getEmployeeLoanConfigDetails(employeeCode,buissnessDate,locationCode);

	}
}
