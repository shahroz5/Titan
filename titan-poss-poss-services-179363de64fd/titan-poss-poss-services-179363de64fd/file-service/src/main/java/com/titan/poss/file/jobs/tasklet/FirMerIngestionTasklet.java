/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.FirMerFileDto;
import com.titan.poss.file.dto.FirMerStageDto;
import com.titan.poss.file.dto.UniqueStockRequestDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dao.InvDocMasterDao;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.repository.InvDocMasterRepository;
import com.titan.poss.inventory.repository.StockRequestRepository;
import com.titan.poss.location.dao.CountryDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class FirMerIngestionTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private StockRequestRepository stockRequestRepository;

	@Autowired
	private InvDocMasterRepository invDocMasterRepository;

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	private FileService fileService;

	private static final String FIR_MER_UPLOAD = "FIR/MER File Uploads";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileAuditId = (String) chunkContext.getStepContext().getJobParameters().get("fileAuditId");
		String fileGroup = (String) chunkContext.getStepContext().getJobParameters().get("fileGroup");

		CountryDao countryData = fileService.getCountryData();
		String currencyCode = countryData.getCurrency().getCurrencyCode();
		String weightUnit = countryData.getWeightUnit();

		// update stage table with inventory details data
		String binCodeList = null;
		if (fileGroup.equalsIgnoreCase(FileGroupEnum.FIR.toString())) {
			binCodeList = "'STN', 'DISPUTE', 'DEFECTIVE'";
		} else {
			binCodeList = "'STN'";
		}
		SqlParameterSource parameters = new MapSqlParameterSource("fileId", fileAuditId);
		
		String updateSql1 = "update fir_mer_stage set bin_group_code = id.bin_group_code,bin_code =id.bin_code from fir_mer_stage fms inner join inventory.dbo.inventory_details id on \r\n"
				+ "id.item_code =fms.item_code and id.lot_number =fms.lot_number and id.location_code =fms.source_location_code and \r\n"
				+ "id.std_weight =fms.unitweight where id.total_quantity>0 and fms.file_id ='"
				+ fileAuditId + "'";
		jdbcTemplate.execute(updateSql1);
				
		
		String getQuery = "Select * from fir_mer_stage where bin_group_code not in(" + binCodeList + ")  and file_id=:fileId";
		List<FirMerStageDto> firMerStageDtos1 = namedParameterJdbcTemplate.query(getQuery, parameters,
				new BeanPropertyRowMapper<>(FirMerStageDto.class));
		
		String updateSql = "update fir_mer_stage set quantity = IIF(quantity >= id.total_quantity ,id.total_quantity ,quantity ),mfg_date = id.mfg_date,\r\n"
				+ "total_value =quantity*id.std_value,std_weight =id.std_weight,std_value =id.std_value,\r\n"
				+ "total_quantity =id.total_quantity,bin_group_code = id.bin_group_code,bin_code =id.bin_code,inventory_id =id.id,product_category =id.product_category,\r\n"
				+ "product_group =id.product_group,item_details = id.item_details,total_weight_details = id.total_weight_details  from fir_mer_stage fms inner join inventory.dbo.inventory_details id on \r\n"
				+ "id.item_code =fms.item_code and id.lot_number =fms.lot_number and id.location_code =fms.source_location_code and \r\n"
				+ "id.std_weight =fms.unitweight and id.total_quantity>0 and id.bin_group_code in(" + binCodeList + ") where fms.file_id ='"
				+ fileAuditId + "'";

		jdbcTemplate.execute(updateSql);

		// remove from stage table where Combination of srcLocationCode, itemCode,
		// lotNumber and stdWeight not found in Inventory details
		
		String sql = "Select * from fir_mer_stage where total_value IS NULL and std_weight IS NULL and file_id=:fileId";
		List<FirMerStageDto> firMerStageDtos = namedParameterJdbcTemplate.query(sql, parameters,
				new BeanPropertyRowMapper<>(FirMerStageDto.class));
		firMerStageDtos.stream().forEach(firMerStageDto -> {
			FirMerFileDto firMerFileDto = new FirMerFileDto();
			firMerFileDto.setItemCode(firMerStageDto.getItemCode());
			firMerFileDto.setLotNumber(firMerStageDto.getLotNumber());
			firMerFileDto.setUnitWeight(firMerStageDto.getUnitWeight().toString());
			firMerFileDto.setQuantity(firMerStageDto.getQuantity().toString());
			firMerFileDto.setInitiatedLocationCode(firMerStageDto.getInitiatedLocationCode());
			firMerFileDto.setSourceLocationCode(firMerStageDto.getSourceLocationCode());
			firMerFileDto.setDestinationLocationCode(firMerStageDto.getDestinationLocationCode());
			firMerFileDto.setFiscalYear(firMerStageDto.getFiscalYear().toString());
			firMerFileDto.setFileId(firMerStageDto.getFileId());
			
			firMerStageDtos1.stream().forEach(firMerStageDto1 -> {
				Boolean isNotAllowed = false;
				if(firMerStageDto1.getItemCode().equalsIgnoreCase(firMerStageDto.getItemCode()) && firMerStageDto1.getLotNumber().equalsIgnoreCase(firMerStageDto.getLotNumber())) {
				
				if (fileGroup.equalsIgnoreCase(FileGroupEnum.FIR.toString())) {
					if(!(firMerStageDto1.getBinGroupCode().equalsIgnoreCase("STN") ||firMerStageDto1.getBinGroupCode().equalsIgnoreCase("DISPUTE")
				||firMerStageDto1.getBinGroupCode().equalsIgnoreCase("DEFECTIVE")))
						isNotAllowed = true;
				}
			   if(fileGroup.equalsIgnoreCase(FileGroupEnum.MER.toString()) && (!(firMerStageDto1.getBinGroupCode().equalsIgnoreCase("STN")))) {
					   isNotAllowed = true;
			   }
			   
			   if(isNotAllowed) {
					dataAuditService.saveDataAuditData(firMerStageDto1.getItemCode(), MapperUtil.getJsonString(firMerStageDto1),
							" " + firMerStageDto1.getBinGroupCode() +" Products are not allowed",
							fileAuditId, ErrorTypeEnum.ERROR.toString());
				}
			  		
				}
				
			});
			if(firMerStageDto.getBinGroupCode() == null && !firMerStageDtos1.stream().anyMatch(f1->f1.getItemCode().equals(firMerStageDto.getItemCode()))) {
				dataAuditService.saveDataAuditData(firMerFileDto.getItemCode(), MapperUtil.getJsonString(firMerFileDto),
						"Combination of srcLocationCode, itemCode, lotNumber and stdWeight not found in EPOSS Inventory details",
						fileAuditId, ErrorTypeEnum.ERROR.toString());
			}
			
		});
	
		if(fileGroup.equalsIgnoreCase(FileGroupEnum.MER.toString())) {
			String sql2 = "Select * from fir_mer_stage where total_value IS not NULL and std_weight IS not NULL and file_id=:fileId";
			List<FirMerStageDto> firMerStageDto2 = namedParameterJdbcTemplate.query(sql2, parameters,
					new BeanPropertyRowMapper<>(FirMerStageDto.class));

			for(FirMerStageDto firMerStageDto : firMerStageDto2) {
				Boolean isHallMarking = Boolean.FALSE;
				if (firMerStageDto.getItemDetails() != null) {
					JsonObject jsonObj = new JsonParser().parse(firMerStageDto.getItemDetails()).getAsJsonObject();
					if(jsonObj!= null && jsonObj.getAsJsonObject("data") != null && jsonObj.getAsJsonObject("data").get("isHallMarking")!= null) {
						JsonElement checkhallmarkElement = jsonObj.getAsJsonObject("data").get("isHallMarking"); 
						if(!JsonNull.INSTANCE.equals(checkhallmarkElement)) {
							isHallMarking = jsonObj.getAsJsonObject("data").get("isHallMarking")
									.getAsBoolean(); 
						}
					}
				}
				if(!BooleanUtils.isTrue(isHallMarking)) {
					dataAuditService.saveDataAuditData(firMerStageDto.getItemCode(), MapperUtil.getJsonString(firMerStageDto),
							"Item is not Hallmarked",
							fileAuditId, ErrorTypeEnum.ERROR.toString());
					String deleteSql = "Delete from fir_mer_stage where "
							+ " file_id='" + fileAuditId + "'"
							+ " AND item_code = '" +firMerStageDto.getItemCode()+"' "
							+ " AND lot_number = '" +firMerStageDto.getLotNumber()+"' "
							+ " AND unitweight = " +firMerStageDto.getUnitWeight() ;
					jdbcTemplate.execute(deleteSql);
				}
			}
		}
		
		String deleteSql = "Delete from fir_mer_stage where total_value IS NULL and std_weight IS NULL and file_id='"
				+ fileAuditId + "'";
		jdbcTemplate.execute(deleteSql);

		// inserting stock request
		String distinctSrcLocationSql = "select source_location_code, destination_location_code from fir_mer_stage fms where file_id ='"
				+ fileAuditId + "' group by source_location_code, destination_location_code";
		List<UniqueStockRequestDto> uniqueStockRequests = namedParameterJdbcTemplate.query(distinctSrcLocationSql,
				new BeanPropertyRowMapper<>(UniqueStockRequestDto.class));

		for (UniqueStockRequestDto uniqueStockRequest : uniqueStockRequests) {
			StockRequestDao stockRequestDao = createStockRequest(fileAuditId,
					uniqueStockRequest.getSourceLocationCode(), uniqueStockRequest.getDestinationLocationCode(),
					weightUnit, currencyCode);
			StockRequestDao savedStockRequestDao = stockRequestRepository.save(stockRequestDao);

			// inserting stock request details
			String stockRequestDetailsSql = "insert into inventory.dbo.stock_request_details(id,stock_request_id,item_code,lot_number,mfg_date,requested_quantity,requested_value,requested_weight,requested_weight_details,\r\n"
					+ "std_value,std_weight,bin_group_code,bin_code,product_group,product_category,item_details,tax_details,reason,inventory_id,accepted_quantity,approved_quantity,selected_quantity,\r\n"
					+ "issued_quantity,issued_weight,issued_weight_details,selected_weight,selected_weight_details,issued_by,issued_date,weight_unit,currency_code,status,created_by,created_date,\r\n"
					+ "last_modified_by,last_modified_date,correlation_id) select newid(),"
					+ savedStockRequestDao.getId()
					+ ",item_code,lot_number,mfg_date,quantity,total_value,unitweight*quantity,total_weight_details,std_value,std_weight,bin_group_code,bin_code,product_group,product_category,item_details ,"
					+ "null,'" + FIR_MER_UPLOAD + "',inventory_id,0,quantity,0,0,0,total_weight_details,0,null,null,null,'" + weightUnit
					+ "','" + currencyCode + "','" + FileIntegrationConstants.APPROVED
					+ "',created_by,created_date,last_modified_by,last_modified_date, file_id from fir_mer_stage where file_id ='"
					+ fileAuditId + "'and source_location_code ='" + uniqueStockRequest.getSourceLocationCode()
					+ "'and destination_location_code= '" + uniqueStockRequest.getDestinationLocationCode() + "'";

			jdbcTemplate.execute(stockRequestDetailsSql);

		}

		return RepeatStatus.FINISHED;

	}

	private StockRequestDao createStockRequest(String fileId, String srclocationCode, String destinationLocationCode,
			String weightUnit, String currencyCode) {

		SqlParameterSource parameters = new MapSqlParameterSource("fileId", fileId)
				.addValue("srcLocationCode", srclocationCode)
				.addValue("destinationLocationCode", destinationLocationCode);
		String sql = "Select TOP 1 * from fir_mer_stage where source_location_code =:srcLocationCode and destination_location_code =:destinationLocationCode and file_id=:fileId";
		List<FirMerStageDto> firMerStageDto = namedParameterJdbcTemplate.query(sql, parameters,
				new BeanPropertyRowMapper<>(FirMerStageDto.class));

		String totalRequestedValueSql = "select sum(total_value) from fir_mer_stage where source_location_code ='"
				+ srclocationCode + "'and destination_location_code = '" + destinationLocationCode + "' and  file_id='"
				+ fileId + "'";
		BigDecimal totalRequestedValue = jdbcTemplate.queryForObject(totalRequestedValueSql, BigDecimal.class);

		String totalRequestedWeightSql = "select sum(unitweight*quantity) from fir_mer_stage where source_location_code ='"
				+ srclocationCode + "' and destination_location_code = '" + destinationLocationCode + "' and file_id='"
				+ fileId + "'";
		BigDecimal totalRequestedWeight = jdbcTemplate.queryForObject(totalRequestedWeightSql, BigDecimal.class);

/*		String totalApprovedQtySql = "select sum(total_quantity) from fir_mer_stage where source_location_code ='"
				+ srclocationCode + "' and destination_location_code = '" + destinationLocationCode + "' and file_id='"
				+ fileId + "'";
*/		
		String totalApprovedQtySql = "select sum(quantity) from fir_mer_stage where source_location_code ='"
				+ srclocationCode + "' and destination_location_code = '" + destinationLocationCode + "' and file_id='"
				+ fileId + "'";

		Short totalApprovedQuantity = jdbcTemplate.queryForObject(totalApprovedQtySql, Short.class);

		StockRequestDao stockRequestDao = new StockRequestDao();

		if (firMerStageDto.get(0).getType().equalsIgnoreCase(FileGroupEnum.FIR.toString())) {
			stockRequestDao.setRequestType(FileIntegrationConstants.LOCATION_TYPE_FAC);
		} else {
			stockRequestDao.setRequestType(FileIntegrationConstants.MERCHANDISE_CODE);
		}

		stockRequestDao.setReqDocNo(createReuqestDocNo(firMerStageDto.get(0).getSourceLocationCode(),
				firMerStageDto.get(0).getFiscalYear().shortValue(), DocTypeEnum.STNREQUEST.toString()));
		stockRequestDao.setReqFiscalYear(firMerStageDto.get(0).getFiscalYear().shortValue());
		stockRequestDao.setReqLocationCode(firMerStageDto.get(0).getInitiatedLocationCode());
		stockRequestDao.setReqDocDate(CalendarUtils.getCurrentDate());
		stockRequestDao.setSrcLocationCode(firMerStageDto.get(0).getSourceLocationCode());
		stockRequestDao.setDestLocationCode(destinationLocationCode);
		stockRequestDao.setTotalRequestedQuantity(totalApprovedQuantity);
		stockRequestDao.setTotalRequestedWeight(totalRequestedWeight);

		stockRequestDao.setTotalRequestedValue(totalRequestedValue);

		stockRequestDao.setRequestRemarks(FIR_MER_UPLOAD);
		stockRequestDao.setStatus(FileIntegrationConstants.APPROVED);
		stockRequestDao.setTotalAcceptedQuantity(Short.valueOf("0"));
		stockRequestDao.setTotalApprovedQuantity(totalApprovedQuantity);
		stockRequestDao.setApprovalRemarks(FIR_MER_UPLOAD);

		stockRequestDao.setApprovedBy(firMerStageDto.get(0).getCreatedBy());

		stockRequestDao.setApprovedDate(CalendarUtils.getCurrentDate());
		stockRequestDao.setTotalIssuedQuantity(Short.valueOf("0"));
		stockRequestDao.setTotalIssuedWeight(new BigDecimal("0"));
		stockRequestDao.setOrgCode(CommonConstants.ORG_CODE);
		stockRequestDao.setPrints(Short.valueOf("0"));
		stockRequestDao.setWeightUnit(weightUnit);
		stockRequestDao.setCurrencyCode(currencyCode);
		stockRequestDao.setCorrelationId(fileId);

		return stockRequestDao;
	}

	private Integer createReuqestDocNo(String locationCode, Short fiscalYear, String docType) {
		Integer docNumber = null;
		InvDocMasterDao invDocMasterCriteria = new InvDocMasterDao();
		invDocMasterCriteria.setLocationCode(locationCode);
		invDocMasterCriteria.setFiscalYear(fiscalYear);
		invDocMasterCriteria.setDocType(docType);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<InvDocMasterDao> criteria = Example.of(invDocMasterCriteria, matcher);

		Optional<InvDocMasterDao> invDocMaster = invDocMasterRepository.findOne(criteria);
		if (!invDocMaster.isPresent()) {
			InvDocMasterDao idm = new InvDocMasterDao();
			idm.setDocNo(1);
			idm.setDocType(docType);
			idm.setFiscalYear(fiscalYear);
			idm.setLocationCode(locationCode);
			idm.setCreatedBy("Admin");
			idm.setCreatedDate(new Date());
			idm.setIsActive(true);
			idm.setLastModifiedBy("Admin");
			idm.setLastModifiedDate(new Date());
			invDocMasterRepository.save(idm);
			return idm.getDocNo();
		}
		docNumber = invDocMaster.get().getDocNo() + 1;
		invDocMaster.get().setDocNo(docNumber);
		invDocMasterRepository.saveAndFlush(invDocMaster.get());
		return docNumber;
	}

}
