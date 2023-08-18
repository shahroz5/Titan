package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;

import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.GV_QCGC_RedemptionSummaryRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import org.springframework.util.StringUtils;


@Component("GV_QCGC_RedemptionSummaryReport")
public class GV_QCGC_RedemptionSummaryReport extends IReport{

	@Autowired
	ReportFactory reportFactory;
	
	public GV_QCGC_RedemptionSummaryReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("GV_QCGC_RedemptionSummaryReport", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) { 
		GV_QCGC_RedemptionSummaryRequestDto gv_qcgc_RedemptionSummaryRequestDto = (GV_QCGC_RedemptionSummaryRequestDto) setCustomInput(reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(gv_qcgc_RedemptionSummaryRequestDto);
		String select ="SELECT \r\n"
				+ "	 A.Type as Type\r\n"
				+ "	,A.BTQCode as BTQCode\r\n"
				+ "	,A.Level as Level\r\n"
				+ "	,A.Region as Region\r\n"
				+ "	,A.Store as Store\r\n"
				+ "	,A.DocType as DocType\r\n"
				+ "	,A.CMNo as CMNo\r\n"
				+ "	,A.CMFiscalYear as CMFiscalYear\r\n"
				+ "	,A.CMDocDate as CMDocDate\r\n"
				+ "	,SUM(A.Plain) as Plain\r\n"
				+ "	,SUM(A.PJWS) as PJWS\r\n"
				+ "	,SUM(A.COIN) as COIN\r\n"
				+ "	,SUM(A.STUDDED) as STUDDED\r\n"
				+ "	,SUM(A.OTHERS) as OTHERS\r\n"
				+ "	,A.GVValue as GVValue\r\n"
				+ "	,A.GVType as GVType	\r\n"
				+ "FROM\r\n"
				+ "(SELECT\r\n"
				+ "	distinct\r\n"
				+ "	CASE WHEN payment_code='GIFT VOUCHER' THEN 'GIFT VOUCHER'\r\n"
				+ "		 WHEN payment_code='QCGC' THEN 'QCGC'\r\n"
				+ "		 END Type\r\n"
				+ "	,bmv.location_code BTQCode\r\n"
				+ "	,bmv.owner_type Level\r\n"
				+ "	,bmv.region_name Region\r\n"
				+ "	,lm.description Store\r\n"
				+ "	,pd.sales_txn_type DocType\r\n"
				+ "	,CASE WHEN ST.txn_type='CM' THEN CONVERT(VARCHAR(10),st.doc_no)\r\n"
				+ "		ELSE '-' END AS CMNo\r\n"
				+ "	,CASE WHEN ST.txn_type='CM' THEN CONVERT(VARCHAR(10),st.fiscal_year)\r\n"
				+ "		ELSE '-' END AS CMFiscalYear\r\n"
				+ "	,CASE WHEN ST.txn_type='CM' THEN CONVERT(VARCHAR(10),st.doc_date)\r\n"
				+ "		ELSE '-' END AS CMDocDate\r\n"
				+ "	,ISNULL(CASE \r\n"
				+ "		WHEN cmd.product_group_code IN (\r\n"
				+ "				'71'\r\n"
				+ "				,'76'\r\n"
				+ "				,'79'\r\n"
				+ "				)\r\n"
				+ "			THEN CASE \r\n"
				+ "						WHEN st.fiscal_year >= 2010\r\n"
				+ "							THEN cmd.total_value + cmd.total_tax - cmd.total_discount\r\n"
				+ "						ELSE cmd.total_value - cmd.total_discount\r\n"
				+ "						END\r\n"
				+ "		END,0) AS Plain\r\n"
				+ "	,ISNULL(CASE \r\n"
				+ "		WHEN cmd.product_group_code IN (\r\n"
				+ "				'75'\r\n"
				+ "				,'88'\r\n"
				+ "				,'89'\r\n"
				+ "				)\r\n"
				+ "			THEN CASE \r\n"
				+ "						WHEN st.fiscal_year >= 2010\r\n"
				+ "							THEN cmd.total_value + cmd.total_tax - cmd.total_discount\r\n"
				+ "						ELSE cmd.total_value - cmd.total_discount\r\n"
				+ "						END\r\n"
				+ "		--ELSE ''\r\n"
				+ "		END,0) AS PJWS\r\n"
				+ "	,ISNULL(CASE \r\n"
				+ "		WHEN cmd.product_group_code IN ('73')\r\n"
				+ "			THEN CASE \r\n"
				+ "						WHEN st.fiscal_year >= 2010\r\n"
				+ "							THEN cmd.total_value + cmd.total_tax - cmd.total_discount\r\n"
				+ "						ELSE cmd.total_value - cmd.total_discount\r\n"
				+ "						END\r\n"
				+ "		END,0) AS COIN\r\n"
				+ "	,ISNULL(CASE \r\n"
				+ "		WHEN cmd.product_group_code IN (\r\n"
				+ "				'72'\r\n"
				+ "				,'74'\r\n"
				+ "				,'77'\r\n"
				+ "				,'78'\r\n"
				+ "				,'86'\r\n"
				+ "				,'87'\r\n"
				+ "				)\r\n"
				+ "			THEN CASE \r\n"
				+ "						WHEN st.fiscal_year >= 2010\r\n"
				+ "							THEN cmd.total_value + cmd.total_tax - cmd.total_discount\r\n"
				+ "						ELSE cmd.total_value - cmd.total_discount\r\n"
				+ "						END\r\n"
				+ "		END,0) AS STUDDED\r\n"
				+ "	,ISNULL(CASE \r\n"
				+ "		WHEN cmd.product_group_code NOT IN (\r\n"
				+ "				'71'\r\n"
				+ "				,'76'\r\n"
				+ "				,'79'\r\n"
				+ "				,'75'\r\n"
				+ "				,'88'\r\n"
				+ "				,'89'\r\n"
				+ "				,'73'\r\n"
				+ "				,'72'\r\n"
				+ "				,'74'\r\n"
				+ "				,'77'\r\n"
				+ "				,'78'\r\n"
				+ "				,'86'\r\n"
				+ "				,'87'\r\n"
				+ "				)\r\n"
				+ "			THEN CASE \r\n"
				+ "						WHEN st.fiscal_year >= 2010\r\n"
				+ "							THEN cmd.total_value + cmd.total_tax - cmd.total_discount\r\n"
				+ "						ELSE cmd.total_value - cmd.total_discount\r\n"
				+ "						END\r\n"
				+ "		END,0) AS OTHERS\r\n"
				+ "	,pd.amount GVValue\r\n"
				+ "	,CASE \r\n"
				+ "		WHEN pd.instrument_no LIKE '8%'\r\n"
				+ "			THEN 'PaperGV'\r\n"
				+ "		WHEN pd.instrument_no LIKE '9%'\r\n"
				+ "			THEN 'PaperGV'\r\n"
				+ "		ELSE 'Egv'\r\n"
				+ "		END GVType\r\n"
				+ "FROM sales_transaction st\r\n"
				+ "LEFT OUTER JOIN cash_memo cm ON st.id = cm.id --and st.txn_type='CM'\r\n"
				+ "LEFT OUTER JOIN cash_memo_details cmd ON cm.id = cmd.cash_memo_id\r\n"
				+ "INNER JOIN payment_details pd ON st.id = pd.sales_txn_id\r\n"
				+ "INNER JOIN gift_master gm ON convert(varchar(max),gm.serial_no) = convert(varchar(max),pd.instrument_no)\r\n"
				+ "INNER JOIN boutique_master_view bmv ON st.location_code = bmv.location_code\r\n"
				+ "inner join location_master lm on bmv.location_code=lm.location_code\r\n"
				+ "WHERE gm.serial_no \r\n"
				+ "IN (\r\n"
				+ "		SELECT instrument_no\r\n"
				+ "		FROM payment_details\r\n"
				+ "		WHERE payment_code in('GIFT VOUCHER','QCGC')\r\n"
				+ "		)\r\n"
				+ "and pd.status='COMPLETED'\r\n"
				+ "and gm.status='REDEEMED'";
	
		String groupBy = ") A "
				+ ""
				+ "GROUP BY\r\n"
				+ " A.Type\r\n"
				+ "	,A.BTQCode\r\n"
				+ "	,A.Level\r\n"
				+ "	,A.Region\r\n"
				+ "	,A.Store\r\n"
				+ "	,A.DocType\r\n"
				+ "	,A.CMNo\r\n"
				+ "	,A.CMFiscalYear\r\n"
				+ "	,A.CMDocDate\r\n"
				+ "	,A.GVValue\r\n"
				+ "	,A.GVType";
		//@formatter:on
		return String.format("%s%s%s", select, appendWhereClause, groupBy);	
	}
	
	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		GV_QCGC_RedemptionSummaryRequestDto gv_qcgc_RedemptionSummaryRequestDto = (GV_QCGC_RedemptionSummaryRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getFromDate())
				&& StringUtils.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(gv_qcgc_RedemptionSummaryRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(gv_qcgc_RedemptionSummaryRequestDto.getToDate());
			query.append(" AND convert(datetime,CONVERT(varchar(10),pd.payment_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(gv_qcgc_RedemptionSummaryRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(gv_qcgc_RedemptionSummaryRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(gv_qcgc_RedemptionSummaryRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + gv_qcgc_RedemptionSummaryRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getTownId())) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(gv_qcgc_RedemptionSummaryRequestDto.getTownId()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(gv_qcgc_RedemptionSummaryRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(gv_qcgc_RedemptionSummaryRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + gv_qcgc_RedemptionSummaryRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}


	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return (GV_QCGC_RedemptionSummaryRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				GV_QCGC_RedemptionSummaryRequestDto.class);
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
