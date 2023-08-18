/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.constraints.Pattern;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class LocationCacheDto implements Serializable {

	private static final long serialVersionUID = 1L;

	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid locationCode")
	private String locationCode;

	private String description;

	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid ownerTypeCode")
	private String ownerTypeCode;

	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid locationTypeCode")
	private String locationTypeCode;

	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid regionCode")
	private String regionCode;

	private String brandCode;

	private String subBrandCode;

	private String stateCode;

	private Boolean isActive;

	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid baseCurrency")
	private String baseCurrency;

	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid stockCurrency")
	private String stockCurrency;

	@Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Invalid masterCurrency")
	private String masterCurrency;

	private String paymentCurrencies;

	private Boolean isOffline;

	private String countryCode;

	private StoreDetails storeDetails;

	private PrintDetails printDetails;

	private LocationCreditNoteDetails cnDetails;

	private TaxDetails taxDetails;

	private LocationCashMemoDetailsDto cmDetails;

	private LocationAdvanceBookingDetailsDto abDetails;

	private BankingDetails bankingDetails;

	private CustomerOrderDetails orderDetails;

	private CustomerDetails customerDetails;

	private GiftCardDetails giftCardDetails;

	private GepDetails gepDetails;

	private GhsDetails ghsDetails;

	private GrfDetails grfDetails;

	private GrnDetails grnDetails;
	
	private TepDetailsDto tepDetails;

	private InventoryDetails inventoryDetails;

	private OfferDetails offerDetails;

	private LocationOtpDetails otpDetails;

	private LocationPaymentDetails paymentDetails;

	private DigigoldDetails digigoldDetails;

	private Boolean isMigratedFromLegacy;
	
	private ServiceDetails serviceDetails;

	// state tax Code

	private TcsDetails tcsDetails;
	
	private String townName;
	private BigDecimal latitude;
	private BigDecimal longitude;
	
	
	@PrePersist
	private void prePersist() {
		if(this.townName==null) {
			this.townName = "";
		}
	}
	
	
	@PreUpdate
	private void onPersist() {
		if(this.townName==null) {
			this.townName = "";
		}
	}

}
