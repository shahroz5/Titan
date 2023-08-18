/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import javax.sql.DataSource;

import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.titan.poss.file.dto.ItemMasterStageDto;
import com.titan.poss.file.dto.ItemMaterialStageDto;
import com.titan.poss.file.dto.ItemStoneStageDto;
import com.titan.poss.file.dto.MaterialMasterStageDto;
import com.titan.poss.file.dto.PriceMasterStageDto;
import com.titan.poss.file.dto.StoneMasterStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Configuration
public class MasterIngestionJobWriter {

	@Autowired
	private DataSource dataSource;

	// @formatter:off
//	private static final String ITEM_MASTER_STAGE_INSERT_QUERY = "INSERT into item_master_stage (stone_weight,item_code, description, is_active,consignment_flag,max_weight_deviation,inventory_type,\r\n"
//			+ "std_weight,product_code,brand_code,product_type,material_code,supply_chain_code,std_price,stone_charges,complexity_code,pricing_type,is_saleable,tax_class,\r\n"
//			+ "finding_code,size,finishing,is_per_gram,pricing_group_type,is_returnable,karatage,item_nature,indent_type,cfa_product_code,login_id,created_date,\r\n"
//			+ "last_modified_id,last_modified_date,diamond_caratage,diamond_color,diamond_clarity,lead_time,is_for_indent,business_group,collection_name,designer_name,\r\n"
//			+ "theme_design,design_style1,design_style2,delicate_code,gender,plating_type,production_route,shape,material_colour,stone_combination,guarantee_period,\r\n"
//			+ "usage_occasion,pricing_pyramid,indicative_price,is_customer_order_dropped,is_split,parent_ref,is_foc_item,hsn_sac_code,purity,bi_metal, file_audit_id, price_factor, item_details, config_details, transfer_type,tot_category) values \r\n"
//			+ "(:stoneWeight, :itemCode, :description, :isActive, :consignmentFlag, :maxWeightDeviation, :inventoryType, :stdWeight, :productCode, :brandCode, :productType, :materialCode,\r\n"
//			+ " :supplyChainCode, :stdPrice, :stoneCharges, :complexityCode, :pricingType, :isSaleable, :taxClass, :findingCode, :size, :finishing, :isPerGram, :pricingGroupType,\r\n"
//			+ " :isReturnable, :karatage, :itemNature, :indentType, :cfaProductCode, :loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :diamondCaratage,\r\n"
//			+ " :diamondColor, :diamondClarity, :leadTime, :isForIndent, :businessGroup, :collectionName, :designerName, :themeDesign, :designStyle1, :designStyle2, :delicateCode,\r\n"
//			+ " :gender, :platingType, :productionRoute, :shape, :materialColour, :stoneCombination, :guaranteePeriod, :usageOccasion, :pricingPyramid, :indicativePrice, \r\n"
//			+ " :isCustomerOrderDropped, :isSplit, :parentRef, :isFocItem, :hsnSacCode, :purity, :bIMetal, :fileAuditId, :priceFactor, :itemDetails, :configDetails, :transferType,:totCategory)";

	private static final String ITEM_MASTER_STAGE_INSERT_QUERY = "UPDATE item_master_stage SET stone_weight =:stoneWeight,  description =:description, is_active =:isActive, consignment_flag =:consignmentFlag,\r\n"
			+ "max_weight_deviation =:maxWeightDeviation ,inventory_type =:inventoryType,std_weight =:stdWeight, product_code =:productCode,\r\n"
			+ "brand_code =:brandCode, product_type =:productType, material_code =:materialCode, supply_chain_code =:supplyChainCode, \r\n"
			+ "std_price =:stdPrice, stone_charges =:stoneCharges, complexity_code =:complexityCode, pricing_type =:pricingType, is_saleable =:isSaleable, tax_class =:taxClass,\r\n"
			+ "finding_code =:findingCode, size =:size,finishing =:finishing, is_per_gram =:isPerGram,pricing_group_type =:pricingGroupType,is_returnable =:isReturnable, \r\n"
			+ "karatage =:karatage,item_nature =:itemNature,indent_type =:indentType,cfa_product_code =:cfaProductCode,login_id =:loginId,created_date =:createdDate,\r\n"
			+ "last_modified_id =:lastModifiedId,last_modified_date =:lastModifiedDate,diamond_caratage =:diamondCaratage,diamond_color =:diamondColor, \r\n"
			+ "diamond_clarity =:diamondClarity, lead_time =:leadTime, is_for_indent =:isForIndent, business_group =:businessGroup,\r\n"
			+ "collection_name =:collectionName, designer_name =:designerName,theme_design =:themeDesign,design_style1 =:designStyle1,design_style2 =:designStyle2,\r\n"
			+ "delicate_code =:delicateCode,gender =:gender,plating_type=:platingType,production_route=:productionRoute,shape=:shape,material_colour =:materialColour,\r\n"
			+ "stone_combination =:stoneCombination,guarantee_period =:guaranteePeriod,usage_occasion =:usageOccasion,pricing_pyramid =:pricingPyramid,\r\n"
			+ "indicative_price=:indicativePrice,is_customer_order_dropped=:isCustomerOrderDropped,is_split =:isSplit,parent_ref =:parentRef,\r\n"
			+ "is_foc_item =:isFocItem,hsn_sac_code=:hsnSacCode,purity=:purity,bi_metal=:bIMetal, price_factor=:priceFactor, item_details=:itemDetails, \r\n"
			+ "config_details =:configDetails, transfer_type=:transferType,tot_category=:totCategory\r\n"
			+ " WHERE item_code =:itemCode AND file_audit_id =:fileAuditId\r\n"
			+ " IF @@ROWCOUNT = 0\r\n"
			+ " INSERT into item_master_stage (stone_weight,item_code, description, is_active,consignment_flag,max_weight_deviation,inventory_type,\r\n"
			+ "std_weight,product_code,brand_code,product_type,material_code,supply_chain_code,std_price,stone_charges,complexity_code,pricing_type,is_saleable,tax_class,\r\n"
			+ "finding_code,size,finishing,is_per_gram,pricing_group_type,is_returnable,karatage,item_nature,indent_type,cfa_product_code,login_id,created_date,\r\n"
			+ "last_modified_id,last_modified_date,diamond_caratage,diamond_color,diamond_clarity,lead_time,is_for_indent,business_group,collection_name,designer_name,\r\n"
			+ "theme_design,design_style1,design_style2,delicate_code,gender,plating_type,production_route,shape,material_colour,stone_combination,guarantee_period,\r\n"
			+ "usage_occasion,pricing_pyramid,indicative_price,is_customer_order_dropped,is_split,parent_ref,is_foc_item,hsn_sac_code,purity,bi_metal, file_audit_id, price_factor, item_details, config_details, transfer_type,tot_category) values \r\n"
			+ "(:stoneWeight, :itemCode, :description, :isActive, :consignmentFlag, :maxWeightDeviation, :inventoryType, :stdWeight, :productCode, :brandCode, :productType, :materialCode,\r\n"
			+ ":supplyChainCode, :stdPrice, :stoneCharges, :complexityCode, :pricingType, :isSaleable, :taxClass, :findingCode, :size, :finishing, :isPerGram, :pricingGroupType,\r\n"
			+ ":isReturnable, :karatage, :itemNature, :indentType, :cfaProductCode, :loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :diamondCaratage,\r\n"
			+ ":diamondColor, :diamondClarity, :leadTime, :isForIndent, :businessGroup, :collectionName, :designerName, :themeDesign, :designStyle1, :designStyle2, :delicateCode,\r\n"
			+ ":gender, :platingType, :productionRoute, :shape, :materialColour, :stoneCombination, :guaranteePeriod, :usageOccasion, :pricingPyramid, :indicativePrice, \r\n"
			+ ":isCustomerOrderDropped, :isSplit, :parentRef, :isFocItem, :hsnSacCode, :purity, :bIMetal, :fileAuditId, :priceFactor, :itemDetails, :configDetails, :transferType,:totCategory)\r\n";
	
	//private static final String STONE_MASTER_INSERT_QUERY = "Insert into stone_master_stage (color, stone_code, weight, is_active, price, stone_type_code, stone_quality,stone_shape,stone_tep_discount,rate_per_carat, "
	//		+ "login_id, created_date,last_modified_id, last_modified_date, file_audit_id, config_details) values (:color, :stoneCode, :weight, :isActive, :price, :stoneTypeCode, :stoneQuality, :stoneShape, :stoneTepDiscount, :ratePerCarat, "
	//		+ ":loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :fileAuditId, :configDetails)";
	
	private static final String STONE_MASTER_INSERT_QUERY = "UPDATE stone_master_stage SET color = :color, weight = :weight, is_active = :isActive, price = :price, stone_type_code = :stoneTypeCode, \r\n"
			+ "stone_quality = :stoneQuality, stone_shape = :stoneShape, stone_tep_discount = :stoneTepDiscount, rate_per_carat = :ratePerCarat, \r\n"
			+ "login_id = :loginId, created_date = :createdDate, last_modified_id = :lastModifiedId, last_modified_date = :lastModifiedDate, \r\n"
			+ "config_details = :configDetails WHERE stone_code = :stoneCode AND file_audit_id = :fileAuditId \r\n"
			+ "IF @@ROWCOUNT = 0 \r\n"
			+ "Insert into stone_master_stage (color, stone_code, weight, is_active, price, stone_type_code, stone_quality,stone_shape,stone_tep_discount,rate_per_carat, \r\n"
			+ "login_id, created_date,last_modified_id, last_modified_date, file_audit_id, config_details) \r\n"
			+ "values (:color, :stoneCode, :weight, :isActive, :price, :stoneTypeCode, :stoneQuality, :stoneShape, :stoneTepDiscount, :ratePerCarat,\r\n"
			+ ":loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :fileAuditId, :configDetails)";


	//private static final String MATERIAL_MASTER_INSERT_QUERY = "Insert into material_master_stage (color, material_code, weight, is_active, price, material_type,stone_quality,stone_shape,stone_tep_discount,rate_per_gram, "
		//	+ " login_id, created_date,last_modified_id, last_modified_date, file_audit_id, config_details) values (:color, :materialCode, :weight, :isActive, :price, :materialType, :stoneQuality, :stoneShape, :stoneTepDiscount, :ratePerGram, "
		//	+ " :loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :fileAuditId, :configDetails)";
	
	private static final String MATERIAL_MASTER_INSERT_QUERY ="UPDATE material_master_stage SET color = :color, weight = :weight, is_active = :isActive, price = :price, material_type = :materialType, \r\n"
			+ "stone_quality = :stoneQuality, stone_shape = :stoneShape, stone_tep_discount = :stoneTepDiscount,rate_per_gram = :ratePerGram, \r\n"
			+ "login_id = :loginId, created_date = :createdDate, last_modified_id = :lastModifiedId, last_modified_date = :lastModifiedDate, config_details = :configDetails \r\n"
			+ "WHERE material_code = :materialCode AND  file_audit_id = :fileAuditId \r\n"
			+ "IF @@ROWCOUNT = 0  \r\n"
			+ "Insert into material_master_stage (color, material_code, weight, is_active, price, material_type,stone_quality,stone_shape, \r\n"
			+ "stone_tep_discount, rate_per_gram, login_id, created_date,last_modified_id, last_modified_date, file_audit_id, config_details) \r\n"
			+ "values (:color, :materialCode, :weight, :isActive, :price, :materialType, :stoneQuality, :stoneShape, :stoneTepDiscount, :ratePerGram, \r\n"
			+ ":loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :fileAuditId, :configDetails)";

	//private static final String PRICE_MASTER_INSERT_QUERY = "Insert into price_master_stage (id,item_code, making_charges, price_group, login_id, created_date,last_modified_id, last_modified_date, file_audit_id) values (NEWID(), :itemCode, :makingCharges, :priceGroup, :loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :fileAuditId)";

	private static final String PRICE_MASTER_INSERT_QUERY = " UPDATE price_master_stage SET making_charges = :makingCharges, price_group = :priceGroup, login_id = :loginId, \r\n"
			+ " created_date = :createdDate, last_modified_id = :lastModifiedId,  last_modified_date = :lastModifiedDate where  \r\n"
			+ " item_code = :itemCode AND file_audit_id = :fileAuditId  \r\n"
			+ " IF @@ROWCOUNT = 0  \r\n"
			+ " Insert into price_master_stage (id,item_code, making_charges, price_group, login_id, created_date,last_modified_id, \r\n"
			+ " last_modified_date, file_audit_id) values (NEWID(), :itemCode, :makingCharges, :priceGroup, :loginId, :createdDate, \r\n"
			+ " :lastModifiedId, :lastModifiedDate, :fileAuditId)";

	//private static final String ITEM_MATERIAL_MAPPING_INSERT_QUERY = "Insert into item_material_mapping_stage (id, item_code, no_of_other_item, material_code, is_active, login_id, created_date,last_modified_id, last_modified_date, file_audit_id) values (NEWID(), :itemCode, :noOfOtherItem, :materialCode, :isActive, :loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :fileAuditId)";

	private static final String ITEM_MATERIAL_MAPPING_INSERT_QUERY = " UPDATE item_material_mapping_stage SET no_of_other_item = :noOfOtherItem, is_active = :isActive,\r\n"
			+ " login_id = :loginId, created_date = :createdDate, last_modified_id = :lastModifiedId, last_modified_date = :lastModifiedDate \r\n"
			+ " where  item_code = :itemCode AND  material_code = :materialCode AND file_audit_id = :fileAuditId\r\n"
			+ " IF @@ROWCOUNT = 0 \r\n"
			+ " Insert into item_material_mapping_stage (id, item_code, no_of_other_item, material_code, is_active, login_id, created_date, \r\n"
			+ " last_modified_id, last_modified_date, file_audit_id) values (NEWID(), :itemCode, :noOfOtherItem, :materialCode, :isActive, \r\n"
			+ " :loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :fileAuditId)";
	
	//private static final String ITEM_STONE_MAPPING_INSERT_QUERY = "Insert into item_stone_mapping_stage (id, item_code, no_of_stones, stone_code, is_active,login_id, created_date,last_modified_id, last_modified_date, file_audit_id) values (NEWID(), :itemCode, :noOfStones, :stoneCode, :isActive, :loginId, :createdDate, :lastModifiedId, :lastModifiedDate, :fileAuditId)";

	private static final String ITEM_STONE_MAPPING_INSERT_QUERY = "UPDATE item_stone_mapping_stage SET no_of_stones = :noOfStones, \r\n"
			+ " is_active = :isActive, login_id = :loginId, created_date = :createdDate, last_modified_id = :lastModifiedId, \r\n"
			+ " last_modified_date = :lastModifiedDate where item_code = :itemCode AND stone_code = :stoneCode AND file_audit_id = :fileAuditId \r\n"
			+ " IF @@ROWCOUNT = 0 \r\n"
			+ " Insert into item_stone_mapping_stage (id, item_code, no_of_stones, stone_code, is_active,login_id, \r\n"
			+ " created_date,last_modified_id, last_modified_date, file_audit_id) \r\n"
			+ " values (NEWID(), :itemCode, :noOfStones, :stoneCode, :isActive, :loginId, :createdDate, :lastModifiedId, \r\n"
			+ " :lastModifiedDate, :fileAuditId)";

	
	@Bean()
	public JdbcBatchItemWriter<ItemMasterStageDto> itemMasterStagingWriter() {

		JdbcBatchItemWriter<ItemMasterStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(ITEM_MASTER_STAGE_INSERT_QUERY);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<ItemMasterStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<StoneMasterStageDto> stoneMasterStagingWriter() {

		JdbcBatchItemWriter<StoneMasterStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(STONE_MASTER_INSERT_QUERY);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<StoneMasterStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<MaterialMasterStageDto> materialMasterStagingWriter() {

		JdbcBatchItemWriter<MaterialMasterStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(MATERIAL_MASTER_INSERT_QUERY);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<MaterialMasterStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<PriceMasterStageDto> priceMasterStagingWriter() {

		JdbcBatchItemWriter<PriceMasterStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(PRICE_MASTER_INSERT_QUERY);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<PriceMasterStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<ItemStoneStageDto> itemStoneMappingStagingWriter() {

		JdbcBatchItemWriter<ItemStoneStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(ITEM_STONE_MAPPING_INSERT_QUERY);
		itemWriter
				.setItemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<ItemStoneStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

	@Bean()
	public JdbcBatchItemWriter<ItemMaterialStageDto> itemMaterialMappingStagingWriter() {

		JdbcBatchItemWriter<ItemMaterialStageDto> itemWriter = new JdbcBatchItemWriter<>();
		itemWriter.setDataSource(dataSource);
		itemWriter.setSql(ITEM_MATERIAL_MAPPING_INSERT_QUERY);
		itemWriter.setItemSqlParameterSourceProvider(
				new BeanPropertyItemSqlParameterSourceProvider<ItemMaterialStageDto>());
		itemWriter.afterPropertiesSet();
		return itemWriter;
	}

}
