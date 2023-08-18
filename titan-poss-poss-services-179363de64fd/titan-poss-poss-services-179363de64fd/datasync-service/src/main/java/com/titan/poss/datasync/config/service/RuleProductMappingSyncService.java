/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

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
import com.titan.poss.config.dao.RuleProductDao;
import com.titan.poss.config.dto.RuleProductMappingSyncDto;
import com.titan.poss.config.repository.RuleProductMappingRepository;
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
public class RuleProductMappingSyncService implements SyncOperation {

	@Autowired
	private RuleProductMappingRepository ruleProductRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(RuleProductMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.RULE_PGRP_MAPPING)) {
				List<RuleProductDao> sourceList = getSourceList(syncData.getData());
				compareListsAndSave(sourceList, syncData.getOrder());
			}
		}
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param sourceList
	 * @param destList
	 * @param messageId
	 * @param order
	 */
	@Transactional
	public void compareListsAndSave(List<RuleProductDao> sourceList, int order) {
		List<RuleProductDao> rpmList = new ArrayList<>();
		List<RuleProductDao> rpmDeleteList = new ArrayList<>();
		for (RuleProductDao rulePrdGrpMapping : sourceList) {
			RuleProductDao destination = getDestination(rulePrdGrpMapping);
			if (destination != null) {
				if (rulePrdGrpMapping.getSyncTime() >= destination.getSyncTime()) {
					if (order == 0)
						rpmDeleteList.add(destination);
					else if (order == 1) {
						rpmDeleteList.add(destination);
						rpmList.add(rulePrdGrpMapping);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				rpmList.add(rulePrdGrpMapping);
			}
		}
		saveToDestinationDB(rpmList, order, rpmDeleteList);
	}

	/**
	 * @param rulePrdGrpMapping
	 * @return
	 */
	private RuleProductDao getDestination(RuleProductDao rulePrdGrpMapping) {
		String rangeId = null;
		RuleProductDao destination = null;
		if (rulePrdGrpMapping.getRangeId() != null) {
			rangeId = rulePrdGrpMapping.getRangeId().getId();
			destination = ruleProductRepository.findRuleProductMapping(
					rulePrdGrpMapping.getRuleMasterDao().getRuleIdDao().getRuleType(),
					rulePrdGrpMapping.getRuleMasterDao().getRuleIdDao().getRuleId(),
					rulePrdGrpMapping.getProductGroupCode(), rulePrdGrpMapping.getProductCategoryCode(), rangeId);
		} else {
			destination = ruleProductRepository.findMappedProduct(
					rulePrdGrpMapping.getRuleMasterDao().getRuleIdDao().getRuleType(),
					rulePrdGrpMapping.getRuleMasterDao().getRuleIdDao().getRuleId(),
					rulePrdGrpMapping.getProductGroupCode(), rulePrdGrpMapping.getProductCategoryCode());
		}
		return destination;
	}

	/**
	 * @param ruleProductMapping
	 * @param order
	 * @param rpmDeleteList
	 */
	@Transactional
	public void saveToDestinationDB(List<RuleProductDao> ruleProductMapping, int order,
			List<RuleProductDao> rpmDeleteList) {
		try {
			if (order == 0)
				ruleProductRepository.deleteAll(rpmDeleteList);
			else if (order == 1) {
				if (!rpmDeleteList.isEmpty()) {
					ruleProductRepository.deleteAll(rpmDeleteList);
					ruleProductRepository.flush();
				}
				ruleProductRepository.saveAll(ruleProductMapping);
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
	 * @return List<RuleProductDao>
	 */
	private List<RuleProductDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		RuleProductMappingSyncDto syncDto = new RuleProductMappingSyncDto();
		return syncDto.getDaoList(mapper.convertValue(data, new TypeReference<List<RuleProductMappingSyncDto>>() {
		}));
	}

}
