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
            let cid = $(this).children('.custId').attr('id')
            let rname = $(this).children('.roomId').html()
            let cname = $(this).children('#ciDatetime').html()
            let rtype = $(this).children('#roomCost').html()

            console.log("RID : ",rid);
            //editRoomModal(rid,rname,rtype)
        })
    }

    getReviseData();

});