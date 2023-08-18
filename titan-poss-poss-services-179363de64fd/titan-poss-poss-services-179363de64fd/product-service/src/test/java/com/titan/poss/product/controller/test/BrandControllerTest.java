//package com.titan.poss.product.controller.test;
//
//import static org.junit.Assert.assertTrue;
//
//import org.apache.commons.lang3.StringUtils;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.junit.jupiter.params.ParameterizedTest;
//import org.junit.jupiter.params.provider.CsvSource;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//
//import com.titan.poss.core.utils.test.AuthUtil;
//import com.titan.poss.product.ProductBase;
//import com.titan.poss.product.dto.BrandDto;
//import com.titan.poss.product.dto.request.BrandUpdateDto;
//
//@ExtendWith(SpringExtension.class)
//class BrandControllerTest extends ProductBase {
//
//	private static final String URI = "brands";
//
//	protected static HttpHeaders headers = new HttpHeaders();
//
//	@BeforeAll
//	protected static void initAuthUser() {
//		headers.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
//	}
//
//	@DisplayName("testAdd")
//	@ParameterizedTest
//	@CsvSource({ "Z,UNPROCESSABLE_ENTITY,Tanishq,T", ",OK,Tanishq,T", "Tanishq,BAD_REQUEST,Tanishq,T" ,",OK,,"})
//	void a(String brandCode, String status,String parentBrandCode, String orgCode) {
//
//		BrandDto brandDto = new BrandDto();
//
//		if (StringUtils.isBlank(brandCode)) {
//			brandDto.setBrandCode(generateString(5));
//		} else {
//			brandDto.setBrandCode(brandCode);
//		}
//		brandDto.setParentBrandCode(parentBrandCode);
//		brandDto.setOrgCode(orgCode);
//		brandDto.setDescription("Add Brand Unit Testing");
//		brandDto.setIsActive(true);
//
//		HttpEntity<BrandDto> entity = new HttpEntity<>(brandDto, headers);
//
//		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI), HttpMethod.POST, entity,
//				String.class);
//
//		assertTrue(response.getStatusCode().name().equals(status));
//	}
//
//	@DisplayName("testListBrand")
//	@ParameterizedTest
//	@CsvSource({"brands?parentBrandCode=Tanishq","brands","brands?isActive=true"})
//	void testListBrand(String url) {
//		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
//		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(url), HttpMethod.GET, entity,
//				String.class);
//
//		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	}
//
//	@DisplayName("testGetBrand")
//	@ParameterizedTest
//	@CsvSource({ "Tanishq,OK", "A!,BAD_REQUEST" })
//	void b(String brandCode, String status) {
//		HttpEntity<String> entity = new HttpEntity<>("ALL", headers);
//		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + brandCode),
//				HttpMethod.GET, entity, String.class);
//		assertTrue(response.getStatusCode().name().equals(status));
//
//	}
//
//	@DisplayName("testUpdateBrand")
//	@ParameterizedTest
//	@CsvSource({ "Z,UNPROCESSABLE_ENTITY,Tanishq,T", "Tanishq,OK,Tanishq,T", "A!,BAD_REQUEST,Tanishq,T","Tanishq,OK,,","ZOYA,OK,Tanishq,"})
//	void c(String brandCode, String status, String parentBrand, String orgCode) {
//
//		BrandUpdateDto brandUpdateDto = new BrandUpdateDto();
//		if (status.equals("UNPROCESSABLE_ENTITY"))
//			brandUpdateDto.setDescription(" ");
//		brandUpdateDto.setIsActive(false);
//
//		HttpEntity<BrandUpdateDto> entity = new HttpEntity<>(brandUpdateDto, headers);
//
//		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort(URI + "/" + brandCode),
//				HttpMethod.PATCH, entity, String.class);
//		assertTrue(response.getStatusCode().name().equals(status));
//
//	}
//
//}
