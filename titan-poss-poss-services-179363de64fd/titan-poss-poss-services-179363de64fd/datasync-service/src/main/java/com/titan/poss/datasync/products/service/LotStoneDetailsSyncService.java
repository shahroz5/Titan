/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.products.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dto.LotStoneDetailsSyncDto;
import com.titan.poss.product.repository.LotDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class LotStoneDetailsSyncService implements SyncOperation {

	@Autowired
	LotDetailsRepository lotDetailsRepository;
	
	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(LotStoneDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		syncData.forEach(data -> {
			if (messageTransfer.getMessageTransferData().getOperation()
					.equals(ProductOperationCodes.LOT_STONE_DETAILS_ADD)) {
				List<LotDetailsDao> srcLotDetails = getSourceList(data.getData());
				List<LotDetailsDao> destLotDetails = getDestinationList(srcLotDetails);
				List<LotDetailsDao> lotDetailsList = new ArrayList<>();
				List<LotDetailsDao> deleteList = new ArrayList<>();
				compareBothList(srcLotDetails, destLotDetails, lotDetailsList, deleteList);
				saveToDestinationDB(lotDetailsList, deleteList);
			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageTransfer.getMessageTransferData().getId(),messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param lotDetailsList
	 * @param deleteList
	 * @return DataSyncAuditDto
	 */
	private DataSyncAuditDto saveToDestinationDB(List<LotDetailsDao> lotDetailsList, List<LotDetailsDao> deleteList) {
		DataSyncAuditDto dataSyncAudit = new DataSyncAuditDto();
		try {
			if (!deleteList.isEmpty()) {
				lotDetailsRepository.deleteAll(deleteList);
				lotDetailsRepository.flush();
			}
			if (!lotDetailsList.isEmpty())
				lotDetailsRepository.saveAll(lotDetailsList);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}
		return dataSyncAudit;
	}

	/**
	 * @param srcLotDetails
	 * @param destLotDetails
	 * @param dataSyncAuditList
	 * @param lotDetailsList
	 * @param deleteList
	 */
	private void compareBothList(List<LotDetailsDao> srcLotDetails, List<LotDetailsDao> destLotDetails,
			List<LotDetailsDao> lotDetailsList, List<LotDetailsDao> deleteList) {
		for (LotDetailsDao src : srcLotDetails) {
			boolean isNew = true;
			for (LotDetailsDao destination : destLotDetails) {
				if (src.getLotDetailsId().getItem().getItemCode()
						.equals(destination.getLotDetailsId().getItem().getItemCode())
						&& src.getLotDetailsId().getLineItemNo().equals(destination.getLotDetailsId().getLineItemNo())
						&& src.getLotDetailsId().getLotNumber().equals(destination.getLotDetailsId().getLotNumber())) {
					if (src.getCorrelationId() == null) {
						if (destination.getSyncTime() <= src.getSyncTime()) {
							isNew = false;
							lotDetailsList.add(src);
						} else {
							ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
						}
					}
					if ((!src.getCorrelationId().equals(destination.getCorrelationId()))
							&& destination.getSyncTime() <= src.getSyncTime()) {
						isNew = false;
						deleteList.add(destination);
						lotDetailsList.add(src);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
					}
				}
			}
			if (isNew)
				lotDetailsList.add(src);
		}
	}

	/**
	 * @param srcLotDetails
	 * @return List<LotDetailsDao>
	 */
	private List<LotDetailsDao> getDestinationList(List<LotDetailsDao> srcLotDetails) {
		Set<String> itemCodes = new HashSet<>();
		srcLotDetails.forEach(src -> itemCodes.add(src.getLotDetailsId().getItem().getItemCode()));
		return lotDetailsRepository.findAllByLotDetailsIdItemItemCodeIn(itemCodes);

	}

	/**
	 * @param data
	 * @return List<LotDetailsDao>
	 */
	private List<LotDetailsDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		LotStoneDetailsSyncDto itemSyncDto = new LotStoneDetailsSyncDto();
		return itemSyncDto.getDaoList(mapper.convertValue(data, new TypeReference<List<LotStoneDetailsSyncDto>>() {
		}));
	}

}
