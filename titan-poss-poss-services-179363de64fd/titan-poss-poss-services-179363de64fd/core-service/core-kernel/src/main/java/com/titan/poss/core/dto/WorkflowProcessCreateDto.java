package com.titan.poss.core.dto;

import java.util.Map;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.response.JsonData;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
/**
 * DTO class for Creating Workflow Process
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class WorkflowProcessCreateDto {	

	
	@ApiModelProperty(position = 1, value = "requestData", notes="JSON Data")
	private JsonData requestData;
	
	@Size(max=250)
	private String requestorRemarks;
	
	@NotNull
	private JsonData headerData;
	
	@NotNull
	private Map<String, String> filterValues;
	
	private Map<String, String> emailContent;
}
