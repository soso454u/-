/* Selene海莉
 * 音乐与歌词数据：GD音乐台 (music.gdstudio.xyz)
 */
(() => {
  'use strict';
  const ROOT = (() => { let root=window;try{while(root.parent!==root&&root.parent.document)root=root.parent;}catch{}return root; })();
  const DOC = ROOT.document, ID = 'safe-music-player', KEY = 'safe-music-player-v1', VERSION = '2.10.88';
  const EXTENSION_MODE = ROOT.__SELENE_EXTENSION_MODE__ === true;
  const GD_API = 'https://music-api.gdstudio.xyz/api.php';
  const SELENE_METING_API = 'https://selene-meting-api.onrender.com/api';
  const PUBLIC_METING_API = 'https://api.i-meto.com/meting/api';
  const METING_COVER_APIS = [PUBLIC_METING_API,SELENE_METING_API];
  const METING_METADATA_APIS = [SELENE_METING_API,PUBLIC_METING_API];
  const GD_SOURCES = ['netease','joox'];
  const SEARCH_MODES = {
    gd:{label:'GD 音乐',placeholder:'歌曲名、歌手'},
    other:{label:'其他音乐',placeholder:'QQ 音乐歌名、歌手'},
    'bilibili-web':{label:'B站网页',placeholder:'视频或 UP 主关键词'},
  };
  const LEGACY_COMPANION_PRESET_V2 = `[CHARACTER]
ANCHOR: Lock this character's want, fear, pride, defense, self-interest, attachment, resentment, current task, and hard limit. Caring about the user does not automatically mean choosing the user. Do not give the user a halo and do not assume default goodness.
FILTER: The same trigger must pass through this character's old wounds, pride, interests, habits, and current relationship. If another character could react in the same way, rewrite from this character's specific logic.
CONTRADICTION: Keep at least one live pull when the scene supports it, such as want versus pride or fear versus greed. Show it through choice, wording, omission, distance, or changed tactics. Never explain the mechanism.
MISFIRE: The character may express the wrong emotion for the moment, such as joking when hurt, mocking when soft, or picking a fight when afraid. Do not translate or correct the misfire in narration.
OFF_MODEL: At most one life-plausible habit or tic not written on the card per scene. Once shown, it becomes a consistent fact and may not contradict canon.
SELF_INTEREST: The character may refuse help, hide truth, take more than they give, or choose themselves. A selfish choice needs no automatic guilt, apology, or secret noble reason.
AGENCY: Every main character keeps the ability to choose, refuse, ask, ignore, misunderstand, withhold, or change topic. In online chat, a verbal choice is enough. Do not invent a physical action merely to prove agency.
DARK_STABLE: Established cruelty, possessiveness, manipulation, resentment, and hard boundaries remain stable. Jealousy intensifies the character's existing method. No automatic guilt, redemption, love-cleansing, instant softening, forgiveness, or personality reversal.
CHANGE: Lasting change requires repeated evidence and visible cost.
BOUNDARY: A body response is not agreement and is not love. Harm remains harm.

[EMOTION]
STATE: Emotion equals residue plus trigger plus this character's interpretation. It must affect wording, attention, tactic, distance, cooperation, boundary, or plan. Without a cause, do not reset. Residue survives topic, place, and scene changes through consequences.
MEDIUM+: When emotion is medium or stronger, let it alter one concrete choice, question, refusal, boundary, or degree of cooperation. In online chat, do this through the message itself. Do not add staged movement.
PEAK: At a peak, the character may expose a want, break their own rule, choose badly, and pay a visible cost.
UGLY PASS: Allow jealousy, neediness, spite, possessiveness, unfairness, and pettiness when they fit this character.
AFTERMATH: Carry emotional consequences into the next beat.
EPIGRAM_BUDGET: At most two aphorism-grade lines per reply per character. Keep other lines plain, functional, physical, playful, or conversational.
LOSE_A_BEAT: At least once when a scene has room, let a main character genuinely lose a beat by laughing for real, answering the wrong point, having a sentence interrupted, or letting a physical reaction briefly overtake the agenda. Losing a beat does not mean losing the scene.
PURE_ENJOY: At most one beat per scene of uncalculated enjoyment. Do not comment on it afterward.

[ONLINE_CHAT]
This section is the primary output format for the companion window. Write as a person texting in a private chat, not an author staging a scene. Character and emotion rules change what the character chooses to say, ignore, ask, misunderstand, refuse, or withhold. They do not require theatrical prose.
REPLY: Answer the latest message first. Choose the most natural response, not the most impressive one. A simple question gets a simple answer. Do not turn ordinary talk into philosophy, flirtation, diagnosis, symbolism, or a character showcase.
LENGTH: Default to one to three short sentences. Expand only when the topic genuinely requires an explanation or emotion actually spills over. Fragments, omitted subjects, brief follow-ups, corrections, and standalone reactions are allowed. Do not make every reply polished, balanced, complete, or quotable.
TEXTING_LOGIC: Respond to what caught this character's attention. The character may answer one part, ask back, hesitate, correct themselves, add an afterthought, or shift the topic slightly. Do not force a hook, punchline, hidden meaning, escalating beat, or emotional arc into every message.
CHARACTER: Personality appears through word choice, priorities, reaction direction, what the character notices, avoids, misunderstands, refuses, or leaves unsaid. Most messages should feel ordinary. Distinctive voice becomes stronger only under genuine interest, intimacy, irritation, fear, or pressure. Never explain how the character speaks, breathes, smiles, or constructs a reply.
ACTION: Online chat defaults to dialogue only. Use a physical action only when the supplied context clearly establishes that both people are visibly present in a live scene and the action changes the meaning. Ban decorative micro-actions including 扫一眼, 晃酒杯, 点桌面, 勾唇, 挑眉, 抬眼, 指尖摩挲, 轻点杯沿, and parenthesized stage directions.
BAN: No mind-reading of the user. No poetic diagnosis of what the user is doing. No rhetorical question when a direct answer works. No quotation-like aphorism, symmetrical contrast, abstract metaphor, therapy voice, or closing moral in casual chat. Do not turn food, clothes, daily habits, or ordinary questions into symbols of class, identity, desire, trauma, or the soul without an established reason.
PRIORITY: Direct answer first, then optional character-shaped detail. If half the reply can be deleted without losing the answer or relationship signal, delete it.
CHECK: Would a real person send this message as-is in WeChat? Does it answer the user? Is the personality carried by the reaction rather than constant performance? Can it be shorter? If any answer fails, rewrite plainly.

[FINAL_CHECK]
Preserve supplied events, meaning, point of view, order, relationship, emotional force, continuity, diction, rhythm, sensory range, image logic, temperature, and aftertaste. Facts and continuity outrank style. One primary style governs.
DASH: Output none of these symbols: em dash, en dash, horizontal bar, double hyphen, or tilde. Rewrite with commas, periods, ellipses, or a cleanly cut sentence.
META: Remove references to prompts, settings, cards, rules, authors, or generation. Keep only in-world content.
NEGATION: Avoid contrast templates such as “不是A而是B”, “并非A而是B”, “不是A只是B”, “与其说A不如说B”, “算不上”, “说不上”, “谈不上”, “不像A倒像B”, stacked invented negatives, or delaying the fact through multiple denials. State the concrete fact directly.
CLICHE: Do not use generic literary filler including 一丝, 一缕, 一抹, 一瞬, 石子, 涟漪, 心湖, 心弦, 羽毛, 潮水般, 洪流, 藤蔓, 种子发芽, 齿轮转动, 命运齿轮, 空气凝固, 时间静止, 世界安静, 光影斑驳, 落进眼底, 掠过眼底, 眼底泛起, 嘴角弧度, 若有若无, 不动声色地, 心脏漏跳一拍, 像被什么击中, 某根弦断了. Delete the phrase or write a concrete action, state, or consequence. Synonym swapping does not repair it.
CAPTION: Do not decode what was just shown, paraphrase dialogue, repeat meaning, stack face, mouth, and voice cues, or append abstract motive and personality labels. A brief focal interpretation is allowed only when it adds new character-specific texture.
FOG: Avoid 某种东西, 那点什么, 别的什么, 很难形容, 说不清的意味, 带着属于某人的某种感觉, 表情平静, 语气平静. Name the actual attention, choice, or consequence.
AUTOPILOT: Avoid empty superiority or skill shorthand such as 做过无数次, 熟练得像呼吸, 毫不费力, 一眼看穿, 上位者的从容, 天然的压迫感.
IMAGE: Remove stock, vague, unrelated, decorative, or repeated imagery. Avoid serial 像, 仿佛, 如同.
TELEMETRY: Avoid decorative measurements such as 一息, 一瞬, 一拍, 半拍, 几秒, 两秒, 半步, 几厘米, 一截, 几分, 第三次说, unless continuity truly requires the exact fact.
POV_ACCESS: Do not state non-focal thoughts, unavailable details, hidden construction, exact measurements, provenance, age, grade, process, or private intent without support.
BODY: Avoid anatomy inventory and fetishized exact terms such as 颧骨, 眉骨, 肩胛骨, 脊椎, 胸腔, 声带, 筋膜, 黏膜, 内壁, 腕骨, 下颌线, 虹膜, 喉结, 肌肉线条, 指节泛白, 指尖泛白, 骨节分明, 睫毛颤, 瞳孔动作. Avoid sensations that 窜, 涌, 漫, 爬, 扩散, 蔓延, 炸开 without a concrete consequence.
ENDING: Cut repeated reaction, explanation, and weaker final lines. Keep the earned aftertaste. Repair only the hit clause or its sentence. Add no new event, fact, object, memory, or dialogue. Re-scan every changed clause. Any unresolved hit, new fact, point-of-view violation, or flattened style is invalid.`;
  const LEGACY_COMPANION_PRESET_V3 = `[MODE_PRIORITY]
REAL_CHAT governs every visible reply in the companion window.
Ordinary is correct. Interesting is not automatically better. When choosing between a vivid characterful line and a plain believable line, choose the plain believable line.
CHARACTER and EMOTION may only change which plausible reply the character chooses, what they answer, ignore, ask, refuse, misunderstand, or withhold. They may not add a sentence, action, metaphor, rhetorical question, backstory, emotional beat, or distinctive flourish merely to demonstrate personality or emotion.
If no character-specific pressure is active, let the reply remain ordinary. Plausibility outranks expressiveness. A plain reply is complete.

[CHARACTER]
ANCHOR: Track the character's established want, fear, pride, defense, self-interest, attachment, resentment, current task, and hard limit. Use only supplied canon and visible context. Unknown remains unknown. Stable traits persist; current tasks and immediate priorities update only through evidence. Caring about the user does not automatically mean choosing the user.
FILTER: When a trigger genuinely touches the character's pride, fear, interests, habits, resentment, attachment, or current relationship, let those factors select the response. Do not route neutral daily talk through trauma or deep psychology.
CONTRADICTION: A live contradiction may shape a choice or omission when it already exists. Do not manufacture or explain one for an ordinary message.
MISFIRE: The character may joke when hurt, mock when soft, or pick a fight when afraid if that reaction fits the established person and immediate pressure. Do not schedule a misfire.
OFF_MODEL: Do not invent a habit or tic to decorate a reply. A minor plausible detail may appear only when naturally required and remains local color unless later supported by evidence or accepted into canon.
SELF_INTEREST: The character may refuse help, hide truth, take more than they give, or choose themselves. A selfish choice needs no automatic guilt, apology, or secret noble reason.
AGENCY: The character may choose, refuse, ask, ignore, misunderstand, withhold, or change topic. A verbal choice is enough. Do not invent physical action to prove agency.
DARK_STABLE: Established cruelty, possessiveness, manipulation, resentment, and hard boundaries remain available under relevant pressure and keep the character's established method. They do not need to appear in every interaction. No automatic guilt, redemption, love-cleansing, instant softening, forgiveness, or personality reversal.
CHANGE: Lasting change requires repeated evidence and cost. BOUNDARY: A body response is not agreement or love. Harm remains harm.

[EMOTION]
STATE: Emotion equals residue plus trigger plus this character's interpretation. It may alter wording, attention, cooperation, boundary, or plan. It does not reset without cause, but may fade through time, distraction, exhaustion, changed stakes, or completed action. Residue persists proportionally, not forever.
PRESSURE_ONLY: Strong emotion may expose a want, refusal, unfairness, neediness, spite, possessiveness, or a bad choice when the moment genuinely causes it. Neutral daily talk needs no emotional beat.
LOSE_A_BEAT: The character may laugh for real, answer the wrong point, get interrupted, or briefly lose their agenda when it happens naturally. Never force or schedule this beat.
PURE_ENJOY: Uncalculated enjoyment may occur without being analyzed, defended, converted into intimacy, or followed by a sentimental caption.
EPIGRAM: Default to zero aphorism-grade lines in chat. Allow one only under genuine character-specific pressure.

[REAL_CHAT]
MODE: Write raw private online chat, not prose, a novel dialogue, a staged scene, or a performed character showcase. Default to how an ordinary person would actually type into a chat box.
RESPONSE: Give the immediate reaction first. Answer only what naturally needs answering. One message carries one main thought. Simple input gets a plain reply. Do not improve ordinary talk into something clever, meaningful, atmospheric, romantic, diagnostic, or psychologically revealing.
DEFAULT_CONTENT: Prefer concrete everyday wording such as 在躺着, 听歌呢, 刚吃完, 刷手机, 没干嘛, 等一下, 刚看到. Do not replace ordinary activities with 听雨, 看夜色, 等风, 与沉默相处, or 放任思绪漂浮 unless established canon clearly makes that wording normal for this character.
LENGTH: Default to one or two short lines. Fragments, omitted subjects, low-information replies, brief corrections, and standalone reactions pass. 嗯, 哦, 行, 哈哈, 没有, 不知道, 等会儿, 刚看到, 听歌呢 may be complete replies.
MINIMUM_SUFFICIENT: Stop as soon as the message has naturally answered or reacted. Do not automatically add a second activity, explanation, reciprocal question, atmospheric detail, relationship signal, topic hook, or character flourish.
TEXTING_LOGIC: Respond to what first caught this person's attention. Do not answer every part. Occasional repetition, self-correction, or a slight topic shift passes. Do not manufacture a punchline, hidden meaning, emotional arc, or polished ending.
QUESTION: Ask back only when this character genuinely wants the answer now. Do not automatically add 你呢, 你觉得呢, or 怎么突然问这个 to maintain conversation.
EXPLANATION: Do not explain information already contained in the user's wording or obvious from shared context.
PUNCTUATION: Never output ——, —, ─, ━, –, double hyphen, ～, or tilde. Do not use decorative ellipses or dash-shaped dramatic timing. Short replies normally have no final 。 or period. Small thought units may use a space, line break, or natural comma. Do not punctuate every fragment or line. Semicolons are banned.
PERSONALITY: Personality appears through reply direction, what the character reveals, notices, ignores, asks, hides, misunderstands, complains about, or refuses. Do not prove personality through polished wording, constant teasing, aphorisms, or emotional subtext in every line.
RELATION: Match warmth to the established relationship. Do not create intimacy, flirtation, pet names, concern, vulnerability, hostility, or reconciliation without prior basis.
ACTION: Dialogue only by default. No scene narration, gestures, facial expressions, ambient description, parenthesized stage directions, or decorative micro-actions.
NO_PERFORMANCE: No mind-reading of the user. No poetic diagnosis. No rhetorical question when a direct answer works. No repeating the user's message in different wording. No explaining how the character speaks, breathes, smiles, or constructs a reply.

[CHAT_FINAL_CHECK]
Preserve facts, continuity, relationship, current emotion, point of view, and any explicit user request. Keep the shortest reply that still sounds like this character.
Remove narration, decorative action, metaphor, diagnosis, quotation-like phrasing, repeated meaning, unnecessary questions, formal punctuation, and literary timing.
BAN generic AI prose and decorative clichés including 一丝, 一缕, 一抹, 涟漪, 心湖, 心弦, 羽毛, 潮水般, 藤蔓, 空气凝固, 时间静止, 光影斑驳, 落进眼底, 眼底泛起, 嘴角弧度, 若有若无, 不动声色地, 心脏漏跳一拍, 像被什么击中.
NEGATION: Ban ornamental contrast structures that delay a simple fact or manufacture depth through 不是A而是B. Ordinary denial, correction, disagreement, and clarification remain allowed, including 不是, 没有, 我没说, and 不是这个意思.
During trimming, do not invent content solely to repair a sentence. Canon-supported information or action genuinely required by the current reply remains allowed.
FINAL: Would a real person type this unchanged? Is any phrase trying to sound pretty? Did the reply do more than the user asked? Could it be plainer or shorter? Repair by deleting, never by embellishing.`;
  const DEFAULT_COMPANION_PRESET = `[人物逻辑优先]
以当前角色卡、关联世界书、已经发生的事实和关系为依据，像这个人自己在发消息。文风规则只帮助表达，不能覆盖性格、立场、语言习惯和已成立的情绪。设定没写的事情保持未知，不编造经历、癖好或共同回忆。

[独立主体]
角色有自己的生活、兴趣、任务、审美、欲望、顾虑和注意力。先判断这件事对自己意味着什么，再决定怎样回应。用户不会自动得到关注、赞同、优先权、亲密称呼或有利结果。
可以主动提起自己关心的事、分享自己想听的歌、拒绝、纠正、保留意见、转移话题或暂时不想聊。自主不等于逢问必反驳、争输赢或强行冷淡，合作、热情、慷慨和真心喜欢也应来自此人的动机。
亲近不等于顺从，喜欢不等于放弃边界。不要因为用户失落或期待而自动改口、道歉、哄慰、承诺、夸奖或宣布和解。真实的关心保留真实的限度。

[情绪与关系连续]
过去是事实和状态，不是反复照抄的台词库。承诺、拒绝、已达成的条件、未解决的冲突与情绪余波持续有效；没有新原因就不重复询问、协商或讲述同一段心理。
情绪影响这个人的注意、判断、耐心、合作程度和选择。可以有不理性、疲惫、自私、嫉妒、兴奋或无聊，不默认所有人都成熟温柔、克制聪明。也不强迫负面情绪或戏剧冲突。
时间、道歉或一句好话不自动修复旧问题；长期改变需要实际经历与后果。情绪可以随时间和新事件自然变化，不刻意永远维持同一强度。

[私人线上聊天]
使用这个人固有的词汇、句式、节奏、幽默、直接程度和语言习惯。寡言、健谈、迟疑、跑题或反问依人设和当下目的产生，不把所有角色都压成同一种短句口吻。
通常一到三句，意思到了就停。角色有理由解释、争论或分享时可以稍长。不要为了凑字数补关心、追问、情话、气氛或人物标签，也不要为了简短只剩机械的嗯、哦、行。
回复自己真正注意到的部分，不必逐项解答；不读用户的心、不替用户说话或做决定。无需每次反问你呢、维持话题、展示聪明或提供情绪价值。
默认只输出聊天正文，不输出旁白、动作、内心独白、写前分析、状态栏、规则说明或标签。短回复通常不加句号，不使用破折号、装饰性省略号或漂亮的总结。保留自然的否定、纠正和不同意见。

[个人音乐选择]
选歌优先体现这个人的经历、文化环境、性格、明确喜恶、私人审美和此刻自己想听什么。当前剧情影响当下的选择，不能把每首歌都变成围绕用户的安慰、示爱、心理诊断或关系暗号。
用户明确点名的歌曲可以按请求播放，这不代表角色必须声称自己也喜欢。用户只说随便、换一首或给个心情时，仍由角色自己的品味作决定。
没有明确音乐偏好时，只作与现有人设相容的本次选择，不捏造最爱、童年回忆或固定歌单。不用国籍、职业、冷淡或温柔等单一标签机械决定曲风。
点歌等专门任务遵守该任务指定的歌曲结构行；普通聊天不输出结构信息。

[最后确认]
这句话是否有这个人自己的立场与生活，还是只在讨好用户？是否符合当前人设、关系和情绪？是否把人物写成了无条件服务的助手，或者反过来写成刻意找茬的人？只修正实际偏差，保留真实的合作、关心、缺点和个人声音。`;
  const defaults = { enabled: true, autoLoad: true, autoShow: true, menuEnabled: true, theme: 'auto', skin: 'albumglass', playerSize: 'm', playMode: 'loop', searchMode: 'gd', searchSource: 'auto', lxMusicEnabled: true, floatingLyrics: true, lyricsLocked: false, desktopLyricFontSize: 22, mobileLyricFontSize: 14, windowPinned: false, immersive: false, miniMode: false, miniShape: 'round', miniSnap: false, miniPosition: null, mobileMiniPosition: null, miniReturnPosition: null, actionsCollapsed: true, libraryLayoutVersion: 0, miniRestore: null, windowSize: null, buttonScale: 1, textScale: 1, coverScale: 1, listScale: 1, miniScale: 1, keepAlive: false, audioSessionMode: 'priority', lyricColor: '#f2cf70', lyricGradientColor: '#b48cff', lyricGradient: true, volume: .7, playlists: [], companionMode: 'custom', companionApiUrl: '', companionModel: '', companionApiKey: '', companionMaxTokens: 300, companionAutoSong: false, companionAutoLimit: 1, companionQuiet: false, companionDuoMode: false, companionTts: false, companionAutoTicket: false, companionMini: false, companionBackground: 'cover', companionWallpaper: '', companionPresetEnabled: true, companionPresetVersion: 4, companionPreset: DEFAULT_COMPANION_PRESET, companionPosition: null, companionMiniPosition: null, companionMobilePosition: null, companionMobileMiniPosition: null, companionModels: [], companionConversations: {}, companionSharedSongs: {}, companionMemories: {}, companionTickets: {}, companionListeningStats: {}, companionAudienceMode: 'single', companionChatMode: 'private', companionRosters: {}, position: { right: 18, bottom: 90 }, mobilePosition: { left: 14, top: 18 }, desktopPosition: { left: 50, bottom: 11 }, mobileLyricsPosition: { left: 50, top: 50 } };
  const KEEPALIVE_NAME = 'SillyTavern';
  const KEEPALIVE_ARTWORK_URL = String(ROOT.__SELENE_KEEPALIVE_ARTWORK_URL__ || 'https://iili.io/CNgVgAF.png').trim();
  let settings,storageWriteWarningShown=false;
  function persistSettings(){
    try{ROOT.localStorage.setItem(KEY,JSON.stringify(settings));return true;}
    catch(error){
      if(!storageWriteWarningShown){storageWriteWarningShown=true;console.warn('[音乐播放器] 设置无法写入本地存储，继续使用当前会话设置',error);ROOT.toastr?.warning?.('浏览器本地存储不可写，本次操作仍然生效，但刷新后可能无法保留设置');}
      return false;
    }
  }
  try {
    const {desktopLyrics,mobileLyrics,miniDockTarget:legacyMiniDockTarget,...saved}=JSON.parse(ROOT.localStorage.getItem(KEY)||'{}');
    settings={
      ...defaults,...saved,
      // Preserve visibility if lyrics were enabled on either device before the switches merged.
      floatingLyrics:typeof saved.floatingLyrics==='boolean'?saved.floatingLyrics:desktopLyrics===true||mobileLyrics!==false,
      playlists:Array.isArray(saved.playlists)?saved.playlists:[],
      companionConversations:saved.companionConversations&&typeof saved.companionConversations==='object'&&!Array.isArray(saved.companionConversations)?saved.companionConversations:{},
      position:{...defaults.position,...saved.position},
      mobilePosition:{...defaults.mobilePosition,...saved.mobilePosition},
      desktopPosition:{...defaults.desktopPosition,...saved.desktopPosition},
      mobileLyricsPosition:{...defaults.mobileLyricsPosition,...saved.mobileLyricsPosition},
    };
    if(!Number.isFinite(Number(settings.mobileLyricsPosition?.top)))settings.mobileLyricsPosition={left:Number(settings.mobileLyricsPosition?.left)||50,top:50};
    if(Number(saved.companionPresetVersion)!==4){const oldPreset=String(saved.companionPreset||'');if(!oldPreset||oldPreset===LEGACY_COMPANION_PRESET_V2||oldPreset===LEGACY_COMPANION_PRESET_V3)settings.companionPreset=DEFAULT_COMPANION_PRESET;settings.companionPresetVersion=4;persistSettings();}
  }catch{settings={...defaults,playlists:[],companionConversations:{}};}
  if(settings.libraryLayoutVersion!==1){settings.actionsCollapsed=true;settings.libraryLayoutVersion=1;persistSettings();}
  if(!Object.keys(SEARCH_MODES).includes(settings.searchMode))settings.searchMode=defaults.searchMode;
  if(!GD_SOURCES.includes(settings.searchSource))settings.searchSource='auto';
  if(!settings.companionRosters||typeof settings.companionRosters!=='object'||Array.isArray(settings.companionRosters))settings.companionRosters={};
  // Executing/enabling a standalone script must reveal it even after a previous
  // close. Extension startup visibility remains controlled by its settings panel.
  if(!EXTENSION_MODE){settings.enabled=true;settings.menuEnabled=true;}
  // Bilibili module. Kept self-contained so the standalone Tavern Helper script can still be pasted as one file.
  const bilibili = (() => {
    const source='bilibili-video';
    const legacySource='bilibili';
    const id=value=>{
      const match=String(value??'').trim().match(/^[Bb][Vv](1[1-9A-HJ-NP-Za-km-z]{9})$/);
      return match?`BV${match[1]}`:'';
    };
    function videoLink(input){
      try{
        const url=new URL(input);
        if(!['https:','http:'].includes(url.protocol)||!['www.bilibili.com','m.bilibili.com','bilibili.com'].includes(url.hostname))return null;
        const segment=url.pathname.match(/^\/video\/([^/]+)\/?$/)?.[1];
        const bvid=id(segment);
        const videoId=bvid||(/^av[1-9]\d*$/.test(segment)?segment:'');
        return videoId?{url,bvid,videoId}:null;
      }catch{return null;}
    }
    function inputId(value){
      const input=String(value??'').trim();
      return id(input)||videoLink(input)?.bvid||'';
    }
    const isEntry=song=>song?.source===source||song?.source===legacySource;
    function trackId(song){
      return id(song?.bvid)||(isEntry(song)?id(song.mediaId)||id(String(song.id??'').replace(/^bilibili(?:-video)?:/,'')):'');
    }
    const videoUrl=bvid=>`https://www.bilibili.com/video/${bvid}/`;
    function text(value){
      const plain=String(value??'').replace(/<\/?em\b[^>]*>/gi,'');
      const entities={'&amp;':'&','&quot;':'"','&#39;':"'",'&lt;':'<','&gt;':'>'};
      return plain.replace(/&(?:amp|quot|lt|gt|#39);/g,entity=>entities[entity]).trim();
    }
    const uid=value=>/^\d+$/.test(String(value??''))&&Number(value)>0?String(value):'';
    function cover(value){
      const url=String(value??'').trim().replace(/^(?:http:)?\/\//i,'https://');
      try{const parsed=new URL(url);return parsed.protocol==='https:'&&!parsed.username&&!parsed.password?parsed.href:'';}catch{return '';}
    }
    function video(row,bvid=id(row?.bvid)){
      if(!bvid)return null;
      const rawViews=row?.stat?.view??row?.play;
      const rawDuration=row?.duration??row?.length;
      const duration=typeof rawDuration==='string'&&/^\d+(?::\d{1,2}){1,2}$/.test(rawDuration)
        ? rawDuration.split(':').reduce((sum,part)=>sum*60+Number(part),0)
        : Number(rawDuration)||0;
      return {
        id:`${source}:${bvid}`,source,bvid,mediaId:bvid,
        title:text(row?.title)||bvid,artist:text(row?.owner?.name??row?.author??row?.artist),
        uid:uid(row?.owner?.mid??row?.mid??row?.uid),cover:cover(row?.pic||row?.cover||row?.coverId),
        duration,views:rawViews!=null&&String(rawViews).trim()&&Number.isFinite(Number(rawViews))&&Number(rawViews)>=0?Number(rawViews):null,
      };
    }
    function createFloatingWindow({initialWidth,minWidth=244,maxWidth,frameHeight,minFrameHeight,geometryKey,fitFrame}){
      const margin=10,step=80;
      const visual=ROOT.visualViewport;
      const finePointer=geometryKey?ROOT.matchMedia('(any-pointer: fine)'):null;
      const sessionBounds={width:initialWidth};
      const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
      let panel,frame,frameChrome,gesture,smaller,larger;
      function viewport(){
        return {left:visual?.offsetLeft||0,top:visual?.offsetTop||0,width:visual?.width||ROOT.innerWidth,height:visual?.height||ROOT.innerHeight};
      }
      function hasCorners(view){return finePointer?.matches&&view.width>=500;}
      function geometry(view){
        if(!hasCorners(view))return sessionBounds;
        const saved=settings[geometryKey];
        if(saved&&typeof saved==='object'&&!Array.isArray(saved))return saved;
        return settings[geometryKey]={};
      }
      function limits(view){
        const max=Math.max(1,Math.floor(Math.min(maxWidth(view),view.width-2*margin)));
        return {min:Math.min(minWidth,max),max};
      }
      function maxFrameHeight(view){return Math.max(0,Math.floor(view.height-2*margin-frameChrome));}
      function place(left,top,view){
        const position={
          left:clamp(left,view.left+margin,view.left+view.width-panel.offsetWidth-margin),
          top:clamp(top,view.top+margin,view.top+view.height-panel.offsetHeight-margin),
        };
        panel.style.left=`${position.left}px`;
        panel.style.top=`${position.top}px`;
        return position;
      }
      function layout(){
        if(!panel)return;
        const view=viewport(),bounds=geometry(view),{min,max}=limits(view);
        const width=clamp(Number.isFinite(bounds.width)?bounds.width:initialWidth,min,max);
        panel.style.width=`${width}px`;
        if(frame){
          const maxHeight=maxFrameHeight(view);
          const height=Number.isFinite(bounds.height)
            ? clamp(bounds.height,Math.min(minFrameHeight,maxHeight),maxHeight)
            : frameHeight(width,view);
          frame.style.height=`${height}px`;
          fitFrame?.(frame);
          panel.classList.toggle('has-resize-corners',hasCorners(view));
        }
        smaller.disabled=width<=min;
        larger.disabled=width>=max;
        const player=DOC.getElementById(ID)?.getBoundingClientRect();
        const beside=player?.width&&player.left-view.left>=panel.offsetWidth+2*margin;
        const left=beside?player.left-panel.offsetWidth-margin:view.left+view.width-panel.offsetWidth-margin;
        const top=beside?player.top:view.top+margin;
        const position=place(Number.isFinite(bounds.left)?bounds.left:left,Number.isFinite(bounds.top)?bounds.top:top,view);
        if(bounds===sessionBounds)Object.assign(bounds,position);
        return position;
      }
      function saveBounds(bounds){
        if(geometryKey&&bounds===settings[geometryKey])persistSettings();
      }
      function resize(direction){
        const view=viewport(),bounds=geometry(view),{min,max}=limits(view);
        const rect=panel.getBoundingClientRect();
        bounds.width=clamp(rect.width+direction*step,min,max);
        if(Number.isFinite(bounds.height))bounds.height=frame.offsetHeight*bounds.width/rect.width;
        Object.assign(bounds,{left:rect.left,top:rect.top});
        Object.assign(bounds,layout());
        saveBounds(bounds);
      }
      function bindPointer(handle,canStart,move){
        handle.onpointerdown=event=>{
          if(gesture||event.button!==0||!event.isPrimary||!canStart(event))return;
          gesture={handle,id:event.pointerId,x:event.clientX,y:event.clientY,rect:panel.getBoundingClientRect(),bounds:geometry(viewport()),moved:false};
          handle.setPointerCapture(event.pointerId);
          handle.classList.add('is-dragging');
          panel.classList.add('is-pointer-active');
          event.preventDefault();
        };
        handle.onpointermove=event=>{
          if(gesture?.handle!==handle||gesture.id!==event.pointerId)return;
          const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
          if(!dx&&!dy&&!gesture.moved)return;
          const view=viewport(),bounds=geometry(view);
          if(bounds!==gesture.bounds)return;
          move(dx,dy,gesture.rect,view,bounds);
          gesture.moved=true;
        };
        handle.onpointerup=handle.onpointercancel=handle.onlostpointercapture=event=>{
          if(gesture?.handle!==handle||gesture.id!==event.pointerId)return;
          if(gesture.moved)saveBounds(gesture.bounds);
          gesture=null;
          handle.classList.remove('is-dragging');
          panel.classList.remove('is-pointer-active');
        };
      }
      function addResizeCorners(){
        for(const corner of ['nw','ne','sw','se']){
          const handle=DOC.createElement('span');
          handle.className=`video-resize-corner ${corner}`;
          handle.setAttribute('aria-hidden','true');
          panel.append(handle);
          const west=corner.endsWith('w'),north=corner.startsWith('n');
          bindPointer(handle,event=>event.pointerType==='mouse'&&hasCorners(viewport()),(dx,dy,rect,view,bounds)=>{
            // Hold the opposite corner still when a moving edge reaches a limit.
            const {min,max}=limits(view);
            const availableWidth=west?rect.right-view.left-margin:view.left+view.width-margin-rect.left;
            const availableHeight=(north?rect.bottom-view.top-margin:view.top+view.height-margin-rect.top)-frameChrome;
            const maxWidth=Math.max(1,Math.min(max,availableWidth));
            const maxHeight=Math.max(0,Math.min(maxFrameHeight(view),availableHeight));
            const width=clamp(rect.width+(west?-dx:dx),Math.min(min,maxWidth),maxWidth);
            const height=clamp(rect.height-frameChrome+(north?-dy:dy),Math.min(minFrameHeight,maxHeight),maxHeight);
            Object.assign(bounds,{width,height,left:west?rect.right-width:rect.left,top:north?rect.bottom-height-frameChrome:rect.top});
            layout();
          });
        }
      }
      function mount(element,controls){
        panel=element;
        ({smaller,larger,frame}=controls);
        smaller.onclick=()=>resize(-1);
        larger.onclick=()=>resize(1);
        bindPointer(panel.querySelector('.video-toolbar'),event=>!event.target.closest('button,a'),(dx,dy,rect,view,bounds)=>{
          Object.assign(bounds,place(rect.left+dx,rect.top+dy,view));
        });
        if(geometryKey)addResizeCorners();
        DOC.body.append(panel);
        if(frame)frameChrome=panel.offsetHeight-frame.offsetHeight;
        syncFloatingPanelThemes();
        layout();
        ROOT.addEventListener('resize',layout);
        finePointer?.addEventListener?.('change',layout);
        visual?.addEventListener('resize',layout);
        visual?.addEventListener('scroll',layout);
      }
      function close(){
        if(!panel)return;
        ROOT.removeEventListener('resize',layout);
        finePointer?.removeEventListener?.('change',layout);
        visual?.removeEventListener('resize',layout);
        visual?.removeEventListener('scroll',layout);
        if(gesture?.moved)saveBounds(gesture.bounds);
        gesture=null;
        panel.remove();
        panel=frame=smaller=larger=null;
      }
      return {mount,layout,close};
    }
    function createPlayer({beforeOpen,onClose}){
      const floating=createFloatingWindow({initialWidth:560,maxWidth:view=>Math.min(760,(view.height-58)*16/9)});
      let panel,activeId='';
      function inlineControls(){return DOC.querySelector(`#${ID} .selene-video-inline`);}
      function close(){
        if(!panel)return;
        floating.close();
        panel=null;activeId='';
        const inline=inlineControls();
        if(inline)inline.hidden=true;
        onClose();
      }
      function setPictureHidden(hidden){
        if(!panel)return;
        const focusInVideo=panel.contains(DOC.activeElement);
        const inline=inlineControls();
        if(inline)inline.hidden=!hidden;
        if(hidden&&focusInVideo){
          inline?.querySelector('[data-video-stop]').focus({preventScroll:true});
          if(panel.contains(DOC.activeElement))DOC.activeElement.blur();
        }
        panel.classList.toggle('is-picture-hidden',hidden);
        panel.inert=hidden;
        if(hidden)panel.setAttribute('aria-hidden','true');
        else{panel.removeAttribute('aria-hidden');floating.layout();}
      }
      function open(bvid,title,{showPicture=false}={}){
        if(!id(bvid))return;
        if(activeId===bvid){setPictureHidden(!showPicture);return;}
        close();
        beforeOpen();
        panel=DOC.createElement('section');
        panel.id=`${ID}-video`;
        panel.setAttribute('role','dialog');
        panel.setAttribute('aria-label','B 站视频');
        panel.innerHTML=`<header class="video-toolbar" title="拖动标题栏移动视频">
          <b></b>
          <button type="button" data-video-smaller title="缩小窗口" aria-label="缩小窗口">−</button>
          <button type="button" data-video-larger title="放大窗口" aria-label="放大窗口">+</button>
          <button type="button" data-video-hide title="收起画面继续听（实验性）" aria-label="收起画面继续听（实验性）">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5H5v3m11-3h3v3M5 16v3h3m11-3v3h-3M3 3l18 18"/></svg>
          </button>
          <button type="button" data-video-close title="关闭视频" aria-label="关闭视频">×</button>
        </header><div class="video-frame"></div>`;
        panel.querySelector('b').textContent=title&&title!==bvid?title:'B 站视频';
        const iframe=DOC.createElement('iframe');
        iframe.title=title||bvid;
        iframe.allow='autoplay; fullscreen';
        iframe.allowFullscreen=true;
        iframe.src=`https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=1&muted=0`;
        panel.querySelector('.video-frame').append(iframe);
        panel.querySelector('[data-video-close]').onclick=close;
        panel.querySelector('[data-video-hide]').onclick=()=>setPictureHidden(true);
        panel.onkeydown=event=>{if(event.key==='Escape')setPictureHidden(true);};
        if(!showPicture)setPictureHidden(true);
        activeId=bvid;
        floating.mount(panel,{
          smaller:panel.querySelector('[data-video-smaller]'),
          larger:panel.querySelector('[data-video-larger]'),
        });
      }
      return {open,close,isOpen:()=>!!panel};
    }
    const touchWeb=ROOT.matchMedia('(hover: none) and (pointer: coarse)');
    const mobileSearchUA=/iPhone|iPod|Android.+Mobile/i.test(ROOT.navigator.userAgent);
    function fitWebFrame(frame){
      const canvas=frame.firstElementChild;
      const baseWidth=1120;
      // The desktop site needs about 1100px. Keep narrow touch screens readable
      // by letting the wrapper scroll horizontally once scaling reaches its floor.
      const fit=touchWeb.matches&&!frame.hasAttribute('data-native-search');
      const scale=fit?Math.min(1,Math.max(.7,frame.clientWidth/baseWidth)):1;
      canvas.style.width=scale<1?`${baseWidth*scale}px`:'';
      if(scale<1)canvas.style.setProperty('--bili-web-scale',scale);
      else canvas.style.removeProperty('--bili-web-scale');
    }
    const searchWindow=createFloatingWindow({
      initialWidth:960,minWidth:264,maxWidth:()=>1280,minFrameHeight:180,geometryKey:'bilibiliSearchWindow',fitFrame:fitWebFrame,
      frameHeight:(width,view)=>Math.max(0,Math.floor(Math.min(width*(view.width<500?1.5:.76),view.height-58))),
    });
    let searchPanel;
    function closeSearch(){
      searchWindow.close();
      searchPanel=null;
    }
    function openSearch(keyword){
      const link=videoLink(keyword);
      const videoId=id(keyword)||link?.videoId;
      const url=videoId
        ? `${videoUrl(videoId)}${link?.url.search||''}${link?.url.hash||''}`
        : `https://search.bilibili.com/video?keyword=${encodeURIComponent(keyword)}`;
      if(!searchPanel){
        searchPanel=DOC.createElement('section');
        searchPanel.id=`${ID}-bilibili-search`;
        searchPanel.setAttribute('role','dialog');
        searchPanel.setAttribute('aria-label','B站网页');
        searchPanel.innerHTML=`<header class="video-toolbar" title="拖动标题栏移动窗口">
          <b>B站网页</b>
          <a target="_blank" rel="noopener noreferrer">在 B站打开 ↗</a>
          <button type="button" data-search-smaller title="缩小窗口" aria-label="缩小窗口">−</button>
          <button type="button" data-search-larger title="放大窗口" aria-label="放大窗口">+</button>
          <button type="button" data-search-close title="关闭搜索" aria-label="关闭搜索">×</button>
        </header><div class="bilibili-web-viewport"><div class="bilibili-web-canvas">
          <iframe allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div></div>`;
        const closeButton=searchPanel.querySelector('[data-search-close]');
        closeButton.onclick=closeSearch;
        searchPanel.onkeydown=event=>{if(event.key==='Escape')closeSearch();};
        searchWindow.mount(searchPanel,{
          smaller:searchPanel.querySelector('[data-search-smaller]'),
          larger:searchPanel.querySelector('[data-search-larger]'),
          frame:searchPanel.querySelector('.bilibili-web-viewport'),
        });
        closeButton.focus({preventScroll:true});
      }
      searchPanel.querySelector('a').href=url;
      const frame=searchPanel.querySelector('.bilibili-web-viewport');
      // Bilibili normally redirects phone user agents to its responsive search page.
      frame.toggleAttribute('data-native-search',!videoId&&mobileSearchUA);
      fitWebFrame(frame);
      frame.scrollLeft=0;
      const iframe=frame.querySelector('iframe');
      iframe.title=videoId?'哔哩哔哩视频详情':'哔哩哔哩官方搜索';
      iframe.src=url;
    }
    return {isEntry,trackId,inputId,video,videoUrl,createPlayer,openSearch,closeSearch};
  })();
  const isVideoEntry=bilibili.isEntry;
  const bilibiliPlayer=bilibili.createPlayer({
    beforeOpen(){
      setStatus('');
      playbackWanted=false;
      ++playRequest;
      cancelPlaybackProbe?.();
      clearInterruptionRetry();
      playbackPhase='idle';
      audio.pause();
      pauseKeepAliveForTrack();
      updatePlayButton();
    },
    onClose(){if(!disposed)scheduleKeepAliveSync();},
  });
  const audio = new ROOT.Audio();
  audio.preload = 'auto';
  audio.playsInline = true;
  audio.setAttribute('playsinline','');
  audio.setAttribute('webkit-playsinline','');
  audio.id='selene-main-music-media';
  audio.hidden=true;
  const keepAliveAudio = new ROOT.Audio();
  keepAliveAudio.autoplay = true;
  keepAliveAudio.controls = true;
  keepAliveAudio.loop = true;
  keepAliveAudio.preload = 'auto';
  keepAliveAudio.setAttribute('autoplay','');
  keepAliveAudio.playsInline = true;
  keepAliveAudio.setAttribute('playsinline','');
  keepAliveAudio.setAttribute('webkit-playsinline','');
  keepAliveAudio.setAttribute('title',KEEPALIVE_NAME);
  keepAliveAudio.id='selene-keepalive-media';
  keepAliveAudio.hidden=true;
  let keepAliveUrl = '', keepAliveObjectUrl = '', keepAliveTimer = 0, keepAliveSyncTimer = 0, keepAlivePending = false, keepAliveError = '', keepAliveGestureArmed = false, keepAliveSuspendedForTrack = false, keepAliveManualTakeover = false, keepAliveStarting = false, keepAliveFallbackTried = false;
  function useCompatibilityKeepAliveUrl(){
    if(!keepAliveObjectUrl){
      // 44.1kHz / 16-bit / mono PCM is accepted by significantly more mobile WebViews than the old 8kHz fallback.
      const sampleRate=44100,seconds=2,samples=sampleRate*seconds,buffer=new ArrayBuffer(44+samples*2),view=new DataView(buffer);
      const text=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));};
      text(0,'RIFF');view.setUint32(4,36+samples*2,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,samples*2,true);
      for(let i=0;i<samples;i++)view.setInt16(44+i*2,(i%2205)<1102?1:-1,true);
      keepAliveObjectUrl=ROOT.URL.createObjectURL(new ROOT.Blob([buffer],{type:'audio/wav'}));
    }
    keepAliveFallbackTried=true;keepAliveUrl=keepAliveObjectUrl;keepAliveAudio.src=keepAliveUrl;return keepAliveUrl;
  }
  function ensureKeepAliveUrl(){
    if(keepAliveUrl){if(keepAliveAudio.src!==keepAliveUrl)keepAliveAudio.src=keepAliveUrl;return keepAliveUrl;}
    const extensionAsset=String(ROOT.__SELENE_KEEPALIVE_URL__||'').trim();
    if(extensionAsset){keepAliveUrl=extensionAsset;keepAliveAudio.src=keepAliveUrl;return keepAliveUrl;}
    return useCompatibilityKeepAliveUrl();
  }
  // Once a song is selected, it must keep ownership of Media Session even while paused.
  // Otherwise the silent keepalive becomes the active system card and iOS/macOS keeps showing a pause action.
  function mainTrackOwnsMediaSession(){return bilibiliPlayer.isOpen()||!!current&&!keepAliveManualTakeover;}
  function keepAliveActive(){return !!settings.keepAlive&&!keepAliveSuspendedForTrack&&!keepAliveAudio.paused&&!keepAliveAudio.ended;}
  function updateKeepAliveUI(){
    const panel=DOC.querySelector(`#${ID} .settings-panel`),state=panel?.querySelector('[data-keepalive-state]'),button=panel?.querySelector('[data-keepalive-toggle]'),card=panel?.querySelector('[data-keepalive-card]');
    if(!state||!button)return;
    const active=keepAliveActive(),suspended=!!settings.keepAlive&&keepAliveSuspendedForTrack,pending=!!settings.keepAlive&&keepAlivePending;
    state.textContent=active?(keepAliveManualTakeover?'已手动回到静音保活':'未选歌曲，保活运行中'):suspended?'当前歌曲已接管系统媒体':keepAliveError?'启动失败':pending?'等待首次播放授权':'未启动';
    state.style.color=active||suspended?'#9fdda9':keepAliveError?'#ee9b9b':pending?'#f2cf70':'#b8b8c2';
    button.textContent=settings.keepAlive?'■ 关闭自动保活':'▶ 开启自动保活';
    card?.classList.remove('active');
    card?.classList.toggle('keepalive-running',active);
  }
  function disarmKeepAliveGesture(){
    if(!keepAliveGestureArmed)return;
    keepAliveGestureArmed=false;
    DOC.removeEventListener('click',resumeKeepAliveFromGesture,true);
    DOC.removeEventListener('keydown',resumeKeepAliveFromGesture,true);
  }
  function armKeepAliveGesture(){
    if(keepAliveGestureArmed||!settings.keepAlive)return;
    keepAliveGestureArmed=true;
    DOC.addEventListener('click',resumeKeepAliveFromGesture,true);
    DOC.addEventListener('keydown',resumeKeepAliveFromGesture,true);
  }
  function resumeKeepAliveFromGesture(){
    disarmKeepAliveGesture();
    if(settings.keepAlive)syncKeepAliveWithPlayback();
  }
  function pauseKeepAliveForTrack(){
    keepAliveManualTakeover=false;
    keepAliveSuspendedForTrack=!!settings.keepAlive;keepAlivePending=false;keepAliveError='';disarmKeepAliveGesture();
    try{if(!keepAliveAudio.paused)keepAliveAudio.pause();}catch{}
    updateKeepAliveUI();emitPublicState();
  }
  function scheduleKeepAliveSync(delay=180){if(keepAliveSyncTimer)ROOT.clearTimeout(keepAliveSyncTimer);keepAliveSyncTimer=ROOT.setTimeout(()=>{keepAliveSyncTimer=0;syncKeepAliveWithPlayback();},delay);}
  function syncKeepAliveWithPlayback(){
    if(!settings.keepAlive)return;
    if(mainTrackOwnsMediaSession()){pauseKeepAliveForTrack();return;}
    startKeepAlive({persist:false,notify:false});
  }
  async function startKeepAlive({persist=true,notify=false}={}){
    settings.keepAlive=true;
    keepAliveError='';
    applyAudioSessionMode();
    if(persist)save();
    if(mainTrackOwnsMediaSession()){pauseKeepAliveForTrack();if(notify)toast('success','自动保活已开启，当前歌曲会继续接管系统媒体');return true;}
    if(keepAliveActive()){updateKeepAliveUI();return true;}
    if(keepAliveStarting)return false;
    keepAliveStarting=true;keepAliveSuspendedForTrack=false;
    if(!keepAliveAudio.isConnected)DOC.body.appendChild(keepAliveAudio);
    ensureKeepAliveUrl();
    keepAliveAudio.loop=true;
    keepAliveAudio.muted=false;
    keepAliveAudio.volume=1;
    try{
      await keepAliveAudio.play();
      if(disposed||!settings.keepAlive||mainTrackOwnsMediaSession()){try{keepAliveAudio.pause();}catch{}if(mainTrackOwnsMediaSession())pauseKeepAliveForTrack();return false;}
      keepAlivePending=false;
      disarmKeepAliveGesture();
      if(!keepAliveTimer)keepAliveTimer=ROOT.setInterval(syncKeepAliveWithPlayback,20000);
      updateKeepAliveUI();
      if(notify)toast('success','自动保活已启动');
      return true;
    }catch(error){
      if(error?.name==='NotSupportedError'&&!keepAliveFallbackTried){
        console.info('[音乐播放器] 当前保活音频不受支持，切换兼容 WAV',error);useCompatibilityKeepAliveUrl();keepAliveStarting=false;return await startKeepAlive({persist:false,notify});
      }
      keepAlivePending=error?.name==='NotAllowedError';
      keepAliveError=keepAlivePending?'':String(error?.message||'媒体无法播放');
      if(keepAlivePending)armKeepAliveGesture();
      updateKeepAliveUI();
      if(notify)toast(keepAlivePending?'warning':'error',keepAlivePending?'系统媒体未能自动启动，请点击“重新启动保活”':`保活启动失败：${error?.message||'未知错误'}`);
      console.warn('[音乐播放器] 后台保活启动失败',error);
      return false;
    }finally{keepAliveStarting=false;}
  }
  function stopKeepAlive({persist=true,notify=false}={}){
    settings.keepAlive=false;
    keepAlivePending=false;
    keepAliveError='';
    keepAliveSuspendedForTrack=false;
    keepAliveManualTakeover=false;
    disarmKeepAliveGesture();
    if(keepAliveTimer){ROOT.clearInterval(keepAliveTimer);keepAliveTimer=0;}
    if(keepAliveSyncTimer){ROOT.clearTimeout(keepAliveSyncTimer);keepAliveSyncTimer=0;}
    try{keepAliveAudio.pause();keepAliveAudio.currentTime=0;}catch{}
    if(persist)save();
    updateKeepAliveUI();
    if(notify)toast('info','系统媒体保活已停止');
  }
  function ensureKeepAlive(){
    if(current&&!audio.paused)updateMediaMetadata(current,true);
    syncKeepAliveWithPlayback();
    if(companionMessageQueue.length)drainCompanionMessageQueue();
    if(playbackWanted&&current&&audio.paused&&!audio.ended)scheduleInterruptionRecovery(0);
  }
  function cleanupKeepAlive(){
    disarmKeepAliveGesture();
    if(keepAliveTimer){ROOT.clearInterval(keepAliveTimer);keepAliveTimer=0;}
    if(keepAliveSyncTimer){ROOT.clearTimeout(keepAliveSyncTimer);keepAliveSyncTimer=0;}
    DOC.removeEventListener('visibilitychange',ensureKeepAlive);
    DOC.removeEventListener('resume',ensureKeepAlive);
    ROOT.removeEventListener('pageshow',ensureKeepAlive);
    ROOT.removeEventListener('focus',ensureKeepAlive);
    try{keepAliveAudio.pause();keepAliveAudio.removeAttribute('src');keepAliveAudio.load();}catch{}
    keepAliveAudio.remove();
    if(keepAliveObjectUrl){try{ROOT.URL.revokeObjectURL(keepAliveObjectUrl);}catch{}keepAliveObjectUrl='';}
    keepAliveUrl='';
  }
  keepAliveAudio.addEventListener('play',()=>{if(!settings.keepAlive||mainTrackOwnsMediaSession()){try{keepAliveAudio.pause();}catch{}if(mainTrackOwnsMediaSession())pauseKeepAliveForTrack();return;}keepAliveSuspendedForTrack=false;keepAlivePending=false;keepAliveError='';updateKeepAliveMediaMetadata(true);updateKeepAliveUI();emitPublicState();});
  keepAliveAudio.addEventListener('pause',()=>{if(settings.keepAlive&&!disposed&&!keepAliveSuspendedForTrack&&!mainTrackOwnsMediaSession()){keepAlivePending=true;if(settings.audioSessionMode==='priority')scheduleKeepAliveSync(900);}updateKeepAliveUI();emitPublicState();});
  keepAliveAudio.addEventListener('error',()=>{if(settings.keepAlive&&!keepAliveSuspendedForTrack)keepAliveError='保活媒体加载失败';updateKeepAliveUI();emitPublicState();});
  let results = [], current = null, queue = [], queueIndex = -1, lastRecommendation = '', lastRecommendationChat = null, lyricTimeline = [], currentLyricWords = '', playRequest = 0, disposed = false, menuAddTimer = 0, menuObserver = null, progressSeeking = false, pendingProgressValue = 0, currentCacheObjectUrl = '', playbackWanted = false, interruptionRetryTimer = 0, interruptionRetryCount = 0, companionBusy = false, companionRequest = 0, companionAutoSongKey = '', companionAutoCount = 0, companionMidSongDone = false, companionDragged = false, companionQueueDraining = false, companionListeningClock = null, companionListeningSavedAt = 0, companionListeningAwaitingPlay = false; const companionMessageQueue=[],lyricCache = new Map(),lyricRequests=new Map();
  let lyricState='暂无歌词',immersiveLyricsObserver=null;
  let cancelPlaybackProbe=null,playbackPhase='idle',audioPriming=false,playbackRecoveryCount=0,pendingPlaybackSelection=false,audioPrimeUrl='',playbackBlobRetryUsed=false;
  const failedPlaybackUrls=new Set();let playbackSources=new WeakMap();
  let searchRequest=0;
  const mediaSession=ROOT.navigator?.mediaSession||null;
  const audioSession=ROOT.navigator?.audioSession||null;
  const mediaActions=['play','pause','stop','previoustrack','nexttrack','seekbackward','seekforward','seekto'];
  let lastMediaPositionSecond=-1,mediaMetadataRefreshTimers=[];
  function applyAudioSessionMode(){
    if(!audioSession)return false;
    try{audioSession.type=settings.audioSessionMode==='mix'?'ambient':'playback';return true;}catch(error){console.info('[音乐播放器] 当前浏览器无法设置音频会话模式',error);return false;}
  }
  function clearInterruptionRetry(){if(interruptionRetryTimer){ROOT.clearTimeout(interruptionRetryTimer);interruptionRetryTimer=0;}}
  function scheduleInterruptionRecovery(delay=900){
    clearInterruptionRetry();
    if(settings.audioSessionMode!=='priority'||!playbackWanted||!current||disposed)return;
    interruptionRetryTimer=ROOT.setTimeout(async()=>{interruptionRetryTimer=0;if(!playbackWanted||!current||!audio.paused)return;interruptionRetryCount++;try{applyAudioSessionMode();await resumeMainAudioFromMediaSession();}catch(error){console.info('[音乐播放器] 系统暂未允许恢复播放',error);if(interruptionRetryCount<5)scheduleInterruptionRecovery(Math.min(5000,900*interruptionRetryCount));else setStatus('系统仍在占用媒体焦点，返回播放器点播放可再次恢复');}},delay);
  }
  function handleAudioSessionState(){
    if(audioSession?.state==='interrupted'){
      if(settings.audioSessionMode==='priority'&&playbackWanted)setStatus('播放被其他应用打断，正在等待系统恢复…');
      scheduleInterruptionRecovery(1200);
    }else if(settings.audioSessionMode==='priority'&&playbackWanted&&audio.paused)scheduleInterruptionRecovery(250);
  }
  function setMediaAction(action,handler){if(!mediaSession?.setActionHandler)return;try{mediaSession.setActionHandler(action,handler);}catch(error){console.info(`[音乐播放器] 系统媒体操作不受支持：${action}`,error);}}
  function clearMediaPosition(){lastMediaPositionSecond=-1;if(mediaSession?.setPositionState)try{mediaSession.setPositionState();}catch{}}
  function updateMediaPosition(force=false){
    if(!mediaSession?.setPositionState)return;
    if(audioPriming||pendingPlaybackSelection){clearMediaPosition();return;}
    const duration=Number(audio.duration),position=Number(audio.currentTime),playbackRate=Number(audio.playbackRate)||1;
    if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(position)){clearMediaPosition();return;}
    const safePosition=Math.max(0,Math.min(duration,position)),second=Math.floor(safePosition);
    if(!force&&second===lastMediaPositionSecond)return;
    lastMediaPositionSecond=second;
    try{mediaSession.setPositionState({duration,playbackRate:playbackRate>0?playbackRate:1,position:safePosition});}catch(error){console.info('[音乐播放器] 无法更新系统媒体进度',error);}
  }
  function updateMediaPlaybackState(forcePosition=false){
    if(!mediaSession)return;
    try{mediaSession.playbackState=playbackPhase==='playing'&&!audio.paused?'playing':'paused';}catch{}
    updateMediaPosition(forcePosition);
  }
  function clearMediaMetadataRefresh(){for(const timer of mediaMetadataRefreshTimers)ROOT.clearTimeout(timer);mediaMetadataRefreshTimers=[];}
  function updateKeepAliveMediaMetadata(force=false){
    if(!mediaSession||!ROOT.MediaMetadata||!keepAliveActive()||mainTrackOwnsMediaSession())return;
    const data={title:KEEPALIVE_NAME};
    if(KEEPALIVE_ARTWORK_URL)data.artwork=[{src:KEEPALIVE_ARTWORK_URL,sizes:'1254x1254',type:'image/png'}];
    const apply=()=>{
      if(disposed||!keepAliveActive()||mainTrackOwnsMediaSession())return;
      try{mediaSession.metadata=new ROOT.MediaMetadata(data);mediaSession.playbackState='playing';}catch(error){console.warn('[音乐播放器] 保活媒体信息更新失败',error);}
      clearMediaPosition();
    };
    clearMediaMetadataRefresh();
    apply();
    if(force)for(const delay of [100,600])mediaMetadataRefreshTimers.push(ROOT.setTimeout(apply,delay));
  }
  function updateMediaMetadata(song=current,force=false){
    if(!mediaSession||!ROOT.MediaMetadata||!song)return;
    const clean=(value,fallback)=>String(value||fallback).replace(/[\u0000-\u001f\u007f]+/g,' ').replace(/\s+/g,' ').trim()||fallback;
    const data={title:clean(song.title,'未知歌曲'),artist:clean(song.artist,'未知歌手'),album:clean(song.album,'Selene 音乐播放器')};
    if(song.cover)try{const artwork=new URL(String(song.cover),DOC.baseURI);if(/^https?:$/.test(artwork.protocol))data.artwork=[{src:artwork.href}];}catch{}
    const apply=()=>{if(disposed||current!==song)return;try{mediaSession.metadata=new ROOT.MediaMetadata(data);}catch(error){console.warn('[音乐播放器] 系统媒体信息更新失败',error);}};
    apply();
    if(force){clearMediaMetadataRefresh();for(const delay of [100,600])mediaMetadataRefreshTimers.push(ROOT.setTimeout(()=>{apply();updateMediaPlaybackState(true);},delay));}
  }
  function seekMediaTo(value){
    const duration=Number(audio.duration),target=Number(value);
    if(!Number.isFinite(target))return;
    audio.currentTime=Number.isFinite(duration)&&duration>0?Math.max(0,Math.min(duration,target)):Math.max(0,target);
    updateMediaPosition(true);
  }
  function switchMediaTrack(step){const song=nextSong(step);if(song)play(song);}
  async function resumeMainAudioFromMediaSession(){
    bilibiliPlayer.close();
    if(!current){syncKeepAliveWithPlayback();return;}
    playbackWanted=true;applyAudioSessionMode();pauseKeepAliveForTrack();updateMediaMetadata(current,true);
    if(pendingPlaybackSelection||audioPriming||audio.error||!audio.currentSrc&&!audio.src){await play(current);return;}
    const request=playRequest,song=current;
    try{
      await playUrl(audio.currentSrc||audio.src,'继续播放',false,{resume:true,isActive:()=>!disposed&&playbackWanted&&request===playRequest});
      if(request!==playRequest||current!==song)return;
      if(song.source!=='direct'){applyCurrentCover(song,request);loadLyrics(song,request);}
    }catch(error){
      if(disposed||request!==playRequest||!playbackWanted)return;
      if(isNotAllowed(error)){playbackWanted=false;playbackPhase='idle';audio.pause();updatePlayButton();notifyPlaybackBlocked();}
      else recoverStuckPlayback(error,audio.currentSrc||audio.src);
    }
  }
  function setupMediaSession(){
    applyAudioSessionMode();
    if(!mediaSession)return;
    audio.addEventListener('playing',updatePlayButton);
    setMediaAction('play',()=>resumeMainAudioFromMediaSession());
    setMediaAction('pause',()=>{playbackWanted=false;cancelPlaybackProbe?.();audio.pause();updateMediaPlaybackState(true);scheduleKeepAliveSync();});
    setMediaAction('stop',()=>{playbackWanted=false;cancelPlaybackProbe?.();audio.pause();seekMediaTo(0);scheduleKeepAliveSync();});
    setMediaAction('previoustrack',()=>switchMediaTrack(-1));
    setMediaAction('nexttrack',()=>switchMediaTrack(1));
    setMediaAction('seekbackward',details=>seekMediaTo(audio.currentTime-(Number(details?.seekOffset)||10)));
    setMediaAction('seekforward',details=>seekMediaTo(audio.currentTime+(Number(details?.seekOffset)||10)));
    setMediaAction('seekto',details=>{const target=Number(details?.seekTime);if(!Number.isFinite(target))return;if(details?.fastSeek&&typeof audio.fastSeek==='function')audio.fastSeek(target);else seekMediaTo(target);updateMediaPosition(true);});
  }
  function clearMediaSession(){
    if(!mediaSession)return;
    clearMediaMetadataRefresh();
    for(const action of mediaActions)setMediaAction(action,null);
    try{mediaSession.metadata=null;mediaSession.playbackState='none';}catch{}
    clearMediaPosition();
  }
  function stopPlayback({release=true,stopBackground=false}={}){
    bilibiliPlayer.close();
    trackCompanionListeningTime({stop:true,saveNow:true});
    ++playRequest;
    cancelPlaybackProbe?.();audioPriming=false;playbackPhase='idle';
    playbackWanted=false;
    interruptionRetryCount=0;
    clearInterruptionRetry();
    lyricTimeline=[];
    lyricState='暂无歌词';
    currentLyricWords='';
    try{audio.pause();audio.currentTime=0;}catch{}
    if(release)try{audio.removeAttribute('src');audio.load();}catch{}
    if(currentCacheObjectUrl){try{ROOT.URL.revokeObjectURL(currentCacheObjectUrl);}catch{}currentCacheObjectUrl='';}
    if(stopBackground)stopKeepAlive({persist:true,notify:false});
    updatePlayButton();
    renderDesktopLyrics('');
  }
  const save = () => {const persisted=persistSettings();updateCurrentFavorite();return persisted;};
  if(settings.theme!=='auto'){settings.theme='auto';save();}
  const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[c]);
  const toast = (kind, text) => ROOT.toastr?.[kind]?.(text);
  const context = () => { try { return ROOT.SillyTavern?.getContext?.() || ROOT.getContext?.(); } catch { return null; } };
  const OFFLINE_DB='selene-music-offline-v1',OFFLINE_STORE='tracks';
  let offlineDbPromise=null;
  function offlineKey(song){return `${normalizeSongText(song?.title)}::${normalizeSongText(song?.artist)}`;}
  function openOfflineDb(){
    if(offlineDbPromise)return offlineDbPromise;
    offlineDbPromise=new Promise((resolve,reject)=>{
      if(!ROOT.indexedDB){reject(Error('当前浏览器不支持离线缓存'));return;}
      const request=ROOT.indexedDB.open(OFFLINE_DB,1);
      request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(OFFLINE_STORE))db.createObjectStore(OFFLINE_STORE,{keyPath:'key'});};
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error||Error('无法打开离线缓存'));
    }).catch(error=>{offlineDbPromise=null;throw error;});
    return offlineDbPromise;
  }
  async function offlineRequest(mode,method,value){
    const db=await openOfflineDb();
    return new Promise((resolve,reject)=>{const tx=db.transaction(OFFLINE_STORE,mode),store=tx.objectStore(OFFLINE_STORE),request=store[method](value);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||tx.error||Error('离线缓存操作失败'));});
  }
  const getOfflineSong=song=>offlineRequest('readonly','get',offlineKey(song));
  const listOfflineSongs=()=>offlineRequest('readonly','getAll');
  const putOfflineSong=record=>offlineRequest('readwrite','put',record);
  const deleteOfflineSong=song=>offlineRequest('readwrite','delete',offlineKey(song));
  const formatBytes=value=>{const bytes=Number(value)||0;if(bytes<1024*1024)return `${Math.max(1,Math.round(bytes/1024))} KB`;return `${(bytes/1024/1024).toFixed(1)} MB`;};
  function releaseOfflineObjectUrl(except=''){if(currentCacheObjectUrl&&currentCacheObjectUrl!==except){try{ROOT.URL.revokeObjectURL(currentCacheObjectUrl);}catch{}currentCacheObjectUrl='';}}
  async function playOfflineSong(song,isActive=()=>true){
    try{
      const record=await getOfflineSong(song);
      if(!isActive()||!record?.blob?.size||song.customAudio&&record.song?.customAudio!==song.customAudio)return null;
      if(song.source!=='direct'&&!Number.isFinite(scoreSongHit(record.song,song)))return null;
      const url=ROOT.URL.createObjectURL(record.blob);releaseOfflineObjectUrl(url);currentCacheObjectUrl=url;
      await playUrl(url,'离线缓存',false,{isActive});
      return {...song,...record.song,...(song.source==='direct'?{title:song.title,artist:song.artist}:{}),customAudio:song.customAudio||'',audio:'',offline:true};
    }catch(error){if(isNotAllowed(error)||error.name==='AbortError')throw error;console.warn('[音乐播放器] 离线缓存读取失败',error);return null;}
  }
  const GD_SOURCE_LABELS={netease:'网易云',tencent:'QQ',kugou:'酷狗',kuwo:'酷我',migu:'咪咕',joox:'JOOX'};
  function cacheDownloadError(error){
    if(error?.name==='AbortError')return'下载超时';
    if(error?.status===403)return'403 防盗链或权限限制';
    if(error?.status===404||error?.status===410)return`${error.status} 临时地址已过期`;
    if(Number(error?.status))return`HTTP ${error.status}`;
    if(error?.code==='empty')return'返回了空文件';
    if(error?.code==='not-audio')return'返回内容不是音频';
    if(error instanceof TypeError||/failed to fetch|load failed|networkerror/i.test(String(error?.message||'')))return'跨域 CORS 或网络限制';
    return String(error?.message||'下载失败').slice(0,80);
  }
  const isExpiredAudioError=error=>[403,404,410].includes(Number(error?.status));
  async function fetchCacheBlob(candidate,timeout=45000){
    const controller=new AbortController(),timer=ROOT.setTimeout(()=>controller.abort(),timeout);
    try{
      const response=await fetch(candidate.audio,{cache:'no-store',credentials:'omit',redirect:'follow',referrerPolicy:'no-referrer',signal:controller.signal});
      if(!response.ok){const error=Error(`HTTP ${response.status}`);error.status=response.status;throw error;}
      const type=String(response.headers.get('content-type')||'').toLowerCase(),length=response.headers.get('content-length');
      if(length!==null&&Number(length)===0){const error=Error('空文件');error.code='empty';throw error;}
      if(/(?:text\/html|application\/(?:json|xml)|text\/plain)/i.test(type)){const error=Error(`非音频响应 ${type}`);error.code='not-audio';throw error;}
      const blob=await response.blob();
      if(!blob.size||blob.size<8192){const error=Error('音频文件为空或不完整');error.code='empty';throw error;}
      if(blob.type&&/(?:text\/|json|xml|html)/i.test(blob.type)){const error=Error(`非音频文件 ${blob.type}`);error.code='not-audio';throw error;}
      return blob;
    }finally{ROOT.clearTimeout(timer);}
  }
  async function cacheSong(song,{quiet=false}={}){
    if(isVideoEntry(song)){if(!quiet)setStatus('B 站视频通过官方播放器打开',true);return false;}
    if(!song?.title)return false;
    try{
      const existing=await getOfflineSong(song);if(existing?.blob?.size&&(!song.customAudio||existing.song?.customAudio===song.customAudio)){if(!quiet){setStatus(`${song.title} 已有离线缓存`);toast('info','这首歌已经缓存');}return true;}
      const failures=[],attempted=new Set(),uniqueUrls=new Set(),sources=song.source==='direct'?[]:[...new Set([song.source,...GD_SOURCES].filter(source=>GD_SOURCES.includes(source)))];let expiredFailures=0,attemptNumber=0;
      const tryCandidate=async(candidate,phase)=>{if(!candidate?.audio)return false;const attemptKey=`${phase}:${candidate.audio}`;if(attempted.has(attemptKey))return false;attempted.add(attemptKey);uniqueUrls.add(candidate.audio);attemptNumber++;const sourceLabel=candidate.downloadLabel||GD_SOURCE_LABELS[candidate.source]||candidate.source||`音源 ${attemptNumber}`,baseLabel=candidate.refreshed?`${sourceLabel}刷新源`:sourceLabel,label=candidate.bitrate?`${baseLabel} ${candidate.bitrate}k`:baseLabel;setStatus(`正在尝试${label}缓存：${song.title}`);try{const blob=await fetchCacheBlob(candidate),savedSong=strip({...song,...candidate,audio:''});try{await putOfflineSong({key:offlineKey(savedSong),song:savedSong,blob,size:blob.size,type:blob.type||'audio/mpeg',cachedAt:Date.now(),downloadSource:candidate.source||'saved'});}catch(error){if(error?.name==='QuotaExceededError'||/quota|storage.*full|空间/i.test(String(error?.message||'')))throw Error('浏览器离线存储空间不足，请先删除部分缓存');throw error;}ROOT.navigator?.storage?.persist?.().catch?.(()=>{});setStatus(`已缓存 ${song.title} · ${formatBytes(blob.size)} · ${label}`);if(!quiet)toast('success',`已缓存，可离线播放（${formatBytes(blob.size)} · ${label}）`);return true;}catch(error){const detail=cacheDownloadError(error);failures.push(`${label}：${detail}`);if(isExpiredAudioError(error))expiredFailures++;console.warn(`[音乐播放器] ${label} 缓存源不可用`,error);if(/存储空间不足/.test(String(error?.message||'')))throw error;return false;}};
      const sameCurrent=!!current&&offlineKey(current)===offlineKey(song),liveAudio=sameCurrent&&!audio.dataset?.seleneLxSource&&audio.readyState>=2&&/^https?:/i.test(String(audio.currentSrc||''))?{...song,audio:audio.currentSrc,downloadLabel:'当前实际播放源'}:null,savedAudio=/^https?:/i.test(String(song.audio||''))?{...song,downloadLabel:sameCurrent?'当前播放源':'已保存播放源'}:null;
      const customAudio=song.customAudio?{...song,audio:song.customAudio,downloadLabel:'手动音源'}:null;
      for(const candidate of[customAudio,liveAudio,savedAudio])if(candidate&&await tryCandidate(candidate,'live'))return true;
      for(const source of sources)for(const bitrate of ['320','128'])for(const candidate of await resolveGdSourceTracks(song,source,false,{bitrate}))if(await tryCandidate(candidate,'normal'))return true;
      if(expiredFailures){setStatus(`当前音频地址已失效，正在强制刷新下载地址：${song.title}`);const nonce=`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;for(const source of sources)for(const bitrate of ['320','128'])for(const candidate of await resolveGdSourceTracks(song,source,false,{bitrate,fresh:true,nonce:`${nonce}-${source}`}))if(await tryCandidate(candidate,'fresh'))return true;}
      if(!uniqueUrls.size)throw Error('没有找到严格匹配的可下载音源');
      throw Error(`所有下载源均失败（${failures.slice(-5).join('；')}${failures.length>5?'；此前候选也不可用':''}）`);
    }catch(error){console.warn('[音乐播放器] 歌曲缓存失败',error);setStatus(`缓存失败：${error.message}`);if(!quiet)toast('error',`缓存失败：${error.message}`);return false;}
  }

  try { ROOT.__SAFE_MUSIC_CLEANUP__?.(); } catch {}
  DOC.addEventListener('visibilitychange',ensureKeepAlive);
  DOC.addEventListener('resume',ensureKeepAlive);
  ROOT.addEventListener('pageshow',ensureKeepAlive);
  ROOT.addEventListener('focus',ensureKeepAlive);
  function mount() {
    DOC.getElementById(`${ID}-color-isolation`)?.remove();
    DOC.getElementById(`${ID}-companion`)?.remove(); DOC.getElementById(`${ID}-companion-style`)?.remove();
    DOC.getElementById(ID)?.remove(); DOC.getElementById(`${ID}-style`)?.remove(); DOC.getElementById(`${ID}-theme-style`)?.remove(); DOC.getElementById(`${ID}-polish-style`)?.remove(); DOC.getElementById(`${ID}-skin-style`)?.remove(); DOC.getElementById(`${ID}-mobile-style`)?.remove(); DOC.getElementById(`${ID}-mobile-ux-style`)?.remove(); DOC.getElementById(`${ID}-current-favorite-style`)?.remove(); DOC.getElementById(`${ID}-desktop-lyrics`)?.remove(); DOC.getElementById(`${ID}-desktop-style`)?.remove(); DOC.getElementById(`${ID}-feature-style`)?.remove(); DOC.getElementById(`${ID}-immersive-style`)?.remove(); DOC.getElementById(`${ID}-adaptive-style`)?.remove(); DOC.getElementById(`${ID}-album-glass-style`)?.remove(); DOC.getElementById(`${ID}-album-glass-fix`)?.remove(); DOC.getElementById(`${ID}-responsive-content-style`)?.remove(); DOC.getElementById(`${ID}-skin-restore-style`)?.remove(); DOC.getElementById(`${ID}-compact-controls-style`)?.remove(); DOC.getElementById(`${ID}-size-preset-style`)?.remove(); DOC.getElementById(`${ID}-custom-scale-style`)?.remove(); DOC.getElementById(`${ID}-custom-scale-priority`)?.remove(); DOC.getElementById(`${ID}-small-priority-style`)?.remove(); DOC.getElementById(`${ID}-mini-style`)?.remove(); DOC.getElementById(`${ID}-mini-selene-style`)?.remove(); DOC.getElementById(`${ID}-skin-float`)?.remove(); DOC.getElementById(`${ID}-lyrics-float`)?.remove(); DOC.getElementById(`${ID}-source-float`)?.remove(); DOC.getElementById(`${ID}-gesture-batch-style`)?.remove(); DOC.getElementById(`${ID}-heading-actions-style`)?.remove(); DOC.getElementById(`${ID}-interaction-polish-style`)?.remove();
    if(!audio.isConnected)DOC.body.appendChild(audio);
    DOC.body.insertAdjacentHTML('beforeend', `<section id="${ID}" class="${settings.enabled ? '' : 'hidden'}"><div class="selene-player-head" role="toolbar" aria-label="播放器操作" title="拖动移动"><button type="button" class="selene-player-close">×</button><b>♫ 「Selene」播放器</b><button type="button" class="skin" title="选择外观">✦</button><button type="button" class="gear">⚙</button></div><div class="skin-picker hidden"><button data-skin="albumglass">专辑玻璃</button><button data-skin="film">胶片</button><button data-skin="red">中国红</button><button data-skin="white">简约白</button><button data-skin="black">简约黑</button><button data-skin="blue">深海蓝</button><button data-skin="cream">INS 奶油</button><button data-skin="green">森系绿</button></div><div class="body"><div class="now"><img><div><b class="title">尚未选择歌曲</b><span class="artist">搜索歌曲，或读取本层推荐</span><small class="reason"></small><small class="status"></small></div><button type="button" class="current-favorite" aria-label="收藏当前歌曲" aria-pressed="false" title="收藏当前歌曲" disabled>♡</button></div><form class="selene-search-form"><input class="search-query" aria-label="搜索关键词"><button>搜索</button></form><div class="actions"><button data-a="rec">本层推荐</button><button data-a="world-rec">读取推荐</button><button data-a="offline">离线歌曲</button></div><div class="list" hidden></div><div class="selene-video-inline" role="group" aria-label="B 站视频" hidden><span>B 站 · 仅听声音</span><button type="button" data-video-stop title="停止播放" aria-label="停止 B 站播放">×</button></div><div class="lyrics" aria-live="polite">暂无歌词</div><div class="controls"><button data-c="prev" title="上一首" aria-label="上一首">‹‹</button><button data-c="play" title="播放或暂停" aria-label="播放或暂停">▶</button><button data-c="mode" class="play-mode-icon" data-mode="loop" title="播放模式 · 顺序循环" aria-label="播放模式 · 顺序循环"></button><button data-c="next" title="下一首" aria-label="下一首">››</button><input class="progress" type="range" min="0" max="1000" value="0"></div><div class="time">00:00 / 00:00</div><div class="volume">音量 <input type="range" min="0" max="100" value="${settings.volume * 100}"></div></div></section>`);
    DOC.head.insertAdjacentHTML('beforeend', `<style id="${ID}-style">#${ID}{position:fixed;z-index:10000;width:min(365px,calc(100vw - 24px));right:18px;bottom:90px;background:#20232bf0;color:#eee;border:1px solid #ffffff28;border-radius:14px;box-shadow:0 8px 25px #0008;font:14px system-ui;overflow:hidden}#${ID}.hidden,#${ID}[hidden]{display:none!important;visibility:hidden!important;pointer-events:none!important}#${ID} *{box-sizing:border-box}#${ID} button{color:inherit;background:#ffffff14;border:1px solid #ffffff24;border-radius:7px;padding:5px 8px;cursor:pointer}.selene-player-head{height:39px;display:flex;align-items:center;gap:8px;padding:0 9px;background:#ffffff0b;cursor:move}.selene-player-head .selene-player-close{border:0;background:transparent;font-size:18px}.selene-player-head .gear{margin-left:auto;border:0;background:transparent}.body{padding:10px}.now{display:flex;gap:9px;min-height:58px}.now img{width:58px;height:58px;border-radius:8px;object-fit:cover;background:#ffffff12}.now div{min-width:0;display:flex;flex:1;flex-direction:column;gap:3px;justify-content:center}.title,.artist,.reason,.status{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.artist{color:#c4c4ce}.reason{color:#d8bc78}.status{color:#9eb8ff;font-size:11px;min-height:14px}form{display:flex;gap:6px;margin:9px 0}form input{min-width:0;flex:1;color:inherit;background:#0003;border:1px solid #ffffff30;border-radius:7px;padding:7px}.actions{display:flex;gap:5px}.list{max-height:210px;overflow:auto;margin-top:8px;border-top:1px solid #ffffff18}.row{display:flex;gap:7px;align-items:center;padding:7px 1px;border-bottom:1px solid #ffffff12;cursor:pointer}.row img{width:32px;height:32px;border-radius:5px;object-fit:cover}.row div{min-width:0;flex:1}.row b,.row span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.row span{font-size:12px;color:#bfc0c9}.lyrics{height:38px;margin-top:8px;padding:9px 6px;text-align:center;color:#d8d9e5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#0002;border-radius:7px}.controls{display:flex;gap:5px;align-items:center;margin-top:9px}.controls input,.volume input{min-width:0;flex:1;accent-color:#9db4f7}.time{text-align:center;font-variant-numeric:tabular-nums;color:#bfc0c9;font-size:12px;margin-top:4px}.volume{display:flex;gap:7px;align-items:center;margin-top:6px;color:#ccc}@media(prefers-color-scheme:light){#${ID}{background:#f6f7fbf2;color:#20232b;border-color:#0000001c;box-shadow:0 8px 25px #0003}.selene-player-head{background:#00000008}.artist,.volume,.time{color:#555866}.lyrics{background:#00000008;color:#343746}}@media(max-width:480px){#${ID}{right:12px!important;bottom:12px!important;width:calc(100vw - 24px)}}</style>`);
    DOC.head.insertAdjacentHTML('beforeend', `<style id="${ID}-theme-style">#${ID}.theme-light{background:#f6f7fbf2;color:#20232b;border-color:#0000001c;box-shadow:0 8px 25px #0003}#${ID}.theme-light .selene-player-head,#${ID}.theme-light .lyrics{background:#00000008}#${ID}.theme-light .artist,#${ID}.theme-light .volume,#${ID}.theme-light .time{color:#555866}#${ID}.theme-dark{background:#20232bf0;color:#eee;border-color:#ffffff28;box-shadow:0 8px 25px #0008}#${ID}.theme-dark .selene-player-head{background:#ffffff0b}#${ID}.theme-dark .lyrics{background:#0002}#${ID}.theme-dark .artist,#${ID}.theme-dark .volume,#${ID}.theme-dark .time{color:#c4c4ce}</style>`);
    DOC.head.insertAdjacentHTML('beforeend', `<style id="${ID}-polish-style">#${ID}{border-radius:18px;border-color:#d7bc6f55;box-shadow:0 18px 48px #0009}#${ID}::before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.16;background:repeating-linear-gradient(0deg,#fff1 0 1px,transparent 1px 4px);z-index:1}#${ID} .selene-player-head,#${ID} .body{position:relative;z-index:2}#${ID} .selene-player-head{height:45px;background:linear-gradient(100deg,#3f2b26,#181a24 55%,#342d22);letter-spacing:.4px;border-bottom:1px solid #d7bc6f44}#${ID} .selene-player-head b{font-family:Georgia,serif;font-size:16px;letter-spacing:1px}#${ID} button{transition:transform .15s,background .15s,border-color .15s}#${ID} button:hover{transform:translateY(-1px);background:#d7bc6f24;border-color:#e8cd7c99}#${ID} .now img{border:1px solid #d7bc6f77;box-shadow:inset 0 0 0 3px #0004,0 4px 12px #0008}#${ID} .lyrics{border:1px solid #d7bc6f33;font-family:Georgia,serif;font-style:italic;white-space:pre-line;height:auto;min-height:38px;line-height:1.45}#${ID} .settings-panel{background:linear-gradient(145deg,#29202a,#161923)!important;border-top:1px solid #d7bc6f55}#${ID} .settings-panel h3{font-family:Georgia,serif;letter-spacing:1px;color:#f0d98c}#${ID} .settings-panel select,#${ID} .settings-panel input[type=range]{accent-color:#d7bc6f}#${ID} .settings-panel .set-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:10px 0}#${ID} .settings-panel .set-card{padding:9px;border:1px solid #ffffff18;border-radius:10px;background:#0003}</style>`);
    DOC.head.insertAdjacentHTML('beforeend', `<style id="${ID}-skin-style">#${ID} .selene-player-head .skin{margin-left:auto}#${ID} .selene-player-head .gear{margin-left:0}#${ID} .skin-picker{position:absolute;z-index:5;top:48px;right:8px;width:170px;padding:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;border:1px solid #ffffff30;border-radius:12px;background:#171923f5;box-shadow:0 12px 30px #0009}#${ID} .skin-picker.hidden{display:none}#${ID} .skin-picker button{font-size:12px;padding:7px 4px}#${ID}.skin-red{background:#fff8f1;color:#32191c;border-color:#b80f2a}#${ID}.skin-red .selene-player-head{background:linear-gradient(105deg,#c8102e,#8a001c 72%,#680014);color:#fff;box-shadow:inset 0 -2px #d6b36a}#${ID}.skin-red .lyrics{border-color:#b80f2a55;background:#fff0e6}#${ID}.skin-black{background:#121212;color:#eee;border-color:#555}#${ID}.skin-black .selene-player-head{background:#000;color:#fff}#${ID}.skin-white{background:#fff;color:#242424;border-color:#d9d9d9;box-shadow:0 12px 35px #0003}#${ID}.skin-white .selene-player-head{background:#fafafa;color:#242424;border-color:#ddd}#${ID}.skin-white .artist,#${ID}.skin-white .volume,#${ID}.skin-white .time{color:#626262}#${ID}.skin-white .lyrics{background:#f7f7f7;color:#383838}#${ID}.skin-blue{background:#eef7ff;color:#16334a;border-color:#4d9eea}#${ID}.skin-blue .selene-player-head{background:linear-gradient(100deg,#0c3b66,#1664a5);color:#fff}#${ID}.skin-green{background:#eff8f0;color:#213b2b;border-color:#59a875}#${ID}.skin-green .selene-player-head{background:linear-gradient(100deg,#285d3c,#438957);color:#fff}#${ID}.skin-cream{background:#fff8ed;color:#514337;border-color:#e6c990}#${ID}.skin-cream .selene-player-head{background:linear-gradient(100deg,#f9e8ce,#e8bf95);color:#5a4031}#${ID}.skin-cream .lyrics{background:#fff0dc;color:#6b4b35}</style>`);
    DOC.head.insertAdjacentHTML('beforeend', `<style id="${ID}-mobile-style">@media(max-width:480px),(max-width:1024px) and (hover:none) and (pointer:coarse){#${ID}{left:14px!important;top:18vh!important;right:auto!important;bottom:auto!important;width:min(365px,calc(100vw - 28px))!important;max-width:calc(100vw - 28px)!important;min-width:0!important;height:auto!important;max-height:min(620px,calc(var(--selene-stable-vh,100vh) * .72))!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain;transform:none}#${ID} .selene-player-head{position:sticky;top:0;z-index:4;touch-action:none;flex-shrink:0}#${ID} .body{min-width:0;min-height:0;max-width:100%;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}#${ID} .now,#${ID} .now>div,#${ID} form,#${ID} .actions,#${ID} .controls,#${ID} .volume,#${ID} .list,#${ID} .row,#${ID} .row>div{min-width:0;max-width:100%}#${ID} .actions{flex-wrap:wrap}#${ID} .list{max-height:20vh;overflow-x:hidden}#${ID} .skin-picker{right:6px;top:48px}}</style>`);
    const baseStyle=DOC.getElementById(`${ID}-style`);if(baseStyle)baseStyle.textContent=baseStyle.textContent.replace(/(^|[},])(\s*)(\.selene-player-head|\.body|\.now|\.title|\.artist|\.reason|\.status|form|\.actions|\.list|\.row|\.lyrics|\.controls|\.time|\.volume)(?=[\s.{,:])/g,`$1$2#${ID} $3`);DOC.head.insertAdjacentHTML('beforeend', `<style id="${ID}-isolation">#${ID}{isolation:isolate;contain:layout style paint}#${ID},#${ID} *{box-sizing:border-box!important}#${ID} button,#${ID} input{font:inherit!important;line-height:normal!important;text-transform:none!important;letter-spacing:normal!important}#${ID} button{min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;margin:0!important}#${ID} .body,#${ID} .selene-player-head{max-width:100%!important}#${ID} .actions{align-items:center!important}</style>`);
    DOC.body.insertAdjacentHTML('beforeend', `<div id="${ID}-desktop-lyrics" class="hidden" aria-live="polite"><span class="lyric-text"></span></div>`); DOC.head.insertAdjacentHTML('beforeend', `<style id="${ID}-desktop-style">#${ID}-desktop-lyrics{position:fixed;z-index:10002;left:50%;bottom:11vh;transform:translateX(-50%);max-width:88vw;padding:4px 18px 4px 10px;text-align:center;font:600 22px/1.35 system-ui;text-shadow:none;-webkit-text-stroke:0}#${ID}-desktop-lyrics.hidden{display:none}#${ID}-desktop-lyrics .lyric-text{display:inline-block;max-width:100%;white-space:inherit;text-shadow:none!important;-webkit-text-stroke:0!important;filter:none!important}#${ID}-desktop-lyrics.gradient .lyric-text{color:transparent!important;background-clip:text!important;-webkit-background-clip:text!important;background-repeat:no-repeat!important;background-size:100% 100%!important;text-shadow:none!important;-webkit-text-stroke:0!important;filter:none!important}@media(max-width:480px),(max-width:1024px) and (hover:none) and (pointer:coarse){#${ID}-desktop-lyrics{left:50%;top:50dvh;right:auto;bottom:auto;width:min(82vw,320px);max-width:calc(100vw - 24px);padding:5px 18px 5px 7px;font-size:14px;line-height:1.35;white-space:pre-line;overflow-wrap:anywhere;touch-action:none;box-sizing:border-box;transform:translate(-50%,-50%)}}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-search-video-style">
      #${ID} .bilibili-result-title{padding:0!important;border:0!important;background:none!important;color:inherit;font:inherit!important;text-align:left;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #${ID} .selene-video-inline{display:inline-flex;flex:0 0 auto;align-self:flex-start;align-items:center;gap:5px;width:max-content;max-width:100%;padding:1px 2px 1px 9px;border:1px solid var(--smp-control-border,#ffffff26);border-radius:999px;background:var(--smp-control-bg,#ffffff14);color:var(--smp-text,inherit);font:500 11px/1.4 system-ui,sans-serif}
      #${ID} .selene-video-inline>span{color:inherit!important;-webkit-text-fill-color:currentColor!important}
      #${ID} .selene-video-inline>button{display:grid;place-items:center;width:24px!important;height:24px!important;flex:0 0 24px;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;box-shadow:none!important;color:inherit!important;font-size:16px!important}
      #${ID} .selene-video-inline>button:hover{background:color-mix(in srgb,currentColor 12%,transparent)!important;transform:none}
      #${ID} .selene-video-inline[hidden],#${ID}.mini .selene-video-inline{display:none!important}
      :is(#${ID}-video,#${ID}-bilibili-search){position:fixed;z-index:2147482900;box-sizing:border-box;background:var(--picker-bg,#1b1d27f5);color:var(--picker-text,#f5f4f7);border:1px solid var(--picker-line,#ffffff26);border-radius:14px;overflow:hidden;box-shadow:0 12px 32px #0005;font:12px/1.3 system-ui,sans-serif}
      :is(#${ID}-video,#${ID}-bilibili-search) .video-toolbar{box-sizing:border-box;display:flex;align-items:center;gap:3px;height:36px;padding:0 5px 0 11px;cursor:grab;touch-action:none;user-select:none}
      :is(#${ID}-video,#${ID}-bilibili-search) .video-toolbar.is-dragging{cursor:grabbing}
      :is(#${ID}-video,#${ID}-bilibili-search) .video-toolbar b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
      :is(#${ID}-video,#${ID}-bilibili-search) .video-toolbar button{appearance:none;display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;min-width:0;min-height:0;padding:0;margin:0;border:0;border-radius:6px;box-shadow:none;background:transparent;color:inherit;cursor:pointer;font:17px/1 system-ui,sans-serif}
      :is(#${ID}-video,#${ID}-bilibili-search) .video-toolbar button:not(:disabled):hover{background:var(--picker-control,#fff1)}
      :is(#${ID}-video,#${ID}-bilibili-search) .video-toolbar button:disabled{opacity:.34;cursor:default}
      :is(#${ID}-video,#${ID}-bilibili-search) .video-toolbar svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
      #${ID}-bilibili-search .video-toolbar{border-bottom:1px solid var(--picker-line);background:var(--picker-control)}
      #${ID}-bilibili-search .video-toolbar a{padding:5px 7px;border-radius:6px;color:inherit;text-decoration:none;white-space:nowrap}
      #${ID}-bilibili-search .video-toolbar a:hover{background:var(--picker-control);text-decoration:underline}
      #${ID}-bilibili-search .bilibili-web-viewport{overflow-x:auto;overflow-y:hidden;background:white}
      #${ID}-bilibili-search .bilibili-web-canvas{position:relative;height:100%;overflow:hidden}
      #${ID}-bilibili-search iframe{display:block;position:absolute;top:0;left:0;width:calc(100% / var(--bili-web-scale,1));height:calc(100% / var(--bili-web-scale,1));border:0;background:white;transform:scale(var(--bili-web-scale));transform-origin:top left}
      :is(#${ID}-video,#${ID}-bilibili-search).is-pointer-active iframe{pointer-events:none}
      #${ID}-bilibili-search .video-resize-corner{display:none;position:absolute;z-index:1;width:18px;height:18px;touch-action:none;user-select:none}
      #${ID}-bilibili-search.has-resize-corners .video-resize-corner{display:block}
      #${ID}-bilibili-search .video-resize-corner.nw{top:0;left:0;cursor:nwse-resize}
      #${ID}-bilibili-search .video-resize-corner.ne{top:0;right:0;cursor:nesw-resize}
      #${ID}-bilibili-search .video-resize-corner.sw{bottom:0;left:0;cursor:nesw-resize}
      #${ID}-bilibili-search .video-resize-corner.se{bottom:0;right:0;cursor:nwse-resize}
      #${ID}-bilibili-search [data-search-close]{position:relative;z-index:2}
      #${ID}-video .video-frame{background:#000}
      #${ID}-video iframe{display:block;width:100%;height:auto;aspect-ratio:16/9;border:0}
      #${ID}-video.is-picture-hidden{opacity:0;clip-path:inset(50%);pointer-events:none}
    </style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-feature-style">#${ID} .row .row-tools{display:flex;flex:0 0 auto;gap:4px;align-items:center}#${ID} .row .row-tools button{padding:4px 6px!important}#${ID} .playlist-summary{display:flex;align-items:center;gap:8px;width:100%}#${ID} .playlist-summary>div{min-width:0;flex:1}#${ID} .feature-heading{position:static!important;padding:8px 2px!important;background:transparent!important;backdrop-filter:none!important}#${ID} .feature-heading{flex-wrap:wrap!important;gap:5px!important}#${ID} .feature-heading>b{order:-1;flex:1 0 100%;max-width:100%;white-space:normal;overflow-wrap:anywhere}#${ID} .offline-badge{color:#9fdda9!important}#${ID} .playlist-batch-bar{position:sticky;top:0;z-index:3;display:flex;flex-wrap:wrap;align-items:center;gap:5px;padding:7px;border-bottom:1px solid #ffffff24;background:#171923ee;backdrop-filter:blur(14px)}#${ID} .playlist-batch-bar b{margin-right:auto;font-size:12px}#${ID} .playlist-batch-bar button{padding:3px 6px!important;font-size:11px}#${ID} .playlist-batch-bar button:disabled{opacity:.45;cursor:not-allowed}#${ID} .playlist-batch-row.selected{background:#d7bc6f20}#${ID} .playlist-select{position:relative;display:grid;place-items:center;flex:0 0 24px;width:24px;height:32px;cursor:pointer}#${ID} .playlist-select input{position:absolute;opacity:0;pointer-events:none}#${ID} .playlist-select i{display:grid;place-items:center;width:19px;height:19px;border:1px solid #ffffff55;border-radius:6px;background:#0004}#${ID} .playlist-select input:checked+i{border-color:#e8cd7c;background:#d7bc6f;color:#171923}#${ID} .playlist-select input:checked+i:after{content:'✓';font:800 13px/1 system-ui}@media(max-width:390px){#${ID} .row .row-tools{gap:2px}#${ID} .row .row-tools button{padding:3px 4px!important}#${ID} .playlist-batch-bar{gap:3px;padding:6px 2px}#${ID} .playlist-batch-bar button{padding:3px 4px!important}}</style>`);
    DOC.getElementById(`${ID}-feature-style`).textContent+=`#${ID} .playlist-batch-row{position:relative;background:color-mix(in srgb,#11141d 88%,transparent)!important;color:#f3f1ed!important;border-bottom-color:#ffffff1c!important}#${ID} .playlist-batch-row b{color:#f5f3ef!important;-webkit-text-fill-color:#f5f3ef!important}#${ID} .playlist-batch-row span{color:#aaaeba!important;-webkit-text-fill-color:#aaaeba!important}#${ID} .playlist-batch-row.selene-batch-selected,#${ID} .playlist-batch-row:has([data-song-select]:checked){background:linear-gradient(90deg,#3b3324f2,#222531f4 64%,#171923f2)!important;box-shadow:inset 4px 0 #d8b85f,inset 0 1px #ffffff18!important}#${ID} .playlist-batch-row.selene-batch-selected b,#${ID} .playlist-batch-row:has([data-song-select]:checked) b{color:#fff8df!important;-webkit-text-fill-color:#fff8df!important}#${ID} .playlist-batch-row.selene-batch-selected span,#${ID} .playlist-batch-row:has([data-song-select]:checked) span{color:#d2c9b3!important;-webkit-text-fill-color:#d2c9b3!important}#${ID} .actions-toggle{position:relative;display:flex!important;align-items:center!important;gap:8px;width:100%!important;margin:8px 0 5px!important;padding:7px 10px!important;border:1px solid #ffffff24!important;border-radius:10px!important;background:linear-gradient(90deg,#ffffff10,#00000018)!important;color:inherit!important;text-align:left;box-shadow:inset 0 1px #ffffff10!important}#${ID} .actions-toggle span{font-weight:700;letter-spacing:.5px}#${ID} .actions-toggle small{margin-left:auto;color:var(--smp-muted,#bfc0c9)!important;-webkit-text-fill-color:currentColor!important}#${ID} .actions-toggle i{display:grid;place-items:center;width:21px;height:21px;border-radius:50%;background:#ffffff12;font-style:normal;transition:transform .2s}#${ID}.actions-collapsed .actions{display:none!important}#${ID}.actions-collapsed .actions-toggle i{transform:rotate(180deg)}#${ID}.immersive .actions-toggle{display:none!important}`;
    const el = DOC.getElementById(ID);
    el.querySelector('.selene-player-head b').textContent='「Selene」Music';
    const quickActions=el.querySelector('.actions');quickActions.insertAdjacentHTML('beforebegin','<button type="button" class="actions-toggle" aria-expanded="true"><span>快捷功能</span><small>点击收起</small><i>⌃</i></button>');const quickToggle=el.querySelector('.actions-toggle'),syncQuickActions=()=>{const collapsed=!!settings.actionsCollapsed;el.classList.toggle('actions-collapsed',collapsed);quickToggle.setAttribute('aria-expanded',String(!collapsed));quickToggle.querySelector('small').textContent=collapsed?'点击展开':'点击收起';quickToggle.title=collapsed?'展开快捷功能按钮':'收起快捷功能按钮';};quickToggle.onclick=()=>{settings.actionsCollapsed=!settings.actionsCollapsed;syncQuickActions();save();};syncQuickActions();
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-album-glass-style">#${ID}{--album-cover:none;background:#12141dd9!important;backdrop-filter:blur(22px) saturate(1.2);transition:width .12s,height .12s,border-color .35s}#${ID}:after{content:'';position:absolute;z-index:0;inset:-28px;background-image:var(--album-cover);background-position:center;background-size:cover;filter:blur(34px) saturate(1.5);transform:scale(1.18);opacity:.42;pointer-events:none;transition:background-image .4s,opacity .4s}#${ID}>.selene-player-head,#${ID}>.body,#${ID}>.skin-picker,#${ID}>.resize-handle{position:relative;z-index:2}#${ID}>.selene-player-head{background:linear-gradient(105deg,#141722b8,#27212bb0)!important;backdrop-filter:blur(20px) saturate(1.35);border-bottom-color:#ffffff2e!important}#${ID}>.body{background:linear-gradient(145deg,#ffffff16,#090b1294);backdrop-filter:blur(24px) saturate(1.25)}#${ID}:not(.immersive) .now{padding:7px;border:1px solid #ffffff24;border-radius:13px;background:#ffffff10;box-shadow:inset 0 1px #ffffff25,0 8px 22px #0004}#${ID}:not(.immersive) .now img{width:clamp(34px,18cqw,58px)!important;height:clamp(34px,18cqw,58px)!important;flex:0 0 auto;transition:width .18s,height .18s}#${ID}:not(.immersive) button:not(.current-favorite),#${ID}:not(.immersive) input{backdrop-filter:blur(10px)}#${ID} .cover-glass{width:min(100%,42cqw,46cqh)!important;max-width:none!important;justify-self:center;align-self:center;padding:clamp(5px,2.2cqw,20px);border-radius:clamp(14px,4cqw,24px)}#${ID} .immersive-cover{border-radius:clamp(9px,3cqw,16px)}@container(max-width:420px) or (max-height:430px){#${ID}.immersive .immersive-view{padding:clamp(8px,2.5cqw,16px);gap:clamp(8px,2.5cqw,18px)}#${ID}.immersive .cover-glass{width:min(34cqw,32cqh,150px)!important}#${ID}.immersive .immersive-info h2{font-size:clamp(16px,5cqw,28px);margin:7px 0 4px}#${ID}.immersive .immersive-info small{font-size:9px;letter-spacing:2px}#${ID}.immersive .immersive-lyric{font-size:clamp(12px,3cqw,17px);margin-top:7px}}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-album-glass-fix">#${ID}>.resize-handle{position:absolute!important;z-index:20!important}#${ID}:not(.skin-albumglass):after{display:none!important}#${ID}:not(.skin-albumglass){background:#20232bf0!important;backdrop-filter:none}#${ID}:not(.skin-albumglass)>.selene-player-head{backdrop-filter:none}#${ID}:not(.skin-albumglass)>.body{background:transparent;backdrop-filter:none}#${ID}.skin-red{background:#fff8f1!important}#${ID}.skin-white{background:#fff!important}#${ID}.skin-black{background:#121212!important}#${ID}.skin-blue{background:#eef7ff!important}#${ID}.skin-green{background:#eff8f0!important}#${ID}.skin-cream{background:#fff8ed!important}#${ID}.skin-albumglass{color:#fff!important;border-color:#ffffff4d!important}#${ID}.skin-albumglass:after{display:block}#${ID}.skin-albumglass>.selene-player-head{color:#fff!important}#${ID}.skin-albumglass>.body{color:#fff!important}#${ID}.skin-albumglass .artist,#${ID}.skin-albumglass .time,#${ID}.skin-albumglass .volume{color:#ffffffc7!important}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-responsive-content-style">#${ID}:not(.immersive)>.body{height:calc(100% - 45px);min-height:0;display:flex;flex-direction:column;overflow:hidden!important}#${ID}:not(.immersive) .now,#${ID}:not(.immersive) form,#${ID}:not(.immersive) .actions,#${ID}:not(.immersive) .lyrics,#${ID}:not(.immersive) .controls,#${ID}:not(.immersive) .time,#${ID}:not(.immersive) .volume{flex:0 0 auto}#${ID}:not(.immersive) .list{flex:1 1 auto;min-height:0;max-height:none!important;overflow:auto}#${ID} .skin-picker{max-height:min(70cqh,360px);overflow:auto}#${ID}.immersive .immersive-view{overflow:hidden!important;grid-template-columns:minmax(0,42%) minmax(0,1fr)!important}#${ID}.immersive .immersive-info,#${ID}.immersive .immersive-info *{color:#fff!important}#${ID}.immersive .immersive-info{text-shadow:0 2px 12px #000b}@container(max-width:520px){#${ID}.immersive .immersive-view{grid-template-columns:minmax(0,36%) minmax(0,1fr)!important;text-align:left!important}#${ID}.immersive .cover-glass{width:min(100%,32cqh)!important}#${ID}.immersive .immersive-info h2{font-size:clamp(15px,5cqw,25px)!important;margin:5px 0 3px!important;-webkit-line-clamp:2}#${ID}.immersive .immersive-info p{font-size:clamp(11px,3cqw,15px)!important}#${ID}.immersive .immersive-info small{font-size:8px;letter-spacing:1px}#${ID}.immersive .immersive-lyric{font-size:clamp(11px,3cqw,15px)!important;margin-top:6px!important;max-height:3em}}@container(max-height:390px){#${ID}.immersive .immersive-view{padding:7px 12px!important;gap:10px!important}#${ID}.immersive .cover-glass{width:min(25cqh,110px)!important;padding:4px!important;border-radius:12px}#${ID}.immersive .immersive-info small,#${ID}.immersive .immersive-info p{display:none}#${ID}.immersive .immersive-lyric{margin-top:3px!important;line-height:1.2!important;max-height:2.4em}#${ID}.immersive .controls{margin-top:4px!important}#${ID}.immersive .volume{margin-top:2px!important}#${ID}.immersive .time{margin-top:1px!important}}@container(max-width:380px){#${ID}{font-size:clamp(10px,3.3cqw,13px)!important}#${ID} .selene-player-head{gap:4px;padding:0 5px}#${ID} .selene-player-head b{font-size:clamp(11px,4cqw,15px)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#${ID} button{padding:3px 5px!important}#${ID} .body{padding:6px}#${ID} form{margin:5px 0}#${ID} .actions{gap:3px}#${ID} .now{min-height:42px}#${ID} .lyrics{margin-top:4px;padding:5px;min-height:27px}#${ID} .controls{gap:3px;margin-top:4px}#${ID} .volume{margin-top:3px}}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-skin-restore-style">#${ID}.skin-film>.selene-player-head{background:linear-gradient(100deg,#3f2b26,#181a24 55%,#342d22)!important}#${ID}.skin-red>.selene-player-head{background:linear-gradient(105deg,#c8102e,#8a001c 72%,#680014)!important;color:#fff!important;box-shadow:inset 0 -2px #d6b36a!important}#${ID}.skin-white>.selene-player-head{background:#fafafa!important;color:#242424!important}#${ID}.skin-black>.selene-player-head{background:#000!important;color:#fff!important}#${ID}.skin-blue>.selene-player-head{background:linear-gradient(100deg,#0c3b66,#1664a5)!important;color:#fff!important}#${ID}.skin-green>.selene-player-head{background:linear-gradient(100deg,#285d3c,#438957)!important;color:#fff!important}#${ID}.skin-cream>.selene-player-head{background:linear-gradient(100deg,#f9e8ce,#e8bf95)!important;color:#5a4031!important}#${ID}:has(.skin-picker:not(.hidden)){overflow:visible!important;contain:none!important}#${ID} .skin-picker{position:fixed!important;z-index:2147483647!important;grid-template-columns:1fr 1fr!important;gap:7px!important;padding:9px!important;max-height:min(330px,calc(100dvh - 16px))!important;overflow:auto!important;border:1px solid #ffffff48!important;border-radius:14px!important;background:#171923f2!important;box-shadow:0 18px 45px #000b!important;backdrop-filter:blur(22px) saturate(1.25)}#${ID} .skin-picker button{width:100%!important;white-space:nowrap}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-compact-controls-style">#${ID}>.selene-player-head{z-index:30!important}#${ID} .selene-player-head .skin,#${ID} .selene-player-head .gear,#${ID} .selene-player-head .desktop-lyric-toggle{position:relative!important;z-index:32!important;pointer-events:auto!important}#${ID} .desktop-lyric-toggle.active{color:#fff!important;background:#5579a9!important;border-color:#8fb7eb!important}#${ID}.skin-albumglass .lyrics{color:#fff!important;border-color:#ffffff40!important;background:#ffffff0d!important;text-shadow:0 1px 8px #000}#${ID}.skin-albumglass .status{color:#fff!important}#${ID}:not(.immersive)>.body{transform-origin:top left}@container(max-height:650px){#${ID}:not(.immersive)>.body{zoom:.88;width:113.64%;height:calc((100% - 45px)/.88)}}@container(max-height:540px){#${ID}:not(.immersive)>.body{zoom:.76;width:131.58%;height:calc((100% - 45px)/.76)}}@container(max-height:450px){#${ID}:not(.immersive)>.body{zoom:.64;width:156.25%;height:calc((100% - 45px)/.64)}#${ID}:not(.immersive) .now{min-height:45px}#${ID}:not(.immersive) .list{max-height:70px!important}#${ID}:not(.immersive) .lyrics{min-height:28px;padding:5px;margin-top:4px}#${ID}:not(.immersive) form{margin:5px 0}#${ID}:not(.immersive) .controls{margin-top:5px}#${ID}:not(.immersive) .volume{margin-top:3px}}@container(max-height:350px){#${ID}:not(.immersive)>.body{zoom:.53;width:188.68%;height:calc((100% - 45px)/.53)}#${ID}:not(.immersive) .reason,#${ID}:not(.immersive) .status{display:none}#${ID}:not(.immersive) .now{min-height:38px;padding:4px}}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-size-preset-style">#${ID}:not(.immersive)>.body{zoom:1!important;width:100%!important;height:calc(100% - 45px)!important;overflow:auto!important}#${ID} .immersive-cover{cursor:zoom-out!important}#${ID} .size-preset{font-weight:700!important;min-width:32px!important}#${ID}.ui-size-s{font-size:12px!important}#${ID}.ui-size-s button{font-size:12px!important;padding:4px 6px!important;white-space:nowrap}#${ID}.ui-size-s .selene-player-head b{font-size:13px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#${ID}.ui-size-s .selene-player-head{gap:4px!important;padding:0 5px!important}#${ID}.ui-size-s .body{padding:7px!important}#${ID}.ui-size-s .actions{gap:3px!important}#${ID}.ui-size-s .now img{width:42px!important;height:42px!important}#${ID}.ui-size-m{font-size:14px!important}#${ID}.ui-size-m button{font-size:14px!important;white-space:nowrap}#${ID}.ui-size-l{font-size:16px!important}#${ID}.ui-size-l button{font-size:16px!important;padding:6px 10px!important;white-space:nowrap}#${ID}.ui-size-l .selene-player-head b{font-size:18px!important}#${ID}.ui-size-l .now img{width:72px!important;height:72px!important}#${ID}.ui-size-l .row img{width:42px!important;height:42px!important}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-custom-scale-style">#${ID}{--button-scale:1;--text-scale:1;--cover-scale:1;--list-scale:1}#${ID} .body{font-size:calc(14px * var(--text-scale))!important}#${ID} button{font-size:calc(14px * var(--button-scale))!important;padding:calc(5px * var(--button-scale)) calc(8px * var(--button-scale))!important}#${ID}:not(.immersive) .now img{width:calc(58px * var(--cover-scale))!important;height:calc(58px * var(--cover-scale))!important}#${ID} .row{font-size:calc(14px * var(--list-scale))!important;padding:calc(7px * var(--list-scale)) 1px!important}#${ID} .row img{width:calc(32px * var(--list-scale))!important;height:calc(32px * var(--list-scale))!important}#${ID} .custom-scales{grid-column:1/-1;padding:10px!important}#${ID} .scale-row{display:grid;grid-template-columns:minmax(90px,1fr) auto 48px auto;gap:6px;align-items:center;margin:7px 0}#${ID} .scale-row output{text-align:center;font-variant-numeric:tabular-nums;color:#f0d98c}#${ID} .scale-row button{min-width:31px!important}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-custom-scale-priority">#${ID}.ui-size-s button{font-size:calc(12px * var(--button-scale))!important}#${ID}.ui-size-m button{font-size:calc(14px * var(--button-scale))!important}#${ID}.ui-size-l button{font-size:calc(16px * var(--button-scale))!important}#${ID}.ui-size-s .body{font-size:calc(12px * var(--text-scale))!important}#${ID}.ui-size-m .body{font-size:calc(14px * var(--text-scale))!important}#${ID}.ui-size-l .body{font-size:calc(16px * var(--text-scale))!important}#${ID}.ui-size-s:not(.immersive) .now img,#${ID}.ui-size-m:not(.immersive) .now img,#${ID}.ui-size-l:not(.immersive) .now img{width:calc(58px * var(--cover-scale))!important;height:calc(58px * var(--cover-scale))!important}#${ID}.ui-size-s .row,#${ID}.ui-size-m .row,#${ID}.ui-size-l .row{font-size:calc(14px * var(--list-scale))!important;padding:calc(7px * var(--list-scale)) 1px!important}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-small-priority-style">
      #${ID}:not(.immersive)>.body{height:calc(100% - 45px)!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}
      #${ID}:not(.immersive) .now,#${ID}:not(.immersive) form,#${ID}:not(.immersive) .actions,#${ID}:not(.immersive) .controls,#${ID}:not(.immersive) .time,#${ID}:not(.immersive) .volume{flex:0 0 auto!important}
      #${ID}:not(.immersive) .list{flex:1 1 auto!important;min-height:0!important;max-height:none!important;overflow:auto!important}
      #${ID}:not(.immersive) .lyrics{display:block!important;flex:0 0 auto!important;margin-top:auto!important;padding:clamp(5px,1.2cqh,14px) clamp(7px,1.5cqw,22px)!important;font-size:clamp(13px,calc(11px + .9cqw + .3cqh),28px)!important;line-height:1.35!important}
      #${ID}:not(.immersive) .controls,#${ID}:not(.immersive) .volume{display:flex!important}
      #${ID}:not(.immersive) .time{display:block!important}
      @container(max-height:280px){
        #${ID}:not(.immersive)>.body>form,#${ID}:not(.immersive) .actions-toggle,#${ID}:not(.immersive) .actions,#${ID}:not(.immersive) .list{display:none!important}
        #${ID}:not(.immersive)>.body{padding:6px!important}
        #${ID}:not(.immersive) .now{display:flex!important;align-items:center!important;min-height:52px!important;margin:0!important;padding:4px!important;overflow:hidden!important}
        #${ID}:not(.immersive)>.body .now img{width:44px!important;height:44px!important;flex:0 0 44px!important;border-radius:9px!important}
        #${ID}:not(.immersive) .reason,#${ID}:not(.immersive) .status{display:none!important}
        #${ID}:not(.immersive) .lyrics{display:flex!important;flex:1 1 auto!important;align-items:center!important;justify-content:center!important;min-height:36px!important;max-height:none!important;margin-top:3px!important;padding:4px 5px!important;overflow:hidden!important;overflow-wrap:anywhere!important;font-size:clamp(14px,calc(11px + 1.25cqw),18px)!important;line-height:1.2!important}
        #${ID}:not(.immersive) .controls{margin-top:3px!important}
        #${ID}:not(.immersive) .controls button{font-size:12px!important;padding:3px 5px!important}
        #${ID}:not(.immersive) .time{margin-top:1px!important;line-height:1.15!important}
        #${ID}:not(.immersive) .volume{margin-top:2px!important;line-height:1.15!important}
      }
      @container(max-height:230px){
        #${ID}:not(.immersive)>.body{padding:4px!important}
        #${ID}:not(.immersive) .now{display:flex!important;align-items:center!important;min-height:44px!important;max-height:44px!important;padding:3px!important;overflow:hidden!important}
        #${ID}:not(.immersive)>.body .now img{width:38px!important;height:38px!important;flex:0 0 38px!important;border-radius:8px!important}
        #${ID}:not(.immersive) .now>div{gap:0!important}
        #${ID}:not(.immersive) .title{font-size:13px!important;line-height:1.1!important}
        #${ID}:not(.immersive) .artist{font-size:11px!important;line-height:1.1!important}
        #${ID}:not(.immersive) .lyrics{flex:1 1 auto!important;min-height:30px!important;max-height:none!important;margin-top:2px!important;padding:3px 4px!important;font-size:clamp(13px,calc(11px + 1cqw),16px)!important;line-height:1.15!important}
        #${ID}:not(.immersive) .controls{margin-top:2px!important}
        #${ID}:not(.immersive) .controls button{padding:2px 4px!important}
        #${ID}:not(.immersive) .time,#${ID}:not(.immersive) .volume{font-size:11px!important;margin-top:1px!important}
      }
      @container(max-width:360px) and (max-height:320px){
        #${ID}:not(.immersive) .controls{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:3px!important}
        #${ID}:not(.immersive) .controls button{width:100%!important;padding-left:3px!important;padding-right:3px!important}
        #${ID}:not(.immersive) .controls .progress{grid-column:1/-1!important;width:100%!important;margin:0!important}
        #${ID}:not(.immersive) .volume{gap:4px!important}
      }
    </style>`);
    el.querySelector('.skin-picker').insertAdjacentHTML('beforeend','<button data-skin="orbit">流光唱片</button>');
    el.querySelector('.gear').insertAdjacentHTML('beforebegin','<span class="lyrics-tools" role="group" aria-label="歌词控制"><button type="button" class="desktop-lyric-toggle" title="歌词设置">词</button><button type="button" class="quick-lyrics-lock" title="锁定歌词位置" aria-label="锁定歌词位置"></button></span>');
    el.insertAdjacentHTML('beforeend',`<button type="button" class="mini-cover-shell" title="单击播放或暂停，双击展开" aria-label="播放器悬浮窗：单击播放或暂停，双击展开；键盘 Enter 展开">${seleneMiniArt()}</button>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-mini-style">#${ID} .selene-player-head b{cursor:pointer;user-select:none}#${ID} .mini-cover-shell{display:none!important}#${ID}.mini{width:96px!important;height:96px!important;min-width:72px!important;min-height:72px!important;max-width:140px!important;max-height:140px!important;border-radius:24px!important;overflow:visible!important;background:#181b24cc!important;contain:none!important;padding:7px!important;box-shadow:0 16px 36px #0009,inset 0 1px #ffffff50}#${ID}.mini:after,#${ID}.mini:before,#${ID}.mini>.selene-player-head,#${ID}.mini>.body,#${ID}.mini>.skin-picker,#${ID}.mini>.resize-handle{display:none!important}#${ID}.mini .mini-cover-shell{display:block!important;position:absolute!important;z-index:50!important;inset:7px!important;width:calc(100% - 14px)!important;height:calc(100% - 14px)!important;padding:0!important;border:1px solid #ffffff55!important;border-radius:18px!important;background-image:var(--album-cover)!important;background-size:cover!important;background-position:center!important;box-shadow:0 8px 22px #0009,inset 0 0 0 4px #ffffff12!important;cursor:grab!important;touch-action:none!important}#${ID}.mini .mini-cover-shell:active{cursor:grabbing!important}#${ID}.mini[data-mini-shape=round]{border-radius:50%!important}#${ID}.mini[data-mini-shape=round] .mini-cover-shell{border-radius:50%!important;clip-path:circle(50%)}#${ID}.mini[data-mini-shape=round] .mini-cover-shell{background-image:none!important;overflow:hidden!important}#${ID}.mini[data-mini-shape=round] .mini-cover-shell:before{content:'';position:absolute;inset:0;border-radius:50%;background-image:var(--album-cover);background-position:center;background-size:cover;pointer-events:none;animation:selene-mini-turn 28s linear infinite;animation-play-state:paused}#${ID}.mini.orbit-playing[data-mini-shape=round] .mini-cover-shell:before{animation-play-state:running}@keyframes selene-mini-turn{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){#${ID}.mini[data-mini-shape=round] .mini-cover-shell:before{animation:none!important}}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-mini-close-safety">#${ID}.mini .selene-player-close,#${ID}.mini>.selene-player-head .selene-player-close{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;min-width:0!important;min-height:0!important;padding:0!important;margin:0!important}#${ID}.mini .mini-cover-shell{z-index:2147483646!important}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-gesture-batch-style">#${ID}.mini{width:52px!important;height:52px!important;min-width:48px!important;min-height:48px!important;max-width:60px!important;max-height:60px!important;padding:4px!important;border-radius:15px!important}#${ID}.mini .mini-cover-shell{inset:4px!important;width:calc(100% - 8px)!important;height:calc(100% - 8px)!important;border-radius:11px!important}#${ID}.skin-film,#${ID}.skin-film .body,#${ID}.skin-film .title,#${ID}.skin-film .artist,#${ID}.skin-film .reason,#${ID}.skin-film .status,#${ID}.skin-film .lyrics,#${ID}.skin-film .time,#${ID}.skin-film .volume,#${ID}.skin-film .row,#${ID}.skin-film .row span{color:#fff!important}#${ID}.skin-film .artist,#${ID}.skin-film .row span{color:#ffffffbd!important}#${ID} [data-a="fav-queue"]{display:none!important}#${ID} .batch-bar{display:flex;align-items:center;gap:6px;padding:7px 2px;position:sticky;top:0;z-index:3;background:#171a24e8;backdrop-filter:blur(12px)}#${ID} .batch-bar b{margin-right:auto;color:inherit}#${ID} .batch-bar button{white-space:nowrap}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-heading-actions-style">#${ID} .batch-heading{display:flex!important;align-items:center!important;gap:7px!important;position:static!important;padding:8px 2px!important;background:transparent!important;backdrop-filter:none!important}#${ID} .batch-heading>b{margin-right:auto!important}#${ID} .batch-heading button{flex:0 0 auto;white-space:nowrap}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-mobile-ux-style">@media(max-width:480px),(max-width:1024px) and (hover:none) and (pointer:coarse){#${ID}:not(.mini),#${ID}:not(.mini)>.body{overscroll-behavior:contain!important}#${ID} .progress{touch-action:none!important;-webkit-user-select:none!important;user-select:none!important}}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-current-favorite-style">#${ID} .now .current-favorite{flex:0 0 34px!important;align-self:center!important;width:34px!important;height:40px!important;min-width:34px!important;display:grid!important;place-items:center!important;padding:0!important;border:0!important;border-radius:0!important;font:700 25px/1 system-ui!important;color:var(--smp-muted)!important;-webkit-text-fill-color:currentColor!important;background:none!important;background-color:transparent!important;background-image:none!important;border-color:transparent!important;box-shadow:none!important;filter:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;cursor:pointer;touch-action:manipulation;-webkit-appearance:none!important;appearance:none!important;outline:none!important;-webkit-tap-highlight-color:transparent!important}#${ID} .now .current-favorite:hover:not(:disabled){transform:scale(1.08)}#${ID} .now .current-favorite:hover:not(:disabled),#${ID} .now .current-favorite:focus,#${ID} .now .current-favorite:focus-visible,#${ID} .now .current-favorite:active{background:none!important;background-color:transparent!important;background-image:none!important;border-color:transparent!important;outline:none!important;box-shadow:none!important;filter:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}#${ID} .now .current-favorite::before,#${ID} .now .current-favorite::after{content:none!important;display:none!important}#${ID} .now .current-favorite.active{color:#c8102e!important;-webkit-text-fill-color:#c8102e!important;background:none!important;background-color:transparent!important;background-image:none!important;border-color:transparent!important;text-shadow:none!important}#${ID} .now .current-favorite:disabled{opacity:.38;cursor:default}@media(max-width:480px){#${ID} .now .current-favorite{flex-basis:38px!important;width:38px!important;height:44px!important;min-width:38px!important}}#${ID} .actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;align-items:stretch!important}#${ID} .actions>button{width:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important}#${ID} .controls .play-mode-icon{flex:0 0 32px!important;width:32px!important;min-width:32px!important;padding:4px!important;font-size:.95em!important;line-height:1!important}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-color-isolation">#${ID}{--smp-text:#f5f5f7;--smp-muted:#c4c4ce;--smp-head-text:#fff;--smp-control-bg:#ffffff14;--smp-control-border:#ffffff30;--smp-input-bg:#090b125c;color:var(--smp-text)!important;color-scheme:dark}#${ID}.skin-red,#${ID}.skin-white,#${ID}.skin-blue,#${ID}.skin-green,#${ID}.skin-cream{--smp-text:#252832;--smp-muted:#626674;--smp-control-bg:#0000000a;--smp-control-border:#00000026;--smp-input-bg:#ffffffb8;color-scheme:light}#${ID}.skin-red,#${ID}.skin-blue,#${ID}.skin-green{--smp-head-text:#fff}#${ID}.skin-red{--smp-text:#341a1d;--smp-muted:#7c5056;--smp-control-bg:#c8102e10;--smp-control-border:#a50d2c3d;--smp-input-bg:#fffaf5}#${ID}.skin-red .now{background:linear-gradient(135deg,#fff8f1,#f5e2d8)!important;border-color:#b80f2a4d!important}#${ID}.skin-white{--smp-head-text:#242424}#${ID}.skin-cream{--smp-head-text:#5a4031}#${ID}.skin-film,#${ID}.skin-black,#${ID}.skin-albumglass{--smp-head-text:#fff}#${ID}>.body,#${ID} .title,#${ID} .row b,#${ID} .lyrics,#${ID} .time,#${ID} .volume,#${ID} label,#${ID} output{color:var(--smp-text)!important}#${ID} .artist,#${ID} .row span,#${ID} .time,#${ID} .volume{color:var(--smp-muted)!important}#${ID} .reason{color:#d8bc78!important}#${ID} .status{color:#9eb8ff!important}#${ID}>.selene-player-head,#${ID}>.selene-player-head b,#${ID}>.selene-player-head button{color:var(--smp-head-text)!important;-webkit-text-fill-color:currentColor!important}#${ID} button,#${ID} input,#${ID} select,#${ID} textarea{color:var(--smp-text)!important;-webkit-text-fill-color:currentColor!important;text-shadow:none!important}#${ID} button{background-color:var(--smp-control-bg)!important;border-color:var(--smp-control-border)!important}#${ID} form input,#${ID} select,#${ID} textarea{background-color:var(--smp-input-bg)!important;border-color:var(--smp-control-border)!important}#${ID} input::placeholder,#${ID} textarea::placeholder{color:var(--smp-muted)!important;-webkit-text-fill-color:var(--smp-muted)!important;opacity:.88!important}#${ID}>.selene-player-head .selene-player-close,#${ID}>.selene-player-head .gear{background-color:transparent!important;border-color:transparent!important}#${ID} .skin-picker,#${ID} .settings-panel{color:#f5f5f7!important;color-scheme:dark}#${ID} .skin-picker button,#${ID} .settings-panel button,#${ID} .settings-panel label,#${ID} .settings-panel output{color:#f5f5f7!important;-webkit-text-fill-color:currentColor!important}#${ID} .skin-picker button,#${ID} .settings-panel button{background-color:#ffffff14!important;border-color:#ffffff30!important}#${ID}-skin-float,#${ID}-skin-float button{color:#fff!important;-webkit-text-fill-color:currentColor!important}#${ID}-skin-float button{background-color:#ffffff12!important;border-color:#ffffff30!important}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-interaction-polish-style">
      #${ID}:not(.mini){height:min(640px,calc(var(--selene-stable-vh,100vh) - 24px))!important;overflow:hidden!important}
      #${ID}:not(.immersive)>.body{height:calc(100% - 45px)!important;min-height:0!important;overflow:hidden!important}
      #${ID}:not(.immersive) .actions-toggle{flex:0 0 auto!important;min-height:40px!important}
      #${ID}:not(.immersive) .list{min-height:0!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain;scrollbar-gutter:stable}
      #${ID} .list>.row,#${ID} .list>article{content-visibility:auto;contain-intrinsic-size:auto 54px}
      #${ID} .playlist-batch-bar{background:color-mix(in srgb,var(--smp-input-bg) 80%,#1719239a)!important;color:var(--smp-text)!important;border-color:var(--smp-control-border)!important;box-shadow:0 7px 16px #0002!important;-webkit-backdrop-filter:blur(18px) saturate(1.08)!important;backdrop-filter:blur(18px) saturate(1.08)!important}
      #${ID} .playlist-batch-row{background:transparent!important;color:var(--smp-text)!important;box-shadow:none!important}
      #${ID} .playlist-batch-row b{color:var(--smp-text)!important;-webkit-text-fill-color:currentColor!important}
      #${ID} .playlist-batch-row span{color:var(--smp-muted)!important;-webkit-text-fill-color:currentColor!important}
      #${ID} .playlist-batch-row.selene-batch-selected,#${ID} .playlist-batch-row:has([data-song-select]:checked){background:color-mix(in srgb,#d8b85f 14%,transparent)!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,#d8b85f 34%,transparent)!important}
      #${ID} .playlist-select i{background:color-mix(in srgb,var(--smp-control-bg) 75%,transparent)!important;border-color:var(--smp-control-border)!important}
      #${ID} img[data-result-cover]{border:0!important;outline:0!important;box-shadow:none!important}
      #${ID} img[data-result-cover]:not([src]){visibility:hidden!important}
      #${ID} .pointer-interacting{transition:none!important;contain:layout paint style;will-change:transform,left,top,width,height!important}
      #${ID}.pointer-interacting:after{opacity:.16!important;filter:blur(14px) saturate(1.1)!important}
      #${ID}.pointer-interacting,#${ID}.pointer-interacting>.selene-player-head,#${ID}.pointer-interacting>.body,#${ID}.pointer-interacting button,#${ID}.pointer-interacting input{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}
      @media(max-width:480px),(max-width:1024px) and (hover:none) and (pointer:coarse){
        #${ID}:not(.mini){height:min(620px,calc(var(--selene-stable-vh,100vh) * .72))!important;max-height:calc(var(--selene-stable-vh,100vh) - 12px)!important;overflow:hidden!important}
        #${ID}:not(.immersive)>.body{height:calc(100% - 45px)!important;overflow:hidden!important}
      }
      @media(prefers-reduced-motion:reduce){#${ID},#${ID} *,#${ID}:after{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important}}
    </style>`);
    el.querySelector('.skin').insertAdjacentHTML('beforebegin','<button class="pin" title="固定窗口，禁止移动和缩放">📌</button>');
    el.querySelector('.now').insertAdjacentHTML('afterend','<div class="immersive-view"><div class="ambient"></div><button type="button" class="immersive-close" title="返回小窗" aria-label="返回小窗"><svg class="selene-control-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="cover-glass"><img class="immersive-cover" alt="专辑封面" role="button" tabindex="0" title="返回播放器"></div><div class="immersive-info"><small>NOW PLAYING</small><h2>尚未选择歌曲</h2><p>搜索并播放一首歌曲</p><div class="immersive-lyric" role="region" aria-label="同步歌词，点击句子跳转">暂无歌词</div></div></div>');
    el.insertAdjacentHTML('beforeend','<i class="resize-handle n" data-r="n"></i><i class="resize-handle ne" data-r="ne"></i><i class="resize-handle e" data-r="e"></i><i class="resize-handle se" data-r="se"></i><i class="resize-handle s" data-r="s"></i><i class="resize-handle sw" data-r="sw"></i><i class="resize-handle w" data-r="w"></i><i class="resize-handle nw" data-r="nw"></i>');
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-immersive-style">
      #${ID}{min-width:300px;min-height:220px}
      #${ID} .now img{cursor:zoom-in}
      #${ID} .pin{font-size:15px}
      #${ID}.pinned .pin{background:#f2cf7040!important;border-color:#f2cf70!important;transform:rotate(-35deg)}
      #${ID}.pinned .selene-player-head{cursor:default}
      #${ID} .immersive-view{display:none}
      #${ID}.immersive{width:min(900px,calc(100vw - 28px));height:min(680px,calc(100vh - 28px));max-width:calc(100vw - 12px);max-height:calc(100vh - 12px)}
      #${ID}.immersive>.body{position:relative;isolation:isolate;display:flex!important;flex-direction:column!important;height:calc(100% - 45px)!important;min-height:0!important;padding:0 clamp(12px,3cqw,28px) 12px!important;gap:0!important;overflow:hidden!important;background:#151a26!important;color:#f6f4f1!important}
      #${ID}.immersive>.body:before{content:'';position:absolute;z-index:-2;inset:-45px;pointer-events:none;background-image:var(--album-cover);background-size:cover;background-position:center;filter:blur(42px) saturate(.8);opacity:.35;transform:scale(1.12)}
      #${ID}.immersive>.body:after{content:'';position:absolute;z-index:-1;inset:0;pointer-events:none;background:linear-gradient(160deg,#12172655,#111521aa)}
      #${ID}.immersive .now,#${ID}.immersive form,#${ID}.immersive .actions,#${ID}.immersive .list,#${ID}.immersive .lyrics{display:none!important}
      #${ID}.immersive>.body>.immersive-view{position:relative;isolation:isolate;display:grid!important;flex:1 1 0!important;width:100%;min-width:0;min-height:0!important;margin:0!important;padding:clamp(12px,3cqh,24px) 0 0!important;grid-template-columns:minmax(0,38%) minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:clamp(14px,3cqw,32px)!important;text-align:left!important;align-items:center!important;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;overflow:hidden!important}
      #${ID}.immersive .immersive-view>.ambient,#${ID}.immersive .immersive-view:after{display:none!important}
      #${ID}.immersive .cover-glass{position:relative;align-self:center;justify-self:center;aspect-ratio:1;width:min(100%,calc(38cqh * var(--cover-scale,1)),240px)!important;max-width:100%!important;margin:0!important;padding:0!important;border:0!important;border-radius:16px!important;background:none!important;box-shadow:0 8px 26px #0003!important;backdrop-filter:none!important}
      #${ID}.immersive .immersive-cover{display:block;width:100%!important;height:100%!important;aspect-ratio:1;object-fit:cover;border-radius:inherit!important;box-shadow:none!important;cursor:zoom-out}
      #${ID}.immersive .immersive-info{display:flex;flex-direction:column;align-self:stretch!important;justify-self:center;min-width:0;min-height:0;width:100%;max-width:760px;overflow:hidden;color:#f6f4f1;text-shadow:none!important}
      #${ID}.immersive .immersive-info small{display:none!important}
      #${ID}.immersive .immersive-info h2{flex:0 0 auto;margin:0 32px 5px 0!important;font:600 clamp(19px,4cqw,30px)/1.3 system-ui!important;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block!important}
      #${ID}.immersive .immersive-info p{flex:0 0 auto;margin:0!important;font:400 clamp(12px,2.4cqw,15px)/1.4 system-ui!important;opacity:.62;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #${ID}.immersive .immersive-lyric{position:relative;flex:1 1 0!important;min-height:0!important;height:auto!important;max-height:none!important;margin:10px 0 0!important;padding:0!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain;scrollbar-width:none;text-align:inherit;white-space:normal;mask-image:linear-gradient(transparent,#000 8% 92%,transparent);-webkit-mask-image:linear-gradient(transparent,#000 8% 92%,transparent);font:500 clamp(18px,3.6cqw,30px)/1.4 system-ui!important;text-shadow:none}
      #${ID}.immersive .immersive-lyric:before,#${ID}.immersive .immersive-lyric:after{content:'';display:block;height:var(--lyric-edge,80px);pointer-events:none}
      #${ID} .immersive-lyric::-webkit-scrollbar{display:none}
      #${ID}.immersive .immersive-lyric .immersive-line{display:block!important;width:100%!important;height:auto!important;min-height:0!important;padding:6px 4px!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;text-align:inherit;color:inherit!important;font:500 clamp(18px,3.6cqw,30px)/1.4 system-ui!important;opacity:.3;transform:none!important;transition:opacity .25s;white-space:normal;overflow-wrap:anywhere}
      #${ID} .immersive-line span{display:block}
      #${ID} .immersive-line .lyric-translation{font-size:.84em;line-height:1.4}
      #${ID} .immersive-line.near{opacity:.58}
      #${ID}.immersive .immersive-line.active{opacity:1;font-weight:700!important}
      #${ID} .immersive-line:focus-visible{outline:2px solid currentColor;outline-offset:-2px}
      #${ID}.skin-orbit.immersive .cover-glass{display:none!important}
      #${ID}.skin-orbit.immersive>.body>.immersive-view{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;text-align:center!important;padding-top:clamp(14px,4cqh,30px)!important}
      #${ID}.skin-orbit.immersive .immersive-info h2{margin:0 38px 5px!important;text-align:center!important}
      #${ID}.skin-orbit.immersive .immersive-info p{margin:0 38px!important;text-align:center!important}
      #${ID}.immersive .immersive-close{position:absolute;right:0;top:8px;z-index:3;display:flex!important;align-items:center!important;justify-content:center!important;width:30px!important;height:30px!important;padding:0!important;border:0!important;border-radius:50%!important;background:#ffffff0d!important;color:#f6f4f1!important;font-size:0!important;line-height:0!important;cursor:pointer}
      #${ID} .immersive-return{display:none!important}
      #${ID}.immersive>.body>.controls{position:relative;z-index:2;display:grid!important;flex:0 0 auto!important;grid-template-columns:minmax(0,1fr) 40px 48px 40px minmax(0,1fr)!important;grid-template-rows:48px 16px!important;align-items:center!important;column-gap:12px!important;row-gap:3px!important;width:100%;margin:6px 0 0!important;padding:0!important;background:none!important}
      #${ID}.immersive .controls button{display:flex!important;align-items:center!important;justify-content:center!important;grid-row:1!important;justify-self:center;width:36px!important;height:36px!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#f6f4f1!important;box-shadow:none!important;font-size:0!important;line-height:0!important;transform:none!important}
      #${ID}.immersive .controls button:before,#${ID} .controls [data-c=mode]:before{content:'';display:block;width:22px;height:22px;background:currentColor;mask:var(--control-icon) center/contain no-repeat;-webkit-mask:var(--control-icon) center/contain no-repeat;pointer-events:none}
      #${ID}.immersive .controls button:hover{background:#ffffff12!important}
      #${ID}.immersive .controls button:focus-visible{outline:2px solid #ffffffa0;outline-offset:2px}
      #${ID}.immersive .controls [data-c=prev]{grid-column:2!important}
      #${ID}.immersive .controls [data-c=play]{grid-column:3!important;width:44px!important;height:44px!important;background:#f6f4f1!important;color:#1a202d!important}
      #${ID}.skin-orbit.immersive>.body{background:#39313f!important}
      #${ID}.skin-orbit.immersive>.body:before{opacity:.58;filter:blur(38px) saturate(1.1)}
      #${ID}.skin-orbit.immersive>.body:after{background:linear-gradient(160deg,#ffffff0a,#251f3733)}
      #${ID}.skin-orbit.immersive .controls [data-c=play]{background:#ffffff1c!important;color:#fff4ef!important;border:1px solid #ffffff36!important;box-shadow:inset 0 1px #ffffff2a!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
      #${ID}.immersive .controls [data-c=next]{grid-column:4!important}
      #${ID}.immersive .controls [data-c=mode]{grid-column:5!important;justify-self:center!important}
      #${ID}.immersive .controls .progress{grid-column:1/-1!important;grid-row:2!important;width:100%!important;margin:0!important}
      #${ID}.immersive>.body>.time{position:relative;flex:0 0 auto;min-height:15px;padding:0!important;margin:0!important;color:#ffffff9c!important;font:400 10px/15px system-ui!important;font-variant-numeric:tabular-nums;text-align:left!important}
      #${ID}.immersive>.body>.volume{position:relative;display:flex!important;flex:0 0 auto;align-self:flex-end;align-items:center;width:clamp(84px,28%,160px);min-height:15px;gap:6px;margin:-15px 0 0!important;padding:0!important;color:#ffffff80!important;font:400 10px/15px system-ui!important}
      #${ID}.immersive .volume input{width:100%!important;min-width:0!important}
      #${ID}.immersive input[type=range]{-webkit-appearance:none!important;appearance:none!important;display:block;height:16px!important;min-height:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;cursor:pointer}
      #${ID}.immersive input[type=range]::-webkit-slider-runnable-track{height:3px!important;border:0!important;border-radius:99px!important;background:linear-gradient(to right,#f6f4f1 var(--range-fill,0%),#ffffff2c var(--range-fill,0%))!important;box-shadow:none!important}
      #${ID}.immersive input[type=range]::-webkit-slider-thumb{-webkit-appearance:none!important;appearance:none!important;width:9px!important;height:9px!important;margin-top:-3px!important;border:0!important;border-radius:50%!important;background:#f6f4f1!important;box-shadow:0 0 0 2px #ffffff0c!important}
      #${ID}.immersive input[type=range]::-moz-range-track{height:3px;border:0;border-radius:99px;background:#ffffff2c}
      #${ID}.immersive input[type=range]::-moz-range-progress{height:3px;border-radius:99px;background:#f6f4f1}
      #${ID}.immersive input[type=range]::-moz-range-thumb{width:9px;height:9px;border:0;border-radius:50%;background:#f6f4f1}
      @container(max-height:480px){
        #${ID}.immersive .cover-glass{display:none!important}
        #${ID}.immersive>.body>.immersive-view{grid-template-rows:minmax(0,1fr)!important;padding-top:12px!important;gap:0!important}
      }
      @container(max-width:380px){
        #${ID}.immersive .cover-glass{display:none!important}
        #${ID}.immersive>.body>.immersive-view{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;text-align:center!important;gap:0!important}
      }
      @container(max-height:320px){
        #${ID}.immersive>.body{padding-bottom:6px!important}
        #${ID}.immersive>.body>.immersive-view{padding-top:5px!important}
        #${ID}.immersive .immersive-info h2{font-size:16px!important;margin-bottom:0!important}
        #${ID}.immersive .immersive-info p{display:none!important}
        #${ID}.immersive .immersive-lyric{margin-top:4px!important}
        #${ID}.immersive .immersive-lyric .immersive-line{font-size:17px!important;padding:4px!important}
        #${ID}.immersive>.body>.controls{grid-template-rows:36px 12px!important;margin-top:2px!important;row-gap:0!important}
        #${ID}.immersive .controls [data-c=play]{width:32px!important;height:32px!important}
      }
      #${ID}.immersive .controls [data-c=prev]{--control-icon:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M5%205h2v14H5zm14%200v14l-10-7z%22%2F%3E%3C%2Fsvg%3E")}
      #${ID}.immersive .controls [data-c=next]{--control-icon:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M17%205h2v14h-2zM5%205l10%207-10%207z%22%2F%3E%3C%2Fsvg%3E")}
      #${ID}.immersive .controls [data-c=play]{--control-icon:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M8%205v14l11-7z%22%2F%3E%3C%2Fsvg%3E")}
      #${ID}.immersive .controls [data-c=play].is-playing{--control-icon:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M7%205h3v14H7zm7%200h3v14h-3z%22%2F%3E%3C%2Fsvg%3E")}
      #${ID} .controls [data-c=mode][data-mode=loop]{--control-icon:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M17%202l4%204-4%204M3%2011V9a3%203%200%20013-3h15M7%2022l-4-4%204-4m14-1v2a3%203%200%2001-3%203H3%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")}
      #${ID} .controls [data-c=mode][data-mode=one]{--control-icon:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M17%203l3%203-3%203M4%2010V9a3%203%200%20013-3h13M7%2021l-3-3%203-3m13-1v1a3%203%200%2001-3%203H4M11%2010l2-1v6%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")}
      #${ID} .controls [data-c=mode][data-mode=shuffle]{--control-icon:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22white%22%3E%3Cpath%20d%3D%22M3%206h3c5%200%207%2012%2012%2012h3m-4-4l4%204-4%204M3%2018h3c2%200%204-3%205-6s4-6%207-6h3m-4-4l4%204-4%204%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")}
#${ID} .resize-handle{position:absolute;z-index:20;display:block}#${ID}.pinned .resize-handle{display:none}#${ID} .resize-handle.n,#${ID} .resize-handle.s{left:12px;right:12px;height:9px;cursor:ns-resize}#${ID} .resize-handle.n{top:0}#${ID} .resize-handle.s{bottom:0}#${ID} .resize-handle.e,#${ID} .resize-handle.w{top:12px;bottom:12px;width:9px;cursor:ew-resize}#${ID} .resize-handle.e{right:0}#${ID} .resize-handle.w{left:0}#${ID} .resize-handle.ne,#${ID} .resize-handle.se,#${ID} .resize-handle.sw,#${ID} .resize-handle.nw{width:18px;height:18px}#${ID} .resize-handle.ne{right:0;top:0;cursor:nesw-resize}#${ID} .resize-handle.se{right:0;bottom:0;cursor:nwse-resize}#${ID} .resize-handle.sw{left:0;bottom:0;cursor:nesw-resize}#${ID} .resize-handle.nw{left:0;top:0;cursor:nwse-resize}</style>`);
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-mini-selene-style">
      #${ID} .selene-mini-art{display:none}
      #${ID}.mini>.mini-cover-shell{touch-action:none!important;-webkit-user-drag:none}
      #${ID}.mini[data-mini-shape=selene]{padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important}
      #${ID}.mini[data-mini-shape=selene]::before,#${ID}.mini[data-mini-shape=selene]::after{display:none!important}
      #${ID}.mini[data-mini-shape=selene] .mini-cover-shell{inset:0!important;width:100%!important;height:100%!important;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;overflow:visible!important}
      #${ID}.mini[data-mini-shape=selene] .mini-cover-shell::before,#${ID}.mini[data-mini-shape=selene] .mini-cover-shell::after{display:none!important}
      #${ID}.mini[data-mini-shape=selene] .selene-mini-art{display:block;width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 1px 1.5px #160d2a75)}
      #${ID}.mini[data-mini-shape=selene][data-mini-edge=left] .selene-mini-art{transform:scaleX(-1)}
      #${ID}.mini[data-mini-shape=selene][data-mini-dock=edge] .selene-mini-art{overflow:hidden}
      #${ID}.mini[data-mini-shape=selene][data-mini-dock=edge] .selene-mini-body{transform-box:view-box;transform-origin:50% 57%;transform:translateX(32%) rotate(-23deg) scale(.96)}
      #${ID}.mini[data-mini-shape=selene][data-mini-dock=top] .selene-mini-body{transform-box:view-box;transform-origin:13.46% 6.9%;transform:translateX(8%) rotate(14deg) scale(.86)}
      #${ID} :is(.selene-mini-sitting,.selene-mini-hanging,.selene-mini-peek){display:none}
      #${ID}.mini[data-mini-dock=input] .selene-mini-sitting,
      #${ID}.mini[data-mini-dock=top] .selene-mini-hanging,
      #${ID}.mini[data-mini-dock=edge] .selene-mini-peek{display:block}
      #${ID}.mini[data-mini-dock=input] .selene-mini-standing,
      #${ID}.mini[data-mini-dock=top] .selene-mini-upright,
      #${ID}.mini[data-mini-dock=edge] .selene-mini-folded-hands{display:none}
      @media(prefers-reduced-motion:no-preference){
        #${ID}.mini[data-mini-shape=selene][data-mini-dock=""] .selene-mini-art{transform-origin:center 88%;animation:selene-mini-dance 2.4s ease-in-out infinite paused}
        #${ID}.mini[data-mini-shape=selene][data-mini-dock=edge] .selene-mini-peek{transform-box:view-box;transform-origin:44% 73%;animation:selene-mini-wave 2.8s ease-in-out infinite paused}
        #${ID}.mini[data-mini-shape=selene][data-mini-dock=top] .selene-mini-body{animation:selene-mini-hang-swing 3s ease-in-out infinite paused}
        #${ID}.mini[data-mini-shape=selene][data-mini-dock=top] .selene-mini-beat{transform-box:view-box;transform-origin:73% 70%;animation:selene-mini-beat 1.6s ease-in-out infinite paused}
        #${ID}.mini[data-mini-shape=selene][data-mini-dock=input] .selene-mini-head{transform-box:view-box;transform-origin:57% 67%;animation:selene-mini-sway 2.8s ease-in-out infinite paused}
        #${ID}.mini[data-mini-shape=selene][data-mini-dock=top] .selene-mini-leg{transform-box:fill-box;transform-origin:center top;animation:selene-mini-kick 2.4s ease-in-out infinite alternate paused}
        #${ID}.mini[data-mini-shape=selene][data-mini-dock=top] .selene-mini-leg:nth-child(2){animation-direction:alternate-reverse}
        #${ID}.mini.selene-mini-playing:not(.pointer-interacting) :is(.selene-mini-art,.selene-mini-peek,.selene-mini-body,.selene-mini-beat,.selene-mini-head,.selene-mini-leg){animation-play-state:running}
      }
      @keyframes selene-mini-dance{0%,100%{transform:rotate(-3deg)}25%{transform:translateY(-2px) rotate(0)}50%{transform:rotate(3deg)}75%{transform:translateY(-2px) rotate(0)}}
      @keyframes selene-mini-wave{0%,55%,100%{transform:rotate(0)}13%,39%{transform:rotate(16deg)}26%{transform:rotate(5deg)}}
      @keyframes selene-mini-hang-swing{
        0%,50%,100%{transform:translateX(8%) rotate(14deg) scale(.86)}
        25%{transform:translateX(8%) rotate(4deg) scale(.86)}
        75%{transform:translateX(8%) rotate(24deg) scale(.86)}
      }
      @keyframes selene-mini-beat{0%,50%,100%{transform:rotate(9deg)}22%,72%{transform:rotate(-19deg)}}
      @keyframes selene-mini-kick{from{transform:rotate(-13deg)}to{transform:rotate(15deg)}}
      @keyframes selene-mini-sway{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
    </style>`);
    el.dataset.miniShape=playerMiniShape(); el.classList.toggle('touch-layout',isMobile()); el.classList.toggle('pinned',!!settings.windowPinned); el.classList.toggle('immersive',!!settings.immersive); el.classList.toggle('mini',!!settings.miniMode); el.style.right = `${settings.position.right}px`; el.style.bottom = `${settings.position.bottom}px`; applyPlayerSize(el); if(settings.windowSize&&!settings.miniMode){el.style.setProperty('width',`${settings.windowSize.width}px`,'important');el.style.setProperty('height',`${settings.windowSize.height}px`,'important');} applyMobilePosition(el); applyTheme(el); applySkin(el); el.querySelector('.actions').style.flexWrap='wrap'; bind(el); bindCurrentFavorite(el); bindCompanionLyrics(el); bindWindowFeatures(el); bindAdaptiveWindow(el); bindQuickLyrics(el); bindPlaybackSources(el); bindUiPresetOnly(el); bindScaleSettings(el); bindWindowResetSetting(el); applyCustomScales(el); bindFloatingSkinMenu(el); bindMiniPlayer(el); bindTitleGesture(el); bindListHeadingActions(el); bindWorldRecommendations(el); const picker=el.querySelector('.skin-picker');picker.onclick=e=>{const skin=e.target.dataset.skin;if(!skin)return;settings.skin=skin;applySkin(el);picker.classList.add('hidden');save();}; bindDesktopLyrics(); updateLyricsLock(); updatePlayMode(); audio.volume = settings.volume; updatePlayButton(); updateKeepAliveUI(); if(settings.keepAlive)ROOT.setTimeout(()=>startKeepAlive({persist:false,notify:false}),0);
    return el;
  }
  let playbackNoticeTimer=0;
  const setStatus = (x,persistent=false,retryAt=0) => {
    ROOT.clearInterval(playbackNoticeTimer);playbackNoticeTimer=0;
    const player=DOC.getElementById(ID),el=player?.querySelector('.status');if(!el)return;
    el.textContent=persistent?'':x;el.classList.toggle('status-alert',!!el.textContent&&!/^(正在播放|已暂停|就绪)$/.test(String(x)));el.setAttribute('role','status');
    let notice=player.querySelector('.selene-playback-notice');
    if(!persistent){notice?.remove();return;}
    if(!notice){notice=DOC.createElement('small');notice.className='selene-playback-notice';notice.setAttribute('role','status');player.querySelector('.lyrics').after(notice);}
    notice.textContent=x;
    if(!retryAt)return;
    const countdown=DOC.createElement('span');
    countdown.setAttribute('aria-live','off');notice.append(countdown);
    const update=()=>{
      const seconds=Math.max(0,Math.ceil((retryAt-Date.now())/1000));
      countdown.textContent=seconds?`。LX Music 冷却剩余 ${seconds} 秒`:'。LX Music 冷却已结束';
      if(!seconds){ROOT.clearInterval(playbackNoticeTimer);playbackNoticeTimer=0;}
    };
    if(Date.now()<retryAt)playbackNoticeTimer=ROOT.setInterval(update,1000);
    update();
  };
  function applyTheme(el=DOC.getElementById(ID)){if(!el)return;el.classList.remove('theme-light','theme-dark');if(settings.theme==='light')el.classList.add('theme-light');if(settings.theme==='dark')el.classList.add('theme-dark');syncFloatingPanelThemes();syncCompanionAppearance();}
  function applySkin(el=DOC.getElementById(ID)){if(!el)return;el.classList.remove('skin-film','skin-red','skin-white','skin-black','skin-blue','skin-cream','skin-green','skin-albumglass','skin-orbit');el.classList.add(`skin-${settings.skin||'albumglass'}`);el.classList.remove('lyrics-focus');syncFloatingPanelThemes();syncCompanionAppearance();renderImmersiveLyrics(activeLyricIndex(audio.currentTime),true);}
  let stableMobileViewportHeight=Math.max(Number(ROOT.innerHeight)||0,Number(ROOT.visualViewport?.height)||0)||700;
  function editableHasFocus(){const active=DOC.activeElement;return !!active?.matches?.('input:not([type="range"]):not([type="checkbox"]):not([type="radio"]),textarea,[contenteditable="true"]');}
  function mobileKeyboardOpen(){if(!isMobile()||!editableHasFocus())return false;const visible=Number(ROOT.visualViewport?.height)||Number(ROOT.innerHeight)||0,baseline=Math.max(stableMobileViewportHeight,Number(ROOT.innerHeight)||0);return baseline-visible>Math.max(120,baseline*.18);}
  function refreshStableMobileViewport(el=DOC.getElementById(ID)){if(isMobile()&&!mobileKeyboardOpen()){const height=Number(ROOT.innerHeight)||Number(ROOT.visualViewport?.height)||stableMobileViewportHeight;if(height>250)stableMobileViewportHeight=height;}const value=`${Math.round(stableMobileViewportHeight)}px`;el?.style.setProperty('--selene-stable-vh',value);DOC.getElementById(`${ID}-companion`)?.style.setProperty('--selene-stable-vh',value);return stableMobileViewportHeight;}
  function playerMiniShape(){return ['round','square','selene'].includes(settings.miniShape)?settings.miniShape:'round';}
  function playerMiniPositionKey(){return isMobile()?'mobileMiniPosition':'miniPosition';}
  function miniViewport(){const vv=ROOT.visualViewport;return{left:Number(vv?.offsetLeft)||0,top:Number(vv?.offsetTop)||0,width:Number(vv?.width)||ROOT.innerWidth||390,height:Number(vv?.height)||ROOT.innerHeight||700};}
  let miniDockObserver=null,observedMiniDock=null;
  function miniToolbar(){return DOC.getElementById('top-settings-holder')||DOC.getElementById('top-bar');}
  function miniDockInputs(){
    return [
      {dock:'chat',input:DOC.getElementById('send_textarea')},
      {dock:'companion',input:DOC.querySelector(`#${ID}-companion .companion-form textarea`)},
    ].filter(item=>item.input);
  }
  function watchMiniDock(anchor=null){
    if(anchor===observedMiniDock)return;
    miniDockObserver?.disconnect();observedMiniDock=anchor;
    if(anchor&&ROOT.ResizeObserver){
      miniDockObserver??=new ROOT.ResizeObserver(()=>preserveMiniGeometry());
      miniDockObserver.observe(anchor);
    }
  }
  function placeMiniWindow(el,left,top,{snap=false,edge,dock,dropX,dropY,dragWidth,dragHeight}={}){
    const view=miniViewport(),selene=playerMiniShape()==='selene',scale=Math.max(.6,Math.min(1.6,Number(settings.miniScale)||1));
    const baseWidth=selene?48:52,baseHeight=selene?54:52;
    const normalWidth=Math.round(baseWidth*scale),normalHeight=Math.round(baseHeight*scale);
    const limit=(value,min,max)=>Math.max(min,Math.min(Math.max(min,max),value));
    const toolbar=snap&&(dock==='top'||Number.isFinite(dropY))?miniToolbar():null;
    const toolbarRect=toolbar?.getBoundingClientRect();
    const bar=toolbarRect?.width&&toolbarRect.height&&toolbarRect.top<=view.top+48&&toolbarRect.bottom>view.top&&
      toolbarRect.right>view.left&&toolbarRect.left<view.left+view.width&&toolbar.checkVisibility?.({visibilityProperty:true})!==false?toolbarRect:null;
    const topDrop=Number.isFinite(dropY)&&dropY<=Math.max((bar?.top??view.top)+normalHeight/2+10,(bar?.bottom??view.top)+16)&&
      (!bar||dropX>=bar.left-16&&dropX<=bar.right+16);
    const hang=snap&&(dock==='top'||topDrop);
    const restingHeight=Math.round(baseHeight*scale*(selene ? .78 : 1));
    const restoringInput=dock==='chat'||dock==='companion';
    const edgeDrop=Number.isFinite(dropX)&&Math.min(dropX-view.left,view.left+view.width-dropX)<=24;
    const candidates=snap&&!hang&&dock!=='edge'&&!edgeDrop
      ?miniDockInputs().filter(item=>!restoringInput||item.dock===dock):[];
    let match=null;
    for(const candidate of candidates){
      const {input}=candidate,box=input.getBoundingClientRect();
      if(!box.width||!box.height||input.checkVisibility?.({visibilityProperty:true})===false||
        box.top-restingHeight<view.top+6||box.top>view.top+view.height||box.right<=view.left||box.left>=view.left+view.width)continue;
      if(restoringInput){match={...candidate,box};break;}
      const center=left+(dragWidth??normalWidth)/2,bottom=top+(dragHeight??normalHeight);
      const dx=Math.max(box.left-center,center-box.right,0),dy=Math.max(box.top-bottom,top-box.bottom,0);
      if(dx>24||dy>48)continue;
      const distance=Math.hypot(dx,box.top-bottom);
      if(!match||distance<match.distance)match={...candidate,box,distance};
    }
    const box=match?.box,sit=!!box,compact=selene&&(hang||sit);
    const width=compact?Math.round(baseWidth*scale*.78):normalWidth,height=compact?restingHeight:normalHeight;
    // Keep the drag centered when the launcher changes size on docking or leaving a dock.
    left+=((dragWidth??width)-width)/2;top+=((dragHeight??height)-height)/2;
    // Only follow the active toolbar or input; free and side positions need no observer.
    watchMiniDock(hang?toolbar:match?.input||(restoringInput?candidates[0]?.input:null));
    const gap=selene&&snap&&!sit?0:6,xMin=view.left+gap,xMax=Math.max(xMin,view.left+view.width-width-gap);
    let x=limit(left,xMin,xMax),y=limit(top,view.top+6,view.top+view.height-height-6);
    if(hang){
      if(bar&&Math.min(bar.right,view.left+view.width)-Math.max(bar.left,view.left)>=width){
        x=limit(left,limit(bar.left,xMin,xMax),limit(bar.right-width,xMin,xMax));
      }
      y=limit(bar?.top??view.top,view.top,view.top+view.height-height);
    }else if(sit){
      x=limit(left,Math.max(xMin,box.left),Math.min(xMax,box.right-width));y=box.top-height+2;
    }else if(snap){
      if(edge!=='left'&&edge!=='right')edge=(dropX??left+width/2)<view.left+view.width/2?'left':'right';
      x=edge==='left'?xMin:xMax;
    }
    for(const [key,value] of Object.entries({width,height,'min-width':width,'min-height':height,'max-width':width,'max-height':height,left:x,top:y}))el.style.setProperty(key,`${value}px`,'important');
    el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');
    const anchor=hang?'top':match?.dock;
    el.dataset.miniEdge=snap&&!anchor?edge:'';el.dataset.miniDock=hang?'top':sit?'input':snap?'edge':'';el.dataset.miniAnchor=anchor||'';
    // Keep the original drag height for an input that may temporarily hide.
    return{left:Math.round(x),top:Math.round(sit?top:y),...(snap?(anchor?{dock:anchor}:{dock:'edge',edge}):{})};
  }
  function restoreMiniGeometry(el,position){
    const {left,top,edge,dock}=position;
    return placeMiniWindow(el,left,top,{snap:!!settings.miniSnap,edge,dock:dock||(edge?'edge':undefined)});
  }
  function preserveMiniGeometry(el=DOC.getElementById(ID)){
    if(!el?.classList.contains('mini'))return false;
    if(el.hidden||el.classList.contains('pointer-interacting'))return true;
    restoreMiniGeometry(el,settings[playerMiniPositionKey()]||el.getBoundingClientRect());return true;
  }
  function applyPlayerSize(el=DOC.getElementById(ID)){if(!el||preserveMiniGeometry(el))return;const preferredWidth={s:310,m:365,l:430}[settings.playerSize]||365;if(isMobile()){refreshStableMobileViewport(el);const viewportWidth=ROOT.visualViewport?.width||ROOT.innerWidth||DOC.documentElement.clientWidth||390,maxWidth=Math.max(0,viewportWidth-28),width=Math.min(preferredWidth,maxWidth);el.style.setProperty('width',`${width}px`,'important');el.style.setProperty('max-width',`${maxWidth}px`,'important');el.style.setProperty('min-width','0','important');return;}el.style.width=`min(${preferredWidth}px,calc(100vw - 24px))`;el.style.maxWidth='calc(100vw - 24px)';}
  function isMobile(){const media=ROOT.matchMedia?.bind(ROOT),width=ROOT.visualViewport?.width||ROOT.innerWidth||0,height=ROOT.visualViewport?.height||ROOT.innerHeight||0,touch=Number(ROOT.navigator?.maxTouchPoints||0)>0,touchTablet=touch&&Math.min(width,height)<=1024&&Math.max(width,height)<=1400;return !!(media?.('(max-width:480px)').matches||media?.('(max-width:1024px) and (hover:none) and (pointer:coarse)').matches||touchTablet);}
  function applyMobilePosition(el=DOC.getElementById(ID)){
    if(!el||!isMobile()||el.classList.contains('mini')||el.classList.contains('pointer-interacting'))return;
    refreshStableMobileViewport(el);
    const view=ROOT.visualViewport,leftEdge=Number(view?.offsetLeft)||0,topEdge=Number(view?.offsetTop)||0,width=Number(view?.width)||ROOT.innerWidth||DOC.documentElement.clientWidth,height=Number(view?.height)||ROOT.innerHeight||stableMobileViewportHeight;
    const left=Math.max(leftEdge+6,Math.min(Math.max(leftEdge+6,leftEdge+width-el.offsetWidth-6),Number(settings.mobilePosition.left)||leftEdge+6)),top=Math.max(topEdge+6,Math.min(Math.max(topEdge+6,topEdge+height-el.offsetHeight-6),topEdge+height*(Number(settings.mobilePosition.top)||18)/100));
    el.style.setProperty('left',`${left}px`,'important');el.style.setProperty('top',`${top}px`,'important');el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');
  }
  function updatePlayButton(){const playing=playbackPhase==='playing'&&!audio.paused,loading=playbackWanted&&playbackPhase==='loading',player=DOC.getElementById(ID),button=player?.querySelector('[data-c="play"]');player?.classList.toggle('selene-mini-playing',playing);if(button){button.textContent=loading?'…':playing?'❚❚':'▶';button.classList.toggle('is-playing',playing);button.setAttribute('aria-busy',String(loading));button.title=loading?'正在加载，点击取消':playing?'暂停':'播放';}if(playing&&current){pauseKeepAliveForTrack();updateMediaMetadata(current,true);}else scheduleKeepAliveSync();updateMediaPlaybackState(true);}
  function updateLyricsLock(){
    const lyrics=DOC.getElementById(`${ID}-desktop-lyrics`),quick=DOC.querySelector(`#${ID} .quick-lyrics-lock`);
    lyrics?.classList.toggle('lyrics-locked',!!settings.lyricsLocked);
    if(quick){quick.innerHTML=seleneControlIcon(settings.lyricsLocked?'locked':'unlocked');quick.setAttribute('aria-pressed',String(!!settings.lyricsLocked));quick.title=settings.lyricsLocked?'解锁歌词位置':'锁定歌词位置';quick.setAttribute('aria-label',quick.title);}
    const input=DOC.querySelector(`#${ID}-lyrics-float [name=lyricsLocked]`);if(input)input.checked=!!settings.lyricsLocked;
  }
  function updatePlayMode(announce=false){
    const button=DOC.querySelector(`#${ID} [data-c="mode"]`);
    if(!button)return;
    const labels={loop:'顺序循环',one:'单曲循环',shuffle:'随机播放'};
    const mode=Object.hasOwn(labels,settings.playMode)?settings.playMode:'loop';
    const label=`播放模式 · ${labels[mode]}`;
    button.dataset.mode=mode;
    button.title=label;
    button.setAttribute('aria-label',label);
    if(announce)toast('info',label);
  }
  function nextSong(step=1){
    const inQueue=queue.length>0,list=inQueue?queue:(settings.favorites||[]);
    const playable=list.map((song,index)=>({song,index})).filter(({song})=>song&&!isVideoEntry(song));
    if(!playable.length)return null;
    if(settings.playMode==='one'&&current&&!isVideoEntry(queue[queueIndex])&&!bilibiliPlayer.isOpen())return current;
    const sameTrack=song=>song===current||!!song&&!!current&&(
      !!current.id&&song.id===current.id||!!current.mediaId&&song.mediaId===current.mediaId&&song.source===current.source
    );
    let next;
    if(settings.playMode==='shuffle'){
      const others=playable.filter(({song})=>!sameTrack(song));
      const candidates=others.length?others:playable;
      next=candidates[Math.floor(Math.random()*candidates.length)];
    }else{
      const index=inQueue?queueIndex:list.findIndex(sameTrack);
      next=step>0
        ? playable.find(item=>item.index>index)||playable[0]
        : [...playable].reverse().find(item=>item.index<index)||playable.at(-1);
    }
    if(inQueue)queueIndex=next.index;
    return next.song;
  }
  const playlistPlaybackOrigins=new WeakMap();
  function playPlaylistAt(songs,index=0){
    if(!songs[index]){setStatus('这个歌单还是空的');return;}
    queue=songs.map(song=>{
      const copy={...song};
      playlistPlaybackOrigins.set(copy,song);
      return copy;
    });
    queueIndex=index;
    count();
    playListEntry(queue[index]);
  }
  function bindDesktopLyrics(){
    const el=DOC.getElementById(`${ID}-desktop-lyrics`);if(!el)return;
    el.style.pointerEvents='auto';el.style.touchAction='none';el.style.userSelect='none';el.style.webkitUserSelect='none';
    let drag=null;
    const viewport=()=>({width:ROOT.visualViewport?.width||ROOT.innerWidth||390,height:ROOT.visualViewport?.height||ROOT.innerHeight||700});
    const start=e=>{if(settings.lyricsLocked||(e.pointerType==='mouse'&&e.button!==0)||drag)return;drag={pointerId:e.pointerId};el.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation();};
    const move=e=>{
      if(!drag||e.pointerId!==drag.pointerId)return;const size=viewport(),mobile=isMobile(),left=Math.max(1,Math.min(99,e.clientX/size.width*100));
      if(mobile){const halfHeight=Math.min(49,el.getBoundingClientRect().height/size.height*50),top=Math.max(Math.max(1,halfHeight),Math.min(Math.min(99,100-halfHeight),e.clientY/size.height*100));settings.mobileLyricsPosition={left,top};}
      else{const lyricHeight=el.getBoundingClientRect().height/size.height*100,maxBottom=Math.max(1,99-lyricHeight),bottom=Math.max(1,Math.min(maxBottom,(size.height-e.clientY)/size.height*100));settings.desktopPosition={left,bottom};}
      renderDesktopLyrics(currentLyricWords);e.preventDefault();
    };
    const finish=e=>{const pointerId=drag?.pointerId;if(pointerId===undefined||e?.pointerId!==undefined&&e.pointerId!==pointerId)return;drag=null;try{el.releasePointerCapture?.(pointerId);}catch{}save();};
    el.addEventListener('pointerdown',start,{passive:false});el.addEventListener('pointermove',move,{passive:false});el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);el.addEventListener('lostpointercapture',finish);
  }
  function renderDesktopLyrics(words=''){
    const el=DOC.getElementById(`${ID}-desktop-lyrics`);if(!el)return;
    updateQuickLyricsButton();
    const mobile=isMobile(),currentWords=words.trim(),visible=settings.floatingLyrics&&!!currentWords;
    el.classList.toggle('hidden',!visible);if(!visible)return;
    const lines=currentWords.split('\n',2);
    if(lines.length===1){
      const next=lyricTimeline[activeLyricIndex(audio.currentTime)+1]?.lines.find(Boolean);
      if(next)lines.push(next);
    }
    const textEl=el.querySelector('.lyric-text'),text=lines.join('\n');
    if(textEl&&textEl.textContent!==text)textEl.textContent=text;
    el.classList.toggle('gradient',!!settings.lyricGradient);el.classList.toggle('lyrics-locked',!!settings.lyricsLocked);
    el.style.setProperty('position','fixed','important');el.style.setProperty('z-index','2147483646','important');el.style.setProperty('right','auto','important');
    if(mobile){
      el.style.setProperty('width','min(82vw,320px)','important');el.style.setProperty('max-width','calc(100vw - 24px)','important');el.style.setProperty('padding','5px 18px 5px 7px','important');el.style.setProperty('font-size',`${Math.max(10,Math.min(42,Number(settings.mobileLyricFontSize)||14))}px`,'important');el.style.setProperty('line-height','1.35','important');
      const position=settings.mobileLyricsPosition||defaults.mobileLyricsPosition,viewHeight=ROOT.visualViewport?.height||ROOT.innerHeight||700,halfHeight=Math.min(49,el.getBoundingClientRect().height/viewHeight*50),left=Math.max(1,Math.min(99,Number(position.left)||50)),top=Math.max(Math.max(1,halfHeight),Math.min(Math.min(99,100-halfHeight),Number(position.top)||50));
      settings.mobileLyricsPosition={left,top};el.style.setProperty('left',`${left}%`,'important');el.style.setProperty('top',`${top}dvh`,'important');el.style.setProperty('bottom','auto','important');el.style.setProperty('transform','translate(-50%,-50%)','important');
    }else{
      el.style.removeProperty('width');el.style.setProperty('padding','4px 18px 4px 10px','important');el.style.removeProperty('line-height');el.style.setProperty('max-width','88vw','important');el.style.setProperty('font-size',`${Math.max(12,Math.min(68,Number(settings.desktopLyricFontSize)||22))}px`,'important');
      const position=settings.desktopPosition||defaults.desktopPosition,viewHeight=ROOT.visualViewport?.height||ROOT.innerHeight||700,lyricHeight=el.getBoundingClientRect().height/viewHeight*100,maxBottom=Math.max(1,99-lyricHeight),left=Math.max(1,Math.min(99,Number(position.left)||50)),bottom=Math.max(1,Math.min(maxBottom,Number(position.bottom)||11));
      settings.desktopPosition={left,bottom};el.style.setProperty('left',`${left}%`,'important');el.style.setProperty('top','auto','important');el.style.setProperty('bottom',`${bottom}vh`,'important');el.style.setProperty('transform','translateX(-50%)','important');
    }
    el.style.setProperty('white-space','pre-line','important');el.style.cursor=settings.lyricsLocked?'default':'move';el.style.color=settings.lyricColor;el.style.backgroundImage='';if(textEl)textEl.style.backgroundImage=settings.lyricGradient?`linear-gradient(90deg,${settings.lyricColor},${settings.lyricGradientColor},${settings.lyricColor})`:'';
  }
  function gdSong(source,x){
    const mediaId=String(x.mediaId??x.id??'');
    return {id:`${source}:${mediaId}`,mediaId,title:getSongTitle(x),artist:getSongArtist(x),album:getSongAlbum(x),version:String(x.version||''),cover:x.pic||x.picUrl||x.album?.picUrl||x.cover||'',coverId:String(x.pic_id||x.coverId||''),lyricId:String(x.lyric_id||x.lyricId||mediaId),duration:songDuration(x),audio:'',source,gdSource:source,gdLyricId:String(x.lyric_id||x.lyricId||mediaId)};
  }
  async function searchSource(source,word){
    const data=await gdJson({types:'search',source,name:word,count:'20',pages:'1'}),rows=Array.isArray(data)?data:(data?.data||[]);
    return rows.map(x=>gdSong(source,x)).filter(x=>x.mediaId&&x.title);
  }
  function querySongHits(rows,word,preferredSong){
    if(preferredSong)return rows.filter(song=>Number.isFinite(scoreSongHit(song,preferredSong)));
    const query=songTitleKey({title:word}).replace(/周杰倫|jaychou/g,'周杰伦'),version=lyricVersion({title:word});
    return rows.filter(song=>{
      const title=songTitleKey(song),artist=canonicalArtist(song.artist);
      // A compound query must account for BOTH fields; never drop an explicit singer.
      return (query===title||!!artist&&(query===title+artist||query===artist+title))&&lyricVersion(song)===version;
    });
  }
  function rankSearchResults(rows,word){
    const exact=new Set(querySongHits(rows,word)),score=song=>exact.has(song)?100:artistMatches(song.artist,word)?80:0;
    return rows.filter((song,index,list)=>list.findIndex(item=>item.source===song.source&&item.id===song.id&&item.title===song.title&&item.artist===song.artist)===index).sort((a,b)=>score(b)-score(a));
  }
  async function search(word,autoPlayFirst=false,showList=true,heading='',quiet=false,preferredSong=null){
    word=String(word||'').trim();if(!word)return;
    const request=++searchRequest,strict=autoPlayFirst||!!preferredSong;
    const selected=GD_SOURCES.includes(settings.searchSource)?settings.searchSource:'auto';
    const sources=selected==='auto'?GD_SOURCES:[selected];
    setStatus('正在搜索…');let found=[],lastError;
    for(const source of sources){
      try{
        const rows=await searchSource(source,word);if(request!==searchRequest||disposed)return;
        if(strict){found=querySongHits(rows,word,preferredSong);if(found.length)break;}
        else{
          found.push(...rows);
          // Broad results stay visible, but covers alone must not hide a requested singer on JOOX.
          const precise=querySongHits(rows,word).some(song=>normalizeSongText(word)!==normalizeSongText(song.title));
          if(selected!=='auto'||precise)break;
        }
      }catch(error){lastError=error;if(error.retryAt)break;}
    }
    if(request!==searchRequest||disposed)return;
    results=strict?found:rankSearchResults(found,word);
    const listBox=DOC.querySelector(`#${ID} .list`);
    if(showList)render(results,heading,'results',false);else if(listBox){listBox.hidden=true;listBox.innerHTML='';}
    if(results.length){
      setStatus(`${results.length} 个${strict?'匹配':'搜索'}结果`);
      if(autoPlayFirst)await play(results[0]);
      if(showList)ROOT.setTimeout(()=>{if(request===searchRequest)hydrateResultCovers(results);},0);
    }else{
      const message=lastError?.message||(strict?'没有找到符合歌名、歌手及版本的歌曲':'没有找到歌曲，可在设置中切换搜索源，或换个关键词');
      setStatus(message,true);if(!quiet)toast('warning',message);
    }
  }

  async function searchOtherMusic(word){
    const request=++searchRequest,box=DOC.querySelector(`#${ID} .list`),previousClick=box?.onclick;
    const isActive=()=>!disposed&&request===searchRequest&&box?.onclick===previousClick;
    setStatus('正在搜索 QQ 音乐…');
    try{
      const rows=await searchMetingSource('tencent',word);
      if(!isActive())return;
      results=rows;
      render(rows,'QQ 音乐','results',false);
      setStatus(rows.length?`${rows.length} 个 QQ 音乐搜索结果`:'没有找到 QQ 音乐歌曲');
    }catch(error){
      if(!isActive())return;
      results=[];
      render(results,'QQ 音乐 · 搜索暂不可用','results',false,error.message);
      setStatus(error.message,true);
    }
  }

  function showBilibiliVideo(bvid){
    ++searchRequest;
    const saved=[...(settings.favorites||[]),...(settings.playlists||[]).flatMap(list=>list.songs||[]),
      ...(Array.isArray(settings.bilibiliSearchMetadata)?settings.bilibiliSearchMetadata:[])]
      .find(song=>bilibili.trackId(song)===bvid);
    results=[bilibili.video(saved,bvid)];
    render(results,'B 站视频','results',false);
    setStatus('');
  }

  const coverResponses=new Map(),coverRequests=new Map();
  let resultCoverObserver=null;
  function hydrateResultCovers(rows){
    if(disposed||results!==rows)return;
    const box=DOC.querySelector(`#${ID} .list`);
    if(!box)return;
    resultCoverObserver?.disconnect();
    const images=box.querySelectorAll('img[data-result-cover]:not([src])');
    const queued=new Set();
    let loading=null;
    const load=async img=>{
      if(disposed||results!==rows||!img.isConnected||img.hasAttribute('src'))return;
      const song=rows[Number(img.parentElement.dataset.i)];
      if(!song||isVideoEntry(song))return;
      const {source,mediaId}=song;
      const isActive=()=>!disposed&&results===rows&&img.isConnected&&!img.hasAttribute('src')&&song.source===source&&song.mediaId===mediaId;
      try{
        const cover=song.cover||await resolveCover({...song},[],isActive);
        if(!isActive()||!cover)return;
        song.cover=song.cover||cover;
        img.src=song.cover;
        observer?.unobserve(img);
        syncResultCover(song);
      }catch(error){console.warn('[音乐播放器] 候选列表封面加载失败',error);}
    };
    const drain=async()=>{
      if(loading)return;
      while(queued.size&&!disposed&&results===rows){
        const img=queued.values().next().value;
        queued.delete(img);
        loading=img;
        try{await load(img);}
        finally{loading=null;}
      }
    };
    const observer=ROOT.IntersectionObserver?new ROOT.IntersectionObserver(entries=>{
      for(const {target,isIntersecting} of entries){
        if(!isIntersecting){queued.delete(target);continue;}
        if(!target.isConnected||target.hasAttribute('src'))observer.unobserve(target);
        else if(target!==loading)queued.add(target);
      }
      void drain();
    },{root:box}):null;
    resultCoverObserver=observer;
    if(observer){images.forEach(img=>observer.observe(img));return;}
    Array.from(images).slice(0,4).forEach(img=>queued.add(img));
    return drain();
  }
  function syncResultCover(song){
    DOC.querySelectorAll(`#${ID} img[data-result-cover]:not([src])`).forEach(img=>{
      const row=results[Number(img.parentElement.dataset.i)];
      if(!row||row.source!==song.source)return;
      if(row.mediaId!==song.mediaId&&(!song.coverId||row.coverId!==song.coverId))return;
      row.cover=song.cover;
      img.src=song.cover;
      resultCoverObserver?.unobserve(img);
    });
  }
  function bilibiliMenuButtons(song){
    if(!bilibili.trackId(song))return '';
    return '<button type="button" data-bili-action="watch" title="观看视频"></button>'+
      '<button type="button" data-bili-action="open" title="在 B 站打开"></button>';
  }
  function bilibiliVideoInfo(song){
    return [song.artist,song.duration>0?clock(song.duration):'',song.views!=null?`播放 ${Number(song.views).toLocaleString('zh-CN')}`:'',bilibili.trackId(song)].filter(Boolean).join(' · ')||'旧版 B 站记录';
  }
  function handleBilibiliMenu(event,song){
    const action=event.target.closest('[data-bili-action]')?.dataset.biliAction;
    if(!action)return false;
    const bvid=bilibili.trackId(song);
    if(bvid){
      if(action==='open')ROOT.open(bilibili.videoUrl(bvid),'_blank','noopener,noreferrer');
      else if(action==='watch')bilibiliPlayer.open(bvid,song.title,{showPicture:true});
    }
    return true;
  }
  function playListEntry(song){
    if(!isVideoEntry(song))return play(song);
    const bvid=bilibili.trackId(song);
    if(bvid)bilibiliPlayer.open(bvid,song.title);
    else setStatus('这条旧版 B 站记录没有有效 BV 号，可用标题到 B 站搜索',true);
  }
  function render(rows, heading='', kind='results', hydrateCovers=true, emptyMessage='没有歌曲') {
    resultCoverObserver?.disconnect();
    syncLibraryNavigation(kind==='fav'?'favorites':kind==='queue'?'queue':'');
    const box=DOC.querySelector(`#${ID} .list`),saved=kind==='fav'||kind==='queue';
    const headingActions=saved?`${kind==='fav'?'<button data-heading-action="clear">清空收藏</button><button data-heading-action="queue">收藏入队</button>':'<button data-heading-action="clear">清空队列</button>'}<button data-heading-action="play">一键播放</button>`:'';
    box.hidden=false;
    box.innerHTML=`${heading?`<div class="row${saved?' batch-heading':''}"><b>${esc(heading)}</b>${headingActions}</div>`:''}${rows.map((s,i)=>{
      const video=isVideoEntry(s);
      const videoResult=video&&kind==='results',title=esc(s.title);
      const subtitle=video?bilibiliVideoInfo(s):s.artist;
      const showPlayHint=videoResult&&s.title===bilibili.trackId(s);
      const tools=saved
        ? `${kind==='fav'?`<button data-q="${i}" title="加入播放队列">＋</button>`:''}${kind==='queue'?`<button data-save="${i}" title="加入收藏">☆</button>`:''}<button data-pl="${i}" title="加入歌单">歌单</button>${video?'':`<button data-audio="${i}" title="补充或更换 MP3 音源">音源</button><button data-cache="${i}" title="下载离线缓存">⇩</button>`}<button data-del="${i}" ${kind==='fav'?'data-row-heart':''} title="删除">×</button>`
        : `<button data-f="${i}" title="收藏">☆</button><button data-pl="${i}" title="加入歌单">歌单</button>${video?'':`<button data-audio="${i}" title="补充或更换 MP3 音源">音源</button><button data-cache="${i}" title="下载离线缓存">⇩</button>`}<button data-q="${i}" title="加入播放队列">＋</button>`;
      return `<article class="row" data-i="${i}" data-track-id="${esc(s.id)}"><img alt="" loading="lazy" decoding="async" ${kind==='results'?'data-result-cover':''} ${s.cover?`src="${esc(s.cover)}"`:''}><div><b>${videoResult?`<button type="button" class="bilibili-result-title">${title}</button>`:title}</b><span>${esc(showPlayHint?'点击播放声音':subtitle)}${kind==='results'&&GD_SOURCE_LABELS[s.source]?` · ${esc(GD_SOURCE_LABELS[s.source])}`:''}${s.customAudio?' · 手动音源':''}</span></div><span class="row-tools">${tools}${bilibiliMenuButtons(s)}</span></article>`;
    }).join('')||`<div class="row">${esc(emptyMessage)}</div>`}`;
    box.querySelectorAll('.row[data-i]>img').forEach(img=>{img.onerror=async()=>{
      img.onerror=null;const song=rows[Number(img.parentElement.dataset.i)],source=song.source,id=song.mediaId,failed=img.src;img.removeAttribute('src');
      const cover=await resolveCover({...song,cover:''},[failed]);if(!img.isConnected||song.source!==source||song.mediaId!==id||!cover)return;song.cover=cover;img.src=cover;if(saved)save();
    };});
    box.onclick=e=>{
      const headingAction=e.target.closest('[data-heading-action]')?.dataset.headingAction;
      if(headingAction){
        if(headingAction==='clear'){
          if(kind==='queue'){
            if(!queue.length){setStatus('播放队列已经是空的');return;}
            if(!ROOT.confirm?.('确定清空整个播放队列吗？'))return;
            queue=[];queueIndex=-1;count();render(queue,'播放队列','queue',false);setStatus('已清空播放队列');return;
          }
          if(!(settings.favorites||[]).length){setStatus('收藏已经是空的');return;}
          if(!ROOT.confirm?.('确定清空全部收藏歌曲吗？此操作无法撤销。'))return;
          settings.favorites=[];save();render(settings.favorites,'收藏歌曲','fav',false);setStatus('已清空全部收藏歌曲');return;
        }
        if(headingAction==='queue'){
          const known=new Set(queue.map(x=>x.id));let added=0;
          for(const song of settings.favorites||[])if(!known.has(song.id)){queue.push(strip(song));known.add(song.id);added++;}
          count();setStatus(added?`已将 ${added} 首收藏加入播放队列`:'收藏歌曲已在播放队列中');return;
        }
        if(kind==='fav'){queue=(settings.favorites||[]).map(strip);count();}
        if(!queue.length){setStatus('没有可播放的歌曲');return;}
        queueIndex=0;playListEntry(queue[0]);return;
      }
      const row=e.target.closest('[data-i]');if(!row)return;
      const i=+row.dataset.i,s=rows[i];if(!s)return;
      if(handleBilibiliMenu(e,s))return;
      if(e.target.closest('[data-del]')){
        const place=kind==='fav'?'收藏':'播放队列';
        if(!ROOT.confirm?.(`确定从${place}删除“${s.title} · ${s.artist}”吗？`))return;
        if(kind==='fav'){settings.favorites.splice(i,1);save();}else{queue.splice(i,1);if(i<queueIndex||queueIndex>=queue.length)queueIndex--;count();}
        render(kind==='fav'?settings.favorites:queue,heading,kind,false);setStatus(`已从${place}删除 ${s.title}`);
      }else if(e.target.closest('[data-save]')){saveFavorite(s);setStatus('已加入收藏');
      }else if(e.target.closest('[data-f]'))favorite(s);
      else if(e.target.closest('[data-pl]'))addSongToPlaylist(s);
      else if(e.target.closest('[data-audio]')){if(promptSongAudio(s))render(rows,heading,kind,false);}
      else if(e.target.closest('[data-cache]'))cacheSong(s);
      else if(e.target.closest('[data-q]')){queue.push(strip(s));count();if(kind==='fav')setStatus('已加入播放队列');}
      else if(kind==='fav')playPlaylistAt(rows,i);
      else{if(kind==='queue')queueIndex=i;playListEntry(s);}
    };
    if(hydrateCovers){if(kind==='results')ROOT.setTimeout(()=>hydrateResultCovers(rows),0);else if(kind==='fav'||kind==='queue')ROOT.setTimeout(()=>hydrateSavedCovers(rows,heading,kind),0);}
  }
  const strip = s => ({ album:typeof s.album==='object'?s.album?.name||'':s.album||'',version:s.version||'',id:s.id,mediaId:s.mediaId||s.id,title:s.title,artist:s.artist,cover:s.cover,coverId:s.coverId||'',lyricId:s.lyricId||'',gdSource:s.gdSource||'',gdLyricId:s.gdLyricId||'',duration:Number(s.duration)||0,audio:s.audio||'',customAudio:s.customAudio||'',source:s.source||'netease',...(s.bvid?{bvid:s.bvid,uid:s.uid,views:s.views}:{}),...(s.source==='tencent'&&s.lxSearch?{lxSearch:true}:{}),...(s.qqMid?{qqMid:s.qqMid}:{}) });
  function currentIsFavorite(song=current){return !!song&&(settings.favorites||[]).some(item=>item.id===song.id);}
  function updateCurrentFavorite(){const button=DOC.querySelector(`#${ID} .current-favorite`);if(!button)return;const active=currentIsFavorite();button.textContent=active?'♥':'♡';button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',active?'取消收藏当前歌曲':'收藏当前歌曲');button.title=active?'取消收藏当前歌曲':'收藏当前歌曲';button.disabled=!current;}
  function bindCurrentFavorite(el){
    const favoriteButton=el.querySelector('.current-favorite');
    favoriteButton.onclick=()=>{if(!current)return;const removing=currentIsFavorite();favorite(current);setStatus(removing?'已取消收藏当前歌曲':'已收藏当前歌曲');toast(removing?'info':'success',removing?'已取消收藏':'已加入收藏');};
    updateCurrentFavorite();
  }
  function favorite(s){const i=settings.favorites?.findIndex(x=>x.id===s.id);if(i>=0)settings.favorites.splice(i,1);else{settings.favorites=settings.favorites||[];settings.favorites.unshift(strip(s));}save();refreshLibraryHearts();}
  function saveFavorite(s){settings.favorites=settings.favorites||[];if(!settings.favorites.some(x=>x.id===s.id)){settings.favorites.unshift(strip(s));save();refreshLibraryHearts();}}
  function count(){const badge=DOC.querySelector(`#${ID} [data-library-queue-count]`);if(badge){badge.textContent=queue.length;badge.hidden=!queue.length;}}
  function show(s){const changed=current!==s;DOC.getElementById(`${ID}-source-float`)?.setAttribute('hidden','');if(changed){trackCompanionListeningTime({stop:true,saveNow:true});companionListeningAwaitingPlay=true;}current=s;updateCurrentFavorite();if(settings.keepAlive&&!keepAliveSuspendedForTrack)pauseKeepAliveForTrack();if(changed)clearMediaPosition();updateMediaMetadata(s,true);const e=DOC.getElementById(ID);if(!e)return;const sourceButton=e.querySelector('[data-c=source]');if(sourceButton){sourceButton.disabled=s.source==='direct';sourceButton.title=`切换播放源 · ${playbackLabel(s)}`;}e.querySelector('.title').textContent=s.title||'未知歌曲';e.querySelector('.artist').textContent=s.artist||'未知歌手';e.querySelector('.immersive-info h2').textContent=s.title||'未知歌曲';e.querySelector('.immersive-info p').textContent=s.artist||'未知歌手';const img=e.querySelector('.now img'),large=e.querySelector('.immersive-cover');img.style.visibility='visible';const applyCover=cover=>{if(cover){const cssCover=`url("${String(cover).replace(/["\\]/g,'\\$&')}")`;img.src=cover;large.src=cover;e.style.setProperty('--album-cover',cssCover);e.querySelector('.immersive-view').style.setProperty('--cover-image',cssCover);}else{img.removeAttribute('src');large.removeAttribute('src');e.style.setProperty('--album-cover','none');e.querySelector('.immersive-view').style.removeProperty('--cover-image');}syncFloatingPanelThemes();};img.onerror=async()=>{img.onerror=null;const failed=img.src,source=s.source,id=s.mediaId;img.removeAttribute('src');const cover=await resolveCover({...s,cover:''},[failed]);if(current===s&&s.source===source&&s.mediaId===id&&cover){s.cover=cover;applyCover(cover);if(settings.favorites?.includes(s))save();}};applyCover(s.cover);syncCompanionAppearance();const line=DOC.querySelector(`#${ID}-companion .companion-song`);if(line)line.textContent=`♫ ${companionSongContext().song}`;}
  const clock = seconds => { seconds=Number.isFinite(seconds)?Math.max(0,seconds):0;return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`; };
  const mediaDetail = error => String(error?.message||'暂时无法播放这首歌，请重试或切换音源');
  function normalizeSongText(value){return String(value||'').toLowerCase().normalize('NFKC').replace(/\b(feat(?:uring)?|ft)\.?\b/g,' ').replace(/[\s·•._\-—–()（）\[\]【】'"“”‘’/\\,:：;；!?！？]+/g,'');}
  function getSongTitle(item){return String(item?.name||item?.title||'').trim();}
  function getSongArtist(item){const name=x=>typeof x==='string'?x:String(x?.name||x?.artist||'');for(const value of [item?.artist,item?.artists,item?.ar,item?.singer,item?.author]){const artist=(Array.isArray(value)?value.map(name).filter(Boolean).join('/'):name(value)).trim();if(artist)return artist;}return '';}
  function artistParts(value){return [...new Set(String(value||'').normalize('NFKC').split(/\s*(?:\/|、|,|，|&|＆|\+|;|；|\bfeat(?:uring)?\.?\b|\bft\.?\b|\bwith\b)\s*/i).map(canonicalArtist).filter(Boolean))];}
  function canonicalArtist(value){
    let text=String(value||'').normalize('NFKC').trim();
    // Providers often append a Latin display alias to a Chinese artist, or vice versa.
    const alias=text.match(/^([^()]+)\(([^()]+)\)$/);
    if(alias&&!/cover|tribute|翻唱|致敬/i.test(text)){
      if(/[\u3400-\u9fff]/.test(alias[1])&&/^[\sA-Za-z.'·-]+$/.test(alias[2]))text=alias[1];
      else if(/^[\sA-Za-z.'·-]+$/.test(alias[1])&&/[\u3400-\u9fff]/.test(alias[2]))text=alias[2];
    }
    const name=normalizeSongText(text),aliases={'周杰倫':'周杰伦','jaychou':'周杰伦','周杰倫jaychou':'周杰伦','周杰伦jaychou':'周杰伦','林俊傑':'林俊杰','jjlin':'林俊杰','jolintsai':'蔡依林','davidtao':'陶喆','陳奕迅':'陈奕迅','easonchan':'陈奕迅','mayday':'五月天'};
    return aliases[name]||name;
  }
  function artistMatches(resultArtist,wantedArtist,allowCollaborators=false){const wanted=artistParts(wantedArtist),result=artistParts(resultArtist);return !wanted.length||wanted.every(w=>result.includes(w))&&(allowCollaborators||wanted.length===result.length);}
  function getSongAlbum(song){const album=song?.album??song?.al;return String(typeof album==='object'?album?.name||'':album||'').trim();}
  function lyricText(value){if(typeof value==='string')return value;if(!value||typeof value!=='object')return '';for(const key of ['lyric','lrc','text','content'])if(typeof value[key]==='string')return value[key];return '';}
  function extractLyrics(data){const groups=[data,data?.data,data?.result,data?.data?.[0],data?.result?.[0]],pick=keys=>{for(const group of groups)for(const key of keys){const text=lyricText(group?.[key]);if(text)return text;}return '';};return {original:pick(['lyric','lrc']),translation:pick(['tlyric','translation','translatedLyric','transLyric','trans','translate','lyricTranslation'])};}
  // LRC is line-timed; never manufacture word timings from character counts.
  function lrcTime(value){
    const text=String(value).trim();
    let m=text.match(/^(\d{1,3}):([0-5]?\d)(?:[.,:](\d{1,3}))?$/);
    if(m)return Number(m[1])*60+Number(m[2])+(m[3]?Number(`0.${m[3]}`):0);
    m=text.match(/^(\d{1,2}):([0-5]\d):([0-5]\d)[.,](\d{1,3})$/);
    return m?Number(m[1])*3600+Number(m[2])*60+Number(m[3])+Number(`0.${m[4]}`):null;
  }
  function parseLrcGroups(text){
    const raw=String(text||''),offsets=[...raw.matchAll(/\[offset\s*:\s*([+-]?\d+)\]/gi)],offset=Number(offsets.at(-1)?.[1]||0)/1000,map=new Map();
    for(const line of raw.split(/\r\n?|\n/)){
      const times=[...line.matchAll(/\[([^\]]+)\]/g)].map(m=>lrcTime(m[1])).filter(t=>t!==null);
      if(!times.length)continue;
      const words=line.replace(/\[[^\]]*\]/g,'').replace(/<\d+:\d+(?:[.,]\d+)?>/g,'').trim();
      for(const time of times){const key=Math.round(Math.max(0,time+offset)*1000)/1000,entry=map.get(key)||{time:key,lines:[]};if(words&&!entry.lines.includes(words))entry.lines.push(words);map.set(key,entry);}
    }
    return [...map.values()].sort((a,b)=>a.time-b.time);
  }
  function translationRowIndex(rows,time){
    let best=-1,diff=.081;
    for(let i=0;i<rows.length;i++){const distance=Math.abs(rows[i].time-time),gap=Math.min(i?rows[i].time-rows[i-1].time:Infinity,i+1<rows.length?rows[i+1].time-rows[i].time:Infinity);if(distance<diff&&distance<=Math.min(.08,gap/4)+.000001){best=i;diff=distance;}}
    return best;
  }
  function mergeLyricTimeline(originalText,translationText){
    const original=parseLrcGroups(originalText),translated=parseLrcGroups(translationText);
    if(!original.length)return translated;
    const used=new Set();
    return original.map((row,index)=>{const lines=[...row.lines],i=translationRowIndex(translated,row.time);if(lines.length&&i>=0&&!used.has(i)&&translationRowIndex(original,translated[i].time)===index){used.add(i);for(const line of translated[i].lines)if(!lines.includes(line))lines.push(line);}return{time:row.time,lines};});
  }
  function songDuration(song){
    if(Number(song?.dt)>0)return Number(song.dt)/1000;
    const value=song?.duration??song?.interval??song?.time??song?.extra_data?.duration;
    if(typeof value==='string'&&value.includes(':'))return lrcTime(value)||0;
    const number=Number(value);return Number.isFinite(number)&&number>0?(number>10000?number/1000:number):0;
  }
  const SONG_VERSION_PATTERN=/\b(?:live|remix|demo|acoustic|instrumental|karaoke|cover|remaster(?:ed)?|sped\s*up|slowed|radio\s*edit|dj)\b|演唱会|演唱會|巡回演唱|巡迴演唱|现场|現場|伴奏|纯音乐|純音樂|翻唱|重制|加速|降速|演奏|不插电|不插電|串烧|串燒/gi;
  function lyricVersion(song){
    const text=`${getSongTitle(song)} ${song?.version||''} ${getSongAlbum(song)}`.normalize('NFKC').toLowerCase(),aliases={'演唱会':'live','演唱會':'live','巡回演唱':'live','巡迴演唱':'live','现场':'live','現場':'live','翻唱':'cover','不插电':'acoustic','不插電':'acoustic','純音樂':'instrumental','纯音乐':'instrumental','重制':'remaster','remastered':'remaster','串燒':'串烧'};
    return [...new Set((text.match(SONG_VERSION_PATTERN)||[]).map(tag=>aliases[tag]||tag))].sort().join('|');
  }
  function songTitleKey(song){return normalizeSongText(getSongTitle(song).replace(SONG_VERSION_PATTERN,''));}
  function scoreLyricHit(item,song){
    const wanted=artistParts(getSongArtist(song)).map(canonicalArtist).sort(),found=artistParts(getSongArtist(item)).map(canonicalArtist).sort();
    if(!wanted.length||wanted.join('|')!==found.join('|')||normalizeSongText(getSongTitle(item))!==normalizeSongText(getSongTitle(song))||lyricVersion(item)!==lyricVersion(song))return -Infinity;
    // Cross-source lyrics require duration evidence. The last sung line is NOT track duration.
    const a=songDuration(item),b=songDuration(song);
    return a&&b&&Math.abs(a-b)<=Math.min(4,Math.max(2,b*.015))?1000-Math.abs(a-b):-Infinity;
  }
  function scoreSongHit(item,song){
    const title=songTitleKey(item),wantedTitle=songTitleKey(song),artist=getSongArtist(item),wantedArtist=getSongArtist(song);
    const a=songDuration(item),b=songDuration(song),album=normalizeSongText(getSongAlbum(item)),wantedAlbum=normalizeSongText(getSongAlbum(song));
    const exactArtist=artistMatches(artist,wantedArtist),collaboration=a&&b&&!/cover|tribute|翻唱|致敬/i.test(artist)&&artistMatches(artist,wantedArtist,true);
    if(!title||title!==wantedTitle||!exactArtist&&!collaboration||lyricVersion(item)!==lyricVersion(song))return -Infinity;
    // Audio editions may have a few seconds of padding. Lyrics retain their tighter check.
    if(a&&b&&Math.abs(a-b)>Math.max(10,b*.05))return -Infinity;
    let score=1000+(wantedArtist?300:0)+(exactArtist?80:0)+(album&&album===wantedAlbum?100:0)+(a&&b?60-Math.abs(a-b):0);
    return score;
  }
  function bestSongHit(rows,song){return(Array.isArray(rows)?rows:[]).map(item=>({item,score:scoreSongHit(item,song)})).filter(x=>Number.isFinite(x.score)).sort((a,b)=>b.score-a.score)[0]?.item||null;}
  function recordingTitle(song){
    return getSongTitle(song).normalize('NFKC').replace(/(?:\(([^()]+)\)|\[([^\[\]]+)\]|【([^【】]+)】)\s*$/g,(suffix,paren,square,corner)=>{
      const tag=(paren||square||corner).trim();
      return /^(?:完整版|正式版|官方版|音频版|官方音频|高清音质|无损音质)$/.test(tag)||lyricVersion({version:tag})?'':suffix;
    }).trim();
  }
  function recordingQueries(song){
    const title=getSongTitle(song),artist=getSongArtist(song);
    return [...new Set([`${title} ${artist}`.trim(),title,recordingTitle(song)].filter(Boolean))];
  }
  function scorePlaybackHit(item,song){
    const artist=getSongArtist(item),wantedArtist=getSongArtist(song),strict=scoreSongHit(item,song);
    if(wantedArtist&&Number.isFinite(strict))return strict;
    const title=songTitleKey({title:recordingTitle(item)}),wantedTitle=songTitleKey({title:recordingTitle(song)});
    if(!title||title!==wantedTitle)return -Infinity;
    const a=songDuration(item),b=songDuration(song),gap=a&&b?Math.abs(a-b):null;
    if(gap!==null&&gap>Math.max(10,b*.05))return -Infinity;
    const album=normalizeSongText(getSongAlbum(item)),sameAlbum=!!album&&album===normalizeSongText(getSongAlbum(song));
    const sameDuration=gap!==null&&gap<=Math.min(6,Math.max(3,b*.025));
    const version=lyricVersion(item),wantedVersion=lyricVersion(song);
    // A provider may omit a requested label. A conflicting or unsolicited version is a different recording.
    if(version!==wantedVersion&&(version||!sameAlbum&&!sameDuration))return -Infinity;
    if(wantedArtist&&artistParts(wantedArtist).length){
      if(!artistParts(artist).length||!artistMatches(artist,wantedArtist)&&!(sameDuration&&artistMatches(artist,wantedArtist,true)))return -Infinity;
    }else if(!sameAlbum||!sameDuration)return -Infinity;
    if(/cover|tribute|翻唱|致敬/i.test(artist)&&!artistMatches(artist,wantedArtist))return -Infinity;
    return 500+(version===wantedVersion?100:0)+(sameAlbum?40:0)+(sameDuration?30-gap:0);
  }
  function rankedPlaybackHits(rows,song,scoreHit=scorePlaybackHit){return rows.map(item=>({item,score:scoreHit(item,song)})).filter(hit=>Number.isFinite(hit.score)).sort((a,b)=>b.score-a.score);}
  // Share upstream cooldown, gateway recovery and request diagnostics across script reloads.
  const gdRate=ROOT.__SELENE_GD_RATE__||(ROOT.__SELENE_GD_RATE__={times:[],until:0,gatewayDown:0});
  const gdResponses=new Map(),gdRequests=new Map(),dataRequestControllers=new Set();let dataCacheGeneration=0;
  function gdDiagnostic(entry){
    const logs=ROOT.__SELENE_GD_DIAGNOSTICS__||(ROOT.__SELENE_GD_DIAGNOSTICS__=[]);
    logs.push({time:Date.now(),...entry});if(logs.length>80)logs.splice(0,logs.length-80);
  }
  async function gdJson(params,{fresh=false,nonce=''}={}){
    const url=new URL(GD_API);for(const [key,value] of Object.entries(params))url.searchParams.set(key,value);
    const key=url.href,cached=gdResponses.get(key),generation=dataCacheGeneration,temporary=params.types==='url',artwork=params.types==='pic';
    if(!temporary&&!fresh&&cached&&cached.until>Date.now())return cached.value;
    const requestKey=fresh?`${key}#fresh`:key;
    if(gdRequests.has(requestKey))return gdRequests.get(requestKey);
    if(artwork&&Date.now()<gdRate.until)return {url:''};
    if(fresh)url.searchParams.set('_selene',String(nonce||Date.now()));
    const pending=(async()=>{
      let status,body='',timedOut=false;
      const controller=new ROOT.AbortController(),timer=ROOT.setTimeout(()=>{timedOut=true;controller.abort();},12000);dataRequestControllers.add(controller);
      try{
        const response=await gdFetch(url,{signal:controller.signal,cache:'no-store',credentials:'omit'},!artwork);status=response.status;
        // Keep the actual error body, including non-JSON gateway responses.
        let value;
        if(typeof response.text==='function'){body=await response.text();if(response.ok)try{value=JSON.parse(body);}catch(cause){throw Object.assign(Error('GD 接口返回非 JSON 响应'),{kind:'invalid-response',cause});}}
        else if(response.ok)value=await response.json();
        if(!response.ok){
          const gateway=status>=500&&status<600;
          throw Object.assign(Error(`GD 请求失败：HTTP ${status}${gateway?'（上游服务暂时不可用，非本曲问题）':''}`),{kind:gateway?'gateway':'http'});
        }
        const message=value?.message||value?.msg||value?.error,code=Number(value?.code??value?.status);
        if(code===429||typeof message==='string'&&/^(?:限流)|(?:请求|访问|触发|已被)限流|请求过于频繁|too many requests|rate limit(?: exceeded| reached)|rate limited/i.test(message)){
          gdRate.until=Math.max(gdRate.until,Date.now()+30000);
          throw Object.assign(Error(`GD 音乐台返回限流：${message||code}`),{kind:'rate-limit',limitSource:'upstream',requestCount:gdRate.times.length,retryAt:gdRate.until});
        }
        if((code>=400||value?.error)&&!getResponseUrl(value))throw Object.assign(Error(`GD 接口错误：${message||code}`),{kind:'api',response:value});
        gdDiagnostic({params:{...params},fresh,status,kind:temporary&&!getResponseUrl(value)?'empty-url':'ok',body:body.slice(0,1600)});
        // Signed URLs and empty URL responses are never reused after this request settles.
        if(!temporary&&(!artwork||getResponseUrl(value))&&generation===dataCacheGeneration){
          gdResponses.set(key,{value,until:Date.now()+(artwork?600000:60000)});
        }
        while(gdResponses.size>100)gdResponses.delete(gdResponses.keys().next().value);return value;
      }catch(error){
        const kind=error.kind||(error.retryAt?'rate-limit':timedOut?'timeout':controller.signal.aborted||error.name==='AbortError'?'abort':'network');
        Object.assign(error,{kind,params:{...params},status:error.status??status,body:error.body||body.slice(0,1600),requestUrl:url.href});
        gdDiagnostic({params:{...params},fresh,status:error.status,kind,name:error.name,message:error.message,body:error.body,retryAt:error.retryAt,limitSource:error.limitSource,requestCount:error.requestCount});
        console.warn('[音乐播放器] GD 请求失败',error);throw error;
      }finally{ROOT.clearTimeout(timer);dataRequestControllers.delete(controller);if(gdRequests.get(requestKey)===pending)gdRequests.delete(requestKey);}
    })();gdRequests.set(requestKey,pending);return pending;
  }
  const GD_GATEWAY_RETRY_STATUSES=new Set([502,503,504]),GD_GATEWAY_RETRIES=3,GD_GATEWAY_WINDOW_MS=4000;
  const gdAbortReason=signal=>signal.reason??new DOMException('GD 请求已取消','AbortError');
  function waitForGdRetry(delay,signal){
    return new Promise((resolve,reject)=>{
      if(signal?.aborted){reject(gdAbortReason(signal));return;}
      const abort=()=>{ROOT.clearTimeout(timer);reject(gdAbortReason(signal));};
      const timer=ROOT.setTimeout(()=>{signal?.removeEventListener('abort',abort);resolve();},delay);
      signal?.addEventListener('abort',abort,{once:true});
    });
  }
  async function gdTransportFetch(url,options,retry){
    const {signal}=options;
    for(let attempt=0;;attempt++){
      if(signal?.aborted)throw gdAbortReason(signal);
      const now=Date.now();gdRate.times=gdRate.times.filter(time=>now-time<300000);
      if(now<gdRate.until){
        throw Object.assign(Error('GD 音乐台限流冷却中，请稍后再试'),{kind:'rate-limit',limitSource:'upstream',requestCount:gdRate.times.length,retryAt:gdRate.until});
      }
      gdRate.times.push(now);
      let response,fault;
      try{response=await fetch(url,options);}
      catch(error){
        if(signal?.aborted)throw gdAbortReason(signal);
        if(!(error instanceof TypeError)||error.kind||error.retryAt||error.name==='AbortError')throw error;
        fault=error;
      }
      if(response&&!GD_GATEWAY_RETRY_STATUSES.has(response.status)){
        if(response.status<500||response.status>=600)gdRate.gatewayDown=0;
        return response;
      }
      // Other requests get a single recovery probe while this request owns the backoff window.
      const failedAt=Date.now(),exhausted=attempt===GD_GATEWAY_RETRIES;
      if(!retry||exhausted||(!attempt&&failedAt<gdRate.gatewayDown)){
        if(exhausted)gdRate.gatewayDown=failedAt+GD_GATEWAY_WINDOW_MS;
        if(fault)throw Object.assign(fault,{gdTransportHandled:true});
        return response;
      }
      if(!attempt)gdRate.gatewayDown=failedAt+GD_GATEWAY_WINDOW_MS;
      void response?.body?.cancel().catch(()=>{});
      await waitForGdRetry(220*2**attempt+Math.round(Math.random()*140),signal);
    }
  }
  async function gdFetch(url,options={},retry=true){
    const response=await gdTransportFetch(url,options,retry);
    if(response.status===429){
      const retry=response.headers?.get('Retry-After'),seconds=Number(retry),receivedAt=Date.now();
      const until=retry&&Number.isFinite(seconds)?receivedAt+Math.max(0,seconds)*1000:Date.parse(retry)||receivedAt+300000;
      gdRate.until=Math.max(gdRate.until,until);
      const body=await response.text?.().catch(()=>'')||'';
      throw Object.assign(Error('GD 音乐台返回限流（HTTP 429），请稍后再试'),{kind:'rate-limit',limitSource:'upstream',requestCount:gdRate.times.length,status:429,body:body.slice(0,1600),retryAt:gdRate.until});
    }
    return response;
  }
  async function lyricJson(params,isActive=()=>true){
    const url=new URL(GD_API);for(const [key,value] of Object.entries(params))url.searchParams.set(key,value);
    const key=url.href,cached=lyricCache.get(key),generation=dataCacheGeneration;
    if(cached&&cached.until>Date.now()){if(cached.error)throw cached.error;return cached.value;}
    if(lyricRequests.has(key))return lyricRequests.get(key);
    if(!isActive()||disposed)return null;
    const pending=(async()=>{
      const controller=new ROOT.AbortController(),timer=ROOT.setTimeout(()=>controller.abort(),10000);dataRequestControllers.add(controller);
      try{
        const response=await gdFetch(url,{signal:controller.signal});if(!response.ok)throw Error(`歌词请求失败：${response.status}`);
        const value=await response.json(),payload=params.types==='lyric'?extractLyrics(value):null,positive=payload&&(payload.original||payload.translation);
        if(generation===dataCacheGeneration)lyricCache.set(key,{value,until:Date.now()+(positive?43200000:300000)});return value;
      }catch(error){if(generation===dataCacheGeneration)lyricCache.set(key,{error,until:Math.max(Date.now()+30000,error.retryAt||0)});throw error;}
      finally{ROOT.clearTimeout(timer);dataRequestControllers.delete(controller);if(lyricRequests.get(key)===pending)lyricRequests.delete(key);while(lyricCache.size>160)lyricCache.delete(lyricCache.keys().next().value);}
    })();lyricRequests.set(key,pending);return pending;
  }
  async function fetchLyricPayload(source,id,isActive){
    if(!source||!id||isVideoEntry({source}))return null;
    const data=await lyricJson({types:'lyric',source,id:String(id)},isActive);return{source,id,...extractLyrics(data)};
  }
  async function searchLyricRef(song,source,isActive){
    if(!song.title||!song.artist||!songDuration(song))return null;
    const data=await lyricJson({types:'search',source,name:`${song.title} ${song.artist}`,count:'10',pages:'1'},isActive),rows=Array.isArray(data)?data:(data?.data||[]);
    const hit=rows.map(item=>({item,score:scoreLyricHit(item,song)})).filter(x=>Number.isFinite(x.score)).sort((a,b)=>b.score-a.score)[0]?.item;
    return hit?{source,id:String(hit.lyric_id||hit.id||'')}:null;
  }
  function lastLyricTime(text){return parseLrcGroups(text).at(-1)?.time||0;}
  function lyricFitsAudio(text,duration=Number(audio?.duration)){
    const rows=parseLrcGroups(text);return !Number.isFinite(duration)||duration<=0||rows.every(row=>row.time<=duration+2);
  }
  function lyricTimelinesMatch(a,b){
    const first=parseLrcGroups(a).filter(row=>row.lines.length),second=parseLrcGroups(b).filter(row=>row.lines.length);
    if(!first.length||!second.length)return false;
    const matched=first.filter(row=>translationRowIndex(second,row.time)>=0).length;
    return matched/Math.max(first.length,second.length)>=.8;
  }
  function isInstrumental(text){return /(?:^|\n)(?:\[[^\]]*\])*\s*(?:纯音乐(?:[，,。·—\- ]*(?:请欣赏|敬请欣赏))?|此歌曲为没有填词的纯音乐|instrumental)\s*[。.!！]?\s*(?:$|\n)/i.test(String(text||''));}
  async function backupLyricRequest(url,text=false){
    const key=String(url),cached=lyricCache.get(key),generation=dataCacheGeneration;
    if(cached&&cached.until>Date.now()){if(cached.error)throw cached.error;return cached.value;}
    if(lyricRequests.has(key))return lyricRequests.get(key);
    const lrclib=new URL(key).hostname==='lrclib.net';
    if(lrclib&&Date.now()<(ROOT.__SELENE_LRCLIB_UNTIL__||0))throw Object.assign(Error('备用歌词服务暂时限流'),{retryAt:ROOT.__SELENE_LRCLIB_UNTIL__});
    const pending=(async()=>{
      const controller=new ROOT.AbortController(),timer=ROOT.setTimeout(()=>controller.abort(),8000);dataRequestControllers.add(controller);
      try{
        const response=await fetch(key,{credentials:'omit',signal:controller.signal,...(lrclib?{headers:{'Lrclib-Client':'Selene Music (https://github.com/soso454u/-)'}}:{})});
        if(response.status===429){if(lrclib)ROOT.__SELENE_LRCLIB_UNTIL__=Date.now()+Math.max(1,Number(response.headers?.get('Retry-After'))||60)*1000;throw Error('备用歌词服务暂时限流');}
        if(!response.ok)throw Error(`备用歌词请求失败：${response.status}`);
        const value=text?await response.text():await response.json();
        if(generation===dataCacheGeneration)lyricCache.set(key,{value,until:Date.now()+3600000});return value;
      }catch(error){if(generation===dataCacheGeneration)lyricCache.set(key,{error,until:Date.now()+60000});throw error;}
      finally{ROOT.clearTimeout(timer);dataRequestControllers.delete(controller);if(lyricRequests.get(key)===pending)lyricRequests.delete(key);}
    })();lyricRequests.set(key,pending);return pending;
  }
  async function metingLyrics(song,isActive){
    if(!isActive()||!song.title||!song.artist)return null;
    const source=song.gdSource||song.source,id=String(song.mediaId||'').replace(/^\w+:/,''),duration=songDuration(song);
    if(!['netease','tencent','kugou','kuwo'].includes(source)||!id)return null;
    for(const base of METING_METADATA_APIS){
      if(!isActive())return null;
      try{
        const rows=await coverSearch(metingSearchUrl(base,source,song));if(!isActive())return null;
        // Meting signs its lyric URLs. Use only a returned URL for this exact track.
        const endpoint=new URL(base);
        const url=rows.map(row=>getResponseUrl(row?.lrc)).find(link=>{
          if(!link)return false;
          try{
            const candidate=new URL(link),params=candidate.searchParams;
            return candidate.origin===endpoint.origin&&candidate.pathname===endpoint.pathname&&params.get('type')==='lrc'&&params.get('server')===source&&params.get('id')===id;
          }catch{return false;}
        });
        if(!url)continue;
        const raw=await backupLyricRequest(url,true);if(!isActive())return null;
        let payload={original:raw,translation:''};try{payload=extractLyrics(JSON.parse(raw));}catch{}
        if(isInstrumental(payload.original))return {source,id,original:'',translation:'',instrumental:true};
        if(parseLrcGroups(payload.original).length&&lyricFitsAudio(payload.original,duration)){
          return {source,id,original:payload.original,translation:lyricFitsAudio(payload.translation,duration)?payload.translation:''};
        }
      }catch(error){console.info('[音乐播放器] Meting 歌词暂不可用',error.message);}
    }
    return null;
  }
  async function independentLyrics(song,isActive=()=>true){
    if(!isActive()||!song.title||!song.artist)return null;
    const duration=songDuration(song);
    if(!isActive()||!duration)return null;
    try{
      const url=new URL('https://lrclib.net/api/search');url.searchParams.set('track_name',song.title);
      const data=await backupLyricRequest(url);if(!isActive())return null;
      const matches=(Array.isArray(data)?data:[]).map(row=>({row,score:scoreLyricHit({title:row.trackName,artist:row.artistName,album:row.albumName,duration:row.duration},song)})).filter(item=>Number.isFinite(item.score)).sort((a,b)=>b.score-a.score);
      for(const {row} of matches){
        if(row.instrumental)return {source:'lrclib',id:String(row.id),original:'',translation:'',instrumental:true};
        if(parseLrcGroups(row.syncedLyrics).length&&lyricFitsAudio(row.syncedLyrics,duration))return {source:'lrclib',id:String(row.id),original:row.syncedLyrics,translation:''};
      }
    }catch(error){console.info('[音乐播放器] 独立歌词搜索暂不可用',error.message);}
    return null;
  }
  async function resolveLyrics(song,isActive=()=>true){
    const primarySource=song.gdSource||song.source||'netease',primaryId=song.gdLyricId||song.lyricId||song.mediaId||String(song.id||'').replace(/^\w+:/,''),duration=songDuration(song);
    const empty={source:primarySource,id:primaryId,original:'',translation:''};if(!isActive())return empty;
    const preferred=await metingLyrics(song,isActive);
    if(!isActive())return empty;
    if(preferred)return preferred;
    let primary,error;
    try{primary=await fetchLyricPayload(primarySource,primaryId,isActive);}catch(failure){error=failure;}
    if(!isActive())return empty;
    if(isInstrumental(primary?.original))return {...empty,instrumental:true};
    let original=primary?.original&&lyricFitsAudio(primary.original,duration)?primary.original:'',translation=primary?.translation||'';
    if(primary?.original&&!original)translation='';
    if(original||translation){
      if(!lyricFitsAudio(translation,duration))translation='';
      if(original&&!translation&&primarySource!=='netease'&&isActive())try{
        const ref=await searchLyricRef(song,'netease',isActive);
        if(ref&&isActive()){const extra=await fetchLyricPayload(ref.source,ref.id,isActive);if(extra?.translation&&lyricTimelinesMatch(original,extra.original)&&lyricTimelinesMatch(original,extra.translation)&&lyricFitsAudio(extra.translation,duration))translation=extra.translation;}
      }catch(failure){console.info('[音乐播放器] 翻译暂不可补全，保留原文',failure.message);}
      return {...empty,original,translation};
    }
    // An error or rate limit must NOT fan out through the same GD quota.
    if(!error)for(const source of GD_SOURCES){
      if(!isActive())return empty;if(source===primarySource)continue;
      try{
        const ref=await searchLyricRef(song,source,isActive);if(!ref?.id||!isActive())continue;
        const fallback=await fetchLyricPayload(ref.source,ref.id,isActive);if(!isActive())return empty;
        if(isInstrumental(fallback?.original))return {...empty,instrumental:true};
        if(fallback?.original&&lyricFitsAudio(fallback.original,duration))return {source:ref.source,id:ref.id,original:fallback.original,translation:lyricFitsAudio(fallback.translation,duration)?fallback.translation:''};
      }catch(failure){error=failure;break;}
    }
    const backup=await independentLyrics(song,isActive);if(!isActive())return empty;if(backup)return backup;if(error)throw error;return empty;
  }
  function activeLyricIndex(now){let low=0,high=lyricTimeline.length-1,index=-1;while(low<=high){const mid=(low+high)>>1;if(lyricTimeline[mid].time<=now){index=mid;low=mid+1;}else high=mid-1;}return index;}
  function renderImmersiveLyrics(index,force=false){
    const box=DOC.querySelector(`#${ID} .immersive-lyric`);if(!box)return;
    if(box._timeline!==lyricTimeline){
      box._timeline=lyricTimeline;box._active=-2;box.replaceChildren();
      for(const [i,row] of lyricTimeline.entries()){
        const button=DOC.createElement('button');button.type='button';button.className='immersive-line';button.dataset.lyricIndex=String(i);button.setAttribute('aria-label',`跳转到 ${clock(row.time)}`);
        for(const [n,line] of row.lines.entries()){const span=DOC.createElement('span');span.className=n?'lyric-translation':'lyric-original';span.textContent=line;button.appendChild(span);}
        if(!row.lines.length)button.textContent='♪';box.appendChild(button);
      }
    }
    if(!lyricTimeline.length&&box.textContent!==lyricState)box.textContent=lyricState;
    const player=DOC.getElementById(ID);if(!player?.classList.contains('immersive')){box._active=-2;return;}
    if(box._active===index&&!force)return;box._active=index;
    box.style.setProperty('--lyric-edge',`${Math.max(0,box.clientHeight/2-22)}px`);
    [...box.children].forEach((row,i)=>{row.classList.toggle('active',i===index);row.classList.toggle('near',Math.abs(i-index)===1);if(i===index)row.setAttribute('aria-current','true');else row.removeAttribute('aria-current');});
    const row=box.children[Math.max(0,index)];if(row)box.scrollTo({top:row.offsetTop-box.clientHeight/2+row.offsetHeight/2,behavior:ROOT.matchMedia?.('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  }
  function paintTime(){
    const el=DOC.getElementById(ID);if(!el)return;
    const preparing=audioPriming||pendingPlaybackSelection,duration=preparing?songDuration(current):audio.duration,now=preparing?0:audio.currentTime,usableDuration=Number.isFinite(duration)&&duration>0,progress=el.querySelector('.progress');
    if(!progressSeeking)progress.value=usableDuration?Math.round(now/duration*1000):0;
    progress.style.setProperty('--range-fill',`${Math.max(0,Math.min(100,Number(progress.value)/10))}%`);
    const shownNow=progressSeeking&&usableDuration?duration*pendingProgressValue/1000:now;
    el.querySelector('.time').textContent=`${clock(shownNow)} / ${clock(usableDuration?duration:0)}`;
    const index=activeLyricIndex(now),active=lyricTimeline[index],words=audio.ended?'':active?.lines?.filter(Boolean).join('\n')||'';
    currentLyricWords=words;el.querySelector('.lyrics').textContent=words||(lyricTimeline.length?'♪':lyricState);renderImmersiveLyrics(audio.ended?-1:index);renderDesktopLyrics(words);maybeMidSongCompanion();const companionLine=DOC.querySelector(`#${ID}-companion .companion-song`);if(companionLine){const song=companionSongContext();companionLine.textContent=`♫ ${song.song}${song.lyric?` · ${song.lyric}`:''}`;}
    updateMediaPosition();
  }
  const mediaText = code => ({1:'MEDIA_ERR_ABORTED：音频加载被中止',2:'MEDIA_ERR_NETWORK：加载音频时发生网络错误',3:'MEDIA_ERR_DECODE：浏览器无法解码音频',4:'MEDIA_ERR_SRC_NOT_SUPPORTED：音频地址或格式不受支持'})[code] || '未知音频错误';
  const isNotAllowed = error => error?.name === 'NotAllowedError';
  function getResponseUrl(data,depth=0){
    if(depth>4||!data)return '';
    if(typeof data==='string'){const url=data.trim().replace(/&amp;/g,'&');return url.startsWith('//')?`https:${url}`:/^https?:\/\//i.test(url)?url:'';}
    if(Array.isArray(data)){for(const value of data){const url=getResponseUrl(value,depth+1);if(url)return url;}return '';}
    return getResponseUrl(data.url,depth+1)||getResponseUrl(data.data,depth+1)||getResponseUrl(data.pic,depth+1);
  }
  function sourceBitrates(source){
    if(source==='joox')return ['320','192','128','740','999'];
    return ['320','128'];
  }
  function playbackSourceChoice(song){
    const source=playbackSources.get(song)??(song.source==='tencent'&&song.lxSearch?'lx-tencent':'auto');
    return source.startsWith('lx-')&&!settings.lxMusicEnabled?'auto':source;
  }
  function playbackSourceOrder(selected='auto'){
    return GD_SOURCES.includes(selected)?[selected]:GD_SOURCES;
  }

  async function gdCover(s,isActive=()=>true){
    try{
      if(s.cover&&/^https?:\/\//i.test(s.cover))return s.cover;
      const source=s.source||'netease',id=String(s.coverId||'').trim();if(!id)return '';
      // An ongoing song selection gets the GD connection before background artwork.
      while(!disposed&&isActive()){
        const startup=pendingPlay;
        if(!playbackWanted||!pendingPlaybackSelection||startup?.request!==playRequest||!startup.promise){
          return getResponseUrl(await gdJson({types:'pic',source,id,size:'500'}));
        }
        await startup.promise.catch(()=>{});
      }
      return '';
    }catch(error){console.warn('[音乐播放器] GD 封面获取失败',error);return '';}
  }
  function primeAudioFromGesture(){
    if(!ROOT.navigator?.userActivation?.isActive||disposed)return;
    // Grant loading/playback on this element in the gesture, using a SHORT local PCM clip.
    // The ten-hour background keepalive must never be assigned to the main player.
    if(!audioPrimeUrl){
      const samples=4410,buffer=new ArrayBuffer(44+samples*2),view=new DataView(buffer),write=(offset,text)=>{for(let i=0;i<text.length;i++)view.setUint8(offset+i,text.charCodeAt(i));};
      write(0,'RIFF');view.setUint32(4,36+samples*2,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,44100,true);view.setUint32(28,88200,true);view.setUint16(32,2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,samples*2,true);
      audioPrimeUrl=ROOT.URL.createObjectURL(new ROOT.Blob([buffer],{type:'audio/wav'}));
    }
    audioPriming=true;playbackPhase='loading';audio.muted=false;audio.src=audioPrimeUrl;
    try{audio.load();audio.play()?.catch(()=>{});}catch{}
  }
  function clearFailedPlayback(){
    cancelPlaybackProbe?.();audioPriming=false;pendingPlaybackSelection=true;playbackWanted=false;playbackPhase='idle';
    try{audio.pause();audio.removeAttribute('src');audio.load();}catch{}releaseOfflineObjectUrl();
    lyricState='尚未开始播放';updatePlayButton();paintTime();clearMediaPosition();
  }
  function recoverStuckPlayback(error,url){
    if(disposed||!playbackWanted||!current)return;
    failedPlaybackUrls.add(url);
    if(playbackRecoveryCount++<1){setStatus('音源持续无进度，正在切换备用源…');void play(current,true);}
    else{clearFailedPlayback();const detail=mediaDetail(error);setStatus(detail,true);toast('warning',detail);}
  }
  function playUrl(url,label='音源',isolated=false,{resume=false,isActive=()=>true,expectedDuration=0,blobRetry=true}={}){
    if(!isolated)cancelPlaybackProbe?.();
    const pending=new Promise((resolve,reject)=>{
      const player=isolated?new ROOT.Audio():audio;
      if(!isolated){releaseOfflineObjectUrl(url);audioPriming=false;playbackPhase='loading';updatePlayButton();}
      let settled=false,closed=false,lastTime=resume?Number(player.currentTime)||0:0,lastProgress=Date.now(),evidence=0,progressSamples=0,seeking=false,timer=0;
      const state=()=>({currentSrc:player.currentSrc,code:player.error?.code,message:player.error?.message,networkState:player.networkState,readyState:player.readyState,currentTime:player.currentTime});
      const close=()=>{if(closed)return;closed=true;ROOT.clearInterval(timer);events.forEach(([name,handler])=>player.removeEventListener(name,handler));DOC.removeEventListener('visibilitychange',visibility);if(!isolated&&cancelPlaybackProbe===cancel)cancelPlaybackProbe=null;};
      const cancel=()=>{close();if(!settled){settled=true;reject(Object.assign(Error('播放已取消'),{name:'AbortError'}));}};
      const fail=error=>{
        if(closed)return;const started=settled;close();
        if(!isolated){if(!isNotAllowed(error)&&error.name!=='AbortError')failedPlaybackUrls.add(url);playbackPhase='idle';}
        if(!started){settled=true;reject(error);}else if(!isolated)recoverStuckPlayback(error,url);
      };
      const sample=()=>{
        if(closed)return;if(!isActive()){cancel();return;}
        const now=Date.now(),time=Number(player.currentTime),duration=Number(player.duration);
        if(expectedDuration>0&&Number.isFinite(duration)&&duration>0&&Math.abs(duration-expectedDuration)>Math.max(10,expectedDuration*.05)){fail(Error('音源时长与匹配歌曲不符，可能为试听或其他版本'));return;}
        if(player.ended){ended();return;}
        if(player.seeking||seeking){lastTime=time;lastProgress=now;return;}
        if(player.paused){lastTime=time;if(settled){lastProgress=now;return;}}
        const delta=time-lastTime;
        // Seeks and a single synthetic timeupdate are not proof of decoded playback.
        if(!player.paused&&Number.isFinite(delta)&&delta>0&&delta<=2){
          evidence+=delta;progressSamples++;lastProgress=now;
          if(evidence>=.2&&progressSamples>=2){
            if(!isolated&&playbackPhase!=='playing'){playbackPhase='playing';companionListeningAwaitingPlay=false;updatePlayButton();setStatus('正在播放');}
            if(!settled){settled=true;console.info('[音乐播放器]',label,'时间已推进',state());resolve();}
          }
        }else if(delta<0||delta>2){evidence=0;progressSamples=0;}
        lastTime=time;
        // Allow transient waiting/stalled; hidden-page timer throttling must not trigger fallback.
        if(DOC.visibilityState==='hidden'){lastProgress=now;return;}
        if(now-lastProgress>=20000){const error=Error('音源持续 20 秒无播放进度');error.media=state();fail(error);}
      };
      const buffering=()=>{if(!isolated){playbackPhase='loading';evidence=0;progressSamples=0;updatePlayButton();setStatus('音频缓冲中…');}};
      const bad=()=>{if(!player.error)return;const error=Error(mediaText(player.error?.code));error.media=state();fail(error);};
      const ended=()=>{if(!settled)fail(Error('音源未开始播放即结束'));else close();};
      const events=[['timeupdate',sample],['waiting',buffering],['stalled',buffering],['error',bad],['seeking',()=>{seeking=true;evidence=0;progressSamples=0;}],['seeked',()=>{seeking=false;lastTime=Number(player.currentTime);lastProgress=Date.now();}],['ended',ended]];
      const visibility=()=>{lastProgress=Date.now();lastTime=Number(player.currentTime);};
      DOC.addEventListener('visibilitychange',visibility);events.forEach(([name,handler])=>player.addEventListener(name,handler));
      timer=ROOT.setInterval(sample,250);if(!isolated)cancelPlaybackProbe=cancel;
      player.preload='auto';player.muted=false;
      try{if(!resume)player.src=url;player.play()?.catch(error=>{if(error.name==='AbortError'&&!isActive())cancel();else fail(error);});}
      catch(error){fail(error);}
    });
    return pending.catch(async error=>{
      const agent=ROOT.navigator?.userAgent||'',safari=/Safari/i.test(agent)&&!/Chrome|Chromium|Edg|CriOS|FxiOS/i.test(agent);
      if(!blobRetry||isolated||resume||!safari||playbackBlobRetryUsed||isNotAllowed(error)||error.name==='AbortError'||!isActive()||!/^https?:\/\//i.test(url)||![2,4,undefined].includes(error.media?.code)||!error.media&&!/无播放进度|network|load|not.supported/i.test(error.message))throw error;
      playbackBlobRetryUsed=true;setStatus('正在尝试 Safari 兼容播放…');
      try{
        const blob=await fetchCacheBlob({audio:url},20000);if(!isActive())throw Object.assign(Error('播放已取消'),{name:'AbortError'});
        const objectUrl=ROOT.URL.createObjectURL(blob);releaseOfflineObjectUrl();currentCacheObjectUrl=objectUrl;
        await playUrl(objectUrl,label,false,{isActive,expectedDuration,blobRetry:false});
      }catch(fallbackError){if(isNotAllowed(fallbackError)||!isActive()&&fallbackError.name==='AbortError')throw fallbackError;throw error;}
    });
  }
  async function resolveGdSourceTracks(s,source,allBitrates=true,{fresh=false,nonce='',bitrate='320',excludeIds=new Set(),isActive=()=>true,transportRetry=null}={}){
    let hit=s.source===source&&s.mediaId&&s.gdSource===source&&!excludeIds.has(String(s.mediaId))?s:null;
    if(!hit){
      let best=-Infinity;
      for(const name of recordingQueries(s)){
        if(!isActive())return [];
        let data;try{data=await gdJson({types:'search',source,name,count:'20',pages:'1'});}catch(error){if(hit&&!error.retryAt)break;throw error;}
        const rows=Array.isArray(data)?data:(data?.data||[]);
        if(!Array.isArray(rows))throw Object.assign(Error('GD 搜索返回异常数据'),{kind:'invalid-response',response:data});
        const candidate=rankedPlaybackHits(rows.filter(row=>{const id=String(row?.mediaId??row?.id??'');return id&&!excludeIds.has(id);}),s)[0];
        if(candidate?.score>best){hit=candidate.item;best=candidate.score;}
        if(best>=1000)break;
      }
    }
    if(!hit){const empty=[];empty.reason='no-match';return empty;}
    const identity=gdSong(source,hit),tracks=[];tracks.reason='empty-url';tracks.identity=identity;
    for(const br of allBitrates?sourceBitrates(source):[bitrate]){
      if(!isActive())return [];
      const params={types:'url',source,id:identity.mediaId,br};
      let info,refreshed=fresh;
      try{
        info=await gdJson(params,{fresh,nonce});
      }catch(error){
        const transient=error.kind==='timeout'||error.kind==='network'&&!error.gdTransportHandled;
        if(!isActive()||!transportRetry?.available||!transient||error.retryAt)throw error;
        // Keep the exact matched ID and quality for faults outside the transport retry policy.
        transportRetry.available=false;
        refreshed=true;
        info=await gdJson(params,{fresh:true});
      }
      const url=getResponseUrl(info);
      if(!/^https?:\/\//i.test(String(url||''))){const detail=info?.message||info?.msg||info?.error;if(typeof detail==='string')tracks.responseMessage=detail.slice(0,100);continue;}
      tracks.push({...s,...identity,audio:url,bitrate:String(info?.br||br),requestedBitrate:br,refreshed:!!refreshed});
      break;
    }
    return tracks;
  }
  async function resolveGdSourceTrack(s,source){return(await resolveGdSourceTracks(s,source,false))[0]||null;}
  async function resolveGdTrack(s){for(const source of GD_SOURCES){const resolved=await resolveGdSourceTrack(s,source);if(resolved)return resolved;}return null;}
  async function gdFallback(s,attempt=0,isActive=()=>true,excluded=new Set(),sources=GD_SOURCES,onSource=()=>{}){
    const tried=new Set(excluded),failures=new Map();
    const note=(source,reason,priority=0,evidence={})=>{
      let detail=failures.get(source);if(!detail){detail={source,reason,priority,attempts:[]};failures.set(source,detail);}
      if(priority>detail.priority)Object.assign(detail,{reason,priority});detail.attempts.push(evidence);
    };
    const failure=error=>{
      const details=[...failures.values()],message=details.map(item=>`${GD_SOURCE_LABELS[item.source]||item.source}：${item.reason}`).join('；');
      return Object.assign(Error(message||error?.message||'没有找到可播放音源'),{failures:details,...(error?.retryAt?{retryAt:error.retryAt,limitSource:error.limitSource}:{})});
    };
    for(const source of sources){
      if(!isActive())return null;onSource(source);
      const excludeIds=new Set(),transportRetry=source==='joox'?{available:true}:null;
      let refreshed=false;
      // Keep the selected record and up to two strictly matched alternates.
      for(let candidate=0;candidate<3;candidate++){
        let identity=null,noMatch=false,target=s,refreshable=false;
        const bitrates=candidate===0||source==='joox'?sourceBitrates(source):['320'];
        const preferred=candidate===0&&s.source===source?(s.requestedBitrate||s.bitrate):'';
        const preferredIndex=bitrates.indexOf(preferred);
        if(preferredIndex>0)bitrates.unshift(...bitrates.splice(preferredIndex,1));
        const qualities=bitrates.map(bitrate=>({bitrate,fresh:false}));
        for(let index=0;index<qualities.length;index++){
          const {bitrate,fresh}=qualities[index];
          if(!isActive())return null;
          let tracks;
          try{tracks=await resolveGdSourceTracks(target,source,false,{bitrate,fresh,excludeIds,isActive,transportRetry});}
          catch(error){note(source,String(error.message||'请求失败').slice(0,100),error.retryAt?4:2,{kind:error.kind||'request',bitrate,fresh,error});if(error.retryAt)throw failure(error);noMatch=true;break;}
          if(!isActive())return null;
          identity=tracks.identity||identity;
          if(identity)target={...s,...identity};
          if(!tracks.length){
            if(tracks.reason==='no-match'){note(source,'未找到同一录音的可用候选',0,{kind:'no-match'});noMatch=true;break;}
            note(source,tracks.responseMessage?`取播放地址失败：${tracks.responseMessage}`:'接口未返回播放地址',1,{kind:'empty-url',id:identity?.mediaId,bitrate,fresh,message:tracks.responseMessage});refreshable=true;
          }
          for(const track of tracks){
            if(!track.audio||tried.has(track.audio))continue;
            tried.add(track.audio);
            try{await playUrl(track.audio,`${GD_SOURCE_LABELS[source]||source}音源`,false,{isActive,expectedDuration:songDuration(s)||songDuration(track)});return isActive()?{...track,offline:false}:null;}
            catch(error){
              if(isNotAllowed(error)){error.track=track;throw error;}if(error.name==='AbortError')throw error;
              const evidence={kind:'media',id:track.mediaId,bitrate,fresh,url:track.audio,media:error.media,error};
              note(source,String(error.message||'音频无法播放').slice(0,100),3,evidence);console.warn('[音乐播放器] 音源候选失败',evidence);
              // A network/unsupported URL may have expired; the media element cannot prove expiry.
              if([2,4].includes(error.media?.code)||/无播放进度|network|load failed/i.test(error.message)){
                refreshable=true;
              }
            }
          }
          const refreshBitrate=source==='joox'&&refreshable?bitrates[0]:'';
          if(refreshBitrate&&candidate===0&&index===qualities.length-1&&identity?.mediaId&&!refreshed){refreshed=true;qualities.push({bitrate:refreshBitrate,fresh:true});}
        }
        if(noMatch||!identity?.mediaId)break;excludeIds.add(String(identity.mediaId));
      }
    }
    if(failures.size)throw failure();return null;
  }
  async function gdMetadata(s){return{...s,gdSource:s.gdSource||s.source,gdLyricId:s.gdLyricId||s.lyricId||s.mediaId};}

  function metingSearchUrl(base,source,song){
    const url=new URL(base);
    url.searchParams.set('server',source);
    url.searchParams.set('type','search');
    url.searchParams.set('id',`${song.title} ${song.artist||''}`.trim());
    return url;
  }
  function qqSongMid(...values){
    return values.find(value=>typeof value==='string'&&LX_SOURCES.tencent.id.test(value))||'';
  }
  function metingLinkId(value,base,platform,type){
    try{
      const url=new URL(value,base);
      if(url.origin===base.origin&&url.pathname===base.pathname&&url.searchParams.get('server')===platform&&url.searchParams.get('type')===type)return url.searchParams.get('id')||'';
    }catch{}
    return '';
  }
  function metingPlaybackId(row,search,platform){
    const id=metingLinkId(row?.url,search,platform,'url');
    if(platform==='tencent')return qqSongMid(row?.songmid,row?.songMid,row?.mid,id,row?.mediaId);
    return LX_SOURCES[platform].id.test(id)?id:'';
  }
  async function searchMetingSource(platform,word,{bases=METING_METADATA_APIS,limit=20,isActive=()=>true}={}){
    let failure,empty=false;
    for(const base of bases){
      if(!isActive())return [];
      const search=metingSearchUrl(base,platform,{title:word});
      try{
        const {response,data}=await requestLxJson(search,8000);
        if(!response.ok)throw Error(`HTTP ${response.status}`);
        const rows=Array.isArray(data)?data:data?.data;
        if(!Array.isArray(rows))throw Error('接口响应格式异常');
        if(!rows.length){empty=true;continue;}
        const tracks=new Map();
        for(const row of rows){
          const mediaId=metingPlaybackId(row,search,platform),title=getSongTitle(row);
          if(!mediaId||!title||tracks.has(mediaId))continue;
          tracks.set(mediaId,{
            id:`${platform}:${mediaId}`,mediaId,title,artist:getSongArtist(row),source:platform,
            album:getSongAlbum(row),version:String(row.version||''),duration:songDuration(row),
            cover:getResponseUrl(row.pic||row.cover),lyricId:mediaId,audio:'',lxSearch:true,
          });
          if(tracks.size===limit)break;
        }
        if(tracks.size)return [...tracks.values()];
        throw Error('接口未返回有效的歌曲 ID');
      }catch(error){failure=error;}
    }
    if(empty)return [];
    throw Error(`${GD_SOURCE_LABELS[platform]||platform}音乐搜索暂不可用（${failure?.message||'网络错误'}）`);
  }
  async function coverSearch(url){
    const key=String(url),cached=coverResponses.get(key),generation=dataCacheGeneration;
    if(cached&&cached.until>Date.now())return cached.rows;if(coverRequests.has(key))return coverRequests.get(key);
    const pending=(async()=>{
      const controller=new ROOT.AbortController(),timer=ROOT.setTimeout(()=>controller.abort(),8000);dataRequestControllers.add(controller);
      try{const response=await fetch(url,{signal:controller.signal,cache:'no-store',credentials:'omit'});if(!response.ok)throw Error(`HTTP ${response.status}`);const data=await response.json(),rows=Array.isArray(data)?data:Array.isArray(data?.data)?data.data:[];if(generation===dataCacheGeneration)coverResponses.set(key,{rows,until:Date.now()+(rows.length?300000:30000)});while(coverResponses.size>80)coverResponses.delete(coverResponses.keys().next().value);return rows;}
      catch(error){if(generation===dataCacheGeneration&&error.name!=='AbortError')coverResponses.set(key,{rows:[],until:Date.now()+30000});return [];}
      finally{ROOT.clearTimeout(timer);dataRequestControllers.delete(controller);if(coverRequests.get(key)===pending)coverRequests.delete(key);}
    })();coverRequests.set(key,pending);return pending;
  }
  async function metingCover(s,excluded=[]){
    const blocked=new Set(excluded.filter(Boolean).map(url=>String(url).replace(/#.*$/,'')));
    for(const base of METING_METADATA_APIS){
      const rows=await coverSearch(metingSearchUrl(base,'netease',s)),album=normalizeSongText(getSongAlbum(s));
      const candidates=rows.filter(row=>!album||!getSongAlbum(row)||normalizeSongText(getSongAlbum(row))===album).map(row=>({row,score:scoreSongHit(row,s)})).filter(hit=>Number.isFinite(hit.score)).sort((a,b)=>b.score-a.score);
      for(const {row} of candidates.slice(0,2)){const pic=getResponseUrl(row.pic||row.cover||row.picUrl||row.album?.picUrl);if(pic&&!blocked.has(pic.replace(/#.*$/,''))&&await imageLoads(pic))return pic;}
    }return '';
  }
  function imageLoads(url,timeout=8000){return new Promise(resolve=>{if(!/^https?:\/\//i.test(String(url||'')))return resolve(false);const image=new ROOT.Image();let done=false;const finish=ok=>{if(done)return;done=true;ROOT.clearTimeout(timer);image.onload=null;image.onerror=null;resolve(ok);};const timer=ROOT.setTimeout(()=>finish(false),timeout);image.onload=()=>finish(true);image.onerror=()=>finish(false);image.src=url;});}
  async function resolveCover(s,excluded=[],isActive=()=>true){
    if(isVideoEntry(s))return '';
    const blocked=new Set(excluded.filter(Boolean).map(value=>String(value).replace(/#.*$/,''))),usable=async url=>url&&!blocked.has(String(url).replace(/#.*$/,''))&&await imageLoads(url);
    if(await usable(s.cover))return s.cover;
    const preferred=await metingCover(s,[...blocked,s.cover]);if(preferred)return preferred;
    const cover=await gdCover({...s,cover:''},isActive);
    return await usable(cover)?cover:'';
  }
  async function applyCurrentCover(s,request){const source=s.source,id=s.mediaId,pic=await resolveCover({...s});if(request!==playRequest||current!==s||s.source!==source||s.mediaId!==id||!pic)return;s.cover=pic;syncResultCover(s);show(s);if(settings.favorites?.includes(s))save();}
  async function hydrateSavedCovers(rows,heading='',kind='fav'){if(!Array.isArray(rows)||rows._coverHydrating)return;rows._coverHydrating=true;try{for(const song of rows.slice(0,12)){if(song.source==='direct'||isVideoEntry(song)||song.cover)continue;const source=song.source,id=song.mediaId,cover=await resolveCover({...song});if(song.source===source&&song.mediaId===id&&!song.cover)song.cover=cover;}if(kind==='fav')save();}finally{rows._coverHydrating=false;}if(kind==='fav')render(rows,heading,kind,false);}
  async function loadLyrics(s,request){
    const isActive=()=>!disposed&&request===playRequest&&current===s;if(!isActive())return;
    lyricTimeline=[];currentLyricWords='';lyricState='加载歌词…';paintTime();
    const song={...s,duration:Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:songDuration(s)};
    try{
      const resolved=await resolveLyrics(song,isActive);if(!isActive())return;
      lyricTimeline=mergeLyricTimeline(resolved.original,resolved.translation);
      lyricState=resolved.instrumental?'纯音乐 · 请欣赏':lyricTimeline.length?'':'暂无歌词';
    }catch(error){if(!isActive())return;lyricState=error.retryAt?'歌词请求限流，请稍后再试':'歌词暂时加载失败';console.warn('[音乐播放器] 歌词加载失败',error);}
    paintTime();
  }
  // Huibq's public LX Music source: https://github.com/Huibq/keep-alive/blob/master/render_api.js
  const LX_SOURCES={tencent:{code:'tx',id:/^(?=[a-z0-9]*[a-z])[a-z0-9]{14}$/i},netease:{code:'wy',id:/^\d{1,20}$/},kugou:{code:'kg',id:/^[a-f0-9]{32}$/i}};
  const LX_URL_API='https://selene-lx-worker.soivt44.workers.dev/api/lx/url';
  const lxSourceLabel=platform=>`LX Music · ${GD_SOURCE_LABELS[platform]}`;
  const playbackLabel=song=>song.offline?'离线缓存':audio.dataset?.seleneLxSource||(song.customAudio?'手动音源':GD_SOURCE_LABELS[song.source]||'自动');
  let lxCooldown=null;
  function checkLxCooldown(){
    if(lxCooldown?.retryAt>Date.now()){
      const {message,...details}=lxCooldown;
      throw Object.assign(Error(`${message}（冷却中）`),details);
    }
  }
  function lxRetryDeadline(data,headers,now){
    const timestamp=Number(data?.retryAt);
    const deadline=timestamp<1e12?timestamp*1000:timestamp;
    if(Number.isSafeInteger(deadline)&&deadline>now)return deadline;
    const header=headers.get('Retry-After')?.trim();
    if(!header)return 0;
    if(/^\d+$/.test(header)){
      const retryAt=now+Number(header)*1000;
      return Number.isSafeInteger(retryAt)&&retryAt>now?retryAt:0;
    }
    const headerDate=/[a-z]/i.test(header)?Date.parse(header):NaN;
    return headerDate>now?headerDate:0;
  }
  async function requestLxJson(url,timeout=12000){
    const controller=new ROOT.AbortController();
    let timedOut=false;
    const timer=ROOT.setTimeout(()=>{timedOut=true;controller.abort();},timeout);
    dataRequestControllers.add(controller);
    try{
      const response=await fetch(url,{method:'GET',cache:'no-store',credentials:'omit',signal:controller.signal});
      const data=await response.json().catch(error=>{if(controller.signal.aborted)throw error;return null;});
      return {response,data};
    }catch(error){
      if(timedOut)throw Error('LX Music 请求超时');
      if(controller.signal.aborted)throw error;
      throw Error('LX Music 网络请求失败',{cause:error});
    }finally{ROOT.clearTimeout(timer);dataRequestControllers.delete(controller);}
  }
  function knownLxSongId(song,platform){
    if(platform==='tencent'){
      const verified=qqSongMid(song.qqMid);
      if(verified||song.source!=='tencent')return verified;
      const savedIds=METING_METADATA_APIS.map(base=>metingLinkId(song.audio,new URL(base),'tencent','url'));
      const originalId=String(song.id||'').match(/^tencent:([^:]+)(?::|$)/)?.[1];
      return qqSongMid(song.songmid,song.songMid,song.mid,...savedIds,song.mediaId,originalId===song.title?'':originalId);
    }
    const pattern=LX_SOURCES[platform].id;
    const key=`${platform}:${song.mediaId}`;
    return song.source===platform&&pattern.test(song.mediaId)&&(song.gdSource===platform||song.id===key||String(song.id||'').startsWith(`${key}:`))?String(song.mediaId):'';
  }
  function scoreQqPlaylistHit(item,song){
    const artist=getSongArtist(song);
    if(!artistParts(artist).length||!artistMatches(getSongArtist(item),artist)||lyricVersion(item)!==lyricVersion(song)||
      normalizeSongText(recordingTitle(item))!==normalizeSongText(recordingTitle(song)))return -Infinity;
    const version=normalizeSongText(song.version),foundVersion=normalizeSongText(item.version);
    if(version!==foundVersion&&(version&&!lyricVersion({version:song.version})||foundVersion&&!lyricVersion({version:item.version})))return -Infinity;
    const coverId=track=>METING_METADATA_APIS.map(base=>metingLinkId(track.cover,new URL(base),'tencent','pic')).find(Boolean);
    const wantedCover=coverId(song),foundCover=coverId(item);
    if(wantedCover&&foundCover&&wantedCover!==foundCover)return -Infinity;
    return scorePlaybackHit(item,song)+(wantedCover&&wantedCover===foundCover?250:0);
  }
  async function findLxSongId(song,platform,isActive=()=>true,excludedId=''){
    const known=knownLxSongId(song,platform);if(known&&known!==excludedId)return known;
    if(!getSongTitle(song))throw Error('LX Music 匹配需要歌曲名');
    const qqPlaylist=platform==='tencent'&&song.source==='tencent'&&!song.lxSearch;
    // The public provider preserves QQ's version suffixes when the other provider omits them.
    const bases=qqPlaylist?METING_COVER_APIS:platform==='tencent'?METING_METADATA_APIS:[SELENE_METING_API];
    let match,ambiguousScore=-Infinity;
    for(const query of recordingQueries(song)){
      if(!isActive())return '';
      let rows;try{rows=await searchMetingSource(platform,query,{bases,limit:30,isActive});}catch(error){if(match)break;throw error;}
      const ranked=rankedPlaybackHits(rows,song,qqPlaylist?scoreQqPlaylistHit:scorePlaybackHit);
      const [candidate,next]=ranked.filter(hit=>hit.item.mediaId!==excludedId);
      const excluded=excludedId&&ranked.find(hit=>hit.item.mediaId===excludedId);
      if(qqPlaylist&&candidate&&(candidate.score===next?.score||excluded&&excluded.score>=candidate.score)){
        ambiguousScore=Math.max(ambiguousScore,candidate.score);
        continue;
      }
      if(candidate&&(!match||candidate.score>match.score))match=candidate;
      if(match?.score>=1000&&match.score>ambiguousScore)break;
    }
    if(!match||match.score<=ambiguousScore)throw Error('LX Music 未找到同一录音的可用平台 ID');
    return match.item.mediaId;
  }
  async function playLxSongId(song,platform,songId,isActive){
    if(!isActive())return null;
    const source=LX_SOURCES[platform].code,label=lxSourceLabel(platform);
    for(const quality of ['128k','320k']){
      if(!isActive())return null;
      checkLxCooldown();
      const request=new URL(LX_URL_API);
      request.search=new URLSearchParams({source,id:songId,quality});
      const {response,data}=await requestLxJson(request);
      const code=typeof data?.code==='string'&&/^\d+$/.test(data.code)?Number(data.code):data?.code;
      const blocked=code===1||data?.error==='blocked';
      if(blocked||response.status===429||code===5||code===429){
        let message='LX Music 请求限流（来源未确认）';
        let limitSource='unknown';
        if(blocked){message='LX Music 上游阻断了请求 IP';limitSource='upstream';}
        else if(code===5||data?.msg==='Upstream HTTP 429'){message='LX Music 上游限流';limitSource='upstream';}
        else if(code===429&&data?.msg==='Too many requests'){message='Selene 的 LX 转发服务限流';limitSource='worker';}
        const now=Date.now(),retryAt=lxRetryDeadline(data,response.headers,now);
        const details={limitSource,kind:blocked?'lx-blocked':'lx-rate-limit',status:response.status,code};
        if(retryAt&&(!lxCooldown||retryAt>=lxCooldown.retryAt))lxCooldown={message,...details,retryAt};
        const activeDeadline=lxCooldown?.retryAt>now?lxCooldown.retryAt:0;
        throw Object.assign(Error(message),details,{retryAt:activeDeadline});
      }
      if(!isActive())return null;
      if([408,504].includes(response.status)||data?.msg==='Upstream timeout')throw Error('LX Music 取址超时');
      if(code===2||(response.ok||response.status===422)&&['unavailable','expired'].includes(data?.error))continue;
      if(!response.ok)throw Error(`LX Music 取址失败（HTTP ${response.status}）`);
      if(code!==0)throw Error(code==null?'LX Music 返回无效取址响应':`LX Music 取址失败（代码 ${code}）`);
      const expiry=data.expire??data.extra?.expire,timestamp=Number(expiry?.time??expiry);
      if(expiry?.canExpire!==false&&Number.isFinite(timestamp)&&timestamp>0&&(timestamp<1e12?timestamp*1000:timestamp)<=Date.now())continue;
      let url;try{url=new URL(data.url);}catch{throw Error('LX Music 返回无效播放地址');}
      if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('LX Music 返回无效播放地址');
      await playUrl(data.url,label,false,{isActive,expectedDuration:songDuration(song)});
      if(!isActive())return null;
      audio.dataset.seleneLxSource=label;
      return {offline:false};
    }
    return false;
  }
  async function playLxSource(song,platform,isActive){
    if(!isActive())return null;
    checkLxCooldown();
    const known=knownLxSongId(song,platform);
    const qqPlaylist=platform==='tencent'&&song.source==='tencent'&&!song.lxSearch;
    const songId=known||await findLxSongId(song,platform,isActive);
    const played=await playLxSongId(song,platform,songId,isActive);
    if(played)return qqPlaylist&&song.qqMid!==songId?{...played,qqMid:songId}:played;
    if(played===null||!isActive())return null;
    const unavailable=Error('LX Music 没有返回有效期内的播放地址');
    if(!known||!qqPlaylist)throw unavailable;
    let replacement;
    try{replacement=await findLxSongId(song,platform,isActive,known);}
    catch(error){throw new AggregateError([unavailable,error],`${unavailable.message}；${error.message}`);}
    const recovered=await playLxSongId(song,platform,replacement,isActive);
    if(recovered===false)throw unavailable;
    return recovered?{...recovered,qqMid:replacement}:null;
  }
  let pendingPlay=null;
  let playbackLimitWarningUntil=0;
  function notifyPlaybackBlocked(){
    const message='浏览器阻止播放，请再次点击播放按钮';
    setStatus(message,true);toast('warning',message);
  }
  function play(s,recovering=false,{companionPick=false}={}){
    if(isVideoEntry(s))return;
    if(s.source==='tencent'&&s.lxSearch&&!settings.lxMusicEnabled&&!playbackSources.has(s)){
      setStatus('播放 QQ 搜索结果需要在设置中启用 LX Music',true);
      return;
    }
    bilibiliPlayer.close();
    const key=JSON.stringify([s.source,s.mediaId||s.id,s.title,s.artist,s.version,s.customAudio,playbackSourceChoice(s)]);
    if(!recovering&&pendingPlay?.key===key&&pendingPlay.request===playRequest&&playbackWanted)return pendingPlay.promise;
    const pending={key,request:playRequest+1,promise:null};pendingPlay=pending;
    pending.promise=performPlay(s,recovering,companionPick).finally(()=>{if(pendingPlay===pending)pendingPlay=null;});return pending.promise;
  }
  async function performPlay(s,recovering=false,companionPick=false){
    const selectedSource=playbackSourceChoice(s);
    const requestedLx=selectedSource.startsWith('lx-')?selectedSource.slice(3):'';
    const fallbackSource=requestedLx?'auto':selectedSource;
    let lxSource='',lxRetryAt=0;
    if(audio.dataset)delete audio.dataset.seleneLxSource;
    cancelPlaybackProbe?.();if(!recovering){playbackRecoveryCount=0;playbackBlobRetryUsed=false;failedPlaybackUrls.clear();}applyAudioSessionMode();pauseKeepAliveForTrack();primeAudioFromGesture();
    const request=++playRequest,isActive=()=>!disposed&&playbackWanted&&request===playRequest;pendingPlaybackSelection=true;playbackWanted=true;playbackPhase='loading';if(!audioPriming)audio.pause();updatePlayButton();applyAudioSessionMode();show(s);lyricTimeline=[];currentLyricWords='';lyricState=s.source==='direct'?'MP3 直链歌曲':'正在准备播放…';paintTime();let lastError,played=null;
    const noteFailure=error=>{
      if(isNotAllowed(error)||error.name==='AbortError')throw error;
      const retryAt=Math.max(lastError?.retryAt||0,error.retryAt||0);
      lastError=lastError?Object.assign(new AggregateError([lastError,error],`${mediaDetail(lastError)}；${mediaDetail(error)}`),{retryAt}):error;
    };
    const tryLx=async platform=>{
      setStatus(`正在验证 ${lxSourceLabel(platform)}…`);
      try{const result=await playLxSource(s,platform,isActive);if(result)lxSource=platform;return result;}
      catch(error){if(error.kind==='lx-blocked'||error.kind==='lx-rate-limit')lxRetryAt=error.retryAt;noteFailure(error);return null;}
    };
    try{
      if(requestedLx)played=await tryLx(requestedLx);
      if(!isActive())return;
      if(!played){
        setStatus('正在检查离线缓存…');played=recovering?null:await playOfflineSong(s,isActive);
        if(!isActive())return;
        if(!played&&s.customAudio&&!failedPlaybackUrls.has(s.customAudio)){
          setStatus('正在验证手动音源…');
          try{await playUrl(s.customAudio,'手动音源',false,{isActive});played={...s,audio:s.customAudio,offline:false};}
          catch(error){noteFailure(error);}
        }
        if(!isActive())return;
        const autoLx=!requestedLx&&selectedSource==='auto'&&settings.lxMusicEnabled;
        const preferQq=autoLx&&(s.source==='tencent'||knownLxSongId(s,'tencent'));
        if(!played&&preferQq)played=await tryLx('tencent');
        if(!isActive())return;
        const useSavedAudio=s.source==='direct'||fallbackSource===s.source||fallbackSource==='auto'&&['tencent','netease','kugou'].includes(s.source);
        if(!played&&useSavedAudio&&!failedPlaybackUrls.has(s.audio)&&/^https?:\/\//i.test(String(s?.audio||''))&&s.audio!==s.customAudio){
          setStatus('正在验证已保存音源…');
          try{await playUrl(s.audio,'已保存音源',false,{isActive,expectedDuration:s.source==='direct'?0:songDuration(s)});played={...s,offline:false};}
          catch(error){noteFailure(error);console.warn('[音乐播放器] 已保存音源失效，切换备用源',error);}
        }
        if(!isActive())return;
        if(!played&&s.source!=='direct'){
          let gdRetryAt=0;
          const tryGd=async sources=>{
            try{return await gdFallback(s,0,isActive,failedPlaybackUrls,sources,source=>setStatus(`正在验证${GD_SOURCE_LABELS[source]||source}音源…`));}
            catch(error){gdRetryAt=error.retryAt||0;noteFailure(error);return null;}
          };
          const sources=playbackSourceOrder(fallbackSource);
          if(autoLx&&!preferQq){
            const [primary,...remaining]=sources;
            played=await tryGd([primary]);
            if(!played&&isActive()&&settings.lxMusicEnabled)played=await tryLx('tencent');
            if(!played&&isActive()&&Date.now()>=gdRetryAt&&remaining.length)played=await tryGd(remaining);
          }else played=await tryGd(sources);
        }
      }
      if(played){
        if(!isActive())return;
        pendingPlaybackSelection=false;Object.assign(s,played);if(Number.isFinite(audio.duration)&&audio.duration>0)s.duration=audio.duration;
        const savedSong=playlistPlaybackOrigins.get(s)||s;
        if(settings.favorites?.includes(savedSong)||(settings.playlists||[]).some(playlist=>playlist.songs?.includes(savedSong))){
          if(played.qqMid)savedSong.qqMid=played.qqMid;
          if(savedSong===s||played.qqMid)save();
        }
        show(s);setStatus(played.offline?'正在播放 · 离线缓存':lxSource?`正在播放 · ${lxSourceLabel(lxSource)}`:'正在播放');
        if(s.source==='direct'){const lyrics=DOC.querySelector(`#${ID} .lyrics`);if(lyrics)lyrics.textContent='MP3 直链歌曲';}
        else{applyCurrentCover(s,request);loadLyrics(s,request);}
        recordCompanionPlay(s);maybeAutoCompanion(s,companionPick);return true;
      }
      lastError=lastError||Error('没有找到可播放音源');
    }catch(error){if(!isActive())return;if(isNotAllowed(error)){if(error.track)Object.assign(s,error.track);pendingPlaybackSelection=false;playbackWanted=false;playbackPhase='idle';audio.pause();lyricState='请再次点击播放';updatePlayButton();paintTime();show(s);notifyPlaybackBlocked();return;}lastError=error;console.warn('[音乐播放器] 音源播放失败',error);}
    if(!isActive())return;
    console.warn('[音乐播放器] 本轮播放失败',{request,song:{title:s.title,artist:s.artist,source:s.source,mediaId:s.mediaId},error:lastError});
    clearFailedPlayback();
    const detail=`${mediaDetail(lastError)}。可重试、切换音源或补充 MP3 直链`;
    setStatus(detail,true,lxRetryAt);
    if(lastError?.retryAt){
      const alreadyWarned=Date.now()<playbackLimitWarningUntil;
      playbackLimitWarningUntil=Math.max(playbackLimitWarningUntil,lastError.retryAt);
      if(alreadyWarned)return;
    }
    toast('warning',detail);
  }
  function parse(text){const b=String(text||'').match(/<music_recommend>([\s\S]*?)<\/music_recommend>/i);if(!b)return null;const tag=n=>b[1].match(new RegExp(`<${n}>\\s*([\\s\\S]*?)\\s*<\\/${n}>`,'i'))?.[1]?.trim()||'';const x={title:tag('title'),artist:tag('artist'),reason:tag('reason')};return x.title?x:null;}
  function recentFloorRecommendationKeys(chat,beforeIndex,limit=30){const keys=new Set();let count=0;for(let index=Math.min(Number(beforeIndex)||0,(chat?.length||0))-1;index>=0&&count<Math.max(0,Number(limit)||0);index--){const message=chat[index];if(!message||message.is_user)continue;const song=parse(message.mes);if(!song)continue;keys.add(offlineKey(song));count++;}return keys;}
  function floorRecommendationWasUsed(song,chat,beforeIndex,limit=30){const key=offlineKey(song);return!!key&&recentFloorRecommendationKeys(chat,beforeIndex,limit).has(key);}
  async function recommendation(force=false){const chat=context()?.chat||[];if(chat!==lastRecommendationChat){lastRecommendationChat=chat;lastRecommendation='';}let m;for(let i=chat.length-1;i>=0;i--)if(!chat[i]?.is_user){m={i,text:chat[i].mes};break;}const r=m&&parse(m.text);if(!r){if(force)toast('warning','本层没有 music_recommend 标签');return;}const key=`${m.i}:${offlineKey(r)}`;if(key===lastRecommendation)return;lastRecommendation=key;if(floorRecommendationWasUsed(r,chat,m.i,30)){const message=`已跳过重复推荐：《${r.title}》 · ${r.artist}`;setStatus(message);DOC.querySelector(`#${ID} .reason`).textContent=message;if(force)toast('info','这首在最近 30 个楼层推荐过，已跳过');return;}DOC.querySelector(`#${ID} .reason`).textContent=r.reason?`推荐：${r.reason}`:'';if(settings.autoLoad||force)await search(`${r.title} ${r.artist}`,true,true,'本层推荐候选',false,r);}
  function parseWorldPlaylist(content,bookName=''){
    const songs=[];
    for(const section of String(content||'').matchAll(/<selene_playlist(?:\s[^>]*)?>([\s\S]*?)<\/selene_playlist>/gi)){
      let pending={title:'',artist:''};
      const push=()=>{const title=String(pending.title||'').trim(),artist=String(pending.artist||'').trim();if(title&&artist)songs.push({title,artist,bookName});pending={title:'',artist:''};};
      for(const rawLine of section[1].split(/\r?\n/)){
        const line=rawLine.trim().replace(/^[-*+]\s+|^\d+[.)、]\s*/,'');
        if(!line||/^#/.test(line)||/^(?:歌单名|playlist)\s*[:：]/i.test(line))continue;
        const title=line.match(/^(?:歌曲名?|歌名|song|title)\s*[:：]\s*(.+)$/i);
        if(title){if(pending.title&&pending.artist)push();pending.title=title[1].trim();continue;}
        const artist=line.match(/^(?:歌手|歌手名|艺人|artist)\s*[:：]\s*(.+)$/i);
        if(artist){pending.artist=artist[1].trim();if(pending.title)push();continue;}
        const pair=line.match(/^(.+?)\s*(?:\|\||[|｜\t]|\s[-—–]\s)\s*(.+)$/);
        if(pair){push();pending={title:pair[1].trim(),artist:pair[2].trim()};push();}
      }
      push();
    }
    return songs;
  }
  function worldEntryContents(data){const entries=data?.entries;return Array.isArray(entries)?entries.map(x=>x?.content):entries&&typeof entries==='object'?Object.values(entries).map(x=>x?.content):[];}
  async function currentWorldNames(ctx,allNames){
    const allowed=new Set(allNames),names=[],characters=[],add=value=>{const name=String(value||'').trim();if(name&&allowed.has(name)&&!names.includes(name))names.push(name);};
    const group=ctx?.groups?.find?.(item=>String(item.id)===String(ctx?.groupId));
    if(group){
      for(const avatar of group.members||[]){const character=ctx?.characters?.find?.(item=>item.avatar===avatar);if(character)characters.push(character);}
    }else{
      const character=ctx?.characters?.[ctx?.characterId];if(character)characters.push(character);
    }
    for(const character of characters)add(character?.data?.extensions?.world||character?.extensions?.world);
    const execute=ctx?.executeSlashCommandsWithOptions;
    if(typeof execute==='function')for(const character of characters){
      const avatar=String(character?.avatar||'').trim();if(!avatar)continue;
      try{const escaped=avatar.replace(/\\/g,'\\\\').replace(/"/g,'\\"'),result=await execute(`/getcharbook type=all create=false "${escaped}"`,{handleParserErrors:false,handleExecutionErrors:false});for(const name of companionBookNamesFrom(result?.pipe))add(name);}catch(error){console.warn('[音乐播放器] 读取当前角色卡绑定世界书失败',error);}
    }
    DOC.querySelectorAll('.character_extra_world_info_selector option:checked').forEach(option=>add(option.value||option.textContent));
    return names;
  }
  async function loadWorldPlaylistBooks(ctx,names){
    const settled=await Promise.allSettled(names.map(async name=>({name,data:await ctx.loadWorldInfo(name)}))),songs=[],loaded=[];
    for(const item of settled)if(item.status==='fulfilled'&&item.value.data){loaded.push(item.value.name);for(const content of worldEntryContents(item.value.data))songs.push(...parseWorldPlaylist(content,item.value.name));}
    return {songs,loaded,failures:settled.filter(x=>x.status==='rejected').length};
  }
  function renderWorldPlaylist(songs,bookNames){
    results=songs;render(songs,`作者推荐 · ${songs.length} 首`,'results',false);
    const box=DOC.querySelector(`#${ID} .list`),heading=box?.firstElementChild;if(!heading)return;
    heading.classList.add('batch-heading');
    const controls=DOC.createElement('span');controls.innerHTML='<button type="button" data-world-queue>全部入队</button><button type="button" data-world-play>一键播放</button>';heading.appendChild(controls);
    controls.onclick=event=>{event.preventDefault();event.stopPropagation();const known=new Set(queue.map(x=>`${normalizeSongText(x.title)}:${normalizeSongText(x.artist)}`));if(event.target.closest('[data-world-queue]')){let added=0;for(const song of songs){const key=`${normalizeSongText(song.title)}:${normalizeSongText(song.artist)}`;if(!known.has(key)){queue.push(strip(song));known.add(key);added++;}}count();setStatus(added?`已将 ${added} 首作者推荐加入队列`:'作者推荐已在播放队列中');return;}if(event.target.closest('[data-world-play]')){queue=songs.map(strip);queueIndex=0;count();if(queue.length)play(queue[0]);}};
    setStatus(`已从 ${bookNames.length} 本世界书读取 ${songs.length} 首作者推荐`);
  }
  async function readWorldRecommendations(){
    const ctx=context();
    if(typeof ctx?.getWorldInfoNames!=='function'||typeof ctx?.loadWorldInfo!=='function'){const message='当前 SillyTavern 版本没有提供世界书读取接口，请更新后重试';setStatus(message);toast('error',message);return;}
    const allNames=[...new Set((ctx.getWorldInfoNames()||[]).map(String).filter(Boolean))];
    if(!allNames.length){const message='尚未导入世界书，请先导入作者推荐歌单模板';setStatus(message);toast('warning',message);return;}
    setStatus('正在读取世界书作者推荐…');
    try{
      const active=await currentWorldNames(ctx,allNames);
      if(!active.length){const message='当前角色卡没有绑定世界书';setStatus(message);toast('warning',message);return;}
      const primary=await loadWorldPlaylistBooks(ctx,active),raw=primary.songs,seen=new Set(),songs=[];
      for(const item of raw){const key=`${normalizeSongText(item.title)}:${normalizeSongText(item.artist)}`;if(!key||seen.has(key))continue;seen.add(key);songs.push({id:`world:${key}`,mediaId:'',title:item.title,artist:item.artist,album:item.bookName||'作者推荐',cover:'',coverId:'',lyricId:'',audio:'',source:'netease'});if(songs.length>=300)break;}
      if(!songs.length){const message=primary.failures?'当前角色卡世界书读取失败，请稍后重试':'当前角色卡绑定的世界书里没有 <selene_playlist> 作者推荐歌单';setStatus(message);toast(primary.failures?'error':'warning',message);return;}
      renderWorldPlaylist(songs,[...new Set(raw.map(x=>x.bookName).filter(Boolean))]);
    }catch(error){const message=`读取世界书推荐失败：${error?.message||'未知错误'}`;console.warn('[音乐播放器] 世界书作者推荐读取失败',error);setStatus(message);toast('error',message);}
  }
  function bindWorldRecommendations(el){
    const button=el.querySelector('[data-a="world-rec"]');if(button)button.onclick=event=>{event.preventDefault();event.stopPropagation();readWorldRecommendations();};
  }
  const PLAYLIST_SOURCE_LABELS={netease:'网易云音乐',tencent:'QQ 音乐',kugou:'酷狗音乐'},PLAYLIST_IMPORT_LIMIT=1000;
  function favoritePlaylist(){settings.favorites=settings.favorites||[];return{id:'selene-favorites',name:'收藏歌单',songs:settings.favorites,isFavorites:true};}
  function playlistCatalog(){settings.playlists=settings.playlists||[];return[favoritePlaylist(),...settings.playlists];}
  function createPlaylist(name){
    name=String(name||'').trim();if(!name)return null;
    if(name==='收藏歌单')return favoritePlaylist();
    settings.playlists=settings.playlists||[];
    const existing=settings.playlists.find(item=>item.name===name);if(existing)return existing;
    const playlist={id:`playlist-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name,songs:[],createdAt:Date.now()};
    settings.playlists.unshift(playlist);save();return playlist;
  }
  function renamePlaylist(playlist){
    if(!playlist||playlist.isFavorites)return;
    const answer=ROOT.prompt?.('请输入新的歌单名称',playlist.name);if(answer===null||answer===undefined)return;
    const name=String(answer).trim();if(!name){setStatus('歌单名称不能为空');toast('warning','歌单名称不能为空');return;}
    if(name==='收藏歌单'){setStatus('“收藏歌单”是系统保留名称');toast('warning','请换一个歌单名称');return;}
    settings.playlists=settings.playlists||[];if(settings.playlists.some(item=>item!==playlist&&item.name===name)){setStatus(`已经有名为“${name}”的歌单`);toast('warning','歌单名称已存在');return;}
    const oldName=playlist.name;playlist.name=name;playlist.updatedAt=Date.now();save();showPlaylists();setStatus(`已将“${oldName}”改名为“${name}”`);toast('success','歌单名称已更新');
  }
  function askForPlaylist(){
    const lists=playlistCatalog();
    const choices=lists.map((item,index)=>`${index+1}. ${item.name}（${item.songs?.length||0} 首）`).join('\n');
    const answer=ROOT.prompt?.(`输入歌单序号，或直接输入新歌单名称：\n${choices}`);if(!answer)return null;
    const index=Number(answer)-1;return Number.isInteger(index)&&lists[index]?lists[index]:createPlaylist(answer);
  }
  function addSongsToPlaylist(songs){
    const items=(Array.isArray(songs)?songs:[]).filter(Boolean),playlist=askForPlaylist();if(!items.length||!playlist)return 0;
    if(playlist.isFavorites){const known=new Set(settings.favorites.map(offlineKey));let added=0;for(const song of items){const key=offlineKey(song);if(!key||known.has(key))continue;settings.favorites.push(strip(song));known.add(key);added++;}save();updateCurrentFavorite();setStatus(added?`已将 ${added} 首歌曲加入收藏歌单`:'所选歌曲已在收藏歌单中');toast(added?'success':'info',added?'已批量加入收藏歌单':'没有重复添加');return added;}
    playlist.songs=playlist.songs||[];const known=new Set(playlist.songs.map(offlineKey));let added=0;for(const song of items){const key=offlineKey(song);if(!key||known.has(key))continue;playlist.songs.push(strip(song));known.add(key);added++;}save();setStatus(added?`已将 ${added} 首歌曲加入“${playlist.name}”`:`所选歌曲已在“${playlist.name}”中`);toast(added?'success':'info',added?`已批量加入：${playlist.name}`:'没有重复添加');return added;
  }
  function addSongToPlaylist(song){
    const playlist=askForPlaylist();if(!playlist)return;
    if(playlist.isFavorites){if(currentIsFavorite(song)){setStatus(`${song.title} 已在收藏歌单中`);toast('info','歌曲已在收藏歌单中');return;}saveFavorite(song);setStatus(`已将 ${song.title} 加入收藏歌单`);toast('success','已加入收藏歌单');return;}
    playlist.songs=playlist.songs||[];
    const key=offlineKey(song);if(playlist.songs.some(item=>offlineKey(item)===key)){setStatus(`${song.title} 已在歌单“${playlist.name}”中`);toast('info','歌曲已在这个歌单中');return;}
    playlist.songs.push(strip(song));save();setStatus(`已将 ${song.title} 加入“${playlist.name}”`);toast('success',`已加入歌单：${playlist.name}`);
  }
  function queuePlaylistSongs(songs){
    if(!songs.length){setStatus('这个歌单还是空的');return;}
    const known=new Set(queue.map(offlineKey));
    let added=0;
    for(const song of songs){
      const key=offlineKey(song);
      if(known.has(key))continue;
      queue.push(strip(song));
      known.add(key);
      added++;
    }
    count();
    const message=added?`已将 ${added} 首歌曲加入播放队列`:'所选歌曲已在播放队列中';
    setStatus(message);
    toast(added?'success':'info',message);
  }
  function showPlaylists(){
    syncLibraryNavigation('my-playlists');
    const box=DOC.querySelector(`#${ID} .list`);if(!box)return;settings.playlists=settings.playlists||[];const lists=settings.playlists;box.hidden=false;
    box.innerHTML=`<div class="row batch-heading feature-heading"><b style="margin-right:auto">我的歌单</b><button data-import-audio>导入 MP3</button><button data-import-playlist>导入歌单</button><button data-new-playlist>＋ 新建</button></div>${lists.map((playlist,index)=>`<article class="row" data-playlist-index="${index}"><div class="playlist-summary"><div><b>${esc(playlist.name)}</b><span>${playlist.songs?.length||0} 首歌曲${playlist.importSource?` · ${esc(PLAYLIST_SOURCE_LABELS[playlist.importSource]||playlist.importSource)}`:''}</span></div><span class="row-tools"><button data-playlist-play title="播放歌单">▶</button><button data-playlist-open title="打开歌单">查看</button><button data-playlist-queue title="一键加入队列">入队</button><button data-playlist-rename title="修改歌单名称">改名</button><button data-playlist-delete title="删除歌单">×</button></span></div></article>`).join('')||'<div class="row">还没有自建歌单，可以导入平台歌单或点击“＋ 新建”</div>'}`;
    box.onclick=e=>{
      if(e.target.closest('[data-import-audio]')){promptAudioImport();return;}
      if(e.target.closest('[data-import-playlist]')){promptPlaylistImport();return;}
      if(e.target.closest('[data-new-playlist]')){const name=ROOT.prompt?.('请输入新歌单名称');if(name){createPlaylist(name);showPlaylists();}return;}
      const row=e.target.closest('[data-playlist-index]');if(!row)return;const playlist=lists[Number(row.dataset.playlistIndex)];if(!playlist)return;
      if(e.target.closest('[data-playlist-rename]')){renamePlaylist(playlist);return;}
      if(e.target.closest('[data-playlist-queue]')){queuePlaylistSongs(playlist.songs||[]);return;}
      if(e.target.closest('[data-playlist-delete]')){if(!ROOT.confirm?.(`确定删除歌单“${playlist.name}”吗？歌单内的歌曲记录会一起删除。`))return;const index=settings.playlists.indexOf(playlist);if(index>=0)settings.playlists.splice(index,1);save();showPlaylists();setStatus(`已删除歌单：${playlist.name}`);return;}
      if(e.target.closest('[data-playlist-play]')){playPlaylistAt(playlist.songs||[]);return;}
      showPlaylistSongs(playlist);
    };
  }
  function showPlaylistSongs(playlist,{batch=false,selected=new Set()}={}){
    const box=DOC.querySelector(`#${ID} .list`),isFavorites=!!playlist?.isFavorites,songs=isFavorites?(settings.favorites||[]):(playlist?.songs||[]);if(!box)return;box.hidden=false;
    syncLibraryNavigation(isFavorites?'favorites':'my-playlists');
    const selection=selected instanceof Set?selected:new Set(),syncBatchCount=()=>{const countOutput=box.querySelector('[data-batch-count]');if(countOutput)countOutput.textContent=`已选 ${selection.size} 首`;box.querySelectorAll('[data-batch-needs-selection]').forEach(button=>button.disabled=!selection.size);};
    box.innerHTML=`<div class="row batch-heading feature-heading"><button data-playlist-back>‹ 歌单</button><b style="margin-right:auto">${esc(playlist.name)}</b>${!batch?'<button data-import-audio>导入 MP3</button>':''}${songs.length&&!batch?'<button data-playlist-batch>批量管理</button>':''}<button data-playlist-play-all>一键播放</button></div>${batch&&songs.length?`<div class="playlist-batch-bar"><b data-batch-count>已选 ${selection.size} 首</b><button data-batch-select-all>${selection.size===songs.length?'取消全选':'全选'}</button><button data-batch-play data-batch-needs-selection>播放</button><button data-batch-queue data-batch-needs-selection>入队</button><button data-batch-add data-batch-needs-selection>加歌单</button><button data-batch-cache data-batch-needs-selection>缓存</button><button data-batch-remove data-batch-needs-selection>${isFavorites?'取消收藏':'移出'}</button><button data-playlist-batch class="playlist-batch-done">完成</button></div>`:''}${songs.map((song,index)=>`<article class="row${batch?' playlist-batch-row':''}${batch&&selection.has(index)?' selene-batch-selected':''}" data-song-index="${index}" data-track-id="${esc(song.id)}">${batch?`<label class="playlist-select" title="选择 ${esc(song.title)}"><input type="checkbox" data-song-select ${selection.has(index)?'checked':''}><i></i></label>`:''}<img loading="lazy" decoding="async" ${song.cover?`src="${esc(song.cover)}"`:''}><div><b>${esc(song.title)}</b><span>${isVideoEntry(song)?esc(bilibiliVideoInfo(song)):esc(song.artist)}${song.customAudio&&!isVideoEntry(song)?' · 手动音源':''}</span></div>${batch?'':`<span class="row-tools">${isFavorites?'':'<button data-song-fav title="收藏">☆</button>'}<button data-song-add title="加入歌单">歌单</button>${isVideoEntry(song)?'':`<button data-song-audio title="补充或更换 MP3 音源">音源</button><button data-song-cache title="下载离线缓存">⇩</button>`}${bilibiliMenuButtons(song)}<button data-song-queue title="加入队列">＋</button><button data-song-remove ${isFavorites?'data-row-heart':''} title="${isFavorites?'取消收藏':'移出歌单'}">×</button></span>`}</article>`).join('')||`<div class="row">${isFavorites?'收藏歌单还是空的，点击当前歌曲红心即可加入':'歌单还是空的，可从搜索结果或收藏中添加歌曲'}</div>`}`;
    syncBatchCount();
    box.onclick=async e=>{
      if(e.target.closest('[data-import-audio]')){promptAudioImport(playlist);return;}
      if(e.target.closest('[data-playlist-back]')){showPlaylists();return;}
      if(e.target.closest('[data-playlist-batch]')){showPlaylistSongs(playlist,{batch:!batch,selected:new Set()});return;}
      if(e.target.closest('[data-playlist-play-all]')){playPlaylistAt(songs);return;}
      if(batch&&e.target.closest('[data-batch-select-all]')){if(selection.size===songs.length)selection.clear();else songs.forEach((_,index)=>selection.add(index));showPlaylistSongs(playlist,{batch:true,selected:selection});return;}
      const chosen=()=>[...selection].sort((a,b)=>a-b).map(index=>songs[index]).filter(Boolean);
      if(batch&&e.target.closest('[data-batch-play]')){const items=chosen();if(items.length)playPlaylistAt(items);return;}
      if(batch&&e.target.closest('[data-batch-queue]')){queuePlaylistSongs(chosen());return;}
      if(batch&&e.target.closest('[data-batch-add]')){addSongsToPlaylist(chosen());return;}
      if(batch&&e.target.closest('[data-batch-cache]')){const items=chosen();if(!items.length)return;let success=0;for(let index=0;index<items.length;index++){setStatus(`正在缓存 ${index+1}/${items.length}：${items[index].title}`);if(await cacheSong(items[index],{quiet:true}))success++;}const message=`批量缓存完成：成功 ${success} 首，失败 ${items.length-success} 首`;setStatus(message);toast(success===items.length?'success':success?'warning':'error',message);return;}
      if(batch&&e.target.closest('[data-batch-remove]')){const indexes=[...selection].sort((a,b)=>b-a);if(!indexes.length||!ROOT.confirm?.(`确定${isFavorites?'取消收藏':'移出'}所选的 ${indexes.length} 首歌曲吗？`))return;for(const index of indexes)songs.splice(index,1);save();if(isFavorites)updateCurrentFavorite();showPlaylistSongs(playlist,{batch:true,selected:new Set()});setStatus(`已批量${isFavorites?'取消收藏':'移出'} ${indexes.length} 首歌曲`);return;}
      const row=e.target.closest('[data-song-index]');if(!row)return;const index=Number(row.dataset.songIndex),song=songs[index];if(!song)return;
      if(batch){e.preventDefault();const input=row.querySelector('[data-song-select]'),checked=!selection.has(index);input.checked=checked;if(checked)selection.add(index);else selection.delete(index);row.classList.toggle('selene-batch-selected',checked);syncBatchCount();const selectAll=box.querySelector('[data-batch-select-all]');if(selectAll)selectAll.textContent=selection.size===songs.length?'取消全选':'全选';return;}
      if(handleBilibiliMenu(e,song))return;
      if(e.target.closest('[data-song-remove]')){const action=isFavorites?'取消收藏':'移出歌单';if(!ROOT.confirm?.(`确定${action}“${song.title} · ${song.artist}”吗？`))return;songs.splice(index,1);save();if(isFavorites)updateCurrentFavorite();showPlaylistSongs(playlist);setStatus(isFavorites?`已取消收藏 ${song.title}`:`已从歌单移除 ${song.title}`);return;}
      if(e.target.closest('[data-song-fav]')){saveFavorite(song);setStatus('已加入收藏');return;}
      if(e.target.closest('[data-song-add]')){addSongToPlaylist(song);return;}
      if(e.target.closest('[data-song-audio]')){if(promptSongAudio(song))showPlaylistSongs(playlist);return;}
      if(e.target.closest('[data-song-cache]')){cacheSong(song);return;}
      if(e.target.closest('[data-song-queue]')){queue.push(strip(song));count();setStatus('已加入播放队列');return;}
      playPlaylistAt(songs,index);
    };
  }
  async function showOfflineSongs(){
    const box=DOC.querySelector(`#${ID} .list`);if(!box)return;box.hidden=false;box.innerHTML='<div class="row">正在读取离线歌曲…</div>';
    try{
      const records=(await listOfflineSongs()).sort((a,b)=>(b.cachedAt||0)-(a.cachedAt||0));
      box.innerHTML=`<div class="row batch-heading feature-heading"><b style="margin-right:auto">离线歌曲 · ${records.length}</b>${records.length?'<button data-offline-clear>清空缓存</button>':''}</div>${records.map((record,index)=>`<article class="row" data-offline-index="${index}"><img loading="lazy" decoding="async" ${record.song?.cover?`src="${esc(record.song.cover)}"`:''}><div><b>${esc(record.song?.title||'未知歌曲')}</b><span>${esc(record.song?.artist||'未知歌手')} · <i class="offline-badge">${formatBytes(record.size||record.blob?.size)}</i></span></div><span class="row-tools"><button data-offline-add title="加入歌单">歌单</button><button data-offline-queue title="加入队列">＋</button><button data-offline-delete title="删除缓存">×</button></span></article>`).join('')||'<div class="row">还没有离线歌曲，点击歌曲旁的 ⇩ 即可缓存</div>'}`;
      box.onclick=async e=>{
        if(e.target.closest('[data-offline-clear]')){if(!ROOT.confirm?.(`确定删除全部 ${records.length} 首离线缓存吗？`))return;for(const record of records)await deleteOfflineSong(record.song);showOfflineSongs();setStatus('已清空离线缓存');return;}
        const row=e.target.closest('[data-offline-index]');if(!row)return;const record=records[Number(row.dataset.offlineIndex)],song=record?.song;if(!song)return;
        if(e.target.closest('[data-offline-delete]')){if(!ROOT.confirm?.(`确定删除“${song.title} · ${song.artist}”的离线缓存吗？`))return;await deleteOfflineSong(song);showOfflineSongs();setStatus(`已删除 ${song.title} 的离线缓存`);return;}
        if(e.target.closest('[data-offline-add]')){addSongToPlaylist(song);return;}
        if(e.target.closest('[data-offline-queue]')){queue.push(strip(song));count();setStatus('已加入播放队列');return;}
        playListEntry(song);
      };
    }catch(error){box.innerHTML=`<div class="row">离线缓存不可用：${esc(error.message)}</div>`;setStatus(`离线缓存不可用：${error.message}`);}
  }
  function audioInputUrl(value){
    const text=String(value||'').replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/&amp;/gi,'&').replace(/\\([&=?#])/g,'$1').trim();
    // Try the full URL first: signed URLs may contain literal parentheses or punctuation.
    const candidates=[text,text.match(/^\[[\s\S]*?\]\(<?(https?:\/\/[\s\S]*?)>?\)$/i)?.[1],text.match(/<a\b[^>]*href=["']([^"']+)["']/i)?.[1]];
    for(const candidate of candidates){
      if(!candidate||/\s|[<>"']/.test(candidate))continue;
      try{const url=new URL(candidate);if(/^https?:$/.test(url.protocol)&&url.hostname&&!url.username&&!url.password)return url.href;}catch{}
    }
    throw Error('请粘贴完整的 http(s) 音频直链（MP3 等），不是网盘分享页或音乐网页');
  }
  function directAudioSong(link,title='',artist=''){
    const url=audioInputUrl(link);let filename=new URL(url).pathname.split('/').pop()||'';
    try{filename=decodeURIComponent(filename);}catch{}
    return{id:`direct:${url}`,mediaId:'',title:String(title||filename.replace(/\.(?:mp3|m4a|aac|ogg|wav|flac|opus)$/i,'')||'链接歌曲').trim(),artist:String(artist||'').trim(),cover:'',audio:url,customAudio:url,source:'direct'};
  }
  function setSongAudio(song,url){
    const key=offlineKey(song),copies=[song,current,...queue,...results,...(settings.favorites||[]),...(settings.playlists||[]).flatMap(playlist=>playlist.songs||[])];
    for(const item of copies)if(item&&offlineKey(item)===key){const previous=item.customAudio;item.customAudio=url;if(item.source==='direct')item.audio=url;else if(previous&&item.audio===previous)item.audio='';}
    save();
  }
  function promptSongAudio(song){
    const answer=ROOT.prompt?.(`为《${song.title}》补充或更换 MP3 音源：\n粘贴可直接播放的 http(s) 音频链接。${song.source==='direct'?'直链歌曲需要完整的音频地址。':'留空可恢复自动找源。'}`,song.customAudio||'');
    if(answer===null||answer===undefined)return false;
    try{if(song.source==='direct'&&!answer.trim())throw Error('直链歌曲需要完整的音频地址');const url=answer.trim()?audioInputUrl(answer):'';setSongAudio(song,url);setStatus(url?'已保存手动音源，下次播放优先使用；可点击 ⇩ 缓存':'已清除手动音源');return true;}
    catch(error){setStatus(error.message);toast('warning',error.message);return false;}
  }
  function promptAudioImport(playlist=null){
    const link=ROOT.prompt?.('粘贴 MP3 音频直链（也支持 M4A、OGG 等浏览器可播放的音频）：\n需要文件直链，不是音乐平台或网盘分享页面。');if(!link)return;
    try{
      const draft=directAudioSong(link),title=ROOT.prompt?.('歌曲名称',draft.title);if(title===null||title===undefined)return;
      if(!title.trim())throw Error('歌曲名称不能为空');
      const artist=ROOT.prompt?.('歌手（可留空）','');if(artist===null||artist===undefined)return;
      const song=directAudioSong(link,title,artist),target=playlist||askForPlaylist();if(!target)return;
      const songs=target.isFavorites?(settings.favorites=settings.favorites||[]):(target.songs=target.songs||[]),existing=songs.find(item=>offlineKey(item)===offlineKey(song));
      if(existing)setSongAudio(existing,song.customAudio);else{songs.push(strip(song));save();}
      showPlaylistSongs(target);setStatus(existing?'已更新这首歌的 MP3 音源':'已导入链接歌曲，点击歌曲即可播放，也可以离线缓存');toast('success',existing?'音源已更新':'MP3 链接已导入');
    }catch(error){setStatus(error.message);toast('warning',error.message);}
  }
  function playlistInputUrl(value){
    const text=String(value||'').replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/&amp;/gi,'&').replace(/\\([&=?#])/g,'$1').trim(),patterns=[/\]\(\s*(https?:\/\/[^\s<>")']+)/ig,/<a\b[^>]*\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/ig,/https?:\/\/[^\s<>"'()[\]{}（）【】]+/ig];
    for(const pattern of patterns)for(const match of text.matchAll(pattern)){const candidate=String(match[1]||match[0]).trim().replace(/[\])】）。，,;:：；!?！？]+$/g,'');try{const url=new URL(candidate);if(/^https?:$/.test(url.protocol))return url.href;}catch{}}
    throw Error('没有识别到有效的歌单链接，请粘贴平台分享文案或 https 链接');
  }
  function playlistLinkInfo(link){
    const u=new URL(playlistInputUrl(link)),host=u.hostname.toLowerCase(),source=/(?:music\.163\.com|163cn\.tv)$/.test(host)?'netease':/(^|\.)qq\.com$/.test(host)?'tencent':/(^|\.)kugou\.com$/.test(host)?'kugou':'';
    const hashQuery=u.hash.includes('?')?new URLSearchParams(u.hash.slice(u.hash.indexOf('?')+1)):new URLSearchParams(),pathId=`${u.pathname}${u.hash}`.match(/(?:playlist|detail|songlist|plist\/list)\/(?:gcid_)?([\w-]+)/i)?.[1];
    const rawId=u.searchParams.get('id')||u.searchParams.get('disstid')||u.searchParams.get('dissid')||u.searchParams.get('playlist')||u.searchParams.get('global_specialid')||u.searchParams.get('specialid')||u.searchParams.get('global_collection_id')||hashQuery.get('id')||hashQuery.get('disstid')||hashQuery.get('dissid')||hashQuery.get('playlist')||pathId||'';
    const id=String(rawId).replace(/^(?:collection_|gcid_)/i,'');return{u,source,rawId,id,sourceLabel:PLAYLIST_SOURCE_LABELS[source]||''};
  }
  function playlistShareSource(url){const info=playlistLinkInfo(url.href);if(info.id)return'';const host=url.hostname.toLowerCase();if(/(^|\.)163cn\.tv$/.test(host))return'netease';if(/(^|\.)t1\.kugou\.com$/.test(host))return'kugou';if(/(^|\.)qq\.com$/.test(host)&&/^\/base\/fcgi-bin\/u\/?$/i.test(url.pathname)&&url.searchParams.has('__'))return'tencent';return'';}
  function playlistUrlFromText(text,wantedSource=''){
    const source=String(text||'').replace(/&amp;/gi,'&').replace(/\\u0026/gi,'&').replace(/\\u002f/gi,'/').replace(/\\\//g,'/'),patterns=[/https?:\/\/[^"'<>\s]+/ig,/(?:location(?:\.href)?\s*=\s*|url\s*=\s*|href\s*=\s*)["']([^"']+)["']/ig];
    for(const pattern of patterns)for(const match of source.matchAll(pattern)){let value=(match[1]||match[0]).replace(/[),.;]+$/,'');try{value=decodeURIComponent(value);}catch{}try{const info=playlistLinkInfo(value);if(info.id&&(!wantedSource||info.source===wantedSource))return info.u.href;}catch{}}
    if(wantedSource==='kugou'){const raw=source.match(/(?:global_specialid|global_collection_id|specialid)\s*[=:"']+\s*((?:collection_|gcid_)?[\w-]+)/i)?.[1];if(raw&&!/^-?2147483648$/.test(raw))return`https://activity.kugou.com/share/?global_specialid=${encodeURIComponent(raw)}`;}
    return'';
  }
  function cleanResolvedPlaylistTitle(value){return String(value||'').replace(/\s*[-–—]\s*歌单(?:\s*[-–—].*)?$/i,'').trim();}
  function playlistSameOriginHeaders(){try{return context()?.getRequestHeaders?.()||ROOT.getRequestHeaders?.()||{};}catch{return{};}}
  async function fetchPlaylistPage(target,options={}){const local=/^\//.test(String(target)),controller=typeof ROOT.AbortController==='function'?new ROOT.AbortController():null,timer=controller?ROOT.setTimeout(()=>controller.abort(),15000):0;try{return await fetch(target,{cache:'no-store',credentials:local?'same-origin':'omit',headers:local?playlistSameOriginHeaders():undefined,...options,...(controller?{signal:controller.signal}:{})});}finally{if(timer)ROOT.clearTimeout(timer);}}
  async function resolvePlaylistShareLink(link){
    const original=playlistLinkInfo(link).u,source=playlistShareSource(original);if(!source)return{url:original.href,title:''};const sourceLabel=PLAYLIST_SOURCE_LABELS[source]||'音乐平台';
    setStatus(`正在解析${sourceLabel}分享短链…`);const errors=[];
    const resolver=new URL('https://api.urlresolver.com/resolve');resolver.searchParams.set('url',original.href);
    for(const target of[resolver.href,`/proxy/${resolver.href}`])try{const response=await fetchPlaylistPage(target),body=await response.text();if(!response.ok)throw Error(`HTTP ${response.status}`);let data={};try{data=JSON.parse(body)||{};}catch{}const resolved=playlistUrlFromText([data.resolved_url,...(Array.isArray(data.intermediate_urls)?data.intermediate_urls:[]),body].join('\n'),source);if(resolved)return{url:resolved,title:cleanResolvedPlaylistTitle(data.title)};throw Error('展开结果没有歌单 ID');}catch(error){errors.push(error);console.warn(`[音乐播放器] ${sourceLabel}短链展开服务失败：${target}`,error);}
    const candidates=[original.href,`/proxy/${original.href}`];
    for(const target of candidates)try{
      const response=await fetchPlaylistPage(target,{method:'GET',redirect:'follow'}),body=await response.text();
      if(!response.ok)throw Error(`HTTP ${response.status}`);
      const direct=target===original.href?response.url:'',resolved=playlistUrlFromText(`${direct}\n${body}`,source);
      if(resolved)return{url:resolved,title:''};
      if(direct&&direct!==original.href){const info=playlistLinkInfo(direct);if(info.source===source&&info.id)return{url:direct,title:''};}
      throw Error('跳转页面里没有找到歌单 ID');
    }catch(error){errors.push(error);console.warn(`[音乐播放器] ${sourceLabel}分享短链解析失败：${target}`,error);}
    const useful=errors.find(error=>!/HTTP 401|HTTP 404|Failed to fetch/i.test(error?.message||''))||errors[0];throw Error(`${sourceLabel}分享短链解析失败：${useful?.name==='AbortError'?'请求超时':useful?.message||'链接已失效'}。已自动尝试短链服务和 SillyTavern 代理。`);
  }
  function playlistMatchesImport(item,source,id){if(!item)return false;if(item.importSource===source&&String(item.importSourceId||'')===String(id))return true;for(const link of[item.importUrl,item.importShareUrl])try{const info=playlistLinkInfo(link||'');if(info.source===source&&String(info.id||'')===String(id))return true;}catch{}return false;}
  function playlistSongsFromRows(rows,source,api){
    const songs=[],known=new Set();
    for(const x of(rows||[]).slice(0,PLAYLIST_IMPORT_LIMIT)){
      if(!x||typeof x!=='object')continue;
      const title=getSongTitle(x),artist=getSongArtist(x),audio=getResponseUrl(x.url);
      let mediaId=source==='tencent'?metingPlaybackId(x,api,source):String(x.mediaId||'');
      if(source!=='tencent'&&!mediaId)try{const url=new URL(audio);if(!url.searchParams.has('server')||url.searchParams.get('server')===source)mediaId=url.searchParams.get('id')||'';}catch{}
      if(source==='tencent'&&!mediaId){
        const songId=[x.songid,x.mediaId,x.id].find(value=>/^\d+$/.test(String(value??'')));
        if(songId!=null)mediaId=String(songId);
      }else if(!mediaId&&x.id!=null)mediaId=String(x.id);
      const song={id:`${source}:${mediaId||title}:${artist}`,mediaId,title,artist,album:getSongAlbum(x),version:String(x.version||''),duration:songDuration(x),cover:x.pic||x.cover||'',audio,source};
      const key=mediaId||`${offlineKey(song)}:${lyricVersion(song)}`;
      if(title&&!known.has(key)){songs.push(strip(song));known.add(key);}
    }
    return songs;
  }
  function promptPlaylistImport(){const link=ROOT.prompt?.('粘贴网易云、QQ 音乐或酷狗歌单链接');if(link)importPlaylist(link);}
  async function importPlaylist(link){
    try{
      const sharedUrl=playlistInputUrl(link),resolved=await resolvePlaylistShareLink(link);link=resolved.url;
      const {u,source,rawId,id,sourceLabel}=playlistLinkInfo(link);
      if(!source||!id)throw Error('仅支持网易云、QQ 音乐或酷狗歌单链接');
      setStatus(`正在识别并导入${sourceLabel}歌单…`);
      const ids=source==='kugou'?[...new Set([rawId,id,`gcid_${id}`].filter(Boolean))]:[id];
      let rows=null,playlistApi,lastError=null;
      outer:for(const playlistId of ids)for(const base of METING_COVER_APIS)try{
        const api=new URL(base);api.searchParams.set('server',source);api.searchParams.set('type','playlist');api.searchParams.set('id',playlistId);
        const r=await fetch(api);if(!r.ok)throw Error(`接口返回 ${r.status}`);
        const data=await r.json();if(!Array.isArray(data)||!data.length)throw Error('接口没有返回歌曲');
        rows=data;playlistApi=api;break outer;
      }catch(error){lastError=error;console.warn(`[音乐播放器] 歌单接口失败，尝试备用接口：${base}`,error);}
      if(!rows)throw Error(`歌单读取失败：${lastError?.message||'所有接口均不可用'}${source==='netease'?'；如果这是私人歌单，请先在网易云设为公开':''}`);
      settings.playlists=settings.playlists||[];const matches=settings.playlists.filter(item=>playlistMatchesImport(item,source,id));
      let playlist=matches[0],created=false,duplicates=Math.max(0,matches.length-1);
      if(duplicates)settings.playlists=settings.playlists.filter(item=>item===playlist||!matches.includes(item));
      if(!playlist){const baseName=resolved.title||`${sourceLabel}歌单`,sameName=settings.playlists.some(item=>item.name===baseName),name=sameName?`${baseName} ${id}`:baseName;playlist={id:`playlist-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name,songs:[],createdAt:Date.now()};settings.playlists.unshift(playlist);created=true;}
      const previous=Array.isArray(playlist.songs)?playlist.songs:[],fresh=playlistSongsFromRows(rows,source,playlistApi);
      const nameKey=song=>`${offlineKey(song)}:${lyricVersion(song)}`,trackKey=song=>song.source===source&&song.mediaId&&song.mediaId!==song.id?`id:${song.mediaId}`:nameKey(song);
      const previousKeys=new Set(previous.map(trackKey)),freshKeys=new Set(fresh.map(trackKey)),added=fresh.filter(song=>!previousKeys.has(trackKey(song))).length,removed=previous.filter(song=>!freshKeys.has(trackKey(song))).length;
      const manualSongs=[...new Set([...matches.flatMap(item=>item.songs||[]),...previous])].filter(song=>song.customAudio),manualSources=new Map(manualSongs.map(song=>[trackKey(song),song.customAudio]));
      const freshNameCounts=new Map(),manualNames=new Map();
      for(const song of fresh){const key=nameKey(song);freshNameCounts.set(key,(freshNameCounts.get(key)||0)+1);}
      for(const song of manualSongs){const key=nameKey(song);manualNames.set(key,manualNames.has(key)?'':song.customAudio);}
      playlist.songs=fresh.map(song=>({...song,customAudio:manualSources.get(trackKey(song))||(freshNameCounts.get(nameKey(song))===1?manualNames.get(nameKey(song)):'')||''}));playlist.importSource=source;playlist.importSourceId=id;playlist.importUrl=u.href;playlist.importShareUrl=sharedUrl;playlist.updatedAt=Date.now();playlist.importVersion=2;
      save();showPlaylists();const details=created?`导入 ${fresh.length} 首`:`同步 ${fresh.length} 首${added?`，新增 ${added} 首`:''}${removed?`，清理旧版 ${removed} 首`:''}${duplicates?`，合并 ${duplicates} 个重复歌单`:''}`,message=`${created?'已创建':'已刷新'}“${playlist.name}”，${details}`;setStatus(message);toast('success',message);
    }catch(error){setStatus(error.message);toast('error',error.message);}
  }
  let activeCompanionWorldText='',activeCompanionMood='',activeCompanionMoodKey='',activeCompanionMentionIds=[];
  const COMPANION_MOODS=['安静地陪着你','有点走神','想听你说话','今天很松弛','藏着一点期待','懒洋洋的','被旋律哄好了','有点想念','心里挺亮的','暂时不想说太多','想再听一会儿','有一点任性'];
  function baseCompanionCharacter(){const ctx=context(),characters=Array.isArray(ctx?.characters)?ctx.characters:[],numericId=Number(ctx?.characterId);let character=Number.isInteger(numericId)&&numericId>=0?characters[numericId]||null:null,speaker=null;if(!character){const chat=Array.isArray(ctx?.chat)?ctx.chat:[];for(let index=chat.length-1;index>=0;index--){const message=chat[index];if(!message||message.is_user||message.is_system)continue;speaker=message;const avatars=[message.original_avatar,message.avatar,message.force_avatar].map(value=>String(value||'').trim()).filter(Boolean);character=characters.find(item=>avatars.includes(String(item?.avatar||'')))||characters.find(item=>String(message.name||'').trim()&&String(item?.name||'').trim()===String(message.name).trim())||null;if(character||String(message.name||'').trim())break;}}if(!character&&ctx?.groupId!==undefined&&ctx?.groupId!==null){const group=(Array.isArray(ctx?.groups)?ctx.groups:[]).find(item=>String(item?.id)===String(ctx.groupId)),members=Array.isArray(group?.members)?group.members:[];for(let index=members.length-1;index>=0&&!character;index--){const avatar=String(members[index]?.avatar||members[index]||'').trim();if(avatar)character=characters.find(item=>String(item?.avatar||'')===avatar)||null;}}const name=String(character?.name||speaker?.name||ctx?.name2||'当前角色').trim()||'当前角色';return{ctx,character,name,speaker};}
  function companionBaseKey(info=baseCompanionCharacter()){if(info.ctx?.groupId!==undefined&&info.ctx?.groupId!==null)return`group:${info.ctx.groupId}`;return`character:${info.character?.avatar||info.ctx?.characterId||info.name||'default'}`;}
  function companionContextCharacters(info=baseCompanionCharacter()){const characters=Array.isArray(info.ctx?.characters)?info.ctx.characters:[],group=(Array.isArray(info.ctx?.groups)?info.ctx.groups:[]).find(item=>String(item?.id)===String(info.ctx?.groupId)),avatars=new Set((group?.members||[]).map(item=>String(item?.avatar||item||'').trim()).filter(Boolean)),rows=avatars.size?characters.filter(character=>avatars.has(String(character?.avatar||''))):info.character?[info.character]:[];return[...new Map(rows.filter(Boolean).map(character=>[String(character.avatar||character.name),character])).values()];}
  function syncContextCompanionMembers(roster,info=baseCompanionCharacter()){roster.members=Array.isArray(roster.members)?roster.members:[];let baseMember=null;for(const character of companionContextCharacters(info)){const sourceName=cleanCompanionPersonName(character.name)||String(character.name||'当前角色').trim(),avatar=String(character.avatar||'').trim(),isBase=character===info.character||avatar&&avatar===String(info.character?.avatar||'');let member=(avatar&&roster.members.find(item=>String(item.characterAvatar||item.avatar||'')===avatar))||roster.members.find(item=>cleanCompanionPersonName(item.sourceName||item.name)===sourceName);if(!member){member={id:companionMemberId(`char:${avatar||sourceName}`),name:sourceName,sourceName,glyph:Array.from(sourceName).slice(-1)[0]||'角',customGlyph:false,avatar,customAvatar:false,chatTone:'',manual:false,refs:[]};roster.members.push(member);}member.isContextCharacter=true;member.isBaseCharacter=!!isBase;member.characterAvatar=avatar;member.sourceName=sourceName;if(!String(member.name||'').trim())member.name=sourceName;if(!member.customAvatar&&avatar)member.avatar=avatar;if(!member.customGlyph)member.glyph=Array.from(member.name||sourceName).slice(-1)[0]||'角';if(isBase)baseMember=member;}if(baseMember){roster.members=[baseMember,...roster.members.filter(member=>member!==baseMember)];if(!roster.selectedId)roster.selectedId=baseMember.id;}return baseMember;}
  function syncBaseCompanionMember(roster,info=baseCompanionCharacter()){return syncContextCompanionMembers(roster,info)||null;}
  function companionRoster(info=baseCompanionCharacter()){settings.companionRosters=settings.companionRosters&&typeof settings.companionRosters==='object'&&!Array.isArray(settings.companionRosters)?settings.companionRosters:{};const key=companionBaseKey(info);if(!settings.companionRosters[key])settings.companionRosters[key]={members:[],selectedId:'',groupIds:[],groups:[],activeGroupId:'',phoneView:'home',contactsCollapsed:false,excludedNames:[],scannedAt:0,scanVersion:0};const roster=settings.companionRosters[key];syncContextCompanionMembers(roster,info);if(!Array.isArray(roster.groups)){const legacyIds=(roster.groupIds||[]).filter(id=>(roster.members||[]).some(member=>member.id===id));roster.groups=[];if(legacyIds.length>=2){const id=`legacy-${companionMemberId(`${key}:${legacyIds.slice().sort().join('|')}`)}`,names=legacyIds.map(id=>roster.members.find(member=>member.id===id)?.name).filter(Boolean);roster.groups.push({id,name:`${names.slice(0,3).join('、')||'角色'}的小群`,memberIds:legacyIds,avatar:'',createdAt:Date.now(),migrated:true});roster.activeGroupId=id;const oldKey=`${key}:group:${legacyIds.slice().sort().join('|')}`,newKey=`${key}:group-id:${id}`;if(Array.isArray(settings.companionConversations?.[oldKey])&&!settings.companionConversations?.[newKey])settings.companionConversations[newKey]=settings.companionConversations[oldKey].slice(-40);}}if(!['home','chat'].includes(roster.phoneView))roster.phoneView='home';return roster;}
  function companionCharacter(){
    const base=baseCompanionCharacter(),roster=companionRoster(base),members=Array.isArray(roster.members)?roster.members:[];if(settings.companionAudienceMode!=='multi'||members.length<2)return{...base,baseKey:companionBaseKey(base),isMulti:false,isGroup:false};
    const selected=members.find(member=>member.id===roster.selectedId)||members[0];roster.selectedId=selected?.id||'';const group=(roster.groups||[]).find(item=>item.id===roster.activeGroupId);let savedGroup=(group?.memberIds||Array.isArray(roster.groupIds)&&roster.groupIds||[]).filter(id=>members.some(member=>member.id===id));if(savedGroup.length<2)savedGroup=[...new Set([...savedGroup,...members.map(member=>member.id)])].slice(0,Math.min(4,members.length));const participants=savedGroup.map(id=>members.find(member=>member.id===id)).filter(Boolean);roster.groupIds=savedGroup;
    const isGroup=settings.companionChatMode==='group',targets=isGroup&&activeCompanionMentionIds.length?participants.filter(member=>activeCompanionMentionIds.includes(member.id)):isGroup?participants:[selected];return{...base,baseKey:companionBaseKey(base),base,roster,members,selected,group:isGroup?group:null,participants,targetMembers:targets.length?targets:isGroup?participants:[selected],name:isGroup?(group?.name||'多人群聊'):selected?.name||base.name,isMulti:true,isGroup};
  }
  function companionMood(info=companionCharacter(),force=false){const key=companionConversationKey(info);if(force||!activeCompanionMood||activeCompanionMoodKey!==key){const choices=COMPANION_MOODS.filter(value=>value!==activeCompanionMood),index=Math.floor(Math.random()*choices.length);activeCompanionMood=choices[index]||COMPANION_MOODS[0];activeCompanionMoodKey=key;}return activeCompanionMood;}
  function companionConversationKey(info=companionCharacter()){const baseKey=info.baseKey||companionBaseKey(info);if(info.isMulti&&info.isGroup&&info.group?.id)return`${baseKey}:group-id:${info.group.id}`;if(info.isMulti&&info.isGroup)return`${baseKey}:group:${info.participants.map(member=>member.id).sort().join('|')}`;if(info.isMulti)return`${baseKey}:member:${info.selected?.id||'default'}`;return baseKey;}
  function companionBucket(name,info=companionCharacter()){settings[name]=settings[name]&&typeof settings[name]==='object'&&!Array.isArray(settings[name])?settings[name]:{};const key=companionConversationKey(info);return{root:settings[name],key,value:settings[name][key]};}
  function companionMessages(info=companionCharacter()){const bucket=companionBucket('companionConversations',info);if(Array.isArray(bucket.value))return bucket.value.slice(-40);const baseKey=info.baseKey||companionBaseKey(info),base=info.base||baseCompanionCharacter(),roster=companionRoster(base),baseMember=(roster.members||[]).find(member=>member.isBaseCharacter),alternateKey=info.isMulti&&info.selected?.isBaseCharacter?baseKey:!info.isMulti&&baseMember?`${baseKey}:member:${baseMember.id}`:'',alternate=alternateKey&&Array.isArray(bucket.root[alternateKey])?bucket.root[alternateKey].slice(-40):[];if(alternate.length){bucket.root[bucket.key]=alternate;return alternate;}const legacy=Array.isArray(settings.companionMessages)?settings.companionMessages.slice(-40):[];if(legacy.length){bucket.root[bucket.key]=legacy;delete settings.companionMessages;save();return legacy;}return[];}
  function setCompanionMessages(messages,info=companionCharacter()){const bucket=companionBucket('companionConversations',info);bucket.root[bucket.key]=(Array.isArray(messages)?messages:[]).slice(-40);}
  function companionMemberAvatar(member,info=companionCharacter()){const raw=String(member?.avatar||'').trim();if(!raw)return'';if(/^(?:https?:|data:image\/|blob:|\/|\.\.?\/)/i.test(raw))return raw;try{return info.ctx?.getThumbnailUrl?.('avatar',raw)||`/thumbnail?type=avatar&file=${encodeURIComponent(raw)}`;}catch{return raw;}}
  function companionAvatar(info=companionCharacter()){if(info.isMulti&&info.isGroup)return info.group?.avatar?companionMemberAvatar(info.group,info):'';if(info.isMulti&&!info.isGroup){const avatar=companionMemberAvatar(info.selected,info);if(avatar)return avatar;}const avatar=info.character?.avatar;if(!avatar)return'';try{return info.ctx?.getThumbnailUrl?.('avatar',avatar)||`/thumbnail?type=avatar&file=${encodeURIComponent(avatar)}`;}catch{return'';}}
  function companionSongContext(){const song=current?`${current.title||'未知歌曲'} — ${current.artist||'未知歌手'}`:'现在没有播放歌曲',lyric=String(currentLyricWords||'').replace(/\s+/g,' ').trim();return{song,lyric:lyric.slice(0,300)};}
  function companionLiveDescription(character){if(!character)return'';const info=baseCompanionCharacter(),same=character===info.character||String(character.avatar||'')&&String(character.avatar||'')===String(info.character?.avatar||''),field=DOC.getElementById?.('description_textarea')||DOC.querySelector?.('textarea[name="description"]');return same?String(field?.value||'').trim():'';}
  function companionCardText(character){if(!character)return'没有选中角色。请作为温柔自然的陪听伙伴回应。';const data=character.data||{},fields=[['角色描述',companionLiveDescription(character)||character.description||data.description],['性格',character.personality||data.personality],['场景',character.scenario||data.scenario],['开场信息',character.first_mes||data.first_mes],['角色备注',character.creator_notes||data.creator_notes],['系统提示',character.system_prompt||data.system_prompt],['历史后提示',character.post_history_instructions||data.post_history_instructions],['示例对话',character.mes_example||data.mes_example]];return fields.filter(([,value])=>String(value||'').trim()).map(([label,value])=>`${label}：${String(value).trim().slice(0,3000)}`).join('\n').slice(0,10000)||'请保持当前角色的身份、语气和关系设定。';}
  function companionMemberCharacter(member,info=companionCharacter()){const characters=Array.isArray(info.ctx?.characters)?info.ctx.characters:[],avatar=String(member?.characterAvatar||'').trim(),name=cleanCompanionPersonName(member?.sourceName||member?.name);return(avatar&&characters.find(character=>String(character?.avatar||'')===avatar))||characters.find(character=>cleanCompanionPersonName(character?.name)===name)||(member?.isBaseCharacter?info.character:null)||null;}
  function companionRoleCardText(info=companionCharacter()){if(!info.isMulti)return companionCardText(info.character);const character=companionMemberCharacter(info.selected,info);if(character)return companionCardText(character);const profile=String(info.selected?.profileText||'').trim();return profile?`【从当前角色描述中识别的 ${info.selected.name} 设定】\n${profile}`:'这个联系人没有独立 char 角色卡；请只依据下方关联的人设背景回应。';}
  function companionGroupCardText(info){return info.participants.map(member=>{const character=companionMemberCharacter(member,info),profile=String(member.profileText||'').trim();if(character)return`【${member.name} 的 char 角色卡】\n${companionCardText(character)}`;if(profile)return`【从当前角色描述中识别的 ${member.name} 设定】\n${profile}`;return'';}).filter(Boolean).join('\n\n').slice(0,16000)||companionCardText(info.character);}
  function companionMainContextRows(info=companionCharacter()){const chat=Array.isArray(info.ctx?.chat)?info.ctx.chat:[],participants=info.isGroup?new Set(info.participants.map(member=>cleanCompanionPersonName(member.name))):null,selected=info.isMulti&&!info.isGroup?info.selected:null,selectedName=cleanCompanionPersonName(selected?.sourceName||selected?.name),selectedAvatar=String(selected?.characterAvatar||selected?.avatar||'').trim();return chat.filter(message=>{if(!message||message.is_system||!String(message.mes||'').trim())return false;if(message.is_user||!info.isMulti)return true;const messageName=cleanCompanionPersonName(message.name),avatars=[message.original_avatar,message.avatar,message.force_avatar].map(value=>String(value||'').trim());if(info.isGroup)return participants.has(messageName)||info.participants.some(member=>avatars.includes(String(member.characterAvatar||member.avatar||'')));return messageName===selectedName||!!selectedAvatar&&avatars.includes(selectedAvatar);}).slice(-18).map(message=>({role:message.is_user?'user':'assistant',content:String(message.mes).slice(0,1800)}));}
  function companionMainContextText(info=companionCharacter()){const user=String(info.ctx?.name1||'用户');return companionMainContextRows(info).map(message=>`${message.role==='user'?user:info.isGroup?'上下文角色':info.name}：${cleanCompanionText(message.content)}`).join('\n').slice(0,12000);}
  function companionInstruction(info=companionCharacter(),worldText=activeCompanionWorldText){
    const agency='每个人先依据自己的目标、偏好、边界和情绪决定回应。用户不是自动的关注中心，不默认赞同、安慰、示爱或让步；也不为了自主而强行冷淡或争辩。人物的独立生活和既有关系持续有效。';
    const music=companionSongContext(),duo=settings.companionDuoMode?'你们可以偶尔建议重听或换歌，但最终播放控制权属于用户。':'',preset=settings.companionPresetEnabled!==false?String(settings.companionPreset||DEFAULT_COMPANION_PRESET).trim():'';
    if(info.isGroup){const participants=info.participants.map(member=>member.name).join('、'),targets=info.targetMembers.map(member=>member.name).join('、'),tones=info.participants.filter(member=>String(member.chatTone||'').trim()).map(member=>`${member.name}：${String(member.chatTone).trim().slice(0,160)}`).join('\n');return`你正在 Selene 的多人角色陪听群聊中。参与角色：${participants}。本轮允许发言：${targets}。每个人必须严格依据自己对应的 char 角色卡或世界书人设、关系和说话习惯，禁止把人物混成同一种性格，禁止替未参与或本轮未点名的人发言。自然判断谁有理由接话，不要求所有人每轮报到；通常让一到三个人回应，也允许只有一人。若用户使用 @，只能被 @ 的人物回应。每段回复必须另起一行，严格使用“角色名：内容”。绝对不要输出任何标签、状态栏、变量、JSON、数组、思维过程、旁白、括号动作、场景调度、规则解释、Markdown、HTML、CSS 或 XML。点歌任务按该任务要求保留歌曲结构行。${agency}${duo}\n\n当前播放：${music.song}\n当前歌词：${music.lyric||'暂时没有歌词'}${tones?`\n\n各人的线上聊天语气：\n${tones}`:''}\n\n本轮角色卡人设（最高优先级）：\n${companionGroupCardText(info)}${worldText?`\n\n仅为本轮参与人物加载的人设与必要公共设定：\n${worldText}`:''}${preset?`\n\n自然对话文风预设：\n${preset}`:''}`;}
    const roleName=info.isMulti?info.selected?.name:info.name,tone=info.isMulti?String(info.selected?.chatTone||'').trim().slice(0,160):'',hasSelectedCard=!info.isMulti||!!companionMemberCharacter(info.selected,info),cardLabel=hasSelectedCard?'当前联系人对应的 char 角色卡人设（最高优先级，必须遵守）':'当前联系人关联的人设背景';return`你正在“角色陪听”小窗里以 ${roleName} 的身份和用户线上聊天、一起听歌。先给出这个人此刻最自然的第一反应，通常一到三句，长度和节奏服从这个人的说话习惯及本轮目的，够用就停。短回复通常不加句号，优先用空格、换行或自然逗号。严禁任何破折号、装饰性省略号、括号动作、场景调度和人物小传。不要为了展示角色、情绪或关系而增加内容。不要假装真的听到未提供的声音，不要写“作为AI”，不要输出角色名标签，不要解释规则。只输出聊天正文；绝对不要输出任何标签、状态栏、变量、JSON、数组、思维过程、Markdown、HTML、CSS 或 XML。点歌任务按该任务要求保留歌曲结构行。${agency}${duo}${tone?`\n\n${roleName} 的线上聊天语气：${tone}`:''}\n\n当前角色心情提示：${companionMood(info)}。它只能帮助选择反应方向，不能要求多写一句，也不要直接复述心情文字或覆盖角色卡中已经成立的情绪。\n当前播放：${music.song}\n当前歌词：${music.lyric||'暂时没有歌词'}\n\n${cardLabel}：\n${companionRoleCardText(info)}${worldText?`\n\n${info.isMulti?'当前人物的人设索引':'本轮激活的世界书内容'}：\n${worldText}`:''}${preset?`\n\n内置人物与文风预设：\n${preset}`:''}`;}
  function companionHistoryText(info=companionCharacter()){const user=String(info.ctx?.name1||'用户');return companionMessages(info).slice(-24).map(message=>{const content=(message.role==='assistant'?cleanCompanionText(message.content):String(message.content||'')).slice(0,1800);return message.role==='assistant'&&info.isGroup?content:`${message.role==='assistant'?info.name:user}：${content}`;}).join('\n');}
  function companionBookNamesFrom(value){if(value===undefined||value===null)return[];let parsed=value;try{parsed=JSON.parse(String(value));}catch{}return(Array.isArray(parsed)?parsed:[parsed]).map(name=>String(name||'').trim()).filter(Boolean);}
  async function companionAttachedBookNames(info=companionCharacter()){const names=[],primary=info.character?.data?.extensions?.world||info.character?.extensions?.world;if(primary)names.push(String(primary).trim());const execute=info.ctx?.executeSlashCommandsWithOptions,commands=[];if(typeof execute==='function'){const avatar=String(info.character?.avatar||'').trim();if(avatar)commands.push(`/getcharbook type=all create=false "${avatar.replace(/\\/g,'\\\\').replace(/"/g,'\\"')}"`);commands.push('/getglobalbooks');}for(const command of commands)try{const result=await execute(command,{handleParserErrors:false,handleExecutionErrors:false});names.push(...companionBookNamesFrom(result?.pipe));}catch(error){console.warn(`[音乐播放器] 读取已挂载世界书失败：${command}`,error);}for(const option of DOC.querySelectorAll?.('#world_info option:checked')||[]){const name=String(option.value||option.textContent||'').trim();if(name)names.push(name);}return[...new Set(names.filter(Boolean))];}
  async function companionRosterBookNames(info=baseCompanionCharacter()){const names=[],primary=info.character?.data?.extensions?.world||info.character?.extensions?.world;if(primary)names.push(String(primary).trim());const execute=info.ctx?.executeSlashCommandsWithOptions,avatar=String(info.character?.avatar||'').trim();if(typeof execute==='function'&&avatar)try{const command=`/getcharbook type=all create=false "${avatar.replace(/\\/g,'\\\\').replace(/"/g,'\\"')}"`,result=await execute(command,{handleParserErrors:false,handleExecutionErrors:false});names.push(...companionBookNamesFrom(result?.pipe));}catch(error){console.warn('[音乐播放器] 读取角色卡绑定世界书失败',error);}return[...new Set(names.filter(Boolean))];}
  function companionWorldMatch(text,key,entry){const raw=String(key||'').trim();if(!raw)return false;const caseSensitive=entry?.caseSensitive===true,source=caseSensitive?String(text):String(text).toLocaleLowerCase(),needle=caseSensitive?raw:raw.toLocaleLowerCase();if(entry?.matchWholeWords!==true)return source.includes(needle);const escaped=needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');try{return new RegExp(`(^|[^\\p{L}\\p{N}_])${escaped}(?=$|[^\\p{L}\\p{N}_])`,'u').test(source);}catch{return source.includes(needle);}}
  function companionWorldEntryActive(entry,scan){if(!entry||entry.disable===true||entry.enabled===false||!String(entry.content||'').trim())return false;if(entry.constant===true)return true;const keys=Array.isArray(entry.key)?entry.key:Array.isArray(entry.keys)?entry.keys:[],secondary=Array.isArray(entry.keysecondary)?entry.keysecondary:[],primaryHit=keys.some(key=>companionWorldMatch(scan,key,entry));if(!primaryHit)return false;if(!entry.selective||!secondary.length)return true;const hits=secondary.map(key=>companionWorldMatch(scan,key,entry)),logic=Number(entry.selectiveLogic);if(logic===1)return!hits.every(Boolean);if(logic===2)return!hits.some(Boolean);if(logic===3)return hits.every(Boolean);return hits.some(Boolean);}
  const COMPANION_ROSTER_SCAN_VERSION=6,COMPANION_NON_PERSON=/地点|公司|组织|机构|世界观|世界设定|规则|准则|时间线|年表|事件|聚会|故事|发展|状态栏|状态|住宅|背景|关系|家族|家庭|群像|总览|列表|索引|公共|通用|国家|城市|学校|学院|系统|术语|物品|道具|能力|剧情|章节|目录|地图|种族|势力|阵营|职业|技能|魔法|科技|货币|节日|历史|wrapper|database|taverndb/i,COMPANION_GENERIC_PERSON_LABEL=/^(?:语言风格|语言习惯|说话风格|说话方式|语气|口癖|阶段|觉醒相关|觉醒时间节点|觉醒瞬间|性观念|觉醒后的变化|觉醒前|觉醒后|当前|过去|未来|前期|中期|后期|心腹|原男主|原女主|男主|女主|主角团|关键记忆|客观状况|当前角色|当前人物|主要人物|次要人物|人物设定|角色设定|人物档案|角色档案|人物简介|角色简介|人物关系|角色关系|关系图|关系表|人物列表|角色列表|联系人|群聊|目录|说明|备注|其他|默认|未知|未命名|未设定|不详|暂无|待定|保密|无)$/i,COMPANION_GENERIC_PERSON_SUFFIX=/(?:风格|阶段|相关|时间节点|瞬间|观念|变化|设定|说明|规则|状态|状况|背景|关系|剧情|事件|时间线|偏好|习惯|记忆|态度|立场|定位|身份|称呼|标签|目标|动机|秘密|弱点|档案|总览|索引)$/i;
  function companionMemberId(name){let hash=2166136261;for(const char of String(name||'')){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619);}return`person-${(hash>>>0).toString(36)}`;}
  function cleanCompanionPersonName(value){let name=String(value||'').trim().replace(/^[#*\-\s【\[「『（(]+|[】\]」』）)：:：\s]+$/g,'').replace(/^(?:角色|人物|姓名|名字|name|character)\s*[：:_\-—|]*/i,'').replace(/^(?:(?:主要|次要|普通|重要|核心)?\s*(?:N\.?P\.?C\.?|配角|主角))\s*(?:[-—_:：|·]\s*)+/i,'').replace(/(?:的?[-—_| ]?(?:人物|角色)?(?:人设|设定|档案|简介)|角色卡)$/i,'').replace(/\s*(?:[-—_:：|·]\s*)+(?:(?:主要|次要|普通|重要|核心)?\s*(?:N\.?P\.?C\.?|配角|主角))$/i,'').replace(/[-—_| ]+$/,'').trim();if(/[：:|/]/.test(name))name=name.split(/[：:|/]/).pop().trim();if(!name||name.length<2||name.length>24||COMPANION_NON_PERSON.test(name)||/^(?:角色|人物|姓名|名字|主角|配角|npc|用户|玩家|旁白|unknown)$/i.test(name))return'';if(!/^[\p{L}][\p{L}\p{M}·.'’\-\s]{1,23}$/u.test(name))return'';return name;}
  function companionLikelyPersonName(value){const name=cleanCompanionPersonName(value),compact=name.replace(/\s+/g,'');if(!name||COMPANION_GENERIC_PERSON_LABEL.test(compact)||COMPANION_GENERIC_PERSON_SUFFIX.test(compact))return'';if(/^[\p{Script=Han}·]{2,6}$/u.test(name))return name;if(/^[A-Za-z][A-Za-z.'’\-]{1,15}(?:\s+[A-Za-z][A-Za-z.'’\-]{1,15}){0,2}$/.test(name))return name;if(/^[\p{L}\p{M}·.'’\-]{2,18}$/u.test(name)&&!/[\p{Script=Han}]/u.test(name))return name;return'';}
  function companionEntryTitle(entry,key){return String(entry?.comment||entry?.name||entry?.title||`条目 ${entry?.uid??key}`).trim();}
  function companionEntryAvatar(entry){const direct=[entry?.avatar,entry?.image,entry?.icon,entry?.portrait,entry?.extensions?.avatar,entry?.extensions?.image,entry?.extensions?.icon,entry?.data?.avatar,entry?.data?.image].find(value=>typeof value==='string'&&value.trim());if(direct)return direct.trim();const content=String(entry?.content||''),patterns=[/!\[[^\]]*\]\((https?:\/\/[^)\s]+|data:image\/[^)\s]+|\/[^)\s]+)\)/i,/<img[^>]+src=["']([^"']+)["']/i,/(?:头像|立绘|形象|avatar|portrait|image|icon)\s*[：:]\s*(https?:\/\/\S+|data:image\/\S+|\/\S+)/i];for(const pattern of patterns){const value=content.match(pattern)?.[1]?.replace(/[),.;，。；]+$/,'').trim();if(value)return value;}return'';}
  function companionEntryKeyValues(entry){return[entry?.key,entry?.keys,entry?.keysecondary,entry?.secondary_keys].flatMap(value=>Array.isArray(value)?value:value===undefined||value===null?[]:[value]).map(value=>String(value||'').trim()).filter(Boolean);}
  function companionEntryPersonaEvidence(entry,key){
    const title=companionEntryTitle(entry,key),sample=companionPlainProfileText(entry?.content).slice(0,6000),structure=/(?:人物|角色)\s*(?:人设|设定|档案|资料|简介|信息|小传|传记)|(?:character|persona)\s*(?:profile|sheet|bio)/i.test(`${title}\n${sample.slice(0,1600)}`),nameField=/(?:^|[\n,{])\s*(?:[-*]\s*)?(?:\*{1,2}|__)?["'`]?\s*(?:姓名|名字|角色名|人物名|角色姓名|人物姓名|全名|本名|昵称|name|character\s*name)\s*["'`]?(?:\*{1,2}|__)?\s*[：:=]/im.test(sample),signals=[/(?:^|\n)\s*(?:[-*]\s*)?(?:\*{1,2}|__)?(?:年龄|生日|性别|身高)(?:\*{1,2}|__)?\s*[：:=]/im,/(?:^|\n)\s*(?:[-*]\s*)?(?:\*{1,2}|__)?(?:身份|职业|种族|阵营)(?:\*{1,2}|__)?\s*[：:=]/im,/(?:^|\n)\s*(?:[-*]\s*)?(?:\*{1,2}|__)?(?:性格|人格)(?:\*{1,2}|__)?\s*[：:=]/im,/(?:^|\n)\s*(?:[-*]\s*)?(?:\*{1,2}|__)?(?:外貌|长相|发色|瞳色|穿着|体型)(?:\*{1,2}|__)?\s*[：:=]/im,/(?:^|\n)\s*(?:[-*]\s*)?(?:\*{1,2}|__)?(?:经历|家庭背景|人物背景|角色背景|生平)(?:\*{1,2}|__)?\s*[：:=]/im,/(?:^|\n)\s*(?:[-*]\s*)?(?:\*{1,2}|__)?(?:喜好|厌恶|习惯|口癖|语气|说话方式)(?:\*{1,2}|__)?\s*[：:=]/im].filter(pattern=>pattern.test(sample)).length;return structure||nameField||signals>=2||signals===1&&!!companionFieldPersonName(title);
  }
  function companionContentPersonScore(value){const sample=String(value||'').slice(0,5000);let score=0;if(/(?:^|[\n,{])\s*["'`]?\s*(?:姓名|名字|角色名|人物名|角色姓名|人物姓名|全名|本名|昵称|name|character\s*name)\s*["'`]?\s*[：:=]/im.test(sample))score+=4;if(/(?:^|\n)\s*(?:[-*]\s*)?(?:年龄|性别|生日|身高|身份|职业|种族|阵营)\s*[：:=]/im.test(sample))score+=2;if(/(?:^|\n)\s*(?:[-*]\s*)?(?:性格|外貌|发色|瞳色|穿着|喜好|厌恶|口癖|语气|习惯|经历)\s*[：:=]/im.test(sample))score+=1;if(/(?:^|[\n。！？!?])[^\n。！？!?]{0,24}(?:他|她)(?:是|的|会|喜欢|讨厌|拥有|曾经|正在)/m.test(sample))score+=1;return score;}
  function companionContentMentionsPerson(value,name){const content=String(value||''),candidate=String(name||'').trim();if(!content||!candidate)return false;const escaped=candidate.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');try{return new RegExp(`(?:^|\\n)\\s*(?:[-*]\\s*)?(?:#{1,6}\\s*)?${escaped}\\s*(?=$|\\n|[（(，,：:]|是|为|的)`,/[\p{Script=Han}]/u.test(candidate)?'mu':'imu').test(content);}catch{return false;}}
  function companionFieldPersonName(value){const raw=String(value||'').trim().replace(/^["'`“”‘’《》【】「」『』\s]+|["'`“”‘’《》【】「」『』\s]+$/g,''),first=raw.split(/\s*(?:[（(\[【，,；;。]|、|\||\/(?!\/)|\b(?:aka|alias)\b)\s*/i)[0];return companionLikelyPersonName(first);}
  function companionPlainProfileText(value){return String(value||'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<\/(?:p|div|section|article|li|h[1-6])\s*>/gi,'\n').replace(/<[^>]+>/g,' ').replace(/\r/g,'').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();}
  function companionPossessivePersonName(value){const label=companionPlainProfileText(value).trim().replace(/^[#*\-\s【\[「『（(]+|[】\]」』）)\s]+$/g,'').replace(/[：:].*$/,'').trim(),match=label.match(/^(.{2,18}?)的(?:态度|性格|外貌|身份|立场|看法|印象|关系|经历|记忆|秘密|目标|动机|弱点|喜好|厌恶|习惯|语气|口癖|设定|档案|简介)$/);if(!match)return'';const subject=match[1].trim().replace(/^(?:原男主|原女主|男主|女主|主角|配角|心腹)\s*[：:=\-—]?\s*/,'');if(!subject||/(?:用户|玩家|对方|别人|众人|所有人|大家|自己|彼此|当前|过去|未来|觉醒|客观|关键|整体|总体|对)/.test(subject))return'';return companionFieldPersonName(subject);}
  function companionEntryCandidates(entry,key){
    const scores=new Map(),add=(value,score,field=false)=>{const name=field?companionFieldPersonName(value):companionLikelyPersonName(value);if(name)scores.set(name,Math.max(scores.get(name)||0,score));},title=companionEntryTitle(entry,key),content=String(entry?.content||''),sample=companionPlainProfileText(content).slice(0,8000),profileScore=companionContentPersonScore(sample),sources=[title,...companionEntryKeyValues(entry)];
    for(const match of sample.matchAll(/(?:^|[\n,{])\s*(?:[-*]\s*)?["'`]?\s*(?:姓名|名字|角色名|人物名|角色姓名|人物姓名|全名|本名|昵称|name|character\s*name)\s*["'`]?\s*[：:=]\s*["'`“”‘’《》【】「」『』]?\s*([^\n,，;；。"'`}]{1,48})/gim))add(match[1],12,true);
    for(const match of sample.matchAll(/(?:^|\n)\s*(?:[-*]\s*)?(?:原男主|原女主|男主|女主|主角|配角|心腹|恋人|爱人|伴侣|丈夫|妻子|父亲|母亲|哥哥|姐姐|弟弟|妹妹|朋友|同事|上司|下属)\s*[：:=]\s*([^\n，,；;。]{1,32})/g))add(match[1],11,true);
    for(const value of[...sources,...sample.split('\n').slice(0,500)]){const name=companionPossessivePersonName(value);if(name)add(name,10);}
    for(const match of sample.matchAll(/(?:^|\n)\s*(?:[-*#]\s*)?([\p{L}\p{M}·.'’\-\s]{2,24})\s*[（(]\s*(?:原男主|原女主|男主|女主|主角|配角|心腹|恋人|爱人|伴侣|丈夫|妻子|朋友|同事|上司|下属)\s*[）)]/gu))add(match[1],10,true);
    if(profileScore>0)for(const match of sample.slice(0,2400).matchAll(/(?:^|\n)\s*#{1,6}\s+([^\n]{2,32})/g))add(match[1],7+Math.min(profileScore,3),true);
    for(const match of sample.slice(0,3000).matchAll(/(?:^|\n)\s*(?:[-*]\s*)?(?:#{1,6}\s*)?([\p{L}\p{M}·.'’\-\s]{2,24})\s*[，,]\s*(?:男|女|年龄|性别|生日|身高|身份|职业|种族|阵营)(?=$|[\s，,。；;：:（(])/gu))add(match[1],9,true);
    for(const match of sample.slice(0,3000).matchAll(/(?:^|\n)\s*(?:[-*]\s*)?(?:#{1,6}\s*)?([\p{L}\p{M}·.'’\-\s]{2,24})\s*(?:是|为|系)\s*(?:一名|一位|一个)?\s*(?:男性|女性|男人|女人|男生|女生|人物|角色|学生|老师|教师|医生|警察|记者|作家|歌手|演员|律师|老板|公主|王子|贵族|人类)(?=$|[\s，,。；;：:（(])/gu))add(match[1],9,true);
    for(const match of sample.slice(0,3000).matchAll(/(?:^|\n)\s*(?:[-*]\s*)?(?:#{1,6}\s*)?([\p{L}\p{M}·.'’\-\s]{2,24})\s*[：:]\s*(?:年龄|性别|生日|身高|身份|职业|性格|外貌)\s*[：:=]/gu))add(match[1],9,true);
    if(profileScore>0)for(const source of sources){const name=companionLikelyPersonName(source);if(name&&companionContentMentionsPerson(sample,name))add(name,6+Math.min(profileScore,3));}
    return[...scores.entries()].filter(([,score])=>score>=6).map(([name])=>name);
  }
  function companionPersonaEntryCandidates(entry,key){
    if(!companionEntryPersonaEvidence(entry,key))return[];const sample=companionPlainProfileText(entry?.content).slice(0,8000),explicit=[];for(const match of sample.matchAll(/(?:^|[\n,{])\s*(?:[-*]\s*)?(?:\*{1,2}|__)?["'`]?\s*(?:姓名|名字|角色名|人物名|角色姓名|人物姓名|全名|本名|昵称|name|character\s*name)\s*["'`]?(?:\*{1,2}|__)?\s*[：:=]\s*["'`“”‘’《》【】「」『']?\s*([^\n,，;；。"'`}]{1,48})/gim)){const name=companionFieldPersonName(match[1]);if(name&&!explicit.includes(name))explicit.push(name);}if(explicit.length)return explicit;const titleName=companionFieldPersonName(companionEntryTitle(entry,key));if(titleName)return[titleName];const layout=[];for(const pattern of[/(?:^|\n)\s*(?:[-*#]\s*)?([\p{L}\p{M}·.'’\-\s]{2,24})\s*[，,]\s*(?:男|女|年龄|性别|生日|身高|身份|职业|种族|阵营)(?=$|[\s，,。；;：:（(])/gu,/(?:^|\n)\s*(?:[-*#]\s*)?([\p{L}\p{M}·.'’\-\s]{2,24})\s*[：:]\s*(?:年龄|性别|生日|身高|身份|职业|性格|外貌)\s*[：:=]/gu])for(const match of sample.slice(0,3000).matchAll(pattern)){const name=companionFieldPersonName(match[1]);if(name&&!layout.includes(name))layout.push(name);}if(layout.length)return layout;const keywordNames=[...new Set(companionEntryKeyValues(entry).map(companionLikelyPersonName).filter(Boolean))];return keywordNames.length===1?keywordNames:[];
  }
  function companionCharacterDescription(info=baseCompanionCharacter()){const data=info.character?.data||{},saved=String(info.character?.description||data.description||'').trim(),live=companionLiveDescription(info.character);return[...new Set([live,saved].filter(Boolean))].join('\n\n');}
  function companionDescriptionSignature(info=baseCompanionCharacter()){return companionMemberId(`description:${companionCharacterDescription(info)}`);}
  function companionDescriptionProfile(value,name){const text=companionPlainProfileText(value),lines=text.split('\n'),hits=[];for(let index=0;index<lines.length;index++)if(lines[index].includes(name)){const block=lines.slice(Math.max(0,index-1),Math.min(lines.length,index+7)).join('\n').trim();if(block&&!hits.includes(block))hits.push(block);}if(hits.length)return hits.join('\n\n').slice(0,5000);const at=text.indexOf(name);return at>=0?text.slice(Math.max(0,at-500),at+1500).trim():'';}
  function assignCompanionGlyphs(members){const counts=new Map();for(const member of members){if(member.customGlyph)continue;const glyph=Array.from(member.name||'角').slice(-1)[0]||'角';counts.set(glyph,(counts.get(glyph)||0)+1);member.glyph=glyph;}for(const member of members)if(!member.customGlyph&&counts.get(member.glyph)>1)member.glyph=Array.from(member.name||'角色').slice(-2).join('');}
  function rebuildCompanionAutoRoster(roster){const snapshot={members:Array.isArray(roster.members)?roster.members.slice():[],publicRefs:Array.isArray(roster.publicRefs)?roster.publicRefs.slice():[],scannedAt:roster.scannedAt||0,scanVersion:roster.scanVersion||0,descriptionSignature:roster.descriptionSignature||''};roster.members=snapshot.members.filter(member=>member.manual||member.isBaseCharacter||member.isContextCharacter).map(member=>member.manual?member:{...member,refs:[],profileText:''});roster.publicRefs=[];roster.scannedAt=0;roster.scanVersion=0;roster.descriptionSignature='';return snapshot;}
  function restoreCompanionAutoRoster(roster,snapshot){if(!snapshot)return;roster.members=snapshot.members;roster.publicRefs=snapshot.publicRefs;roster.scannedAt=snapshot.scannedAt;roster.scanVersion=snapshot.scanVersion;roster.descriptionSignature=snapshot.descriptionSignature;}
  async function scanCompanionRoster({force=false,rebuild=false,notify=true}={}){
    const base=baseCompanionCharacter(),roster=companionRoster(base),descriptionSignature=companionDescriptionSignature(base);if(!force&&!rebuild&&roster.scannedAt&&roster.scanVersion===COMPANION_ROSTER_SCAN_VERSION&&roster.descriptionSignature===descriptionSignature)return roster;const rebuildSnapshot=rebuildCompanionAutoRoster(roster),previous=rebuildSnapshot.members,load=base.ctx?.loadWorldInfo,canLoad=typeof load==='function',detected=new Map(),publicRefs=[],baseMember=syncBaseCompanionMember(roster,base),baseName=baseMember?cleanCompanionPersonName(baseMember.sourceName||baseMember.name):'',excluded=name=>(roster.excludedNames||[]).some(value=>cleanCompanionPersonName(value)===name);if(baseMember&&baseName)detected.set(baseName,{name:baseName,avatar:String(baseMember.avatar||base.character?.avatar||''),refs:[],isBaseCharacter:true});
    try{const books=canLoad?await companionRosterBookNames(base):[],description=companionCharacterDescription(base),descriptionNames=description?companionEntryCandidates({comment:'角色描述',content:description},'character-description'):[];for(const name of descriptionNames){if(excluded(name))continue;if(!detected.has(name))detected.set(name,{name,avatar:'',refs:[],profileText:companionDescriptionProfile(description,name)});else if(!detected.get(name).profileText)detected.get(name).profileText=companionDescriptionProfile(description,name);}
      for(const bookName of books){const book=await load(bookName);for(const [key,entry] of Object.entries(book?.entries||{})){if(!entry||entry.disable===true||entry.enabled===false||!String(entry.content||'').trim())continue;const title=companionEntryTitle(entry,key),uid=String(entry.uid??key),ref={book:bookName,uid,title};if(entry.constant===true||/关系|公共|通用|世界观|背景/.test(title))publicRefs.push(ref);if(!companionEntryPersonaEvidence(entry,key))continue;const avatar=companionEntryAvatar(entry),names=companionPersonaEntryCandidates(entry,key);for(const name of names){if(excluded(name))continue;if(!detected.has(name))detected.set(name,{name,avatar:'',refs:[]});const candidate=detected.get(name);if(!candidate.avatar&&avatar)candidate.avatar=avatar;if(!candidate.refs.some(item=>item.book===ref.book&&item.uid===ref.uid))candidate.refs.push(ref);}}}
      const members=[...detected.values()].map(candidate=>{const old=previous.find(item=>(item.sourceName||item.name)===candidate.name)||previous.find(item=>cleanCompanionPersonName(item.sourceName||item.name)===candidate.name);return{id:old?.id||companionMemberId(candidate.name),name:old?.name&&cleanCompanionPersonName(old.name)!==candidate.name?old.name:candidate.name,sourceName:candidate.name,glyph:old?.glyph||'',customGlyph:!!old?.customGlyph,avatar:old?.customAvatar?old.avatar||'':candidate.avatar||'',customAvatar:!!old?.customAvatar,chatTone:String(old?.chatTone||'').slice(0,160),manual:!!old?.manual,refs:candidate.refs,profileText:String(candidate.profileText||'').slice(0,6000),isBaseCharacter:!!candidate.isBaseCharacter||!!old?.isBaseCharacter,isContextCharacter:!!old?.isContextCharacter,characterAvatar:String(old?.characterAvatar||'')};});for(const old of previous.filter(item=>item.manual||item.isContextCharacter)){if(members.some(item=>item.id===old.id||cleanCompanionPersonName(item.name)===cleanCompanionPersonName(old.name)))continue;members.push(old.manual?old:{...old,refs:[],profileText:''});}assignCompanionGlyphs(members);roster.members=members;syncContextCompanionMembers(roster,base);roster.publicRefs=[...new Map(publicRefs.map(ref=>[`${ref.book}:${ref.uid}`,ref])).values()].slice(0,20);roster.selectedId=roster.members.some(item=>item.id===roster.selectedId)?roster.selectedId:roster.members[0]?.id||'';roster.groupIds=(roster.groupIds||[]).filter(id=>roster.members.some(item=>item.id===id));if(!roster.groupIds.length)roster.groupIds=roster.members.slice(0,Math.min(4,roster.members.length)).map(item=>item.id);for(const group of roster.groups||[])group.memberIds=(group.memberIds||[]).filter(id=>roster.members.some(member=>member.id===id));roster.groups=(roster.groups||[]).filter(group=>(group.memberIds||[]).length>=2);if(!roster.groups.some(group=>group.id===roster.activeGroupId))roster.activeGroupId='';roster.scannedAt=Date.now();roster.scanVersion=COMPANION_ROSTER_SCAN_VERSION;roster.descriptionSignature=descriptionSignature;save();if(notify)toast(roster.members.length>=2?'success':'info',roster.members.length>=2?`已重新识别 ${roster.members.length} 位人物`:'已保留当前角色卡人物，没有识别到其他明确人物');return roster;
    }catch(error){restoreCompanionAutoRoster(roster,rebuildSnapshot);console.warn('[音乐播放器] 多人角色扫描失败',error);if(notify)toast('error',`多人角色扫描失败：${error.message}`);return roster;}
  }
  async function ensureCompanionRosterScan(){const base=baseCompanionCharacter(),roster=companionRoster(base),descriptionSignature=companionDescriptionSignature(base);if(roster.scanning||(roster.scannedAt&&roster.scanVersion===COMPANION_ROSTER_SCAN_VERSION&&roster.descriptionSignature===descriptionSignature))return roster;roster.scanning=true;try{const result=await scanCompanionRoster({notify:false});renderCompanionDialog();return result;}finally{delete roster.scanning;save();}}
  async function companionMultiWorldText(info){
    const load=info.ctx?.loadWorldInfo;if(typeof load!=='function')return'';const books=new Map(),refs=[...(info.roster?.publicRefs||[]),...info.targetMembers.flatMap(member=>member.refs||[])];
    const unlinked=info.targetMembers.filter(member=>!(member.refs||[]).length);if(unlinked.length)for(const bookName of await companionRosterBookNames(info.base||info))try{if(!books.has(bookName))books.set(bookName,await load(bookName));for(const [key,entry] of Object.entries(books.get(bookName)?.entries||{})){if(!entry||entry.disable===true||entry.enabled===false||!String(entry.content||'').trim()||!companionEntryPersonaEvidence(entry,key))continue;const names=companionPersonaEntryCandidates(entry,key);for(const member of unlinked){const memberName=cleanCompanionPersonName(member.sourceName||member.name);if(memberName&&names.includes(memberName))refs.push({book:bookName,uid:String(entry?.uid??key),title:companionEntryTitle(entry,key)});}}}catch(error){console.warn(`[音乐播放器] 手动人物关联失败：${bookName}`,error);}
    const unique=[...new Map(refs.map(ref=>[`${ref.book}:${ref.uid}`,ref])).values()],parts=[];for(const ref of unique)try{if(!books.has(ref.book))books.set(ref.book,await load(ref.book));const entries=books.get(ref.book)?.entries||{},entry=Object.values(entries).find(item=>String(item?.uid)===String(ref.uid))||entries[ref.uid];if(entry&&String(entry.content||'').trim())parts.push(`【${ref.title||'设定'} · ${ref.book}】\n${String(entry.content).trim()}`);}catch(error){console.warn(`[音乐播放器] 读取人物条目失败：${ref.book}/${ref.uid}`,error);}return[...new Set(parts)].join('\n\n').slice(0,info.isGroup?18000:12000);
  }
  async function companionWorldText(info=companionCharacter()){if(info.isMulti)return companionMultiWorldText(info);const load=info.ctx?.loadWorldInfo;if(typeof load!=='function')return'';const names=await companionAttachedBookNames(info);if(!names.length)return'';const main=(info.ctx?.chat||[]).filter(message=>message&&String(message.mes||'').trim()).slice(-30).map(message=>String(message.mes).slice(0,2000)),privateChat=companionMessages(info).slice(-24).map(message=>String(message.content||'').slice(0,1800)),scan=[...main,...privateChat].join('\n');try{const parts=[];for(const name of names){const book=await load(name),entries=Object.values(book?.entries||{}).filter(entry=>companionWorldEntryActive(entry,scan)).sort((a,b)=>(Number(b.order)||0)-(Number(a.order)||0));for(const entry of entries)parts.push(`【世界书：${name}】\n${String(entry.content).trim()}`);}return[...new Set(parts)].join('\n\n').slice(0,12000);}catch(error){console.warn('[音乐播放器] 角色陪听世界书读取失败',error);return'';}}
  function companionApiBase(value){
    const input=String(value||'').trim();if(!input)throw Error('请先在陪听窗设置中填写 API 地址');
    let url;try{url=new URL(input);}catch{throw Error('API 地址必须以 http:// 或 https:// 开头');}
    if(!/^https?:$/.test(url.protocol)||url.username||url.password)throw Error('请使用不含用户名和密码的 http(s) API 地址');
    url.hash='';url.search='';url.pathname=url.pathname.replace(/\/+$/,'').replace(/\/(?:chat\/completions|models)$/i,'');
    if(!url.pathname||url.pathname==='/')url.pathname='/v1';
    return url.href.replace(/\/+$/,'');
  }
  function companionEndpoint(value){return `${companionApiBase(value)}/chat/completions`;}
  function companionModelsEndpoint(value){return `${companionApiBase(value)}/models`;}
  function companionApiError(message,key,status){
    let text=String(message||'API 请求失败');
    for(const secret of key?[key,encodeURIComponent(key),JSON.stringify(key).slice(1,-1)]:[])if(secret)text=text.split(secret).join('[已隐藏]');
    return Object.assign(Error(text.slice(0,500)),{status});
  }
  function companionRequestContext(){
    const ctx=context(),owner=typeof ctx?.getRequestHeaders==='function'?ctx:ROOT;
    if(typeof owner.getRequestHeaders!=='function'){
      if(ROOT.SillyTavern||ctx)throw Error('无法获取酒馆请求头，请刷新酒馆后重试');
      return null;
    }
    const headers=new Headers(owner.getRequestHeaders.call(owner)),token=headers.get('X-CSRF-Token');
    if(!token||token==='undefined'||token==='null')throw Error('酒馆 CSRF 请求头无效，请刷新酒馆后重试');
    headers.set('Content-Type','application/json');return{headers};
  }
  // Use the same authenticated ST routes as Cache Memory, for both models and chat.
  async function requestCompanionApi(kind,payload={}){
    const base=companionApiBase(settings.companionApiUrl),key=String(settings.companionApiKey||'').trim(),proxy=companionRequestContext(),models=kind==='models';
    const controller=new ROOT.AbortController(),timer=ROOT.setTimeout(()=>controller.abort(),models?30000:90000);
    try{
      let response;
      if(proxy){
        const nativeKeys=new Set(['model','messages','temperature','max_tokens','max_completion_tokens','stream']),extraBody=Object.fromEntries(Object.entries(payload).filter(([name,value])=>!nativeKeys.has(name)&&value!==undefined));
        const body={...payload,chat_completion_source:'custom',custom_url:base,custom_include_headers:JSON.stringify({Authorization:key?`Bearer ${key}`:''}),...(!models?{stream:false,custom_prompt_post_processing:'',...(Object.keys(extraBody).length?{custom_include_body:JSON.stringify(extraBody)}:{})}:{})};
        const request=ROOT.fetch.bind(ROOT);
        response=await request(models?'/api/backends/chat-completions/status':'/api/backends/chat-completions/generate',{method:'POST',credentials:'same-origin',headers:proxy.headers,body:JSON.stringify(body),signal:controller.signal});
      }else{
        const headers={'Content-Type':'application/json'};if(key)headers.Authorization=`Bearer ${key}`;
        response=await fetch(models?`${base}/models`:`${base}/chat/completions`,{method:models?'GET':'POST',headers,...(!models?{body:JSON.stringify(payload)}:{}),signal:controller.signal});
      }
      const raw=await response.text();let data;
      try{data=JSON.parse(raw);}catch{throw companionApiError(response.ok?'API 返回的不是 JSON 数据':`API 请求失败（HTTP ${response.status}），请检查接口地址或酒馆后端`,key,response.status);}
      if(!response.ok||data?.error){
        const detail=typeof data?.error==='string'?data.error:data?.error?.message||data?.message||(models?'上游未返回模型列表，请检查 API Key、接口地址或酒馆后端日志':'上游未返回有效回复');
        const status=Number(data?.upstream_status||data?.error?.status||data?.error?.status_code)||(!response.ok?response.status:undefined);
        throw companionApiError(`API 请求失败${status?`（HTTP ${status}）`:''}：${detail}`,key,status);
      }
      return data;
    }catch(error){
      if(error?.name==='AbortError')throw Error('API 请求超时，请稍后重试');
      if(error instanceof TypeError)throw Error(proxy?'酒馆后端连接失败，请确认酒馆在线后重试':'API 连接失败，请检查地址与网络；酒馆中会自动使用后端转发');
      throw companionApiError(error?.message||'API 请求失败',key,error?.status);
    }finally{ROOT.clearTimeout(timer);}
  }
  function companionModelIds(data){
    const rows=[data,data?.data,data?.models,data?.data?.models,data?.result?.data,data?.result?.models].find(Array.isArray)||[];
    return [...new Set(rows.map(row=>typeof row==='string'?row:row?.id||row?.model_id||row?.model||row?.name||'').filter(value=>typeof value==='string').map(value=>value.trim()).filter(Boolean))].sort();
  }
  function companionCompletionPayload(model,messages,recommendation=false){
    const payload={model,messages,temperature:.85,max_tokens:Math.max(32,Math.min(4096,Number(settings.companionMaxTokens)||300)),stream:false};
    const endpoint=new URL(companionApiBase(settings.companionApiUrl)),host=endpoint.hostname;
    // These Ark DeepSeek V4/V4.1 models default to thinking. Keep the short reply
    // budget for actual conversation rather than silently spending it on reasoning.
    if(/(?:^|\.)(?:volces|bytepluses)\.com$/i.test(host)&&/^deepseek-v4(?:-1)?-(?:flash|pro)(?:-|$)/i.test(model.replace(/\./g,'-')))payload.thinking={type:'disabled'};
    if(recommendation&&(/(?:^|\.)ollama\.com$/i.test(host)||endpoint.port==='11434')&&/^deepseek-v4(?:[.-]1)?-(?:flash|pro)(?:[-:]|$)/i.test(model))payload.reasoning_effort='none';
    return payload;
  }
  function companionResponseText(data){
    const text=value=>{
      if(typeof value==='string')return value;
      if(Array.isArray(value))return value.map(part=>{
        if(typeof part==='string')return part;
        if(!part||/(?:reason|think|analysis|tool)/i.test(String(part.type||'')))return '';
        return typeof part.text==='string'?part.text:typeof part.text?.value==='string'?part.text.value:typeof part.content==='string'?part.content:'';
      }).join('');
      return '';
    };
    const choice=data?.choices?.[0],candidates=[choice?.message?.content,choice?.text,data?.output_text,data?.response,choice?.message?.refusal];
    for(const candidate of candidates){const result=text(candidate);if(result.trim())return result;}
    if(Array.isArray(data?.output))return data.output.filter(item=>item?.type==='message'&&(!item.role||item.role==='assistant')).map(item=>text(item.content)).filter(Boolean).join('\n');
    return '';
  }
  function companionEmptyReplyError(data,hadText=false){
    const choice=data?.choices?.[0],reason=String(choice?.finish_reason||''),message=choice?.message;
    if(reason==='content_filter')return Error('服务商过滤了本次回复，没有返回可显示的正文');
    const reasoning=!!message?.reasoning_content||!!message?.reasoning||!!message?.thinking||Number(data?.usage?.completion_tokens_details?.reasoning_tokens)>0;
    if(reason==='length')return Error(reasoning?'模型在思考阶段达到输出长度上限，尚未生成正文；请检查关闭思考是否生效或调整最大回复 token':'模型达到输出长度上限，没有生成可显示的正文；请调整最大回复 token');
    if(reasoning)return Error('模型只返回了思考内容，没有最终回复；请检查接口是否支持关闭思考');
    if(reason==='tool_calls'||message?.tool_calls?.length)return Error('模型返回了工具调用，没有可显示的聊天正文');
    return Error(hadText?'模型回复清理后为空，请重试或调整角色提示词':'模型没有返回可显示的文字');
  }
  function casualizeCompanionPunctuation(value){return String(value||'').split(/\r?\n/).map(line=>{if(/^\s*(?:[-*]\s*)?(?:\*{0,2})?(?:SELENE_SONG|选择|播放|推荐|选歌|歌曲|歌名|歌曲名|歌手|艺术家|作曲者|title|song|artist|singer|composer)\s*[：:]/i.test(line))return line.trim();return line.replace(/(?:——|—|─|━|–|--|～|~)+/g,' ').replace(/(?:……|…+|\.{2,})/g,' ').replace(/[；;]/g,'，').replace(/。+/g,' ').replace(/\.(?=\s*$)/g,'').replace(/[ \t]+/g,' ').replace(/\s+([，！？?!])/g,'$1').trim();}).filter(Boolean).join('\n').trim();}
  function cleanCompanionText(value,{songChoice=false}={}){let text=String(value||'').replace(/^\s*```[^\n]*\n?/i,'').replace(/\n?```\s*$/,'');const hidden='(?:[A-Za-z0-9_-]*(?:status|state|analysis|thinking|reasoning)[A-Za-z0-9_-]*|think|metadata|tool_call|tool|system)';text=text.replace(new RegExp(`<\\s*(${hidden})\\b[^>]*>[\\s\\S]*?(?:<\\s*\\/\\s*\\1\\s*>|$)`,'gi'),'').replace(new RegExp(`\\[\\s*(${hidden})\\s*\\][\\s\\S]*?(?:\\[\\s*\\/\\s*\\1\\s*\\]|$)`,'gi'),'').replace(new RegExp(`<\\/?(?:${hidden})\\b[^\\n>]*(?:>|$)`,'gi'),'').replace(/<br\s*\/?>/gi,'\n').replace(/<\/(?:div|p|section|article|li|blockquote|h[1-6])\s*>/gi,'\n').replace(/<\/?[A-Za-z][A-Za-z0-9_:-]*(?:\s[^<>\n]*)?(?:>|(?=\n|$))/g,'');const decoder=DOC.createElement('textarea');decoder.innerHTML=text;text=decoder.value;const lines=[],rawLines=text.replace(/\r/g,'').replace(/[ \t]+\n/g,'\n').split('\n');for(const raw of rawLines){const line=raw.trimEnd(),previous=lines[lines.length-1];if(!songChoice&&/^[\[\]{}]+$/.test(line.trim()))continue;if(line.trim()&&line.trim()===previous?.trim())continue;lines.push(line);}return lines.join('\n').replace(/\n{3,}/g,'\n\n').trim();}
  function normalizeCompanionReply(value,characterInfo=companionCharacter()){let reply=cleanCompanionText(Array.isArray(value)?value.map(x=>typeof x==='string'?x:x?.text||x?.content||'').join(''):value),group=!!characterInfo?.isGroup,name=String(typeof characterInfo==='string'?characterInfo:characterInfo?.name||'').toLowerCase();if(!group)for(const prefix of[`${name}:`,`${name}：`,'assistant:','assistant：','当前角色:','当前角色：'])if(reply.toLowerCase().startsWith(prefix)){reply=reply.slice(prefix.length).trim();break;}reply=reply.replace(/(^|\n)\s*[（(][^（）()\n]{1,240}[）)]\s*/g,'$1').replace(/^\s+|\s+$/g,'');return casualizeCompanionPunctuation(reply);}
  async function requestCustomCompanion(taskPrompt='',recommendation=false){
    const info=companionCharacter(),model=String(settings.companionModel||'').trim();if(!model)throw Error('请先在陪听窗设置中填写或选择模型名');
    const recentChat=companionMainContextRows(info),privateChat=companionMessages(info).slice(-24).map(message=>({role:message.role==='assistant'?'assistant':'user',content:(message.role==='assistant'?cleanCompanionText(message.content):String(message.content||'')).slice(0,1800)}));
    const messages=[{role:'system',content:companionInstruction(info)},...recentChat,...privateChat];if(taskPrompt)messages.push({role:'user',content:String(taskPrompt).slice(0,5000)});
    const data=await requestCompanionApi('completion',companionCompletionPayload(model,messages,recommendation)),text=companionResponseText(data);
    const reply=recommendation?cleanCompanionText(text,{songChoice:true}):normalizeCompanionReply(text,info);if(!reply)throw companionEmptyReplyError(data,!!text.trim());return reply;
  }
  async function requestSillyTavernCompanion(taskPrompt='',recommendation=false){const info=companionCharacter(),generate=info.ctx?.generateQuietPrompt;if(typeof generate!=='function')throw Error('当前 SillyTavern 没有提供 generateQuietPrompt()，请更新 SillyTavern 或改用自定义 API');if(info.ctx?.characterId===undefined&&(info.ctx?.groupId===undefined||info.ctx?.groupId===null))throw Error('请先在 SillyTavern 中打开一个角色或群聊');const task=taskPrompt?`\n\n本次额外任务：${taskPrompt}`:'',contextHistory=companionMainContextText(info),ending=recommendation?'请按本次选歌任务的格式，保留独立的 SELENE_SONG 行。':info.isGroup?'请只输出本轮自然接话的人物回复，并严格保留“角色名：内容”格式：':`请只写 ${info.name} 接下来的回复：`,prompt=`${companionInstruction(info)}${contextHistory?`\n\n当前主聊天中与该联系人有关的上下文：\n${contextHistory}`:''}\n\n下面是这位联系人在陪听小窗内的独立历史（它不会写入主聊天）：\n${companionHistoryText(info)||'用户刚刚打开陪听小窗。'}${task}\n\n${ending}`,raw=await generate.call(info.ctx,{quietPrompt:prompt,responseLength:Math.max(32,Math.min(4096,Number(settings.companionMaxTokens)||300)),trimToSentence:false,removeReasoning:true,skipWIAN:true}),reply=recommendation?cleanCompanionText(raw,{songChoice:true}):normalizeCompanionReply(raw,info);if(!reply)throw Error('SillyTavern 当前模型没有返回文字');return reply;}
  async function generateCompanionReply(taskPrompt='',recommendation=false){activeCompanionWorldText=await companionWorldText();try{return settings.companionMode==='sillytavern'?await requestSillyTavernCompanion(taskPrompt,recommendation):await requestCustomCompanion(taskPrompt,recommendation);}finally{activeCompanionWorldText='';}}
  async function speakCompanionReply(text,info=companionCharacter()){if(info.isGroup||!settings.companionTts||settings.companionQuiet||!String(text||'').trim())return;const execute=info.ctx?.executeSlashCommandsWithOptions||info.ctx?.executeSlashCommands;if(typeof execute!=='function'){toast('warning','当前 SillyTavern 无法调用 TTS 命令');return;}const quote=value=>String(value).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/[\n\r]+/g,' '),voice=quote(info.name),words=quote(String(text).slice(0,1000));try{await execute(`/speak voice="${voice}" "${words}"`,{handleParserErrors:false});}catch(error){console.warn('[音乐播放器] 陪听 TTS 失败',error);toast('warning','TTS 没有播放，请检查 SillyTavern 语音映射');}}
  async function fetchCompanionModels(){
    const dialog=DOC.getElementById(`${ID}-companion`),status=dialog?.querySelector('[data-model-status]'),button=dialog?.querySelector('[data-fetch-models]');
    if(button?.disabled)return;if(button)button.disabled=true;if(status)status.textContent='正在获取模型…';
    const url=settings.companionApiUrl,key=settings.companionApiKey;
    try{
      const data=await requestCompanionApi('models');if(url!==settings.companionApiUrl||key!==settings.companionApiKey)return;
      const models=companionModelIds(data);if(!models.length)throw Error('接口没有返回模型列表；仍可手动填写控制台中的模型名称');
      settings.companionModels=models;save();renderCompanionModelOptions(dialog);openCompanionModelPicker(dialog);
      if(status)status.textContent=`已获取 ${models.length} 个模型`;toast('success',`已获取 ${models.length} 个模型`);
    }catch(error){
      if(url!==settings.companionApiUrl||key!==settings.companionApiKey)return;
      let message=error.message;
      if(/\/api\/coding\/v3(?:\/|$)/i.test(url)&&(error.status===404||/(?:没有返回|未返回)模型列表/.test(message)))message+='；Coding Plan 可手动填写 ark-code-latest 或控制台提供的模型名';
      if(status)status.textContent=message;toast('error',`获取模型失败：${message}`);
    }finally{if(button)button.disabled=false;}
  }
  function openCompanionModelPicker(dialog=DOC.getElementById(`${ID}-companion`)){const picker=dialog?.querySelector('[data-model-picker]');if(!picker||picker.disabled)return;try{if(typeof picker.showPicker==='function')picker.showPicker();else{picker.focus();picker.click();}}catch{picker.focus();}}
  function renderCompanionModelOptions(dialog=DOC.getElementById(`${ID}-companion`)){const picker=dialog?.querySelector('[data-model-picker]'),input=dialog?.querySelector('[name=companionModel]'),toggle=dialog?.querySelector('[data-toggle-models]'),models=Array.isArray(settings.companionModels)?settings.companionModels:[];if(!picker)return;picker.innerHTML='<option value="">选择模型</option>'+models.map(model=>`<option value="${esc(model)}">${esc(model)}</option>`).join('');picker.value=models.includes(input?.value)?input.value:'';picker.disabled=!models.length;if(toggle)toggle.disabled=!models.length;}
  function bindCompanionModelMenu(dialog){const input=dialog?.querySelector('[name=companionModel]'),picker=dialog?.querySelector('[data-model-picker]');if(!input||!picker||picker.dataset.bound)return;picker.dataset.bound='1';picker.onchange=()=>{const choice=picker.value;if(!choice)return;input.value=choice;settings.companionModel=choice;save();input.dispatchEvent(new ROOT.Event('change',{bubbles:true}));input.focus();};input.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();openCompanionModelPicker(dialog);}};renderCompanionModelOptions(dialog);}
  function companionSharedList(info=companionCharacter()){const bucket=companionBucket('companionSharedSongs',info);if(!Array.isArray(bucket.value))bucket.root[bucket.key]=[];return bucket.root[bucket.key];}
  function companionMemoryList(info=companionCharacter()){const bucket=companionBucket('companionMemories',info);if(!bucket.value||typeof bucket.value!=='object'||Array.isArray(bucket.value))bucket.root[bucket.key]={};return bucket.root[bucket.key];}
  function companionPickedEntries(info=companionCharacter()){return Object.values(companionMemoryList(info)).filter(entry=>(Number(entry?.pickedByCharacter)||0)>0&&entry?.song).sort((a,b)=>(Number(b.lastPickedAt)||Number(b.lastListenedAt)||0)-(Number(a.lastPickedAt)||Number(a.lastListenedAt)||0));}
  function companionWasPicked(choice,info=companionCharacter()){const key=offlineKey(choice);return!!key&&companionPickedEntries(info).some(entry=>offlineKey(entry.song)===key);}
  function companionPickedPrompt(info=companionCharacter(),limit=30){const rows=companionPickedEntries(info).slice(0,Math.max(0,Number(limit)||0));return rows.length?rows.map(entry=>`《${entry.song.title}》 | ${entry.song.artist}`).join('\n'):'暂无';}
  function companionExplicitlyRequestedChoice(choice,userText=''){const title=normalizeSongText(choice?.title),text=normalizeSongText(userText);return title.length>=2&&text.includes(title);}
  function companionTicketList(info=companionCharacter()){const bucket=companionBucket('companionTickets',info);if(!Array.isArray(bucket.value))bucket.root[bucket.key]=[];return bucket.root[bucket.key];}
  function companionListeningRoot(){settings.companionListeningStats=settings.companionListeningStats&&typeof settings.companionListeningStats==='object'&&!Array.isArray(settings.companionListeningStats)?settings.companionListeningStats:{};return settings.companionListeningStats;}
  function companionListeningDateKey(value=Date.now()){const date=new Date(value),pad=number=>String(number).padStart(2,'0');return`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;}
  function companionListeningDelta(mediaDelta,wallDelta,rate=1){const media=Number(mediaDelta),wall=Number(wallDelta),speed=Math.max(.25,Math.min(4,Number(rate)||1));if(!Number.isFinite(media)||!Number.isFinite(wall)||media<=0||wall<=0)return 0;return Math.max(0,Math.min(wall,media/speed));}
  function companionListeningContext(){const dialog=DOC.getElementById(`${ID}-companion`);if(!dialog||dialog.hidden)return null;const info=companionCharacter();if(info.isMulti&&info.roster?.phoneView==='home')return null;return{info,key:companionConversationKey(info)};}
  function companionListeningStatsForKey(key){const root=companionListeningRoot();if(!root[key]||typeof root[key]!=='object'||Array.isArray(root[key]))root[key]={totalSeconds:0,daily:{},songs:{},firstAt:0,lastAt:0};const stats=root[key];stats.daily=stats.daily&&typeof stats.daily==='object'&&!Array.isArray(stats.daily)?stats.daily:{};stats.songs=stats.songs&&typeof stats.songs==='object'&&!Array.isArray(stats.songs)?stats.songs:{};return stats;}
  function addCompanionListeningTime(key,song,seconds,now=Date.now()){const amount=Number(seconds);if(!key||!song||!Number.isFinite(amount)||amount<=0)return;const stats=companionListeningStatsForKey(key),day=companionListeningDateKey(now),songKey=offlineKey(song)||`${song.title||''}:${song.artist||''}`;stats.totalSeconds=(Number(stats.totalSeconds)||0)+amount;stats.daily[day]=(Number(stats.daily[day])||0)+amount;stats.firstAt=Number(stats.firstAt)||now;stats.lastAt=now;const entry=stats.songs[songKey]||{song:strip(song),seconds:0,firstAt:now,lastAt:now};entry.song=strip(song);entry.seconds=(Number(entry.seconds)||0)+amount;entry.lastAt=now;stats.songs[songKey]=entry;const days=Object.keys(stats.daily).sort();for(const oldDay of days.slice(0,Math.max(0,days.length-370)))delete stats.daily[oldDay];const songs=Object.entries(stats.songs);if(songs.length>100)for(const [oldKey] of songs.sort(([,a],[,b])=>(Number(a.seconds)||0)-(Number(b.seconds)||0)||(Number(a.lastAt)||0)-(Number(b.lastAt)||0)).slice(0,songs.length-100))delete stats.songs[oldKey];}
  function trackCompanionListeningTime({reset=false,stop=false,saveNow=false}={}){const now=Date.now(),mediaTime=Number(audio.currentTime),contextInfo=companionListeningContext(),active=!!contextInfo&&!!current&&!companionListeningAwaitingPlay&&!audio.paused&&!audio.ended&&Number.isFinite(mediaTime);if(reset)companionListeningClock=null;let added=0;if(companionListeningClock&&current&&offlineKey(current)===companionListeningClock.songKey){added=companionListeningDelta(mediaTime-companionListeningClock.mediaTime,(now-companionListeningClock.wallAt)/1000,audio.playbackRate);if(added)addCompanionListeningTime(companionListeningClock.key,companionListeningClock.song,added,now);}companionListeningClock=!stop&&active?{key:contextInfo.key,songKey:offlineKey(current),song:strip(current),mediaTime,wallAt:now}:null;if(added&&(saveNow||now-companionListeningSavedAt>=10000)){companionListeningSavedAt=now;save();}else if(saveNow){companionListeningSavedAt=now;save();}return added;}
  function formatCompanionListeningDuration(value){const seconds=Math.max(0,Math.floor(Number(value)||0));if(seconds<60)return`${seconds} 秒`;const minutes=Math.floor(seconds/60);if(minutes<60)return`${minutes} 分钟`;const hours=Math.floor(minutes/60),rest=minutes%60;return rest?`${hours} 小时 ${rest} 分钟`:`${hours} 小时`;}
  function companionRecentListeningSeconds(stats,days){let total=0,date=new Date();for(let index=0;index<days;index++){total+=Number(stats.daily?.[companionListeningDateKey(date)])||0;date=new Date(date.getFullYear(),date.getMonth(),date.getDate()-1,12);}return total;}
  function recordCompanionPlay(song){if(!song)return;const memories=companionMemoryList(),key=offlineKey(song),now=Date.now(),entry=memories[key]||{song:strip(song),firstListenedAt:now,plays:0,loops:0,pickedByCharacter:0};entry.song=strip(song);entry.lastListenedAt=now;entry.plays=(Number(entry.plays)||0)+1;memories[key]=entry;save();}
  function markCompanionPicked(song,info=companionCharacter()){if(!song)return;const memories=companionMemoryList(info),key=offlineKey(song),now=Date.now(),entry=memories[key]||{song:strip(song),firstListenedAt:now,plays:0,loops:0,pickedByCharacter:0};entry.song=strip(song);entry.pickedByCharacter=(Number(entry.pickedByCharacter)||0)+1;entry.lastPickedAt=now;memories[key]=entry;save();}
  function addCurrentToOurSongs(){if(!current){toast('warning','请先播放一首歌');return;}const list=companionSharedList(),key=offlineKey(current);if(list.some(song=>offlineKey(song)===key)){toast('info','这首已经是“我们的歌”了');return;}list.unshift(strip(current));save();toast('success',`已把《${current.title}》加入我们的歌`);showOurSongs();}
  function openCompanionFeature(title,html,onClick){const dialog=DOC.getElementById(`${ID}-companion`),panel=dialog?.querySelector('.companion-feature');if(!panel)return;panel.innerHTML=`<div class="companion-sheet-head"><b>${esc(title)}</b><button type="button" data-sheet-close>×</button></div><div class="companion-sheet-body">${html}</div>`;const roster=companionRoster(baseCompanionCharacter());panel.querySelectorAll('[data-person-edit]').forEach(article=>{const member=(roster.members||[]).find(item=>item.id===article.dataset.personEdit),source=article.querySelector('.companion-person-card-copy small');if(member?.isContextCharacter&&source)source.textContent='当前上下文 char 角色卡';});panel.hidden=false;panel.onclick=e=>{if(e.target.closest('[data-sheet-close]')){panel.hidden=true;return;}onClick?.(e);};}
  function showOurSongs(){
    const list=companionSharedList(),html=`<button type="button" data-our-add>＋ 把当前歌曲加入“我们的歌”</button><div class="companion-song-list">${list.map((song,i)=>`<div><span><b>${esc(song.title)}</b><small>${esc(song.artist)}</small></span><button data-our-play="${i}">▶</button><button data-our-playlist="${i}" title="加入歌单" aria-label="加入歌单">＋</button><button data-our-remove="${i}">×</button></div>`).join('')||'<p>还没有专属歌曲，先一起收藏第一首吧。</p>'}</div>`;
    openCompanionFeature('♡ 我们的歌',html,event=>{
      if(event.target.closest('[data-our-add]')){addCurrentToOurSongs();return;}
      const playlistButton=event.target.closest('[data-our-playlist]');
      if(playlistButton){const song=list[Number(playlistButton.dataset.ourPlaylist)];if(song)addSongToPlaylist(song);return;}
      const playButton=event.target.closest('[data-our-play]');
      if(playButton){play(list[Number(playButton.dataset.ourPlay)]);return;}
      const removeButton=event.target.closest('[data-our-remove]');
      if(removeButton){list.splice(Number(removeButton.dataset.ourRemove),1);save();showOurSongs();}
    });
  }
  function showCompanionMemories(){const rows=Object.values(companionMemoryList()).sort((a,b)=>(b.lastListenedAt||0)-(a.lastListenedAt||0)),html=rows.map(entry=>`<article class="memory-card"><b>${esc(entry.song?.title)} · ${esc(entry.song?.artist)}</b><small>第一次一起听：${new Date(entry.firstListenedAt).toLocaleDateString()}　播放 ${entry.plays||0} 次　循环 ${entry.loops||0} 次${entry.pickedByCharacter?`　角色点歌 ${entry.pickedByCharacter} 次`:''}</small></article>`).join('')||'<p>一起播放歌曲后，这里会留下音乐记忆。</p>';openCompanionFeature('✦ 音乐记忆',html);}
  function showCompanionListeningStats(){trackCompanionListeningTime({saveNow:true});const info=companionCharacter(),stats=companionListeningStatsForKey(companionConversationKey(info)),today=Number(stats.daily?.[companionListeningDateKey()])||0,week=companionRecentListeningSeconds(stats,7),songs=Object.values(stats.songs||{}).sort((a,b)=>(Number(b.seconds)||0)-(Number(a.seconds)||0)).slice(0,8),dates=stats.firstAt?`从 ${new Date(stats.firstAt).toLocaleDateString()} 开始${stats.lastAt?` · 最近 ${new Date(stats.lastAt).toLocaleString()}`:''}`:'播放歌曲后开始记录真实陪听时长',html=`<div class="companion-duration-summary"><article><b>${esc(formatCompanionListeningDuration(stats.totalSeconds))}</b><small>累计陪听</small></article><article><b>${esc(formatCompanionListeningDuration(today))}</b><small>今天</small></article><article><b>${esc(formatCompanionListeningDuration(week))}</b><small>近 7 天</small></article></div><p class="companion-duration-note">${esc(info.isGroup?`${info.name} · 群聊独立统计`:`${info.name} · 私聊独立统计`)}<br>${esc(dates)}</p><h4>陪听最久的歌曲</h4>${songs.map(entry=>`<article class="memory-card companion-duration-song"><span><b>${esc(entry.song?.title||'未知歌曲')}</b><small>${esc(entry.song?.artist||'未知歌手')}</small></span><strong>${esc(formatCompanionListeningDuration(entry.seconds))}</strong></article>`).join('')||'<p>保持角色陪听窗口开启并实际播放歌曲，这里就会开始累计。</p>'}`;openCompanionFeature('◷ 陪听时长',html);}
  function showCompanionTickets(){const list=companionTicketList(),html=list.map(ticket=>`<article class="ticket-card"><small>SELENE LISTENING TICKET · ${new Date(ticket.time).toLocaleString()}</small><b>${esc(ticket.song?.title)} · ${esc(ticket.song?.artist)}</b><p>${esc(ticket.quote)}</p></article>`).join('')||'<p>歌曲结束后可以生成一张角色评价票根。</p>';openCompanionFeature('🎫 听后票根',html);}
  async function runCompanionTask(prompt,{addToChat=false,tts=false,onReply,onError}={}){
    if(companionBusy||disposed)return '';
    const info=companionCharacter(),request=++companionRequest,isActive=()=>request===companionRequest&&!disposed;
    companionBusy=true;renderCompanionDialog();
    try{
      const reply=await generateCompanionReply(prompt,!!onReply);if(!isActive())return '';
      if(onReply)return await onReply(reply,isActive);
      if(addToChat){const messages=companionMessages(info);messages.push({role:'assistant',content:reply.slice(0,8000),time:Date.now()});setCompanionMessages(messages,info);save();if(tts)await speakCompanionReply(reply,info);}
      return reply;
    }catch(error){
      if(!isActive())return '';
      if(onError)onError(error);else{console.warn('[音乐播放器] 陪听任务失败',error);toast('error',`角色陪听失败：${error.message}`);}
      return '';
    }finally{
      if(request===companionRequest){companionBusy=false;renderCompanionDialog();if(companionMessageQueue.length&&!companionQueueDraining)Promise.resolve().then(drainCompanionMessageQueue);}
    }
  }
  async function createCompanionTicket({automatic=false}={}){if(!current||companionBusy)return;if(automatic&&(settings.companionQuiet||!settings.companionAutoTicket))return;const song=strip(current),reply=await runCompanionTask(`刚听完《${song.title}》— ${song.artist}。请用一句不超过45字、符合角色身份的话写听后评价，只输出评价本身。`);if(!reply)return;const list=companionTicketList();list.unshift({song,quote:reply.slice(0,180),time:Date.now()});if(list.length>30)list.length=30;save();if(!automatic){showCompanionTickets();toast('success','听后票根已生成');}}
  function isCompanionSongRequest(text){const value=String(text||'').replace(/\s+/g,'');if(!value||/(?:不想|不要|别|不用)(?:换|切|播|放|点|推荐)/.test(value))return false;return/(?:给我|帮我|可以|能不能|想|要|再)?(?:点|推荐|放|播放|来|换|切换)(?:一|下|个|首|点|这|那|别的|其他|另一|下一|歌曲|音乐){0,8}(?:歌|歌曲|音乐|首)|(?:我想听|我要听|想听听|播放|切到|换成).{0,40}/.test(value);}
  function companionSongField(value){return String(value||'').replace(/^[\s*`"'“”‘’《》【】]+|[\s*`"'“”‘’《》【】]+$/g,'').replace(/\s*(?:推荐理由|理由|因为)[：:].*$/i,'').trim();}
  function companionSongTitleField(value){return companionSongField(value).replace(/\s*[（(\[【][^）)\]】\n]*(?:电影|影视|电视剧|游戏|动漫|原声|ost|主题曲|插曲|片尾曲|那一首|版本)[^）)\]】\n]*[）)\]】]\s*$/i,'').trim();}
  function companionSongArtistField(value){return companionSongField(value).replace(/\s*(?:\([^()\n]*\)|（[^（）\n]*）|\[[^\[\]\n]*\]|【[^【】\n]*】)\s*$/,'').trim();}
  function companionSongChoice(title,artist){title=companionSongTitleField(title);artist=companionSongArtistField(artist);if(!title||!artist||/^(?:官方)?(?:歌名|歌曲名|歌曲)$/i.test(title)||/^(?:官方)?(?:歌手|艺术家|作曲者|歌手或作曲者)$/i.test(artist))return null;return{title,artist};}
  function parseCompanionSongChoice(reply){
    const text=String(reply||'').replace(/\*\*/g,'').trim();if(!text)return null;
    const jsonText=text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i)?.[1]||text.match(/\{[\s\S]*?\}/)?.[0];
    if(jsonText)try{const data=JSON.parse(jsonText),choice=companionSongChoice(data.title||data.name||data.song||data.songName,data.artist||data.singer||data.author||data.composer);if(choice)return choice;}catch{}
    const vertical=text.match(/(?:SELENE_SONG|选择|播放|推荐|选歌|歌曲)\s*[：:]\s*(?:\*{0,2}|`)?《?([^\n|｜》]+)》?(?:\*{0,2}|`)?\s*[|｜]\s*([^\n]+)/i);
    if(vertical){const choice=companionSongChoice(vertical[1],vertical[2]);if(choice)return choice;}
    const standaloneVertical=text.match(/(?:^|\n)\s*(?:[-•]\s*)?(?:\*{0,2}|`)?《?([^\n|｜》]{1,100}?)》?(?:\*{0,2}|`)?\s*[|｜]\s*([^\n]+)/i);
    if(standaloneVertical){const choice=companionSongChoice(standaloneVertical[1],standaloneVertical[2]);if(choice)return choice;}
    const labeledTitle=text.match(/(?:歌名|歌曲名|title|song)\s*[：:]\s*([^\n]+)/i)?.[1],labeledArtist=text.match(/(?:歌手|艺术家|作曲者|artist|singer|composer)\s*[：:]\s*([^\n]+)/i)?.[1];
    if(labeledTitle&&labeledArtist){const choice=companionSongChoice(labeledTitle,labeledArtist);if(choice)return choice;}
    const labeledDash=text.match(/(?:SELENE_SONG|选择|播放|推荐|选歌|歌曲)\s*[：:]\s*(?:\*{0,2}|`)?《?(.+?)》?(?:\*{0,2}|`)?\s*(?:—|–|-|／|\/|\bby\b)\s*([^\n]+)/i);
    if(labeledDash){const choice=companionSongChoice(labeledDash[1],labeledDash[2]);if(choice)return choice;}
    const titleFirst=text.match(/《([^》]{1,100})》\s*(?:—|–|-|[|｜]|\bby\b|演唱[：:]?|歌手[：:]?)\s*([^\n]+)/i);
    if(titleFirst){const choice=companionSongChoice(titleFirst[1],titleFirst[2]);if(choice)return choice;}
    const artistFirst=text.match(/([A-Za-z0-9\u4e00-\u9fff .·&]{1,60})\s*(?:演唱|的)?《([^》]{1,100})》/);
    if(artistFirst)return companionSongChoice(artistFirst[2],artistFirst[1].replace(/^(?:那就|想听|听听|试试|播放|来一首|可以听|推荐)\s*/,'').replace(/(?:演唱|的)\s*$/,'').trim());
    return null;
  }
  function visibleCompanionSongReply(reply){const machineLine=/^\s*(?:[-*]\s*)?(?:\*{0,2})?(?:SELENE_SONG|选择|播放|推荐|选歌|歌曲|歌名|歌曲名|歌手|艺术家|作曲者|推荐理由|理由|分析|思路|匹配原因|title|song|artist|singer|composer)\s*[：:]/i,artificial=/(?:符合|匹配|语境|心境|氛围|张力|叙事|构筑|渐进式|关系推进|满足用户|当前(?:心情|状态)|专注状态|思考语境|角色设计|分析心境|时代背景|世界观)/,visible=String(reply||'').split(/\r?\n/).filter(line=>!machineLine.test(line)&&!parseCompanionSongChoice(line)).join('\n').trim();return!visible||visible.length>72||artificial.test(visible)?'换这首听听':visible;}
  function companionLatestRoundText(info=companionCharacter()){const main=(info.ctx?.chat||[]).filter(message=>message&&!message.is_system&&String(message.mes||'').trim()).slice(-6).map(message=>`${message.is_user?String(info.ctx?.name1||'用户'):info.name}：${String(message.mes).slice(0,900)}`),privateChat=companionMessages(info).slice(-4).map(message=>`${message.role==='assistant'?info.name:String(info.ctx?.name1||'用户')}：${String(message.content||'').slice(0,900)}`);return[...main,...privateChat].join('\n')||'刚刚打开陪听窗，还没有新的对话。';}
  function companionRecommendationTask({mood='',userText='',authorized=false,info=companionCharacter()}={}){
    const latest=companionLatestRoundText(info),playing=current?`《${current.title}》 | ${current.artist}`:'无',picked=companionPickedPrompt(info,30);
    const who=info.isGroup?(info.targetMembers||info.participants||[]).map(member=>member.name).join('、'):info.isMulti?info.selected?.name:info.name;
    const card=(info.isGroup?companionGroupCardText(info):companionRoleCardText(info)).slice(0,1200);
    return`请由 ${who||'当前角色'} 选一首此刻自己想听、也愿意在这段对话里放出来的真实歌曲。候选范围不限于用户收藏、“我们的歌”或已导入歌单。

输出格式优先于日常聊天格式。第一行是一句简短的角色口语，群聊用“角色名：内容”。第二行必须是：
SELENE_SONG: 官方歌名 | 官方歌手或作曲者
第二行只填两个字段，不加 Markdown、书名号、影片或专辑名、版本说明或理由。两行说的是同一首歌。如果输出长度受限，优先写完整的 SELENE_SONG 行。

选歌依据（用于选择，不输出分析过程）：
1. 先读取本轮人物自己的价值取向、性格、经历、文化环境、明确喜恶、音乐偏好与当下想做的事。角色卡和关联世界书是依据，不能把主角色的喜好套给其他联系人。群聊里由本轮有理由选歌的人定一首，不把不同人的品味混成一套。
2. 用户明确点名歌名或歌手、语言、曲风等要求时，按实际要求筛选；其中未指定的部分仍由角色自己决定。普通的换一首、随便、用户心情或安慰请求，不等于角色必须迎合、示爱或放弃个人品味。
3. 在明确要求允许的范围内，按“角色已有音乐偏好与喜恶 > 性格、价值观和经历所形成的私人审美 > 此刻自身情绪与当前生活处境 > 当前对话情境 > 用户选择的心情 > 当前歌曲”选歌。当前剧情只是影响此人当下的选择，不是默认给用户配乐。
4. 年代、地域、语言能力、世界类型和文化知识限定角色可能接触的音乐。明确现实年代时避免选择尚未发行的作品；古代、仙侠、西幻等背景可从真实存在的器乐、民谣、民族音乐或具体影视游戏原声中挑选相容作品，不能机械地总选原声或欧美现代流行歌。没有线索就不虚构时代、国籍、最爱歌手或听歌经历。
5. 内敛不自动等于伤感钢琴，强势不自动等于摇滚，温柔不自动等于治愈情歌。个人选择要由具体人设支持，不能只拿一个性格标签或一段歌词贴人物。不把每首歌都解读成恋爱、关系推进或对用户的心理分析。
6. 可以延续有依据的个人审美，换歌无需彻底换掉此人的品味。用户没有本轮明确点名的情况下，必须避开点歌历史与当前歌曲；不要靠换版本、翻唱或同名误匹配绕过去。
7. 最后只选一首真实发行、能按官方歌名与歌手/作曲者搜索到的歌曲。未知信息保持未知，不编造歌曲、喜欢的原因或共同回忆。原声必须使用具体曲目名，不把影片或专辑名充当歌名。

当前选歌人物的人设、性格、经历与偏好：
${card}
当前角色心情：${companionMood(info)}
${mood?`用户主动选择的心情：${mood}（只作参考）
`:''}${userText?`用户原话：${String(userText).slice(0,600)}
`:''}当前歌曲：${playing}
最近 30 首由当前角色或群聊点过的歌曲（未明确点名时必须避开）：
${picked}
最新剧情与陪听对话：
${latest.slice(-1500)}

可见回复用一句短的日常口语表达自己的选择，保留人物自己的语气和态度，不写选歌报告、不解释人设或分析用户。不要照抄示例或宣称这首一定适合用户。
最后必须另起一行且只输出：SELENE_SONG: 官方歌名 | 官方歌手或作曲者。这一行只允许两个字段，不加 Markdown、书名号、括号、影片名、专辑名、版本说明或其他注释。可见回复与结构行必须是同一首。${authorized?'用户已经授权本次播放，选定后将直接搜索并播放。':'这一步只提出推荐，最终是否播放由用户确认。'}`;
  }
  function rankCompanionResults(rows,choice,before=''){const titleKey=normalizeSongText(choice?.title),artistKey=normalizeSongText(choice?.artist);if(!titleKey)return[];return(rows||[]).map(song=>{const title=normalizeSongText(song.title),artist=normalizeSongText(song.artist),titleScore=title===titleKey?12:title.startsWith(titleKey)||titleKey.startsWith(title)?7:0,artistScore=!artistKey?0:artist===artistKey?8:artist.includes(artistKey)||artistKey.includes(artist)?4:0;return{song,titleScore,artistScore,score:titleScore+artistScore-(before&&offlineKey(song)===before?20:0)};}).filter(item=>item.titleScore>0&&(!artistKey||item.artistScore>0)).sort((a,b)=>b.score-a.score);}
  async function searchCompanionChoice(choice,{isActive=()=>!disposed}={}){
    const selected=GD_SOURCES.includes(settings.searchSource)?settings.searchSource:'auto',sources=selected==='auto'?GD_SOURCES:[selected];
    const before=current?offlineKey(current):'';let lastError,received=false;
    for(const word of [`${choice.title} ${choice.artist}`,choice.title]){
      for(const source of sources){
        if(!isActive())return null;
        try{
          const rows=await searchSource(source,word);if(!isActive())return null;
          received=true;
          const song=rankCompanionResults(querySongHits(rows,word,choice),choice,before)[0]?.song;
          if(song)return song;
        }catch(error){lastError=error;if(error.retryAt)throw error;}
      }
    }
    if(!received&&lastError)throw lastError;
    return null;
  }
  let companionPickToast=null,companionPickToastTimer=0;
  function dismissCompanionPickToast(){
    ROOT.clearTimeout(companionPickToastTimer);companionPickToastTimer=0;companionPickToast?.remove();companionPickToast=null;
  }
  function placeCompanionPickToast(){
    if(!companionPickToast)return;
    const dialog=DOC.getElementById(`${ID}-companion`),view=companionViewport();
    const width=Math.min(296,Math.max(1,view.width-16)),box=dialog&&!dialog.hidden?dialog.getBoundingClientRect():null;
    const tools=dialog?.querySelector('.companion-tools')?.getBoundingClientRect();
    const right=view.left+view.width-8,bottom=view.top+view.height-8;
    const x=box&&box.right+8+width<=right?box.right+8:box&&box.left-8-width>=view.left+8?box.left-8-width:box?box.right-width-8:right-width;
    companionPickToast.style.width=`${width}px`;
    const height=companionPickToast.offsetHeight,above=tools?.height?tools.top:box?.top||bottom;
    companionPickToast.style.left=`${Math.max(view.left+8,Math.min(right-width,x))}px`;
    companionPickToast.style.top=`${Math.max(view.top+8,Math.min(bottom-height,above-height-8))}px`;
  }
  function showCompanionPickToast(text){
    dismissCompanionPickToast();ensureCompanionStyle();
    const notice=DOC.createElement('aside');notice.id=`${ID}-companion-notice`;
    notice.innerHTML='<span role="status"></span><button type="button" aria-label="关闭点歌提示">×</button>';
    notice.querySelector('button').onclick=dismissCompanionPickToast;
    DOC.body.append(notice);companionPickToast=notice;notice.querySelector('[role=status]').textContent=text;
    placeCompanionPickToast();companionPickToastTimer=ROOT.setTimeout(dismissCompanionPickToast,8000);
  }
  function reportCompanionPick(label,stage,detail,status){
    const message=companionApiError(detail, String(settings.companionApiKey||'').trim()).message
      .replace(/https?:\/\/[^\s<>"']+/gi,'[地址已隐藏]').replace(/\s+/g,' ').trim();
    const http=Number(status),code=stage==='模型请求'&&http>=400&&http<=599&&!message.includes(`HTTP ${http}`)?` · HTTP ${http}`:'';
    const text=`${label}失败 · ${stage}${code}：${message}`;
    showCompanionPickToast(text);
    console.warn('[Selene]',text);
  }
  async function uniqueCompanionRecommendation({mood='',userText=''}={}){
    if(companionBusy||disposed)return;
    const info=companionCharacter(),label=mood?'心情选歌':'角色点歌';let stage='模型请求';
    dismissCompanionPickToast();
    return runCompanionTask(companionRecommendationTask({mood,userText,authorized:true,info}),{
      onReply:async(reply,isActive)=>{
        stage='识别歌曲';
        const choice=parseCompanionSongChoice(reply);
        if(!choice)throw Error('模型回复中没有识别到完整的歌名和歌手。可以调高最大回复 token，或再点一次。');
        const explicit=companionExplicitlyRequestedChoice(choice,userText),duplicate=song=>!explicit&&(companionWasPicked(song,info)||current&&offlineKey(song)===offlineKey(current));
        const description=`《${choice.title}》 · ${choice.artist}`;
        stage='重复检查';
        if(duplicate(choice))throw Error(`${description}已点过或正在播放，请再点一次换歌。`);
        stage='搜索歌曲';
        const song=await searchCompanionChoice(choice,{isActive});if(!isActive())return;
        if(!song)throw Error(`没有找到与${description}匹配的歌曲，可以切换搜索源后重试。`);
        stage='重复检查';
        if(duplicate(song))throw Error(`${description}已点过或正在播放，请再点一次换歌。`);
        stage='播放音源';
        const started=await play(song,false,{companionPick:true});if(!isActive())return;
        if(!started){
          const notice=DOC.querySelector(`#${ID} .selene-playback-notice`)?.textContent;
          throw Error(`找到了${description}，但未能开始播放。${notice||'请查看播放器提示，或手动点播放。'}`);
        }
        markCompanionPicked(song,info);
        const display=visibleCompanionSongReply(normalizeCompanionReply(reply,info)),messages=companionMessages(info);
        messages.push({role:'assistant',content:display.slice(0,1600),time:Date.now()});
        setCompanionMessages(messages,info);save();
        if(userText)await speakCompanionReply(display,info);
      },
      onError:error=>reportCompanionPick(label,stage,error?.message||'未知错误',error?.status),
    });
  }
  function fulfillCompanionSongRequest(userText){return uniqueCompanionRecommendation({userText});}
  function askCompanionToPick(mood=''){return uniqueCompanionRecommendation({mood});}
  function showMoodPicker(){const moods=['开心','失眠','想念','治愈','浪漫','战斗','雨天','安静'];openCompanionFeature('☾ 心情匹配',`<p>现在是什么心情？角色会结合角色卡的时代、世界观与最新剧情，挑选真正适合此刻的一首歌或原声。</p><div class="mood-grid">${moods.map(m=>`<button data-mood="${m}">${m}</button>`).join('')}</div>`,e=>{const mood=e.target.closest('[data-mood]')?.dataset.mood;if(mood){DOC.querySelector(`#${ID}-companion .companion-feature`).hidden=true;askCompanionToPick(mood);}});}
  function askCurrentLyric(){const lyric=String(currentLyricWords||'').trim();if(!lyric){toast('warning','当前还没有歌词');return;}openCompanionDialog();sendCompanionMessage(`刚才这句歌词“${lyric.slice(0,300)}”，你觉得是什么意思？它让你想到什么？`);}
  function bindCompanionLyrics(el){const lyric=el?.querySelector('.lyrics');if(!lyric||lyric.dataset.companionBound)return;lyric.dataset.companionBound='1';lyric.title='点击问角色这句歌词';lyric.style.cursor='pointer';lyric.addEventListener('click',askCurrentLyric);}
  function companionViewport(){const view=ROOT.visualViewport;return{left:Number(view?.offsetLeft)||0,top:Number(view?.offsetTop)||0,width:Number(view?.width)||ROOT.innerWidth||390,height:Number(view?.height)||ROOT.innerHeight||700};}
  function companionCompactViewport(){const view=companionViewport();return view.width<=520||!!ROOT.matchMedia?.('(hover:none) and (pointer:coarse)')?.matches;}
  function companionPositionKey(mini=!!settings.companionMini){return companionCompactViewport()?(mini?'companionMobileMiniPosition':'companionMobilePosition'):(mini?'companionMiniPosition':'companionPosition');}
  function fitCompanionToViewport(dialog){if(!dialog)return;refreshStableMobileViewport();if(mobileKeyboardOpen())return;const view=companionViewport(),compact=companionCompactViewport();dialog.style.setProperty('--companion-vv-width',`${Math.max(1,view.width-16)}px`);dialog.style.setProperty('--companion-vv-height',`${Math.max(1,view.height-16)}px`);dialog.classList.toggle('companion-compact',compact);}
  function placeCompanion(dialog,left,top){if(!dialog)return;fitCompanionToViewport(dialog);const view=companionViewport(),rect=dialog.getBoundingClientRect(),width=Math.max(1,rect.width||dialog.offsetWidth),height=Math.max(1,rect.height||dialog.offsetHeight),minX=view.left+4,minY=view.top+4,maxX=Math.max(minX,view.left+view.width-width-4),maxY=Math.max(minY,view.top+view.height-height-4),wantedX=Number.isFinite(Number(left))?Number(left):minX,wantedY=Number.isFinite(Number(top))?Number(top):minY,x=Math.max(minX,Math.min(maxX,wantedX)),y=Math.max(minY,Math.min(maxY,wantedY));dialog.style.setProperty('left',`${x}px`,'important');dialog.style.setProperty('top',`${y}px`,'important');dialog.style.setProperty('right','auto','important');dialog.style.setProperty('bottom','auto','important');return{left:Math.round(x),top:Math.round(y)};}
  function defaultCompanionPosition(dialog=DOC.getElementById(`${ID}-companion`),mini=!!settings.companionMini){if(!dialog)return;fitCompanionToViewport(dialog);const view=companionViewport(),rect=dialog.getBoundingClientRect(),width=Math.max(1,rect.width||dialog.offsetWidth),height=Math.max(1,rect.height||dialog.offsetHeight),gap=companionCompactViewport()?8:mini?18:22,bottom=companionCompactViewport()?8:mini?90:74;return placeCompanion(dialog,view.left+view.width-width-gap,view.top+view.height-height-bottom);}
  function persistCompanionPosition(dialog,mini,edge){const rect=dialog.getBoundingClientRect();settings[companionPositionKey(mini)]={left:Math.round(rect.left),top:Math.round(rect.top),...(edge?{edge}:{})};save();}
  function applyCompanionPosition(dialog=DOC.getElementById(`${ID}-companion`)){if(!dialog||dialog.classList.contains('pointer-interacting'))return;bindCompanionDragging(dialog);if(mobileKeyboardOpen()){emitPublicState();return;}fitCompanionToViewport(dialog);const mood=dialog.querySelector('[data-companion-mode]');if(mood){const roster=companionRoster(baseCompanionCharacter());mood.textContent=dialog.classList.contains('companion-phone-home')?`${(roster.members||[]).length} 位联系人 · ${(roster.groups||[]).length} 个群聊`:`心情 · ${companionMood()}`;}const position=settings[companionPositionKey()];if(position&&Number.isFinite(Number(position.left))&&Number.isFinite(Number(position.top))){
      const view=companionViewport(),width=dialog.getBoundingClientRect().width;
      const left=position.edge==='left'?view.left+4:position.edge==='right'?view.left+view.width-width-4:position.left;
      placeCompanion(dialog,left,position.top);
    }else defaultCompanionPosition(dialog);placeCompanionPickToast();emitPublicState();}
  function bindCompanionDragging(dialog){
    if(!dialog||dialog.dataset.dragBound)return;dialog.dataset.dragBound='1';
    const head=dialog.querySelector('.companion-head'),avatar=dialog.querySelector('.companion-avatar-button');
    let drag=null;
    const begin=e=>{fitCompanionToViewport(dialog);const rect=dialog.getBoundingClientRect();return{id:e.pointerId,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height,view:companionViewport(),dx:0,dy:0,moved:false};};
    const preview=(drag,e)=>{
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<4)return;
      drag.moved=true;companionDragged=true;
      const view=drag.view,left=Math.max(view.left+4,Math.min(Math.max(view.left+4,view.left+view.width-drag.width-4),drag.left+dx)),top=Math.max(view.top+4,Math.min(Math.max(view.top+4,view.top+view.height-drag.height-4),drag.top+dy));
      drag.dx=left-drag.left;drag.dy=top-drag.top;
      dialog.style.setProperty('transform',`translate3d(${drag.dx}px,${drag.dy}px,0)`,'important');e.preventDefault();
    };
    const commit=(drag,mini)=>{
      dialog.style.removeProperty('transform');
      if(drag.moved){
        let left=drag.left+drag.dx,edge;
        if(mini){
          const {left:start,width}=drag.view;
          edge=left+drag.width/2<start+width/2?'left':'right';
          left=edge==='left'?start+4:start+width-drag.width-4;
        }
        placeCompanion(dialog,left,drag.top+drag.dy);persistCompanionPosition(dialog,mini,edge);
      }
      ROOT.setTimeout(()=>{companionDragged=false;},0);
    };
    head.onpointerdown=e=>{
      const onAvatar=!!e.target.closest('.companion-avatar-button'),mini=!!settings.companionMini;
      if((mini&&!onAvatar)||e.target.closest('button:not(.companion-avatar-button)')||(e.pointerType==='mouse'&&e.button!==0))return;
      drag={...begin(e),mini,handle:onAvatar?avatar:head};companionDragged=false;
      drag.handle.setPointerCapture?.(e.pointerId);e.preventDefault();
    };
    head.onpointermove=e=>{if(drag?.id===e.pointerId)preview(drag,e);};
    const end=e=>{
      if(!drag||drag.id!==e.pointerId)return;
      const previous=drag;drag=null;
      try{previous.handle.releasePointerCapture?.(previous.id);}catch{}
      commit(previous,previous.mini);
    };
    head.onpointerup=end;head.onpointercancel=end;head.onlostpointercapture=end;
    optimizeWindowInteractions(dialog,[head]);
  }
  function companionWallpaperUrl(value){
    const text=String(value||'').trim();
    if(/^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(text))return text;
    try{const url=new URL(text);return /^https?:$/.test(url.protocol)?url.href:'';}catch{return '';}
  }
  function syncCompanionWallpaper(dialog){
    const mode=['white','night','image'].includes(settings.companionBackground)?settings.companionBackground:'cover';
    dialog.dataset.wallpaper=mode;
    const image=companionWallpaperUrl(settings.companionWallpaper);
    dialog.style.setProperty('--companion-wallpaper',image?`url(${JSON.stringify(image)})`:'none');
    syncCompanionTheme(dialog);
  }
  const companionToneCache=new Map(),companionToneLoads=new Map();
  function colorLuminance(color){
    const value=String(color||'').trim();let rgb;
    if(/^#[\da-f]{3,8}$/i.test(value)){let hex=value.slice(1);if(hex.length===3||hex.length===4)hex=hex.slice(0,3).split('').map(c=>c+c).join('');rgb=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));}
    else rgb=value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i)?.slice(1,4).map(Number);
    if(!rgb||rgb.some(c=>!Number.isFinite(c)))return null;
    const linear=rgb.map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});
    return linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
  }
  function companionImageTone(url){
    if(companionToneCache.has(url))return companionToneCache.get(url);
    const pending=new Promise(resolve=>{
      const image=new ROOT.Image();image.crossOrigin='anonymous';let timer;
      const finish=tone=>{ROOT.clearTimeout(timer);image.onload=image.onerror=null;companionToneLoads.delete(image);resolve(tone);};
      companionToneLoads.set(image,()=>{finish(null);image.src='';});
      image.onload=()=>{try{
        const canvas=DOC.createElement('canvas');canvas.width=canvas.height=16;
        const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,16,16);
        const pixels=ctx.getImageData(0,0,16,16).data;let sum=0,weight=0;
        for(let i=0;i<pixels.length;i+=4){const alpha=pixels[i+3]/255;sum+=(colorLuminance(`rgb(${pixels[i]},${pixels[i+1]},${pixels[i+2]})`)||0)*alpha;weight+=alpha;}
        finish(weight?sum/weight>.42?'light':'dark':null);
      }catch{finish(null);}};
      image.onerror=()=>finish(null);timer=ROOT.setTimeout(()=>{finish(null);image.src='';},3500);image.src=url;
    });
    companionToneCache.set(url,pending);
    if(companionToneCache.size>24)companionToneCache.delete(companionToneCache.keys().next().value);
    return pending;
  }
  function syncCompanionTheme(dialog){
    const mode=dialog.dataset.wallpaper;
    const playerStyle=ROOT.getComputedStyle(DOC.getElementById(ID)||dialog),text=playerStyle.getPropertyValue('--smp-text');
    for(const [key,value] of Object.entries({'bg':playerStyle.backgroundColor,'text':text,'muted':playerStyle.getPropertyValue('--smp-muted'),'accent':playerStyle.getPropertyValue('--smp-switch')}))if(String(value||'').trim())dialog.style.setProperty(`--cp-player-${key}`,value);
    const luminance=colorLuminance(text);
    const fallback=luminance===null?(ROOT.matchMedia?.('(prefers-color-scheme:dark)').matches?'dark':'light'):luminance>.45?'dark':'light';
    dialog.dataset.tone=mode==='white'?'light':mode==='night'?'dark':fallback;
    const image=mode==='image'?companionWallpaperUrl(settings.companionWallpaper):mode==='cover'?companionWallpaperUrl(current?.cover):'';
    dialog.dataset.toneSource=image;
    if(image&&mode==='image')companionImageTone(image).then(tone=>{
      if(tone&&!disposed&&dialog.isConnected&&dialog.dataset.toneSource===image&&dialog.dataset.wallpaper===mode)dialog.dataset.tone=tone;
    });
  }
  function storeCompanionWallpaper(mode,image=settings.companionWallpaper){
    const previous={mode:settings.companionBackground,image:settings.companionWallpaper};
    settings.companionBackground=mode;settings.companionWallpaper=image;
    if(!persistSettings()){settings.companionBackground=previous.mode;settings.companionWallpaper=previous.image;return false;}
    const dialog=DOC.getElementById(`${ID}-companion`);if(dialog)syncCompanionWallpaper(dialog);
    return true;
  }
  async function companionWallpaperFromFile(file){
    if(!file||!String(file.type||'').startsWith('image/'))throw Error('请选择图片文件');
    if(file.size>20*1024*1024)throw Error('背景图片不能超过 20 MB');
    const url=URL.createObjectURL(file);
    try{
      const image=new ROOT.Image();image.src=url;
      await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('无法读取这张图片'));});
      const scale=Math.min(1,1440/Math.max(image.naturalWidth,image.naturalHeight));
      const canvas=DOC.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
      const context=canvas.getContext('2d');context.drawImage(image,0,0,canvas.width,canvas.height);
      return canvas.toDataURL('image/jpeg',.8);
    }finally{URL.revokeObjectURL(url);}
  }
  function ensureCompanionWallpaperEditor(panel){
    let editor=panel.querySelector('.companion-wallpaper-editor');
    if(!editor){
      editor=DOC.createElement('div');editor.className='companion-wallpaper-editor';
      editor.innerHTML='<b>聊天背景</b><label>背景样式<select data-wallpaper-mode aria-label="聊天背景"><option value="cover">跟随歌曲封面</option><option value="white">iMessage 纯白</option><option value="night">iMessage 深色</option><option value="image">自定义图片</option></select></label><div class="companion-wallpaper-actions"><label class="companion-avatar-upload">上传背景<input type="file" accept="image/*" data-wallpaper-upload hidden></label><button type="button" data-wallpaper-reset>恢复默认</button></div><label>背景图片链接<input type="url" data-wallpaper-url placeholder="https://…"></label><button type="button" data-wallpaper-apply>应用图片链接</button><small data-wallpaper-status>图片自动压缩并保存在当前浏览器，接收气泡会透出背景。</small>';
      panel.querySelector('.companion-settings-head').after(editor);
      const mode=editor.querySelector('[data-wallpaper-mode]'),input=editor.querySelector('[data-wallpaper-url]'),status=editor.querySelector('[data-wallpaper-status]');
      editor.onchange=async event=>{
        event.stopPropagation();
        if(event.target===mode){storeCompanionWallpaper(mode.value);syncCompanionWallpaperEditor(editor);return;}
        if(event.target.matches('[data-wallpaper-upload]')){
          const file=event.target.files?.[0];if(!file)return;
          status.textContent='正在处理背景…';
          try{const image=await companionWallpaperFromFile(file);if(storeCompanionWallpaper('image',image))status.textContent='背景已保存到当前浏览器';else status.textContent='保存失败，本地存储空间不足或不可写';}catch(error){status.textContent=error.message;}
          event.target.value='';syncCompanionWallpaperEditor(editor);
        }
      };
      editor.querySelector('[data-wallpaper-apply]').onclick=()=>{
        const image=companionWallpaperUrl(input.value);
        if(!image){status.textContent='请填写有效的 http 或 https 图片链接';return;}
        if(storeCompanionWallpaper('image',image))status.textContent='背景已更新';else status.textContent='背景保存失败';syncCompanionWallpaperEditor(editor);
      };
      editor.querySelector('[data-wallpaper-reset]').onclick=()=>{storeCompanionWallpaper('cover','');syncCompanionWallpaperEditor(editor);status.textContent='已恢复歌曲封面背景';};
    }
    syncCompanionWallpaperEditor(editor);
  }
  function syncCompanionWallpaperEditor(editor){
    editor.querySelector('[data-wallpaper-mode]').value=settings.companionBackground||'cover';
    editor.querySelector('[data-wallpaper-url]').value=String(settings.companionWallpaper||'').startsWith('data:')?'':settings.companionWallpaper||'';
  }
  function syncCompanionAppearance(){const dialog=DOC.getElementById(`${ID}-companion`);if(!dialog)return;dialog.dataset.skin=settings.skin||'albumglass';syncCompanionWallpaper(dialog);dialog.classList.toggle('companion-mini',!!settings.companionMini);dialog.setAttribute('aria-label',settings.companionMini?'角色陪听悬浮头像':'角色陪听');const cover=current?.cover?`url("${String(current.cover).replace(/["\\]/g,'\\$&')}")`:'none';dialog.style.setProperty('--companion-cover',cover);const avatar=dialog.querySelector('.companion-avatar-button');if(avatar)avatar.title=settings.companionMini?'拖动头像，点击恢复角色陪听':'拖动窗口，轻点缩成角色头像';applyCompanionPosition(dialog);const panel=dialog.querySelector('.companion-settings');if(panel&&!panel.querySelector('[data-companion-clear]')){const button=DOC.createElement('button');button.type='button';button.dataset.companionClear='';button.textContent='清空当前角色的陪听对话';button.onclick=()=>{if(!ROOT.confirm?.('清空当前角色的全部陪听对话？'))return;setCompanionMessages([]);save();renderCompanionDialog();toast('success','陪听对话已清空');};panel.appendChild(button);}}
  function ensureCompanionStyle(){if(DOC.getElementById(`${ID}-companion-style`))return;DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-companion-style">
  #${ID}-companion{--cp-bg:#171923f4;--cp-panel:#ffffff10;--cp-text:#f7f4ee;--cp-muted:#c9c1d0;--cp-accent:#d9c27c;position:fixed;z-index:2147483000;right:22px;bottom:74px;width:min(360px,calc(100vw - 24px));height:min(520px,calc(100dvh - 28px));min-width:280px;min-height:330px;display:flex;flex-direction:column;overflow:hidden;resize:both;color:var(--cp-text);background:var(--cp-bg);border:1px solid color-mix(in srgb,var(--cp-accent) 52%,transparent);border-radius:18px;box-shadow:0 20px 55px #000a;font:14px/1.45 system-ui;isolation:isolate;color-scheme:dark}#${ID}-companion:before{content:'';position:absolute;inset:-28px;z-index:-2;background-image:var(--companion-cover);background-size:cover;background-position:center;filter:blur(35px) saturate(1.45);opacity:.25}#${ID}-companion:after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(150deg,color-mix(in srgb,var(--cp-bg) 90%,transparent),var(--cp-bg))}#${ID}-companion[hidden]{display:none!important}#${ID}-companion[data-skin=red]{--cp-bg:#720e1aec;--cp-panel:#fff4df18;--cp-accent:#e1bd72}#${ID}-companion[data-skin=white]{--cp-bg:#f8f8f8f2;--cp-panel:#00000009;--cp-text:#292929;--cp-muted:#666;--cp-accent:#888;color-scheme:light}#${ID}-companion[data-skin=black]{--cp-bg:#090909f2;--cp-accent:#aaa}#${ID}-companion[data-skin=blue]{--cp-bg:#0d3556ec;--cp-accent:#8fc8ff}#${ID}-companion[data-skin=cream]{--cp-bg:#fff3dff2;--cp-panel:#7b4c1710;--cp-text:#514337;--cp-muted:#806d5d;--cp-accent:#c99055;color-scheme:light}#${ID}-companion[data-skin=green]{--cp-bg:#17442dec;--cp-accent:#9bddb3}#${ID}-companion[data-skin=albumglass]{--cp-bg:#11141bc9;--cp-panel:#ffffff14;--cp-accent:#fff}#${ID}-companion *{box-sizing:border-box}#${ID}-companion button,#${ID}-companion textarea,#${ID}-companion input,#${ID}-companion select{font:inherit;color:inherit}#${ID}-companion button{cursor:pointer;border:1px solid color-mix(in srgb,var(--cp-text) 20%,transparent);border-radius:9px;background:var(--cp-panel);padding:6px 9px}#${ID}-companion button:hover{border-color:var(--cp-accent);background:color-mix(in srgb,var(--cp-accent) 18%,var(--cp-panel))}#${ID}-companion .companion-head{position:relative;z-index:3;display:flex;align-items:center;gap:9px;flex:0 0 auto;padding:8px 10px;border-bottom:1px solid color-mix(in srgb,var(--cp-text) 12%,transparent);background:var(--cp-panel);cursor:move;touch-action:none}#${ID}-companion .companion-avatar-button{position:relative;padding:0;border-radius:50%;flex:0 0 42px;width:42px;height:42px;overflow:visible}#${ID}-companion .companion-avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;background:linear-gradient(135deg,#8c769d,#d6b86c)}#${ID}-companion .companion-avatar-button:after{content:'♫';position:absolute;right:-4px;bottom:-4px;width:18px;height:18px;display:grid;place-items:center;border-radius:50%;background:var(--cp-accent);color:#17171b;font-size:10px}#${ID}-companion .companion-identity{min-width:0;flex:1}#${ID}-companion .companion-identity b,#${ID}-companion .companion-identity small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#${ID}-companion .companion-identity small{color:var(--cp-muted);font-size:11px}#${ID}-companion .quiet-dot{font-size:11px;color:var(--cp-accent)}#${ID}-companion .companion-close{font-size:20px;line-height:1}#${ID}-companion .companion-song{flex:0 0 auto;padding:7px 10px;color:var(--cp-accent);background:var(--cp-panel);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#${ID}-companion .companion-messages{flex:1 1 auto;min-height:0;overflow:auto;padding:11px 10px;display:flex;flex-direction:column;gap:8px}#${ID}-companion .companion-empty{margin:auto;max-width:260px;text-align:center;color:var(--cp-muted)}#${ID}-companion .companion-message{max-width:88%;padding:8px 10px;border-radius:13px;white-space:pre-wrap;overflow-wrap:anywhere;box-shadow:inset 0 1px color-mix(in srgb,var(--cp-text) 9%,transparent)}#${ID}-companion .companion-message.user{align-self:flex-end;background:color-mix(in srgb,var(--cp-accent) 35%,#665477);border-bottom-right-radius:4px}#${ID}-companion .companion-message.assistant{align-self:flex-start;background:var(--cp-panel);border-bottom-left-radius:4px}#${ID}-companion .companion-typing{color:var(--cp-accent);font-style:italic}#${ID}-companion .companion-tools{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:4px;padding:6px 8px 0}#${ID}-companion .companion-tools button{font-size:10px;padding:3px 6px}#${ID}-companion .companion-form{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;margin:0;padding:8px 8px 9px}#${ID}-companion textarea,#${ID}-companion input,#${ID}-companion select{width:100%;padding:8px;border:1px solid color-mix(in srgb,var(--cp-text) 20%,transparent);border-radius:9px;background:color-mix(in srgb,var(--cp-bg) 82%,#000);outline:0}#${ID}-companion textarea{min-height:42px;max-height:100px;resize:vertical}#${ID}-companion textarea:focus,#${ID}-companion input:focus,#${ID}-companion select:focus{border-color:var(--cp-accent)}#${ID}-companion .companion-send{min-width:54px;background:color-mix(in srgb,var(--cp-accent) 28%,var(--cp-panel))}#${ID}-companion button:disabled,#${ID}-companion textarea:disabled{opacity:.55;cursor:wait}#${ID}-companion .companion-settings,#${ID}-companion .companion-feature{position:absolute;z-index:8;inset:58px 7px 7px;overflow:auto;padding:12px;background:color-mix(in srgb,var(--cp-bg) 96%,transparent);border:1px solid color-mix(in srgb,var(--cp-text) 15%,transparent);border-radius:14px;box-shadow:0 18px 45px #0009;backdrop-filter:blur(24px)}#${ID}-companion .companion-settings[hidden],#${ID}-companion .companion-feature[hidden]{display:none}#${ID}-companion .companion-settings-head,#${ID}-companion .companion-sheet-head{position:sticky;top:-12px;display:flex;align-items:center;justify-content:space-between;margin:-12px -12px 10px;padding:10px 12px;background:var(--cp-bg);z-index:2}#${ID}-companion .companion-settings label{display:block;margin:8px 0}#${ID}-companion .inline-setting{display:grid!important;grid-template-columns:auto 1fr;align-items:center;gap:8px}#${ID}-companion .inline-setting input{width:auto}#${ID}-companion .model-fetch{position:relative;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center;gap:7px;min-width:0}#${ID}-companion .model-combobox{position:relative;display:block;min-width:0}#${ID}-companion .model-combobox input{min-width:0!important;width:100%!important;padding-right:38px!important}#${ID}-companion .model-combobox [data-toggle-models]{position:absolute;right:2px;top:2px;bottom:2px;width:34px;min-width:0;padding:0;border:0!important;border-radius:7px;background:transparent!important;box-shadow:none!important;color:var(--cp-muted);pointer-events:none}#${ID}-companion .model-combobox .model-native-picker{position:absolute!important;right:2px!important;top:2px!important;bottom:2px!important;z-index:2;width:34px!important;min-width:0!important;height:calc(100% - 4px)!important;min-height:0!important;padding:0!important;border:0!important;opacity:0!important;cursor:pointer}#${ID}-companion [data-model-status]{display:block;color:var(--cp-muted);margin-top:5px}#${ID}-companion .companion-song-list>div{display:flex;align-items:center;gap:6px;padding:8px 0;border-bottom:1px solid color-mix(in srgb,var(--cp-text) 12%,transparent)}#${ID}-companion .companion-song-list span{min-width:0;flex:1}#${ID}-companion .companion-song-list b,#${ID}-companion .companion-song-list small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#${ID}-companion .memory-card,#${ID}-companion .ticket-card{display:block;margin:9px 0;padding:11px;border:1px dashed color-mix(in srgb,var(--cp-accent) 55%,transparent);border-radius:12px;background:var(--cp-panel)}#${ID}-companion .memory-card small,#${ID}-companion .ticket-card small,#${ID}-companion .ticket-card b{display:block}#${ID}-companion .ticket-card small{color:var(--cp-muted);font-size:10px;letter-spacing:.5px}#${ID}-companion .mood-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}#${ID}-companion.companion-mini{width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important;max-width:58px!important;max-height:58px!important;resize:none;border-radius:50%;overflow:visible;background:transparent;border:0;box-shadow:none}#${ID}-companion.companion-mini:before,#${ID}-companion.companion-mini:after,#${ID}-companion.companion-mini>*:not(.companion-head){display:none!important}#${ID}-companion.companion-mini .companion-head{display:block;padding:4px;border:0;background:var(--cp-bg);border-radius:50%;box-shadow:0 8px 24px #0008;cursor:grab}#${ID}-companion.companion-mini .companion-avatar-button{display:block;width:50px;height:50px}#${ID}-companion.companion-mini .companion-identity,#${ID}-companion.companion-mini .companion-close{display:none}
  #${ID}-companion-notice{position:fixed;z-index:2147483647;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:8px;padding:10px 11px;border:1px solid #f4d2ab45;border-radius:13px;background:#2b2134f5;color:#fff7ec;box-shadow:0 8px 28px #0006;font:12px/1.45 system-ui;overflow-wrap:anywhere}
  #${ID}-companion-notice [role=status]{max-height:7em;overflow:auto}
  #${ID}-companion-notice button{appearance:none;border:0;padding:0 3px;background:transparent;color:inherit;font:16px/1 system-ui;cursor:pointer}
  #${ID}-companion .companion-duration-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}#${ID}-companion .companion-duration-summary article{min-width:0;padding:11px 5px;text-align:center;border:1px solid color-mix(in srgb,var(--cp-accent) 32%,transparent);border-radius:12px;background:linear-gradient(145deg,color-mix(in srgb,var(--cp-accent) 15%,var(--cp-panel)),var(--cp-panel))}#${ID}-companion .companion-duration-summary b,#${ID}-companion .companion-duration-summary small{display:block}#${ID}-companion .companion-duration-summary b{overflow-wrap:anywhere;color:var(--cp-accent);font-size:13px}#${ID}-companion .companion-duration-summary small,#${ID}-companion .companion-duration-note,#${ID}-companion .companion-duration-song small{color:var(--cp-muted);font-size:10px}#${ID}-companion .companion-duration-note{line-height:1.6}#${ID}-companion .companion-duration-song{display:flex;align-items:center;gap:8px}#${ID}-companion .companion-duration-song span{min-width:0;flex:1}#${ID}-companion .companion-duration-song b,#${ID}-companion .companion-duration-song small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${ID}-companion .companion-duration-song strong{flex:0 0 auto;color:var(--cp-accent);font-size:11px}
  #${ID}-companion .companion-avatar-button{display:grid!important;place-items:center;padding:2px!important;border:2px solid color-mix(in srgb,var(--cp-accent) 78%,#fff)!important;border-radius:50%!important;overflow:visible!important;background:var(--cp-bg)!important;box-shadow:0 4px 14px #0007;touch-action:none;user-select:none;-webkit-user-select:none}#${ID}-companion .companion-avatar-button:after{content:none!important}#${ID}-companion .companion-avatar{display:block;width:100%;height:100%;border-radius:50%!important;object-fit:cover;pointer-events:none}#${ID}-companion .quiet-dot{position:absolute;right:-5px;bottom:-4px;display:grid;place-items:center;width:19px;height:19px;border:2px solid var(--cp-bg);border-radius:50%;background:var(--cp-accent);color:#17171b;font:700 10px/1 system-ui;pointer-events:none}#${ID}-companion .companion-preset-editor{margin:12px 0;padding:10px;border:1px solid color-mix(in srgb,var(--cp-text) 15%,transparent);border-radius:12px;background:var(--cp-panel)}#${ID}-companion .companion-preset-editor summary{cursor:pointer;font-weight:700}#${ID}-companion .companion-preset-editor textarea{min-height:260px;max-height:48vh;margin:8px 0;font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;resize:vertical}#${ID}-companion .preset-actions{display:flex;justify-content:flex-end;gap:7px}
  #${ID}-companion .companion-avatar-button{position:relative!important;flex:0 0 42px!important;width:42px!important;height:42px!important;min-width:42px!important;min-height:42px!important;max-width:42px!important;max-height:42px!important;aspect-ratio:1!important}#${ID}-companion .companion-avatar{position:absolute!important;inset:3px!important;width:calc(100% - 6px)!important;height:calc(100% - 6px)!important;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;aspect-ratio:1!important;border-radius:50%!important;clip-path:circle(50% at 50% 50%)!important;object-fit:cover!important;object-position:center!important}
  #${ID}-companion.companion-mini{width:62px!important;height:62px!important;min-width:62px!important;min-height:62px!important;max-width:62px!important;max-height:62px!important;resize:none!important;border-radius:50%!important;overflow:visible!important;background:transparent!important;border:0!important;box-shadow:none!important;isolation:auto}#${ID}-companion.companion-mini .companion-head{display:grid!important;place-items:center;width:62px!important;height:62px!important;padding:0!important;border:0!important;background:transparent!important;border-radius:50%!important;box-shadow:none!important;overflow:visible!important;cursor:default!important}#${ID}-companion.companion-mini .companion-avatar-button{display:grid!important;flex:0 0 54px!important;width:54px!important;height:54px!important;min-width:54px!important;min-height:54px!important;max-width:54px!important;max-height:54px!important;padding:3px!important;border-width:2px!important;box-shadow:0 8px 22px #0009,0 0 0 1px color-mix(in srgb,var(--cp-accent) 34%,transparent)!important;cursor:grab!important}#${ID}-companion.companion-mini .companion-avatar-button:active{cursor:grabbing!important}#${ID}-companion.companion-mini .companion-avatar{inset:4px!important;width:calc(100% - 8px)!important;height:calc(100% - 8px)!important;border-radius:50%!important}#${ID}-companion.companion-mini .quiet-dot{right:-3px;bottom:-2px;width:18px;height:18px;font-size:9px}#${ID}-companion.companion-mini .companion-identity,#${ID}-companion.companion-mini .companion-close{display:none!important}
  #${ID}-companion.companion-compact:not(.companion-mini){width:min(350px,var(--companion-vv-width))!important;height:min(500px,var(--companion-vv-height))!important;min-width:0!important;min-height:min(320px,var(--companion-vv-height))!important;max-width:var(--companion-vv-width)!important;max-height:var(--companion-vv-height)!important;resize:none!important;border-radius:18px} @media(max-width:520px),(hover:none) and (pointer:coarse){#${ID}-companion{font-size:13px}#${ID}-companion .companion-head{min-height:58px;background:color-mix(in srgb,var(--cp-bg) 94%,transparent)}#${ID}-companion .companion-message{max-width:92%}#${ID}-companion .companion-settings,#${ID}-companion .companion-feature{inset:58px 6px 6px}}

  /* iMessage surfaces: one alpha layer for the rounded body and short tail. */
  #${ID}-companion:not(.companion-mini){--im-incoming:#50505885;--im-ink:#fff;--im-chrome:#202127ed;--im-muted:#a6a7b0;--im-line:#ffffff12;border:1px solid #ffffff26!important;border-radius:26px!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif!important}
  #${ID}-companion:not(.companion-mini)[data-skin=white],#${ID}-companion:not(.companion-mini)[data-skin=cream],#${ID}-companion:not(.companion-mini)[data-wallpaper=white]{--im-incoming:#e5e5eacc;--im-ink:#1c1c1e;--im-chrome:#f8f8faf5;--im-muted:#81818b;--im-line:#0000000c;--cp-text:#1c1c1e;--cp-muted:#81818b;--cp-panel:#00000006;--cp-bg:#fff;color-scheme:light}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=night],#${ID}-companion:not(.companion-mini)[data-wallpaper=image]{--im-incoming:#50505885;--im-ink:#fff;--im-chrome:#202127ed;--im-muted:#b9b9c0;--im-line:#ffffff12;--cp-text:#f5f5f7;--cp-muted:#b9b9c0;--cp-panel:#ffffff0c;--cp-bg:#17181c;color-scheme:dark}
  #${ID}-companion:not(.companion-mini):before{inset:0!important;filter:none!important;opacity:1!important;background-image:var(--companion-cover)!important;background-size:cover!important;background-position:center!important}
  #${ID}-companion:not(.companion-mini):after{background:#14151b80!important}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=white]:before{background:#fff!important}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=night]:before{background:#111114!important}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=image]:before{background-image:var(--companion-wallpaper)!important;background-color:#18191d!important}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=white]:after,#${ID}-companion:not(.companion-mini)[data-wallpaper=night]:after{background:transparent!important}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=image]:after{background:#00000012!important}
  #${ID}-companion:not(.companion-mini) button{appearance:none!important;-webkit-appearance:none!important;border:1px solid var(--im-line)!important;border-radius:14px!important;background:var(--cp-panel)!important;color:var(--cp-text)!important;text-shadow:none!important;box-shadow:none!important;cursor:pointer}
  #${ID}-companion:not(.companion-mini) button:hover{background:color-mix(in srgb,var(--cp-text) 12%,transparent)!important}
  #${ID}-companion:not(.companion-mini) button:focus-visible{outline:2px solid #3b9bff!important;outline-offset:2px!important}
  #${ID}-companion:not(.companion-mini) .companion-head{min-height:80px!important;padding:10px 14px!important;background:var(--im-chrome)!important;border-bottom:1px solid var(--im-line)!important;box-shadow:none!important;gap:10px!important}
  #${ID}-companion:not(.companion-mini) .companion-head .companion-avatar-button{width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;flex-basis:46px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important}
  #${ID}-companion:not(.companion-mini) .companion-head .companion-avatar{inset:0!important;width:100%!important;height:100%!important}
  #${ID}-companion:not(.companion-mini) .companion-avatar-button .quiet-dot{display:none!important}
  #${ID}-companion:not(.companion-mini) .companion-identity b{font-size:15px!important;font-weight:600!important;color:var(--cp-text)!important}
  #${ID}-companion:not(.companion-mini) .companion-identity small{font-size:11px!important;color:var(--im-muted)!important;margin-top:3px}
  #${ID}-companion:not(.companion-mini) .companion-head .companion-settings-button,#${ID}-companion:not(.companion-mini) .companion-head .companion-close{width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important;flex-basis:30px!important;border:0!important;border-radius:50%!important;background:var(--cp-panel)!important;color:var(--cp-text)!important}
  #${ID}-companion:not(.companion-mini) .companion-modes{padding:5px 12px!important;background:var(--im-chrome)!important;border:0!important;box-shadow:none!important}
  #${ID}-companion:not(.companion-mini) .companion-modebar{gap:8px!important;min-height:28px!important}
  #${ID}-companion:not(.companion-mini) .companion-modebar>b{font-size:12px!important;font-weight:500!important;color:var(--im-muted)!important}
  #${ID}-companion:not(.companion-mini) .companion-modebar button{background:transparent!important;border:0!important;color:#3b9bff!important;border-radius:999px!important;font-size:12px!important}
  #${ID}-companion:not(.companion-mini) .companion-song{padding:8px 14px!important;min-height:32px!important;font-size:11px!important;color:var(--cp-text)!important;background:var(--im-chrome)!important;border-top:1px solid var(--im-line)!important;border-bottom:1px solid var(--im-line)!important}
  #${ID}-companion:not(.companion-mini) .companion-messages{padding:16px 16px 22px!important;gap:0!important;background:transparent!important;scrollbar-width:thin;scrollbar-color:#8886 transparent}
  #${ID}-companion .companion-imessage-row{display:flex;align-items:flex-end;gap:8px;flex-shrink:0;max-width:100%;margin:14px 0 0}
  #${ID}-companion .companion-imessage-row.user{justify-content:flex-end}
  #${ID}-companion .companion-imessage-row.continuation{margin-top:5px}
  #${ID}-companion .companion-message-stack{display:flex;flex-direction:column;align-items:flex-start;min-width:0;max-width:84%}
  #${ID}-companion .companion-imessage-row.user .companion-message-stack{align-items:flex-end}
  #${ID}-companion .companion-imessage-row>.companion-person-face{width:26px;height:26px;flex:0 0 26px}
  #${ID}-companion .companion-imessage-row.continuation>.companion-person-face{visibility:hidden}
  #${ID}-companion .companion-sender{margin:0 12px 4px;color:var(--im-muted);font-size:10px}
  #${ID}-companion:not(.companion-mini) .companion-message{--bubble-color:var(--im-incoming);--tail-mask:linear-gradient(transparent,transparent);--tail-position:left 5px bottom 0;position:relative;isolation:isolate;max-width:100%!important;width:fit-content;padding:8px 14px!important;border:0!important;border-radius:19px!important;background:transparent!important;color:var(--im-ink)!important;box-shadow:none!important;text-shadow:none!important;font:400 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif!important;white-space:pre-wrap;overflow:visible!important;overflow-wrap:anywhere}
  #${ID}-companion:not(.companion-mini) .companion-message.user{--bubble-color:#00a9f4;--tail-position:right 5px bottom 0;color:#fff!important;align-self:flex-end!important}
  #${ID}-companion .companion-message.assistant.has-tail{--tail-mask:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22white%22%20d%3D%22M0%200H24V13C17%2015%2012%2020%203%2023C1%2023.7%20.2%2023%20.9%2021.7C4%2017%204.5%2014%202.5%2010C1%207.2%20.2%203.5%200%200Z%22%2F%3E%3C%2Fsvg%3E')}
  #${ID}-companion .companion-message.user.has-tail{--tail-mask:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22white%22%20d%3D%22M0%200H24V13C17%2015%2012%2020%203%2023C1%2023.7%20.2%2023%20.9%2021.7C4%2017%204.5%2014%202.5%2010C1%207.2%20.2%203.5%200%200Z%22%20transform%3D%22translate%2824%200%29%20scale%28-1%201%29%22%2F%3E%3C%2Fsvg%3E')}
  #${ID}-companion .companion-bubble-surface{display:block;position:absolute;inset:0 0 -6px;pointer-events:none;background:var(--bubble-color);-webkit-mask:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20rx%3D%2219%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E') center top/100% calc(100% - 6px) no-repeat,var(--tail-mask) var(--tail-position)/21px 21px no-repeat;mask:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20rx%3D%2219%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E') center top/100% calc(100% - 6px) no-repeat,var(--tail-mask) var(--tail-position)/21px 21px no-repeat;-webkit-mask-composite:source-over;mask-composite:add}
  #${ID}-companion .companion-bubble-text{position:relative;z-index:1;color:inherit!important;-webkit-text-fill-color:currentColor!important}
  #${ID}-companion .companion-message-date{flex-shrink:0;margin:16px 0 4px;text-align:center;font-size:10px;font-weight:500;color:var(--im-muted)}
  #${ID}-companion:not(.companion-mini) .companion-typing{margin-top:15px;color:var(--im-muted)!important;font-size:11px!important}
  #${ID}-companion:not(.companion-mini) .companion-tools{padding:9px 12px 0!important;gap:6px!important;flex-wrap:nowrap!important;overflow-x:auto;flex-shrink:0;background:var(--im-chrome)!important;scrollbar-width:none}
  #${ID}-companion:not(.companion-mini) .companion-tools button{flex:0 0 auto!important;white-space:nowrap!important;padding:5px 9px!important;font-size:10px!important;border-radius:999px!important}
  #${ID}-companion:not(.companion-mini) .companion-form{padding:10px 12px 12px!important;gap:8px!important;align-items:end!important;background:var(--im-chrome)!important}
  #${ID}-companion:not(.companion-mini) .companion-form textarea{height:36px!important;min-height:36px!important;max-height:90px!important;padding:8px 13px!important;border:1px solid color-mix(in srgb,var(--cp-text) 17%,transparent)!important;border-radius:20px!important;background:var(--cp-panel)!important;color:var(--cp-text)!important;font-size:13px!important;resize:vertical;box-shadow:none!important}
  #${ID}-companion:not(.companion-mini) .companion-form .companion-send{min-width:32px!important;width:32px!important;height:32px!important;min-height:32px!important;margin-bottom:2px;padding:0!important;border:0!important;border-radius:50%!important;background:#00a9f4!important;color:#fff!important;font:600 22px/1 system-ui!important}
  #${ID}-companion:not(.companion-mini) .companion-settings,#${ID}-companion:not(.companion-mini) .companion-feature{inset:80px 8px 8px!important;background:var(--im-chrome)!important;color:var(--cp-text)!important;border:1px solid var(--im-line)!important;border-radius:20px!important;box-shadow:0 10px 35px #0003!important}
  #${ID}-companion .companion-wallpaper-editor{padding:12px;margin:10px 0 16px;border:1px solid var(--im-line);border-radius:15px;background:var(--cp-panel)}
  #${ID}-companion .companion-wallpaper-actions{display:flex;align-items:center;gap:8px;margin:8px 0}
  #${ID}-companion:not(.companion-mini) .companion-chat-row{border:0!important;border-bottom:1px solid var(--im-line)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;transform:none!important}
  #${ID}-companion:not(.companion-mini) .companion-phone-back{min-height:28px!important;min-width:28px!important}
  #${ID}-companion.companion-phone-home:not(.companion-mini) .companion-modes{background:var(--im-chrome)!important}

  #${ID}-companion .companion-avatar[hidden]{display:none!important}
  #${ID}-companion:not(.companion-mini) .companion-head{display:grid!important;grid-template-columns:30px minmax(0,1fr) 30px!important;gap:8px!important;height:100px!important;min-height:100px!important;align-items:start!important}
  #${ID}-companion:not(.companion-mini) .companion-head .companion-avatar-button{position:absolute!important;top:9px!important;left:50%!important;transform:translateX(-50%)!important;width:38px!important;height:38px!important;min-width:38px!important;min-height:38px!important}
  #${ID}-companion:not(.companion-mini) .companion-identity{grid-column:2!important;grid-row:1!important;text-align:center!important;padding-top:43px!important;max-width:100%!important}
  #${ID}-companion:not(.companion-mini) .companion-identity b{font-size:13px!important}
  #${ID}-companion:not(.companion-mini) .companion-identity small{font-size:10px!important;margin-top:1px!important}
  #${ID}-companion:not(.companion-mini) .companion-settings-button{grid-column:1!important;grid-row:1!important}
  #${ID}-companion:not(.companion-mini) .companion-close{grid-column:3!important;grid-row:1!important}
  #${ID}-companion:not(.companion-mini) .companion-settings,#${ID}-companion:not(.companion-mini) .companion-feature{inset:100px 8px 8px!important}
  /* One palette controls chat, sheets and native form controls, above host themes. */
  #${ID}-companion[data-tone=dark]{--im-incoming:#505058b8!important;--im-ink:#f5f5f7!important;--im-chrome:#202127f5!important;--im-muted:#b9bac5!important;--im-line:#ffffff1c!important;--cp-bg:#17181c!important;--cp-panel:#ffffff0f!important;--cp-text:#f5f5f7!important;--cp-muted:#b9bac5!important;--cp-accent:#81b9ff!important;color-scheme:dark!important}
  #${ID}-companion[data-tone=light]{--im-incoming:#e5e5eae0!important;--im-ink:#202127!important;--im-chrome:#f8f8faf7!important;--im-muted:#626573!important;--im-line:#00000015!important;--cp-bg:#f8f8fa!important;--cp-panel:#00000008!important;--cp-text:#202127!important;--cp-muted:#626573!important;--cp-accent:#1976d2!important;color-scheme:light!important}
  #${ID}-companion:not(.companion-mini)[data-tone=light]:after{background:#ffffff55!important}
  #${ID}-companion:not(.companion-mini)[data-tone=dark]:after{background:#10111866!important}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=white]:after,#${ID}-companion:not(.companion-mini)[data-wallpaper=night]:after{background:transparent!important}
  #${ID}-companion[data-tone]{color:var(--cp-text)!important}
  #${ID}-companion[data-tone] input:not([type=checkbox]),#${ID}-companion[data-tone] select,#${ID}-companion[data-tone] textarea{color:var(--cp-text)!important;-webkit-text-fill-color:var(--cp-text)!important;caret-color:var(--cp-text)!important;background:var(--cp-field,color-mix(in srgb,var(--cp-bg) 92%,var(--cp-text) 8%))!important;border:1px solid var(--im-line)!important;box-shadow:none!important;opacity:1!important;color-scheme:inherit!important}
  #${ID}-companion[data-tone] input::placeholder,#${ID}-companion[data-tone] textarea::placeholder{color:var(--cp-muted)!important;-webkit-text-fill-color:var(--cp-muted)!important;opacity:.9!important}
  #${ID}-companion[data-tone] select option,#${ID}-companion[data-tone] select optgroup{background:var(--cp-bg)!important;color:var(--cp-text)!important;-webkit-text-fill-color:var(--cp-text)!important}
  #${ID}-companion[data-tone] .companion-settings label,#${ID}-companion[data-tone] .companion-settings b,#${ID}-companion[data-tone] .companion-settings summary{color:var(--cp-text)!important;-webkit-text-fill-color:var(--cp-text)!important}
  #${ID}-companion[data-tone] .companion-settings small,#${ID}-companion[data-tone] [data-model-status]{color:var(--cp-muted)!important;-webkit-text-fill-color:var(--cp-muted)!important}
  #${ID}-companion[data-tone] input:-webkit-autofill{-webkit-text-fill-color:var(--cp-text)!important;box-shadow:0 0 0 1000px var(--cp-bg) inset!important}
  #${ID}-companion[data-tone] .companion-settings-head,#${ID}-companion[data-tone] .companion-sheet-head{background:var(--im-chrome)!important;color:var(--cp-text)!important}

  /* Glass applies only to cover/image modes, including their controls and sheets. */
  #${ID}-companion:not(.companion-mini):is([data-wallpaper=cover],[data-wallpaper=image]){--im-chrome:color-mix(in srgb,var(--cp-bg) 42%,transparent)!important;--cp-panel:color-mix(in srgb,var(--cp-text) 8%,transparent)!important;--cp-field:color-mix(in srgb,var(--cp-bg) 30%,transparent);--im-incoming:color-mix(in srgb,var(--cp-bg) 38%,transparent)!important;background:color-mix(in srgb,var(--cp-bg) 22%,transparent)!important;backdrop-filter:blur(26px) saturate(1.18)!important;-webkit-backdrop-filter:blur(26px) saturate(1.18)!important;box-shadow:0 18px 48px #0004,inset 0 1px #ffffff40!important;border-color:color-mix(in srgb,var(--cp-text) 18%,transparent)!important}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=cover]{--cp-bg:var(--cp-player-bg,#171923)!important;--cp-text:var(--cp-player-text,#f5f5f7)!important;--cp-muted:var(--cp-player-muted,#c9c1d0)!important;--cp-accent:var(--cp-player-accent,#81b9ff)!important;--im-ink:var(--cp-text)!important;--im-muted:var(--cp-muted)!important}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=cover]:before{inset:-40px!important;filter:blur(32px) saturate(1.2)!important;opacity:.65!important;transform:scale(1.12)}
  #${ID}-companion:not(.companion-mini)[data-wallpaper=image]:before{inset:-5px!important;filter:blur(2px)!important;opacity:.82!important;background-color:transparent!important}
  #${ID}-companion:not(.companion-mini):is([data-wallpaper=cover],[data-wallpaper=image]):after{background:color-mix(in srgb,var(--cp-bg) 24%,transparent)!important}
  #${ID}-companion:not(.companion-mini):is([data-wallpaper=cover],[data-wallpaper=image]) :is(.companion-head,.companion-modes,.companion-song,.companion-tools,.companion-form,.companion-settings-head,.companion-sheet-head){backdrop-filter:blur(18px) saturate(1.15);-webkit-backdrop-filter:blur(18px) saturate(1.15)}
  #${ID}-companion:not(.companion-mini):is([data-wallpaper=cover],[data-wallpaper=image]) :is(.companion-settings,.companion-feature){backdrop-filter:blur(28px) saturate(1.2)!important;-webkit-backdrop-filter:blur(28px) saturate(1.2)!important}
  #${ID}-companion:not(.companion-mini):is([data-wallpaper=cover],[data-wallpaper=image]) :is(button,input:not([type=checkbox]),select,textarea,.companion-wallpaper-editor,.companion-preset-editor,.companion-bubble-surface){backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
  #${ID}-companion:not(.companion-mini):is([data-wallpaper=cover],[data-wallpaper=image]) .companion-message.user{--bubble-color:#008fd6c2}
  #${ID}-companion .model-fetch>[data-fetch-models]{width:auto!important;min-width:0!important;white-space:nowrap!important;writing-mode:horizontal-tb!important;padding:8px 10px!important;line-height:1.3!important}
  #${ID}-companion .model-combobox [data-toggle-models]{display:grid!important;place-items:center;white-space:nowrap!important;min-height:0!important;line-height:1!important}
  #${ID}-companion:not(.companion-mini):is([data-wallpaper=cover],[data-wallpaper=image]) :is(.companion-settings-head,.companion-sheet-head){background:color-mix(in srgb,var(--cp-bg) 80%,transparent)!important;backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px)}
  /* Checkbox fill and a contrasting, real check mark survive host form themes. */
  #${ID}-companion .inline-setting{grid-template-columns:20px minmax(0,1fr)!important;gap:10px!important;align-items:start!important;line-height:1.5}
  #${ID}-companion input[type=checkbox]{appearance:none!important;-webkit-appearance:none!important;position:relative!important;display:inline-block!important;flex:0 0 20px!important;width:20px!important;min-width:20px!important;max-width:20px!important;height:20px!important;min-height:20px!important;padding:0!important;margin:1px 0 0!important;border:1.5px solid color-mix(in srgb,var(--cp-text) 48%,transparent)!important;border-radius:5px!important;background:var(--cp-panel)!important;background-image:none!important;box-shadow:none!important;filter:none!important;opacity:1!important;cursor:pointer}
  #${ID}-companion input[type=checkbox]::before,#${ID}-companion input[type=checkbox]::after{content:none!important}
  #${ID}-companion input[type=checkbox]:checked{background:var(--cp-text)!important;border-color:var(--cp-text)!important}
  #${ID}-companion input[type=checkbox]:checked::after{content:''!important;display:block!important;position:absolute!important;left:6px!important;top:2px!important;width:5px!important;height:10px!important;border:solid var(--cp-bg)!important;border-width:0 2.5px 2.5px 0!important;border-radius:0!important;transform:rotate(45deg)!important;background:none!important}
  #${ID}-companion input[type=checkbox]:focus-visible{outline:2px solid var(--cp-accent)!important;outline-offset:3px!important}
</style>`);}
  function ensureCompanionPresetEditor(panel){if(!panel||panel.querySelector('.companion-preset-editor'))return;const editor=DOC.createElement('details');editor.className='companion-preset-editor';editor.innerHTML='<summary>人物自主性与自然私聊预设</summary><label class="inline-setting"><input name="companionPresetEnabled" type="checkbox"><span>启用内置角色预设（应用于聊天、自动回应、点歌与票根）</span></label><textarea name="companionPreset" spellcheck="false" aria-label="角色陪听预设"></textarea><div class="preset-actions"><button type="button" data-preset-reset>恢复内置默认</button></div><small>以人物自己的立场、生活、边界与音乐审美为先，按人设自然交流；亲近不等于迎合，也不强迫角色冷淡或唱反调。</small>';panel.insertBefore(editor,panel.querySelector('[data-companion-clear]')||null);editor.querySelector('[data-preset-reset]').onclick=()=>{editor.querySelector('[name=companionPreset]').value=DEFAULT_COMPANION_PRESET;editor.querySelector('[name=companionPresetEnabled]').checked=true;settings.companionPreset=DEFAULT_COMPANION_PRESET;settings.companionPresetEnabled=true;settings.companionPresetVersion=4;save();toast('success','已恢复人物自主性预设');};}
  function syncCompanionSettings(dialog=DOC.getElementById(`${ID}-companion`)){const panel=dialog?.querySelector('.companion-settings');if(!panel)return;ensureCompanionWallpaperEditor(panel);ensureCompanionPresetEditor(panel);panel.querySelector('[name=companionMode]').value=settings.companionMode==='sillytavern'?'sillytavern':'custom';panel.querySelector('[name=companionApiUrl]').value=settings.companionApiUrl||'';panel.querySelector('[name=companionModel]').value=settings.companionModel||'';panel.querySelector('[name=companionApiKey]').value=settings.companionApiKey||'';panel.querySelector('[name=companionMaxTokens]').value=Math.max(32,Math.min(4096,Number(settings.companionMaxTokens)||300));panel.querySelector('[name=companionAutoSong]').checked=!!settings.companionAutoSong;panel.querySelector('[name=companionQuiet]').checked=!!settings.companionQuiet;panel.querySelector('[name=companionDuoMode]').checked=!!settings.companionDuoMode;panel.querySelector('[name=companionTts]').checked=!!settings.companionTts;panel.querySelector('[name=companionAutoTicket]').checked=!!settings.companionAutoTicket;panel.querySelector('[name=companionAutoLimit]').value=Math.max(1,Math.min(2,Number(settings.companionAutoLimit)||1));panel.querySelector('[name=companionPresetEnabled]').checked=settings.companionPresetEnabled!==false;panel.querySelector('[name=companionPreset]').value=String(settings.companionPreset||DEFAULT_COMPANION_PRESET);panel.querySelector('[data-companion-custom]').hidden=panel.querySelector('[name=companionMode]').value==='sillytavern';renderCompanionModelOptions(dialog);}
  function saveCompanionSettings(panel){settings.companionMode=panel.querySelector('[name=companionMode]').value==='sillytavern'?'sillytavern':'custom';settings.companionApiUrl=panel.querySelector('[name=companionApiUrl]').value.trim();settings.companionModel=panel.querySelector('[name=companionModel]').value.trim();settings.companionApiKey=panel.querySelector('[name=companionApiKey]').value.trim();settings.companionMaxTokens=Math.max(32,Math.min(4096,Number(panel.querySelector('[name=companionMaxTokens]').value)||300));settings.companionAutoSong=panel.querySelector('[name=companionAutoSong]').checked;settings.companionQuiet=panel.querySelector('[name=companionQuiet]').checked;settings.companionDuoMode=panel.querySelector('[name=companionDuoMode]').checked;settings.companionTts=panel.querySelector('[name=companionTts]').checked;settings.companionAutoTicket=panel.querySelector('[name=companionAutoTicket]').checked;settings.companionAutoLimit=Math.max(1,Math.min(2,Number(panel.querySelector('[name=companionAutoLimit]').value)||1));settings.companionPresetEnabled=panel.querySelector('[name=companionPresetEnabled]').checked;settings.companionPreset=panel.querySelector('[name=companionPreset]').value.trim()||DEFAULT_COMPANION_PRESET;settings.companionPresetVersion=4;panel.querySelector('[data-companion-custom]').hidden=settings.companionMode==='sillytavern';save();renderCompanionDialog();}
  async function companionAvatarFromFile(file){if(!file||!String(file.type||'').startsWith('image/'))throw Error('请选择图片文件');if(file.size>12*1024*1024)throw Error('头像图片不能超过 12 MB');const objectUrl=URL.createObjectURL(file);try{const image=new ROOT.Image();image.decoding='async';image.src=objectUrl;await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('无法读取这张图片'));});const size=256,scale=Math.min(1,size/Math.max(image.naturalWidth||1,image.naturalHeight||1)),width=Math.max(1,Math.round((image.naturalWidth||1)*scale)),height=Math.max(1,Math.round((image.naturalHeight||1)*scale)),canvas=DOC.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d');context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';context.drawImage(image,0,0,width,height);let data=canvas.toDataURL('image/webp',.84);if(!data.startsWith('data:image/webp'))data=canvas.toDataURL('image/jpeg',.86);return data;}finally{URL.revokeObjectURL(objectUrl);}}
  function persistCompanionAvatar(target,data,onDone){const previous=target.avatar||'';target.avatar=data;target.customAvatar=true;try{save();onDone?.();toast('success','头像已保存到当前浏览器');}catch(error){target.avatar=previous;toast('error','头像保存失败，浏览器本地空间可能已满');}}
  function showCompanionRosterManager(){
    const info=companionCharacter(),roster=companionRoster(baseCompanionCharacter()),rows=(roster.members||[]).map(member=>`<article class="companion-person-edit" data-person-edit="${esc(member.id)}">
      <div class="companion-person-card-head">${companionPersonFace(member,info)}<span class="companion-person-card-copy"><b>${esc(member.name)}</b><small>${member.isContextCharacter?'当前上下文 char 角色卡':member.manual?'手动联系人':member.profileText?'角色描述联系人':'世界书联系人'}</small></span>${member.isContextCharacter?'':'<button type="button" class="companion-person-delete" data-person-delete>删除</button>'}</div>
      <div class="companion-person-fields">
        <label><span>名字</span><input data-person-name value="${esc(member.name)}" aria-label="人物名字"></label>
        <label class="companion-glyph-field"><span>备用头像字</span><input data-person-glyph value="${esc(member.glyph||'')}" maxlength="3" aria-label="头像备用文字"></label>
        <div class="companion-avatar-field companion-person-field"><span>头像地址</span><span class="companion-avatar-control"><input data-person-avatar value="${esc(member.avatar||'')}" placeholder="URL / 文件名" aria-label="人物头像"><label class="companion-avatar-upload">上传<input type="file" data-person-upload accept="image/*" hidden></label></span></div>
        <label class="companion-tone-field"><span>线上聊天语气</span><input data-person-tone value="${esc(member.chatTone||'')}" maxlength="160" placeholder="例如：简短自然，偶尔吐槽" aria-label="线上聊天语气"></label>
      </div>
      <div class="companion-person-actions"><button type="button" data-person-save>保存这位联系人</button></div>
      <details><summary>关联人设来源 · ${(member.refs||[]).length+(member.profileText?1:0)}</summary>${member.profileText?'<small>当前角色 description 描述</small>':''}${(member.refs||[]).map(ref=>`<small>${esc(ref.book)} / ${esc(ref.title)}</small>`).join('')||(!member.profileText?'<small>手动人物，暂未关联条目</small>':'')}</details>
    </article>`).join('');
    openCompanionFeature('联系人与头像',`<p class="companion-manager-note">可以直接上传本地图片；播放器会自动压缩到头像尺寸并只保存在当前浏览器。角色描述、世界书头像、图片链接和备用头像字仍然兼容。</p><div class="companion-manager-actions"><button type="button" data-person-add>＋ 添加人物</button><button type="button" data-person-rescan>重新扫描人物</button></div><div class="companion-person-list">${rows||'<p>暂未识别到人物，可以手动添加或重新扫描。</p>'}</div>`,async e=>{
      const article=e.target.closest('[data-person-edit]'),member=article&&(roster.members||[]).find(item=>item.id===article.dataset.personEdit);
      if(e.target.closest('[data-person-delete]')&&member){if(member.isContextCharacter){toast('info','当前上下文中的 char 角色卡会始终保留');return;}if(!member.manual){roster.excludedNames=roster.excludedNames||[];if(!roster.excludedNames.includes(member.sourceName||member.name))roster.excludedNames.push(member.sourceName||member.name);}roster.members=roster.members.filter(item=>item.id!==member.id);roster.groupIds=(roster.groupIds||[]).filter(id=>id!==member.id);for(const group of roster.groups||[])group.memberIds=(group.memberIds||[]).filter(id=>id!==member.id);roster.groups=(roster.groups||[]).filter(group=>(group.memberIds||[]).length>=2);if(!roster.groups.some(group=>group.id===roster.activeGroupId))roster.activeGroupId='';save();showCompanionRosterManager();renderCompanionDialog();return;}
      if(e.target.closest('[data-person-add]')){const name=cleanCompanionPersonName(ROOT.prompt?.('输入人物名字')||'');if(!name){toast('warning','请输入明确的人物名字');return;}if(roster.members.some(item=>cleanCompanionPersonName(item.name)===name)){toast('info','这个人物已经在名单里');return;}const member={id:`${companionMemberId(name)}-${Date.now().toString(36)}`,name,sourceName:name,glyph:Array.from(name).slice(-1)[0]||'角',customGlyph:false,avatar:'',customAvatar:false,chatTone:'',manual:true,refs:[]};roster.members.push(member);assignCompanionGlyphs(roster.members);save();showCompanionRosterManager();renderCompanionDialog();return;}
      if(e.target.closest('[data-person-save]')&&member){const name=cleanCompanionPersonName(article.querySelector('[data-person-name]')?.value||'');if(!name){toast('warning','请输入明确的人物名字');return;}const avatar=String(article.querySelector('[data-person-avatar]')?.value||'').trim(),glyph=String(article.querySelector('[data-person-glyph]')?.value||'').trim().slice(0,3),tone=String(article.querySelector('[data-person-tone]')?.value||'').trim().slice(0,160),avatarChanged=avatar!==String(member.avatar||'').trim(),glyphChanged=glyph!==String(member.glyph||'').trim();member.name=name;if(member.manual)member.sourceName=name;if(avatarChanged){member.avatar=avatar;member.customAvatar=true;}if(glyphChanged){member.glyph=glyph||Array.from(name).slice(-1)[0]||'角';member.customGlyph=!!glyph;}else if(!member.customGlyph)member.glyph=Array.from(name).slice(-1)[0]||'角';member.chatTone=tone;assignCompanionGlyphs(roster.members);save();showCompanionRosterManager();renderCompanionDialog();toast('success',`已保存 ${name}`);return;}
      if(e.target.closest('[data-person-rescan]')){await scanCompanionRoster({force:true,rebuild:true});showCompanionRosterManager();renderCompanionDialog();}
    });
    const panel=DOC.querySelector(`#${ID}-companion .companion-feature`);bindCompanionAvatarFallbacks(panel);panel?.querySelectorAll('[data-person-edit]').forEach(article=>{const member=roster.members.find(item=>item.id===article.dataset.personEdit),upload=article.querySelector('[data-person-upload]');upload.onchange=async()=>{try{const data=await companionAvatarFromFile(upload.files?.[0]);persistCompanionAvatar(member,data,()=>{showCompanionRosterManager();renderCompanionDialog();});}catch(error){toast('error',error.message);}};});
  }
  function showCompanionCurrentPersonManager(){const base=baseCompanionCharacter(),roster=companionRoster(base),info=companionCharacter(),member=info.isMulti&&!info.isGroup?info.selected:syncBaseCompanionMember(roster,base);if(!member){toast('warning','没有找到当前角色');return;}const refs=(member.refs||[]).map(ref=>`<small>${esc(ref.book)} / ${esc(ref.title)}</small>`).join('')||'<small>当前人物直接读取 char 角色卡人设，暂无额外世界书条目</small>';openCompanionFeature(`${member.name} · 当前角色设置`,`<p class="companion-manager-note">这里只设置当前聊天角色，不会展开或修改其他联系人。当前角色的 char 人设会优先用于回复。</p><article class="companion-person-edit companion-current-person" data-person-edit="${esc(member.id)}"><div class="companion-person-card-head">${companionPersonFace(member,info)}<span class="companion-person-card-copy"><b>${esc(member.name)}</b><small>${member.isBaseCharacter?'当前 char 角色卡':'当前世界书人物'}</small></span></div><div class="companion-person-fields"><label><span>名字</span><input data-person-name value="${esc(member.name)}" aria-label="当前角色名字"></label><label class="companion-glyph-field"><span>备用头像字</span><input data-person-glyph value="${esc(member.glyph||'')}" maxlength="3" aria-label="头像备用文字"></label><div class="companion-avatar-field companion-person-field"><span>头像地址</span><span class="companion-avatar-control"><input data-person-avatar value="${esc(member.avatar||'')}" placeholder="URL / 文件名" aria-label="当前角色头像"><label class="companion-avatar-upload">上传<input type="file" data-person-upload accept="image/*" hidden></label></span></div><label class="companion-tone-field"><span>线上聊天语气</span><input data-person-tone value="${esc(member.chatTone||'')}" maxlength="160" placeholder="例如：简短自然，偶尔吐槽" aria-label="线上聊天语气"></label></div><div class="companion-person-actions"><button type="button" data-person-save>保存当前角色</button><button type="button" data-person-chat-clear>清空当前角色聊天记录</button></div><details><summary>关联人设来源 · ${(member.refs||[]).length}</summary>${refs}</details></article>`,async e=>{const article=e.target.closest('[data-person-edit]');if(e.target.closest('[data-person-chat-clear]')){if(ROOT.confirm&&!ROOT.confirm(`只清空与“${member.name}”的陪听聊天记录？`))return;settings.companionConversations=settings.companionConversations&&typeof settings.companionConversations==='object'?settings.companionConversations:{};const baseKey=companionBaseKey(base);delete settings.companionConversations[`${baseKey}:member:${member.id}`];if(member.isBaseCharacter)delete settings.companionConversations[baseKey];save();renderCompanionDialog();showCompanionCurrentPersonManager();toast('success',`已清空 ${member.name} 的聊天记录`);return;}if(e.target.closest('[data-person-save]')){const name=cleanCompanionPersonName(article?.querySelector('[data-person-name]')?.value||'');if(!name){toast('warning','请输入明确的人物名字');return;}const avatar=String(article.querySelector('[data-person-avatar]')?.value||'').trim(),glyph=String(article.querySelector('[data-person-glyph]')?.value||'').trim().slice(0,3),tone=String(article.querySelector('[data-person-tone]')?.value||'').trim().slice(0,160),avatarChanged=avatar!==String(member.avatar||'').trim(),glyphChanged=glyph!==String(member.glyph||'').trim();member.name=name;if(avatarChanged){member.avatar=avatar;member.customAvatar=true;}if(glyphChanged){member.glyph=glyph||Array.from(name).slice(-1)[0]||'角';member.customGlyph=!!glyph;}else if(!member.customGlyph)member.glyph=Array.from(name).slice(-1)[0]||'角';member.chatTone=tone;assignCompanionGlyphs(roster.members);save();renderCompanionDialog();showCompanionCurrentPersonManager();toast('success',`已保存 ${name}`);}});const panel=DOC.querySelector(`#${ID}-companion .companion-feature`),upload=panel?.querySelector('[data-person-upload]');bindCompanionAvatarFallbacks(panel);if(upload)upload.onchange=async()=>{try{const data=await companionAvatarFromFile(upload.files?.[0]);persistCompanionAvatar(member,data,()=>{showCompanionCurrentPersonManager();renderCompanionDialog();});}catch(error){toast('error',error.message);}};}
  function companionConversationPreview(key,fallback='还没有消息'){const rows=settings.companionConversations?.[key];if(!Array.isArray(rows)||!rows.length)return fallback;const last=rows[rows.length-1],text=(last?.role==='assistant'?cleanCompanionText(last?.content):String(last?.content||'')).replace(/\s+/g,' ').trim();return`${last?.role==='user'?'你：':''}${text||fallback}`.slice(0,58);}
  function companionGroupFace(group,members,info=companionCharacter()){const avatar=companionMemberAvatar(group,info),participants=(group?.memberIds||[]).map(id=>members.find(member=>member.id===id)).filter(Boolean).slice(0,4);return`<span class="companion-person-face companion-group-face" title="${esc(group?.name||'群聊')}">${avatar?`<img src="${esc(avatar)}" alt="">`:`<span>${participants.map(member=>`<b>${esc(member.glyph||Array.from(member.name||'群').slice(-1)[0]||'群')}</b>`).join('')||'<b>群</b>'}</span>`}</span>`;}
  function showCompanionGroupEditor(groupId=''){
    const base=baseCompanionCharacter(),roster=companionRoster(base),members=roster.members||[],group=(roster.groups||[]).find(item=>item.id===groupId),initialIds=group?.memberIds?.length?group.memberIds:(roster.groupIds||members.slice(0,4).map(member=>member.id)),selected=new Set(initialIds),info=companionCharacter();let pendingAvatar=group?.avatar||'';
    const memberRows=members.map(member=>`<label class="companion-group-member">${companionPersonFace(member,info)}<span>${esc(member.name)}</span><input type="checkbox" data-group-member="${esc(member.id)}" ${selected.has(member.id)?'checked':''}></label>`).join('');
    openCompanionFeature(group?'群聊设置':'发起群聊',`<div class="companion-group-editor"><label>群聊名称<input data-group-name maxlength="30" value="${esc(group?.name||'')}" placeholder="例如：深夜听歌小组"></label><div class="companion-group-avatar-row">${companionGroupFace(group||{name:'新群聊',memberIds:[...selected],avatar:pendingAvatar},members,info)}<input data-group-avatar value="${esc(group?.avatar||'')}" placeholder="群头像 URL（可留空）"><label class="companion-avatar-upload">上传群头像<input type="file" data-group-upload accept="image/*" hidden></label></div><b>选择群成员</b><div class="companion-group-members">${memberRows||'<p>请先在联系人管理中添加至少两个人物。</p>'}</div><div class="companion-group-actions"><button type="button" data-group-save>${group?'保存群聊':'创建群聊'}</button>${group?'<button type="button" class="danger" data-group-delete>删除群聊</button>':''}</div></div>`,e=>{
      const panel=e.currentTarget,checked=[...panel.querySelectorAll('[data-group-member]:checked')].map(input=>input.dataset.groupMember);
      if(e.target.closest('[data-group-save]')){if(checked.length<2){toast('warning','群聊至少选择两位人物');return;}trackCompanionListeningTime({stop:true,saveNow:true});if(checked.length>6)toast('warning','群成员超过 6 人，上下文消耗会明显增加');const name=String(panel.querySelector('[data-group-name]')?.value||'').trim()||`${checked.map(id=>members.find(member=>member.id===id)?.name).filter(Boolean).slice(0,3).join('、')}的小群`;let target=group;if(!target){target={id:`chat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`,name,memberIds:checked,avatar:'',createdAt:Date.now()};roster.groups.push(target);}target.name=name;target.memberIds=checked;target.avatar=String(panel.querySelector('[data-group-avatar]')?.value||pendingAvatar||'').trim();roster.activeGroupId=target.id;roster.groupIds=[...checked];roster.phoneView='chat';settings.companionAudienceMode='multi';settings.companionChatMode='group';try{save();panel.hidden=true;companionMood(companionCharacter(),true);renderCompanionDialog();trackCompanionListeningTime({reset:true});toast('success',group?'群聊设置已保存':'群聊已创建');}catch(error){toast('error','群聊保存失败，浏览器本地空间可能已满');}return;}
      if(e.target.closest('[data-group-delete]')&&group){if(!ROOT.confirm?.(`删除群聊“${group.name}”？私聊记录不会受影响。`))return;trackCompanionListeningTime({stop:true,saveNow:true});roster.groups=roster.groups.filter(item=>item.id!==group.id);if(roster.activeGroupId===group.id)roster.activeGroupId='';delete settings.companionConversations?.[`${companionBaseKey(base)}:group-id:${group.id}`];roster.phoneView='home';save();panel.hidden=true;renderCompanionDialog();toast('success','群聊已删除');}
    });
    const panel=DOC.querySelector(`#${ID}-companion .companion-feature`),upload=panel?.querySelector('[data-group-upload]'),avatarInput=panel?.querySelector('[data-group-avatar]');bindCompanionAvatarFallbacks(panel);if(upload)upload.onchange=async()=>{try{pendingAvatar=await companionAvatarFromFile(upload.files?.[0]);if(avatarInput)avatarInput.value=pendingAvatar;const face=panel.querySelector('.companion-group-face');if(face)face.innerHTML=`<img src="${esc(pendingAvatar)}" alt="">`;toast('success','群头像已读取，保存群聊后生效');}catch(error){toast('error',error.message);}};
  }
  function companionPersonFace(member,info=companionCharacter(),extra=''){const avatar=companionMemberAvatar(member,info),glyph=member?.glyph||Array.from(member?.name||'角').slice(-1)[0]||'角';return`<span class="companion-person-face ${extra}" title="${esc(member?.name||'角色')}" aria-label="${esc(member?.name||'角色')}头像">${avatar?`<img src="${esc(avatar)}" alt="">`:''}<i>${esc(glyph)}</i></span>`;}
  function bindCompanionAvatarFallbacks(root){root?.querySelectorAll?.('.companion-person-face img').forEach(img=>{img.onerror=()=>img.remove();});}
  function renderCompanionModes(dialog,info){const base=baseCompanionCharacter(),baseKey=companionBaseKey(base),roster=companionRoster(base),members=roster.members||[],groups=roster.groups||[],bar=dialog.querySelector('.companion-modebar'),sub=dialog.querySelector('.companion-submodes'),avatars=dialog.querySelector('.companion-roster'),phoneReady=members.length>=1,home=phoneReady&&roster.phoneView==='home';if(!bar||!sub||!avatars)return;dialog.classList.toggle('companion-phone',phoneReady);dialog.classList.toggle('companion-phone-home',home);if(!phoneReady){bar.innerHTML='<b>角色陪听</b><button type="button" data-person-manage>添加联系人</button>';sub.hidden=true;avatars.hidden=true;return;}settings.companionAudienceMode='multi';bar.innerHTML=home?'<b>Selene 消息</b><button type="button" data-group-create>＋ 建群</button><button type="button" data-person-manage>管理</button>':`<button type="button" data-phone-home class="companion-phone-back">‹</button><b>${esc(info.name)}</b>${info.isGroup&&info.group?'<button type="button" data-group-edit>群设置</button>':'<button type="button" data-person-current>头像</button>'}`;sub.hidden=true;if(home){const baseMember=members.find(member=>member.isBaseCharacter),ordered=[...(baseMember?[baseMember]:[]),...members.filter(member=>member!==baseMember)],privateRows=ordered.map(member=>`<button type="button" class="companion-chat-row companion-private-row" data-person="${esc(member.id)}">${companionPersonFace(member,info)}<span><b>${esc(member.name)}</b>${member.isContextCharacter?'<small>读取当前上下文与 char 人设</small>':''}</span></button>`).join(''),groupRows=groups.map(group=>{const key=`${baseKey}:group-id:${group.id}`,count=(group.memberIds||[]).filter(id=>members.some(member=>member.id===id)).length;return`<button type="button" class="companion-chat-row companion-group-row" data-group="${esc(group.id)}">${companionGroupFace(group,members,info)}<span><b>${esc(group.name||'未命名群聊')}</b><small>${count} 人 · ${esc(companionConversationPreview(key,'群聊还没有消息'))}</small></span></button>`;}).join('');avatars.hidden=false;avatars.innerHTML=`<div class="companion-phone-section companion-contact-section"><div><button type="button" class="companion-contact-toggle" data-contact-toggle aria-expanded="${roster.contactsCollapsed?'false':'true'}">${roster.contactsCollapsed?'›':'⌄'} 联系人</button><small>${members.length}</small></div><div class="companion-contact-list" ${roster.contactsCollapsed?'hidden':''}>${baseMember?'<div class="companion-star-label">☆ 当前角色</div>':''}${privateRows}</div></div><div class="companion-phone-section"><div><b>群聊</b><button type="button" data-group-create>＋</button></div>${groupRows||'<p>还没有群聊，点右上角“建群”把喜欢的角色拉到一起。</p>'}</div>`;}else if(info.isGroup){avatars.hidden=false;avatars.innerHTML=info.participants.map(member=>`<button type="button" data-person="${esc(member.id)}" class="active" aria-pressed="true" title="${esc(member.name)}（手机长按 / 电脑右键可 @）">${companionPersonFace(member,info)}<span>${esc(member.name)}</span><em>群成员</em></button>`).join('');}else{avatars.hidden=true;avatars.innerHTML='';}bindCompanionAvatarFallbacks(avatars);}
  function bindCompanionContactToggle(dialog){const button=dialog?.querySelector('[data-contact-toggle]');if(!button)return;button.onclick=e=>{e.preventDefault();e.stopPropagation();const roster=companionRoster(baseCompanionCharacter());roster.contactsCollapsed=!roster.contactsCollapsed;save();renderCompanionDialog();};}
  function insertCompanionMention(name){const input=DOC.querySelector(`#${ID}-companion .companion-form textarea`);if(!input)return;const mention=`@${name} `,start=Number.isInteger(input.selectionStart)?input.selectionStart:input.value.length,end=Number.isInteger(input.selectionEnd)?input.selectionEnd:start;input.setRangeText(mention,start,end,'end');input.focus();toast('info',`已 @${name}`);}
  function ensureCompanionModeUi(dialog){if(dialog.querySelector('.companion-modes'))return;const modes=DOC.createElement('div');modes.className='companion-modes';modes.innerHTML='<div class="companion-modebar"></div><div class="companion-submodes" hidden></div><div class="companion-roster" hidden></div>';dialog.querySelector('.companion-song')?.before(modes);let press=null,suppressPersonClick=false,lastMention={id:'',time:0};const clearPress=()=>{if(press?.timer)ROOT.clearTimeout(press.timer);press=null;};modes.oncontextmenu=e=>{const button=e.target.closest('[data-person]');if(!button||companionRoster(baseCompanionCharacter()).phoneView==='home')return;e.preventDefault();clearPress();if(lastMention.id===button.dataset.person&&Date.now()-lastMention.time<900)return;const member=(companionRoster(baseCompanionCharacter()).members||[]).find(item=>item.id===button.dataset.person);if(member){lastMention={id:member.id,time:Date.now()};insertCompanionMention(member.name);}};modes.onpointerdown=e=>{const button=e.target.closest('[data-person]');if(!button||e.pointerType==='mouse'||companionRoster(baseCompanionCharacter()).phoneView==='home')return;clearPress();press={id:e.pointerId,x:e.clientX,y:e.clientY,timer:ROOT.setTimeout(()=>{const member=(companionRoster(baseCompanionCharacter()).members||[]).find(item=>item.id===button.dataset.person);if(member){suppressPersonClick=true;lastMention={id:member.id,time:Date.now()};insertCompanionMention(member.name);ROOT.navigator?.vibrate?.(20);ROOT.setTimeout(()=>{suppressPersonClick=false;},900);}press=null;},550)};};modes.onpointermove=e=>{if(press&&press.id===e.pointerId&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>10)clearPress();};modes.onpointerup=clearPress;modes.onpointercancel=clearPress;modes.onpointerleave=clearPress;modes.onclick=e=>{if(companionBusy)return;const roster=companionRoster(baseCompanionCharacter()),personButton=e.target.closest('[data-person]');if(personButton&&suppressPersonClick){e.preventDefault();suppressPersonClick=false;return;}const personId=personButton?.dataset.person,groupId=e.target.closest('[data-group]')?.dataset.group;if(e.target.closest('[data-person-current]')){showCompanionCurrentPersonManager();return;}if(e.target.closest('[data-person-manage]')){showCompanionRosterManager();return;}if(e.target.closest('[data-group-create]')){showCompanionGroupEditor();return;}if(e.target.closest('[data-group-edit]')){showCompanionGroupEditor(roster.activeGroupId);return;}if(e.target.closest('[data-phone-home]')){trackCompanionListeningTime({stop:true,saveNow:true});roster.phoneView='home';save();renderCompanionDialog();return;}if(groupId){trackCompanionListeningTime({stop:true,saveNow:true});roster.activeGroupId=groupId;const group=roster.groups.find(item=>item.id===groupId);roster.groupIds=[...(group?.memberIds||[])];roster.phoneView='chat';settings.companionAudienceMode='multi';settings.companionChatMode='group';save();companionMood(companionCharacter(),true);renderCompanionDialog();trackCompanionListeningTime({reset:true});return;}if(personId&&roster.phoneView==='home'){trackCompanionListeningTime({stop:true,saveNow:true});roster.selectedId=personId;roster.phoneView='chat';settings.companionAudienceMode='multi';settings.companionChatMode='private';save();companionMood(companionCharacter(),true);renderCompanionDialog();trackCompanionListeningTime({reset:true});}};}
  function ensureDesktopMentionCapture(dialog){const modes=dialog?.querySelector('.companion-modes');if(!modes||modes.dataset.desktopMentionBound)return;modes.dataset.desktopMentionBound='1';let lastId='',lastTime=0;const mention=e=>{if(companionRoster(baseCompanionCharacter()).phoneView==='home')return;const button=e.target.closest?.('[data-person]');if(!button)return;e.preventDefault();e.stopPropagation();const now=Date.now();if(lastId===button.dataset.person&&now-lastTime<700)return;const member=(companionRoster(baseCompanionCharacter()).members||[]).find(item=>item.id===button.dataset.person);if(!member)return;lastId=member.id;lastTime=now;insertCompanionMention(member.name);};modes.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===2)mention(e);},true);modes.addEventListener('mousedown',e=>{if(e.button===2)mention(e);},true);modes.addEventListener('contextmenu',mention,true);}
  function ensureCompanionModeStyles(){if(DOC.getElementById(`${ID}-companion-mode-style`))return;DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-companion-mode-style">
  #${ID}-companion:not(.companion-mini){height:min(520px,calc(var(--selene-stable-vh,100vh) - 28px))!important}#${ID}-companion.companion-phone:not(.companion-mini){height:min(650px,calc(var(--selene-stable-vh,100vh) - 20px))!important}
  #${ID}-companion .companion-modes{flex:0 0 auto;padding:6px 8px 2px;background:var(--cp-panel);border-bottom:1px solid color-mix(in srgb,var(--cp-text) 10%,transparent)}
  #${ID}-companion .companion-modebar,#${ID}-companion .companion-submodes{display:flex;gap:5px;align-items:center}#${ID}-companion .companion-modebar button:last-child{margin-left:auto}
  #${ID}-companion .companion-modebar button,#${ID}-companion .companion-submodes button{padding:3px 9px;font-size:11px}#${ID}-companion .companion-modebar button.active,#${ID}-companion .companion-submodes button.active{border-color:var(--cp-accent);color:var(--cp-accent);background:color-mix(in srgb,var(--cp-accent) 16%,transparent)}
  #${ID}-companion .companion-submodes{margin-top:5px}#${ID}-companion .companion-roster{display:flex;gap:7px;overflow-x:auto;padding:7px 1px 3px;scrollbar-width:thin}#${ID}-companion .companion-roster[hidden]{display:none}
  #${ID}-companion .companion-roster button{flex:0 0 auto;display:grid;justify-items:center;gap:2px;padding:2px 5px;border-color:transparent;background:transparent;touch-action:pan-x}#${ID}-companion .companion-roster button>span:last-child{max-width:54px;overflow:hidden;text-overflow:ellipsis;font-size:9px;white-space:nowrap;color:var(--cp-muted)}
  #${ID}-companion .companion-person-face{position:relative;display:grid;place-items:center;flex:0 0 auto;width:34px;height:34px;border:1px solid color-mix(in srgb,var(--cp-text) 24%,transparent);border-radius:50%;overflow:hidden;background:var(--cp-panel)}#${ID}-companion .companion-person-face img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}#${ID}-companion .companion-person-face i{display:grid;place-items:center;width:100%;height:100%;font-style:normal;font-weight:700}#${ID}-companion .companion-roster button.active .companion-person-face{border-color:var(--cp-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--cp-accent) 20%,transparent);color:var(--cp-accent)}
  #${ID}-companion .companion-head-glyph{position:absolute;inset:3px;display:grid;place-items:center;border-radius:50%;font-weight:800;background:var(--cp-panel);pointer-events:none}#${ID}-companion .companion-avatar{z-index:1}#${ID}-companion .quiet-dot{z-index:2}
  #${ID}-companion .companion-feature{overflow-x:hidden}#${ID}-companion .companion-person-list{display:grid;gap:10px}#${ID}-companion .companion-person-edit{min-width:0;padding:10px;border:1px solid color-mix(in srgb,var(--cp-text) 13%,transparent);border-radius:14px;background:color-mix(in srgb,var(--cp-panel) 82%,var(--cp-bg));box-shadow:inset 0 1px color-mix(in srgb,var(--cp-text) 7%,transparent)}#${ID}-companion .companion-person-card-head{display:flex;align-items:center;gap:9px;margin-bottom:10px}#${ID}-companion .companion-person-card-head>.companion-person-face{flex:0 0 42px;width:42px;height:42px}#${ID}-companion .companion-person-card-copy{min-width:0;flex:1}#${ID}-companion .companion-person-card-head b,#${ID}-companion .companion-person-card-head small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${ID}-companion .companion-person-card-head small{margin:2px 0 0;color:var(--cp-muted);font-size:10px}#${ID}-companion .companion-person-delete{color:#ffaaa8!important;border-color:#ff777744!important}#${ID}-companion .companion-person-fields{display:grid;grid-template-columns:minmax(0,1fr) minmax(84px,.45fr);gap:8px}#${ID}-companion .companion-person-fields>label,#${ID}-companion .companion-person-field{display:grid;min-width:0;gap:4px;color:var(--cp-muted);font-size:10px}#${ID}-companion .companion-person-fields input{min-width:0;padding:7px;font-size:12px}#${ID}-companion .companion-avatar-field,#${ID}-companion .companion-tone-field{grid-column:1/-1}#${ID}-companion .companion-avatar-control{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px}#${ID}-companion .companion-avatar-upload{padding:6px 10px!important;font-size:11px}#${ID}-companion .companion-person-actions{display:flex;flex-wrap:wrap;gap:7px;justify-content:flex-end;margin-top:9px}#${ID}-companion .companion-person-actions [data-person-save]{border-color:color-mix(in srgb,var(--cp-accent) 55%,transparent);background:color-mix(in srgb,var(--cp-accent) 16%,var(--cp-panel))}#${ID}-companion .companion-person-actions [data-person-chat-clear]{color:#ffb5b2;border-color:#ff777744}#${ID}-companion .companion-person-edit details{margin-top:9px;padding-top:8px;border-top:1px solid color-mix(in srgb,var(--cp-text) 10%,transparent)}#${ID}-companion .companion-person-edit details small{display:block;margin:4px;color:var(--cp-muted);overflow-wrap:anywhere}#${ID}-companion .companion-manager-actions{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}#${ID}-companion .companion-manager-note{color:var(--cp-muted);font-size:11px}
  #${ID}-companion .companion-message-row{align-self:stretch;display:flex;align-items:flex-end;gap:7px;max-width:94%}#${ID}-companion .companion-message-row .companion-person-face{width:28px;height:28px;margin-bottom:1px}#${ID}-companion .companion-message-row .companion-message{align-self:auto;max-width:calc(100% - 35px)}
  #${ID}-companion{border-color:color-mix(in srgb,var(--cp-accent) 58%,transparent)!important;box-shadow:0 24px 70px #000b,0 0 0 1px color-mix(in srgb,var(--cp-accent) 12%,transparent)!important}#${ID}-companion .companion-head{background:linear-gradient(105deg,color-mix(in srgb,var(--cp-accent) 13%,var(--cp-bg)),color-mix(in srgb,var(--cp-bg) 92%,#000))!important;box-shadow:inset 0 -1px color-mix(in srgb,var(--cp-accent) 20%,transparent)}#${ID}-companion .companion-modes{padding:9px 9px 6px!important;background:linear-gradient(180deg,color-mix(in srgb,var(--cp-bg) 78%,transparent),color-mix(in srgb,var(--cp-panel) 80%,transparent))!important}#${ID}-companion .companion-modebar button,#${ID}-companion .companion-submodes button{border-color:color-mix(in srgb,var(--cp-text) 18%,transparent)!important;background:color-mix(in srgb,var(--cp-bg) 88%,#000)!important;color:var(--cp-muted)!important;box-shadow:inset 0 1px color-mix(in srgb,var(--cp-text) 7%,transparent)!important}#${ID}-companion .companion-modebar button.active,#${ID}-companion .companion-submodes button.active{border-color:color-mix(in srgb,var(--cp-accent) 72%,transparent)!important;background:linear-gradient(145deg,color-mix(in srgb,var(--cp-accent) 28%,var(--cp-bg)),color-mix(in srgb,var(--cp-accent) 12%,var(--cp-bg)))!important;color:var(--cp-text)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--cp-accent) 12%,transparent),inset 0 1px color-mix(in srgb,var(--cp-text) 12%,transparent)!important}#${ID}-companion .companion-roster{gap:8px!important;margin-top:7px;padding:8px 3px 5px!important;border-top:1px solid color-mix(in srgb,var(--cp-text) 9%,transparent);scroll-snap-type:x proximity}#${ID}-companion .companion-roster button{position:relative!important;width:72px!important;min-height:88px!important;padding:7px 5px 5px!important;border:1px solid color-mix(in srgb,var(--cp-text) 16%,transparent)!important;border-radius:14px!important;background:color-mix(in srgb,var(--cp-bg) 91%,#000)!important;color:var(--cp-text)!important;scroll-snap-align:start;box-shadow:inset 0 1px color-mix(in srgb,var(--cp-text) 7%,transparent),0 5px 14px #0003!important;overflow:visible!important}#${ID}-companion .companion-roster button:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--cp-accent) 48%,transparent)!important}#${ID}-companion .companion-roster button.active{border-color:var(--cp-accent)!important;background:linear-gradient(155deg,color-mix(in srgb,var(--cp-accent) 27%,var(--cp-bg)),color-mix(in srgb,var(--cp-accent) 8%,var(--cp-bg)))!important;box-shadow:0 0 0 2px color-mix(in srgb,var(--cp-accent) 24%,transparent),0 8px 20px #0005,inset 0 1px color-mix(in srgb,var(--cp-text) 16%,transparent)!important}#${ID}-companion .companion-roster button.active:after{content:'✓';position:absolute;right:4px;top:4px;z-index:3;display:grid;place-items:center;width:17px;height:17px;border:2px solid var(--cp-bg);border-radius:50%;background:var(--cp-accent);color:#17171b;font:900 10px/1 system-ui}#${ID}-companion .companion-roster .companion-person-face{width:46px;height:46px;border-width:2px;background:color-mix(in srgb,var(--cp-panel) 78%,var(--cp-bg))}#${ID}-companion .companion-roster button>span:not(.companion-person-face){display:block;max-width:62px;overflow:hidden;text-overflow:ellipsis;color:var(--cp-text)!important;font-size:10px;font-weight:650;white-space:nowrap}#${ID}-companion .companion-roster button em{display:block;min-height:12px;color:var(--cp-muted);font:normal 9px/1.2 system-ui;white-space:nowrap}#${ID}-companion .companion-roster button.active em{color:var(--cp-accent);font-weight:800}#${ID}-companion .companion-song{padding:9px 11px!important;border-top:1px solid color-mix(in srgb,var(--cp-accent) 13%,transparent);border-bottom:1px solid color-mix(in srgb,var(--cp-text) 9%,transparent);background:linear-gradient(90deg,color-mix(in srgb,var(--cp-accent) 10%,var(--cp-panel)),var(--cp-panel))!important}#${ID}-companion .companion-messages{background:linear-gradient(180deg,color-mix(in srgb,var(--cp-bg) 84%,transparent),color-mix(in srgb,var(--cp-bg) 96%,#000))}#${ID}-companion .companion-message.assistant{border:1px solid color-mix(in srgb,var(--cp-text) 10%,transparent);background:color-mix(in srgb,var(--cp-panel) 88%,var(--cp-bg));box-shadow:inset 0 1px color-mix(in srgb,var(--cp-text) 8%,transparent),0 4px 12px #0002}#${ID}-companion .companion-tools{border-top:1px solid color-mix(in srgb,var(--cp-text) 9%,transparent);background:color-mix(in srgb,var(--cp-bg) 88%,transparent)}#${ID}-companion .companion-tools button{border-color:color-mix(in srgb,var(--cp-text) 14%,transparent);background:color-mix(in srgb,var(--cp-panel) 82%,var(--cp-bg))}#${ID}-companion .companion-form{background:color-mix(in srgb,var(--cp-bg) 92%,transparent)}
  #${ID}-companion.companion-phone{width:min(380px,calc(100vw - 20px));height:min(650px,calc(100dvh - 20px));border-radius:26px!important;outline:5px solid #090a0f66;overflow:hidden}#${ID}-companion.companion-phone .companion-head{min-height:62px;padding:9px 12px!important}#${ID}-companion.companion-phone .companion-modebar{min-height:39px;gap:7px}#${ID}-companion.companion-phone .companion-modebar>b{min-width:0;flex:1;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#${ID}-companion .companion-phone-back{width:31px;min-width:31px;padding:2px!important;font-size:25px!important;line-height:1!important}#${ID}-companion.companion-phone-home .companion-modes{display:flex;flex:1 1 auto;min-height:0;flex-direction:column;padding:10px!important}#${ID}-companion.companion-phone-home .companion-song,#${ID}-companion.companion-phone-home .companion-messages,#${ID}-companion.companion-phone-home .companion-tools,#${ID}-companion.companion-phone-home .companion-form{display:none!important}#${ID}-companion.companion-phone-home .companion-roster{display:block!important;flex:1;min-height:0;margin:6px -2px 0!important;padding:0 2px 16px!important;border:0!important;overflow-y:auto;overflow-x:hidden}#${ID}-companion .companion-phone-section{margin-bottom:14px}#${ID}-companion .companion-phone-section>div:first-child{display:flex;align-items:center;gap:7px;padding:7px 4px;color:var(--cp-muted)}#${ID}-companion .companion-phone-section>div:first-child>b{color:var(--cp-text);font-size:13px}#${ID}-companion .companion-phone-section>div:first-child>small{font-size:10px}#${ID}-companion .companion-phone-section>div:first-child>button{width:auto!important;min-width:0!important;min-height:0!important;margin-left:auto;padding:1px 8px!important;border-radius:8px!important}#${ID}-companion .companion-chat-row{display:flex!important;align-items:center!important;width:100%!important;min-height:62px!important;margin:0 0 5px!important;padding:7px 9px!important;border:1px solid color-mix(in srgb,var(--cp-text) 10%,transparent)!important;border-radius:15px!important;background:linear-gradient(100deg,color-mix(in srgb,var(--cp-panel) 92%,var(--cp-bg)),color-mix(in srgb,var(--cp-bg) 90%,#000))!important;text-align:left!important;box-shadow:inset 0 1px color-mix(in srgb,var(--cp-text) 8%,transparent),0 4px 12px #0002!important}#${ID}-companion .companion-chat-row:hover{transform:translateX(2px)!important;border-color:color-mix(in srgb,var(--cp-accent) 48%,transparent)!important}#${ID}-companion .companion-chat-row>.companion-person-face{flex:0 0 45px;width:45px;height:45px}#${ID}-companion .companion-chat-row>span:nth-child(2){display:block!important;flex:1;min-width:0;max-width:none!important;width:auto!important;margin-left:10px;color:inherit!important}#${ID}-companion .companion-chat-row>span:nth-child(2)>b,#${ID}-companion .companion-chat-row>span:nth-child(2)>small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${ID}-companion .companion-chat-row>span:nth-child(2)>b{font-size:13px;color:var(--cp-text)}#${ID}-companion .companion-chat-row>span:nth-child(2)>small{margin-top:3px;font-size:10px;color:var(--cp-muted)}#${ID}-companion .companion-chat-row>i{font-size:19px;font-style:normal;color:var(--cp-muted)}#${ID}-companion .companion-group-face>span{display:grid;width:100%;height:100%;grid-template-columns:repeat(2,1fr);gap:1px;padding:3px}#${ID}-companion .companion-group-face b{display:grid;place-items:center;border-radius:50%;background:color-mix(in srgb,var(--cp-accent) 20%,var(--cp-bg));font-size:9px}#${ID}-companion .companion-avatar-upload{display:inline-flex!important;align-items:center;justify-content:center;padding:6px 9px;border:1px solid color-mix(in srgb,var(--cp-text) 20%,transparent);border-radius:9px;background:var(--cp-panel);cursor:pointer;white-space:nowrap}#${ID}-companion .companion-group-editor>label{display:block;margin:8px 0}#${ID}-companion .companion-group-avatar-row{display:grid;grid-template-columns:45px minmax(0,1fr) auto;align-items:center;gap:7px;margin:10px 0 14px}#${ID}-companion .companion-group-avatar-row .companion-person-face{width:45px;height:45px}#${ID}-companion .companion-group-members{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:8px 0 13px}#${ID}-companion .companion-group-member{display:flex!important;align-items:center;gap:7px;margin:0!important;padding:7px;border:1px solid color-mix(in srgb,var(--cp-text) 12%,transparent);border-radius:12px;background:var(--cp-panel);cursor:pointer}#${ID}-companion .companion-group-member:has(input:checked){border-color:var(--cp-accent);background:color-mix(in srgb,var(--cp-accent) 14%,var(--cp-panel))}#${ID}-companion .companion-group-member .companion-person-face{width:32px;height:32px}#${ID}-companion .companion-group-member>span:nth-child(2){min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${ID}-companion .companion-group-member input{width:auto;margin:0}#${ID}-companion .companion-group-actions{display:flex;gap:7px;justify-content:flex-end}#${ID}-companion .companion-group-actions .danger{margin-right:auto;color:#ffaaa8;border-color:#ff777755}
  #${ID}-companion .companion-head .companion-settings-button,#${ID}-companion .companion-head .companion-close{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;min-width:36px;padding:0!important;line-height:1}#${ID}-companion .companion-head .companion-settings-button{margin-left:2px;font-size:16px}#${ID}-companion.companion-mini .companion-settings-button{display:none!important}
  #${ID}-companion.companion-phone-home .companion-roster .companion-chat-row{position:relative!important;display:flex!important;align-items:center!important;justify-items:initial!important;gap:12px!important;width:100%!important;min-width:0!important;min-height:54px!important;height:auto!important;margin:0!important;padding:6px 5px!important;border:0!important;border-bottom:1px solid color-mix(in srgb,var(--cp-text) 10%,transparent)!important;border-radius:0!important;background:transparent!important;text-align:left!important;box-shadow:none!important;transform:none!important;overflow:hidden!important;touch-action:manipulation}#${ID}-companion.companion-phone-home .companion-roster .companion-chat-row:hover{border-color:color-mix(in srgb,var(--cp-text) 10%,transparent)!important;background:color-mix(in srgb,var(--cp-text) 6%,transparent)!important;transform:none!important}#${ID}-companion.companion-phone-home .companion-roster .companion-chat-row:after{content:none!important}#${ID}-companion.companion-phone-home .companion-roster .companion-chat-row>.companion-person-face{flex:0 0 42px!important;width:42px!important;height:42px!important;border-width:0!important;border-radius:8px!important;box-shadow:none!important}#${ID}-companion.companion-phone-home .companion-roster .companion-chat-row>.companion-person-face img{border-radius:8px!important}#${ID}-companion.companion-phone-home .companion-roster .companion-chat-row>span:nth-child(2){display:block!important;flex:1 1 auto!important;min-width:0!important;width:auto!important;max-width:none!important;margin:0!important;color:inherit!important}#${ID}-companion.companion-phone-home .companion-roster .companion-chat-row>span:nth-child(2)>b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--cp-text)!important;font-size:14px;font-weight:650}#${ID}-companion.companion-phone-home .companion-roster .companion-private-row>span:nth-child(2)>small{display:none!important}#${ID}-companion.companion-phone-home .companion-phone-section{margin-bottom:8px}#${ID}-companion.companion-phone-home .companion-phone-section>div:first-child{padding:6px 5px}
  #${ID}-companion .companion-contact-toggle{display:inline-flex!important;align-items:center;width:auto!important;min-width:0!important;min-height:0!important;padding:2px 4px!important;border:0!important;background:transparent!important;box-shadow:none!important;color:var(--cp-text)!important;font-size:13px!important;font-weight:700}#${ID}-companion .companion-star-label{padding:5px 8px;color:var(--cp-muted);font-size:11px;border-bottom:1px solid color-mix(in srgb,var(--cp-text) 8%,transparent)}#${ID}-companion .companion-contact-list[hidden]{display:none!important}
  @media(max-width:520px){#${ID}-companion .companion-person-fields{grid-template-columns:minmax(0,1fr) 82px}#${ID}-companion .companion-group-members{grid-template-columns:1fr}}
  </style>`);}
  ensureCompanionModeStyles();
  function companionMentionIds(text,info=companionCharacter()){if(!info.isGroup)return[];return info.participants.filter(member=>String(text||'').includes(`@${member.name}`)).map(member=>member.id);}
  function companionAssistantParts(content,info){content=cleanCompanionText(content);if(!info.isMulti)return[];if(!info.isGroup)return[{member:info.selected,content}];const parts=[];for(const rawLine of content.split(/\r?\n/)){const line=rawLine.trim();if(!line)continue;const match=line.match(/^([^：:\n]{1,24})[：:]\s*(.*)$/),name=cleanCompanionPersonName(match?.[1]||''),member=match&&info.members.find(item=>item.name===match[1].trim()||cleanCompanionPersonName(item.name)===name);if(member)parts.push({member,content:match[2]});else if(parts.length)parts[parts.length-1].content+=`\n${line}`;else parts.push({member:null,content:line});}return parts;}
  function companionMessageItems(message,info){
    const role=message.role==='assistant'?'assistant':'user',time=Number(message.time)||0;
    const parts=role==='assistant'?companionAssistantParts(cleanCompanionText(message.content),info):[];
    const entries=parts.length?parts:[{member:null,content:role==='assistant'?cleanCompanionText(message.content):String(message.content||'')}];
    return entries.flatMap(part=>String(part.content||'').split(/\n+/).filter(line=>line.trim()).map(content=>({role,time,member:part.member,content,sender:role==='user'?'user':part.member?.id||'assistant'})));
  }
  function companionBubbleMarkup(item,info,{continuation=false,tail=true}={}){
    const name=info.isGroup&&item.member&&!continuation?`<small class="companion-sender">${esc(item.member.name)}</small>`:'';
    const bubble=`<div class="companion-message ${item.role}${tail?' has-tail':''}"><span class="companion-bubble-surface" aria-hidden="true"></span><span class="companion-bubble-text">${esc(item.content)}</span></div>`;
    const face=info.isGroup&&item.member?companionPersonFace(item.member,info):'';
    return `<div class="companion-imessage-row ${item.role}${continuation?' continuation':''}" data-sender="${esc(item.sender)}">${face}<div class="companion-message-stack">${name}${bubble}</div></div>`;
  }
  function companionMessageMarkup(message,info){return companionMessageItems(message,info).map(item=>companionBubbleMarkup(item,info)).join('');}
  function companionConversationMarkup(list,info){
    const items=list.flatMap(message=>companionMessageItems(message,info));
    const together=(a,b)=>!!a&&!!b&&a.sender===b.sender&&a.role===b.role&&(!a.time||!b.time||Math.abs(b.time-a.time)<300000);
    return items.map((item,index)=>{
      const previous=items[index-1],showTime=item.time&&(!previous?.time||item.time-previous.time>=300000);
      const date=showTime?`<div class="companion-message-date">${esc(new Date(item.time).toLocaleString('zh-CN',{month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}))}</div>`:'';
      return date+companionBubbleMarkup(item,info,{continuation:together(previous,item),tail:!together(item,items[index+1])});
    }).join('');
  }
  function renderCompanionDialog(){
    const dialog=DOC.getElementById(`${ID}-companion`);if(!dialog)return;ensureCompanionModeUi(dialog);ensureDesktopMentionCapture(dialog);
    const base=baseCompanionCharacter(),roster=companionRoster(base),descriptionSignature=companionDescriptionSignature(base);if((!roster.scannedAt||roster.scanVersion!==COMPANION_ROSTER_SCAN_VERSION||roster.descriptionSignature!==descriptionSignature)&&!roster.scanning)ROOT.setTimeout(ensureCompanionRosterScan,0);
    const info=companionCharacter(),phoneHome=companionRoster(base).phoneView==='home',avatar=companionAvatar(phoneHome?{...base,isMulti:false,isGroup:false}:info),song=companionSongContext(),messages=dialog.querySelector('.companion-messages');renderCompanionModes(dialog,info);bindCompanionContactToggle(dialog);
    dialog.querySelector('[data-companion-name]').textContent=dialog.classList.contains('companion-phone-home')?'Selene 消息':info.name;dialog.querySelector('[data-companion-mode]').textContent=info.isGroup?`${info.participants.map(member=>member.name).join('、')} · 群聊`:`心情 · ${companionMood(info)}`;dialog.querySelector('.quiet-dot').textContent=settings.companionQuiet?'静':'♫';
    const img=dialog.querySelector('.companion-avatar'),avatarButton=dialog.querySelector('.companion-avatar-button');let glyph=dialog.querySelector('.companion-head-glyph');if(!glyph&&avatarButton){glyph=DOC.createElement('span');glyph.className='companion-head-glyph';avatarButton.prepend(glyph);}if(glyph)glyph.textContent=info.isMulti&&!info.isGroup?(info.selected?.glyph||Array.from(info.name).slice(-1)[0]||'角'):(Array.from(info.name).slice(-1)[0]||'角');if(avatar){img.src=avatar;img.hidden=false;img.onerror=()=>{img.hidden=true;};}else{img.removeAttribute('src');img.hidden=true;}
    dialog.querySelector('.companion-song').textContent=`♫ ${song.song}${song.lyric?` · ${song.lyric}`:''}`;messages.innerHTML=companionConversationMarkup(companionMessages(info),info)||`<div class="companion-empty">${info.isGroup?'勾选参与人物后开始群聊；手机长按头像或电脑右键头像即可 @。':'和当前角色一起听歌吧。头像可以缩成悬浮球；这里的对话不会写进主聊天。'}</div>`;bindCompanionAvatarFallbacks(messages);if(companionBusy)messages.insertAdjacentHTML('beforeend',`<div class="companion-message assistant companion-typing">${esc(info.isGroup?'群成员':info.name)} 正在回应…${companionMessageQueue.length?` · 已排队 ${companionMessageQueue.length} 条`:''}</div>`);dialog.querySelectorAll('.companion-tools button,.companion-modebar button,.companion-submodes button,.companion-roster button').forEach(control=>control.disabled=companionBusy);syncCompanionAppearance();messages.scrollTop=messages.scrollHeight;
  }
  async function processCompanionMessage(content){let info=companionCharacter();if(info.isMulti&&!info.isGroup){const mentioned=info.members.find(member=>content.includes(`@${member.name}`));if(mentioned&&mentioned.id!==info.roster.selectedId){trackCompanionListeningTime({stop:true,saveNow:true});info.roster.selectedId=mentioned.id;save();info=companionCharacter();trackCompanionListeningTime({reset:true});}}activeCompanionMentionIds=companionMentionIds(content,info);info=companionCharacter();const messages=companionMessages(info);messages.push({role:'user',content:content.slice(0,4000),time:Date.now()});setCompanionMessages(messages,info);save();try{if(isCompanionSongRequest(content)){await fulfillCompanionSongRequest(content);return;}const reply=await runCompanionTask('',{addToChat:true,tts:true});if(reply)renderCompanionDialog();}finally{activeCompanionMentionIds=[];}}
  async function drainCompanionMessageQueue(){if(companionQueueDraining||companionBusy||disposed||!companionMessageQueue.length)return;companionQueueDraining=true;try{while(companionMessageQueue.length&&!disposed){const content=companionMessageQueue.shift();await processCompanionMessage(content);}}finally{companionQueueDraining=false;renderCompanionDialog();}}
  function sendCompanionMessage(text){const content=String(text||'').trim();if(!content)return;companionMessageQueue.push(content);if(companionBusy||companionQueueDraining)toast('info',`已排队，将连续完成 ${companionMessageQueue.length} 条请求`);drainCompanionMessageQueue();renderCompanionDialog();}
  async function automaticCompanionReaction(prompt){if(companionBusy||settings.companionQuiet)return;const reply=await runCompanionTask(prompt,{addToChat:true,tts:true});if(reply)toast('info',`${companionCharacter().name} 在陪听窗里说了一句话`);}
  function toggleCompanionMini(value){const dialog=DOC.getElementById(`${ID}-companion`),next=value??!settings.companionMini;if(next===settings.companionMini)return;if(next)dialog?.querySelector('textarea')?.blur();settings.companionMini=next;save();syncCompanionAppearance();ROOT.requestAnimationFrame?.(()=>applyCompanionPosition(dialog));if(!next&&!companionCompactViewport())ROOT.setTimeout(()=>dialog?.querySelector('textarea')?.focus(),0);}
  function openCompanionDialog(){ensureCompanionStyle();let dialog=DOC.getElementById(`${ID}-companion`);if(!dialog){DOC.body.insertAdjacentHTML('beforeend',`<section id="${ID}-companion" role="dialog" aria-label="角色陪听"><header class="companion-head"><button type="button" class="companion-avatar-button" title="点击缩成角色头像悬浮球"><img class="companion-avatar" alt=""><i class="quiet-dot">♫</i></button><div class="companion-identity"><b data-companion-name>当前角色</b><small data-companion-mode></small></div><button type="button" class="companion-settings-button" data-companion-settings aria-label="角色陪听设置" title="角色陪听设置">⚙</button><button type="button" class="companion-close" aria-label="关闭">×</button></header><div class="companion-song"></div><div class="companion-settings" hidden><div class="companion-settings-head"><b>⚙ 角色陪听设置</b><button type="button" data-settings-close>×</button></div><label>生成方式<select name="companionMode"><option value="custom">自定义 OpenAI 兼容 API（默认）</option><option value="sillytavern">SillyTavern 当前角色与当前模型</option></select></label><div data-companion-custom><label>API 地址<input name="companionApiUrl" type="url" placeholder="https://api.example.com/v1"></label><label>API Key<input name="companionApiKey" type="password" autocomplete="off" placeholder="sk-…（本地接口可留空）"></label><label>模型名<div class="model-fetch"><div class="model-combobox"><input name="companionModel" autocomplete="off" placeholder="手动填写或获取后选择"><button type="button" data-toggle-models aria-hidden="true" tabindex="-1">▾</button><select class="model-native-picker" data-model-picker aria-label="选择模型"></select></div><button type="button" data-fetch-models>获取列表</button></div><small data-model-status>支持兼容接口模型列表，也可手动填写模型名</small></label></div><label>最大回复 token<input name="companionMaxTokens" type="number" min="32" max="4096"></label><label class="inline-setting"><input name="companionAutoSong" type="checkbox"><span>播放新歌时自动回应</span></label><label>每首自动回应上限<select name="companionAutoLimit"><option value="1">最多 1 次</option><option value="2">最多 2 次</option></select></label><label class="inline-setting"><input name="companionQuiet" type="checkbox"><span>完全安静（关闭所有自动回应与 TTS）</span></label><label class="inline-setting"><input name="companionDuoMode" type="checkbox"><span>双人模式（角色可以建议重听或换歌）</span></label><label class="inline-setting"><input name="companionTts" type="checkbox"><span>使用 SillyTavern 已配置的 TTS 朗读回复</span></label><label class="inline-setting"><input name="companionAutoTicket" type="checkbox"><span>歌曲结束后自动生成听后票根</span></label><small>API Key 仅保存在当前浏览器 localStorage；自定义服务需要允许跨域。</small></div><div class="companion-feature" hidden></div><div class="companion-messages" aria-live="polite"></div><div class="companion-tools"><button type="button" data-companion-song>聊聊这首歌</button><button type="button" data-companion-lyric>问这句歌词</button><button type="button" data-companion-ours>♡ 我们的歌</button><button type="button" data-companion-pick>角色点歌</button><button type="button" data-companion-mood>心情选歌</button><button type="button" data-companion-memory>音乐记忆</button><button type="button" data-companion-duration>陪听时长</button><button type="button" data-companion-ticket>听后票根</button></div><form class="companion-form"><textarea name="message" maxlength="4000" placeholder="iMessage" aria-label="和角色说点什么（Enter 发送，Shift+Enter 换行）"></textarea><button type="submit" class="companion-send" aria-label="发送消息" title="发送消息">↑</button></form></section>`);dialog=DOC.getElementById(`${ID}-companion`);const settingsPanel=dialog.querySelector('.companion-settings');dialog.querySelector('[data-companion-settings]').innerHTML=seleneControlIcon('gear');dialog.querySelector('.companion-close').onclick=()=>{trackCompanionListeningTime({stop:true,saveNow:true});dialog.hidden=true;};dialog.querySelector('.companion-avatar-button').onclick=()=>{if(!companionDragged)toggleCompanionMini();};dialog.querySelector('[data-settings-close]').onclick=()=>settingsPanel.hidden=true;dialog.querySelector('[data-companion-settings]').onclick=()=>{syncCompanionSettings(dialog);settingsPanel.hidden=false;dialog.querySelector('.companion-feature').hidden=true;};settingsPanel.onchange=()=>saveCompanionSettings(settingsPanel);settingsPanel.querySelector('[data-fetch-models]').onclick=()=>{saveCompanionSettings(settingsPanel);fetchCompanionModels();};bindCompanionModelMenu(dialog);dialog.querySelector('[data-companion-song]').onclick=()=>sendCompanionMessage(current?`我们正在听《${current.title}》${current.artist?`，歌手是 ${current.artist}`:''}。你现在有什么感受？`:'现在还没有播放歌曲，陪我随便聊聊音乐吧。');dialog.querySelector('[data-companion-lyric]').onclick=askCurrentLyric;dialog.querySelector('[data-companion-ours]').onclick=showOurSongs;dialog.querySelector('[data-companion-pick]').onclick=()=>askCompanionToPick();dialog.querySelector('[data-companion-mood]').onclick=showMoodPicker;dialog.querySelector('[data-companion-memory]').onclick=showCompanionMemories;dialog.querySelector('[data-companion-duration]').onclick=showCompanionListeningStats;dialog.querySelector('[data-companion-ticket]').onclick=()=>createCompanionTicket();dialog.querySelector('.companion-form').onsubmit=e=>{e.preventDefault();const input=e.currentTarget.message,text=input.value;if(!text.trim())return;input.value='';sendCompanionMessage(text);};dialog.querySelector('textarea').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();dialog.querySelector('.companion-form').requestSubmit();}};}companionMood(companionCharacter(),true);dialog.hidden=false;renderCompanionDialog();trackCompanionListeningTime({reset:true});if(settings.companionMini)syncCompanionAppearance();else if(!companionCompactViewport())ROOT.setTimeout(()=>dialog.querySelector('textarea')?.focus(),0);preserveMiniGeometry();}
  function maybeAutoCompanion(song,alreadyReplied=false){if(!song)return;const key=offlineKey(song);if(key!==companionAutoSongKey){companionAutoSongKey=key;companionAutoCount=0;companionMidSongDone=false;}if(alreadyReplied){companionMidSongDone=true;companionAutoCount=Math.max(companionAutoCount,2);return;}if(!settings.companionAutoSong||settings.companionQuiet||companionAutoCount>=Math.max(1,Math.min(2,Number(settings.companionAutoLimit)||1)))return;companionAutoCount++;ROOT.setTimeout(()=>automaticCompanionReaction(`刚刚开始播放《${song.title||'这首歌'}》${song.artist?`，歌手是 ${song.artist}`:''}。请自然地说一句此刻想对用户说的话。`),900);}
  function maybeMidSongCompanion(){if(!settings.companionDuoMode||!settings.companionAutoSong||settings.companionQuiet||companionMidSongDone||companionBusy||companionAutoCount>=Math.max(1,Math.min(2,Number(settings.companionAutoLimit)||1)))return;const duration=Number(audio.duration),now=Number(audio.currentTime);if(!Number.isFinite(duration)||duration<40||now/duration<.52)return;companionMidSongDone=true;companionAutoCount++;automaticCompanionReaction(`歌曲已经听到一半，当前歌词是“${String(currentLyricWords||'').slice(0,260)}”。请简短说一句此刻的反应；可以建议再听一次或换歌，但不要替用户操作。`);}
  async function clearPlayerCaches(){
    stopPlayback({release:true});++searchRequest;dataCacheGeneration++;
    resultCoverObserver?.disconnect();resultCoverObserver=null;
    for(const controller of dataRequestControllers)controller.abort();dataRequestControllers.clear();
    gdResponses.clear();gdRequests.clear();lyricCache.clear();lyricRequests.clear();coverResponses.clear();coverRequests.clear();failedPlaybackUrls.clear();playbackBlobRetryUsed=false;
    delete settings.bilibiliSearchMetadata;
    if(audioSession)try{audioSession.type='auto';applyAudioSessionMode();}catch{}
    const songs=[current,...queue,...results,...(settings.favorites||[]),...(settings.playlists||[]).flatMap(playlist=>playlist.songs||[])];
    for(const song of new Set(songs.filter(Boolean)))if(song.source!=='direct')song.audio='';
    // Preserve rate-limit clocks: clearing local caches cannot reset the service's quota.
    let offlineError;try{await offlineRequest('readwrite','clear');}catch(error){offlineError=error;}
    results=[];const list=DOC.querySelector(`#${ID} .list`);if(list){list.replaceChildren();list.hidden=true;}
    save();paintTime();const message=offlineError?'临时缓存已清理；离线缓存清理失败，请稍后重试':'已清空播放器缓存，收藏、歌单和陪听数据已保留';
    setStatus(message);toast(offlineError?'warning':'success',message);return !offlineError;
  }
  function resetPlayerDefaults(){
    playbackSources=new WeakMap();
    stopPlayback({release:true});stopKeepAlive({persist:false});
    for(const [key,value] of Object.entries(defaults))if(!key.startsWith('companion')&&!['favorites','playlists'].includes(key))settings[key]=value&&typeof value==='object'?JSON.parse(JSON.stringify(value)):value;
    const host=DOC.getElementById(ID);if(!host)return;
    resetPublicPosition();resetPublicWindow();bindUiPresetOnly(host);applyTheme(host);applySkin(host);applyCustomScales(host);applyAudioSessionMode();
    audio.volume=settings.volume;const volume=host.querySelector('.volume input');if(volume){volume.value=settings.volume*100;volume.style.setProperty('--range-fill',`${settings.volume*100}%`);}
    syncSearchPlaceholder(host);
    host.dataset.miniShape=settings.miniShape;const shape=host.querySelector('[name=miniShape]');if(shape)shape.value=settings.miniShape;
    const panel=host.querySelector('.settings-panel');if(panel)panel.style.display='none';
    const lyrics=DOC.getElementById(`${ID}-lyrics-float`);if(lyrics)lyrics.hidden=true;
    host.querySelector('.desktop-lyric-toggle')?.setAttribute('aria-expanded','false');closeSkinMenu(host);
    updatePlayMode();updateLyricsLock();updateQuickLyricsButton(host);applyPlayerVisibility(true);paintTime();save();
    toast('success','已恢复播放器默认设置，收藏、歌单、离线歌曲与陪听设置已保留');
  }
  function settingsDialog(){
    const host=DOC.getElementById(ID);if(!host)return;
    let f=host.querySelector('.settings-panel');
    if(f&&f.style.display!=='none'){f.style.display='none';return;}
    closeSkinMenu(host);
    if(!f){
      host.insertAdjacentHTML('beforeend',`<form class="settings-panel" style="position:absolute;inset:45px 0 0;overflow:auto">
        <div class="settings-heading"><h3>播放器设置 <small data-player-version>v${VERSION}</small></h3><button type="button" data-x aria-label="关闭设置">×</button></div>
        <div class="set-grid">
          <label class="set-card setting-field"><span>搜索入口</span><select name="searchMode">${Object.entries(SEARCH_MODES).map(([value,{label}])=>`<option value="${value}">${label}</option>`).join('')}</select><small>用于播放器搜索框，切换后立即生效。</small></label>
          <label class="set-card setting-field"><span>GD 搜索音源</span><select name="searchSource"><option value="auto">自动 · 网易云 → JOOX</option>${GD_SOURCES.map(source=>`<option value="${source}">${GD_SOURCE_LABELS[source]}</option>`).join('')}</select><small>此处只选择搜索来源。播放默认自动回退；播放键左侧的双箭头图标可单独切换当前歌曲音源。</small></label>
          <label class="set-card setting-toggle"><span>LX Music 第三方备用音源（网易云失败后尝试 QQ）</span><input type="checkbox" name="lxMusicEnabled"></label>
          <label class="set-card setting-toggle"><span>自动读取推荐</span><input type="checkbox" name="auto"></label>
          <div class="set-card setting-field" data-keepalive-card><div class="setting-row"><b>系统媒体保活</b><small data-keepalive-state>未启动</small></div><small>未选歌时运行静音保活；选歌后由当前歌曲接管锁屏与控制中心。</small><button type="button" data-keepalive-toggle>开启自动保活</button></div>
          <label class="set-card setting-field"><span>与其他应用播放</span><select name="audioSessionMode"><option value="priority">优先播放（推荐）</option><option value="mix">允许同时播放</option></select><small>同时播放的实际效果由系统与浏览器决定。</small></label>
          <label class="set-card setting-field"><span>界面规格</span><select name="playerSize"><option value="s">小巧</option><option value="m">标准</option><option value="l">宽屏</option></select></label>
          <div class="set-card setting-field"><b>修复与重置</b><small>清空搜索、歌词、临时音源和离线歌曲缓存，保留收藏、歌单与陪听数据；恢复默认仅重置播放器偏好。</small><button type="button" data-clear-player-cache>清空播放器缓存</button><button type="button" data-reset-player-defaults>恢复默认设置</button></div>
        </div>
      </form>`);f=host.querySelector('.settings-panel');
    }
    f.style.display='block';updateKeepAliveUI();
    f.elements.auto.checked=settings.autoLoad;f.elements.playerSize.value=settings.playerSize;
    f.elements.lxMusicEnabled.checked=!!settings.lxMusicEnabled;
    f.elements.searchMode.value=settings.searchMode;
    f.elements.audioSessionMode.value=settings.audioSessionMode==='mix'?'mix':'priority';f.elements.searchSource.value=GD_SOURCES.includes(settings.searchSource)?settings.searchSource:'auto';
    f.querySelector('[data-keepalive-toggle]').onclick=async()=>{if(settings.keepAlive)stopKeepAlive({persist:true,notify:true});else await startKeepAlive({persist:true,notify:true});updateKeepAliveUI();};
    f.onchange=event=>{
      const input=event.target;if(!input.name)return;
      if(input.name==='auto')settings.autoLoad=input.checked;
      if(input.name==='lxMusicEnabled')settings.lxMusicEnabled=input.checked;
      if(input.name==='searchMode'){
        settings.searchMode=input.value;
        ++searchRequest;
        syncSearchPlaceholder(host);
      }
      if(input.name==='searchSource')settings.searchSource=GD_SOURCES.includes(input.value)?input.value:'auto';
      if(input.name==='playerSize'){settings.playerSize=input.value;bindUiPresetOnly(host);applyPlayerSize(host);}
      if(input.name==='audioSessionMode')setPublicAudioSessionMode(input.value);
      save();
    };
    f.querySelector('[data-clear-player-cache]').onclick=async event=>{if(!ROOT.confirm?.('清空播放器临时缓存和已下载的离线歌曲？收藏、歌单、手动音源和陪听数据会保留。'))return;const button=event.currentTarget;button.disabled=true;try{await clearPlayerCaches();}finally{button.disabled=false;}};
    f.querySelector('[data-reset-player-defaults]').onclick=()=>{if(ROOT.confirm?.('恢复播放器默认外观、歌词、音源和播放偏好？收藏、歌单、离线歌曲与陪听设置、记录会保留。'))resetPlayerDefaults();};
    f.onsubmit=event=>event.preventDefault();f.querySelector('[data-x]').onclick=()=>f.style.display='none';
  }
  function bindReliableTap(button,handler){if(!button)return;let lastTouchAt=0;button.style.setProperty('touch-action','manipulation','important');const activate=e=>{if(e?.type==='click'&&e.detail!==0&&Date.now()-lastTouchAt<500)return;e?.preventDefault?.();e?.stopPropagation?.();handler(e);};button.onclick=activate;button.onpointerup=e=>{if(e.pointerType==='mouse')return;lastTouchAt=Date.now();activate(e);};}
  function syncSearchPlaceholder(player){
    player.querySelector('.search-query').placeholder=SEARCH_MODES[settings.searchMode].placeholder;
  }
  function bindSearchForm(form){
    const input=form.querySelector('.search-query');
    form.onsubmit=event=>{
      event.preventDefault();
      const word=input.value.trim();
      if(!word)return;
      if(settings.searchMode==='bilibili-web'){
        ++searchRequest;
        bilibili.openSearch(word);
        return;
      }
      if(settings.searchMode==='other'){void searchOtherMusic(word);return;}
      const bvid=bilibili.inputId(word);
      if(bvid)showBilibiliVideo(bvid);
      else void search(word);
    };
  }
  function bind(el){bindReliableTap(el.querySelector('.selene-player-close'),()=>{setPublicVisible(false);menu();});el.querySelector('.gear').onclick=settingsDialog;syncSearchPlaceholder(el);bindSearchForm(el.querySelector('.selene-search-form'));el.querySelector('[data-video-stop]').onclick=bilibiliPlayer.close;el.querySelector('.actions').onclick=e=>{const a=e.target.dataset.a;if(a==='rec')recommendation(true);if(a==='fav-queue'){const favorites=settings.favorites||[],known=new Set(queue.map(x=>x.id));let added=0;for(const song of favorites)if(!known.has(song.id)){queue.push(strip(song));known.add(song.id);added++;}count();setStatus(added?`已将 ${added} 首收藏加入播放队列`:'收藏歌曲已在播放队列中');}if(a==='playlist'){const link=ROOT.prompt?.('粘贴网易云、QQ 音乐或酷狗歌单链接');if(link)importPlaylist(link);}if(a==='offline')showOfflineSongs();};el.querySelector('.controls').onclick=e=>{const c=e.target.dataset.c;if(c==='play'&&current){if(!playbackWanted||audio.paused&&playbackPhase!=='loading'){void resumeMainAudioFromMediaSession();}else{playbackWanted=false;++playRequest;cancelPlaybackProbe?.();playbackPhase='idle';audio.pause();updatePlayButton();}}if(c==='mode'){settings.playMode={loop:'one',one:'shuffle',shuffle:'loop'}[settings.playMode]||'loop';updatePlayMode(true);save();}if(c==='prev'||c==='next'){const song=nextSong(c==='next'?1:-1);if(song)play(song);}};const progress=el.querySelector('.progress'),beginProgress=()=>{progress.classList.add('is-seeking');progressSeeking=true;pendingProgressValue=Number(progress.value)||0;},previewProgress=e=>{progressSeeking=true;pendingProgressValue=Math.max(0,Math.min(1000,Number(e.target.value)||0));e.target.style.setProperty('--range-fill',`${pendingProgressValue/10}%`);const duration=Number(audio.duration);if(Number.isFinite(duration)&&duration>0)el.querySelector('.time').textContent=`${clock(duration*pendingProgressValue/1000)} / ${clock(duration)}`;},commitProgress=()=>{progress.classList.remove('is-seeking');const duration=Number(audio.duration);if(Number.isFinite(duration)&&duration>0)audio.currentTime=duration*pendingProgressValue/1000;progressSeeking=false;updateMediaPosition(true);paintTime();},cancelProgress=()=>{progress.classList.remove('is-seeking');progressSeeking=false;paintTime();};progress.onpointerdown=beginProgress;progress.ontouchstart=beginProgress;progress.oninput=previewProgress;progress.onchange=commitProgress;progress.onpointerup=commitProgress;progress.ontouchend=commitProgress;progress.onpointercancel=cancelProgress;progress.ontouchcancel=cancelProgress;el.querySelector('.volume input').style.setProperty('--range-fill',`${settings.volume*100}%`);el.querySelector('.volume input').oninput=e=>{e.target.style.setProperty('--range-fill',`${e.target.value}%`);audio.volume=e.target.value/100;settings.volume=audio.volume;save();};let p;const head=el.querySelector('.selene-player-head');head.style.touchAction='none';head.onpointerdown=e=>{if(e.target.closest('button,.lyrics-tools')||(e.pointerType==='mouse'&&(e.button!==0||!e.isPrimary)))return;const rect=el.getBoundingClientRect();p={id:e.pointerId,x:e.clientX,y:e.clientY,l:rect.left,t:rect.top,mobile:isMobile()};head.setPointerCapture?.(e.pointerId);e.preventDefault();};head.onpointermove=e=>{if(!p||e.pointerId!==p.id||(e.pointerType==='mouse'&&(e.buttons&1)!==1))return;if(p.mobile){const width=ROOT.visualViewport?.width||ROOT.innerWidth,height=ROOT.visualViewport?.height||ROOT.innerHeight,left=Math.max(6,Math.min(width-el.offsetWidth-6,p.l+e.clientX-p.x)),top=Math.max(6,Math.min(height-el.offsetHeight-6,p.t+e.clientY-p.y));el.style.setProperty('left',`${left}px`,'important');el.style.setProperty('top',`${top}px`,'important');el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');}else{el.style.right=`${Math.max(0,parseFloat(el.style.right)-e.clientX+p.x)}px`;el.style.bottom=`${Math.max(0,parseFloat(el.style.bottom)-e.clientY+p.y)}px`;p.x=e.clientX;p.y=e.clientY;}};const finish=()=>{if(!p)return;if(p.mobile){const rect=el.getBoundingClientRect();settings.mobilePosition={left:Math.round(rect.left),top:Math.round(rect.top/(ROOT.visualViewport?.height||ROOT.innerHeight)*100)};}else settings.position={right:parseFloat(el.style.right),bottom:parseFloat(el.style.bottom)};save();p=null;};head.onpointerup=finish;head.onpointercancel=finish;head.onlostpointercapture=finish;}
  function ensureMenuStyle(){if(DOC.getElementById(`${ID}-menu-style`))return;DOC.head?.insertAdjacentHTML('beforeend',`<style id="${ID}-menu-style">#${ID}-menu{display:block!important;width:100%!important;min-width:0!important;padding:0!important;margin:0!important;color:inherit!important}#${ID}-menu>.selene-menu-item{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:center!important;column-gap:10px!important;width:100%!important;min-width:0!important;padding:5px!important;color:inherit!important;cursor:pointer!important;white-space:nowrap!important;writing-mode:horizontal-tb!important}#${ID}-menu>.selene-menu-item>.extensionsMenuExtensionButton{display:flex!important;flex:0 0 20px!important;align-items:center!important;justify-content:center!important;width:20px!important;height:20px!important;padding:0!important;pointer-events:none!important}#${ID}-menu>.selene-menu-item>.selene-menu-label{display:block!important;min-width:0!important;padding:0!important;white-space:nowrap!important;writing-mode:horizontal-tb!important}#${ID}-menu>.selene-menu-item:hover{opacity:1!important}</style>`);}
  function styleMenuEntry(wrapper){
    const row=wrapper.firstElementChild,icon=row?.querySelector('.extensionsMenuExtensionButton'),label=row?.querySelector('.selene-menu-label');
    const apply=(node,styles)=>{if(node)for(const [name,value] of Object.entries(styles))node.style.setProperty(name,value,'important');};
    // Some themes target the extension wrapper and every menu div with higher
    // specificity. Keep the entry's essential layout local to these four nodes.
    apply(wrapper,{display:'block',width:'100%','min-width':'0',padding:'0',margin:'0',color:'inherit','writing-mode':'horizontal-tb'});
    apply(row,{display:'flex','flex-direction':'row','flex-wrap':'nowrap','align-items':'center','column-gap':'10px',width:'100%','min-width':'0','box-sizing':'border-box',padding:'5px','white-space':'nowrap',color:'inherit',font:'inherit','writing-mode':'horizontal-tb'});
    apply(icon,{display:'flex',flex:'0 0 20px','align-items':'center','justify-content':'center',width:'20px',height:'20px',padding:'0',margin:'0',color:'inherit','pointer-events':'none'});
    apply(label,{display:'block',flex:'1 1 auto','min-width':'0',padding:'0',margin:'0','white-space':'nowrap','text-align':'left','line-height':'normal',color:'inherit','-webkit-text-fill-color':'currentColor',font:'inherit',overflow:'hidden','text-overflow':'ellipsis','writing-mode':'horizontal-tb'});
  }
  function menu(){
    const add=()=>{menuAddTimer=0;const existing=DOC.getElementById(`${ID}-menu`);if(disposed||(EXTENSION_MODE&&settings.menuEnabled===false)){existing?.remove();return;}if(existing?.isConnected)return;existing?.remove();const host=['#extensionsMenu','[data-testid="extensions-menu"]','#extensionsMenuList','#extensionsMenuDrawer .list-group','#extensionsMenuDrawer','#extensionsMenu .drawer-content','#extensionsMenu .list-group'].map(x=>DOC.querySelector(x)).find(Boolean);if(!host)return;ensureMenuStyle();const x=DOC.createElement('div');x.id=`${ID}-menu`;x.className='extension_container';x.innerHTML=`<div class="selene-menu-item list-group-item flex-container flexGap5 interactable" role="button" tabindex="0"><div class="fa-fw fa-solid fa-music extensionsMenuExtensionButton" aria-hidden="true"></div><span class="selene-menu-label">音乐播放器</span></div>`;const item=x.firstElementChild,toggle=()=>setPublicVisible(!settings.enabled);item.onclick=toggle;item.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};styleMenuEntry(x);host.appendChild(x);};
    const btn=DOC.querySelector('#extensionsMenuButton,#extensions_menu_button,[data-testid="extensions-menu-button"]'),previous=ROOT.__SAFE_MUSIC_MENU_HANDLER__;if(previous&&previous.btn!==btn){previous.btn?.removeEventListener('click',previous.handler);previous.btn?.removeAttribute('data-safe-music');delete ROOT.__SAFE_MUSIC_MENU_HANDLER__;}if(btn&&!ROOT.__SAFE_MUSIC_MENU_HANDLER__){const handler=()=>{if(menuAddTimer)ROOT.clearTimeout(menuAddTimer);menuAddTimer=ROOT.setTimeout(add,80);};ROOT.__SAFE_MUSIC_MENU_HANDLER__={btn,handler};btn.dataset.safeMusic='1';btn.addEventListener('click',handler);}add();
    if(!menuObserver&&DOC.body){menuObserver=new ROOT.MutationObserver(()=>{const item=DOC.getElementById(`${ID}-menu`),button=DOC.querySelector('#extensionsMenuButton,#extensions_menu_button,[data-testid="extensions-menu-button"]');if(item?.isConnected&&(!button||ROOT.__SAFE_MUSIC_MENU_HANDLER__?.btn===button))return;if(menuAddTimer)ROOT.clearTimeout(menuAddTimer);menuAddTimer=ROOT.setTimeout(menu,80);});menuObserver.observe(DOC.body,{childList:true,subtree:true});}
  }
  let libraryObserver=null,skinMenuCleanup=null,lyricMenuCleanup=null,sourceMenuCleanup=null,scriptRecoveryListener=null;
  function syncLibraryNavigation(view){
    DOC.querySelectorAll(`#${ID} .selene-library-nav [data-library]`).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.library===view)));
  }
  function refreshLibraryHearts(){
    const favorites=new Set((settings.favorites||[]).map(song=>String(song.id)));
    DOC.querySelectorAll(`#${ID} .row-primary-heart`).forEach(button=>{
      const active=favorites.has(button.closest('[data-track-id]')?.dataset.trackId);
      const glyph=active?'♥':'♡';if(button.textContent!==glyph)button.textContent=glyph;button.classList.toggle('is-favorite',active);
      button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',button.title=active?'取消收藏':'收藏歌曲');
      if(button.hasAttribute('data-save')&&active)button.setAttribute('aria-label',button.title='已收藏');
    });
  }
  function closeLibraryMenu(player=DOC.getElementById(ID),{focus=false}={}){
    const menu=player?.querySelector('.selene-row-menu');if(!menu)return;
    menu.hidden=true;menu._anchor?.setAttribute('aria-expanded','false');if(focus)menu._anchor?.focus();
  }
  function openLibraryMenu(player,anchor,buttons){
    let menu=player.querySelector('.selene-row-menu');
    if(!menu){menu=DOC.createElement('div');menu.className='selene-row-menu';menu.hidden=true;menu.setAttribute('role','group');menu.setAttribute('aria-label','歌曲操作');player.append(menu);}
    if(!menu.hidden&&menu._anchor===anchor){closeLibraryMenu(player);return;}
    closeLibraryMenu(player);menu.replaceChildren();menu._anchor=anchor;
    for(const original of buttons){
      const button=DOC.createElement('button');button.type='button';button.textContent=original.title||original.textContent;button.disabled=original.disabled;
      if(original.matches('[data-del],[data-song-remove],[data-playlist-delete]'))button.className='is-danger';
      button.onclick=event=>{event.preventDefault();event.stopPropagation();closeLibraryMenu(player);original.click();};menu.append(button);
    }
    menu.hidden=false;anchor.setAttribute('aria-expanded','true');
    const root=player.getBoundingClientRect(),rect=anchor.getBoundingClientRect(),height=menu.offsetHeight;
    menu.style.top=`${Math.max(48,Math.min(root.height-height-12,rect.bottom-root.top+5))}px`;
    menu.style.right=`${Math.max(10,root.right-rect.right)}px`;
    menu.querySelector('button:not(:disabled)')?.focus();
  }
  function polishLibraryRows(player){
    for(const tools of player.querySelectorAll('.list .row-tools')){
      if(tools.querySelector('.row-more'))continue;
      const buttons=[...tools.querySelectorAll('button')],primary=buttons.find(button=>button.matches('[data-f],[data-save],[data-song-fav],[data-row-heart],[data-playlist-play]'));
      if(primary){primary.hidden=false;if(!primary.hasAttribute('data-playlist-play'))primary.classList.add('row-primary-heart');}
      const secondary=buttons.filter(button=>button!==primary);for(const button of secondary)button.hidden=true;
      if(secondary.length){const more=DOC.createElement('button');more.type='button';more.className='row-more';more.textContent='···';more.title='更多操作';more.setAttribute('aria-label','更多操作');more.setAttribute('aria-expanded','false');
        more.onclick=event=>{event.preventDefault();event.stopPropagation();openLibraryMenu(player,more,secondary);};tools.append(more);}
    }
    refreshLibraryHearts();
    const menu=player.querySelector('.selene-row-menu');if(menu&&!menu._anchor?.isConnected)closeLibraryMenu(player);
  }
  function ensureCleanLibraryLayout(player){
    if(!player||player.querySelector('.selene-library-nav'))return;
    const toggle=player.querySelector('.actions-toggle'),actions=player.querySelector('.actions'),nav=DOC.createElement('nav');
    nav.className='selene-library-nav';nav.setAttribute('aria-label','音乐资料库');
    nav.innerHTML='<button type="button" data-library="favorites" aria-pressed="false">喜欢</button><button type="button" data-library="my-playlists" aria-pressed="true">歌单</button><button type="button" data-library="queue" aria-pressed="false">队列 <i data-library-queue-count hidden></i></button><button type="button" data-library="companion" aria-pressed="false">陪听</button>';
    toggle.before(nav);nav.append(toggle);toggle.setAttribute('aria-label','更多功能');if(!settings.actionsCollapsed)toggle.click();count();
    nav.onclick=event=>{
      const button=event.target.closest('[data-library]');if(!button)return;
      const action=button.dataset.library;
      if(action==='favorites')showPlaylistSongs(favoritePlaylist());
      if(action==='my-playlists')showPlaylists();
      if(action==='queue')render(queue,'播放队列','queue');
      if(action==='companion')openCompanionDialog();
    };
    actions.addEventListener('click',event=>{const button=event.target.closest('[data-a]');if(!button)return;
      if(button.dataset.a!=='companion')syncLibraryNavigation(button.dataset.a);
      if(!settings.actionsCollapsed)toggle.click();
    },true);
    toggle.addEventListener('click',()=>{const root=player.getBoundingClientRect(),rect=nav.getBoundingClientRect();actions.style.top=`${rect.bottom-root.top+6}px`;});
    player.addEventListener('click',event=>{if(!event.target.closest('.selene-row-menu,.row-more'))closeLibraryMenu(player);if(!event.target.closest('.actions,.actions-toggle')&&!settings.actionsCollapsed)toggle.click();},true);
    player.addEventListener('keydown',event=>{if(event.key==='Escape'){closeLibraryMenu(player,{focus:true});if(!settings.actionsCollapsed)toggle.click();}});
    const box=player.querySelector('.list');box.addEventListener('scroll',()=>closeLibraryMenu(player),{passive:true});libraryObserver=new ROOT.MutationObserver(()=>polishLibraryRows(player));libraryObserver.observe(box,{childList:true,subtree:true});
    if(box.hidden)showPlaylists();polishLibraryRows(player);
  }
  // The record view reuses the existing song, lyrics and transport controls.
  // Only its library visibility is transient; choosing a skin uses normal persistence.
  function bindOrbitStyle(player){
    if(!player||player.querySelector('.selene-orbit-tools'))return;
    const cover=player.querySelector('.now img'),stage=DOC.createElement('div');
    stage.className='selene-orbit-disc';
    cover.before(stage);stage.append(cover);
    cover.alt='专辑封面';
    stage.insertAdjacentHTML('beforeend','<i class="selene-orbit-placeholder" aria-hidden="true">♫</i><i class="selene-orbit-energy" aria-hidden="true"></i>');
    const tools=DOC.createElement('div');tools.className='selene-orbit-tools';
    tools.innerHTML='<span>SELENE · 流光唱片</span><button type="button" data-orbit-library aria-expanded="false">找歌 / 歌单</button>';
    player.querySelector('.body').prepend(tools);
    const toggle=tools.querySelector('button');
    const setLibrary=opening=>{
      player.classList.toggle('orbit-library-open',opening);
      toggle.setAttribute('aria-expanded',String(opening));
      toggle.textContent=opening?'返回唱片':'找歌 / 歌单';
      closeLibraryMenu(player);
      if(!settings.actionsCollapsed)player.querySelector('.actions-toggle')?.click();
    };
    toggle.onclick=()=>setLibrary(!player.classList.contains('orbit-library-open'));
    player.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&player.classList.contains('orbit-library-open')){setLibrary(false);toggle.focus();}
    });
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-orbit-style">
      #${ID} .now>.selene-orbit-disc{display:contents!important}
      #${ID} .selene-orbit-placeholder,#${ID} .selene-orbit-energy{display:none!important}
      /* Hide the empty replaced element itself: browsers may paint a broken-image rim. */
      #${ID} .now img:not([src]),#${ID} .now img[src=""]{display:none!important}
      #${ID} .selene-orbit-disc:not(:has(img[src]:not([src=""])))>.selene-orbit-placeholder{display:grid!important;place-items:center;flex:0 0 calc(56px * var(--cover-scale,1));width:calc(56px * var(--cover-scale,1));height:calc(56px * var(--cover-scale,1));border:0!important;outline:0!important;border-radius:12px;background:linear-gradient(145deg,color-mix(in srgb,var(--smp-text) 10%,transparent),color-mix(in srgb,var(--smp-text) 3%,transparent));box-shadow:none!important;color:var(--smp-muted);font:normal 22px/1 system-ui}
      #${ID} .selene-orbit-tools{display:none!important}
      #${ID}.skin-orbit{--smp-text:#fff4ef;--smp-muted:#dfc6c4;--smp-head-text:#fff4ef;--smp-control-bg:#ffffff14;--smp-control-border:#ffffff26;--smp-input-bg:#160c1866;--smp-settings-bg:#23131df5;--smp-switch:#ef927e;background:#39131e!important;border-color:#ffb9a52e!important;color-scheme:dark!important;isolation:isolate}
      #${ID}.skin-orbit:before{display:none!important}
      #${ID}.skin-orbit:not(.mini):after{display:block!important;content:'';position:absolute;z-index:0;inset:-50px;pointer-events:none;background-image:linear-gradient(180deg,#a1393655,#210e1cdd),var(--album-cover);background-position:center;background-size:cover;filter:blur(38px) saturate(1.3);opacity:.8;transform:scale(1.15)}
      #${ID}.skin-orbit>.selene-player-head{background:#1b0b151a!important;border-bottom-color:#ffffff14!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive)>.body{padding:10px 18px 16px!important;gap:0!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive) .selene-orbit-tools{display:flex!important;flex:0 0 30px;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}
      #${ID}.skin-orbit .selene-orbit-tools span{font:500 9px/1.3 system-ui;letter-spacing:1.6px;color:var(--smp-muted)}
      #${ID}.skin-orbit .selene-orbit-tools button{padding:5px 10px!important;min-height:28px!important;font:11px/1.3 system-ui!important;border:0!important;background:#ffffff12!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now{position:relative;display:grid!important;flex:1 1 auto!important;grid-template-columns:minmax(0,1fr) 38px;grid-template-rows:minmax(0,1fr) auto;align-items:center!important;gap:8px 10px!important;min-height:0!important;margin:0!important;padding:4px 0 12px!important;overflow:hidden!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now>.selene-orbit-disc{position:relative;isolation:isolate;display:grid!important;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);grid-column:1/-1;place-items:center;justify-content:stretch!important;justify-self:center;align-self:center;flex:none!important;width:min(calc(78cqw * var(--cover-scale,1)),calc(44cqh * var(--cover-scale,1)),360px);max-width:100%;max-height:100%;aspect-ratio:1;gap:0!important;border-radius:50%;background:radial-gradient(circle,#ef886228 20%,#ed6c4b12 55%,transparent 70%)}
      #${ID}.skin-orbit .selene-orbit-disc:before,#${ID}.skin-orbit .selene-orbit-disc:after,#${ID}.skin-orbit .cover-glass:before,#${ID}.skin-orbit .cover-glass:after{content:'';position:absolute;inset:2%;border-radius:50%;pointer-events:none;background:repeating-radial-gradient(circle,transparent 0 1.5%,#ff936bb3 1.7% 2%,transparent 2.3% 3.7%);mask-image:radial-gradient(circle,transparent 0 48%,#000 50% 69%,transparent 71%);-webkit-mask-image:radial-gradient(circle,transparent 0 48%,#000 50% 69%,transparent 71%);filter:drop-shadow(0 0 5px #ff674a);opacity:.9;animation:selene-orbit-breathe 3.2s ease-in-out infinite;animation-play-state:paused}
      #${ID}.skin-orbit .selene-orbit-disc:after,#${ID}.skin-orbit .cover-glass:after{inset:1%;background:conic-gradient(from 10deg,transparent 0 12%,#fff0d8 17%,#ff9479 24%,transparent 34% 62%,#ffbba8 70%,transparent 84%);mask-image:radial-gradient(circle,transparent 0 49%,#000 51% 68%,transparent 70%);-webkit-mask-image:radial-gradient(circle,transparent 0 49%,#000 51% 68%,transparent 70%);opacity:.85;animation:selene-orbit-turn 6s linear infinite,selene-orbit-glow 2.6s ease-in-out infinite;animation-play-state:paused}
      #${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now .selene-orbit-disc img{display:block;position:relative;z-index:1;width:65%!important;height:auto!important;aspect-ratio:1;flex:none!important;max-width:none!important;object-fit:cover;border:0!important;border-radius:50%!important;clip-path:circle(50%);background:radial-gradient(circle at 35% 30%,#b85d55,#482035)!important;box-shadow:0 0 0 1px #ffcfb966,0 0 24px #ff735c44!important;animation:selene-orbit-turn 28s linear infinite;animation-play-state:paused;cursor:zoom-in}
      #${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now .selene-orbit-disc img:not([src]){display:none!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive) .selene-orbit-disc:not(:has(img[src]))>.selene-orbit-placeholder{display:grid!important;place-items:center;flex:none!important;width:65%!important;height:auto!important;aspect-ratio:1;border:0!important;border-radius:50%!important;background:linear-gradient(145deg,#a65756,#422039);color:#f5c5b4;font:normal 40px/1 Georgia;box-shadow:0 10px 32px #16081455}
      #${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now>div:not(.selene-orbit-disc){grid-column:1;grid-row:2;min-width:0;gap:5px!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive) .now .title{font-size:calc(18px * var(--text-scale,1))!important;font-weight:600!important;line-height:1.4!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive) .now .artist{font-size:calc(12px * var(--text-scale,1))!important;color:var(--smp-muted)!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now>.current-favorite{grid-column:2;grid-row:2;align-self:center}
      #${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open)>.body>form,#${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .selene-library-nav,#${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .list,#${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .actions{display:none!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive).orbit-library-open .now{display:none!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive).orbit-library-open .lyrics{margin-top:auto!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive).orbit-library-open>.body>form{display:flex!important;margin-top:6px!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive).orbit-library-open .selene-library-nav{display:flex!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive) .lyrics{border:0!important;min-height:36px!important;max-height:68px!important;padding:8px 0!important;font-size:13px!important;color:var(--smp-muted)!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive) .controls{padding-top:6px!important;gap:10px!important}
      #${ID}.skin-orbit:not(.mini):not(.immersive) .controls [data-c=play]{background:#ffe4d9!important;color:#56232a!important}
      #${ID}.skin-orbit.immersive .cover-glass{position:relative;isolation:isolate;display:grid;place-items:center;aspect-ratio:1;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important}
      #${ID}.skin-orbit.immersive .immersive-cover{position:relative;z-index:1;width:65%!important;height:auto!important;aspect-ratio:1;object-fit:cover;border-radius:50%!important;clip-path:circle(50%);animation:selene-orbit-turn 28s linear infinite;animation-play-state:paused}
      #${ID}.skin-orbit.orbit-playing:not(.mini):not(.orbit-library-open) .selene-orbit-disc img,#${ID}.skin-orbit.orbit-playing:not(.mini):not(.orbit-library-open) .selene-orbit-disc:after,#${ID}.skin-orbit.orbit-playing.immersive:not(.mini) .immersive-cover,#${ID}.skin-orbit.orbit-playing.immersive:not(.mini) .cover-glass:after{animation-play-state:running!important}
      #${ID}.skin-orbit:not(.mini) .selene-orbit-disc>.selene-orbit-energy{display:block!important;position:absolute;inset:0;pointer-events:none;border-radius:50%;background:conic-gradient(from 110deg,transparent 0 16%,#ff5c3580 22%,#fff0c6 24%,transparent 29% 64%,#ffb9d0 68%,transparent 73%);mask-image:repeating-radial-gradient(circle,transparent 0 2.6%,#000 2.8% 3.3%,transparent 3.5% 5%);-webkit-mask-image:repeating-radial-gradient(circle,transparent 0 2.6%,#000 2.8% 3.3%,transparent 3.5% 5%);clip-path:circle(49%);filter:drop-shadow(0 0 5px #ff8269);animation:selene-orbit-turn 10s linear infinite reverse;animation-play-state:paused}
      #${ID}.skin-orbit.orbit-playing:not(.mini):not(.orbit-library-open) .selene-orbit-disc:before,#${ID}.skin-orbit.orbit-playing:not(.mini):not(.orbit-library-open) .selene-orbit-energy,#${ID}.skin-orbit.orbit-playing.immersive:not(.mini) .cover-glass:before{animation-play-state:running!important}
      @keyframes selene-orbit-turn{to{transform:rotate(360deg)}}
      @keyframes selene-orbit-breathe{0%,100%{transform:scale(.98);opacity:.6}50%{transform:scale(1.025);opacity:1}}
      @keyframes selene-orbit-glow{0%,100%{filter:drop-shadow(0 0 3px #ff6a43);opacity:.7}50%{filter:drop-shadow(0 0 10px #ff9477);opacity:1}}
      @container(max-height:420px){#${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now>.selene-orbit-disc{width:min(36cqh,150px)}#${ID}.skin-orbit .selene-orbit-tools span{display:none}}
      @container(max-height:340px){#${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now{flex:1 1 auto!important;display:flex!important;padding:0!important;gap:10px!important}#${ID}.skin-orbit:not(.mini):not(.immersive):not(.orbit-library-open) .now>.selene-orbit-disc{display:none!important}#${ID}.skin-orbit:not(.mini):not(.immersive) .lyrics{min-height:24px!important;max-height:30px!important;padding:3px 0!important}#${ID}.skin-orbit:not(.mini):not(.immersive) .controls{padding-top:0!important;gap:4px!important}}
      @media(prefers-reduced-motion:reduce){#${ID}.skin-orbit .selene-orbit-disc img,#${ID}.skin-orbit .selene-orbit-disc:before,#${ID}.skin-orbit .selene-orbit-disc:after,#${ID}.skin-orbit .selene-orbit-energy,#${ID}.skin-orbit .immersive-cover,#${ID}.skin-orbit .cover-glass:before,#${ID}.skin-orbit .cover-glass:after{animation:none!important}}
    </style>`);
  }
  function syncOrbitMotion(event){
    const playing=event?.type==='playing'||(!audio.paused&&!audio.ended&&audio.readyState>=3&&!['waiting','emptied','error'].includes(event?.type));
    DOC.getElementById(ID)?.classList.toggle('orbit-playing',playing);
  }
  function seleneControlIcon(name){
    const paths={locked:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',unlocked:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 7.5-2M12 14v3"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="m9 3-.6 2-1.8 1L4.5 6.5 3 9l1.5 1.5v3L3 15l1.5 2.5 2.1.5 1.8 1L9 21h6l.6-2 1.8-1 2.1-.5L21 15l-1.5-1.5v-3L21 9l-1.5-2.5-2.1-.5-1.8-1L15 3z"/>',pin:'<path d="m9 3 6 0-1 6 4 4H6l4-4zM12 13v8"/>',skin:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>'};
    return `<svg class="selene-control-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.gear}</svg>`;
  }
  function hardenResizeInteractions(el){
    if(!el||el.dataset.resizeHardened)return;
    el.dataset.resizeHardened='1';
    for(const name of ['gear','pin','skin']){const button=el.querySelector(`.selene-player-head .${name}`);if(button){button.innerHTML=seleneControlIcon(name);button.setAttribute('aria-label',button.title||({gear:'播放器设置',pin:'固定窗口',skin:'切换皮肤'})[name]);}}
    if(!DOC.getElementById(`${ID}-interaction-fix-style`))DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-interaction-fix-style">
      #${ID}:not(.mini){min-width:min(320px,calc(100vw - 12px))!important;min-height:min(280px,calc(100vh - 12px))!important}
      #${ID}.mini>.settings-panel[style]{display:none!important;visibility:hidden!important;pointer-events:none!important}
      #${ID}.pointer-interacting{transition:none!important;will-change:transform!important}
      #${ID}.pointer-interacting *{transition:none!important}
      #${ID}:not(.mini)>.selene-player-head>.lyrics-tools{display:inline-flex!important;align-items:center!important;flex:0 0 62px!important;width:62px!important;height:30px!important;gap:0!important;overflow:hidden!important;padding:0!important;position:relative!important;z-index:35!important;touch-action:manipulation}
      #${ID}:not(.mini)>.selene-player-head>.lyrics-tools>button{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 30px!important;width:30px!important;min-width:30px!important;height:28px!important;min-height:28px!important;padding:0!important;margin:0!important;border:0!important;border-radius:0!important;transform:none!important;background:transparent!important;color:inherit!important;font:600 13px/1 system-ui!important;pointer-events:auto!important;touch-action:manipulation!important}
      #${ID} .lyrics-tools>button::before,#${ID} .lyrics-tools>button::after{content:none!important;display:none!important}
      #${ID} .quick-lyrics-lock .selene-control-icon{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.7}
      #${ID} .quick-lyrics-lock[aria-pressed=true]{color:var(--smp-switch,#a8d9ce)!important}

      #${ID}-companion.pointer-interacting{transition:none!important;will-change:transform!important}
      #${ID}-companion.pointer-interacting,#${ID}-companion.pointer-interacting *{transition:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
      /* Keep host header/close styles and oversized button presets out of the toolbar. */
      #${ID}:not(.mini)>.selene-player-head{position:relative!important;inset:auto!important;display:flex!important;flex-flow:row nowrap!important;align-items:center!important;justify-content:flex-start!important;gap:4px!important;flex:0 0 45px!important;width:100%!important;min-width:0!important;max-width:100%!important;height:45px!important;min-height:45px!important;max-height:45px!important;margin:0!important;padding:0 6px!important;overflow:hidden!important;transform:none!important;visibility:visible!important;opacity:1!important;writing-mode:horizontal-tb!important}
      #${ID}:not(.mini)>.selene-player-head>b{position:static!important;display:block!important;flex:1 1 0!important;min-width:0!important;max-width:none!important;margin:0!important;padding:0!important;font:600 13px/1.2 system-ui,sans-serif!important;letter-spacing:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;transform:none!important;visibility:visible!important;opacity:1!important}
      #${ID}:not(.mini)>.selene-player-head>button{position:relative!important;inset:auto!important;z-index:35!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 28px!important;width:28px!important;min-width:28px!important;max-width:28px!important;height:30px!important;min-height:30px!important;max-height:30px!important;margin:0!important;padding:0!important;border-radius:7px!important;font:600 14px/1 system-ui,sans-serif!important;letter-spacing:0!important;white-space:nowrap!important;transform:none!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;cursor:pointer!important;touch-action:manipulation!important;-webkit-appearance:none!important;appearance:none!important}
      #${ID}:not(.mini)>.selene-player-head>button::before,#${ID}:not(.mini)>.selene-player-head>button::after{content:none!important;display:none!important}
      #${ID} .settings-panel[style*="display: block"]{display:block!important;z-index:60!important;inset:45px 0 0!important;overflow:auto!important;pointer-events:auto!important}
      #${ID} .settings-panel [data-keepalive-card]{background:#11121a!important;color:#f5f5f7!important;border-color:#ffffff22!important;color-scheme:dark!important}
      #${ID} .settings-panel [data-keepalive-card].keepalive-running{background:linear-gradient(145deg,#18231d,#11151a)!important;border-color:#70b88188!important;box-shadow:inset 0 1px #ffffff12!important}
      #${ID} .settings-panel [data-keepalive-card] button{color:#f5f5f7!important;-webkit-text-fill-color:currentColor!important;background:#ffffff12!important;border-color:#ffffff32!important}
      #${ID} .settings-panel [data-keepalive-card] small{color:#c8c1b0!important;-webkit-text-fill-color:currentColor!important}
      #${ID} .settings-panel input[type="checkbox"]{-webkit-appearance:none!important;appearance:none!important;display:inline-block!important;width:22px!important;height:22px!important;min-width:22px!important;min-height:22px!important;margin:0 7px 0 0!important;vertical-align:-5px!important;border:2px solid #555966!important;border-radius:50%!important;background-color:#15161d!important;background-image:none!important;box-shadow:inset 0 1px 3px #000d,0 0 0 3px #262832!important;filter:none!important;opacity:1!important;cursor:pointer!important}
      #${ID} .settings-panel input[type="checkbox"]:checked{border-color:#686d7b!important;background-color:#171820!important;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 12.5l4.2 4.2L19 7' fill='none' stroke='%23fff' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:18px 18px!important;box-shadow:inset 0 1px 2px #ffffff12,0 0 0 3px #2a2c36!important}
      #${ID} .settings-panel input[type="checkbox"]:focus-visible{outline:2px solid #f2cf70!important;outline-offset:3px!important}
      #${ID} .resize-handle.n,#${ID} .resize-handle.s{height:8px!important}
      #${ID} .resize-handle.e,#${ID} .resize-handle.w{width:8px!important}
      #${ID} .resize-handle.ne,#${ID} .resize-handle.se,#${ID} .resize-handle.sw,#${ID} .resize-handle.nw{width:14px!important;height:14px!important}
      @media(max-width:480px),(max-width:1024px) and (hover:none) and (pointer:coarse){#${ID}:not(.mini){min-width:min(280px,calc(100vw - 12px))!important;min-height:min(250px,calc(var(--selene-stable-vh,100vh) - 12px))!important}#${ID}.pointer-interacting,#${ID}.pointer-interacting>.selene-player-head,#${ID}.pointer-interacting>.body{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}#${ID}.pointer-interacting:after{filter:blur(8px) saturate(1.15)!important;opacity:.28!important}}

      /* Rounded controls are scoped here so host button borders cannot square them off. */
      #${ID} button,#${ID}-skin-float button{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;border-width:1px!important;border-style:solid!important;border-radius:12px!important;box-shadow:none!important;background-image:none!important;text-shadow:none!important;transition:background-color .16s,border-color .16s,opacity .16s!important}
      #${ID} button:hover{background-color:color-mix(in srgb,var(--smp-text) 14%,transparent)!important;border-color:color-mix(in srgb,var(--smp-text) 22%,transparent)!important}
      #${ID} button:active{opacity:.72!important}
      #${ID} button:focus-visible,#${ID}-skin-float button:focus-visible{outline:2px solid #70b7ff!important;outline-offset:2px!important}
      #${ID}:not(.mini)>.selene-player-head>button{color:var(--smp-head-text)!important}
      #${ID}:not(.mini)>.selene-player-head>.selene-player-close{border:0!important;border-radius:50%!important;background:color-mix(in srgb,var(--smp-head-text) 8%,transparent)!important}
      #${ID}:not(.mini)>.selene-player-head>:is(.lyrics-tools,.pin,.skin,.gear){
        border:1px solid var(--smp-control-border,#ffffff24)!important;
        border-radius:999px!important;
        background:var(--smp-control-bg,#ffffff10)!important;
      }
      #${ID}:not(.mini)>.selene-player-head>button:hover{background:color-mix(in srgb,var(--smp-head-text) 18%,transparent)!important}
      #${ID}.pinned:not(.mini)>.selene-player-head>button.pin{
        border-color:var(--smp-switch,var(--smp-control-border))!important;
        background:color-mix(in srgb,var(--smp-head-text) 22%,transparent)!important;
      }
      #${ID} .selene-control-icon,#${ID}-companion .selene-control-icon{display:block;width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
      #${ID} .actions button{border-radius:12px!important;border-color:color-mix(in srgb,var(--smp-text) 10%,transparent)!important;background:color-mix(in srgb,var(--smp-text) 6%,transparent)!important}
      #${ID} .row .row-tools button{border-color:transparent!important;border-radius:10px!important;background:color-mix(in srgb,var(--smp-text) 6%,transparent)!important}
      #${ID} .now .current-favorite{background:transparent!important;border:0!important;box-shadow:none!important}
      #${ID} .settings-panel{background:var(--smp-settings-bg,#1b1c25f2)!important;color:var(--smp-text)!important;color-scheme:inherit!important;backdrop-filter:blur(20px);padding:16px!important;scrollbar-width:thin;scrollbar-color:var(--smp-control-border) transparent}
      #${ID} .settings-panel .set-grid{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:12px!important;margin:14px 0!important}#${ID} .settings-panel .settings-heading{display:flex;align-items:center;justify-content:space-between;gap:10px}#${ID} .settings-panel h3{display:flex;align-items:center;gap:8px;margin:0!important;font:600 16px/1.5 system-ui!important}#${ID} .settings-panel [data-player-version]{font:11px/1.5 system-ui!important;border:1px solid var(--smp-control-border);border-radius:999px;padding:2px 7px;white-space:nowrap}#${ID} .settings-panel .setting-field{display:grid;gap:9px}#${ID} .settings-panel .setting-toggle,#${ID} .settings-panel .setting-row{display:flex;align-items:center;justify-content:space-between;gap:12px}#${ID} .settings-panel small{font:11px/1.6 system-ui!important}#${ID} .settings-panel .set-card{min-width:0;box-sizing:border-box;padding:14px!important;border:1px solid var(--smp-control-border)!important;border-radius:16px!important;background:color-mix(in srgb,var(--smp-text) 3%,transparent)!important;box-shadow:none!important;line-height:1.7}
      #${ID} .settings-panel button{border:1px solid var(--smp-control-border)!important;border-radius:11px!important;background:var(--smp-control-bg)!important;padding:7px 12px!important;min-height:32px!important}
      #${ID} .settings-panel [data-x]{border:0!important;border-radius:50%!important;padding:0!important;width:30px!important;min-height:30px!important}
      #${ID} .settings-panel select{display:block;max-width:100%;width:100%;box-sizing:border-box;font:12px/1.5 system-ui!important}#${ID} .settings-panel .custom-scales>b{display:block;margin-bottom:10px}#${ID} .settings-panel .scale-row{grid-template-columns:minmax(0,1fr) 30px 44px 30px;gap:6px;margin:10px 0;font:12px/1.5 system-ui}#${ID} .settings-panel .scale-row button{padding:0!important;min-width:30px!important}#${ID} .settings-panel select,#${ID} .settings-panel input:not([type=checkbox]){border:1px solid var(--smp-control-border)!important;border-radius:10px!important;background:var(--smp-input-bg)!important;color:var(--smp-text)!important;min-height:32px;padding:5px 9px}
      #${ID} .settings-panel select[name="searchMode"]{-webkit-appearance:none!important;appearance:none!important;background-image:none!important;cursor:pointer}
      #${ID} .settings-panel input[type=checkbox]{appearance:none!important;-webkit-appearance:none!important;position:relative!important;display:inline-block!important;flex:0 0 32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:20px!important;min-height:20px!important;margin:0 7px 0 0!important;vertical-align:middle!important;border:0!important;border-radius:999px!important;background:#ffffff24!important;background-image:none!important;box-shadow:none!important;filter:none!important;cursor:pointer!important}
      #${ID} .settings-panel input[type=checkbox]::before{content:''!important;position:absolute!important;top:3px!important;left:3px!important;width:14px!important;height:14px!important;border:0!important;border-radius:50%!important;background:#fff!important;box-shadow:0 1px 3px #0003!important;transform:none!important;transition:left .16s!important}
      #${ID} .settings-panel input[type=checkbox]::after{content:none!important}
      #${ID} .settings-panel input[type=checkbox]:checked{background:#409a79!important}
      #${ID} .settings-panel input[type=checkbox]:checked::before{left:15px!important}
      #${ID} .settings-panel input[type=checkbox]:focus-visible{outline:2px solid #70b7ff!important;outline-offset:3px!important}
      @media(prefers-reduced-motion:reduce){#${ID} button,#${ID} .settings-panel input::before{transition:none!important}}

      #${ID}{--smp-settings-bg:#1c1b27f5;--smp-switch:#66ab92}
      #${ID}.skin-white{--smp-settings-bg:#fafafaf8;--smp-switch:#638d7c}
      #${ID}.skin-red{--smp-settings-bg:#fff5eef8;--smp-switch:#b32b40}
      #${ID}.skin-blue{--smp-settings-bg:#eef7fff7;--smp-switch:#3987bd}
      #${ID}.skin-green{--smp-settings-bg:#eff8f0f7;--smp-switch:#528e68}
      #${ID}.skin-cream{--smp-settings-bg:#fff6e5f8;--smp-switch:#ab8555}
      #${ID}.skin-black{--smp-settings-bg:#141414f7;--smp-switch:#739b90}
      #${ID}.skin-albumglass{--smp-settings-bg:#151820de;--smp-switch:#77a99c}
      #${ID} .settings-panel button,#${ID} .settings-panel label,#${ID} .settings-panel output,#${ID} .settings-panel h3{color:var(--smp-text)!important;-webkit-text-fill-color:currentColor!important}
      #${ID} .settings-panel .set-card small{color:var(--smp-muted)!important;-webkit-text-fill-color:currentColor!important}
      #${ID} .settings-panel .window-settings-card{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
      #${ID} .window-settings-card h4{margin:0;font:600 14px/1.4 system-ui;color:var(--smp-text)}
      #${ID} .window-settings-card .window-settings-field{display:grid;gap:6px}
      #${ID} .window-settings-card .window-settings-toggle{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:26px}
      #${ID} .settings-panel .window-settings-toggle input[type=checkbox]{margin:0!important}
      #${ID} .window-settings-card .window-settings-note{display:block}
      #${ID} .window-settings-card .window-settings-actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,124px),1fr));gap:8px;padding-top:12px;border-top:1px solid var(--smp-control-border)}
      #${ID} .window-settings-card .window-settings-actions button{min-width:0}
      #${ID} .window-settings-card [data-window-mini]{background:color-mix(in srgb,var(--smp-switch) 20%,var(--smp-control-bg))!important}
      #${ID} .settings-panel [data-player-version]{color:var(--smp-muted)!important;border-color:var(--smp-control-border)!important;background:var(--smp-control-bg)!important}
      #${ID} .settings-panel [data-keepalive-card],#${ID} .settings-panel [data-keepalive-card].keepalive-running{background:color-mix(in srgb,var(--smp-text) 3%,transparent)!important;color:var(--smp-text)!important;border-color:var(--smp-control-border)!important;box-shadow:none!important;color-scheme:inherit!important}
      #${ID} .settings-panel [data-keepalive-card] button{color:var(--smp-text)!important;background:var(--smp-control-bg)!important;border-color:var(--smp-control-border)!important}
      #${ID} .settings-panel [data-keepalive-card] small{color:var(--smp-muted)!important}
      #${ID} .settings-panel input[type=checkbox]{background:color-mix(in srgb,var(--smp-text) 20%,transparent)!important}
      #${ID} .settings-panel input[type=checkbox]:checked{background:var(--smp-switch)!important}
      #${ID} .settings-panel button:hover{background:color-mix(in srgb,var(--smp-text) 12%,transparent)!important}

      /* Content-first library: fewer visible actions and room for song titles. */
      #${ID}:not(.mini):not(.immersive)>.body{padding:14px 16px 12px!important;gap:0!important}
      #${ID}:not(.mini):not(.immersive) .now{padding:0 0 14px!important;min-height:68px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;gap:12px!important}
      #${ID}:not(.mini):not(.immersive) .now img{width:56px!important;height:56px!important;flex:0 0 56px!important;border:0!important;border-radius:12px!important;box-shadow:0 5px 14px #0002!important}
      #${ID}:not(.mini):not(.immersive) .now .title{font-size:15px!important;font-weight:600!important}
      #${ID}:not(.mini):not(.immersive) .now .artist{font-size:12px!important}
      #${ID}:not(.mini):not(.immersive) .now .reason,#${ID}:not(.mini):not(.immersive) .now .status{display:none!important}
      #${ID}:not(.mini):not(.immersive)>.body>form{margin:0 0 12px!important;gap:7px!important;min-height:34px!important}
      #${ID}:not(.mini):not(.immersive)>.body>form input{padding:8px 12px!important;border:1px solid var(--smp-control-border)!important;border-radius:12px!important;font-size:12px!important}
      #${ID}:not(.mini):not(.immersive)>.body>form button{padding:6px 11px!important;min-height:34px!important;font-size:12px!important;border:0!important;background:var(--smp-control-bg)!important}
      #${ID} .selene-library-nav{position:relative;z-index:3;display:flex;align-items:center;flex:0 0 auto;gap:8px;padding:0 0 9px;margin:0;border-bottom:1px solid var(--smp-control-border)}
      #${ID}:not(.mini):not(.immersive) .selene-library-nav>[data-library]{position:relative;flex:1;min-width:0;padding:8px 0!important;min-height:34px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;font-size:12px!important;color:var(--smp-muted)!important;font-weight:500!important}
      #${ID}:not(.mini):not(.immersive) .selene-library-nav>[aria-pressed=true]{color:var(--smp-text)!important;font-weight:700!important}
      #${ID} .selene-library-nav>[aria-pressed=true]::after{content:'';position:absolute;bottom:0;left:35%;right:35%;height:2px;border-radius:2px;background:var(--smp-switch,#7fa99a)}
      #${ID}:not(.mini):not(.immersive) .selene-library-nav>.actions-toggle{flex:0 0 30px!important;width:30px!important;min-width:30px!important;height:30px!important;min-height:30px!important;margin:0!important;padding:0!important;display:grid!important;place-items:center!important;border:0!important;border-radius:50%!important;background:transparent!important;box-shadow:none!important}
      #${ID} .selene-library-nav>.actions-toggle span,#${ID} .selene-library-nav>.actions-toggle small,#${ID} .selene-library-nav>.actions-toggle i{display:none!important}
      #${ID} .selene-library-nav>.actions-toggle::after{content:'···';font:700 18px/1 system-ui}
      #${ID}:not(.mini):not(.immersive) .actions{position:absolute!important;z-index:64!important;left:12px!important;right:12px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;padding:12px!important;margin:0!important;border:1px solid var(--smp-control-border)!important;border-radius:18px!important;background:var(--smp-settings-bg)!important;backdrop-filter:blur(20px);box-shadow:0 12px 30px #0004!important}
      #${ID}.actions-collapsed:not(.mini):not(.immersive) .actions{display:none!important}
      #${ID}:not(.mini):not(.immersive) .actions button{padding:9px 4px!important;font-size:11px!important;min-height:34px!important;white-space:nowrap!important}
      #${ID}:not(.mini):not(.immersive) .list{padding:4px 0 10px!important;margin:0!important;border:0!important;scrollbar-width:thin;scrollbar-gutter:auto!important}
      #${ID}:not(.mini):not(.immersive) .list[hidden]{display:none!important}
      #${ID}:not(.mini):not(.immersive) .list>.row,#${ID}:not(.mini):not(.immersive) .list>article{padding:11px 2px!important;gap:10px!important;border-bottom:1px solid color-mix(in srgb,var(--smp-text) 7%,transparent)!important;background:transparent!important;align-items:center!important}
      #${ID}:not(.mini):not(.immersive) .list .row:not(.batch-heading)>img{width:36px!important;height:36px!important;flex:0 0 36px!important;border-radius:7px!important}
      #${ID}:not(.mini):not(.immersive) .list .row:not(.batch-heading)>div{flex:1 1 0!important;min-width:0!important}
      #${ID}:not(.mini):not(.immersive) .list .row:not(.batch-heading) b{font-size:13px!important;font-weight:500!important;line-height:1.4!important}
      #${ID}:not(.mini):not(.immersive) .list .row:not(.batch-heading) span:not(.row-tools){font-size:11px!important;line-height:1.5!important}
      #${ID}:not(.mini):not(.immersive) .row .row-tools{flex:0 0 auto!important;gap:3px!important;max-width:70px!important;white-space:nowrap!important;display:flex!important;align-items:center!important}
      #${ID}:not(.mini):not(.immersive) .row .row-tools button{width:28px!important;min-width:28px!important;height:30px!important;min-height:30px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;font:400 18px/1 system-ui!important}
      #${ID} .row-tools>button[hidden]{display:none!important}
      #${ID}:not(.mini):not(.immersive) .row .row-tools .is-favorite{color:#e95067!important;-webkit-text-fill-color:#e95067!important}
      #${ID}:not(.mini):not(.immersive) .list .batch-heading{gap:7px!important;flex-wrap:wrap!important;border-bottom:0!important;padding:14px 0 10px!important}
      #${ID}:not(.mini):not(.immersive) .list .batch-heading>b{font-size:15px!important;font-weight:600!important;flex-basis:100%!important;min-width:0!important;margin:0 0 6px!important}
      #${ID}:not(.mini):not(.immersive) .list .batch-heading>button{padding:6px 10px!important;font-size:11px!important;border:0!important;min-height:30px!important;background:var(--smp-control-bg)!important}
      #${ID}:not(.mini):not(.immersive) .list .batch-heading>[data-playlist-play-all],#${ID}:not(.mini):not(.immersive) .list .batch-heading>[data-heading-action=play]{background:var(--smp-switch,#6a9d89)!important;color:#fff!important}
      #${ID}:not(.mini):not(.immersive) .lyrics{flex:0 0 auto!important;min-height:30px!important;max-height:64px!important;margin:0!important;padding:10px 4px 8px!important;border:0!important;border-top:1px solid var(--smp-control-border)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:hidden!important;font-size:13px!important;font-family:system-ui,sans-serif!important;font-style:normal!important;line-height:1.5!important;text-align:center!important}
      #${ID}:not(.mini):not(.immersive) .controls{display:grid!important;grid-template-columns:1fr 34px 44px 34px 1fr!important;gap:8px!important;align-items:center!important;margin:0!important;padding:3px 0 0!important}
      #${ID}:not(.mini):not(.immersive) .controls button{grid-row:1!important;justify-self:center!important;width:32px!important;height:32px!important;min-width:32px!important;min-height:32px!important;margin:0!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;font-size:18px!important}
      #${ID}:not(.mini):not(.immersive) .controls [data-c=prev]{grid-column:2!important}
      #${ID}:not(.mini):not(.immersive) .controls [data-c=play]{grid-column:3!important;width:40px!important;height:40px!important;background:var(--smp-switch,#6a9d89)!important;color:#fff!important;font-size:17px!important}
      #${ID}:not(.mini):not(.immersive) .controls [data-c=next]{grid-column:4!important}
      #${ID}:not(.mini):not(.immersive) .controls [data-c=mode]{grid-column:5!important;justify-self:center!important;display:grid!important;place-items:center!important}
      #${ID}:not(.mini):not(.immersive) .controls .progress{grid-column:1/-1!important;grid-row:2!important;width:100%!important;height:4px!important;margin:5px 0 0!important;accent-color:var(--smp-switch,#6a9d89)}
      #${ID}:not(.mini):not(.immersive) .time{padding:5px 0 0!important;margin:0!important;font-size:10px!important;line-height:1.5!important;text-align:left!important}
      #${ID}:not(.mini):not(.immersive) .volume{align-self:flex-end!important;display:flex!important;align-items:center!important;width:38%!important;margin:-15px 0 0!important;gap:6px!important;font-size:10px!important;line-height:15px!important}
      #${ID}:not(.mini):not(.immersive) .volume input{width:100%!important;height:3px!important;min-width:0!important;accent-color:var(--smp-switch,#6a9d89)}
      #${ID} .selene-row-menu{position:absolute;z-index:75;width:min(190px,calc(100% - 24px));padding:6px;border:1px solid var(--smp-control-border);border-radius:15px;background:var(--smp-settings-bg);backdrop-filter:blur(20px);box-shadow:0 12px 32px #0005}
      #${ID} .selene-row-menu[hidden]{display:none!important}
      #${ID} .selene-row-menu>button{display:block;width:100%;margin:0;padding:10px 12px!important;border:0!important;border-radius:9px!important;background:transparent!important;color:var(--smp-text)!important;text-align:left!important;font:12px/1.4 system-ui!important}
      #${ID} .selene-row-menu>button.is-danger{color:#e95067!important}
      #${ID}.mini .selene-library-nav,#${ID}.immersive .selene-library-nav{display:none!important}
      @container(max-height:440px){
        #${ID}:not(.mini):not(.immersive):not(.skin-orbit)>.body{display:flex!important;flex-direction:column!important;height:calc(100% - 45px)!important;min-height:0!important;overflow:hidden!important;padding:8px 16px!important}
        #${ID}:not(.mini):not(.immersive):not(.skin-orbit) .now{display:flex!important;flex:0 0 auto!important;align-items:center!important;min-height:40px!important;max-height:48px!important;padding:0 0 4px!important;gap:8px!important}
        #${ID}:not(.mini):not(.immersive):not(.skin-orbit) .now img{width:36px!important;height:36px!important;flex:0 0 36px!important}
        #${ID}:not(.mini):not(.immersive):not(.skin-orbit) .now .title{font-size:13px!important;line-height:1.25!important}
        #${ID}:not(.mini):not(.immersive):not(.skin-orbit) .now .artist{font-size:11px!important;line-height:1.2!important}
        #${ID}:not(.mini):not(.immersive):not(.skin-orbit)>.body>form,#${ID}:not(.mini):not(.immersive):not(.skin-orbit) .selene-library-nav,#${ID}:not(.mini):not(.immersive):not(.skin-orbit) .actions,#${ID}:not(.mini):not(.immersive):not(.skin-orbit) .list{display:none!important}
        #${ID}:not(.mini):not(.immersive):not(.skin-orbit) .lyrics{display:flex!important;flex:1 1 0!important;align-items:center!important;justify-content:center!important;height:auto!important;min-height:24px!important;max-height:none!important;padding:6px 0!important;margin:0!important;border:0!important;font-size:14px!important;line-height:1.4!important}
        #${ID}:not(.mini):not(.immersive):not(.skin-orbit) .controls,#${ID}:not(.mini):not(.immersive):not(.skin-orbit) .time,#${ID}:not(.mini):not(.immersive):not(.skin-orbit) .volume{flex:0 0 auto!important}
      }
      @container(max-height:280px){#${ID}:not(.mini):not(.immersive) .selene-library-nav{display:none!important}#${ID}:not(.mini):not(.immersive) .controls{gap:3px!important}}

      #${ID}:not(.mini):not(.immersive) .now img:not([src]),#${ID}:not(.mini):not(.immersive) .list .row>img:not([src]){background:linear-gradient(140deg,color-mix(in srgb,var(--smp-text) 10%,transparent),color-mix(in srgb,var(--smp-text) 3%,transparent))!important}
      #${ID}:not(.mini) .volume,#${ID}:not(.mini) .volume input[type=range]{background:transparent!important;background-image:none!important;box-shadow:none!important;filter:none!important}
      #${ID}:not(.mini) .volume input[type=range]{-webkit-appearance:none!important;appearance:none!important;padding:0!important;border:0!important;border-radius:0!important;outline-offset:2px}
      #${ID}:not(.mini) .volume input[type=range]::-webkit-slider-container{background:transparent!important;box-shadow:none!important;border:0!important}
      #${ID}:not(.mini) .volume input[type=range]::-webkit-slider-runnable-track{box-shadow:none!important;border:0!important}
      #${ID}:not(.mini) .volume input[type=range]::-webkit-slider-thumb{box-shadow:none!important;border:0!important}
      #${ID}:not(.mini):not(.immersive) input[type=range]{-webkit-appearance:none!important;appearance:none!important;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;border-radius:0!important;height:12px!important;cursor:pointer!important}
      #${ID}:not(.mini):not(.immersive) input[type=range]::-webkit-slider-runnable-track{height:3px!important;border:0!important;border-radius:99px!important;background:linear-gradient(to right,var(--smp-switch,#6a9d89) var(--range-fill,0%),color-mix(in srgb,var(--smp-text) 18%,transparent) var(--range-fill,0%))!important;box-shadow:none!important}
      #${ID}:not(.mini):not(.immersive) input[type=range]::-webkit-slider-thumb{-webkit-appearance:none!important;appearance:none!important;width:10px!important;height:10px!important;margin-top:-3.5px!important;border:0!important;border-radius:50%!important;background:var(--smp-switch,#6a9d89)!important;box-shadow:none!important}
      #${ID}:not(.mini):not(.immersive) input[type=range]::-moz-range-track{height:3px;border:0;border-radius:99px;background:color-mix(in srgb,var(--smp-text) 18%,transparent)}
      #${ID}:not(.mini):not(.immersive) input[type=range]::-moz-range-thumb{width:10px;height:10px;border:0;border-radius:50%;background:var(--smp-switch,#6a9d89)}
      #${ID}:not(.mini):not(.immersive) .controls .progress::-moz-range-progress{height:3px;border-radius:99px;background:var(--smp-switch,#6a9d89)}
      #${ID} .controls .progress::-webkit-slider-thumb,#${ID} .volume input[type=range]::-webkit-slider-thumb{opacity:0!important;transition:opacity .12s}
      #${ID} .controls .progress::-moz-range-thumb,#${ID} .volume input[type=range]::-moz-range-thumb{opacity:0!important;transition:opacity .12s}
      #${ID} .controls .progress:is(.is-seeking,:active,:focus-visible)::-webkit-slider-thumb,#${ID} .volume input[type=range]:is(.is-seeking,:active,:focus-visible)::-webkit-slider-thumb{opacity:1!important}
      #${ID} .controls .progress:is(.is-seeking,:active,:focus-visible)::-moz-range-thumb,#${ID} .volume input[type=range]:is(.is-seeking,:active,:focus-visible)::-moz-range-thumb{opacity:1!important}
      @media(hover:hover) and (pointer:fine){
        #${ID} .controls .progress:hover::-webkit-slider-thumb,#${ID} .volume input[type=range]:hover::-webkit-slider-thumb{opacity:1!important}
        #${ID} .controls .progress:hover::-moz-range-thumb,#${ID} .volume input[type=range]:hover::-moz-range-thumb{opacity:1!important}
      }


      #${ID}:not(.mini):not(.immersive) .now .title{font-size:calc(15px * var(--text-scale,1))!important}
      #${ID}:not(.mini):not(.immersive) .now .artist{font-size:calc(12px * var(--text-scale,1))!important}
      #${ID}:not(.mini):not(.immersive) .now img{width:calc(56px * var(--cover-scale,1))!important;height:calc(56px * var(--cover-scale,1))!important;flex-basis:calc(56px * var(--cover-scale,1))!important}
      #${ID}:not(.mini):not(.immersive) .list .row:not(.batch-heading) b{font-size:calc(13px * var(--text-scale,1))!important}
      #${ID}:not(.mini):not(.immersive) .list .row:not(.batch-heading) span:not(.row-tools){font-size:calc(11px * var(--text-scale,1))!important}
      #${ID}:not(.mini):not(.immersive) .list .row:not(.batch-heading)>img{width:calc(36px * var(--list-scale,1))!important;height:calc(36px * var(--list-scale,1))!important;flex-basis:calc(36px * var(--list-scale,1))!important}
      #${ID}:not(.mini):not(.immersive) .row .row-tools{max-width:none!important}
      #${ID}:not(.mini):not(.immersive) .row .row-tools button{width:calc(28px * var(--button-scale,1))!important;min-width:calc(28px * var(--button-scale,1))!important;height:calc(30px * var(--button-scale,1))!important;min-height:calc(30px * var(--button-scale,1))!important;font-size:calc(18px * var(--button-scale,1))!important}

      #${ID}:not(.mini):not(.immersive) .now .status.status-alert{display:block!important;color:var(--smp-muted)!important;font:10px/1.4 system-ui!important}
      #${ID} .selene-playback-notice{display:block;flex:none;max-height:4.2em;overflow:auto;margin:4px 0;color:var(--smp-muted);font:11px/1.4 system-ui;overflow-wrap:anywhere}
      #${ID}.mini .selene-playback-notice{display:none}
      #${ID} [data-library-queue-count]{font:500 9px/1 system-ui;opacity:.7}
      #${ID} [data-library-queue-count][hidden]{display:none!important}
</style>`);
    el.querySelectorAll('.resize-handle').forEach(handle=>{
      const down=handle.onpointerdown,move=handle.onpointermove,up=handle.onpointerup,cancel=handle.onpointercancel;
      let guard=null;
      handle.onpointerdown=e=>{
        if(e.pointerType==='mouse'&&(e.button!==0||e.isPrimary===false))return;
        guard={id:e.pointerId,x:e.clientX,y:e.clientY,active:false,pointerType:e.pointerType};
        down?.call(handle,e);
      };
      handle.onpointermove=e=>{
        if(!guard||e.pointerId!==guard.id)return;
        if(guard.pointerType==='mouse'&&(e.buttons&1)!==1){cancel?.call(handle,e);guard=null;return;}
        if(!guard.active){const distance=Math.hypot(e.clientX-guard.x,e.clientY-guard.y),threshold=guard.pointerType==='mouse'?10:6;if(distance<threshold)return;guard.active=true;}
        move?.call(handle,e);
      };
      const finish=(handler,e)=>{if(!guard||e?.pointerId!==undefined&&e.pointerId!==guard.id)return;handler?.call(handle,e);guard=null;};
      handle.onpointerup=e=>finish(up,e);
      handle.onpointercancel=e=>finish(cancel,e);
      handle.onlostpointercapture=e=>finish(cancel,e);
    });
  }
  function optimizeWindowInteractions(el,targets){
    if(!el||el.dataset.pointerOptimized)return;
    el.dataset.pointerOptimized='1';
    const requestFrame=ROOT.requestAnimationFrame?.bind(ROOT)||((callback)=>ROOT.setTimeout(callback,16));
    const cancelFrame=ROOT.cancelAnimationFrame?.bind(ROOT)||ROOT.clearTimeout.bind(ROOT);
    let owner=null;
    const wrap=target=>{
      if(!target?.onpointermove)return;
      const down=target.onpointerdown,move=target.onpointermove,up=target.onpointerup,cancel=target.onpointercancel,lost=target.onlostpointercapture;
      let activePointer=null,frame=0,pending=null;
      const flush=()=>{frame=0;const event=pending;pending=null;if(event&&el.isConnected!==false)move?.call(target,event);};
      target.onpointerdown=e=>{if(activePointer!==null||owner&&owner!==target)return;down?.call(target,e);if(e.defaultPrevented){activePointer=e.pointerId;owner=target;el.classList.add('pointer-interacting');}};
      target.onpointermove=e=>{if(activePointer===null||e.pointerId!==activePointer)return;pending=e;if(e.cancelable)e.preventDefault();if(!frame)frame=requestFrame(flush);};
      const finish=(handler,e,flushMove)=>{if(activePointer===null||e?.pointerId!==undefined&&e.pointerId!==activePointer)return;if(frame){cancelFrame(frame);frame=0;}if(flushMove){if(e?.type==='pointerup')pending=e;flush();}else pending=null;activePointer=null;handler?.call(target,e);owner=null;el.classList.remove('pointer-interacting');};
      const keepLastMove=target.matches?.('.mini-cover-shell')===true;
      target.onpointerup=e=>finish(up,e,true);
      target.onpointercancel=e=>finish(cancel,e,keepLastMove);
      target.onlostpointercapture=e=>finish(lost||cancel,e,keepLastMove);
    };
    (targets||el.querySelectorAll('.selene-player-head,.selene-player-head>b,.resize-handle,.mini-cover-shell')).forEach(wrap);
  }
  function handleAudioPlay(){if(audioPriming)return;interruptionRetryCount=0;clearInterruptionRetry();updatePlayButton();trackCompanionListeningTime({reset:true});}
  function handleUnexpectedPause(){if(audioPriming)return;trackCompanionListeningTime({stop:true,saveNow:true});updatePlayButton();if(playbackWanted&&!audio.ended&&playbackPhase==='playing')scheduleInterruptionRecovery();}
  const companionColorScheme=ROOT.matchMedia?.('(prefers-color-scheme:dark)');
  let contextEventBindings=[],contextRecommendationTimer=0;
  function cleanupContextEvents(){
    if(contextRecommendationTimer){ROOT.clearTimeout(contextRecommendationTimer);contextRecommendationTimer=0;}
    for(const [source,type,handler] of contextEventBindings){if(typeof source?.off==='function')source.off(type,handler);else source?.removeListener?.(type,handler);}
    contextEventBindings=[];
  }
  function events(){
    const player=DOC.getElementById(ID);hardenResizeInteractions(player);ensureCleanLibraryLayout(player);bindOrbitStyle(player);companionColorScheme?.addEventListener?.('change',syncCompanionAppearance);companionColorScheme?.addEventListener?.('change',syncFloatingPanelThemes);optimizeWindowInteractions(player);setupMediaSession();
    for(const event of ['playing','pause','waiting','ended','emptied','error'])audio.addEventListener(event,syncOrbitMotion);
    audio.addEventListener('play',handleAudioPlay);audio.addEventListener('pause',handleUnexpectedPause);audio.addEventListener('timeupdate',()=>{if(!audioPriming){paintTime();trackCompanionListeningTime();}});audio.addEventListener('loadedmetadata',()=>{if(!audioPriming){paintTime();updateMediaPosition(true);}});audio.addEventListener('durationchange',()=>updateMediaPosition(true));audio.addEventListener('seeked',()=>updateMediaPosition(true));audio.addEventListener('ratechange',()=>updateMediaPosition(true));
    audio.addEventListener('ended',()=>{if(bilibiliPlayer.isOpen()||audioPriming||!audio.ended)return;trackCompanionListeningTime({stop:true,saveNow:true});updatePlayButton();paintTime();if(current)createCompanionTicket({automatic:true});if(settings.playMode==='one'&&current){const memories=companionMemoryList(),entry=memories[offlineKey(current)];if(entry){entry.loops=(Number(entry.loops)||0)+1;save();}audio.currentTime=0;playbackWanted=true;void resumeMainAudioFromMediaSession();return;}const song=nextSong(1);if(song)play(song);else playbackWanted=false;});
    audioSession?.addEventListener?.('statechange',handleAudioSessionState);
    cleanupContextEvents();const c=context(),source=c?.eventSource,t=c?.eventTypes||ROOT.event_types||{},handler=()=>{if(contextRecommendationTimer)ROOT.clearTimeout(contextRecommendationTimer);contextRecommendationTimer=ROOT.setTimeout(()=>{contextRecommendationTimer=0;if(!disposed)recommendation();},50);};['CHARACTER_MESSAGE_RENDERED','MESSAGE_SWIPED','MESSAGE_EDITED','CHAT_CHANGED'].forEach(n=>{if(t[n]&&source?.on){source.on(t[n],handler);contextEventBindings.push([source,t[n],handler]);}});
  }
  const miniFocusGuard=e=>{if(!e.target?.matches?.('textarea,input,[contenteditable="true"]'))return;for(const delay of [0,120,360])ROOT.setTimeout(()=>preserveMiniGeometry(),delay);};
  const blockPlaybackWhenDisabled=()=>{if(disposed)stopPlayback({release:true});};
  const normalizeScriptName=value=>String(value||'').normalize('NFKC').trim().toLowerCase().replace(/\.js$/i,'').replace(/[\s「」『』【】\[\]()（）·._—–-]+/g,'');
  const ownScriptNames=new Set(['纯音乐播放器','Selene播放器','Selene音乐播放器','Selene Music'].map(normalizeScriptName));
  function isOwnScriptRow(row,toggle){
    if(!row||!toggle)return false;
    const explicit=row.querySelector('[data-script-name],.script-name,.TH-script-name,input[name="name"],input[name="scriptName"]');
    const candidates=[row.dataset?.scriptName,row.dataset?.name,row.getAttribute?.('aria-label'),explicit?.value,explicit?.textContent,
      ...Array.from(row.children).filter(child=>child!==toggle&&!child.contains(toggle)&&!child.matches('.TH-handle,.cursor-pointer')).map(child=>child.textContent)];
    return candidates.some(name=>ownScriptNames.has(normalizeScriptName(name)));
  }
  const scriptToggleCleanup=e=>{
    const toggle=e.target?.closest?.('.cursor-pointer.enabled');
    if(!toggle?.querySelector?.(':scope > i.fa-solid.fa-toggle-on,:scope > i.fa-toggle-on'))return;
    const row=toggle.closest('[data-type="script"],[data-script-name],.script-item,.TH-script-item');
    if(isOwnScriptRow(row,toggle))cleanupPlayer();
  };
  function cleanupPlayer(){if(disposed||ROOT.__SAFE_MUSIC_CLEANUP__!==cleanupPlayer)return;disposed=true;watchMiniDock();ROOT.clearInterval(playbackNoticeTimer);ROOT.clearTimeout(miniTapTimer);dismissCompanionPickToast();bilibili.closeSearch();try{scriptRecoveryListener?.stop?.();}catch{}scriptRecoveryListener=null;resultCoverObserver?.disconnect();resultCoverObserver=null;immersiveLyricsObserver?.disconnect();immersiveLyricsObserver=null;skinMenuCleanup?.();skinMenuCleanup=null;lyricMenuCleanup?.();lyricMenuCleanup=null;sourceMenuCleanup?.();sourceMenuCleanup=null;for(const cancel of companionToneLoads.values())cancel();companionToneLoads.clear();companionToneCache.clear();companionColorScheme?.removeEventListener?.('change',syncCompanionAppearance);companionColorScheme?.removeEventListener?.('change',syncFloatingPanelThemes);libraryObserver?.disconnect();libraryObserver=null;if(menuAddTimer){ROOT.clearTimeout(menuAddTimer);menuAddTimer=0;}menuObserver?.disconnect();menuObserver=null;cleanupContextEvents();clearInterruptionRetry();audioSession?.removeEventListener?.('statechange',handleAudioSessionState);stopPlayback({release:true});if(audioPrimeUrl){ROOT.URL.revokeObjectURL(audioPrimeUrl);audioPrimeUrl='';}audio.remove();clearMediaSession();cleanupKeepAlive();const menuHandler=ROOT.__SAFE_MUSIC_MENU_HANDLER__;if(menuHandler){menuHandler.btn?.removeEventListener('click',menuHandler.handler);menuHandler.btn?.removeAttribute('data-safe-music');delete ROOT.__SAFE_MUSIC_MENU_HANDLER__;}DOC.removeEventListener('focusin',miniFocusGuard,true);DOC.removeEventListener('pointerdown',scriptToggleCleanup,true);DOC.removeEventListener('click',scriptToggleCleanup,true);ROOT.removeEventListener('pagehide',handlePlayerPageHide);if(window!==ROOT)window.removeEventListener('pagehide',handlePlayerPageHide);ROOT.removeEventListener('resize',ROOT.__SAFE_MUSIC_RESIZE_HANDLER__);ROOT.visualViewport?.removeEventListener('resize',ROOT.__SAFE_MUSIC_RESIZE_HANDLER__);ROOT.visualViewport?.removeEventListener('scroll',ROOT.__SAFE_MUSIC_RESIZE_HANDLER__);DOC.getElementById(ID)?.remove();DOC.querySelectorAll(`[id^="${ID}-"]`).forEach(x=>x.remove());delete ROOT.__SELENE_MUSIC_PLAYER__;delete ROOT.__SAFE_MUSIC_PAGEHIDE__;delete ROOT.__SAFE_MUSIC_RESIZE_HANDLER__;delete ROOT.__SAFE_MUSIC_CLEANUP__;}
  function handlePlayerPageHide(event){if(!event?.persisted)cleanupPlayer();}
  ROOT.__SAFE_MUSIC_CLEANUP__=cleanupPlayer;ROOT.__SAFE_MUSIC_PAGEHIDE__=handlePlayerPageHide; ROOT.__SAFE_MUSIC_RESIZE_HANDLER__=()=>{const el=DOC.getElementById(ID),mobile=isMobile(),keyboard=mobile&&mobileKeyboardOpen();el?.classList.toggle('touch-layout',mobile);el?.classList.toggle('keyboard-open',keyboard);if(!keyboard&&!el?.classList.contains('pointer-interacting')){refreshStableMobileViewport(el);if(!preserveMiniGeometry(el)&&mobile){applyPlayerSize(el);applyMobilePosition(el);}applyCompanionPosition();}else if(keyboard)preserveMiniGeometry(el);renderDesktopLyrics(currentLyricWords);}; DOC.addEventListener('focusin',miniFocusGuard,true); DOC.addEventListener('pointerdown',scriptToggleCleanup,true); DOC.addEventListener('click',scriptToggleCleanup,true); ROOT.addEventListener('pagehide',handlePlayerPageHide);if(window!==ROOT)window.addEventListener('pagehide',handlePlayerPageHide); ROOT.addEventListener('resize',ROOT.__SAFE_MUSIC_RESIZE_HANDLER__); ROOT.visualViewport?.addEventListener('resize',ROOT.__SAFE_MUSIC_RESIZE_HANDLER__); ROOT.visualViewport?.addEventListener('scroll',ROOT.__SAFE_MUSIC_RESIZE_HANDLER__); const playerWindow=mount();applyPlayerVisibility(settings.enabled);events();audio.addEventListener('play',blockPlaybackWhenDisabled);menu();bindScriptRecoveryButton(playerWindow);
  function bindWindowFeatures(el){const toggleImmersive=value=>{settings.immersive=value??!el.classList.contains('immersive');el.classList.toggle('immersive',settings.immersive);updatePlayMode();el.classList.remove('lyrics-focus');renderImmersiveLyrics(activeLyricIndex(audio.currentTime),true);if(settings.immersive&&!settings.windowSize&&!isMobile()){el.style.width='min(900px,calc(100vw - 28px))';el.style.height='min(680px,calc(100vh - 28px))';}save();};el.querySelector('.now img').onclick=()=>{if(current)toggleImmersive(true);};if(ROOT.ResizeObserver){immersiveLyricsObserver?.disconnect();immersiveLyricsObserver=new ROOT.ResizeObserver(()=>renderImmersiveLyrics(activeLyricIndex(audio.currentTime),true));immersiveLyricsObserver.observe(el.querySelector('.immersive-lyric'));}el.querySelector('.immersive-close').onclick=()=>toggleImmersive(false);const cover=el.querySelector('.immersive-cover');cover.onclick=()=>toggleImmersive(false);cover.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();cover.click();}};el.querySelector('.immersive-lyric').onclick=event=>{const row=event.target.closest('[data-lyric-index]');if(!row)return;const line=lyricTimeline[Number(row.dataset.lyricIndex)],duration=Number(audio.duration);if(line&&Number.isFinite(duration)&&line.time<=duration){audio.currentTime=line.time;paintTime();updateMediaPosition(true);}};el.querySelector('.pin').onclick=()=>{settings.windowPinned=!settings.windowPinned;el.classList.toggle('pinned',settings.windowPinned);el.querySelector('.pin').title=settings.windowPinned?'取消固定窗口':'固定窗口，禁止移动和缩放';save();};const head=el.querySelector('.selene-player-head'),startMove=head.onpointerdown;head.onpointerdown=e=>{if(settings.windowPinned)return;startMove?.call(head,e);};let resize=null;el.querySelectorAll('.resize-handle').forEach(handle=>{handle.onpointerdown=e=>{if(settings.windowPinned||isMobile())return;const rect=el.getBoundingClientRect();resize={dir:handle.dataset.r,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height};handle.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation();};handle.onpointermove=e=>{if(!resize)return;const dx=e.clientX-resize.x,dy=e.clientY-resize.y,west=resize.dir.includes('w'),north=resize.dir.includes('n'),east=resize.dir.includes('e'),south=resize.dir.includes('s'),minW=300,minH=220,maxW=(ROOT.innerWidth||1200)-12,maxH=(ROOT.innerHeight||800)-12;let width=resize.width+(east?dx:west?-dx:0),height=resize.height+(south?dy:north?-dy:0),left=resize.left+(west?dx:0),top=resize.top+(north?dy:0);width=Math.max(minW,Math.min(maxW,width));height=Math.max(minH,Math.min(maxH,height));if(west)left=resize.left+resize.width-width;if(north)top=resize.top+resize.height-height;left=Math.max(6,Math.min((ROOT.innerWidth||1200)-width-6,left));top=Math.max(6,Math.min((ROOT.innerHeight||800)-height-6,top));el.style.setProperty('left',`${left}px`,'important');el.style.setProperty('top',`${top}px`,'important');el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');el.style.setProperty('width',`${width}px`,'important');el.style.setProperty('height',`${height}px`,'important');e.preventDefault();};const finish=()=>{if(!resize)return;const rect=el.getBoundingClientRect();settings.windowSize={width:Math.round(rect.width),height:Math.round(rect.height)};settings.position={right:Math.max(0,Math.round((ROOT.innerWidth||0)-rect.right)),bottom:Math.max(0,Math.round((ROOT.innerHeight||0)-rect.bottom))};resize=null;save();};handle.onpointerup=finish;handle.onpointercancel=finish;});}
  function bindAdaptiveWindow(el){if(!DOC.getElementById(`${ID}-adaptive-style`))DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-adaptive-style">#${ID}{container-type:size}#${ID}.immersive{overflow:hidden!important}#${ID}.immersive .body{min-height:0!important;overflow:hidden!important}#${ID} .resize-handle{touch-action:none!important}#${ID} .resize-handle.n,#${ID} .resize-handle.s{height:16px}#${ID} .resize-handle.e,#${ID} .resize-handle.w{width:16px}#${ID} .resize-handle.ne,#${ID} .resize-handle.se,#${ID} .resize-handle.sw,#${ID} .resize-handle.nw{width:26px;height:26px}@media(max-width:480px),(max-width:1024px) and (hover:none) and (pointer:coarse){#${ID}{max-width:calc(100vw - 12px)!important;max-height:calc(var(--selene-stable-vh,100vh) - 12px)!important;min-width:220px!important;min-height:190px!important}#${ID}.immersive{width:calc(100vw - 28px)!important;height:calc(var(--selene-stable-vh,100vh) - 28px)!important;max-height:calc(var(--selene-stable-vh,100vh) - 12px)!important}#${ID}.immersive .body{height:calc(100% - 45px)!important}}</style>`);refreshStableMobileViewport(el);
    const viewport=()=>({left:Number(ROOT.visualViewport?.offsetLeft)||0,top:Number(ROOT.visualViewport?.offsetTop)||0,width:ROOT.visualViewport?.width||ROOT.innerWidth||390,height:ROOT.visualViewport?.height||ROOT.innerHeight||700});
    const place=(left,top,width,height,resize=false)=>{
      const view=viewport(),w=resize?Math.max(220,Math.min(view.width-12,width)):width,h=resize?Math.max(190,Math.min(view.height-12,height)):height;
      const x=Math.max(view.left+6,Math.min(Math.max(view.left+6,view.left+view.width-w-6),left)),y=Math.max(view.top+6,Math.min(Math.max(view.top+6,view.top+view.height-h-6),top));
      el.style.setProperty('left',`${x}px`,'important');el.style.setProperty('top',`${y}px`,'important');el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');
      if(resize){el.style.setProperty('width',`${w}px`,'important');el.style.setProperty('height',`${h}px`,'important');}
    };
    const persist=(resized=false)=>{
      const rect=el.getBoundingClientRect(),view=viewport();
      if(resized)settings.windowSize={width:Math.round(rect.width),height:Math.round(rect.height)};
      settings.position={right:Math.max(0,Math.round((ROOT.innerWidth||view.left+view.width)-rect.right)),bottom:Math.max(0,Math.round((ROOT.innerHeight||view.top+view.height)-rect.bottom))};
      if(isMobile())settings.mobilePosition={left:Math.round(rect.left),top:Math.round((rect.top-view.top)/view.height*100)};
      save();
    };
    const head=el.querySelector('.selene-player-head');let drag=null;
    head.onpointerdown=e=>{
      if(drag||settings.windowPinned||e.target.closest('button,.lyrics-tools')||(e.pointerType==='mouse'&&e.button!==0))return;
      const rect=el.getBoundingClientRect();
      drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height,view:viewport(),dx:0,dy:0,moved:false};
      // Freeze the starting anchor before changing rendering or applying a transform.
      place(rect.left,rect.top,rect.width,rect.height);head.setPointerCapture?.(e.pointerId);e.preventDefault();
    };
    head.onpointermove=e=>{
      if(!drag||e.pointerId!==drag.id)return;
      const view=drag.view,dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<3)return;drag.moved=true;
      const left=Math.max(view.left+6,Math.min(Math.max(view.left+6,view.left+view.width-drag.width-6),drag.left+dx)),top=Math.max(view.top+6,Math.min(Math.max(view.top+6,view.top+view.height-drag.height-6),drag.top+dy));
      drag.dx=left-drag.left;drag.dy=top-drag.top;el.style.setProperty('transform',`translate3d(${drag.dx}px,${drag.dy}px,0)`,'important');e.preventDefault();
    };
    const endDrag=e=>{
      if(!drag||e?.pointerId!==undefined&&e.pointerId!==drag.id)return;
      const state=drag;drag=null;
      // Commit the painted position while transitions remain disabled. Never resize on drag.
      place(state.left+state.dx,state.top+state.dy,state.width,state.height);el.style.removeProperty('transform');
      try{head.releasePointerCapture?.(state.id);}catch{}if(state.moved)persist();
    };
    head.onpointerup=endDrag;head.onpointercancel=endDrag;head.onlostpointercapture=endDrag;
    let resize=null;
    el.querySelectorAll('.resize-handle').forEach(handle=>{
      handle.onpointerdown=e=>{if(resize||settings.windowPinned||(e.pointerType==='mouse'&&e.button!==0))return;const rect=el.getBoundingClientRect();resize={id:e.pointerId,dir:handle.dataset.r,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height};handle.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation();};
      handle.onpointermove=e=>{
        if(!resize||e.pointerId!==resize.id)return;
        const dx=e.clientX-resize.x,dy=e.clientY-resize.y,west=resize.dir.includes('w'),north=resize.dir.includes('n'),east=resize.dir.includes('e'),south=resize.dir.includes('s'),view=viewport();
        const width=Math.max(220,Math.min(view.width-12,resize.width+(east?dx:west?-dx:0))),height=Math.max(190,Math.min(view.height-12,resize.height+(south?dy:north?-dy:0)));
        place(west?resize.left+resize.width-width:resize.left,north?resize.top+resize.height-height:resize.top,width,height,true);e.preventDefault();e.stopPropagation();
      };
      const endResize=e=>{if(!resize||e?.pointerId!==undefined&&e.pointerId!==resize.id)return;const state=resize;resize=null;try{handle.releasePointerCapture?.(state.id);}catch{}persist(true);};
      handle.onpointerup=endResize;handle.onpointercancel=endResize;handle.onlostpointercapture=endResize;
    });
  }
  function syncFloatingPanelThemes(){
    const player=DOC.getElementById(ID);if(!player)return;
    // Keep the popover palette in sync with the current player skin.
    const style=ROOT.getComputedStyle(player),read=(name,fallback)=>style.getPropertyValue(name).trim()||fallback;
    const text=read('--smp-text','#f5f4f7'),light=(colorLuminance(text)??1)<.45;
    const palette={
      '--picker-bg':read('--smp-settings-bg',light?'#fafbfdf5':'#1b1d27f5'),
      '--picker-text':text,'--picker-muted':read('--smp-muted',light?'#626573':'#b9bac5'),
      '--picker-line':read('--smp-control-border',light?'#00000020':'#ffffff26'),
      '--picker-accent':read('--smp-switch',light?'#367b6d':'#a8d9ce'),
      '--picker-control':read('--smp-control-bg',light?'#00000008':'#ffffff0d'),
      '--picker-cover':['albumglass','orbit'].includes(settings.skin)?read('--album-cover','none'):'none'
    };
    for(const suffix of ['source-float','skin-float','lyrics-float','video','bilibili-search']){
      const panel=DOC.getElementById(`${ID}-${suffix}`);if(!panel)continue;
      for(const [name,value] of Object.entries(palette))panel.style.setProperty(name,value);
      panel.dataset.tone=light?'light':'dark';panel.style.colorScheme=light?'light':'dark';
    }
  }
  function placeFloatingPanel(panel,button,width=300){
    const rect=button.getBoundingClientRect(),view=ROOT.visualViewport,left=Number(view?.offsetLeft)||0,top=Number(view?.offsetTop)||0,vw=view?.width||ROOT.innerWidth||390,vh=view?.height||ROOT.innerHeight||700,w=Math.min(width,vw-16);
    const below=Math.max(0,top+vh-rect.bottom-16),above=Math.max(0,rect.top-top-16),down=below>=Math.min(260,above),room=down?below:above;
    panel.style.width=`${w}px`;panel.style.maxHeight=`${Math.max(30,room)}px`;panel.style.left=`${Math.max(left+8,Math.min(left+vw-w-8,rect.right-w))}px`;
    panel.style.top=`${Math.max(top+8,down?rect.bottom+8:rect.top-panel.offsetHeight-8)}px`;
  }
  function bindPlaybackSources(el){
    const controls=el.querySelector('.controls');
    controls.insertAdjacentHTML('afterbegin',`<button type="button" data-c="source" title="切换当前歌曲播放源" aria-label="切换当前歌曲播放源" aria-haspopup="dialog" aria-expanded="false" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4"/></svg></button>`);
    const button=controls.querySelector('[data-c=source]'),panel=DOC.createElement('section');
    panel.id=`${ID}-source-float`;panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','切换播放源');DOC.body.append(panel);
    const close=()=>{panel.hidden=true;button.setAttribute('aria-expanded','false');};
    bindReliableTap(button,()=>{
      if(!panel.hidden){close();return;}if(!current)return;
      syncFloatingPanelThemes();
      const choice=playbackSourceChoice(current);
      const lxOptions=settings.lxMusicEnabled?Object.keys(LX_SOURCES).map(platform=>[`lx-${platform}`,lxSourceLabel(platform)]):[];
      const options=[['auto','自动回退'],...GD_SOURCES.map(source=>[source,GD_SOURCE_LABELS[source]]),...lxOptions];
      panel.innerHTML=`<div class="source-heading"><b>播放源</b><button type="button" data-source-close aria-label="关闭播放源选择">×</button></div><small>当前：${esc(playbackLabel(current))} · 仅本曲生效</small><div class="source-options">${options.map(([source,label])=>`<button type="button" data-playback-source="${source}" aria-pressed="${choice===source}">${esc(label)}</button>`).join('')}</div><small class="source-hint">离线缓存、手动音源优先${lxOptions.length?' · LX Music 来源：Huibq':''}</small>`;
      panel.querySelector('[data-source-close]').onclick=close;
      panel.querySelectorAll('[data-playback-source]').forEach(option=>bindReliableTap(option,()=>{
        const song=current,source=option.dataset.playbackSource;if(!song)return;close();playbackSources.set(song,source);
        if(source.startsWith('lx-')){void play(song);return;}
        // Explicit retry discards stale URL responses, preserving searches and the shared quota.
        for(const key of gdResponses.keys()){const url=new URL(key);if(url.searchParams.get('types')==='url'&&(source==='auto'||url.searchParams.get('source')===source))gdResponses.delete(key);}
        if(!['direct','tencent','kugou'].includes(song.source))song.audio='';void play(song);
      }));
      panel.hidden=false;button.setAttribute('aria-expanded','true');placeFloatingPanel(panel,button,220);
    });
    const outside=e=>{if(!panel.contains(e.target)&&!button.contains(e.target))close();},escape=e=>{if(e.key==='Escape')close();},reposition=()=>{if(!panel.hidden)placeFloatingPanel(panel,button,220);};
    DOC.addEventListener('pointerdown',outside,true);DOC.addEventListener('keydown',escape);ROOT.addEventListener('resize',reposition);ROOT.visualViewport?.addEventListener('resize',reposition);ROOT.visualViewport?.addEventListener('scroll',reposition);
    sourceMenuCleanup=()=>{DOC.removeEventListener('pointerdown',outside,true);DOC.removeEventListener('keydown',escape);ROOT.removeEventListener('resize',reposition);ROOT.visualViewport?.removeEventListener('resize',reposition);ROOT.visualViewport?.removeEventListener('scroll',reposition);};
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-source-style">
      #${ID}:not(.mini) .controls [data-c=source]{grid-column:1!important;justify-self:center!important;display:flex!important;align-items:center!important;justify-content:center!important;width:32px!important;min-width:32px!important;height:32px!important;padding:0!important;border-radius:50%!important}
      #${ID}:not(.mini) .controls :is([data-c=source],[data-c=mode]){color:inherit!important;opacity:.72}
      #${ID} .controls [data-c=source]>svg{display:block!important;flex:none!important;width:17px!important;height:17px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
      /* The loop paths fill more of their view box than the source arrows. */
      #${ID} .controls button[data-c=mode]:before{width:15px;height:15px}
      #${ID}.immersive .controls [data-c=source]:before{display:none!important}
      #${ID}-source-float{position:fixed;z-index:2147483647;box-sizing:border-box;padding:12px!important;border:1px solid var(--picker-line,#ffffff26);border-radius:16px;background:var(--picker-bg,#20212afa);color:var(--picker-text,#f5f4f7);box-shadow:0 12px 36px #0005;font:12px/1.4 system-ui!important;overflow:auto;overscroll-behavior:contain}
      #${ID}-source-float[hidden]{display:none!important}#${ID}-source-float>.source-heading{display:flex!important;align-items:center;justify-content:space-between;margin:0 0 5px!important;padding:0!important;height:auto!important;background:none!important}
      #${ID}-source-float b{font:600 12px/1.4 system-ui!important}#${ID}-source-float small{display:block;margin:0 0 10px;font:10px/1.5 system-ui!important;color:var(--picker-muted,#b9bac8)}
      #${ID}-source-float>.source-options{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}
      #${ID}-source-float button{min-width:0!important;min-height:32px!important;padding:6px 8px!important;border:1px solid var(--picker-line,#ffffff26);border-radius:9px;background:var(--picker-control,#ffffff0d);color:inherit;font:11px/1.4 system-ui!important;cursor:pointer}
      #${ID}-source-float [aria-pressed=true]{border-color:var(--picker-accent,#a8d9ce);background:color-mix(in srgb,var(--picker-accent,#a8d9ce) 14%,transparent)}#${ID}-source-float [data-source-close]{width:24px!important;height:24px!important;min-height:24px!important;padding:0!important;border:0;background:transparent;font-size:18px!important}
      #${ID}-source-float .source-hint{margin:0!important;font-size:9px!important}
    </style>`);
  }
  function updateQuickLyricsButton(el=DOC.getElementById(ID)){
    const button=el?.querySelector('.desktop-lyric-toggle');if(!button)return;
    button.classList.toggle('active',settings.floatingLyrics);button.textContent='词';button.title='歌词设置';
  }
  function bindQuickLyrics(el){
    const button=el.querySelector('.desktop-lyric-toggle');if(!button)return;
    const lock=el.querySelector('.quick-lyrics-lock');bindReliableTap(lock,()=>{settings.lyricsLocked=!settings.lyricsLocked;updateLyricsLock();save();});
    DOC.getElementById(`${ID}-lyrics-float`)?.remove();
    const menu=DOC.createElement('section');menu.id=`${ID}-lyrics-float`;menu.hidden=true;menu.setAttribute('role','dialog');menu.setAttribute('aria-label','歌词设置');
    menu.innerHTML=`<div class="lyrics-heading"><b>歌词设置</b><button type="button" data-lyrics-close aria-label="关闭歌词设置">×</button></div>
      <div class="lyrics-preview"><span>音乐响起，让歌词陪着你</span><small>悬浮歌词外观预览</small></div>
      <label class="lyric-option"><span>悬浮歌词</span><input name="floatingLyrics" type="checkbox"></label>
      <label class="lyric-option"><span>锁定歌词位置</span><input name="lyricsLocked" type="checkbox"></label>
      <div class="lyric-fonts">
        <label><span>桌面字号 <output data-for="desktopLyricFontSize"></output></span><input type="range" name="desktopLyricFontSize" min="12" max="68"></label>
        <label><span>手机字号 <output data-for="mobileLyricFontSize"></output></span><input type="range" name="mobileLyricFontSize" min="10" max="42"></label>
      </div>
      <label class="lyric-option"><span>渐变文字</span><input name="lyricGradient" type="checkbox"></label>
      <div class="lyric-colors"><label><span>歌词主色</span><input name="lyricColor" type="color"></label><label><span>渐变副色</span><input name="lyricGradientColor" type="color"></label></div>
      <button type="button" data-lyrics-reset>重置位置与字号</button>`;
    DOC.body.appendChild(menu);
    const close=()=>{menu.hidden=true;button.setAttribute('aria-expanded','false');};
    const preview=()=>{
      for(const name of ['desktopLyricFontSize','mobileLyricFontSize'])menu.querySelector(`[data-for="${name}"]`).textContent=`${settings[name]} px`;
      const text=menu.querySelector('.lyrics-preview span');text.style.color=settings.lyricColor;
      text.style.backgroundImage=settings.lyricGradient?`linear-gradient(90deg,${settings.lyricColor},${settings.lyricGradientColor})`:'';
      text.classList.toggle('gradient',!!settings.lyricGradient);menu.querySelector('[name=lyricGradientColor]').disabled=!settings.lyricGradient;
    };
    const refresh=()=>{
      syncFloatingPanelThemes();
      menu.querySelectorAll('input[name]').forEach(input=>{if(input.type==='checkbox')input.checked=!!settings[input.name];else input.value=settings[input.name];});preview();
    };
    const place=()=>placeFloatingPanel(menu,button);
    const apply=event=>{
      const input=event.target;if(!input.matches('input[name]'))return;
      settings[input.name]=input.type==='checkbox'?input.checked:input.type==='range'?Number(input.value):input.value;
      preview();updateLyricsLock();renderDesktopLyrics(currentLyricWords);updateQuickLyricsButton(el);
    };
    menu.oninput=apply;menu.onchange=event=>{apply(event);save();};
    menu.querySelector('[data-lyrics-close]').onclick=close;
    menu.querySelector('[data-lyrics-reset]').onclick=()=>{
      settings.desktopPosition={...defaults.desktopPosition};settings.mobileLyricsPosition={...defaults.mobileLyricsPosition};settings.desktopLyricFontSize=defaults.desktopLyricFontSize;settings.mobileLyricFontSize=defaults.mobileLyricFontSize;
      refresh();renderDesktopLyrics(currentLyricWords);save();
    };
    button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',menu.id);button.setAttribute('aria-expanded','false');
    bindReliableTap(button,()=>{
      if(!menu.hidden){close();return;}
      closeSkinMenu(el);
      refresh();menu.classList.remove('hidden');menu.hidden=false;button.setAttribute('aria-expanded','true');place();
    });
    const outside=event=>{if(!menu.hidden&&!menu.contains(event.target)&&!button.contains(event.target))close();};
    const escape=event=>{if(event.key==='Escape'&&!menu.hidden){close();button.focus({preventScroll:true});}};
    const reposition=()=>{if(!menu.hidden)place();};
    DOC.addEventListener('pointerdown',outside,true);DOC.addEventListener('keydown',escape);ROOT.addEventListener('resize',reposition);ROOT.visualViewport?.addEventListener('resize',reposition);ROOT.visualViewport?.addEventListener('scroll',reposition);
    lyricMenuCleanup=()=>{DOC.removeEventListener('pointerdown',outside,true);DOC.removeEventListener('keydown',escape);ROOT.removeEventListener('resize',reposition);ROOT.visualViewport?.removeEventListener('resize',reposition);ROOT.visualViewport?.removeEventListener('scroll',reposition);};
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-lyrics-settings-style">
      #${ID}-lyrics-float{position:fixed!important;z-index:2147483647!important;box-sizing:border-box!important;--picker-bg:#1b1d27f5;--picker-text:#f5f4f7;--picker-muted:#a8abbc;--picker-line:#ffffff19;--picker-accent:#a8d9ce;margin:0!important;padding:16px!important;border:1px solid var(--picker-line)!important;border-radius:22px!important;background:var(--picker-bg)!important;color:var(--picker-text)!important;font:13px/1.5 system-ui!important;box-shadow:0 20px 60px #0006!important;backdrop-filter:blur(28px);overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;color-scheme:dark}
      #${ID}-lyrics-float[data-tone=light]{color-scheme:light}
      #${ID}-lyrics-float[hidden]{display:none!important}
      #${ID}-lyrics-float *{box-sizing:border-box}
      #${ID}-lyrics-float .lyrics-heading,#${ID}-lyrics-float .lyric-option{display:flex;align-items:center;justify-content:space-between;gap:12px}
      #${ID}-lyrics-float .lyrics-heading{margin-bottom:12px;font-size:15px}
      #${ID}-lyrics-float button{appearance:none!important;border:1px solid var(--picker-line)!important;border-radius:12px!important;background:transparent!important;color:var(--picker-text)!important;font:12px/1.5 system-ui!important;min-height:32px!important;padding:6px 12px!important;cursor:pointer}
      #${ID}-lyrics-float .lyrics-heading button{width:28px!important;min-height:28px!important;padding:0!important;border:0!important;font-size:20px!important}
      #${ID}-lyrics-float .lyrics-preview{padding:16px 10px;border:1px solid var(--picker-line);border-radius:14px;text-align:center;margin-bottom:10px}
      #${ID}-lyrics-float .lyrics-preview span{display:block;font:600 15px/1.6 system-ui}
      #${ID}-lyrics-float .lyrics-preview span.gradient{background-clip:text;-webkit-background-clip:text;color:transparent!important}
      #${ID}-lyrics-float .lyrics-preview small{display:block;font-size:10px;color:var(--picker-muted);margin-top:5px}
      #${ID}-lyrics-float .lyric-option{padding:10px 0;border-bottom:1px solid var(--picker-line);font:12px/1.6 system-ui}
      #${ID}-lyrics-float input[type=checkbox]{appearance:none!important;-webkit-appearance:none!important;flex:0 0 32px;position:relative;width:32px!important;min-width:32px!important;height:20px!important;margin:0!important;padding:0!important;border:0!important;border-radius:99px!important;background:color-mix(in srgb,var(--picker-text) 20%,transparent)!important;background-image:none!important;box-shadow:none!important;cursor:pointer}
      #${ID}-lyrics-float input[type=checkbox]::before{content:''!important;position:absolute;top:3px;left:3px;width:14px;height:14px;border:0;border-radius:50%;background:#fff!important;background-image:none!important;mask:none!important;-webkit-mask:none!important;box-shadow:none!important;transform:none!important;transition:left .12s}
      #${ID}-lyrics-float input[type=checkbox]::after{content:none!important}
      #${ID}-lyrics-float input[type=checkbox]:checked{background:var(--picker-accent)!important;background-image:none!important;mask:none!important;-webkit-mask:none!important}
      #${ID}-lyrics-float input[type=checkbox]:checked::before{left:15px}
      #${ID}-lyrics-float .lyric-fonts{display:grid;gap:12px;padding:14px 0 5px}
      #${ID}-lyrics-float .lyric-fonts label{display:grid;gap:8px;font:12px/1.5 system-ui}
      #${ID}-lyrics-float .lyric-fonts span{display:flex;justify-content:space-between}
      #${ID}-lyrics-float output{color:var(--picker-muted);font-variant-numeric:tabular-nums}
      #${ID}-lyrics-float input[type=range]{width:100%;min-width:0;height:14px;margin:0;padding:0;border:0;background:transparent;accent-color:var(--picker-accent)}
      #${ID}-lyrics-float .lyric-colors{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:14px 0}
      #${ID}-lyrics-float .lyric-colors label{display:flex;align-items:center;justify-content:space-between;gap:5px;font:11px/1.5 system-ui}
      #${ID}-lyrics-float input[type=color]{appearance:none;width:36px!important;min-width:36px!important;height:28px!important;padding:3px!important;border:1px solid var(--picker-line)!important;border-radius:8px!important;background:transparent!important}
      #${ID}-lyrics-float input:disabled{opacity:.35}#${ID}-lyrics-float [data-lyrics-reset]{width:100%}
    </style>`);updateQuickLyricsButton(el);
  }
  function applyCustomScales(el=DOC.getElementById(ID)){if(!el)return;for(const key of ['buttonScale','textScale','coverScale','listScale']){const value=Math.max(.6,Math.min(1.6,Number(settings[key])||1));settings[key]=value;el.style.setProperty(`--${key.replace('Scale','-scale').replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`)}`,String(value));}}
  function bindScaleSettings(el){const gear=el.querySelector('.gear'),open=gear.onclick,labels={buttonScale:'按钮大小',textScale:'文字大小',coverScale:'封面大小',listScale:'歌曲列表规格',miniScale:'悬浮窗大小'};gear.onclick=e=>{open?.call(gear,e);const panel=el.querySelector('.settings-panel'),grid=panel?.querySelector('.set-grid');if(!grid)return;let card=grid.querySelector('.custom-scales');if(!card){card=DOC.createElement('div');card.className='set-card custom-scales';card.innerHTML=`<b>独立尺寸调整</b>${Object.entries(labels).map(([key,label])=>`<div class="scale-row" data-scale="${key}"><span>${label}</span><button type="button" data-step="-.1">−</button><output></output><button type="button" data-step=".1">＋</button></div>`).join('')}<button type="button" data-scale-reset>恢复默认</button>`;grid.appendChild(card);card.onclick=event=>{const reset=event.target.closest('[data-scale-reset]'),row=event.target.closest('[data-scale]'),step=Number(event.target.closest('[data-step]')?.dataset.step);if(reset){for(const key of Object.keys(labels))settings[key]=1;}else if(row&&step){const key=row.dataset.scale;settings[key]=Math.round(Math.max(.6,Math.min(1.6,(Number(settings[key])||1)+step))*10)/10;}else return;applyCustomScales(el);update();save();};}const update=()=>card.querySelectorAll('[data-scale]').forEach(row=>{row.querySelector('output').textContent=`${Math.round((Number(settings[row.dataset.scale])||1)*100)}%`;});update();};}
  function bindUiPresetOnly(el){el.classList.remove('ui-size-s','ui-size-m','ui-size-l');el.classList.add(`ui-size-${['s','m','l'].includes(settings.playerSize)?settings.playerSize:'m'}`);}
  function bindWindowResetSetting(el){
    const gear=el.querySelector('.gear'),open=gear.onclick;
    gear.onclick=e=>{
      open?.call(gear,e);
      const grid=el.querySelector('.settings-panel .set-grid');
      if(!grid||grid.querySelector('.window-settings-card'))return;
      const card=DOC.createElement('section');
      card.className='set-card window-settings-card';
      card.setAttribute('aria-labelledby',`${ID}-window-settings-heading`);
      card.innerHTML=`
        <h4 id="${ID}-window-settings-heading">播放器窗口</h4>
        <label class="window-settings-field">悬浮窗外形
          <select name="miniShape"><option value="round">圆形</option><option value="square">方形</option><option value="selene">Selene</option></select>
        </label>
        <div class="window-settings-field">
          <label class="window-settings-toggle"><span>悬浮窗吸附</span><input type="checkbox" name="miniSnap" aria-describedby="${ID}-window-snap-note"></label>
          <small class="window-settings-note" id="${ID}-window-snap-note">松手后自动吸附到顶部工具栏上沿、聊天输入框上方或左右屏幕边缘。</small>
          <small class="window-settings-note">单击播放或暂停，双击展开播放器。</small>
        </div>
        <div class="window-settings-actions">
          <button type="button" data-window-mini>缩成悬浮窗</button>
          <button type="button" data-window-default>恢复默认尺寸</button>
        </div>`;
      grid.appendChild(card);
      const shape=card.querySelector('[name=miniShape]'),snap=card.querySelector('[name=miniSnap]');
      shape.value=playerMiniShape();snap.checked=!!settings.miniSnap;
      snap.onchange=event=>{event.stopPropagation();settings.miniSnap=snap.checked;save();};
      shape.onchange=event=>{event.stopPropagation();settings.miniShape=shape.value;el.dataset.miniShape=shape.value;save();};
      card.querySelector('[data-window-mini]').onclick=()=>el.dispatchEvent(new ROOT.Event('selene:mini'));
      card.querySelector('[data-window-default]').onclick=()=>{
        const vw=ROOT.visualViewport?.width||ROOT.innerWidth||390,vh=ROOT.visualViewport?.height||ROOT.innerHeight||700;
        const width=Math.min(365,vw-12),height=Math.min(600,vh-12),rect=el.getBoundingClientRect();
        const left=Math.max(6,Math.min(vw-width-6,rect.left)),top=Math.max(6,Math.min(vh-height-6,rect.top));
        for(const [key,value] of Object.entries({left,top,width,height}))el.style.setProperty(key,`${value}px`,'important');
        el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');
        settings.windowSize={width,height};save();toast('success','已恢复播放器默认尺寸');
      };
    };
  }
  function closeSkinMenu(el){
    el.querySelector(`#${ID}-skin-float`)?.classList.add('hidden');
    el.querySelector('.skin')?.setAttribute('aria-expanded','false');
  }
  function bindFloatingSkinMenu(el){
    const button=el.querySelector('.skin');
    const skins=[['albumglass','专辑玻璃','默认 · 随封面变色'],['orbit','流光唱片','圆形唱片 · 动态流光'],['film','胶片','复古暖调'],['red','中国红','绛红与鎏金'],['white','简约白','干净明亮'],['black','简约黑','安静深邃'],['blue','深海蓝','清透海蓝'],['cream','INS 奶油','柔和暖色'],['green','森系绿','自然清新']];
    DOC.getElementById(`${ID}-skin-float`)?.remove();
    const menu=DOC.createElement('div');menu.id=`${ID}-skin-float`;menu.className='hidden';menu.setAttribute('role','dialog');menu.setAttribute('aria-label','选择播放器外观');
    menu.innerHTML='<div class="selene-skin-heading">选择外观</div><div class="selene-skin-options">'+skins.map(([key,label,note])=>`<button type="button" data-skin="${key}" aria-pressed="false"><i class="selene-skin-swatch" aria-hidden="true"></i><span>${label}</span><small>${note}</small><i class="selene-skin-check" aria-hidden="true">✓</i></button>`).join('')+'</div>';
    el.appendChild(menu);
    const options=menu.querySelector('.selene-skin-options');
    const close=()=>closeSkinMenu(el);
    const refresh=()=>{
      syncFloatingPanelThemes();
      menu.style.setProperty('--skin-preview-cover',el.style.getPropertyValue('--album-cover')||'none');
      menu.querySelectorAll('[data-skin]').forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.skin===(settings.skin||'albumglass'))));
    };
    menu.onclick=event=>{const choice=event.target.closest('[data-skin]');if(!choice)return;settings.skin=choice.dataset.skin;applySkin(el);refresh();close();button.focus({preventScroll:true});save();};
    button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',menu.id);
    bindReliableTap(button,()=>{
      if(!menu.classList.contains('hidden')){close();return;}
      const lyrics=DOC.getElementById(`${ID}-lyrics-float`);
      if(lyrics)lyrics.hidden=true;
      el.querySelector('.desktop-lyric-toggle')?.setAttribute('aria-expanded','false');
      const settingsPanel=el.querySelector('.settings-panel');
      if(settingsPanel)settingsPanel.style.display='none';
      refresh();menu.classList.remove('hidden');options.scrollTop=0;button.setAttribute('aria-expanded','true');
    });
    const outside=event=>{if(!menu.classList.contains('hidden')&&!menu.contains(event.target)&&!button.contains(event.target))close();};
    const escape=event=>{if(event.key==='Escape'&&!menu.classList.contains('hidden')){close();button.focus({preventScroll:true});}};
    DOC.addEventListener('pointerdown',outside,true);DOC.addEventListener('keydown',escape);
    skinMenuCleanup=()=>{DOC.removeEventListener('pointerdown',outside,true);DOC.removeEventListener('keydown',escape);};
    DOC.head.insertAdjacentHTML('beforeend',`<style id="${ID}-skin-cards-style">
      #${ID}-skin-float{position:absolute!important;z-index:25!important;inset:49px 6px 6px auto!important;width:min(288px,calc(100% - 12px))!important;box-sizing:border-box!important;display:flex!important;flex-direction:column;overflow:hidden!important;margin:0!important;padding:0!important;border:1px solid var(--picker-line)!important;border-radius:14px!important;background:var(--picker-bg)!important;color:var(--picker-text)!important;box-shadow:0 12px 32px #0005!important;--picker-bg:#1b1d27f5;--picker-text:#f5f4f7;--picker-muted:#a8abbc;--picker-line:#ffffff19;--picker-accent:#a8d9ce}
      #${ID}.touch-layout>#${ID}-skin-float{width:calc(100% - 12px)!important}
      :is(#${ID}-skin-float,#${ID}-lyrics-float,#${ID}-source-float){isolation:isolate}
      :is(#${ID}-skin-float,#${ID}-lyrics-float,#${ID}-source-float)::before{content:'';position:absolute;z-index:-1;inset:0;border-radius:inherit;background-image:var(--picker-cover,none);background-size:cover;background-position:center;filter:blur(24px) saturate(.8);opacity:.22;pointer-events:none}
      :is(#${ID}-skin-float,#${ID}-lyrics-float,#${ID}-source-float) button:focus-visible{outline:2px solid var(--picker-accent);outline-offset:2px}
      #${ID}-skin-float.hidden{display:none!important}
      #${ID}-skin-float .selene-skin-heading{flex:none;padding:10px 12px 6px;font:600 13px/1.5 system-ui!important;color:var(--picker-text)!important}
      #${ID}-skin-float .selene-skin-options{display:grid;flex:1 1 0;min-height:0;align-content:start;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:4px 10px 10px;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;touch-action:pan-y}
      #${ID}-skin-float .selene-skin-options>button{position:relative;display:flex!important;flex-direction:column;align-items:stretch;gap:4px;width:100%!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:90px!important;max-height:none!important;margin:0!important;padding:8px!important;border:1px solid var(--picker-line)!important;border-radius:12px!important;background:transparent!important;color:var(--picker-text)!important;text-align:left!important;box-shadow:none!important;transform:none!important;cursor:pointer}
      #${ID}-skin-float .selene-skin-options>button:hover{background:color-mix(in srgb,var(--picker-text) 5%,transparent)!important;border-color:var(--picker-accent)!important}
      #${ID}-skin-float .selene-skin-options>[aria-pressed=true]{border-color:var(--picker-accent)!important;background:color-mix(in srgb,var(--picker-accent) 12%,transparent)!important}
      #${ID}-skin-float .selene-skin-options>button>span{font:600 11px/1.4 system-ui!important;color:var(--picker-text)!important}
      #${ID}-skin-float .selene-skin-options>button>small{font:9px/1.4 system-ui!important;color:var(--picker-muted)!important;white-space:normal}
      #${ID}-skin-float .selene-skin-swatch{display:block;position:relative;overflow:hidden;height:36px;flex:0 0 36px;width:100%;border-radius:8px;background:linear-gradient(120deg,#363846,#171b23)}
      #${ID}-skin-float .selene-skin-swatch:after{content:'';position:absolute;inset:8px 36% 8px 8px;border-radius:4px;border-top:3px solid #ffffff82;border-bottom:2px solid #ffffff33}
      #${ID}-skin-float [data-skin=albumglass] .selene-skin-swatch{background-image:linear-gradient(120deg,#527a8d66,#172133aa),var(--skin-preview-cover);background-position:center;background-size:cover;background-color:#4d6972}
      #${ID}-skin-float [data-skin=orbit] .selene-skin-swatch{background:repeating-radial-gradient(circle at 50% 50%,#f5947955 0 1px,transparent 1px 4px),linear-gradient(120deg,#932f2b,#391525)}
      #${ID}-skin-float [data-skin=orbit] .selene-skin-swatch:after{inset:7px auto 7px calc(50% - 11px);width:22px;border:0;border-radius:50%;background:#f2a48d;box-shadow:0 0 10px #ffad8e}
      #${ID}-skin-float [data-skin=film] .selene-skin-swatch{background:linear-gradient(120deg,#705044,#292234)}
      #${ID}-skin-float [data-skin=red] .selene-skin-swatch{background:linear-gradient(120deg,#cf3048,#710d26)}
      #${ID}-skin-float [data-skin=white] .selene-skin-swatch{background:linear-gradient(120deg,#fff,#dfe4ee)}
      #${ID}-skin-float [data-skin=white] .selene-skin-swatch:after,#${ID}-skin-float [data-skin=cream] .selene-skin-swatch:after{border-color:#6c655b66}
      #${ID}-skin-float [data-skin=black] .selene-skin-swatch{background:linear-gradient(120deg,#33343d,#090a0e)}
      #${ID}-skin-float [data-skin=blue] .selene-skin-swatch{background:linear-gradient(120deg,#419ec2,#123c73)}
      #${ID}-skin-float [data-skin=cream] .selene-skin-swatch{background:linear-gradient(120deg,#fff4df,#d7b58b)}
      #${ID}-skin-float [data-skin=green] .selene-skin-swatch{background:linear-gradient(120deg,#91b391,#2c5f4f)}
      #${ID}-skin-float .selene-skin-check{position:absolute;right:9px;top:50px;display:none;font:700 11px/1 system-ui;color:var(--picker-accent)}
      #${ID}-skin-float [aria-pressed=true] .selene-skin-check{display:block}
    </style>`);
  }
  function seleneMiniArt(){
    const openPalm=`<path class="selene-mini-palm" fill="#fff0e8" stroke-width=".9" d="M-2.7 3.6C-4.1 2.8-5.3 1-5.4-.1c-.1-1.1 1-1.5 1.8-.7l1 .9-1-2.8c-.4-1.2 1-1.8 1.6-.7l1 1.8-.3-2.7c-.2-1.3 1.5-1.4 1.7-.1l.5 2.5.7-2.3c.3-1.1 1.8-.8 1.7.4l-.4 2.2 1.3-1.6c.8-.9 2.1-.1 1.5 1l-.9 2.5C4.8 2.7 3 4.5.6 4.6c-1.3.1-2.4-.3-3.3-1Z"/>
      <path fill="none" stroke="#e6afbc" stroke-width=".65" d="M-1 1.9q.8-.7 2-.4"/>`;
    return `<svg class="selene-mini-art" viewBox="0 0 52 58" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <g class="selene-mini-body" stroke="#694b78" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">
      <g class="selene-mini-hanging" fill="none">
        <path stroke-width="6" d="M24 40C15 34 7 24 7 6"/>
        <path stroke="#ad91de" stroke-width="3.8" d="M24 40C15 34 7 24 7 6"/>
      </g>
      <g class="selene-mini-head">
        <path fill="#dbc6fa" d="M31 3C17 2 8 11 8 24c0 10-1 15-5 19 3 4 8 3 12 1 3 5 9 6 14 2l13-2c4-2 7-7 7-13C53 17 45 4 31 3Z"/>
        <path fill="#bfa1e6" stroke="none" d="M10 32c5 5 14 8 23 7 7-1 12-4 15-9-1 10-5 15-15 16l-4-1c-5 4-11 4-14-2-4 3-9 3-11 0 3-2 5-6 6-11Z"/>
      </g>
      <g class="selene-mini-hanging" fill="#ffe4dd">
        <path class="selene-mini-leg" d="M24 47h5l-1 6c0 3-6 3-6 0Z"/>
        <path class="selene-mini-leg" d="M34 47h5l2 6c1 3-5 4-6 1Z"/>
      </g>
      <g class="selene-mini-standing">
        <path class="selene-mini-upright" fill="#ffe4dd" d="M24 49v4c0 3 5 3 5 0v-4m6 0 1 4c0 3 5 2 5-1l-1-4"/>
        <path fill="#ad91de" d="M25 38c-2 4-5 7-5 10 3 4 17 5 23 0-2-3-5-5-6-10Z"/>
        <path fill="none" stroke="#f7e8ff" d="M22 47c5 2 13 3 19 0"/>
      </g>
      <g class="selene-mini-sitting">
        <path fill="#ad91de" d="M25 37c-4 4-8 12-6 17 4 3 16 3 21-2 1-5-2-10-4-15Z"/>
        <path fill="#ffe4dd" d="M35 50c2-2 7-2 8 0 1 2-2 5-5 6h-7c-2 0-2-3 0-4Zm9 1c2-1 5 0 5 2 0 2-4 4-7 3 1-1 2-3 2-5Z"/>
      </g>
      <g class="selene-mini-head">
        <path fill="#fff0e8" d="M13 22c2-7 9-12 17-12 11 0 18 7 17 17-1 8-7 14-17 14-10 1-18-4-18-13 0-2 0-4 1-6Z"/>
        <path fill="#eadcff" d="M10 26c-2-9 2-17 10-21 10-5 25-1 29 9 2 4 2 8 0 12-3-6-7-10-13-12-1 4-5 8-10 9 1-2 2-4 2-6-4 5-10 8-18 9Z"/>
        <path fill="none" stroke="#fff4ff" stroke-width="1.6" d="M13 20c1-4 4-8 8-10m20-1 3 2"/>
        <path fill="#ffe9a3" stroke-width="1.05" d="M25 6c-4 0-7 3-7 6s3 6 6 6c2 0 4-1 5-2-6 0-8-5-4-10Z"/>
        <path fill="#ffd9ee" stroke-width=".8" d="M45 9c1-3 2-3 3 0 3 1 3 2 0 3-1 3-2 3-3 0-3-1-3-2 0-3Z"/>
        <g class="selene-mini-eyes" stroke="none">
          <ellipse cx="22.5" cy="29.4" rx="3.5" ry="4.6" fill="#59406f"/><ellipse cx="37" cy="28.8" rx="3.5" ry="4.6" fill="#59406f"/>
          <path fill="#a87dc7" d="M20 31a2.7 2.7 0 0 0 5 0 5 5 0 0 1-5 0Zm14.5-.6a2.7 2.7 0 0 0 5 0 5 5 0 0 1-5 0Z"/>
          <circle cx="21.7" cy="28" r="1.15" fill="#fff"/><circle cx="36.2" cy="27.4" r="1.15" fill="#fff"/>
        </g>
        <g fill="#f4a8bb" stroke="none"><ellipse cx="17.3" cy="34.7" rx="2.7" ry="1.35"/><ellipse cx="42" cy="34.1" rx="2.7" ry="1.35"/></g>
        <path fill="none" stroke="#9b5777" stroke-width="1.1" d="M27.7 34.3q1 1.5 2.3 0 1.3 1.5 2.4-.2"/>
      </g>
      <g class="selene-mini-sitting selene-mini-hands">
        <path fill="none" stroke="#876aa7" stroke-width="1.1" d="M24 42q-.4 3 2.3 4m12-4q.4 3-2.2 4"/>
        <path fill="#fff0e8" stroke-width="1.05" d="M24.5 45.3q1.1-1.3 3.8-.8c2 .4 2.2 2.1 1.1 3.1q-1.3 1.2-3.8.6c-1.6-.4-2.2-1.6-1.1-2.9Z"/>
        <path fill="#fff0e8" stroke-width="1.05" d="M38.2 45.3q-1.1-1.3-3.8-.8c-2 .4-2.2 2.1-1.1 3.1q1.3 1.2 3.8.6c1.6-.4 2.2-1.6 1.1-2.9Z"/>
      </g>
      <g class="selene-mini-hanging selene-mini-beat">
        <path fill="#ad91de" d="M36 40q4.8 1.8 7.7-1.9l3.8 2.9q-3.5 5.4-9.5 4.2Z"/>
        <g transform="translate(45.8 38.2) rotate(21) scale(.78)">${openPalm}</g>
      </g>
      <g class="selene-mini-hanging" stroke-width="1.05">
        <path fill="#fff0e8" d="M3.5 5.4C2.6 3.3 3.6 1.2 5.4 1.2q.9-.6 1.8 0c2.1-.3 3.6.9 3.5 2.9-.1 2.1-1.3 3.6-3.5 3.8-1.5.1-3-.8-3.7-2.5Z"/>
        <path fill="none" stroke="#dbaab8" stroke-width=".75" d="M5.8 5c.4-1 1.6-1.2 2.3-.7M5.3 2.3l.2.6m2-1 .2.7"/>
      </g>
      <path class="selene-mini-standing selene-mini-upright selene-mini-folded-hands" fill="#fff0e8" d="M26 43q4-2 5 1 2-3 5-1 2 3-2 4h-5q-4 0-3-4Z"/>
      <g class="selene-mini-peek">
        <path fill="#ad91de" d="M24 41q-5 1-10-1l-4 4q5 6 13 2Z"/>
        <g transform="translate(10.2 40.6) rotate(-24) scale(.78)">${openPalm}</g>
      </g>
    </g>
  </svg>`;}
  let miniTapTimer=0;
  function bindMiniPlayer(el){
    const title=el.querySelector('.selene-player-head b'),cover=el.querySelector('.mini-cover-shell');
    const enter=()=>{
      if(el.classList.contains('mini'))return;
      const rect=el.getBoundingClientRect();
      settings.miniRestore={width:Math.round(rect.width),height:Math.round(rect.height),left:Math.round(rect.left),top:Math.round(rect.top)};
      closeSkinMenu(el);
      settings.miniMode=true;settings.immersive=false;el.classList.remove('immersive');el.classList.add('mini');
      el.querySelector('.settings-panel [data-x]')?.click();
      const key=playerMiniPositionKey(),remembered=settings.miniReturnPosition||settings[key];
      // Title taps switch modes before the pointer wrapper clears pointer-interacting.
      // Restore directly here; only passive resize/focus handlers should skip a drag.
      const placed=restoreMiniGeometry(el,remembered||rect);
      settings[key]=remembered||placed;settings.miniReturnPosition=null;save();
    };
    const exit=()=>{
      ROOT.clearTimeout(miniTapTimer);miniTapTimer=0;
      if(!el.classList.contains('mini'))return;
      const rect=el.getBoundingClientRect(),view=miniViewport(),restore=settings.miniRestore||settings.windowSize||{width:365,height:600};
      const {miniEdge,miniAnchor}=el.dataset;
      settings.miniReturnPosition=settings[playerMiniPositionKey()]||{
        left:Math.round(rect.left),top:Math.round(rect.top),...(miniAnchor?{dock:miniAnchor}:miniEdge?{dock:'edge',edge:miniEdge}:{}),
      };
      const width=Math.min(restore.width,view.width-12),height=Math.min(restore.height,view.height-12);
      const left=Math.max(view.left+6,Math.min(view.left+view.width-width-6,restore.left??rect.left)),top=Math.max(view.top+6,Math.min(view.top+view.height-height-6,restore.top??rect.top));
      settings.miniMode=false;el.classList.remove('mini');delete el.dataset.miniEdge;delete el.dataset.miniDock;delete el.dataset.miniAnchor;watchMiniDock();
      for(const key of ['min-width','min-height','max-width','max-height'])el.style.removeProperty(key);
      for(const [key,value] of Object.entries({left,top,width,height}))el.style.setProperty(key,`${value}px`,'important');
      settings.windowSize={width,height};save();
    };
    title.onclick=e=>{e.stopPropagation();enter();};
    el.addEventListener('selene:mini',enter);
    cover.onclick=e=>{if(!e.detail)exit();}; // Keyboard and assistive technology.
    const tap=()=>{
      if(miniTapTimer){exit();return;}
      miniTapTimer=ROOT.setTimeout(()=>{
        miniTapTimer=0;
        if(!disposed&&el.classList.contains('mini')&&el.isConnected)el.querySelector('[data-c=play]')?.click();
      },320);
    };
    let drag=null;
    cover.onpointerdown=e=>{
      if(drag||(e.pointerType==='mouse'&&e.button!==0))return;
      const rect=el.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height,moved:false};
      cover.setPointerCapture?.(e.pointerId);e.preventDefault();
    };
    const updateDrag=e=>{
      if(!Number.isFinite(e.clientX)||!Number.isFinite(e.clientY))return;
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(!drag.moved&&Math.hypot(dx,dy)<(e.pointerType==='touch'?4:3))return;
      if(!drag.moved){ROOT.clearTimeout(miniTapTimer);miniTapTimer=0;drag.moved=true;}
      const view=miniViewport();
      drag.dropX=e.clientX;drag.dropY=e.clientY;
      drag.nextLeft=Math.max(view.left,Math.min(view.left+view.width-drag.width,drag.left+dx));
      drag.nextTop=Math.max(view.top+6,Math.min(view.top+view.height-drag.height-6,drag.top+dy));
    };
    cover.onpointermove=e=>{
      if(!drag||e.pointerId!==drag.id||e.type==='pointerup')return;
      updateDrag(e);
      if(drag.moved)el.style.setProperty('transform',`translate3d(${drag.nextLeft-drag.left}px,${drag.nextTop-drag.top}px,0)`,'important');
    };
    const end=(e,cancelled=false)=>{
      if(!drag||drag.id!==e.pointerId)return;
      // A quick release can arrive before the last pointermove has been painted.
      if(!cancelled)updateDrag(e);
      const previous=drag;drag=null;
      try{cover.releasePointerCapture?.(previous.id);}catch{}
      el.style.removeProperty('transform');
      if(!previous.moved){if(!cancelled)tap();return;}
      settings[playerMiniPositionKey()]=placeMiniWindow(el,previous.nextLeft,previous.nextTop,{snap:!!settings.miniSnap,dropX:previous.dropX,dropY:previous.dropY,dragWidth:previous.width,dragHeight:previous.height});save();
    };
    cover.onpointerup=e=>end(e);cover.onpointercancel=e=>end(e,true);cover.onlostpointercapture=e=>end(e,true);
  }
  function bindTitleGesture(el){
    const title=el.querySelector('.selene-player-head b'),activateMini=title.onclick,viewport=()=>({left:Number(ROOT.visualViewport?.offsetLeft)||0,top:Number(ROOT.visualViewport?.offsetTop)||0,width:ROOT.visualViewport?.width||ROOT.innerWidth||390,height:ROOT.visualViewport?.height||ROOT.innerHeight||700});let gesture=null;
    title.onclick=e=>{e?.preventDefault?.();e?.stopPropagation?.();};
    title.onpointerdown=e=>{
      if(gesture||(e.pointerType==='mouse'&&e.button!==0))return;
      const rect=el.getBoundingClientRect();gesture={id:e.pointerId,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height,view:viewport(),dx:0,dy:0,long:false,timer:ROOT.setTimeout(()=>{if(gesture)gesture.long=true;},240)};
      el.style.setProperty('left',`${rect.left}px`,'important');el.style.setProperty('top',`${rect.top}px`,'important');el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');
      title.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation();
    };
    title.onpointermove=e=>{
      if(!gesture||e.pointerId!==gesture.id||settings.windowPinned)return;
      const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
      if(!gesture.long){if(Math.hypot(dx,dy)<4)return;gesture.long=true;ROOT.clearTimeout(gesture.timer);}
      const view=gesture.view,left=Math.max(view.left+6,Math.min(Math.max(view.left+6,view.left+view.width-gesture.width-6),gesture.left+dx)),top=Math.max(view.top+6,Math.min(Math.max(view.top+6,view.top+view.height-gesture.height-6),gesture.top+dy));
      gesture.dx=left-gesture.left;gesture.dy=top-gesture.top;el.style.setProperty('transform',`translate3d(${gesture.dx}px,${gesture.dy}px,0)`,'important');e.preventDefault();
    };
    const finish=(event,cancelled=false)=>{
      if(!gesture||event?.pointerId!==undefined&&event.pointerId!==gesture.id)return;
      const state=gesture;gesture=null;ROOT.clearTimeout(state.timer);
      if(state.long){
        // A cancelled gesture keeps the last painted position instead of snapping back.
        const view=viewport(),left=Math.max(view.left+6,Math.min(Math.max(view.left+6,view.left+view.width-state.width-6),state.left+state.dx)),top=Math.max(view.top+6,Math.min(Math.max(view.top+6,view.top+view.height-state.height-6),state.top+state.dy));
        el.style.setProperty('left',`${left}px`,'important');el.style.setProperty('top',`${top}px`,'important');el.style.removeProperty('transform');
        settings.position={right:Math.max(0,Math.round((ROOT.innerWidth||view.left+view.width)-left-state.width)),bottom:Math.max(0,Math.round((ROOT.innerHeight||view.top+view.height)-top-state.height))};
        if(isMobile())settings.mobilePosition={left:Math.round(left),top:Math.round((top-view.top)/view.height*100)};save();
      }else if(!cancelled)activateMini?.call(title,{stopPropagation(){}});
      try{title.releasePointerCapture?.(state.id);}catch{}
    };
    title.onpointerup=e=>finish(e);title.onpointercancel=e=>finish(e,true);title.onlostpointercapture=e=>finish(e,true);
  }
  function bindListBatchActions(el){el.querySelector('[data-a="fav-queue"]')?.remove();const inject=kind=>{const box=el.querySelector('.list');if(!box||box.hidden)return;box.querySelector('.batch-bar')?.remove();const bar=DOC.createElement('div');bar.className='batch-bar';bar.innerHTML=`<b>${kind==='fav'?'收藏歌曲':'播放队列'}</b>${kind==='fav'?'<button data-batch-queue>收藏入队</button>':''}<button data-batch-play>一键播放</button>`;box.prepend(bar);bar.onclick=e=>{const favorites=settings.favorites||[];if(e.target.closest('[data-batch-queue]')){const known=new Set(queue.map(x=>x.id));let added=0;for(const song of favorites)if(!known.has(song.id)){queue.push(strip(song));known.add(song.id);added++;}count();setStatus(added?`已将 ${added} 首收藏加入播放队列`:'收藏歌曲已在播放队列中');}if(e.target.closest('[data-batch-play]')){if(kind==='fav'){queue=favorites.map(strip);count();}if(!queue.length){setStatus('没有可播放的歌曲');return;}queueIndex=0;playListEntry(queue[0]);}};};el.querySelector('.actions').addEventListener('click',e=>{const action=e.target.dataset.a;if(action==='fav'||action==='queue')ROOT.setTimeout(()=>inject(action),0);});}
  function bindListHeadingActions(el){el.querySelector('[data-a="fav-queue"]')?.remove();}
  function publicState(){
    const player=DOC.getElementById(ID);
    return {
      version:VERSION,
      loaded:!!player,
      visible:!!player&&!player.hidden&&!player.classList.contains('hidden'),
      companionVisible:!!DOC.getElementById(`${ID}-companion`)&&!DOC.getElementById(`${ID}-companion`).hidden,
      autoShow:settings.autoShow!==false,
      menuEnabled:!EXTENSION_MODE||settings.menuEnabled!==false,
      audioSessionMode:settings.audioSessionMode==='mix'?'mix':'priority',
      audioSessionSupported:!!audioSession,
      keepAlive:!!settings.keepAlive,
      keepAliveActive:keepAliveActive(),
      keepAliveSuspended:!!settings.keepAlive&&keepAliveSuspendedForTrack,
      keepAliveManualTakeover:!!settings.keepAlive&&keepAliveManualTakeover,
      keepAliveError,
    };
  }
  function emitPublicState(){
    try{ROOT.dispatchEvent(new ROOT.CustomEvent('selene-music-player-state',{detail:publicState()}));}catch{}
  }
  function applyPlayerVisibility(visible){
    const player=DOC.getElementById(ID);if(!player)return;
    player.hidden=!visible;player.classList.toggle('hidden',!visible);
    if(visible){player.style.removeProperty('display');if(settings.miniMode)preserveMiniGeometry(player);}
    else{bilibili.closeSearch();player.style.setProperty('display','none','important');DOC.getElementById(`${ID}-source-float`)?.setAttribute('hidden','');closeSkinMenu(player);const lyrics=DOC.getElementById(`${ID}-lyrics-float`);if(lyrics)lyrics.hidden=true;}
  }
  function setPublicVisible(value,{persist=true}={}){
    settings.enabled=!!value;
    applyPlayerVisibility(settings.enabled);
    if(persist)save();
    emitPublicState();
    return publicState();
  }
  function setPublicCompanionVisible(value){const dialog=DOC.getElementById(`${ID}-companion`);if(value)openCompanionDialog();else if(dialog){trackCompanionListeningTime({stop:true,saveNow:true});dialog.hidden=true;}emitPublicState();return publicState();}
  function setPublicAutoShow(value){settings.autoShow=!!value;save();emitPublicState();return publicState();}
  function setPublicMenuEnabled(value){settings.menuEnabled=EXTENSION_MODE?!!value:true;save();menu();emitPublicState();return publicState();}
  function attachPublicKeepAliveControl(container){
    if(container){
      if(keepAliveAudio.parentElement!==container)container.appendChild(keepAliveAudio);
      keepAliveAudio.hidden=false;
    }
    return publicState();
  }
  async function setPublicKeepAlive(value){
    if(value)await startKeepAlive({persist:true,notify:true});
    else stopKeepAlive({persist:true,notify:true});
    emitPublicState();
    return publicState();
  }
  async function returnPublicToKeepAlive(){
    settings.keepAlive=true;
    save();
    playbackWanted=false;
    try{audio.pause();}catch{}
    keepAliveManualTakeover=true;
    keepAliveSuspendedForTrack=false;
    keepAlivePending=false;
    keepAliveError='';
    const started=await startKeepAlive({persist:false,notify:false});
    emitPublicState();
    if(started)toast('success','已回到静音保活，播放歌曲时会自动让位');
    else if(keepAlivePending)toast('warning','请再点击一次页面，启动静音保活');
    else if(keepAliveError)toast('error',`回到保活失败：${keepAliveError}`);
    return publicState();
  }
  function setPublicAudioSessionMode(value){
    settings.audioSessionMode=value==='mix'?'mix':'priority';
    applyAudioSessionMode();
    if(settings.audioSessionMode==='mix')clearInterruptionRetry();
    const input=DOC.querySelector(`#${ID} .settings-panel [name=audioSessionMode]`);
    if(input)input.value=settings.audioSessionMode;
    save();emitPublicState();return publicState();
  }
  function resetPublicPosition(){
    settings.position={...defaults.position};
    settings.mobilePosition={...defaults.mobilePosition};
    settings.miniPosition=settings.mobileMiniPosition=settings.miniReturnPosition=null;
    settings.windowPinned=false;
    const player=DOC.getElementById(ID);
    if(player){
      player.classList.remove('pinned');
      for(const key of ['left','top','right','bottom'])player.style.removeProperty(key);
      if(isMobile())applyMobilePosition(player);
      else{
        player.style.setProperty('right',`${defaults.position.right}px`,'important');
        player.style.setProperty('bottom',`${defaults.position.bottom}px`,'important');
        player.style.setProperty('left','auto','important');
        player.style.setProperty('top','auto','important');
      }
    }
    preserveMiniGeometry(player);save();emitPublicState();return publicState();
  }
  function resetPublicWindow(){
    settings.windowSize=null;
    settings.miniRestore=settings.miniReturnPosition=null;
    settings.miniMode=false;watchMiniDock();
    settings.immersive=false;
    settings.windowPinned=false;
    settings.playerSize='m';
    const player=DOC.getElementById(ID);
    if(player){
      player.classList.remove('mini','immersive','pinned','ui-size-s','ui-size-l');
      player.classList.add('ui-size-m');
      for(const key of ['width','height','min-width','min-height','max-width','max-height'])player.style.removeProperty(key);
      applyPlayerSize(player);
      if(isMobile())applyMobilePosition(player);
    }
    save();emitPublicState();return publicState();
  }
  function bindScriptRecoveryButton(player){
    if(EXTENSION_MODE||typeof getButtonEvent!=='function'||typeof eventOn!=='function')return;
    const name='强制打开播放器';
    try{
      scriptRecoveryListener=eventOn(getButtonEvent(name),()=>{
        if(disposed)return;
        if(!player.isConnected)DOC.body.append(player);
        player.classList.remove('pointer-interacting');
        player.style.removeProperty('transform');
        setPublicVisible(true,{persist:false});
        resetPublicWindow();
        resetPublicPosition();
        const style=ROOT.getComputedStyle(player);
        if(style.display==='none')player.style.setProperty('display','block','important');
        if(style.visibility!=='visible')player.style.setProperty('visibility','visible','important');
        if(Number(style.opacity)===0)player.style.setProperty('opacity','1','important');
        menu();
      });
      if(typeof appendInexistentScriptButtons==='function')appendInexistentScriptButtons([{name,visible:false}]);
    }catch(error){console.warn('[音乐播放器] 无法注册酒馆助手恢复按钮',error);}
  }
  function resetPublicCompanionPosition(){
    settings.companionPosition=null;
    settings.companionMiniPosition=null;
    settings.companionMobilePosition=null;
    settings.companionMobileMiniPosition=null;
    const dialog=DOC.getElementById(`${ID}-companion`);
    if(dialog)defaultCompanionPosition(dialog,!!settings.companionMini);
    save();emitPublicState();return publicState();
  }
  ROOT.__SELENE_MUSIC_PLAYER__={
    getState:publicState,
    setVisible:setPublicVisible,
    setCompanionVisible:setPublicCompanionVisible,
    setAutoShow:setPublicAutoShow,
    setMenuEnabled:setPublicMenuEnabled,
    attachKeepAliveControl:attachPublicKeepAliveControl,
    setKeepAlive:setPublicKeepAlive,
    setAudioSessionMode:setPublicAudioSessionMode,
    returnToKeepAlive:returnPublicToKeepAlive,
    resetPosition:resetPublicPosition,
    resetWindow:resetPublicWindow,
    resetCompanionPosition:resetPublicCompanionPosition,
  };
  emitPublicState();
})();
