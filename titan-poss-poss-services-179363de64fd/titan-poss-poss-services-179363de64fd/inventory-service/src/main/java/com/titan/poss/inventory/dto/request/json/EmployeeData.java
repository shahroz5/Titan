/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request.json;

import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Valid
public class EmployeeData {

	@NotNull(message = "Employee Id cannot be null")
	@NotBlank(message = "Employee Id cannot be empty")
	String employeeId;

	@NotNull(message = "Employee Name cannot be null")
	@NotBlank(message = "Employee Name cannot be empty")
	String employeeName;

	@NotNull(message = "Designation cannot be null")
	@NotBlank(message = "Designation cannot be empty")
	String designation;

	@NotNull(message = "Email Id cannot be null")
	@NotBlank(message = "Email Id cannot be empty")
	@Email(message = "Invalid email id")
	String emailId;

	@NotNull(message = "Mobile No cannot be null")
	@NotEmpty(message = "Mobile No cannot be empty")
	@Size(min = 10, max = 10, message = "Mobile no should be 10 digit")
	String mobileNo;

	@NotNull(message = "Brand cannot be null")
	@NotBlank(message = "Brand cannot be empty")
	String brand;

}
