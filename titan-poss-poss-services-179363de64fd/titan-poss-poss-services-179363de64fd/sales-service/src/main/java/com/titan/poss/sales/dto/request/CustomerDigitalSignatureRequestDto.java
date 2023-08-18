package com.titan.poss.sales.dto.request;

import javax.annotation.Nullable;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.response.JsonData;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class CustomerDigitalSignatureRequestDto {
	
	@NotNull
	@NotBlank(message = "Mobile Number cannot be blank")
//	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX, nullCheck = true,message = "Provide a valid mobile number")
	public String mobileNumber;
	
	@NotNull
	@NotBlank(message = "Customer Id cannot be blank")
	public String customerId;
	
	
	
	@NotNull
	@NotBlank(message = "CustomerType cannot be blank")
	public String customerType;
	
	@Nullable
	public String ulpNumber;
	
	public JsonData applicableTransactionTypes;
	
	@Nullable
	@Size(min = 1, max = 100, message = "Email Id min length is {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.EMAIL_REGEX)
	private String emailId;
}
