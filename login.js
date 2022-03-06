// main.js

const serverUrl = "https://6thwxfwcdmhf.usemoralis.com:2053/server";
const appId = "vs0g4jMVvYwMO27KJ7G0XB2czwTK8JetVwtdB5Vv";
Moralis.start({ serverUrl, appId });

/** Add from here down */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "Hello World!" })
      console.log(user.get('ethAddress'))
      location.reload();
   } catch(error) {
     console.log(error)
   }
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
  location.reload();
}



document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;