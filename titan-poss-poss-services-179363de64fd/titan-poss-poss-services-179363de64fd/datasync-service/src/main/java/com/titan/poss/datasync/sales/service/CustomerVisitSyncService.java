/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.sales.service;

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
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.CustomerVisitDao;
import com.titan.poss.sales.dto.CustomerVisitSyncDto;
import com.titan.poss.sales.repository.CustomerVisitRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CustomerVisitSyncService implements SyncOperation {

	@Autowired
	CustomerVisitSyncService customerVisitSynService;

	@Autowired
	CustomerVisitRepository customerVisitRepo;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CustomerVisitSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag = visitSyncService(syncData);
			if (Boolean.TRUE.equals(flag)) {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
			} else {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
			}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	/**
	 * @param syncData
	 * @param messageId
	 */
	private Boolean visitSyncService(List<SyncData> syncData) {
		CustomerVisitDao customerVisitDao = null;
		for (SyncData data : syncData) {
			ObjectMapper mapper = new ObjectMapper();
			if (data.getOrder() == 0) {
				customerVisitDao = syncVisit(data, mapper);
			}
		}
		return customerVisitSynService.dbOperation(customerVisitDao);
	}

	/**
	 * @param data
	 * @param mapper
	 * @return CustomerVisitDao
	 */
	private CustomerVisitDao syncVisit(SyncData data, ObjectMapper mapper) {
		CustomerVisitSyncDto syncDto = new CustomerVisitSyncDto();
		CustomerVisitDao srcCustomerVisitDao = syncDto
				.getCustomerVisitDao(mapper.convertValue(data.getData(), new TypeReference<CustomerVisitSyncDto>() {
				}));
		Optional<CustomerVisitDao> destCustomerVisitDao = customerVisitRepo.findById(srcCustomerVisitDao.getId());
		if (!destCustomerVisitDao.isPresent()) {
			int tempSrcDataSyncId = srcCustomerVisitDao.getSrcSyncId();
			srcCustomerVisitDao.setSrcSyncId(srcCustomerVisitDao.getDestSyncId());
			srcCustomerVisitDao.setDestSyncId(tempSrcDataSyncId);
			return srcCustomerVisitDao;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCustomerVisitDao.getSrcSyncId(),
					srcCustomerVisitDao.getDestSyncId(), destCustomerVisitDao.get().getSrcSyncId(),
					destCustomerVisitDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcCustomerVisitDao.getSrcSyncId();
				srcCustomerVisitDao.setSrcSyncId(srcCustomerVisitDao.getDestSyncId());
				srcCustomerVisitDao.setDestSyncId(tempSrcDataSyncId);
				return srcCustomerVisitDao;
			}
		}
		return null;
	}

	/**
	 * @param customerVisitDao
	 */
	@Transactional(value="chainedTransaction")
	public Boolean dbOperation(CustomerVisitDao customerVisitDao) {
		Boolean flag = false;
		if (customerVisitDao != null) {
			customerVisitRepo.save(customerVisitDao);
			flag = true;
		}
		return flag;
	}

}
