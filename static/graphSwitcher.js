class GraphSwitcher {
	constructor() {
		this.centerBtns();
	}
	setup() {
		this.curr = this.currList[0];
		this.setGraph(0);
	}
	
	centerBtns() {
		let graph = $('#graphDiv');
		try { $('.graphBtn').css('top', graph.position().top + (graph.height() / 2)); }
		finally { return -1; }
	}
	plusGraph(num) {
		let index = this.currList.indexOf(this.curr) + num;
		this.changeDot(index);
		this.showGraph(index);
	}
	changeDot(dotNo) {
		let dots = $('.dot');
		for (let i=0; i < dots.length; i++) {
			dots[i].className = dots[i].className.replace(' active', '');
		}
		dots[dotNo].className += ' active';
	}
	showGraph(graphNo) {
		this.graphFuncs[graphNo]();
		this.curr = this.currList[graphNo];
		let index = this.currList.indexOf(this.curr);
		if (index + 1 == this.graphFuncs.length) { $('#next').hide(); }
		if (index > 0) { $('#previous').show(); }
		if (index == 0) { $('#previous').hide(); }
		if (index < this.graphFuncs.length - 1) { $('#next').show(); }
	}
	setGraph(graphNo) {
		this.changeDot(graphNo);
		this.showGraph(graphNo);
	}
	replot() {
		this.graphFuncs[this.currList.indexOf(this.curr)]();
	}
}