package com.titan.poss.sales.dto;

import lombok.Data;

@Data
public class ApplicableTransactionTypesDto {

	public String type;
	public Data data;

	public class Data {

		public Boolean isAdvanceOrderOrBooking;
		public Boolean isCashMemo;
		public Boolean isGHS;
		public Boolean isAcceptAdvance;
		public Boolean isGRN;
		public Boolean isGRF;
		public Boolean isGiftCard;
		public Boolean isCNCancellation;
		public Boolean isTEPDeclarationAndExchangeForm;
		public Boolean isGEPDeclarationAndExchangeForm;
		public Boolean isCCAFRequestServicePaymentOrCustomerOrder;

	}

}
