package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;

import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.FOCBilledTransactionRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import org.springframework.util.StringUtils;

@Component("FOCBilledTransaction")
public class FOCBilledTransaction extends IReport  {
	
	@Autowired
	ReportFactory reportFactory;

	public FOCBilledTransaction(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("FOC_BILLED_TRANSACTIONS", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) { 
		FOCBilledTransactionRequestDto focBilledTransactionRequestDto = (FOCBilledTransactionRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(focBilledTransactionRequestDto);
		String select ="SELECT DISTINCT st.location_code BTQCode\r\n"
				+ "	,bmv.owner_type LEVEL\r\n"
				+ "	,'' DocNo --If CreditNote or what, need to be checked with Teena\r\n"
				+ "	,'' DocDate --If CreditNote or what, need to be checked with Teena\r\n"
				+ "	,st.doc_no FOCBilledRefDocNo\r\n"
				+ "	,cm.total_weight TotalWt\r\n"
				+ "	,st.Doc_date FOCBilledRefDocDate	\r\n"
				+ "	,JSON_VALUE(FOC.scheme_details, '$.data.schemeName') OfferName\r\n"
				+ "	,JSON_VALUE(FOC.scheme_details, '$.data.schemeCategory') Offer\r\n"
				+ "--Slab\r\n"
				+ "FROM sales_transaction ST\r\n"
				+ "INNER JOIN foc_schemes FOC ON ST.id = FOC.sales_txn_id\r\n"
				+ "INNER JOIN foc_details FOC_D ON FOC.id = FOC_D.foc_scheme_id\r\n"
				+ "INNER JOIN reports.dbo.cash_memo cm ON st.id = cm.id\r\n"
				+ "INNER JOIN reports.dbo.cash_memo_details cmd ON cm.id = cmd.cash_memo_id\r\n"
				+ "INNER JOIN boutique_master_view bmv ON st.location_code = bmv.location_code";
	
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		FOCBilledTransactionRequestDto focBilledTransactionRequestDto = (FOCBilledTransactionRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(focBilledTransactionRequestDto.getFromDate())
				&& StringUtils.isEmpty(focBilledTransactionRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(focBilledTransactionRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(focBilledTransactionRequestDto.getToDate());
			query.append(" WHERE convert(datetime,CONVERT(varchar(10),st.Doc_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(focBilledTransactionRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(focBilledTransactionRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(focBilledTransactionRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(focBilledTransactionRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(focBilledTransactionRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(focBilledTransactionRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(focBilledTransactionRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + focBilledTransactionRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(focBilledTransactionRequestDto.getTownId())) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(focBilledTransactionRequestDto.getTownId()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(focBilledTransactionRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(focBilledTransactionRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(focBilledTransactionRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + focBilledTransactionRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}


	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return (FOCBilledTransactionRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				FOCBilledTransactionRequestDto.class);
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
