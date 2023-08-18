package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.TEPIssueCustomRequestDto;
import com.titan.poss.report.dto.request.json.TEPIssueRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("TEPIssue")
public class TEPIssue extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public TEPIssue(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("TEP_ISSUE", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
	
		TEPIssueRequestDto TEPIssueRequestDto=(TEPIssueRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(TEPIssueRequestDto);
		

		String select="select st.location_code as [BTQ CODE], bmv.owner_type as [Owner TYPE], bmv.town_name as [CITY],\r\n"
				+ "bmv.state_name as [STATE], bmv.sub_region_name as [SUB REGION],\r\n"
				+ "st.doc_no as [TEP NO],st.status as [TEP STATUS], cn.doc_no as [CN NO], cn.status as [CN STATUS],\r\n"
				+ "ct.customer_id as [Customer No], ct.customer_name as [Customer Name], st.fiscal_year as [FISCAL YEAR],\r\n"
				+ "ct.ulp_id as [ULP No], format(cast(st.doc_date as DATE),'dd/MM/yyyy') as [DATE],\r\n"
				+ "ged.item_code as [VARIANT CODE], im.description as [ITEM DESCRIPTION],\r\n"
				+ "im.product_group_code as [CFA CODE], pgm.description as [CFA DESCRIPTION], ged.quantity as [Qty],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.iscashMemoAvailable') as [Is CM Available], \r\n"
				+ "CAST(JSON_VALUE(ged.price_details,'$.netWeight') as float)+CAST(JSON_VALUE(ged.price_details,'$.stonePriceDetails.stoneWeight') as float) as [Gross Weight],\r\n"
				+ "ged.created_by as [RSO NAME],\r\n"
				+ "JSON_VALUE(st.metal_rate_details ,'$.metalRates.J.ratePerUnit') as [Gold Rate],\r\n"
				+ "JSON_VALUE(st.metal_rate_details ,'$.metalRates.L.ratePerUnit') as [Platinum Rate],\r\n"
				+ "JSON_VALUE(st.metal_rate_details ,'$.metalRates.P.ratePerUnit') as [Silver Rate],\r\n"
				+ "CASE WHEN ged.bin_code='TEPSALE' then 'Yes'\r\n"
				+ "	ELSE 'No'\r\n"
				+ "END as [Saleable],\r\n"
				+ "ged.final_value as [Exchange Value],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.refundDeductionAmount') as [REFUND DEDUCTION AMOUNT],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.refundDeductionPercent') as [REFUND DEDUCTION %],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.discountRecovered') as [DISCOUNT RECOVERED],\r\n"
				+ "CAST(JSON_VALUE(ged.price_details,'$.deductionAmount') as float) as [DEDUCTION AMOUNT],\r\n"
				+ "CASE WHEN JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[0].metalTypeCode')='J' THEN \r\n"
				+ "JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[0].metalValue')\r\n"
				+ "ELSE ''\r\n"
				+ "END as [Gold Value],\r\n"
				+ "\r\n"
				+ "CAST(JSON_VALUE(ged.price_details,'$.stonePriceDetails.preDiscountValue') as decimal(16,3)) as [Stone Value],\r\n"
				+ "\r\n"
				+ "CASE WHEN JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[0].metalTypeCode')='L' THEN\r\n"
				+ "	JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[0].metalValue')\r\n"
				+ "	WHEN JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[1].metalTypeCode')='L' THEN\r\n"
				+ "	JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[1].metalValue')\r\n"
				+ "ELSE ''\r\n"
				+ "END as [Platinum Value],\r\n"
				+ "\r\n"
				+ "CASE WHEN JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[0].metalTypeCode')='P' THEN\r\n"
				+ "	JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[0].metalValue')\r\n"
				+ "	WHEN JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[1].metalTypeCode')='P' THEN\r\n"
				+ "	JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[1].metalValue')\r\n"
				+ "	WHEN JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[2].metalTypeCode')='P' THEN\r\n"
				+ "	JSON_VALUE(ged.price_details,'$.metalPriceDetails.metalPrices[2].metalValue')\r\n"
				+ "ELSE ''\r\n"
				+ "END as [Silver Value],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.stonePriceDetails.numberOfStones') as [TOTAL NO. OF STONES],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.stonePriceDetails.stoneWeight') as [STONE WT],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.materialDetails.materialWeight') as [OTHER MATERIAL WT.],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.netWeight') as [NET WEIGHT],\r\n"
				+ "\r\n"
				+ "CASE WHEN ged.cash_memo_details_id IS NOT NULL THEN\r\n"
				+ "	oldCashMemo.location_code \r\n"
				+ "ELSE '' END as [BILLED LOCATION CODE],\r\n"
				+ "\r\n"
				+ "CASE WHEN ged.cash_memo_details_id IS NOT NULL THEN\r\n"
				+ "	oldCashMemo.doc_no \r\n"
				+ "ELSE NULL END as [CASH MEMO NO],\r\n"
				+ "\r\n"
				+ "CASE WHEN ged.cash_memo_details_id IS NOT NULL THEN\r\n"
				+ "	FORMAT(CAST(oldCashMemo.doc_date as DATE),'dd/MM/yyyy') \r\n"
				+ "ELSE NULL END as [CASH MEMO DATE],\r\n"
				+ "\r\n"
				+ "CASE WHEN ged.cash_memo_details_id IS NOT NULL THEN\r\n"
				+ "	oldCashMemo.fiscal_year \r\n"
				+ "ELSE NULL END as [CASH MEMO FISCAL YEAR],\r\n"
				+ "\r\n"
				+ "CASE WHEN ged.cash_memo_details_id IS NOT NULL THEN\r\n"
				+ "	oldCashMemo.lot_number \r\n"
				+ "ELSE '' END as [REF LOT NUMBER],\r\n"
				+ "\r\n"
				+ "CASE WHEN ged.cash_memo_details_id IS NOT NULL THEN\r\n"
				+ "	oldCashMemo.item_code \r\n"
				+ "ELSE '' END as [ORIGINAL ITEM CODE],\r\n"
				+ "\r\n"
				+ "ge.reason as [Remarks]\r\n"
				+ "from sales_transaction st\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "inner join credit_note cn on cn.sales_txn_id=st.id\r\n"
				+ "inner join customer_transaction ct on ct.id=st.id\r\n"
				+ "inner join goods_exchange_details ged on ged.goods_exchange_id=st.id\r\n"
				+ "inner join item_master im on im.item_code=ged.item_code\r\n"
				+ "inner join product_group_master pgm on pgm.product_group_code=im.product_group_code\r\n"
				+ "inner join goods_exchange ge on ge.id=ged.goods_exchange_id\r\n"
				+ "left join(select cmd.id,st1.location_code,st1.doc_no,st1.doc_date,st1.fiscal_year,cmd.lot_number,cmd.item_code from sales_transaction st1\r\n"
				+ "	inner join cash_memo cm on cm.id=st1.id\r\n"
				+ "	inner join cash_memo_details cmd on cmd.cash_memo_id=cm.id) oldCashMemo on oldCashMemo.id=ged.cash_memo_details_id\r\n"
				+ "where st.txn_type='TEP' and st.status NOT IN('DELETED')";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
		//System.exit(1);
		//return "select report_name as reportname, access_type as AccessType from report_master";
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		TEPIssueRequestDto TEPIssueRequestDto= (TEPIssueRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(TEPIssueRequestDto.getFromDate())
				&& StringUtils.isEmpty(TEPIssueRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(TEPIssueRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(TEPIssueRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(TEPIssueRequestDto, query);
		if (TEPIssueRequestDto.getTEPIssueCustomRequestDto() != null) {
			validateCustomInputAndAppend(TEPIssueRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(TEPIssueRequestDto TEPIssueRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(TEPIssueRequestDto TEPIssueRequestDto, StringBuilder query) {
		
		
		if (TEPIssueRequestDto.getSubRegionCode() != null && !TEPIssueRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(TEPIssueRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(TEPIssueRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + TEPIssueRequestDto.getStateId()).append("'");
		}
		if (TEPIssueRequestDto.getTownId() != null && !TEPIssueRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(TEPIssueRequestDto.getTownId())).append(")");
		}
		if (TEPIssueRequestDto.getLocationCode() != null && !TEPIssueRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(TEPIssueRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(TEPIssueRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + TEPIssueRequestDto.getCountryId()).append("'");
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
		
		TEPIssueRequestDto TEPIssueRequestDto = (TEPIssueRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, TEPIssueRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			TEPIssueCustomRequestDto TEPIssueCustomRequestDto = new TEPIssueCustomRequestDto();
			TEPIssueCustomRequestDto.validate(reportRequestDto.getCustomFields());
			TEPIssueCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), TEPIssueCustomRequestDto.class);
			TEPIssueRequestDto.setTEPIssueCustomRequestDto(TEPIssueCustomRequestDto);
		}
		
		return TEPIssueRequestDto;
	}
	
	

}
