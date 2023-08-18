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
import com.titan.poss.datasync.dao.ItemStoneDatasyncStageDao;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.ItemStoneStageDto;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.repository.ItemStoneDatasyncStageRepository;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.repository.ItemStoneMappingRepository;
import com.titan.poss.product.sync.dto.ItemStoneMappingSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ItemStoneMappingSyncService implements SyncOperation {

	@Autowired
	private ItemStoneMappingRepository itemStoneRepository;

	@Autowired
	private ItemStoneDatasyncStageRepository itemStoneDatasyncStageRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	ItemStoneMappingSyncService itemStoneMappingSyncServic;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static final Logger LOGGER = LoggerFactory.getLogger(ItemStoneMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		ObjectMapper mapper = new ObjectMapper();
		syncData.forEach(data -> {
			if (messageTransfer.getMessageTransferData().getOperation()
					.equals(ProductOperationCodes.ITEM_STONE_MAPPING_ADD)) {
				List<ItemStoneMappingDao> sourceList = getSourceList(data.getData());
				List<ItemStoneMappingDao> destList = getDestinationList(sourceList);
				List<ItemStoneMappingDao> itemStoneList = new ArrayList<>();
				List<ItemStoneMappingDao> deleteList = new ArrayList<>();
				compareBothList(sourceList, destList, itemStoneList, deleteList);
				saveToDestinationDB(itemStoneList, deleteList);
			} else if (messageTransfer.getMessageTransferData().getOperation()
					.equals(ProductOperationCodes.ITEM_STONE_BULK)) {
				ItemStoneStageDto stageDto = new ItemStoneStageDto();
				List<ItemStoneDatasyncStageDao> itemMaterialList = stageDto.getMaterialDatasyncStageDaoDaoList(
						mapper.convertValue(data.getData(), new TypeReference<List<ItemStoneStageDto>>() {
						}));
				itemStoneMappingSyncServic.saveItemStoneToDestinationDB(itemMaterialList);
			}

		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageTransfer.getMessageTransferData().getId(),
				messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param itemMaterialList
	 */
	@Transactional
	public void saveItemStoneToDestinationDB(List<ItemStoneDatasyncStageDao> itemStoneList) {
		try {
			String status = null;
			if (itemStoneList.isEmpty()) {
				status = DatasyncStatusEnum.DISCARDED.name();
			} else {
				itemStoneDatasyncStageRepository.saveAll(itemStoneList);
				itemStoneDatasyncStageRepository.flush();
				status = DatasyncStatusEnum.SYNCED.name();

				String correlationId = itemStoneList.get(0).getCorrelationId();

				String itemStoneMappingInsertSql = "Insert into products.dbo.item_stone_mapping (id, item_code, no_of_stones, stone_code, is_active,"
						+ "created_by, created_date, last_modified_by, last_modified_date,src_sync_id, dest_sync_id, correlation_id) "
						+ "SELECT id, item_code, no_of_stones, stone_code, is_active,created_by, created_date, last_modified_by, last_modified_date, 0, 0, correlation_id FROM datasync.dbo.item_stone_mapping_datasync_stage where correlation_id = '"
						+ correlationId + "'";

				String deleteItemStoneMappingSql = "DELETE FROM products.dbo.item_stone_mapping where item_code IN (SELECT item_code FROM datasync.dbo.item_stone_mapping_datasync_stage where correlation_id = '"
						+ correlationId + "' GROUP BY item_code);";
				
				String deleteFromStageQuery = "DELETE from datasync.dbo.item_stone_mapping_datasync_stage where correlation_id = '"
						+ correlationId + "'";
				jdbcTemplate.execute(deleteItemStoneMappingSql);
				jdbcTemplate.execute(itemStoneMappingInsertSql);
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
	 * @param sourceList
	 * @param destList
	 * @param deleteList
	 * @param itemStoneList
	 * @param dataSyncAuditList
	 */
	private void compareBothList(List<ItemStoneMappingDao> sourceList, List<ItemStoneMappingDao> destList,
			List<ItemStoneMappingDao> itemStoneList, List<ItemStoneMappingDao> deleteList) {
		for (ItemStoneMappingDao src : sourceList) {
			boolean isNew = true;
			for (ItemStoneMappingDao destination : destList) {
				if (src.getItem().getItemCode().equals(destination.getItem().getItemCode())
						&& src.getStone().getStoneCode().equals(destination.getStone().getStoneCode())) {
					if (src.getCorrelationId() == null) {
						if (destination.getSyncTime() <= src.getSyncTime()) {
							isNew = false;
							itemStoneList.add(src);
						} else {
							ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
						}
					}
					if ((!src.getCorrelationId().equals(destination.getCorrelationId()))
							&& destination.getSyncTime() <= src.getSyncTime()) {
						isNew = false;
						deleteList.add(destination);
						itemStoneList.add(src);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
					}
				}
			}
			if (isNew)
				itemStoneList.add(src);
		}
	}

	/**
	 * @param data
	 * @return
	 */
	private List<ItemStoneMappingDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		ItemStoneMappingSyncDto itemSyncDto = new ItemStoneMappingSyncDto();
		return itemSyncDto.getDao(mapper.convertValue(data, new TypeReference<List<ItemStoneMappingSyncDto>>() {
		}));
	}

	/**
	 * @param sourceList
	 * @return List<ItemStoneMappingDao>
	 */
	private List<ItemStoneMappingDao> getDestinationList(List<ItemStoneMappingDao> sourceList) {
		List<String> itemCodes = new ArrayList<>();
		sourceList.forEach(src -> itemCodes.add(src.getItem().getItemCode()));
		return itemStoneRepository.findAllByItemItemCodeIn(itemCodes);
	}

	/**
	 * @param itemStoneList
	 * @param deleteList
	 */
	@Transactional
	public DataSyncAuditDto saveToDestinationDB(List<ItemStoneMappingDao> itemStoneList,
			List<ItemStoneMappingDao> deleteList) {
		DataSyncAuditDto dataSyncAudit = new DataSyncAuditDto();
		try {
			if (!deleteList.isEmpty()) {
				itemStoneRepository.deleteAll(deleteList);
				itemStoneRepository.flush();
			}
			if (!itemStoneList.isEmpty())
				itemStoneRepository.saveAll(itemStoneList);
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
