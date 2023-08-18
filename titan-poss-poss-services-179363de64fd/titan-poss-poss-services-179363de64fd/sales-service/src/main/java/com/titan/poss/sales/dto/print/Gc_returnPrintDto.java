package com.titan.poss.sales.dto.print;

import java.util.List;

import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.PrintableDto;

public class Gc_returnPrintDto implements PrintableDto{

	@Override
	public List<String> getTemplateName() {
		// TODO Auto-generated method stub
		return List.of(FtlTemplateName.GC_WITH_RETURN_INVOICE_PRINT);
	}

	@Override
	public CustomerDocumentDto getDocumentDetails() {
		// TODO Auto-generated method stub
		return null;
	}

}
