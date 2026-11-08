// Run in an isolated parent page, with the player loaded from a nested same-origin iframe.
// Exercise actual layout and handlers without requesting music or using a live chat.
async function runSeleneWindowSettingsRegression(){
  const ID='safe-music-player',KEY='safe-music-player-v1',player=document.getElementById(ID),checks=[];
  const assert=(ok,message)=>{if(!ok)throw Error(message);checks.push(message);};
  const near=(a,b)=>Math.abs(a-b)<1.1,frame=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  assert(player?.parentElement===document.body,'player mounts in the outer document');
  assert(!player.querySelector('.size-preset'),'toolbar no longer includes the size button');
  const title=player.querySelector('.selene-player-head b'),head=title.parentElement;
  title.setPointerCapture=()=>{};title.releasePointerCapture=()=>{};
  const pointer=(target,type,x,y,id=71)=>target.dispatchEvent(new PointerEvent(type,{pointerId:id,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true}));
  const read=()=>JSON.parse(localStorage.getItem(KEY));
  const before=player.getBoundingClientRect(),savedSize=JSON.stringify(read().windowSize),x=before.left+20,y=before.top+20;
  let writes=0;const write=player.style.setProperty.bind(player.style);
  player.style.setProperty=(name,...args)=>{if(name==='transform')writes++;return write(name,...args);};
  pointer(title,'pointerdown',x,y);
  for(let i=1;i<=100;i++)pointer(title,'pointermove',x-i*.08,y-i*.2);
  assert(writes===0,'movement waits for one animation frame');await frame();
  assert(writes===1,'100 move events paint only once');
  const moving=player.getBoundingClientRect();assert(moving.top<before.top-15,'title responds immediately without waiting 240ms');
  window.__SAFE_MUSIC_RESIZE_HANDLER__();const resized=player.getBoundingClientRect();
  assert(near(moving.left,resized.left)&&near(moving.top,resized.top),'viewport refresh cannot reset an active drag');
  pointer(head,'pointerdown',x+70,y+70,72);pointer(head,'pointermove',x+150,y+150,72);await frame();
  assert(near(player.getBoundingClientRect().left,moving.left),'a second finger cannot take over the window');
  pointer(title,'pointerup',x-10,y-25);const ended=player.getBoundingClientRect();
  assert(near(ended.top,before.top-25),'release uses its final pointer position');
  assert(near(ended.width,before.width)&&near(ended.height,before.height),'dragging never changes window dimensions');
  assert(JSON.stringify(read().windowSize)===savedSize,'dragging does not overwrite the saved window size');
  assert(!player.style.transform&&!player.classList.contains('pointer-interacting'),'release clears the transform and interaction state');
  delete player.style.setProperty;
  const c=player.getBoundingClientRect();pointer(title,'pointerdown',c.left+20,c.top+20);pointer(title,'pointermove',c.left+20,c.top+35);await frame();
  const painted=player.getBoundingClientRect();pointer(title,'pointercancel',0,0);
  assert(near(player.getBoundingClientRect().top,painted.top),'cancellation preserves the last painted position');
  const tap=player.getBoundingClientRect();pointer(title,'pointerdown',tap.left+20,tap.top+20);pointer(title,'pointerup',tap.left+20,tap.top+20);
  assert(player.classList.contains('mini')&&player.offsetWidth===52,'title tap still opens the 52px mini player');
  const cover=player.querySelector('.mini-cover-shell');cover.setPointerCapture=()=>{};
  pointer(cover,'pointerdown',30,30);pointer(cover,'pointerup',30,30);assert(!player.classList.contains('mini'),'mini cover tap restores the window');
  delete title.setPointerCapture;delete title.releasePointerCapture;delete cover.setPointerCapture;
  player.querySelector('.gear').click();const settings=player.querySelector('.settings-panel');
  assert(!settings.querySelector('[name=floatingLyrics],[name=lyricColor]'),'lyrics controls have moved out of general settings');
  assert(settings.scrollWidth<=settings.clientWidth+1,'settings do not overflow horizontally');
  assert(near(settings.querySelector('input[type=checkbox]').getBoundingClientRect().width,32),'settings switches keep their intended width');
  const source=settings.querySelector('[name=searchSource]');source.value='joox';source.dispatchEvent(new Event('change',{bubbles:true}));
  assert(read().searchSource==='joox','manual search source is saved');settings.querySelector('[data-x]').click();
  const lyricButton=player.querySelector('.desktop-lyric-toggle'),priorLyrics=read().floatingLyrics;lyricButton.click();
  const lyrics=document.getElementById(`${ID}-lyrics-float`),bounds=lyrics.getBoundingClientRect(),view=visualViewport;
  assert(!lyrics.hidden&&lyrics.parentElement===document.body,'lyrics settings open as a floating parent-page panel');
  assert(read().floatingLyrics===priorLyrics,'opening lyrics settings does not toggle lyrics');
  const floatingLyrics=lyrics.querySelector('[name=floatingLyrics]'),wasEnabled=floatingLyrics.checked;
  assert(!lyrics.querySelector('[name=desktopLyrics],[name=mobileLyrics]'),'desktop and mobile share one lyrics switch');
  floatingLyrics.click();
  assert(read().floatingLyrics===!wasEnabled&&lyricButton.classList.contains('active')===!wasEnabled,'the shared switch saves the preference and updates the toolbar');
  floatingLyrics.click();
  assert(bounds.left>=view.offsetLeft&&bounds.right<=view.offsetLeft+view.width+1&&bounds.bottom<=view.offsetTop+view.height+1,'lyrics panel stays within the visible viewport');
  const gradient=lyrics.querySelector('[name=lyricGradient]');gradient.checked=true;gradient.dispatchEvent(new Event('input',{bubbles:true}));gradient.dispatchEvent(new Event('change',{bubbles:true}));
  const color=lyrics.querySelector('[name=lyricGradientColor]');color.value='#4499cc';color.dispatchEvent(new Event('input',{bubbles:true}));color.dispatchEvent(new Event('change',{bubbles:true}));
  assert(read().lyricGradient&&read().lyricGradientColor==='#4499cc','lyrics controls persist independently');
  lyrics.querySelector('[data-lyrics-close]').click();assert(lyrics.hidden,'lyrics panel closes normally');
  return {passed:checks.length,viewport:`${innerWidth}x${innerHeight}`};
}

// Run only in an isolated fixture; exercises repeated opening, cross-menu switching and hide/reopen.
async function runSeleneRepairUiRegression(){
  const player=document.getElementById('safe-music-player'),word=player.querySelector('.desktop-lyric-toggle'),lock=player.querySelector('.quick-lyrics-lock'),menu=document.getElementById('safe-music-player-lyrics-float'),skin=player.querySelector('.skin'),checks=[];
  const assert=(ok,message)=>{if(!ok)throw Error(message);checks.push(message);};
  const close=menu.querySelector('[data-lyrics-close]');
  assert(!document.querySelector('.lyric-resize'),'floating lyric resize corner is removed');
  assert(player.querySelector('.lyrics-tools').querySelectorAll('button').length===2,'the lyric pill has two independent buttons');
  if(!menu.hidden)close.click();
  for(let i=0;i<6;i++){
    word.click();assert(!menu.hidden&&getComputedStyle(menu).display!=='none',`lyric settings open on repeat ${i+1}`);
    const rect=word.getBoundingClientRect(),hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
    assert(word.contains(hit),`floating panel leaves its toolbar button reachable ${i+1}`);
    close.click();
  }
  word.click();skin.click();assert(menu.hidden,'skin menu closes the lyric panel even for keyboard/programmatic clicks');
  word.click();assert(document.getElementById('safe-music-player-skin-float').classList.contains('hidden')&&!menu.hidden,'lyric settings close the skin menu');
  lock.click();assert(lock.getAttribute('aria-pressed')===String(menu.querySelector('[name=lyricsLocked]').checked),'quick lock stays in sync with lyric settings');lock.click();
  window.__SELENE_MUSIC_PLAYER__.setVisible(false,{persist:false});assert(menu.hidden,'closing the player hides lyrics using the same state');
  window.__SELENE_MUSIC_PLAYER__.setVisible(true,{persist:false});word.click();
  assert(!menu.hidden&&getComputedStyle(menu).display!=='none','closing and reopening the player cannot strand the lyric panel hidden');
  close.click();return {passed:checks.length,viewport:`${innerWidth}x${innerHeight}`};
}
