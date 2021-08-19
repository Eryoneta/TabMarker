function ID(id){
	return document.getElementById(id);
}
class Tab{
	constructor(title,color){
		this.folders=[];
		this.title=title;
		this.color=color;
	}
	addFolder(folder){
		this.folders.push(folder);
	}
}
class Folder{
	constructor(title,color,lock){
		this.items=[];
		this.title=title;
		this.color=color;
		this.lock=lock;
	}
	addItem(item){
		this.items.push(item);
	}
}
class Item{
	constructor(tab){
		this.icon=this.getFavIconURL(tab.url);
		this.pinned=tab.pinned;
		this.title=tab.title;
		this.url=tab.url;
	}
	getFavIconURL(url){
		const matches=url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
		const domain=(matches?matches[1]:null);
		return "http://www.google.com/s2/favicons?domain="+domain;
	}
}
(function(){
	ID("buttonGetLeft").addEventListener("click",function(e){
		getTabsOnLeft();
	});
	ID("buttonGetAll").addEventListener("click",function(e){
		getAllTabs();
	});
	ID("buttonGetRight").addEventListener("click",function(e){
		getTabsOnRight();
	});
	ID("buttonClear").addEventListener("click",function(e){
		clear();
	});
	chrome.storage.onChanged.addListener(function(changes,areaName){
		chrome.storage.local.get(["name","url","time"],function(itens){
			showLista();
		});
	});
	showLista();
})();
function clear(){
	chrome.storage.local.clear(function(){
		var error=chrome.runtime.lastError;
		if(error)console.error(error);
	});
}
function showLista(){
	chrome.storage.local.get("links",function(result){
		let lista=[];
		if(result["links"])lista=result["links"];
		const listaDisplay=ID("lista");
		listaDisplay.innerHTML="";
		for(let i in lista){
			const itemDisplay=document.createElement("div");
				const iconDisplay=document.createElement("img");
					iconDisplay.src=lista[i].icon;
				itemDisplay.appendChild(iconDisplay);
				const textDisplay=document.createElement("p");
					textDisplay.innerHTML=lista[i].title+" ~ "+lista[i].url;
				itemDisplay.appendChild(textDisplay);
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

function getTabsOnLeft(){
	listAllTabs(function(thisTab,allTabs){
		let tabsLista=[];
		for(let i in allTabs){
			if(allTabs[i].id==thisTab.id)break;			//TUDO ATÉ A TAB ATUAL
			tabsLista.push(new Item(allTabs[i]));
		}
		return tabsLista;
	});
}
function getAllTabs(){
	listAllTabs(function(thisTab,allTabs){
		let tabsLista=[];
		for(let i in allTabs){
			if(allTabs[i].id==thisTab.id)continue;		//TUDO EXCETO A TAB ATUAL
			tabsLista.push(new Item(allTabs[i]));
		}
		return tabsLista;
	});
}
function getTabsOnRight(){
	listAllTabs(function(thisTab,allTabs){
		let tabsLista=[];
		let add=false;
		for(let i in allTabs){
			if(add)tabsLista.push(new Item(allTabs[i]));
			if(allTabs[i].id==thisTab.id)add=true;		//TUDO ALÉM DA TAB ATUAL
		}
		return tabsLista;
	});
}
function listAllTabs(action){
	chrome.tabs.getCurrent(function(thisTab){			//TAB ATUAL
		chrome.tabs.getAllInWindow(null,function(allTabs){	//TABS DA JANELA
			updateLista(action(thisTab,allTabs));
		});
	});
}