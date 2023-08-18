package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.GRFRedemptionCustomRequestDto;
import com.titan.poss.report.dto.request.json.GRFRedemptionRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("GRFRedemption")
public class GRFRedemption extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public GRFRedemption(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("GRF_REDEMPTION", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		GRFRedemptionRequestDto gRFRedemptionRequestDto=(GRFRedemptionRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(gRFRedemptionRequestDto);
		

		String select="select st1.location_code as [Location Code], bmv.town_name as [City], bmv.owner_type as [Channel Type],\r\n"
				+ "bmv.brand_name as  [Brand], bmv.sub_region_name as [Region], bmv.state_name as [State],\r\n"
				+ "st1.doc_no as [CM Doc No], FORMAT(CAST(st1.doc_date as DATE),'dd/MM/yyyy') as [CM Doc Date], st1.fiscal_year as [CM Doc year],\r\n"
				+ "cmd.item_code as [Variant Code],cmd.lot_number as [Lot Number], im.description as [Item Description], cmd.total_quantity as [Qty],\r\n"
				+ "cmd.total_weight as [Unit Wt.],cmd.inventory_weight as [Actual Wt.], cmd.product_group_code as [CFA Product code],\r\n"
				+ "pgm.description as [CFA Product Description], JSON_VALUE(cmd.price_details,'$.metalPriceDetails.preDiscountValue') as [Pre Discount Value],\r\n"
				+ "im.complexity_code as [Complexity], cmd.total_value as [Price], cmd.total_tax as [Total Tax], cmd.final_value as [Final Price],\r\n"
				+ "st1.employee_code as [RSO Name], ct1.customer_name as [CM Customer Name], ct1.mobile_number as [Customer Mobile No], ct1.ulp_id as [Customer ULP No],\r\n"
				+ "st1.txn_type as [Doc Type], st.doc_no as [GRF Doc No], st.doc_date as [GRF Date], cn.doc_no [GRF Credit Note No],  cn.amount as [GRF Amount],\r\n"
				+ "JSON_VALUE(cn.frozen_rate_details,'$.data.weight') as [Gold Wt. Frozen],\r\n"
				+ "JSON_VALUE(cn.frozen_rate_details,'$.data.ratePerUnit') as [GRF Gold Rate],\r\n"
				+ "st.employee_code as [GRF RSO Name], ct.customer_name as [GRF Customer Name], ct.mobile_number as [GRF Customer Mobile No],\r\n"
				+ "ct.ulp_id as [GRF Customer ULP No], st1.created_by as [Login ID],\r\n"
				+ "CASE WHEN cnmerged.cn1merged_cn_id IS NULL THEN 'No'\r\n"
				+ "	 WHEN cnmerged.M1=1 OR cnmerged.M2=1 THEN 'Yes'\r\n"
				+ "	 ELSE 'No'\r\n"
				+ "END as [Is 3rd Party CN Merged]\r\n"
				+ "from reports.dbo.sales_transaction st \r\n"
				+ "inner join reports.dbo.credit_note cn on cn.sales_txn_id=st.id\r\n"
				+ "inner join reports.dbo.customer_transaction ct on ct.id=st.id\r\n"
				+ "inner join reports.dbo.payment_details pd on pd.reference_3=cn.id and cn.doc_no=pd.instrument_no and cn.fiscal_year=pd.reference_2 and pd.status='COMPLETED' and pd.payment_code='CREDIT NOTE' and pd.sales_txn_type='CM'\r\n"
				+ "inner join reports.dbo.sales_transaction st1 on st1.id=pd.sales_txn_id\r\n"
				+ "inner join reports.dbo.boutique_master_view bmv on bmv.location_code=st1.location_code\r\n"
				+ "inner join reports.dbo.cash_memo cm on st1.id=cm.id\r\n"
				+ "inner join reports.dbo.cash_memo_details cmd on cmd.cash_memo_id=cm.id\r\n"
				+ "left outer join reports.dbo.item_master im on cmd.item_code=im.item_code\r\n"
				+ "left outer join reports.dbo.product_group_master pgm on pgm.product_group_code=cmd.product_group_code\r\n"
				+ "left outer join reports.dbo.customer_transaction ct1 on ct1.id=st1.id\r\n"
				+ "left outer join(select a.cn1merged_cn_id, MAX(CASE WHEN a.r=1 THEN CASE WHEN a.ct1ulp_id!=a.ct2ulp_id THEN 1 ELSE 0 END END) M1,\r\n"
				+ "	MAX(CASE WHEN a.r=2 THEN CASE WHEN a.ct1ulp_id!=a.ct2ulp_id THEN 1 ELSE 0 END END) M2\r\n"
				+ "	from\r\n"
				+ "	(\r\n"
				+ "		select cn.id cn1id,cn.sales_txn_id cn1sales_txn_id,cn.merged_cn_id cn1merged_cn_id,ct.ulp_id ct1ulp_id, \r\n"
				+ "		cn1.id cn2id,cn1.sales_txn_id cn2sales_txn_id,cn1.merged_cn_id cn2merged_cn_id,ct1.ulp_id ct2ulp_id, ROW_NUMBER() over(\r\n"
				+ "		PARTITION BY cn1.id\r\n"
				+ "		order by cn1.id) as r\r\n"
				+ "		from reports.dbo.credit_note cn\r\n"
				+ "		inner join reports.dbo.customer_transaction ct on ct.id=cn.sales_txn_id\r\n"
				+ "		left outer join reports.dbo.credit_note cn1 on cn1.id=cn.merged_cn_id\r\n"
				+ "		inner join reports.dbo.customer_transaction ct1 on ct1.id=cn1.sales_txn_id\r\n"
				+ "	)a group by a.cn1merged_cn_id) cnmerged on cnmerged.cn1merged_cn_id=pd.reference_3\r\n"
				+ "where st.sub_txn_type='FROZEN_RATES' and cn.frozen_rate_details IS NOT NULL and cn.status='REDEEMED'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		GRFRedemptionRequestDto gRFRedemptionRequestDto= (GRFRedemptionRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(gRFRedemptionRequestDto.getFromDate())
				&& StringUtils.isEmpty(gRFRedemptionRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(gRFRedemptionRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(gRFRedemptionRequestDto.getToDate());
			query.append(" AND (st1.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(gRFRedemptionRequestDto, query);
		if (gRFRedemptionRequestDto.getGRFRedemptionCustomRequestDto() != null) {
			validateCustomInputAndAppend(gRFRedemptionRequestDto, query);
		}
		query.append(" order by st1.location_code,st1.created_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(GRFRedemptionRequestDto gRFRedemptionRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(GRFRedemptionRequestDto gRFRedemptionRequestDto, StringBuilder query) {
		
		
		if (gRFRedemptionRequestDto.getSubRegionCode() != null && !gRFRedemptionRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(gRFRedemptionRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(gRFRedemptionRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + gRFRedemptionRequestDto.getStateId()).append("'");
		}
		if (gRFRedemptionRequestDto.getTownId() != null && !gRFRedemptionRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(gRFRedemptionRequestDto.getTownId())).append(")");
		}
		if (gRFRedemptionRequestDto.getLocationCode() != null && !gRFRedemptionRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(gRFRedemptionRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(gRFRedemptionRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + gRFRedemptionRequestDto.getCountryId()).append("'");
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
		
		GRFRedemptionRequestDto gRFRedemptionRequestDto = (GRFRedemptionRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, GRFRedemptionRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			GRFRedemptionCustomRequestDto gRFRedemptionCustomRequestDto = new GRFRedemptionCustomRequestDto();
			gRFRedemptionCustomRequestDto.validate(reportRequestDto.getCustomFields());
			gRFRedemptionCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), GRFRedemptionCustomRequestDto.class);
			gRFRedemptionRequestDto.setGRFRedemptionCustomRequestDto(gRFRedemptionCustomRequestDto);
		}
		
		return gRFRedemptionRequestDto;
	}
	
	

}
