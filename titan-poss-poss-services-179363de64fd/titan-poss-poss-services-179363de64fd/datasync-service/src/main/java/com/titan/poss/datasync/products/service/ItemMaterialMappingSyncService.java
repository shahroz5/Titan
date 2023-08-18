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
import com.titan.poss.datasync.dao.ItemMaterialDatasyncStageDao;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.ItemMaterialStageDto;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.repository.ItemMaterialDatasyncStageRepository;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.ItemMaterialMappingDao;
import com.titan.poss.product.repository.ItemMaterialMappingRepository;
import com.titan.poss.product.sync.dto.ItemMaterialMappingSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ItemMaterialMappingSyncService implements SyncOperation {

	@Autowired
	private ItemMaterialMappingRepository itemMaterialRepository;

	@Autowired
	private ItemMaterialDatasyncStageRepository itemMaterialSyncStageRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	ItemMaterialMappingSyncService itemMaterialMappingSyncServic;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static final Logger LOGGER = LoggerFactory.getLogger(ItemMaterialMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		ObjectMapper mapper = new ObjectMapper();
		syncData.forEach(data -> {
			if (messageTransfer.getMessageTransferData().getOperation()
					.equals(ProductOperationCodes.ITEM_MATERIAL_MAPPING_ADD)) {
				List<ItemMaterialMappingDao> sourceImmList = getSourceList(data.getData());
				List<ItemMaterialMappingDao> destList = getDestinationList(sourceImmList);
				List<ItemMaterialMappingDao> deleteList = new ArrayList<>();
				List<ItemMaterialMappingDao> itemMaterialList = new ArrayList<>();
				compareBothList(sourceImmList, destList, itemMaterialList, deleteList);
				saveToDestinationDB(itemMaterialList, deleteList);
			} else if (messageTransfer.getMessageTransferData().getOperation()
					.equals(ProductOperationCodes.ITEM_MATERIAL_BULK)) {
				ItemMaterialStageDto stageDto = new ItemMaterialStageDto();
				List<ItemMaterialDatasyncStageDao> itemMaterialList = stageDto.getMaterialDatasyncStageDaoDaoList(
						mapper.convertValue(data.getData(), new TypeReference<List<ItemMaterialStageDto>>() {
						}));
				itemMaterialMappingSyncServic.saveItemMaterialToDestinationDB(itemMaterialList);
			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageTransfer.getMessageTransferData().getId(),
				messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param itemMaterialList
	 * @param messageId
	 */
	@Transactional
	public void saveItemMaterialToDestinationDB(List<ItemMaterialDatasyncStageDao> itemMaterialList) {
		try {
			String status = null;
			if (itemMaterialList.isEmpty()) {
				status = DatasyncStatusEnum.DISCARDED.name();
			} else {
				itemMaterialSyncStageRepository.saveAll(itemMaterialList);
				itemMaterialSyncStageRepository.flush();
				status = DatasyncStatusEnum.SYNCED.name();

				String correlationId = itemMaterialList.get(0).getCorrelationId();

				String itemMaterialMappingInsertSql = "Insert into products.dbo.item_material_mapping (id, item_code, no_of_materials, material_code, is_active,"
						+ "created_by, created_date, last_modified_by, last_modified_date,src_sync_id, dest_sync_id, correlation_id) "
						+ "SELECT id, item_code, no_of_materials, material_code, is_active,created_by, created_date, last_modified_by, last_modified_date, 0, 0, correlation_id FROM datasync.dbo.item_material_mapping_datasync_stage where correlation_id = '"
						+ correlationId + "'";

				String deleteItemMaterialMappingSql = "DELETE FROM products.dbo.item_material_mapping where item_code IN (SELECT item_code FROM datasync.dbo.item_material_mapping_datasync_stage where correlation_id = '"
						+ correlationId + "' GROUP BY item_code);";
				
				String deleteFromStageQuery = "DELETE from datasync.dbo.item_material_mapping_datasync_stage where correlation_id = '"
						+ correlationId + "'";
				jdbcTemplate.execute(deleteItemMaterialMappingSql);
				jdbcTemplate.execute(itemMaterialMappingInsertSql);
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

	/**
	 * @param sourceImmList
	 * @param destList
	 * @param dataSyncAuditList
	 * @param itemMaterialList
	 * @param deleteList
	 */
	private void compareBothList(List<ItemMaterialMappingDao> sourceImmList, List<ItemMaterialMappingDao> destList,
			List<ItemMaterialMappingDao> itemMaterialList, List<ItemMaterialMappingDao> deleteList) {
		for (ItemMaterialMappingDao srcImm : sourceImmList) {
			boolean isNew = true;
			for (ItemMaterialMappingDao destination : destList) {
				if (srcImm.getItem().getItemCode().equals(destination.getItem().getItemCode())
						//&& srcImm.getMaterial().getMaterialCode().equals(destination.getMaterial().getMaterialCode())
						) {
					if (srcImm.getCorrelationId() == null) {
						if (destination.getSyncTime() <= srcImm.getSyncTime()) {
							isNew = false;
							itemMaterialList.add(srcImm);
						} else {
							ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
						}
					}
					if ((!srcImm.getCorrelationId().equals(destination.getCorrelationId()))
							&& destination.getSyncTime() <= srcImm.getSyncTime()) {
						isNew = false;
						deleteList.add(destination);
						itemMaterialList.add(srcImm);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
					}
				}
			}
			if (isNew)
				itemMaterialList.add(srcImm);
		}

	}

	/**
	 * @param data
	 * @return List<ItemMaterialMappingDao>
	 */
	private List<ItemMaterialMappingDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		ItemMaterialMappingSyncDto itemSyncDto = new ItemMaterialMappingSyncDto();
		return itemSyncDto.getDao(mapper.convertValue(data, new TypeReference<List<ItemMaterialMappingSyncDto>>() {
		}));
	}

	/**
	 * @param sourceList
	 * @return List<ItemMaterialMappingDao>
	 */
	private List<ItemMaterialMappingDao> getDestinationList(List<ItemMaterialMappingDao> sourceList) {
		List<String> itemCodes = new ArrayList<>();
		sourceList.forEach(src -> itemCodes.add(src.getItem().getItemCode()));
		return itemMaterialRepository.findAllByItemItemCodeIn(itemCodes);
	}

	/**
	 * @param itemMaterialList
	 * @param deleteList
	 * @return DataSyncAuditDto
	 */
	@Transactional
	public DataSyncAuditDto saveToDestinationDB(List<ItemMaterialMappingDao> itemMaterialList,
			List<ItemMaterialMappingDao> deleteList) {

		DataSyncAuditDto dataSyncAudit = new DataSyncAuditDto();
		try {
			if (!deleteList.isEmpty()) {
				itemMaterialRepository.deleteAll(deleteList);
				itemMaterialRepository.flush();
			}
			if (!itemMaterialList.isEmpty())
				itemMaterialRepository.saveAll(itemMaterialList);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}
		return dataSyncAudit;
	}

}
