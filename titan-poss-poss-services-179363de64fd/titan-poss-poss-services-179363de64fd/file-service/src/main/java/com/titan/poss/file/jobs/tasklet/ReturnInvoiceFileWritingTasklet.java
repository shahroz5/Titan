/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.tasklet;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

import com.titan.poss.core.domain.constant.FileGroupEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.FileMasterJobNameEnum;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dao.FileMasterDao;
import com.titan.poss.file.dto.ReturnInvoiceIdtlDto;
import com.titan.poss.file.dto.ReturnInvoiceIhdrDto;
import com.titan.poss.file.dto.ReturnInvoiceIldtlDto;
import com.titan.poss.file.dto.ReturnInvoiceImdtlDto;
import com.titan.poss.file.repository.FileMasterRepository;
import com.titan.poss.file.service.FileService;
import com.titan.poss.location.dao.CountryDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ReturnInvoiceFileWritingTasklet implements Tasklet {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileMasterRepository fileMasterRepository;

	@Autowired
	private Environment env;

	private static final String RETURN_INV_LOCAL_OUTPUT_FOLDER = "return.invoice.local.output.folder";

	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {

		String fileId = (String) chunkContext.getStepContext().getJobExecutionContext()
				.get("returnInvoiceTransactionId");
		String cfaProductGroupsSql = "Select DISTINCT(product_group) from return_inv_ihdr_stage where file_id = '"
				+ fileId + "'";
		List<String> cfaProductGroups = jdbcTemplate.queryForList(cfaProductGroupsSql, String.class);
		CountryDao countryData = fileService.getCountryData();
		String fiscalYear = countryData.getFiscalYear().toString();
		FileMasterDao fileMaster = fileMasterRepository.findByFileGroupAndFileName(FileGroupEnum.ORACLE.toString(),
				FileMasterJobNameEnum.RETURN_INVOICE_JOB.getValue());
		for (String cfaProductGroup : cfaProductGroups) {
			String ihdrSql = "Select * from return_inv_ihdr_stage where product_group = '" + cfaProductGroup
					+ "'and file_id = '" + fileId + "'";
			List<ReturnInvoiceIhdrDto> ihdrList = namedParameterJdbcTemplate.query(ihdrSql,
					new BeanPropertyRowMapper<>(ReturnInvoiceIhdrDto.class));
			String fileName = fileMaster.getFilePrefix() + cfaProductGroup + ihdrList.get(0).getDocumentNumber() + "."
					+ fiscalYear.substring(2, 4);
			try (BufferedWriter writer = new BufferedWriter(
					new FileWriter(env.getProperty(FileIntegrationConstants.FILE_BASE_FOLDER)
							+ env.getProperty(RETURN_INV_LOCAL_OUTPUT_FOLDER) + fileName + "."
							+ FileExtensionEnum.TXT))) {

				BigDecimal totalWeight = calculateWeight(fileId, ihdrList.get(0).getProductGroup());
				BigDecimal totalValue = calculateValue(fileId, ihdrList.get(0).getProductGroup());
				// ihdr
				writer.write(ihdrList.get(0).getType() + DelimiterEnum.PSV.getValue() + ihdrList.get(0).getConstant1()
						+ DelimiterEnum.PSV.getValue() + ihdrList.get(0).getL3BoutiqueCode()
						+ DelimiterEnum.PSV.getValue() + ihdrList.get(0).getConstantValue()
						+ DelimiterEnum.PSV.getValue() + ihdrList.get(0).getProductGroup()
						+ DelimiterEnum.PSV.getValue() + ihdrList.get(0).getDocumentNumber()
						+ DelimiterEnum.PSV.getValue()
						+ ihdrList.get(0).getTransactionDate().replace("-", "")
						+ DelimiterEnum.PSV.getValue() + ihdrList.get(0).getFy() + DelimiterEnum.PSV.getValue()
						+ ihdrList.get(0).getConstant2() + DelimiterEnum.PSV.getValue() + ihdrList.get(0).getSapCode()
						+ DelimiterEnum.PSV.getValue() + calculateQty(fileId, ihdrList.get(0).getProductGroup())
						+ DelimiterEnum.PSV.getValue() + totalWeight + DelimiterEnum.PSV.getValue() + totalValue
						+ DelimiterEnum.PSV.getValue() + ihdrList.get(0).getBillLevelDiscount()
						+ DelimiterEnum.PSV.getValue() + calculateTax(fileId, ihdrList.get(0).getProductGroup())
						+ DelimiterEnum.PSV.getValue() + ihdrList.get(0).getOtherCharges()
						+ DelimiterEnum.PSV.getValue());

				// idtl
				String idtlSql = "Select * from return_inv_idtl_stage where product_group = '" + cfaProductGroup
						+ "'and file_id = '" + fileId + "'";
				List<ReturnInvoiceIdtlDto> idtlList = namedParameterJdbcTemplate.query(idtlSql,
						new BeanPropertyRowMapper<>(ReturnInvoiceIdtlDto.class));

				for (ReturnInvoiceIdtlDto idtl : idtlList) {
					LocalDate fy = CalendarUtils.convertDateToLocalDate(idtl.getFy());
					LocalDate transactionDate = CalendarUtils.convertDateToLocalDate(idtl.getTransactionDate());
					writer.append(FileIntegrationConstants.NEW_LINE);
					writer.append(idtl.getType() + DelimiterEnum.PSV.getValue() + idtl.getConstant1()
							+ DelimiterEnum.PSV.getValue() + idtl.getL3BoutiqueCode() + DelimiterEnum.PSV.getValue()
							+ idtl.getDocumentNumber1() + DelimiterEnum.PSV.getValue() + idtl.getProductGroup()
							+ DelimiterEnum.PSV.getValue() + idtl.getConstant2() + DelimiterEnum.PSV.getValue()
							+ idtl.getDocumentNumber2() + DelimiterEnum.PSV.getValue()
							+ transactionDate.toString().replace("-", "") + DelimiterEnum.PSV.getValue() + fy.getYear()
							+ DelimiterEnum.PSV.getValue() + idtl.getConstant3() + DelimiterEnum.PSV.getValue()
							+ idtl.getSapCode() + DelimiterEnum.PSV.getValue() + idtl.getSlNo()
							+ DelimiterEnum.PSV.getValue() + idtl.getVariantType() + DelimiterEnum.PSV.getValue()
							+ idtl.getItemCode() + DelimiterEnum.PSV.getValue() + idtl.getUnitPriceWithoutTax()
							+ DelimiterEnum.PSV.getValue() + idtl.getQty() + DelimiterEnum.PSV.getValue()
							+ idtl.getWeight() + DelimiterEnum.PSV.getValue() + idtl.getTotalValuePlusTax()
							+ DelimiterEnum.PSV.getValue() + idtl.getLotNumber() + DelimiterEnum.PSV.getValue()
							+ idtl.getActualF1() + DelimiterEnum.PSV.getValue() + idtl.getDiamondWeight()
							+ DelimiterEnum.PSV.getValue() + idtl.getOtherStoneWeight() + DelimiterEnum.PSV.getValue()
							+ idtl.getIgstPer() + DelimiterEnum.PSV.getValue() + idtl.getIgstValue()
							+ DelimiterEnum.PSV.getValue() + idtl.getCgstPer() + DelimiterEnum.PSV.getValue()
							+ idtl.getCgstValue() + DelimiterEnum.PSV.getValue() + idtl.getSgstPer()
							+ DelimiterEnum.PSV.getValue() + idtl.getSgstValue() + DelimiterEnum.PSV.getValue()
							+ idtl.getUtgstPer() + DelimiterEnum.PSV.getValue() + idtl.getUtgstValue()
							+ DelimiterEnum.PSV.getValue() + idtl.getGoNewWt() + DelimiterEnum.PSV.getValue()
							+ idtl.getPtNewWt() + DelimiterEnum.PSV.getValue() + idtl.getSiNetWt()
							+ DelimiterEnum.PSV.getValue() + idtl.getOtherNetWt() + DelimiterEnum.PSV.getValue());
				}

				// ildtl
				String ildtlSql = "Select * from return_inv_ildtl_stage where  product_group = '" + cfaProductGroup
						+ "' and file_id = '" + fileId + "'";
				List<ReturnInvoiceIldtlDto> ildtlList = namedParameterJdbcTemplate.query(ildtlSql,
						new BeanPropertyRowMapper<>(ReturnInvoiceIldtlDto.class));
				for (ReturnInvoiceIldtlDto ildtl : ildtlList) {
					writer.append(FileIntegrationConstants.NEW_LINE);
					writer.append(ildtl.getType() + DelimiterEnum.PSV.getValue() + ildtl.getLineCount()
							+ DelimiterEnum.PSV.getValue() + ildtl.getLineDtlCount() + DelimiterEnum.PSV.getValue()
							+ ildtl.getItemNo() + DelimiterEnum.PSV.getValue() + ildtl.getWeight()
							+ DelimiterEnum.PSV.getValue() + ildtl.getQty() + DelimiterEnum.PSV.getValue());
				}

				// imdtl
				String imdtlSql = "Select * from return_inv_imdtl_stage where product_group = '" + cfaProductGroup
						+ "' and file_id = '" + fileId + "'";
				List<ReturnInvoiceImdtlDto> imdtlList = namedParameterJdbcTemplate.query(imdtlSql,
						new BeanPropertyRowMapper<>(ReturnInvoiceImdtlDto.class));
				for (ReturnInvoiceImdtlDto imdtl : imdtlList) {
					writer.append(FileIntegrationConstants.NEW_LINE);
					writer.append(imdtl.getType() + DelimiterEnum.PSV.getValue() + imdtl.getLineCount()
							+ DelimiterEnum.PSV.getValue() + imdtl.getLineDtlCount() + DelimiterEnum.PSV.getValue()
							+ imdtl.getItemNo() + DelimiterEnum.PSV.getValue() + imdtl.getWeight()
							+ DelimiterEnum.PSV.getValue() + imdtl.getQty() + DelimiterEnum.PSV.getValue());
				}

				// ictrl
				writer.append(FileIntegrationConstants.NEW_LINE);
				writer.append("CTRL" + DelimiterEnum.PSV.getValue() + getCount(fileId, cfaProductGroup, "return_inv_idtl_stage")
						+ DelimiterEnum.PSV.getValue() + getCount(fileId, cfaProductGroup, "return_inv_ihdr_stage")
						+ DelimiterEnum.PSV.getValue() + totalWeight + DelimiterEnum.PSV.getValue() + totalValue
						+ DelimiterEnum.PSV.getValue());
			}
		}
		return RepeatStatus.FINISHED;
	}

	private BigDecimal calculateWeight(String fileId, String productGroup) {
		String weightSql = "SELECT Coalesce (sum(weight),0) from return_inv_idtl_stage where file_id ='" + fileId
				+ "' and product_group ='" + productGroup + "'";
		return jdbcTemplate.queryForObject(weightSql, BigDecimal.class);
	}

	private Integer calculateQty(String fileId, String productGroup) {
		String qtySql = "SELECT Coalesce (sum(qty), 0) from return_inv_idtl_stage where file_id ='" + fileId
				+ "' and product_group ='" + productGroup + "'";
		return jdbcTemplate.queryForObject(qtySql, Integer.class);
	}

	private BigDecimal calculateValue(String fileId, String productGroup) {
		String weightSql = "SELECT Coalesce (sum(total_value_plus_tax),0 ) from return_inv_idtl_stage where file_id ='"
				+ fileId + "' and product_group= '" + productGroup + "'";
		return jdbcTemplate.queryForObject(weightSql, BigDecimal.class);
	}

	private BigDecimal calculateTax(String fileId, String productGroup) {
		String taxSql = "SELECT Coalesce ((sum(igst_value)+sum(cgst_value )+sum(sgst_value )+sum(utgst_value )),0) from [file].dbo.return_inv_idtl_stage where file_id ='"
				+ fileId + "' and product_group = '" + productGroup + "';";
		return jdbcTemplate.queryForObject(taxSql, BigDecimal.class);
	}

	private Integer getCount(String fileId, String productGroup, String tableName) {
		String weightSql = "SELECT Coalesce (count(*),0 ) from " + tableName + " where file_id ='" + fileId
				+ "' and product_group = '" + productGroup + "'";
		return jdbcTemplate.queryForObject(weightSql, Integer.class);
	}
}
