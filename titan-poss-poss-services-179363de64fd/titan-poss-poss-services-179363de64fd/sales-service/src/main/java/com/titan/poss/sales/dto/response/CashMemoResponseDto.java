/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dto.CashMemoUpdateDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for cash memo response.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CashMemoResponseDto extends CashMemoUpdateDto {

	private String id;

	private String status;

	private String refTxnId;

	private String refTxnType;

	private Integer docNo;

	private Date docDate;

	private Short fiscalYear;

	private Date firstHoldTime;

	private Date lastHoldTime;

	private BigDecimal roundingVariance;

	private String employeeCode;

	private String txnType;

	private String subTxnType;

	private Date confirmedTime;

	private ManualBillTxnDetailsDto manualBillDetails;

	private TaxDetailsListDto taxDetails;

	private String currencyCode;

	private String weightUnit;

	private String manualBillId;

	private JsonData discountTxnDetails;

	private String locationCode;

	private Date invokeTime;

	private Integer invokeCount;

	private List<Integer> creditNotes;

	private String customerDocDetails;

	private String refSubTxnType;

	private Boolean isRivaah;

	private Integer refDocNo;
	private Short refFiscalYear;

	private String cancelTxnId;
	private String cancelRemarks;
	private String reasonForCancellation;
	private Boolean isIGST;
	private String custTaxNo;
	private String custTaxNoOld;
	private String txnSource;
	
	private List<String> cndocNos;
	private Map<String, Integer> cnDocNoMap;

}
