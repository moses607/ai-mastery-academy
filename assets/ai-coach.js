// AI Coach widget — reusable sidebar chat
// - Uses window.ai if available; else uses OpenAI API via fetch()
// - Set your OpenAI API key via localStorage.setItem('OPENAI_API_KEY', 'sk-...') or window.AI_API_KEY = '...'
(function(){
	if (window.__AICOACH_INIT__) return; window.__AICOACH_INIT__ = true;
	const styles = document.createElement('style');
	styles.textContent = `
		#aicoach{position:fixed;right:18px;bottom:18px;width:340px;max-width:92vw;background:#121c2b;color:#f5fbff;border:1px solid #243550;border-radius:14px;overflow:hidden;z-index:9998;box-shadow:0 10px 30px rgba(0,0,0,.4)}
		#aicoach header{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#00e5ff,#4f46e5);color:#fff;padding:10px 12px}
		#aicoach header strong{font-size:14px}
		#aicoach .body{height:360px;display:grid;grid-template-rows:1fr auto}
		#aicoach .msgs{padding:10px;overflow:auto;display:grid;gap:8px}
		#aicoach .msg{background:#0b1320;border:1px solid #243550;border-radius:10px;padding:8px 10px;white-space:pre-wrap}
		#aicoach .msg.user{background:#0f1a2b;border-color:#2e4466}
		#aicoach .composer{display:flex;gap:8px;padding:10px;border-top:1px solid #243550}
		#aicoach input{flex:1 1 auto;padding:10px;border-radius:10px;border:1px solid #243550;background:#0a1422;color:#f5fbff}
		#aicoach button{background:#00e5ff;border:0;color:#001520;border-radius:10px;padding:10px 12px;cursor:pointer}
		#aicoach .toggle{position:fixed;right:18px;bottom:18px;background:linear-gradient(135deg,#00e5ff,#4f46e5);color:#fff;border:0;border-radius:999px;padding:12px 14px;cursor:pointer;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,.4)}
	`;
	document.head.appendChild(styles);

	const toggle = document.createElement('button');
	toggle.className = 'toggle';
	toggle.setAttribute('aria-expanded','false');
	toggle.textContent = 'AI Coach';
	document.body.appendChild(toggle);

	const box = document.createElement('div');
	box.id = 'aicoach';
	box.style.display = 'none';
	box.innerHTML = `
		<header><strong>Personal AI Coach</strong><button id="aicoach-close" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer">×</button></header>
		<div class="body">
			<div class="msgs" id="aicoach-msgs" aria-live="polite"></div>
			<div class="composer">
				<input id="aicoach-input" type="text" placeholder="Ask about the lesson, projects, or next steps"/>
				<button id="aicoach-send">Send</button>
			</div>
		</div>
	`;
	document.body.appendChild(box);

	const msgs = box.querySelector('#aicoach-msgs');
	const input = box.querySelector('#aicoach-input');
	const sendBtn = box.querySelector('#aicoach-send');
	const closeBtn = box.querySelector('#aicoach-close');

	function addMessage(text, isUser){
		const d = document.createElement('div');
		d.className = 'msg' + (isUser?' user':'');
		d.textContent = text;
		msgs.appendChild(d);
		msgs.scrollTop = msgs.scrollHeight;
	}

	async function callWindowAI(systemPrompt, userPrompt){
		try{
			if (!window.ai || !window.ai.getCompletion) return null;
			const resp = await window.ai.getCompletion({messages:[{role:'system',content:systemPrompt},{role:'user',content:userPrompt}],
				modalities:{text:true},temperature:0.7});
			return resp?.message?.content?.[0]?.text || resp?.text || '';
		}catch(err){console.warn('window.ai error', err);return null;}
	}

	async function callOpenAI(systemPrompt, userPrompt){
		const key = window.AI_API_KEY || localStorage.getItem('OPENAI_API_KEY');
		if(!key){
			return '[Setup needed] Add your OpenAI API key with localStorage.setItem(\'OPENAI_API_KEY\', \"sk-...\")';
		}
		try{
			const r = await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{
				'Content-Type':'application/json','Authorization':'Bearer '+key
			},body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:systemPrompt},{role:'user',content:userPrompt}],temperature:0.7})});
			const j = await r.json();
			return j?.choices?.[0]?.message?.content || 'No response';
		}catch(err){console.warn('OpenAI error', err);return 'Error contacting OpenAI';}
	}

	const SYSTEM = 'You are a friendly, expert AI tutor for this academy. Guide students with clear, step-by-step help, focus on projects, and reference the course context when possible. Keep answers concise and actionable.';

	async function handleSend(){
		const text = (input.value||'').trim();
		if(!text) return;
		input.value='';
		addMessage(text, true);
		addMessage('Thinking…', false);
		const typingEl = msgs.lastChild;
		let out = await callWindowAI(SYSTEM, text);
		if(!out){ out = await callOpenAI(SYSTEM, text); }
		typingEl.textContent = out;
	}

	sendBtn.addEventListener('click', handleSend);
	input.addEventListener('keydown', e=>{ if(e.key==='Enter') handleSend(); });
	closeBtn.addEventListener('click', ()=>{ box.style.display='none'; toggle.style.display='block'; toggle.setAttribute('aria-expanded','false'); });
	toggle.addEventListener('click', ()=>{ const open = box.style.display!=='none'; box.style.display = open?'none':'block'; toggle.setAttribute('aria-expanded', String(!open)); if(!open) input.focus(); });

	// Greet users on load with a helpful starter message
	setTimeout(()=>{
		addMessage('Hi! I\'m your AI Coach. Ask me anything about the course, projects, or building your portfolio.', false);
	}, 400);
})();