(function(){
  // active nav
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    if(a.getAttribute("href") === path){
      a.style.background = "rgba(0,0,0,.05)";
      a.style.color = "#0c0c0c";
      a.style.textDecoration = "none";
    }
  });

  // lightbox
  const items = document.querySelectorAll(".gItem img");
  if(!items.length) return;

  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.innerHTML = '<img alt="Expanded project photo">';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");

  const open = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt || "Project photo";
    lb.style.display = "flex";
  };
  const close = () => { lb.style.display = "none"; lbImg.src = ""; };

  lb.addEventListener("click", close);
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") close(); });

  items.forEach(img=>{
    img.addEventListener("click", ()=>{
      open(img.getAttribute("data-full") || img.src, img.alt);
    });
  });
})();