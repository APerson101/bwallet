import type {DappConnection, Ltoken} from "$lib/utils";
import {initializeApp} from "firebase/app";
import {addDoc, collection, deleteDoc, doc, getDocs, getFirestore, limit, query, where} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVFCupMmaVh6B7HjPBYONMOw9dXSdT7tU",
  authDomain: "healthstartup-39ec6.firebaseapp.com",
  projectId: "healthstartup-39ec6",
  storageBucket: "healthstartup-39ec6.appspot.com",
  messagingSenderId: "615511440975",
  appId: "1:615511440975:web:c86ad2b31ea48d07e0743a"
};

const app = initializeApp(firebaseConfig);
const db= getFirestore(app);
export async function getUserData(wallet:string)
{
  const data:unknown[]=[];
    const snapshot=await getDocs(collection(db, wallet))
    for (let index = 0; index < snapshot.docs.length; index++) {
      const doc = snapshot.docs[index];
      data.push({wallet:doc.data()})
  }
  console.log(data);
  return data;
}

// const getAddressTxns="{
//   address(hash: "0xFC43fD057583DFda0aB376f0A9865E702AA70344") {
//     hash
//     transactions(first: 10) {
//                   edges {
//               node {
//           value
//           from_address_hash
//           to_address_hash
//         }
//       }

//     }
//   }
// }"

// address: 0xE6561f47cEf2f8c146bC421abDE3040A0C7158Ba
// pk: 0xa1c64b5982ca803c103e74de1cdabe71736a90704e305bd3209189375ab34ce5

// address2: 0xFC43fD057583DFda0aB376f0A9865E702AA70344
// pk: 0xd367b71d54781c4577b95634791fc003769005b909cff1e6e0d383e48ab49e08
export async function removeActivity(wallet: string, documentId:string)
{
await deleteDoc(doc(db, wallet, documentId));
}

export async function saveTxnToDB(sender:string, receiver:string, amount:string) {
  await addDoc(collection(db, `transactions/${sender}/transactions`), {
    sender:sender,
    receiver:receiver,
    amount:amount,
    date: Date.now()
})
}

export async function addSavingsContract(savingsContract: string, address: string, token: Ltoken, )
{
await addDoc(collection(db, `savings/${address}/${savingsContract}`), token);
}
export async function getSavingstokens(address: string, savingsContracts: string, released?: boolean)
{
const savings=[]
  const q = query(collection(db, `savings/${address}/${savingsContracts}`));
  const snapshot=await getDocs(q)
  for (let index = 0; index < snapshot.docs.length; index++) {
    const doc = snapshot.docs[index];
    savings.push(doc.data() as Ltoken)
  }
  if(released)
  {
    return savings.filter((token)=>parseInt(token.releaseDate)<Date.now())
  }
  return savings;
}


export async function getInfoForTopics(address:string, topics:string[])
{
  const dappData: DappConnection []=[];
  for (let index = 0; index < topics.length; index++) {
    const topic = topics[index];
const q =query(collection(db, address), where('topic','==',topic), limit(1));
const snapshot=await getDocs(q)
dappData.push(snapshot.docs[0].data() as DappConnection)
  }
  return dappData;
}

export async function saveTopicToAddress(address:string,data:DappConnection)
{
  console.log('saving the following address', address);
  await addDoc(collection(db, address), data);
}




[
  {
    "token_instance": {
      "is_unique": true,
      "id": "431",
      "holder_address_hash": "0x394c399dbA25B99Ab7708EdB505d755B3aa29997",
      "image_url": "example.com/picture.png",
      "animation_url": "example.com/video.mp4",
      "external_app_url": "d-app.com",
      "metadata": {
        "year": 2023,
        "tags": [
          "poap",
          "event"
        ],
        "name": "Social Listening Committee #2 Attendees",
        "image_url": "https://assets.poap.xyz/chanel-poap-4c-2023-logo-1675083420470.png",
        "home_url": "https://app.poap.xyz/token/6292128",
        "external_url": "https://api.poap.tech/metadata/99010/6292128",
        "description": "This is the POAP for attendees of the second Social Listening Committee.",
        "attributes": [
          {
            "value": "01-Feb-2023",
            "trait_type": "startDate"
          },
          {
            "value": "01-Feb-2023",
            "trait_type": "endDate"
          },
          {
            "value": "false",
            "trait_type": "virtualEvent"
          },
          {
            "value": "Paris",
            "trait_type": "city"
          },
          {
            "value": "France",
            "trait_type": "country"
          },
          {
            "value": "https://www.chanel.com",
            "trait_type": "eventURL"
          }
        ]
      },
      "owner": {
        "hash": "0xEb533ee5687044E622C69c58B1B12329F56eD9ad",
        "implementation_name": "implementationName",
        "name": "contractName",
        "is_contract": true,
        "private_tags": [
          {
            "address_hash": "0xEb533ee5687044E622C69c58B1B12329F56eD9ad",
            "display_name": "name to show",
            "label": "label"
          }
        ],
        "watchlist_names": [
          {
            "display_name": "name to show",
            "label": "label"
          }
        ],
        "public_tags": [
          {
            "address_hash": "0xEb533ee5687044E622C69c58B1B12329F56eD9ad",
            "display_name": "name to show",
            "label": "label"
          }
        ],
        "is_verified": true
      },
      "token": {
        "circulating_market_cap": "83606435600.3635",
        "icon_url": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        "name": "Tether USD",
        "decimals": "6",
        "symbol": "USDT",
        "address": "0x394c399dbA25B99Ab7708EdB505d755B3aa29997",
        "type": "ERC-20",
        "holders": "837494234523",
        "exchange_rate": "0.99",
        "total_supply": "10000000"
      }
    },
    "value": "10000",
    "token_id": "123",
    "token": {
      "name": "Tether USD",
    }}]




