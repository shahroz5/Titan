/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO to get transactions details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TransactionDetailsDto extends BaseTransactionDetailsDto {

	private String txnType;
	private Integer customerId;
	private String customerName;

	private Date firstHoldTime;
	private Date lastHoldTime;

	private String subTxnType;
	private String mobileNumber;

	private String paymentType;

	/**
	 * @param id
	 * @param transactionType
	 * @param docNo
	 * @param fiscalYear
	 * @param status
	 * @param locationCode
	 * @param docDate
	 * @param txnType
	 * @param customerId
	 * @param customerName
	 * @param firstHoldTime
	 * @param lastHoldTime
	 * @param subTxnType
	 * @param mobileNumber
	 */
	public TransactionDetailsDto(String id, String txnType, Integer docNo, Short fiscalYear, String status,
			String locationCode, Date docDate, Integer customerId, String customerName, Date firstHoldTime,
			Date lastHoldTime, String subTxnType, String mobileNumber) {
		super(id, null, docNo, fiscalYear, status, locationCode, docDate);
		this.txnType = txnType;
		this.customerId = customerId;
		this.customerName = customerName;
		this.firstHoldTime = firstHoldTime;
		this.lastHoldTime = lastHoldTime;
		this.subTxnType = subTxnType;
		this.mobileNumber = mobileNumber;
	}

	public TransactionDetailsDto(String id, String txnType, Integer docNo, Short fiscalYear, String status,
			String locationCode, Date docDate, Integer customerId, String customerName, Date firstHoldTime,
			Date lastHoldTime, String subTxnType, String mobileNumber, String paymentType) {
		super(id, null, docNo, fiscalYear, status, locationCode, docDate);
		this.txnType = txnType;
		this.customerId = customerId;
		this.customerName = customerName;
		this.firstHoldTime = firstHoldTime;
		this.lastHoldTime = lastHoldTime;
		this.subTxnType = subTxnType;
		this.mobileNumber = mobileNumber;
		this.paymentType = paymentType;
	}
}
