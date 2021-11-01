const openSearchModal = () => {
  console.log("search clicked");
  $("#exampleModalCentered").modal("show");
}

$(document).ready(function () {

  
  $(function(){
  $('[data-toggle="tooltip"]').tooltip();
});



    getReviseData = async () => {


        let bid = await eel.get_branchId()();

        let url = ""
        url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkout/gethistory/"
        url+=bid

        $("#historyTable tbody").html("")

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                console.log('history data : ',data)
                $("#historyTable tbody").html(renderDetails(data["data"]))
                $("td").css('vertical-align','middle');
                $("th").css('vertical-align','middle');
                add_history_rowclick()
            }
          });

    }

    timeAdjust = (d) => {
        let now = new Date(d);
        now.setMinutes(now.getMinutes() + 330);
        let t = now.toISOString().slice(0,16);
        //console.log("t val",t)
        return t.replace('T',' ')
    }

    dateDiffernce = (x,y) => {
      let now = new Date(y);
      let checkedIn = new Date(x);
      let diffTime = Math.abs(now - checkedIn);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays;
  }

  taxAmount = (subTotal) => {

    let taxAmt = 0

    if(subTotal<1000)
        tax = subTotal * 0;

    if(subTotal>=1000 && subTotal<2500)
        tax = subTotal * 0.12;

    if(subTotal>=2500 && subTotal<4000)
        tax = subTotal * 0.18;

    if(subTotal>=4000)
        tax = subTotal * 0.28;

    return Number(tax.toFixed(2));

}

    renderDetails = (data) => {
        let h = ''
        data.forEach(d => {
           let s = ''
            s =  `<tr>
            <th id="billNum">${d['row_num']}</th>
            <td id="roomName">${d['rname']}</td>
            <td class="custName" id="${d['checkoutid']}">${d['custname']}</td>
            <td>
              <div class="row d-flex">
                <div class="d-inline float-left px-2">
                  <h1 id="daysStayed">${dateDiffernce(d['cidatetime'],d['codatetime'])}</h1>
                </div>
                <div class="d-inline float-left">
                  <div id="checkin" class="px-2">${timeAdjust(d['cidatetime'])}</div>
                  <div id="checkout" class="px-2">${timeAdjust(d['codatetime'])}</div>
                </div>
              </div>
            </td>
            <td id="totAmt">${d['cototamt']}</td>
          </tr>`
          h+=s
        });
        return h
    }

    resetDiv = () => {
      $("#searchBill").css("display","none");
      $("#searchDate").css("display","none");
      $("#searchCustomer").css("display","none");
      $("#startDate").val("");
      $("#endDate").val("");
    }

    $('#exampleModalCentered').on('hidden.bs.modal', function (e) {
      resetDiv();
    })

    callSearchBill = async (qtype,s) => {

      let bid = await eel.get_branchId()();

      let url = "http://"+enviVar.host+":"+enviVar.port
      let data = {}
      if(qtype){
        url+="/api/checkout/searchbillnum"
        data = {
          "bid":bid,
          "bnum":s
        }
      }else{
        url+="/api/checkout/searchcustomer"
        data = {
          "bid":bid,
          "cname":s
        }
      }

        $("#historyTable tbody").html("")

        $.ajax({
            type: "POST",
            url: url,
            data:data,
            success: function(data){
                console.log('history data : ',data)
                $("#historyTable tbody").html(renderDetails(data["data"]))
                $("td").css('vertical-align','middle');
                $("th").css('vertical-align','middle');
                $("#exampleModalCentered").modal("hide");
                add_history_rowclick()
            }
          });

    }

    callSearchDate = async (sdate,edate,ctype) => {

      let bid = await eel.get_branchId()();

      let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkout/searchdate"
      let data = {
        "bid":bid,
        "sdate":sdate,
        "edate":edate,
        "ctype":ctype
      }
      

        $("#historyTable tbody").html("")

        $.ajax({
            type: "POST",
            url: url,
            data:data,
            success: function(data){
                console.log('history data : ',data)
                $("#historyTable tbody").html(renderDetails(data["data"]))
                $("td").css('vertical-align','middle');
                $("th").css('vertical-align','middle');
                $("#exampleModalCentered").modal("hide");
                add_history_rowclick()
            }
          });

    }

    dateString = (d) => {
      let now = new Date(d);
      now.setMinutes(now.getMinutes() + 660);
      let t = now.toISOString().slice(0,10);
      //console.log("t val",t)
      return t
  }

    finalReachedBill = (subData,pardata) => {

      console.log("reached final bill");

      let dtable = []

      if(subData["staydays"]>1){
        //here comes for loop
        for (let d = new Date(subData["checkin"]); d <= new Date(subData["checkout"]); d.setDate(d.getDate() + 1)) {
          
          let j = {}
          j["rdate"]=dateString(d);
          j["rdesc"]=`Room Cost (₹ ${subData["roomTarrif"]}) x 1`;
          j["rtax"]="₹ "+taxAmount(Number(subData['roomTarrif']));
          j["rsubtotal"]="₹ "+(Number(subData["roomTarrif"])+taxAmount(Number(subData['roomTarrif'])));
          dtable.push(j)
        }
      }else{
        let j = {
          rdate:dateString(subData["checkin"]),
          rdesc:`Room Cost (₹ ${subData["roomTarrif"]}) x 1`,
          rtax:"₹ "+taxAmount(Number(subData['roomTarrif'])),
          rsubtotal:"₹ "+(Number(subData["roomTarrif"])+taxAmount(Number(subData['roomTarrif'])))
        }
        dtable.push(j)
      }

      let paid = 0;


      pardata.forEach(element => {
        if(element["billType"]==-1){
          paid+=Number(element["billAmt"])
        }
        let j = {}
          j["rdate"]=dateString(element["billDatetime"]);
          j["rdesc"]=element["billDesc"];
          j["rtax"]="₹ 0";
          j["rsubtotal"]="₹ "+element["billAmt"];
          dtable.push(j)
      });

      let due = subData["totAmt"]-paid;

      console.log("due:",due);
      console.log("paid:",paid);

      subData["dtable"]=dtable;
      subData["paidAmt"]=""+paid;
      subData["dueAmt"]=""+due;
      subData["payMode"]="Card";
      callGenerateBill(billGeneration);

    }

    callGenerateBill = async (data) => {

      console.log("call generate bill data : ",data);
      data["roomTarrif"]=String(data["roomTarrif"])
      data["guestNum"]=String(data["guestNum"])
      await eel.generate_bill(data)();
    
  }

    subFinalBill = (billGeneration,custName,extraData) => {

      console.log("reached sub final");

      let billDatas = billGeneration;
      let cname = custName
      let exdata = extraData

      billDatas['roomTarrif'] = exdata["roomCharge"]
      billDatas['roomType'] = exdata["rtype"]
      billDatas['custDetails'] = cname+'\n'+exdata["custAddr"]
      billDatas['guestNum'] = exdata["custGuest"]

      //console.log("cid",exdata["checkinid"]);
      //console.log("bdata",billDatas);

      let ciid = exdata["checkinid"];

      let url = "http://"+enviVar.host+":"+enviVar.port+"/api/bills/get/"+ciid;

      $.ajax({
        type:"GET",
        url:url,
        success:function(data){
          //console.log("got extra services : ",data)
          finalReachedBill(billDatas,data["data"]);
        }
      })

    }


    getMoreDetails = async (billGeneration,custName,coid) => {

      let bid = await eel.get_branchId()();

      let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkout/checkedoutdata"
      let data = {
        "bid":bid,
        "coid":coid
      }

      $.ajax({
        type: "POST",
        url: url,
        data:data,
        success: function(data){
           console.log("extra details : ",data["data"][0]) 
           subFinalBill(billGeneration,custName,data["data"][0])
        }
      });

    }

    add_history_rowclick = () => {

      $("#historyTable tbody tr").click(function(){

        let coid = $(this).find(".custName").attr("id")

        let billnum = $(this).find("#billNum").html()
        let roomnum = $(this).find("#roomName").html()
        let custName = $(this).find(".custName").html()
        let days = $(this).find("#daysStayed").html()
        let checkIn = $(this).find("#checkin").html()
        let checkOut = $(this).find("#checkout").html()
        let totalAmt = $(this).find("#totAmt").html()

        billGeneration = {
          checkin:checkIn,
          checkout:checkOut,
          totAmt:totalAmt,
          billNum:billnum,
          roomNum:roomnum,
          staydays:days
        }

        console.log('row click => ',billGeneration,custName,coid)
        getMoreDetails(billGeneration,custName,coid)
      })

    }

    validateDate = (sdate,edate) => {

      if(sdate && edate){

        let x = new Date(sdate);
      let y = new Date(edate);

      if(x<y)
        return true;
      else
        return false;

      }else{
        return true;
      }

    }

    $("#searchSubmit").click(function(){
      let v = $("#searchSelect").val()

      switch(v){
        case "":
          alert("Select Search Factor!");
          break;
        case "1":
          let s = $("#billNumber").val()
          if(s){
            callSearchBill(true,s);
          }else{
            alert("Please Enter Bill Number!");
          }
          break;
        case "3":
          let st = $("#customerName").val()
          if(st){
            callSearchBill(false,st);
          }else{
            alert("Please Enter Customer Name");
          }
          break;
        case "2":
        case "4":
          let sdate = $("#startDate").val()
          let edate = $("#endDate").val()
          if(!validateDate(sdate,edate)){
            alert("From Date must be lesser!");
            break;
          }
          if(!edate && !sdate){
            alert("Either fields must not be empty!");
            break;
          }else{
            if(v=="2"){
              if((sdate && !edate) || (sdate && edate)){
                callSearchDate(sdate,edate,true);
              }else{
                alert("Please Check The Formate!");
                break;
              }
            }else{
              if((sdate && !edate) || (sdate && edate)){
                callSearchDate(sdate,edate,false);
              }else{
                alert("Please Check The Formate!");
                break;
              }
            }
          }
          console.log(v,sdate,edate)
          break;
      }

    })

    $("#searchSelect").change(function(){
      let v = $(this).val();
      //console.log("it is changeing",v);
      switch(v){
        case "":
          //alert("Select Search Factor!");
          resetDiv();
          break;
        case "1":
          resetDiv();
          $("#searchBill").css("display","block");
          break;
        case "2":
        case "4":
          resetDiv();
          $("#searchDate").css("display","block");
          break;
        case "3":
          resetDiv();
          $("#searchCustomer").css("display","block");
          break;

      }
    })

    getReviseData()

})