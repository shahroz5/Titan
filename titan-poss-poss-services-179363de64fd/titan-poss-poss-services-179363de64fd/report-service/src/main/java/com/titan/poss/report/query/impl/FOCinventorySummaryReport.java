package com.titan.poss.report.query.impl;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;

import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.FOCinventorySummaryRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import org.springframework.util.StringUtils;

@Service("FOCinventorySummaryReport")
public class FOCinventorySummaryReport extends IReport{

	@Autowired
	ReportFactory reportFactory;
	
	public FOCinventorySummaryReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("FOC_INVENTORY_SUMMARY", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		FOCinventorySummaryRequestDto focInventorySummaryRequestDto = (FOCinventorySummaryRequestDto) setCustomInput(reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(focInventorySummaryRequestDto);
		//@formatter:off
 
		String select = "SELECT DISTINCT \r\n"
				+ "	ih.location_code BTQCode\r\n"
				+ "	,bmv.owner_type TYPE\r\n"
				+ "	,bmv.region_name Region\r\n"
				+ "	,bmv.brand_code Brand\r\n"
				+ "	,bmv.state_name State\r\n"
				+ "	,bmv.town_name City	\r\n"
				+ "	,std.created_date CalendarDate\r\n"
				+ "	,'' OpeningQty\r\n"
				+ "	,sum(std.received_quantity) StockReceived\r\n"
				+ "	,sum(std.issued_quantity) StockIssued	\r\n"
				+ "	,'' StockSentToFactory\r\n"
				+ "	,st.dest_doc_date StockReceivedDate \r\n"
				+ "	,'' StockSentToFactoryDate\r\n"
				+ "	,'' Balance\r\n"
				+ "	,st.dest_doc_no StockReceivedSTNNo\r\n"
				+ "	,'' StockSentToFactorySTNNo\r\n"
				+ "FROM inventory_history ih\r\n"
				+ "INNER JOIN stock_transfer_DETAILS std on ih.id=std.inventory_id\r\n"
				+ "INNER JOIN stock_transfer st on st.id=std.stock_transfer_id\r\n"
				+ "INNER JOIN boutique_master_view bmv ON ih.location_code = bmv.location_code\r\n"
				+ "where ih.bin_code='FOC'";
		String groupBy = "group by \r\n"
				+ "ih.location_code \r\n"
				+ "	,bmv.owner_type\r\n"
				+ "	,bmv.region_name\r\n"
				+ "	,bmv.brand_code\r\n"
				+ "	,bmv.state_name\r\n"
				+ "	,bmv.town_name \r\n"
				+ "	,std.created_date\r\n"
				+ "	,st.dest_doc_date\r\n"
				+ "	,st.dest_doc_no 	\r\n"
				+ "";
		//@formatter:on
		return String.format("%s%s%s", select, appendWhereClause, groupBy);
	}
	
	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		FOCinventorySummaryRequestDto focInventorySummaryRequestDto = (FOCinventorySummaryRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(focInventorySummaryRequestDto.getFromDate())
				&& StringUtils.isEmpty(focInventorySummaryRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(focInventorySummaryRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(focInventorySummaryRequestDto.getToDate());
			query.append(" and convert(datetime,CONVERT(varchar(10),std.created_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(focInventorySummaryRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(focInventorySummaryRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(focInventorySummaryRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(focInventorySummaryRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(focInventorySummaryRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(focInventorySummaryRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(focInventorySummaryRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + focInventorySummaryRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(focInventorySummaryRequestDto.getTownId())) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(focInventorySummaryRequestDto.getTownId()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(focInventorySummaryRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(focInventorySummaryRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(focInventorySummaryRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + focInventorySummaryRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}


	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return (FOCinventorySummaryRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				FOCinventorySummaryRequestDto.class);
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
