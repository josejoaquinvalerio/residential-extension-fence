'use strict';
const drawingSets = {
  "full": {
    "title": "Full project plans",
    "status": "DRAFT CLIENT REVIEW",
    "initial": 1,
    "sheets": [
      {
        "code": "G-01",
        "title": "Site planning",
        "detail": "Plot geometry · Areas · Legend",
        "discipline": "survey",
        "file": "review-survey.webp"
      },
      {
        "code": "A-01",
        "title": "Site & perspective",
        "detail": "Perspective · Site development",
        "discipline": "architecture",
        "file": "review-sheet-1.webp"
      },
      {
        "code": "A-02",
        "title": "Floor plans & elevations",
        "detail": "Ground · Upper deck · Elevations",
        "discipline": "architecture",
        "file": "review-sheet-2.webp"
      },
      {
        "code": "S-01",
        "title": "Notes & schedules",
        "detail": "Design criteria · Member schedules",
        "discipline": "structure",
        "file": "review-sheet-3.webp"
      },
      {
        "code": "S-02",
        "title": "Foundation & framing plans",
        "detail": "Foundation · Upper floor · Roof",
        "discipline": "structure",
        "file": "review-sheet-4.webp"
      },
      {
        "code": "S-03",
        "title": "Carport, deck & stair details",
        "detail": "Sections · Floor edge · Connections",
        "discipline": "structure",
        "file": "review-sheet-5.webp"
      },
      {
        "code": "S-04",
        "title": "Fence & boundary walls",
        "detail": "Gates · Fence · CHB wall details",
        "discipline": "structure",
        "file": "review-sheet-6.webp"
      },
      {
        "code": "S-05",
        "title": "Steel nodes & braces",
        "detail": "Floor node · Roof node · Brace ends",
        "discipline": "structure",
        "file": "review-sheet-7.webp"
      },
      {
        "code": "E-01",
        "title": "Electrical layouts",
        "detail": "Ground & upper · Lighting · Power",
        "discipline": "electrical",
        "file": "review-sheet-8.webp"
      },
      {
        "code": "P-01",
        "title": "Plumbing layouts",
        "detail": "Water · Storm & waste · Deck drains",
        "discipline": "plumbing",
        "file": "review-sheet-9.webp"
      }
    ]
  },
  "phase1": {
    "title": "Phase 1 plans",
    "status": "PHASE 1 · DRAFT CLIENT REVIEW",
    "initial": 0,
    "sheets": [
      {
        "code": "A-P1",
        "title": "Ground plan & elevations",
        "detail": "Carport · Service areas · Elevations",
        "discipline": "architecture",
        "file": "phase1-sheet-1.webp"
      },
      {
        "code": "S-P1",
        "title": "Foundation, beams & roof",
        "detail": "Permanent beams · Roof framing",
        "discipline": "structure",
        "file": "phase1-sheet-2.webp"
      },
      {
        "code": "S-P2",
        "title": "Frame section & schedules",
        "detail": "Retained members · Permanent frame",
        "discipline": "structure",
        "file": "phase1-sheet-3.webp"
      },
      {
        "code": "S-P3",
        "title": "Fence, walls & roof drainage",
        "detail": "Gates · CHB walls · Roof edge",
        "discipline": "structure",
        "file": "phase1-sheet-4.webp"
      },
      {
        "code": "S-P4",
        "title": "Steel nodes & braces",
        "detail": "Floor node · Roof node · Brace ends",
        "discipline": "structure",
        "file": "phase1-sheet-5.webp"
      },
      {
        "code": "E-P1",
        "title": "Ground-floor electrical",
        "detail": "Lighting · Power · Load schedule",
        "discipline": "electrical",
        "file": "phase1-sheet-6.webp"
      },
      {
        "code": "P-P1",
        "title": "Ground-floor plumbing",
        "detail": "Waterline · Storm & waste · Details",
        "discipline": "plumbing",
        "file": "phase1-sheet-7.webp"
      }
    ]
  }
};

const asset = file => `${file}?v=20261028`;
const disciplineNames = {survey:'SITE PLANNING',architecture:'ARCHITECTURE',structure:'STRUCTURE',electrical:'ELECTRICAL',plumbing:'PLUMBING'};
const dialog = document.getElementById('sheet-dialog');
const stage = document.getElementById('dialog-stage');
const zoom = document.getElementById('zoom-sheet');
function resetZoom(){
  stage.classList.remove('zoomed');
  zoom.setAttribute('aria-pressed','false');
  zoom.textContent='Zoom in';
  stage.scrollTop=0;stage.scrollLeft=0;
}
function enlarge(config,sheet){
  document.getElementById('dialog-title').textContent=`${sheet.code} / ${sheet.title}`;
  document.getElementById('dialog-set-label').textContent=`${config.title.toUpperCase()} · ${config.status}`;
  const image=document.getElementById('dialog-image');
  image.src=asset(sheet.file);image.alt=`Enlarged ${config.title}: ${sheet.code}, ${sheet.title}`;
  resetZoom();dialog.showModal();document.body.style.overflow='hidden';
}
document.querySelectorAll('[data-drawing-set]').forEach(section=>{
  const key=section.dataset.drawingSet,config=drawingSets[key],sheets=config.sheets;
  const within=role=>section.querySelector(`[data-role="${role}"]`);
  const list=within('sheet-list');
  const previous=section.querySelector('[data-action="previous"]');
  const next=section.querySelector('[data-action="next"]');
  let selected=config.initial,filter='all';
  const visibleIndexes=()=>sheets.map((s,i)=>filter==='all'||s.discipline===filter?i:null).filter(i=>i!==null);
  function selectSheet(index){
    selected=index;
    const sheet=sheets[index];
    list.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.sheet)===index)));
    within('sheet-label').textContent=`${sheet.code} / ${sheet.title}`;
    within('sheet-discipline').textContent=`${disciplineNames[sheet.discipline]} · ${config.status}`;
    within('sheet-page').textContent=`SHEET ${index+1} OF ${sheets.length}`;
    const image=within('sheet-image');image.src=asset(sheet.file);image.alt=`${config.title}: ${sheet.code}, ${sheet.title}. ${sheet.detail}`;
    const indexes=visibleIndexes(),position=indexes.indexOf(index);
    previous.disabled=position===0;next.disabled=position===indexes.length-1;
  }
  sheets.forEach((sheet,index)=>{
    const button=document.createElement('button');button.type='button';button.className='sheet-button';button.dataset.sheet=index;button.dataset.discipline=sheet.discipline;
    const code=document.createElement('span');code.className='sheet-code';code.textContent=sheet.code;
    const text=document.createElement('span');
    const title=document.createElement('strong');title.textContent=sheet.title;
    const detail=document.createElement('small');detail.textContent=sheet.detail;text.append(title,detail);
    const arrow=document.createElement('span');arrow.className='sheet-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    button.append(code,text,arrow);button.addEventListener('click',()=>selectSheet(index));list.append(button);
  });
  section.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    filter=button.dataset.filter;
    section.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    list.querySelectorAll('.sheet-button').forEach(b=>{b.hidden=filter!=='all'&&b.dataset.discipline!==filter;});
    const indexes=visibleIndexes();selectSheet(indexes.includes(selected)?selected:indexes[0]);
  }));
  previous.addEventListener('click',()=>{const indexes=visibleIndexes(),position=indexes.indexOf(selected);if(position>0)selectSheet(indexes[position-1]);});
  next.addEventListener('click',()=>{const indexes=visibleIndexes(),position=indexes.indexOf(selected);if(position<indexes.length-1)selectSheet(indexes[position+1]);});
  section.querySelector('[data-action="enlarge"]').addEventListener('click',()=>enlarge(config,sheets[selected]));
  selectSheet(selected);
});
const views={
  plan:{title:'Ground & upper floor plans',file:'review-floorplan.webp',alt:'Full project ground and upper floor plans showing the carport, deck, stair and service spaces',caption:'A-02 · Ground floor layout, upper deck and access stair.'},
  elevation:{title:'Front elevation',file:'review-front-elevation.webp',alt:'Full project front elevation showing the carport, upper deck, residence and perimeter fence',caption:'A-02 · Carport, upper deck, residence and front fence.'},
  perspective:{title:'Revit perspective',file:'review-perspective.webp',alt:'Perspective of the full proposed residential extension and fence',caption:'A-01 · Perspective of the proposed extension and fence.'}
};
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  const view=views[button.dataset.view];document.getElementById('view-title').textContent=view.title;document.getElementById('view-caption').textContent=view.caption;
  const image=document.getElementById('view-image');image.src=asset(view.file);image.alt=view.alt;
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
zoom.addEventListener('click',()=>{const enabled=stage.classList.toggle('zoomed');zoom.setAttribute('aria-pressed',String(enabled));zoom.textContent=enabled?'Fit to view':'Zoom in';});
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow='';resetZoom();});
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
document.addEventListener('contextmenu',event=>{if(event.target.tagName==='IMG')event.preventDefault();});
document.addEventListener('dragstart',event=>{if(event.target.tagName==='IMG')event.preventDefault();});
