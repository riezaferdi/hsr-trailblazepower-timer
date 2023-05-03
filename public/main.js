const DEBUG = false;
const RESIN_LIMIT = 180;
const RECHARGE_INTERVAL = 6;    //minutes; also update html input max="" if changed

//Main
document.querySelector("#resin").focus();
function calculate(resin, start_time){
    const time_diff = parseInt(Math.abs(new Date().getTime() - start_time.getTime()) / 1000);
    const minutes_to_refill = (RESIN_LIMIT - resin) * RECHARGE_INTERVAL;

    const H_start = parseInt(minutes_to_refill / 60);
    const M_start = parseInt(minutes_to_refill % 60);
    const cur_res = parseInt(time_diff / (60 * RECHARGE_INTERVAL) + parseInt(resin));
    const H_cur = parseInt((minutes_to_refill - time_diff / 60) / 60);
    const M_cur = parseInt((minutes_to_refill - time_diff / 60) % 60);
    const S_cur = (cur_res < RESIN_LIMIT ? parseInt((minutes_to_refill * 60 - time_diff) % 60) : 0);
	const M_rep = parseInt(RECHARGE_INTERVAL - (time_diff/ 60) % 6);

    if(DEBUG)   console.log({minutes_to_refill}, {time_diff});
    if(H_start < 0 || M_start < 0 || H_cur < 0 || M_cur < 0 || cur_res > RESIN_LIMIT) return;

    document.querySelector("#current_resin").innerHTML = cur_res;
	
	if(cur_res == RESIN_LIMIT){
			document.querySelector("#addone_resin").innerHTML =  M_cur + "m " + S_cur + "s";
			notif();
	}else{
			document.querySelector("#addone_resin").innerHTML =  M_rep + "m " + S_cur + "s";	
	}
    document.querySelector("#refill_time").innerHTML =  H_cur + "h " + M_cur + "m " + S_cur + "s";

    document.querySelector("#refill_date").innerHTML = moment(start_time).add(H_start, "hours").add(M_start, "minutes").format("LT");
	//if(cur_res == RESIN_LIMIT){
    //    notif();
    //}
    document.title =  cur_res + " Resin | " + H_cur + "h " + M_cur + "m " + " left";

    let titles = document.getElementsByClassName("title_top");
    for (let i = 0; i < titles.length; i++) {
        titles[i].style.visibility = "visible";
    }
}

//function of notification
function notif(){
	const notify = new Notification('Hi there!', {
        body: "Your Trailblaze Power is Full!",
        icon: 'https://static.wikia.nocookie.net/houkai-star-rail/images/7/7a/Item_Trailblaze_Power.png'
    })
}

//Loop
var refresh;
function calculateInit(){
	//notification permission
	Notification.requestPermission();

    let resin_obj = document.querySelector("#resin");
    const resin = resin_obj.value;
    if(resin < 0 || resin > RESIN_LIMIT || resin == "") return;
    
    clearInterval(refresh);
    const start_time = new Date();
    calculate(resin, start_time);
    refresh = setInterval(function(){calculate(resin, start_time)}, 1000);
    resin_obj.value = "";
}

//On enter key press 
document.querySelector("#resin").onkeypress=function(e){
    if(e.keyCode==13){
        calculateInit();
    }
}