const plans=[
  [5000,20000],[10000,40000],[15000,60000],[20000,80000],[25000,100000],
  [30000,120000],[35000,140000],[40000,160000],[45000,180000],[50000,200000]
];
const $=id=>document.getElementById(id);
const money=n=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
let state={email:"demo@example.com",balance:0,invested:0,returns:0,active:0,transactions:[]};
let register=false;

function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2600)}
function renderPlans(){
  $("plansGrid").innerHTML=plans.map((p,i)=>`<article class="plan ${i===9?"featured":""}">
    <span class="tag">24 HOURS • SIMULATED</span><h3>${money(p[0])}</h3>
    <small>Demo return</small><div class="return">${money(p[1])}</div>
    <button class="primary" data-plan="${i}">Select Plan</button>
  </article>`).join("");
  document.querySelectorAll("[data-plan]").forEach(b=>b.onclick=()=>openAuth("login"));
}
function openAuth(mode){register=mode==="register";$("authModal").classList.remove("hidden");setAuth()}
function setAuth(){
  $("authTitle").textContent=register?"Create Demo Account":"Welcome Back";
  $("authSub").textContent=register?"Create a browser-only demo account.":"Sign in to the demo dashboard.";
  $("authSubmit").textContent=register?"Register":"Sign In";
  $("switchText").textContent=register?"Already have an account?":"Don't have an account?";
  $("switchAuth").textContent=register?"Sign In":"Register";
}
function openDashboard(){
  $("authModal").classList.add("hidden");$("admin").classList.add("hidden");$("dashboard").classList.remove("hidden");
  $("userEmail").textContent=state.email;renderDash();window.scrollTo(0,0);
}
function renderDash(){
  $("dashBalance").textContent=money(state.balance);
  $("dashInvested").textContent=money(state.invested);
  $("dashReturns").textContent=money(state.returns);
  $("dashActive").textContent=state.active;
  $("dashPlans").innerHTML=plans.map((p,i)=>`<div class="dash-plan"><div><h4>${money(p[0])}</h4><p>24 hour simulated plan</p></div><div><strong>${money(p[1])}</strong><br><button class="ghost" data-dash-plan="${i}">Select</button></div></div>`).join("");
  document.querySelectorAll("[data-dash-plan]").forEach(b=>b.onclick=()=>{
    const p=plans[Number(b.dataset.dashPlan)];
    state.invested+=p[0];state.returns+=p[1]-p[0];state.active++;
    state.transactions.unshift({type:"Plan selected",amount:p[0],date:new Date().toLocaleString()});
    renderDash();toast("Simulated plan added.");
  });
  $("transactions").innerHTML=state.transactions.length?state.transactions.map(t=>`<div class="tx"><div><strong>${t.type}</strong><small>${t.date}</small></div><strong class="${t.type.includes("Withdrawal")?"negative-text":"positive-text"}">${money(t.amount)}</strong></div>`).join(""):'<p class="empty">No demo transactions yet.</p>';
}
document.querySelectorAll("[data-open-auth]").forEach(b=>b.onclick=()=>openAuth(b.dataset.openAuth));
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).classList.add("hidden"));
$("switchAuth").onclick=()=>{register=!register;setAuth()};
$("showPass").onclick=()=>{$("authPassword").type=$("authPassword").type==="password"?"text":"password";$("showPass").textContent=$("showPass").textContent==="Show"?"Hide":"Show"};
$("authForm").onsubmit=e=>{
  e.preventDefault();const email=$("authEmail").value.trim(),pass=$("authPassword").value;
  if(!email||pass.length<6)return toast("Enter a valid email and a password of at least 6 characters.");
  state.email=email;openDashboard();toast(register?"Demo account created.":"Demo sign in successful.");
};
$("demoEntry").onclick=()=>openDashboard();
$("logoutBtn").onclick=()=>{$("dashboard").classList.add("hidden");window.scrollTo(0,0);toast("Logged out of demo.")};
$("depositBtn").onclick=()=>{
  const n=Number($("depositAmount").value);if(n<=0)return toast("Enter a valid demo amount.");
  state.balance+=n;state.transactions.unshift({type:"Simulated Deposit",amount:n,date:new Date().toLocaleString()});
  $("depositAmount").value="";renderDash();toast("Simulated balance updated.");
};
$("withdrawBtn").onclick=()=>{
  const n=Number($("withdrawAmount").value);if(n<=0)return toast("Enter a valid demo amount.");
  if(n>state.balance)return toast("Demo withdrawal exceeds simulated balance.");
  state.balance-=n;state.transactions.unshift({type:"Demo Withdrawal Request",amount:n,date:new Date().toLocaleString()});
  $("withdrawAmount").value="";renderDash();toast("Demo withdrawal request created.");
};
$("copyBtc").onclick=()=>{navigator.clipboard?.writeText($("btc").value);toast("Demo BTC address copied.")};
$("adminBtn").onclick=()=>{$("dashboard").classList.add("hidden");$("admin").classList.remove("hidden");window.scrollTo(0,0)};
$("backDash").onclick=()=>openDashboard();
$("dashSupport").onclick=()=>toast("Demo support form opened.");
document.querySelectorAll("[data-modal]").forEach(a=>a.onclick=e=>{
  e.preventDefault();const type=a.dataset.modal;
  const content={
    terms:["Terms & Conditions","This is a fictional visual demo. No real investment contract, account, payment service, or financial product is created by this website."],
    privacy:["Privacy Policy","This static demo does not transmit registration, transaction, payment, or identity data to a server. Information entered is used only in the browser during the demo session."],
    risk:["Risk Disclosure","The displayed investment amounts and returns are fictional placeholders. Real investments involve risk and actual financial services require appropriate legal, regulatory, security, and operational infrastructure."]
  }[type];
  $("legalTitle").textContent=content[0];$("legalBody").innerHTML=`<p>${content[1]}</p><p>For a real financial service, these documents must be replaced with legally reviewed, jurisdiction-appropriate documents.</p>`;$("legalModal").classList.remove("hidden");
});
$("menuBtn").onclick=()=>toast("Use the section links on desktop; mobile navigation can be added in the next revision.");
renderPlans();
