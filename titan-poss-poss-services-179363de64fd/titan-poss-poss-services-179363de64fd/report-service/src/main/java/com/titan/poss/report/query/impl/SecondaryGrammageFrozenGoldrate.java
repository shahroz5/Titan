package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.SecondaryGrammageFrozenGoldrateCustomRequestDto;
import com.titan.poss.report.dto.request.json.SecondaryGrammageFrozenGoldrateRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("SecondaryGrammageFrozenGoldrate")
public class SecondaryGrammageFrozenGoldrate extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public SecondaryGrammageFrozenGoldrate(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("SECONDARY_GRAMMAGE_FROZEN_GOLDRATE", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		SecondaryGrammageFrozenGoldrateRequestDto secondaryGrammageFrozenGoldrateRequestDto=(SecondaryGrammageFrozenGoldrateRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(secondaryGrammageFrozenGoldrateRequestDto);
		

		String select="select cmd.item_code as [smis_itemcode], cmd.lot_number as [lotnumber], st.location_code as [BTQCode],\r\n"
				+ "bmv.town_name+'-'+st.location_code as [Location], bmv.owner_type as [Level], bmv.sub_region_code as [Region],\r\n"
				+ "bmv.brand_code as [smis_brandcode], bmv.state_name as [State], bmv.town_name as [City], FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [Date],\r\n"
				+ "cmd.product_group_code as [CFAProduct], \r\n"
				+ "CASE WHEN JSON_VALUE(cmd.price_details,'$.metalPriceDetails.metalPrices[0].metalTypeCode')='J' THEN \r\n"
				+ "CAST(JSON_VALUE(cmd.price_details,'$.metalPriceDetails.metalPrices[0].metalValue') as float)\r\n"
				+ "ELSE ''\r\n"
				+ "END as [GoldPrice],\r\n"
				+ "cmd.inventory_weight as [Weight], JSON_VALUE(st.metal_rate_details,'$.metalRates.J.ratePerUnit') as [Goldrate],\r\n"
				+ "CASE WHEN GRF.id IS NOT NULL THEN 'Y' ELSE 'N' END as [GoldrateFrozen],\r\n"
				+ "CASE WHEN GRF.frozen_rate_details IS NOT NULL THEN FORMAT(CAST(GRF.doc_date as DATE),'dd/MM/yyyy') ELSE NULL END as [GoldrateFrozenDate],\r\n"
				+ "CASE WHEN GRF.frozen_rate_details IS NOT NULL THEN JSON_VALUE(GRF.frozen_rate_details,'$.data.ratePerUnit') ELSE NULL END as [FrozenGoldrate],\r\n"
				+ "CAST(im.karat as INT) as [smis_karatage], im.complexity_code as [smis_complexity], cmd.total_weight as [smis_totalwt],\r\n"
				+ "st.doc_no as [smis_cmno], ct.customer_id as [customerno], pgm.description as [Description],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.manualBillNo') as [BtqManualBillNo],\r\n"
				+ "CONVERT(varchar,DATEADD(SECOND,CAST(JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.manualBillDate') as BIGINT)/1000,'1970/1/1'),103) as [BtqManualBillDate],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.metalRates.J.ratePerUnit') as [CorporatePrice],\r\n"
				+ "cmd.row_id as [lineitemno]\r\n"
				+ "from reports.dbo.sales_transaction st\r\n"
				+ "inner join reports.dbo.cash_memo cm on cm.id=st.id\r\n"
				+ "inner join reports.dbo.cash_memo_details cmd on cmd.cash_memo_id=cm.id\r\n"
				+ "inner join reports.dbo.boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "left outer join reports.dbo.item_master im on im.item_code=cmd.item_code\r\n"
				+ "left outer join reports.dbo.customer_transaction ct on ct.id=st.id\r\n"
				+ "left outer join reports.dbo.product_group_master pgm on cmd.product_group_code=pgm.product_group_code\r\n"
				+ "left outer join(\r\n"
				+ "	select st1.id,cn.frozen_rate_details,st2.doc_date from reports.dbo.sales_transaction st1 \r\n"
				+ "	inner join reports.dbo.payment_details pd on pd.sales_txn_id=st1.id and pd.payment_code='CREDIT NOTE' and pd.sales_txn_type=st1.txn_type and pd.status='COMPLETED'\r\n"
				+ "	inner join reports.dbo.credit_note cn on cn.id=pd.reference_3 and cn.frozen_rate_details is not null\r\n"
				+ "	left outer join reports.dbo.sales_transaction st2 on st2.id=cn.sales_txn_id\r\n"
				+ ") GRF on GRF.id=st.id\r\n"
				+ "where st.txn_type='CM' and st.status='CONFIRMED'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		SecondaryGrammageFrozenGoldrateRequestDto secondaryGrammageFrozenGoldrateRequestDto= (SecondaryGrammageFrozenGoldrateRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(secondaryGrammageFrozenGoldrateRequestDto.getFromDate())
				&& StringUtils.isEmpty(secondaryGrammageFrozenGoldrateRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(secondaryGrammageFrozenGoldrateRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(secondaryGrammageFrozenGoldrateRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(secondaryGrammageFrozenGoldrateRequestDto, query);
		if (secondaryGrammageFrozenGoldrateRequestDto.getSecondaryGrammageFrozenGoldrateCustomRequestDto() != null) {
			validateCustomInputAndAppend(secondaryGrammageFrozenGoldrateRequestDto, query);
		}
		query.append(" order by st.location_code, st.doc_date, st.doc_no, cmd.row_id");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(SecondaryGrammageFrozenGoldrateRequestDto secondaryGrammageFrozenGoldrateRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(SecondaryGrammageFrozenGoldrateRequestDto secondaryGrammageFrozenGoldrateRequestDto, StringBuilder query) {
		
		
		if (secondaryGrammageFrozenGoldrateRequestDto.getSubRegionCode() != null && !secondaryGrammageFrozenGoldrateRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(secondaryGrammageFrozenGoldrateRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(secondaryGrammageFrozenGoldrateRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + secondaryGrammageFrozenGoldrateRequestDto.getStateId()).append("'");
		}
		if (secondaryGrammageFrozenGoldrateRequestDto.getTownId() != null && !secondaryGrammageFrozenGoldrateRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(secondaryGrammageFrozenGoldrateRequestDto.getTownId())).append(")");
		}
		if (secondaryGrammageFrozenGoldrateRequestDto.getLocationCode() != null && !secondaryGrammageFrozenGoldrateRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(secondaryGrammageFrozenGoldrateRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(secondaryGrammageFrozenGoldrateRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + secondaryGrammageFrozenGoldrateRequestDto.getCountryId()).append("'");
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
		
		SecondaryGrammageFrozenGoldrateRequestDto secondaryGrammageFrozenGoldrateRequestDto = (SecondaryGrammageFrozenGoldrateRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, SecondaryGrammageFrozenGoldrateRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			SecondaryGrammageFrozenGoldrateCustomRequestDto secondaryGrammageFrozenGoldrateCustomRequestDto = new SecondaryGrammageFrozenGoldrateCustomRequestDto();
			secondaryGrammageFrozenGoldrateCustomRequestDto.validate(reportRequestDto.getCustomFields());
			secondaryGrammageFrozenGoldrateCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), SecondaryGrammageFrozenGoldrateCustomRequestDto.class);
			secondaryGrammageFrozenGoldrateRequestDto.setSecondaryGrammageFrozenGoldrateCustomRequestDto(secondaryGrammageFrozenGoldrateCustomRequestDto);
		}
		
		return secondaryGrammageFrozenGoldrateRequestDto;
	}
	
	

}
