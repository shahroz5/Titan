/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.request.json;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Valid
public class HandCarryEmployeeData {

	@NotNull(message = "Employee Id cannot be null")
	@NotBlank(message = "Employee Id cannot be empty")
	String employeeId;

	@NotNull(message = "Employee Name cannot be null")
	@NotBlank(message = "Employee Name cannot be empty")
	String employeeName;

	@NotNull(message = "Mobile No cannot be null")
	@NotBlank(message = "Mobile No cannot be empty")
	@Size(min = 10, max = 10, message = "Mobile no should be 10 digit")
	String mobileNo;

	@PositiveOrZero(message = "Number of boxes should be greater than 0")
	Integer numberOfBoxes;

	@Valid
	List<BoxDetails> boxDetails;
}
