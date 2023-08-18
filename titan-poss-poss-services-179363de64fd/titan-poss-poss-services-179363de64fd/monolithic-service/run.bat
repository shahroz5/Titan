gradle clean build -x test -Pmono
java -jar -DstrictCheck=false -Dcommon.properties-file=../common.properties -Derror-messages.properties-file=../error-messages.properties  -Deureka.client.enabled=false build/libs/monolithic-service-1.0.0.jar



		