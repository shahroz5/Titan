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
import com.titan.poss.file.dto.StnFileStageDto;
import com.titan.poss.file.jobs.mapper.LotMaterialDetailsMapper;
import com.titan.poss.file.jobs.mapper.LotStoneDetailsMapper;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
@Slf4j
public class StnJobReader {

	@Autowired
	private DataSource dataSource;

	private static final String STN_PATH = "stn.file.source.path";
	private static final String TIL_CONSTANT = "tilConstant";
	private static final String LOCATION = "location";
	private static final String TRANSFER_TYPE = "transferType";
	private static final String PRODUCT_GROUP = "productGroup";
	private static final String CREATED_YEAR = "createdYear";
	private static final String DELIVERY_NO = "deliveryNo";
	private static final String STM_DATE = "stmDate";
	private static final String FACTORY_CODE = "factoryCode";

	@SuppressWarnings("rawtypes")
	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader stnFileReader(@Value("#{jobParameters['stnFileName']}") String fileName,
			@Value("#{jobParameters['ibt']}") String ibt, Environment env) {

		FlatFileItemReader<StnFileStageDto> reader = new FlatFileItemReader<>();
		reader.setResource(new FileSystemResource(
				env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER) + env.getProperty(STN_PATH) + fileName));
		LineMapper<StnFileStageDto> stnLineMapper = getStnLineMapper(ibt);
		reader.setLineMapper(stnLineMapper);

		return reader;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private LineMapper<StnFileStageDto> getStnLineMapper(String ibt) {
		DelimitedLineTokenizer hdrTokenizer = new DelimitedLineTokenizer();
		hdrTokenizer.setDelimiter(DelimiterEnum.PSV.getValue());
		hdrTokenizer.setStrict(false);

		DelimitedLineTokenizer dtlTokenizer = new DelimitedLineTokenizer();
		dtlTokenizer.setDelimiter(DelimiterEnum.PSV.getValue());
		
		if (ibt.equalsIgnoreCase("false")) {
		hdrTokenizer.setNames("type", TIL_CONSTANT, LOCATION, TRANSFER_TYPE, PRODUCT_GROUP, CREATED_YEAR,
				DELIVERY_NO, STM_DATE, "hdrBlank1", FACTORY_CODE, "hdrBlank2", "stmDate2", "hdrBlank3", "hdrBlank4",
				"hdrBlank5", "hdrBlank6", "hdrGoldRate", "hdrShipQty", "hdrShipQty2", "hdrStmValue", "hdrCarrierName",
				"hdrBlank7", "hdrBlank8", "hdrBlank9", "hdrBlank10", "hdrBlank11", "hdrBlank12", "hdrBlank13",
				"hdrBlank14", "hdrBlank15", "hdrBlank16", "hdrBlank17", "hdrBlank18", "hdrZeroConstant", "hdrCreatedBy",
				"hdrStmCreatedDate", "hdrStmCreatedTime", "hdrUpdatedBy", "hdrDocketNumber");
		
		dtlTokenizer.setNames("type", TIL_CONSTANT, LOCATION, TRANSFER_TYPE, PRODUCT_GROUP, CREATED_YEAR,
				DELIVERY_NO, FACTORY_CODE, STM_DATE, "dtlSlNo", "dtlOrderType", "dtlGoldRate", "dtlProductCode",
				"dtlProductValue1", "dtlProductQty", "dtlProductWt", "dtlProductValue2", "dtlZeroConstant1",
				"dtlZeroConstant2", "dtlZeroConstant3", "dtlLotNumber", "dtlActualF1", "dtlDiamondWt",
				"dtlOtherStoneWt", "dtlOrderNo", "dtlIgstPerc", "dtlIgstVAL", "dtlSgstPERC", "dtlSgstVAL",
				"dtlCgstPERC", "dtlCgstVAL", "dtlUtgstPERC", "dtlUtgstVAL", "dtlGoNetWt", "dtlPtNetWt", "dtlStnNetWt",
				"dtlSiNetWt", "dtlOtherNetWt", "dtlIsHallMarking", "dtlHallMarkingCode", "dtlHallMarkingCenterName",
				"dtlHallMarkedDate", "dtlHallMarkRemarks", "dtlHallMarkRemarks1");
		} else {
			// stmDate2
			hdrTokenizer.setNames("type", TIL_CONSTANT, LOCATION, TRANSFER_TYPE, PRODUCT_GROUP, CREATED_YEAR,
					DELIVERY_NO, STM_DATE, "hdrBlank1", FACTORY_CODE, "hdrBlank2", "hdrZeroConstant", "hdrBlank3", "hdrBlank4",
					"hdrBlank5", "hdrBlank6", "hdrGoldRate", "hdrShipQty", "hdrShipQty2", "hdrStmValue", "hdrCarrierName",
					"hdrBlank7", "hdrBlank8", "hdrBlank9", "hdrBlank10", "hdrBlank11", "hdrBlank12", "hdrBlank13",
					"hdrBlank14", "hdrBlank15", "hdrBlank16", "hdrBlank17", "hdrBlank18", "hdrStmCreatedDate", "hdrStmCreatedTime",
					"stmDate2", "hdrCreatedBy", "hdrUpdatedBy", "hdrDocketNumber");
			
			dtlTokenizer.setNames("type", TIL_CONSTANT, LOCATION, TRANSFER_TYPE, PRODUCT_GROUP, CREATED_YEAR,
					DELIVERY_NO, FACTORY_CODE, STM_DATE, "dtlSlNo", "dtlOrderType", "dtlBinCode", "dtlProductCode",
					"dtlProductValue1", "dtlProductQty", "dtlProductWt", "dtlProductValue2", "dtlZeroConstant1",
					"dtlZeroConstant2", "dtlZeroConstant3", "dtlLotNumber", "dtlActualF1", "dtlDiamondWt",
					"dtlOtherStoneWt", "dtlOrderNo", "dtlIgstPerc", "dtlIgstVAL", "dtlSgstPERC", "dtlSgstVAL",
					"dtlCgstPERC", "dtlCgstVAL", "dtlUtgstPERC", "dtlUtgstVAL", "dtlGoNetWt", "dtlPtNetWt", "dtlStnNetWt",
					"dtlSiNetWt", "dtlOtherNetWt", "dtlIsHallMarking", "dtlHallMarkingCode", "dtlHallMarkingCenterName",
					"dtlHallMarkedDate", "dtlHallMarkRemarks", "dtlHallMarkRemarks1");
		}
		
		dtlTokenizer.setStrict(false);

		DelimitedLineTokenizer ldtlTokenizer = new DelimitedLineTokenizer();
		ldtlTokenizer.setDelimiter(DelimiterEnum.PSV.getValue());
		ldtlTokenizer.setNames("type", "ldtlLineCount", "ldtlLineDtlCount", "ldtlItemNo", "ldtlStnWeight",
				"ldtlStnQty");
		ldtlTokenizer.setStrict(false);

		DelimitedLineTokenizer mdtlTokenizer = new DelimitedLineTokenizer();
		mdtlTokenizer.setDelimiter(DelimiterEnum.PSV.getValue());
		mdtlTokenizer.setNames("type", "mdtlLineCount", "mdtlLineDtlCount", "mdtlItemNo", "mdtlStnWeight",
				"mdtlStnQty");
		mdtlTokenizer.setStrict(false);

		DelimitedLineTokenizer ctrlTokenizer = new DelimitedLineTokenizer();
		ctrlTokenizer.setDelimiter(DelimiterEnum.PSV.getValue());
		ctrlTokenizer.setNames("type", "ctrlTotalLines", "ctrlTotalQuantity", "ctrlTotalWeight", "ctrlTotalValue");
		ctrlTokenizer.setStrict(false);

		HashMap<String, DelimitedLineTokenizer> tokenizers = new HashMap<>();
		tokenizers.put("HDR*", hdrTokenizer);
		tokenizers.put("DTL*", dtlTokenizer);
		tokenizers.put("LDTL*", ldtlTokenizer);
		tokenizers.put("MDTL*", mdtlTokenizer);
		tokenizers.put("CTRL*", ctrlTokenizer);

		BeanWrapperFieldSetMapper<StnFileStageDto> beanWrapperFieldSetMapper = new BeanWrapperFieldSetMapper<>();
		beanWrapperFieldSetMapper.setTargetType(StnFileStageDto.class);
		beanWrapperFieldSetMapper.setStrict(false);

		HashMap<String, BeanWrapperFieldSetMapper<StnFileStageDto>> fieldSetMappers = new HashMap<>();
		fieldSetMappers.put("*", beanWrapperFieldSetMapper);

		PatternMatchingCompositeLineMapper patternMatchingCompositeLineMapper = new PatternMatchingCompositeLineMapper<>();
		patternMatchingCompositeLineMapper.setTokenizers(tokenizers);
		patternMatchingCompositeLineMapper.setFieldSetMappers(fieldSetMappers);

		return patternMatchingCompositeLineMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<LotDetailsDao> stnLotStoneDetailsDataSyncReader(
			@Value("#{jobExecutionContext['stnFileAuditId']}") String fileId,
			LotStoneDetailsMapper lotStoneDetailsMapper) {
		JdbcCursorItemReader<LotDetailsDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.lot_stone_details where correlation_id ='" + fileId + "'");
		reader.setRowMapper(lotStoneDetailsMapper);
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<LotMaterialDetailsDao> stnLotMaterialsDataSyncReader(
            @Value("#{jobExecutionContext['stnFileAuditId']}") String fileId,
			LotMaterialDetailsMapper lotMaterialDetailsMapper) {
		JdbcCursorItemReader<LotMaterialDetailsDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.lot_material_details where correlation_id ='" + fileId + "'");
		reader.setRowMapper(lotMaterialDetailsMapper);
		return reader;
	}

}
