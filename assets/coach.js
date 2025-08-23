(function(){
	// AI Coach Widget — lightweight floating chat
	const STORAGE_KEY='AMA_OPENAI_API_KEY';

	function ensureStyles(){
		if(document.getElementById('coach-styles')) return;
		const s=document.createElement('style'); s.id='coach-styles';
		s.textContent=`
			#coach-toggle{position:fixed;right:16px;bottom:16px;z-index:9998}
			#coach-panel{position:fixed;right:16px;bottom:72px;width:min(360px,92vw);background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;display:none;z-index:9999}
			#coach-panel header{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:linear-gradient(135deg,var(--brand),var(--brand2));color:#fff}
			#coach-messages{height:300px;overflow:auto;padding:10px;display:grid;gap:8px}
			.coach-msg{padding:8px 10px;border-radius:10px}
			.coach-user{background:#0a1422;border:1px solid var(--border)}
			.coach-bot{background:#0e1a2b;border:1px solid var(--border)}
			#coach-input{display:flex;gap:8px;padding:10px;border-top:1px solid var(--border)}
			#coach-input input{flex:1;padding:10px;border-radius:10px;border:1px solid var(--border);background:#0a1422;color:var(--text)}
		`;
		document.head.appendChild(s);
	}

	function ui(){
		ensureStyles();
		const toggle=document.createElement('button');
		toggle.id='coach-toggle'; toggle.className='btn'; toggle.textContent='AI Coach';
		const panel=document.createElement('div'); panel.id='coach-panel';
		panel.innerHTML=`
			<header><strong>Personal AI Coach</strong><button id="coach-close" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer">×</button></header>
			<div id="coach-messages" role="log" aria-live="polite"></div>
			<div id="coach-input"><input id="coach-text" type="text" placeholder="Ask about lessons, projects, careers..."><button id="coach-send" class="btn">Send</button></div>
		`;
		document.body.appendChild(toggle); document.body.appendChild(panel);
			document.getElementById('coach-close').onclick=()=>{panel.style.display='none'};
			toggle.onclick=()=>{panel.style.display=panel.style.display==='none'||!panel.style.display? 'block' : 'none'};
		return {panel};
	}

	function say(text, who){
		const box=document.createElement('div'); box.className='coach-msg '+(who==='user'?'coach-user':'coach-bot'); box.textContent=text;
		document.getElementById('coach-messages').appendChild(box);
		box.scrollIntoView({behavior:'smooth',block:'end'});
	}

	function systemPrompt(){
		return (
			"You are a friendly, expert AI tutor for AI Mastery Academy. " +
			"Guide learners through courses, suggest portfolio projects, and give concise, step-by-step help. " +
			"Always ask a clarifying question if the goal is ambiguous."
		);
	}

	async function callWindowAI(prompt){
		try{
			if(window.ai && window.ai.generateText){
				const res=await window.ai.generateText({text: prompt});
				return res.text || '...';
			}
		}catch(e){/* ignore */}
		throw new Error('window.ai not available');
	}

	async function callOpenAI(prompt){
		const key=localStorage.getItem(STORAGE_KEY);
		if(!key) throw new Error('Missing API key');
		const body={
			model:'gpt-4o-mini',
			messages:[
				{role:'system', content: systemPrompt()},
				{role:'user', content: prompt}
			]
		};
		const res=await fetch('https://api.openai.com/v1/chat/completions',{
			method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key}, body: JSON.stringify(body)
		});
		if(!res.ok) throw new Error('OpenAI error');
		const data=await res.json();
		return data.choices?.[0]?.message?.content?.trim() || '...';
	}

	function mock(prompt){
		// Safe offline fallback for demo
		return (
			"Here’s your next step: 1) Watch the intro, 2) Build a mini-project, 3) Share on GitHub. " +
			"Tip: Use the Portfolio-Builder tasks to ensure you have a showcase-ready result."
		);
	}

	function ensureKeyCTA(){
		if(localStorage.getItem(STORAGE_KEY)) return null;
		const note=document.createElement('div');
		note.style.padding='8px 10px'; note.style.borderTop='1px solid var(--border)'; note.style.fontSize='12px'; note.style.color='var(--muted)';
		note.innerHTML='Add your OpenAI key with: <code>localStorage.setItem(\'AMA_OPENAI_API_KEY\', \'sk-...\')</code>'; 
		return note;
	}

	function attachHandlers(){
		const send=document.getElementById('coach-send');
		const input=document.getElementById('coach-text');
		const panel=document.getElementById('coach-panel');
		const cta=ensureKeyCTA(); if(cta) panel.appendChild(cta);
		say('Hi! I’m your personal AI coach. What are you working on today?','bot');
		send.onclick=async ()=>{
			const text=input.value.trim(); if(!text) return; input.value=''; say(text,'user');
			let reply='';
			try{
				reply=await callWindowAI(text);
			}catch(_){
				try{ reply=await callOpenAI(text);}catch(_){ reply=mock(text);} 
			}
			say(reply,'bot');
		};
	}

	document.addEventListener('DOMContentLoaded',()=>{ ui(); attachHandlers(); });
})();