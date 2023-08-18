/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.reader;

import java.util.HashMap;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.LineMapper;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.PatternMatchingCompositeLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.file.dto.InvoiceFileStageDto;
import com.titan.poss.file.jobs.mapper.LotMaterialDetailsMapper;
import com.titan.poss.file.jobs.mapper.LotStoneDetailsMapper;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class InvoiceJobReader {

	@Autowired
	private DataSource dataSource;
	
	private static final String INVOICE_JOB_SOURCE_FILE_FOLDER = "invoice.file.source.path";
	private static final String TILCONSTANT = "tilConstant";
	private static final String TYPE = "type";
	private static final String SRC_LOCATION = "srcLocation";
	private static final String CFA_TYPE = "cfaType";
	private static final String CFA_PRODUCT_CODE = "cfaProductCode";
	private static final String CFA_INV_NUMBER = "cfaInvoiceNumber";
	private static final String CFA_INV_DATE = "cfaInvoiceDate";
	private static final String CFA_FISCAL_YEAR = "cfaFiscalYear";
	private static final String CFA_UNIQUE_KEY = "cfaUniqueKey";
	private static final String CFA_CUSTOMER_NUMBER = "cfaCustomerNumber";

	@SuppressWarnings("rawtypes")
	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader invoiceFileReader(@Value("#{jobParameters['invoiceFileName']}") String fileName,
			Environment env) {

		FlatFileItemReader<InvoiceFileStageDto> reader = new FlatFileItemReader<>();
		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(INVOICE_JOB_SOURCE_FILE_FOLDER) + fileName));
		LineMapper<InvoiceFileStageDto> invoiceLineMapper = getInvoiceLineMapper();
		reader.setLineMapper(invoiceLineMapper);

		return reader;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private LineMapper<InvoiceFileStageDto> getInvoiceLineMapper() {
		DelimitedLineTokenizer ihdrTokenizer = new DelimitedLineTokenizer();
		ihdrTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		ihdrTokenizer.setNames(TYPE, TILCONSTANT, SRC_LOCATION, CFA_TYPE, CFA_PRODUCT_CODE, CFA_INV_NUMBER,
				CFA_INV_DATE, CFA_FISCAL_YEAR, CFA_UNIQUE_KEY, CFA_CUSTOMER_NUMBER, "ihdrCfaTotPrimaryQty",
				"ihdrCfaTotSecondaryQty", "ihdrCfaItemBasicValue", "ihdrCfaTotDiscountAmount", "ihdrCfaTaxAmount",
				"ihdrCfaOtherCharges");
		ihdrTokenizer.setStrict(false);

		DelimitedLineTokenizer idtlTokenizer = new DelimitedLineTokenizer();
		idtlTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		idtlTokenizer.setNames(TYPE, TILCONSTANT, SRC_LOCATION, CFA_TYPE, CFA_PRODUCT_CODE, "idtlItemNo",
				CFA_INV_NUMBER, CFA_INV_DATE, CFA_FISCAL_YEAR, CFA_UNIQUE_KEY, CFA_CUSTOMER_NUMBER, "idtlLineCount",
				"idtlCfaVariantType", "idtlItemNo2", "idtlUnitPrice", "idtlPrimaryQty", "idtlSecondaryQty",
				"idtlCfaNetAmount", "idltLotNumber", "idtlCfaF1", "idtlCfaDiamondWeight", "idtlCfaOtherStoneWeight",
				"idtlCfaInvoiceType", "idtlGoNetWt", "idltPtNetWt", "idtlStnNetWt", "idtlSiNetWt", "idtlOtherNetWt",
				"idtlIsHallMarking", "idtlHallMarkingCode", "idtlHallMarkingCenterName", "idtlHallMarkedDate",
				"idtlHallMarkRemarks", "idtlHallMarkRemarks1", "idtlMfgDate", "idtlOrderNo");
		idtlTokenizer.setStrict(false);

		DelimitedLineTokenizer isacTokenizer = new DelimitedLineTokenizer();
		isacTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		isacTokenizer.setNames(TYPE, TILCONSTANT, SRC_LOCATION, CFA_TYPE, CFA_PRODUCT_CODE, CFA_INV_NUMBER,
				CFA_INV_DATE, CFA_FISCAL_YEAR, CFA_UNIQUE_KEY, CFA_CUSTOMER_NUMBER, "isacLineCount", "isacLineDtlCount",
				"isacGlKey", "isacDcInd", "isacDiscPerc", "isacDiscAmt", "isacDiscSrcAmt");
		isacTokenizer.setStrict(false);

		DelimitedLineTokenizer ildtlTokenizer = new DelimitedLineTokenizer();
		ildtlTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		ildtlTokenizer.setNames("type", "ildtlLineCount", "ildtlLineDtlCount", "ildtlItemNo", "ildtlStnWeight",
				"ildtlStnQty");
		ildtlTokenizer.setStrict(false);

		DelimitedLineTokenizer imdtlTokenizer = new DelimitedLineTokenizer();
		imdtlTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		imdtlTokenizer.setNames("type", "imdtlLineCount", "imdtlLineDtlCount", "imdtlItemNo", "imdtlStnWeight",
				"imdtlStnQty");
		imdtlTokenizer.setStrict(false);

		DelimitedLineTokenizer ictrlTokenizer = new DelimitedLineTokenizer();
		ictrlTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		ictrlTokenizer.setNames("type", "ictrlCfaFileLines", "ictrlHdrLineCount", "ictrlHdrTotalWeight",
				"ictrlHdrTotalValue");
		ictrlTokenizer.setStrict(false);

		HashMap<String, DelimitedLineTokenizer> tokenizers = new HashMap<>();
		tokenizers.put("IHDR*", ihdrTokenizer);
		tokenizers.put("IDTL*", idtlTokenizer);
		tokenizers.put("ISAC*", isacTokenizer);
		tokenizers.put("LDTL*", ildtlTokenizer);
		tokenizers.put("MDTL*", imdtlTokenizer);
		tokenizers.put("CTRL*", ictrlTokenizer);

		BeanWrapperFieldSetMapper<InvoiceFileStageDto> beanWrapperFieldSetMapper = new BeanWrapperFieldSetMapper<>();
		beanWrapperFieldSetMapper.setTargetType(InvoiceFileStageDto.class);
		beanWrapperFieldSetMapper.setStrict(false);

		HashMap<String, BeanWrapperFieldSetMapper<InvoiceFileStageDto>> fieldSetMappers = new HashMap<>();
		fieldSetMappers.put("*", beanWrapperFieldSetMapper);

		PatternMatchingCompositeLineMapper patternMatchingCompositeLineMapper = new PatternMatchingCompositeLineMapper<>();
		patternMatchingCompositeLineMapper.setTokenizers(tokenizers);
		patternMatchingCompositeLineMapper.setFieldSetMappers(fieldSetMappers);

		return patternMatchingCompositeLineMapper;
	}
	
	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<LotDetailsDao> invoiceLotStoneDetailsDataSyncReader(
			@Value("#{jobExecutionContext['invoiceFileAuditId']}") String fileId,
			LotStoneDetailsMapper lotStoneDetailsMapper) {
		JdbcCursorItemReader<LotDetailsDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.lot_stone_details where correlation_id ='" + fileId + "'");
		reader.setRowMapper(lotStoneDetailsMapper);
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<LotMaterialDetailsDao> invoiceLotMaterialsDataSyncReader(
			@Value("#{jobExecutionContext['invoiceFileAuditId']}") String fileId,
			LotMaterialDetailsMapper lotMaterialDetailsMapper) {
		JdbcCursorItemReader<LotMaterialDetailsDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.lot_material_details where correlation_id ='" + fileId + "'");
		reader.setRowMapper(lotMaterialDetailsMapper);
		return reader;
	}

}
