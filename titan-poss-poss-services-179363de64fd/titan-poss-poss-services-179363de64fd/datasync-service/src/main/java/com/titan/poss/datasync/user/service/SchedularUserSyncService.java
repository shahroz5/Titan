/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.user.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDao;
import com.titan.poss.user.dao.UserLoginDao;
import com.titan.poss.user.repository.EmployeeRepository;
import com.titan.poss.user.repository.EmployeeRoleMappingRepository;
import com.titan.poss.user.repository.UserLoginRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class SchedularUserSyncService implements SyncOperation{
	
	@Autowired
	private SchedularUserSyncService schedularSyncService;
	
	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private UserCommonUtil userCommonUtil;
	
	@Autowired
	private EmployeeRepository employeeRepo;

	@Autowired
	private EmployeeRoleMappingRepository employeeRoleRepo;
	
	@Autowired
	private UserLoginRepository userLoginRepo;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SchedularUserSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
				Boolean flag = syncService(syncDataList);
				if (Boolean.TRUE.equals(flag)) {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
				} else {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
				}
			
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
		
	}

	private Boolean syncService(List<SyncData> syncDataList) {
		ObjectMapper mapper = new ObjectMapper();
		List<EmployeeDao> employeesToDeactivate=new ArrayList<>();
		List<EmployeeRoleMappingDao> employeeRoleMappingList=new ArrayList<>();
		List<UserLoginDao> userLoginList=new ArrayList<>();
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				userCommonUtil.syncEmployeeDao(data,employeesToDeactivate,mapper);
			} else if (data.getOrder() == 2) {
				userCommonUtil.syncEmployeeRoleMappingDao(data, employeeRoleMappingList, mapper);
			} else if (data.getOrder() == 1) {
				userCommonUtil.syncUserLoginDao(data,userLoginList, mapper);
			}
		}
		return schedularSyncService.dbOperation(employeesToDeactivate,employeeRoleMappingList,userLoginList);
	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(List<EmployeeDao> employeesToDeactivate,
			List<EmployeeRoleMappingDao> employeeRoleMappingList,
			List<UserLoginDao> userLoginList) {
		Boolean flag=false;
		if(!employeeRoleMappingList.isEmpty()) {
			employeeRoleRepo.deleteAll(employeeRoleMappingList);
			flag=true;
		}
		if(!employeesToDeactivate.isEmpty()) {
			employeeRepo.saveAll(employeesToDeactivate);
			flag=true;
		}
		if(!userLoginList.isEmpty()) {
			userLoginRepo.saveAll(userLoginList);
			flag=true;
		}
		return flag;
	}

}
