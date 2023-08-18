/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto.sync;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDao;
import com.titan.poss.user.dao.RoleDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class EmployeeRoleMappingSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String role;

	private String employee;

	private String id;

	private Boolean isPrimary;

	private Date startDate;

	private Date expiryDate;

	public EmployeeRoleMappingDao getEmployeeRoleMappingDao(EmployeeRoleMappingSyncDto employeeRoleMappingSyncDto) {
		EmployeeRoleMappingDao employeeRoleMappingDao = new EmployeeRoleMappingDao();

		employeeRoleMappingDao = (EmployeeRoleMappingDao) MapperUtil.getObjectMapping(employeeRoleMappingSyncDto,
				employeeRoleMappingDao);

		EmployeeDao employeeDao = new EmployeeDao();
		employeeDao.setEmployeeCode(employeeRoleMappingSyncDto.getEmployee());

		employeeRoleMappingDao.setEmployee(employeeDao);

		RoleDao roleDao = new RoleDao();
		roleDao.setRoleCode(employeeRoleMappingSyncDto.getRole());

		employeeRoleMappingDao.setRole(roleDao);

		return employeeRoleMappingDao;

	}

	public List<EmployeeRoleMappingDao> getDaoList(List<EmployeeRoleMappingSyncDto> syncDtoList) {
		List<EmployeeRoleMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			EmployeeRoleMappingSyncDto dto = new EmployeeRoleMappingSyncDto();
			daoList.add(dto.getEmployeeRoleMappingDao(syncDto));
		});

		return daoList;
	}
}
