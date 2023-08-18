/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.DiscountEnabledLocationCodeRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component("discountsEnabledLocationCodeReport")
public class DiscountsEnabledLocationCodeReport extends IReport {

	public DiscountsEnabledLocationCodeReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("DISCOUNT_ENABLED_LOCATION_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		DiscountEnabledLocationCodeRequestDto discountEnabledLocationCodeRequestDto = (DiscountEnabledLocationCodeRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(discountEnabledLocationCodeRequestDto);

		// @formatter:off
        String select ="select dlm.location_code as \"Location Code\",   " +
                " dm.discount_code as \"Discount Scheme Name\",   " +
                " format(cast(dlm.offer_start_date as \"date\"),'dd/MM/yyyy')  as \"Scheme Start Date\",   " +
                " format(cast(dlm.offer_end_date  as  \"date\"),'dd/MM/yyyy') as \"Scheme End Date\",   " +
                " format(cast(dlm.preview_start_date as \"date\"),'dd/MM/yyyy')  as \"Preview Scheme Start Date\",   " +
                " format(cast(dlm.preview_end_date as \"date\"),'dd/MM/yyyy')  as \"Preview Scheme End Date\",   " +
                " format(cast(dm.created_date as \"date\"),'dd/MM/yyyy')  as \"Scheme Created Date\",   " +
                " dlm.created_by  as \"Created Login Id\",   " +
                " format(cast(dlm.last_modified_date as \"date\"),'dd/MM/yyyy') as \"Last Modified Date\"   " +
                "from    " +
                " discount_master dm,   " +
                " discount_location_mapping dlm,   " +
                " boutique_master_view bmv    " +
                "where    " +
                "bmv.location_code = dlm.location_code    " +
                "and dm.id = dlm.discount_id ";
		// @formatter:on

		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		DiscountEnabledLocationCodeRequestDto discountEnabledLocationCodeRequestDto = (DiscountEnabledLocationCodeRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(discountEnabledLocationCodeRequestDto.getFromDate())
				&& StringUtils.isEmpty(discountEnabledLocationCodeRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(discountEnabledLocationCodeRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(discountEnabledLocationCodeRequestDto.getToDate());
			query.append(" AND dlm.offer_start_date BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(discountEnabledLocationCodeRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(discountEnabledLocationCodeRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(discountEnabledLocationCodeRequestDto.getBrandCode())) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(discountEnabledLocationCodeRequestDto.getBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(discountEnabledLocationCodeRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(discountEnabledLocationCodeRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(discountEnabledLocationCodeRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + discountEnabledLocationCodeRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(discountEnabledLocationCodeRequestDto.getTownId())) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(discountEnabledLocationCodeRequestDto.getTownId()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(discountEnabledLocationCodeRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(discountEnabledLocationCodeRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(discountEnabledLocationCodeRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + discountEnabledLocationCodeRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		return (DiscountEnabledLocationCodeRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				DiscountEnabledLocationCodeRequestDto.class);

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
