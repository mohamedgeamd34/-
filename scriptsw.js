const games = [
  {id:"gta-sa",title:"GTA: San Andreas",size:"1.8 GB",genre:"مغامرة",desc:"نسخة مضغوطة من GTA: San Andreas تعمل على ويندوز.",thumb:"thumbs/gta-sa.jpg",file:"https://archive.org/details/gta-san-andreas-1"},
  {id:"need-for-speed",title:"Need For Speed: Most Wanted",size:"2.4 GB",genre:"سباق",desc:"نسخة مضغوطة من NFS Most Wanted.",thumb:"thumbs/nfs.jpg",file:"downloads/nfs-most-wanted.zip"},
  {id:"minecraft-pc",title:"Minecraft (Launcher)",size:"0.5 GB",genre:"بناء",desc:"نسخة للكمبيوتر مع ملفات تثبيت.",thumb:"thumbs/minecraft.jpg",file:"downloads/minecraft.zip"},
  {id:"far-cry",title:"Far Cry 3",size:"4.2 GB",genre:"اطلاق نار",desc:"نسخة مضغوطة من Far Cry 3.",thumb:"thumbs/fc3.jpg",file:"downloads/farcry3.zip"}
];
const PAGE_SIZE = 8;
let currentPage = 1;
let currentGames = [...games];
const grid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const resultsCount = document.getElementById("resultsCount");
const pagination = document.getElementById("pagination");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const closeModal2 = document.getElementById("closeModal2");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalThumb = document.getElementById("modalThumb");
const modalSize = document.getElementById("modalSize");
const modalGenre = document.getElementById("modalGenre");
const downloadBtn = document.getElementById("downloadBtn");
function populateCategories(){
  const genres = Array.from(new Set(games.map(g=>g.genre)));
  genres.forEach(g=>{
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    categoryFilter.appendChild(opt);
  });
}
populateCategories();
function render(){
  const start = (currentPage-1)*PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = currentGames.slice(start,end);
  grid.innerHTML = "";
  if(pageItems.length === 0){
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--muted)">لا توجد ألعاب لعرضها.</div>`;
  } else {
    pageItems.forEach(g=>{
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img class="thumb" src="${g.thumb}" alt="${g.title} صورة" loading="lazy"/>
        <div class="card-body">
          <h3 class="title">${g.title}</h3>
          <div class="meta"><span>${g.size}</span><span>•</span><span>${g.genre}</span></div>
          <div class="actions">
            <a class="btn" href="#" data-id="${g.id}" role="button">تفاصيل</a>
            <a class="btn download" href="${g.file}" download>تحميل</a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  resultsCount.textContent = `${currentGames.length} لعبة`;
  renderPagination();
  bindDetailButtons();
}
function bindDetailButtons(){
  document.querySelectorAll('.card .btn[data-id]').forEach(btn=>{
    btn.onclick = (e)=>{
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      openModal(id);
    };
  });
}
function openModal(id){
  const g = games.find(x=>x.id===id);
  if(!g) return;
  modalTitle.textContent = g.title;
  modalDesc.textContent = g.desc;
  modalThumb.src = g.thumb;
  modalThumb.alt = g.title + " صورة";
  modalSize.textContent = g.size;
  modalGenre.textContent = g.genre;
  downloadBtn.href = g.file;
  downloadBtn.setAttribute('download','');
  modal.setAttribute('aria-hidden','false');
}
function closeModalFn(){
  modal.setAttribute('aria-hidden','true');
}
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;
  currentGames = games.filter(g=>{
    const matchesQ = q === "" || (g.title + " " + g.desc + " " + g.genre).toLowerCase().includes(q);
    const matchesCat = cat === "all" || g.genre === cat;
    return matchesQ && matchesCat;
  });
  currentPage = 1;
  render();
}
function renderPagination(){
  pagination.innerHTML = "";
  const totalPages = Math.max(1, Math.ceil(currentGames.length / PAGE_SIZE));
  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement("button");
    btn.className = "page-btn";
    btn.textContent = i;
    if(i === currentPage){
      btn.style.background = "rgba(255,255,255,0.04)";
      btn.disabled = true;
    }
    btn.onclick = ()=>{ currentPage = i; render(); };
    pagination.appendChild(btn);
  }
}
searchInput.addEventListener('input', ()=>{ applyFilters(); });
categoryFilter.addEventListener('change', ()=>{ applyFilters(); });
closeModal.addEventListener('click', closeModalFn);
closeModal2.addEventListener('click', closeModalFn);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModalFn(); });
document.addEventListener('keydown', (e)=>{ if(e.key === "Escape") closeModalFn(); });
render();

