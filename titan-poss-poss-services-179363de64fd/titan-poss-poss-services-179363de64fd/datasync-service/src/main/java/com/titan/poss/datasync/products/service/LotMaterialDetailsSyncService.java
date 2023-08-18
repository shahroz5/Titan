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
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dto.LotMaterialDetailsSyncDto;
import com.titan.poss.product.repository.LotMaterialDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class LotMaterialDetailsSyncService implements SyncOperation {

	@Autowired
	LotMaterialDetailsRepository lotMaterialDetailsRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(LotMaterialDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		syncData.forEach(data -> {
			if (messageTransfer.getMessageTransferData().getOperation()
					.equals(ProductOperationCodes.LOT_MATERIAL_DETAILS_ADD)) {
				List<LotMaterialDetailsDao> srcLotDetails = getSourceList(data.getData());
				List<LotMaterialDetailsDao> destLotDetails = getDestinationList(srcLotDetails);
				List<LotMaterialDetailsDao> lotDetailsList = new ArrayList<>();
				List<LotMaterialDetailsDao> deleteList = new ArrayList<>();
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
	private DataSyncAuditDto saveToDestinationDB(List<LotMaterialDetailsDao> lotDetailsList,
			List<LotMaterialDetailsDao> deleteList) {
		DataSyncAuditDto dataSyncAudit = new DataSyncAuditDto();
		try {
			if (!deleteList.isEmpty()) {
				lotMaterialDetailsRepository.deleteAll(deleteList);
				lotMaterialDetailsRepository.flush();
			}
			if (!lotDetailsList.isEmpty())
				lotMaterialDetailsRepository.saveAll(lotDetailsList);
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
	private void compareBothList(List<LotMaterialDetailsDao> srcLotDetails, List<LotMaterialDetailsDao> destLotDetails,
			List<LotMaterialDetailsDao> lotDetailsList, List<LotMaterialDetailsDao> deleteList) {
		for (LotMaterialDetailsDao lotMaterial : srcLotDetails) {
			boolean isNew = true;
			for (LotMaterialDetailsDao destination : destLotDetails) {
				if (lotMaterial.getLotDetailsId().getItem().getItemCode()
						.equals(destination.getLotDetailsId().getItem().getItemCode())
						&& lotMaterial.getLotDetailsId().getLineItemNo()
								.equals(destination.getLotDetailsId().getLineItemNo())
						&& lotMaterial.getLotDetailsId().getLotNumber()
								.equals(destination.getLotDetailsId().getLotNumber())) {
					if (lotMaterial.getCorrelationId() == null) {
						if (destination.getSyncTime() < lotMaterial.getSyncTime()) {
							isNew = false;
							lotDetailsList.add(lotMaterial);
						} else {
							ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
						}
					}
					if ((!lotMaterial.getCorrelationId().equals(destination.getCorrelationId()))
							&& destination.getSyncTime() < lotMaterial.getSyncTime()) {
						isNew = false;
						deleteList.add(destination);
						lotDetailsList.add(lotMaterial);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
					}
				}
			}
			if (isNew)
				lotDetailsList.add(lotMaterial);
		}
	}

	/**
	 * @param srcLotDetails
	 * @return List<LotMaterialDetailsDao>
	 */
	private List<LotMaterialDetailsDao> getDestinationList(List<LotMaterialDetailsDao> srcLotDetails) {
		Set<String> itemCodes = new HashSet<>();
		srcLotDetails.forEach(src -> itemCodes.add(src.getLotDetailsId().getItem().getItemCode()));
		return lotMaterialDetailsRepository.findAllByLotDetailsIdItemItemCodeIn(itemCodes);

	}

	/**
	 * @param data
	 * @return List<LotMaterialDetailsDao>
	 */
	private List<LotMaterialDetailsDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		LotMaterialDetailsSyncDto lotMaterialDetailsSyncDto = new LotMaterialDetailsSyncDto();
		return lotMaterialDetailsSyncDto
				.getDaoList(mapper.convertValue(data, new TypeReference<List<LotMaterialDetailsSyncDto>>() {
		}));
	}
}
