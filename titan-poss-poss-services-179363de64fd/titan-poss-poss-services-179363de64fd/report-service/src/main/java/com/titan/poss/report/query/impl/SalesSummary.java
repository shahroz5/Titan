package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.SalesSummaryRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("SalesSummary")
public class SalesSummary extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public SalesSummary(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("SALES_SUMMARY", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		//System.out.print("Cash deposit report - in");
		SalesSummaryRequestDto salesSummaryRequestDto=(SalesSummaryRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		
		String fromtoDateCM="";
		String fromtoDateGRN="";
		String location="";
		if (!(StringUtils.isEmpty(salesSummaryRequestDto.getFromDate())
				&& StringUtils.isEmpty(salesSummaryRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(salesSummaryRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(salesSummaryRequestDto.getToDate());
			fromtoDateCM=" st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate+"'";
			fromtoDateGRN=" rt.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate+"'";
		}
		if (salesSummaryRequestDto.getLocationCode() != null && !salesSummaryRequestDto.getLocationCode().isEmpty()) {
			location=" AND bmv.location_code in (" + formatListToInClause(salesSummaryRequestDto.getLocationCode()) +")";
		}
		

		String select="Select \r\n"
				+ "a.[Product Category] as [Product Category],\r\n"
				+ "SUM(a.Quantity) as [Quantity],\r\n"
				+ "sum(a.Weight) as [Weight],\r\n"
				+ "sum(a.[Total UCP]) as [Total UCP],\r\n"
				+ "sum(a.[Item Discount]) as [Item Discount],\r\n"
				+ "sum(a.[Net Value]) as [Net Value]\r\n"
				+ "From \r\n"
				+ " (\r\n"
				+ " select \r\n"
				+ " pgm.description as [Product Category],\r\n"
				+ " SUM(cmd.total_quantity) as [Quantity],\r\n"
				+ " SUM(cmd.inventory_std_weight) as [Weight], \r\n"
				+ " SUM(cmd.total_value + cmd.total_tax) as [Total UCP],\r\n"
				+ " SUM(-cmd.total_discount) as [Item Discount],\r\n"
				+ " SUM(((cmd.total_value + cmd.total_tax) - cmd.total_discount) + roundingvariancecalc.roundingvariance) as [Net Value]\r\n"
				+ " from sales_transaction st\r\n"
				+ " inner join reports.dbo.cash_memo cm on cm.id=st.id\r\n"
				+ " inner join reports.dbo.cash_memo_details cmd on cmd.cash_memo_id=st.id\r\n"
				+ " inner join reports.dbo.product_group_master pgm on pgm.product_group_code=cmd.product_group_code\r\n"
				+ " left outer join(	\r\n"
				+ "		select 	a.cmdid as cashmemodetailsid, CASE WHEN a.rn=1 THEN a.rv ELSE 0 END as roundingvariance, a.rn FROM  \r\n"
				+ "		(\r\n"
				+ "			select st.id stid,  cmd.id cmdid, cm.rounding_variance rv,\r\n"
				+ "			ROW_NUMBER() OVER(\r\n"
				+ "			PARTITION BY\r\n"
				+ "			st.id\r\n"
				+ "			ORDER BY\r\n"
				+ "			st.id\r\n"
				+ "			) as rn\r\n"
				+ "			from reports.dbo.sales_transaction st inner join\r\n"
				+ "			reports.dbo.cash_memo cm on st.id = cm.id inner join \r\n"
				+ "			reports.dbo.cash_memo_details CMD on cm.id = cmd.cash_memo_id\r\n"
				+ "			inner join reports.dbo.boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "			where "+ fromtoDateCM + location+"\r\n"
				+ "		)  a\r\n"
				+ ") roundingvariancecalc  on roundingvariancecalc.cashmemodetailsid=cmd.id\r\n"
				+ "inner join reports.dbo.boutique_master_view bmv on st.location_code=bmv.location_code\r\n"
				+ "WHERE\r\n"
				+ "NOT EXISTS (\r\n"
				+ "		SELECT 'x'\r\n"
				+ "		FROM refund_transaction RT  \r\n"
				+ "		WHERE ST.ID = RT.REF_SALES_ID AND RT.TXN_TYPE = 'CMCAN' AND RT.STATUS = 'CONFIRMED'\r\n"
				+ "		)\r\n"
				+ "AND ST.status not in('deleted','open') and st.txn_type='CM'	and\r\n"
				+ fromtoDateCM + location+"\r\n"
				+ "GROUP BY\r\n"
				+ "pgm.description\r\n"
				+ "\r\n"
				+ "UNION ALL\r\n"
				+ "\r\n"
				+ "SELECT \r\n"
				+ "	pgm.description\r\n"
				+ "	,SUM(-grd.total_quantity) \r\n"
				+ "	,SUM(-cmd.inventory_std_weight) \r\n"
				+ "	,SUM(-(cmd.total_value + cmd.total_tax)) \r\n"
				+ "	,SUM((cmd.total_discount)) Discount\r\n"
				+ "	,round((- SUM(grd.final_value) -SUM(0)), 0) \r\n"
				+ "FROM  reports.dbo.refund_transaction rt \r\n"
				+ "					inner join reports.dbo.boutique_master_view bmv on rt.location_code=bmv.location_code\r\n"
				+ "					inner join reports.dbo.goods_return_details grd on rt.id=grd.goods_return_id\r\n"
				+ "					inner join reports.dbo.item_master im on im.item_code=grd.item_code\r\n"
				+ "					inner join reports.dbo.product_group_master pgm on pgm.product_group_code=im.product_group_code\r\n"
				+ "					inner join reports.dbo.cash_memo_details cmd on cmd.id=grd.cash_memo_details_id\r\n"
				+ "WHERE rt.txn_type='GRN' and rt.status='CONFIRMED'\r\n"
				+ "and "+fromtoDateGRN + location+"\r\n"
				+ "GROUP BY \r\n"
				+ "pgm.description\r\n"
				+ ")  a\r\n"
				+ "GROUP BY \r\n"
				+ "a.[Product Category]\r\n"
				+ "\r\n"
				+ "UNION ALL\r\n"
				+ "\r\n"
				+ "select 'Total' Total,SUM(b.Quantity),SUM(b.Weight),SUM(b.[Total UCP]),SUM(b.[Item Discount]), SUM(b.[Net Value])\r\n"
				+ "from\r\n"
				+ "(\r\n"
				+ "Select \r\n"
				+ "a.[Product Category] as [Product Category],\r\n"
				+ "SUM(a.Quantity) as [Quantity],\r\n"
				+ "sum(a.Weight) as [Weight],\r\n"
				+ "sum(a.[Total UCP]) as [Total UCP],\r\n"
				+ "sum(a.[Item Discount]) as [Item Discount],\r\n"
				+ "sum(a.[Net Value]) as [Net Value]\r\n"
				+ "From \r\n"
				+ " (\r\n"
				+ " select \r\n"
				+ " pgm.description as [Product Category],\r\n"
				+ " SUM(cmd.total_quantity) as [Quantity],\r\n"
				+ " SUM(cmd.inventory_std_weight) as [Weight], \r\n"
				+ " SUM(cmd.total_value + cmd.total_tax) as [Total UCP],\r\n"
				+ " SUM(-cmd.total_discount) as [Item Discount],\r\n"
				+ " SUM(((cmd.total_value + cmd.total_tax) - cmd.total_discount) + roundingvariancecalc.roundingvariance) as [Net Value]\r\n"
				+ " from sales_transaction st\r\n"
				+ " inner join reports.dbo.cash_memo cm on cm.id=st.id\r\n"
				+ " inner join reports.dbo.cash_memo_details cmd on cmd.cash_memo_id=st.id\r\n"
				+ " inner join reports.dbo.product_group_master pgm on pgm.product_group_code=cmd.product_group_code\r\n"
				+ " left outer join(	\r\n"
				+ "		select 	a.cmdid as cashmemodetailsid, CASE WHEN a.rn=1 THEN a.rv ELSE 0 END as roundingvariance, a.rn FROM  \r\n"
				+ "		(\r\n"
				+ "			select st.id stid,  cmd.id cmdid, cm.rounding_variance rv,\r\n"
				+ "			ROW_NUMBER() OVER(\r\n"
				+ "			PARTITION BY\r\n"
				+ "			st.id\r\n"
				+ "			ORDER BY\r\n"
				+ "			st.id\r\n"
				+ "			) as rn\r\n"
				+ "			from reports.dbo.sales_transaction st inner join\r\n"
				+ "			reports.dbo.cash_memo cm on st.id = cm.id inner join \r\n"
				+ "			reports.dbo.cash_memo_details CMD on cm.id = cmd.cash_memo_id\r\n"
				+ "			inner join reports.dbo.boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "			where "+fromtoDateCM + location+"\r\n"
				+ "		)  a\r\n"
				+ ") roundingvariancecalc  on roundingvariancecalc.cashmemodetailsid=cmd.id\r\n"
				+ "inner join reports.dbo.boutique_master_view bmv on st.location_code=bmv.location_code\r\n"
				+ "WHERE\r\n"
				+ "NOT EXISTS (\r\n"
				+ "		SELECT 'x'\r\n"
				+ "		FROM refund_transaction RT  \r\n"
				+ "		WHERE ST.ID = RT.REF_SALES_ID AND RT.TXN_TYPE = 'CMCAN' AND RT.STATUS = 'CONFIRMED'\r\n"
				+ "		)\r\n"
				+ "AND ST.status not in('deleted','open') and st.txn_type='CM'	and\r\n"
				+ fromtoDateCM + location+"\r\n"
				+ "GROUP BY\r\n"
				+ "pgm.description\r\n"
				+ "\r\n"
				+ "UNION ALL\r\n"
				+ "\r\n"
				+ "SELECT \r\n"
				+ "	pgm.description\r\n"
				+ "	,SUM(-grd.total_quantity) \r\n"
				+ "	,SUM(-cmd.inventory_std_weight) \r\n"
				+ "	,SUM(-(cmd.total_value + cmd.total_tax)) \r\n"
				+ "	,SUM((cmd.total_discount)) Discount\r\n"
				+ "	,round((- SUM(grd.final_value) -SUM(0)), 0) \r\n"
				+ "FROM  reports.dbo.refund_transaction rt \r\n"
				+ "					inner join reports.dbo.boutique_master_view bmv on rt.location_code=bmv.location_code\r\n"
				+ "					inner join reports.dbo.goods_return_details grd on rt.id=grd.goods_return_id\r\n"
				+ "					inner join reports.dbo.item_master im on im.item_code=grd.item_code\r\n"
				+ "					inner join reports.dbo.product_group_master pgm on pgm.product_group_code=im.product_group_code\r\n"
				+ "					inner join reports.dbo.cash_memo_details cmd on cmd.id=grd.cash_memo_details_id\r\n"
				+ "WHERE rt.txn_type='GRN' and rt.status='CONFIRMED'\r\n"
				+ "and "+fromtoDateGRN + location+"\r\n"
				+ "GROUP BY \r\n"
				+ "pgm.description\r\n"
				+ ")  a\r\n"
				+ "GROUP BY \r\n"
				+ "a.[Product Category]\r\n"
				+ ")b";
		
		String s= select;
		System.out.println(s);
		
		return  String.format("%s", select);
		
		
		//System.exit(1);
		//return "select report_name as reportname, access_type as AccessType from report_master";
		
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
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stubx
		return null;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		return (SalesSummaryRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				SalesSummaryRequestDto.class);
	}
	
	

}
