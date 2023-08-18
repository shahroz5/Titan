/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.reader;

import javax.sql.DataSource;

import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.LineMapper;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.mapping.FieldSetMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.batch.item.file.transform.LineTokenizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.datasync.dao.ItemDatasyncStageDao;
import com.titan.poss.datasync.dao.ItemMaterialDatasyncStageDao;
import com.titan.poss.datasync.dao.ItemStoneDatasyncStageDao;
import com.titan.poss.datasync.dao.MaterialDatasyncStageDao;
import com.titan.poss.datasync.dao.StoneDataSyncStageDao;
import com.titan.poss.file.dto.ItemMasterFileStageDto;
import com.titan.poss.file.dto.ItemMaterialFileStageDto;
import com.titan.poss.file.dto.ItemStoneFileStageDto;
import com.titan.poss.file.dto.MaterialMasterFileStageDto;
import com.titan.poss.file.dto.PriceMasterFileStageDto;
import com.titan.poss.file.dto.StoneMasterFileStageDto;
import com.titan.poss.file.jobs.mapper.ItemMasterDatasyncStageMapper;
import com.titan.poss.file.jobs.mapper.ItemMaterialDatasyncStageMapper;
import com.titan.poss.file.jobs.mapper.ItemStoneDatasyncStageMapper;
import com.titan.poss.file.jobs.mapper.MaterialMasterDataSyncStageMapper;
import com.titan.poss.file.jobs.mapper.PriceMasterMapper;
import com.titan.poss.file.jobs.mapper.StoneMasterDatasyncStageMapper;
import com.titan.poss.product.dao.PriceDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Configuration
public class MasterIngestionJobReader {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private Environment env;

	private static final String ITEM_CODE = "ItemCode";

	private static final String LOGIN_ID = "LoginID";

	private static final String IS_ACTIVE = "IsActive";

	private static final String CREATED_DATE = "CreatedDate";

	private static final String LAST_MODIFIED_ID = "LastModifiedID";

	private static final String LAST_MODIFIED_DATE = "LastModifiedDate";

	private static final String MASTER_JOB_FILE_FOLDER = "masterJob.source.path";

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<ItemMasterFileStageDto> itemMasterStagingReader(
			@Value("#{jobParameters['itemMasterFileName']}") String itemMasterFileName) {

		FlatFileItemReader<ItemMasterFileStageDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(MASTER_JOB_FILE_FOLDER) + itemMasterFileName));

		reader.setLinesToSkip(1);

		LineMapper<ItemMasterFileStageDto> itemMasterLineMapper = createItemMasterLineMapper();
		reader.setLineMapper(itemMasterLineMapper);

		return reader;
	}

	private LineMapper<ItemMasterFileStageDto> createItemMasterLineMapper() {
		DefaultLineMapper<ItemMasterFileStageDto> itemMapper = new DefaultLineMapper<>();

		LineTokenizer itemMasterLineTokenizer = createItemMasterLineTokenizer();
		itemMapper.setLineTokenizer(itemMasterLineTokenizer);

		FieldSetMapper<ItemMasterFileStageDto> itemMasterLineMapper = createItemMasterMapper();
		itemMapper.setFieldSetMapper(itemMasterLineMapper);

		return itemMapper;
	}

	private LineTokenizer createItemMasterLineTokenizer() {
		DelimitedLineTokenizer itemMasterLineTokenizer = new DelimitedLineTokenizer();
		itemMasterLineTokenizer.setQuoteCharacter(',');
		itemMasterLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		itemMasterLineTokenizer.setStrict(false);
		itemMasterLineTokenizer.setNames("StoneWeight", ITEM_CODE, "Description", IS_ACTIVE, "ConsignmentFlag",
				"MaxWeightDeviation", "InventoryType", "StdWeight", "ProductCode", "BrandCode", "ProductType",
				"MaterialCode", "SupplyChainCode", "StdPrice", "StoneCharges", "ComplexityCode", "PricingType",
				"IsSaleable", "TaxClass", "FindingCode", "Size", "Finishing", "IsPerGram", "PricingGroupType",
				"IsReturnable", "Karatage", "ItemNature", "IndentType", "CFAProductCode", LOGIN_ID, CREATED_DATE,
				LAST_MODIFIED_ID, LAST_MODIFIED_DATE, "DiamondCaratage", "DiamondColor", "DiamondClarity", "LeadTime",
				"IsForIndent", "BusinessGroup", "CollectionName", "DesignerName", "ThemeDesign", "DesignStyle1",
				"DesignStyle2", "DelicateCode", "Gender", "PlatingType", "ProductionRoute", "Shape", "MaterialColour",
				"StoneCombination", "GuaranteePeriod", "UsageOccasion", "PricingPyramid", "IndicativePrice",
				"IsCustomerOrderDropped", "IsSplit", "ParentRef", "IsFOCItem", "HSN_SAC_Code", "Purity", "BIMetal",
				"F2Factor","TOTCategory");
		return itemMasterLineTokenizer;
	}

	private FieldSetMapper<ItemMasterFileStageDto> createItemMasterMapper() {
		BeanWrapperFieldSetMapper<ItemMasterFileStageDto> itemMasterFieldSetMapper = new BeanWrapperFieldSetMapper<>();
		itemMasterFieldSetMapper.setTargetType(ItemMasterFileStageDto.class);
		return itemMasterFieldSetMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<StoneMasterFileStageDto> stoneMasterStagingReader(
			@Value("#{jobParameters['stoneMasterFileName']}") String stoneMasterFileName) {

		FlatFileItemReader<StoneMasterFileStageDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(MASTER_JOB_FILE_FOLDER) + stoneMasterFileName));

		reader.setLinesToSkip(1);

		LineMapper<StoneMasterFileStageDto> studentLineMapper = createStoneMasterLineMapper();
		reader.setLineMapper(studentLineMapper);

		return reader;
	}

	private LineMapper<StoneMasterFileStageDto> createStoneMasterLineMapper() {
		DefaultLineMapper<StoneMasterFileStageDto> stoneMapper = new DefaultLineMapper<>();

		LineTokenizer stoneMasterLineTokenizer = createStoneMasterLineTokenizer();
		stoneMapper.setLineTokenizer(stoneMasterLineTokenizer);

		FieldSetMapper<StoneMasterFileStageDto> stoneMasterMapper = createStoneMasterMapper();
		stoneMapper.setFieldSetMapper(stoneMasterMapper);

		return stoneMapper;
	}

	private LineTokenizer createStoneMasterLineTokenizer() {
		DelimitedLineTokenizer stoneMasterLineTokenizer = new DelimitedLineTokenizer();
		stoneMasterLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		stoneMasterLineTokenizer.setStrict(false);
		stoneMasterLineTokenizer.setNames("Color", "StoneCode", "Weight", IS_ACTIVE, "Price", "StoneTypeCode", LOGIN_ID,
				CREATED_DATE, LAST_MODIFIED_ID, LAST_MODIFIED_DATE, "StoneQuality", "StoneShape", "StoneTEPDiscount",
				"RatePerCarat");
		return stoneMasterLineTokenizer;
	}

	private FieldSetMapper<StoneMasterFileStageDto> createStoneMasterMapper() {
		BeanWrapperFieldSetMapper<StoneMasterFileStageDto> stoneMasterMapper = new BeanWrapperFieldSetMapper<>();
		stoneMasterMapper.setTargetType(StoneMasterFileStageDto.class);
		return stoneMasterMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<MaterialMasterFileStageDto> materialMasterStagingReader(
			@Value("#{jobParameters['materialMasterFileName']}") String materialMasterFileName) {

		FlatFileItemReader<MaterialMasterFileStageDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(MASTER_JOB_FILE_FOLDER) + materialMasterFileName));

		reader.setLinesToSkip(1);

		LineMapper<MaterialMasterFileStageDto> studentLineMapper = createMaterialMasterLineMapper();
		reader.setLineMapper(studentLineMapper);

		return reader;
	}

	private LineMapper<MaterialMasterFileStageDto> createMaterialMasterLineMapper() {
		DefaultLineMapper<MaterialMasterFileStageDto> materialMapper = new DefaultLineMapper<>();

		LineTokenizer materialMasterLineTokenizer = createMaterialMasterLineTokenizer();
		materialMapper.setLineTokenizer(materialMasterLineTokenizer);

		FieldSetMapper<MaterialMasterFileStageDto> materialMasterMapper = createMaterialMasterMapper();
		materialMapper.setFieldSetMapper(materialMasterMapper);

		return materialMapper;
	}

	private LineTokenizer createMaterialMasterLineTokenizer() {
		DelimitedLineTokenizer materialMasterLineTokenizer = new DelimitedLineTokenizer();
		materialMasterLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		materialMasterLineTokenizer.setStrict(false);
		materialMasterLineTokenizer.setNames("Color", "Materialcode", "Weight", IS_ACTIVE, "Price", "MaterialType",
				LOGIN_ID, CREATED_DATE, LAST_MODIFIED_ID, LAST_MODIFIED_DATE, "StoneQuality", "StoneShape",
				"StoneTEPDiscount", "RatePergram");
		return materialMasterLineTokenizer;
	}

	private FieldSetMapper<MaterialMasterFileStageDto> createMaterialMasterMapper() {
		BeanWrapperFieldSetMapper<MaterialMasterFileStageDto> materialMasterMapper = new BeanWrapperFieldSetMapper<>();
		materialMasterMapper.setTargetType(MaterialMasterFileStageDto.class);
		return materialMasterMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<PriceMasterFileStageDto> priceMasterStagingReader(
			@Value("#{jobParameters['priceMasterFileName']}") String priceMasterFileName) {

		FlatFileItemReader<PriceMasterFileStageDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(MASTER_JOB_FILE_FOLDER) + priceMasterFileName));

		reader.setLinesToSkip(1);

		LineMapper<PriceMasterFileStageDto> studentLineMapper = createPriceMasterLineMapper();
		reader.setLineMapper(studentLineMapper);

		return reader;
	}

	private LineMapper<PriceMasterFileStageDto> createPriceMasterLineMapper() {
		DefaultLineMapper<PriceMasterFileStageDto> priceMapper = new DefaultLineMapper<>();

		LineTokenizer priceMasterLineTokenizer = createPriceMasterLineTokenizer();
		priceMapper.setLineTokenizer(priceMasterLineTokenizer);

		FieldSetMapper<PriceMasterFileStageDto> priceMasterMapper = createPriceMasterMapper();
		priceMapper.setFieldSetMapper(priceMasterMapper);

		return priceMapper;
	}

	private LineTokenizer createPriceMasterLineTokenizer() {
		DelimitedLineTokenizer priceMasterLineTokenizer = new DelimitedLineTokenizer();
		priceMasterLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		priceMasterLineTokenizer.setNames(ITEM_CODE, "MakingCharges", "PriceGroup", LOGIN_ID, CREATED_DATE,
				LAST_MODIFIED_ID, LAST_MODIFIED_DATE);
		return priceMasterLineTokenizer;
	}

	private FieldSetMapper<PriceMasterFileStageDto> createPriceMasterMapper() {
		BeanWrapperFieldSetMapper<PriceMasterFileStageDto> priceMasterMapper = new BeanWrapperFieldSetMapper<>();
		priceMasterMapper.setTargetType(PriceMasterFileStageDto.class);
		return priceMasterMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<ItemMaterialFileStageDto> itemMaterialMappingStagingReader(
			@Value("#{jobParameters['itemMaterialMappingFileName']}") String itemMaterialMappingFileName) {

		FlatFileItemReader<ItemMaterialFileStageDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(MASTER_JOB_FILE_FOLDER) + itemMaterialMappingFileName));

		reader.setLinesToSkip(1);

		LineMapper<ItemMaterialFileStageDto> studentLineMapper = createItemMaterialMappingLineMapper();
		reader.setLineMapper(studentLineMapper);

		return reader;
	}

	private LineMapper<ItemMaterialFileStageDto> createItemMaterialMappingLineMapper() {
		DefaultLineMapper<ItemMaterialFileStageDto> itemMaterialMapper = new DefaultLineMapper<>();

		LineTokenizer itemMaterialLineTokenizer = createItemMaterialMappingLineTokenizer();
		itemMaterialMapper.setLineTokenizer(itemMaterialLineTokenizer);

		FieldSetMapper<ItemMaterialFileStageDto> itemMaterialMappingMapper = createItemMaterialMappingMapper();
		itemMaterialMapper.setFieldSetMapper(itemMaterialMappingMapper);

		return itemMaterialMapper;
	}

	private LineTokenizer createItemMaterialMappingLineTokenizer() {
		DelimitedLineTokenizer itemMaterialLineTokenizer = new DelimitedLineTokenizer();
		itemMaterialLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		itemMaterialLineTokenizer.setStrict(false);
		itemMaterialLineTokenizer.setNames(ITEM_CODE, "NoOfOtherItem", "MaterialCode", LOGIN_ID, CREATED_DATE,
				LAST_MODIFIED_ID, LAST_MODIFIED_DATE, IS_ACTIVE);
		return itemMaterialLineTokenizer;
	}

	private FieldSetMapper<ItemMaterialFileStageDto> createItemMaterialMappingMapper() {
		BeanWrapperFieldSetMapper<ItemMaterialFileStageDto> itemMaterialMapper = new BeanWrapperFieldSetMapper<>();
		itemMaterialMapper.setTargetType(ItemMaterialFileStageDto.class);
		return itemMaterialMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public FlatFileItemReader<ItemStoneFileStageDto> itemStoneMappingStagingReader(
			@Value("#{jobParameters['itemStoneMappingFileName']}") String itemStoneMappingFileName) {

		FlatFileItemReader<ItemStoneFileStageDto> reader = new FlatFileItemReader<>();

		reader.setResource(new FileSystemResource(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
				+ env.getProperty(MASTER_JOB_FILE_FOLDER) + itemStoneMappingFileName));

		reader.setLinesToSkip(1);

		LineMapper<ItemStoneFileStageDto> studentLineMapper = createItemStoneMappingLineMapper();
		reader.setLineMapper(studentLineMapper);

		return reader;
	}

	private LineMapper<ItemStoneFileStageDto> createItemStoneMappingLineMapper() {
		DefaultLineMapper<ItemStoneFileStageDto> itemStoneMapper = new DefaultLineMapper<>();

		LineTokenizer itemStoneMappingLineTokenizer = createItemStoneMappingLineTokenizer();
		itemStoneMapper.setLineTokenizer(itemStoneMappingLineTokenizer);

		FieldSetMapper<ItemStoneFileStageDto> itemStoneMappingMapper = createItemStoneMappingMapper();
		itemStoneMapper.setFieldSetMapper(itemStoneMappingMapper);

		return itemStoneMapper;
	}

	private LineTokenizer createItemStoneMappingLineTokenizer() {
		DelimitedLineTokenizer itemStoneMappingLineTokenizer = new DelimitedLineTokenizer();
		itemStoneMappingLineTokenizer.setDelimiter(DelimiterEnum.CSV.getValue());
		itemStoneMappingLineTokenizer.setNames(ITEM_CODE, "NoOfStones", "StoneCode", LOGIN_ID, CREATED_DATE,
				LAST_MODIFIED_ID, LAST_MODIFIED_DATE, IS_ACTIVE);
		return itemStoneMappingLineTokenizer;
	}

	private FieldSetMapper<ItemStoneFileStageDto> createItemStoneMappingMapper() {
		BeanWrapperFieldSetMapper<ItemStoneFileStageDto> itemStoneMapper = new BeanWrapperFieldSetMapper<>();
		itemStoneMapper.setTargetType(ItemStoneFileStageDto.class);
		return itemStoneMapper;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ItemDatasyncStageDao> itemMasterDataSyncReader(
			@Value("#{jobExecutionContext['itemMasterFileAuditId']}") String fileAuditId,
			ItemMasterDatasyncStageMapper itemMasterDatasyncStageMapper) {
		JdbcCursorItemReader<ItemDatasyncStageDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.item_master where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(itemMasterDatasyncStageMapper);
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<MaterialDatasyncStageDao> materialMasterDataSyncReader(
			@Value("#{jobExecutionContext['materialMasterFileAuditId']}") String fileAuditId,
			MaterialMasterDataSyncStageMapper materialMasterDataSyncStageMapper) {
		JdbcCursorItemReader<MaterialDatasyncStageDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.material_master where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(materialMasterDataSyncStageMapper);
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<StoneDataSyncStageDao> stoneMasterDataSyncReader(
			@Value("#{jobExecutionContext['stoneMasterFileAuditId']}") String fileAuditId,
			StoneMasterDatasyncStageMapper stoneMasterDatasyncStageMapper) {
		JdbcCursorItemReader<StoneDataSyncStageDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.stone_master where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(stoneMasterDatasyncStageMapper);
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ItemMaterialDatasyncStageDao> itemMaterialMappingDataSyncReader(
			@Value("#{jobExecutionContext['itemMaterialMappingFileAuditId']}") String fileAuditId,
			ItemMaterialDatasyncStageMapper itemMaterialDatasyncStageMapper) {
		JdbcCursorItemReader<ItemMaterialDatasyncStageDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.item_material_mapping where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(itemMaterialDatasyncStageMapper);
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<ItemStoneDatasyncStageDao> itemStoneMappingDataSyncReader(
			@Value("#{jobExecutionContext['itemStoneMappingFileAuditId']}") String fileAuditId,
			ItemStoneDatasyncStageMapper itemStoneDatasyncStageMapper) {
		JdbcCursorItemReader<ItemStoneDatasyncStageDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.item_stone_mapping where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(itemStoneDatasyncStageMapper);
		return reader;
	}

	@Bean(destroyMethod = "")
	@StepScope
	public JdbcCursorItemReader<PriceDao> priceMasterDataSyncReader(
			@Value("#{jobExecutionContext['priceMasterFileAuditId']}") String fileAuditId,
			PriceMasterMapper priceMasterMapper) {
		JdbcCursorItemReader<PriceDao> reader = new JdbcCursorItemReader<>();
		reader.setDataSource(dataSource);
		reader.setSql("SELECT * FROM products.dbo.price_master where correlation_id ='" + fileAuditId + "'");
		reader.setRowMapper(priceMasterMapper);
		return reader;
	}

}