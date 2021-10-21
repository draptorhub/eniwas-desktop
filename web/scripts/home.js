$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    //console.log('test data : ',new Date().now());

    $("#checkInForm").submit(function(e){
        e.preventDefault();
        checkinAction();
    })

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
        let cust_rnum = $('#cust-rnum').val()
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
            'cpay':cust_pay,
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
                }
                else
                    alert("Branch ID/Manager ID/Password might be incorrect!");
            }
          });
    
          return false;
        
    }

    renderRoomTypes = (data) => {
        let html = '';
        html += '<option value="" selected>Room Type</option>'

        data.forEach(element => {
            html+=`<option value="${element['roomTypeId']}">${element['roomTypeName']}</option>`
        });

        $("#cust-rtype").html(html)

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
        roomData = [...data];
    }

    setRoomAction = () => {
        $('#cust-rnum').change(function(){
            let cost = $(this).find(':selected').attr('room-cost')
            $('#cust-rcost').val(cost)
        })
    }

    rtypework = (currentValue) => {
        if(currentValue==""){
            $('#cust-rcost').val("")
            $("#cust-rnum").prop('disabled',true)
            return;
        }
        $('#cust-rcost').val("")
        $("#cust-rnum").prop('disabled',false)
        //console.log("this val: ",$(this).val());
        let fd = roomData.filter(room => room['roomType'] == currentValue)
        .map(room => `<option room-cost="${room['roomTypeCost']}" value="${room['roomId']}">${room['roomName']}</option>`).join('');
        let html = `<option room-cost="" value="" selected>Select Room#</option>`
        html+=fd
        $("#cust-rnum").html(html)
        setRoomAction();
    }

    $('#cust-rtype').change(function() {
        let currentValue = $(this).val()
        rtypework(currentValue)
    });

    getAllRoomDetails = async () => {
        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/room/frontlist/"+bid
        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                //renderRoomTypes(data["data"])
                console.log('data in function : ',data["data"])
                copyData(data["data"])
            }
        });
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
    }

    get_parentDivclass = (totrooms) => {

        if(totrooms<20)
            return('r3-c4')
        else if(20<=totrooms<30)
            return('r5-c5')
        else if(30<=totrooms<40)
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
                <a class="dropdown-item management">Management</a>`;
                break;
            case 1:
                s+=`<a class="dropdown-item maintenance">Maintenace</a>`;
                break;
            case 2:
                s+=`<a class="dropdown-item ready">Ready</a>`;
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

    setAction_forlinks = () => {
        // $("a.dropdown-item").click(function(){
        //     alert("The paragraph was clicked.");
        // });

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
            $('#changeRoomModalCentered').modal('show');
            //updateRoomStat(rid,0)
        });

        //occupied to dirty
        $("a.dropdown-item.checkout").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            $('#checkOutModal').modal('show');
            //updateRoomStat(rid,0)
        });

        //free to checking
        $("a.dropdown-item.checkin").click(function(){
            let rid = $(this).closest("div").attr("aria-labelledby")
            $('#checkInModal').modal('show');
            let data = roomData.filter(room => room['roomId']==rid)
            //console.log("selected room : ",data);
            $('#cust-rtype').val(data[0]['roomType']).change()
            $('#cust-rnum').val(data[0]['roomId']).change()
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