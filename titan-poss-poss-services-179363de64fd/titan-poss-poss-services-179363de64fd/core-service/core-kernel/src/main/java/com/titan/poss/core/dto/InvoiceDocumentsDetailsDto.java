package com.titan.poss.core.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class InvoiceDocumentsDetailsDto {

	private String transactionId;
	private Integer customerId;
	private String status;
	private String documentName;
	private String txnType;
	private Integer docNo;
	private String locationCode;
	private Date docDate; 
	private String subTxnType;
	private Short fiscalYear;
	private String documentId;
	
}
