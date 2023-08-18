/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerUlpDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerDetailsDto {
private CustomerDao customer;
private CustomerUlpDao customerUlp;
private CustomerDao removeCustomer;
}
