$(document).ready(function () {

    getReviseData = async () => {


        let bid = await eel.get_branchId()();

        let url = ""
        url = "http://"+enviVar.host+":"+enviVar.port+"/api/checkout/gethistory/"
        url+=bid

        $.ajax({
            type: "GET",
            url: url,
            success: function(data){
                console.log('history data : ',data)
                $("#historyTable tbody").html(renderDetails(data["data"]))
                $("td").css('vertical-align','middle');
                //add_tablerevise_rowclick()
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

    renderDetails = (data) => {
        let h = ''
        data.forEach(d => {
           let s = ''
            s =  `<tr>
            <th>${d['row_num']}</th>
            <td>${d['rname']}</td>
            <td class="custName" id="${d['checkoutid']}">${d['custname']}</td>
            <td>
              <div class="row d-flex">
                <div class="d-inline float-left px-2">
                  <h1>${d['stay']}</h1>
                </div>
                <div class="d-inline float-left">
                  <div class="px-2">${timeAdjust(d['cidatetime'])}</div>
                  <div class="px-2">${timeAdjust(d['codatetime'])}</div>
                </div>
              </div>
            </td>
            <td>${d['cototamt']}</td>
          </tr>`
          h+=s
        });
        return h
    }

    getReviseData()

})