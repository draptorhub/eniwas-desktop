$(document).ready(function () {

    console.log("on document ready");

    getReviseData = async () => {


        let bid = await eel.get_branchId()();

        let url = ""
        url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/revisedata/"
        url+=bid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                console.log('revise data : ',data)
                $("#reviseTable tbody").html(renderDetails(data["data"]))
                add_tablerevise_rowclick()
            }
          });

    }

    timeAdjust = (d) => {
        let now = new Date(d);
        now.setMinutes(now.getMinutes() + 660);
        let t = now.toISOString().slice(0,16);
        //console.log("t val",t)
        return t.replace('T',' ')
    }

    renderDetails = (data) => {
        let h = ''
        data.forEach(d => {
           let s = ''
            s =  `<tr>
            <td id="${d['roomNumber']}" class="roomId">${d['rname']}</td>
            <td id="${d['checkinId']}" class="custId">${d['custName']}</td>
            <td id="ciDatetime">${timeAdjust(d['cidt'])}</td>
            <td id="roomCost">${d['roomCharge']}</td>
          </tr>`
          h+=s
        });
        return h
    }

    add_tablerevise_rowclick = () => {
        $("#reviseTable tr").click(function(){
            //console.log('first col : ',$(this).children('.roomName').html())
            let rid = $(this).children('.roomId').attr('id')
            let ciid = $(this).children('.custId').attr('id')
            let rname = $(this).children('.roomId').html()
            let cname = $(this).children('#ciDatetime').html()
            let rtype = $(this).children('#roomCost').html()

            console.log("CIID : ",ciid);
            editCheckinModal(ciid)
        })
    }

    editCheckinModal = (ciid) => {

        $("#checkInModal").modal("show");

        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/get/"+ciid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                renderCheckinModal(data["data"][0]);
            }
          });

    }

    renderCheckinModal = (data) => {
        
        let dataName = data["custName"]
        let i = dataName.indexOf('.');
        let custName = dataName.substring(i+1);
        let custTitle = dataName.substring(0,i+1);
        
        $('#cust-title').val(custTitle)
        $('#cust-name').val(custName)

        $('#cust-name').attr("custId",data['checkinId'])

        let dataReferral = data["custReferral"]
        $('input[name="referralOption"]').each(function(){
            if($(this).val()==dataReferral){
                $(this).prop("checked",true)
                $(this).parent().addClass("active");
            }else{
                $(this).prop("checked",false)
                $(this).parent().removeClass("active");
            }
        })
        
        $('#cust-mobile').val(data["custMobile"])
        $('#cust-email').val(data["custMail"])
        $('#cust-purp').val(data["custPurpose"])
        $('#cust-addr').val(data["custAddr"])
        $('#cust-days').val(data["custDays"])
        $('#cust-guest').val(data["custGuest"])
        $('#cust-natn').val(data["custNational"])
        $('#cust-rplan').val(data["ratePlan"])
        $('#cust-rcost').val(data["roomCharge"])

    }

    $("#checkInForm").submit(function(e){
        e.preventDefault();
        checkinAction();
    })

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
        let cust_natn = $('#cust-natn').val()
        let cust_rplan = $('#cust-rplan').val()
        let cust_rcost = $('#cust-rcost').val()
        let cust_ident = $('#cust-name').attr("custId")
        
        let url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkin/update"
    
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
            'rplan':cust_rplan,
            'rcost':cust_rcost,
            'ciid':cust_ident
        }
    
        $.ajax({
            type: "PUT",
            url: url,
            data: data,
            success: function(data){
                if(data["success"]){
                    console.log("checkin Updated");
                    getReviseData();
                    $('#checkInModal').modal('hide');
                }
                else
                    console.log("checkin update went wrong!");
            }
          });
    
          return false;
        
    }

    $('#checkInModal').on('hidden.bs.modal', function (e) {
        //console.log("i am working");
        $('input[name="referralOption"]').each(function(){
            $(this).parent().removeClass("active");
        })
        $('#checkInForm').trigger("reset");
        settingTime();
      })

    getReviseData();


});