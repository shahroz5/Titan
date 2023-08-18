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
import com.titan.poss.location.dao.StateTaxDetailsDao;
import com.titan.poss.location.dto.StateTaxDetailsSyncDto;
import com.titan.poss.location.repository.StatetTaxDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StateTaxDetailsSyncService implements SyncOperation {

	@Autowired
	private StatetTaxDetailsRepository statetTaxDetailsRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(StateTaxDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {


		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(LocationOperationCodes.STATETAXDETAILS_UPDATE)) {
				List<StateTaxDetailsDao> sourceList = getSourceList(data.getData());
				compareListsAndSave(sourceList);

			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId, messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();

	}

	/**
	 * @param sourceList
	 * @param messageId
	 */
	private void compareListsAndSave(List<StateTaxDetailsDao> sourceList) {
		List<StateTaxDetailsDao> newStateTaxDetailsList = new ArrayList<>();
		List<StateTaxDetailsDao> delStateTaxDetailsList = new ArrayList<>();
		for (StateTaxDetailsDao srcStateTaxDetails : sourceList) {
			StateTaxDetailsDao destination = statetTaxDetailsRepository
					.findByStateTaxMappingIdAndTaxClassCode(srcStateTaxDetails.getStateTaxMappingId(),
							srcStateTaxDetails.getTaxClassCode());
			if (destination != null) {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcStateTaxDetails.getSrcSyncId(),
						srcStateTaxDetails.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
				if (!status.equals(DatasyncStatusEnum.SYNCED)) {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				} else {
					int tempSrcDataSyncId = srcStateTaxDetails.getSrcSyncId();
					srcStateTaxDetails.setSrcSyncId(srcStateTaxDetails.getDestSyncId());
					srcStateTaxDetails.setDestSyncId(tempSrcDataSyncId);
					delStateTaxDetailsList.add(destination);
					newStateTaxDetailsList.add(srcStateTaxDetails);
				}
			} else {
				int tempSrcDataSyncId = srcStateTaxDetails.getSrcSyncId();
				srcStateTaxDetails.setSrcSyncId(srcStateTaxDetails.getDestSyncId());
				srcStateTaxDetails.setDestSyncId(tempSrcDataSyncId);
				newStateTaxDetailsList.add(srcStateTaxDetails);
			}
		}
		saveAllToDestinationDB(newStateTaxDetailsList, delStateTaxDetailsList);
	}

	/**
	 * @param newStateTaxDetailsList
	 * @param delStateTaxDetailsList
	 */
	private void saveAllToDestinationDB(List<StateTaxDetailsDao> newStateTaxDetailsList,
			List<StateTaxDetailsDao> delStateTaxDetailsList) {
		try {
			if (!delStateTaxDetailsList.isEmpty()) {
				statetTaxDetailsRepository.deleteAll(delStateTaxDetailsList);
				statetTaxDetailsRepository.flush();
			}
			statetTaxDetailsRepository.saveAll(newStateTaxDetailsList);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	/**
	 * @param data
	 * @return List<StateTaxDetailsDao>
	 */
	private List<StateTaxDetailsDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		StateTaxDetailsSyncDto syncDto = new StateTaxDetailsSyncDto();
		return syncDto.getDaoList(mapper.convertValue(data, new TypeReference<List<StateTaxDetailsSyncDto>>() {
		}));
	}

}
