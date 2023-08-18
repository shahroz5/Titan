/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.InventoryOtherReceiptCustomRequestDto;
import com.titan.poss.report.dto.request.json.InventoryOtherReceiptRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component("inventoryOtherReceiptReport")
public class InventoryOtherReceiptReport extends IReport {

	@Value("${country.code:IND}")
	private String countryCode;

	@Autowired
	private EngineServiceClient engineServiceClient;

	public InventoryOtherReceiptReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("OTHER_RECEIPT_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		InventoryOtherReceiptRequestDto inventoryOtherReceiptRequestDto = (InventoryOtherReceiptRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(inventoryOtherReceiptRequestDto);
		CountryDto country = engineServiceClient.getCountry(reportRequestDto.getAuthorizationHeader(),
				reportRequestDto.getAuthorizationCookie(), countryCode);
		Integer currentFiscalYear = country.getFiscalYear();
		//@formatter:off
		String select = "SELECT    " +
				"   st.location_code as \"Location Code\",   " +
				" bmv.owner_type as \"Btq level\", " +
				" bmv.brand_code as \"Brand\", " +
				" bmv.sub_region_code as \"Region\", " +
				" bmv.state_name as \"State\", " +
				" bmv.town_name as \"City\",  " +
				"   st.received_doc_no as \"Other Receipt-Doc No\",   " +
				"  format(cast(st.received_doc_date as \"date\"),'dd/MM/yyyy')  as \"Doc Date\",   " +
				"   st.received_fiscal_year as \"Fiscal Year\",   " +
				" CASE    " +
				" WHEN st.transaction_type = 'ADJ' THEN 'Adjustments'   " +
				" WHEN st.transaction_type = 'CONV' THEN 'Conversion'   " +
				" WHEN st.transaction_type = 'EXH' THEN 'Exhibition'   " +
				" WHEN st.transaction_type = 'LOAN' THEN 'Loan'   " +
				" WHEN st.transaction_type = 'PSV' THEN 'PSV'   " +
				" ELSE st.transaction_type   " +
				" END as \"Receipt Type\",   " +
				"    st.transaction_type as \"Other Receipt Code\",   " +
				" CASE " +
				" WHEN " + currentFiscalYear  + " = st.received_fiscal_year THEN cast(st.issued_doc_no as varchar) " +
				" ELSE CONCAT(st.issued_doc_no, '-', st.received_fiscal_year) " +
				" END as \"Ref Doc No\", " +
				"   format(cast(st.issued_doc_date as \"date\"),'dd/MM/yyyy') as \"Ref Doc Date\",   " +
				"    CASE    " +
				" WHEN st.transaction_type = 'ADJ' THEN 'Adjustments'   " +
				" WHEN st.transaction_type = 'CONV' THEN 'Conversion'   " +
				" WHEN st.transaction_type = 'EXH' THEN 'Exhibition'   " +
				" WHEN st.transaction_type = 'LOAN' THEN 'Loan'   " +
				" WHEN st.transaction_type = 'PSV' THEN 'PSV'   " +
				" ELSE st.transaction_type   " +
				" END as \"Ref Issue Type\",   " +
				"   std.bin_group_code as \"Bin Group\",   " +
				"   std.item_code as \"Item code\",   " +
				"   std.lot_number as \"Lot Number\",   " +
				"   std.product_group as \"CFA Product Code\",   " +
				"   pgm.description as \"CFA Product Code Description\",   " +
				"   format(std.mfg_date,'MM/yyyy') as \"Manufacturing Date\",    " +
				"   std.received_quantity as \"Received Qty\",   " +
				"   std.received_weight as \"Received Wt\",   " +
				"   std.std_weight as \"Gross Wt\",   " +
				"   std.total_tax as \"Tax\", " +
				"   std.received_value as \"PRE-TAX VALUE\",   " +
				"   std.received_value as \"Value\",   " +
				"   std.std_value as \"Price Per Unit\",   " +
				"   st.received_remarks as \"Remarks\",   " +
				"   JSON_VALUE(st.carrier_details ,'$.data.employeeName') as \"Emp Name\",   " +
				"   JSON_VALUE(st.carrier_details ,'$.data.employeeId') as \"Emp Code\",   " +
				"   JSON_VALUE(st.carrier_details ,'$.data.designation') as \"Designation\",   " +
				"   JSON_VALUE(st.carrier_details ,'$.data.mobileNo') as \"Mobile No\",   " +
				"   JSON_VALUE(st.carrier_details ,'$.data.emailId') as \"Email Id\"   " +
				"   FROM    " +
				"   reports.dbo.stock_transaction st,   " +
				"   reports.dbo.stock_transaction_details std,   " +
				"   reports.dbo.boutique_master_view bmv,   " +
				"   reports.dbo.product_group_master pgm , " + 
				" reports.dbo.product_category_master pcm " +
				"   WHERE    " +
				"     st.location_code  = bmv.location_code    " +
				" AND st.id= std.stock_transaction_id  AND std.product_category = pcm.product_category_code   " +
				" AND pgm.product_group_code  = std.product_group " +
				" AND st.status in ('RECEIVED', 'PUBLISHED')";
		//@formatter:on
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		InventoryOtherReceiptRequestDto inventoryOtherReceiptRequestDto = (InventoryOtherReceiptRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();

		if (!(StringUtils.isEmpty(inventoryOtherReceiptRequestDto.getFromDate())
				&& StringUtils.isEmpty(inventoryOtherReceiptRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(inventoryOtherReceiptRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(inventoryOtherReceiptRequestDto.getToDate());

			query.append(" AND st.received_doc_date BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}
		if (inventoryOtherReceiptRequestDto.getOwnerType() != null
				&& !inventoryOtherReceiptRequestDto.getOwnerType().isEmpty()) {
			query.append(
					" AND bmv.owner_type in (" + formatListToInClause(inventoryOtherReceiptRequestDto.getOwnerType()))
					.append(")");
		}
		if (inventoryOtherReceiptRequestDto.getBrandCode() != null
				&& !inventoryOtherReceiptRequestDto.getBrandCode().isEmpty()) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(inventoryOtherReceiptRequestDto.getBrandCode())).append(")");
		}

		if (inventoryOtherReceiptRequestDto.getInventoryOtherReceiptCustomRequestDto() != null && !CollectionUtils
				.isEmpty(inventoryOtherReceiptRequestDto.getInventoryOtherReceiptCustomRequestDto().getReceiptType())) {
			String receiptTypeList = formatListToInClause(
					inventoryOtherReceiptRequestDto.getInventoryOtherReceiptCustomRequestDto().getReceiptType())
							.toString();
			String updatedReceiptTypeList = receiptTypeList.replace("ADJUSTMENT", "ADJ").replace("CONVERSION", "CONV")
					.replace("EXHIBITION", "EXH");
			query.append(" AND st.transaction_type in (" + updatedReceiptTypeList).append(")");
		} else {
			// default other receipt list
			query.append(" AND st.transaction_type in ('ADJ','PSV','EXH','LOAN','CONV')");
		}

		validateLocationFields(inventoryOtherReceiptRequestDto, query);
		// appending custom inputs
		if (inventoryOtherReceiptRequestDto.getInventoryOtherReceiptCustomRequestDto() != null) {
			validateCustomFields(inventoryOtherReceiptRequestDto.getInventoryOtherReceiptCustomRequestDto(), query);
		}
		return query;
	}

	private StringBuilder validateLocationFields(InventoryOtherReceiptRequestDto inventoryOtherReceiptRequestDto,
			StringBuilder query) {
		if (inventoryOtherReceiptRequestDto.getSubRegionCode() != null
				&& !inventoryOtherReceiptRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(inventoryOtherReceiptRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(inventoryOtherReceiptRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + inventoryOtherReceiptRequestDto.getStateId()).append("'");
		}
		if (inventoryOtherReceiptRequestDto.getTownId() != null
				&& !inventoryOtherReceiptRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(inventoryOtherReceiptRequestDto.getTownId()))
					.append(")");
		}
		if (inventoryOtherReceiptRequestDto.getLocationCode() != null
				&& !inventoryOtherReceiptRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(inventoryOtherReceiptRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(inventoryOtherReceiptRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + inventoryOtherReceiptRequestDto.getCountryId()).append("'");
		}

		return query;
	}

	private StringBuilder validateCustomFields(
			InventoryOtherReceiptCustomRequestDto inventoryOtherReceiptCustomRequestDto, StringBuilder query) {

		if (!CollectionUtils.isEmpty(inventoryOtherReceiptCustomRequestDto.getBinGroupCode())) {
			query.append(" AND std.bin_group_code in ("
					+ formatListToInClause(inventoryOtherReceiptCustomRequestDto.getBinGroupCode())).append(")");
		}
		if (!CollectionUtils.isEmpty(inventoryOtherReceiptCustomRequestDto.getProductGroupCode())) {
			query.append(" AND std.product_group in ("
					+ formatListToInClause(inventoryOtherReceiptCustomRequestDto.getProductGroupCode())).append(")");
		}
		if (!CollectionUtils.isEmpty(inventoryOtherReceiptCustomRequestDto.getProductCategoryCode())) {
			query.append(" AND pcm.product_category_code in ("
					+ formatListToInClause(inventoryOtherReceiptCustomRequestDto.getProductCategoryCode())).append(")");
		}
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {

		InventoryOtherReceiptRequestDto inventoryOtherReceiptRequestDto = (InventoryOtherReceiptRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, InventoryOtherReceiptRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			InventoryOtherReceiptCustomRequestDto inventoryOtherReceiptCustomRequestDto = MapperUtil
					.getObjectMapperInstance().convertValue(inventoryOtherReceiptRequestDto.getCustomFields().getData(),
							InventoryOtherReceiptCustomRequestDto.class);
			inventoryOtherReceiptRequestDto
					.setInventoryOtherReceiptCustomRequestDto(inventoryOtherReceiptCustomRequestDto);

		}
		return inventoryOtherReceiptRequestDto;
	}

	private StringBuilder formatListToInClause(List<String> values) {
		StringBuilder sb = new StringBuilder();
		int count = 0;
		for (String value : values) {

			sb.append("'" + value + "'");
			if (count != values.size() - 1) {
				sb.append(",");
			}
			count++;
		}
		return sb;
	}
}
