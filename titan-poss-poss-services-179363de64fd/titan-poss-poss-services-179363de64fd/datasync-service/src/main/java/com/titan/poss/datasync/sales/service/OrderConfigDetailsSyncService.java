/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.sales.service;

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
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.sales.dao.OrderDetailsConfigDao;
import com.titan.poss.sales.dto.OrderDetailsConfigSyncDto;
import com.titan.poss.sales.repository.OrderDetailsConfigRepository;

/**
 * Service class to sync order config details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("dataSyncOrderConfigDetailsSyncService")
public class OrderConfigDetailsSyncService implements SyncOperation {

	private static final Logger LOGGER = LoggerFactory.getLogger(OrderConfigDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private OrderDetailsConfigRepository orderDetailsConfigRepository;

	@Autowired
	private OrderConfigDetailsSyncService ocdSyncService;

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag = syncData(syncData);
			if (Boolean.TRUE.equals(flag)) {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,
						messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
			} else {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,
						messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
			}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,
					messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.FAILED_PERSIST.name(),
					ex.getMessage());
		}
	}

	private Boolean syncData(List<SyncData> syncData) {
		List<OrderDetailsConfigDao> orderDetailsConfigDaoList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				syncOrderConfigDetails(data, orderDetailsConfigDaoList, mapper);
			}
		}

		return ocdSyncService.dbOperation(orderDetailsConfigDaoList);
	}

	@Transactional(value = "chainedTransaction")
	public Boolean dbOperation(List<OrderDetailsConfigDao> orderDetailsConfigDaoList) {
		boolean flag = false;
		if (!CollectionUtil.isEmpty(orderDetailsConfigDaoList)) {
			orderDetailsConfigRepository.saveAll(orderDetailsConfigDaoList);
			flag = true;
		}

		return flag;
	}

	private void syncOrderConfigDetails(SyncData data, List<OrderDetailsConfigDao> orderDetailsConfigDaoList,
			ObjectMapper mapper) {
		OrderDetailsConfigSyncDto syncDto = new OrderDetailsConfigSyncDto();
		List<OrderDetailsConfigDao> srcOrderDetailsConfigDaoList = syncDto.getOrderDetailsConfigDaoList(
				mapper.convertValue(data.getData(), new TypeReference<List<OrderDetailsConfigSyncDto>>() {
				}));
		srcOrderDetailsConfigDaoList.forEach(srcOrderDetailsConfig -> {
			Optional<OrderDetailsConfigDao> destOrderDetailsConfigDao = orderDetailsConfigRepository
					.findById(srcOrderDetailsConfig.getId());
			if (!destOrderDetailsConfigDao.isPresent()) {
				int tempSrcDataSyncId = srcOrderDetailsConfig.getSrcSyncId();
				srcOrderDetailsConfig.setSrcSyncId(srcOrderDetailsConfig.getDestSyncId());
				srcOrderDetailsConfig.setDestSyncId(tempSrcDataSyncId);
				orderDetailsConfigDaoList.add(srcOrderDetailsConfig);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcOrderDetailsConfig.getSrcSyncId(),
						srcOrderDetailsConfig.getDestSyncId(), destOrderDetailsConfigDao.get().getSrcSyncId(),
						destOrderDetailsConfigDao.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcOrderDetailsConfig.getSrcSyncId();
					srcOrderDetailsConfig.setSrcSyncId(srcOrderDetailsConfig.getDestSyncId());
					srcOrderDetailsConfig.setDestSyncId(tempSrcDataSyncId);
					orderDetailsConfigDaoList.add(srcOrderDetailsConfig);
				}
			}
		});
	}
}
