/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto.sync;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.MasterTimeSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.EmployeeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class EmployeeSyncDto extends MasterTimeSyncableEntity {

	private String employeeCode;

	private String empName;

	private String address;

	private Date joiningDate;

	private Date resignationDate;

	private Date birthDate;

	private String emailId;

	private String mobileNo;

	private String locationCode;

	private String regionCode;

	private String orgCode;

	private String brandCode;

	private String userType;

	private Boolean hasLoginAccess;

	private Boolean forcePasswordChange;

	private String employeeType;

	private String createdBy;

	private String lastModifiedBy;

	public EmployeeSyncDto() {

	}

	public EmployeeSyncDto(EmployeeDao employeeDao) {
		MapperUtil.getObjectMapping(employeeDao, this);
	}

	public EmployeeDao getEmployeeDao(EmployeeSyncDto employeeSyncDto) {
		return (EmployeeDao) MapperUtil.getObjectMapping(employeeSyncDto, new EmployeeDao());
	}
	
	public List<EmployeeDao> getEmployeeDaoList(List<EmployeeSyncDto> employeeSyncDto) {
		List<EmployeeDao> daoList=new ArrayList<>();
		employeeSyncDto.forEach(syncDto->daoList.add(getEmployeeDao(syncDto)));
		return daoList;
	}
}
