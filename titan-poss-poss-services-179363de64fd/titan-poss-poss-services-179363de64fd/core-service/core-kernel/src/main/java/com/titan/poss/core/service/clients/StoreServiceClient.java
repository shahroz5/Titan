package com.titan.poss.core.service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.filter.FeignClientInterceptor;

import io.swagger.annotations.ApiParam;

@FeignClient(contextId = "storeContextId", name = "store-service", configuration = FeignClientInterceptor.class)
public interface StoreServiceClient {
	

@PostMapping(value = "store/v2/catchments/validate-catchment")
	public boolean saveCatchmentDescription(
			@ApiParam(name = "description", value = "'description' that need to check save", required = true) @RequestParam(name = "description") String description); 
	

}
