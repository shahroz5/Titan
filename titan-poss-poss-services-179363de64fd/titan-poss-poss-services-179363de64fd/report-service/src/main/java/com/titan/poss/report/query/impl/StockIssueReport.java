/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.StockIssueCustomRequestDto;
import com.titan.poss.report.dto.request.json.StockIssueReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component("StockIssueReport")
public class StockIssueReport extends IReport {

	@Autowired
	ReportFactory reportFactory;

	public StockIssueReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("STOCK_ISSUE_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {

		StockIssueReportRequestDto stockIssueRequestDto = (StockIssueReportRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
        StringBuilder appendWhereClause = appendQuery(stockIssueRequestDto);
        String select = "select format(cast(si.[STN Request Date1] as \"date\"), 'dd/MM/yyyy') as \"STN Request Date\",\r\n" + 
        		"format(cast(si.[Return INV Date1] as \"date\"),'dd/MM/yyyy') as \"Return INV Date\" ,*  from \r\n" + 
        		"(select st.src_location_code as \"From Location\", st.dest_location_code as \"To Location\",\r\n" + 
        		"CASE when st.transfer_type ='BTQ_BTQ' then 'Stock Issue'\r\n" + 
        		"when st.transfer_type ='BTQ_FAC' and std.bin_group_code in ('DISPUTE','DEFECTIVE') then 'Dispute/Defective'\r\n" + 
        		"else 'Factory Initiated Stock Issue'\r\n" + 
        		"End as \"Type of document\", st.src_doc_no as \"STN Request No\", st.created_date as \"STN Request Date1\", null as  \"Return INV No\", null as \"Return INV Date1\", std.item_code as \"Variant Code\", std.lot_number as \"Lot Number\"\r\n" + 
        		", pcm.description as \"Product Category Description\", std.issued_quantity as \"Qty\", std.issued_weight as \"Actual Wt\",\r\n" + 
        		"std.std_weight as \"Measured Wt\", std.issued_weight - std.std_weight as \"DFRNS\", std.product_group as \"CFA Code\",\r\n" + 
        		"pgm.description as \"CFA Description\", std.bin_group_code as \"BIN Group\", std.bin_code as \"BIN Code\", std.std_value as \"Value\",\r\n" + 
        		"JSON_VALUE(st.carrier_details, '$.data.companyName') as \"Courier Company\",\r\n" + 
        		"JSON_VALUE(st.carrier_details, '$.data.docketNumber') as \"Docket Number\",\r\n" + 
        		"JSON_VALUE(st.carrier_details, '$.data.lockNumber') as \"Lock Number\",\r\n" + 
        		"JSON_VALUE(st.carrier_details, '$.data.roadPermitNumber') as \"Road Permit Number\",\r\n" + 
        		"st.received_remarks as \"Remarks\", st.created_by as \"Login ID\"\r\n" + 
        		"from reports.dbo.stock_transfer st inner join reports.dbo.stock_transfer_details std on st.id = std.stock_transfer_id \r\n" + 
        		"inner join reports.dbo.product_category_master pcm on std.product_category = pcm.product_category_code\r\n" + 
        		"inner join reports.dbo.product_group_master pgm on std.product_group = pgm.product_group_code \r\n" + 
        		"where st.transfer_type in ('BTQ_BTQ','BTQ_FAC') and st.status ='ISSUED'\r\n" + 
        		"UNION \r\n" + 
        		"select si.src_location_code as \"From Location\", si.dest_location_code as \"To Location\",\r\n" + 
        		"'Stock Issue' as \"Type of document\", null as \"STN Request No\", null as \"STN Request Date1\"\r\n" + 
        		",si.src_doc_no as  \"Return INV No\", si.created_date as \"Return INV Date1\", sid.item_code as \"Variant Code\", sid.lot_number as \"Lot Number\"\r\n" + 
        		", pcm.description as \"Product Category Description\", sid.issued_quantity as \"Qty\", sid.issued_weight as \"Actual Wt\",\r\n" + 
        		"sid.std_weight as \"Measured Wt\", sid.issued_weight - sid.std_weight as \"DFRNS\", sid.product_group as \"CFA Code\",\r\n" + 
        		"pgm.description as \"CFA Description\", sid.bin_group_code as \"BIN Group\", sid.bin_code as \"BIN Code\", sid.std_value as \"Value\",\r\n" + 
        		"JSON_VALUE(si.carrier_details, '$.data.companyName') as \"Courier Company\",\r\n" + 
        		"JSON_VALUE(si.carrier_details, '$.data.docketNumber') as \"Docket Number\",\r\n" + 
        		"JSON_VALUE(si.carrier_details, '$.data.lockNumber') as \"Lock Number\",\r\n" + 
        		"JSON_VALUE(si.carrier_details, '$.data.roadPermitNumber') as \"Road Permit Number\",\r\n" + 
        		"si.received_remarks as \"Remarks\", si.created_by as \"Login ID\"\r\n" + 
        		"from reports.dbo.stock_invoice si inner join reports.dbo.stock_invoice_details sid on si.id = sid.stock_invoice_id \r\n" + 
        		"inner join reports.dbo.product_category_master pcm on sid.product_category = pcm.product_category_code\r\n" + 
        		"inner join reports.dbo.product_group_master pgm on sid.product_group = pgm.product_group_code \r\n" + 
        		"where si.invoice_type in ('BTQ_CFA') and si.status ='ISSUED') as si\r\n" + 
        		"inner join reports.dbo.boutique_master_view bmv on si.[From Location]=bmv.location_code";
		// @formatter:on
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		StockIssueReportRequestDto stockIssueRequestDto = (StockIssueReportRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();

		if (!(StringUtils.isEmpty(stockIssueRequestDto.getFromDate())
				&& StringUtils.isEmpty(stockIssueRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(stockIssueRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(stockIssueRequestDto.getToDate());
			query.append(" AND (si.[STN Request Date1] BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "' or si.[Return INV Date1] BETWEEN '" + fromDate + "' AND '" + toDate + "')");
		}
		if (stockIssueRequestDto.getOwnerType() != null && !stockIssueRequestDto.getOwnerType().isEmpty()) {
			query.append(" AND bmv.owner_type in (" + formatListToInClause(stockIssueRequestDto.getOwnerType()))
					.append(")");
		}
		if (stockIssueRequestDto.getBrandCode() != null && !stockIssueRequestDto.getBrandCode().isEmpty()) {
			query.append(" AND bmv.brand_code in (" + formatListToInClause(stockIssueRequestDto.getBrandCode()))
					.append(")");
		}

		validateLocationFields(stockIssueRequestDto, query);
		if (stockIssueRequestDto.getStockIssueCustomRequestDto() != null) {
			validateCustomInputAndAppend(stockIssueRequestDto, query);
		}
		return query;
	}

	private StringBuilder validateLocationFields(StockIssueReportRequestDto stockIssueRequestDto, StringBuilder query) {
		if (stockIssueRequestDto.getSubRegionCode() != null && !stockIssueRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(stockIssueRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(stockIssueRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + stockIssueRequestDto.getStateId()).append("'");
		}
		if (stockIssueRequestDto.getTownId() != null && !stockIssueRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(stockIssueRequestDto.getTownId())).append(")");
		}
		if (stockIssueRequestDto.getLocationCode() != null && !stockIssueRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(stockIssueRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(stockIssueRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + stockIssueRequestDto.getCountryId()).append("'");
		}

		return query;
	}

	private StringBuilder validateCustomInputAndAppend(StockIssueReportRequestDto stockIssueRequestDto,
			StringBuilder query) {
		if (!CollectionUtil.isEmpty(stockIssueRequestDto.getStockIssueCustomRequestDto().getLocationCode())) {
			query.append(" AND si.[To Location] in("
					+ formatListToInClause(stockIssueRequestDto.getStockIssueCustomRequestDto().getLocationCode()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(stockIssueRequestDto.getStockIssueCustomRequestDto().getCfa())) {
			query.append(" AND si.[CFA Code] in ("
					+ formatListToInClause(stockIssueRequestDto.getStockIssueCustomRequestDto().getCfa())).append(")");
		}
		if (!CollectionUtil.isEmpty(stockIssueRequestDto.getStockIssueCustomRequestDto().getBinGroup())) {
			query.append(" AND si.[BIN Group] in ("
					+ formatListToInClause(stockIssueRequestDto.getStockIssueCustomRequestDto().getBinGroup()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(stockIssueRequestDto.getStockIssueCustomRequestDto().getHeader())) {
			query.append(" AND si.[Type of document] in ("
					+ formatListToInClause(stockIssueRequestDto.getStockIssueCustomRequestDto().getHeader()))
					.append(")");
		}
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		StockIssueReportRequestDto stockIssueRequestDto = (StockIssueReportRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, StockIssueReportRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			StockIssueCustomRequestDto stockIssueCustomRequestDto = new StockIssueCustomRequestDto();
			stockIssueCustomRequestDto.validate(reportRequestDto.getCustomFields());
			stockIssueCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), StockIssueCustomRequestDto.class);
			stockIssueRequestDto.setStockIssueCustomRequestDto(stockIssueCustomRequestDto);
		}
		return stockIssueRequestDto;
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
