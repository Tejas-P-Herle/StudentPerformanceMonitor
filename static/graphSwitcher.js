class GraphSwitcher {
	constructor(graphObj='graphDiv', index='1') {
		this.graphObj = graphObj;
		this.btnClass = '.btnClass' + index;
		this.dotClass = '.dotClass' + index;
		this.graphCont = '#graphCont' + index;
		this.cardTitle = '#card-title' + index;
		this.cardText = '#card-text' + index;
	}
	setup() {
		this.curr = this.currList[0];
		this.setGraph(0);
		this.centerBtns();
	}
	
	centerBtns() {
		let graph = $(this.graphCont);
		try { $(this.btnClass).css('top', graph.position().top + (graph.height() / 2)); }
		catch(e) { console.log(e); return -1; }
	}

	plusGraph(num) {
		let index = this.currList.indexOf(this.curr) + num;
		this.changeDot(index);
		this.showGraph(index);
	}
	changeDot(dotNo) {
		let dots = $('.dot' + this.dotClass);
		for (let i=0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(' active', '');
		}
		dots[dotNo].className += ' active';
	}
	showGraph(graphNo) {
		this.graphFuncs[graphNo](this.graphObj);
		this.curr = this.currList[graphNo];
		let index = this.currList.indexOf(this.curr);
		$(this.cardTitle).text(this.currTitleList[index]);
		$(this.cardText).text(this.currTextList[index]);
		if (index + 1 == this.graphFuncs.length) { $('.graphBtn.next' + this.btnClass).show().hide(); }
		if (index > 0) { $('.graphBtn.previous' + this.btnClass).show(); }
		if (index == 0) { $('.graphBtn.previous' + this.btnClass).hide(); }
		if (index < this.graphFuncs.length - 1) { $('.graphBtn.next' + this.btnClass).show(); }
		let graphEntity = (this.graphObj == 'graphDiv') ? 'graphEntity1' : 'graphEntity2';
	}
	setGraph(graphNo) {
		this.changeDot(graphNo);
		this.showGraph(graphNo);
	}

	replot() {
		this.graphFuncs[this.currList.indexOf(this.curr)](this.graphObj);
	}
}