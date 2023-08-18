/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dao.base;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.MasterTimeSyncableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/*
* The persistent class baseEmployeeMaster for the employee_master database table.
*/
@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BaseEmployee extends MasterTimeSyncableEntity {

	@Id
	@Column(name = "employee_code", unique = true, nullable = false, length = 20)
	private String employeeCode;

	@Column(name = "emp_name", length = 50)
	private String empName;

	@Column(name = "address", columnDefinition = "NVARCHAR")
	private String address;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "joining_date", length = 23)
	private Date joiningDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "resignation_date", length = 23)
	private Date resignationDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "birth_date", length = 23)
	private Date birthDate;

	@Column(name = "email_id", columnDefinition = "NVARCHAR", unique = true, nullable = false)
	private String emailId;

	@Column(name = "mobile_no", length = 20, unique = true, nullable = false)
	private String mobileNo;

	@Column(name = "location_code", nullable = true, length = 20)
	private String locationCode;

	@Column(name = "region_code", nullable = true, length = 20)
	private String regionCode;

	@Column(name = "org_code", nullable = true, length = 20)
	private String orgCode;

	@Column(name = "brand_code", nullable = true, length = 20)
	private String brandCode;

	@Column(name = "user_type", nullable = false)
	private String userType;

	@Column(name = "has_login_access", nullable = false)
	private Boolean hasLoginAccess;

	@Column(name = "force_password_change", nullable = false)
	private Boolean forcePasswordChange;

	@Column(name = "employee_type", nullable = false)
	private String employeeType;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "last_modified_by")
	private String lastModifiedBy;
	
	@Column(name = "digital_signature")
	private String digitalSignature;

}
