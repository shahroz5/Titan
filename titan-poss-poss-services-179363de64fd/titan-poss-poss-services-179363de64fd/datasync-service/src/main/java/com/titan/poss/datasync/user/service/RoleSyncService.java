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
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.user.dao.RoleAclMappingDao;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.sync.RoleAclMappingSyncDto;
import com.titan.poss.user.dto.sync.RoleSyncDto;
import com.titan.poss.user.repository.RoleAclMappingRepository;
import com.titan.poss.user.repository.RoleRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class RoleSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	RoleAclMappingRepository roleAclMappingRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(RoleSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String roleCode = null;
		for (SyncData syncData : syncDataList) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(UserOperationCodes.ROLE_ADD)
					|| operationCode.equals(UserOperationCodes.ROLE_UPDATE)) {
				if (syncData.getOrder() == 0) {
					roleCode = getRoleAndSave(syncData.getData(), syncData.getOrder());
				} else if (syncData.getOrder() == 1 || syncData.getOrder() == 2) {
					getRoleAclMapping(syncData.getData(), syncData.getOrder(), roleCode);
				}
			}
		}
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}


	/**
	 * @param data
	 * @param order
	 */
	@Transactional
	public void getRoleAclMapping(Object data, int order, String roleCode) {
		ObjectMapper mapper = new ObjectMapper();
		RoleAclMappingSyncDto roleAclSyncDto = new RoleAclMappingSyncDto();
		//@formatter:off
		List<RoleAclMappingDao> srcRoleAclMapping = roleAclSyncDto.getDaoList(mapper.convertValue(data, new TypeReference<List<RoleAclMappingSyncDto>>() {}));
		// @formatter:on
		List<String> aclCodes = new ArrayList<>();
		srcRoleAclMapping.forEach(src -> aclCodes.add(src.getAcl().getAclCode()));
		List<RoleAclMappingDao> destList = roleAclMappingRepository.findByRoleRoleCodeAndAclAclCodeIn(roleCode,
				aclCodes);
		compareListsAndSave(srcRoleAclMapping, destList, order);
	}

	/**
	 * @param srcRoleAclMapping
	 * @param destList
	 * @param order
	 */
	@Transactional
	public void compareListsAndSave(List<RoleAclMappingDao> srcRoleAclMapping, List<RoleAclMappingDao> destList,
			int order) {
		List<RoleAclMappingDao> lpgList = new ArrayList<>();
		for (RoleAclMappingDao roleAclMapping : srcRoleAclMapping) {
			boolean isNew = true;
			for (RoleAclMappingDao destination : destList) {
				if (roleAclMapping.getRole().getRoleCode().equals(destination.getRole().getRoleCode())
						&& roleAclMapping.getAcl().getAclCode().equals(destination.getAcl().getAclCode())) {
					isNew = false;
					if (roleAclMapping.getSyncTime() >= destination.getSyncTime()) {
						lpgList.add(roleAclMapping);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				lpgList.add(roleAclMapping);
			}

		}

		saveToDestinationDB(lpgList, order);
	}

	/**
	 * @param data
	 * @param order
	 */
	@Transactional
	public String getRoleAndSave(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		RoleSyncDto roleSyncDto = new RoleSyncDto();
		//@formatter:off
		RoleDao sourceRole = roleSyncDto.getRoleDao(mapper.convertValue(data, new TypeReference<RoleSyncDto>() {}));
		// @formatter:on
		RoleDao destRole = roleRepository.findOneByRoleCode(sourceRole.getRoleCode());
		if (destRole == null) {
			int tempSrcDataSyncId = sourceRole.getSrcSyncId();
			sourceRole.setSrcSyncId(sourceRole.getDestSyncId());
			sourceRole.setDestSyncId(tempSrcDataSyncId);
			saveToDestinationDB(sourceRole, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceRole.getSrcSyncId(), sourceRole.getDestSyncId(),
					destRole.getSrcSyncId(), destRole.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = sourceRole.getSrcSyncId();
				sourceRole.setSrcSyncId(sourceRole.getDestSyncId());
				sourceRole.setDestSyncId(tempSrcDataSyncId);
				saveToDestinationDB(sourceRole, order);
			}
		}
		return sourceRole.getRoleCode();
	}

	/**
	 * @param sourceRole
	 * @param order
	 */
	@Transactional
	@SuppressWarnings("unchecked")
	public void saveToDestinationDB(Object data, int order) {
		try {
			if(order == 0) {
				roleRepository.save((RoleDao)data);
			}
			else if (order == 1) {
				roleAclMappingRepository.saveAll((List<RoleAclMappingDao>) data);
			} else if (order == 2) {
				roleAclMappingRepository.deleteAll((List<RoleAclMappingDao>) data);
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
