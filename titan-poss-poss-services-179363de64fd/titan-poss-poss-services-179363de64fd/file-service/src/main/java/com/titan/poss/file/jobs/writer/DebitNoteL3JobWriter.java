package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.file.FlatFileItemWriter;
import org.springframework.batch.item.file.transform.BeanWrapperFieldExtractor;
import org.springframework.batch.item.file.transform.DelimitedLineAggregator;
import org.springframework.batch.item.file.transform.FieldExtractor;
import org.springframework.batch.item.file.transform.LineAggregator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.file.dto.DebitNoteDto;
import com.titan.poss.file.service.FileService;

@Configuration
public class DebitNoteL3JobWriter {
	private static final String FILES_BASE_FOLDER = "files.baseFolder";

	private static final String OUTPUT_FILE_PATH = "debit.note.lthree.completed.path"; 

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcBatchItemWriter<DebitNoteDto> debitNoteL3StagingWriter(
			@Value("#{jobExecutionContext['debitNoteL3TransactionId']}") String fileId,
			@Value("#{jobExecutionContext['fileName']}") String fileName, DataSource dataSource) {
		String debitNoteL3FileName = fileName.substring(0, fileName.indexOf('.'));
		String debitNoteL3StageInsertQuery = "INSERT into debitnote_level_three_stage(trx_date, gi_date, reference, reference1, blank1, currency, source, transaction_type, customer_no, customer_name, salesrep_name, memo_line, qty, amount1, amount2, blank2, purchase_order, btq_code, line, payment_term, org, location1, record_id, location2, date, file_ref, file_id)"
				+ "values (:trxDate,:giDate,:reference,:reference1,:blank1,:currency,:source,:transactionType,:customerNo,:customerName,:salesrepName,:memoLine,:qty,:amount1,:amount2,:blank2,:purchaseOrder, :btqCode, :line, :paymentTerm, :org, :location1, :recordId, :location2, :date,'"
				+ debitNoteL3FileName + "','" + fileId + "')";
		JdbcBatchItemWriter<DebitNoteDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(debitNoteL3StageInsertQuery);
		itemWriter.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<DebitNoteDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean
	@StepScope
	public FlatFileItemWriter<DebitNoteDto> debitNoteL3FileWriter(
			@Value("#{jobParameters['" + FileIntegrationConstants.TRANSACTION_DATE + "']}") String transactionDate,
			FileService fileService, Environment env) {
		Resource outputResource = new FileSystemResource(env.getProperty(FILES_BASE_FOLDER)
				+ env.getProperty(OUTPUT_FILE_PATH) + fileService.getCommonOracleFileName(
						FileMasterJobNameEnum.DEBIT_NOTE_L3_JOB.getValue(), FileGroupEnum.ORACLE.toString()));

		FlatFileItemWriter<DebitNoteDto> writer = new FlatFileItemWriter<>();

		writer.setResource(outputResource);

		writer.setAppendAllowed(true);

		writer.setLineAggregator(debitNoteL3LineAggregator());
		return writer;
	}

	private LineAggregator<DebitNoteDto> debitNoteL3LineAggregator() {
		DelimitedLineAggregator<DebitNoteDto> lineAggregator = new DelimitedLineAggregator<>();
		lineAggregator.setDelimiter("|");
		lineAggregator.setFieldExtractor(debitNoteL3FieldExtractor());
		return lineAggregator;
	}

	private FieldExtractor<DebitNoteDto> debitNoteL3FieldExtractor() {
		BeanWrapperFieldExtractor<DebitNoteDto> fieldExtractor = new BeanWrapperFieldExtractor<>();
		fieldExtractor.setNames(new String[] { "trxDate", "giDate", "reference", "reference1", "blank1", "currency",
				"source", "transactionType", "customerNo", "customerName", "salesrepName", "memoLine", "qty", "amount1",
				"amount2", "blank2", "purchaseOrder", "btqCode", "line", "paymentTerm", "org", "location1", "recordId",
				"location2", "date", "fileRef" });

		return fieldExtractor;
	}

}
