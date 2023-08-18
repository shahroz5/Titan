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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.UserOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDao;
import com.titan.poss.user.dao.UserLoginDao;
import com.titan.poss.user.dto.sync.EmployeeRoleMappingSyncDto;
import com.titan.poss.user.dto.sync.EmployeeSyncDto;
import com.titan.poss.user.dto.sync.UserLoginSyncDto;
import com.titan.poss.user.repository.EmployeeRepository;
import com.titan.poss.user.repository.EmployeeRoleMappingRepository;
import com.titan.poss.user.repository.UserLoginRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class UserSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	UserLoginRepository userLoginRepository;

	@Autowired
	EmployeeRepository employeeRepository;

	@Autowired
	EmployeeRoleMappingRepository empRoleMappingRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(UserSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDataList) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(UserOperationCodes.CHANGEPSWD)) {
				getUserLoginAndSave(syncData.getData(), syncData.getOrder());
			} else if (operationCode.equals(UserOperationCodes.VERIFYOTP)) {
				getData(syncData.getData(), syncData.getOrder());
			} else if (operationCode.equals(UserOperationCodes.CORPUSER_ADD)
					|| operationCode.equals(UserOperationCodes.CORPUSER_UPDATE)
					|| operationCode.equals(UserOperationCodes.STOREUSER_ADD)
					|| operationCode.equals(UserOperationCodes.STOREUSER_UPDATE)
					|| operationCode.equals(UserOperationCodes.STORETEMPORARYUSER_ADD)) {
				getData(syncData.getData(), syncData.getOrder());
			}
		}
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param data
	 * @param order
	 * @param dataSyncAuditDtos
	 */
	private void getData(Object data, int order) {

		if (order == 0) {
			getEmployeeAndSave(data, order);
		} else if (order == 1) {
			getUserLoginAndSave(data, order);
		} else if (order == 2 || order == 3 || order == 4) {
			getEmployeeRoleMapping(data, order);
		}
	}

	/**
	 * @param data
	 * @param order
	 * @param empCode
	 */
	@Transactional
	public void getEmployeeRoleMapping(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		EmployeeRoleMappingSyncDto emplRoleSyncDto = new EmployeeRoleMappingSyncDto();
		if (order == 4) {
			EmployeeRoleMappingDao srcEmpRoleMapping = emplRoleSyncDto.getEmployeeRoleMappingDao(
					mapper.convertValue(data, new TypeReference<EmployeeRoleMappingSyncDto>() {
					}));
			EmployeeRoleMappingDao destEmp = empRoleMappingRepository.findByEmployeeEmployeeCodeAndRoleRoleCode(
					srcEmpRoleMapping.getEmployee().getEmployeeCode(), srcEmpRoleMapping.getRole().getRoleCode());
			if (destEmp == null) {
				saveToDB(srcEmpRoleMapping, order);
			} else {
				if (srcEmpRoleMapping.getSyncTime() >= destEmp.getSyncTime()) {
					saveToDB(srcEmpRoleMapping, order);
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			}
		} else {
			List<EmployeeRoleMappingDao> sourceList = emplRoleSyncDto
					.getDaoList(mapper.convertValue(data, new TypeReference<List<EmployeeRoleMappingSyncDto>>() {
					}));
			String empCode = sourceList.get(0).getEmployee().getEmployeeCode();
			List<String> roleCodes = new ArrayList<>();
			sourceList.forEach(src -> roleCodes.add(src.getRole().getRoleCode()));
			List<EmployeeRoleMappingDao> destList = empRoleMappingRepository
					.findByEmployeeEmployeeCodeAndRoleRoleCodeIn(empCode, roleCodes);
			compareListsAndSave(sourceList, destList, order);
		}

	}

	/**
	 * @param sourceList
	 * @param destList
	 */
	@Transactional
	public void compareListsAndSave(List<EmployeeRoleMappingDao> sourceList, List<EmployeeRoleMappingDao> destList,
			int order) {

		List<EmployeeRoleMappingDao> lpgList = new ArrayList<>();
		for (EmployeeRoleMappingDao empRoleMapping : sourceList) {
			boolean isNew = true;
			for (EmployeeRoleMappingDao destination : destList) {
				if (empRoleMapping.getRole().getRoleCode().equals(destination.getRole().getRoleCode()) && empRoleMapping
						.getEmployee().getEmployeeCode().equals(destination.getEmployee().getEmployeeCode())) {
					isNew = false;
					if (empRoleMapping.getSyncTime() >= destination.getSyncTime()) {
						lpgList.add(empRoleMapping);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				lpgList.add(empRoleMapping);
			}

		}

		saveToDB(lpgList, order);
	}

	/**
	 * @param data
	 * @param order
	 * @param operationCode
	 */
	@Transactional
	public String getEmployeeAndSave(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		EmployeeSyncDto empSyncDto = new EmployeeSyncDto();
		// @formatter:off
		EmployeeDao sourceEmp = empSyncDto.getEmployeeDao(mapper.convertValue(data, new TypeReference<EmployeeSyncDto>() {}));
		// @formatter:on
		EmployeeDao destEmp = employeeRepository.getOneByEmployeeCode(sourceEmp.getEmployeeCode());
		if (destEmp == null) {
			int tempSrcDataSyncId = sourceEmp.getSrcSyncId();
			sourceEmp.setSrcSyncId(sourceEmp.getDestSyncId());
			sourceEmp.setDestSyncId(tempSrcDataSyncId);
			saveToDB(sourceEmp, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceEmp.getSrcSyncId(), sourceEmp.getDestSyncId(),
					destEmp.getSrcSyncId(), destEmp.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = sourceEmp.getSrcSyncId();
				sourceEmp.setSrcSyncId(sourceEmp.getDestSyncId());
				sourceEmp.setDestSyncId(tempSrcDataSyncId);
				saveToDB(sourceEmp, order);
			}
		}
		return sourceEmp.getEmployeeCode();
	}

	/**
	 * @param data
	 * @param order
	 * @param operationCode
	 * @param messageId
	 */
	@Transactional
	public void getUserLoginAndSave(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		UserLoginSyncDto userLoginSyncDto = new UserLoginSyncDto();
		// @formatter:off
		UserLoginDao sourceUserLogin = userLoginSyncDto.getUserLoginDao(mapper.convertValue(data, new TypeReference<UserLoginSyncDto>() {}));
		// @formatter:on
		UserLoginDao destUserLogin = userLoginRepository.findOneByUserName(sourceUserLogin.getUserName());
		if (destUserLogin == null) {
			int tempSrcDataSyncId = sourceUserLogin.getSrcSyncId();
			sourceUserLogin.setSrcSyncId(sourceUserLogin.getDestSyncId());
			sourceUserLogin.setDestSyncId(tempSrcDataSyncId);
			saveToDB(sourceUserLogin, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceUserLogin.getSrcSyncId(),
					sourceUserLogin.getDestSyncId(), destUserLogin.getSrcSyncId(), destUserLogin.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = sourceUserLogin.getSrcSyncId();
				sourceUserLogin.setSrcSyncId(sourceUserLogin.getDestSyncId());
				sourceUserLogin.setDestSyncId(tempSrcDataSyncId);
				saveToDB(sourceUserLogin, order);
			}
		}

	}

	/**
	 * @param sourceUserLogin
	 * @param messageId
	 */
	@SuppressWarnings("unchecked")
	@Transactional
	public void saveToDB(Object object, int order) {
		try {
			if (order == 0) {
				employeeRepository.save((EmployeeDao) object);
			} else if (order == 1) {
				userLoginRepository.save((UserLoginDao) object);
			} else if (order == 2) {
				empRoleMappingRepository.saveAll((List<EmployeeRoleMappingDao>) object);
			} else if (order == 3) {
				empRoleMappingRepository.deleteAll((List<EmployeeRoleMappingDao>) object);
			} else if (order == 4) {
				empRoleMappingRepository.save((EmployeeRoleMappingDao) object);
			}
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}

	}

}
