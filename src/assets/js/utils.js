import { Toast } from 'vant';
class RegInput {
    RegIpt(o){
        for(var key in o){
            if(!o[key].reg.test(o[key].value)){
                Toast({
                    message:o[key].errorMsg,
                    forbidClick:true
                });
                return false;
            }
        }
        return true;
    }
}

export const utils = new RegInput()