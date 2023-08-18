package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.BillCancellationReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("BillCancellationReport")
public class BillCancellationReport extends IReport {

	@Autowired
	ReportFactory reportFactory;

	public BillCancellationReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("BILL_CANCELLATION_REPORT", this);
	}
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		BillCancellationReportRequestDto billCancellationReportRequestDto = (BillCancellationReportRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(billCancellationReportRequestDto);
		String select ="SELECT ST.LOCATION_CODE AS LocationCode\r\n"
				+ "	,RT.doc_no AS BC_NO\r\n"
				+ "	,CN.doc_no AS BC_CN_NO\r\n"
				+ "	,cn.credit_note_type AS CNType\r\n"
				+ "	,CN.amount AS [CN/REFUND Value]\r\n"
				+ "	,CASE \r\n"
				+ "		WHEN rt.cancellation_type = 'CANCEL_WITH_CN'\r\n"
				+ "			THEN 'CN'\r\n"
				+ "		WHEN rt.cancellation_type = 'CANCEL_WITH_RETURN'\r\n"
				+ "			THEN 'REFUND'\r\n"
				+ "		END AS TypeOfCancellation\r\n"
				+ "	,RT.cancelled_time AS BC_DATE_TIME\r\n"
				+ "	,RT.created_by AS BillCancelled_LoginId\r\n"
				+ "	,ST.doc_no RefCMDocNo\r\n"
				+ "	,CM.final_value RefCMDocValue\r\n"
				+ "	,CM.total_discount RefCMDiscount\r\n"
				+ "	,ST.created_date BilledInvoiceDate\r\n"
				+ "	,DATEDIFF(MI, ST.created_date, RT.cancelled_time) AS Timings\r\n"
				+ "	,CT.CUSTOMER_ID AS CustomerNo\r\n"
				+ "	,CT.Customer_Name AS Name\r\n"
				+ "	,RT.remarks AS Remarks\r\n"
				+ "	,RT.fiscal_year AS BCFiscalYear\r\n"
				+ "FROM sales_transaction ST\r\n"
				+ "LEFT OUTER JOIN refund_transaction RT ON ST.ID = RT.REF_SALES_ID\r\n"
				+ "LEFT OUTER JOIN cash_memo CM ON ST.ID = CM.ID\r\n"
				+ "LEFT OUTER JOIN credit_note CN ON ST.ID = CN.sales_txn_id\r\n"
				+ "	,boutique_master_view BMV\r\n"
				+ "	,CUSTOMER_TRANSACTION CT\r\n"
				+ "WHERE RT.TXN_TYPE = 'CMCAN'\r\n"
				+ "	AND RT.STATUS = 'CONFIRMED'\r\n"
				+ "	AND CN.credit_note_type = 'BILL_CANCELLATION'\r\n"
				+ "	AND BMV.LOCATION_CODE = ST.lOCATION_CODE\r\n"
				+ "	AND CT.ID = ST.ID";
	
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		BillCancellationReportRequestDto billCancellationReportRequestDto = (BillCancellationReportRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(billCancellationReportRequestDto.getFromDate())
				&& StringUtils.isEmpty(billCancellationReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(billCancellationReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(billCancellationReportRequestDto.getToDate());
			query.append(" AND convert(datetime,CONVERT(varchar(10),RT.cancelled_time,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(billCancellationReportRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(billCancellationReportRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(billCancellationReportRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(billCancellationReportRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(billCancellationReportRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(billCancellationReportRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(billCancellationReportRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + billCancellationReportRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(billCancellationReportRequestDto.getTownId())) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(billCancellationReportRequestDto.getTownId()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(billCancellationReportRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(billCancellationReportRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(billCancellationReportRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + billCancellationReportRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
				return (BillCancellationReportRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
						BillCancellationReportRequestDto.class);
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