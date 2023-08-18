/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.RivaahProductMappingDao;
import com.titan.poss.config.dto.RivaahProductMappingSyncDto;
import com.titan.poss.config.repository.RivaahProductGroupMappingRepository;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
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
public class RivaahProductMappingSyncService implements SyncOperation {

	@Autowired
	private RivaahProductGroupMappingRepository rivaahProductGroupMappingRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(RivaahProductMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.RIVAAH_PGRP_MAPPING)) {
				List<RivaahProductMappingDao> sourceList = getSourceList(syncData.getData());
				compareListsAndSave(sourceList, syncData.getOrder());
			}
		}
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,
				messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param sourceList
	 * @param destList
	 * @param messageId
	 * @param order
	 */
	@Transactional
	public void compareListsAndSave(List<RivaahProductMappingDao> sourceList, int order) {
		List<RivaahProductMappingDao> rpmList = new ArrayList<>();
		List<RivaahProductMappingDao> rpmDeleteList = new ArrayList<>();
		for (RivaahProductMappingDao rivaahPrdGrpMapping : sourceList) {
			Optional<RivaahProductMappingDao> destination = rivaahProductGroupMappingRepository
					.findById(rivaahPrdGrpMapping.getId());
			if (destination.isPresent()) {
				if (order == 0)
					rpmDeleteList.add(destination.get());
				else if (order == 1) {
					rpmDeleteList.add(destination.get());
					rpmList.add(rivaahPrdGrpMapping);

				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				rpmList.add(rivaahPrdGrpMapping);
			}
		}
		saveToDestinationDB(rpmList, order, rpmDeleteList);
	}

	/**
	 * @param rpmList
	 * @param order
	 * @param rpmDeleteList
	 */
	@Transactional
	public void saveToDestinationDB(List<RivaahProductMappingDao> rpmList, int order,
			List<RivaahProductMappingDao> rpmDeleteList) {
		try {
			if (order == 0)
				rivaahProductGroupMappingRepository.deleteAll(rpmDeleteList);
			else if (order == 1) {
				if (!rpmDeleteList.isEmpty()) {
					rivaahProductGroupMappingRepository.deleteAll(rpmDeleteList);
					rivaahProductGroupMappingRepository.flush();
				}
				rivaahProductGroupMappingRepository.saveAll(rpmList);
			}
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}
	}

	/**
	 * @param data
	 * @return List<RivaahProductMappingDao>
	 */
	private List<RivaahProductMappingDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		RivaahProductMappingSyncDto syncDto = new RivaahProductMappingSyncDto();
		return syncDto.getRivaahProductDaoList(
				mapper.convertValue(data, new TypeReference<List<RivaahProductMappingSyncDto>>() {
				}));
	}

}
