"use strict";
const crypto=require("node:crypto");
const ALPHABET="ABCDEFGHJKLMNPQRSTUVWXYZ";
const uid=()=>crypto.randomBytes(12).toString("hex");
function makeRoomCode(rooms=new Map()){for(let n=0;n<100;n++){let c="";for(let i=0;i<4;i++)c+=ALPHABET[crypto.randomInt(ALPHABET.length)];if(!rooms.has(c))return c;}throw Error("Room codes exhausted");}
function cleanName(s){return String(s||"").replace(/[<>]/g,"").trim().slice(0,18);}
function createPlayer(name,socketId){return{id:uid(),name:cleanName(name),score:0,best:null,connected:true,socketId,resumeToken:uid(),falseStarts:0};}
const MODES={classic:{label:"CLASSIC",rounds:5,description:"Five rounds. Balanced scoring."},sudden:{label:"SUDDEN DEATH",rounds:1,description:"One signal. One chance. One crown."},marathon:{label:"MARATHON",rounds:10,description:"Ten rounds. Consistency wins."}};
function normalizeMode(mode){return Object.hasOwn(MODES,mode)?mode:"classic";}
function createRoom(code,p,mode="classic"){const selected=normalizeMode(mode);return{code,hostId:p.id,players:new Map([[p.id,p]]),phase:"lobby",mode:selected,modeLabel:MODES[selected].label,round:0,totalRounds:MODES[selected].rounds,roundResults:[],deadline:null,goAt:null,timer:null,message:"Waiting for your crew.",lastRound:null,matchId:null};}
function scoreReaction(ms){if(!Number.isFinite(ms)||ms<0)return 0;if(ms<180)return 100;if(ms<250)return 90;if(ms<350)return 80;if(ms<500)return 65;if(ms<750)return 50;if(ms<1000)return 35;if(ms<1500)return 20;return 10;}
function reactionBand(ms){if(ms==null)return"No valid reaction";if(ms<180)return"INHUMAN";if(ms<250)return"LIGHTNING";if(ms<350)return"ELITE";if(ms<500)return"SHARP";if(ms<750)return"QUICK";if(ms<1000)return"WARMING UP";return"SLOW BURN";}
function rankPlayers(players){return[...players.values()].sort((a,b)=>b.score-a.score||(a.best??Infinity)-(b.best??Infinity)||a.name.localeCompare(b.name)).map((p,i)=>({rank:i+1,id:p.id,name:p.name,score:p.score,best:p.best,connected:p.connected,falseStarts:p.falseStarts,streak:p.streak||0,maxStreak:p.maxStreak||0}));}
function publicState(room,viewerId){const me=room.players.get(viewerId);return{code:room.code,phase:room.phase,mode:room.mode,modeLabel:room.modeLabel,totalRounds:room.totalRounds,round:room.round,hostId:room.hostId,myId:viewerId,players:rankPlayers(room.players),deadline:room.deadline,goAt:room.goAt,message:room.message,canStart:viewerId===room.hostId&&[...room.players.values()].filter(p=>p.connected).length>=2&&room.phase==="lobby",myResult:me?me._roundResult||null:null,roundResults:["results","gameover"].includes(room.phase)?room.lastRound?.results||[]:[],matchHistory:room.phase==="gameover"?room.roundResults.map(x=>({round:x.round,results:x.results})):[],matchId:room.matchId,lastRoundNumber:room.lastRound?.round||null};}
module.exports={makeRoomCode,cleanName,createPlayer,createRoom,scoreReaction,reactionBand,rankPlayers,publicState,MODES,normalizeMode};
