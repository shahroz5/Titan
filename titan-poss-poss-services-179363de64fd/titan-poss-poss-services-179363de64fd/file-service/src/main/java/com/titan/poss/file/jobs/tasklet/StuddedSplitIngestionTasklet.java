/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.file.dto.StuddedSplitDtlDto;
import com.titan.poss.file.dto.StuddedSplitHdrDto;
import com.titan.poss.file.dto.StuddedSplitLdtlDto;
import com.titan.poss.file.jobs.mapper.LotStoneDetailsMapper;
import com.titan.poss.file.service.FileService;
import com.titan.poss.file.service.StnAndInvoiceService;
import com.titan.poss.file.service.impl.DataSyncServiceImpl;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.product.dao.LotDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StuddedSplitIngestionTasklet implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private DataSyncServiceImpl syncDataService;

	@Autowired
	private StnAndInvoiceService stnAndInvoiceService;

	@Autowired
	private FileService fileService;

	@Autowired
	private LotStoneDetailsMapper lotStoneDetailsMapper;

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String locationCode = (String) chunkContext.getStepContext().getJobExecutionContext().get("locationCode");
		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("studdedSplitTransactionId");

		String pdtlSql = "Select * from studded_split_dtl_stage where detail IN ('PDTL') and file_id = '" + fileId
				+ "'";
		List<StuddedSplitDtlDto> pdtlList = namedParameterJdbcTemplate.query(pdtlSql,
				new BeanPropertyRowMapper<>(StuddedSplitDtlDto.class));

		String dtlSql = "Select * from studded_split_dtl_stage where detail IN ('CDTL') and file_id = '" + fileId + "'";
		List<StuddedSplitDtlDto> dtlList = namedParameterJdbcTemplate.query(dtlSql,
				new BeanPropertyRowMapper<>(StuddedSplitDtlDto.class));

		String ldtlSql = "Select * from studded_split_ldtl_stage where line_detail = 'CLDTL' and file_id = '" + fileId
				+ "'";
		List<StuddedSplitLdtlDto> ldtlList = namedParameterJdbcTemplate.query(ldtlSql,
				new BeanPropertyRowMapper<>(StuddedSplitLdtlDto.class));

		CountryDao countryData = fileService.getCountryData();
		String stoneWeightUnit = countryData.getStoneWeightUnit();
		long syncTime = CalendarUtils.getCurrentDate().getTime();

		for (StuddedSplitLdtlDto ldtl : ldtlList) {
			List<StuddedSplitDtlDto> dtlDto = dtlList.stream()
					.filter(dtl -> dtl.getLineItemNumber().equals(ldtl.getLineItemNo())).collect(Collectors.toList());
			String itemCode = dtlDto.get(0).getItemCode();
			String lotNumber = dtlDto.get(0).getLotNumber();
			String lotStoneDetailSql = "Select * from products.dbo.lot_stone_details where lot_number ='" + lotNumber
					+ "' and item_code = '" + itemCode + "' and line_item_no='" + ldtl.getSubLineItemNo() + "'";
			List<LotDetailsDao> stnLotStoneDetails = namedParameterJdbcTemplate.query(lotStoneDetailSql,
					new BeanPropertyRowMapper<>(LotDetailsDao.class));
			if (stnLotStoneDetails.isEmpty()) {
				// insert flow
				String ldtlInsert = "INSERT into products.dbo.lot_stone_details(lot_number,item_code,line_item_no,stone_code,stone_weight,no_of_stones,created_by,created_date, last_modified_by,\r\n"
						+ " last_modified_date,weight_unit,src_sync_id,dest_sync_id, correlation_id,sync_time) values ('"
						+ lotNumber + "','" + itemCode + "','" + ldtl.getSubLineItemNo() + "','" + ldtl.getStoneCode()
						+ "','" + ldtl.getStoneWeight() + "','" + ldtl.getStoneQuantity()
						+ "', 'ERPUser', getdate(), 'ERPUser',getdate(),'" + stoneWeightUnit + "',0,0,'" + fileId
						+ "','" + syncTime + "')";
				jdbcTemplate.update(ldtlInsert);

			} else {
				// update flow
				String ldtlUpdate = "update products.dbo.lot_stone_details set stone_code ='" + ldtl.getStoneCode()
						+ "',stone_weight='" + ldtl.getStoneWeight() + "',no_of_stones='" + ldtl.getStoneQuantity()
						+ "',last_modified_by='ERPUser1', last_modified_date=getdate() ,weight_unit='" + stoneWeightUnit
						+ "',src_sync_id = (src_sync_id+1),dest_sync_id=0, correlation_id='" + ldtl.getFileId()
						+ "' where item_code ='" + itemCode + "' and lot_number ='" + lotNumber + "' and line_item_no='"
						+ ldtl.getSubLineItemNo() + "'";
				jdbcTemplate.update(ldtlUpdate);
			}
		}

		
		for (StuddedSplitDtlDto pdtl : pdtlList) {
			String parentItemSql = "Select * from products.dbo.studded_split_dtl where lot_number ='"
					+ pdtl.getLotNumber() + "' and item_code = '" + pdtl.getItemCode() + "'";
			List<LotDetailsDao> parentSplitDetails = namedParameterJdbcTemplate.query(parentItemSql,
					new BeanPropertyRowMapper<>(LotDetailsDao.class));

			if (parentSplitDetails!=null && !parentSplitDetails.isEmpty()) {
				String deleteParentItemSql = "Delete from products.dbo.studded_split_dtl where lot_number ='"
						+ pdtl.getLotNumber() + "' and item_code = '" + pdtl.getItemCode() + "'";
				jdbcTemplate.update(deleteParentItemSql);
			}
			SqlParameterSource[] dtlBatch = SqlParameterSourceUtils.createBatch(pdtl);
			String insertpDtlSql = "INSERT into products.dbo.studded_split_dtl(id,parent_item_code,detail,constant,location_code,fiscal_year,serial_number,\"current_date\",line_item_number,item_code,value,quantity,weight,total_value,constant_value1,"
					+ "constant_value2,constant_value3,lot_number,actual_f1,diamond_weight,other_stone_weight,parent_line_item_number,file_id,created_date)"
					+ " values(newid(),'" + null + "'"
					+ ",:detail, :constant, :locationCode, :fiscalYear, :serialNumber, :currentDate, :lineItemNumber, :itemCode, :value, :quantity, :weight, :totalValue, :constantValue1, :constantValue2"
					+ " , :constantValue3, :lotNumber, :actualF1, :diamondWeight, :otherStoneWeight, :parentLineItemNumber, :fileId, getdate()) ";
			namedParameterJdbcTemplate.batchUpdate(insertpDtlSql, dtlBatch);

			for (StuddedSplitDtlDto cdtl : dtlList) {
				String childItemSql = "Select * from products.dbo.studded_split_dtl where lot_number ='"
						+ cdtl.getLotNumber() + "' and item_code = '" + cdtl.getItemCode() + "'";
				List<LotDetailsDao> childSplitDetails = namedParameterJdbcTemplate.query(childItemSql,
						new BeanPropertyRowMapper<>(LotDetailsDao.class));
				if (childSplitDetails!=null && !childSplitDetails.isEmpty()) {
					String deleteChildItemSql = "Delete from products.dbo.studded_split_dtl where lot_number ='"
							+ cdtl.getLotNumber() + "' and item_code = '" + cdtl.getItemCode() + "'";
					jdbcTemplate.update(deleteChildItemSql);
				}

				SqlParameterSource[] dtlBatch1 = SqlParameterSourceUtils.createBatch(cdtl);
				String insertCDtlSql = "INSERT into products.dbo.studded_split_dtl(id,parent_item_code,detail,constant,location_code,fiscal_year,serial_number,\"current_date\",line_item_number,item_code,value,quantity,weight,total_value,constant_value1,"
						+ "constant_value2,constant_value3,lot_number,actual_f1,diamond_weight,other_stone_weight,parent_line_item_number,file_id,created_date)"
						+ " values(newid(),'" + pdtl.getItemCode() + "'"
						+ ",:detail, :constant, :locationCode, :fiscalYear, :serialNumber, :currentDate, :lineItemNumber, :itemCode, :value, :quantity, :weight, :totalValue, :constantValue1, :constantValue2"
						+ " , :constantValue3, :lotNumber, :actualF1, :diamondWeight, :otherStoneWeight, :parentLineItemNumber, :fileId, getdate()) ";
				namedParameterJdbcTemplate.batchUpdate(insertCDtlSql, dtlBatch1);

			}
		}

		ldtlDataSync(locationCode, fileId);
		return RepeatStatus.FINISHED;
	}

	private void ldtlDataSync(String locationCode, String fileId) {

		List<LotDetailsDao> lotStones = namedParameterJdbcTemplate.query(
				"Select * from products.dbo.lot_stone_details where correlation_id ='" + fileId + "'",
				lotStoneDetailsMapper);

		SyncStagingDto data = stnAndInvoiceService.getLotStoneStagingDto(lotStones, locationCode);
		syncDataService.publishProductMessagesToQueue(data, "products.dbo.sync_staging");

	}

}
