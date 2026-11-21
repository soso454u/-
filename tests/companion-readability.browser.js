// Run in an isolated fixture with a local-only setCover callback; never sends a model request.
async function runSeleneCompanionReadabilityRegression(setCover) {
  const checks=[];
  const assert=(ok,message)=>{if(!ok)throw Error(message);checks.push(message);};
  const player=window.__SELENE_MUSIC_PLAYER__;
  player.setCompanionVisible(true);
  const dialog=document.getElementById('safe-music-player-companion');
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const alpha=color=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return ctx.getImageData(0,0,1,1).data[3]/255;};
  const image=color=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=16;const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,16,16);return canvas.toDataURL('image/png');};
  const close=()=>dialog.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  for(const [color,tone] of [['#ffffff','light'],['#111217','dark']]){
    await setCover(image(color));
    for(let i=0;i<50&&dialog.dataset.tone!==tone;i++)await pause(40);
    assert(dialog.dataset.tone===tone,`${tone} album cover selects a matching ink palette`);
    if(dialog.classList.contains('companion-phone-home'))dialog.querySelector('[data-person]').click();
    dialog.querySelector('[data-person-current]').click();
    const panel=dialog.querySelector('.companion-feature'),rect=panel.getBoundingClientRect(),bounds=dialog.getBoundingClientRect();
    const background=getComputedStyle(panel).backgroundColor;
    assert(alpha(background)>.2&&alpha(background)<.6,`${tone} sheet retains the original translucent glass`);
    assert(getComputedStyle(panel).backdropFilter.includes('blur'),`${tone} sheet keeps the original backdrop blur`);
    assert(alpha(getComputedStyle(dialog).backgroundColor)<.3,`${tone} window keeps its original transparent base`);
    assert(rect.left>=bounds.left&&rect.right<=bounds.right+1&&rect.top>=bounds.top&&rect.bottom<=bounds.bottom+1,`${tone} sheet fits the window`);
    assert(dialog.querySelector('.companion-messages').inert&&getComputedStyle(dialog.querySelector('.companion-messages')).visibility==='hidden',`${tone} sheet hides and blocks the conversation below it`);
    const ink=getComputedStyle(panel.querySelector('[data-person-name]')).color.match(/[\d.]+/g).map(Number);
    assert(tone==='light'?ink[0]<70:ink[0]>220,`${tone} profile fields retain readable ink under host theme overrides`);
    assert(panel.scrollWidth<=panel.clientWidth+1,`${tone} role settings do not overflow horizontally`);
    assert(panel.textContent.includes('关联人设来源 · 1'),`${tone} current role card counts as a real profile source`);
    close();assert(!dialog.classList.contains('companion-sheet-open')&&!dialog.querySelector('.companion-form').inert,`${tone} Escape closes the sheet and restores conversation controls`);
  }
  await setCover('data:image/png;base64,invalid');await pause(100);
  dialog.querySelector('[data-person-current]').click();
  assert(alpha(getComputedStyle(dialog.querySelector('.companion-feature')).backgroundColor)<.6,'a cover that cannot be sampled does not turn the glass opaque');
  close();
  const visibleTools=[...dialog.querySelectorAll('.companion-tools>button')].filter(button=>getComputedStyle(button).display!=='none');
  assert(visibleTools.length===3,'the chat toolbar has exactly three visible actions');
  dialog.querySelector('[data-companion-more]').click();
  assert(dialog.querySelectorAll('[data-tool-action]').length===6,'all six secondary tools remain accessible in grouped actions');
  close();dialog.querySelector('[data-companion-settings]').click();
  assert(dialog.querySelectorAll('.companion-setting-group').length===5,'settings are organized into five readable groups');
  const sourceButton=dialog.querySelector('.companion-context-button');
  sourceButton.click();await pause(100);
  assert(dialog.querySelector('.companion-sheet-body').textContent.includes('User Persona'),'the context viewer exposes the actual player persona source');
  assert(dialog.querySelector('.companion-settings').hidden,'opening the context viewer closes the settings sheet');
  close();dialog.querySelector('[data-phone-home]').click();
  const toggle=dialog.querySelector('[data-contact-toggle]');
  assert(!!toggle.querySelector('svg')&&getComputedStyle(toggle).borderTopWidth==='0px'&&getComputedStyle(toggle).marginLeft==='0px','the contact toggle uses a left-aligned line chevron without a capsule');
  const before=toggle.getAttribute('aria-expanded');toggle.click();
  assert(dialog.querySelector('[data-contact-toggle]').getAttribute('aria-expanded')!==before,'the new chevron still expands and collapses contacts');
  dialog.querySelector('[data-contact-toggle]').click();
  return {passed:checks.length,viewport:[innerWidth,innerHeight]};
}
