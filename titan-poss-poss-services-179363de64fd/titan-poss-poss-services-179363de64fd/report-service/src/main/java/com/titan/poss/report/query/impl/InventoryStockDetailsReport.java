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
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.StockInventoryCustomRequestDto;
import com.titan.poss.report.dto.request.json.StockInventoryRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component("stockInventoryDetailsReport")
public class InventoryStockDetailsReport extends IReport {

	public InventoryStockDetailsReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("STOCK_DETAIL_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		StockInventoryRequestDto stockInventoryRequestDto = (StockInventoryRequestDto) setCustomInput(reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(stockInventoryRequestDto);
		//@formatter:off

		String select = "SELECT   " +
				"inv.location_code as \"Location Code\",  " +
				"bmv.owner_type as \"Btq Level\",  " +
				"bmv.brand_code as \"Brand\",  " +
				"bmv.sub_region_code as \"Region\",  " +
				"bmv.state_name as \"State\",  " +
				"bmv.town_name as \"City\",  " +
				"inv.product_group as \"CFA Product Code\",  " +
				"pgm.description as \"CFA Product Code Description\",  " +
				"inv.item_code as \"Item Code\",  " +
				"inv.lot_number as \"Lot Number\",  " +
				"pcm.description as \"Product Category Description\",  " +
				"inv.std_weight as \"Unit Weight\",  " +
				"inv.total_quantity as \"Stock Quantity\",  " +
				"inv.bin_group_code as \"Bin Group\",  " +
				"inv.bin_code as \"Bin Code\",  " +
				"CAST(item.karat as INT) as \"Karatage\",  " +
				"CAST(item.purity as INT) as \"Purity\",  " +
				"item.pricing_type as \"Pricing Type\",  " +
				"item.std_value as \"Stock Value\",  " +
				"item.complexity_code as \"Complexity Code\",  " +
				"DATEDIFF(DAY,inv.stock_inward_date,CURRENT_TIMESTAMP) as \"Store Age\",  " +
				"DATEDIFF(DAY,inv.bin_modified_date,CURRENT_TIMESTAMP) as \"Bin Age\",  " +
				"JSON_VALUE(item.item_details ,'$.data.ThemeDesign') as \"Design\",  " +
				"format(inv.mfg_date,'MM/yyyy') as \"Manufacturing Date\",     " +
				"JSON_VALUE(inv.item_details ,'$.data.docNo') as \"STN/Invoice Number\", "+
				"convert(varchar, DATEADD(SS, CONVERT(BIGINT, SUBSTRING(JSON_VALUE(inv.item_details ,'$.data.docDate'), 1,10)), '19700101'), 103) as \"STN Date\", "+
				"DATEDIFF(DAY,inv.mfg_date,CURRENT_TIMESTAMP) as \"Lot Number Age\"  " +
				" FROM   " +
				"inventory_history_by_month inv,  " +
				"boutique_master_view bmv,  " +
				"product_group_master pgm,  " +
				"product_category_master pcm,  " +
				"item_master item  " +
				" WHERE   " +
				"  inv.location_code = bmv.location_code  " +
				" AND inv.product_group = pgm.product_group_code  " +
				" AND inv.product_category = pcm.product_category_code  " +
				" AND inv.item_code = item.item_code " ;

		//@formatter:on
		return String.format("%s%s", select, appendWhereClause);

	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		StockInventoryRequestDto stockInventoryRequestDto = (StockInventoryRequestDto) reportRequestDto;

		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(stockInventoryRequestDto.getFromDate())
				&& StringUtils.isEmpty(stockInventoryRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(stockInventoryRequestDto.getFromDate());

			query.append(" AND inv.inventory_date = '" + fromDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}
		if (stockInventoryRequestDto.getBrandCode() != null
				&& !stockInventoryRequestDto.getBrandCode().isEmpty()) {
			query.append(" AND bmv.brand_code in (" + formatListToInClause(stockInventoryRequestDto.getBrandCode()))
					.append(")");
		}
		if (stockInventoryRequestDto.getOwnerType() != null && !stockInventoryRequestDto.getOwnerType().isEmpty()) {
			query.append(" AND bmv.owner_type in (" + formatListToInClause(stockInventoryRequestDto.getOwnerType()))
					.append(")");
		}
		validateLocationFields(stockInventoryRequestDto, query);
		appendCustomFieldsQuery(stockInventoryRequestDto, query);
		return query;
	}

	private StringBuilder validateLocationFields(StockInventoryRequestDto stockInventoryRequestDto,
			StringBuilder query) {
		if (!StringUtils.isEmpty(stockInventoryRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + stockInventoryRequestDto.getStateId()).append("'");
		}
		if (stockInventoryRequestDto.getTownId() != null && !stockInventoryRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(stockInventoryRequestDto.getTownId()))
					.append(")");
		}
		if (stockInventoryRequestDto.getLocationCode() != null
				&& !stockInventoryRequestDto.getLocationCode().isEmpty()) {
			query.append(
					" AND bmv.location_code in (" + formatListToInClause(stockInventoryRequestDto.getLocationCode()))
					.append(")");
		}
		if (stockInventoryRequestDto.getSubRegionCode() != null
				&& !stockInventoryRequestDto.getSubRegionCode().isEmpty()) {
			query.append(
					" AND bmv.region_code in (" + formatListToInClause(stockInventoryRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(stockInventoryRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + stockInventoryRequestDto.getCountryId()).append("'");
		}

		return query;
	}

	private StringBuilder appendCustomFieldsQuery(StockInventoryRequestDto stockInventoryRequestDto,
			StringBuilder query) {
		if (stockInventoryRequestDto.getStockInventoryCustomRequestDto().getProductCategoryCode() != null
				&& !stockInventoryRequestDto.getStockInventoryCustomRequestDto().getProductCategoryCode().isEmpty()) {
			query.append(" AND inv.product_category in (" + formatListToInClause(
					stockInventoryRequestDto.getStockInventoryCustomRequestDto().getProductCategoryCode())).append(")");
		}
		if (stockInventoryRequestDto.getStockInventoryCustomRequestDto().getProductGroupCode() != null
				&& !stockInventoryRequestDto.getStockInventoryCustomRequestDto().getProductGroupCode().isEmpty()) {
			query.append(" AND inv.product_group in (" + formatListToInClause(
					stockInventoryRequestDto.getStockInventoryCustomRequestDto().getProductGroupCode())).append(")");
		}
		if (stockInventoryRequestDto.getStockInventoryCustomRequestDto().getBinCode() != null
				&& !stockInventoryRequestDto.getStockInventoryCustomRequestDto().getBinCode().isEmpty()) {
			query.append(" AND inv.bin_code in ("
					+ formatListToInClause(stockInventoryRequestDto.getStockInventoryCustomRequestDto().getBinCode()))
					.append(")");
		}
		if (stockInventoryRequestDto.getStockInventoryCustomRequestDto().getBinGroupCode() != null
				&& !stockInventoryRequestDto.getStockInventoryCustomRequestDto().getBinGroupCode().isEmpty()) {
			query.append(" AND inv.bin_group_code in (" + formatListToInClause(
					stockInventoryRequestDto.getStockInventoryCustomRequestDto().getBinGroupCode())).append(")");
		}

		return query;
	}

	/**
	 * Converting json custom details present in request
	 *
	 * @param reportRequestDto
	 * @return
	 */
	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		StockInventoryRequestDto stockInventoryRequestDto = (StockInventoryRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, StockInventoryRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			StockInventoryCustomRequestDto stockInventoryCustomRequestDto = new StockInventoryCustomRequestDto();
			stockInventoryCustomRequestDto.validate(reportRequestDto.getCustomFields());
			stockInventoryCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), StockInventoryCustomRequestDto.class);
			stockInventoryRequestDto.setStockInventoryCustomRequestDto(stockInventoryCustomRequestDto);
		}

		return stockInventoryRequestDto;
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
