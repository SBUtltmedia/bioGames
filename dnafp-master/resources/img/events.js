    $(document).keydown(function (objEvent) {
        if (objEvent.keyCode == 9 || (objEvent.keyCode == 8 && $(':focus').size()===0)) { //tab pressed or backspace with no text focus
        console.log("hit key") 
	    objEvent.preventDefault(); // stops its action
        }
    });
