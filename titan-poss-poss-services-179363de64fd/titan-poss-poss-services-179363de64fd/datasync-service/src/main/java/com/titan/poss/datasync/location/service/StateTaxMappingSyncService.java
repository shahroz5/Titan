/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

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
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.StateTaxMappingDao;
import com.titan.poss.location.dto.StateTaxMappingSyncDto;
import com.titan.poss.location.repository.StateTaxMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StateTaxMappingSyncService implements SyncOperation {

	@Autowired
	private StateTaxMappingRepository stateTaxMappingRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(StateTaxMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {

			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			ObjectMapper mapper = new ObjectMapper();
			if (operationCode.equals(LocationOperationCodes.STATETAX_ADD)
					|| operationCode.equals(LocationOperationCodes.STATETAX_UPDATE)) {
				StateTaxMappingSyncDto stateTaxMappingSyncDto = new StateTaxMappingSyncDto();
				StateTaxMappingDao sourceStateTax = stateTaxMappingSyncDto.getStateTaxMappingDao(
						mapper.convertValue(data.getData(), new TypeReference<StateTaxMappingSyncDto>() {
						}));
				StateTaxMappingDao destinationStateTax = stateTaxMappingRepository.findOneById(sourceStateTax.getId());

				if (destinationStateTax == null) {
					saveToDestinationDB(sourceStateTax, messageId);
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceStateTax, destinationStateTax);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						saveToDestinationDB(sourceStateTax, messageId);
					}
				}

			} else if (operationCode.equals(LocationOperationCodes.STATETAXMAPPING_UPDATE)) {
				stateTaxMappingBulkUpdateOperations(data, messageId);
			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId, messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	@Transactional
	public void saveToDestinationDB(StateTaxMappingDao sourceStateTax, String messageId) {
		int tempSrcDataSyncId = sourceStateTax.getSrcSyncId();
		sourceStateTax.setSrcSyncId(sourceStateTax.getDestSyncId());
		sourceStateTax.setDestSyncId(tempSrcDataSyncId);
		try {
			stateTaxMappingRepository.save(sourceStateTax);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	@Transactional
	public void stateTaxMappingBulkUpdateOperations(SyncData data, String messageId) {
		List<StateTaxMappingDao> sourceList = getSourceList(data.getData());
		List<StateTaxMappingDao> destinationList = getDestinationList(sourceList);
		compareListsAndSave(sourceList, destinationList, messageId);

	}

	/**
	 * @param sourceList
	 * @param destinationList
	 * @param messageId
	 */
	@Transactional
	public void compareListsAndSave(List<StateTaxMappingDao> sourceList, List<StateTaxMappingDao> destinationList,
			String messageId) {
		List<StateTaxMappingDao> lpgList = new ArrayList<>();
		for (StateTaxMappingDao stateTaxMapping : sourceList) {
			boolean isNew = true;
			for (StateTaxMappingDao destination : destinationList) {
				if (stateTaxMapping.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = compareSyncIdVersions(stateTaxMapping, destination);
					if (status.equals(DatasyncStatusEnum.SYNCED)) {
						int tempSrcDataSyncId = stateTaxMapping.getSrcSyncId();
						stateTaxMapping.setSrcSyncId(stateTaxMapping.getDestSyncId());
						stateTaxMapping.setDestSyncId(tempSrcDataSyncId);
						lpgList.add(stateTaxMapping);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = stateTaxMapping.getSrcSyncId();
				stateTaxMapping.setSrcSyncId(stateTaxMapping.getDestSyncId());
				stateTaxMapping.setDestSyncId(tempSrcDataSyncId);
				lpgList.add(stateTaxMapping);
			}

		}
		saveAllToDestinationDB(lpgList);
	}


	/**
	 * @param lpgList
	 * @return DataSyncAuditDto
	 */
	@Transactional
	public DataSyncAuditDto saveAllToDestinationDB(List<StateTaxMappingDao> lpgList) {
		DataSyncAuditDto dataSyncAuditDto = new DataSyncAuditDto();
		try {
			stateTaxMappingRepository.saveAll(lpgList);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}
		return dataSyncAuditDto;
	}

	/**
	 * @param sourceList
	 * @return
	 */
	private List<StateTaxMappingDao> getDestinationList(List<StateTaxMappingDao> sourceList) {
		List<String> ids = new ArrayList<>();
		sourceList.forEach(src -> ids.add(src.getId()));
		return stateTaxMappingRepository.findAllById(ids);
	}

	/**
	 * @param data
	 * @return
	 */
	private List<StateTaxMappingDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		StateTaxMappingSyncDto stateTaxMappingSyncDto = new StateTaxMappingSyncDto();
		return stateTaxMappingSyncDto
				.getDaoList(mapper.convertValue(data, new TypeReference<List<StateTaxMappingSyncDto>>() {
				}));
	}

	private DatasyncStatusEnum compareSyncIdVersions(StateTaxMappingDao src, StateTaxMappingDao dest) {
		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());

	}

}
