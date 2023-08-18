package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.VariantStockLotNoCustomRequestDto;
import com.titan.poss.report.dto.request.json.VariantStockLotNoRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("VariantStockLotNo")
public class VariantStockLotNo extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public VariantStockLotNo(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("VARIANT_STOCK_LOT_NO", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		VariantStockLotNoRequestDto variantStockLotNoRequestDto=(VariantStockLotNoRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(variantStockLotNoRequestDto);
		

		String select="select NULL as [catpb], id.location_code as [smis_locationcode],bmv.town_name+'-'+id.location_code as [smis_location],\r\n"
				+ "bmv.owner_type as [smis_level], bmv.sub_region_code as [smis_region], bmv.state_name as [smis_statename],\r\n"
				+ "bmv.town_name as [smis_city], pgm.description as [smis_cfaproductdes], pcm.description as [smis_category],\r\n"
				+ "id.item_code as [smis_itemcode], id.lot_number as [smis_lotno], im.complexity_code as [smis_complexity],\r\n"
				+ "JSON_VALUE(im.item_details,'$.data.ThemeDesign') as [smis_Design], LEFT(JSON_VALUE(im.item_details,'$.data.ThemeDesign'),4) as [smis_Series],\r\n"
				+ "id.total_quantity as [smis_stockqty],id.std_weight as [smis_stockwt], id.std_value as [smis_stockvalue], \r\n"
				+ "id.bin_code as [BinCode],JSON_VALUE(id.item_details,'$.data.stoneValue') as [stonecharges]\r\n"
				+ "from reports.dbo.inventory_details id\r\n"
				+ "inner join reports.dbo.boutique_master_view bmv on bmv.location_code=id.location_code\r\n"
				+ "left outer join reports.dbo.product_group_master pgm on id.product_group=pgm.product_group_code\r\n"
				+ "left outer join reports.dbo.product_category_master pcm on id.product_category=pcm.product_category_code\r\n"
				+ "left outer join reports.dbo.item_master im on im.item_code=id.item_code\r\n"
				+ "WHERE id.location_code=bmv.location_code";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		VariantStockLotNoRequestDto variantStockLotNoRequestDto= (VariantStockLotNoRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		/*if (!(StringUtils.isEmpty(variantStockLotNoRequestDto.getFromDate())
				&& StringUtils.isEmpty(variantStockLotNoRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(variantStockLotNoRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(variantStockLotNoRequestDto.getToDate());
			query.append(" AND (bd.business_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}*/
		
		validateLocationFields(variantStockLotNoRequestDto, query);
		if (variantStockLotNoRequestDto.getVariantStockLotNoCustomRequestDto() != null) {
			validateCustomInputAndAppend(variantStockLotNoRequestDto, query);
		}
		
		query.append(" order by id.location_code");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(VariantStockLotNoRequestDto variantStockLotNoRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(VariantStockLotNoRequestDto variantStockLotNoRequestDto, StringBuilder query) {
		
		
		if (variantStockLotNoRequestDto.getSubRegionCode() != null && !variantStockLotNoRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(variantStockLotNoRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(variantStockLotNoRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + variantStockLotNoRequestDto.getStateId()).append("'");
		}
		if (variantStockLotNoRequestDto.getTownId() != null && !variantStockLotNoRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(variantStockLotNoRequestDto.getTownId())).append(")");
		}
		if (variantStockLotNoRequestDto.getLocationCode() != null && !variantStockLotNoRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(variantStockLotNoRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(variantStockLotNoRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + variantStockLotNoRequestDto.getCountryId()).append("'");
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

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		
		VariantStockLotNoRequestDto variantStockLotNoRequestDto = (VariantStockLotNoRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, VariantStockLotNoRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			VariantStockLotNoCustomRequestDto variantStockLotNoCustomRequestDto = new VariantStockLotNoCustomRequestDto();
			variantStockLotNoCustomRequestDto.validate(reportRequestDto.getCustomFields());
			variantStockLotNoCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), VariantStockLotNoCustomRequestDto.class);
			variantStockLotNoRequestDto.setVariantStockLotNoCustomRequestDto(variantStockLotNoCustomRequestDto);
		}
		
		return variantStockLotNoRequestDto;
	}
	
	

}
