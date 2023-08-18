/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.IbtStbHdrDto;
import com.titan.poss.file.dto.StnDtlDto;
import com.titan.poss.file.dto.StnLdtlDto;
import com.titan.poss.file.dto.StnMdtlDto;
import com.titan.poss.file.service.FileService;
import com.titan.poss.location.dao.CountryDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class StnIbtFileWritingTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private FileService fileService;

	@Autowired
	private Environment env;

	private static final String RETURN_INV_LOCAL_OUTPUT_FOLDER = "ibt.stn.local.output.folder";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext().get("ibtStnTransactionId");
		String cfaProductGroupsSql = "Select DISTINCT(product_group_code) from stn_hdr_stage where file_id = '" + fileId
				+ "'";
		List<String> cfaProductGroups = jdbcTemplate.queryForList(cfaProductGroupsSql, String.class);
		CountryDao countryData = fileService.getCountryData();
		String fiscalYear = countryData.getFiscalYear().toString();
		for (String cfaProductGroup : cfaProductGroups) {
			String ihdrSql = "Select * from stn_hdr_stage where product_group_code = '" + cfaProductGroup
					+ "'and file_id = '" + fileId + "'";
			List<IbtStbHdrDto> hdrList = namedParameterJdbcTemplate.query(ihdrSql,
					new BeanPropertyRowMapper<>(IbtStbHdrDto.class));
			String fileName = hdrList.get(0).getLocation() + cfaProductGroup + hdrList.get(0).getDeliveryNo()
					+ hdrList.get(0).getCreatedYear() + hdrList.get(0).getFactoryCode() + "S";
			try (BufferedWriter writer = new BufferedWriter(
					new FileWriter(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
							+ env.getProperty(RETURN_INV_LOCAL_OUTPUT_FOLDER) + fileName + "."
							+ FileExtensionEnum.TXT))) {

				BigDecimal totalWeight = calculateWeight(fileId, hdrList.get(0).getProductGroupCode());
				BigDecimal totalValue = calculateValue(fileId, hdrList.get(0).getProductGroupCode());
				// hdr
				writer.write("HDR" + DelimiterEnum.PSV.getValue() + "TIL" + DelimiterEnum.PSV.getValue()
						+ hdrList.get(0).getLocation() + DelimiterEnum.PSV.getValue() + hdrList.get(0).getTransferType()
						+ DelimiterEnum.PSV.getValue() + cfaProductGroup + DelimiterEnum.PSV.getValue()
						+ hdrList.get(0).getCreatedYear() + DelimiterEnum.PSV.getValue() + hdrList.get(0).getDeliveryNo()
						+ DelimiterEnum.PSV.getValue() + hdrList.get(0).getStmDate().replace("-", "")
						+ DelimiterEnum.PSV.getValue() + " |" + hdrList.get(0).getFactoryCode() + "|0|0|0|0|0|0|0|"
						+ hdrList.get(0).getShipQty() + DelimiterEnum.PSV.getValue() + hdrList.get(0).getShipQty2()
						+ DelimiterEnum.PSV.getValue() + hdrList.get(0).getStmValue() + DelimiterEnum.PSV.getValue()
						+ hdrList.get(0).getCarrierName() + "| | | | | | | | | | | |0|"
						+ hdrList.get(0).getStmDate().replace("-", "") + DelimiterEnum.PSV.getValue()
						+ CalendarUtils.formatDateToString(hdrList.get(0).getStmCreatedTime(), "HH:mm a")
						+ DelimiterEnum.PSV.getValue() + hdrList.get(0).getFactoryCode() + "| | |"
						+ hdrList.get(0).getDocketNumber() + DelimiterEnum.PSV.getValue());

				// idtl
				String idtlSql = "Select * from stn_dtl_stage where product_group = '" + cfaProductGroup
						+ "'and file_id = '" + fileId + "'";
				List<StnDtlDto> dtlList = namedParameterJdbcTemplate.query(idtlSql,
						new BeanPropertyRowMapper<>(StnDtlDto.class));
                  
				dtlList.sort((d1,d2) -> d1.getSlNo().compareTo(d2.getSlNo()));
				// for fetching material  details  start -----------------------------------------
				String mdtlSql = "Select * from stn_mdtl_stage where product_group = '" + cfaProductGroup
						+ "' and file_id = '" + fileId + "'";
				List<StnMdtlDto> mdtlList = namedParameterJdbcTemplate.query(mdtlSql,
						new BeanPropertyRowMapper<>(StnMdtlDto.class));
				// for fetching material  details  end ---------------------------------------------

				for (StnDtlDto dtl : dtlList) {
					String isHallMarking = "0";
					String hallMarkingCode = "";
					String hallMarkingCentreName = "";
					String hallMarkedDate = "";
					String hallMarkRemarks = "";
					String hallMarkRemarks1 = "";
				     BigDecimal materialsWeights = mdtlList.stream().filter(mdtls -> mdtls.getLineCount().equals(dtl.getSlNo())).
					map(mdt -> mdt.getStnWeight()).reduce(BigDecimal.ZERO, BigDecimal::add);
					
					try {
						JsonObject jsonObject = new JsonParser().parse(dtl.getItemDetails()).getAsJsonObject();
						isHallMarking = jsonObject.getAsJsonObject("data").get("isHallMarking").getAsString()
								.equalsIgnoreCase("false") ? "0" : "1";
						hallMarkingCode = jsonObject.getAsJsonObject("data").get("hallMarkingCode").getAsString();
						hallMarkingCentreName = jsonObject.getAsJsonObject("data").get("hallMarkingCentreName")
								.getAsString();
						if(jsonObject.getAsJsonObject("data").get("hallMarkedDate") !=null) {
							hallMarkedDate = CalendarUtils.getParsedDateEpochToDateFormat(jsonObject.getAsJsonObject("data").get("hallMarkedDate").getAsLong());
						}
						log.info("hallMarkedDate {}",hallMarkedDate);
						hallMarkRemarks = jsonObject.getAsJsonObject("data").get("hallMarkRemarks").getAsString();
						hallMarkRemarks1 = jsonObject.getAsJsonObject("data").get("hallMarkRemarks1").getAsString();
					} catch (Exception ex) {
						log.debug("Exception while getting courier name. " + ex);
					}						   
					writer.append(FileIntegrationConstants.NEW_LINE);
					writer.append("DTL" + DelimiterEnum.PSV.getValue() + "TIL" + DelimiterEnum.PSV.getValue()
							+ hdrList.get(0).getLocation() + DelimiterEnum.PSV.getValue()
							+ hdrList.get(0).getTransferType() + DelimiterEnum.PSV.getValue() + cfaProductGroup
							+ DelimiterEnum.PSV.getValue() + hdrList.get(0).getCreatedYear() + DelimiterEnum.PSV.getValue()
							+ hdrList.get(0).getDeliveryNo() + DelimiterEnum.PSV.getValue()
							+ hdrList.get(0).getFactoryCode() + DelimiterEnum.PSV.getValue()
							+ hdrList.get(0).getStmDate().replace("-", "") + DelimiterEnum.PSV.getValue()
							+ dtl.getSlNo() + "|0|VAULT" + DelimiterEnum.PSV.getValue() + dtl.getProductCode()
							+ DelimiterEnum.PSV.getValue() + dtl.getProductValue1() + DelimiterEnum.PSV.getValue()
							+ dtl.getProductQty() + DelimiterEnum.PSV.getValue() + dtl.getProductWt()
							+ DelimiterEnum.PSV.getValue() + dtl.getProductValue2() + "|0|0|0|" + dtl.getLotNumber()
							+ DelimiterEnum.PSV.getValue() + dtl.getActualF1() + DelimiterEnum.PSV.getValue()
							+ dtl.getDiamondWt() + DelimiterEnum.PSV.getValue() + dtl.getOtherStoneWt()
							+ DelimiterEnum.PSV.getValue() + dtl.getOrderNo() + DelimiterEnum.PSV.getValue()
							+ dtl.getIgstPerc() + DelimiterEnum.PSV.getValue() + dtl.getIgstVal()
							+ DelimiterEnum.PSV.getValue() + dtl.getSgstPerc() + DelimiterEnum.PSV.getValue()
							+ dtl.getSgstVal() + DelimiterEnum.PSV.getValue() + dtl.getCgstPerc()
							+ DelimiterEnum.PSV.getValue() + dtl.getCgstVal() + DelimiterEnum.PSV.getValue()
							+ dtl.getUtgstPerc() + DelimiterEnum.PSV.getValue() + dtl.getUtgstVal()
							+ DelimiterEnum.PSV.getValue() + dtl.getGoNetWt() + DelimiterEnum.PSV.getValue()
							+ dtl.getPtNetWt() + DelimiterEnum.PSV.getValue() + dtl.getStnNetWt()
							+ DelimiterEnum.PSV.getValue() + dtl.getSiNetWt() + DelimiterEnum.PSV.getValue()
							+ materialsWeights + DelimiterEnum.PSV.getValue() + isHallMarking
							+ DelimiterEnum.PSV.getValue() + hallMarkingCode + DelimiterEnum.PSV.getValue()
							+ hallMarkingCentreName + DelimiterEnum.PSV.getValue() + hallMarkedDate.replace("-", "")
							+ DelimiterEnum.PSV.getValue() + hallMarkRemarks + DelimiterEnum.PSV.getValue()
							+ hallMarkRemarks1);
				}

				// ildtl
				String ldtlSql = "Select * from stn_ldtl_stage where  product_group = '" + cfaProductGroup
						+ "' and file_id = '" + fileId + "'";
				List<StnLdtlDto> ldtlList = namedParameterJdbcTemplate.query(ldtlSql,
						new BeanPropertyRowMapper<>(StnLdtlDto.class));
				ldtlList.sort((d1,d2) -> d1.getLineCount().compareTo(d2.getLineCount()));
				for (StnLdtlDto ldtl : ldtlList) {
					writer.append(FileIntegrationConstants.NEW_LINE);
					writer.append("LDTL" + DelimiterEnum.PSV.getValue() + ldtl.getLineCount()
							+ DelimiterEnum.PSV.getValue() + ldtl.getLineDtlCount() + DelimiterEnum.PSV.getValue()
							+ ldtl.getItemNo() + DelimiterEnum.PSV.getValue() + ldtl.getStnWeight()
							+ DelimiterEnum.PSV.getValue() + ldtl.getStnQty() + DelimiterEnum.PSV.getValue());
				}

				// imdtl
				mdtlList.sort((d1,d2) -> d1.getLineCount().compareTo(d2.getLineCount()));
				for (StnMdtlDto mdtl : mdtlList) {
					if(mdtl.getStnQty()==null || mdtl.getStnQty()==0) {
						mdtl.setStnQty(1);
					}
					writer.append(FileIntegrationConstants.NEW_LINE);
					writer.append("MDTL" + DelimiterEnum.PSV.getValue() + mdtl.getLineCount()
							+ DelimiterEnum.PSV.getValue() + mdtl.getLineDtlCount() + DelimiterEnum.PSV.getValue()
							+ mdtl.getItemNo() + DelimiterEnum.PSV.getValue() + mdtl.getStnWeight()
							+ DelimiterEnum.PSV.getValue() + mdtl.getStnQty() + DelimiterEnum.PSV.getValue());
				}

				// ictrl
				writer.append(FileIntegrationConstants.NEW_LINE);
				writer.append("CTRL" + DelimiterEnum.PSV.getValue()
						+ (getCount(fileId, cfaProductGroup, "stn_dtl_stage", "product_group")
								+ getCount(fileId, cfaProductGroup, "stn_hdr_stage", "product_group_code"))
						+ DelimiterEnum.PSV.getValue()
						+ getCount(fileId, cfaProductGroup, "stn_hdr_stage", "product_group_code")
						+ DelimiterEnum.PSV.getValue() + totalWeight + DelimiterEnum.PSV.getValue() + totalValue
						+ DelimiterEnum.PSV.getValue());
			}
		}
		return RepeatStatus.FINISHED;
	}

	private BigDecimal calculateWeight(String fileId, String productGroup) {
		String weightSql = "SELECT Coalesce (sum(product_wt),0) from stn_dtl_stage where file_id ='" + fileId
				+ "' and product_group ='" + productGroup + "'";
		return jdbcTemplate.queryForObject(weightSql, BigDecimal.class);
	}

	private BigDecimal calculateValue(String fileId, String productGroup) {
		String weightSql = "SELECT Coalesce (sum(product_value2),0 ) from stn_dtl_stage where file_id ='" + fileId
				+ "' and product_group= '" + productGroup + "'";
		return jdbcTemplate.queryForObject(weightSql, BigDecimal.class);
	}

	private Integer getCount(String fileId, String productGroup, String tableName, String columnName) {
		String weightSql = "SELECT Coalesce (count(*),0 ) from " + tableName + " where file_id ='" + fileId + "' and "
				+ columnName + " = '" + productGroup + "'";
		return jdbcTemplate.queryForObject(weightSql, Integer.class);
	}
}
