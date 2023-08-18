/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.service.FileService;
import com.titan.poss.location.dao.BrandDao;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.repository.BrandRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class ItemMasterIngestionTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private FileService fileService;

	@Autowired
	EngineServiceClient engineClient;
	
	@Autowired
	private BrandRepository brandRepository;
	
	private static final String ERR_PRO_001 = "ERR-PRO-001";
	private static final String NO_BRAND_DETAILS_FOUND_FOR_THE_REQUESTED_BRANDCODE = "No Brand details found for the requested brandCode";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("itemMasterFileAuditId");
		SqlRowSet response = jdbcTemplate
				.queryForRowSet("Select brand_code from item_master_stage where file_audit_id ='" + fileAuditId + "'");
		
		String brandCode = null;
		while (response.next()) {
			brandCode = response.getString("brand_code");
			log.info("Brand Code: {}", brandCode);
			if (brandCode != null && !(brandCode.isEmpty()))
				break;
		}
		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		String weightUnit = countryData.getWeightUnit();
		//BrandDto brandDto = engineClient.getBrand(brandCode);

		BrandDao brand = brandRepository.findOneByBrandCode(brandCode);

		if (brand == null) {
			throw new ServiceException(NO_BRAND_DETAILS_FOUND_FOR_THE_REQUESTED_BRANDCODE, ERR_PRO_001);
		}

		BrandDto brandDto = (BrandDto) MapperUtil.getObjectMapping(brand, new BrandDto());
		
		if (brand.getOrganization() != null) {
			brandDto.setOrgCode(brand.getOrganization().getOrgCode());
		}
		log.info("Brand DTO: {}", brandDto);

		// @formatter:off
		
		String updateStatusOfInsertFlowRecords = "update item_master_stage set transfer_type = 'INSERT' where  file_audit_id = '"
				+ fileAuditId + "' and \r\n" + "item_code not in  (select item_code from products.dbo.item_master im )";
		
		String itemMasterInsertSql = "insert into products.dbo.item_master(item_code, stone_weight, diamond_caratage, diamond_color, diamond_clarity, stone_combination, product_type,description, std_weight, std_value, complexity_code, product_group_code, product_category_code,\r\n"
				+ "brand_code, item_type_code, purity, karat , pricing_group_type, pricing_type, stone_charges, lead_time, org_code, parent_item_code, \r\n"
				+ "item_details, config_details, is_active, created_by, created_date, last_modified_by, last_modified_date, is_editable, tax_class_code,\r\n"
				+ "currency_code, weight_unit, src_sync_id, dest_sync_id, is_foc_item, price_factor, correlation_id, is_saleable, is_returnable, hsn_sac_code,tot_category)\r\n"
				+ "SELECT item_code,stone_weight,diamond_caratage,diamond_color,diamond_clarity,stone_combination,product_type,description\r\n"
				+ ",std_weight,std_price,complexity_code,cfa_product_code,\r\n"
				+ "product_code,brand_code,material_code,purity,karatage,\r\n"
				+ "pricing_group_type,pricing_type,stone_charges,lead_time,'"+brandDto.getOrgCode()+ "',parent_ref, item_details,config_details,'true',login_id,created_date,last_modified_id,\r\n"
				+ "last_modified_date,'false',tax_class,'" + currencyCode + "','" + weightUnit
				+ "',0,0,is_foc_item,price_factor,file_audit_id, is_saleable, is_returnable, hsn_sac_code,tot_category FROM item_master_stage\r\n"
				+ "where file_audit_id = '" + fileAuditId + "' AND transfer_type = 'INSERT'";
		
		String itemMasterUpdateSql = "update products.dbo.item_master\r\n" + "set description=t2.description,\r\n"
				+ "std_weight=t2.std_weight,\r\n" + "std_value=t2.std_price,\r\n"
				+ "complexity_code=t2.complexity_code,\r\n"
				+ "product_group_code=t2.cfa_product_code,stone_weight=t2.stone_weight,diamond_caratage=t2.diamond_caratage,diamond_color=t2.diamond_color,diamond_clarity=t2.diamond_clarity,stone_combination=t2.stone_combination, product_type = t2.product_type, product_category_code=t2.product_code,\r\n"
				+ "brand_code=t2.brand_code, item_type_code = t2.material_code , purity=t2.purity, karat =t2.karatage, pricing_group_type=t2.pricing_group_type,\r\n"
				+ "pricing_type=t2.pricing_type, stone_charges=t2.stone_charges, lead_time=t2.lead_time, org_code='"+brandDto.getOrgCode()+"', parent_item_code=t2.parent_ref, \r\n"
				+ "item_details=t2.item_details, config_details=t2.config_details, is_active='true', created_by=t2.login_id, created_date=t2.created_date, last_modified_by=t2.last_modified_id,\r\n"
				+ "last_modified_date=t2.last_modified_date, is_editable='false', tax_class_code=t2.tax_class,\r\n"
				+ "currency_code='" + currencyCode + "', weight_unit='" + weightUnit
				+ "', src_sync_id=t1.src_sync_id+1, dest_sync_id=0, is_foc_item=t2.is_foc_item, price_factor=t2.price_factor,\r\n"
				+ "correlation_id=t2.file_audit_id, is_saleable=t2.is_saleable, is_returnable=t2.is_returnable, hsn_sac_code = t2.hsn_sac_code,tot_category = t2.tot_category\r\n"
				+ "from products.dbo.item_master t1\r\n" + "inner join item_master_stage t2\r\n"
				+ "on t1.item_code = t2.item_code where t2.file_audit_id ='" + fileAuditId
				+ "' and t2.transfer_type = 'UPDATE'";
		
		// @formatter:on
		try {
			jdbcTemplate.execute(updateStatusOfInsertFlowRecords);
			jdbcTemplate.execute(itemMasterInsertSql);
			jdbcTemplate.execute(itemMasterUpdateSql);
		} catch (Exception ex) {
			log.info("Exception details  :" + ex.getStackTrace());
		}

		return RepeatStatus.FINISHED;
	}
	
}
