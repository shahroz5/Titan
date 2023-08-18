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
import com.titan.poss.sales.dao.BusinessDayDao;
import com.titan.poss.sales.dao.RevenueSummaryDao;
import com.titan.poss.sales.dto.BusinessDaySyncDto;
import com.titan.poss.sales.dto.RevenueSummarySyncDto;
import com.titan.poss.sales.repository.BusinessDayRepository;
import com.titan.poss.sales.repository.RevenueSummaryRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class BusinessDaySyncService implements SyncOperation {

	@Autowired
	BusinessDaySyncService businessDaySynService;

	@Autowired
	BusinessDayRepository businessDayRepo;

	@Autowired
	RevenueSummaryRepository revenueSummaryRepo;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(BusinessDaySyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag=businessSyncService(syncData);
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

	private Boolean businessSyncService(List<SyncData> syncData) {
		BusinessDayDao businessDao = null;
		RevenueSummaryDao revenueSummaryDao = null;
		for (SyncData data : syncData) {
			ObjectMapper mapper = new ObjectMapper();
			if (data.getOrder() == 0) {
				businessDao = syncBusiness(data, mapper);
			} else if (data.getOrder() == 1) {
				revenueSummaryDao = syncRevenue(data, mapper);
			}
		}
		return businessDaySynService.dbOperation(businessDao, revenueSummaryDao);
	}

	/**
	 * @param data
	 * @param mapper
	 * @param messageId
	 * @return srcRevenueSummaryDao
	 */
	private RevenueSummaryDao syncRevenue(SyncData data, ObjectMapper mapper) {
		RevenueSummarySyncDto syncDto = new RevenueSummarySyncDto();
		RevenueSummaryDao srcRevenueSummaryDao = syncDto
				.getRevenueSummaryDao(mapper.convertValue(data.getData(), new TypeReference<RevenueSummarySyncDto>() {
				}));
		Optional<RevenueSummaryDao> destRevenueSummaryDao = revenueSummaryRepo.findById(srcRevenueSummaryDao.getId());
		if (!destRevenueSummaryDao.isPresent()) {
			int tempSrcDataSyncId = srcRevenueSummaryDao.getSrcSyncId();
			srcRevenueSummaryDao.setSrcSyncId(srcRevenueSummaryDao.getDestSyncId());
			srcRevenueSummaryDao.setDestSyncId(tempSrcDataSyncId);
			return srcRevenueSummaryDao;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcRevenueSummaryDao.getSrcSyncId(),
					srcRevenueSummaryDao.getDestSyncId(), destRevenueSummaryDao.get().getSrcSyncId(),
					destRevenueSummaryDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcRevenueSummaryDao.getSrcSyncId();
				srcRevenueSummaryDao.setSrcSyncId(srcRevenueSummaryDao.getDestSyncId());
				srcRevenueSummaryDao.setDestSyncId(tempSrcDataSyncId);
				return srcRevenueSummaryDao;
			}
		}
		return null;
	}

	/**
	 * @param data
	 * @param mapper
	 * @param messageId
	 * @return srcBusinessDayDao
	 */
	private BusinessDayDao syncBusiness(SyncData data, ObjectMapper mapper) {
		BusinessDaySyncDto syncDto = new BusinessDaySyncDto();
		BusinessDayDao srcBusinessDayDao = syncDto
				.getBusinessDayDao(mapper.convertValue(data.getData(), new TypeReference<BusinessDaySyncDto>() {
				}));
		Optional<BusinessDayDao> destBusinessDayDao = businessDayRepo.findById(srcBusinessDayDao.getId());
		if (!destBusinessDayDao.isPresent()) {
			int tempSrcDataSyncId = srcBusinessDayDao.getSrcSyncId();
			srcBusinessDayDao.setSrcSyncId(srcBusinessDayDao.getDestSyncId());
			srcBusinessDayDao.setDestSyncId(tempSrcDataSyncId);
			return srcBusinessDayDao;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcBusinessDayDao.getSrcSyncId(),
					srcBusinessDayDao.getDestSyncId(), destBusinessDayDao.get().getSrcSyncId(),
					destBusinessDayDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcBusinessDayDao.getSrcSyncId();
				srcBusinessDayDao.setSrcSyncId(srcBusinessDayDao.getDestSyncId());
				srcBusinessDayDao.setDestSyncId(tempSrcDataSyncId);
				return srcBusinessDayDao;
			}
		}
		return null;
	}

	/**
	 * @param businessDao
	 * @return 
	 */
	@Transactional(value="chainedTransaction")
	public Boolean dbOperation(BusinessDayDao businessDao, RevenueSummaryDao revenueSummaryDao) {
		Boolean flag = false;
		if (businessDao != null) {
			businessDayRepo.save(businessDao);
			flag = true;
		}
		if (revenueSummaryDao != null) {
			revenueSummaryRepo.save(revenueSummaryDao);
			flag = true;
		}
		return flag;
	}

}
