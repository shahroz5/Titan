/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.products.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dao.StoneDataSyncStageDao;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.dto.StoneSyncStageDto;
import com.titan.poss.datasync.repository.StoneDatasyncStageRepository;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.repository.StoneRepository;
import com.titan.poss.product.sync.dto.StoneSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StoneSyncService implements SyncOperation {

	@Autowired
	private StoneRepository stoneRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	StoneSyncService stoneSyncServic;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private StoneDatasyncStageRepository stoneDatasyncStageRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(StoneSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		List<StoneDataSyncStageDao> srcStoneDaos = new ArrayList<>();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();

			if (operationCode.equals(ProductOperationCodes.STONE_ADD)
					|| operationCode.equals(ProductOperationCodes.STONE_UPDATE)) {
				StoneSyncDto stoneSyncDto = new StoneSyncDto();
				StoneDao sourceStone = stoneSyncDto
						.getStoneDao(mapper.convertValue(data.getData(), new TypeReference<StoneSyncDto>() {
						}));
				StoneDao destinationStone = stoneRepository.findOneByStoneCode(sourceStone.getStoneCode());

				if (destinationStone == null) {
					saveToDestinationDB(sourceStone, messageId);
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceStone, destinationStone);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {
						saveToDestinationDB(sourceStone, messageId);
					}
				}
			} else if (operationCode.equals(ProductOperationCodes.STONE_BULK)) {
				StoneSyncStageDto syncStageDto = new StoneSyncStageDto();
				StoneDataSyncStageDao sourceMaterialStaging = syncStageDto.getStoneDataSyncStageDao(
						mapper.convertValue(data.getData(), new TypeReference<StoneSyncStageDto>() {
						}));
				// default transfer type
				sourceMaterialStaging.setTransferType("UPDATE");
				srcStoneDaos.add(sourceMaterialStaging);

			}
		});
		if (operationCode.equals(ProductOperationCodes.STONE_BULK))
			stoneSyncServic.saveStoneBulkListToDestinationDB(srcStoneDaos, messageId);
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param srcStoneDaos
	 * @param messageId
	 */
	@Transactional
	public void saveStoneBulkListToDestinationDB(List<StoneDataSyncStageDao> srcStoneDaos, String messageId) {
		try {
			String status = null;
			if (srcStoneDaos.isEmpty()) {
				status = DatasyncStatusEnum.DISCARDED.name();
			} else {
				stoneDatasyncStageRepository.saveAll(srcStoneDaos);
				stoneDatasyncStageRepository.flush();
				status = DatasyncStatusEnum.SYNCED.name();

				String correlationId = srcStoneDaos.get(0).getCorrelationId();

				// @formatter:off

				String updateStatusOfInsertFlowRecords = "update datasync.dbo.stone_master_datasync_stage set transfer_type = 'INSERT' where  correlation_id = '"
						+ correlationId + "' and \r\n"
						+ "stone_code not in  (select stone_code from products.dbo.stone_master sm)";

				String stoneMasterInsertSql = "insert into products.dbo.stone_master(stone_code, stone_type_code, "
						+ "std_weight, std_value, rate_per_carat, color, quality, shape, config_details, weight_unit, currency_code, is_active, created_by, created_date, last_modified_by,"
						+ "last_modified_date, src_sync_id, dest_sync_id,correlation_id)\r\n"
						+ "SELECT stone_code,stone_type_code, std_weight, std_value, rate_per_carat, color, quality, shape, config_details, weight_unit , currency_code, is_active, created_by, created_date,last_modified_by,\r\n"
						+ "last_modified_date, 0, 0, correlation_id FROM datasync.dbo.stone_master_datasync_stage\r\n"
						+ "where correlation_id = '" + correlationId + "' AND transfer_type = 'INSERT'";

				String stoneMasterUpsertSql = "update products.dbo.stone_master \r\n"
						+ "set color=t2.color,std_weight=t2.std_weight,stone_type_code=t2.stone_type_code,quality=t2.quality,\r\n"
						+ "shape=t2.shape,std_value=t2.std_value,rate_per_carat=t2.rate_per_carat,config_details=t2.config_details,is_active=t2.is_active,\r\n"
						+ "created_by=t2.created_by,created_date=t2.created_date,last_modified_by=t2.last_modified_by,last_modified_date=t2.last_modified_date\r\n"
						+ ",currency_code=t2.currency_code, weight_unit=t2.weight_unit, src_sync_id=t2.dest_sync_id, dest_sync_id=t2.src_sync_id, \r\n"
						+ "correlation_id=t2.correlation_id\r\n" + "from products.dbo.stone_master t1\r\n"
						+ "inner join datasync.dbo.stone_master_datasync_stage t2\r\n"
						+ "on t1.stone_code = t2.stone_code where t2.correlation_id ='" + correlationId+ "' and t2.transfer_type = 'UPDATE' and t1.dest_sync_id < t2.src_sync_id";
				// @formatter:on
				jdbcTemplate.execute(updateStatusOfInsertFlowRecords);
				jdbcTemplate.execute(stoneMasterInsertSql);
				jdbcTemplate.execute(stoneMasterUpsertSql);
			}

			ReceiverUtil.addToDataSyncAuditDto(status, null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	@Transactional
	public void saveToDestinationDB(StoneDao sourceStone, String messageId) {

		int tempSrcDataSyncId = sourceStone.getSrcSyncId();
		sourceStone.setSrcSyncId(sourceStone.getDestSyncId());
		sourceStone.setDestSyncId(tempSrcDataSyncId);
		try {
			stoneRepository.save(sourceStone);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(StoneDao src, StoneDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
