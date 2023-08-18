/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.io.StringReader;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.file.dto.InvoiceStageDto;
import com.titan.poss.file.jobs.mapper.StockInvoiceMapper;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;
import com.titan.poss.location.dao.CountryDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class InvoiceIngestionTasklet implements Tasklet {

	@Autowired
	private StockInvoiceMapper stockInvoiceMapper;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private CommonValidationService commonValidationService;

	@Autowired
	private FileService fileService;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext().get("invoiceFileAuditId");
		String fileName = (String) chunkContext.getStepContext().getJobParameters().get("invoiceFileName");
		String destLocationCode = fileName.replace(".txt", "");
		int initialIndex = destLocationCode.indexOf('_');
		int finalIndex = destLocationCode.indexOf('.');
		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		String weightUnit = countryData.getWeightUnit();
		long syncTime = CalendarUtils.getCurrentDate().getTime();

		// inserting stock transfer (hdr data)
		SqlParameterSource parameters = new MapSqlParameterSource("fileAuditId", fileAuditId);
		List<StockInvoiceDao> stockInvoiceDao = namedParameterJdbcTemplate
				.query("select * from inv_ihdr_stage where file_id = :fileAuditId", parameters, stockInvoiceMapper);
		stockInvoiceDao.get(0).setCorrelationId(fileAuditId);
		// setting order types
		String orderTypeSql = "select distinct(cfa_invoice_type) from inv_idtl_stage where file_id ='" + fileAuditId
				+ "'";
		stockInvoiceDao.get(0).setOrderType(commonValidationService.getOrderTypes(orderTypeSql));
		stockInvoiceDao.get(0).setDestLocationCode(destLocationCode.substring(initialIndex + 1, finalIndex));
		stockInvoiceDao.get(0).setCurrencyCode(currencyCode);
		stockInvoiceDao.get(0).setWeightUnit(weightUnit);
 
		Integer stockInvoiceId = saveStockInvoice(stockInvoiceDao.get(0));
        
		log.info("stockInvoiceDao: {}",stockInvoiceDao);
		// inserting stock transfer details (dtl data)
		
		
		String stockTransferDetailsSql = "insert into inventory.dbo.stock_invoice_details(id,stock_invoice_id,item_code,lot_number,mfg_date,"
				+ "issued_quantity,issued_weight,issued_weight_details,issued_value,item_level_discount,net_value,std_value,std_weight,"
				+ "bin_group_code,bin_code,product_group,product_category,order_type,received_quantity,received_weight,received_weight_details,"
				+ "received_value,remarks,reference_no,inventory_id,isac_details,item_details,weight_unit,currency_code,status,"
				+ "created_by,created_date,last_modified_by,last_modified_date,correlation_id) select newid(), '"
				+ stockInvoiceId + "', item_no,"
				+ "lot_number,mfg_date,primary_qty,secondary_qty,issued_weight_details,unit_price*primary_qty,null,cfa_net_amount,unit_price,"
				+ "secondary_qty/primary_qty,bin_group_code,bin_code,cfa_product_code,product_category,IIF(cfa_invoice_type ='P', 'P', 'R'),primary_qty,secondary_qty,"
				+ "issued_weight_details,unit_price*primary_qty,null,cfa_customer_number, newid(),isac_details,item_details, '"
				+ weightUnit + "','" + currencyCode + "','" + FileIntegrationConstants.ISSUED + "','"
				+ FileIntegrationConstants.ERP_USER + "', getdate(),'" + FileIntegrationConstants.ERP_USER
				+ "', getdate() ,'" + fileAuditId + "' from inv_idtl_stage where file_id = '" + fileAuditId + "'";

		jdbcTemplate.execute(stockTransferDetailsSql);
		
		// For getting isac Details from stock invoice details and item level discount
//		String stockInvoiceIsacDetalsSql = "Select * from inventory.dbo.stock_invoice_details where correlation_id = '" + fileAuditId + "'";
//		log.info("stockInvoiceIsacDetalsSql: {}",stockInvoiceIsacDetalsSql);
//		List<StockInvoiceDetailsDao> stockInvDetails = namedParameterJdbcTemplate.query(stockInvoiceIsacDetalsSql,
//						new BeanPropertyRowMapper<>(StockInvoiceDetailsDao.class));
//		log.info("stockInvDetails: {}",stockInvDetails);
//			if(!CollectionUtil.isEmpty(stockInvDetails)) {
//					for(StockInvoiceDetailsDao stockInvDetail:stockInvDetails) {
//						log.info("stockInvDetail: {}",stockInvDetail);
//					 StockInvoiceIsacDetailsDto stockInvoiceIsacDetailsDto	=(MapperUtil.getObjectMapperInstance()
//								.convertValue(MapperUtil.mapObjToClass(stockInvDetail.getIsacDetails(), JsonData.class).getData(),
//										StockInvoiceIsacDetailsDto.class));
//					 log.info("stockInvoiceIsacDetailsDto: {}",stockInvoiceIsacDetailsDto);
//					 stockInvoiceIsacDetailsDto.getIsacDetails().stream().forEach(isac ->{
//						 if(isac.getGlKey().equalsIgnoreCase("TRADE")) {
//							 
//							 log.info("isac: {}",isac);
//							 log.info("isac discount: {}",isac.getAmount());
//							 
//					       String updateItemLevelDiscountSql= "update inventory.dbo.stock_invoice_details set item_level_discount='" + isac.getAmount() +"'"
//					 		+ " where id='" +stockInvDetail.getId() +"' ";
//					       
//					       log.info("updateItemLevelDiscountSql: {}",updateItemLevelDiscountSql);
//					       
//					       jdbcTemplate.execute(updateItemLevelDiscountSql);
//						 }
//					   });
//					 
//					}
//			}
		String stockInvoiceIsacDetalsSql = "Select * from inventory.dbo.stock_invoice_details where correlation_id = '"
				+ fileAuditId + "'";
		
		List<StockInvoiceDetailsDao> stockInvDetails = namedParameterJdbcTemplate.query(stockInvoiceIsacDetalsSql,
				new BeanPropertyRowMapper<>(StockInvoiceDetailsDao.class));
		
		if (!CollectionUtil.isEmpty(stockInvDetails)) {
			for (StockInvoiceDetailsDao stockInvDetail : stockInvDetails) {
				
				if (stockInvDetail.getIsacDetails() != null) {
					
					JsonReader reader = new JsonReader(new StringReader(stockInvDetail.getIsacDetails()));
					reader.setLenient(true);
					JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
					
					if (jsonObject != null && jsonObject.get("data") != null) {
						JsonObject jsonData = jsonObject.get("data").getAsJsonObject();
						
						if (jsonData != null && jsonData.get("IsacDetails") != null) {
							JsonArray isacDetails = jsonData.get("IsacDetails").getAsJsonArray();
							
							for (int i = 0; i < isacDetails.size(); i++) {
								JsonObject isacDetail = isacDetails.get(i).getAsJsonObject();
								if (isacDetail.get("glKey") !=null && isacDetail.get("glKey").getAsString() !=null &&
										                                isacDetail.get("glKey").getAsString().equalsIgnoreCase("TRADE")) {
									
									BigDecimal itemLevelDisocunt = isacDetail.get("amount").getAsBigDecimal();
									log.info("itemLevelDisocunt: {}", itemLevelDisocunt);
									String updateItemLevelDiscountSql = "update inventory.dbo.stock_invoice_details set item_level_discount="+ itemLevelDisocunt + ""
											+ " where id='" + stockInvDetail.getId() + "' ";
									
									jdbcTemplate.execute(updateItemLevelDiscountSql);
									break; 
								}
							}
						}

					}
				}

			}
		}
		
		// inserting lot stone details(ldtl)
		String invLotStoneDetailsSql = "Select * from inv_ildtl_stage where file_id = '" + fileAuditId + "'";
		List<InvoiceStageDto> invLotStoneDetails = namedParameterJdbcTemplate.query(invLotStoneDetailsSql,
				new BeanPropertyRowMapper<>(InvoiceStageDto.class));
		invLotStoneDetails.stream().forEach(inv -> {
			// if lot stone already present updating it else inserting it
			if (commonValidationService.lotStoneDetailPresent(inv.getLotNumber(), inv.getItemCode())) {
				String invLotStoneDetailsUpdateStatusSql = "update inv_ildtl_stage set insert_update = 'UPDATE' where lot_number = '"
						+ inv.getLotNumber() + "' and item_code = '" + inv.getItemCode() + "' and file_id = '"
						+ fileAuditId + "'";
				jdbcTemplate.execute(invLotStoneDetailsUpdateStatusSql);
			}
		});

		String lotStoneDetailsInsertSql = "insert into products.dbo.lot_stone_details(lot_number,item_code,line_item_no,stone_code,stone_weight,no_of_stones,created_by,created_date,\r\n"
				+ "last_modified_by, last_modified_date,weight_unit,src_sync_id,dest_sync_id, correlation_id,sync_time) \r\n"
				+ "select lot_number , item_code , line_dtl_count, item_no, stn_weight, stn_qty,'"
				+ FileIntegrationConstants.ERP_USER + "',getdate(),'" + FileIntegrationConstants.ERP_USER
				+ "',getdate(), '" + weightUnit + "', 0,0,'" + fileAuditId + "','" + syncTime + "' FROM \r\n"
				+ "inv_ildtl_stage where file_id = '" + fileAuditId + "' and insert_update = 'INSERT'";
		jdbcTemplate.execute(lotStoneDetailsInsertSql);

		String lotStoneDetailsUpdateSql = "update products.dbo.lot_stone_details set stone_code = t2.item_no, stone_weight=t2.stn_weight,no_of_stones=t2.stn_qty,created_by='"
				+ FileIntegrationConstants.ERP_USER + "',created_date=getdate(),\r\n" + "last_modified_by='"
				+ FileIntegrationConstants.ERP_USER + "', last_modified_date=getdate(),weight_unit='" + weightUnit
				+ "',src_sync_id = (t1.src_sync_id+1),dest_sync_id=0, correlation_id=t2.file_id \r\n"
				+ "from products.dbo.lot_stone_details t1 inner join [file].dbo.inv_ildtl_stage t2 on t1.item_code=t2.item_code and t1.lot_number=t2.lot_number and t1.line_item_no=t2.line_dtl_count where t2.file_id = '"
				+ fileAuditId + "'and t2.insert_update = 'UPDATE';";
		jdbcTemplate.execute(lotStoneDetailsUpdateSql);

		// inserting lot material details(mdtl)
		String invLotMaterialDetailsSql = "Select * from inv_imdtl_stage where file_id = '" + fileAuditId + "'";
		List<InvoiceStageDto> invLotMaterialDetails = namedParameterJdbcTemplate.query(invLotMaterialDetailsSql,
				new BeanPropertyRowMapper<>(InvoiceStageDto.class));
		invLotMaterialDetails.stream().forEach(inv -> {
			// if lot material already present updating it else inserting it
			if (commonValidationService.lotMaterialDetailPresent(inv.getLotNumber(), inv.getItemCode())) {
				String invLotMaterialDetailsUpdateStatusSql = "update inv_imdtl_stage set insert_update = 'UPDATE' where lot_number = '"
						+ inv.getLotNumber() + "' and item_code = '" + inv.getItemCode() + "' and file_id = '"
						+ fileAuditId + "'";
				jdbcTemplate.execute(invLotMaterialDetailsUpdateStatusSql);
			}
		});

		String lotMaterialDetailsInsertSql = "insert into products.dbo.lot_material_details(lot_number,item_code,line_item_no,material_code,material_weight,no_of_materials,created_by,created_date,\r\n"
				+ "last_modified_by, last_modified_date,weight_unit,src_sync_id,dest_sync_id, correlation_id,sync_time) \r\n"
				+ "select lot_number , item_code , line_dtl_count, item_no, stn_weight, stn_qty, '"
				+ FileIntegrationConstants.ERP_USER + "',getdate(),'" + FileIntegrationConstants.ERP_USER
				+ "',getdate(), '" + weightUnit + "', 0,0,'" + fileAuditId + "','" + syncTime + "' FROM \r\n"
				+ "inv_imdtl_stage where file_id = '" + fileAuditId + "' and insert_update = 'INSERT'";
		jdbcTemplate.execute(lotMaterialDetailsInsertSql);

		String lotMaterialDetailsUpdateSql = "update products.dbo.lot_material_details set material_code = t2.item_no, material_weight=t2.stn_weight,no_of_materials=t2.stn_qty,created_by='"
				+ FileIntegrationConstants.ERP_USER + "',created_date=getdate(),\r\n" + "last_modified_by='"
				+ FileIntegrationConstants.ERP_USER + "', last_modified_date=getdate(),weight_unit='" + weightUnit
				+ "',src_sync_id = (t1.src_sync_id+1),dest_sync_id=0, correlation_id=t2.file_id \r\n"
				+ "from products.dbo.lot_material_details t1 inner join [file].dbo.inv_imdtl_stage t2 on t1.item_code=t2.item_code and t1.lot_number=t2.lot_number and t1.line_item_no=t2.line_dtl_count where t2.file_id = '"
				+ fileAuditId + "'and t2.insert_update = 'UPDATE';";
		jdbcTemplate.execute(lotMaterialDetailsUpdateSql);

		return RepeatStatus.FINISHED;
	}

	private Integer saveStockInvoice(StockInvoiceDao stockInvoice) {

		KeyHolder holder = new GeneratedKeyHolder();
		String stockInvoiceQuery = "INSERT into inventory.dbo.stock_invoice (invoice_type,src_location_code,src_doc_no,src_fiscal_year,src_doc_date,total_issued_quantity,"
				+ "total_issued_weight,total_issued_value,total_discount,\r\n"
				+ "dest_location_code,order_type,status,weight_unit,currency_code,org_code,created_by,created_date,\r\n"
				+ "last_modified_by,last_modified_date,correlation_id, file_published,total_tax) values ('" + stockInvoice.getInvoiceType()
				+ "','" + stockInvoice.getSrcLocationCode() + "','" + stockInvoice.getSrcDocNo() + "','"
				+ stockInvoice.getSrcFiscalYear() + "','" + CalendarUtils.formatDateToSql(stockInvoice.getSrcDocDate())
				+ "','" + stockInvoice.getTotalIssuedQuantity() + "','" + stockInvoice.getTotalIssuedWeight() + "','"
				+ stockInvoice.getTotalIssuedValue() + "','" + stockInvoice.getTotalDiscount() + "','" + stockInvoice.getDestLocationCode() + "','"
				+ stockInvoice.getOrderType() + "','" + stockInvoice.getStatus() + "','" + stockInvoice.getWeightUnit()
				+ "','" + stockInvoice.getCurrencyCode() + "','" + stockInvoice.getOrgCode() + "','"
				+ stockInvoice.getCreatedBy() + "','" + CalendarUtils.formatDateToSql(stockInvoice.getCreatedDate())
				+ "','" + stockInvoice.getLastModifiedBy() + "','"
				+ CalendarUtils.formatDateToSql(stockInvoice.getLastModifiedDate()) + "','"
				+ stockInvoice.getCorrelationId() + "', 'false','" + stockInvoice.getTotalTax() + "')";
		jdbcTemplate.update(new PreparedStatementCreator() {
			public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
				return connection.prepareStatement(stockInvoiceQuery, new String[] { "id" });
			}
		}, holder);
		return holder.getKey().intValue();
	}
}
