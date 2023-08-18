/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.integration.service;

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
import com.titan.poss.datasync.constant.IntegrationOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dto.VendorConfigSyncDto;
import com.titan.poss.integration.repository.VendorConfigRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class VendorConfigsSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	VendorConfigRepository vendorConfigRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(VendorConfigsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		syncData.forEach(data -> {
			if (messageTransfer.getMessageTransferData().getOperation()
					.equals(IntegrationOperationCodes.VENDOR_CONFIGS)) {
				List<VendorConfigDao> srcVendors = getSourceList(data.getData());
				List<VendorConfigDao> destVendors = getDestinationList(srcVendors);
				List<VendorConfigDao> vendorsList = new ArrayList<>();
				compareBothList(srcVendors, destVendors, vendorsList);
				saveToDestinationDB(vendorsList);
			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageTransfer.getMessageTransferData().getId(),messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param vendorsList
	 */
	private void saveToDestinationDB(List<VendorConfigDao> vendorsList) {
		try {
			LOGGER.info("VENDORs LIST : {} ", vendorsList);
			if (!vendorsList.isEmpty()) {
				vendorConfigRepository.saveAll(vendorsList);
				ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
			} else {

			}

		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}
	}

	/**
	 * @param srcVendors
	 * @param destVendors
	 * @param vendorsList
	 */
	private void compareBothList(List<VendorConfigDao> srcVendors, List<VendorConfigDao> destVendors,
			List<VendorConfigDao> vendorsList) {
		for (VendorConfigDao src : srcVendors) {
			boolean isNew = true;
			for (VendorConfigDao destination : destVendors) {
				if (src.getConfigId().equals(destination.getConfigId())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(src.getSrcSyncId(),
							src.getDestSyncId(), destination.getSrcSyncId(), destination.getDestSyncId());
					if (status.equals(DatasyncStatusEnum.SYNCED)) {
						int tempSrcDataSyncId = src.getSrcSyncId();
						src.setSrcSyncId(src.getDestSyncId());
						src.setDestSyncId(tempSrcDataSyncId);
						vendorsList.add(src);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					}
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = src.getSrcSyncId();
				src.setSrcSyncId(src.getDestSyncId());
				src.setDestSyncId(tempSrcDataSyncId);
				vendorsList.add(src);
			}
		}

	}

	/**
	 * @param srcLotDetails
	 * @return
	 */
	private List<VendorConfigDao> getDestinationList(List<VendorConfigDao> srcVendors) {
		List<String> ids = new ArrayList<>();
		srcVendors.forEach(src -> ids.add(src.getConfigId()));
		return vendorConfigRepository.findAllById(ids);

	}

	/**
	 * @param data
	 * @return List<VendorConfigDao>
	 */
	private List<VendorConfigDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		VendorConfigSyncDto vendorConfigSyncDto = new VendorConfigSyncDto();
		return vendorConfigSyncDto.getDaoList(mapper.convertValue(data, new TypeReference<List<VendorConfigSyncDto>>() {
		}));
	}

}
