/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.EmployeeRoleMappingDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDaoExt;
import com.titan.poss.user.dto.sync.EmployeeRoleMappingSyncDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class EmployeeRoleMappingSyncDtoExt extends EmployeeRoleMappingSyncDto {

	private static final long serialVersionUID = 1L;

	public EmployeeRoleMappingSyncDtoExt() {

	}

	public EmployeeRoleMappingSyncDtoExt(EmployeeRoleMappingDaoExt employeeRoleMappingDao) {
		MapperUtil.getObjectMapping(employeeRoleMappingDao, this);
		this.setEmployee(employeeRoleMappingDao.getEmployee().getEmployeeCode());
		this.setRole(employeeRoleMappingDao.getRole().getRoleCode());
	}
	
	public EmployeeRoleMappingSyncDtoExt(EmployeeRoleMappingDao employeeRoleMappingDao) {
		MapperUtil.getObjectMapping(employeeRoleMappingDao, this);
		this.setEmployee(employeeRoleMappingDao.getEmployee().getEmployeeCode());
		this.setRole(employeeRoleMappingDao.getRole().getRoleCode());
	}

	public List<EmployeeRoleMappingSyncDtoExt> getSyncDtoList(List<EmployeeRoleMappingDaoExt> daoList) {
		List<EmployeeRoleMappingSyncDtoExt> syncDtoList = new ArrayList<>();
		for (EmployeeRoleMappingDaoExt employeeRoleMappingDao : daoList) {
			EmployeeRoleMappingSyncDtoExt employeeRoleMappingSyncDto = new EmployeeRoleMappingSyncDtoExt(
					employeeRoleMappingDao);
			syncDtoList.add(employeeRoleMappingSyncDto);
		}
		return syncDtoList;
	}
}
