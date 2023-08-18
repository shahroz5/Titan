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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.CardDetailsDto;
import com.titan.poss.payment.dao.CashbackCardDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class CardDetailsJobWriter {

	@Bean()
	public ItemWriter<CashbackCardDetailsDao> cardDetailsIngestionWriter(DataSource dataSource) {
		JdbcBatchItemWriter<CashbackCardDetailsDao> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"IF NOT EXISTS (SELECT * FROM payments.dbo.cashback_card_details where cashback_id = :cashbackDao.id AND"
						+ " card_no = :cardNo)Insert into payments.dbo.cashback_card_details"
						+ " (id,cashback_id,card_no,is_active,created_by, created_date, last_modified_by, last_modified_date, src_sync_id, dest_sync_id, correlation_id ) "
						+ "values (:id, :cashbackDao.id ,:cardNo, :isActive, :createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate, :srcSyncId, :destSyncId, :correlationId)"
						+ " ELSE"
						+ " UPDATE payments.dbo.cashback_card_details set id= :id, cashback_id = :cashbackDao.id, card_no = :cardNo ,"
						+ " is_active = :isActive,created_by = :createdBy, created_date =:createdDate, last_modified_by =:lastModifiedBy,"
						+ " last_modified_date =:lastModifiedDate,src_sync_id = (cashback_card_details.src_sync_id + 1), dest_sync_id =:destSyncId, correlation_id = :correlationId where cashback_id = :cashbackDao.id AND card_no = :cardNo ;");

		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<CashbackCardDetailsDao>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}
	@Bean(destroyMethod = "")
	@StepScope
	public ItemWriter<CardDetailsDto> cardDetailsStagingWriter(
			@Value("#{jobParameters['cashbackId']}") String cashbackId, DataSource dataSource) {

		JdbcBatchItemWriter<CardDetailsDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(
				"Insert into card_details_stage (id,cashback_id,card_no,is_active,created_by,created_date,last_modified_by,last_modified_date,file_audit_id) values (NEWID(),'"+ cashbackId + "',:cardNo,:isActive,:createdBy, :createdDate, :lastModifiedBy, :lastModifiedDate,:fileAuditId)");
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<CardDetailsDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
