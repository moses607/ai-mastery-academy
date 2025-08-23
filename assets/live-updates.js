(function(){
	// Live Updates widget — fetches assets/updates.json and renders in #live-updates
	async function fetchUpdates(){
		try{
			const res=await fetch('assets/updates.json',{cache:'no-store'});
			if(!res.ok) throw new Error('Failed to load updates');
			return await res.json();
		}catch(err){
			// Fallback sample content if fetch fails
			return [
				{ id:'fallback-1', date:new Date().toISOString().slice(0,10), type:'tip', title:'Welcome to Live Updates', summary:'Edit assets/updates.json to publish updates.', link:'#' }
			];
		}
	}

	function typeToColor(type){
		switch(type){
			case 'release': return '#22c55e';
			case 'event': return '#f59e0b';
			case 'tip': return '#60a5fa';
			default: return '#a78bfa';
		}
	}

	function render(container, updates){
		if(!container) return;
		const list=document.createElement('div');
		list.style.display='grid';
		list.style.gap='10px';

		updates.forEach(u=>{
			const item=document.createElement('a');
			item.href=u.link||'#';
			item.style.display='grid';
			item.style.gap='6px';
			item.style.padding='12px';
			item.style.border='1px solid var(--border)';
			item.style.borderRadius='12px';
			item.style.background='var(--card)';
			item.setAttribute('aria-label',u.title);

			const row=document.createElement('div');
			row.style.display='flex';
			row.style.justifyContent='space-between';
			row.style.alignItems='center';

			const badge=document.createElement('span');
			badge.textContent=(u.type||'update').toUpperCase();
			badge.style.fontSize='12px';
			badge.style.fontWeight='700';
			badge.style.color='#0b1320';
			badge.style.background=typeToColor(u.type);
			badge.style.padding='4px 8px';
			badge.style.borderRadius='999px';

			const date=document.createElement('span');
			date.textContent=u.date||'';
			date.style.color='var(--muted)';
			date.style.fontSize='12px';

			row.appendChild(badge);
			row.appendChild(date);

			const title=document.createElement('div');
			title.textContent=u.title;
			title.style.fontWeight='700';

			const summary=document.createElement('div');
			summary.textContent=u.summary;
			summary.style.color='var(--muted)';
			summary.style.fontSize='14px';

			item.appendChild(row);
			item.appendChild(title);
			item.appendChild(summary);
			list.appendChild(item);
		});

		container.innerHTML='';
		container.appendChild(list);
	}

	async function init(){
		const container=document.getElementById('live-updates');
		if(!container) return;
		const updates=await fetchUpdates();
		render(container, updates);
	}

	document.addEventListener('DOMContentLoaded', init);
})();