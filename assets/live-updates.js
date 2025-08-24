// Live Updates widget — fetches JSON and renders a lightweight feed
(function(){
	async function load(){
		const el = document.getElementById('live-updates');
		if(!el) return;
		el.innerHTML = '<div style="color:#b7c7d9">Loading updates…</div>';
		try{
			const res = await fetch('assets/updates.json', {cache:'no-store'});
			const data = await res.json();
			const items = Array.isArray(data)?data: (data.items||[]);
			el.innerHTML = items.map(it=>{
				const typeColor = it.type==='release'?'#00e5ff': it.type==='event'?'#4f46e5':'#9ca3af';
				return `
					<div style="display:flex;gap:10px;align-items:flex-start;padding:10px;background:#121c2b;border:1px solid #243550;border-radius:12px;margin:8px 0">
						<span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:999px;background:${typeColor}">🔔</span>
						<div>
							<div style="font-weight:700">${it.title||'Update'}</div>
							<div style="color:#b7c7d9">${it.summary||''}</div>
							${it.link? `<a href="${it.link}" style="color:#a5b4fc;text-decoration:underline" target="_blank" rel="noopener">Learn more</a>`:''}
							<div style="font-size:12px;color:#94a3b8;margin-top:4px">${it.date||''}</div>
						</div>
					</div>`;
			}).join('');
		}catch(e){
			el.innerHTML = '<div style="color:#ef4444">Failed to load updates.</div>';
		}
	}
	document.addEventListener('DOMContentLoaded', load);
})();