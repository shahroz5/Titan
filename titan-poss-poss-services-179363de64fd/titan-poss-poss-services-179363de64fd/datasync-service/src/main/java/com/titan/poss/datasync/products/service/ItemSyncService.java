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
import com.titan.poss.datasync.dao.ItemDatasyncStageDao;
import com.titan.poss.datasync.dto.ItemBulkSyncDto;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.repository.ItemDatasyncStageRepository;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ItemSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	ItemDatasyncStageRepository itemDatasyncStageRepository;

	@Autowired
	ItemSyncService itemService;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static final Logger LOGGER = LoggerFactory.getLogger(ItemSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		List<ItemDatasyncStageDao> srcItemsDaos = new ArrayList<>();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ProductOperationCodes.ITEM_ADD)
					|| operationCode.equals(ProductOperationCodes.ITEM_UPDATE)
					|| operationCode.equals(ProductOperationCodes.ITEM_BULK)) {
				ItemBulkSyncDto itemBulkSyncDto = new ItemBulkSyncDto();
				ItemDatasyncStageDao sourceItem = itemBulkSyncDto
						.getItemDao(mapper.convertValue(data.getData(), new TypeReference<ItemBulkSyncDto>() {
						}));
				// default transfer type
				sourceItem.setTransferType("UPDATE");
				srcItemsDaos.add(sourceItem);
			}
		});
		itemService.saveToDestinationDB(srcItemsDaos, messageId,
				messageTransfer.getMessageTransferData().getDestination());
	}

	@Transactional
	public void saveToDestinationDB(List<ItemDatasyncStageDao> itemsList, String messageId, String dest) {

		try {
			String status = null;
			if (itemsList.isEmpty()) {
				status = DatasyncStatusEnum.DISCARDED.name();
			} else {
				itemDatasyncStageRepository.saveAll(itemsList);
				itemDatasyncStageRepository.flush();
				status = DatasyncStatusEnum.SYNCED.name();

				String itemMasterUpdateSql = "update datasync.dbo.item_master_datasync_stage set transfer_type = 'INSERT' "
						+ "where correlation_id = '" + itemsList.get(0).getCorrelationId() + "' and item_code not in  "
						+ "(select item_code from products.dbo.item_master im )";

				String insert = "insert into products.dbo.item_master(item_code, stone_weight, diamond_caratage, diamond_color, diamond_clarity, stone_combination,product_type, description, std_weight, std_value, complexity_code, product_group_code, product_category_code,\r\n"
						+ "                brand_code, item_type_code, purity, karat , pricing_group_type, pricing_type, stone_charges, lead_time, org_code, parent_item_code,  \r\n"
						+ "                item_details, config_details, is_active, created_by, created_date, last_modified_by, last_modified_date, is_editable, tax_class_code, \r\n"
						+ "            currency_code, weight_unit, src_sync_id, dest_sync_id, is_foc_item, price_factor, correlation_id, is_saleable, is_returnable, hsn_sac_code,tot_category)\r\n"
						+ "            SELECT item_code, stone_weight, diamond_caratage, diamond_color, diamond_clarity, stone_combination,product_type, description, std_weight, std_value, complexity_code, product_group_code, product_category_code,\r\n"
						+ "                brand_code, item_type_code, purity, karat , pricing_group_type, pricing_type, stone_charges, lead_time, org_code, parent_item_code,  \r\n"
						+ "                item_details, config_details, is_active, created_by, created_date, last_modified_by, last_modified_date, is_editable, tax_class_code, \r\n"
						+ "            currency_code, weight_unit, src_sync_id, dest_sync_id, is_foc_item, price_factor, correlation_id, is_saleable, is_returnable, hsn_sac_code,tot_category FROM datasync.dbo.item_master_datasync_stage \r\n"
						+ "                where correlation_id = '" + itemsList.get(0).getCorrelationId()
						+ "' AND transfer_type = 'INSERT'";

				String update = "update products.dbo.item_master \r\n"
						+ "                set description=t2.description, \r\n"
						+ "                std_weight=t2.std_weight, \r\n"
						+ "                std_value=t2.std_value, \r\n"
						+ "                complexity_code=t2.complexity_code, \r\n"
						+ "                product_group_code=t2.product_group_code, product_category_code=t2.product_category_code, \r\n"
						+ "                brand_code=t2.brand_code, item_type_code = t2.item_type_code , purity=t2.purity, karat =t2.karat, \r\n"
						+ "                pricing_group_type=t2.pricing_group_type, \r\n"
						+ "                pricing_type=t2.pricing_type, stone_charges=t2.stone_charges, lead_time=t2.lead_time, org_code=t2.org_code ,\r\n"
						+ "                parent_item_code=t2.parent_item_code,  \r\n"
						+ "                item_details=t2.item_details, config_details=t2.config_details, is_active=t2.is_active , created_by=t2.created_by ,\r\n"
						+ "                created_date=t2.created_date, last_modified_by=t2.last_modified_by, \r\n"
						+ "                last_modified_date=t2.last_modified_date, is_editable=t2.is_editable , tax_class_code=t2.tax_class_code, \r\n"
						+ "                currency_code=t2.currency_code , weight_unit=t2.weight_unit , src_sync_id=t2.dest_sync_id, dest_sync_id=t2.src_sync_id ,\r\n"
						+ "                is_foc_item=t2.is_foc_item, price_factor=t2.price_factor, \r\n"
						+ "                correlation_id=t2.correlation_id, is_saleable=t2.is_saleable, is_returnable=t2.is_returnable, hsn_sac_code =t2.hsn_sac_code \r\n"
						+ "                from products.dbo.item_master t1 \r\n"
						+ "                inner join datasync.dbo.item_master_datasync_stage t2 \r\n"
						+ "                on t1.item_code = t2.item_code where t2.correlation_id ='"
						+ itemsList.get(0).getCorrelationId() + "' and t2.transfer_type = 'UPDATE' and \r\n"
						+ "                t1.dest_sync_id < t2.src_sync_id ";

				String deleteFromStageQuery = "DELETE from datasync.dbo.item_master_datasync_stage where correlation_id = '"
						+ itemsList.get(0).getCorrelationId() + "'";
				jdbcTemplate.execute(itemMasterUpdateSql);
				jdbcTemplate.execute(insert);
				jdbcTemplate.execute(update);
				jdbcTemplate.execute(deleteFromStageQuery);
			}

			datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, status);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId, dest,
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId, dest,
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}

	}

}
