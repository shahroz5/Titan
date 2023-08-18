import { ComplexityListing, ComplexityCode } from '@poss-web/shared/models';

export class ComplexityCodeAdaptor {
    static getComplexityCodeList(data: any): ComplexityListing {
        let complexityCodeList: ComplexityListing
        const complexityCodeData: ComplexityCode[] = []
        for (const complexity of data.results) {
            complexityCodeData.push({
                complexityCode: complexity.complexityCode,
                description: complexity.description,
                isActive: complexity.isActive
            })
        }
        complexityCodeList = {
            results: complexityCodeData,
            totalElements: data.totalElements
        }
        return complexityCodeList;
    }
    static getComplexityByCode(data: any): ComplexityCode {
        let complexityCode: ComplexityCode

        complexityCode = {
            complexityCode: data.complexityCode,
            description: data.description,
            isActive: data.isActive
        }
        return complexityCode
    }
    static searchComplexityCode(data: any) {
        let complexityCodeList: ComplexityListing
        const complexityCodeData: ComplexityCode[] = []

        complexityCodeData.push({
            complexityCode: data.complexityCode,
            description: data.description,
            isActive: data.isActive
        })

        complexityCodeList = {
            results: complexityCodeData,
            totalElements: 1
        }
        return complexityCodeList;
    }



}