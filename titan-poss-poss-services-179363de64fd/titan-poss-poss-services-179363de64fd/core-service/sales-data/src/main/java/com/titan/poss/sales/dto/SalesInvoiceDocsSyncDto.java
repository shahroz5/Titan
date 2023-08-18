/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.SalesInvoiceDocumentsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class SalesInvoiceDocsSyncDto extends SyncableEntity {

	private String id;

	private String invoiceNumber;

	private String qrCodeValue;

	private String acknowledgementNo;

	private Date acknowledgementDate;

	private String referenceId;
	
	private String transactionType;

	public SalesInvoiceDocsSyncDto() {

	}

	public SalesInvoiceDocsSyncDto(SalesInvoiceDocumentsDao salesInvoiceDocs) {
		MapperUtil.getObjectMapping(salesInvoiceDocs, this);
	}

	
	public SalesInvoiceDocumentsDao getSalesInvoiceDocumentDao(SalesInvoiceDocsSyncDto salesInvoiceDocsSyncDto) {
		SalesInvoiceDocumentsDao salesInvoiceDocumentsDao = (SalesInvoiceDocumentsDao) MapperUtil.getObjectMapping(salesInvoiceDocsSyncDto, new SalesInvoiceDocumentsDao());
		return salesInvoiceDocumentsDao;
	}

	public List<SalesInvoiceDocumentsDao> getInvoiceDocsDaoList(List<SalesInvoiceDocsSyncDto> SalesInvoiceDocsSyncDtoList) {
		return SalesInvoiceDocsSyncDtoList.stream().map(sycInvoice -> sycInvoice.getSalesInvoiceDocumentDao(sycInvoice)).collect(Collectors.toList());
	}
}
