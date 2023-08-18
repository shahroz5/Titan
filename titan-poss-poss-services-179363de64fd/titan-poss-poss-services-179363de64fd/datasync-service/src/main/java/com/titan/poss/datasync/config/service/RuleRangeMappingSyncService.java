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
import com.titan.poss.config.dao.RuleRangeDao;
import com.titan.poss.config.dto.RuleRangeSyncDto;
import com.titan.poss.config.repository.RuleRangeMappingRepository;
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
public class RuleRangeMappingSyncService implements SyncOperation {

	@Autowired
	private RuleRangeMappingRepository ruleRangeMappingRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(RuleRangeMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.RULE_RANGE_MAPPING)) {
				List<RuleRangeDao> sourceList = getSourceList(syncData.getData());
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
	public void compareListsAndSave(List<RuleRangeDao> sourceList, int order) {
		List<RuleRangeDao> rrmList = new ArrayList<>();
		List<RuleRangeDao> rrmDeleteList = new ArrayList<>();
		for (RuleRangeDao ruleRangeMapping : sourceList) {
			RuleRangeDao destination = getDestination(ruleRangeMapping);
			if (destination != null) {
				if (ruleRangeMapping.getSyncTime() >= destination.getSyncTime()) {
					if (order == 0)
						rrmDeleteList.add(destination);
					else if (order == 1) {
						rrmDeleteList.add(destination);
						rrmList.add(ruleRangeMapping);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				rrmList.add(ruleRangeMapping);
			}
		}
		saveToDestinationDB(rrmList, order, rrmDeleteList);
	}

	/**
	 * @param rulePrdGrpMapping
	 * @return RuleRangeDao
	 */
	private RuleRangeDao getDestination(RuleRangeDao ruleRangeMapping) {

		return ruleRangeMappingRepository.findRuleRangeMapping(
				ruleRangeMapping.getRuleMasterDao().getRuleIdDao().getRuleType(),
				ruleRangeMapping.getRuleMasterDao().getRuleIdDao().getRuleId(), ruleRangeMapping.getRangeId().getId(),
				ruleRangeMapping.getMetalType());
	}

	/**
	 * @param ruleProductMapping
	 * @param order
	 * @param rpmDeleteList
	 */
	public void saveToDestinationDB(List<RuleRangeDao> ruleRangeMapping, int order,
			List<RuleRangeDao> rpmDeleteList) {
		try {
			if (order == 0)
				ruleRangeMappingRepository.deleteAll(rpmDeleteList);
			else if (order == 1) {
				if (!rpmDeleteList.isEmpty()) {
					ruleRangeMappingRepository.deleteAll(rpmDeleteList);
					ruleRangeMappingRepository.flush();
				}
				ruleRangeMappingRepository.saveAll(ruleRangeMapping);
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
	private List<RuleRangeDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		RuleRangeSyncDto syncDto = new RuleRangeSyncDto();
		return syncDto.getDaoList(mapper.convertValue(data, new TypeReference<List<RuleRangeSyncDto>>() {
		}));
}
}
