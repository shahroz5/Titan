package com.titan.poss.config.dto.response;

import java.util.Date;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

@Data
public class FocLocationResponseDto {

	private String id;

	private String locationCode;

	private Date startDate;

	private Date endDate;

	private String description;
	
	private String subBrandCode;

	private String mobileNo;

	private Boolean status;

	private JsonData configDetails;
	
	private Date createdDate;

}
