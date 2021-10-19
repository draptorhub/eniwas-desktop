
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


    populateRooms();
    populate_roomTypes();

});