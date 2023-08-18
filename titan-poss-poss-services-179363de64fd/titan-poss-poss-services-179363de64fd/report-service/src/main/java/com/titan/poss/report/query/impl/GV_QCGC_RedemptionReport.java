package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;

import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.GV_QCGC_RedemptionReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import org.springframework.util.StringUtils;

@Component("GV_QCGC_RedemptionReport")
public class GV_QCGC_RedemptionReport extends IReport {
	@Autowired
	ReportFactory reportFactory;
	
	public GV_QCGC_RedemptionReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("GV_QCGC_RedemptionReport", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) { 
		GV_QCGC_RedemptionReportRequestDto gv_qcgc_RedemptionReportRequestDto = (GV_QCGC_RedemptionReportRequestDto) setCustomInput(reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(gv_qcgc_RedemptionReportRequestDto);
		String select ="SELECT CASE \n"
				+ "		WHEN payment_code = 'GIFT VOUCHER'\n"
				+ "			THEN 'GIFT VOUCHER'\n"
				+ "		WHEN payment_code = 'QCGC'\n"
				+ "			THEN 'QCGC'\n"
				+ "		END AS Type\n"
				+ "	,bmv.location_code AS BTQCode\n"
				+ "	,bmv.town_name AS City\n"
				+ "	,'' AS ChannelType\n"
				+ "	,bmv.brand_code AS Brand\n"
				+ "	,bmv.region_name AS Region\n"
				+ "	,pd.payment_date AS RedemptionDate\n"
				+ "	,pd.sales_txn_type AS DocType\n"
				+ "	,gm.denomination AS Denomination\n"
				+ "	,pd.instrument_no AS GVNo\n"
				+ "	,gm.quantity AS Qty\n"
				+ "	,pd.amount AS RedeemedAmount\n"
				+ "	,CASE \n"
				+ "		WHEN ST.txn_type = 'CM'\n"
				+ "			THEN CAST(st.doc_no AS INT)\n"
				+ "		ELSE NULL\n"
				+ "		END AS CMNo\n"
				+ "	,gm.created_date DateOfIssue\n"
				+ "	,JSON_VALUE(gm.gift_details, '$.customerName') AS IssuedTo\n"
				+ "	,JSON_VALUE(gm.gift_details, '$.issuedTo') AS IssuingLocation\n"
				+ "	,CASE \n"
				+ "		WHEN pd.instrument_no LIKE '8%'\n"
				+ "			THEN 'PaperGV'\n"
				+ "		WHEN pd.instrument_no LIKE '9%'\n"
				+ "			THEN 'PaperGV'\n"
				+ "		ELSE 'Egv'\n"
				+ "		END AS GVtype\n"
				+ "	,CASE \n"
				+ "		WHEN pd.sales_txn_type = 'CM'\n"
				+ "			THEN CAST(cm.total_value AS DECIMAL(10,2))\n"
				+ "		ELSE NULL\n"
				+ "		END TotalPrediscountedValue\n"
				+ "	,CASE \n"
				+ "		WHEN pd.sales_txn_type = 'CM'\n"
				+ "			THEN  CAST(cm.total_tax AS DECIMAL(10,2))\n"
				+ "		ELSE NULL\n"
				+ "		END TotalTax\n"
				+ "	,CASE \n"
				+ "		WHEN pd.sales_txn_type = 'CM'\n"
				+ "			THEN CAST((cm.total_value + cm.total_tax - cm.total_discount) AS DECIMAL(10,2))\n"
				+ "		ELSE NULL\n"
				+ "		END TotalValue\n"
				+ "	,pd.bank_name AS [IssuingBank]\n"
				+ "FROM reports.dbo.sales_transaction st\n"
				+ "INNER JOIN reports.dbo.payment_details pd ON st.id = pd.sales_txn_id and pd.status='COMPLETED' and pd.payment_code IN ('QCGC', 'GIFT VOUCHER')\n"
				+ "LEFT OUTER JOIN reports.dbo.cash_memo cm ON st.id = cm.id --and st.txn_type='CM'\n"
				+ "LEFT OUTER JOIN reports.dbo.cash_memo_details cmd ON cm.id = cmd.cash_memo_id\n"
				+ "LEFT OUTER JOIN reports.dbo.gift_master gm ON convert(VARCHAR(max), gm.serial_no) = convert(VARCHAR(max), pd.instrument_no)\n"
				+ ",reports.dbo.boutique_master_view bmv where st.location_code = bmv.location_code";
	
		return String.format("%s%s", select, appendWhereClause);
	}
	
	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		GV_QCGC_RedemptionReportRequestDto gv_qcgc_RedemptionReportRequestDto = (GV_QCGC_RedemptionReportRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(gv_qcgc_RedemptionReportRequestDto.getFromDate())
				&& StringUtils.isEmpty(gv_qcgc_RedemptionReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(gv_qcgc_RedemptionReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(gv_qcgc_RedemptionReportRequestDto.getToDate());
			query.append(" AND convert(datetime,CONVERT(varchar(10),pd.payment_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionReportRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(gv_qcgc_RedemptionReportRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionReportRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(gv_qcgc_RedemptionReportRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionReportRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(gv_qcgc_RedemptionReportRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(gv_qcgc_RedemptionReportRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + gv_qcgc_RedemptionReportRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionReportRequestDto.getTownId())) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(gv_qcgc_RedemptionReportRequestDto.getTownId()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionReportRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(gv_qcgc_RedemptionReportRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(gv_qcgc_RedemptionReportRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + gv_qcgc_RedemptionReportRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}


	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return (GV_QCGC_RedemptionReportRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				GV_QCGC_RedemptionReportRequestDto.class);
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
