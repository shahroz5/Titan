/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.RuleLocationMappingDao;
import com.titan.poss.config.dto.RuleLocationMappingSyncDto;
import com.titan.poss.config.repository.RuleLocationMappingRepository;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
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
public class RuleLocationMappingSyncService implements SyncOperation {

	@Autowired
	RuleLocationMappingRepository ruleLocMappingRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(RuleLocationMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.RULE_LOC_MAPPING)) {

				ObjectMapper mapper = new ObjectMapper();
				RuleLocationMappingSyncDto ruleLocSyncDto = new RuleLocationMappingSyncDto();
				RuleLocationMappingDao srcRuleLocDao = ruleLocSyncDto.getRuleLocationMapping(
						mapper.convertValue(syncData.getData(), new TypeReference<RuleLocationMappingSyncDto>() {
						}));
				RuleLocationMappingDao destRuleLoc = ruleLocMappingRepository
						.findOneByRuleMasterDaoRuleIdDaoRuleTypeAndLocationCode(
								srcRuleLocDao.getRuleMasterDao().getRuleIdDao().getRuleType(),
								srcRuleLocDao.getLocationCode());

					saveToDestinationDB(srcRuleLocDao, syncData.getOrder(), destRuleLoc);
			}
		}

		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param srcRuleLocDao
	 * @param messageId
	 * @param order
	 */
	private void saveToDestinationDB(RuleLocationMappingDao srcRuleLocDao, int order,
			RuleLocationMappingDao destRuleLoc) {
		try {
			if (destRuleLoc == null && order == 1)
				ruleLocMappingRepository.save(srcRuleLocDao);
			if (destRuleLoc != null) {
				if (srcRuleLocDao.getSyncTime() >= destRuleLoc.getSyncTime()) {
					if (order == 1) {
						ruleLocMappingRepository.delete(destRuleLoc);
						ruleLocMappingRepository.flush();
						ruleLocMappingRepository.save(srcRuleLocDao);
					} else if (order == 0) {
						ruleLocMappingRepository.delete(destRuleLoc);
				}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			}


			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

}
