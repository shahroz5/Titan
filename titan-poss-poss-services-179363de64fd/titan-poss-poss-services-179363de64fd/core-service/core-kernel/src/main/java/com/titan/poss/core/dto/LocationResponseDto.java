/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.titan.poss.core.response.JsonData;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class LocationResponseDto {

	private LocationHeaderDto factoryDetails;

	private LocationHeaderDto cfaDetails;

	private String locationCode;

	@Size(max = 100, message = "description max length is 100")
	private String description;

	private String fax;

	@NotNull(message = "Please provide the locationTypeCode")
	private String locationTypeCode;

	@NotNull(message = "Please provide the townCode")
	private String townId;

	@NotNull(message = "Please provide the stateId")
	private String stateId;

	@NotNull(message = "Please provide the countryCode")
	private CountryDto country;

	@NotNull(message = "Please provide the regionCode")
	private String regionCode;

	@NotNull(message = "Please provide the ownerTypeCode")
	private String ownerTypeCode;

	@NotNull(message = "Please provide the factoryCodeValue")
	private String factoryCodeValue;

	@NotNull(message = "Please provide the locationFormat")
	private String locationFormat;

	private String brandCode;

	private Boolean isActive;

	private String cfaCodeValue;

	private CurrencyDto baseCurrency;

	@NotNull(message = "Please provide the stockCurrency")
	private String stockCurrency;

	@NotNull(message = "Please provide the masterCurrency")
	private String masterCurrency;

	@NotNull(message = "Please provide the paymentCurrencies")
	private String paymentCurrencies;

	private String marketCode;

	private String subRegionCode;

	private String subBrandCode;

	private String remarks;

	private JsonData storeDetails;

	private JsonData printDetails;

	private JsonData cnDetails;

	private JsonData taxDetails;

	private JsonData cmDetails;

	private JsonData grnDetails;

	private JsonData grfDetails;

	private JsonData gepDetails;

	private JsonData gcDetails;

	private JsonData abDetails;

	private JsonData coDetails;

	private JsonData ghsDetails;

	private JsonData inventoryDetails;

	private JsonData bankingDetails;

	private JsonData otpDetails;

	private JsonData customerDetails;

	private JsonData paymentDetails;

	private JsonData offerDetails;

	private JsonData tepDetails;

	private JsonData digigoldDetails;

	private JsonData tcsDetails;
	
	private JsonData cfaStoreDetails;
	
	private JsonData serviceDetails;


}
