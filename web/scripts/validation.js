var onlyalpa = /^[a-zA-Z]+$/;
var onlyalphanums = /^[a-zA-Z0-9]+$/;
var mulonlyalpa = /^[a-zA-Z /]+$/
var onlynum = /^[0-9]+$/;
var aadhar = /^\d{12}$/;

var Validation = {
    
    not_empty: function(name,fname,dob,addr,docnum,mobnum){
        if(name=="" || fname=="" || dob=="" || addr=="" || docnum=="" || mobnum==""){
            alert("No fields must be empty!");
            return false
        }
        else
            return true
    },
    individual_format: function(name,fname,docnum,mobnum,indian){
        console.log("i have been called individual format")
        if(!onlyalpa.test(name) || !onlyalpa.test(fname)){
            alert("Name must be in alphabets only");
            return false;
        }
        if(!onlynum.test(mobnum)){
            alert("Mobile number must be in numbers only");
            return false;
        }
        if(indian){
            if(!aadhar.test(docnum)){
                alert("Check with aadhar number");
                return false;
            }
        }else{
            if(!onlyalphanums.test(docnum)){
                alert("Check with your passport number");
                return false;
            }
        }
        return true;
    },
    multiple_format:function(name,docnum,indian){

        console.log("i have been called multiple formats")
        if(name=="" || docnum==""){
            alert("No fields must be empty");
            return false;
        }

        if(!mulonlyalpa.test(name)){
            alert("Name shoud be only alphabets");
            return false;
        }

        if(indian){
            if(!aadhar.test(docnum)){
                alert("Check with aadhar number!");
                return false;
            }
        }else{
            if(!onlyalphanums.test(docnum)){
                alert("Check with passport number!")
                return false;
            }
        }

        return true;

    },
    rental_json:function(
        oname,osod,odad,oage,oaddr,baddr,
        aname,rnum,tnatn,rdate,rrent,
        radv,rmaint,rprem
        ){
            let pjon = {
                "oname":oname,
                "osod":osod,
                "odad":odad,
                "oage":oage,
                "oaddr":oaddr,
                "baddr":baddr,
    
                "aname":aname,
                "rnum":rnum,

                "tnatn":tnatn,
    
                "rdate":rdate,
                "rrent":rrent,
                "radv":radv,
                "rmaint":rmaint,
                "rprem":rprem,
            }
    
            return pjon;
    },
    single_tenant_json:function(
        tname,trel,tfath,tdob,tpaddr,tdocnum,tmob
    ){
        let pjon = {
            "tname":tname,
            "trel":trel,
            "tfath":tfath,
            "tdob":tdob,
            "tpaddr":tpaddr,
            "tdocnum":tdocnum,
            "tmob":tmob,
        }
        return pjon
    },

};