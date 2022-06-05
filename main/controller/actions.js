function ID(id){
	return document.getElementById(id);
}
class MarkBook{
	constructor(){
		this.tabs=[];
	}
	static addTab(markBook,tab){
		markBook.tabs.push(tab);
	}
	static getDisplay(markBook){
		const display=document.createElement("div");
		//TABS
			for(let t in markBook.tabs){
				const tab=markBook.tabs[t];
				display.appendChild(Tab.getDisplay(tab));
			}
		return display;
	}
}
class Tab{
	constructor(parent,title,color){
		this.parent=parent;
		this.folders=[];
		this.title=title;
		this.color=color;
	}
	static addFolder(tab,folder){
		tab.folders.push(folder);
	}
	static getDisplay(tab){
		const display=document.createElement("div");
		//TITULO
			const titleDisplay=document.createElement("p");
				titleDisplay.innerHTML=tab.title;
			display.appendChild(titleDisplay);
		//FOLDERS
			for(let f in tab.folders){
				const folder=tab.folders[f];
				display.appendChild(Folder.getDisplay(folder));
			}
		return display;
	}
}
class Folder{
	constructor(parent,title,color,lock){
		alert(parent);
		this.parent=parent;
		this.items=[];
		this.title=title;
		this.color=color;
		this.lock=lock;
	}
	static addItem(folder,item){
		folder.items.push(item);
	}
	static addItems(folder,items){
		alert(folder.items.length+" + "+items.length);
		folder.items=folder.items.concat(items);
	}
	static getDisplay(folder){
		
		alert(folder.title);
		alert(folder.parent);	//???
		
		const display=document.createElement("div");
		//TITULO
			const titleDisplay=document.createElement("p");
				titleDisplay.innerHTML=folder.title;
			display.appendChild(titleDisplay);
		//BARRA
			const barraDisplay=document.createElement("div");
			//ESQUERDA
				const barraLeftDisplay=document.createElement("div");
				//CAPTURADOR LEFT
					const captureLeftDisplay=document.createElement("button");
						captureLeftDisplay.innerHTML="Left";
						captureLeftDisplay.addEventListener("click",function(e){
							getTabsOnLeft(folder);
						});
					barraLeftDisplay.appendChild(captureLeftDisplay);
				//CAPTURADOR ALL
					const captureAllDisplay=document.createElement("button");
						captureAllDisplay.innerHTML="All";
						captureAllDisplay.addEventListener("click",function(e){
							getAllTabs(folder);
						});
					barraLeftDisplay.appendChild(captureAllDisplay);
				//CAPTURADOR RIGHT
					const captureRightDisplay=document.createElement("button");
						captureRightDisplay.innerHTML="Right";
						captureRightDisplay.addEventListener("click",function(e){
							getTabsOnRight(folder);
						});
					barraLeftDisplay.appendChild(captureRightDisplay);
				//CAPTURADOR LEFTX
					const captureLeftXDisplay=document.createElement("button");
						captureLeftXDisplay.innerHTML="LeftX";
						captureLeftXDisplay.addEventListener("click",function(e){
							
						});
					barraLeftDisplay.appendChild(captureLeftXDisplay);
				//CAPTURADOR ALLX
					const captureAllXDisplay=document.createElement("button");
						captureAllXDisplay.innerHTML="AllX";
						captureAllXDisplay.addEventListener("click",function(e){
							
						});
					barraLeftDisplay.appendChild(captureAllXDisplay);
				//CAPTURADOR RIGHTX
					const captureRightXDisplay=document.createElement("button");
						captureRightXDisplay.innerHTML="RightX";
						captureRightXDisplay.addEventListener("click",function(e){
							
						});
					barraLeftDisplay.appendChild(captureRightXDisplay);
				barraDisplay.appendChild(barraLeftDisplay);
			//DIREITA
				const barraRightDisplay=document.createElement("div");
				//BOT�O ALL
					const releaseAllDisplay=document.createElement("button");
						releaseAllDisplay.innerHTML="Release";
						releaseAllDisplay.addEventListener("click",function(e){
							
						});
					barraRightDisplay.appendChild(releaseAllDisplay);
				//BOT�O ALLX
					const releaseAllXDisplay=document.createElement("button");
						releaseAllXDisplay.innerHTML="AllX";
						releaseAllXDisplay.addEventListener("click",function(e){
							
						});
					barraRightDisplay.appendChild(releaseAllXDisplay);
				barraDisplay.appendChild(barraRightDisplay);
			display.appendChild(barraDisplay);
		//ITEMS
			for(let i in folder.items){
				const item=folder.items[i];
				display.appendChild(Item.getDisplay(item));
			}
		return display;
	}
}
class Item{
	constructor(parent,tab){
		this.parent=parent;
		this.icon=Item.getFavIconURL(tab.url);
		this.pinned=tab.pinned;
		this.title=tab.title;
		this.url=tab.url;
	}
	static getFavIconURL(url){
		const matches=url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
		const domain=(matches?matches[1]:null);
		return "http://www.google.com/s2/favicons?domain="+domain;
	}
	static getDisplay(item){
		const display=document.createElement("div");
		//ICONE
			const iconDisplay=document.createElement("img");
				iconDisplay.src=item.icon;
			display.appendChild(iconDisplay);
		//TEXTO
			const textDisplay=document.createElement("p");
				textDisplay.innerHTML=item.title+" ~ "+item.url;
			display.appendChild(textDisplay);
		return display;
	}
}
const key="markBookKey";
(function(){
	clear();
	init();
	chrome.storage.onChanged.addListener(function(changes,areaName){
		showDisplay();
	});
	showDisplay();
})();
function init(){
	const markBook=new MarkBook();
	const tab=new Tab(markBook,"TesteTab",null);
		const folder=new Folder(tab,"TesteFolder",null,false);
		Tab.addFolder(tab,folder);
	MarkBook.addTab(markBook,tab);
	chrome.storage.local.set({
		markBookKey:markBook
	},null);
}
function showDisplay(){
	chrome.storage.local.get(key,function(result){
		let markBook=new MarkBook();
		if(result[key])markBook=result[key];
		// alert(markBook.tabs[0].folders[0].items.length);
		const rootDisplay=ID("root");
		rootDisplay.innerHTML="";
		rootDisplay.appendChild(MarkBook.getDisplay(markBook));
	});
}
function save(markBook){
	chrome.storage.local.set({
		markBookKey:markBook
	},null);
}
function clear(){
	chrome.storage.local.clear(function(){
		var error=chrome.runtime.lastError;
		if(error)console.error(error);
	});
}
function getTabsOnLeft(folder){
	listAllTabs(function(thisTab,allTabs){
		let tabsLista=[];
		for(let i in allTabs){
			if(allTabs[i].id==thisTab.id)break;			//TUDO AT� A TAB ATUAL
			tabsLista.push(new Item(folder,allTabs[i]));
		}
		return tabsLista;
	},folder);
}
function getAllTabs(folder){
	listAllTabs(function(thisTab,allTabs){
		let tabsLista=[];
		for(let i in allTabs){
			if(allTabs[i].id==thisTab.id)continue;		//TUDO EXCETO A TAB ATUAL
			tabsLista.push(new Item(folder,allTabs[i]));
		}
		return tabsLista;
	},folder);
}
function getTabsOnRight(folder){
	listAllTabs(function(thisTab,allTabs){
		let tabsLista=[];
		let add=false;
		for(let i in allTabs){
			if(add)tabsLista.push(new Item(folder,allTabs[i]));
			if(allTabs[i].id==thisTab.id)add=true;		//TUDO AL�M DA TAB ATUAL
		}
		return tabsLista;
	},folder);
}
function listAllTabs(action,folder){
	chrome.tabs.getCurrent(function(thisTab){			//TAB ATUAL
		chrome.tabs.getAllInWindow(null,function(allTabs){	//TABS DA JANELA
			const items=action(thisTab,allTabs);
			Folder.addItems(folder,items);
			// save(folder.parent.parent);
			showDisplay();
		});
	});
}