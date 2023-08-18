/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.store.service;

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
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.StoreOperationCode;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.store.dao.CustomerTownDao;
import com.titan.poss.store.dto.CustomerTownSyncDto;
import com.titan.poss.store.repository.CustomerTownRepository;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CustomerTownSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private CustomerTownRepository customerTownRepository;

	@Autowired
	private CustomerTownSyncService cstomerTownSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CustomerTownSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		syncData.forEach(data -> {
			if (operationCode.equals(StoreOperationCode.CUSTOMER_TOWN_ADD)
					|| operationCode.equals(StoreOperationCode.CUSTOMER_TOWN_UPDATE)) {
				cstomerTownSyncService.syncCustomerTown(data, messageId,messageTransfer.getMessageTransferData().getDestination());
			}
		});
	}

	public void syncCustomerTown(SyncData data, String messageId, String destination) {
		ObjectMapper mapper = new ObjectMapper();
		CustomerTownSyncDto syncDto = new CustomerTownSyncDto();
		CustomerTownDao srcCustomer = syncDto
				.getCustomerTownDao(mapper.convertValue(data.getData(), new TypeReference<CustomerTownSyncDto>() {
				}));
		Optional<CustomerTownDao> destCatchment = customerTownRepository
				.findByCustomerTownIdTownCodeAndCustomerTownIdLocationCode(
						srcCustomer.getCustomerTownId().getTownCode(),
						srcCustomer.getCustomerTownId().getLocationCode());
		if (!destCatchment.isPresent()) {
			cstomerTownSyncService.saveCustomerTown(srcCustomer,messageId,destination);
		}
		destCatchment.ifPresent(dest -> {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomer.getSrcSyncId(), srcCustomer.getDestSyncId(),
					dest.getSrcSyncId(), dest.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,destination, status.name());
			} else {
				cstomerTownSyncService.saveCustomerTown(srcCustomer,messageId,destination);
			}
		});

	}
	@Transactional
	public void saveCustomerTown(CustomerTownDao srcCustomer, String messageId, String destination) {
		int tempSrcDataSyncId = srcCustomer.getSrcSyncId();
		srcCustomer.setSrcSyncId(srcCustomer.getDestSyncId());
		srcCustomer.setDestSyncId(tempSrcDataSyncId);
		try {
			customerTownRepository.save(srcCustomer);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,destination, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}

	}
}
