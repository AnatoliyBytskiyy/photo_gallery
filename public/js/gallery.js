$(function() {
	let img_wrap = $('#gallery');
	let x = 0;
	let y = 0;
	let documentHeight = Math.max(
		document.body.scrollHeight, document.documentElement.scrollHeight,
		document.body.offsetHeight, document.documentElement.offsetHeight,
		document.body.clientHeight, document.documentElement.clientHeight
	);

	let response = fetch("http://localhost:3000/get_photo", {
        method: "GET",
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
    }).then((response) => {
	    return response.json();
	}).then((data) => {
		$.each(data, function(index,value) {
			var img = $('<img />',
					            { 	
					            	id: 'img' + index,
					            	src: value,
					            	class: 'frame',
					            	width: '300px',
					            	height: '200px'
					            });

			var polaroid = $('<div />',
								{
									id: "polaroid_" + index,
									class: 'polaroid'
								}).appendTo($('#gallery'));

			let point = coordinates(img.width(), img.height());

			polaroid.css({ 'top': point[1], 'left': point[0] });

			img.appendTo($('#polaroid_' + index));
		});

		animationPhoto();
	});

	function coordinates(w, h){
		let x = Math.floor(Math.random() * $('body').width());
		if((x + w + 100) > $('body').width()){
			x -= w + 100;
		}	

		let y = Math.floor(Math.random() * documentHeight);
		if((y + h + 100) > documentHeight){
			y -= h + 100;
		}

		let res = new Array();
		res.push(x, y);
				
		return res;
	}

	function animationPhoto(){
		let items = $(".polaroid");
		let itemsLen = $(".polaroid").length;
		let i = Math.floor(Math.random() * itemsLen);
		let polaroid_id = '#' + items[i].id;
		let img_id = polaroid_id.split('_');
		img_id = "#img" + img_id[1];
		let interval = 3000;

		$(polaroid_id).hide(interval);

		setTimeout(function() {
			let point = coordinates($(img_id).width(), $(img_id).height());

			let itemsZindex = new Array();
			for(let i=0; i<itemsLen; i++){
				let zIndex = $('#polaroid_' + i).css('z-index');
				if(zIndex == 'auto'){zIndex = 0;}
				itemsZindex.push(zIndex);
			}
			let maxZindex = Math.max.apply( null, itemsZindex );
			maxZindex++;

			$(polaroid_id).css({'z-index': maxZindex, 'top': point[1], 'left': point[0]}); 
            $(polaroid_id).show(interval);
        }, interval*2);

		setTimeout(function() {
           	animationPhoto();
       	}, interval*5);
	}
});