import {Params} from "@angular/router";
import {ActiveParamsType} from "../../../types/active-params.type";

export class ActiveParamsUtils {
    static processParams(params:Params):ActiveParamsType {
        const activeParams:ActiveParamsType ={categories:[]};
        if (params.hasOwnProperty('page')) {
            activeParams.page = params['page']
        }
        if (params.hasOwnProperty('categories')) {
            // activeParams.categories = params['categories'];
            activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
        }
        return activeParams;
    }
}