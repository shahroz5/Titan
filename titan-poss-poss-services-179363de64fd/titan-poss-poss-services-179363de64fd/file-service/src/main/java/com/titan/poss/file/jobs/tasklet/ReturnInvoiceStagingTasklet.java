/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.InvoiceIsacDetailsDto;
import com.titan.poss.file.jobs.mapper.LotMaterialDetailsMapper;
import com.titan.poss.file.jobs.mapper.LotStoneDetailsMapper;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;
import com.titan.poss.inventory.repository.StockInvoiceRepository;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.sales.dto.WeightDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ReturnInvoiceStagingTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private StockInvoiceRepository stockInvoiceRepository;

	@Autowired
	private LotMaterialDetailsMapper lotMaterialDetailsMapper;

	@Autowired
	private LotStoneDetailsMapper lotStoneDetailsMapper;

	private static final String PERC = "PERC";
	private static final String VALUE = "VALUE";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("returnInvoiceTransactionId");
		String stockInvoiceId = (String) chunkContext.getStepContext().getJobParameters().get("stockInvoiceId");

		// read stock invoice (IHDR)
		Optional<StockInvoiceDao> stockInvoice = stockInvoiceRepository.findById(Integer.parseInt(stockInvoiceId));
		if (!stockInvoice.isPresent()) {
			return RepeatStatus.FINISHED;
		}

		String cfaProductGroupSql = "Select distinct(product_group) from inventory.dbo.stock_invoice_details where stock_invoice_id = "
				+ stockInvoiceId;
		List<String> cfaProductGroups = jdbcTemplate.queryForList(cfaProductGroupSql, String.class);

		String sapCodeSql = "select JSON_VALUE(banking_details ,'$.data.sapCode') from locations.dbo.location_master lm  where location_code ='"
				+ stockInvoice.get().getSrcLocationCode() + "'";
		String sapCode = jdbcTemplate.queryForObject(sapCodeSql, String.class);

		for (String cfaProductGroup : cfaProductGroups) {
			// Insert IHDR to stage table
			String ihdrInsertSql = "Insert into return_inv_ihdr_stage (type,constant1,l3_boutique_code,constant_value,product_group,document_number,\r\n"
					+ "transaction_date,fy,constant2,sap_code,qty,weight,value,bill_level_discount,tax,other_charges,file_id)\r\n"
					+ "values ('IHDR', 'TIL','" + stockInvoice.get().getSrcLocationCode() + "','" + CommonConstants.ZERO
					+ "','" + cfaProductGroup + "','" + stockInvoice.get().getSrcDocNo() + "','"
					+ stockInvoice.get().getSrcDocDate().toString().replace("-", "") + "','"
					+ stockInvoice.get().getSrcFiscalYear() + "','" + CommonConstants.ZERO + "','" + sapCode + "','"
					+ stockInvoice.get().getTotalIssuedQuantity() + "','" + stockInvoice.get().getTotalIssuedWeight()
					+ "','" + stockInvoice.get().getTotalIssuedValue() + "',0,null,0,'" + fileId + "')";
			jdbcTemplate.execute(ihdrInsertSql);

			// read and insert IDTL to stage table
			String stockDetailsSql = "Select * from inventory.dbo.stock_invoice_details where stock_invoice_id = '"
					+ stockInvoiceId + "' and product_group = '" + cfaProductGroup + "';";
			List<StockInvoiceDetailsDao> stockInvoiceDetails = namedParameterJdbcTemplate.query(stockDetailsSql,
					new BeanPropertyRowMapper<>(StockInvoiceDetailsDao.class));

			String variantTypeSql = "Select plain_studded from products.dbo.product_group_master where product_group_code = '"
					+ cfaProductGroup + "'";
			String variantType = jdbcTemplate.queryForObject(variantTypeSql, String.class);
			if (variantType != null && variantType.equalsIgnoreCase(PlainStuddedEnum.P.toString())) {
				variantType = "PLAIN";
			} else if (variantType != null && variantType.equalsIgnoreCase(PlainStuddedEnum.S.toString())) {
				variantType = "STUDDED";
			} else {
				variantType = "OTHERS";
			}

			for (int i = 0; i < stockInvoiceDetails.size(); i++) {

				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(stockInvoiceDetails.get(i).getIssuedWeightDetails()),
						JsonData.class);
				WeightDetailsDto weightDetails = MapperUtil.mapObjToClass(jsonData.getData(), WeightDetailsDto.class);

				InvoiceIsacDetailsDto igstIsacDetails = getIsacDetails(stockInvoiceDetails.get(i).getIsacDetails(),
						"IGST");
				InvoiceIsacDetailsDto sgstIsacDetails = getIsacDetails(stockInvoiceDetails.get(i).getIsacDetails(),
						"SGST");
				InvoiceIsacDetailsDto cgstIsacDetails = getIsacDetails(stockInvoiceDetails.get(i).getIsacDetails(),
						"CGST");
				InvoiceIsacDetailsDto utgstIsacDetails = getIsacDetails(stockInvoiceDetails.get(i).getIsacDetails(),
						"UTGST");
				String idtlInsertSql = "Insert into return_inv_idtl_stage (type,constant1,l3_boutique_code,document_number1,product_group,constant2,document_number2,transaction_date,fy,constant3,sap_code,sl_no,variant_type,item_code,\r\n"
						+ "unit_price_without_tax,qty,weight,total_value_plus_tax,lot_number,actual_f1,diamond_weight,other_stone_weight,igst_per,igst_value,cgst_per,cgst_value,sgst_per,sgst_value,utgst_per,utgst_value,go_new_wt,\r\n"
						+ "pt_new_wt,stn_net_wt,si_net_wt,other_net_wt,file_id) values ('IDTL','TIL','"
						+ stockInvoice.get().getSrcLocationCode() + "','" + stockInvoice.get().getSrcDocNo() + "','"
						+ cfaProductGroup + "','" + CommonConstants.ZERO + "','" + stockInvoice.get().getSrcDocNo()
						+ "','" + stockInvoice.get().getSrcDocDate().toString().replace("-", "") + "','"
						+ stockInvoice.get().getSrcFiscalYear() + "','" + CommonConstants.ZERO + "','" + sapCode + "','"
						+ (i+1) + "','" + variantType + "','" + stockInvoiceDetails.get(i).getItemCode() + "','"
						+ stockInvoiceDetails.get(i).getStdValue() + "','"
						+ stockInvoiceDetails.get(i).getIssuedQuantity() + "','"
						+ stockInvoiceDetails.get(i).getIssuedWeight() + "','"
						+ stockInvoiceDetails.get(i).getNetValue() + "','" + stockInvoiceDetails.get(i).getLotNumber()
						+ "','" + getStoneValue(stockInvoiceDetails.get(i).getItemDetails()) + "','"
						+ weightDetails.getDiamondWeight() + "','" + weightDetails.getStoneWeight() + "','"
						+ checkIfNull(igstIsacDetails, PERC) + "','" + checkIfNull(igstIsacDetails, VALUE) + "','"
						+ checkIfNull(sgstIsacDetails, PERC) + "','" + checkIfNull(sgstIsacDetails, VALUE) + "','"
						+ checkIfNull(cgstIsacDetails, PERC) + "','" + checkIfNull(cgstIsacDetails, VALUE) + "','"
						+ checkIfNull(utgstIsacDetails, PERC) + "','" + checkIfNull(utgstIsacDetails, VALUE) + "','"
						+ weightDetails.getGoldWeight() + "','" + weightDetails.getPlatinumWeight() + "','"
						+ CommonConstants.ZERO + "','" + weightDetails.getSilverWeight() + "','"
						+ weightDetails.getMaterialWeight() + "','" + fileId + "')";

				jdbcTemplate.execute(idtlInsertSql);

				// insert ildtl
				insertIldtlRecords((i + 1), stockInvoiceDetails.get(i).getItemCode(),
						stockInvoiceDetails.get(i).getLotNumber(), fileId, cfaProductGroup);

				// insert imdtl
				insertIMdtlRecords((i + 1), stockInvoiceDetails.get(i).getItemCode(),
						stockInvoiceDetails.get(i).getLotNumber(), fileId, cfaProductGroup);

			}

		}
		return RepeatStatus.FINISHED;
	}

	private void insertIldtlRecords(int i, String itemCode, String lotNumber, String fileId, String productGroup) {
		String lotStoneDetailsSql = "Select * from products.dbo.lot_stone_details where item_code = '" + itemCode
				+ "' and lot_number = '" + lotNumber + "';";
		List<LotDetailsDao> lotStoneDetails = namedParameterJdbcTemplate.query(lotStoneDetailsSql,
				lotStoneDetailsMapper);
		for (int j = 0; j < lotStoneDetails.size(); j++) {
			String ildtlInsertSql = "Insert into return_inv_ildtl_stage (type,line_count,line_dtl_count,item_no,weight,qty,file_id,product_group) values ('LDTL','"
					+ i + "','" + (j+1) + "','" + lotStoneDetails.get(j).getStone().getStoneCode() + "','"
					+ lotStoneDetails.get(j).getStoneWeight().divide(new BigDecimal("5")).setScale(3) + "','" + lotStoneDetails.get(j).getNoOfStones() + "','"
					+ fileId + "','" + productGroup + "')";
			jdbcTemplate.execute(ildtlInsertSql);
		}
	}

	private void insertIMdtlRecords(int i, String itemCode, String lotNumber, String fileId, String productGroup) {
		String lotMaterialeDetailsSql = "Select * from products.dbo.lot_material_details where item_code = '" + itemCode
				+ "' and lot_number = '" + lotNumber + "';";
		List<LotMaterialDetailsDao> lotMaterialDetails = namedParameterJdbcTemplate.query(lotMaterialeDetailsSql,
				lotMaterialDetailsMapper);
		for (int j = 0; j < lotMaterialDetails.size(); j++) {
			String iMdtlInsertSql = "Insert into return_inv_imdtl_stage (type,line_count,line_dtl_count,item_no,weight,qty,file_id,product_group) values ('MDTL','"
					+ i + "','" + (j+1) + "','"
					+ lotMaterialDetails.get(j).getMaterial().getMaterialCode() + "','"
					+ lotMaterialDetails.get(j).getMaterialWeight() + "','"
					+ lotMaterialDetails.get(j).getNoOfMaterials() + "','" + fileId + "','" + productGroup + "')";
			jdbcTemplate.execute(iMdtlInsertSql);
		}
	}

	private InvoiceIsacDetailsDto getIsacDetails(String jsonString, String glKey) {
		if (!StringUtils.isEmpty(jsonString)) {
			JsonData jsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(jsonString), JsonData.class);
			JsonObject jsonObjectData = new JsonParser().parse(jsonData.getData().toString()).getAsJsonObject();
			List<InvoiceIsacDetailsDto> isacList = new ArrayList<>();
			if (jsonObjectData != null) {
				JsonArray isacArray = jsonObjectData.getAsJsonArray("IsacDetails").getAsJsonArray();
				for (JsonElement isac : isacArray) {
					isacList.add(MapperUtil.getObjectMapperInstance()
							.convertValue(MapperUtil.getJsonFromString(isac.toString()), InvoiceIsacDetailsDto.class));
				}
			}
			List<InvoiceIsacDetailsDto> result = isacList.stream()
					.filter(isac -> isac.getGlKey().equalsIgnoreCase(glKey)).collect(Collectors.toList());
			return result.isEmpty() ? null : result.get(0);
		}
		return null;
	}

	private BigDecimal checkIfNull(InvoiceIsacDetailsDto isac, String value) {
		if (isac == null) {
			return new BigDecimal("0");
		} else {
			if (value.equalsIgnoreCase(VALUE)) {
				return isac.getAmount();
			} else {
				return isac.getPercentage();
			}
		}
	}

	private String getStoneValue(String jsonData) {
		JsonElement jsonElement = new JsonParser().parse(jsonData);
		JsonObject jsonObjectData = null;
		if (jsonElement != null)
			jsonObjectData = jsonElement.getAsJsonObject().getAsJsonObject("data");
		if (jsonObjectData != null) {
			return JsonUtils.getValueFromJsonWithNullCheck(jsonObjectData, "stoneValue");
		}
		return "0";
	}
}
