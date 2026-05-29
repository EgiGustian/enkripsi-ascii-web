const DB = [];
for(let i=32;i<=126;i++){
  let cat='simbol';
  if(i===32) cat='spasi';
  else if(i>=48&&i<=57) cat='angka';
  else if(i>=65&&i<=90) cat='huruf besar';
  else if(i>=97&&i<=122) cat='huruf kecil';
  DB.push({char:String.fromCharCode(i),dec:i,bin:i.toString(2).padStart(8,'0'),cat});
}

function toASCII(ch){
  const c=ch.charCodeAt(0);
  if(c>=32&&c<=126) return {dec:c,bin:c.toString(2).padStart(8,'0')};
  return {dec:c,bin:c.toString(2).padStart(8,'0')};
}

let currentTab='visual';

function switchTab(t){
  document.querySelectorAll('.tab').forEach((el,i)=>{
    el.classList.toggle('active',['visual','full','db'][i]===t);
  });
  document.getElementById('tab-visual').classList.toggle('show',t==='visual');
  document.getElementById('tab-full').classList.toggle('show',t==='full');
  document.getElementById('tab-db').classList.toggle('show',t==='db');
  currentTab=t;
}

function clearInput(){
  document.getElementById('txtInput').value='';
  render('');
}

function render(txt){
  const chars=[...txt];
  document.getElementById('st-chars').textContent=chars.length;
  document.getElementById('st-words').textContent=txt.trim()===''?0:txt.trim().split(/\s+/).length;
  document.getElementById('st-bits').textContent=chars.length*8;

  const grid=document.getElementById('charGrid');
  if(!chars.length){
    grid.innerHTML='<div class="empty"><i class="ti ti-keyboard" aria-hidden="true"></i><br>Belum ada teks</div>';
  } else {
    grid.innerHTML=chars.map(ch=>{
      const {dec,bin}=toASCII(ch);
      const disp=ch===' '?'&nbsp;':ch;
      return `<div class="char-box">
        <span class="cb-label">chr</span>
        <span class="cb-char">${ch===' '?'␣':ch}</span>
        <span class="cb-label">dec</span>
        <span class="cb-dec">${dec}</span>
        <span class="cb-label">bin</span>
        <span class="cb-bin">${bin}</span>
      </div>`;
    }).join('');
  }

  const fv=document.getElementById('fullView');
  if(!chars.length){
    fv.innerHTML='<span style="color:var(--color-text-tertiary)">Ketik teks untuk melihat hasil lengkap…</span>';
    return;
  }
  const origLine=`<span class="lbl">Teks asli</span><span class="val">${txt.replace(/</g,'&lt;')}</span>`;
  const decLine=`<span class="lbl">Kode DEC</span><span class="val dec">${chars.map(c=>toASCII(c).dec).join('  ')}</span>`;
  const binLine=`<span class="lbl">Kode Biner</span><span class="val bin">${chars.map(c=>toASCII(c).bin).join(' ')}</span>`;
  fv.innerHTML=origLine+'\n'+decLine+'\n'+binLine;
}

function copyFull(){
  const txt=document.getElementById('txtInput').value;
  if(!txt) return;
  const chars=[...txt];
  const out=`Teks   : ${txt}\nDEC    : ${chars.map(c=>toASCII(c).dec).join(' ')}\nBiner  : ${chars.map(c=>toASCII(c).bin).join(' ')}`;
  navigator.clipboard.writeText(out).catch(()=>{});
  const b=document.querySelector('.copy-btn');
  b.textContent='Tersalin!';
  setTimeout(()=>b.innerHTML='<i class="ti ti-copy"></i> Salin',1500);
}

function buildDB(){
  const tbody=document.getElementById('dbBody');
  tbody.innerHTML=DB.map(r=>`<tr><td>${r.char===' '?'(spasi)':r.char}</td><td>${r.dec}</td><td>${r.bin}</td><td>${r.cat}</td></tr>`).join('');
}

function filterDB(){
  const q=document.getElementById('dbSearch').value.toLowerCase();
  const rows=document.querySelectorAll('#dbBody tr');
  rows.forEach(r=>{
    r.style.display=r.textContent.toLowerCase().includes(q)?'':'none';
  });
}

document.getElementById('txtInput').addEventListener('input',e=>render(e.target.value));
buildDB();

// render('Hari Jumat');
// document.getElementById('txtInput').value='Hari Jumat';