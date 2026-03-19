let memberInfo;
window.addEventListener('load', async function (){
    init();
    if(localStorage.getItem('postgram')){
        displayUserInfo(localStorage.getItem('postgram'));
    }else{
        // 初始化和使用 google.accounts.id 的代碼
        google.accounts.id.initialize({
            client_id: '575527734855-07an02o2nqore7i6775mk6fnt4p0dhee',
            callback: onGoogleSignIn
        });
        google.accounts.id.prompt();
        google.accounts.id.renderButton(document.getElementById("signinDiv"), {
            theme: 'outline',
            size: 'medium',
            text: 'signin'
        });
    }
})

// Google 登入成功後的回調函數
async function onGoogleSignIn(response) {
    const decodedToken = await decodeJwtResponse(response.credential);
    localStorage.setItem('postgram', decodedToken);
    await displayUserInfo(decodedToken);
    document.getElementById('signinDiv').style.display = 'none';
}

async function decodeJwtResponse(credential) {
    let method = {
        method: "POST",
        headers: {
            'content-Type': 'application/octet-stream; charset=utf-8',
        },
        body: credential, 
    }
    let member_tk_data = await fetch('/api/login', method);
    let member_tk = await member_tk_data.json();
    return member_tk['custom_token'];
}

async function displayUserInfo(token) {
    let method = {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    let userData = await fetch('/api/login', method);
    let userDataJson = await userData.json();
    if(userDataJson['error']){
        signOut();
    }
    console.log('name',userDataJson.name);
    console.log('email',userDataJson.email);
    console.log('picture',userDataJson.picture);
    memberInfo = {
        'name': userDataJson.name,
        'email': userDataJson.email,
        'picture': userDataJson.picture
    }
    let memberIMG = document.createElement('div');
    memberIMG.id = "memberIMG";
    memberIMG.style.width = '50px';
    memberIMG.style.height = '50px';
    memberIMG.style.borderRadius = '50%';
    memberIMG.style.backgroundImage = `url('${userDataJson.picture}')`;
    memberIMG.style.backgroundSize = 'contain';
    document.querySelector('#welcome').appendChild(memberIMG);
    memberIMG.addEventListener('click',()=>{
        let signoutBTN = document.createElement('div');
        signoutBTN.id = "signout";
        signoutBTN.textContent = "登出";
        signoutBTN.setAttribute('style','position: absolute;bottom:-15px;right:-15px;background-color: #e8e8e8;padding:2px 5px;cursor: pointer;')
        document.querySelector('.nav').appendChild(signoutBTN);
        signoutBTN.addEventListener('click', () => signOut());
    })
}

function signOut() {
    localStorage.removeItem('postgram');
    setTimeout(()=>{
        location.reload();
    },500)
}

document.querySelector("#share").addEventListener('click',async()=>{
    const formData = new FormData();
    let inputFile = document.querySelector("#fileImg").files[0];
    const addText = document.querySelector("#fileInput");
    formData.append('name', memberInfo.name);
    formData.append('picture', memberInfo.picture);
    formData.append('photo', inputFile);
    formData.append('text', addText.value);
    let store = await fetch("/api/message",
        {method: "POST",
        body: formData,
        }
    )
    let result = await store.json();
    console.log(result);
    // storeMessage(formData);

    messageRecord(memberInfo.name, memberInfo.picture, document.getElementById('previewImg').src, addText.value);
    const shield = document.querySelector('#shield');
    document.querySelector("body").removeChild(shield);
    document.querySelector(".file").setAttribute('style',`display:none`);
})
