/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.file.dto.TepTransactionDto;


import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
public class TepFileWritingTasklet implements Tasklet {

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private Environment env;

	private static final String TEP_TRANSACTION_LOCAL_OUTPUT_FOLDER = "tep.transaction.completed.path";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext().get("tepTransactionId");
		String tepHeaderSql = "Select tts.rec_type,\r\n"
				+ "tts.line_num,\r\n"
				+ "tts.doc_type,\r\n"
				+ "tts.item,\r\n"
				+ "tts.qty,\r\n"
				+ "tts.sec_qty,\r\n"
				+ "tts.unit_price,\r\n"
				+ "tts.vendor_name,\r\n"
				+ "tts.site_name,\r\n"
				+ "tts.ship_to,\r\n"
				+ "tts.bill_to,\r\n"
				+ "tts.item_attribute,\r\n"
				+ "tts.item_attribute1,\r\n"
				+ "tts.item_attribute2,\r\n"
				+ "tts.item_attribute3,\r\n"
				+ "tts.item_attribute4,\r\n"
				+ "tts.item_attribute5,\r\n"
				+ "tts.item_attribute6,\r\n"
				+ "tts.item_attribute7,\r\n"
				+ "tts.item_attribute8,\r\n"
				+ "tts.item_attribute9,\r\n"
				+ "tts.item_attribute10,\r\n"
				+ "tts.item_attribute11,\r\n"
				+ "tts.item_attribute12,\r\n"
				+ "tts.item_attribute13,\r\n"
				+ "tts.record_id,\r\n"
				+ "tts.btq_id,\r\n"
				+ "tts.business_date,\r\n"
				+ "CASE WHEN tts.igst_percentage =0 THEN NULL ELSE CAST( tts.igst_percentage AS decimal(10,1)) END as igst_percentage ,\r\n"
				+ "CASE WHEN tts.igst_value =0 THEN NULL ELSE CAST( tts.igst_value AS decimal(10,2)) END as igst_value,\r\n"
				+ "CASE WHEN tts.sgst_percentage =0 THEN NULL ELSE CAST( tts.sgst_percentage AS decimal(10,1)) END as sgst_percentage,\r\n"
				+ "CASE WHEN tts.sgst_value =0 THEN NULL ELSE CAST( tts.sgst_value AS decimal(10,2)) END as sgst_value,\r\n"
				+ "CASE WHEN tts.cgst_percentage =0 THEN NULL ELSE CAST( tts.cgst_percentage AS decimal(10,1)) END as cgst_percentage,\r\n"
				+ "CASE WHEN tts.cgst_value =0 THEN NULL ELSE CAST( tts.cgst_value AS decimal(10,2)) END as cgst_value,\r\n"
				+ "CASE WHEN tts.utgst_percentage =0 THEN NULL ELSE CAST( tts.utgst_percentage AS decimal(10,1)) END as utgst_percentage,\r\n"
				+ "CASE WHEN tts.utgst_value =0 THEN NULL ELSE CAST( tts.utgst_value AS decimal(10,2)) END as utgst_value,\r\n"
				+ "tts.file_name,\r\n"
				+ "tts.file_id,\r\n"
				+ "tts.goods_exchange_id,\r\n"
				+ "tts.doc_date\r\n"
				+ " from tep_transaction_stage tts where rec_type ='MAIN' and file_id = '" + fileId
				+ "' order by btq_id";
		
		String tepDetailsSql = "Select tts.rec_type,\r\n"
				+ "tts.line_num,\r\n"
				+ "tts.doc_type,\r\n"
				+ "tts.item,\r\n"
				+ "case\r\n"
				+ "                when (tts.item = '11GOZZK001' or tts.item like '2%') then CONVERT(nvarchar(50),CAST(tts.qty as Decimal(10,3)))\r\n"
				+ "                when tts.item != '11GOZZK001' then CONVERT(nvarchar(50),CAST(tts.qty as INT))\r\n"
				+ "                else null end as qty,\r\n"
				+ "tts.sec_qty,\r\n"
				+ "case\r\n"
				+ "                when tts.item = '11GOZZK001' then CONVERT(nvarchar(50),CAST(tts.unit_price as Decimal(10,2)))\r\n"
				+ "                when tts.item != '11GOZZK001' then CONVERT(nvarchar(50),CAST(tts.unit_price as INT))\r\n"
				+ "                else null end as unit_price,\r\n"
				+ "tts.vendor_name,\r\n"
				+ "tts.site_name,\r\n"
				+ "tts.ship_to,\r\n"
				+ "tts.bill_to,\r\n"
				+ "tts.item_attribute,\r\n"
				+ "tts.item_attribute1,\r\n"
				+ "tts.item_attribute2,\r\n"
				+ "tts.item_attribute3,\r\n"
				+ "CAST(tts.item_attribute4 AS int) as item_attribute4,\r\n"
				+ "CAST(tts.item_attribute5 AS int) as item_attribute5,\r\n"
				+ "CAST(tts.item_attribute6 AS int) as item_attribute6,\r\n"
				+ "tts.item_attribute7,\r\n"
				+ "tts.item_attribute8,\r\n"
				+ "tts.item_attribute9,\r\n"
				+ "CAST(tts.item_attribute10 AS int) as item_attribute10,\r\n"
				+ "case\r\n"
				+ "                when tts.item != '11GOZZK001' then CONVERT(nvarchar(50),CAST(tts.item_attribute11 as Decimal(10,3)))\r\n"
				+ "                when tts.item = '11GOZZK001' then CONVERT(nvarchar(50),CAST(tts.item_attribute11 as INT))\r\n"
				+ "                end as item_attribute11,\r\n"
				+ "CASE WHEN tts.item_attribute12 >0  then tts.item_attribute12 \r\n"
				+ "				WHEN tts.item_attribute12=0 THEN   CAST(tts.item_attribute12 as INT) \r\n"
				+ "				ELSE tts.item_attribute12 end as item_attribute12,\r\n"
				+ "CAST(tts.item_attribute13 AS int) as item_attribute13,\r\n"
				+ "tts.record_id,\r\n"
				+ "tts.btq_id,\r\n"
				+ "tts.business_date,\r\n"
				+ "CASE WHEN tts.igst_percentage =0 THEN NULL ELSE CAST( tts.igst_percentage AS decimal(10,1)) END as igst_percentage ,\r\n"
				+ "CASE WHEN tts.igst_value =0 THEN NULL ELSE CAST( tts.igst_value AS decimal(10,2)) END as igst_value,\r\n"
				+ "CASE WHEN tts.sgst_percentage =0 THEN NULL ELSE CAST( tts.sgst_percentage AS decimal(10,1)) END as sgst_percentage,\r\n"
				+ "CASE WHEN tts.sgst_value =0 THEN NULL ELSE CAST( tts.sgst_value AS decimal(10,2)) END as sgst_value,\r\n"
				+ "CASE WHEN tts.cgst_percentage =0 THEN NULL ELSE CAST( tts.cgst_percentage AS decimal(10,1)) END as cgst_percentage,\r\n"
				+ "CASE WHEN tts.cgst_value =0 THEN NULL ELSE CAST( tts.cgst_value AS decimal(10,2)) END as cgst_value,\r\n"
				+ "CASE WHEN tts.utgst_percentage =0 THEN NULL ELSE CAST( tts.utgst_percentage AS decimal(10,1)) END as utgst_percentage,\r\n"
				+ "CASE WHEN tts.utgst_value =0 THEN NULL ELSE CAST( tts.utgst_value AS decimal(10,2)) END as utgst_value,\r\n"
				+ "tts.file_name,\r\n"
				+ "tts.file_id,\r\n"
				+ "tts.goods_exchange_id,\r\n"
				+ "tts.doc_date "
				+ "from tep_transaction_stage tts where rec_type ='PROD' and file_id = '" + fileId
				+ "' order by btq_id";
		List<TepTransactionDto> tepHeaderList = namedParameterJdbcTemplate.query(tepHeaderSql,
				new BeanPropertyRowMapper<>(TepTransactionDto.class));
		List<TepTransactionDto> tepDetailsList = namedParameterJdbcTemplate.query(tepDetailsSql,
				new BeanPropertyRowMapper<>(TepTransactionDto.class));
		String fileName = tepHeaderList.get(0).getFileName();
		try (BufferedWriter writer = new BufferedWriter(
				new FileWriter(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
						+ env.getProperty(TEP_TRANSACTION_LOCAL_OUTPUT_FOLDER) + fileName + "."
						+ FileExtensionEnum.TXT))) {
			Map<String, Integer> recordIdMap = new HashMap<>();
			for (int i = 0; i < tepHeaderList.size(); i++) {
				String btqId = tepHeaderList.get(i).getBtqId();
				Integer lineNo = 1;
				Integer maxRecordId = recordIdMap.get(btqId);
				if (maxRecordId == null) {
					maxRecordId = getRecordId(btqId);
				}
				writer.write(tepHeaderList.get(i).getRecType() + DelimiterEnum.PSV.getValue()
						+ DelimiterEnum.PSV.getValue() + tepHeaderList.get(i).getDocType()
						+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
						+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getVendorName() + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getSiteName() + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getShipTo() + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getBillTo() + DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
						+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
						+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
						+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
						+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
						+ "0" + DelimiterEnum.PSV.getValue() + (++maxRecordId) + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getBtqId() + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getBusinessDate() + DelimiterEnum.PSV.getValue()
						+ checkForNullForGst(tepHeaderList.get(i).getIgstPercentage()) + DelimiterEnum.PSV.getValue()
						+ checkForNull(tepHeaderList.get(i).getIgstValue()) + DelimiterEnum.PSV.getValue()
						+ checkForNullForGst(tepHeaderList.get(i).getSgstPercentage()) + DelimiterEnum.PSV.getValue()
						+ checkForNull(tepHeaderList.get(i).getSgstValue()) + DelimiterEnum.PSV.getValue()
						+ checkForNullForGst(tepHeaderList.get(i).getCgstPercentage()) + DelimiterEnum.PSV.getValue()
						+ checkForNull(tepHeaderList.get(i).getCgstValue()) + DelimiterEnum.PSV.getValue()
						+ checkForNullForGst(tepHeaderList.get(i).getUtgstPercentage()) + DelimiterEnum.PSV.getValue()
						+ checkForNull(tepHeaderList.get(i).getUtgstValue()) + DelimiterEnum.PSV.getValue()
						+ tepHeaderList.get(i).getFileName());
				writer.append(FileIntegrationConstants.NEW_LINE);
				for (TepTransactionDto tepDetails : tepDetailsList) {
					if(tepDetails.getBusinessDate().equalsIgnoreCase(tepHeaderList.get(i).getBusinessDate()) && tepDetails.getBtqId().equalsIgnoreCase(tepHeaderList.get(i).getBtqId())){
						writer.write(tepDetails.getRecType() + DelimiterEnum.PSV.getValue() + lineNo //tepDetails.getLineNum()
								+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue() + tepDetails.getItem()
								+ DelimiterEnum.PSV.getValue() + tepDetails.getQty() + DelimiterEnum.PSV.getValue()
								+ tepDetails.getSecQty() + DelimiterEnum.PSV.getValue() + checkForNullForRatePerUnit(tepDetails.getUnitPrice())
								+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
								+ DelimiterEnum.PSV.getValue() + DelimiterEnum.PSV.getValue()
								+ DelimiterEnum.PSV.getValue() + tepDetails.getItemAttribute()
								+ DelimiterEnum.PSV.getValue() + tepDetails.getItemAttribute1()
								+ DelimiterEnum.PSV.getValue() + tepDetails.getItemAttribute2()
								+ DelimiterEnum.PSV.getValue() + tepDetails.getItemAttribute3()
								+ DelimiterEnum.PSV.getValue() + checkForNullForRatePerUnit(tepDetails.getItemAttribute4())
								+ DelimiterEnum.PSV.getValue()
								+ tepDetails.getItemAttribute5().setScale(0, RoundingMode.HALF_UP)
								+ DelimiterEnum.PSV.getValue() + checkForNullForRatePerUnit(tepDetails.getItemAttribute6())
								+ DelimiterEnum.PSV.getValue()
								+ tepDetails.getItemAttribute7().setScale(0, RoundingMode.HALF_UP)
								+ DelimiterEnum.PSV.getValue() + tepDetails.getItemAttribute8()
								+ DelimiterEnum.PSV.getValue() + checkForNull(tepDetails.getItemAttribute9())
								+ DelimiterEnum.PSV.getValue() + checkForNullForRatePerUnit(tepDetails.getItemAttribute10())
								+ DelimiterEnum.PSV.getValue() + return0IfNull(tepDetails.getItemAttribute11(),tepDetails.getItemAttribute1())
								+ DelimiterEnum.PSV.getValue() + checkAttribute12(tepDetails.getItemAttribute12(),tepDetails.getItemAttribute1())
								+ DelimiterEnum.PSV.getValue() + return0IfNullForInt(tepDetails.getItemAttribute13().intValue())
								+ DelimiterEnum.PSV.getValue() + (++maxRecordId) + DelimiterEnum.PSV.getValue()
								+ tepDetails.getBtqId() + DelimiterEnum.PSV.getValue() + tepDetails.getBusinessDate()
								+ DelimiterEnum.PSV.getValue() + checkForNullForGst(tepDetails.getIgstPercentage())
								+ DelimiterEnum.PSV.getValue() + checkForNull(tepDetails.getIgstValue())
								+ DelimiterEnum.PSV.getValue() + checkForNullForGst(tepDetails.getSgstPercentage())
								+ DelimiterEnum.PSV.getValue() + checkForNull(tepDetails.getSgstValue())
								+ DelimiterEnum.PSV.getValue() + checkForNullForGst(tepDetails.getCgstPercentage())
								+ DelimiterEnum.PSV.getValue() + checkForNull(tepDetails.getCgstValue())
								+ DelimiterEnum.PSV.getValue() + checkForNullForGst(tepDetails.getUtgstPercentage())
								+ DelimiterEnum.PSV.getValue() + checkForNull(tepDetails.getUtgstValue())
								+ DelimiterEnum.PSV.getValue() + tepDetails.getFileName());
						recordIdMap.put(btqId, maxRecordId);
						writer.append(FileIntegrationConstants.NEW_LINE);
						lineNo++;
					}
				}
			}
		}
		return RepeatStatus.FINISHED;
	}

	/**
	 * @param btqId
	 * @return
	 */
	private int getRecordId(String btqId) {

		String maxCountSql = "select COALESCE(max(record_id),0) from [file].dbo.tep_transaction_aud where btq_id ='"
				+ btqId + "'";
		return jdbcTemplate.queryForObject(maxCountSql, Integer.class);
	}

	private String checkForNull(BigDecimal value) {
		return value != null ? value.setScale(2, RoundingMode.HALF_UP).toString() : "";
	}

	private String checkForNullForGst(BigDecimal value) {
		return value != null ? value.setScale(1, RoundingMode.HALF_UP).toString() : "";
	}
	
	private String return0IfNull(BigDecimal value, String attribute1){
		if(attribute1.substring(0, 2).equals("2G"))
			return "0";
		else
		return value != null ? value.setScale(2, RoundingMode.HALF_UP).toString() : "0";
	}
	
	private String return0IfNullForInt(Integer value) {
		return value != null ? value.toString() : "0";
	}
	
	private String checkAttribute12(BigDecimal value, String attribute1) {
		if(value.compareTo(BigDecimal.ZERO)>0)
			return value.toString();
		else if(attribute1.substring(0, 2).equals("2T"))
			return "0";
		else
			return "";
	}
	
	private String checkForNullForRatePerUnit(BigDecimal value) {
				return value != null ? value.setScale(0, RoundingMode.HALF_UP).toString() : "0";
			}

}
