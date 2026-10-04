'use strict';
const sheets = [
  {code:'A-01',title:'Site & perspective',detail:'Perspective · Site development',discipline:'architecture',alt:'A-01 perspective and site development plan; vicinity map omitted'},
  {code:'A-02',title:'Floor plan & elevations',detail:'Ground floor · Front · Left side',discipline:'architecture',alt:'A-02 ground floor plan and front and left side elevations'},
  {code:'S-01',title:'Notes & schedules',detail:'Design criteria · Member schedules',discipline:'structure',alt:'S-01 draft structural notes, design criteria and member schedules'},
  {code:'S-02',title:'Foundation & roof plans',detail:'Foundations · Roof framing · Roof',discipline:'structure',alt:'S-02 foundation plan, roof framing plan and roof plan'},
  {code:'S-03',title:'Garage & steel details',detail:'Frame section · Footing · Connections',discipline:'structure',alt:'S-03 garage frame section, footing and structural steel connection details'},
  {code:'S-04',title:'Fence & boundary walls',detail:'Gates · Fence · CHB wall details',discipline:'structure',alt:'S-04 fence and gate elevation, boundary wall elevation, sections and details'},
  {code:'E-01',title:'Electrical layouts',detail:'Lighting · Power · Load schedule',discipline:'electrical',alt:'E-01 electrical layouts, load schedule, riser, legend and draft notes'},
  {code:'P-01',title:'Plumbing layouts',detail:'Water · Sanitary · Drainage details',discipline:'plumbing',alt:'P-01 plumbing layouts, details, legend and draft notes'}
];
const names={architecture:'ARCHITECTURE',structure:'STRUCTURE',electrical:'ELECTRICAL',plumbing:'PLUMBING'};
const list=document.getElementById('sheet-list');
let selected=0, filter='all';
function visibleIndexes(){return sheets.map((s,i)=>filter==='all'||s.discipline===filter?i:null).filter(i=>i!==null);}
function selectSheet(index){
  selected=index;
  const s=sheets[index],src=`review-sheet-${index+1}.webp`;
  document.querySelectorAll('.sheet-button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.sheet)===index)));
  document.getElementById('sheet-label').textContent=`${s.code} / ${s.title}`;
  document.getElementById('sheet-discipline').textContent=`${names[s.discipline]} · REV H DRAFT`;
  document.getElementById('sheet-page').textContent=`SHEET ${index+1} OF 8`;
  const image=document.getElementById('sheet-image');image.src=src;image.alt=s.alt;
  const indexes=visibleIndexes(),position=indexes.indexOf(index);
  document.getElementById('previous-sheet').disabled=position===0;
  document.getElementById('next-sheet').disabled=position===indexes.length-1;
}
sheets.forEach((s,i)=>{
  const button=document.createElement('button');button.type='button';button.className='sheet-button';button.dataset.sheet=i;button.dataset.discipline=s.discipline;
  const code=document.createElement('span');code.className='sheet-code';code.textContent=s.code;
  const text=document.createElement('span'),title=document.createElement('strong'),detail=document.createElement('small');title.textContent=s.title;detail.textContent=s.detail;text.append(title,detail);
  const arrow=document.createElement('span');arrow.className='sheet-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');button.append(code,text,arrow);button.addEventListener('click',()=>selectSheet(i));list.append(button);
});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelectorAll('.sheet-button').forEach(b=>{b.hidden=filter!=='all'&&b.dataset.discipline!==filter;});
  const indexes=visibleIndexes();selectSheet(indexes.includes(selected)?selected:indexes[0]);
}));
document.getElementById('previous-sheet').addEventListener('click',()=>{const indexes=visibleIndexes(),p=indexes.indexOf(selected);if(p>0)selectSheet(indexes[p-1]);});
document.getElementById('next-sheet').addEventListener('click',()=>{const indexes=visibleIndexes(),p=indexes.indexOf(selected);if(p<indexes.length-1)selectSheet(indexes[p+1]);});
const views={
  plan:{title:'Ground floor plan',src:'review-floorplan.webp',alt:'Ground floor plan showing proposed service spaces around the existing residence',caption:'A-02 · Ground floor layout from the Revision H draft.'},
  elevation:{title:'Front elevation',src:'review-front-elevation.webp',alt:'Front elevation showing the existing two-storey residence, new garage, gym canopy and perimeter fence',caption:'A-02 · Front elevation from the Revision H draft.'},
  perspective:{title:'Revit perspective',src:'review-perspective.webp',alt:'Revit perspective of the proposed residential extension and fence',caption:'A-01 · Model perspective from the supplied drawing set.'}
};
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  const view=views[button.dataset.view];document.getElementById('view-title').textContent=view.title;document.getElementById('view-caption').textContent=view.caption;
  const image=document.getElementById('view-image');image.src=view.src;image.alt=view.alt;
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
const dialog=document.getElementById('sheet-dialog'),stage=document.getElementById('dialog-stage'),zoom=document.getElementById('zoom-sheet');
function resetZoom(){stage.classList.remove('zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='Zoom in';stage.scrollTop=0;stage.scrollLeft=0;}
document.getElementById('enlarge-sheet').addEventListener('click',()=>{
  const s=sheets[selected];document.getElementById('dialog-title').textContent=`${s.code} / ${s.title}`;
  const image=document.getElementById('dialog-image');image.src=`review-sheet-${selected+1}.webp`;image.alt=`Enlarged ${s.alt}`;resetZoom();dialog.showModal();document.body.style.overflow='hidden';
});
zoom.addEventListener('click',()=>{const enabled=stage.classList.toggle('zoomed');zoom.setAttribute('aria-pressed',String(enabled));zoom.textContent=enabled?'Fit to view':'Zoom in';});
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow='';resetZoom();});
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
document.addEventListener('contextmenu',event=>{if(event.target.tagName==='IMG')event.preventDefault();});
document.addEventListener('dragstart',event=>{if(event.target.tagName==='IMG')event.preventDefault();});
selectSheet(0);
