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
import com.titan.poss.datasync.dao.MaterialDatasyncStageDao;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MaterialSyncDto;
import com.titan.poss.datasync.dto.MaterialSyncStageDto;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.repository.MaterialDatasyncStageRepository;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.repository.MaterialRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class MaterialSyncService implements SyncOperation {

	@Autowired
	private MaterialRepository materialRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	MaterialSyncService materialSyncServic;

	@Autowired
	MaterialDatasyncStageRepository materialDatasyncStageRepository;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static final Logger LOGGER = LoggerFactory.getLogger(MaterialSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		List<MaterialDatasyncStageDao> srcMaterialDaos = new ArrayList<>();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();

			if (operationCode.equals(ProductOperationCodes.MATERIAL_ADD)
					|| operationCode.equals(ProductOperationCodes.MATERIAL_UPDATE)) {
				MaterialSyncDto materialSyncDto = new MaterialSyncDto();
				MaterialDao sourceMaterial = materialSyncDto
						.getMaterialDao(mapper.convertValue(data.getData(), new TypeReference<MaterialSyncDto>() {
						}));
				MaterialDao destinationItem = materialRepository
						.findOneByMaterialCode(sourceMaterial.getMaterialCode());

				if (destinationItem == null) {
					saveToDestinationDB(sourceMaterial, messageId);
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceMaterial, destinationItem);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					} else {

						saveToDestinationDB(sourceMaterial, messageId);

					}
				}

			} else if (operationCode.equals(ProductOperationCodes.MATERIAL_BULK)) {
				MaterialSyncStageDto materialSyncStageDto = new MaterialSyncStageDto();
				MaterialDatasyncStageDao sourceMaterialStaging = materialSyncStageDto.getMaterialDatasyncStageDao(
						mapper.convertValue(data.getData(), new TypeReference<MaterialSyncStageDto>() {
						}));
				// default transfer type
				sourceMaterialStaging.setTransferType("UPDATE");
				srcMaterialDaos.add(sourceMaterialStaging);

			}
		});
		if (operationCode.equals(ProductOperationCodes.MATERIAL_BULK))
			materialSyncServic.saveMaterialBulkListToDestinationDB(srcMaterialDaos, messageId,
				messageTransfer.getMessageTransferData().getDestination());
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param srcItemsDaos
	 * @param messageId
	 * @param dest 
	 */
	@Transactional
	public void saveMaterialBulkListToDestinationDB(List<MaterialDatasyncStageDao> srcMaterialDaos, String messageId, String dest) {
		try {
			String status = null;
			if (srcMaterialDaos.isEmpty()) {
				status = DatasyncStatusEnum.DISCARDED.name();
			} else {
				materialDatasyncStageRepository.saveAll(srcMaterialDaos);
				materialDatasyncStageRepository.flush();
				status = DatasyncStatusEnum.SYNCED.name();

				String itemMasterUpdateSql = "update datasync.dbo.material_master_datasync_stage set transfer_type = 'INSERT' "
						+ "where correlation_id = '" + srcMaterialDaos.get(0).getCorrelationId()
						+ "' and material_code not in  "
						+ "(select material_code from products.dbo.material_master im )";

				String insert = "insert into products.dbo.material_master(material_code, material_type_code, "
						+ "std_weight, std_value, rate_per_gram, color, quality, shape, config_details, weight_unit, currency_code, is_active, created_by, created_date, last_modified_by,"
						+ "last_modified_date, src_sync_id, dest_sync_id,correlation_id)\r\n"
						+ "SELECT material_code,material_type_code, std_weight, std_value, rate_per_gram, color, quality, shape, config_details, weight_unit, currency_code, is_active, created_by, created_date,last_modified_by,\r\n"
						+ "last_modified_date, 0, 0, correlation_id FROM datasync.dbo.material_master_datasync_stage\r\n"
						+ "where correlation_id = '" + srcMaterialDaos.get(0).getCorrelationId()
						+ "' AND transfer_type = 'INSERT'";

				String update = "update products.dbo.material_master \r\n"
						+ "set material_code=t2.material_code,color=t2.color,std_weight=t2.std_weight,material_type_code=t2.material_type_code,quality=t2.quality,shape=t2.shape,\r\n"
						+ "std_value=t2.std_value,rate_per_gram=t2.rate_per_gram,config_details=t2.config_details,is_active='true',\r\n"
						+ "created_by=t2.created_by,created_date=t2.created_date,last_modified_by=t2.last_modified_by,last_modified_date=t2.last_modified_date,currency_code=t2.currency_code,"
						+ "weight_unit=t2.weight_unit\r\n"
						+ ",src_sync_id=t2.dest_sync_id, dest_sync_id=t2.src_sync_id,correlation_id=t2.correlation_id\r\n"
						+ "from products.dbo.material_master t1\r\n"
						+ "inner join datasync.dbo.material_master_datasync_stage t2\r\n"
						+ "on t1.material_code = t2.material_code where t2.correlation_id ='"
						+ srcMaterialDaos.get(0).getCorrelationId() + "' and t2.transfer_type = 'UPDATE' and \r\n"
						+ "t1.dest_sync_id < t2.src_sync_id ";

				String deleteFromStageQuery = "DELETE from datasync.dbo.material_master_datasync_stage where correlation_id = '"
						+ srcMaterialDaos.get(0).getCorrelationId() + "'";
				jdbcTemplate.execute(itemMasterUpdateSql);
				jdbcTemplate.execute(insert);
				jdbcTemplate.execute(update);
				jdbcTemplate.execute(deleteFromStageQuery);
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
	public void saveToDestinationDB(MaterialDao sourceMaterial, String messageId) {

		int tempSrcDataSyncId = sourceMaterial.getSrcSyncId();
		sourceMaterial.setSrcSyncId(sourceMaterial.getDestSyncId());
		sourceMaterial.setDestSyncId(tempSrcDataSyncId);
		try {
			materialRepository.save(sourceMaterial);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(MaterialDao src, MaterialDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
