/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class FileIntegrationConstants {

	public static final String MASTER_INGESTION_JOB = "masterIngestionJob";
	public static final String GV_INDENT_JOB = "gvIndentIngestionJob";
	public static final String GV_STATUS_JOB = "gvStatusIngestionJob";
	public static final String GV_REDEMPTION_JOB = "gvRedemptionJob";
	public static final String RETURN_INVOICE_JOB = "returnInvoiceJob";
	public static final String IBT_STN_JOB = "ibtStnJob";
	public static final String ITEM_MASTER_JOB = "Item_Master";
	public static final Integer ITEM_MASTER_COLUMN_COUNT = 62;
	public static final String STONE_MASTER_JOB = "Stone_Master";
	public static final Integer STONE_MASTER_COLUMN_COUNT = 14;
	public static final String PRICE_MASTER_JOB = "Price_Master";
	public static final Integer PRICE_MASTER_COLUMN_COUNT = 7;
	public static final String MATERIAL_MASTER_JOB = "Material_Master";
	public static final Integer MATERIAL_MASTER_COLUMN_COUNT = 14;
	public static final String ITEM_MATERIAL_MAPPING_JOB = "Item_Material_mapping";
	public static final Integer ITEM_MATERIAL_MAPPING_COLUMN_COUNT = 8;
	public static final String ITEM_STONE_MAPPING_JOB = "Item_Stone_Mapping";
	public static final Integer ITEM_STONE_MAPPING_COLUMN_COUNT = 8;
	public static final String NETCARROTS_JOB = "netcarrotsJob";
	public static final String TRANSACTION_DATE = "transactionDate";
	public static final String NC_CUSTOMER_TRANSACTION_JOB_NAME = "Nc_Customer_Transaction";
	public static final String NC_CUSTOMER_TRANSACTION_FILE_FORMAT = "JEW_TD";
	public static final String NC_MEMBER_DATA_JOB_NAME = "Nc_Member_Data";
	public static final String NC_MEMBER_DATA_FILE_FORMAT = "JEW_MD";
	public static final String NC_STORE_MASTER_JOB_NAME = "Nc_Store_Master";
	public static final String NC_STORE_MASTER_FILE_FORMAT = "JEW_SM";
	public static final String NC_TRANSACTION_DATA_JOB_NAME = "Nc_Transaction_Data";
	public static final String NC_TRANSACTION_DATA_FILE_FORMAT = "JEW_TD_NoOfRecords";
	public static final String GIFT_VOUCHER_INDENT_JOB = "Gift_Indent";
	public static final String GIFT_VOUCHER_INDENT_FILE_NAME = "giftIndentFileName";
	public static final String GIFT_VOUCHER_INDENT_FORMAT = "INDENT";
	public static final Integer GIFT_VOUCHER_INDENT_COLUMN_COUNT = 1;
	public static final String GIFT_VOUCHER_STATUS_JOB = "Gift_Status";
	public static final String GIFT_VOUCHER_STATUS_FILE_NAME = "giftStatusFileName";
	public static final String GIFT_VOUCHER_STATUS_FORMAT = "STATUS";
	public static final Integer GIFT_VOUCHER_STATUS_COLUMN_COUNT = 1;
	public static final String TEXT_EXTENSION = ".txt";
	public static final String FAILED = "FAILED";
	public static final String STN_JOB = "stnJob";
	public static final String BI_METAL_STUDDED_CFA_CODE = "B5";
	public static final String BI_METAL_PLAIN_CFA_CODE = "B6";
	public static final String ISSUED = "ISSUED";
	public static final String PUBLISHED = "PUBLISHED";
	public static final String ERP_USER = "ERPUser";
	public static final String IMPORT_SUCCESS_MSG = "Imported Succesfully";
	public static final String EXPORT_SUCCESS_MSG = "Exported Succesfully";
	public static final String FAILURE_MSG = "Failed";
	public static final String INVOICE_JOB = "invoiceJob";
	public static final Integer STN_HDR_COLUMN_COUNT = 39;
	public static final Integer STN_DTL_COLUMN_COUNT = 44;
	public static final Integer STN_LDTL_COLUMN_COUNT = 6;
	public static final Integer STN_MDTL_COLUMN_COUNT = 6;
	public static final Integer STN_CTRL_COLUMN_COUNT = 5;
	public static final Integer INVOICE_IHDR_COLUMN_COUNT = 16;
	public static final Integer INVOICE_IDTL_COLUMN_COUNT = 34;
	public static final Integer INVOICE_ISAC_COLUMN_COUNT = 17;
	public static final Integer INVOICE_ILDTL_COLUMN_COUNT = 6;
	public static final Integer INVOICE_IMDTL_COLUMN_COUNT = 6;
	public static final Integer INVOICE_ICTRL_COLUMN_COUNT = 5;
	public static final String HDR = "HDR";
	public static final String DTL = "DTL";
	public static final String LDTL = "LDTL";
	public static final String MDTL = "MDTL";
	public static final String CTRL = "CTRL";
	public static final String IHDR = "IHDR";
	public static final String IDTL = "IDTL";
	public static final String ISAC = "ISAC";
	public static final String ILDTL = "ILDTL";
	public static final String IMDTL = "IMDTL";
	public static final String ICTRL = "ICTRL";
	public static final String LOCATION_TYPE_CFA = "CFA";
	public static final String LOCATION_TYPE_FAC = "FAC";
	public static final String LOCATION_TYPE_BTQ = "BTQ";
	public static final String TRANSFER_TYPE_FAC_BTQ = "FAC_BTQ";
	public static final String TRANSFER_TYPE_CFA_BTQ = "CFA_BTQ";
	public static final String TRANSFER_TYPE_BTQ_CFA = "BTQ_CFA";
	public static final String TRANSFER_TYPE_BTQ_BTQ = "BTQ_BTQ";
	public static final String TRANSFER_TYPE_MER_BTQ = "MER_BTQ";
	public static final String WILL_BE_INJECTED = null;
	public static final String MERCHANDISE_CODE = "MER";
	public static final String APPROVED = "APPROVED";
	public static final String DD_MM_YY_DATE_FORMAT = "dd-MM-yy";
	public static final String DD_MM_YY_DATE_FORMAT2 = "ddMMyyyy";
	public static final String DD_MMM_YY_DATE_FORMAT = "ddMMMyy";
	public static final String DD_MMM_YY_DATE_FORMAT2 = "dd-MMM-yy";
	public static final String PATH_DELIMITTER = "/";
	public static final String FILE_BASE_FOLDER = "files.baseFolder";
	public static final String MANUAL_JOB = "manualJob";
	public static final String DOC_DATE = "doc_date";
	public static final String DOC_NO = "doc_no";
	public static final String CFA_CODE = "cfa_code";
	public static final String TOTAL_VALUE = "total_value";
	public static final String FISCAL_YEAR = "fiscal_year";
	public static final String REGION_CODE = "region_code";
	public static final String LOCATION_CODE = "location_code";
	public static final String TEMP_FOLDER = "temp.file.folder";
	public static final String COMPLETED = "COMPLETED";
	public static final String STOPPED = "STOPPED";
	public static final String NEW_LINE = "\r\n";
	public static final String BUSINESS_DAY_SQL = "(\r\n select a.location_code, a.business_date from sales.dbo.business_day_master a,\r\n"
			+ " [file].dbo.file_master_location_mapping b,[file].dbo.file_master c where a.location_code = b.location_code\r\n"
			+ " and a.business_date> b.last_business_date and a.status='CLOSED' and b.file_master_id = c.id and c.file_name \r\n"
			+ "= ? union select a.location_code, a.business_date from sales.dbo.business_day_master a where \r\n"
			+ "a.status='CLOSED' and a.location_code not in (select distinct(location_code) from [file].dbo.file_master_location_mapping \r\n"
			+ "where file_master_id = (Select id from [file].dbo.file_master fm where file_name =?))) z \r\n";
	
//	public static final String BUSINESS_DAY_SQL = "(\r\n select a.location_code, a.business_date from sales.dbo.business_day_master a, [file].dbo.file_master_location_mapping b,\r\n"
//			+ "[file].dbo.file_master c\r\n" + "where a.location_code = b.location_code \r\n"
//			+ "and a.business_date> b.last_business_date and a.status='CLOSED' and b.file_master_id = c.id and c.file_name = ?\r\n"
//			+ "union \r\n" + "select a.location_code, a.business_date from sales.dbo.business_day_master a \r\n"
//			+ "where a.status='CLOSED' and a.location_code not in (select distinct(location_code) \r\n"
//			+ "from [file].dbo.file_master_location_mapping where file_master_id = (Select id from [file].dbo.file_master fm where file_name =?))) z \r\n";

	public static final String DEBIT_NOTE_JOB = "debitNoteJob";
	public static final String DEBIT_NOTE_L3_JOB = "debitNoteL3Job";
	public static final String BOUTIQUE_SALES_JOB = "boutiqueSalesJob";
	public static final String BOUTIQUE_REVENUE_JOB = "boutiqueRevenueJob";
	public static final String CUSTOMER_ORDER_BIN = "CUSTOMERORDERBIN";
	public static final String TEP_AP_JOB = "tepApJob";
	public static final String GENERAL_LEDGER_JOB = "generalLedgerJob";
	public static final String REPORT_DECRYPT_JOB = "reportDecryptorJob";
	public static final String STOCK_INTERFACE_JOB = "stockInterfaceJob";
	public static final String TEP_TRANSACTION_JOB = "tepTransactionJob";
	public static final String STUDDED_SPLIT_JOB = "studdedSplitJob";
	public static final Integer STUDDED_SPLIT_HDR_COLUMN_COUNT = 7;
	public static final Integer STUDDED_SPLIT_DTL_COLUMN_COUNT = 20;
	public static final Integer STUDDED_SPLIT_LDTL_COLUMN_COUNT = 7;
	public static final String RETRY_STUDDED_SPLIT_JOB = "retryStuddedSplitJob";

}
