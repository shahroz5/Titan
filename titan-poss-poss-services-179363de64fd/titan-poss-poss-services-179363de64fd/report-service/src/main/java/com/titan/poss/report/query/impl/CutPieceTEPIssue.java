package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.CutPieceTEPIssueCustomRequestDto;
import com.titan.poss.report.dto.request.json.CutPieceTEPIssueRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("CutPieceTEPIssue")
public class CutPieceTEPIssue extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public CutPieceTEPIssue(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("CUT_PIECE_TEP_ISSUE", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		CutPieceTEPIssueRequestDto cutPieceTEPIssueRequestDto=(CutPieceTEPIssueRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(cutPieceTEPIssueRequestDto);
		

		String select="select st.location_code as [BTQ CODE],\r\n"
				+ "bmv.owner_type as [TYPE],\r\n"
				+ "bmv.town_name as [CITY],\r\n"
				+ "bmv.state_name as [STATE],\r\n"
				+ "bmv.sub_region_code as [SUB REGION],\r\n"
				+ "FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [Cut PC tep DATE],\r\n"
				+ "JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.itemCode') as [VARIANT CODE],\r\n"
				+ "JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.lotNumber') as [LOT NUMBER],\r\n"
				+ "im.description as [ITEM DESCRIPTION],\r\n"
				+ "im.product_group_code as [CFA CODE],\r\n"
				+ "pgm.description as [CFA DESCRIPTION],\r\n"
				+ "CAST(JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.grossWeight') as Float) as [GROSS WT.],\r\n"
				+ "CAST(JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.metalWeight.data.goldWeight') as Float) as [GOLD WT.],\r\n"
				+ "std.item_code as [CUT PC TEP CODE],\r\n"
				+ "std.lot_number as [CUT PC TEP LOT NUMBER],\r\n"
				+ "std.std_weight as [CUT PC WT.],\r\n"
				+ "CASE WHEN CAST(JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.metalWeight.data.goldWeight') as Float) > 0 THEN\r\n"
				+ "CONVERT(decimal(10,2),std.std_weight/CAST(JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.metalWeight.data.goldWeight') as Float)*100)\r\n"
				+ "ELSE NULL END as [CUT PC WT. %],\r\n"
				+ "CONVERT(decimal(10,2),CAST(JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.metalWeight.data.goldWeight') as Float)-std.std_weight) as [NET WEIGHT],\r\n"
				+ "std.std_value as [CUT PIECE VALUE],\r\n"
				+ "mplm.metal_rate as [Gold Rate],\r\n"
				+ "em.emp_name as [RSO NAME],\r\n"
				+ "st.remarks as [REMARKS],\r\n"
				+ "cashMemo.doc_no as [BILLED INV NO],\r\n"
				+ "FORMAT(CAST(cashMemo.doc_date  as DATE),'dd/MM/yyyy') as [BILLED DATE],\r\n"
				+ "CASE WHEN DATEDIFF(DAY,st.doc_date,cashMemo.doc_date)=0 THEN \r\n"
				+ "		'0 [Same Day]'\r\n"
				+ "	ELSE\r\n"
				+ "		CAST(DATEDIFF(DAY,st.doc_date,cashMemo.doc_date) as varchar(10))\r\n"
				+ "	END as [No of Days]\r\n"
				+ "from reports.dbo.stock_transaction_cut_piece_sales st\r\n"
				+ "inner join reports.dbo.stock_transaction_details_cut_piece_sales std on std.stock_transaction_id=st.id\r\n"
				+ "left outer join reports.dbo.item_master im on im.item_code=JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.itemCode')\r\n"
				+ "left outer join reports.dbo.product_group_master pgm on pgm.product_group_code=im.product_group_code\r\n"
				+ "left outer join reports.dbo.employee_master em on em.employee_code=st.employee_code\r\n"
				+ "outer apply(\r\n"
				+ " select top 1 st1.doc_no,st1.doc_date from reports.dbo.cash_memo_details cmd\r\n"
				+ "inner join reports.dbo.sales_transaction st1 on st1.id=cmd.cash_memo_id\r\n"
				+ "where cmd.item_code=JSON_VALUE(std.item_details,'$.data.ORIGINAL_ITEM.itemCode')\r\n"
				+ "and cmd.lot_number=std.lot_number\r\n"
				+ "and st1.txn_type='CM' and st1.STATUS NOT IN('DELETED')\r\n"
				+ "order by st1.doc_no asc \r\n"
				+ ") cashMemo\r\n"
				+ "left outer join reports.dbo.metal_price_location_mapping mplm on mplm.location_code=st.location_code \r\n"
				+ "and mplm.applicable_date=st.doc_date and mplm.metal_type_code='J'\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "where st.transaction_type='CUT_PIECE_TEP'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		CutPieceTEPIssueRequestDto cutPieceTEPIssueRequestDto= (CutPieceTEPIssueRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(cutPieceTEPIssueRequestDto.getFromDate())
				&& StringUtils.isEmpty(cutPieceTEPIssueRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(cutPieceTEPIssueRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(cutPieceTEPIssueRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(cutPieceTEPIssueRequestDto, query);
		if (cutPieceTEPIssueRequestDto.getCutPieceTEPIssueCustomRequestDto() != null) {
			validateCustomInputAndAppend(cutPieceTEPIssueRequestDto, query);
		}
		query.append(" order by st.location_code, st.doc_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(CutPieceTEPIssueRequestDto cutPieceTEPIssueRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(CutPieceTEPIssueRequestDto cutPieceTEPIssueRequestDto, StringBuilder query) {
		
		
		if (cutPieceTEPIssueRequestDto.getSubRegionCode() != null && !cutPieceTEPIssueRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(cutPieceTEPIssueRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cutPieceTEPIssueRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + cutPieceTEPIssueRequestDto.getStateId()).append("'");
		}
		if (cutPieceTEPIssueRequestDto.getTownId() != null && !cutPieceTEPIssueRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(cutPieceTEPIssueRequestDto.getTownId())).append(")");
		}
		if (cutPieceTEPIssueRequestDto.getLocationCode() != null && !cutPieceTEPIssueRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(cutPieceTEPIssueRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cutPieceTEPIssueRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + cutPieceTEPIssueRequestDto.getCountryId()).append("'");
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
		
		CutPieceTEPIssueRequestDto cutPieceTEPIssueRequestDto = (CutPieceTEPIssueRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, CutPieceTEPIssueRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CutPieceTEPIssueCustomRequestDto cutPieceTEPIssueCustomRequestDto = new CutPieceTEPIssueCustomRequestDto();
			cutPieceTEPIssueCustomRequestDto.validate(reportRequestDto.getCustomFields());
			cutPieceTEPIssueCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CutPieceTEPIssueCustomRequestDto.class);
			cutPieceTEPIssueRequestDto.setCutPieceTEPIssueCustomRequestDto(cutPieceTEPIssueCustomRequestDto);
		}
		
		return cutPieceTEPIssueRequestDto;
	}
	
	

}
