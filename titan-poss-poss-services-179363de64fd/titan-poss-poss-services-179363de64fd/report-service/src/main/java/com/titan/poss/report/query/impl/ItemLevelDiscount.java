package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.ItemLevelDiscountCustomRequestDto;
import com.titan.poss.report.dto.request.json.ItemLevelDiscountRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("ItemLevelDiscount")
public class ItemLevelDiscount extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public ItemLevelDiscount(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("NEW_ITEM_LEVEL_DISCOUNT", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		ItemLevelDiscountRequestDto itemLevelDiscountRequestDto=(ItemLevelDiscountRequestDto) setCustomInput(reportRequestDto);
		
		StringBuilder appendWhereClause = appendQuery(itemLevelDiscountRequestDto);
		

		String select="select st.location_code as [Locationcode],\r\n"
				+ "bmv.sub_region_code as [Region],\r\n"
				+ "bmv.owner_type as [Level],\r\n"
				+ "bmv.brand_code as [Brand],\r\n"
				+ "st.doc_no as [CMNo],\r\n"
				+ "FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [CMDate],\r\n"
				+ "cmd.item_code as [ItemCode],\r\n"
				+ "cmd.lot_number as [Lotnumber],\r\n"
				+ "CAST(im.karat as INT) as [Karatage], \r\n"
				+ "cmd.product_group_code as [cfacode],\r\n"
				+ "pgm.description as [cfadescription], \r\n"
				+ "cmd.total_quantity as [Quantity], \r\n"
				+ "cmd.inventory_std_weight as [GrossWeight],\r\n"
				+ "JSON_VALUE(st.metal_rate_details ,'$.metalRates.J.ratePerUnit') as [GoldRate],\r\n"
				+ "(cmd.total_value+cmd.total_tax) as [TotalPrediscounttotalvalue],\r\n"
				+ "CASE WHEN JSON_VALUE(cmd.price_details,'$.metalPriceDetails.metalPrices[0].metalTypeCode')='J' THEN \r\n"
				+ "JSON_VALUE(cmd.price_details,'$.metalPriceDetails.metalPrices[0].metalValue')\r\n"
				+ "ELSE ''\r\n"
				+ "END as [TotalGoldPrice],\r\n"
				+ "JSON_VALUE(cmd.price_details,'$.stonePriceDetails.preDiscountValue') as [TotalStonevalue], \r\n"
				+ "JSON_VALUE(cmd.price_details,'$.makingChargeDetails.preDiscountValue') as [TotalMakingcharges],\r\n"
				+ "cmd.total_discount as [TotalDiscount],\r\n"
				+ "cmd.total_tax as[tax], \r\n"
				+ "cmd.final_value as [TotalInvoiceValue],\r\n"
				+ "discHeaders.discCodes as [ItemLevelDiscountCode],\r\n"
				+ "discHeadersBill.discCodes as [BillLevelDiscountCode],\r\n"
				+ "discPer.discPercentage as [ItemLevelDiscountPrecentage],\r\n"
				+ "discValues.dv as [Itemleveldicount],\r\n"
				+ "billDisc.dv as [TotalBillleveldiscount],\r\n"
				+ "0 as [GRFDiscount], \r\n"
				+ "ghsDisc.dv as [GHSDiscount],\r\n"
				+ "empowerDisc.dv as [EmpowermentDiscount],\r\n"
				+ "encDisc.dv as [anuttaradiscount],\r\n"
				+ "0 as [OtherBillleveldiscount], \r\n"
				+ "st.remarks as [Remarks], \r\n"
				+ "ct.customer_id as [CustomerNo],\r\n"
				+ "ct.customer_name as [CustomerName],\r\n"
				+ "NULL as [LoyaltyNo], NULL as [TempULPID],\r\n"
				+ "ct.ulp_id as [ULPMembershipID], \r\n"
				+ "CASE WHEN empDisc.dv IS NOT NULL THEN 'TRUE' ELSE 'FALSE' END as [IsEmployeeDiscount],\r\n"
				+ "NULL as [vendercode],\r\n"
				+ "NULL as [EmpcouponNo],\r\n"
				+ "gepDisc.dv as [GEPExchangeDiscount],\r\n"
				+ "ghsDisc.dv as [GHSVoucherDiscount],\r\n"
				+ "NULL as [DiscountGroup]\r\n"
				+ "from sales_transaction st\r\n"
				+ "inner join cash_memo cm on st.id=cm.id \r\n"
				+ "inner join cash_memo_details cmd on cmd.cash_memo_id=cm.id\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "left outer join item_master im on im.item_code=cmd.item_code\r\n"
				+ "left outer join(\r\n"
				+ "select distinct did1.item_id, STUFF(( SELECT ' / ' + a.discount_code FROM   \r\n"
				+ "	(select did.item_id,dd.discount_code,\r\n"
				+ "	\r\n"
				+ "		CASE WHEN did.discount_value=JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[0].discountValue') then \r\n"
				+ "					JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[0].discountPercent')\r\n"
				+ "			WHEN did.discount_value=JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[1].discountValue') then \r\n"
				+ "					JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[1].discountPercent')\r\n"
				+ "			WHEN did.discount_value=JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[3].discountValue') then \r\n"
				+ "					JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[3].discountPercent')\r\n"
				+ "		END as [DC%]\r\n"
				+ "	\r\n"
				+ "	from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='ITEM_LEVEL') a where a.item_id=did1.item_id\r\n"
				+ "    FOR XML PATH('')\r\n"
				+ "    ), 1, 2, '') AS discCodes\r\n"
				+ "	from discount_item_details did1 inner join discount_details dd1 on dd1.id=did1.discount_details_id where dd1.applicable_level='ITEM_LEVEL'\r\n"
				+ ")discHeaders on discHeaders.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "select distinct did1.item_id, STUFF(( SELECT ' / ' + a.[DC%] FROM\r\n"
				+ "	(select did.item_id,dd.discount_code,\r\n"
				+ "	\r\n"
				+ "		CASE WHEN did.discount_value=JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[0].discountValue') then \r\n"
				+ "					JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[0].discountPercent')\r\n"
				+ "			WHEN did.discount_value=JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[1].discountValue') then \r\n"
				+ "					JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[1].discountPercent')\r\n"
				+ "			WHEN did.discount_value=JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[3].discountValue') then \r\n"
				+ "					JSON_VALUE(did.discount_value_details,'$.data.discountValueDetails[3].discountPercent')\r\n"
				+ "		END as [DC%]\r\n"
				+ "	\r\n"
				+ "	from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='ITEM_LEVEL') a where a.item_id=did1.item_id\r\n"
				+ "    FOR XML PATH('')\r\n"
				+ "    ), 1, 2, '') AS discPercentage\r\n"
				+ "	from discount_item_details did1 inner join discount_details dd1 on dd1.id=did1.discount_details_id where dd1.applicable_level='ITEM_LEVEL'\r\n"
				+ ")discPer on discPer.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "select distinct did1.item_id, STUFF(( SELECT ' / ' + a.discount_code FROM\r\n"
				+ "	(select did.item_id,dd.discount_code from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='BILL_LEVEL') a where a.item_id=did1.item_id\r\n"
				+ "    FOR XML PATH('')\r\n"
				+ "    ), 1, 2, '') AS discCodes\r\n"
				+ "	from discount_item_details did1 inner join discount_details dd1 on dd1.id=did1.discount_details_id where dd1.applicable_level='BILL_LEVEL'\r\n"
				+ ")discHeadersBill on discHeadersBill.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='ITEM_LEVEL' \r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ")discValues on discValues.sales_txn_id=st.id and discValues.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='BILL_LEVEL' \r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") billDisc on billDisc.sales_txn_id=st.id and billDisc.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id \r\n"
				+ "	where dd.discount_type IN ('SYSTEM_DISCOUNT_GHS_BONUS','RIVAAH_ASHIRWAAD_DISCOUNT')\r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") ghsDisc on ghsDisc.sales_txn_id=st.id and ghsDisc.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id \r\n"
				+ "	where dd.discount_type IN ('EMPOWERMENT_DISCOUNT')\r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") empowerDisc on empowerDisc.sales_txn_id=st.id and empowerDisc.item_id=cmd.id\r\n"
				+ "left outer join customer_transaction ct on ct.id=st.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id \r\n"
				+ "	where dd.discount_type IN ('EMPLOYEE_DISCOUNT')\r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ")empDisc on empDisc.sales_txn_id=st.id and empDisc.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id \r\n"
				+ "	where dd.discount_type IN ('SYSTEM_DISCOUNT_GEP_PURITY','KARAT_EXCHANGE_OFFER_DISCOUNT')\r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") gepDisc on gepDisc.sales_txn_id=st.id and gepDisc.item_id=cmd.id\r\n"
				+ "left outer join(\r\n"
				+ "	select dd.sales_txn_id,did.item_id,sum(did.discount_value) as dv from discount_details dd \r\n"
				+ "	inner join discount_item_details did on did.discount_details_id=dd.id and dd.applicable_level='ITEM_LEVEL' \r\n"
				+ "	where dd.discount_type IN ('ULP_DISCOUNT_ANNIVERSARY','ULP_DISCOUNT_BIRTHDAY','ULP_DISCOUNT_SPOUSE_BIRTHDAY')\r\n"
				+ "	group by dd.sales_txn_id,did.item_id\r\n"
				+ ") encDisc on encDisc.sales_txn_id=st.id and encDisc.item_id=cmd.id\r\n"
				+ "left outer join product_group_master pgm on pgm.product_group_code=cmd.product_group_code\r\n"
				+ "where st.txn_type='CM' and st.status='CONFIRMED'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		ItemLevelDiscountRequestDto itemLevelDiscountRequestDto= (ItemLevelDiscountRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(itemLevelDiscountRequestDto.getFromDate())
				&& StringUtils.isEmpty(itemLevelDiscountRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(itemLevelDiscountRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(itemLevelDiscountRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(itemLevelDiscountRequestDto, query);
		if (itemLevelDiscountRequestDto.getItemLevelDiscountCustomRequestDto() != null) {
			validateCustomInputAndAppend(itemLevelDiscountRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(ItemLevelDiscountRequestDto itemLevelDiscountRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(ItemLevelDiscountRequestDto itemLevelDiscountRequestDto, StringBuilder query) {
		
		
		if (itemLevelDiscountRequestDto.getSubRegionCode() != null && !itemLevelDiscountRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(itemLevelDiscountRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(itemLevelDiscountRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + itemLevelDiscountRequestDto.getStateId()).append("'");
		}
		if (itemLevelDiscountRequestDto.getTownId() != null && !itemLevelDiscountRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(itemLevelDiscountRequestDto.getTownId())).append(")");
		}
		if (itemLevelDiscountRequestDto.getLocationCode() != null && !itemLevelDiscountRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(itemLevelDiscountRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(itemLevelDiscountRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + itemLevelDiscountRequestDto.getCountryId()).append("'");
		}
		query.append(" order by st.location_code,st.doc_date");
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
		
		ItemLevelDiscountRequestDto itemLevelDiscountRequestDto = (ItemLevelDiscountRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, ItemLevelDiscountRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			ItemLevelDiscountCustomRequestDto itemLevelDiscountCustomRequestDto = new ItemLevelDiscountCustomRequestDto();
			itemLevelDiscountCustomRequestDto.validate(reportRequestDto.getCustomFields());
			itemLevelDiscountCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), ItemLevelDiscountCustomRequestDto.class);
			itemLevelDiscountRequestDto.setItemLevelDiscountCustomRequestDto(itemLevelDiscountCustomRequestDto);
		}
		
		return itemLevelDiscountRequestDto;
	}
	
	

}
