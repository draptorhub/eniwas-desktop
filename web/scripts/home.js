$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    //console.log('test data : ',new Date().now());

    $("#checkInForm").submit(function(e){
        e.preventDefault();
        checkinAction();
    })

    $("#checkOutForm").submit(function(e){
        e.preventDefault();
        checkoutAction();
    })

    $("#advanceForm").submit(function(e){
        e.preventDefault();
        advanceAction();
    })

    $("#changeRoomForm").submit(function(e){
        e.preventDefault();
        changeRoomAction();
    })

    changeRoomAction = async () => {
        //e.preventDefault();
        console.log("change room started");

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/changeroom"

        let bid = await eel.get_branchId()();

        let ciid = $("#changeRoomModalCentered #custId").attr('cust-id');
        let rid = $("#changeRoomModalCentered #roomId").attr('room-id');
        let new_room = $("#changeRoomModalCentered #changeRoomForm #cust-rnum").val();

        let data = {
            "ciid":ciid,
            "bid":bid,
            "rid":new_room
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                console.log("Room was updated")
                updateRoomStat(rid,1)
                updateRoomStat(new_room,4)
                $('#changeRoomModalCentered').modal('hide');
                //getAllRoomDetails();
            }
        })

    }

    validateCardNumber = (number) => {
        var regex = new RegExp("^(?=[0-9]*$)(?:.{4}|.{6})$");
        if (regex.test(number))
            return true;
        else
            return false;
    
        //return luhnCheck(number);
    }
    
    luhnCheck = (val) => {
        var sum = 0;
        for (var i = 0; i < val.length; i++) {
            var intVal = parseInt(val.substr(i, 1));
            if (i % 2 == 0) {
                intVal *= 2;
                if (intVal > 9) {
                    intVal = 1 + (intVal % 10);
                }
            }
            sum += intVal;
        }
        return (sum % 10) == 0;
    }

    addCardDetails = (ciid,cnum) => {

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/card-details/createauto"

        let data = {
            "ciid":ciid,
            "cnum":cnum
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                console.log("card was added!")
                $('#advanceModal').modal('hide');
            }
        })

    }

    advanceAction = () => {
        //console.log("advance operation");
        let advAmount = $("#advanceModal #advanceForm #advAmount").val()
        let payMode = $("#advanceModal #advanceForm #payMode").val()
        let cid = $("#advanceModal #advanceForm #custId").attr("cust-id");

        let data = {
            "bdesc":'Room Advance',
            "btype":-1,
            "bamt":advAmount,
            "cid":cid,
            "ptype":payMode
        }

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/bills/create"

        let vflag = false;
        let cardNumber = '';

        if(payMode==2){
            cardNumber = $("#advanceModal #advanceForm #cardNumber").val()
            if(validateCardNumber(cardNumber))
                vflag = true;
        }

        if(payMode==2 && !vflag){
            alert("Enter valid card number!")
            return;
        }else{
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(data){
                    if(payMode==2)
                        addCardDetails(cid,cardNumber);
                    else{
                        console.log("card was not selected")
                        $('#advanceModal').modal('hide');
                    }
                }
            })
        }

        //console.log(advAmount,payMode);
    }

    $("#printBill").click(function(){
        
        console.log("i am going to generate bill");

        let valci = $("#checkOutModal #checkOutForm #checkindt").val();
        let billnum = $("#checkOutModal #checkOutForm #billNum").val();
        let roonum = $("#checkOutModal #checkOutForm #roomName").val();
        let custdetails = $("#checkOutModal #checkOutForm #custName").val();
        let paidamt = $("#checkOutModal #checkOutForm #paidAmount").val();
        let dueamt = $("#checkOutModal #checkOutForm #dueAmount").val();
        let totamt = $("#checkOutModal #checkOutForm #totalBill").val();
        let valco = $("#checkOutModal #checkOutForm #checkoutdt").val();

        let daysStayed = $("#checkOutModal #checkOutForm #checkoutdt").attr("stayday");
        let roomCost = $("#checkOutModal #checkOutForm #roomName").attr("roomcost");

        let guestnum = $("#checkOutModal #checkOutForm #numguest").val()
        let roomtype = $("#checkOutModal #checkOutForm #roomtype").val()

        let tableData = []

        $("#checkOutModal #particularDesc").children().each(function(){
            
            let j = {}
            j["rdate"] = $(this).find("th:first-child").html()
            j["rdesc"] = $(this).find("td:nth-child(2)").html()
            j["rtax"] = $(this).find("td:nth-child(3)").html()
            j["rsubtotal"] = $(this).find("td:last-child").html()
            
            console.log("object",j)
            tableData.push(j)

        })

        console.log("table : ",tableData)

        billGeneration = {
            checkin:valci,
            checkout:valco,
            paidAmt:paidamt,
            roomTarrif:roomCost,
            roomType:roomtype,
            totAmt:totamt,
            billNum:billnum,
            custDetails:custdetails,
            roomNum:roonum,
            guestNum:guestnum,
            staydays:daysStayed,
            dueAmt:dueamt,
            dtable:tableData,
        }

        callGenerateBill(billGeneration);

    })

    callGenerateBill = async (data) => {

        await eel.generate_bill(data)();
        //console.log("data : ",data);
      
    }

    checkoutAction = () =>{

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkout/create"
        let cust_rnum = $("#checkOutModal #checkOutForm #roomId").val();
        let ciid = $("#checkOutModal #checkOutForm #custId").val();
        let paytype = $("#checkOutModal #checkOutForm #paymode").val();
        let tamt = $("#checkOutModal #checkOutForm #totalBill").val();

        data = {
            "ciid":ciid,
            "paytype":paytype,
            "tamt":tamt
        }

        let vflag = false;
        let cardNumber = '';

        if(paytype==2){
            cardNumber = $("#checkOutModal #checkOutForm #cardNum").val()
            if(validateCardNumber(cardNumber))
                vflag = true;
        }

        if(paytype==2 && !vflag){
            alert("Enter valid card number!")
            return;
        }else{$.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                if(data["success"]){
                    addCardDetails(ciid,cardNumber);
                    console.log("checkout added");
                    updateRoomStat(cust_rnum,1)
                    $('#checkOutModal').modal('hide');   
                }
                else
                    console.log("checkout went wrong!");
            }
          });}

    }

    quitApp = async () => {
        await eel.delete_login()();
    }

    checkinAction = async () => {

        console.log("it has been submitted");

        let bid = await eel.get_branchId()();
    
        let cust_title = $('#cust-title').val()
        let cust_name = $('#cust-name').val()
        let cust_ref = $('input[name="referralOption"]:checked').val();
        let cust_mobile = $('#cust-mobile').val()
        let cust_email = $('#cust-email').val()
        let cust_purp = $('#cust-purp').val()
        let cust_addr = $('#cust-addr').val()
        let cust_days = $('#cust-days').val()
        let cust_guest = $('#cust-guest').val()
        let cust_adv = $('#cust-adv').val()
        let cust_natn = $('#cust-natn').val()
        let cust_pay = $('#cust-pay').val()
        let cust_card = $('#cust-card').val()
        let cust_rtype = $('#cust-rtype').val()
        let cust_rnum = $('#checkInModal #checkInForm #cust-rnum').val()
        let cust_rplan = $('#cust-rplan').val()
        let cust_rcost = $('#cust-rcost').val()
        
        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/create"
    
        data={
            'cname':(cust_title+cust_name),
            'cref':cust_ref,
            'cmob':cust_mobile,
            'cmail':cust_email,
            'cnat':cust_natn,
            'cpurp':cust_purp,
            'caddr':cust_addr,
            'cdays':cust_days,
            'cque':cust_guest,
            'cpay':1,
            'rplan':cust_rplan,
            'rnum':cust_rnum,
            'bid':bid,
            'rcost':cust_rcost
        }
    
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                if(data["success"]){
                    //console.log('bid passed : ',bid);
                    console.log("checkin added");
                    updateRoomStat(cust_rnum,4)
                    $('#checkInModal').modal('hide');
                    //getAllRoomDetails();
                }
                else
                    console.log("checkin went wrong!");
            }
          });
    
          return false;
        
    }

    renderRoomTypes = (data) => {
        let html = '';
        html += '<option value="">Room Type</option>'

        data.forEach(element => {
            html+=`<option value="${element['roomTypeId']}">${element['roomTypeName']}</option>`
        });

        $("#checkInModal #checkInForm #cust-rtype").html(html)
        $("#changeRoomModalCentered #cust-rtype").html(html)

    }

    getAllRoomTypes = async () => {
        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/roomtypebranch/get/"+bid
        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                renderRoomTypes(data["data"])
            }
        });
    }

    var roomData = []

    copyData = (data) => {
        roomData = [];
        roomData = [...data];
        //console.log('api data after passing : ',data);
        //console.log('room Data : ',roomData);
    }

    setRoomAction = () => {
        $('#checkInModal #checkInForm #cust-rnum').change(function(){
            let cost = $(this).find(':selected').attr('room-cost')
            $('#checkInModal #checkInForm #cust-rcost').val(cost)
        })
    }

    rtypework = (currentValue) => {
        if(currentValue==""){
            $('#checkInModal #checkInForm #cust-rcost').val("")
            $("#checkInModal #checkInForm #cust-rnum").prop('disabled',true)
            return;
        }
        $('#checkInModal #checkInForm #cust-rcost').val("")
        $("#checkInModal #checkInForm #cust-rnum").prop('disabled',false)
        //console.log("this val: ",$(this).val());
        let fd = roomData.filter(room => room['roomType'] == currentValue)
        .map(room => `<option room-cost="${room['roomTypeCost']}" value="${room['roomId']}">${room['roomName']}</option>`).join('');
        let html = `<option room-cost="0" value="" selected>Select Room#</option>`
        html+=fd
        $("#checkInModal #checkInForm #cust-rnum").html(html)
        setRoomAction();
    }

    changeRoomrtype = (currentValue) => {
        if(currentValue==""){
            $("#changeRoomModalCentered #cust-rnum").prop('disabled',true)
            return;
        }
        $("#changeRoomModalCentered #cust-rnum").prop('disabled',false)
        //console.log("this val: ",$(this).val());
        let fd = roomData.filter(room => room['roomType'] == currentValue)
        .map(room => `<option room-cost="${room['roomTypeCost']}" value="${room['roomId']}">${room['roomName']}</option>`).join('');
        let html = `<option room-cost="0" value="" selected>Select Room#</option>`
        html+=fd
        $("#changeRoomModalCentered #cust-rnum").html(html)
    }

    $('#checkInModal #checkInForm #cust-rtype').change(function() {
        let currentValue = $(this).val()
        rtypework(currentValue)
    });

    $('#changeRoomModalCentered #cust-rtype').change(function() {
        let currentValue = $(this).val()
        changeRoomrtype(currentValue)
    });

    getAllRoomDetails = async () => {
        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/room/selectoption/"+bid
        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                copyData(data["data"])
            }
        });
    }

    timeAdjust = (d) => {
        let now = new Date(d);
        now.setMinutes(now.getMinutes() + 660);
        let t = now.toISOString().slice(0,16);
        //console.log("t val",t)
        return t
    }



    dateString = (d) => {
        let now = new Date(d);
        now.setMinutes(now.getMinutes() + 660);
        let t = now.toISOString().slice(0,10);
        //console.log("t val",t)
        return t
    }

    settingTime = () => {
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        let t = now.toISOString().slice(0,16);

        var next = new Date();
        next.setMinutes(next.getMinutes() - next.getTimezoneOffset());
        next.setHours(next.getHours() + 24)
        let n = next.toISOString().slice(0,16);


        $('#checkInModal #ciDatetime').val(t);
        $('#checkInModal #dateTimeco').val(n);
        $('#checkOutModal #checkoutdt').val(t);
        $('#changeRoomModalCentered #changeRoomdt').val(t);
        //changeRoomdt
    }

    get_parentDivclass = (totrooms) => {

        if(totrooms<20)
            return('r3-c4')
        else if(totrooms>=20 && totrooms<30)
            return('r5-c5')
        else if(totrooms>=30 && totrooms<40)
            return('r3-c7')
        else if(totrooms>=40)
            return('r5-c10')

    }

    reset_parent_div = () => {
        $("#roomPopulate").removeClass("r3-c4");
        $("#roomPopulate").removeClass("r5-c5");
        $("#roomPopulate").removeClass("r3-c7");
        $("#roomPopulate").removeClass("r5-c10");
    }

    const getBranchDetails = async () => {
        let data = await eel.get_login_details()();
        let obj = JSON.parse(data)
        $("span[id=hname]").html(obj["hname"])
        $("span[id=bname]").html(obj["bname"])
        $("span[id=mname]").html(obj["mname"])
    }

    getRoom_statClass = (statCode) =>{

        let classValue = ''

        /*
            -2
            -1
            0 - Ava
            1 - Dirty
            2 - Maint
            3 - Mngt
            4 - Occ
        */

        switch(statCode){
            case 0:
                classValue = 'bg-success';
                break;
            case 1:
                classValue = 'bg-warning';
                break;
            case 2:
                classValue = 'bg-secondary';
                break;
            case 3:
                classValue = 'bg-primary';
                break;
            case 4:
                classValue = 'bg-danger';
                break;
        }

        return classValue;

    }

    get_subMenus = (statCode) => {

        let s = ''

        switch(statCode){
            case 0:
                s+=`<a class="dropdown-item checkin">CheckIn</a>
                <a class="dropdown-item maintenance">Maintenace</a>
                <a class="dropdown-item management">Management</a>`;
                break;
            case 1:
                s+=`<a class="dropdown-item maintenance">Maintenace</a>`;
                break;
            case 2:
                s+=`<a class="dropdown-item dirty">Dirty</a>
                <a class="dropdown-item ready">Ready</a>`;
                break;
            case 3:
                s+=`<a class="dropdown-item free">Free</a>`;
                break;
            case 4:
                s+=`<a class="dropdown-item advance">Advance</a>
                    <a class="dropdown-item service">Service</a>
                    <a class="dropdown-item change-room">Change Room</a>
                    <a class="dropdown-item checkout">Checkout</a>`;
                break;
            
        }

        s+='</div>'
        return s
    }

    dateDiffernce = (d) => {
        let now = new Date();
        let checkedIn = new Date(d);
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

    const copyBillData = (data) => {
        billData = [];
        billData = [...data];
        console.log("copied data : ",billData);
    }

    getCustomerBills = (ciid) => {

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/bills/get/"+ciid;

        $.ajax({
            type: "GET",
            url: url,
            data: data,
            success: function(data){
               let array = data["data"]
               let html = ''
               let paid = 0;
               paid = Number($("#checkOutModal #checkOutForm #paidAmount").val())
               let due = 0;
               due = Number($("#checkOutModal #checkOutForm #dueAmount").val())
               let total = 0;
               total = Number($("#checkOutModal #checkOutForm #totalBill").val())
               let subPaid = 0;
               let subDue = 0;
               array.forEach(d => {
                    html+=particularsRender(d["billType"]>0?true:false,d["billDatetime"],d["billDesc"],0,d["billAmt"])
                    if(d["billType"]<0){
                        subPaid+=Number(d["billAmt"]);
                    }else{
                        subDue+=Number(d["billAmt"]);
                    }
                });
                paid+=subPaid
                total+=subDue;
                due=total-paid;

                let prevhtml = $("#checkOutModal #checkOutForm #particularDesc").html()     
                html = prevhtml+html;
                $("#checkOutModal #checkOutForm #particularDesc").html(html)

                $("#checkOutModal #checkOutForm #paidAmount").val(paid)
                $("#checkOutModal #checkOutForm #dueAmount").val(due)
                $("#checkOutModal #checkOutForm #totalBill").val(total)
            }

        });

    }


    renderCheckout = async (rid) => {

        $("#checkOutModal #checkOutForm #roomId").val(rid)
        let bid = await eel.get_branchId()();

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/coutdata"

        data = {
            "bid":bid,
            "rid":rid
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                //console.log('cout data : ',data)
                let d = data["data"][0]
                $("#checkOutModal #checkOutForm #roomName").val(d["rname"])
                $("#checkOutModal #checkOutForm #checkindt").val(timeAdjust(d["cidt"]))
                $("#checkOutModal #checkOutForm #custId").val(d["checkinid"])
                $("#checkOutModal #checkOutForm #custName").val(d["custName"])
                $("#checkOutModal #checkOutForm #reffImg").attr("src",d["custref"])
                $("#checkOutModal #checkOutForm #custAddr").val(d["custAddr"])

                $("#checkOutModal #checkOutForm #numguest").val(d["custGuest"])
                $("#checkOutModal #checkOutForm #roomtype").val(d["rtype"])

                let days = dateDiffernce(timeAdjust(d["cidt"]))

                $("#checkOutModal #checkOutForm #checkoutdt").attr("stayday",days)
                $("#checkOutModal #checkOutForm #roomName").attr("roomcost",d["roomCharge"])

                let paid = 0;
                let due = 0;
                let tax = 0;
                let subTotal = 0;
                let total = 0;
                let subDue = 0;

                subDue = (Number(d["roomCharge"])+taxAmount(Number(d["roomCharge"])))*days;
                total+=subDue;
                due= total-paid;



                let html = ''
                let checkinDatetime = timeAdjust(d["cidt"])
                let roomCharge = d["roomCharge"]

                if(days>1){
                    let newHtml = ''
                    let now = new Date();
                    for (let d = new Date(checkinDatetime); d <= now; d.setDate(d.getDate() + 1)) {
                        console.log('travdate : ',d)
                        newHtml+=particularsRender(true,d,`Room Cost (&#8377; ${roomCharge}) x 1`,taxAmount(Number(roomCharge)),roomCharge)
                    }
                    //newHtml+=particularsRender(true,d["cidt"],'Coming Soon x 1',taxAmount(Number(d["roomCharge"])),d["roomCharge"]*days)
                    $("#checkOutModal #checkOutForm #particularDesc").html(newHtml)
                }else{
                    html+=particularsRender(true,d["cidt"],`Room Cost (&#8377; ${d["roomCharge"]}) x `+days,taxAmount(Number(d["roomCharge"])),d["roomCharge"]*days)
                    $("#checkOutModal #checkOutForm #particularDesc").html(html)
                }


                //$("#checkOutModal #checkOutForm #subTotal").html(subTotal);
                $("#checkOutModal #checkOutForm #totalBill").val(total);
                $("#checkOutModal #checkOutForm #paidAmount").val(paid);
                $("#checkOutModal #checkOutForm #dueAmount").val(due);
                //$("#checkOutModal #checkOutForm #taxAmount").val(tax);

                getCustomerBills(d["checkinid"])
                getBillNumber(bid);
            }
          });
          //console.log("retv bill data : ",billData);
    }

    getBillNumber = (bid) => {

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkout/getbillnum/"+bid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                let d = data["data"][0]["billnum"]
                $("#checkOutModal #checkOutForm #billNum").val(d);
            }
        })

    }

    particularsRender = (encash,pdate,pdesc,ptax,pcost) => {
        let uprow = `<tr class="table-danger">
                        <th>${dateString(pdate)}</th>
                        <td style="max-width:200px;word-wrap: break-word;">${pdesc}</td>
                        <td>&#8377; ${ptax}</td>
                        <td>&#8377; ${ptax + pcost}</td>
                     </tr>`

        let downrow = `<tr class="table-success">
                        <th>${dateString(pdate)}</th>
                        <td style="max-width:200px;word-wrap: break-word;">${pdesc}</td>
                        <td>&#8377; ${ptax}</td>
                        <td>&#8377; ${ptax + pcost}</td>
                       </tr>`
        if(encash)
            return uprow;
        else
            return downrow;
    }

    renderRooms = (data) => {
        //console.log('data:',data)
        let rooms = data
        reset_parent_div()
        let parentClass = get_parentDivclass(data.length)
        console.log('data:',parentClass)
        $("#roomPopulate").addClass(parentClass);
        let h = '';
        rooms.forEach(item => {
            let sub = `<div class="btn-group" role="group">`
            sub += `<div data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="${item['roomId']}" class="p-2 flex-fill text-center 
            ${getRoom_statClass(item["roomStat"])}">${item["roomName"]}</div>`
            let m = `<div class="dropdown-menu" aria-labelledby="${item['roomId']}">`
            sub+=(m+get_subMenus(item["roomStat"])+'</div>')
            h+=sub
        });
        $("#roomPopulate").html(h)
        setAction_forlinks()
    }

    apiRoomStat = async (bid,rid,stat) => {
        
        //let flag = false;

        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/room/updatestat"
        let data = {
            rstat:stat,
            rid:rid,
            bid:bid
        }
        $.ajax({
            type: "PUT",
            url: url,
            data:data,
            success: function(data){
                //flag = true;
            }
        });

        //return flag;
    }

    updateRoomStat = async (rid,stat) => {
        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/room/updatestat"
        let data = {
            rstat:stat,
            rid:rid,
            bid:bid
        }
        $.ajax({
            type: "PUT",
            url: url,
            data:data,
            success: function(data){
                populateRooms();
            }
        });
    }

    $("#resetServiceModal").click(function(){
        $("#addServiceForm").trigger('reset');
        $("#serviceTableBody").html("")
        $("#totalService").val("")
    })

    finalServiceApiCall = (sql) => {

        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/bills/addservices"
        let data = {
            stmt:sql,
        }
        $.ajax({
            type: "POST",
            url: url,
            data:data,
            success: function(data){
                $('#serviceModal').modal('hide');
                alert("Service Added!");
            }
        });

    }

    $("#submitServiceModal").click(function(){
        let html = $("#serviceTableBody").html()
        html.trim();
        if(html==""){
            //console.log("no data");
            alert("Add Services!");
        }else{
            //console.log("data added");
            let sql = "";
            let cid = $("#serviceModal #custId").attr("cust-id")
            $("#serviceTableBody").children().each(function(){
                //console.log("e : ",$(this).html());
                let sname = $(this).find("td[id='sname']").html()
                let scost = $(this).find("td[id='scost']").html()
                let sqnty = $(this).find("td[id='sqnty']").html()
                let subtotal = $(this).find("td[id='subtotal']").html()
                sql+=`('','${sname} (Rs.${scost}) x ${sqnty}',1,${subtotal},'${cid}',1),`
            });
            let finsql = sql.slice(0,-1)+";";
            finalServiceApiCall(finsql);
            //console.log("final value = ",finsql);
        }
    })

    setServTableAction = () => {
        $("#serviceTableBody > tr > td > .btn.btn-danger").click(function(){
            $(this).closest("tr").remove();
            renderServiceTotal();
        })
    }

    $("#addServiceForm").submit(function(e){
        e.preventDefault();
        let sname = $("#serviceName").val()
        let selected = $("#serviceList").children().filter(function(){return $(this).val()==sname})
        let sid = selected.attr("sid")
        sid = sid?sid:"-1";
        let scost = $("#serviceCost").val()
        let sqnty = $("#serviceQnty").val()
        let subTotal = $("#serviceTotal").val()

        let html = `<tr id="${sid}">
                        <td id="sname">${sname}</td>
                        <td id="scost">${scost}</td>
                        <td id="sqnty">${sqnty}</td>
                        <td id="subtotal">${subTotal}</td>
                        <td><button type="button" class="btn btn-danger" data-toggle="tooltip" 
                        data-placement="bottom" title="Delete Room">&#9866;</button></td>
                    </tr>`
        let prevHtml = $("#serviceTableBody").html()

        

        $("#serviceTableBody").html("")
        $("#serviceTableBody").html(prevHtml+html)
        setServTableAction();
        $("#serviceTableBody td").css('vertical-align','middle');
        $("#addServiceForm").trigger('reset');
        renderServiceTotal();
    })

    renderServiceTotal = () => {
        let total = 0;
        $("#serviceTableBody").children().each(function(){
            let h = $(this).find("td[id='subtotal']").html()
            total+=Number(h);
        })
        if(total>0)
            $("#totalService").val(total)
        else
            $("#totalService").val(0)
    }

    renderChangeRoom = async (rid) => {

        let bid = await eel.get_branchId()();

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/custdata"

        data = {
            "bid":bid,
            "rid":rid
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                //console.log(data)
                let d = data["data"][0]
                $("#changeRoomModalCentered #roomId").val(d["rname"]);
                $("#changeRoomModalCentered #roomId").attr("room-id",d["roomNumber"]);
                $("#changeRoomModalCentered #custId").val(d["custName"]);
                $("#changeRoomModalCentered #custId").attr("cust-id",d["checkinid"]);
            }
        })

    }

    $("#serviceQnty").on('input click keyup change',function(){
        if($("#serviceName").val()!=""){
            let value = Number($("#serviceCost").val()) * Number($(this).val())
            $("#serviceTotal").val(value)
        }else{
            $(this).val("")
            $("#serviceTotal").val("")
        }
    })

    $("#serviceCost").on('input click keyup',function(){
        if($("#serviceName").val()!=""){
            let value = Number($("#serviceQnty").val()) * Number($(this).val())
        $("#serviceTotal").val(value)
        }else{
            $(this).val("")
            $("#serviceTotal").val("")
        }
    })

    setServiceListAction = () => {
        $("#serviceName").change(function(){
            let v = $(this).val()
            if(v!=""){
                let selected = $("#serviceList").children().filter(function(){return $(this).val()==v})
                $("#serviceCost").val(selected.attr("scost"))
                $("#serviceQnty").val("1").change()
            }else{
                $("#serviceTotal").val("")
                $("#serviceQnty").val("")
                $("#serviceCost").val("")
            }
        })
    }

    renderServiceList = (bid) => {

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/service-branch/frontlist/"+bid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                //console.log(data)
                let d = data["data"]
                console.log("data",d)
                let html = ''
                d.forEach(item => {
                   s = `<option scost="${item['serviceCost']}" sid="${item['serviceId']}" value="${item['sname']}" >${item['sname']}</option>`
                   html+=s
                });
                $("#serviceList").html(html);
                setServiceListAction();
            }
        })

    }

    renderService = async (rid) => {

        let bid = await eel.get_branchId()();

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/custdata"

        data = {
            "bid":bid,
            "rid":rid
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                //console.log(data)
                let d = data["data"][0]
                $("#serviceModal #roomId").val(d["rname"]);
                $("#serviceModal #roomId").attr("room-id",d["roomNumber"]);
                $("#serviceModal #custId").val(d["custName"]);
                $("#serviceModal #custId").attr("cust-id",d["checkinid"]);
                renderServiceList(bid);
            }
        })

        //$("#serviceTableBody td").css('vertical-align','middle');
    }

    renderAdvance = async (rid) => {

        let bid = await eel.get_branchId()();

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/custdata"

        data = {
            "bid":bid,
            "rid":rid
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                //console.log(data)
                let d = data["data"][0]
                $("#advanceModal #roomId").val(d["rname"]);
                $("#advanceModal #roomId").attr("room-id",d["roomNumber"]);
                $("#advanceModal #custId").val(d["custName"]);
                $("#advanceModal #custId").attr("cust-id",d["checkinid"]);
            }
        })

    }

    $("#advanceForm #payMode").change(function(){
        //console.log('advance pay',$(this).val())
        if($(this).val()==2)
            $("#advanceForm #cardNumber").css("display","block");
        else
            $("#advanceForm #cardNumber").css("display","none");
    })

    $("#checkOutForm #paymode").change(function(){
        
        if($(this).val()==2)
            $("#checkOutForm #cardNum").prop("disabled",false);
        else
            $("#checkOutForm #cardNum").prop("disabled",true);
    })

    setAction_forlinks = () => {
        // $("a.dropdown-item").click(function(){
        //     alert("The paragraph was clicked.");
        // });

        //dirty to maintenance ==> maintenance
        $("a.dropdown-item.maintenance").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            updateRoomStat(rid,2)
        });

        //free to management
        $("a.dropdown-item.management").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            updateRoomStat(rid,3)
        });

        //management to free
        $("a.dropdown-item.free").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            updateRoomStat(rid,0)
        });

        //maintenance to free
        $("a.dropdown-item.ready").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            updateRoomStat(rid,0)
        });

        //dirty to maintenance

        //occupied to changeroom
        $("a.dropdown-item.change-room").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            settingTime();
            $('#changeRoomModalCentered').modal('show');
            renderChangeRoom(rid);
            $("#changeRoomModalCentered #cust-rnum").prop('disabled',true)
            //updateRoomStat(rid,0)
        });

        //occupied to dirty
        $("a.dropdown-item.checkout").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            $('#checkOutModal').modal('show');
            settingTime();
            renderCheckout(rid)
            //updateRoomStat(rid,0)
        });

        //add service
        $("a.dropdown-item.service").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            $('#serviceModal').modal('show');
            renderService(rid);
            //renderAdvance(rid);
        });

        //pay advance
        $("a.dropdown-item.advance").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            $('#advanceModal').modal('show');
            renderAdvance(rid);
        });

        $("a.dropdown-item.dirty").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            updateRoomStat(rid,1)
            //$('#advanceModal').modal('show');
            //renderAdvance(rid);
        });

        //free to checking
        $("a.dropdown-item.checkin").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            $('#checkInModal').modal('show');
            settingTime();
            let data = roomData.filter(room => room['roomId']==rid)
            //console.log("selected room : ",data);
            $('#checkInModal #checkInForm #cust-rtype').val(data[0]['roomType']).change()
            $('#checkInModal #checkInForm #cust-rnum').val(data[0]['roomId']).change()
            //updateRoomStat(rid,0)
        });
    }

      $('#checkInModal').on('hidden.bs.modal', function (e) {
        //console.log("i am working");
        $('input[name="referralOption"]').each(function(){
            $(this).parent().removeClass("active");
        })
        $('#checkInForm').trigger("reset");
        settingTime();
      })

      $('#checkOutModal').on('hidden.bs.modal', function (e) {
        //console.log("i am working");
        $('#checkOutForm').trigger("reset");
        settingTime();
      })

      $('#advanceModal').on('hidden.bs.modal', function (e) {
        //console.log("i am working");
        $('#advanceForm').trigger("reset");
        $("#advanceModal #advanceForm #cardNumber").css('display','none');
        settingTime();
      })

      $('#changeRoomModalCentered').on('hidden.bs.modal', function (e) {
        //console.log("i am working");
        $('#changeRoomForm').trigger("reset");
        settingTime();
      })

      $('#serviceModal').on('hidden.bs.modal', function (e) {
        //console.log("i am working");
        $('#addServiceForm').trigger("reset");
        $("#totalService").val("")
        $("#serviceTableBody").html("")
        settingTime();
      })


    generateStats = (data) => {
        let l = data.length;
        let occ = 0;
        let ava = 0;
        let dir = 0;
        let man = 0;
        let mai = 0;
        data.forEach(item => {
            switch(item["roomStat"]){
                case 0:
                    ava+=1;
                    break;
                case 1:
                    dir+=1;
                    break;
                case 2:
                    mai+=1;
                    break;
                case 3:
                    man+=1;
                    break;
                case 4:
                    occ+=1;
                    break;
            }
        })
        
        setProgressbar('#'+'progress-occ',occ,l)
        setProgressbar('#'+'progress-ava',ava,l)
        setProgressbar('#'+'progress-dir',dir,l)
        setProgressbar('#'+'progress-man',man,l)
        setProgressbar('#'+'progress-mai',mai,l)
    }

    setProgressbar = (pid,pval,ptot) => {
        let per = (pval/ptot) * 100;
        $(pid).css('width',(per+'%'))
        $(pid).attr('aria-valuenow',per)
        $(pid).html(pval)
    }

    populateRooms = async () => {  
        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/room/get/"+bid
        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                generateStats(data["data"])
                renderRooms(data["data"])
                getAllRoomDetails()
            }
        });
    }

    $('#dismiss, .overlay').on('click', function () {
        // hide sidebar
        $('#sidebar').removeClass('active');
        // hide overlay
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        // open sidebar
        $('#sidebar').addClass('active');
        // fade in the overlay
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    settingTime();
    getBranchDetails();
    populateRooms();
    getAllRoomTypes();
    getAllRoomDetails();
});