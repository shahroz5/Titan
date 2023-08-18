package com.titan.poss.core.dto;

import java.util.Date;

import javax.validation.constraints.Positive;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerDocumentsRequestDto {

	@Positive(message = "fiscalYear should be more than 0")
	private Short fiscalYear;
 
 	@Positive(message = "Doc No. should be more than 0")
	private Integer docNo;

 	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date fromDocDate;
 	
 	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date toDocDate;
 	
 	private String locationCode;
 	
	
}
