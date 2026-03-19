//產生遮幕
function createShield(){
    const shield= document.createElement('div');
    const setShieldStyle = "position:fixed;top:0px;width:100%;height:100%;z-index:2;background-color:rgba(0,0,0,0.5)";
    shield.setAttribute('style',`${setShieldStyle}`);
    shield.setAttribute('id',"shield");
    document.querySelector('body').appendChild(shield);
    shield.addEventListener('click',removeFile)
}
//使遮幕及表單消失
function removeFile(){
    const shield = document.querySelector("#shield");
    document.querySelector('body').removeChild(shield);
    document.querySelector(".file").setAttribute('style',"display:none;");
    document.querySelector(".fileUpload").setAttribute('style',"display:flex;");
    document.getElementById('previewImg').setAttribute('style',"display:none;");
}
//建立留言監聽事件
document.querySelector("#add").addEventListener('click',()=>{
    document.querySelector(".file").setAttribute('style',"display:flex;");
    const messageInput = document.querySelector('#fileInput');
    messageInput.setAttribute('placeholder',"請幫這張照片做一些說明");
    messageInput.addEventListener('click',()=>{
    messageInput.setAttribute('placeholder',"");
    })
    createShield();
})

//獲取新留言放入的相片資訊
document.querySelector("#fileImg").addEventListener('change', async function() {
    const file = this.files[0];
    let src = await loadFile(file);
    // let img = await loadImage(src); //將src轉為圖片
    // let square = getBase64(img);
    // src = square.src;
    document.querySelector(".fileUpload").style.display = 'none';
    document.getElementById('previewImg').src = src;
    document.getElementById('previewImg').style= "display:block;width:400px;height:300px;object-fit:cover";
})
function loadFile(file){
    return new Promise((resolve,reject)=>{
        let reader = new FileReader();
        reader.onload = ()=>resolve(reader.result);
        reader.error = reject;
        reader.readAsDataURL(file);
    })
}
function loadImage(src){
    return new Promise((resolve,reject)=>{
        let img = new Image();
        img.onload = ()=>resolve(img);
        img.error = reject;
        img.src = src;
    })
}
function getBase64(img){
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let {width, height} = img;
    if(width/height > 4/3){
        let scale = 400/width;
        canvas.width = width * scale;
        canvas.height = height * scale;
    }else{
        let scale = 300/height;
        canvas.width = width * scale;
        canvas.height = height * scale;
    }  
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return {src:canvas.toDataURL()}
}
//存取新留言
async function storeMessage(formData){
    let store = await fetch("/api/message",
        {method: "POST",
        body: formData,
        }
    )
    let result = await store.json();
    console.log(result);
}

//建立頁面動態留言
function messageRecord(account, picture, img_src, messageText){
    const userphoto = document.createElement('img');
    userphoto.setAttribute('class',"userphoto");
    userphoto.setAttribute('src',`${picture}`);
    const username = document.createElement('span');
    username.setAttribute('class',"username bold");
    username.textContent = account;
    const usernav = document.createElement('div');
    usernav.setAttribute('class',"usernav");
    usernav.appendChild(userphoto);
    usernav.appendChild(username);

    const usercontain = document.createElement('div');
    usercontain.setAttribute('class',"usercontain");
    const messageImg = document.createElement('img');
    messageImg.setAttribute('class',"messageImg");
    messageImg.setAttribute('src',img_src)
    const message = document.createElement('div');
    message.setAttribute('class',"message");
    const text = document.createElement('span');
    text.setAttribute('class',"text");
    text.textContent = messageText;
    const usernameClone = username.cloneNode(true);
    message.appendChild(usernameClone);
    message.appendChild(text);
    usercontain.appendChild(messageImg);
    usercontain.appendChild(message);

    const messageRecord = document.createElement('div');
    messageRecord.setAttribute('class',"messageRecord");
    messageRecord.appendChild(usernav);
    messageRecord.appendChild(usercontain);

    document.querySelector(".container").appendChild(messageRecord);
}
messageRecord("zhou","../static/image/user.png", "../static/image/testPhoto.jpg","悠閒午後 輕鬆隨手畫");
messageRecord("zhou","../static/image/user.png", "../static/image/testPhoto_2.jpg","你的幸運貓貓來了!!!");

async function init(){
    let records = await fetch("/api/record",
        {method: "GET",headers: {"Content-Type": "application/json"}}
    )
    let recordJSON = await records.json();
    for(let record in recordJSON){
        console.log(recordJSON[record]);
        messageRecord(recordJSON[record]['member_name'], recordJSON[record]['picture'], recordJSON[record]['photo'], recordJSON[record]['text']);
    }
}

