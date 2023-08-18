/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.dto.sync;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.TimeSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.UserLoginDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class UserLoginSyncDto extends TimeSyncableEntity {

	private String employee;

	private String userName;

	private String password;

	private Integer failedAttempts;

	private String salt;

	private Date passwordChangedDate;

	private Boolean isLocked;

	private Boolean isLoginActive;

	private Date lastLoginDate;

	private String createdBy;

	private String lastModifiedBy;

	private String passwordHistory;

	public UserLoginSyncDto() {

	}

	public UserLoginSyncDto(UserLoginDao userLoginDao) {
		MapperUtil.getObjectMapping(userLoginDao, this);
		this.setEmployee(userLoginDao.getEmployee().getEmployeeCode());
	}

	public UserLoginDao getUserLoginDao(UserLoginSyncDto userLoginSyncDto) {

		UserLoginDao userLoginDao = (UserLoginDao) MapperUtil.getObjectMapping(userLoginSyncDto, new UserLoginDao());

		EmployeeDao employeeDao = new EmployeeDao();
		employeeDao.setEmployeeCode(userLoginSyncDto.getEmployee());

		userLoginDao.setEmployee(employeeDao);

		return userLoginDao;
	}
	
	public List<UserLoginDao> getUserLoginDaoList(List<UserLoginSyncDto> userLoginSyncDtoList) {
		List<UserLoginDao> userDaoList=new ArrayList<>();
		userLoginSyncDtoList.forEach(sync->userDaoList.add(getUserLoginDao(sync)));
		return userDaoList;
	}

}
