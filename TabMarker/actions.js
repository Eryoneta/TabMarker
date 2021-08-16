function ID(id){
	return document.getElementById(id);
}
class Link{
	constructor(pinned,icon,name,url,time){
		this.pinned=pinned;
		this.icon=icon;
		this.name=name;
		this.url=url;
		this.time=time;
	}
	function 
}
(function(){
	ID("buttonGetLeft").addEventListener("mousedown",function(e){
		getLeft();
	});
	ID("buttonGetAll").addEventListener("mousedown",function(e){
		getAll();
	});
	ID("buttonGetRight").addEventListener("mousedown",function(e){
		getRight();
	});
	ID("lista").addEventListener("mousedown",function(e){
		showLista();
	});
	chrome.storage.onChanged.addListener(function(changes,areaName){
		chrome.storage.local.get(["name","url","time"],function(itens){
			showLista();
		});
	});
	
				chrome.storage.local.clear(function(){
					var error=chrome.runtime.lastError;
					if(error)console.error(error);
				});
	
	let teste=[{tes:"teste1"},{tes:"teste2"}];
	chrome.storage.local.set({"teste":teste},function(){
		// alert(teste);
	});
	chrome.storage.local.get("teste",function(result){
		let testeR=[];
		if(result)testeR=result["teste"];
		// alert(result["teste"][0].tes);
	});
	
})();
function showLista(){
	chrome.storage.local.get("links",function(result){
		let lista=[];
		if(result["links"])lista=result["links"];
		const listaDisplay=ID("lista");
		listaDisplay.innerHTML="";
		for(let i in lista){
			const itemDisplay=document.createElement("p");
			itemDisplay.innerHTML=lista[i].name+" ~ "+lista[i].url+" ~ "+lista[i].time;
			listaDisplay.appendChild(itemDisplay);
		}
	});
}
function updateLista(itens){
	chrome.storage.local.get("links",function(result){
		let lista=[];
		if(result["links"])lista=result["links"];
		lista=lista.concat(itens);
		chrome.storage.local.set({links:lista},null);
	});
}
function getLeft(){
	chrome.tabs.getSelected(null,function(thisTab){			//TAB ATUAL
		chrome.tabs.getAllInWindow(null,function(allTabs){	//TABS DA JANELA
			let addToLista=[];
			for(let i in allTabs){
				if(allTabs[i].id==thisTab.id)break;			//SEGUE ATÉ A TAB ATUAL
				const now=new Date();
				addToLista.push({
					name:allTabs[i].title,
					url:allTabs[i].url,
					time:now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()
				});
			}
			updateLista(addToLista);
		});
	});
}
function getAll(){
	chrome.tabs.getSelected(null,function(thisTab){			//TAB ATUAL
		chrome.tabs.getAllInWindow(null,function(allTabs){	//TABS DA JANELA
			let addToLista=[];
			for(let i in allTabs){
				if(allTabs[i].id==thisTab.id)continue;		//PULA A TAB ATUAL
				const now=new Date();
				addToLista.push({
					name:allTabs[i].title,
					url:allTabs[i].url,
					time:now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()
				});
			}
			updateLista(addToLista);
		});
	});
}
function getRight(){
	chrome.tabs.getSelected(null,function(thisTab){			//TAB ATUAL
		chrome.tabs.getAllInWindow(null,function(allTabs){	//TABS DA JANELA
			let addToLista=[];
			let add=false;
			for(let i in allTabs){
				if(add){
					const now=new Date();
					addToLista.push({
						name:allTabs[i].title,
						url:allTabs[i].url,
						time:now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()
					});
				}
				if(allTabs[i].id==thisTab.id)add=true;		//COMEÇA NA TAB ATUAL
			}
			updateLista(addToLista);
		});
	});
}