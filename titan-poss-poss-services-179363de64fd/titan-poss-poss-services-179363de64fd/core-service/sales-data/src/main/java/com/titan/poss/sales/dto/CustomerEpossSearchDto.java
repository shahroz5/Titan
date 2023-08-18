/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.List;

import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerUlpDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerEpossSearchDto {

	private CustomerDao customer;

	private CustomerUlpDao customerUlp;

	private CustomerLocationMappingDao customerLocationMapping;

	private List<CustomerDocumentsDao> customerDocuments;

	// to avoid cyclic dependency for CustomerDao inside CustomerLocationMappingDao
	private Integer customerId;
	private String locationCode;
	private Integer customerLocationSrcSyncId;
	private Integer customerLocationDestSyncId;

	public CustomerEpossSearchDto(CustomerDao customer, CustomerUlpDao customerUlp,
			CustomerLocationMappingDao customerLocationMapping, List<CustomerDocumentsDao> customerDocuments) {
		super();
		this.customer = customer;
		this.customerUlp = customerUlp;
		this.customerLocationMapping = customerLocationMapping;
		this.customerDocuments = customerDocuments;
	}

}
