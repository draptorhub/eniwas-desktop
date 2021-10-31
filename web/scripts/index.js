$(document).ready(function(){

    storeBid = (bid) => {

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/login/branchdetails/"+bid
        let bname = ""
        let hname = ""
        let mname = ""

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                //console.log('branch data : ',data["data"][0]["bname"])
                bname = data["data"][0]["bname"]
                hname = data["data"][0]["hname"]
                mname = data["data"][0]["mname"]
                haddr = data["data"][0]["branchAdd"]
                callStoreQuery(bid,bname,hname,mname,haddr)
            }
          });

    }
   
    const getBranchDetails = async () => {
        let data = await eel.get_login_details()();
        let obj = JSON.parse(data)
        console.log('object',obj)
        if(obj["hname"])
            window.location.replace('./home.html')
    }

    callStoreQuery = async (bid,bname,hname,mname,haddr) => {

        await eel.storeBranch(bid,bname,hname,mname,haddr)()
        //console.log("bid stored!");
        window.location.replace('./home.html')
    }

    $("#loginButton").click(function(){

        let mid = $("input[name=managerId]").val();
        let bid = $("input[name=branchId]").val();
        let mpass = $("input[name=mngrPass]").val();

        if(mid=='' || bid=='' || mpass==''){
            alert("No fields must be empty!");
            return;
        }

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/login/mngrlogin"
        var data = {
            mid:mid,
            mpass:mpass,
            bid:bid
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                if(data["success"]){
                    console.log('bid passed : ',bid);
                    storeBid(bid)
                }
                else
                    alert("Branch ID/Manager ID/Password might be incorrect!");
            }
          });


        //window.location.replace('./home.html')
        //location.reload();
    })

    getBranchDetails();
    
});