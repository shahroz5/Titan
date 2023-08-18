/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.ConfigLovDao;
import com.titan.poss.config.dto.ConfigLovSyncDto;
import com.titan.poss.config.repository.ConfigLovRepository;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class ConfigLovSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	ConfigLovRepository lovRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(ConfigLovSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();

		for (SyncData syncData : syncDataList) {
			ObjectMapper mapper = new ObjectMapper();
			ConfigLovSyncDto configSyncDto = new ConfigLovSyncDto();
			List<ConfigLovDao> srcConfigLovList = configSyncDto
					.getDaoList(mapper.convertValue(syncData.getData(), new TypeReference<List<ConfigLovSyncDto>>() {
					}));
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ConfigServiceOperationCodes.CONFIG_LOV_ADD)
					|| operationCode.equals(ConfigServiceOperationCodes.CONFIG_LOV_UPDATE)) {
				for (ConfigLovDao sourceConfigLov : srcConfigLovList) {
					ConfigLovDao destConfigLov = lovRepository.findOneByLovTypeAndCode(sourceConfigLov.getLovType(),
							sourceConfigLov.getCode());
					if (destConfigLov == null) {
						saveToDestinationDB(sourceConfigLov);

					} else {
						compareSyncIdVersions(sourceConfigLov, destConfigLov);
					}
				}

				List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
				datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
				DataSyncAuditDtoThreadLocal.unsetSyncData();

			}
		}
	}

	/**
	 * @param sourceLov
	 * @param destinationLov
	 */
	private void compareSyncIdVersions(ConfigLovDao src, ConfigLovDao dest) {
		DatasyncStatusEnum status = ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(),
				dest.getSrcSyncId(), dest.getDestSyncId());

		if (!status.equals(DatasyncStatusEnum.SYNCED)) {
			ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
		} else {
			saveToDestinationDB(src);
		}
	}

	/**
	 * @param sourceLov
	 */
	private void saveToDestinationDB(ConfigLovDao sourceConfigLov) {
		int tempSrcDataSyncId = sourceConfigLov.getSrcSyncId();
		sourceConfigLov.setSrcSyncId(sourceConfigLov.getDestSyncId());
		sourceConfigLov.setDestSyncId(tempSrcDataSyncId);
		try {
			lovRepository.save(sourceConfigLov);
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
