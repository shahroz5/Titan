/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.util.Date;

import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Payment audit dto")
@Data
public class PaymentAuditDto {

	@ApiModelProperty(position = 1, value = "Id", name = "id", example = "DC8508F3-93C8-472C-BE0D-8D45E53B9E9E")
	private String id;
	
	@ApiModelProperty(position = 2, value = "Url", name = "url", example = "url")
	private String url;
	
	@ApiModelProperty(position = 3, value = "Vendor code", name = "vendorCode", example = "Unipay")
	@ValueOfEnum(enumClass = VendorCodeEnum.class)
	private String vendorCode;
	
	@ApiModelProperty(position = 4, value = "request", notes = "json data", name = "request", example = "Json data")
	private Object request;
	
	@ApiModelProperty(position = 5, value = "response", notes = "json data", name = "response", example = "Json data")
	private Object response;

	@ApiModelProperty(position = 6, value = "Time at which request was sent", name = "requestTime", example = "2020-06-19 17:23:16")
	private Date requestTime;
	
	@ApiModelProperty(position = 7, value = "Time at which respone was recieved", name = "responseTime", example = "2020-06-19 17:23:16")
	private Date responseTime;
	
	@ApiModelProperty(position = 8, value = "Response time - Request time in ms", name = "totalTime", example = "1000")
	private long totalTime;
	
	@ApiModelProperty(position = 9, value = "httpStatus", name = "httpStatus", example = "200")
	private Integer httpStatus;
	
	@ApiModelProperty(position = 10, value = "transactionStatus", name = "transactionStatus", example = "true")
	private Boolean transactionStatus;
	
	@ApiModelProperty(position = 11, value = "transactionType", name = "transactionType", example = "void")
	private String transactionType;
	
	@ApiModelProperty(position = 12, value = "cardNumber", name = "cardNumber", example = "12345")
	private String cardNumber;
	
	@ApiModelProperty(position = 13, value = "invoiceNumber", name = "invoiceNumber", example = "INV-12345")
	private String invoiceNumber;
	
	@ApiModelProperty(position = 14, value = "referenceNumber", name = "referenceNumber", example = "12345")
	private String referenceNumber;
	
	@ApiModelProperty(position = 15, value = "paymentId", name = "paymentId", example = "12345")
	private String paymentId;
}
