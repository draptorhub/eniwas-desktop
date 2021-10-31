$( document ).ready(function() {
    
    var scrOn = "#roomRender";

    populateRooms = async () => {

        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/room/frontlist/"+bid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                $("#roomTable tbody").html(renderRoomTable(data["data"]))
                add_tableroom_rowclick()
            }
        });


    }

    renderServiceTable = (array) => {
        let html = ''
        let i = 1;
        array.forEach(element => {
            let subHtml =''
            subHtml = `<tr id="${element['serviceId']}" class="${element['serviceEnabled']==1?'table-success':'table-danger'}">
                        <td scope="row">${i++}</td>
                        <td>${element['sname']}</td>
                        <td>${element['serviceCost']}</td>
                       </tr>`
            html+=subHtml;
        });
        $("#serviceTable tbody").html(html)
        setServiceRowClick();
    }

    resetAddServiceModal = () => {

        $("#addServiceModal .modal-body #serviceId").prop("disabled",false);
        $("#addServiceModal .modal-body #serviceId").val("").change();
        resetServiceButtons();
    }

    setServiceRowClick = () => {

        $("#serviceTable tbody tr").click(function(){
            let sid = $(this).attr("id");
            let sclass = $(this).attr("class");
            let sname = $(this).find("td:nth-child(2)").html()
            let scost = $(this).find("td:nth-child(3)").html()
            //console.log("sname : ",sname)
            $('#addServiceModal').modal('show');
            
            resetAddServiceModal();

            $("#addServiceModal .modal-body .d-flex.justify-content-center .btn.btn-primary").prop("disabled",true);
            $("#addServiceModal .modal-body .d-flex.justify-content-center .btn.btn-success").prop("disabled",true);

            $("#addServiceModal .modal-body #serviceId").prop("disabled",true);
            $("#addServiceModal .modal-body #serviceEnabled").prop("disabled",false);
            $("#addServiceModal .modal-body #serviceName").prop("disabled",true);
            $("#addServiceModal .modal-body #serviceCost").prop("disabled",false);

            $("#addServiceModal .modal-body #serviceEnabled").prop("checked",sclass=='table-success'?true:false);
            $("#addServiceModal .modal-body #serviceCost").val(scost);
            $("#addServiceModal .modal-body #serviceName").val(sname);
            $("#addServiceModal .modal-body #serviceName").attr("serviceId",sid);

        })

    }

    $("#addServiceModal .d-flex.justify-content-center .btn.btn-primary").click(function(){
        //console.log("add button clicked")
        let v = $("#serviceId").val()
        
        switch(v){
            case '':
                alert("Select Service!")
                break;
            case "-1":
                addNewService();
                break;
            default:
                addExistingService(v);
                break;
        }
        
    })

    $("#addServiceModal .d-flex.justify-content-center .btn.btn-warning").click(async function(){

        let bid = await eel.get_branchId()();
        let sstat = $("#addServiceModal .modal-body #serviceEnabled").prop("checked");
        let scost = $("#addServiceModal .modal-body #serviceCost").val();
        let sid = $("#addServiceModal .modal-body #serviceName").attr("serviceId");

        data = {
            "scost":scost,
            "sid":sid,
            "bid":bid,
            "sstat":(sstat?1:0)
        }

        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/service-branch/update"

        $.ajax({
            type: "PUT",
            url: url,
            data:data,
            success: function(data){
                //renderServiceTable(data["data"]);
                alert("Service Updated!")
                populateServices();
                $('#addServiceModal').modal('hide');
            }
        });

    })

    $("#addServiceModal .d-flex.justify-content-center .btn.btn-danger").click(async function(){

        let bid = await eel.get_branchId()();
        let sstat = false;
        let scost = $("#addServiceModal .modal-body #serviceCost").val();
        let sid = $("#addServiceModal .modal-body #serviceName").attr("serviceId");

        data = {
            "scost":scost,
            "sid":sid,
            "bid":bid,
            "sstat":(sstat?1:0)
        }

        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/service-branch/update"

        $.ajax({
            type: "PUT",
            url: url,
            data:data,
            success: function(data){
                //renderServiceTable(data["data"]);
                alert("Service Disabled!")
                populateServices();
                $('#addServiceModal').modal('hide');
            }
        });

    })

    populateServices = async () => {

        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/service-branch/fronttable/"+bid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                renderServiceTable(data["data"]);
            }
        });

    }

    resetServiceButtons = () => {
        $("#addServiceModal .modal-body .d-flex.justify-content-center .btn.btn-primary").prop("disabled",false);
        $("#addServiceModal .modal-body .d-flex.justify-content-center .btn.btn-success").prop("disabled",false);
        $("#addServiceModal .modal-body .d-flex.justify-content-center .btn.btn-warning").prop("disabled",false);
        $("#addServiceModal .modal-body .d-flex.justify-content-center .btn.btn-danger").prop("disabled",false);
    }

    $("button[data-target='#addServiceModal']").click(function(){
        resetAddServiceModal();
        $("#addServiceModal .modal-body .d-flex.justify-content-center .btn.btn-warning").prop("disabled",true);
        $("#addServiceModal .modal-body .d-flex.justify-content-center .btn.btn-danger").prop("disabled",true);
    })



    addNewService = () => {
        
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/service/create"

        let sname = '';
        sname = $("#addServiceModal #serviceName").val()

        if(sname){

            data = {
                "sname":sname,
            }

            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function(data){
                    alert("New Service Added!")
                    getServiceSelect();
                    $('#addServiceModal').modal('hide');
                }
            });

        }else{
            alert("New Service Name must not be empty!");
        }
    }

    addExistingService = async (sid) => {

        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/service-branch/create"

        let bid = await eel.get_branchId()();
        let scost = $("#addServiceModal #serviceCost").val()

        if(!scost){
            alert("No fields must be empty.");
            return;
        }

        data = {
            "sid":sid,
            "scost":scost,
            "bid":bid,
            "sstat":1
        }

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function(data){
                //renderServiceTable(data["data"]);
                //console.log("add service data : ",data);
                alert("Added Service!")
                populateServices();
                $('#addServiceModal').modal('hide');
            }
        });

    }

    const serviceOnChange = () => {

        $("#serviceId").change(function(){
            let v  = $(this).val()
            //console.log('val : ',v)
            //console.log('item text : ',$(this).val())
            switch(v){
                case '': 
                    $("#serviceName").val("")
                    $("#serviceCost").val("")
                    $("#serviceName").prop("disabled",true);
                    $("#serviceCost").prop("disabled",true);
                    $("#serviceEnabled").prop("disabled",true);
                    break;  
                case "-1":
                    $("#serviceName").val("")
                    $("#serviceCost").val("")
                    $("#serviceName").prop("disabled",false);
                    $("#serviceCost").prop("disabled",true);
                    $("#serviceEnabled").prop("disabled",true);
                    $("#serviceEnabled").prop("checked",false);
                    break;
                default:
                    let t = $('#serviceId :selected').text();
                    $("#serviceName").val(t)
                    $("#serviceName").prop("disabled",true);
                    $("#serviceCost").prop("disabled",false);
                    $("#serviceEnabled").prop("disabled",true);
                    $("#serviceEnabled").prop("checked",true);
                    break;

            }
            
        })

        $("#serviceId").val("").change()

    }

    renderServiceSelect = (array) => {

        let html = ''

        html+='<option value="">Select Service</option>'
        html+='<option value="-1">Create New</option>'

        array.forEach(element => {
            html+=`<option value="${element['servicesId']}">${element['serviceName']}</option>`
        });

        $("#serviceId").html(html)
        serviceOnChange()
    }


    getServiceSelect = async () => {

        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/service/frontlist/"+bid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                renderServiceSelect(data["data"]);
            }
        });

    }

    renderSelectOptions = (data) => {
        let html = ''
        html+='<option selected value="-999">Room Type</option>'
        data.forEach(item => {
            html+=`<option value="${item['roomTypeId']}">${item['roomTypeName']}</option>`
        });
        $("#addRoomModal #inprType").html(html)
    }

    populate_roomTypes = async () => {
        let bid = await eel.get_branchId()();
        let url =  "http://"+enviVar.host+":"+enviVar.port+"/api/roomtypebranch/get/"+bid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                renderSelectOptions(data["data"]);
            }
        });
    }

    renderRoomTable = (data) => {
        let h = ''
        data.forEach(r => {
           let s = ''
            s =  `<tr>
            <td class="roomName" id="${r['roomId']}">${r['roomName']}</td>
            <td class="roomType" id="${r['roomType']}">${r['rtname']}</td>
            <td class="roomCost">${r['roomTypeCost']}</td>
          </tr>`
          h+=s
        });
        return h
    }

    $("#btnRoomModal").click(function(){
        resRoomModal();
        $("#addRoomModal .d-flex.justify-content-center .btn.btn-warning.mx-1").prop('disabled', true);
        $("#addRoomModal .d-flex.justify-content-center .btn.btn-danger.mx-1").prop('disabled', true);
        $("#addRoomModalLabel").html("Add Room")
    })

    $("#addRoomModal .d-flex.justify-content-center  .btn.btn-primary.mx-1").click(function(){
        console.log("add room selected!")
    })

    $("#addRoomModal .d-flex.justify-content-center  .btn.btn-warning.mx-1").click(function(){
        console.log("update room selected!")
    })

    $("#addRoomModal .d-flex.justify-content-center  .btn.btn-danger.mx-1").click(function(){
        console.log("delete room selected!")
    })

    $("#addRoomModal .d-flex.justify-content-center  .btn.btn-success.mx-1").click(function(){
        $("#inprName").val("");
        $("#inprType").val("-999").change();
    })

    $("#roomTypeModal .d-flex.justify-content-center  .btn.btn-primary.mx-1").click(function(){
        console.log("add room type selected!")
    })

    $("#roomTypeModal .d-flex.justify-content-center  .btn.btn-warning.mx-1").click(function(){
        console.log("update room type selected!")
    })

    $("#roomTypeModal .d-flex.justify-content-center  .btn.btn-danger.mx-1").click(function(){
        console.log("delete room type selected!")
    })

    $("#roomTypeModal .d-flex.justify-content-center  .btn.btn-success.mx-1").click(function(){
        resRoomType()
    })

    add_tableroom_rowclick = () => {
        $("#roomRender #roomTable tr").click(function(){
            //console.log('first col : ',$(this).children('.roomName').html())
            let rid = $(this).children('.roomName').attr('id')
            let rname = $(this).children('.roomName').html()
            let rtype = $(this).children('.roomType').attr('id')
            editRoomModal(rid,rname,rtype)
        })
    }

    $("#roomRender #rtypeTable tr").click(function(){
        //console.log('first col : ',$(this).children('.roomName').html())
        console.log("room type selected!")
        let rtid = $(this).children('.roomType').attr('id')
        let rtype= $(this).children('.roomType').html()
        let rcost= $(this).children('.roomCost').html()
        editRoomType(rtid,rtype,rcost)
    })

    const resRoomModal = () => {
        //console.log('resetting room');
        $("#addRoomModal .d-flex.justify-content-center .btn.btn-primary.mx-1").prop('disabled', false);
        $("#addRoomModal .d-flex.justify-content-center .btn.btn-success.mx-1").prop('disabled', false);
        $("#addRoomModal .d-flex.justify-content-center .btn.btn-warning.mx-1").prop('disabled', false);
        $("#addRoomModal .d-flex.justify-content-center .btn.btn-danger.mx-1").prop('disabled', false);
        $("#inprName").val("");
        $("#inprType").val("-999").change();
    }

    const getBranchRooms = () => {
        $.ajax({
            type: "GET",
            url: 'http://localhost:3000/api/room/get/BID-0000000003',
            success: function(data){
                console.log('data:',data)
            }
        });
    }

    const resRoomType = () => {
        $("#roomTypeModal #inprType").val("-999");
        $("#roomTypeModal #inprType").prop('disabled',false);
        $("#roomTypeModal .d-flex.justify-content-center .btn.btn-warning.mx-1").prop('disabled', true);
        $("#roomTypeModal .d-flex.justify-content-center .btn.btn-danger.mx-1").prop('disabled', true);
        $("#roomTypeModal .d-flex.justify-content-center .btn.btn-primary.mx-1").prop('disabled', false);
        $("#roomTypeModal .d-flex.justify-content-center .btn.btn-success.mx-1").prop('disabled', false);
        $("#newRoomType").val("")
        $("#newRoomType").prop('readonly', true);
        $("#editRoomCost").val("")
    }

    $("#roomTypeModal #inprType").change(function() {
        let v = $(this).val()

        if(v=="-1"){
            $("#roomRender #rtypeTable").prop("disabled",true)
            $("#newRoomType").val("")
            $("#newRoomType").prop('readonly', false);
            $("#editRoomCost").val("")
        }else{
            $("#roomRender #rtypeTable").prop("disabled",false)
            $("#newRoomType").val("")
            $("#newRoomType").prop('readonly', true);
            $("#editRoomCost").val("")
        }
    })

    const editRoomType = (rtid,rtype,rcost) => {
        resRoomType()
        $("#newRoomType").val(rtype)
        $("#roomTypeModal #inprType").prop('disabled',true);
        $("#newRoomType").prop('readonly', true);
        $("#editRoomCost").val(rcost)
        $("#roomTypeModal .d-flex.justify-content-center .btn.btn-warning.mx-1").prop('disabled', false);
        $("#roomTypeModal .d-flex.justify-content-center .btn.btn-danger.mx-1").prop('disabled', false);
        $("#roomTypeModal .d-flex.justify-content-center .btn.btn-primary.mx-1").prop('disabled', true);
        $("#roomTypeModal .d-flex.justify-content-center .btn.btn-success.mx-1").prop('disabled', false);
    }

    const editRoomModal = (rid,rname,rtype) => {
        resRoomModal()
        console.log('rtype : ',rtype)
        $("#addRoomModal .d-flex.justify-content-center .btn.btn-primary.mx-1").prop('disabled', true);
        $("#addRoomModal .d-flex.justify-content-center .btn.btn-success.mx-1").prop('disabled', true);
        $("#addRoomModalLabel").html("Update Room")
        $("#inprName").val(rname);
        $("#inprType").val(rtype).change();
        $('#addRoomModal').modal('show');
    }

    $(".nav-link").click(function(){
        let selectedScreen = $(this).attr('data-screen');

        if(selectedScreen){

            selectedScreen='#'+selectedScreen;
            console.log("Home Value : "+selectedScreen);
            $(".nav-link").parent().removeClass("active");
            $(this).parent().addClass("active");
            $(scrOn).removeClass("d-flex").addClass("d-none");
            $(selectedScreen).addClass("d-flex").removeClass("d-none");
            scrOn = selectedScreen;

        }
    });

    $('#addServiceModal').on('hidden.bs.modal', function (e) {
        resetAddServiceModal();
      })


    populateRooms();
    populate_roomTypes();
    populateServices();
    getServiceSelect();

});