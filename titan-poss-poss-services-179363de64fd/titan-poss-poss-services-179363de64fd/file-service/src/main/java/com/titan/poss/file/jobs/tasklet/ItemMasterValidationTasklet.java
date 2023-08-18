/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.ItemMasterStageDto;
import com.titan.poss.file.service.DataAuditService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemMasterValidationTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	private static final String SELECT_FROM_ITEM_MASTER_STAGE = "SELECT * FROM item_master_stage where file_audit_id = '";

	private static final String DOES_NOT_EXIST = " does not exist";

	@Value("${purity.platinum:95.00000}")
	private String platinumPurityValue;

	@Value("${purity.silver:92.50000}")
	private String silverPurityValue;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("itemMasterFileAuditId");

		List<String> itemCodesErrorList = new ArrayList<>();

		// checking for complexity code
		String complexityCodeSql = "select (complexity_code ) from item_master_stage ims where file_audit_id ='"
				+ fileAuditId + "' and complexity_code not in (\r\n"
				+ "select (complexity_code ) from products.dbo.complexity_master cm )";
		String complexityCodeErrorSql = SELECT_FROM_ITEM_MASTER_STAGE + fileAuditId + "' and complexity_code IN ("
				+ complexityCodeSql + ")";
		List<ItemMasterStageDto> itemMasterErrorList = namedParameterJdbcTemplate.query(complexityCodeErrorSql,
				new BeanPropertyRowMapper<>(ItemMasterStageDto.class));
		itemMasterErrorList.stream().forEach(item -> {
			itemCodesErrorList.add(item.getItemCode());
			dataAuditService.saveDataAuditData(item.getItemCode(), MapperUtil.getJsonString(item),
					"Complexity code: " + item.getComplexityCode() + DOES_NOT_EXIST + " in complexity master.",
					fileAuditId, ErrorTypeEnum.ERROR.toString());
		});

		// checking for product group
		String productGroupSql = "select (cfa_product_code) from item_master_stage ims where file_audit_id ='"
				+ fileAuditId + "' and cfa_product_code not in (\r\n"
				+ "select (product_group_code ) from products.dbo.product_group_master pgm  )";
		String productGroupErrorSql = SELECT_FROM_ITEM_MASTER_STAGE + fileAuditId + "' and cfa_product_code IN ("
				+ productGroupSql + ")";
		itemMasterErrorList.clear();
		itemMasterErrorList = namedParameterJdbcTemplate.query(productGroupErrorSql,
				new BeanPropertyRowMapper<>(ItemMasterStageDto.class));
		itemMasterErrorList.stream().forEach(item -> {
			itemCodesErrorList.add(item.getItemCode());
			dataAuditService.saveDataAuditData(item.getItemCode(), MapperUtil.getJsonString(item),
					"cfa product code: " + item.getCfaProductCode() + DOES_NOT_EXIST + " in product group master.",
					fileAuditId, ErrorTypeEnum.ERROR.toString());
		});

		// checking for product category
		String productCategorySql = "select (product_code) from item_master_stage ims where file_audit_id ='"
				+ fileAuditId + "' and product_code not in (\r\n"
				+ "select (product_category_code ) from products.dbo.product_category_master pcm )";
		String sql = SELECT_FROM_ITEM_MASTER_STAGE + fileAuditId + "' and product_code IN (" + productCategorySql + ")";
		itemMasterErrorList.clear();
		itemMasterErrorList = namedParameterJdbcTemplate.query(sql,
				new BeanPropertyRowMapper<>(ItemMasterStageDto.class));
		itemMasterErrorList.stream().forEach(item -> {
			itemCodesErrorList.add(item.getItemCode());
			dataAuditService.saveDataAuditData(item.getItemCode(), MapperUtil.getJsonString(item),
					"product category: " + item.getProductCode() + DOES_NOT_EXIST + " in product category master.",
					fileAuditId, ErrorTypeEnum.ERROR.toString());
		});

		// validate parent ref
		validateParentRef(fileAuditId, itemCodesErrorList);

		// checking for material code
		validateMaterialCodeError(fileAuditId, itemCodesErrorList);

		// removing failed records from staging db
		if (!itemCodesErrorList.isEmpty()) {
			List<String> itemCodeErrList = new ArrayList<>();
			for (int index = 0; index < itemCodesErrorList.size(); index++) {
				itemCodeErrList.add(itemCodesErrorList.get(index));
				if (itemCodeErrList.size() == 2000 || index + 1 == itemCodesErrorList.size()) {
					removeItemCodeErrors(itemCodeErrList, fileAuditId);
					itemCodeErrList.clear();
				}
			}
		}

		// updating purity based on cfa code
		String updatePuritySql = "UPDATE [file].dbo.item_master_stage \r\n" + "set purity = CASE \r\n"
				+ "WHEN pg.item_type_code = 'L' THEN '" + platinumPurityValue + "' \r\n"
				+ "WHEN pg.item_type_code = 'P' THEN '" + silverPurityValue + "' \r\n"
				+ "WHEN pg.item_type_code = 'LJ' THEN '" + platinumPurityValue + "'\r\n" + "ELSE ims.purity END\r\n"
				+ "from [file].dbo.item_master_stage ims inner join products.dbo.product_group_master pg on ims.cfa_product_code = pg.product_group_code "
				+ " where ims.file_audit_id ='" + fileAuditId + "'";
		jdbcTemplate.execute(updatePuritySql);

		return RepeatStatus.FINISHED;
	}

	private void validateParentRef(String fileAuditId, List<String> itemCodesErrorList) {
		String parentRefSql = "select (parent_ref) from item_master_stage ims where file_audit_id ='" + fileAuditId
				+ "' and parent_ref is not null and parent_ref not in (\r\n"
				+ "select (item_code) from products.dbo.item_master im )";
		String sql = SELECT_FROM_ITEM_MASTER_STAGE + fileAuditId + "' and parent_ref IN (" + parentRefSql + ")";
		List<ItemMasterStageDto> itemMasterErrorList = namedParameterJdbcTemplate.query(sql,
				new BeanPropertyRowMapper<>(ItemMasterStageDto.class));
		itemMasterErrorList.stream().forEach(item -> {
			itemCodesErrorList.add(item.getItemCode());
			dataAuditService.saveDataAuditData(item.getItemCode(), MapperUtil.getJsonString(item),
					"parent ref: " + item.getParentRef() + DOES_NOT_EXIST + " in item master.", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});
	}

	private void validateMaterialCodeError(String fileAuditId, List<String> itemCodesErrorList) {
		String masterialCodeSql = "select (material_code) from item_master_stage ims where file_audit_id ='"
				+ fileAuditId + "' and material_code not in (\r\n"
				+ "select (item_type_code ) from products.dbo.item_type_master itm)";
		String sql = SELECT_FROM_ITEM_MASTER_STAGE + fileAuditId + "' and material_code IN (" + masterialCodeSql + ")";
		List<ItemMasterStageDto> itemMasterErrorList = namedParameterJdbcTemplate.query(sql,
				new BeanPropertyRowMapper<>(ItemMasterStageDto.class));
		itemMasterErrorList.stream().forEach(item -> {
			itemCodesErrorList.add(item.getItemCode());
			dataAuditService.saveDataAuditData(item.getItemCode(), MapperUtil.getJsonString(item),
					"material code: " + item.getProductCode() + DOES_NOT_EXIST + " in item type master.", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		});
	}

	private void removeItemCodeErrors(List<String> itemCodeErrorList, String fileAuditId) {
		SqlParameterSource parameters = new MapSqlParameterSource("itemCodes", itemCodeErrorList);
		String removeSql = "DELETE FROM item_master_stage where file_audit_id = '" + fileAuditId
				+ "' and item_code IN (:itemCodes)";
		namedParameterJdbcTemplate.update(removeSql, parameters);
	}
}
