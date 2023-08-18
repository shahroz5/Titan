/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.InventoryOtherIssueCustomRequestDto;
import com.titan.poss.report.dto.request.json.InventoryOtherIssueRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component("inventoryOtherIssueReport")
public class InventoryOtherIssueReport extends IReport {

	public InventoryOtherIssueReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("OTHER_ISSUE_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		InventoryOtherIssueRequestDto inventoryOtherIssueRequestDto = (InventoryOtherIssueRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(inventoryOtherIssueRequestDto);
		//@formatter:off

		String select =  "SELECT     " +
				"sr.req_location_code as \"Location Code\",    " +
				" bmv.owner_type as \"Btq level\",    " +
				" bmv.brand_code as \"Brand\",    " +
				" bmv.sub_region_code as \"Region\",    " +
				" bmv.state_name as \"State\",    " +
				" bmv.town_name as \"City\",    " +
				" sr.req_doc_no as \"Other Issues Req No\",    " +
				" format(cast(sr.req_doc_date as \"date\"),'dd/MM/yyyy') as \"Other Issues Doc Date\",    " +
				" st.issued_doc_no as \"Doc No\",    " +
				" format(cast(sr.issued_date as \"date\"),'dd/MM/yyyy') as \"Doc Date\",    " +
				" st.issued_fiscal_year as \"Fiscal year\",    " +
				" CASE  " +
				"  WHEN sr.request_type = 'ADJ' THEN 'Adjustments'    " +
				"  WHEN sr.request_type = 'CONV' THEN 'Conversion'    " +
				"  WHEN sr.request_type = 'EXH' THEN 'Exhibition'    " +
				"  WHEN sr.request_type = 'FOC' THEN 'Free of Cost'    " +
				"  WHEN sr.request_type = 'LOAN' THEN 'LOAN'    " +
				"  WHEN sr.request_type = 'LOSS' THEN 'LOSS'    " +
				"  WHEN sr.request_type = 'PSV' THEN 'PSV'    " +
				"  ELSE sr.request_type    " +
				" END as \"Issue Type\",    " +
				" sr.request_type as \"Other Issue Code\",    " +
				" CASE    " +
				" WHEN sr.status in ('APPROVED','ISSUED') THEN 'YES'   " +
				" ELSE ''    " +
				" END  as \"Is Approved\",    " +
				" CASE    " +
				" WHEN sr.status = 'APVL_REJECTED' THEN 'YES'   " +
				" ELSE ''    " +
				" END  as \"Is Cancelled\",    " +
				" srd.item_code as \"Item Code\",    " +
				" srd.lot_number as \"Lot Number\",    " +
				" srd.product_group as \"CFA Product Code\",    " +
				" pgm.description as \"CFA Product Code Description\",    " +
				" format(srd.mfg_date,'MM/yyyy') as \"Manufacturing Date\",    " +
				" srd.bin_group_code as \"Bin Group\",    " +
				" std.std_weight as \"Actual Wt\",    " +
				" srd.requested_weight as \"Measured Wt\",    " +
				" std.issued_quantity as \"Issued Qty\",    " +
				" std.issued_weight as \"Gross Wt\",    " +
				" std.issued_value as \"Value\",    " +
				" std.total_tax as \"Tax\", " +
				" std.issued_value as \"PRE-TAX VALUE\",    " +
				" std.std_value as \"Price Per Unit\",    " +
				" JSON_VALUE(sr.other_details ,'$.data.approvalCode') as \"Approval Code\",    " +
				" JSON_VALUE(sr.other_details ,'$.data.approvedBy') as \"Approved By\",    " +
				" st.issued_remarks as \"Remarks\",    " +
				" sr.approval_remarks as \"Admin Remarks\",    " +
				" sr.created_by as \"Login Id\",    " +
				" JSON_VALUE(st.carrier_details , '$.data.employeeName') as \"Emp Name\",    " +
				" JSON_VALUE(st.carrier_details , '$.data.employeeId') as \"Emp Code\",    " +
				" JSON_VALUE(st.carrier_details , '$.data.designation') as \"Designation\",    " +
				" JSON_VALUE(st.carrier_details , '$.data.mobileNo') as \"Mobile No\",    " +
				" JSON_VALUE(st.carrier_details , '$.data.emailId') as \"Email Id\"  " +
				"FROM    " +
				" stock_request sr    " +
				" inner join stock_request_details srd on    " +
				" sr.id = srd.stock_request_id      " +
				" inner join boutique_master_view bmv on    " +
				" sr.req_location_code = bmv.location_code    " +
				" inner join product_group_master pgm on    " +
				" pgm.product_group_code = srd.product_group"
				+ " inner join reports.dbo.product_category_master pcm on \r\n" + 
				" pcm.product_category_code = srd.product_category     " +
				" left  join Stock_transaction st on    " +
				" st.stock_request_id = sr.id    " +
				" left join stock_transaction_details std on    " +
				" st.id = std.stock_transaction_id and    " +
				" srd.lot_number = std.lot_number and     " +
				" srd.item_code  = std.item_code ";

        //@formatter:on
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		InventoryOtherIssueRequestDto inventoryOtherIssueRequestDto = (InventoryOtherIssueRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(inventoryOtherIssueRequestDto.getFromDate())
				&& StringUtils.isEmpty(inventoryOtherIssueRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(inventoryOtherIssueRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(inventoryOtherIssueRequestDto.getToDate());
			query.append(" WHERE sr.req_doc_date BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (inventoryOtherIssueRequestDto.getOwnerType() != null
				&& !inventoryOtherIssueRequestDto.getOwnerType().isEmpty()) {
			query.append(
					" AND bmv.owner_type in  (" + formatListToInClause(inventoryOtherIssueRequestDto.getOwnerType()))
					.append(")");
		}
		if (inventoryOtherIssueRequestDto.getBrandCode() != null
				&& !inventoryOtherIssueRequestDto.getBrandCode().isEmpty()) {
			query.append(
					" AND bmv.brand_code in (" + formatListToInClause(inventoryOtherIssueRequestDto.getBrandCode()))
					.append(")");
		}

		if (inventoryOtherIssueRequestDto.getInventoryOtherIssueCustomRequestDto() != null && !CollectionUtils
				.isEmpty(inventoryOtherIssueRequestDto.getInventoryOtherIssueCustomRequestDto().getIssueType())) {
			String issueTypeList = formatListToInClause(
					inventoryOtherIssueRequestDto.getInventoryOtherIssueCustomRequestDto().getIssueType()).toString();
			String updatedIssueTypeList = issueTypeList.replace("ADJUSTMENT", "ADJ").replace("CONVERSION", "CONV")
					.replace("EXHIBITION", "EXH");
			query.append(" AND sr.request_type in (" + updatedIssueTypeList).append(")");
		} else {
			// default other issue list
			query.append(" AND sr.request_type in ('ADJ','PSV','EXH','LOAN','CONV', 'LOSS', 'FOC')");
		}

		validateLocationFields(inventoryOtherIssueRequestDto, query);
		// appending custom inputs
		if (inventoryOtherIssueRequestDto.getInventoryOtherIssueCustomRequestDto() != null) {
			validateCustomFields(inventoryOtherIssueRequestDto.getInventoryOtherIssueCustomRequestDto(), query);
		}
		return query;
	}

	private StringBuilder validateLocationFields(InventoryOtherIssueRequestDto inventoryOtherIssueRequestDto,
			StringBuilder query) {
		if (!StringUtils.isEmpty(inventoryOtherIssueRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + inventoryOtherIssueRequestDto.getStateId()).append("'");
		}
		if (inventoryOtherIssueRequestDto.getTownId() != null && !inventoryOtherIssueRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(inventoryOtherIssueRequestDto.getTownId()))
					.append(")");
		}
		if (inventoryOtherIssueRequestDto.getSubRegionCode() != null
				&& !inventoryOtherIssueRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(inventoryOtherIssueRequestDto.getSubRegionCode())).append(")");
		}

		if (inventoryOtherIssueRequestDto.getLocationCode() != null
				&& !inventoryOtherIssueRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in("
					+ formatListToInClause(inventoryOtherIssueRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(inventoryOtherIssueRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + inventoryOtherIssueRequestDto.getCountryId()).append("'");
		}

		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {

		InventoryOtherIssueRequestDto inventoryOtherIssueRequestDto = (InventoryOtherIssueRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, InventoryOtherIssueRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			InventoryOtherIssueCustomRequestDto inventoryOtherIssueCustomRequestDto = MapperUtil
					.getObjectMapperInstance().convertValue(inventoryOtherIssueRequestDto.getCustomFields().getData(),
							InventoryOtherIssueCustomRequestDto.class);
			inventoryOtherIssueRequestDto.setInventoryOtherIssueCustomRequestDto(inventoryOtherIssueCustomRequestDto);
		}
		return inventoryOtherIssueRequestDto;
	}

	private StringBuilder validateCustomFields(InventoryOtherIssueCustomRequestDto inventoryOtherIssueCustomRequestDto,
			StringBuilder query) {

		if (!CollectionUtils.isEmpty(inventoryOtherIssueCustomRequestDto.getBinGroupCode())) {
			query.append(" AND std.bin_group_code in ("
					+ formatListToInClause(inventoryOtherIssueCustomRequestDto.getBinGroupCode())).append(")");
		}
		if (!CollectionUtils.isEmpty(inventoryOtherIssueCustomRequestDto.getProductGroupCode())) {
			query.append(" AND std.product_group in ("
					+ formatListToInClause(inventoryOtherIssueCustomRequestDto.getProductGroupCode())).append(")");
		}
		if (!CollectionUtils.isEmpty(inventoryOtherIssueCustomRequestDto.getProductCategoryCode())) {
			query.append(" AND pcm.product_category_code in ("
					+ formatListToInClause(inventoryOtherIssueCustomRequestDto.getProductCategoryCode())).append(")");
		}
		return query;
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
