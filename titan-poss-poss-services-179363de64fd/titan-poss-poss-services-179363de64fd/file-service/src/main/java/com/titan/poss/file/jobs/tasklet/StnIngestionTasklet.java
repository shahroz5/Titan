/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
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

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.file.dto.StnStageDto;
import com.titan.poss.file.jobs.mapper.StockTransferMapper;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.location.dao.CountryDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Slf4j
public class StnIngestionTasklet implements Tasklet {

	@Autowired
	private StockTransferMapper stockTransferMapper;

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
		String fileAuditId = (String) chunkContext.getStepContext().getJobExecutionContext().get("stnFileAuditId");
		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		String weightUnit = countryData.getWeightUnit();
		String stoneWeightUnit = countryData.getStoneWeightUnit();
		long syncTime = CalendarUtils.getCurrentDate().getTime();

		// inserting stock transfer (hdr data)
		SqlParameterSource parameters = new MapSqlParameterSource("fileAuditId", fileAuditId);
		List<StockTransferDao> stockTransferDaos = namedParameterJdbcTemplate
				.query("select * from stn_hdr_stage where file_id = :fileAuditId", parameters, stockTransferMapper);
		StockTransferDao stockTransferDao = setStockTransferDao(stockTransferDaos, fileAuditId, currencyCode,
				weightUnit);
		stockTransferDao.setCurrencyCode(currencyCode);
		stockTransferDao.setWeightUnit(weightUnit);
		Integer stockTransferId = saveStockTransfer(stockTransferDao);

		// inserting stock transfer details (dtl data)
		String stockTransferDetailsSql = "insert into inventory.dbo.stock_transfer_details (id,stock_transfer_id,item_code,lot_number,mfg_date,issued_quantity,issued_weight,issued_weight_details,\r\n"
				+ "issued_value,std_value,std_weight,bin_group_code,bin_code,product_group,product_category,received_quantity,received_weight,received_weight_details,\r\n"
				+ "received_value,order_type,reference_no,inventory_id,item_details,tax_details,remarks,weight_unit,currency_code,status,created_by,created_date\r\n"
				+ ",last_modified_by,last_modified_date, correlation_id)\r\n" + "select newid(), " + stockTransferId
				+ " , product_code, lot_number, stm_date, product_qty, product_wt,\r\n"
				+ "issued_weight_details, product_value2, product_value1, product_wt/product_qty, bin_group_code,bin_code, product_group ,product_category ,\r\n"
				+ "product_qty,product_wt,issued_weight_details,product_value2, IIF(order_type ='P', 'P', 'R'), order_no, newid(), item_details ,tax_details ,null, '"
				+ weightUnit + "', '" + currencyCode + "', '" + FileIntegrationConstants.ISSUED
				+ "', IIF(created_by ='', '" + FileIntegrationConstants.ERP_USER + "', created_by), created_date, \r\n"
				+ "IIF(created_by ='', '" + FileIntegrationConstants.ERP_USER + "', created_by), created_date, '"
				+ fileAuditId + "' from stn_dtl_stage where file_id = '" + fileAuditId + "'";

		jdbcTemplate.execute(stockTransferDetailsSql);

		// inserting lot stone details(ldtl)
		String stnLotStoneDetailsSql = "Select * from stn_ldtl_stage where file_id = '" + fileAuditId + "'";
		List<StnStageDto> stnLotStoneDetails = namedParameterJdbcTemplate.query(stnLotStoneDetailsSql,
				new BeanPropertyRowMapper<>(StnStageDto.class));
		stnLotStoneDetails.stream().forEach(stn -> {
			// if lot stone already present updating it else inserting it
			if (commonValidationService.lotStoneDetailPresent(stn.getLotNumber(), stn.getItemCode())) {
				String stnLotStoneDetailsUpdateStatusSql = "update stn_ldtl_stage set insert_update = 'UPDATE' where lot_number = '"
						+ stn.getLotNumber() + "' and item_code = '" + stn.getItemCode() + "' and file_id = '"
						+ fileAuditId + "'";
				jdbcTemplate.execute(stnLotStoneDetailsUpdateStatusSql);
			}
		});

		String lotStoneDetailsInsertSql = "insert into products.dbo.lot_stone_details(lot_number,item_code,line_item_no,stone_code,stone_weight,no_of_stones,created_by,created_date,\r\n"
				+ "last_modified_by, last_modified_date,weight_unit,src_sync_id,dest_sync_id, correlation_id,sync_time) \r\n"
				+ "select lot_number , item_code , line_dtl_count, item_no, stn_weight, stn_qty, created_by, created_date, created_by, created_date, '"
				+ stoneWeightUnit + "', 0,0,'" + fileAuditId + "','" + syncTime + "' FROM \r\n"
				+ "stn_ldtl_stage where file_id = '" + fileAuditId + "' and insert_update = 'INSERT'";
		jdbcTemplate.execute(lotStoneDetailsInsertSql);

		String lotStoneDetailsUpdateSql = "update products.dbo.lot_stone_details set stone_code = t2.item_no, stone_weight=t2.stn_weight,no_of_stones=t2.stn_qty,created_by=t2.created_by,created_date=t2.created_date,\r\n"
				+ "last_modified_by=t2.created_by, last_modified_date=t2.created_date,weight_unit='" + stoneWeightUnit
				+ "',src_sync_id = (t1.src_sync_id+1),dest_sync_id=0, correlation_id=t2.file_id \r\n"
				+ "from products.dbo.lot_stone_details t1 inner join [file].dbo.stn_ldtl_stage t2 on t1.item_code=t2.item_code and t1.lot_number=t2.lot_number and t1.line_item_no=t2.line_dtl_count where t2.file_id = '"
				+ fileAuditId + "'and t2.insert_update = 'UPDATE';";
		jdbcTemplate.execute(lotStoneDetailsUpdateSql);

		// inserting lot material details(mdtl)
		String stnLotMaterialDetailsSql = "Select * from stn_mdtl_stage where file_id = '" + fileAuditId + "'";
		List<StnStageDto> stnLotMaterialDetails = namedParameterJdbcTemplate.query(stnLotMaterialDetailsSql,
				new BeanPropertyRowMapper<>(StnStageDto.class));
		stnLotMaterialDetails.stream().forEach(stn -> {
			// if lot material already present updating it else inserting it
			if (commonValidationService.lotMaterialDetailPresent(stn.getLotNumber(), stn.getItemCode())) {
				String stnLotMaterialDetailsUpdateStatusSql = "update stn_mdtl_stage set insert_update = 'UPDATE' where lot_number = '"
						+ stn.getLotNumber() + "' and item_code = '" + stn.getItemCode() + "' and file_id = '"
						+ fileAuditId + "'";
				jdbcTemplate.execute(stnLotMaterialDetailsUpdateStatusSql);
			}
		});

		String lotMaterialDetailsInsertSql = "insert into products.dbo.lot_material_details(lot_number,item_code,line_item_no,material_code,material_weight,no_of_materials,created_by,created_date,\r\n"
				+ "last_modified_by, last_modified_date,weight_unit,src_sync_id,dest_sync_id, correlation_id,sync_time) \r\n"
				+ "select lot_number , item_code , line_dtl_count, item_no, stn_weight, stn_qty, created_by, created_date, created_by, created_date, '"
				+ stoneWeightUnit + "', 0,0,'" + fileAuditId + "','" + syncTime + "' FROM \r\n"
				+ "stn_mdtl_stage where file_id = '" + fileAuditId + "' and insert_update = 'INSERT'";
		jdbcTemplate.execute(lotMaterialDetailsInsertSql);

		String lotMaterialDetailsUpdateSql = "update products.dbo.lot_material_details set material_code = t2.item_no, material_weight=t2.stn_weight,no_of_materials=t2.stn_qty,created_by=t2.created_by,created_date=t2.created_date,\r\n"
				+ "last_modified_by=t2.created_by, last_modified_date=t2.created_date,weight_unit='" + stoneWeightUnit
				+ "',src_sync_id = (t1.src_sync_id+1),dest_sync_id=0, correlation_id=t2.file_id \r\n"
				+ "from products.dbo.lot_material_details t1 inner join [file].dbo.stn_mdtl_stage t2 on t1.item_code=t2.item_code and t1.lot_number=t2.lot_number and t1.line_item_no=t2.line_dtl_count where t2.file_id = '"
				+ fileAuditId + "'and t2.insert_update = 'UPDATE';";
		jdbcTemplate.execute(lotMaterialDetailsUpdateSql);

		return RepeatStatus.FINISHED;
	}

	private StockTransferDao setStockTransferDao(List<StockTransferDao> stockTransferDaos, String fileAuditId,
			String currencyCode, String weightUnit) {

		StockTransferDao stockTransferDao = new StockTransferDao();
		stockTransferDao.setCarrierDetails(stockTransferDaos.get(0).getCarrierDetails());
		stockTransferDao.setCreatedBy(stockTransferDaos.get(0).getCreatedBy());
		stockTransferDao.setCreatedDate(stockTransferDaos.get(0).getCreatedDate());
		stockTransferDao.setLastModifiedBy(stockTransferDaos.get(0).getLastModifiedBy());
		stockTransferDao.setLastModifiedDate(stockTransferDaos.get(0).getLastModifiedDate());
		stockTransferDao.setCurrencyCode(currencyCode);
		stockTransferDao.setDestLocationCode(stockTransferDaos.get(0).getDestLocationCode());
		stockTransferDao.setOrgCode(CommonConstants.ORG_CODE);
		stockTransferDao.setSrcDocDate(stockTransferDaos.get(0).getSrcDocDate());
		stockTransferDao.setSrcDocNo(stockTransferDaos.get(0).getSrcDocNo());
		stockTransferDao.setSrcFiscalYear(stockTransferDaos.get(0).getSrcFiscalYear());
		stockTransferDao.setSrcLocationCode(stockTransferDaos.get(0).getSrcLocationCode());
		stockTransferDao.setStatus("ISSUED");
		stockTransferDao.setTransferType(stockTransferDaos.get(0).getTransferType());
		stockTransferDao.setWeightUnit(weightUnit);

		BigDecimal totalIssuedWeight = new BigDecimal(0);
		Short totalIssuedQuantity = 0;
		BigDecimal totalIssuedValue = new BigDecimal(0);

		for (StockTransferDao stock : stockTransferDaos) {
			totalIssuedWeight = totalIssuedWeight.add(stock.getTotalIssuedWeight());
			totalIssuedValue = totalIssuedValue.add(stock.getTotalIssuedValue());
			totalIssuedQuantity = (short) (totalIssuedQuantity + stock.getTotalIssuedQuantity());
		}
		stockTransferDao.setTotalIssuedQuantity(totalIssuedQuantity);
		stockTransferDao.setTotalIssuedValue(totalIssuedValue);
		stockTransferDao.setTotalIssuedWeight(totalIssuedWeight);

		// setting order types
		String orderTypeSql = "select distinct(order_type) from stn_dtl_stage where file_id ='" + fileAuditId + "'";
		stockTransferDao.setOrderType(commonValidationService.getOrderTypes(orderTypeSql));
		stockTransferDao.setIssuedBy(stockTransferDaos.get(0).getCreatedBy());

		stockTransferDao.setCorrelationId(fileAuditId);
		return stockTransferDao;
	}

	private Integer saveStockTransfer(StockTransferDao stockTransfer) {
		KeyHolder holder = new GeneratedKeyHolder();
		// check for the unique key constraint to avoid duplicate data insertion
		List<Integer> id = new ArrayList<>();
		//log.info("------------stock transfer-------------"+stockTransfer.toString());
		if(stockTransfer.getTransferType().equalsIgnoreCase(FileIntegrationConstants.TRANSFER_TYPE_BTQ_BTQ)) {
			String stockId ="SELECT id from inventory.dbo.stock_transfer where transfer_type= '"+stockTransfer.getTransferType()+ "' and (dest_doc_no is null or dest_doc_no = "+stockTransfer.getDestDocNo() + ")\r\n "
					+ "and (dest_fiscal_year is null or dest_fiscal_year = "+stockTransfer.getDestFiscalYear()+") and dest_location_code='"+stockTransfer.getDestLocationCode()+"' \r\n"
					+ "and src_doc_no ="+stockTransfer.getSrcDocNo()+" and src_fiscal_year = "+stockTransfer.getSrcFiscalYear()+" and  src_location_code ='"+stockTransfer.getSrcLocationCode()+"' ";
			 // log.info("-----------query-----------"+stockId);
			  List<Integer> stock = jdbcTemplate.queryForList(stockId,Integer.class);
			  //log.info("-------------stock--------------"+stock.toString());
			  id.addAll(stock);
			 // log.info("----------id -------"+id.toString());
		}
	//	 log.info("----------id outside -------"+id.toString());
		if(id==null || CollectionUtil.isEmpty(id)) {
			String stockTransferQuery = "INSERT into inventory.dbo.stock_transfer (transfer_type,src_location_code,src_fiscal_year,src_doc_no,src_doc_date,total_issued_quantity,total_issued_value,total_issued_weight,\r\n"
					+ "issued_by,dest_location_code,order_type,carrier_details,\r\n"
					+ "weight_unit,currency_code,status,prints,org_code,created_by,created_date,last_modified_by,\r\n"
					+ "last_modified_date,correlation_id)" + "values('" + stockTransfer.getTransferType() + "','"
					+ stockTransfer.getSrcLocationCode() + "','" + stockTransfer.getSrcFiscalYear() + "','"
					+ stockTransfer.getSrcDocNo() + "','" + CalendarUtils.formatDateToSql(stockTransfer.getSrcDocDate())
					+ "','" + stockTransfer.getTotalIssuedQuantity() + "','" + stockTransfer.getTotalIssuedValue() + "','"
					+ stockTransfer.getTotalIssuedWeight() + "','" + stockTransfer.getIssuedBy() + "','"
					+ stockTransfer.getDestLocationCode() + "','" + stockTransfer.getOrderType() + "','"
					+ stockTransfer.getCarrierDetails() + "','" + stockTransfer.getWeightUnit() + "','"
					+ stockTransfer.getCurrencyCode() + "','" + stockTransfer.getStatus() + "',null,'"
					+ stockTransfer.getOrgCode() + "','" + stockTransfer.getCreatedBy() + "','"
					+ CalendarUtils.formatDateToString(stockTransfer.getCreatedDate(), "yyyy-MM-dd hh:mm:ss") + "','"
					+ stockTransfer.getLastModifiedBy() + "','"
					+ CalendarUtils.formatDateToString(stockTransfer.getLastModifiedDate(), "yyyy-MM-dd hh:mm:ss") + "','"
					+ stockTransfer.getCorrelationId() + "')";
			jdbcTemplate.update(new PreparedStatementCreator() {
				public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
					return connection.prepareStatement(stockTransferQuery, new String[] { "id" });
				}
			}, holder);
			return holder.getKey().intValue();
			
		}
		else {
			return id.get(0);
		}
		
	}
}
