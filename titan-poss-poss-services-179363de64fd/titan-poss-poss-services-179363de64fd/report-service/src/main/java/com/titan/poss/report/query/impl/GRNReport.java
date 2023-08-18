package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.GRNReportCustomRequestDto;
import com.titan.poss.report.dto.request.json.GRNReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("GRNReport")
public class GRNReport extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public GRNReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("GRN_REPORT", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		GRNReportRequestDto gRNReportRequestDto=(GRNReportRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(gRNReportRequestDto);
		

		String select="SELECT \r\n"
				+ "	rt.location_code as [Location Code],bmv.town_name as [City], bmv.owner_type as [Channel Type],\r\n"
				+ "	bmv.brand_name as [Brand],bmv.sub_region_code as [Region],bmv.state_name as [State],\r\n"
				+ "	rt.doc_no as [GRN No], FORMAT(CAST(rt.doc_date as DATE),'dd/MM/yyyy') as [GRN Date],rt.fiscal_year as [GRN FISCAL YEAR],\r\n"
				+ "	grd.item_code as [Variant Code], grd.lot_number as [Lot Number], im.description as [Item Description],\r\n"
				+ "	im.product_group_code as [CFA Product Code], pgm.description as [CFA Description],\r\n"
				+ "	CAST(cmd.inventory_weight as float)*-1 as [Actual Weight],\r\n"
				+ "	CAST(cmd.total_weight as float)*-1 as [Measured Weight],\r\n"
				+ "	CAST(cmd.inventory_std_weight as float)*-1 as [Gross Weight],\r\n"
				+ "	CAST(cmd.total_quantity as int)*-1 as [Quantity], \r\n"
				+ "	CAST(im.karat as INT) as [Karatage], im.complexity_code as [Complexity Code], \r\n"
				+ "	CAST(cmd.unit_value as float)*-1 as [Unit Value],  \r\n"
				+ "	CAST(cmd.total_value  as float)*-1 as [Pre Discount Total Value],\r\n"
				+ "	CAST(JSON_VALUE(cmd.price_details,'$.metalPriceDetails.preDiscountValue') as float)*-1 as [Total Gold Price],\r\n"
				+ "	CAST(JSON_VALUE(cmd.price_details,'$.stonePriceDetails.preDiscountValue') as float)*-1 as [Total Stone Value],\r\n"
				+ "	CAST(JSON_VALUE(cmd.price_details,'$.makingChargeDetails.preDiscountValue') as float)*-1 as [Total Making/Wastage Charges],\r\n"
				+ "	CAST(cmd.total_discount as float)*-1 as [Discount],\r\n"
				+ "	CAST(cmd.total_tax as float)*-1 as [Total Tax],\r\n"
				+ "	CAST(cmd.final_value as float)*-1 as [Total Value],\r\n"
				+ "	d1.D1 as [Discount Code 1], 	\r\n"
				+ "	CAST(JSON_VALUE(d2.D1,'$.data.discountValueDetails[0].discountPercent') as float)*-1 as [UCP Discount % on DC1],\r\n"
				+ "	CAST(JSON_VALUE(d2.D1,'$.data.discountValueDetails[0].discountValue') as float)*-1 as [UCP Discount Value on DC1],\r\n"
				+ "	CAST(JSON_VALUE(d2.D1,'$.data.discountValueDetails[3].discountPercent') as float)*-1 as [F1 Discount % on DC1],\r\n"
				+ "	CAST(JSON_VALUE(d2.D1,'$.data.discountValueDetails[3].discountValue') as float)*-1 as [F1 Discount Value on DC1],\r\n"
				+ "	CAST(JSON_VALUE(d2.D1,'$.data.discountValueDetails[1].discountPercent') as float)*-1 as [F2 Discount % on DC1],\r\n"
				+ "	CAST(JSON_VALUE(d2.D1,'$.data.discountValueDetails[1].discountValue') as float)*-1 as [F2 Discount Value on DC1],\r\n"
				+ "\r\n"
				+ "	d1.D2 as [Discount Code 2], \r\n"
				+ "	CAST(JSON_VALUE(d2.D2,'$.data.discountValueDetails[0].discountPercent') as float)*-1 as [UCP Discount % on DC2],\r\n"
				+ "	CAST(JSON_VALUE(d2.D2,'$.data.discountValueDetails[0].discountValue') as float)*-1 as [UCP Discount Value on DC2],\r\n"
				+ "	CAST(JSON_VALUE(d2.D2,'$.data.discountValueDetails[3].discountPercent') as float)*-1 as [F1 Discount % on DC2],\r\n"
				+ "	CAST(JSON_VALUE(d2.D2,'$.data.discountValueDetails[3].discountValue') as float)*-1 as [F1 Discount Value on DC2],\r\n"
				+ "	CAST(JSON_VALUE(d2.D2,'$.data.discountValueDetails[1].discountPercent') as float)*-1 as [F2 Discount % on DC2],\r\n"
				+ "	CAST(JSON_VALUE(d2.D2,'$.data.discountValueDetails[1].discountValue') as float)*-1 as [F2 Discount Value on DC2],\r\n"
				+ "\r\n"
				+ "	d1.D3 as [Discount Code 3], \r\n"
				+ "	CAST(JSON_VALUE(d2.D3,'$.data.discountValueDetails[0].discountPercent') as float)*-1 as [UCP Discount % on DC3],\r\n"
				+ "	CAST(JSON_VALUE(d2.D3,'$.data.discountValueDetails[0].discountValue') as float)*-1 as [UCP Discount Value on DC3],\r\n"
				+ "	CAST(JSON_VALUE(d2.D3,'$.data.discountValueDetails[3].discountPercent') as float)*-1 as [F1 Discount % on DC3],\r\n"
				+ "	CAST(JSON_VALUE(d2.D3,'$.data.discountValueDetails[3].discountValue') as float)*-1 as [F1 Discount Value on DC3],\r\n"
				+ "	CAST(JSON_VALUE(d2.D3,'$.data.discountValueDetails[1].discountPercent') as float)*-1 as [F2 Discount % on DC3],\r\n"
				+ "	CAST(JSON_VALUE(d2.D3,'$.data.discountValueDetails[1].discountValue') as float)*-1 as [F2 Discount Value on DC3],\r\n"
				+ "\r\n"
				+ "	CASE WHEN grd.foc_details_id IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END as [Is FOC],\r\n"
				+ "	CAST(gr.foc_recover_value as float)*-1  as [FOC Recovered Value at Bill Level],\r\n"
				+ "	CAST(JSON_VALUE(cmd.price_details,'$.makingChargeDetails.makingChargePercentage') as float)*-1 as [Making Percentage],\r\n"
				+ "	CAST(JSON_VALUE(cmd.price_details,'$.makingChargeDetails.wastagePct') as float)*-1 as [Wastage Percentage],\r\n"
				+ "	CASE WHEN rt.location_code=st.location_code THEN 'GRN' \r\n"
				+ "		 WHEN rt.location_code != st.location_code THEN 'Inter Boutique GRN'\r\n"
				+ "		 ELSE ''\r\n"
				+ "	END as [Type],\r\n"
				+ "	st.doc_no as [Source CM No],\r\n"
				+ "	st.location_code as [Source CM Location Code],\r\n"
				+ "	FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [CM Doc Date],\r\n"
				+ "	st.fiscal_year as [CM FY],\r\n"
				+ "	JSON_VALUE(st.metal_rate_details,'$.metalRates.J.ratePerUnit') as [CM Gold Rate],\r\n"
				+ "	rt.remarks as [Remarks],\r\n"
				+ "	CAST(grd.final_value as float)*-1 as [GRN Value],\r\n"
				+ "	ct.customer_id  as [Customer No],\r\n"
				+ "	JSON_VALUE(wp.header_data,'$.data.approvalCode') as [Approval Code],\r\n"
				+ "	ct.customer_name as [Customer Name],\r\n"
				+ "	ct.mobile_number as [Mobile No],\r\n"
				+ "	ct.ulp_id as [ULP No]\r\n"
				+ "	from reports.dbo.refund_transaction rt \r\n"
				+ "	inner join reports.dbo.boutique_master_view bmv on rt.location_code=bmv.location_code\r\n"
				+ "	inner join reports.dbo.goods_return_details grd on rt.id=grd.goods_return_id\r\n"
				+ "	inner join reports.dbo.item_master im on im.item_code=grd.item_code\r\n"
				+ "	inner join reports.dbo.product_group_master pgm on pgm.product_group_code=im.product_group_code\r\n"
				+ "	inner join reports.dbo.cash_memo_details cmd on cmd.id=grd.cash_memo_details_id\r\n"
				+ "	left outer join(select a.item_id,a.sales_txn_id,max(case when a.rn=1 then discount_code end) D1\r\n"
				+ "		,max(case when a.rn=2 then discount_code end) D2\r\n"
				+ "		,max(case when a.rn=3 then discount_code end) D3\r\n"
				+ "		from\r\n"
				+ "		(\r\n"
				+ "		select did.discount_value_details, did.item_id, dd.discount_code, dd.sales_txn_id, ROW_NUMBER() OVER(\r\n"
				+ "			PARTITION BY did.item_id,dd.sales_txn_id\r\n"
				+ "			ORDER BY dd.discount_code) as rn from discount_item_details did\r\n"
				+ "				inner join discount_details_sales dd on did.discount_details_id=dd.id where dd.applicable_level='ITEM_LEVEL'\r\n"
				+ "				) a\r\n"
				+ "				group by a.item_id,a.sales_txn_id) d1 on d1.item_id=cmd.id and rt.ref_sales_id=d1.sales_txn_id\r\n"
				+ "	left outer join(select a.item_id,a.sales_txn_id,max(case when a.rn=1 then discount_value_details end) D1\r\n"
				+ "		,max(case when a.rn=2 then discount_value_details end) D2\r\n"
				+ "		,max(case when a.rn=3 then discount_value_details end) D3\r\n"
				+ "		from\r\n"
				+ "		(\r\n"
				+ "		SELECT did.discount_value_details, dd.discount_code, did.item_id,dd.sales_txn_id, ROW_NUMBER() OVER(\r\n"
				+ "		PARTITION BY did.item_id, dd.sales_txn_id\r\n"
				+ "		ORDER BY dd.discount_code) as rn from discount_item_details did inner join discount_details_sales dd\r\n"
				+ "		on dd.id=did.discount_details_id where dd.applicable_level='ITEM_LEVEL'\r\n"
				+ "		)a  group by a.item_id,a.sales_txn_id) d2 on d2.item_id=cmd.id and grd.cash_memo_details_id=d2.item_id and rt.ref_sales_id=d2.sales_txn_id \r\n"
				+ "	inner join goods_return gr on gr.id=grd.goods_return_id\r\n"
				+ "	inner join reports.dbo.sales_transaction st on st.id=rt.ref_sales_id\r\n"
				+ "	inner join reports.dbo.customer_transaction ct on ct.id=st.id\r\n"
				+ "	left outer join reports.dbo.workflow_process wp on wp.workflow_type='GOODS_RETURN' and rt.location_code=wp.location_code and rt.doc_no=wp.doc_no and rt.fiscal_year=wp.fiscal_year\r\n"
				+ "	where rt.txn_type='GRN' and rt.status='CONFIRMED'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		GRNReportRequestDto gRNReportRequestDto= (GRNReportRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(gRNReportRequestDto.getFromDate())
				&& StringUtils.isEmpty(gRNReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(gRNReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(gRNReportRequestDto.getToDate());
			query.append(" AND (rt.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(gRNReportRequestDto, query);
		if (gRNReportRequestDto.getGRNReportCustomRequestDto() != null) {
			validateCustomInputAndAppend(gRNReportRequestDto, query);
		}
		query.append(" order by rt.location_code, rt.doc_date, rt.doc_no");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(GRNReportRequestDto gRNReportRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(GRNReportRequestDto gRNReportRequestDto, StringBuilder query) {
		
		
		if (gRNReportRequestDto.getSubRegionCode() != null && !gRNReportRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(gRNReportRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(gRNReportRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + gRNReportRequestDto.getStateId()).append("'");
		}
		if (gRNReportRequestDto.getTownId() != null && !gRNReportRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(gRNReportRequestDto.getTownId())).append(")");
		}
		if (gRNReportRequestDto.getLocationCode() != null && !gRNReportRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(gRNReportRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(gRNReportRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + gRNReportRequestDto.getCountryId()).append("'");
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
		
		GRNReportRequestDto gRNReportRequestDto = (GRNReportRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, GRNReportRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			GRNReportCustomRequestDto gRNReportCustomRequestDto = new GRNReportCustomRequestDto();
			gRNReportCustomRequestDto.validate(reportRequestDto.getCustomFields());
			gRNReportCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), GRNReportCustomRequestDto.class);
			gRNReportRequestDto.setGRNReportCustomRequestDto(gRNReportCustomRequestDto);
		}
		
		return gRNReportRequestDto;
	}
	
	

}
