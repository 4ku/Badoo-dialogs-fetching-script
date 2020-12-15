var dialogs = [];
var dialog_num = 0;

function getMessages(){
    var messages = [];
    m = document.getElementsByClassName("message")
    for(i = 0; i < m.length; i++){
       if (m[i].className.includes("message--in") || m[i].className.includes("message--out")){
           message_content = m[i].getElementsByClassName("message__content")[0]
           var text = "";
//         sticker 
           if(message_content.getElementsByClassName("sticker")[0] !== undefined){
               text = "sticker";
           } 
//         gif or video
           else if(message_content.getElementsByTagName("video")[0] !== undefined) {
               text = "gif";
           }
//         photo 
           else if(message_content.getElementsByTagName("img")[0] !== undefined) {
               text = "photo";
           } 
//         usual text message
           else if (message_content.getElementsByClassName("p-2 text-break-words")[0] !== undefined){
                text = message_content.getElementsByClassName("p-2 text-break-words")[0].innerText;
                //most likely this is audio message
                if(text === "Sorry, this type of message is not supported"){
                    text = "audio";
                }
           } 
//         other type of messages
           else {
               text = "undefined";
           }
           
           if (m[i].className.includes("message--out")){
               messages.push({"out":text});
           } else {
               messages.push({"in":text});
           }
        } 
    }
    dialogs.push(messages);
}

function getDialog(resolve) {
    var prev_num = -1;
    var num = -1;
    function scroll(){
        prev_num = num
        num = document.getElementsByClassName("message").length
        if(num!=prev_num){
            document.getElementById("messages").scrollIntoView();
            setTimeout(scroll, 750);
        }  else {
            getMessages();
            console.log("Dialog №" + (dialog_num).toString() + " is finished");
            if (dialog_num < girls.length){ 
                click(resolve);
            } else{
                resolve();
            }
        }
    }
    scroll();

}

function click(resolve){
    girls[dialog_num++].click();
    setTimeout(getDialog, 1200, resolve);
}

function scrollDialogs() {
    return new Promise(resolve => {
        var prev_num = -1;
        var num = -1;
        function scroll(){
            prev_num = num
            num = document.getElementsByClassName("contact-card").length
            if(num!=prev_num){
                girls = document.getElementsByClassName("contacts__item")
                girls[girls.length-1].scrollIntoView()
                setTimeout(scroll, 650);
            }  else {
                resolve();
            }
        }
        scroll();
    });
}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


scrollDialogs()
.then(() => {
    girls = document.getElementsByClassName("contact-card")
    return new Promise(resolve => {
        click(resolve);
    });
})
.then(() => {
  downloadObjectAsJson(dialogs, "dialogs");
})


