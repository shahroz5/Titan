package com.titan.poss.sales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDocumentTxnIdDto {

	private String tepDeclarationTxnId;
	private String gepDeclarationTxnId;

}
