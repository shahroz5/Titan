/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.jobs.mapper.LotMaterialDetailsMapper;
import com.titan.poss.file.jobs.mapper.LotStoneDetailsMapper;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.repository.StockTransferDetailsRepository;
import com.titan.poss.inventory.repository.StockTransferRepository;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class StnIbtStagingTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private StockTransferDetailsRepository stockTransferDetailsRepository;

	@Autowired
	private StockTransferRepository stockTransferRepository;

	@Autowired
	private LotMaterialDetailsMapper lotMaterialDetailsMapper;

	@Autowired
	private LotStoneDetailsMapper lotStoneDetailsMapper;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext().get("ibtStnTransactionId");
		String stockTransferId = (String) chunkContext.getStepContext().getJobParameters().get("stockTransferId");

		// read stock invoice (IHDR)
		Optional<StockTransferDao> stockTransfer = stockTransferRepository.findById(Integer.parseInt(stockTransferId));
		if (!stockTransfer.isPresent()) {
			return RepeatStatus.FINISHED;
		}
		String cfaProductGroupSql = "Select distinct(product_group) from inventory.dbo.stock_transfer_details where stock_transfer_id = "
				+ stockTransferId;
		List<String> cfaProductGroups = jdbcTemplate.queryForList(cfaProductGroupSql, String.class);

		for (String productGroup : cfaProductGroups) {
			// Insert IHDR to stage table
			String carrierName = "";
			String docketNumber = "";
			try {
				JsonObject jsonObject = new JsonParser().parse(stockTransfer.get().getCarrierDetails())
						.getAsJsonObject();
				carrierName = jsonObject.getAsJsonObject("data").get("companyName").getAsString();
				docketNumber = jsonObject.getAsJsonObject("data").get("docketNumber").getAsString();
			} catch (Exception ex) {
				log.debug("Exception while getting courier name. " + ex);
			}

			String hdrInsertSql = "INSERT into [file].dbo.stn_hdr_stage(location,product_group_code,transfer_type,delivery_no,stm_date,factory_code,ship_qty,ship_qty2,stm_value,\r\n"
					+ "carrier_name,created_by,stm_created_date,stm_created_time,modified_by,docket_number,file_id,created_year,created_date,carrier_details,stock_transfer_type) \r\n"
					+ "VALUES ('" + stockTransfer.get().getDestLocationCode() + "','" + productGroup + "',201,'"
					+ stockTransfer.get().getSrcDocNo() + "','"
					+ stockTransfer.get().getSrcDocDate().toString().replace("-", "") + "','"
					+ stockTransfer.get().getSrcLocationCode() + "','" + stockTransfer.get().getTotalIssuedQuantity()
					+ "','" + stockTransfer.get().getTotalIssuedWeight() + "','"
					+ stockTransfer.get().getTotalIssuedValue() + "','" + carrierName + "','"
					+ stockTransfer.get().getCreatedBy() + "','" + stockTransfer.get().getCreatedDate() + "','"
					+ stockTransfer.get().getCreatedDate() + "','" + stockTransfer.get().getLastModifiedBy() + "','"
					+ docketNumber + "','" + fileId + "','" + stockTransfer.get().getSrcFiscalYear() + "','" + stockTransfer.get().getCreatedDate()
					+ "',null,'" + stockTransfer.get().getTransferType() + "')";
			jdbcTemplate.execute(hdrInsertSql);

			List<StockTransferDetailsDao> stockTransferDetails = stockTransferDetailsRepository
					.findByStockTransferAndProductGroup(stockTransfer.get(), productGroup);

			for (int i = 0; i < stockTransferDetails.size(); i++) {

				// read and insert stn dtl stage table

				String actualF1 = "0";
				BigDecimal diamondWeight = BigDecimal.ZERO;
				BigDecimal otherStoneWeight = BigDecimal.ZERO;
				BigDecimal goldWeight = BigDecimal.ZERO;
				BigDecimal platinumWeight = BigDecimal.ZERO;
				BigDecimal silverWeight = BigDecimal.ZERO;
				BigDecimal otherMaterialWeight = BigDecimal.ZERO;

				BigDecimal igstVal = BigDecimal.ZERO;
				BigDecimal igstPerc = BigDecimal.ZERO;
				BigDecimal cgstVal = BigDecimal.ZERO;
				BigDecimal cgstPerc = BigDecimal.ZERO;
				BigDecimal sgstVal = BigDecimal.ZERO;
				BigDecimal sgstPerc = BigDecimal.ZERO;
				BigDecimal utgstVal = BigDecimal.ZERO;
				BigDecimal utgstPerc = BigDecimal.ZERO;

				try {
					JsonObject itemDetailsJsonObject = new JsonParser()
							.parse(stockTransferDetails.get(i).getItemDetails()).getAsJsonObject();
					actualF1 = itemDetailsJsonObject.getAsJsonObject("data").get("stoneValue").getAsString();
					JsonObject weightDetailsJsonObject = new JsonParser()
							.parse(stockTransferDetails.get(i).getIssuedWeightDetails()).getAsJsonObject();
					diamondWeight = weightDetailsJsonObject.getAsJsonObject("data").get("diamondWeight")
							.getAsBigDecimal().setScale(3, RoundingMode.HALF_UP);
					otherStoneWeight = weightDetailsJsonObject.getAsJsonObject("data").get("stoneWeight")
							.getAsBigDecimal().setScale(3, RoundingMode.HALF_UP);
					goldWeight = weightDetailsJsonObject.getAsJsonObject("data").get("goldWeight").getAsBigDecimal()
							.setScale(3, RoundingMode.HALF_UP);
					silverWeight = weightDetailsJsonObject.getAsJsonObject("data").get("silverWeight").getAsBigDecimal()
							.setScale(3, RoundingMode.HALF_UP);
					platinumWeight = weightDetailsJsonObject.getAsJsonObject("data").get("platinumWeight")
							.getAsBigDecimal().setScale(3, RoundingMode.HALF_UP);
					otherMaterialWeight = weightDetailsJsonObject.getAsJsonObject("data").get("materialWeight")
							.getAsBigDecimal().setScale(3, RoundingMode.HALF_UP);

					JsonObject taxDetailsJsonObject = new JsonParser()
							.parse(stockTransferDetails.get(i).getTaxDetails()).getAsJsonObject();
					igstVal = taxDetailsJsonObject.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
					igstPerc = taxDetailsJsonObject.getAsJsonObject("data").get("IGSTPct").getAsBigDecimal();
					cgstVal = taxDetailsJsonObject.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
					cgstPerc = taxDetailsJsonObject.getAsJsonObject("data").get("CGSTPct").getAsBigDecimal();
					sgstVal = taxDetailsJsonObject.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
					sgstPerc = taxDetailsJsonObject.getAsJsonObject("data").get("SGSTPct").getAsBigDecimal();
					utgstVal = taxDetailsJsonObject.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();
					utgstPerc = taxDetailsJsonObject.getAsJsonObject("data").get("UTGSTPct").getAsBigDecimal();
				} catch (Exception ex) {
					log.debug("Exception while getting json data. " + ex);
				}
				stockTransferDetails.get(i).setReferenceNo(stockTransferDetails.get(i).getReferenceNo()!=null?stockTransferDetails.get(i).getReferenceNo():"");
				log.info("stockTransferDetails   getReferenceNo() {}",stockTransferDetails.get(i).getReferenceNo());       
				String dtlInsertSql = "INSERT into [file].dbo.stn_dtl_stage (product_group,sl_no,stm_date,order_type,product_code,product_value1,product_qty,product_wt,product_value2,\r\n"
						+ "lot_number,actual_f1,diamond_wt,other_stone_wt,order_no,igst_perc,igst_val,sgst_perc,sgst_val,cgst_perc,cgst_val,utgst_perc,utgst_val,[go_net_wt],\r\n"
						+ "pt_net_wt,stn_net_wt,si_net_wt,other_net_wt,file_id,created_by,created_date,bin_code,bin_group_code,tax_details,issued_weight_details,item_details,\r\n"
						+ "product_category) values ('" + stockTransferDetails.get(i).getProductGroup() + "','"
						+ (i + 1) + "','" + stockTransfer.get().getSrcDocDate().toString().replace("-", "") + "','0','"
						+ stockTransferDetails.get(i).getItemCode() + "','" + stockTransferDetails.get(i).getStdValue()
						+ "','" + stockTransferDetails.get(i).getIssuedQuantity() + "','"
						+ stockTransferDetails.get(i).getIssuedWeight() + "','"
						+ stockTransferDetails.get(i).getIssuedValue() + "','"
						+ stockTransferDetails.get(i).getLotNumber() + "','" + actualF1 + "','" + diamondWeight + "','"
						+ otherStoneWeight + "','" + stockTransferDetails.get(i).getReferenceNo() + "','" + igstPerc
						+ "','" + igstVal + "','" + sgstPerc + "','" + sgstVal + "','" + cgstPerc + "','" + cgstVal
						+ "','" + utgstPerc + "','" + utgstVal + "','" + goldWeight + "','" + platinumWeight + "','0','"
						+ silverWeight + "','" + otherMaterialWeight + "','" + fileId + "','"
						+ stockTransfer.get().getCreatedBy() + "','" + stockTransfer.get().getCreatedDate() + "','"
						+ stockTransferDetails.get(i).getBinCode() + "','"
						+ stockTransferDetails.get(i).getBinGroupCode() + "', null,null,'"
						+ stockTransferDetails.get(i).getItemDetails() + "','"
						+ stockTransferDetails.get(i).getProductCategory() + "')";

				jdbcTemplate.execute(dtlInsertSql);

				// insert ildtl
				insertIldtlRecords((i + 1), stockTransferDetails.get(i).getItemCode(),
						stockTransferDetails.get(i).getLotNumber(), fileId, productGroup,stockTransfer);

				// insert imdtl
				insertIMdtlRecords((i + 1), stockTransferDetails.get(i).getItemCode(),
						stockTransferDetails.get(i).getLotNumber(), fileId, productGroup,stockTransfer);

			}
		}
		return RepeatStatus.FINISHED;
	}

	private void insertIldtlRecords(int i, String itemCode, String lotNumber, String fileId, String productGroup, Optional<StockTransferDao> stockTransfer) {
		String lotStoneDetailsSql = "Select * from products.dbo.lot_stone_details where item_code = '" + itemCode
				+ "' and lot_number = '" + lotNumber + "';";
		List<LotDetailsDao> lotStoneDetails = namedParameterJdbcTemplate.query(lotStoneDetailsSql,
				lotStoneDetailsMapper);
		for (int j = 0; j < lotStoneDetails.size(); j++) {
			String ldtlInsertSql = "INSERT into [file].dbo.stn_ldtl_stage (line_count,line_dtl_count,item_no,stn_weight,stn_qty,item_code,lot_number,file_id,"
					+ "created_by,created_date,insert_update, product_group) values ('" + i + "','" + (j + 1) + "','"
					+ lotStoneDetails.get(j).getStone().getStoneCode() + "','"
					+ lotStoneDetails.get(j).getStoneWeight().divide(new BigDecimal("5")).setScale(3,RoundingMode.HALF_UP) + "','"
					+ lotStoneDetails.get(j).getNoOfStones() + "','" + itemCode + "','" + lotNumber + "','" + fileId
					+ "','"+ stockTransfer.get().getCreatedBy() +"','"+ CalendarUtils.formatSqlDetfaultToStr(new Date())+"','INSERT','" + productGroup + "')";
			jdbcTemplate.execute(ldtlInsertSql);
		}
	}

	private void insertIMdtlRecords(int i, String itemCode, String lotNumber, String fileId, String productGroup, Optional<StockTransferDao> stockTransfer) {
		String lotMaterialeDetailsSql = "Select * from products.dbo.lot_material_details where item_code = '" + itemCode
				+ "' and lot_number = '" + lotNumber + "';";
		List<LotMaterialDetailsDao> lotMaterialDetails = namedParameterJdbcTemplate.query(lotMaterialeDetailsSql,
				lotMaterialDetailsMapper);
		 
		for (int j = 0; j < lotMaterialDetails.size(); j++) {
			String mdtlInsertSql = "INSERT into [file].dbo.stn_mdtl_stage (line_count,line_dtl_count,item_no,stn_weight,stn_qty,item_code,lot_number,file_id,"
					+ "created_by,created_date,insert_update, product_group) values ('" + i + "','" + (j + 1) + "','"
					+ lotMaterialDetails.get(j).getMaterial().getMaterialCode() + "','"
					+ lotMaterialDetails.get(j).getMaterialWeight() + "','"
					+ lotMaterialDetails.get(j).getNoOfMaterials() + "','" + itemCode + "','" + lotNumber + "','"
					+ fileId + "','"+ stockTransfer.get().getCreatedBy() +"','"+ CalendarUtils.formatSqlDetfaultToStr(new Date())+"','INSERT','" + productGroup + "')";
			jdbcTemplate.execute(mdtlInsertSql);
		}
	}
}
