package com.titan.poss.sales.dto;

import java.util.Date;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;


import lombok.Data;


@Data

public class DepositDateDto {
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date depositDate;

	@NotNull(message = "Please provide paymentCode")
	private String paymentCode;
}
