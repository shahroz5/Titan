/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.context.annotation.Bean;

import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.file.dto.ItemGroupLevelDiscountDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

//@Configuration
public class ItemGroupLevelDiscountJobWriter {

	@Bean()
	public ItemWriter<DiscountItemMappingDao> itemGroupLevelDiscountIngestionWriter(DataSource dataSource,
			String discount) {
		JdbcBatchItemWriter<DiscountItemMappingDao> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		String sql = null;
		sql = "IF NOT EXISTS (SELECT * FROM configs.dbo.discount_item_mapping where item_code = :itemCode AND discount_id = :discount.id AND lot_number = :lotNumber AND location_code = :locationCode AND start_date = :startDate AND end_date = :endDate)"
				+ "INSERT INTO configs.dbo.discount_item_mapping(id,item_code,lot_number,location_code,is_active,created_by,created_date,last_modified_by ,last_modified_date ,discount_id ,start_date,end_date,preview_start_date,preview_end_date,preview_config_details,regular_config_details,is_transferred_location ,is_preview_applicable, correlation_id, src_sync_id, dest_sync_id)"
				+ "VALUES(:id, :itemCode, :lotNumber, :locationCode, :isActive, :createdBy,:createdDate,:lastModifiedBy ,:lastModifiedDate ,:discount.id ,:startDate, :endDate, :previewStartDate, :previewEndDate, :previewConfigDetails, :regularConfigDetails, :isTransferredLocation , :isPreviewApplicable, :correlationId, :srcSyncId, :destSyncId) "
				+ "ELSE UPDATE configs.dbo.discount_item_mapping set is_active = :isActive ,created_by = :createdBy, created_date =:createdDate, last_modified_by =:lastModifiedBy,last_modified_date =:lastModifiedDate, "
				+ "correlation_id = :correlationId ,src_sync_id = (discount_item_mapping.src_sync_id + 1), dest_sync_id =:destSyncId,start_date=:startDate,end_date=:endDate,preview_start_date=:previewStartDate,preview_end_date=:previewEndDate,preview_config_details=:previewConfigDetails,regular_config_details=:regularConfigDetails,is_transferred_location=:isTransferredLocation ,is_preview_applicable=:isPreviewApplicable WHERE item_code = :itemCode AND discount_id = :discount.id AND lot_number = :lotNumber AND location_code = :locationCode AND start_date = :startDate AND end_date = :endDate ;";
		itemWriter.setSql(sql);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<DiscountItemMappingDao>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<ItemGroupLevelDiscountDto> itemGroupLevelDiscountStagingWriter(DataSource dataSource) {

		JdbcBatchItemWriter<ItemGroupLevelDiscountDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into discount_item_mapping_stage (id,discount_code,item_code,lot_number,location_code,regular_f1_is_percent,regular_f1_value,regular_f2_is_percent,regular_f2_value,regular_ucp_is_percent,regular_ucp_value,regular_v_is_percent,regular_v_value,regular_weight_value,regular_is_gross_weight,regular_start_date,regular_end_date,is_transferred_location,is_preview_applicable,preview_f1_is_percent,preview_f1_value,preview_f2_is_percent,preview_f2_value,preview_ucp_is_percent,preview_ucp_value,preview_v_is_percent,preview_v_value,preview_is_gross_weight,preview_weight_value,preview_start_date,preview_end_date,is_active,login_id,created_date,last_modified_id,last_modified_date,file_audit_id) values (NEWID(),:discountCode,:itemCode,:lotNumber,:locationCode,:regularF1IsPercent,:regularF1Value,:regularF2IsPercent,:regularF2Value,:regularUcpIsPercent,:regularUcpValue,:regularVIsPercent,:regularVValue,:regularWeightValue,:regularIsGrossWeight,:regularStartDate,:regularEndDate,:isTransferredLocation,:isPreviewApplicable,:previewF1IsPercent,:previewF1Value,:previewF2IsPercent,:previewF2Value,:previewUcpIsPercent,:previewUcpValue,:previewVIsPercent,:previewVValue,:previewIsGrossWeight,:previewWeightValue,:previewStartDate,:previewEndDate ,:isActive,:loginId, :createdDate, :lastModifiedId, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<ItemGroupLevelDiscountDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}
}
