package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.CashMemoPriceBandCustomRequestDto;
import com.titan.poss.report.dto.request.json.CashMemoPriceBandRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("CashMemoPriceBand")
public class CashMemoPriceBand extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public CashMemoPriceBand(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("CASH_MEMO_WISE_TOTAL_PRICE_BAND", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto=(CashMemoPriceBandRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(cashMemoPriceBandRequestDto);
		StringBuilder appendWhereClause1 = appendQuery1(cashMemoPriceBandRequestDto);
		
		String selectSales="select st.location_code as [BTQCode], bmv.town_name+'-'+st.location_code as [Location],bmv.owner_type as [Level],\r\n"
				+ "bmv.sub_region_code as [Region],bmv.state_name as [State], st.doc_no [DocNo], FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [Docdate],\r\n"
				+ "FORMAT(st.doc_date,'yyyyMM') as [YearMonth], bmv.town_name as [City], pgm.description as [CFAProduct], pcm.description as [Category], \r\n"
				+ "cmd.item_code as [ItemCode], CAST(im.karat as INT) as [karatage], im.complexity_code as [Complexity],\r\n"
				+ "CASE WHEN ((cmd.total_value+cmd.total_tax)/1000) < 0 THEN '<0'\r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 0 AND  ((cmd.total_value+cmd.total_tax)/1000) <= 10 THEN '0-10' \r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 10 AND  ((cmd.total_value+cmd.total_tax)/1000) <= 20 THEN '10-20' \r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 20 AND  ((cmd.total_value+cmd.total_tax)/1000) <= 35 THEN '20-35'	 \r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 35 AND  ((cmd.total_value+cmd.total_tax)/1000) <= 50 THEN '35-50'\r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 50 AND  ((cmd.total_value+cmd.total_tax)/1000) <= 75 THEN '50-75'\r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 75 AND  ((cmd.total_value+cmd.total_tax)/1000) <= 100 THEN '75-100'\r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 100 AND  ((cmd.total_value+cmd.total_tax)/1000) <= 150 THEN '100-150'\r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 150 AND  ((cmd.total_value+cmd.total_tax)/1000) <= 200 THEN '150-200'\r\n"
				+ "	 WHEN ((cmd.total_value+cmd.total_tax)/1000) > 200 THEN '>200'\r\n"
				+ "END as [PriceBand],\r\n"
				+ "cmd.total_quantity as [Qty],cmd.inventory_std_weight as [Wt], cmd.final_value as [Value],\r\n"
				+ "(cmd.total_value+cmd.total_tax) as [PreDiscountValue],  CAST(JSON_VALUE(cmd.price_details,'$.makingChargeDetails.preDiscountValue') as float) as [MakingCharges],\r\n"
				+ "CAST(JSON_VALUE(cmd.price_details,'$.stonePriceDetails.preDiscountValue') as float) as [StoneValue], \r\n"
				+ "CASE WHEN JSON_VALUE(cmd.price_details,'$.metalPriceDetails.metalPrices[0].metalTypeCode')='J' THEN \r\n"
				+ "CAST(JSON_VALUE(cmd.price_details,'$.metalPriceDetails.metalPrices[0].metalValue') as float)\r\n"
				+ "ELSE ''\r\n"
				+ "END as [Goldprice],									  \r\n"
				+ "cmd.lot_number as [Lotnumber],cmd.total_tax as [Tax],\r\n"
				+ "CAST(billDisc.dv as float) as [Discount], bmv.brand_code as [brand], cmd.product_group_code as [cfaproductcode], ct.customer_id as [customerno], \r\n"
				+ "(cmd.inventory_weight-ISNULL(CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.stoneWeight') as float),0)-ISNULL(CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.diamondWeight') as float),0)) as [NetWt],\r\n"
				+ "grn.doc_no as [GRnno],NULL as [loyaltyno],ct.ulp_id as [encircleno],\r\n"
				+ " ISNULL(itemDisc.dv,0)-ISNULL(encDisc.dv,0)  as [itemleveldicount],\r\n"
				+ " NULL as [tempencirlce],cm.occasion_name as [OccasionName],encDisc.dv as [encirclediscount],\r\n"
				+ "CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.stoneWeight') as float) as [stoneweight],\r\n"
				+ "CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.diamondWeight') as float) as [DiamondWeight],\r\n"
				+ "JSON_VALUE(st.metal_rate_details,'$.metalRates.J.ratePerUnit') as [goldrate],\r\n"
				+ "CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.goldWeight') as float) as [goldweight]\r\n"
				+ "from sales_transaction st \r\n"
				+ "inner join cash_memo cm on cm.id=st.id\r\n"
				+ "inner join cash_memo_details cmd on cmd.cash_memo_id=cm.id\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "left outer join product_group_master pgm on pgm.product_group_code=cmd.product_group_code\r\n"
				+ "left outer join product_category_master pcm on pcm.product_category_code=cmd.product_category_code\r\n"
				+ "inner join item_master im on im.item_code=cmd.item_code\r\n"
				+ "left outer join customer_transaction ct on ct.id=st.id\r\n"
				+ "left outer join (\r\n"
				+ "	select rt.doc_no,ged.cash_memo_details_id from refund_transaction rt\r\n"
				+ "	inner join goods_return_details ged on rt.id=ged.goods_return_id\r\n"
				+ "	where rt.status='CONFIRMED'\r\n"
				+ "	) grn on grn.cash_memo_details_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details_sales dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='BILL_LEVEL' \r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") billDisc on billDisc.sales_txn_id=st.id and billDisc.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details_sales dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='ITEM_LEVEL' \r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") itemDisc on itemDisc.sales_txn_id=st.id and itemDisc.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details_sales dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='ITEM_LEVEL' \r\n"
				+ "	where dd.discount_type IN ('ULP_DISCOUNT_ANNIVERSARY','ULP_DISCOUNT_BIRTHDAY','ULP_DISCOUNT_SPOUSE_BIRTHDAY')\r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") encDisc on encDisc.sales_txn_id=st.id and encDisc.item_id=cmd.id\r\n"
				+ "where st.txn_type='CM' and st.status='CONFIRMED' and st.txn_source IS NULL";
		String sales= selectSales+""+ appendWhereClause;
		String selectGRN="select rt.location_code, bmv.town_name+'-'+rt.location_code,\r\n"
				+ "bmv.owner_type,bmv.sub_region_code,bmv.state_name, rt.doc_no,FORMAT(CAST(rt.doc_date as DATE),'dd/MM/yyyy'),\r\n"
				+ "FORMAT(rt.doc_date,'yyyyMM'),bmv.town_name,pgm.description, pcm.description, grd.item_code,CAST(im.karat as INT),im.complexity_code,\r\n"
				+ "CASE WHEN (((cmd.total_value+cmd.total_tax)*-1)/1000) < 0 THEN '<=-1' END,\r\n"
				+ "-grd.total_quantity, -cmd.inventory_std_weight, -grd.final_value, -(cmd.total_value+cmd.total_tax),\r\n"
				+ " -CAST(JSON_VALUE(cmd.price_details,'$.makingChargeDetails.preDiscountValue') as float),\r\n"
				+ " -CAST(JSON_VALUE(cmd.price_details,'$.stonePriceDetails.preDiscountValue') as float),\r\n"
				+ " CASE WHEN JSON_VALUE(cmd.price_details,'$.metalPriceDetails.metalPrices[0].metalTypeCode')='J' THEN \r\n"
				+ "-CAST(JSON_VALUE(cmd.price_details,'$.metalPriceDetails.metalPrices[0].metalValue') as float)\r\n"
				+ "ELSE ''\r\n"
				+ "END, cmd.lot_number,-cmd.total_tax,\r\n"
				+ "CAST(billDisc.dv as float), bmv.brand_code, cmd.product_group_code, ct.customer_id, \r\n"
				+ "-(cmd.inventory_weight-ISNULL(CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.stoneWeight') as float),0)-ISNULL(CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.diamondWeight') as float),0)),\r\n"
				+ "grn.doc_no,NULL,ct.ulp_id,\r\n"
				+ " ISNULL(itemDisc.dv,0)-ISNULL(encDisc.dv,0),\r\n"
				+ " NULL,cm.occasion_name,encDisc.dv,\r\n"
				+ "CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.stoneWeight') as float),\r\n"
				+ "CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.diamondWeight') as float),\r\n"
				+ "JSON_VALUE(st.metal_rate_details,'$.metalRates.J.ratePerUnit'),\r\n"
				+ "-CAST(JSON_VALUE(cmd.measured_weight_details,'$.data.goldWeight') as float)\r\n"
				+ "from refund_transaction rt\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=rt.location_code\r\n"
				+ "inner join sales_transaction st on st.id=rt.ref_sales_id\r\n"
				+ "inner join cash_memo cm on cm.id=st.id\r\n"
				+ "inner join cash_memo_details cmd on cmd.cash_memo_id=st.id\r\n"
				+ "inner join goods_return_details grd on grd.cash_memo_details_id=cmd.id\r\n"
				+ "inner join customer_transaction ct on ct.id=st.id\r\n"
				+ "left outer join product_group_master pgm on pgm.product_group_code=cmd.product_group_code\r\n"
				+ "left outer join product_category_master pcm on pcm.product_category_code=cmd.product_category_code\r\n"
				+ "inner join item_master im on im.item_code=cmd.item_code\r\n"
				+ "left outer join (\r\n"
				+ "	select rt.doc_no,ged.cash_memo_details_id from refund_transaction rt\r\n"
				+ "	inner join goods_return_details ged on rt.id=ged.goods_return_id\r\n"
				+ "	where rt.status='CONFIRMED'\r\n"
				+ "	) grn on grn.cash_memo_details_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details_sales dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='BILL_LEVEL' \r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") billDisc on billDisc.sales_txn_id=st.id and billDisc.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details_sales dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='ITEM_LEVEL' \r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") itemDisc on itemDisc.sales_txn_id=st.id and itemDisc.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details_sales dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='ITEM_LEVEL' \r\n"
				+ "	where dd.discount_type IN ('ULP_DISCOUNT_ANNIVERSARY','ULP_DISCOUNT_BIRTHDAY','ULP_DISCOUNT_SPOUSE_BIRTHDAY')\r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") encDisc on encDisc.sales_txn_id=st.id and encDisc.item_id=cmd.id\r\n"
				+ "where rt.status='CONFIRMED' and rt.txn_type='GRN'";
		String grn=selectGRN+""+appendWhereClause1;
		String finalQuery=sales+" UNION ALL "+grn;
		
		System.out.println(finalQuery);
		
		return  String.format("%s",finalQuery);
		
	
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto= (CashMemoPriceBandRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(cashMemoPriceBandRequestDto.getFromDate())
				&& StringUtils.isEmpty(cashMemoPriceBandRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(cashMemoPriceBandRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(cashMemoPriceBandRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(cashMemoPriceBandRequestDto, query);
		if (cashMemoPriceBandRequestDto.getCashMemoPriceBandCustomRequestDto() != null) {
			validateCustomInputAndAppend(cashMemoPriceBandRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto, StringBuilder query) {
		
		
		if (cashMemoPriceBandRequestDto.getSubRegionCode() != null && !cashMemoPriceBandRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(cashMemoPriceBandRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cashMemoPriceBandRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + cashMemoPriceBandRequestDto.getStateId()).append("'");
		}
		if (cashMemoPriceBandRequestDto.getTownId() != null && !cashMemoPriceBandRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(cashMemoPriceBandRequestDto.getTownId())).append(")");
		}
		if (cashMemoPriceBandRequestDto.getLocationCode() != null && !cashMemoPriceBandRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(cashMemoPriceBandRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cashMemoPriceBandRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + cashMemoPriceBandRequestDto.getCountryId()).append("'");
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
		
		CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto = (CashMemoPriceBandRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, CashMemoPriceBandRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CashMemoPriceBandCustomRequestDto cashMemoPriceBandCustomRequestDto = new CashMemoPriceBandCustomRequestDto();
			cashMemoPriceBandCustomRequestDto.validate(reportRequestDto.getCustomFields());
			cashMemoPriceBandCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CashMemoPriceBandCustomRequestDto.class);
			cashMemoPriceBandRequestDto.setCashMemoPriceBandCustomRequestDto(cashMemoPriceBandCustomRequestDto);
		}
		
		return cashMemoPriceBandRequestDto;
	}
	
	protected StringBuilder appendQuery1(ReportRequestDto reportRequestDto) {
		
		
		CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto= (CashMemoPriceBandRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(cashMemoPriceBandRequestDto.getFromDate())
				&& StringUtils.isEmpty(cashMemoPriceBandRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(cashMemoPriceBandRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(cashMemoPriceBandRequestDto.getToDate());
			query.append(" AND (rt.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields1(cashMemoPriceBandRequestDto, query);
		if (cashMemoPriceBandRequestDto.getCashMemoPriceBandCustomRequestDto() != null) {
			validateCustomInputAndAppend1(cashMemoPriceBandRequestDto, query);
		}
		query.append(" order by [BTQCode], [Docdate]");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend1(CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields1(CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto, StringBuilder query) {
		
		
		if (cashMemoPriceBandRequestDto.getSubRegionCode() != null && !cashMemoPriceBandRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(cashMemoPriceBandRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cashMemoPriceBandRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + cashMemoPriceBandRequestDto.getStateId()).append("'");
		}
		if (cashMemoPriceBandRequestDto.getTownId() != null && !cashMemoPriceBandRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(cashMemoPriceBandRequestDto.getTownId())).append(")");
		}
		if (cashMemoPriceBandRequestDto.getLocationCode() != null && !cashMemoPriceBandRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(cashMemoPriceBandRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cashMemoPriceBandRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + cashMemoPriceBandRequestDto.getCountryId()).append("'");
		}

		return query;
	}
	protected ReportRequestDto setCustomInput1(ReportRequestDto reportRequestDto) {
		
		CashMemoPriceBandRequestDto cashMemoPriceBandRequestDto = (CashMemoPriceBandRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, CashMemoPriceBandRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CashMemoPriceBandCustomRequestDto cashMemoPriceBandCustomRequestDto = new CashMemoPriceBandCustomRequestDto();
			cashMemoPriceBandCustomRequestDto.validate(reportRequestDto.getCustomFields());
			cashMemoPriceBandCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CashMemoPriceBandCustomRequestDto.class);
			cashMemoPriceBandRequestDto.setCashMemoPriceBandCustomRequestDto(cashMemoPriceBandCustomRequestDto);
		}
		
		return cashMemoPriceBandRequestDto;
	}
	
	
	

}
