const sendLoadDialog = async function() {
    let value = await eel.getWordFile()()
    return value
}

const sendSaveDialog = async function() {
    let value = await eel.getSaveFile()()
    return value
}

const renderFields = function(fieldsArray){

    if(fieldsArray.length<1){
        alert("Select a file with mergefields")
        return
    }

    $("#formFields").html("")

    $.each(fieldsArray, function( index, value ) {
        let inputField = `<input class="form-control my-1" type="text" placeholder="${value}" required/>` 
        $("#formFields").append(inputField);
    });

}

const sendWordProcess = async function(fileName) {
    let value = await eel.processWordFile(fileName)()
    renderFields(value)
}

const sendGenerateFile = async function(fileName,data,outputFile) {
    await eel.generateWordFile(fileName,data,outputFile)()
    alert("File Created Successfully!")
}

$(document).ready(function(){

    // $(window).resize(function(){
    //     window.resizeTo(400, 400)
    // })
    console.log("win : ",window.location)
    //window.open("https://www.google.com/","_parent","width=400,height=400,resizable=no,titlebar=no")
    //window.resizeBy(400,400)

    $("#formWordFile").click(function(){
        let rvalue = sendLoadDialog()
        rvalue.then((a) => {
            if(a!=""){
                $("#inputWordFile").val(a)
                sendWordProcess($("#inputWordFile").val())
            }else{
                alert("Select a doc file!")
                $("#formFields").html("")
                $("#inputWordFile").val("")
            }
        });
    })

    $("#saveWordFile").click(function(){
        let rvalue = sendSaveDialog()
        rvalue.then((a) => {
            if(a!="")
                $("#saveFileName").val(a)
            else{
                alert("Select a doc file!")
                $("#formFields").html("")
                $("#saveFileName").val("")
            }
        });
    })

    $("#processWordFile").click(function(){
        if($("#inputWordFile").val()!="")
            sendWordProcess($("#inputWordFile").val())
        else{
            alert("Select a doc file!")
        }
    })

    $("#generateFileForm").submit(function(){

        if($( "div#formFields > input.form-control.my-1" ).length < 1){
            alert("Process a word file!")
            return
        }

        let data = {}

        $( "div#formFields > input.form-control.my-1" ).each(function() {
            data[$(this).attr("placeholder")]=$(this).val()
        });

        sendGenerateFile($("#inputWordFile").val(),data,$("#saveFileName").val())

    })

   
    $("#resetWordFile").click(function(){
        location.reload();
    })
    
});