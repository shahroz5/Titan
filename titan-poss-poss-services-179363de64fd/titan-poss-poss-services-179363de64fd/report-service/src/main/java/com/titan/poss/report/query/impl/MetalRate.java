package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;

import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.MetalRateRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import org.springframework.util.StringUtils;

@Component("MetalRate")
public class MetalRate extends IReport {

	@Autowired
	ReportFactory reportFactory;

	public MetalRate(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("GOLDRATE_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) { 
		MetalRateRequestDto metalRateRequestDto = (MetalRateRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(metalRateRequestDto);
		String select ="SELECT MPL.location_code AS BTQ\r\n"
				+ "	,lm.brand_code AS Brand\r\n"
				+ "	,lm.description AS [Store Name]\r\n"
				+ "	,lm.sub_region_code AS Region\r\n"
				+ "	,MPL.market_code AS MarketCode\r\n"
				+ "	,MM.markup_factor AS Factor\r\n"
				+ "	,MM.add_amount AS AmtAdded\r\n"
				+ "	,MM.deduct_amount AS AmtDeducted\r\n"
				+ "	,MPL.metal_rate AS GoldRate\r\n"
				+ "	,MPC.price_type AS GoldPriceType\r\n"
				+ "	,MPL.last_modified_by AS LoginID\r\n"
				+ "	,CONVERT(CHAR(12), MPL.last_modified_date, 111) AS GldRateUpdatedDate\r\n"
				+ "	,CONVERT(CHAR(8), MPL.last_modified_date, 8) AS GldRateUpdatedTime\r\n"
				+ "	,CONVERT(VARCHAR(10), MPL.StartTime, 111) AS BusinessDate\r\n"
				+ "	,MPC.base_price AS BasePrice\r\n"
				+ "FROM [metal_price_location_mapping] MPL\r\n"
				+ "LEFT OUTER JOIN [metal_price_config] MPC ON MPL.config_id = MPC.id\r\n"
				+ "INNER JOIN [location_master] LM ON MPL.location_code = LM.location_code\r\n"
				+ "	,Market_markup_mapping MM\r\n"
				+ "	,boutique_master_view bmv\r\n"
				+ "WHERE MM.market_code = MPL.market_code\r\n"
				+ "	AND bmv.location_code = MPL.location_code\r\n"
				+ "	AND MM.metal_type_code = MPL.metal_type_code";
	
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		MetalRateRequestDto metalRateRequestDto = (MetalRateRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(metalRateRequestDto.getFromDate())
				&& StringUtils.isEmpty(metalRateRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(metalRateRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(metalRateRequestDto.getToDate());
			query.append(" AND convert(datetime,CONVERT(varchar(10),MPL.last_modified_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(metalRateRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(metalRateRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(metalRateRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(metalRateRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(metalRateRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(metalRateRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(metalRateRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + metalRateRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(metalRateRequestDto.getTownId())) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(metalRateRequestDto.getTownId()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(metalRateRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(metalRateRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(metalRateRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + metalRateRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}


	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return (MetalRateRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				MetalRateRequestDto.class);
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