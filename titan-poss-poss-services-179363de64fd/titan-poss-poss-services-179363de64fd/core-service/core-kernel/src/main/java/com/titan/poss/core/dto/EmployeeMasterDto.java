package com.titan.poss.core.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeMasterDto {
	
	private String employeeCode;
	
	private String employeeName;
	
	private String emailId;
	
	private String mobileNo;
	
	private String locationCode;
	
	private String orgCode;
	
	private String userType;
	
	private Boolean hasLoginAccess;
	
	private Boolean isActive;
	
	private String createdBy;
	
	private Long createdDate;
	
	private String lastModifiedBy;
	
	private Long lastModifiedDate;
	
	private String employeeType;
	
	private String roleCode;
	
	private String description;
	
	private Long startDate;
	
	private Long expiryDate;
	
	private Boolean isPrimary;
	

}
